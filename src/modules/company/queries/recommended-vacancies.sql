SELECT vacancies.*
FROM (SELECT
        vac_skill_array.v_id,
        vac_skill_array.count_skills,
        count(excepted_skills_array.employee_skills) AS count_merged_skill_from_vacancy
      FROM (
             SELECT
               vacancies.id                         AS v_id,
               array_agg(profile_skills.skill_id)   AS skills_array,
               array_agg(profile_skills.profile_id) AS profile_array,
               count(profile_skills.skill_id)       AS count_skills
             FROM vacancies
               JOIN vacancy_profile_skills ON vacancies.id = vacancy_profile_skills.vacancy_id
               JOIN profile_skills
                 ON vacancy_profile_skills.profile_skill_id = profile_skills.id
             GROUP BY v_id
           ) AS vac_skill_array
        JOIN (
               SELECT
                 employee_skills
               FROM unnest(string_to_array(:skillsString, ',') :: INT []) AS employee_skills
             ) AS excepted_skills_array
          ON excepted_skills_array.employee_skills = ANY (vac_skill_array.skills_array :: INT [])
      GROUP BY
        vac_skill_array.v_id,
        vac_skill_array.count_skills
     ) AS employ_vac_accept
  JOIN vacancies ON vacancies.id = employ_vac_accept.v_id
WHERE employ_vac_accept.count_merged_skill_from_vacancy * 100 / employ_vac_accept.count_skills > 70