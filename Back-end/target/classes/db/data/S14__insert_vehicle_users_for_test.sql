-- Verifica se a tabela vehicle_users para user_id = 1 está vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM vehicle_users WHERE user_id = 1) THEN
        INSERT INTO vehicle_users (user_id, vehicle_id, mileage_per_liter_road, mileage_per_liter_city, consumption_energetic, autonomy_electric_mode, activated)
        VALUES (1, 1, 41.9, 58.6, 0.41, 280, TRUE);

        INSERT INTO vehicle_users (user_id, vehicle_id, mileage_per_liter_road, mileage_per_liter_city, consumption_energetic, autonomy_electric_mode, activated)
        VALUES (1, 2, 38.6, 50.8, 0.46, 198, TRUE);

        INSERT INTO vehicle_users (user_id, vehicle_id, mileage_per_liter_road, mileage_per_liter_city, consumption_energetic, autonomy_electric_mode, activated)
        VALUES (1, 3, 40.4, 47.3, 0.46, 227, TRUE);

        INSERT INTO vehicle_users (user_id, vehicle_id, mileage_per_liter_road, mileage_per_liter_city, consumption_energetic, autonomy_electric_mode, activated)
        VALUES (1, 4, 35, 46.6, 0.5, 181, TRUE);

        INSERT INTO vehicle_users (user_id, vehicle_id, mileage_per_liter_road, mileage_per_liter_city, consumption_energetic, autonomy_electric_mode, activated)
        VALUES (1, 5, 35, 46.6, 0.5, 181, TRUE);
    END IF;
END
';
