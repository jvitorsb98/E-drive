CREATE TABLE vehicle_type (
    id BIGSERIAL  PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    activated BOOLEAN NOT NULL
);