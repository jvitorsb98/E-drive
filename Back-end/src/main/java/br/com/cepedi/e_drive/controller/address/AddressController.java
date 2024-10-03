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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

/**
 * Controlador para gerenciar operações relacionadas a endereços.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, habilitar, desabilitar e recuperar endereços.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/address")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Address", description = "Address messages")
public class AddressController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressController.class);

    @Autowired
    private AddressService addressService;

    /**
     * Registra um novo endereço.
     * <p>
     * Valida os dados fornecidos, registra o novo endereço e retorna os detalhes do endereço registrado.
     * </p>
     *
     * @param data       Dados necessários para registrar um novo endereço.
     * @param uriBuilder Construtor de URI para criar o URI do novo endereço.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Resposta com os detalhes do endereço registrado e URI do novo endereço.
     */
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
            UriComponentsBuilder uriBuilder,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        LOGGER.info("Registering a new address");
        String email = userDetails.getUsername();
        DataAddressDetails addressDetails = addressService.register(data, email);
        URI uri = uriBuilder.path("/api/v1/address/{id}").buildAndExpand(addressDetails.id()).toUri();
        LOGGER.info("Address registered successfully");
        return ResponseEntity.created(uri).body(addressDetails);
    }

    /**
     * Recupera um endereço pelo ID.
     * <p>
     * Retorna os detalhes do endereço com base no ID fornecido.
     * </p>
     *
     * @param id ID do endereço a ser recuperado.
     * @return Resposta com os detalhes do endereço.
     */
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
    public ResponseEntity<DataAddressDetails> getById(
            @Parameter(description = "ID of the address to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving address with id: {}", id);
        DataAddressDetails addressDetails = addressService.getById(id);
        LOGGER.info("Address retrieved successfully");
        return new ResponseEntity<>(addressDetails, HttpStatus.OK);
    }

    /**
     * Recupera uma lista de endereços associados a um ID de usuário específico.
     * <p>
     * Retorna uma página de endereços associados ao ID do usuário fornecido.
     * </p>
     *
     * @param userDetails Detalhes do usuário autenticado.
     * @param pageable   Informações de paginação e ordenação.
     * @return Página de detalhes dos endereços associados ao usuário.
     */
    @GetMapping("/user")
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
    public ResponseEntity<Page<DataAddressDetails>> getByUserId(
            @Parameter(description = "ID of the user whose addresses are to be retrieved", required = true)
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"city"}) Pageable pageable
    ) {
        String email = userDetails.getUsername();
        LOGGER.info("Retrieving addresses for user with email: {}", email);
        Page<DataAddressDetails> addresses = addressService.getByUserId(email, pageable);
        LOGGER.info("Addresses retrieved successfully");
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    /**
     * Recupera uma lista paginada de todos os endereços.
     * <p>
     * Retorna todos os endereços registrados com base nas informações de paginação e ordenação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos endereços.
     */
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
            Pageable pageable
    ) {
        LOGGER.info("Retrieving all addresses");
        Page<DataAddressDetails> addresses = addressService.getAll(pageable);
        LOGGER.info("All addresses retrieved successfully");
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }


    /**
     * Atualiza os detalhes de um endereço existente.
     * <p>
     * Valida os dados fornecidos, atualiza o endereço no repositório e retorna os detalhes do endereço atualizado.
     * </p>
     *
     * @param data Dados necessários para atualizar o endereço.
     * @param id   ID do endereço a ser atualizado.
     * @return Resposta com os detalhes do endereço atualizado.
     */
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
        DataAddressDetails updatedAddress = addressService.update(data, id);
        LOGGER.info("Address updated successfully");
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
    }

    /**
     * Desativa um endereço pelo ID.
     * <p>
     * Marca o endereço como desativado com base no ID fornecido.
     * </p>
     *
     * @param id ID do endereço a ser desativado.
     * @return Resposta sem conteúdo (204 No Content).
     */
    @DeleteMapping("/{id}")
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
    public ResponseEntity<Void> disabled(
            @Parameter(description = "ID of the address to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling address with id: {}", id);
        addressService.disable(id);
        LOGGER.info("Address disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Habilita um endereço pelo ID.
     * <p>
     * Marca o endereço como habilitado com base no ID fornecido.
     * </p>
     *
     * @param id ID do endereço a ser habilitado.
     * @return Resposta sem conteúdo (204 No Content).
     */
    @PutMapping("/{id}/enable")
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
        addressService.enable(id);
        LOGGER.info("Address enabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
