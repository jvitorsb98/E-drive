package br.com.cepedi.e_drive.repository;


import br.com.cepedi.e_drive.model.entitys.Brand;
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
public class BrandRepositoryTest {

    @Autowired
    private BrandRepository brandRepository;

    @BeforeEach
    public void deleteAllBrands() {
        brandRepository.deleteAll();
    }

    // Test to verify if a brand can be saved correctly in the database
    @Test
    public void testSaveBrand() {
        // Create a new brand instance
        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setActivated(true);

        // Save the brand in the database and verify if the ID was generated
        Brand savedBrand = brandRepository.save(brand);
        assertNotNull(savedBrand.getId());
    }

    // Test to verify if all activated brands can be retrieved correctly from the database
    @Test
    public void testFindAllActivatedBrands() {
        // Create a new brand instance
        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setActivated(true);

        // Save the brand in the database
        brandRepository.save(brand);

        // Retrieve all activated brands from the database
        Pageable pageable = PageRequest.of(0, 10);
        Page<Brand> brands = brandRepository.findAllByActivatedTrue(pageable);

        // Verify if the number of retrieved brands matches the expected number
        assertEquals(1, brands.getTotalElements());
    }

    // Test to verify if a brand can be deleted correctly from the database
    @Test
    public void testDeleteBrand() {
        // Create a new brand instance
        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setActivated(true);

        // Save the brand in the database
        Brand savedBrand = brandRepository.save(brand);

        // Delete the brand from the database
        brandRepository.delete(savedBrand);

        // Verify if the brand was deleted
        Optional<Brand> deletedBrand = brandRepository.findById(savedBrand.getId());
        assertFalse(deletedBrand.isPresent());
    }

    // Test to verify if a brand can be updated correctly in the database
    @Test
    public void testUpdateBrand() {
        // Create a new brand instance
        Brand brand = new Brand();
        brand.setName("Test Brand");
        brand.setActivated(true);

        // Save the brand in the database
        Brand savedBrand = brandRepository.save(brand);

        // Update the brand details
        savedBrand.setName("Updated Brand");
        savedBrand.setActivated(false);

        // Save the updated brand in the database
        Brand updatedBrand = brandRepository.save(savedBrand);

        // Verify if the updated brand details are correct
        assertEquals("Updated Brand", updatedBrand.getName());
        assertFalse(updatedBrand.getActivated());
    }
}

