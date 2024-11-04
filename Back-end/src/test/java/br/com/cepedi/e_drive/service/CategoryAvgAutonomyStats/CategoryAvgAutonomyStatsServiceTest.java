package br.com.cepedi.e_drive.service.CategoryAvgAutonomyStats;

import br.com.cepedi.e_drive.model.entitys.Category;
import br.com.cepedi.e_drive.model.entitys.CategoryAvgAutonomyStats;
import br.com.cepedi.e_drive.model.records.CategoryAvgAutonomyStats.details.DataCategoryAvgAutonomyStatsDetails;
import br.com.cepedi.e_drive.repository.CategoryAvgAutonomyStatsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryAvgAutonomyStatsServiceTest {

    @Mock
    private CategoryAvgAutonomyStatsRepository categoryAvgAutonomyStatsRepository;

    @InjectMocks
    private CategoryAvgAutonomyStatsService categoryAvgAutonomyStatsService;

    private CategoryAvgAutonomyStats stats;

    @BeforeEach
    void setUp() {
        // Criação de um objeto de teste para CategoryAvgAutonomyStats
        Category category = new Category();
        category.setId(1L); // Defina o ID da categoria conforme necessário

        stats = new CategoryAvgAutonomyStats(category, BigDecimal.valueOf(15.5));
        stats.setId(1L); // Definindo o ID da média de autonomia
    }

    @Test
    void getById_ReturnsDetails_WhenIdIsValid() {
        // Arrange
        Long validId = 1L;
        when(categoryAvgAutonomyStatsRepository.getReferenceById(validId)).thenReturn(stats);

        // Act
        DataCategoryAvgAutonomyStatsDetails result = categoryAvgAutonomyStatsService.getById(validId);

        // Assert
        assertNotNull(result);
        assertEquals(stats.getId(), result.id());
        assertEquals(stats.getAvgAutonomyElectricMode(), result.avgAutonomyElectricMode());
    }

    @Test
    void getById_ThrowsRuntimeException_WhenIdIsInvalid() {
        // Arrange
        Long invalidId = 99L; // Supondo que este ID não exista
        when(categoryAvgAutonomyStatsRepository.getReferenceById(invalidId)).thenThrow(new RuntimeException("Not found"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryAvgAutonomyStatsService.getById(invalidId);
        });

        assertEquals("Not found", exception.getMessage());
    }
}
