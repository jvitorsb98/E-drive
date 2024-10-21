package br.com.cepedi.e_drive.service.CategoryAvgAutonomyStats;

import br.com.cepedi.e_drive.model.entitys.CategoryAvgAutonomyStats;
import br.com.cepedi.e_drive.model.records.CategoryAvgAutonomyStats.details.DataCategoryAvgAutonomyStatsDetails;
import br.com.cepedi.e_drive.repository.CategoryAvgAutonomyStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Serviço para gerenciar as operações relacionadas à média de autonomia elétrica por categoria.
 */
@Service
public class CategoryAvgAutonomyStatsService {

    @Autowired
    private CategoryAvgAutonomyStatsRepository categoryAvgAutonomyStatsRepository;

    /**
     * Obtém os detalhes da média de autonomia elétrica por categoria pelo ID.
     *
     * @param id ID da categoria.
     * @return Detalhes da média de autonomia elétrica.
     * @throws RuntimeException Se a média de autonomia elétrica não for encontrada.
     */
    public DataCategoryAvgAutonomyStatsDetails getById(Long id) {
        CategoryAvgAutonomyStats stats = categoryAvgAutonomyStatsRepository.getReferenceById(id);
        return new DataCategoryAvgAutonomyStatsDetails(stats);
    }
}
