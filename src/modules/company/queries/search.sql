SELECT vacancies
FROM (SELECT vacancies.id
      FROM vacancies
        LEFT JOIN vacancy_profile_skills ON vacancies.id = vacancy_profile_skills.vacancy_id
        LEFT JOIN profile_skills ON vacancy_profile_skills.profile_skill_id = profile_skills.id
        LEFT JOIN skills ON profile_skills.skill_id = skills.id
        LEFT JOIN profiles ON profile_skills.profile_id = profiles.id
        LEFT JOIN companies ON vacancies.company_id = companies.ID
        LEFT JOIN users ON companies.user_id = users.id
        LEFT JOIN user_languages ON users.id = user_languages.user_id
      WHERE vacancies.opened = TRUE
      :whereQuery
      GROUP BY vacancies.id
     ) AS vac INNER JOIN vacancies ON vac.id = vacancies.id
