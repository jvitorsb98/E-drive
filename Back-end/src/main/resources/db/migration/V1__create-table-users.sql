CREATE TABLE users (
    id BIGSERIAL  PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth DATE NOT NULL,
    cellphone VARCHAR(255) NOT NULL,
    activated BOOLEAN
);