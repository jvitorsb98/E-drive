package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link VehicleUser}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Esta interface inclui métodos adicionais para buscar {@link VehicleUser} com base no usuário, veículo e status de ativação.</p>
 */
public interface VehicleUserRepository extends JpaRepository<VehicleUser, Long> {

    /**
     * Encontra todos os registros de {@link VehicleUser} associados a um usuário específico,
     * filtrando apenas os veículos ativos.
     *
     * @param userId O identificador do usuário.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de registros de {@link VehicleUser} ativos associados ao usuário especificado.
     */
    @Query("SELECT vu FROM VehicleUser vu WHERE vu.user.id = :userId AND vu.activated = true")
    Page<VehicleUser> findByUserId(@Param("userId") Long userId, Pageable pageable);



    /**
     * Encontra todos os registros de {@link VehicleUser} associados a um veículo específico.
     *
     * @param vehicleId O identificador do veículo.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de registros de {@link VehicleUser} associados ao veículo especificado.
     */
    @Query("SELECT vu FROM VehicleUser vu WHERE vu.vehicle.id = :vehicleId")
    Page<VehicleUser> findByVehicleId(@Param("vehicleId") Long vehicleId, Pageable pageable);

    /**
     * Encontra todos os registros de {@link VehicleUser} que estão ativados.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de registros de {@link VehicleUser} que estão ativados.
     */
    @Query("SELECT vu FROM VehicleUser vu WHERE vu.activated = true")
    Page<VehicleUser> findAllActivated(Pageable pageable);

}
