CREATE TABLE users (
    id BIGSERIAL  PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth DATE NOT NULL,
    cellphone VARCHAR(255) NOT NULL,
    activated BOOLEAN
);