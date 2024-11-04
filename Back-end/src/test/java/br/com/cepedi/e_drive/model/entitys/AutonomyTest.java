package br.com.cepedi.e_drive.model.entitys;

import com.github.javafaker.Faker;
import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Autonomy")
public class AutonomyTest {

    private Faker faker;
    private Autonomy autonomy;

    @BeforeEach
    void setUp() {
        faker = new Faker();

        DataRegisterAutonomy data = new DataRegisterAutonomy(
                new BigDecimal(faker.number().randomDouble(2, 1, 10)),
                new BigDecimal(faker.number().randomDouble(2, 1, 10)),
                new BigDecimal(faker.number().randomDouble(2, 1, 10)),
                new BigDecimal(faker.number().randomDouble(2, 1, 10)),
                new BigDecimal(faker.number().randomDouble(2, 1, 10)) // batteryCapacity
        );

        autonomy = new Autonomy(data);
    }

    @Test
    @DisplayName("Test creation of Autonomy entity")
    void testAutonomyCreation() {
        assertNotNull(autonomy, "Autonomy should not be null");
        assertNotNull(autonomy.getMileagePerLiterRoad(), () -> "Mileage per liter road should not be null");
        assertNotNull(autonomy.getMileagePerLiterCity(), () -> "Mileage per liter city should not be null");
        assertNotNull(autonomy.getConsumptionEnergetic(), () -> "Consumption energetic should not be null");
        assertNotNull(autonomy.getAutonomyElectricMode(), () -> "Autonomy electric mode should not be null");
    }

    @Test
    @DisplayName("Test updating Autonomy data")
    void testUpdateAutonomyData() {
        // Arrange
        BigDecimal newMileagePerLiterRoad = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newMileagePerLiterCity = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newConsumptionEnergetic = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newAutonomyElectricMode = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newBatteryCapacity = new BigDecimal(faker.number().randomDouble(2, 1, 10)); // batteryCapacity

        DataRegisterAutonomy newData = new DataRegisterAutonomy(
                newMileagePerLiterRoad,
                newMileagePerLiterCity,
                newConsumptionEnergetic,
                newAutonomyElectricMode,
                newBatteryCapacity // Atualização do atributo batteryCapacity
        );

        // Act
        autonomy = new Autonomy(newData);

        // Assert
        assertEquals(newMileagePerLiterRoad, autonomy.getMileagePerLiterRoad(), () -> "Mileage per liter road should be updated.");
        assertEquals(newMileagePerLiterCity, autonomy.getMileagePerLiterCity(), () -> "Mileage per liter city should be updated.");
        assertEquals(newConsumptionEnergetic, autonomy.getConsumptionEnergetic(), () -> "Consumption energetic should be updated.");
        assertEquals(newAutonomyElectricMode, autonomy.getAutonomyElectricMode(), () -> "Autonomy electric mode should be updated.");
    }


