package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Vehicle")
public class VehicleTest {

    private Faker faker;
    private Vehicle vehicle;
    private Category category;
    private VehicleType type;
    private Propulsion propulsion;
    private Autonomy autonomy;

    @BeforeEach
    void setUp() {
        faker = new Faker();

        // Criação das instâncias associadas
        category = new Category(null, faker.company().name(), faker.bool().bool());
        type = new VehicleType(null, faker.company().name(), faker.bool().bool());
        propulsion = new Propulsion(null, faker.company().name(), faker.bool().bool());

        // Criação da instância de Autonomy
        autonomy = new Autonomy(
                null,
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100)),
                new BigDecimal(faker.number().randomDouble(2, 1, 100))
        );

        // Criação da instância de Vehicle
        vehicle = new Vehicle(
                faker.company().catchPhrase(), // Motor
                faker.company().bs(),           // Versão
                null,                            // Model pode ser nulo
                category,                       // Categoria
                type,                           // Tipo
                propulsion,                     // Propulsão
                autonomy,                       // Autonomia
                null                            // O ano pode ser nulo para o teste inicial
        );

    }

    @Test
    @DisplayName("Test creation of Vehicle entity")
    void testVehicleCreation() {
        assertNotNull(vehicle, "Vehicle should not be null");
        assertNotNull(vehicle.getMotor(), "Motor should not be null");
        assertNotNull(vehicle.getVersion(), "Version should not be null");
        assertTrue(vehicle.isActivated(), "Activated should be true");
        assertNotNull(vehicle.getCategory(), "Category should not be null");
        assertNotNull(vehicle.getType(), "Type should not be null");
        assertNotNull(vehicle.getPropulsion(), "Propulsion should not be null");
        assertNotNull(vehicle.getAutonomy(), "Autonomy should not be null");
    }



    @Test
    @DisplayName("Should activate the vehicle")
    public void testEnable() {
        // Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.disable(); 

        // Act
        vehicle.enable(); 

        // Assert
        assertTrue(vehicle.isActivated(), "O veículo deve estar ativado.");
    }

    @Test
    @DisplayName("Should deactivate the vehicle")
    public void testDisable() {
        // Arrange
        Vehicle vehicle = new Vehicle();
        vehicle.enable();

        // Act
        vehicle.disable(); 

        // Assert
        assertFalse(vehicle.isActivated(), "O veículo deve estar desativado.");
    }

    @Test
    @DisplayName("Should update vehicle data with new values")
    public void testUpdateDataVehicle() {
        // Arrange
        Vehicle vehicle = new Vehicle();
        Model model = new Model(); 
        Category category = new Category(); 
        VehicleType type = new VehicleType();
        Propulsion propulsion = new Propulsion(); 
        
        DataUpdateVehicle data = mock(DataUpdateVehicle.class);
        when(data.motor()).thenReturn(faker.company().catchPhrase());
        when(data.version()).thenReturn(faker.company().bs());
        when(data.year()).thenReturn((long) faker.number().numberBetween(2000, 2024));

        // Act
        vehicle.updateDataVehicle(data, model, category, type, propulsion);

        // Assert
        assertEquals(data.motor(), vehicle.getMotor(), "The motor should be updated.");
        assertEquals(data.version(), vehicle.getVersion(), "The version should be updated.");
        assertEquals(data.year(), vehicle.getYear(), "The year should be updated.");
        assertEquals(model, vehicle.getModel(), "The model should be updated.");
        assertEquals(category, vehicle.getCategory(), "The category should be updated.");
        assertEquals(type, vehicle.getType(), "The type should be updated.");
        assertEquals(propulsion, vehicle.getPropulsion(), "The propulsion should be updated.");
    }


}
