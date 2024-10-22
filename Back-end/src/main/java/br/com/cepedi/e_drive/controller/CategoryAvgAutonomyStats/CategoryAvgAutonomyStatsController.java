package br.com.cepedi.e_drive.controller.CategoryAvgAutonomyStats;

import br.com.cepedi.e_drive.model.records.CategoryAvgAutonomyStats.details.DataCategoryAvgAutonomyStatsDetails;
import br.com.cepedi.e_drive.service.CategoryAvgAutonomyStats.CategoryAvgAutonomyStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador para gerenciar operações relacionadas à média de autonomia elétrica por categoria.
 * <p>
 * Este controlador fornece um endpoint para recuperar as estatísticas de autonomia média por categoria.
 * </p>
 */
@RestController
@SecurityRequirement(name = "bearer-key")
@RequestMapping("/api/v1/category-avg-autonomy-stats")
public class CategoryAvgAutonomyStatsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryAvgAutonomyStatsController.class);

    @Autowired
    private CategoryAvgAutonomyStatsService categoryAvgAutonomyStatsService;

    /**
     * Recupera as estatísticas de autonomia média por categoria pelo ID.
     * <p>
     * Retorna os detalhes da média de autonomia elétrica com base no ID fornecido.
     * </p>
     *
     * @param id ID da categoria.
     * @return Resposta com os detalhes da média de autonomia elétrica.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get average autonomy stats by ID", method = "GET", description = "Retrieves average autonomy stats by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Average autonomy stats retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataCategoryAvgAutonomyStatsDetails.class))),
            @ApiResponse(responseCode = "404", description = "Average autonomy stats not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataCategoryAvgAutonomyStatsDetails> getById(
            @Parameter(description = "ID of the category to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving average autonomy stats with ID: {}", id);
        DataCategoryAvgAutonomyStatsDetails avgStats = categoryAvgAutonomyStatsService.getById(id);
        LOGGER.info("Average autonomy stats retrieved successfully");
        return new ResponseEntity<>(avgStats, HttpStatus.OK);
    }
}