    @Test
    @DisplayName("Test getter and setter for mileagePerLiterRoad")
    void testMileagePerLiterRoadGetterAndSetter() {
        // Arrange
        BigDecimal mileagePerLiterRoad = BigDecimal.valueOf(faker.number().randomDouble(2, 1, 100));

        // Act
        autonomy.setMileagePerLiterRoad(mileagePerLiterRoad);
        BigDecimal retrievedMileagePerLiterRoad = autonomy.getMileagePerLiterRoad();

        // Assert
        assertEquals(mileagePerLiterRoad, retrievedMileagePerLiterRoad, () -> "The mileagePerLiterRoad should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for mileagePerLiterCity")
    void testMileagePerLiterCityGetterAndSetter() {
        // Arrange
        BigDecimal mileagePerLiterCity = BigDecimal.valueOf(faker.number().randomDouble(2, 1, 100));

        // Act
        autonomy.setMileagePerLiterCity(mileagePerLiterCity);
        BigDecimal retrievedMileagePerLiterCity = autonomy.getMileagePerLiterCity();

        // Assert
        assertEquals(mileagePerLiterCity, retrievedMileagePerLiterCity, () -> "The mileagePerLiterCity should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for consumptionEnergetic")
    void testConsumptionEnergeticGetterAndSetter() {
        // Arrange
        BigDecimal consumptionEnergetic = BigDecimal.valueOf(faker.number().randomDouble(2, 1, 100));

        // Act
        autonomy.setConsumptionEnergetic(consumptionEnergetic);
        BigDecimal retrievedConsumptionEnergetic = autonomy.getConsumptionEnergetic();

        // Assert
        assertEquals(consumptionEnergetic, retrievedConsumptionEnergetic, () -> "The consumptionEnergetic should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for autonomyElectricMode")
    void testAutonomyElectricModeGetterAndSetter() {
        // Arrange
        BigDecimal autonomyElectricMode = BigDecimal.valueOf(faker.number().randomDouble(2, 1, 100));

        // Act
        autonomy.setAutonomyElectricMode(autonomyElectricMode);
        BigDecimal retrievedAutonomyElectricMode = autonomy.getAutonomyElectricMode();

        // Assert
        assertEquals(autonomyElectricMode, retrievedAutonomyElectricMode, () -> "The autonomyElectricMode should be set and retrieved correctly.");
    }
    
    @Test
    @DisplayName("Test full update of Autonomy")
    void testFullUpdateAutonomy() {
        // Arrange
        BigDecimal newMileagePerLiterRoad = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newMileagePerLiterCity = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newConsumptionEnergetic = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newAutonomyElectricMode = new BigDecimal(faker.number().randomDouble(2, 1, 10));

        DataRegisterAutonomy newData = new DataRegisterAutonomy(
                newMileagePerLiterRoad,
                newMileagePerLiterCity,
                newConsumptionEnergetic,
                newAutonomyElectricMode,
                null // Ignora o campo batteryCapacity pois não é utilizado
        );

        // Act
        autonomy.updateAutonomy(newData);

        // Assert
        assertEquals(newMileagePerLiterRoad, autonomy.getMileagePerLiterRoad(), "Mileage per liter road should be updated.");
        assertEquals(newMileagePerLiterCity, autonomy.getMileagePerLiterCity(), "Mileage per liter city should be updated.");
        assertEquals(newConsumptionEnergetic, autonomy.getConsumptionEnergetic(), "Consumption energetic should be updated.");
        assertEquals(newAutonomyElectricMode, autonomy.getAutonomyElectricMode(), "Autonomy electric mode should be updated.");
    }

    @Test
    @DisplayName("Test partial update of Autonomy")
    void testPartialUpdateAutonomy() {
        // Arrange
        BigDecimal initialMileagePerLiterRoad = autonomy.getMileagePerLiterRoad();
        BigDecimal initialConsumptionEnergetic = autonomy.getConsumptionEnergetic();

        BigDecimal newMileagePerLiterCity = new BigDecimal(faker.number().randomDouble(2, 1, 10));
        BigDecimal newAutonomyElectricMode = new BigDecimal(faker.number().randomDouble(2, 1, 10));

        DataRegisterAutonomy partialData = new DataRegisterAutonomy(
                null,
                newMileagePerLiterCity,
                null,
                newAutonomyElectricMode,
                null
        );

        // Act
        autonomy.updateAutonomy(partialData);

        // Assert
        assertEquals(initialMileagePerLiterRoad, autonomy.getMileagePerLiterRoad(), "Mileage per liter road should remain unchanged.");
        assertEquals(newMileagePerLiterCity, autonomy.getMileagePerLiterCity(), "Mileage per liter city should be updated.");
        assertEquals(initialConsumptionEnergetic, autonomy.getConsumptionEnergetic(), "Consumption energetic should remain unchanged.");
        assertEquals(newAutonomyElectricMode, autonomy.getAutonomyElectricMode(), "Autonomy electric mode should be updated.");
    }

    @Test
    @DisplayName("Test update Autonomy with all null values (no change)")
    void testUpdateAutonomyWithNullValues() {
        // Arrange
        BigDecimal initialMileagePerLiterRoad = autonomy.getMileagePerLiterRoad();
        BigDecimal initialMileagePerLiterCity = autonomy.getMileagePerLiterCity();
        BigDecimal initialConsumptionEnergetic = autonomy.getConsumptionEnergetic();
        BigDecimal initialAutonomyElectricMode = autonomy.getAutonomyElectricMode();

        DataRegisterAutonomy nullData = new DataRegisterAutonomy(
                null,
                null,
                null,
                null,
                null
        );

        // Act
        autonomy.updateAutonomy(nullData);

        // Assert
        assertEquals(initialMileagePerLiterRoad, autonomy.getMileagePerLiterRoad(), "Mileage per liter road should remain unchanged.");
        assertEquals(initialMileagePerLiterCity, autonomy.getMileagePerLiterCity(), "Mileage per liter city should remain unchanged.");
        assertEquals(initialConsumptionEnergetic, autonomy.getConsumptionEnergetic(), "Consumption energetic should remain unchanged.");
        assertEquals(initialAutonomyElectricMode, autonomy.getAutonomyElectricMode(), "Autonomy electric mode should remain unchanged.");
    }
    

    @Test
    @DisplayName("Test default values for new Autonomy instance")
    void testDefaultValuesForNewAutonomy() {
        // Arrange & Act
        Autonomy newAutonomy = new Autonomy();

        // Assert
        assertNull(newAutonomy.getMileagePerLiterRoad(), "Mileage per liter road should be null by default.");
        assertNull(newAutonomy.getMileagePerLiterCity(), "Mileage per liter city should be null by default.");
        assertNull(newAutonomy.getConsumptionEnergetic(), "Consumption energetic should be null by default.");
        assertNull(newAutonomy.getAutonomyElectricMode(), "Autonomy electric mode should be null by default.");
    }


}
