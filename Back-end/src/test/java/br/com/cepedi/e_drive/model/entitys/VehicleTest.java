package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

public class VehicleTest {

    private Faker faker;
    private Vehicle vehicle;
    private Model model;
    private Category category;
    private VehicleType type;
    private Propulsion propulsion;
    private Autonomy autonomy;
    private DataUpdateVehicle dataUpdateVehicle;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        model = Mockito.mock(Model.class);
        category = Mockito.mock(Category.class);
        type = Mockito.mock(VehicleType.class);
        propulsion = Mockito.mock(Propulsion.class);
        autonomy = Mockito.mock(Autonomy.class);

        dataUpdateVehicle = Mockito.mock(DataUpdateVehicle.class);
        vehicle = new Vehicle(
                faker.lorem().word(),
                faker.lorem().word(),
                model,
                category,
                type,
                propulsion,
                autonomy,
                faker.number().randomNumber()
        );
    }

    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        // Arrange
        String motor = faker.lorem().word();
        String version = faker.lorem().word();
        Long year = faker.number().randomNumber();

        // Act
        Vehicle vehicle = new Vehicle(motor, version, model, category, type, propulsion, autonomy, year);

        // Assert
        assertNotNull(vehicle, () -> "Vehicle instance should be created with all-args constructor.");
        assertEquals(motor, vehicle.getMotor(), () -> "Motor should be initialized correctly.");
        assertEquals(version, vehicle.getVersion(), () -> "Version should be initialized correctly.");
        assertEquals(year, vehicle.getYear(), () -> "Year should be initialized correctly.");
        assertEquals(model, vehicle.getModel(), () -> "Model should be initialized correctly.");
        assertEquals(category, vehicle.getCategory(), () -> "Category should be initialized correctly.");
        assertEquals(type, vehicle.getType(), () -> "Type should be initialized correctly.");
        assertEquals(propulsion, vehicle.getPropulsion(), () -> "Propulsion should be initialized correctly.");
        assertEquals(autonomy, vehicle.getAutonomy(), () -> "Autonomy should be initialized correctly.");
        assertTrue(vehicle.isActivated(), () -> "Activated should be initialized to true by default.");
    }

    @Test
    @DisplayName("Test updating Vehicle with new values")
    void testUpdateVehicle() {
        // Arrange
        String newMotor = faker.lorem().word();
        String newVersion = faker.lorem().word();
        Long newYear = faker.number().randomNumber();
        Model newModel = Mockito.mock(Model.class);
        Category newCategory = Mockito.mock(Category.class);
        VehicleType newType = Mockito.mock(VehicleType.class);
        Propulsion newPropulsion = Mockito.mock(Propulsion.class);

        Mockito.when(dataUpdateVehicle.motor()).thenReturn(newMotor);
        Mockito.when(dataUpdateVehicle.version()).thenReturn(newVersion);
        Mockito.when(dataUpdateVehicle.year()).thenReturn(newYear);

        // Act
        vehicle.updateDataVehicle(dataUpdateVehicle, newModel, newCategory, newType, newPropulsion);

        // Assert
        assertEquals(newMotor, vehicle.getMotor(), () -> "Motor should be updated.");
        assertEquals(newVersion, vehicle.getVersion(), () -> "Version should be updated.");
        assertEquals(newYear, vehicle.getYear(), () -> "Year should be updated.");
        assertEquals(newModel, vehicle.getModel(), () -> "Model should be updated.");
        assertEquals(newCategory, vehicle.getCategory(), () -> "Category should be updated.");
        assertEquals(newType, vehicle.getType(), () -> "Type should be updated.");
        assertEquals(newPropulsion, vehicle.getPropulsion(), () -> "Propulsion should be updated.");
    }

    @Test
    @DisplayName("Test updating Vehicle with null values")
    void testUpdateVehicleWithNullValues() {
        // Arrange
        String originalMotor = vehicle.getMotor();
        String originalVersion = vehicle.getVersion();
        Long originalYear = vehicle.getYear();
        Model originalModel = vehicle.getModel();
        Category originalCategory = vehicle.getCategory();
        VehicleType originalType = vehicle.getType();
        Propulsion originalPropulsion = vehicle.getPropulsion();

        Mockito.when(dataUpdateVehicle.motor()).thenReturn(null);
        Mockito.when(dataUpdateVehicle.version()).thenReturn(null);
        Mockito.when(dataUpdateVehicle.year()).thenReturn(null);

        // Act
        vehicle.updateDataVehicle(dataUpdateVehicle, null, null, null, null);

        // Assert
        assertEquals(originalMotor, vehicle.getMotor(), () -> "Motor should not change when the new motor is null.");
        assertEquals(originalVersion, vehicle.getVersion(), () -> "Version should not change when the new version is null.");
        assertEquals(originalYear, vehicle.getYear(), () -> "Year should not change when the new year is null.");
        assertEquals(originalModel, vehicle.getModel(), () -> "Model should not change when the new model is null.");
        assertEquals(originalCategory, vehicle.getCategory(), () -> "Category should not change when the new category is null.");
        assertEquals(originalType, vehicle.getType(), () -> "Type should not change when the new type is null.");
        assertEquals(originalPropulsion, vehicle.getPropulsion(), () -> "Propulsion should not change when the new propulsion is null.");
    }

    @Test
    @DisplayName("Test activating Vehicle")
    void testActivateVehicle() {
        // Act
        vehicle.disable();
        assertFalse(vehicle.isActivated(), () -> "Vehicle should be deactivated.");

        vehicle.enable();
        assertTrue(vehicle.isActivated(), () -> "Vehicle should be activated.");
    }

    @Test
    @DisplayName("Test deactivating Vehicle")
    void testDeactivateVehicle() {
        // Act
        vehicle.enable();
        assertTrue(vehicle.isActivated(), () -> "Vehicle should be activated.");

        vehicle.disable();
        assertFalse(vehicle.isActivated(), () -> "Vehicle should be deactivated.");
    }

    @Test
    @DisplayName("Test getter and setter for motor")
    void testMotorGetterAndSetter() {
        // Arrange
        String motor = faker.lorem().word();

        // Act
        vehicle.setMotor(motor);
        String retrievedMotor = vehicle.getMotor();

        // Assert
        assertEquals(motor, retrievedMotor, () -> "The motor should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for version")
    void testVersionGetterAndSetter() {
        // Arrange
        String version = faker.lorem().word();

        // Act
        vehicle.setVersion(version);
        String retrievedVersion = vehicle.getVersion();

        // Assert
        assertEquals(version, retrievedVersion, () -> "The version should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for year")
    void testYearGetterAndSetter() {
        // Arrange
        Long year = faker.number().randomNumber();

        // Act
        vehicle.setYear(year);
        Long retrievedYear = vehicle.getYear();

        // Assert
        assertEquals(year, retrievedYear, () -> "The year should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        // Arrange
        boolean activated = faker.bool().bool();

        // Act
        vehicle.setActivated(activated);
        boolean retrievedActivated = vehicle.isActivated();

        // Assert
        assertEquals(activated, retrievedActivated, () -> "The activated status should be set and retrieved correctly.");
    }
}
