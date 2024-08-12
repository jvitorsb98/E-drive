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

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/models")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Model", description = "Model messages")
public class ModelController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ModelController.class);

    @Autowired
    private ModelService modelService;

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
            @Valid @RequestBody
            DataRegisterModel data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a model");
        DataModelDetails modelDetails = modelService.register(data);
        URI uri = uriBuilder.path("/models/{id}").buildAndExpand(modelDetails.id()).toUri();
        LOGGER.info("Model registered successfully");
        return ResponseEntity.created(uri).body(modelDetails);
    }

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
        LOGGER.info("Retrieving model with id: {}", id);
        DataModelDetails modelDetails = modelService.getModelById(id);
        LOGGER.info("Model retrieved successfully");
        return new ResponseEntity<>(modelDetails, HttpStatus.OK);
    }

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
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving all models");
        Page<DataModelDetails> models = modelService.listAllModels(pageable);
        LOGGER.info("All models retrieved successfully");
        return new ResponseEntity<>(models, HttpStatus.OK);
    }

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
        LOGGER.info("Updating model with id: {}", id);
        DataModelDetails updatedModel = modelService.update(data,id);
        LOGGER.info("Model updated successfully with ID: {}", id);
        return new ResponseEntity<>(updatedModel, HttpStatus.OK);
    }

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
        LOGGER.info("Activating model with id: {}", id);
        modelService.activated(id);
        LOGGER.info("Model activated successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

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
        LOGGER.info("Disabling model with id: {}", id);
        modelService.disable(id);
        LOGGER.info("Model disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
