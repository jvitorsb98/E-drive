package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.entitys.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.Banner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelRepository extends JpaRepository<Model,Long> {
    Page<Model> findAllByActivatedTrue(Pageable pageable);
    Page<Model> findAllByDisabledTrue(Pageable pageable);
}
