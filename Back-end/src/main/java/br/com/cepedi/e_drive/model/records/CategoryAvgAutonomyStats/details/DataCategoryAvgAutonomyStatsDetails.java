package br.com.cepedi.e_drive.model.records.CategoryAvgAutonomyStats.details;

import br.com.cepedi.e_drive.model.entitys.CategoryAvgAutonomyStats;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Record que encapsula os dados de média de autonomia elétrica por categoria.
 * Utilizado para transferir dados sobre a média de autonomia elétrica associada a uma categoria específica.
 *
 * @param dataCategoryDetails           Detalhes da categoria associados à média de autonomia elétrica.
 * @param avgAutonomyElectricMode       Média da autonomia elétrica para a categoria. Não pode ser nula.
 */
public record DataCategoryAvgAutonomyStatsDetails(

        Long id,

        DataCategoryDetails dataCategoryDetails,

        BigDecimal avgAutonomyElectricMode

) {
    /**
     * Construtor que cria uma instância de {@code DataCategoryAvgAutonomyStats} com base em um objeto {@link CategoryAvgAutonomyStats}.
     *
     * @param stats Instância de {@link CategoryAvgAutonomyStats} a partir da qual os dados serão extraídos.
     */
    public DataCategoryAvgAutonomyStatsDetails(CategoryAvgAutonomyStats stats) {
        this(stats.getId(),new DataCategoryDetails( stats.getCategory()), stats.getAvgAutonomyElectricMode());
    }
}
