CREATE TABLE autonomy (
    id BIGSERIAL PRIMARY KEY,
    mileage_per_liter_road DECIMAL(8, 2) ,
    mileage_per_liter_city DECIMAL(8, 2),
    consumption_energetic DECIMAL(8, 2),
    autonomy_electric_mode DECIMAL(8, 2)
);
