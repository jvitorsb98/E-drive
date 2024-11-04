package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsReactivateAccountRequest;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class ModelTest {

    private Faker faker;
    private Model model;
    private Brand brand;
    private DataRegisterModel dataRegisterModel;
    private DataUpdateModel dataUpdateModel;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        brand = Mockito.mock(Brand.class);
        dataRegisterModel = Mockito.mock(DataRegisterModel.class);
        dataUpdateModel = Mockito.mock(DataUpdateModel.class);
        
        Mockito.when(dataRegisterModel.name()).thenReturn(faker.commerce().productName());
        
        model = new Model(
            null, dataRegisterModel.name(),
            brand,
            faker.bool().bool()
        );
    }

    @Test
    @DisplayName("Test all-args constructor")
    void testAllArgsConstructor() {
        // Arrange
        String name = faker.commerce().productName();
        Boolean activated = faker.bool().bool();

        // Act
        Model model = new Model(null, name, brand, activated);

        // Assert
        assertNotNull(model, () -> "Model instance should be created with all-args constructor.");
        assertEquals(name, model.getName(), () -> "Name should be initialized correctly.");
        assertEquals(brand, model.getBrand(), () -> "Brand should be initialized correctly.");
        assertEquals(activated, model.getActivated(), () -> "Activated should be initialized correctly.");
    }
    
    @Test
    @DisplayName("Test no-args constructor")
    void testNoArgsConstructor() {
        // Act
        Model model = new Model(); 

        // Assert
        assertNotNull(model, () -> "Model instance should be created with no-args constructor.");
        assertNull(model.getName(), () -> "Name should be null by default.");
        assertNull(model.getBrand(), () -> "Brand should be null by default.");
        assertNull(model.getActivated(), () -> "Activated should be null by default.");
    }

    @Test
    @DisplayName("Test creation with DataRegisterModel and Brand")
    void testConstructorWithDataRegisterModelAndBrand() {
        // Arrange
        String name = dataRegisterModel.name();
        Boolean activated = true;

        // Act
        Model model = new Model(dataRegisterModel, brand);

        // Assert
        assertNotNull(model, () -> "Model instance should be created with DataRegisterModel and Brand.");
        assertEquals(name, model.getName(), () -> "Name should be initialized correctly.");
        assertEquals(brand, model.getBrand(), () -> "Brand should be initialized correctly.");
        assertEquals(activated, model.getActivated(), () -> "Activated should be initialized to true by default.");
    }

    @Test
    @DisplayName("Test update model data")
    void testUpdateModelData() {
        // Arrange
        String newName = faker.commerce().productName();
        Mockito.when(dataUpdateModel.name()).thenReturn(newName);

        // Act
        model.update(dataUpdateModel);

        // Assert
        assertEquals(newName, model.getName(), () -> "Name should be updated.");
    }

    @Test
    @DisplayName("Test update model data with null values")
    void testUpdateModelDataWithNullValues() {
        // Arrange
        String originalName = model.getName();
        Mockito.when(dataUpdateModel.name()).thenReturn(null);

        // Act
        model.update(dataUpdateModel);

        // Assert
        assertEquals(originalName, model.getName(), () -> "Name should not change when the new name is null.");
    }

    @Test
    @DisplayName("Test activating Model")
    void testActivateModel() {
        // Act
        model.deactivated();
        assertFalse(model.getActivated(), () -> "Model should be deactivated.");

        model.activated();
        assertTrue(model.getActivated(), () -> "Model should be activated.");
    }

    @Test
    @DisplayName("Test deactivating Model")
    void testDeactivateModel() {
        // Act
        model.activated();
        assertTrue(model.getActivated(), () -> "Model should be activated.");

        model.deactivated();
        assertFalse(model.getActivated(), () -> "Model should be deactivated.");
    }

    @Test
    @DisplayName("Test getter and setter for name")
    void testNameGetterAndSetter() {
        // Arrange
        String name = faker.commerce().productName();

        // Act
        model.setName(name);
        String retrievedName = model.getName();

        // Assert
        assertEquals(name, retrievedName, () -> "The name should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for brand")
    void testBrandGetterAndSetter() {
        // Arrange
        Brand newBrand = Mockito.mock(Brand.class);

        // Act
        model.setBrand(newBrand);
        Brand retrievedBrand = model.getBrand();

        // Assert
        assertEquals(newBrand, retrievedBrand, () -> "The brand should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        // Arrange
        Boolean activated = faker.bool().bool();

        // Act
        model.setActivated(activated);
        Boolean retrievedActivated = model.getActivated();

        // Assert
        assertEquals(activated, retrievedActivated, () -> "The activated status should be set and retrieved correctly.");
    }
    
    @Test
    @DisplayName("Test DataDetailsReactivateAccountRequest")
    void testDataDetailsReactivateAccountRequest() {
        // Arrange
        String message = "Account reactivation requested.";

        // Act
        DataDetailsReactivateAccountRequest request = new DataDetailsReactivateAccountRequest(message);

        // Assert
        assertEquals(message, request.message(), "The message should be set correctly in the record.");
    }
}
