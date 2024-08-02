package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.activated = false")
    Page<Category> findAllByActivatedFalse(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE c.name LIKE %:name%")
    Page<Category> findByNameContaining(String name, Pageable pageable);
}

