package br.com.cepedi.e_drive.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.com.cepedi.e_drive.model.entitys.Propulsion;

@Repository
public interface PropulsionRepository extends JpaRepository<Propulsion, Long> {

    // Método para buscar propulsões por nome, com paginação
    @Query("SELECT p FROM Propulsion p WHERE p.name LIKE %:name%")
    Page<Propulsion> findByNameContaining(@Param("name") String name, Pageable pageable);

    // Método para buscar propulsões que estão desativadas
    Page<Propulsion> findAllByActivatedFalse(Pageable pageable);

    // Método para buscar propulsões que estão ativas
    Page<Propulsion> findAllByActivatedTrue(Pageable pageable);
}