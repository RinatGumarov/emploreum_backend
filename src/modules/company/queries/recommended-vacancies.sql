SELECT vacancies.*
FROM (
       SELECT
         v_skill_array.v_id,
         count(
             SELECT *
             FROM unnest(string_to_array(:skillsString, ',') :: INT [])
             EXCEPT
             SELECT *
             FROM unnest(v_skill_array.s_array)
         ) AS equal_skills_count,
         count(SELECT *
               FROM unnest(v_skill_array.s_array)
         ) AS all_skill_count
       FROM (
              SELECT
                vacancies.id         AS v_id,
                array_agg(skills.id) AS s_array
              FROM vacancies
                JOIN vacancy_profile_skills ON vacancies.id = vacancy_profile_skills.vacancy_id
                JOIN profile_skills ON vacancy_profile_skills.profile_skill_id = profile_skills.id
                JOIN skills ON skills.id = profile_skills.skill_id
              GROUP BY v_id
            ) AS v_skill_array
       GROUP BY v_skill_array.v_id
     )
  AS array_skill_equal_count
  JOIN vacancies ON vacancies.id = array_skill_equal_count.v_id
WHERE array_skill_equal_count.equal_skills_count * 100 / array_skill_equal_count.all_skill_count > 70
