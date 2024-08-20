//package br.com.cepedi.e_drive.service.vehicleUser.validations.register;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import static org.mockito.Mockito.*;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
//import br.com.cepedi.e_drive.security.repository.UserRepository;
//import jakarta.validation.ValidationException;
//
//public class ValidationRegisterVehicleUser_UserExistsTest {
//
//    @Mock
//    private UserRepository userRepository;
//
//    @InjectMocks
//    private ValidationRegisterVehicleUser_UserExists validation;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    @DisplayName("Should throw ValidationException when User does not exist")
//    void testValidate_WhenUserDoesNotExist() {
//        // Arrange
//        Long userId = 1L;
//        DataRegisterVehicleUser data = new DataRegisterVehicleUser(userId, 1L, null); // Mock vehicleId
//        when(userRepository.existsById(userId)).thenReturn(false);
//
//        // Act & Assert
//        ValidationException thrown = assertThrows(ValidationException.class, () -> {
//            validation.validate(data);
//        });
//        assertEquals("The provided user id does not exist", thrown.getMessage());
//    }
//
//    @Test
//    @DisplayName("Should not throw ValidationException when User exists")
//    void testValidate_WhenUserExists() {
//        // Arrange
//        Long userId = 1L;
//        DataRegisterVehicleUser data = new DataRegisterVehicleUser(userId, 1L, null); // Mock vehicleId
//        when(userRepository.existsById(userId)).thenReturn(true);
//
//        // Act & Assert
//        validation.validate(data); // No exception should be thrown
//    }
//}
