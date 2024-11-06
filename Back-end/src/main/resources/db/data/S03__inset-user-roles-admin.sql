-- Inserindo uma nova combinação de usuário e papel (role) na tabela "user_roles" se não existir
DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 1 AND role_id = 1) THEN
        INSERT INTO user_roles VALUES (1, 1);
    END IF;
END
';
