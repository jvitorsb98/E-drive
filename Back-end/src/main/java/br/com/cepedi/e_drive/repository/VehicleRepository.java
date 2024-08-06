package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v")
    Page<Vehicle> findAllVehicles(Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.category.id = :categoryId")
    Page<Vehicle> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.model.id = :modelId")
    Page<Vehicle> findByModelId(@Param("modelId") Long modelId, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.type.id = :typeId")
    Page<Vehicle> findByTypeId(@Param("typeId") Long typeId, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.brand.id = :brandId")
    Page<Vehicle> findByBrandId(@Param("brandId") Long brandId, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.propulsion.id = :propulsionId")
    Page<Vehicle> findByPropulsionId(@Param("propulsionId") Long propulsionId, Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.autonomy.id = :autonomyId")
    Page<Vehicle> findByAutonomyId(@Param("autonomyId") Long autonomyId, Pageable pageable);

}
