package br.com.cepedi.e_drive.controller.address;

import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.service.address.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressController.class);

    @Autowired
    private AddressService addressService;

    @PostMapping
    @Transactional
    @Operation(summary = "Register a new address", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Address registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataAddressDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataAddressDetails> register(
            @Parameter(description = "Data required to register a new address", required = true)
            @Valid @RequestBody DataRegisterAddress data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a new address");
        DataAddressDetails addressDetails = addressService.register(data);
        URI uri = uriBuilder.path("/addresses/{id}").buildAndExpand(addressDetails.id()).toUri();
        LOGGER.info("Address registered successfully");
        return ResponseEntity.created(uri).body(addressDetails);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get address by ID", method = "GET", description = "Retrieves an address by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataAddressDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Address not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataAddressDetails> getAddressById(
            @Parameter(description = "ID of the address to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving address with id: {}", id);
        DataAddressDetails addressDetails = addressService.getAddressById(id);
        LOGGER.info("Address retrieved successfully");
        return new ResponseEntity<>(addressDetails, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get addresses by User ID", method = "GET", description = "Retrieves a list of addresses associated with a specific user ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "No addresses found for this user",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataAddressDetails>> getAddressesByUserId(
            @Parameter(description = "ID of the user whose addresses are to be retrieved", required = true)
            @PathVariable Long userId,
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"city"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving addresses for user with id: {}", userId);
        Page<DataAddressDetails> addresses = addressService.getAddressesByUserId(userId, pageable);
        LOGGER.info("Addresses retrieved successfully");
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    @GetMapping
    @Operation(summary = "Get all addresses", method = "GET", description = "Retrieves a paginated list of all addresses.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataAddressDetails>> listAllAddresses(
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"city"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving all addresses");
        Page<DataAddressDetails> addresses = addressService.getAllAddresses(pageable);
        LOGGER.info("All addresses retrieved successfully");
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update address details", method = "PUT", description = "Updates the details of an existing address.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataAddressDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Address not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataAddressDetails> update(
            @Parameter(description = "Data required to update an address", required = true)
            @Valid @RequestBody DataUpdateAddress data,
            @Parameter(description = "ID of the address to be updated", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Updating address with id: {}", id);
        DataAddressDetails updatedAddress = addressService.updateAddress(data, id);
        LOGGER.info("Address updated successfully");
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    @PatchMapping("/{id}/disable")
    @Transactional
    @Operation(summary = "Disable address by ID", method = "PATCH", description = "Disables an address by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Address disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Address not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disableAddress(
            @Parameter(description = "ID of the address to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling address with id: {}", id);
        addressService.disableAddress(id);
        LOGGER.info("Address disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}/enable")
    @Transactional
    @Operation(summary = "Enable address by ID", method = "PATCH", description = "Enables an address by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Address enabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Address not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> enableAddress(
            @Parameter(description = "ID of the address to be enabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Enabling address with id: {}", id);
        addressService.enableAddress(id);
        LOGGER.info("Address enabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
