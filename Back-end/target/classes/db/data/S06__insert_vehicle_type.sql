-- Verifica se a tabela "vehicle_type" está vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM vehicle_type) THEN
        -- Inserindo tipo de veículo na tabela "vehicle_type"
        INSERT INTO "vehicle_type" ("name", "activated") VALUES (''CAR'', true);
    END IF;
END
';

