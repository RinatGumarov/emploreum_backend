SELECT
  "profiles"."id",
  "profiles"."name",
  "skills"."id"         AS "skills.id",
  "skills"."name"       AS "skills.name",
  "skills"."photo_path" AS "skills.photoPath",
  "skills"."parent_id"  AS "skills.parentId"
FROM profiles
  INNER JOIN profile_skills ON profiles.id = profile_skills.profile_id
  INNER JOIN vacancy_profile_skills v ON profile_skills.id = v.profile_skill_id AND v.vacancy_id = :vacancyId
  LEFT JOIN skills ON profile_skills.skill_id = skills.id
