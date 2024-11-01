CREATE TABLE category_avg_autonomy_stats (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    avg_autonomy_electric_mode DECIMAL(8, 2),
    FOREIGN KEY (category_id) REFERENCES category(id)
);
