CREATE TABLE vehicle (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    brand BIGINT NOT NULL,
    version VARCHAR(255) NOT NULL,
    motor VARCHAR(255) NOT NULL,
    propulsion BIGINT NOT NULL,
    autonomy_id BIGINT NOT NULL,
    activated BOOLEAN NOT NULL,
    "year" BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (type_id) REFERENCES vehicle_type(id),
    FOREIGN KEY (brand) REFERENCES brand(id),
    FOREIGN KEY (propulsion) REFERENCES propulsion(id),
    FOREIGN KEY (autonomy_id) REFERENCES autonomy(id)
);
