package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Autonomy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AutonomyRepository extends JpaRepository<Autonomy,Long> {

}

