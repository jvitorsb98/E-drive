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

/**
 * Controlador para gerenciar operações relacionadas aos veículos.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, desativar, ativar e recuperar veículos,
 * bem como para listar veículos com base em diferentes critérios.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/vehicles")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Vehicle", description = "Vehicle management")
public class VehicleController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VehicleController.class);

    @Autowired
    private VehicleService vehicleService;

    /**
     * Registra um novo veículo.
     * <p>
     * Valida os dados fornecidos, registra o novo veículo e retorna os detalhes do veículo registrado.
     * </p>
     *
     * @param data Dados necessários para registrar um novo veículo.
     * @param uriBuilder Builder para construir o URI do novo veículo.
     * @return Resposta com os detalhes do veículo registrado e o URI do recurso.
     */
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

    /**
     * Recupera uma lista paginada de veículos, filtrando por status de ativação.
     * <p>
     * Retorna os veículos com base nas informações de paginação e no status de ativação fornecido.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @param activated Status de ativação dos veículos (true para ativos, false para inativos).
     * @return Página de detalhes dos veículos.
     */
    @GetMapping
    @Operation(summary = "Get Vehicles by Activation Status", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getAllVehicles(
            Pageable pageable,
            @RequestParam(required = false) Boolean activated) {
        LOGGER.info("Retrieving vehicles, activated: {}", activated);
        Page<DataVehicleDetails> vehicles;

        if (activated == null) {
            vehicles = vehicleService.getAllVehicles(pageable);
        } else {
            vehicles = vehicleService.findByActivated(activated, pageable);
        }

        return ResponseEntity.ok(vehicles);
    }


    /**
     * Recupera um veículo pelo ID.
     * <p>
     * Retorna os detalhes do veículo correspondente ao ID fornecido.
     * </p>
     *
     * @param id ID do veículo a ser recuperado.
     * @return Resposta com os detalhes do veículo.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get Vehicle by ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleDetails.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle not found",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<DataVehicleDetails> getVehicleById(
            @Parameter(description = "ID of the vehicle to retrieve", required = true) @PathVariable Long id) {
        LOGGER.info("Retrieving vehicle with ID: {}", id);
        DataVehicleDetails vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    /**
     * Recupera uma lista paginada de veículos por categoria.
     * <p>
     * Retorna os veículos pertencentes à categoria fornecida.
     * </p>
     *
     * @param categoryId ID da categoria dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos da categoria.
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get Vehicles by Category", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByCategory(
            @Parameter(description = "ID of the category", required = true) @PathVariable Long categoryId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for category ID: {}", categoryId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByCategory(categoryId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Recupera uma lista paginada de veículos por modelo.
     * <p>
     * Retorna os veículos pertencentes ao modelo fornecido.
     * </p>
     *
     * @param modelId ID do modelo dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos do modelo.
     */
    @GetMapping("/model/{modelId}")
    @Operation(summary = "Get Vehicles by Model", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByModel(
            @Parameter(description = "ID of the model", required = true) @PathVariable Long modelId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for model ID: {}", modelId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByModel(modelId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Recupera uma lista paginada de veículos por tipo.
     * <p>
     * Retorna os veículos pertencentes ao tipo fornecido.
     * </p>
     *
     * @param typeId ID do tipo dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos do tipo.
     */
    @GetMapping("/type/{typeId}")
    @Operation(summary = "Get Vehicles by Type", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByType(
            @Parameter(description = "ID of the type", required = true) @PathVariable Long typeId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for type ID: {}", typeId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByType(typeId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Recupera uma lista paginada de veículos por marca.
     * <p>
     * Retorna os veículos pertencentes à marca fornecida.
     * </p>
     *
     * @param brandId ID da marca dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos da marca.
     */
    @GetMapping("/brand/{brandId}")
    @Operation(summary = "Get Vehicles by Brand", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByBrand(
            @Parameter(description = "ID of the brand", required = true) @PathVariable Long brandId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for brand ID: {}", brandId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByBrand(brandId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Recupera uma lista paginada de veículos por propulsão.
     * <p>
     * Retorna os veículos pertencentes ao tipo de propulsão fornecido.
     * </p>
     *
     * @param propulsionId ID da propulsão dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos com a propulsão.
     */
    @GetMapping("/propulsion/{propulsionId}")
    @Operation(summary = "Get Vehicles by Propulsion", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByPropulsion(
            @Parameter(description = "ID of the propulsion", required = true) @PathVariable Long propulsionId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for propulsion ID: {}", propulsionId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByPropulsion(propulsionId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Recupera uma lista paginada de veículos por autonomia.
     * <p>
     * Retorna os veículos com a autonomia fornecida.
     * </p>
     *
     * @param autonomyId ID da autonomia dos veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos veículos com a autonomia.
     */
    @GetMapping("/autonomy/{autonomyId}")
    @Operation(summary = "Get Vehicles by Autonomy", method = "GET")
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByAutonomy(
            @Parameter(description = "ID of the autonomy", required = true) @PathVariable Long autonomyId,
            Pageable pageable) {
        LOGGER.info("Retrieving vehicles for autonomy ID: {}", autonomyId);
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByAutonomy(autonomyId, pageable);
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Atualiza um veículo existente.
     * <p>
     * Atualiza os detalhes do veículo com base no ID fornecido e nos novos dados.
     * </p>
     *
     * @param data Dados necessários para atualizar o veículo.
     * @param id ID do veículo a ser atualizado.
     * @return Resposta com os detalhes atualizados do veículo.
     */
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

    /**
     * Desativa um veículo existente.
     * <p>
     * Marca o veículo como desativado com base no ID fornecido.
     * </p>
     *
     * @param id ID do veículo a ser desativado.
     * @return Resposta indicando que o veículo foi desativado com sucesso.
     */
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

    /**
     * Ativa um veículo que estava desativado.
     * <p>
     * Marca o veículo como ativado com base no ID fornecido.
     * </p>
     *
     * @param id ID do veículo a ser ativado.
     * @return Resposta indicando que o veículo foi ativado com sucesso.
     */
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

    /**
     * Endpoint para obter veículos filtrados pela versão com suporte a paginação.
     *
     * @param version A versão dos veículos a serem recuperados.
     * @param pageable Informações de paginação, como número da página, tamanho e ordenação. Este parâmetro é opcional.
     * @return Um {@code ResponseEntity} contendo uma página de {@code DataVehicleDetails} se os veículos forem encontrados,
     *         ou uma resposta 404 se nenhum veículo for encontrado para a versão fornecida.
     */
    @GetMapping("/version/{version}")
    @Operation(summary = "Get Vehicles by Version with Pagination", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicles found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DataVehicleDetails.class))),
            @ApiResponse(responseCode = "404", description = "No vehicles found for the provided version",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content),
            @ApiResponse(responseCode = "403", description = "Forbidden",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public ResponseEntity<Page<DataVehicleDetails>> getVehiclesByVersion(
            @Parameter(description = "Version of the vehicles to retrieve", required = true)
            @PathVariable String version,
            @Parameter(description = "Pagination information", required = false)
            Pageable pageable) {
        Page<DataVehicleDetails> vehicles = vehicleService.getVehiclesByVersion(version, pageable);
        return ResponseEntity.ok(vehicles);
    }

}