CREATE TABLE address (
    id BIGSERIAL PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    street VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    complement VARCHAR(255),
    plugin BOOLEAN NOT NULL,
    activated BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
