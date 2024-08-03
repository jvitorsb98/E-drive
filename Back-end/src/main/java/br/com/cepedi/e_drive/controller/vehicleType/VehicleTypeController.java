package br.com.cepedi.e_drive.controller.vehicleType;

import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.service.vehicleType.VehicleTypeService;
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
@RequestMapping("/api/v2/vehicleTypes")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "VehicleType", description = "VehicleType messages")
public class VehicleTypeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VehicleTypeController.class);

    @Autowired
    private VehicleTypeService vehicleTypeService;

    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Vehicle Type", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle Type registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleTypeDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleTypeDetails> register(
            @Parameter(description = "Data required to register a vehicle type", required = true)
            @Valid @RequestBody DataRegisterVehicleType data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a vehicle type");
        DataVehicleTypeDetails vehicleTypeDetails = vehicleTypeService.register(data);
        URI uri = uriBuilder.path("/vehicleTypes/{id}").buildAndExpand(vehicleTypeDetails.id()).toUri();
        LOGGER.info("Vehicle Type registered successfully");
        return ResponseEntity.created(uri).body(vehicleTypeDetails);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle type by ID", method = "GET", description = "Retrieves a vehicle type by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle Type retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleTypeDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle Type not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleTypeDetails> getVehicleTypeById(
            @Parameter(description = "ID of the vehicle type to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving vehicle type with id: {}", id);
        DataVehicleTypeDetails vehicleTypeDetails = vehicleTypeService.getVehicleTypeById(id);
        LOGGER.info("Vehicle Type retrieved successfully");
        return new ResponseEntity<>(vehicleTypeDetails, HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Get all vehicle types", method = "GET", description = "Retrieves a paginated list of all vehicle types.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle Types retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle Type not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataVehicleTypeDetails>> listAllVehicleTypes(
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving all vehicle types");
        Page<DataVehicleTypeDetails> vehicleTypes = vehicleTypeService.listAllVehicleTypes(pageable);
        LOGGER.info("All vehicle types retrieved successfully");
        return new ResponseEntity<>(vehicleTypes, HttpStatus.OK);
    }

    @PutMapping
    @Transactional
    @Operation(summary = "Update vehicle type details", method = "PUT", description = "Updates the details of an existing vehicle type.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle Type updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleTypeDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle Type not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleTypeDetails> update(
            @Parameter(description = "Data required to update a vehicle type", required = true)
            @Valid @RequestBody DataUpdateVehicleType data
    ) {
        LOGGER.info("Updating vehicle type with id: {}", data.id());
        DataVehicleTypeDetails updatedVehicleType = vehicleTypeService.update(data);
        LOGGER.info("Vehicle Type updated successfully");
        return new ResponseEntity<>(updatedVehicleType, HttpStatus.OK);
    }

    @PutMapping("/{id}/activate")
    @Transactional
    @Operation(summary = "Activate vehicle type by ID", method = "PUT", description = "Activates a vehicle type by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle Type activated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle Type not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> activated(
            @Parameter(description = "ID of the vehicle type to be activated", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Activating vehicle type with id: {}", id);
        vehicleTypeService.activated(id);
        LOGGER.info("Vehicle Type activated successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable vehicle type by ID", method = "DELETE", description = "Disables a vehicle type by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle Type disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Vehicle Type not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disable(
            @Parameter(description = "ID of the vehicle type to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling vehicle type with id: {}", id);
        vehicleTypeService.disabled(id);
        LOGGER.info("Vehicle Type disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
