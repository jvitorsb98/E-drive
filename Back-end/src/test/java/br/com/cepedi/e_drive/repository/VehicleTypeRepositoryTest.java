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
        assertFalse(page.getContent().isEmpty(), "Active vehicle types should be found");
        assertEquals(1, page.getTotalElements(), "Only active vehicle types should be present");
        assertTrue(page.getContent().stream().allMatch(vt -> vt.isActivated()), "All vehicle types should be activated");
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
        assertEquals(firstPage.getContent(), secondPage.getContent(), "The results should be cached and the same");
        assertEquals(firstPage.getTotalElements(), secondPage.getTotalElements(), "Total elements should be cached and the same");
    }
}
