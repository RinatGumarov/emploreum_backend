SELECT
  ch.id,
  STRING_AGG(COALESCE(e.name, c2.name), ' ')       AS "name",
  STRING_AGG(COALESCE(e.photo_path, c2.logo), ' ') AS "logo",
  STRING_AGG(COALESCE(u.id), ' ')                  AS "fromId"
FROM (
       SELECT chats.id
       FROM chats
         INNER JOIN user_chats ON chats.id = user_chats.chat_id
         INNER JOIN users users ON user_chats.user_id = users.id AND users.id = :userId
       GROUP BY chats.id
     ) AS ch
  LEFT JOIN user_chats uch ON ch.id = uch.chat_id
  LEFT JOIN users u ON uch.user_id = u.id AND u.id <> :userId
  LEFT JOIN employees e ON u.id = e.user_id
  LEFT JOIN companies c2 ON u.id = c2.user_id
GROUP BY ch.id