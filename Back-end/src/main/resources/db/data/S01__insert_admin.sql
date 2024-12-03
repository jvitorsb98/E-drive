DO '
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "users") THEN
        INSERT INTO "users" ("name", "email", "password", "activated", "birth", "cellphone")
        VALUES (''admin'', ''admin@admin.com'', ''$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB41bsolF5.'', true, ''1980-01-01'', ''+5512345678901'');
    END IF;
END
';
