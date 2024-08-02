CREATE TABLE model (
    id BIGSERIAL  PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    activated BOOLEAN NOT NULL,
    brand_id BIGINT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brand(id)

);

ALTER TABLE model ADD CONSTRAINT unique_name_brand UNIQUE (name, brand_id);
