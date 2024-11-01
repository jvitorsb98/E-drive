-- Verifica se a tabela "category" está vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM category) THEN
        -- Inserindo categorias na tabela "category"
        INSERT INTO "category" ("name", "activated") VALUES 
            (''Sub Compacto'', true),
            (''Compacto'', true),
            (''Médio'', true),
            (''Grande'', true),
            (''Extra Grande'', true),
            (''Utilitário Esportivo Compacto'', true),
            (''Utilitário Esportivo Grande'', true),
            (''Utilitário Esportivo Grande 4x4'', true),
            (''Fora de Estrada Compacto'', true),
            (''Fora de Estrada Grande'', true),
            (''Minivan'', true),
            (''Comercial'', true),
            (''Picape Compacta'', true),
            (''Picape'', true),
            (''Esportivo'', true);
    END IF;
END
';
