CREATE TABLE autonomy (
    id BIGSERIAL PRIMARY KEY,
    mileage_per_liter_road DECIMAL(8, 2) NOT NULL,
    mileage_per_liter_city DECIMAL(8, 2) NOT NULL,
    consumption_energetic DECIMAL(8, 2) NOT NULL,
    autonomy_electric_mode DECIMAL(8, 2) NOT NULL
);
