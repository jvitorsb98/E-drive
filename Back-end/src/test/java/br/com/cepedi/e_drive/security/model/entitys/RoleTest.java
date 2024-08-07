package br.com.cepedi.e_drive.security.model.entitys;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity Role")
public class RoleTest {

    private Faker faker;
    private Role role;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        role = new Role(faker.lorem().word());
    }

    @Test
    @DisplayName("Test creation of Role entity")
    void testRoleCreation() {
        assertNotNull(role);
        assertNotNull(role.getName());
    }

    @Test
    @DisplayName("Test setting and getting name")
    void testSetAndGetName() {
        String newName = faker.lorem().word();
        role.setName(newName);
        assertEquals(newName, role.getName());
    }


    @Test
    @DisplayName("Test Role entity with null values")
    void testRoleWithNullValues() {
        Role nullRole = new Role();
        assertNull(nullRole.getName());
    }
}

