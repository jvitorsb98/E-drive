package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Category;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    public void deleteAllCategories() {
        categoryRepository.deleteAll();
    }

    // Test to verify if a category can be saved correctly in the database
    @Test
    public void testSaveCategory() {
        // Create a new category instance
        Category category = new Category();
        category.setName("Test Category");
        category.setActivated(true);

        // Save the category in the database and verify if the ID was generated
        Category savedCategory = categoryRepository.save(category);
        assertNotNull(savedCategory.getId());
    }

    // Test to verify if all deactivated categories can be retrieved correctly from the database
    @Test
    public void testFindAllDeactivatedCategories() {
        // Create a new category instance
        Category category = new Category();
        category.setName("Test Category");
        category.setActivated(false);

        // Save the category in the database
        categoryRepository.save(category);

        // Retrieve all deactivated categories from the database
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> categories = categoryRepository.findAllByActivatedFalse(pageable);

        // Verify if the number of retrieved categories matches the expected number
        assertEquals(1, categories.getTotalElements());
    }

    // Test to verify if a category can be deleted correctly from the database
    @Test
    public void testDeleteCategory() {
        // Create a new category instance
        Category category = new Category();
        category.setName("Test Category");
        category.setActivated(true);

        // Save the category in the database
        Category savedCategory = categoryRepository.save(category);

        // Delete the category from the database
        categoryRepository.delete(savedCategory);

        // Verify if the category was deleted
        Optional<Category> deletedCategory = categoryRepository.findById(savedCategory.getId());
        assertFalse(deletedCategory.isPresent());
    }

    // Test to verify if a category can be updated correctly in the database
    @Test
    public void testUpdateCategory() {
        // Create a new category instance
        Category category = new Category();
        category.setName("Test Category");
        category.setActivated(true);

        // Save the category in the database
        Category savedCategory = categoryRepository.save(category);

        // Update the category details
        savedCategory.setName("Updated Category");
        savedCategory.setActivated(false);

        // Save the updated category in the database
        Category updatedCategory = categoryRepository.save(savedCategory);

        // Verify if the updated category details are correct
        assertEquals("Updated Category", updatedCategory.getName());
        assertFalse(updatedCategory.getActivated());
    }

    // Test to verify if categories can be retrieved by name containing a specific string
    @Test
    public void testFindByNameContaining() {
        // Create a new category instance
        Category category = new Category();
        category.setName("Sample Category");
        category.setActivated(true);

        // Save the category in the database
        categoryRepository.save(category);

        // Retrieve categories by name containing "Sample"
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> categories = categoryRepository.findByNameContaining("Sample", pageable);

        // Verify if the number of retrieved categories matches the expected number
        assertEquals(1, categories.getTotalElements());
    }
}
