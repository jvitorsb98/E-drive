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

        // Clear repositories before each test
        vehicleRepository.deleteAll();
        categoryRepository.deleteAll();
        vehicleTypeRepository.deleteAll();
        propulsionRepository.deleteAll();
        autonomyRepository.deleteAll();
        modelRepository.deleteAll();
        brandRepository.deleteAll();
    }

    @Test
    @DisplayName("Should save and find vehicle by ID")
    public void testSaveAndFindById() {
        // Arrange
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
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Act
        Vehicle foundVehicle = vehicleRepository.findById(savedVehicle.getId()).orElse(null);

        // Assert
        assertNotNull(foundVehicle, "Vehicle should be found");
        assertEquals(savedVehicle.getId(), foundVehicle.getId(), "Vehicle ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by category ID")
    public void testFindByCategoryId() {
        // Arrange
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
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByCategoryId(category.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by category ID");
        assertEquals(category.getId(), vehicles.get(0).getCategory().getId(), "Category ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by type ID")
    public void testFindByTypeId() {
        // Arrange
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
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByTypeId(type.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by type ID");
        assertEquals(type.getId(), vehicles.get(0).getType().getId(), "Type ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by propulsion ID")
    public void testFindByPropulsionId() {
        // Arrange
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
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByPropulsionId(propulsion.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by propulsion ID");
        assertEquals(propulsion.getId(), vehicles.get(0).getPropulsion().getId(), "Propulsion ID should match");
    }

    @Test
    @DisplayName("Should find vehicles by autonomy ID")
    public void testFindByAutonomyId() {
        // Arrange
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
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByAutonomyId(autonomy.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by autonomy ID");
        assertEquals(autonomy.getId(), vehicles.get(0).getAutonomy().getId(), "Autonomy ID should match");
    }
    


    
    
    
    
    
    
    
    @Test
    @DisplayName("Should find all vehicles")
    public void testFindAllVehicles() {
        // Arrange
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
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findAllVehicles(Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found");
    }

    @Test
    @DisplayName("Should find vehicles by model ID")
    public void testFindByModelId() {
        // Arrange
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

        Brand brand = new Brand(null, faker.company().name(),faker.bool().bool());
        brandRepository.save(brand);

        // Usando o construtor com todos os argumentos
        Model model = new Model(null, faker.company().name(), brand, faker.bool().bool());
        modelRepository.save(model);

        Vehicle vehicle = new Vehicle(
                faker.company().catchPhrase(),
                faker.company().bs(),
                model,
                category,
                type,
                propulsion,
                autonomy,
                null
        );
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByModelId(model.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by model ID");
        assertEquals(model.getId(), vehicles.get(0).getModel().getId(), "Model ID should match");
    }


    @Test
    @DisplayName("Should find vehicles by brand ID")
    public void testFindByBrandId() {
        // Arrange
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

        Brand brand = new Brand(null, faker.company().name(), faker.bool().bool());
        brandRepository.save(brand);

        Model model = new Model(null, faker.company().name(), brand, faker.bool().bool());
        modelRepository.save(model);


        Vehicle vehicle = new Vehicle(
                faker.company().catchPhrase(),
                faker.company().bs(),
                model,
                category,
                type,
                propulsion,
                autonomy,
                null
        );
        vehicleRepository.save(vehicle);

        // Act
        List<Vehicle> vehicles = vehicleRepository.findByBrandId(brand.getId(), Pageable.unpaged()).getContent();

        // Assert
        assertFalse(vehicles.isEmpty(), "Vehicles should be found by brand ID");
        assertEquals(brand.getId(), vehicles.get(0).getModel().getBrand().getId(), "Brand ID should match");
    }

}

