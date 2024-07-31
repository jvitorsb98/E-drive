CREATE TABLE tokens (
    id BIGSERIAL  PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_id BIGINT,
    expire_date TIMESTAMP WITH TIME ZONE,
    activated BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);