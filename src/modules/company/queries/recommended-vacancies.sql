SELECT vacancies.*
FROM (SELECT
        v_skill_array.v_id,
        v_skill_array.count_skills,
        count(excepted_array.unnest) AS count_merged_skill_from_vacancy
      FROM
        (SELECT
           vacancies.id         AS v_id,
           array_agg(skills.id) AS s_array,
           count(skills.id)     AS count_skills
         FROM vacancies
           JOIN vacancy_profile_skills ON vacancies.id = vacancy_profile_skills.vacancy_id
           JOIN profile_skills
             ON vacancy_profile_skills.profile_skill_id = profile_skills.id AND profile_skills.profile_id = :profileId
           JOIN skills ON skills.id = profile_skills.skill_id
         GROUP BY v_id) AS v_skill_array
        JOIN (
               SELECT *
               FROM unnest(string_to_array(:skillsString, ',') :: INT [])
             ) AS excepted_array ON excepted_array.unnest = ANY (v_skill_array.s_array :: INT [])
      GROUP BY v_skill_array.v_id, v_skill_array.s_array, v_skill_array.count_skills) AS employ_vac_accept
  JOIN vacancies ON vacancies.id = employ_vac_accept.v_id
WHERE employ_vac_accept.count_merged_skill_from_vacancy * 100 / employ_vac_accept.count_skills > 70