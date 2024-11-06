-- Inserindo um novo papel (role) na tabela "roles" se a tabela estiver vazia
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles) THEN
        INSERT INTO roles (name) VALUES (''ADMIN'');
    END IF;
END
';
