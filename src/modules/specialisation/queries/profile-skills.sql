SELECT
  profile_skills.id,
  profile_skills.profile_id as "profileId",
  profile_skills.skill_id as "skillId",
  CONCAT(s2.name, '(', p.name, ')') as "name"
FROM profile_skills
  LEFT JOIN profiles p ON profile_skills.profile_id = p.id
  LEFT JOIN skills s2 ON profile_skills.skill_id = s2.id
