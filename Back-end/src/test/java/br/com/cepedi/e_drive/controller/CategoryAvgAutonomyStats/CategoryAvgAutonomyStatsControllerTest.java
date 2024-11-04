package br.com.cepedi.e_drive.controller.CategoryAvgAutonomyStats;

import br.com.cepedi.e_drive.controller.CategoryAvgAutonomyStats.CategoryAvgAutonomyStatsController;
import br.com.cepedi.e_drive.model.records.CategoryAvgAutonomyStats.details.DataCategoryAvgAutonomyStatsDetails;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.service.CategoryAvgAutonomyStats.CategoryAvgAutonomyStatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CategoryAvgAutonomyStatsControllerTest {

    @InjectMocks
    private CategoryAvgAutonomyStatsController categoryAvgAutonomyStatsController;
    
    private DataCategoryAvgAutonomyStatsDetails statsDetails;

    @Mock
    private CategoryAvgAutonomyStatsService categoryAvgAutonomyStatsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        statsDetails = new DataCategoryAvgAutonomyStatsDetails(1L, null, null);
    }

    @Test
    void getById_ReturnsAverageAutonomyStats_WhenFound() {
        // Arrange
        Long validId = 1L;
        DataCategoryAvgAutonomyStatsDetails expectedStats = new DataCategoryAvgAutonomyStatsDetails(
                validId,
                new DataCategoryDetails( validId, "Category 1", true),
                BigDecimal.valueOf(100.0)
        );
        
        when(categoryAvgAutonomyStatsService.getById(validId)).thenReturn(expectedStats);

        // Act
        ResponseEntity<DataCategoryAvgAutonomyStatsDetails> response = categoryAvgAutonomyStatsController.getById(validId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedStats, response.getBody());
        verify(categoryAvgAutonomyStatsService, times(1)).getById(validId);
    }



    @Test
    void getById_ReturnsOk_WhenIdIsValid() {
        // Arrange
        Long validId = 1L;
        when(categoryAvgAutonomyStatsService.getById(validId)).thenReturn(statsDetails);

        // Act
        ResponseEntity<DataCategoryAvgAutonomyStatsDetails> response = categoryAvgAutonomyStatsController.getById(validId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(statsDetails, response.getBody());
        verify(categoryAvgAutonomyStatsService, times(1)).getById(validId);
    }


}
