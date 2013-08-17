CREATE TABLE "APP"."FEEDBACK_ITEM"(
ID BIGINT PRIMARY KEY default 'GENERATED_BY_DEFAULT' not null,
COMMENT VARCHAR,
CONTEXT VARCHAR,
FEEDBACK_DATE TIMESTAMP not null,
RATING INTEGER,
VERSION INTEGER,
VISITOR_IP_ADDRESS VARCHAR)