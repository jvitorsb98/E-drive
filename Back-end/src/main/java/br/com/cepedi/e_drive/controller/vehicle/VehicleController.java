package br.com.cepedi.e_drive.controller.vehicle;

import br.com.cepedi.e_drive.model.records.vehicle.details.DataVehicleDetails;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.service.vehicle.VehicleService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/vehicles")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Vehicle", description = "Vehicle messages")
public class VehicleController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VehicleController.class);

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Vehicle", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleDetails> register(
            @Parameter(description = "Data required to register a vehicle", required = true)
            @Valid @RequestBody DataRegisterVehicle data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a vehicle");
        DataVehicleDetails dataVehicleDetails = vehicleService.register(data);
        URI uri = uriBuilder.path("/vehicles/{id}").buildAndExpand(dataVehicleDetails.id()).toUri();
        LOGGER.info("Vehicle registered successfully");
        return ResponseEntity.created(uri).body(dataVehicleDetails);
    }

    @GetMapping
    @Operation(summary = "Get all Vehicles", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getAllVehicles(Pageable pageable) {
        LOGGER.info("Retrieving all vehicles");
        Page<DataVehicleDetails> vehicles = vehicleService.getAllVehicles(pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get Vehicles by Category", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByCategory(
            @Parameter(description = "ID of the category", required = true) @PathVariable Long categoryId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for category ID: {}", categoryId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByCategory(categoryId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/model/{modelId}")
    @Operation(summary = "Get Vehicles by Model", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByModel(
            @Parameter(description = "ID of the model", required = true) @PathVariable Long modelId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for model ID: {}", modelId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByModel(modelId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/type/{typeId}")
    @Operation(summary = "Get Vehicles by Type", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByType(
            @Parameter(description = "ID of the type", required = true) @PathVariable Long typeId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for type ID: {}", typeId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByType(typeId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/brand/{brandId}")
    @Operation(summary = "Get Vehicles by Brand", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByBrand(
            @Parameter(description = "ID of the brand", required = true) @PathVariable Long brandId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for brand ID: {}", brandId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByBrand(brandId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/propulsion/{propulsionId}")
    @Operation(summary = "Get Vehicles by Propulsion", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByPropulsion(
            @Parameter(description = "ID of the propulsion", required = true) @PathVariable Long propulsionId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for propulsion ID: {}", propulsionId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByPropulsion(propulsionId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/autonomy/{autonomyId}")
    @Operation(summary = "Get Vehicles by Autonomy", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByAutonomy(
            @Parameter(description = "ID of the autonomy", required = true) @PathVariable Long autonomyId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for autonomy ID: {}", autonomyId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByAutonomy(autonomyId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update a Vehicle", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleDetails.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found",
                    content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleDetails> updateVehicle(
            @Parameter(description = "Data required to update a vehicle", required = true)
            @Valid @RequestBody DataUpdateVehicle data,
            @Parameter(description = "ID of the vehicle to update", required = true) @PathVariable Long id) {
        LOGGER.info("Updating vehicle with ID: {}", id);
        DataVehicleDetails updatedVehicleDetails = vehicleService.updateVehicle(data, id);
        return ResponseEntity.ok(updatedVehicleDetails);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable a Vehicle", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle disabled successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disableVehicle(
            @Parameter(description = "ID of the vehicle to disable", required = true) @PathVariable Long id) {
        LOGGER.info("Disabling vehicle with ID: {}", id);
        vehicleService.disableVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/enable/{id}")
    @Transactional
    @Operation(summary = "Enable a Vehicle", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle enabled successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> enableVehicle(
            @Parameter(description = "ID of the vehicle to enable", required = true) @PathVariable Long id) {
        LOGGER.info("Enabling vehicle with ID: {}", id);
        vehicleService.enableVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
