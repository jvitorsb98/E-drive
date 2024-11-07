package br.com.cepedi.e_drive.controller.model;

import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.service.model.ModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

/**
 * Controlador para gerenciar operações relacionadas a modelos.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, ativar, desativar e recuperar modelos.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/models")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Model", description = "Model management operations")
public class ModelController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ModelController.class);

    @Autowired
    private ModelService modelService;

    /**
     * Registra um novo modelo.
     * <p>
     * Valida os dados fornecidos, registra o novo modelo e retorna os detalhes do modelo registrado.
     * </p>
     *
     * @param data       Dados necessários para registrar um novo modelo.
     * @param uriBuilder Construtor de URI para criar o URI do novo modelo.
     * @return Resposta com os detalhes do modelo registrado e URI do novo modelo.
     */
    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Model", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Model registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataModelDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataModelDetails> register(
            @Parameter(description = "Data required to register a model", required = true)
            @Valid @RequestBody DataRegisterModel data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a model");
        DataModelDetails modelDetails = modelService.register(data);
        URI uri = uriBuilder.path("/api/v1/models/{id}").buildAndExpand(modelDetails.id()).toUri();
        LOGGER.info("Model registered successfully with ID: {}", modelDetails.id());
        return ResponseEntity.created(uri).body(modelDetails);
    }

    /**
     * Recupera um modelo pelo ID.
     * <p>
     * Retorna os detalhes do modelo com base no ID fornecido.
     * </p>
     *
     * @param id ID do modelo a ser recuperado.
     * @return Resposta com os detalhes do modelo.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get model by ID", method = "GET", description = "Retrieves a model by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Model retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataModelDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataModelDetails> getById(
            @Parameter(description = "ID of the model to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving model with ID: {}", id);
        DataModelDetails modelDetails = modelService.getModelById(id);
        LOGGER.info("Model retrieved successfully");
        return new ResponseEntity<>(modelDetails, HttpStatus.OK);
    }

    /**
     * Recupera uma lista paginada de todos os modelos.
     * <p>
     * Retorna todos os modelos registrados com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos modelos.
     */
    @GetMapping
    @Operation(summary = "Get all models", method = "GET", description = "Retrieves a paginated list of all models.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Models retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataModelDetails>> listAll(
            @Parameter(description = "Filter by activation status")
            @RequestParam(required = false) Boolean activated,
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving all models");

        Page<DataModelDetails> models;
        if (activated != null) {
            models = modelService.findByActivated(activated, pageable);
        } else {
            models = modelService.listAllModels(pageable);
        }

        LOGGER.info("All models retrieved successfully");
        return new ResponseEntity<>(models, HttpStatus.OK);
    }
    /**
     * Atualiza os detalhes de um modelo existente.
     * <p>
     * Valida os dados fornecidos, atualiza o modelo no repositório e retorna os detalhes do modelo atualizado.
     * </p>
     *
     * @param id   ID do modelo a ser atualizado.
     * @param data Dados necessários para atualizar o modelo.
     * @return Resposta com os detalhes do modelo atualizado.
     */
    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update model details", method = "PUT", description = "Updates the details of an existing model.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Model updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataModelDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataModelDetails> update(
            @Parameter(description = "ID of the model to be updated", required = true)
            @PathVariable Long id,
            @Parameter(description = "Data required to update a model", required = true)
            @Valid @RequestBody DataUpdateModel data
    ) {
        LOGGER.info("Updating model with ID: {}", id);
        DataModelDetails updatedModel = modelService.update(data, id);
        LOGGER.info("Model updated successfully with ID: {}", id);
        return new ResponseEntity<>(updatedModel, HttpStatus.OK);
    }

    /**
     * Recupera uma lista paginada de modelos por marca.
     * <p>
     * Retorna todos os modelos associados a uma marca específica com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param brandId  ID da marca cujos modelos devem ser recuperados.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos modelos associados à marca.
     */
    @GetMapping("/brand/{brandId}")
    @Operation(summary = "Get models by Brand", method = "GET", description = "Retrieves a paginated list of models by brand.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Models retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Models not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataModelDetails>> listByBrand(
            @Parameter(description = "ID of the brand", required = true)
            @PathVariable Long brandId,
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving models by brand ID: {}", brandId);
        Page<DataModelDetails> models = modelService.listAllModelsByBrand(brandId, pageable);
        LOGGER.info("Models by brand retrieved successfully");
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

    /**
     * Ativa um modelo pelo ID.
     * <p>
     * Marca o modelo como ativo e retorna uma resposta de sucesso.
     * </p>
     *
     * @param id ID do modelo a ser ativado.
     * @return Resposta indicando que o modelo foi ativado com sucesso.
     */
    @PutMapping("/{id}/activate")
    @Transactional
    @Operation(summary = "Activate model by ID", method = "PUT", description = "Activates a model by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Model activated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> activate(
            @Parameter(description = "ID of the model to be activated", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Activating model with ID: {}", id);
        modelService.activated(id);
        LOGGER.info("Model activated successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Desativa um modelo pelo ID.
     * <p>
     * Marca o modelo como desativado e retorna uma resposta de sucesso.
     * </p>
     *
     * @param id ID do modelo a ser desativado.
     * @return Resposta indicando que o modelo foi desativado com sucesso.
     */
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable model by ID", method = "DELETE", description = "Disables a model by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Model disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disable(
            @Parameter(description = "ID of the model to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling model with ID: {}", id);
        modelService.disable(id);
        LOGGER.info("Model disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/enable/{id}")
    @Transactional
    @Operation(summary = "Enable model by ID", method = "PUT", description = "Enables and updates a model by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Model enabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Model not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> enable(
            @Parameter(description = "ID of the model to be enabled", required = true)
            @PathVariable Long id,
            @RequestBody DataUpdateModel data
    ) {
        LOGGER.info("Enabling model with ID: {}", id);
        modelService.enable( id);
        LOGGER.info("Model enabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
