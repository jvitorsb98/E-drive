package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.Brand;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.cache.CacheManager;
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
public class BrandRepositoryTest {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CacheManager cacheManager;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();
        brandRepository.deleteAll();
        cacheManager.getCache("brands").clear(); // Clear the cache before each test
    }

    private Brand createTestBrand() {
        Brand brand = new Brand();
        brand.setName(faker.company().name());
        brand.setActivated(faker.bool().bool());
        return brand;
    }

    @Test
    @DisplayName("Test save brand")
    public void testSaveBrand() {
        // Arrange
        Brand brand = createTestBrand();

        // Act
        Brand savedBrand = brandRepository.save(brand);

        // Assert
        assertNotNull(savedBrand.getId(), () -> "Saved brand ID should not be null");
    }

    @Test
    @DisplayName("Test find all activated brands")
    public void testFindAllActivatedBrands() {
        // Arrange
        Brand brand = createTestBrand();
        brand.setActivated(true);
        brandRepository.save(brand);

        // Act
        Pageable pageable = PageRequest.of(0, 10);
        Page<Brand> brands = brandRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertEquals(1, brands.getTotalElements(), () -> "There should be one activated brand");
    }


    @Test
    @DisplayName("Test delete brand")
    public void testDeleteBrand() {
        // Arrange
        Brand brand = createTestBrand();
        Brand savedBrand = brandRepository.save(brand);

        // Act
        brandRepository.delete(savedBrand);
        Optional<Brand> deletedBrand = brandRepository.findById(savedBrand.getId());

        // Assert
        assertFalse(deletedBrand.isPresent(), () -> "Brand should be deleted");
    }

    @Test
    @DisplayName("Test update brand")
    public void testUpdateBrand() {
        // Arrange
        Brand brand = createTestBrand();
        Brand savedBrand = brandRepository.save(brand);

        // Act
        savedBrand.setName(faker.company().name());
        savedBrand.setActivated(faker.bool().bool());
        Brand updatedBrand = brandRepository.save(savedBrand);

        // Assert
        assertEquals(savedBrand.getName(), updatedBrand.getName(), () -> "Brand name should be updated");
        assertEquals(savedBrand.getActivated(), updatedBrand.getActivated(), () -> "Brand activation status should be updated");
    }

    @Test
    @DisplayName("Test find by non-existing ID")
    public void testFindByNonExistingId() {
        // Act
        Optional<Brand> foundBrand = brandRepository.findById(Long.MAX_VALUE);

        // Assert
        assertFalse(foundBrand.isPresent(), () -> "Brand should not be present");
    }

    @Test
    @DisplayName("Test delete non-existing entity")
    public void testDeleteNonExistingEntity() {
        // Arrange
        Brand brand = createTestBrand();
        brand.setId(Long.MAX_VALUE); // Non-existing ID

        // Act
        brandRepository.delete(brand);

        // Assert
        // No exception should be thrown and nothing should be affected
    }

    @Test
    @DisplayName("Test caching of activated brands")
    public void testCachingActivatedBrands() {
        // Arrange
        Brand brand1 = createTestBrand();
        brand1.setActivated(true);
        Brand brand2 = createTestBrand();
        brand2.setActivated(true);
        brandRepository.save(brand1);
        brandRepository.save(brand2);

        // Act & Assert - First call should populate the cache
        Pageable pageable = PageRequest.of(0, 10);
        Page<Brand> brandsFirstCall = brandRepository.findAllByActivatedTrue(pageable);
        assertEquals(2, brandsFirstCall.getTotalElements(), () -> "There should be two activated brands");

        // Act - Second call should hit the cache
        Page<Brand> brandsSecondCall = brandRepository.findAllByActivatedTrue(pageable);
        assertEquals(2, brandsSecondCall.getTotalElements(), () -> "There should be two activated brands from cache");
    }
}

