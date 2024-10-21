-- Criar a função para atualizar a tabela de médias
CREATE OR REPLACE FUNCTION update_category_avg_autonomy_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE category_avg_autonomy_stats
    SET avg_autonomy_electric_mode = subquery.avg_autonomy_electric_mode
    FROM (
        SELECT
            v.category_id,
            AVG(a.autonomy_electric_mode) AS avg_autonomy_electric_mode
        FROM
            vehicle v
        JOIN
            autonomy a ON v.autonomy_id = a.id
        WHERE
            a.autonomy_electric_mode IS NOT NULL
            AND v.activated = true
        GROUP BY
            v.category_id
    ) AS subquery
    WHERE category_avg_autonomy_stats.category_id = subquery.category_id;

    RETURN NEW; -- Retorna a nova linha, necessário para triggers
END;
$$ LANGUAGE plpgsql;