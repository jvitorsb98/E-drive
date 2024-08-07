package br.com.cepedi.e_drive.security.model.entitys;

import com.github.javafaker.Faker;
import br.com.cepedi.e_drive.security.model.records.register.DataRegisterUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.Random.class)
@DisplayName("Test entity User")
public class UserTest {

    private Faker faker;
    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        faker = new Faker();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        DataRegisterUser dataRegisterUser = new DataRegisterUser(
                faker.internet().emailAddress(), // Email
                faker.name().fullName(), // Name
                faker.internet().password(), // Password
                LocalDate.now().minusYears(20), // Birth
                faker.phoneNumber().phoneNumber() // Cellphone
        );
        user = new User(dataRegisterUser, passwordEncoder);
        role = new Role("Admin");
        user.getRoles().add(role);
        role.getUsers().add(user);
    }

    @Test
    @DisplayName("Test creation of User entity")
    void testUserCreation() {
        assertNotNull(user);
        assertNotNull(user.getEmail());
        assertNotNull(user.getName());
        assertNotNull(user.getPassword());
        assertNotNull(user.getBirth());
        assertNotNull(user.getCellphone());
        assertNotNull(user.getRoles());
    }

    @Test
    @DisplayName("Test setting and getting email")
    void testSetAndGetEmail() {
        String newEmail = faker.internet().emailAddress();
        user.setEmail(newEmail);
        assertEquals(newEmail, user.getEmail());
    }

    @Test
    @DisplayName("Test setting and getting name")
    void testSetAndGetName() {
        String newName = faker.name().fullName();
        user.setName(newName);
        assertEquals(newName, user.getName());
    }

    @Test
    @DisplayName("Test activation and deactivation")
    void testActivateAndDisable() {
        user.disabled();
        assertFalse(user.getActivated());
        user.activate();
        assertTrue(user.getActivated());
    }

    @Test
    @DisplayName("Test UserDetails methods")
    void testUserDetailsMethods() {
        assertEquals(user.getEmail(), user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertEquals(user.getActivated(), user.isEnabled());
    }

    @Test
    @DisplayName("Test adding and removing roles from User")
    void testRolesManagement() {
        // Check initial role assignment
        assertTrue(user.getRoles().contains(role));
        assertTrue(role.getUsers().contains(user));

        // Remove role
        user.getRoles().remove(role);
        role.getUsers().remove(user);

        // Check role removal
        assertFalse(user.getRoles().contains(role));
        assertFalse(role.getUsers().contains(user));
    }

    @Test
    @DisplayName("Test setting and getting roles")
    void testSetAndGetRoles() {
        Role role1 = new Role("ROLE_USER");
        Role role2 = new Role("ROLE_ADMIN");

        Set<Role> roles = new HashSet<>();
        roles.add(role1);
        roles.add(role2);

        user.setRoles(roles);
        assertTrue(user.getRoles().contains(role1));
        assertTrue(user.getRoles().contains(role2));
    }

    @Test
    @DisplayName("Test adding authorities")
    void testSetAuthorities() {
        // Verifica se o método `setAuthorities` está presente e não lança exceções
        assertDoesNotThrow(() -> user.setAuthorities(new HashSet<>()));
    }

    @Test
    @DisplayName("Test getAuthorities method")
    void testGetAuthorities() {
        User user = new User();
        Role role = new Role("ADMIN");
        user.getRoles().add(role);

        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        Set<String> authorityNames = new HashSet<>();
        authorities.forEach(authority -> authorityNames.add(authority.getAuthority()));

        assertTrue(authorityNames.contains("ROLE_ADMIN"));
    }
}
