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
  "works"."id"             AS "works.id",
  "works->company"."id"    AS "works.company.id",
  "works->company"."name"  AS "works.company.name",
  "works->vacancy"."id"    AS "works.vacancy.id",
  "works->vacancy"."name"  AS "works.vacancy.name"
FROM "employees" AS "employees"
  LEFT OUTER JOIN "cvs" AS "cvs" ON "employees"."id" = "cvs"."employee_id"
  LEFT OUTER JOIN "profiles" AS "cvs->profile" ON "cvs"."profile_id" = "cvs->profile"."id"
  LEFT OUTER JOIN ("cv_skills" AS "cvs->skills->cv_skills" INNER JOIN "skills" AS "cvs->skills"
      ON "cvs->skills"."id" = "cvs->skills->cv_skills"."skill_id") ON "cvs"."id" = "cvs->skills->cv_skills"."cv_id"
  LEFT OUTER JOIN "works" AS "works" ON "employees"."id" = "works"."employee_id"
  LEFT OUTER JOIN "companies" AS "works->company" ON "works"."company_id" = "works->company"."id"
  LEFT OUTER JOIN "vacancies" AS "works->vacancy" ON "works"."vacancy_id" = "works->vacancy"."id"
  LEFT OUTER JOIN "users" AS "employees->user" ON "employees"."user_id" = "employees->user"."ID"
  :whereQuery