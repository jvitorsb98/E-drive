package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId AND a.activated = true")
    Page<Address> findByUserIdAndActivated(@Param("userId") Long userId, Pageable pageable);

}
