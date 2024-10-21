package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity VehicleUser")
public class VehicleUserTest {

    private Faker faker;
    private User user;
    private Vehicle vehicle;
    private DataRegisterAutonomy dataRegisterAutonomy;
    private VehicleUser vehicleUser;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        user = new User(); 
        vehicle = new Vehicle(); 

        dataRegisterAutonomy = new DataRegisterAutonomy(
            BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)) // batteryCapacity
        );

        vehicleUser = new VehicleUser(user, vehicle, dataRegisterAutonomy);
    }

    @Test
    @DisplayName("Test creation of VehicleUser entity")
    void testVehicleUserCreation() {
        assertNotNull(vehicleUser, "VehicleUser should not be null");
        assertEquals(user, vehicleUser.getUser(), "User should be set correctly");
        assertEquals(vehicle, vehicleUser.getVehicle(), "Vehicle should be set correctly");
        assertEquals(dataRegisterAutonomy.mileagePerLiterRoad(), vehicleUser.getMileagePerLiterRoad(), "Mileage per liter road should be set correctly");
        assertEquals(dataRegisterAutonomy.mileagePerLiterCity(), vehicleUser.getMileagePerLiterCity(), "Mileage per liter city should be set correctly");
        assertEquals(dataRegisterAutonomy.consumptionEnergetic(), vehicleUser.getConsumptionEnergetic(), "Consumption energetic should be set correctly");
        assertEquals(dataRegisterAutonomy.autonomyElectricMode(), vehicleUser.getAutonomyElectricMode(), "Autonomy electric mode should be set correctly");
        assertEquals(dataRegisterAutonomy.batteryCapacity(), vehicleUser.getBatteryCapacity(), "Battery capacity should be set correctly");
        assertTrue(vehicleUser.isActivated(), "Activated status should default to true.");
    }

    @Test
    @DisplayName("Test updating VehicleUser entity with new values")
    void testVehicleUserUpdate() {
        DataUpdateAutonomy updateData = new DataUpdateAutonomy(
            BigDecimal.valueOf(faker.number().randomDouble(2, 10, 20)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 10, 20)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 10, 20)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 10, 20)),
            BigDecimal.valueOf(faker.number().randomDouble(2, 10, 20)) // batteryCapacity
        );

        vehicleUser.updateData(updateData);

        assertEquals(updateData.mileagePerLiterRoad(), vehicleUser.getMileagePerLiterRoad(), "Mileage per liter road should be updated.");
        assertEquals(updateData.mileagePerLiterCity(), vehicleUser.getMileagePerLiterCity(), "Mileage per liter city should be updated.");
        assertEquals(updateData.consumptionEnergetic(), vehicleUser.getConsumptionEnergetic(), "Consumption energetic should be updated.");
        assertEquals(updateData.autonomyElectricMode(), vehicleUser.getAutonomyElectricMode(), "Autonomy electric mode should be updated.");
        assertEquals(updateData.batteryCapacity(), vehicleUser.getBatteryCapacity(), "Battery capacity should be updated.");
    }

    @Test
    @DisplayName("Test disabling VehicleUser entity")
    void testVehicleUserDisable() {
        vehicleUser.disable();
        assertFalse(vehicleUser.isActivated(), "VehicleUser should be deactivated.");
    }

    @Test
    @DisplayName("Test enabling VehicleUser entity")
    void testVehicleUserEnable() {
        vehicleUser.disable(); // Primeiro desativa
        vehicleUser.enable(); // Em seguida, ativa novamente
        assertTrue(vehicleUser.isActivated(), "VehicleUser should be activated.");
    }

    @Test
    @DisplayName("Test updating VehicleUser entity with null values")
    void testVehicleUserUpdateWithNullValues() {
        DataUpdateAutonomy nullUpdateData = new DataUpdateAutonomy(
            null, null, null, null, null // Todos os valores nulos
        );

        vehicleUser.updateData(nullUpdateData);

        assertEquals(dataRegisterAutonomy.mileagePerLiterRoad(), vehicleUser.getMileagePerLiterRoad(), "Mileage per liter road should remain unchanged.");
        assertEquals(dataRegisterAutonomy.mileagePerLiterCity(), vehicleUser.getMileagePerLiterCity(), "Mileage per liter city should remain unchanged.");
        assertEquals(dataRegisterAutonomy.consumptionEnergetic(), vehicleUser.getConsumptionEnergetic(), "Consumption energetic should remain unchanged.");
        assertEquals(dataRegisterAutonomy.autonomyElectricMode(), vehicleUser.getAutonomyElectricMode(), "Autonomy electric mode should remain unchanged.");
        assertEquals(dataRegisterAutonomy.batteryCapacity(), vehicleUser.getBatteryCapacity(), "Battery capacity should remain unchanged.");
    }

    @Test
    @DisplayName("Test getter and setter for mileagePerLiterRoad")
    void testMileagePerLiterRoadGetterAndSetter() {
        BigDecimal mileagePerLiterRoad = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        vehicleUser.setMileagePerLiterRoad(mileagePerLiterRoad);
        assertEquals(mileagePerLiterRoad, vehicleUser.getMileagePerLiterRoad(), "Mileage per liter road should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for mileagePerLiterCity")
    void testMileagePerLiterCityGetterAndSetter() {
        BigDecimal mileagePerLiterCity = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        vehicleUser.setMileagePerLiterCity(mileagePerLiterCity);
        assertEquals(mileagePerLiterCity, vehicleUser.getMileagePerLiterCity(), "Mileage per liter city should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for consumptionEnergetic")
    void testConsumptionEnergeticGetterAndSetter() {
        BigDecimal consumptionEnergetic = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        vehicleUser.setConsumptionEnergetic(consumptionEnergetic);
        assertEquals(consumptionEnergetic, vehicleUser.getConsumptionEnergetic(), "Consumption energetic should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for autonomyElectricMode")
    void testAutonomyElectricModeGetterAndSetter() {
        BigDecimal autonomyElectricMode = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        vehicleUser.setAutonomyElectricMode(autonomyElectricMode);
        assertEquals(autonomyElectricMode, vehicleUser.getAutonomyElectricMode(), "Autonomy electric mode should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for batteryCapacity")
    void testBatteryCapacityGetterAndSetter() {
        BigDecimal batteryCapacity = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        vehicleUser.setBatteryCapacity(batteryCapacity);
        assertEquals(batteryCapacity, vehicleUser.getBatteryCapacity(), "Battery capacity should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        boolean activated = faker.bool().bool();
        vehicleUser.setActivated(activated);
        assertEquals(activated, vehicleUser.isActivated(), "Activated status should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        VehicleUser vehicleUser = new VehicleUser();

        assertNotNull(vehicleUser, "VehicleUser instance should be created with no-args constructor.");
        assertNull(vehicleUser.getUser(), "User should be null by default.");
        assertNull(vehicleUser.getVehicle(), "Vehicle should be null by default.");
        assertNull(vehicleUser.getMileagePerLiterRoad(), "Mileage per liter road should be null by default.");
        assertNull(vehicleUser.getMileagePerLiterCity(), "Mileage per liter city should be null by default.");
        assertNull(vehicleUser.getConsumptionEnergetic(), "Consumption energetic should be null by default.");
        assertNull(vehicleUser.getAutonomyElectricMode(), "Autonomy electric mode should be null by default.");
        assertNull(vehicleUser.getBatteryCapacity(), "Battery capacity should be null by default.");

        vehicleUser.setActivated(true); 

        assertTrue(vehicleUser.isActivated(), "Activated status should default to true.");
    }

}
