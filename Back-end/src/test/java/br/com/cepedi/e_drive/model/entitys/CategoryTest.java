package br.com.cepedi.e_drive.model.entitys;


import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Category")
public class CategoryTest {

    private Faker faker;
    private Category category;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        category = new Category(
                null, 
                faker.company().name(),
                faker.bool().bool()
        );
    }

    @Test
    @DisplayName("Test creation of Category entity")
    void testCategoryCreation() {
        assertNotNull(category);
        assertNotNull(category.getName());
        assertNotNull(category.getActivated());
    }

    @Test
    @DisplayName("Test updating Category name")
    void testCategoryUpdateName() {
        String newName = faker.company().name();
        category.setName(newName);
        assertEquals(newName, category.getName());
    }

    @Test
    @DisplayName("Test activating Category entity")
    void testCategoryActivation() {
        category.setActivated(false);
        assertFalse(category.getActivated());

        category.setActivated(true);
        assertTrue(category.getActivated());
    }

    @Test
    @DisplayName("Test deactivating Category entity")
    void testCategoryDeactivation() {
        category.setActivated(true);
        assertTrue(category.getActivated());

        category.setActivated(false);
        assertFalse(category.getActivated());
    }

    @Test
    @DisplayName("Test Category entity with null values")
    void testCategoryWithNullValues() {
        Category nullCategory = new Category(null, null, null);
        assertNull(nullCategory.getName());
        assertNull(nullCategory.getActivated());
    }
}

