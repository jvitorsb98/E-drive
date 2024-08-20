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
    public void setUp() {
        categoryRepository.deleteAll();
    }

    private Category createTestCategory(String name, boolean activated) {
        Category category = new Category();
        category.setName(name);
        category.setActivated(activated);
        return category;
    }

    @Test
    @DisplayName("Test save and find by ID")
    public void testSaveCategory() {
        // Arrange
        Category category = createTestCategory("Test Category", true);

        // Act
        Category savedCategory = categoryRepository.save(category);
        Optional<Category> foundCategory = categoryRepository.findById(savedCategory.getId());

        // Assert
        assertTrue(foundCategory.isPresent(), () -> "Category should be present");
        assertEquals(savedCategory.getId(), foundCategory.get().getId(), () -> "ID should match");
    }

    @Test
    @DisplayName("Test find all deactivated categories")
    public void testFindAllDeactivatedCategories() {
        // Arrange
        Category activeCategory = createTestCategory("Active Category", true);
        Category deactivatedCategory = createTestCategory("Deactivated Category", false);
        categoryRepository.save(activeCategory);
        categoryRepository.save(deactivatedCategory);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> categories = categoryRepository.findAllByActivatedFalse(pageable);

        // Assert
        assertEquals(1, categories.getTotalElements(), () -> "There should be one deactivated category");
        assertTrue(categories.getContent().stream().allMatch(c -> !c.getActivated()), () -> "All retrieved categories should be deactivated");
    }

    @Test
    @DisplayName("Test delete category")
    public void testDeleteCategory() {
        // Arrange
        Category category = createTestCategory("Test Category", true);
        Category savedCategory = categoryRepository.save(category);

        // Act
        categoryRepository.delete(savedCategory);
        Optional<Category> deletedCategory = categoryRepository.findById(savedCategory.getId());

        // Assert
        assertFalse(deletedCategory.isPresent(), () -> "Category should be deleted");
    }

    @Test
    @DisplayName("Test update category")
    public void testUpdateCategory() {
        // Arrange
        Category category = createTestCategory("Test Category", true);
        Category savedCategory = categoryRepository.save(category);

        // Act
        savedCategory.setName("Updated Category");
        savedCategory.setActivated(false);
        Category updatedCategory = categoryRepository.save(savedCategory);

        // Assert
        assertEquals("Updated Category", updatedCategory.getName(), () -> "Name should be updated");
        assertFalse(updatedCategory.getActivated(), () -> "Activated status should be updated");
    }

    @Test
    @DisplayName("Test find by name containing")
    public void testFindByNameContaining() {
        // Arrange
        Category category1 = createTestCategory("Sample Category", true);
        Category category2 = createTestCategory("Another Category", true);
        categoryRepository.save(category1);
        categoryRepository.save(category2);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Category> categories = categoryRepository.findByNameContaining("Sample", pageable);

        // Assert
        assertEquals(1, categories.getTotalElements(), () -> "There should be one category containing 'Sample' in its name");
        assertTrue(categories.getContent().stream().anyMatch(c -> c.getName().contains("Sample")), () -> "The category name should contain 'Sample'");
    }
}
