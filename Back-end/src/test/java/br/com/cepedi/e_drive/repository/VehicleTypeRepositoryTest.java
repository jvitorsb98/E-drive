package br.com.cepedi.e_drive.repository;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import com.github.javafaker.Faker;
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

import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.Random.class)
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class VehicleTypeRepositoryTest {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    private Faker faker;

    @BeforeEach
    public void setUp() {
        faker = new Faker();

        // Clear the repository before each test
        vehicleTypeRepository.deleteAll();
    }

    @Test
    @DisplayName("Should save and find active vehicle types")
    public void testSaveAndFindActiveVehicleTypes() {
        // Arrange
        VehicleType activeType = new VehicleType(null, faker.company().name(), true);
        vehicleTypeRepository.save(activeType);

        VehicleType inactiveType = new VehicleType(null, faker.company().name(), false);
        vehicleTypeRepository.save(inactiveType);

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleType> page = vehicleTypeRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertFalse(page.getContent().isEmpty(), () -> "Active vehicle types should be found");
        assertEquals(1, page.getTotalElements(), () -> "Only active vehicle types should be present");
        assertTrue(page.getContent().stream().allMatch(vt -> vt.isActivated()), 
                   () -> "All vehicle types should be activated");
    }

    @Test
    @DisplayName("Should cache results of active vehicle types query")
    public void testCacheActiveVehicleTypes() {
        // Arrange
        IntStream.range(0, 10).forEach(i -> {
            VehicleType activeType = new VehicleType(null, faker.company().name(), true);
            vehicleTypeRepository.save(activeType);
        });

        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleType> firstPage = vehicleTypeRepository.findAllByActivatedTrue(pageable);
        Page<VehicleType> secondPage = vehicleTypeRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertEquals(firstPage.getContent(), secondPage.getContent(), 
                     () -> "The results should be cached and the same");
        assertEquals(firstPage.getTotalElements(), secondPage.getTotalElements(), 
                     () -> "Total elements should be cached and the same");
    }

    @Test
    @DisplayName("Should return empty page when no active vehicle types are present")
    public void testNoActiveVehicleTypes() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);

        // Act
        Page<VehicleType> page = vehicleTypeRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertTrue(page.getContent().isEmpty(), () -> "No active vehicle types should be present");
        assertEquals(0, page.getTotalElements(), () -> "Total elements should be zero");
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    public void testPagination() {
        // Arrange
        IntStream.range(0, 15).forEach(i -> {
            VehicleType activeType = new VehicleType(null, faker.company().name(), true);
            vehicleTypeRepository.save(activeType);
        });

        Pageable firstPage = PageRequest.of(0, 10);
        Pageable secondPage = PageRequest.of(1, 10);

        // Act
        Page<VehicleType> firstPageResult = vehicleTypeRepository.findAllByActivatedTrue(firstPage);
        Page<VehicleType> secondPageResult = vehicleTypeRepository.findAllByActivatedTrue(secondPage);

    

        // Assert
        assertEquals(10, firstPageResult.getContent().size(), 
                     () -> "First page should contain 10 items");
        assertEquals(5, secondPageResult.getContent().size(), 
                     () -> "Second page should contain 5 items");
        assertEquals(15, vehicleTypeRepository.findAllByActivatedTrue(PageRequest.of(0, 1000)).getTotalElements(), 
                     () -> "Total elements should match the number of saved items");
    }


    @Test
    @DisplayName("Should reflect changes in cache after update")
    public void testCacheEviction() {
        // Arrange
        VehicleType activeType = new VehicleType(null, faker.company().name(), true);
        vehicleTypeRepository.save(activeType);

        Pageable pageable = PageRequest.of(0, 10);
        Page<VehicleType> firstPage = vehicleTypeRepository.findAllByActivatedTrue(pageable);

        // Act
        activeType.setActivated(false);
        vehicleTypeRepository.save(activeType);
        Page<VehicleType> secondPage = vehicleTypeRepository.findAllByActivatedTrue(pageable);

        // Assert
        assertNotEquals(firstPage.getContent(), secondPage.getContent(), 
                        () -> "Cache should be updated after the vehicle type is deactivated");
    }
}

