-- Verifica se a tabela "brand" está vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM brand) THEN
        -- Inserindo marcas na tabela "brand"
        INSERT INTO brand (name, activated) VALUES (''AUDI'', true);
        INSERT INTO brand (name, activated) VALUES (''BMW'', true);
        INSERT INTO brand (name, activated) VALUES (''BYD'', true);
        INSERT INTO brand (name, activated) VALUES (''CAOA CHERY'', true);
        INSERT INTO brand (name, activated) VALUES (''CHEVROLET'', true);
        INSERT INTO brand (name, activated) VALUES (''CITROEN'', true);
        INSERT INTO brand (name, activated) VALUES (''DONFENG'', true);
        INSERT INTO brand (name, activated) VALUES (''FERRARI'', true);
        INSERT INTO brand (name, activated) VALUES (''FIAT'', true);
        INSERT INTO brand (name, activated) VALUES (''FORD'', true);
        INSERT INTO brand (name, activated) VALUES (''GWM'', true);
        INSERT INTO brand (name, activated) VALUES (''HONDA'', true);
        INSERT INTO brand (name, activated) VALUES (''HYUNDAI'', true);
        INSERT INTO brand (name, activated) VALUES (''JAC'', true);
        INSERT INTO brand (name, activated) VALUES (''JAGUAR'', true);
        INSERT INTO brand (name, activated) VALUES (''JEEP'', true);
        INSERT INTO brand (name, activated) VALUES (''KIA'', true);
        INSERT INTO brand (name, activated) VALUES (''LAND ROVER'', true);
        INSERT INTO brand (name, activated) VALUES (''LAMBORGHINI'', true);
        INSERT INTO brand (name, activated) VALUES (''LEXUS'', true);
        INSERT INTO brand (name, activated) VALUES (''MASERATI'', true);
        INSERT INTO brand (name, activated) VALUES (''MCLAREN'', true);
        INSERT INTO brand (name, activated) VALUES (''MERCEDES-BENZ'', true);
        INSERT INTO brand (name, activated) VALUES (''MITSUBISHI'', true);
        INSERT INTO brand (name, activated) VALUES (''MINI'', true);
        INSERT INTO brand (name, activated) VALUES (''NISSAN'', true);
        INSERT INTO brand (name, activated) VALUES (''PEUGEOT'', true);
        INSERT INTO brand (name, activated) VALUES (''PORSCHE'', true);
        INSERT INTO brand (name, activated) VALUES (''RAM'', true);
        INSERT INTO brand (name, activated) VALUES (''RENAULT'', true);
        INSERT INTO brand (name, activated) VALUES (''SUBARU'', true);
        INSERT INTO brand (name, activated) VALUES (''SUZUKI'', true);
        INSERT INTO brand (name, activated) VALUES (''TOYOTA'', true);
        INSERT INTO brand (name, activated) VALUES (''VOLVO'', true);
        INSERT INTO brand (name, activated) VALUES (''VW'', true);
        INSERT INTO brand (name, activated) VALUES (''GREAT WALL'', true);
    END IF;
END
';

