CREATE TABLE address (
    id BIGINT NOT NULL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    plugin BOOLEAN NOT NULL,
    activated BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
