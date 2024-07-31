package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Brand findByName(String name);
}
