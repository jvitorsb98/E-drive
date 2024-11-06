-- Verifica se existem registros na tabela vehicle
DO '
BEGIN
    IF EXISTS (SELECT 1 FROM vehicle) THEN
        INSERT INTO category_avg_autonomy_stats (category_id, avg_autonomy_electric_mode)
        SELECT
            v.category_id,
            AVG(a.autonomy_electric_mode) AS avg_autonomy_electric_mode
        FROM
            vehicle v
        JOIN
            autonomy a ON v.autonomy_id = a.id
        JOIN (
            SELECT
                v.category_id,
                AVG(a.autonomy_electric_mode) AS avg_autonomy_electric_mode,
                STDDEV_SAMP(a.autonomy_electric_mode) AS stddev_autonomy_electric_mode
            FROM
                vehicle v
            JOIN
                autonomy a ON v.autonomy_id = a.id
            WHERE
                a.autonomy_electric_mode IS NOT NULL
            GROUP BY
                v.category_id
        ) AS stats ON v.category_id = stats.category_id
        WHERE
            a.autonomy_electric_mode IS NOT NULL
            AND a.autonomy_electric_mode BETWEEN (stats.avg_autonomy_electric_mode - stats.stddev_autonomy_electric_mode)
                                              AND (stats.avg_autonomy_electric_mode + stats.stddev_autonomy_electric_mode)
        GROUP BY
            v.category_id;
    END IF;
END
';

