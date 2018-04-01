SELECT
  "employees"."id",
  "employees"."user_id"    AS "userId",
  "employees"."name",
  "employees"."about",
  "employees"."surname",
  "employees"."photo_path" AS "photoPath",
  "employees"."city",
  "employees"."birthday",
  "cvs"."id"               AS "cvs.id",
  "cvs->profile"."id"      AS "cvs.profile.id",
  "cvs->profile"."name"    AS "cvs.profile.name",
  "cvs->skills"."id"       AS "cvs.skills.id",
  "cvs->skills"."name"     AS "cvs.skills.name",
  "user"."created_at"      AS "user.createdAt"
FROM "employees" AS "employees"
  LEFT OUTER JOIN "cvs" AS "cvs" ON "employees"."id" = "cvs"."employee_id"
  LEFT OUTER JOIN "profiles" AS "cvs->profile" ON "cvs"."profile_id" = "cvs->profile"."id"
  LEFT OUTER JOIN ("cv_skills" AS "cvs->skills->cv_skills" INNER JOIN "skills" AS "cvs->skills"
      ON "cvs->skills"."id" = "cvs->skills->cv_skills"."skill_id") ON "cvs"."id" = "cvs->skills->cv_skills"."cv_id"
  LEFT OUTER JOIN
  ("profile_skills" AS "cvs->skills->profiles->profileSkills" INNER JOIN "profiles" AS "cvs->skills->profiles"
      ON "cvs->skills->profiles"."id" = "cvs->skills->profiles->profileSkills"."profile_id")
    ON "cvs->skills"."id" = "cvs->skills->profiles->profileSkills"."skill_id"
  LEFT OUTER JOIN "users" AS "user" ON "employees"."user_id" = "user"."id"
  LEFT OUTER JOIN ("user_languages" AS "user->languages->user_languages" INNER JOIN "languages" AS "user->languages"
      ON "user->languages"."id" = "user->languages->user_languages"."language_id")
    ON "user"."id" = "user->languages->user_languages"."user_id"
  :whereQuery