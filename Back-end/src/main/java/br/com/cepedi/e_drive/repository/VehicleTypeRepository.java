package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {

    @Cacheable(value = "vehicleTypes", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    Page<VehicleType> findAllByActivatedTrue(Pageable pageable);

}
