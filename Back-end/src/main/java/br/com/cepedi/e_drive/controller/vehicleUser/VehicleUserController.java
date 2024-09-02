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

/**
 * Controlador para gerenciar operações relacionadas aos usuários de veículos.
 * <p>
 * Esta classe fornece endpoints para registrar, atualizar, desativar, ativar e recuperar usuários de veículos.
 * </p>
 */
@RestController
@RequestMapping("/api/v1/vehicle-users")
@SecurityRequirement(name = "bearer-key")
@Tag(name = "Vehicle User", description = "Vehicle User management")
public class VehicleUserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(VehicleUserController.class);

    @Autowired
    private VehicleUserService vehicleUserService;

    /**
     * Registra um novo usuário de veículo.
     * <p>
     * Valida os dados fornecidos, registra o novo usuário de veículo e retorna os detalhes do usuário registrado.
     * </p>
     *
     * @param data       Dados necessários para registrar um novo usuário de veículo.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Resposta com os detalhes do usuário de veículo registrado.
     */
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
            DataVehicleUserDetails dataVehicleUserDetails = vehicleUserService.register(data, email);
            LOGGER.info("Vehicle user registered successfully");
            return ResponseEntity.status(201).body(dataVehicleUserDetails);
        } catch (Exception e) {
            LOGGER.error("Error registering vehicle user", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Recupera uma lista paginada de todos os usuários de veículos ativados.
     * <p>
     * Retorna todos os usuários de veículos que estão ativados com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Página de detalhes dos usuários de veículos ativados.
     */
    @GetMapping
    @Operation(summary = "Get all activated Vehicle Users", method = "GET")
    public ResponseEntity<Page<DataVehicleUserDetails>> getAllActivatedVehicleUsers(Pageable pageable) {
        LOGGER.info("Retrieving all activated vehicle users");
        Page<DataVehicleUserDetails> vehicleUsers = vehicleUserService.getAllVehicleUsersActivated(pageable);
        return ResponseEntity.ok(vehicleUsers);
    }

    /**
     * Recupera uma lista paginada de usuários de veículos associados ao usuário autenticado.
     * <p>
     * Retorna todos os usuários de veículos associados ao usuário autenticado com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Página de detalhes dos usuários de veículos associados ao usuário autenticado.
     */
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

    /**
     * Recupera uma lista paginada de usuários de veículos associados a um veículo específico.
     * <p>
     * Retorna todos os usuários de veículos associados ao veículo com o ID fornecido com base nas informações de paginação fornecidas.
     * </p>
     *
     * @param vehicleId ID do veículo.
     * @param pageable Informações de paginação e ordenação.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Página de detalhes dos usuários de veículos associados ao veículo especificado.
     */
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

    /**
     * Atualiza os detalhes de um usuário de veículo existente.
     * <p>
     * Atualiza os detalhes do usuário de veículo com base no ID e nos dados fornecidos.
     * </p>
     *
     * @param data       Dados necessários para atualizar um usuário de veículo.
     * @param id         ID do usuário de veículo a ser atualizado.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Resposta com os detalhes do usuário de veículo atualizado.
     */
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

    /**
     * Desativa um usuário de veículo pelo ID.
     * <p>
     * Marca o usuário de veículo como desativado e retorna uma resposta de sucesso.
     * </p>
     *
     * @param id         ID do usuário de veículo a ser desativado.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Resposta indicando que o usuário de veículo foi desativado com sucesso.
     */
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
        } catch (Exception e) {
            LOGGER.error("Error disabling vehicle user with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Ativa um usuário de veículo pelo ID.
     * <p>
     * Marca o usuário de veículo como ativado e retorna uma resposta de sucesso.
     * </p>
     *
     * @param id         ID do usuário de veículo a ser ativado.
     * @param userDetails Detalhes do usuário autenticado.
     * @return Resposta indicando que o usuário de veículo foi ativado com sucesso.
     */
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
