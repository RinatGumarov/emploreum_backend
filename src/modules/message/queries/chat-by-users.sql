SELECT chats.*
FROM chats
  INNER JOIN user_chats ON chats.id = user_chats.chat_id
  INNER JOIN users u ON user_chats.user_id = u.id
  INNER JOIN unnest(string_to_array(:usersIds, ',') :: BIGINT[]) ON unnest =  u.id
GROUP BY chats.id, chats.status