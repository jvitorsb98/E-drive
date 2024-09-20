//package br.com.cepedi.e_drive.repository;
//
//import br.com.cepedi.e_drive.model.entitys.Address;
//import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
//import br.com.cepedi.e_drive.security.model.entitys.User;
//import br.com.cepedi.e_drive.security.repository.UserRepository;
//
//import com.github.javafaker.Faker;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.test.context.ActiveProfiles;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//import java.util.List;
//
//@DataJpaTest
//@ActiveProfiles("test")
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//public class AddressRepositoryTest {
//
//    @Autowired
//    private AddressRepository addressRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private Faker faker;
//
//    @BeforeEach
//    public void setUp() {
//        faker = new Faker();
//        addressRepository.deleteAll();
//        userRepository.deleteAll();
//    }
//
//    private User createUser() {
//        User user = new User();
//        user.setName(faker.name().fullName());
//        // Defina outros campos necessários para User se houver
//        return userRepository.save(user);
//    }
//
//    @Test
//    @DisplayName("Should save and find addresses by user ID and activation status")
//    void testSaveAndFindByUserIdAndActivated() {
//        // Arrange
//        User user = createUser(); // Usa o Faker para criar um usuário
//
//        Address address1 = new Address(
//            null,
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            user,
//            true,
//            true
//        );
//
//        Address address2 = new Address(
//            null,
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            user,
//            true,
//            true
//        );
//
//        addressRepository.save(address1);
//        addressRepository.save(address2);
//
//        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Order.asc("id")));
//
//        // Act
//        Page<Address> resultPage = addressRepository.findByUserIdAndActivated(user.getId(), pageable);
//
//        // Assert
//        assertTrue(resultPage.hasContent(), () -> "The page should have content");
//        List<Address> addresses = resultPage.getContent();
//        assertEquals(2, addresses.size(), () -> "There should be two addresses in the result");
//        assertTrue(addresses.stream().allMatch(Address::getActivated), () -> "All addresses should be activated");
//    }
//
//    @Test
//    @DisplayName("Should return empty page when no addresses are present for the given user ID")
//    public void testNoAddressesForUser() {
//        // Arrange
//        User user = createUser();
//        Pageable pageable = PageRequest.of(0, 10);
//
//        // Act
//        Page<Address> page = addressRepository.findByUserIdAndActivated(user.getId(), pageable);
//
//        // Assert
//        assertTrue(page.getContent().isEmpty(), () -> "No addresses should be present for the user ID");
//        assertEquals(0, page.getTotalElements(), () -> "Total elements should be zero");
//    }
//
//    @Test
//    @DisplayName("Should save and retrieve an address correctly")
//    void testPagination() {
//        // Arrange
//        User user = createUser();
//
//        Address address = new Address(
//            null,
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            user,
//            faker.bool().bool(),
//            faker.bool().bool()
//        );
//
//        // Act
//        addressRepository.save(address);
//
//        // Assert
//        Address savedAddress = addressRepository.findById(address.getId()).orElse(null);
//        assertNotNull(savedAddress, () -> "The saved address should not be null");
//        assertEquals(address.getCountry(), savedAddress.getCountry(), () -> "The country should match");
//        assertEquals(address.getZipCode(), savedAddress.getZipCode(), () -> "The zip code should match");
//        assertEquals(address.getState(), savedAddress.getState(), () -> "The state should match");
//        assertEquals(address.getCity(), savedAddress.getCity(), () -> "The city should match");
//        assertEquals(address.getNeighborhood(), savedAddress.getNeighborhood(), () -> "The neighborhood should match");
//        assertEquals(address.getNumber(), savedAddress.getNumber(), () -> "The number should match");
//        assertEquals(address.getStreet(), savedAddress.getStreet(), () -> "The street should match");
//        assertEquals(address.getUser(), savedAddress.getUser(), () -> "The user should match");
//        assertEquals(address.getPlugin(), savedAddress.getPlugin(), () -> "The plugin status should match");
//        assertEquals(address.getActivated(), savedAddress.getActivated(), () -> "The activation status should match");
//    }
//
//    @Test
//    @DisplayName("Should update address data correctly")
//    void testUpdateAddressData() {
//        // Arrange
//        User user = createUser();
//        Address address = new Address(
//            null,
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            user,
//            true,
//            true
//        );
//        address = addressRepository.save(address);
//        DataUpdateAddress updateData = new DataUpdateAddress(
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            faker.bool().bool()
//        );
//
//        // Act
//        address.updateData(updateData);
//        addressRepository.save(address);
//
//        // Assert
//        Address updatedAddress = addressRepository.findById(address.getId()).orElse(null);
//        assertNotNull(updatedAddress, () -> "The updated address should not be null");
//        assertEquals(updateData.country(), updatedAddress.getCountry(), () -> "The country should be updated");
//        assertEquals(updateData.zipCode(), updatedAddress.getZipCode(), () -> "The zip code should be updated");
//        assertEquals(updateData.state(), updatedAddress.getState(), () -> "The state should be updated");
//        assertEquals(updateData.city(), updatedAddress.getCity(), () -> "The city should be updated");
//        assertEquals(updateData.neighborhood(), updatedAddress.getNeighborhood(), () -> "The neighborhood should be updated");
//        assertEquals(updateData.number(), updatedAddress.getNumber(), () -> "The number should be updated");
//        assertEquals(updateData.street(), updatedAddress.getStreet(), () -> "The street should be updated");
//        assertEquals(updateData.plugin(), updatedAddress.getPlugin(), () -> "The plugin status should be updated");
//    }
//
//    @Test
//    @DisplayName("Should activate and deactivate address correctly")
//    void testActivateAndDeactivateAddress() {
//        // Arrange
//        User user = createUser();
//        Address address = new Address(
//            null,
//            faker.address().country(),
//            faker.address().zipCode(),
//            faker.address().state(),
//            faker.address().city(),
//            faker.address().streetName(),
//            faker.number().numberBetween(1, 9999),
//            faker.address().streetAddress(),
//            user,
//            true,
//            false
//        );
//        address = addressRepository.save(address);
//
//        // Act - Activate
//        address.enable();
//        addressRepository.save(address);
//
//        // Assert - Activate
//        Address activatedAddress = addressRepository.findById(address.getId()).orElse(null);
//        assertNotNull(activatedAddress, () -> "The activated address should not be null");
//        assertTrue(activatedAddress.getActivated(), () -> "The address should be activated");
//
//        // Act - Deactivate
//        address.disable();
//        addressRepository.save(address);
//
//        // Assert - Deactivate
//        Address deactivatedAddress = addressRepository.findById(address.getId()).orElse(null);
//        assertNotNull(deactivatedAddress, () -> "The deactivated address should not be null");
//        assertFalse(deactivatedAddress.getActivated(), () -> "The address should be deactivated");
//    }
//
//    @Test
//    @DisplayName("Should correctly paginate results with multiple addresses")
//    void testPaginationWithMultipleAddresses() {
//        // Arrange
//        User user = createUser();
//
//        // Create and save multiple addresses
//        for (int i = 0; i < 25; i++) {
//            Address address = new Address(
//                null,
//                faker.address().country(),
//                faker.address().zipCode(),
//                faker.address().state(),
//                faker.address().city(),
//                faker.address().streetName(),
//                faker.number().numberBetween(1, 9999),
//                faker.address().streetAddress(),
//                user,
//                true,
//                true
//            );
//            addressRepository.save(address);
//        }
//
//        // Act - Request the first page with 10 items per page
//        Pageable pageable = PageRequest.of(0, 10);
//        Page<Address> page = addressRepository.findByUserIdAndActivated(user.getId(), pageable);
//
//        // Assert
//        assertNotNull(page, () -> "The page should not be null");
//        assertEquals(10, page.getContent().size(), () -> "The page size should be 10");
//        assertEquals(25, page.getTotalElements(), () -> "The total number of elements should be 25");
//        assertEquals(3, page.getTotalPages(), () -> "The total number of pages should be 3");
//    }
//}
//
