package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class VehicleUserRepositoryTest {

    @Autowired
    private VehicleUserRepository vehicleUserRepository;

    @Autowired
    private UserRepository userRepository;  // Supondo que você tenha um UserRepository para criar usuários
    @Autowired
    private VehicleRepository vehicleRepository;  // Supondo que você tenha um VehicleRepository para criar veículos

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();

        // Clear the repositories before each test
        vehicleUserRepository.deleteAll();
        userRepository.deleteAll();
        vehicleRepository.deleteAll();
    }

    private User createUser() {
        User user = new User();  // Configure User conforme necessário
        user.setId(1L);  // Defina um ID apropriado
        return userRepository.save(user);
    }

    private Vehicle createVehicle() {
        Vehicle vehicle = new Vehicle();  // Configure Vehicle conforme necessário
        vehicle.setId(1L);  // Defina um ID apropriado
        return vehicleRepository.save(vehicle);
    }

    @Test
    @DisplayName("Should save and find vehicle users by user ID")
    public void testSaveAndFindByUserId() {
        // Arrange
        User user = createUser();
        Vehicle vehicle = createVehicle();

        DataRegisterAutonomy dataRegister = new DataRegisterAutonomy(
            BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,BigDecimal.ONE);

        VehicleUser vehicleUser1 = new VehicleUser(user, vehicle, dataRegister);
        vehicleUserRepository.save(vehicleUser1);

        VehicleUser vehicleUser2 = new VehicleUser(user, vehicle, dataRegister);
        vehicleUserRepository.save(vehicleUser2);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleUser> page = vehicleUserRepository.findByUserId(user.getId(), pageable);

        // Assert
        assertFalse(page.getContent().isEmpty(), () -> "Vehicle users should be found by user ID");
        assertEquals(2, page.getTotalElements(), () -> "All vehicle users with the specified user ID should be present");
        assertTrue(page.getContent().stream().allMatch(vu -> vu.getUser().getId().equals(user.getId())),
                   () -> "All vehicle users should have the specified user ID");
    }

    @Test
    @DisplayName("Should save and find vehicle users by vehicle ID")
    public void testSaveAndFindByVehicleId() {
        // Arrange
        User user = createUser();
        Vehicle vehicle = createVehicle();

        DataRegisterAutonomy dataRegister = new DataRegisterAutonomy(
            BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,BigDecimal.ONE);

        VehicleUser vehicleUser1 = new VehicleUser(user, vehicle, dataRegister);
        vehicleUserRepository.save(vehicleUser1);

        VehicleUser vehicleUser2 = new VehicleUser(user, vehicle, dataRegister);
        vehicleUserRepository.save(vehicleUser2);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleUser> page = vehicleUserRepository.findByVehicleId(vehicle.getId(), pageable);

        // Assert
        assertFalse(page.getContent().isEmpty(), () -> "Vehicle users should be found by vehicle ID");
        assertEquals(2, page.getTotalElements(), () -> "All vehicle users with the specified vehicle ID should be present");
        assertTrue(page.getContent().stream().allMatch(vu -> vu.getVehicle().getId().equals(vehicle.getId())),
                   () -> "All vehicle users should have the specified vehicle ID");
    }

    @Test
    @DisplayName("Should save and find all activated vehicle users")
    public void testSaveAndFindAllActivated() {
        // Arrange
        User user = createUser();
        Vehicle vehicle = createVehicle();

        DataRegisterAutonomy dataRegister = new DataRegisterAutonomy(
            BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,BigDecimal.ONE);

        VehicleUser activeUser = new VehicleUser(user, vehicle, dataRegister);
        vehicleUserRepository.save(activeUser);

        VehicleUser inactiveUser = new VehicleUser(user, vehicle, dataRegister);
        inactiveUser.disable();
        vehicleUserRepository.save(inactiveUser);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleUser> page = vehicleUserRepository.findAllActivated(pageable);

        // Assert
        assertFalse(page.getContent().isEmpty(), () -> "Activated vehicle users should be found");
        assertEquals(1, page.getTotalElements(), () -> "Only activated vehicle users should be present");
        assertTrue(page.getContent().stream().allMatch(VehicleUser::isActivated),
                   () -> "All vehicle users should be activated");
    }

    @Test
    @DisplayName("Should return empty page when no vehicle users are present")
    public void testNoVehicleUsers() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleUser> pageByUserId = vehicleUserRepository.findByUserId(1L, pageable);
        Page<VehicleUser> pageByVehicleId = vehicleUserRepository.findByVehicleId(1L, pageable);
        Page<VehicleUser> pageActivated = vehicleUserRepository.findAllActivated(pageable);

        // Assert
        assertTrue(pageByUserId.getContent().isEmpty(), () -> "No vehicle users should be present for the user ID");
        assertTrue(pageByVehicleId.getContent().isEmpty(), () -> "No vehicle users should be present for the vehicle ID");
        assertTrue(pageActivated.getContent().isEmpty(), () -> "No activated vehicle users should be present");
    }

    @Test
    @DisplayName("Should handle pagination correctly for vehicle users")
    public void testPagination() {
        // Arrange
        User user = createUser();
        Vehicle vehicle = createVehicle();

        DataRegisterAutonomy dataRegister = new DataRegisterAutonomy(
            BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,BigDecimal.ONE);

        IntStream.range(0, 15).forEach(i -> {
            VehicleUser activeUser = new VehicleUser(user, vehicle, dataRegister);
            vehicleUserRepository.save(activeUser);
        });

        Pageable firstPage = PageRequest.of(0, 10);
        Pageable secondPage = PageRequest.of(1, 10);

        // Act
        Page<VehicleUser> firstPageResult = vehicleUserRepository.findAllActivated(firstPage);
        Page<VehicleUser> secondPageResult = vehicleUserRepository.findAllActivated(secondPage);

        // Assert
        assertEquals(10, firstPageResult.getContent().size(),
                     () -> "First page should contain 10 items");
        assertEquals(5, secondPageResult.getContent().size(),
                     () -> "Second page should contain 5 items");
        assertEquals(15, vehicleUserRepository.findAllActivated(PageRequest.of(0, 1000)).getTotalElements(),
                     () -> "Total elements should match the number of saved items");
    }
}
