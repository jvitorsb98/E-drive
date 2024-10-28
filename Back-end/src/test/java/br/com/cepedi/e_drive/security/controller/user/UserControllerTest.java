package br.com.cepedi.e_drive.security.controller.user;

import br.com.cepedi.e_drive.security.model.entitys.Role;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsUser;
import br.com.cepedi.e_drive.security.model.records.details.DataDetailsRole;
import br.com.cepedi.e_drive.security.model.records.update.DataUpdateUser;
import br.com.cepedi.e_drive.security.service.user.UserService;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Should return true if user exists")
    void userExists_ShouldReturnTrueIfUserExists() {
        String email = faker.internet().emailAddress();
        when(userService.existsByEmail(email)).thenReturn(true);

        ResponseEntity<Boolean> response = userController.userExists(email);

        assertEquals(true, response.getBody(), "Expected user existence check to return true");
        verify(userService, times(1)).existsByEmail(email);
    }

    @Test
    @DisplayName("Should return false if user does not exist")
    void userExists_ShouldReturnFalseIfUserDoesNotExist() {
        String email = faker.internet().emailAddress();
        when(userService.existsByEmail(email)).thenReturn(false);

        ResponseEntity<Boolean> response = userController.userExists(email);

        assertEquals(false, response.getBody(), "Expected user existence check to return false");
        verify(userService, times(1)).existsByEmail(email);
    }

    @Test
    @DisplayName("Should return user details for authenticated user")
    void getUserDetails_ShouldReturnUserDetailsForAuthenticatedUser() {
        String email = faker.internet().emailAddress();
        UserDetails userDetails = User.withUsername(email).password("password").authorities("USER").build();
        DataDetailsUser expectedUserDetails = new DataDetailsUser(1L, email, faker.name().fullName(),
                LocalDate.of(1990, 1, 1), faker.phoneNumber().cellPhone(), true,
                Set.of(new DataDetailsRole(new Role("USER"))));
        when(userService.getDetailsUserByEmail(email)).thenReturn(expectedUserDetails);

        ResponseEntity<DataDetailsUser> response = userController.getUserDetails(userDetails);

        assertEquals(expectedUserDetails, response.getBody(), "Expected user details to match");
        verify(userService, times(1)).getDetailsUserByEmail(email);
    }

    @Test
    @DisplayName("Should update and return updated user details")
    void updateUser_ShouldUpdateAndReturnUpdatedUserDetails() {
        String email = faker.internet().emailAddress();
        UserDetails userDetails = User.withUsername(email).password("password").authorities("USER").build();
        
        String updatedName = faker.name().fullName();
        String updatedCellPhone = faker.phoneNumber().cellPhone();
        LocalDate updatedBirthDate = LocalDate.of(1985, 5, 15);

        DataUpdateUser dataUpdateUser = new DataUpdateUser(updatedName, updatedCellPhone, updatedBirthDate);
        DataDetailsUser updatedUserDetails = new DataDetailsUser(1L, email, updatedName,
                updatedBirthDate, updatedCellPhone, true,
                Set.of(new DataDetailsRole(new Role("USER"))));
        
        when(userService.updateUser(dataUpdateUser, userDetails)).thenReturn(updatedUserDetails);

        ResponseEntity<DataDetailsUser> response = userController.updateUser(userDetails, dataUpdateUser);

        assertEquals(updatedUserDetails, response.getBody(), "Expected updated user details to match");
        verify(userService, times(1)).updateUser(dataUpdateUser, userDetails);
    }
}
