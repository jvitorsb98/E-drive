CREATE TABLE vehicle (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    model_id BIGINT NOT NULL,
    version VARCHAR(255) NOT NULL,
    motor VARCHAR(255) NOT NULL,
    propulsion_id BIGINT NOT NULL,
    autonomy_id BIGINT NOT NULL,
    activated BOOLEAN NOT NULL,
    "year" BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (type_id) REFERENCES vehicle_type(id),
    FOREIGN KEY (model_id) REFERENCES model(id),
    FOREIGN KEY (propulsion_id) REFERENCES propulsion(id),
    FOREIGN KEY (autonomy_id) REFERENCES autonomy(id)
);
