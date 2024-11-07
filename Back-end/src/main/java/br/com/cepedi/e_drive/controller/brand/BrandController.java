package br.com.cepedi.e_drive.controller.brand;

import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.service.brand.BrandService;
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
 * Controlador para gerenciar operações relacionadas a marcas.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, desabilitar e recuperar marcas.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/brands")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Brand", description = "Brand messages")
public class BrandController {

    private static final Logger LOGGER = LoggerFactory.getLogger(BrandController.class);

    @Autowired
    private BrandService brandService;

    /**
     * Registra uma nova marca.
     * <p>
     * Valida os dados fornecidos, registra a nova marca e retorna os detalhes da marca registrada.
     * </p>
     *
     * @param data       Dados necessários para registrar uma nova marca.
     * @param uriBuilder Construtor de URI para criar o URI da nova marca.
     * @return Resposta com os detalhes da marca registrada e URI da nova marca.
     */
    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Brand", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Brand registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataBrandDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataBrandDetails> register(
            @Parameter(description = "Data required to register a brand", required = true)
            @Valid @RequestBody DataRegisterBrand data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a brand");
        DataBrandDetails brandDetails = brandService.register(data);
        URI uri = uriBuilder.path("/api/v1/brands/{id}").buildAndExpand(brandDetails.id()).toUri();
        LOGGER.info("Brand registered successfully");
        return ResponseEntity.created(uri).body(brandDetails);
    }

    /**
     * Recupera uma marca pelo ID.
     * <p>
     * Retorna os detalhes da marca com base no ID fornecido.
     * </p>
     *
     * @param id ID da marca a ser recuperada.
     * @return Resposta com os detalhes da marca.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID", method = "GET", description = "Retrieves a brand by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataBrandDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Brand not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataBrandDetails> getById(
            @Parameter(description = "ID of the brand to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving brand with id: {}", id);
        DataBrandDetails brandDetails = brandService.getById(id);
        LOGGER.info("Brand retrieved successfully");
        return new ResponseEntity<>(brandDetails, HttpStatus.OK);
    }

    /**
     * Recupera uma lista paginada de todas as marcas.
     * <p>
     * Retorna todas as marcas registradas com base nas informações de paginação e ordenação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes das marcas.
     */
    @GetMapping
    @Operation(summary = "Get all brands", method = "GET", description = "Retrieves a paginated list of all brands.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brands retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "No brands found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataBrandDetails>> listAll(
            @Parameter(description = "Filter by activation status")
            @RequestParam(required = false) Boolean activated,
            @Parameter(description = "Pagination and sorting information")
            @PageableDefault(size = 10, sort = {"name"}) Pageable pageable
    ) {
        LOGGER.info("Retrieving all brands");

        Page<DataBrandDetails> brands;
        if (activated != null) {
            brands = brandService.findByActivated(activated, pageable);
        } else {
            brands = brandService.listAll(pageable);
        }

        LOGGER.info("All brands retrieved successfully");
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    /**
     * Atualiza os detalhes de uma marca existente.
     * <p>
     * Valida os dados fornecidos, atualiza a marca no repositório e retorna os detalhes da marca atualizada.
     * </p>
     *
     * @param id   ID da marca a ser atualizada.
     * @param data Dados necessários para atualizar a marca.
     * @return Resposta com os detalhes da marca atualizada.
     */
    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update brand details", method = "PUT", description = "Updates the details of an existing brand.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataBrandDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Brand not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataBrandDetails> update(
            @Parameter(description = "ID of the brand to be updated", required = true)
            @PathVariable Long id,
            @Parameter(description = "Data required to update a brand", required = true)
            @Valid @RequestBody DataUpdateBrand data
    ) {
        LOGGER.info("Updating brand with id: {}", id);
        DataBrandDetails updatedBrand = brandService.update(data, id);
        LOGGER.info("Brand updated successfully");
        return new ResponseEntity<>(updatedBrand, HttpStatus.OK);
    }

    /**
     * Ativa uma marca pelo ID.
     * <p>
     * Marca a marca como ativada com base no ID fornecido.
     * </p>
     *
     * @param id ID da marca a ser ativada.
     * @return Resposta sem conteúdo (204 No Content).
     */
    @PutMapping("/{id}/activate")
    @Transactional
    @Operation(summary = "Activate brand by ID", method = "PUT", description = "Activates a brand by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Brand activated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content),
            @ApiResponse(responseCode = "404", description = "Brand not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<Void> activate(
            @Parameter(description = "ID of the brand to be activated", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Activating brand with id: {}", id);
        brandService.activated(id); // Chame o método activate no BrandService
        LOGGER.info("Brand activated successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    /**
     * Desativa uma marca pelo ID.
     * <p>
     * Marca a marca como desativada com base no ID fornecido.
     * </p>
     *
     * @param id ID da marca a ser desativada.
     * @return Resposta sem conteúdo (204 No Content).
     */
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable brand by ID", method = "DELETE", description = "Disables a brand by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Brand disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Brand not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disable(
            @Parameter(description = "ID of the brand to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling brand with id: {}", id);
        brandService.disabled(id);
        LOGGER.info("Brand disabled successfully");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
