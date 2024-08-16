package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Brand")
public class BrandTest {

    private Faker faker;
    private DataRegisterBrand dataRegisterBrand;
    private DataUpdateBrand dataUpdateBrand;
    private Brand brand;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        String name = faker.company().name();
        dataRegisterBrand = new DataRegisterBrand(name);
        dataUpdateBrand = new DataUpdateBrand(faker.company().name());
        brand = new Brand(dataRegisterBrand);
    }

    @Test
    @DisplayName("Test creation of Brand entity")
    void testBrandCreation() {
        // Act
        String actualName = brand.getName();

        // Assert
        assertNotNull(brand, () -> "Brand should not be null");
        assertEquals(dataRegisterBrand.name(), actualName, () -> "The name should be set correctly from DataRegisterBrand");
        assertTrue(brand.getActivated(), () -> "The activated status should default to true.");
    }

    @Test
    @DisplayName("Test updating Brand entity with new values")
    void testBrandUpdate() {
        // Arrange
        String newName = faker.company().name();
        DataUpdateBrand updateData = new DataUpdateBrand(newName);

        // Act
        brand.updateDataBrand(updateData);

        // Assert
        assertEquals(newName, brand.getName(), () -> "The name should be updated.");
    }

    @Test
    @DisplayName("Test activating Brand entity")
    void testBrandActivation() {
        // Act
        brand.deactivated();
        assertFalse(brand.getActivated(), () -> "Brand should be deactivated.");

        brand.activated();
        assertTrue(brand.getActivated(), () -> "Brand should be activated.");
    }

    @Test
    @DisplayName("Test deactivating Brand entity")
    void testBrandDeactivation() {
        // Act
        brand.activated();
        assertTrue(brand.getActivated(), () -> "Brand should be activated.");

        brand.deactivated();
        assertFalse(brand.getActivated(), () -> "Brand should be deactivated.");
    }

    @Test
    @DisplayName("Test updating Brand entity with null values")
    void testBrandUpdateWithNullValues() {
        // Arrange
        String originalName = dataRegisterBrand.name();
        DataUpdateBrand nullDataUpdate = new DataUpdateBrand(null);

        // Act
        brand.updateDataBrand(nullDataUpdate);

        // Assert
        assertEquals(originalName, brand.getName(), () -> "The name should not change when the new name is null.");
    }
    
    @Test
    @DisplayName("Test getter and setter for name")
    void testNameGetterAndSetter() {
        // Arrange
        String name = faker.company().name();

        // Act
        brand.setName(name);
        String retrievedName = brand.getName();

        // Assert
        assertEquals(name, retrievedName, () -> "The name should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        // Arrange
        Boolean activated = faker.bool().bool();

        // Act
        brand.setActivated(activated);
        Boolean retrievedActivated = brand.getActivated();

        // Assert
        assertEquals(activated, retrievedActivated, () -> "The activated status should be set and retrieved correctly.");
    }
    
    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        // Arrange
        String name = faker.company().name();
        Boolean activated = faker.bool().bool();

        // Act
        Brand brand = new Brand(null, name, activated);

        // Assert
        assertNotNull(brand, () -> "Brand instance should be created with all-args constructor.");
        assertEquals(name, brand.getName(), () -> "Name should be initialized correctly.");
        assertEquals(activated, brand.getActivated(), () -> "Activated status should be initialized correctly.");
    }
    
    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        // Act
        Brand brand = new Brand(); // Usando o construtor padrão

        assertNotNull(brand, () -> "Brand instance should be created with no-args constructor.");
        assertNull(brand.getName(), () -> "Name should be null by default.");
        assertNull(brand.getActivated(), () -> "Activated status should be null by default.");
    }

}
