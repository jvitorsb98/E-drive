package br.com.cepedi.e_drive.model.entitys;



import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.security.model.entitys.User;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Address")
public class AddressTest {

    private Faker faker;
    private User user;
    private DataRegisterAddress dataRegisterAddress;
    private Address address;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        user = new User();  
        dataRegisterAddress = new DataRegisterAddress(
            faker.address().country(),
            faker.address().zipCode(),
            faker.address().state(),
            faker.address().city(),
            faker.address().streetName(),
            faker.number().randomDigit(),
            faker.address().streetAddress(),
            user.getId(), 
            faker.bool().bool()
        );
        address = new Address(dataRegisterAddress, user);
    }

    @Test
    @DisplayName("Test creation of Address entity")
    void testAddressCreation() {
        assertNotNull(address, "Address should not be null");
        assertEquals(dataRegisterAddress.country(), address.getCountry(), "The country should be set correctly from DataRegisterAddress");
        assertEquals(dataRegisterAddress.zipCode(), address.getZipCode(), "The zip code should be set correctly from DataRegisterAddress");
        assertTrue(address.getActivated(), "The activated status should default to true.");
    }

    @Test
    @DisplayName("Test updating Address entity with new values")
    void testAddressUpdate() {
        String newCity = faker.address().city();
        DataUpdateAddress updateData = new DataUpdateAddress(
            null, null, null, newCity, null, null, null, null
        );

        address.updateData(updateData);

        assertEquals(newCity, address.getCity(), "The city should be updated.");
    }

    @Test
    @DisplayName("Test activating Address entity")
    void testAddressActivation() {
        address.disable();
        assertFalse(address.getActivated(), "Address should be deactivated.");

        address.enable();
        assertTrue(address.getActivated(), "Address should be activated.");
    }

    @Test
    @DisplayName("Test deactivating Address entity")
    void testAddressDeactivation() {
        address.enable();
        assertTrue(address.getActivated(), "Address should be activated.");

        address.disable();
        assertFalse(address.getActivated(), "Address should be deactivated.");
    }

    @Test
    @DisplayName("Test updating Address entity with null values")
    void testAddressUpdateWithNullValues() {
        String originalStreet = dataRegisterAddress.street();
        DataUpdateAddress nullDataUpdate = new DataUpdateAddress(
            null, null, null, null, null, null, null, null
        );

        address.updateData(nullDataUpdate);

        assertEquals(originalStreet, address.getStreet(), "The street should not change when the new street is null.");
    }

    @Test
    @DisplayName("Test getter and setter for country")
    void testCountryGetterAndSetter() {
        String country = faker.address().country();

        address.setCountry(country);
        String retrievedCountry = address.getCountry();

        assertEquals(country, retrievedCountry, "The country should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test getter and setter for activated")
    void testActivatedGetterAndSetter() {
        Boolean activated = faker.bool().bool();

        address.setActivated(activated);
        Boolean retrievedActivated = address.getActivated();

        assertEquals(activated, retrievedActivated, "The activated status should be set and retrieved correctly.");
    }

    @Test
    @DisplayName("Test creation with all-args constructor")
    void testAllArgsConstructor() {
        Address newAddress = new Address(
            1L,
            faker.address().country(),
            faker.address().zipCode(),
            faker.address().state(),
            faker.address().city(),
            faker.address().streetName(),
            faker.number().randomDigit(),
            faker.address().streetAddress(),
            user,
            faker.bool().bool(),
            true 
        );

        assertNotNull(newAddress, "Address instance should be created with all-args constructor.");
        assertEquals(user, newAddress.getUser(), "User should be initialized correctly.");
        assertTrue(newAddress.getActivated(), "Activated status should be initialized correctly.");
    }
    
    @Test
    void testConstructorWithNullPlugin() {
        User user = new User(); 
        DataRegisterAddress dataRegisterAddress = new DataRegisterAddress(
                "Brazil",
                "12345-678",
                "SP",
                "São Paulo",
                "Centro",
                100,
                "Rua A",
                user.getId(), 
                null 
        );
        Address address = new Address(dataRegisterAddress, user);

       
        assertFalse(address.getPlugin(), "Plugin should default to false if not provided.");
    }

    @Test
    void testConstructorWithNonNullPlugin() {
        User user = new User(); 
        DataRegisterAddress dataRegisterAddress = new DataRegisterAddress(
                "Brazil",
                "12345-678",
                "SP",
                "São Paulo",
                "Centro",
                100,
                "Rua A",
                user.getId(), 
                true 
        );
        Address address = new Address(dataRegisterAddress, user);

        assertTrue(address.getPlugin(), "Plugin should be set to true as provided.");
    }



    @Test
    @DisplayName("Test creation with no-args constructor")
    void testNoArgsConstructor() {
        Address address = new Address();

        assertNotNull(address, "Address instance should be created with no-args constructor.");
        assertNull(address.getCountry(), "Country should be null by default.");
        assertNull(address.getActivated(), "Activated status should be null by default.");
    }
    
    @Test
    void testUpdateData() {
        // Cenário: Instância inicial de Address
        User user = new User(); 
        Address address = new Address(
                1L,
                "Brazil",
                "12345-678",
                "SP",
                "São Paulo",
                "Centro",
                100,
                "Rua A",
                user,
                true,
                true
        );

        // Cenário: Criação de um DataUpdateAddress com todos os campos não nulos
        DataUpdateAddress dataUpdate = new DataUpdateAddress(
                "USA",       // country
                "98765-432", // zipCode
                "CA",        // state
                "Los Angeles", // city
                "Hollywood", // neighborhood
                200,         // number
                "Sunset Blvd", // street
                false        // plugin
        );

        // Teste: Atualizando todos os campos
        address.updateData(dataUpdate);
        assertEquals("USA", address.getCountry());
        assertEquals("98765-432", address.getZipCode());
        assertEquals("CA", address.getState());
        assertEquals("Los Angeles", address.getCity());
        assertEquals("Hollywood", address.getNeighborhood());
        assertEquals(200, address.getNumber());
        assertEquals("Sunset Blvd", address.getStreet());
        assertFalse(address.getPlugin());

        // Cenário: Criação de um DataUpdateAddress com campos parcialmente nulos
        dataUpdate = new DataUpdateAddress(
                null,      // country
                null,      // zipCode
                "NY",      // state
                null,      // city
                "Brooklyn", // neighborhood
                null,      // number
                "5th Ave",  // street
                null       // plugin
        );

        // Teste: Atualizando apenas campos não nulos
        address.updateData(dataUpdate);
        assertEquals("USA", address.getCountry());  // Deve permanecer o mesmo
        assertEquals("98765-432", address.getZipCode());  // Deve permanecer o mesmo
        assertEquals("NY", address.getState());     // Deve ser atualizado
        assertEquals("Los Angeles", address.getCity());  // Deve permanecer o mesmo
        assertEquals("Brooklyn", address.getNeighborhood()); // Deve ser atualizado
        assertEquals(200, address.getNumber());  // Deve permanecer o mesmo
        assertEquals("5th Ave", address.getStreet());   // Deve ser atualizado
        assertFalse(address.getPlugin());  // Deve permanecer o mesmo

        // Cenário: Criação de um DataUpdateAddress completamente nulo
        dataUpdate = new DataUpdateAddress(
                null,      // country
                null,      // zipCode
                null,      // state
                null,      // city
                null,      // neighborhood
                null,      // number
                null,      // street
                null       // plugin
        );

        // Teste: Nenhum campo deve ser atualizado
        address.updateData(dataUpdate);
        assertEquals("USA", address.getCountry());  // Deve permanecer o mesmo
        assertEquals("98765-432", address.getZipCode());  // Deve permanecer o mesmo
        assertEquals("NY", address.getState());     // Deve permanecer o mesmo
        assertEquals("Los Angeles", address.getCity());  // Deve permanecer o mesmo
        assertEquals("Brooklyn", address.getNeighborhood()); // Deve permanecer o mesmo
        assertEquals(200, address.getNumber());  // Deve permanecer o mesmo
        assertEquals("5th Ave", address.getStreet());   // Deve permanecer o mesmo
        assertFalse(address.getPlugin());  // Deve permanecer o mesmo
    }

}

