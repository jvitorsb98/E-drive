package br.com.cepedi.e_drive.controller.vehicleUser;

import br.com.cepedi.e_drive.model.records.vehicleUser.details.DataVehicleUserDetails;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.model.records.vehicleUser.update.DataUpdateVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.VehicleUserService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicle-users")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Vehicle User", description = "Vehicle User management")
public class VehicleUserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VehicleUserController.class);

    @Autowired
    private VehicleUserService vehicleUserService;

    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Vehicle User", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehicle User registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleUserDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleUserDetails> register(
            @Parameter(description = "Data required to register a Vehicle User", required = true)
            @Valid @RequestBody DataRegisterVehicleUser data,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String email = userDetails.getUsername();
            LOGGER.info("Registering a vehicle user for authenticated user: {}", email);
            DataVehicleUserDetails dataVehicleUserDetails = vehicleUserService.register(data,email);
            LOGGER.info("Vehicle user registered successfully");
            return ResponseEntity.status(201).body(dataVehicleUserDetails);
        } catch (Exception e) {
            LOGGER.error("Error registering vehicle user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    @Operation(summary = "Get all activated Vehicle Users", method = "GET")
    public ResponseEntity<Page<DataVehicleUserDetails>> getAllActivatedVehicleUsers(Pageable pageable) {
        LOGGER.info("Retrieving all activated vehicle users");
        Page<DataVehicleUserDetails> vehicleUsers = vehicleUserService.getAllVehicleUsersActivated(pageable);
        return ResponseEntity.ok(vehicleUsers);
    }

    @GetMapping("/user")
    @Operation(summary = "Get Vehicle Users by User", method = "GET")
    public ResponseEntity<Page<DataVehicleUserDetails>> getVehicleUsersByUser(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        LOGGER.info("Retrieving vehicle users for user ID: {} by authenticated user: {}", userDetails.getUsername(), email);
        Page<DataVehicleUserDetails> vehicleUsers = vehicleUserService.getVehicleUsersByUser(email, pageable);
        return ResponseEntity.ok(vehicleUsers);
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get Vehicle Users by Vehicle", method = "GET")
    public ResponseEntity<Page<DataVehicleUserDetails>> getVehicleUsersByVehicle(
            @Parameter(description = "ID of the vehicle", required = true) @PathVariable Long vehicleId,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        LOGGER.info("Retrieving vehicle users for vehicle ID: {} by authenticated user: {}", vehicleId, email);
        Page<DataVehicleUserDetails> vehicleUsers = vehicleUserService.getVehicleUsersByVehicle(vehicleId, pageable);
        return ResponseEntity.ok(vehicleUsers);
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update a Vehicle User", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle User updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleUserDetails.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle User not found",
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
    public ResponseEntity<DataVehicleUserDetails> updateVehicleUser(
            @Parameter(description = "Data required to update a Vehicle User", required = true)
            @Valid @RequestBody DataUpdateVehicleUser data,
            @Parameter(description = "ID of the Vehicle User to update", required = true) @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String email = userDetails.getUsername();
            LOGGER.info("Updating vehicle user with ID: {} by authenticated user: {}", id, email);
            DataVehicleUserDetails updatedVehicleUserDetails = vehicleUserService.updateVehicleUser(data, id);
            return ResponseEntity.ok(updatedVehicleUserDetails);
        } catch (Exception e) {
            LOGGER.error("Error updating vehicle user with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable a Vehicle User", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle User disabled successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle User not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disableVehicleUser(
            @Parameter(description = "ID of the Vehicle User to disable", required = true) @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String email = userDetails.getUsername();
            LOGGER.info("Disabling vehicle user with ID: {} by authenticated user: {}", id, email);
            vehicleUserService.disableVehicleUser(id);
            return ResponseEntity.noContent().build();
        }  catch (Exception e) {
            LOGGER.error("Error disabling vehicle user with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/enable/{id}")
    @Transactional
    @Operation(summary = "Enable a Vehicle User", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehicle User enabled successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle User not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> enableVehicleUser(
            @Parameter(description = "ID of the Vehicle User to enable", required = true) @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            String email = userDetails.getUsername();
            LOGGER.info("Enabling vehicle user with ID: {} by authenticated user: {}", id, email);
            vehicleUserService.enableVehicleUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            LOGGER.error("Error enabling vehicle user with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
