-- Criar o trigger para a tabela vehicle para inserções
CREATE TRIGGER update_avg_autonomy_stats
AFTER INSERT ON vehicle
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();

-- Criar o trigger para a tabela vehicle para atualizações
CREATE TRIGGER update_avg_autonomy_stats_update
AFTER UPDATE ON vehicle
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();

-- Criar o trigger para a tabela vehicle para exclusões
CREATE TRIGGER update_avg_autonomy_stats_delete
AFTER DELETE ON vehicle
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();

-- Criar o trigger para a tabela autonomy para inserções
CREATE TRIGGER update_avg_autonomy_stats_autonomy
AFTER INSERT ON autonomy
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();

-- Criar o trigger para a tabela autonomy para atualizações
CREATE TRIGGER update_avg_autonomy_stats_autonomy_update
AFTER UPDATE ON autonomy
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();

-- Criar o trigger para a tabela autonomy para exclusões
CREATE TRIGGER update_avg_autonomy_stats_autonomy_delete
AFTER DELETE ON autonomy
FOR EACH ROW
EXECUTE FUNCTION update_category_avg_autonomy_stats();
