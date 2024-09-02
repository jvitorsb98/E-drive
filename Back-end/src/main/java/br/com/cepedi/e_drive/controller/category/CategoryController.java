package br.com.cepedi.e_drive.controller.category;

import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;
import br.com.cepedi.e_drive.service.category.CategoryService;
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

/**
 * Controlador para gerenciar operações relacionadas a categorias.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, desabilitar e recuperar categorias.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/categories")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Category", description = "Category management operations")
public class CategoryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService categoryService;

    /**
     * Registra uma nova categoria.
     * <p>
     * Valida os dados fornecidos, registra a nova categoria e retorna os detalhes da categoria registrada.
     * </p>
     *
     * @param data       Dados necessários para registrar uma nova categoria.
     * @param uriBuilder Construtor de URI para criar o URI da nova categoria.
     * @return Resposta com os detalhes da categoria registrada e URI da nova categoria.
     */
    @PostMapping
    @Transactional
    @Operation(summary = "Register a new Category", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataCategoryDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataCategoryDetails> register(
            @Parameter(description = "Data required to register a Category", required = true)
            @Valid @RequestBody DataRegisterCategory data,
            UriComponentsBuilder uriBuilder
    ) {
        LOGGER.info("Registering a new category");
        DataCategoryDetails categoryDetails = categoryService.register(data);
        URI uri = uriBuilder.path("/api/v1/categories/{id}").buildAndExpand(categoryDetails.id()).toUri();
        LOGGER.info("Category registered successfully with ID: {}", categoryDetails.id());
        return ResponseEntity.created(uri).body(categoryDetails);
    }

    /**
     * Recupera uma lista paginada de todas as categorias.
     * <p>
     * Retorna todas as categorias registradas com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes das categorias.
     */
    @GetMapping
    @Operation(summary = "List all categories", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categories retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Categories not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataCategoryDetails>> listAll(Pageable pageable) {
        LOGGER.info("Retrieving all categories");
        Page<DataCategoryDetails> categories = categoryService.listAll(pageable);
        LOGGER.info("Categories retrieved successfully");
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    /**
     * Recupera uma lista paginada de todas as categorias desativadas.
     * <p>
     * Retorna todas as categorias desativadas com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes das categorias desativadas.
     */
    @GetMapping("/deactivated")
    @Operation(summary = "List all deactivated categories", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Deactivated categories retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Categories not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataCategoryDetails>> listAllDeactivated(Pageable pageable) {
        LOGGER.info("Retrieving all deactivated categories");
        Page<DataCategoryDetails> categories = categoryService.listAllDeactivated(pageable);
        LOGGER.info("Deactivated categories retrieved successfully");
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    /**
     * Pesquisa categorias pelo nome.
     * <p>
     * Retorna categorias que correspondem ao nome fornecido com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param name     Nome da categoria a ser pesquisada.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes das categorias correspondentes ao nome.
     */
    @GetMapping("/search")
    @Operation(summary = "Search categories by name", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categories retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Categories not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataCategoryDetails>> listByName(
            @Parameter(description = "Name of the category to be searched", required = true)
            @RequestParam("name") String name, Pageable pageable
    ) {
        LOGGER.info("Searching categories by name: {}", name);
        Page<DataCategoryDetails> categories = categoryService.listByName(name, pageable);
        LOGGER.info("Categories searched successfully");
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    /**
     * Recupera uma categoria pelo ID.
     * <p>
     * Retorna os detalhes da categoria com base no ID fornecido.
     * </p>
     *
     * @param id ID da categoria a ser recuperada.
     * @return Resposta com os detalhes da categoria.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category retrieved successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataCategoryDetails.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Category not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataCategoryDetails> getById(
            @Parameter(description = "ID of the category to be retrieved", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Retrieving category with ID: {}", id);
        DataCategoryDetails categoryDetails = categoryService.getById(id);
        LOGGER.info("Category retrieved successfully with ID: {}", id);
        return new ResponseEntity<>(categoryDetails, HttpStatus.OK);
    }

    /**
     * Atualiza os detalhes de uma categoria existente.
     * <p>
     * Valida os dados fornecidos, atualiza a categoria no repositório e retorna os detalhes da categoria atualizada.
     * </p>
     *
     * @param id   ID da categoria a ser atualizada.
     * @param data Dados necessários para atualizar a categoria.
     * @return Resposta com os detalhes da categoria atualizada.
     */
    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update category details", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataCategoryDetails.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Category not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataCategoryDetails> update(
            @Parameter(description = "ID of the category to be updated", required = true)
            @PathVariable Long id,
            @Parameter(description = "Data required to update a category", required = true)
            @Valid @RequestBody DataUpdateCategory data
    ) {
        LOGGER.info("Updating category with ID: {}", id);
        DataCategoryDetails updatedCategory = categoryService.update(data, id);
        LOGGER.info("Category updated successfully with ID: {}", id);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    /**
     * Desativa uma categoria pelo ID.
     * <p>
     * Marca a categoria como desativada e retorna uma resposta de sucesso.
     * </p>
     *
     * @param id ID da categoria a ser desativada.
     * @return Resposta indicando que a categoria foi desativada com sucesso.
     */
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Disable category by ID", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category disabled successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Category not found",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Void> disabled(
            @Parameter(description = "ID of the category to be disabled", required = true)
            @PathVariable Long id
    ) {
        LOGGER.info("Disabling category with ID: {}", id);
        categoryService.disabled(id);
        LOGGER.info("Category disabled successfully with ID: {}", id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
