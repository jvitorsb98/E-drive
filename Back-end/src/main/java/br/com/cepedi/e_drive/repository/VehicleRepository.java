package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Vehicle}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui métodos adicionais para buscar veículos com base em diferentes atributos.</p>
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Encontra todos os veículos com paginação.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos.
     */
    @Query("SELECT v FROM Vehicle v")
    Page<Vehicle> findAllVehicles(Pageable pageable);

    /**
     * Encontra todos os veículos pertencentes à categoria com o ID fornecido, com paginação.
     *
     * @param categoryId O ID da categoria para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos que pertencem à categoria especificada.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.category.id = :categoryId")
    Page<Vehicle> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Encontra todos os veículos pertencentes ao modelo com o ID fornecido, com paginação.
     *
     * @param modelId O ID do modelo para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos que pertencem ao modelo especificado.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.model.id = :modelId")
    Page<Vehicle> findByModelId(@Param("modelId") Long modelId, Pageable pageable);

    /**
     * Encontra todos os veículos do tipo com o ID fornecido, com paginação.
     *
     * @param typeId O ID do tipo para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos do tipo especificado.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.type.id = :typeId")
    Page<Vehicle> findByTypeId(@Param("typeId") Long typeId, Pageable pageable);

    /**
     * Encontra todos os veículos da marca com o ID fornecido, com paginação.
     *
     * @param brandId O ID da marca para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos da marca especificada.
     */
    @Query("SELECT v FROM Vehicle v JOIN v.model m JOIN m.brand b WHERE b.id = :brandId")
    Page<Vehicle> findByBrandId(@Param("brandId") Long brandId, Pageable pageable);

    /**
     * Encontra todos os veículos com a propulsão identificada pelo ID fornecido, com paginação.
     *
     * @param propulsionId O ID da propulsão para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos com a propulsão especificada.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.propulsion.id = :propulsionId")
    Page<Vehicle> findByPropulsionId(@Param("propulsionId") Long propulsionId, Pageable pageable);

    /**
     * Encontra todos os veículos com a autonomia identificada pelo ID fornecido, com paginação.
     *
     * @param autonomyId O ID da autonomia para filtrar os veículos.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos com a autonomia especificada.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.autonomy.id = :autonomyId")
    Page<Vehicle> findByAutonomyId(@Param("autonomyId") Long autonomyId, Pageable pageable);

    /**
     * Verifica se existe um veículo com o mesmo modelo, motor e versão, ignorando diferenças de maiúsculas/minúsculas.
     *
     * @param modelId O ID do modelo do veículo.
     * @param motor O nome do motor do veículo.
     * @param version A versão do veículo.
     * @return true se um veículo com o mesmo modelo, motor e versão já existir; caso contrário, false.
     */
    boolean existsByModelIdAndMotorIgnoreCaseAndVersionIgnoreCase(Long modelId, String motor, String version);

    /**
     * Verifica se existe um veículo com a mesma versão, ignorando diferenças de maiúsculas/minúsculas.
     *
     * @param version A versão do veículo.
     * @return true se um veículo com a mesma versão já existir; caso contrário, false.
     */
    boolean existsByVersionIgnoreCase(String version);

    /**
     * Busca uma página de veículos filtrados pela versão fornecida.
     *
     * @param version A versão do veículo a ser filtrada.
     * @param pageable Objeto de paginação que define o tamanho da página, número da página e ordenação.
     * @return Um objeto {@code Page<Vehicle>} contendo os veículos correspondentes à versão fornecida.
     */
    Page<Vehicle> findByVersion(String version, Pageable pageable);

    boolean existsByModelIdAndVersionIgnoreCase(Long aLong, String trim);

    boolean existsByModelIdAndVersionIgnoreCaseAndIdNot(Long modelId, String version, Long id);

    /**
     * Encontra todos os veículos ativados com paginação.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos ativados.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.activated = true")
    Page<Vehicle> findByActivatedTrue(Pageable pageable);

    /**
     * Encontra todos os veículos desativados com paginação.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de veículos desativados.
     */
    @Query("SELECT v FROM Vehicle v WHERE v.activated = false")
    Page<Vehicle> findByActivatedFalse(Pageable pageable);
}
