package br.com.cepedi.e_drive.service.vehicle;

import br.com.cepedi.e_drive.model.entitys.*;
import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.details.DataVehicleDetails;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.*;
import br.com.cepedi.e_drive.service.vehicle.validations.disabled.ValidationDisabledVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.register.ValidationRegisterVehicle;
import br.com.cepedi.e_drive.service.vehicle.validations.update.ValidationUpdateVehicle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("VehicleService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class VehicleServiceTest {

	@InjectMocks
	private VehicleService vehicleService;

	@Mock
	private VehicleRepository vehicleRepository;

	@Mock
	private ModelRepository modelRepository;

	@Mock
	private CategoryRepository categoryRepository;


	@Mock
	private PropulsionRepository propulsionRepository;

	@Mock
	private VehicleTypeRepository vehicleTypeRepository;

	@Mock
	private AutonomyRepository autonomyRepository;

	@Mock
	private List<ValidationDisabledVehicle> validationDisabledVehicleList;

	@Mock
	private List<ValidationUpdateVehicle> validationUpdateVehicleList;


	@Mock
	private List<ValidationRegisterVehicle> validationRegisterVehicleList;



	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
    @DisplayName("Should register a vehicle correctly")
    void testRegister() {
        // Arrange
        // Arrange
        Brand mockBrand = new Brand();
        mockBrand.setId(1L);
        mockBrand.setName("BrandName");

        Model mockModel = new Model();
        mockModel.setId(1L);
        mockModel.setName("ModelName");
        mockModel.setBrand(mockBrand);


        Category mockCategory = new Category();
        mockCategory.setId(2L);

        Propulsion mockPropulsion = new Propulsion();
        mockPropulsion.setId(3L);

        VehicleType mockVehicleType = new VehicleType();
        mockVehicleType.setId(4L);

        Autonomy mockAutonomy = new Autonomy(null, new BigDecimal("12.5"), new BigDecimal("10.0"), new BigDecimal("8.5"), null);

        Vehicle mockVehicle = new Vehicle();
        mockVehicle.setId(1L);
        mockVehicle.setMotor("V8 Engine");
        mockVehicle.setVersion("2024 Model");
        mockVehicle.setModel(mockModel);
        mockVehicle.setCategory(mockCategory);
        mockVehicle.setPropulsion(mockPropulsion);
        mockVehicle.setType(mockVehicleType);
        mockVehicle.setAutonomy(mockAutonomy);

        when(modelRepository.getReferenceById(anyLong())).thenReturn(mockModel);
        when(categoryRepository.getReferenceById(anyLong())).thenReturn(mockCategory);
        when(propulsionRepository.getReferenceById(anyLong())).thenReturn(mockPropulsion);
        when(vehicleTypeRepository.getReferenceById(anyLong())).thenReturn(mockVehicleType);
        when(autonomyRepository.save(any(Autonomy.class))).thenReturn(mockAutonomy);
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(mockVehicle);

        DataRegisterAutonomy dataRegisterAutonomy = new DataRegisterAutonomy(
                new BigDecimal("12.5"),
                new BigDecimal("10.0"),
                new BigDecimal("8.5"),
                new BigDecimal("100.0"), null
        );

        DataRegisterVehicle data = new DataRegisterVehicle(
                "V8 Engine",
                "2024 Model",
                1L,
                2L,
                4L,
                3L,
                2024L,
                dataRegisterAutonomy
        );

        // Act
        DataVehicleDetails result = vehicleService.register(data);

        // Assert
        assertNotNull(result, () -> "The registered vehicle details should not be null.");
        assertEquals(1L, result.id(), () -> "The vehicle ID should match.");
        assertEquals("V8 Engine", result.motor(), () -> "The vehicle motor should match.");
        assertEquals("2024 Model", result.version(), () -> "The vehicle version should match.");
    }

    @Test
    @DisplayName("Should get all vehicles correctly")
    void testGetAllVehicles() {
        // Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("V8 Engine");
        vehicle.setVersion("2024 Model");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("BrandName");

        Model model = new Model();
        model.setId(1L);
        model.setName("ModelName");
        model.setBrand(brand);
        vehicle.setModel(model);

        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(1L);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findAll(any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getAllVehicles(Pageable.unpaged());

        // Assert
        assertNotNull(result, () -> "The result page should not be null.");
        assertFalse(result.isEmpty(), () -> "The result page should not be empty.");
        assertEquals(1, result.getTotalElements(), () -> "The total number of elements should match.");
        assertEquals(1L, result.getContent().get(0).id(), () -> "The vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "The vehicle motor should match.");
    }

    @Test
    @DisplayName("Should get vehicles by category correctly")
    void testGetVehiclesByCategory() {
        // Arrange

        Brand brand = new Brand();
        brand.setId(1L);


        Model model = new Model();
        model.setId(1L);
        model.setBrand(brand);

        Category category = new Category();
        category.setId(1L);

        VehicleType type = new VehicleType();
        type.setId(1L);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);

        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setModel(model);
        vehicle.setCategory(category);
        vehicle.setType(type);
        vehicle.setPropulsion(propulsion);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));

        when(vehicleRepository.findByCategoryId(eq(1L), any(Pageable.class)))
                .thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByCategory(1L, PageRequest.of(0, 10));

        // Assert
        assertNotNull(result, () -> "The result page should not be null.");
        assertEquals(1, result.getTotalElements(), () -> "The total number of elements should match.");
    }


    @Test
    @DisplayName("Should return vehicles by model ID")
    void testGetVehiclesByModel() {
        // Arrange
        Long modelId = 1L;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("V8 Engine");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("BrandName");

        Model model = new Model();
        model.setId(1L);
        model.setName("ModelName");
        model.setBrand(brand);
        vehicle.setModel(model);

        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(1L);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findByModelId(eq(modelId), any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByModel(modelId, Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty(), () -> "Result should not be empty.");
        assertEquals(1L, result.getContent().get(0).id(), () -> "Vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "Vehicle motor should match.");
    }

    @Test
    @DisplayName("Should return vehicles by type ID")
    void testGetVehiclesByType() {
        // Arrange
        Long typeId = 4L;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("V8 Engine");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("BrandName");

        Model model = new Model();
        model.setId(1L);
        model.setName("ModelName");
        model.setBrand(brand);
        vehicle.setModel(model);


        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(typeId);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findByTypeId(eq(typeId), any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByType(typeId, Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty(), () -> "Result should not be empty.");
        assertEquals(1L, result.getContent().get(0).id(), () -> "Vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "Vehicle motor should match.");
    }

    @Test
    @DisplayName("Should return vehicles by brand ID")
    void testGetVehiclesByBrand() {
        // Arrange
        Long brandId = 3L;
        Brand brand = new Brand();
        brand.setId(brandId);

        Model model = new Model();
        model.setId(1L);
        model.setBrand(brand); // Certifique-se de setar a marca corretamente.

        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("V8 Engine");
        vehicle.setModel(model);

        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(1L);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findByBrandId(eq(brandId), any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByBrand(brandId, Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty(), () -> "Result should not be empty.");
        assertEquals(1L, result.getContent().get(0).id(), () -> "Vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "Vehicle motor should match.");
    }

    @Test
    @DisplayName("Should return vehicles by propulsion ID")
    void testGetVehiclesByPropulsion() {
        // Arrange
        Long propulsionId = 1L;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("Motor");
        vehicle.setVersion("Version");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("BrandName");

        Model model = new Model();
        model.setId(1L);
        model.setName("ModelName");
        model.setBrand(brand);
        vehicle.setModel(model);

        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(1L);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(propulsionId);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(1L);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findByPropulsionId(eq(propulsionId), any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByPropulsion(propulsionId, PageRequest.of(0, 10));

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements(), () -> "Total elements should match.");
        assertEquals(vehicle.getId(), result.getContent().get(0).id(), () -> "Vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "Vehicle motor should match.");
    }


    @Test
    @DisplayName("Should return vehicles by autonomy ID")
    void testGetVehiclesByAutonomy() {
        // Arrange
        Long autonomyId = 5L;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(1L);
        vehicle.setMotor("V8 Engine");

        Brand brand = new Brand();
        brand.setId(1L);
        brand.setName("BrandName");

        Model model = new Model();
        model.setId(1L);
        model.setName("ModelName");
        model.setBrand(brand);
        vehicle.setModel(model);


        Category category = new Category();
        category.setId(1L);
        vehicle.setCategory(category);

        VehicleType type = new VehicleType();
        type.setId(1L);
        vehicle.setType(type);

        Propulsion propulsion = new Propulsion();
        propulsion.setId(1L);
        vehicle.setPropulsion(propulsion);

        Autonomy autonomy = new Autonomy();
        autonomy.setId(autonomyId);
        vehicle.setAutonomy(autonomy);

        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findByAutonomyId(eq(autonomyId), any(Pageable.class))).thenReturn(vehiclePage);

        // Act
        Page<DataVehicleDetails> result = vehicleService.getVehiclesByAutonomy(autonomyId, Pageable.unpaged());

        // Assert
        assertNotNull(result);
        assertFalse(result.isEmpty(), () -> "Result should not be empty.");
        assertEquals(1L, result.getContent().get(0).id(), () -> "Vehicle ID should match.");
        assertEquals(vehicle.getMotor(), result.getContent().get(0).motor(), () -> "Vehicle motor should match.");
    }

    @Test
    @DisplayName("Should enable vehicle correctly")
    void testEnableVehicle() {
        // Arrange
        Long vehicleId = 1L;
        Vehicle vehicle = new Vehicle();
        vehicle.setId(vehicleId);

        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(vehicle);

        // Act
        vehicleService.enableVehicle(vehicleId);

        // Assert
        assertTrue(vehicle.isActivated(), "Vehicle should be enabled.");
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    @DisplayName("Should update vehicle details correctly")
    void testUpdateVehicle() {
        // Arrange
        Long vehicleId = 1L;
        Long modelId = 10L;
        Long categoryId = 2L;
        Long vehicleTypeId = 4L;
        Long propulsionId = 3L;
        Long autonomyId = 5L;

        // Criação da Brand e associação com Model
        Brand mockBrand = mock(Brand.class);
        when(mockBrand.getId()).thenReturn(1L);
        when(mockBrand.getName()).thenReturn("BrandName");

        Model mockModel = mock(Model.class);
        when(mockModel.getId()).thenReturn(modelId);
        when(mockModel.getBrand()).thenReturn(mockBrand);

        Category mockCategory = mock(Category.class);
        when(mockCategory.getId()).thenReturn(categoryId);

        Propulsion mockPropulsion = mock(Propulsion.class);
        when(mockPropulsion.getId()).thenReturn(propulsionId);

        VehicleType mockVehicleType = mock(VehicleType.class);
        when(mockVehicleType.getId()).thenReturn(vehicleTypeId);

        // Mock de Autonomy
        Autonomy mockAutonomy = mock(Autonomy.class);
        when(mockAutonomy.getId()).thenReturn(autonomyId);

        // Mock de DataRegisterAutonomy
        DataRegisterAutonomy mockDataRegisterAutonomy = mock(DataRegisterAutonomy.class);
        when(mockDataRegisterAutonomy.mileagePerLiterRoad()).thenReturn(new BigDecimal("12.5"));
        when(mockDataRegisterAutonomy.mileagePerLiterCity()).thenReturn(new BigDecimal("10.0"));
        when(mockDataRegisterAutonomy.consumptionEnergetic()).thenReturn(new BigDecimal("8.5"));
        when(mockDataRegisterAutonomy.autonomyElectricMode()).thenReturn(new BigDecimal("100.0"));

        // Mock de Vehicle
        Vehicle mockVehicle = mock(Vehicle.class);
        when(mockVehicle.getId()).thenReturn(vehicleId);
        when(mockVehicle.getModel()).thenReturn(mockModel);
        when(mockVehicle.getCategory()).thenReturn(mockCategory);
        when(mockVehicle.getPropulsion()).thenReturn(mockPropulsion);
        when(mockVehicle.getAutonomy()).thenReturn(mockAutonomy); // Aqui você associa o mock de Autonomy
        when(mockVehicle.getType()).thenReturn(mockVehicleType);

        DataUpdateVehicle dataUpdateVehicle = new DataUpdateVehicle(
                "New Motor",
                "New Version",
                modelId,
                categoryId,
                vehicleTypeId,
                autonomyId,
                propulsionId,
                2024L,
                mockDataRegisterAutonomy // Use o mock de DataRegisterAutonomy
        );

        // Configuração dos repositórios
        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(mockVehicle);
        when(autonomyRepository.getReferenceById(autonomyId)).thenReturn(mockAutonomy); // Mock do repositório de autonomia
        when(categoryRepository.getReferenceById(categoryId)).thenReturn(mockCategory);
        when(propulsionRepository.getReferenceById(propulsionId)).thenReturn(mockPropulsion);
        when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(mockVehicleType);
        when(modelRepository.getReferenceById(modelId)).thenReturn(mockModel);

        doAnswer(invocation -> {
            DataUpdateVehicle data = invocation.getArgument(0);
            when(mockVehicle.getMotor()).thenReturn(data.motor());
            when(mockVehicle.getVersion()).thenReturn(data.version());
            return null;
        }).when(mockVehicle).updateDataVehicle(
                any(DataUpdateVehicle.class),
                any(Model.class),
                any(Category.class),
                any(VehicleType.class),
                any(Propulsion.class)
        );

        // Act
        DataVehicleDetails result = vehicleService.updateVehicle(dataUpdateVehicle, vehicleId);

        // Assert
        verify(vehicleRepository).save(mockVehicle);
        assertNotNull(result, () -> "Result should not be null.");
        assertEquals(vehicleId, result.id(), () -> "Vehicle ID should match.");
        assertEquals("New Motor", result.motor(), () -> "Motor should be updated.");
        assertEquals("New Version", result.version(), () -> "Version should be updated.");
        verify(mockAutonomy).updateAutonomy(mockDataRegisterAutonomy); // Verifica se a autonomia foi atualizada
    }


    @Test
    @DisplayName("Should disable vehicle correctly")
    void testDisableVehicle() {
        // Arrange
        Long vehicleId = 1L;
        Vehicle mockVehicle = mock(Vehicle.class);

        when(vehicleRepository.getReferenceById(vehicleId)).thenReturn(mockVehicle);
        doNothing().when(mockVehicle).disable();

        // Act
        vehicleService.disableVehicle(vehicleId);

        // Assert
        verify(vehicleRepository).getReferenceById(vehicleId);
        verify(mockVehicle).disable();
        verify(vehicleRepository).save(mockVehicle);
    }




}
