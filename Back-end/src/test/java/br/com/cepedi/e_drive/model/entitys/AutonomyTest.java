package br.com.cepedi.e_drive.model.entitys;



import com.github.javafaker.Faker;
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
        // Inicializa um objeto Autonomy com dados aleatórios
        autonomy = new Autonomy(
                faker.number().randomNumber(),
                BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
                BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
                BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15)),
                BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15))
        );
    }

    @Test
    @DisplayName("Test creation of Autonomy entity")
    void testAutonomyCreation() {
        assertNotNull(autonomy);
        assertNotNull(autonomy.getId());
        assertNotNull(autonomy.getMileagePerLiterRoad());
        assertNotNull(autonomy.getMileagePerLiterCity());
        assertNotNull(autonomy.getConsumptionEnergetic());
        assertNotNull(autonomy.getAutonomyElectricMode());
    }

    @Test
    @DisplayName("Test getters and setters")
    void testGettersAndSetters() {
        // Testa getters e setters com valores aleatórios
        BigDecimal mileagePerLiterRoad = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        BigDecimal mileagePerLiterCity = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        BigDecimal consumptionEnergetic = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));
        BigDecimal autonomyElectricMode = BigDecimal.valueOf(faker.number().randomDouble(2, 5, 15));

        autonomy.setMileagePerLiterRoad(mileagePerLiterRoad);
        autonomy.setMileagePerLiterCity(mileagePerLiterCity);
        autonomy.setConsumptionEnergetic(consumptionEnergetic);
        autonomy.setAutonomyElectricMode(autonomyElectricMode);

        assertEquals(mileagePerLiterRoad, autonomy.getMileagePerLiterRoad());
        assertEquals(mileagePerLiterCity, autonomy.getMileagePerLiterCity());
        assertEquals(consumptionEnergetic, autonomy.getConsumptionEnergetic());
        assertEquals(autonomyElectricMode, autonomy.getAutonomyElectricMode());
    }

    @Test
    @DisplayName("Test default constructor")
    void testDefaultConstructor() {
        Autonomy defaultAutonomy = new Autonomy();
        assertNull(defaultAutonomy.getId());
        assertNull(defaultAutonomy.getMileagePerLiterRoad());
        assertNull(defaultAutonomy.getMileagePerLiterCity());
        assertNull(defaultAutonomy.getConsumptionEnergetic());
        assertNull(defaultAutonomy.getAutonomyElectricMode());
    }

    @Test
    @DisplayName("Test parameterized constructor")
    void testParameterizedConstructor() {
        Autonomy parameterizedAutonomy = new Autonomy(
                1L,
                BigDecimal.valueOf(10.5),
                BigDecimal.valueOf(8.5),
                BigDecimal.valueOf(20.0),
                BigDecimal.valueOf(15.0)
        );

        assertEquals(1L, parameterizedAutonomy.getId());
        assertEquals(BigDecimal.valueOf(10.5), parameterizedAutonomy.getMileagePerLiterRoad());
        assertEquals(BigDecimal.valueOf(8.5), parameterizedAutonomy.getMileagePerLiterCity());
        assertEquals(BigDecimal.valueOf(20.0), parameterizedAutonomy.getConsumptionEnergetic());
        assertEquals(BigDecimal.valueOf(15.0), parameterizedAutonomy.getAutonomyElectricMode());
    }
}

