package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleUserRepository extends JpaRepository<VehicleUser, Long> {

    @Query("SELECT vu FROM VehicleUser vu WHERE vu.user.id = :userId")
    Page<VehicleUser> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT vu FROM VehicleUser vu WHERE vu.vehicle.id = :vehicleId")
    Page<VehicleUser> findByVehicleId(@Param("vehicleId") Long vehicleId, Pageable pageable);

    @Query("SELECT vu FROM VehicleUser vu WHERE vu.activated = true")
    Page<VehicleUser> findAllActivated(Pageable pageable);


}
