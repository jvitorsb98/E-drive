package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.*;
import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
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

        // Limpar repositórios antes de cada teste
        vehicleRepository.deleteAll();
        categoryRepository.deleteAll();
        vehicleTypeRepository.deleteAll();
        propulsionRepository.deleteAll();
        autonomyRepository.deleteAll();
        modelRepository.deleteAll();
        brandRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve salvar e encontrar veículo por ID")
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
        assertNotNull(foundVehicle, "Veículo deve ser encontrado");
        assertEquals(savedVehicle.getId(), foundVehicle.getId(), "ID do veículo deve coincidir");
    }

    @Test
    @DisplayName("Deve encontrar veículos por ID da categoria")
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
        assertFalse(vehicles.isEmpty(), "Veículos devem ser encontrados pelo ID da categoria");
        assertEquals(category.getId(), vehicles.get(0).getCategory().getId(), "ID da categoria deve coincidir");
    }

    @Test
    @DisplayName("Deve encontrar veículos por ID do tipo")
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
        assertFalse(vehicles.isEmpty(), "Veículos devem ser encontrados pelo ID do tipo");
        assertEquals(type.getId(), vehicles.get(0).getType().getId(), "ID do tipo deve coincidir");
    }

    @Test
    @DisplayName("Deve encontrar veículos por ID da propulsão")
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
        assertFalse(vehicles.isEmpty(), "Veículos devem ser encontrados pelo ID da propulsão");
        assertEquals(propulsion.getId(), vehicles.get(0).getPropulsion().getId(), "ID da propulsão deve coincidir");
    }

    @Test
    @DisplayName("Deve encontrar veículos por ID da autonomia")
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
        assertFalse(vehicles.isEmpty(), "Veículos devem ser encontrados pelo ID da autonomia");
        assertEquals(autonomy.getId(), vehicles.get(0).getAutonomy().getId(), "ID da autonomia deve coincidir");
    }
}
