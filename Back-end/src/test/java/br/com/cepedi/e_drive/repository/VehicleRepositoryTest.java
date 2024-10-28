package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.*;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Autowired
    private AutonomyRepository autonomyRepository;

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private BrandRepository brandRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();

        // Clean repositories before each test
        vehicleRepository.deleteAll();
        categoryRepository.deleteAll();
        vehicleTypeRepository.deleteAll();
        propulsionRepository.deleteAll();
        autonomyRepository.deleteAll();
        modelRepository.deleteAll();
        brandRepository.deleteAll();
    }

    private Vehicle createTestVehicle() {
        Category category = new Category(null, faker.company().name(), faker.bool().bool());
        categoryRepository.save(category);

        VehicleType type = new VehicleType(null, faker.company().name(), faker.bool().bool());
        vehicleTypeRepository.save(type);

        Propulsion propulsion = new Propulsion(null, faker.company().name(), faker.bool().bool());
        propulsionRepository.save(propulsion);

        Autonomy autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))

        );
        autonomyRepository.save(autonomy);

        Vehicle vehicle = new Vehicle(
                faker.company().catchPhrase(),
                faker.company().bs(),
                null,
                category,
                type,
                propulsion,
                autonomy,
                null
        );
        return vehicleRepository.save(vehicle);
    }

    @Test
    @DisplayName("Should save and find vehicle by ID")
    public void testSaveAndFindById() {
        // Arrange
        Vehicle savedVehicle = createTestVehicle();

        // Act
        Vehicle foundVehicle = vehicleRepository.findById(savedVehicle.getId())
                .orElse(null);

        // Assert
        assertNotNull(foundVehicle, () -> "Vehicle should be found");
        assertEquals(savedVehicle.getId(), foundVehicle.getId(), () -> "Vehicle ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by category ID")
    public void testFindByCategoryId() {
        // Arrange
        Vehicle savedVehicle = createTestVehicle();

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByCategoryId(savedVehicle.getCategory().getId(), Pageable.unpaged())
                .getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), () -> "Vehicles should be found by category ID");
        assertEquals(savedVehicle.getCategory().getId(), vehicles.get(0).getCategory().getId(), () -> "Category ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by type ID")
    public void testFindByTypeId() {
        // Arrange
        Vehicle savedVehicle = createTestVehicle();

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByTypeId(savedVehicle.getType().getId(), Pageable.unpaged())
                .getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), () -> "Vehicles should be found by type ID");
        assertEquals(savedVehicle.getType().getId(), vehicles.get(0).getType().getId(), () -> "Type ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by propulsion ID")
    public void testFindByPropulsionId() {
        // Arrange
        Vehicle savedVehicle = createTestVehicle();

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByPropulsionId(savedVehicle.getPropulsion().getId(), Pageable.unpaged())
                .getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), () -> "Vehicles should be found by propulsion ID");
        assertEquals(savedVehicle.getPropulsion().getId(), vehicles.get(0).getPropulsion().getId(), () -> "Propulsion ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by autonomy ID")
    public void testFindByAutonomyId() {
        // Arrange
        Vehicle savedVehicle = createTestVehicle();

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByAutonomyId(savedVehicle.getAutonomy().getId(), Pageable.unpaged())
                .getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), () -> "Vehicles should be found by autonomy ID");
        assertEquals(savedVehicle.getAutonomy().getId(), vehicles.get(0).getAutonomy().getId(), () -> "Autonomy ID should match");
    }
}
