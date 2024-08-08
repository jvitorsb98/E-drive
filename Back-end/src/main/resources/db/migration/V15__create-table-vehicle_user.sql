CREATE TABLE vehicle_users (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    mileage_per_liter_road DECIMAL(8, 2) NOT NULL,
    mileage_per_liter_city DECIMAL(8, 2) NOT NULL,
    consumption_energetic DECIMAL(8, 2) NOT NULL,
    autonomy_electric_mode DECIMAL(8, 2) NOT NULL,
    activated BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle) REFERENCES vehicle(id)
);