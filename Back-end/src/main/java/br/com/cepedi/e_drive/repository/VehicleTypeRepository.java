package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link VehicleType}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui um método adicional para buscar tipos de veículos ativados com caching.</p>
 */
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {

    /**
     * Encontra todos os tipos de veículos que estão ativados, com paginação e caching.
     *
     * <p>O resultado é armazenado em cache para melhorar a performance em consultas subsequentes.</p>
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de tipos de veículos ativados.
     */
    @Cacheable(value = "vehicleTypes", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    Page<VehicleType> findAllByActivatedTrue(Pageable pageable);

}
