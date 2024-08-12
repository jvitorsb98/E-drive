package br.com.cepedi.e_drive.controller.propulsion;

import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.service.propulsion.PropulsionService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/propulsions")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Propulsion", description = "Propulsion management operations")
public class PropulsionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PropulsionController.class);

    @Autowired
    private PropulsionService propulsionService;

    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Propulsion", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Propulsion registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataPropulsionDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataPropulsionDetails> register(
            @Parameter(description = "Data required to register a Propulsion", required = true)
            @Valid @RequestBody DataRegisterPropulsion data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a new propulsion");
        DataPropulsionDetails propulsionDetails = propulsionService.register(data);
        URI uri = uriBuilder.path("/api/v1/propulsions/{id}").buildAndExpand(propulsionDetails.id()).toUri();
        LOGGER.info("Propulsion registered successfully with ID: {}", propulsionDetails.id());
        return ResponseEntity.created(uri).body(propulsionDetails);
    }

    @GetMapping
    @Operation(summary = "List all propulsions", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Propulsions retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsions not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataPropulsionDetails>> listAll(Pageable pageable) {
        LOGGER.info("Retrieving all propulsions");
        Page<DataPropulsionDetails> propulsions = propulsionService.listAll(pageable);
        LOGGER.info("Propulsions retrieved successfully");
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @GetMapping("/deactivated")
    @Operation(summary = "List all deactivated propulsions", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deactivated propulsions retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsions not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataPropulsionDetails>> listAllDeactivated(Pageable pageable) {
        LOGGER.info("Retrieving all deactivated propulsions");
        Page<DataPropulsionDetails> propulsions = propulsionService.listAllDeactivated(pageable);
        LOGGER.info("Deactivated propulsions retrieved successfully");
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @GetMapping("/search")
    @Operation(summary = "Search propulsions by name", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Propulsions retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsions not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataPropulsionDetails>> listByName(
            @Parameter(description = "Name of the propulsion to be searched", required = true)
            @RequestParam("name") String name, Pageable pageable
    ) {
        LOGGER.info("Searching propulsions by name: {}", name);
        Page<DataPropulsionDetails> propulsions = propulsionService.listByName(name, pageable);
        LOGGER.info("Propulsions searched successfully");
        return new ResponseEntity<>(propulsions, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get propulsion by ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Propulsion retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataPropulsionDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsion not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataPropulsionDetails> getById(
            @Parameter(description = "ID of the propulsion to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving propulsion with ID: {}", id);
        DataPropulsionDetails propulsionDetails = propulsionService.getById(id);
        LOGGER.info("Propulsion retrieved successfully with ID: {}", id);
        return new ResponseEntity<>(propulsionDetails, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update propulsion details", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Propulsion updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataPropulsionDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsion not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataPropulsionDetails> update(
            @Parameter(description = "ID of the propulsion to be updated", required = true)
            @PathVariable Long id,
            @Parameter(description = "Data required to update a propulsion", required = true)
            @Valid @RequestBody DataUpdatePropulsion data
    ) {
        LOGGER.info("Updating propulsion with ID: {}", id);
        DataPropulsionDetails updatedPropulsion = propulsionService.update(data, id);
        LOGGER.info("Propulsion updated successfully with ID: {}", id);
        return new ResponseEntity<>(updatedPropulsion, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable propulsion by ID", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Propulsion disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Propulsion not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disabled(
            @Parameter(description = "ID of the propulsion to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling propulsion with ID: {}", id);
        propulsionService.disabled(id);
        LOGGER.info("Propulsion disabled successfully with ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
