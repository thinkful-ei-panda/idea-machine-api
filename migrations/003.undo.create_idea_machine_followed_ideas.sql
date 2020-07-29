ALTER TABLE idea_machine_followed_ideas
DROP COLUMN IF EXISTS
follower_id;

ALTER TABLE idea_machine_followed_ideas
DROP COLUMN IF EXISTS
idea_id;

DROP TABLE IF EXISTS idea_machine_followed_ideas;
