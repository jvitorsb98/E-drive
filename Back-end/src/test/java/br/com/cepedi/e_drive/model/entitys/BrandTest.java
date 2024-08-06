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
        dataRegisterBrand = new DataRegisterBrand(faker.company().name(), faker.bool().bool());
        dataUpdateBrand = new DataUpdateBrand(faker.number().randomNumber(), faker.company().name());
        brand = new Brand(dataRegisterBrand);
    }

    @Test
    @DisplayName("Test creation of Brand entity with null activated value")
    void testBrandCreationWithNullActivated() {
        // Cria DataRegisterBrand com activated como null
        DataRegisterBrand nullActivatedData = new DataRegisterBrand(faker.company().name(), null);
        Brand brandWithNullActivated = new Brand(nullActivatedData);

        assertNotNull(brandWithNullActivated);
        assertEquals(nullActivatedData.name(), brandWithNullActivated.getName());
        assertFalse(brandWithNullActivated.getActivated(), "The activated status should default to false when null.");
    }



    @Test
    @DisplayName("Test updating Brand entity")
    void testBrandUpdate() {
        brand.updateDataBrand(dataUpdateBrand);
        assertEquals(dataUpdateBrand.name(), brand.getName());
    }

    @Test
    @DisplayName("Test activating Brand entity")
    void testBrandActivation() {
        brand.deactivated();
        assertFalse(brand.getActivated());

        brand.activated();
        assertTrue(brand.getActivated());
    }

    @Test
    @DisplayName("Test deactivating Brand entity")
    void testBrandDeactivation() {
        brand.activated();
        assertTrue(brand.getActivated());

        brand.deactivated();
        assertFalse(brand.getActivated());
    }

    @Test
    @DisplayName("Test updating Brand entity with null values")
    void testBrandUpdateWithNullValues() {
        DataUpdateBrand nullDataUpdate = new DataUpdateBrand(faker.number().randomNumber(),null);
        brand.updateDataBrand(nullDataUpdate);
        assertEquals(dataRegisterBrand.name(), brand.getName());
    }
}
