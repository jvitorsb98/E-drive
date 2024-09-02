package br.com.cepedi.e_drive.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.cepedi.e_drive.model.entitys.Propulsion;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Propulsion}.
 * Extende o {@link JpaRepository} para fornecer métodos CRUD básicos.
 *
 * <p>Este repositório inclui métodos adicionais para buscar propulsões com base em seu nome e status de ativação.</p>
 */
@Repository
public interface PropulsionRepository extends JpaRepository<Propulsion, Long> {

    /**
     * Encontra todas as propulsões cujo nome contém o valor fornecido, com paginação.
     *
     * @param name O valor a ser pesquisado no nome da propulsão.
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de propulsões cujo nome contém o valor fornecido.
     */
    @Query("SELECT p FROM Propulsion p WHERE p.name LIKE %:name%")
    Page<Propulsion> findByNameContaining(@Param("name") String name, Pageable pageable);

    /**
     * Encontra todas as propulsões que estão desativadas e paginadas.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de propulsões desativadas.
     */
    Page<Propulsion> findAllByActivatedFalse(Pageable pageable);

    /**
     * Encontra todas as propulsões que estão ativadas e paginadas.
     *
     * @param pageable Informações de paginação e ordenação.
     * @return Uma página de propulsões ativadas.
     */
    Page<Propulsion> findAllByActivatedTrue(Pageable pageable);
}
