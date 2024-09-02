package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Autonomy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para gerenciar operações de persistência da entidade {@link Autonomy}.
 * Extende o JpaRepository para fornecer métodos CRUD básicos.
 *
 * <p>Esta interface não requer métodos adicionais além dos fornecidos pelo JpaRepository.</p>
 */
@Repository
public interface AutonomyRepository extends JpaRepository<Autonomy, Long> {

}
