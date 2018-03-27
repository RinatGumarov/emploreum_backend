SELECT *
FROM (SELECT employees.id
      FROM employees
        LEFT JOIN cvs ON employees.id = cvs.employee_id
        LEFT JOIN cv_skills ON cvs.id = cv_skills.cv_id
        LEFT JOIN skills ON skills.id = cv_skills.skill_id
        LEFT JOIN profiles ON profiles.id = cvs.profile_id
        LEFT JOIN users ON employees.user_id = users.id
        LEFT JOIN user_languages ON users.id = user_languages.user_id
        :whereQuery
      GROUP BY employees.id) AS em
  INNER JOIN employees ON em.id = employees.id