CREATE TABLE tokens (
    id BIGSERIAL  PRIMARY KEY,
    token TEXT NOT NULL,
    user_id BIGINT,
    expire_date TIMESTAMP WITH TIME ZONE,
   	disabled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);