package br.com.cepedi.e_drive.model.entitys;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import com.github.javafaker.Faker;

import br.com.cepedi.e_drive.model.records.category.register.DataRegisterCategory;
import br.com.cepedi.e_drive.model.records.category.update.DataUpdateCategory;

public class CategoryTest {

    private Faker faker;
    private DataRegisterCategory dataRegisterCategory;
    private Category category;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        dataRegisterCategory = mock(DataRegisterCategory.class);
        when(dataRegisterCategory.name()).thenReturn(faker.company().name());

        category = new Category(dataRegisterCategory);
    }

    @Test
    @DisplayName("Test constructor of Category with DataRegisterCategory")
    void testCategoryConstructor() {
        assertNotNull(category, () -> "Category should not be null");
        assertEquals(dataRegisterCategory.name(), category.getName(), () -> "The name should be set correctly from DataRegisterCategory");
        assertTrue(category.getActivated(), () -> "The activated field should be set to true by default");
    }

    @Test
    @DisplayName("Should update category data with new values")
    void testUpdateCategory() {
        String initialName = faker.company().name();
        category.setName(initialName);
        category.setActivated(true);

        String updatedName = faker.company().name();
        DataUpdateCategory dataUpdateCategory = mock(DataUpdateCategory.class);
        when(dataUpdateCategory.name()).thenReturn(updatedName);

        category.update(dataUpdateCategory);

        assertEquals(updatedName, category.getName(), () -> "The name should be updated.");
    }

    @Test
    @DisplayName("Should activate the category")
    void testActivate() {
        category.setActivated(false);
        category.activated();
        assertTrue(category.getActivated(), () -> "The category should be activated.");
    }

    @Test
    @DisplayName("Should deactivate the category")
    void testDeactivate() {
        category.setActivated(true);
        category.deactivated();
        assertFalse(category.getActivated(), () -> "The category should be deactivated.");
    }

    @Test
    @DisplayName("Should handle null name in update")
    void testUpdateCategoryWithNullName() {
        category.setName(faker.company().name());
        category.setActivated(true);

        DataUpdateCategory dataUpdateCategory = mock(DataUpdateCategory.class);
        when(dataUpdateCategory.name()).thenReturn(null);

        category.update(dataUpdateCategory);

        assertNotNull(category.getName(), () -> "The name should not be null.");
    }
    
    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        Category category = new Category(); // Usando o construtor padrão

        assertNotNull(category, () -> "Category instance should be created with no-args constructor.");
        assertNull(category.getId(), () -> "ID should be null by default.");
        assertNull(category.getName(), () -> "Name should be null by default.");
        assertNull(category.getActivated(), () -> "Activated should be null by default.");
    }
    
    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        Long id = faker.number().randomNumber();
        String name = faker.company().name();
        Boolean activated = faker.bool().bool();

        Category category = new Category(id, name, activated);

        assertNotNull(category, () -> "Category instance should be created with all-args constructor.");
        assertEquals(id, category.getId(), () -> "ID should be initialized correctly.");
        assertEquals(name, category.getName(), () -> "Name should be initialized correctly.");
        assertEquals(activated, category.getActivated(), () -> "Activated should be initialized correctly.");
    }
    
    @Test
    @DisplayName("Test getter and setter for name")
    void testNameGetterAndSetter() {
        String name = faker.company().name();
        category.setName(name);
        assertEquals(name, category.getName(), () -> "The name should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        Boolean activated = faker.bool().bool();
        category.setActivated(activated);
        assertEquals(activated, category.getActivated(), () -> "The activated status should be set and retrieved correctly.");
    }
}

