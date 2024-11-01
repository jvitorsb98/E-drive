-- Verifica se a tabela "propulsion" está vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM propulsion) THEN
        -- Inserindo tipos de propulsão na tabela "propulsion"
        INSERT INTO "propulsion" ("name", "activated") VALUES 
            (''Elétrico'', true),
            (''Plug-in'', true),
            (''Híbrido'', true);
    END IF;
END
';

