SELECT
  chats.id,
  chats.status
FROM
  (SELECT
     chats.*,
     array_agg(u.id) AS chat_users
   FROM chats
     INNER JOIN user_chats ON chats.id = user_chats.chat_id
     INNER JOIN users u ON user_chats.user_id = u.id
   GROUP BY chats.id) AS chats
WHERE chats.chat_users = string_to_array(:usersIds, ',') :: BIGINT []