package br.com.cepedi.e_drive.service.vehicleUser;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;
import br.com.cepedi.e_drive.model.records.vehicleUser.details.DataVehicleUserDetails;
import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.model.records.vehicleUser.update.DataUpdateVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.vehicleUser.validations.disabled.ValidationDisabledVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.validations.register.ValidationRegisterVehicleUser;
import br.com.cepedi.e_drive.service.vehicleUser.validations.update.ValidationUpdateVehicleUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class VehicleUserServiceTest {

	@Mock
	private VehicleUserRepository vehicleUserRepository;

	@Mock
	private UserRepository userRepository;

	@Mock
	private VehicleRepository vehicleRepository;

	@Mock
	private List<ValidationRegisterVehicleUser> validationRegisterVehicleUserList;

	@Mock
	private List<ValidationUpdateVehicleUser> validationUpdateVehicleUserList;

	@Mock
	private List<ValidationDisabledVehicleUser> validationDisabledVehicleUsers;

	@InjectMocks
	private VehicleUserService vehicleUserService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}


	@Test
	@DisplayName("Should register vehicle user")
	void testRegisterVehicleUser() {
		// Arrange
		User user = new User();
		user.setId(1L);
		user.setEmail("email@email.com");

		Vehicle vehicle = new Vehicle();
		vehicle.setId(1L);

		DataRegisterVehicleUser data = new DataRegisterVehicleUser(
				1L,
				new DataRegisterAutonomy(
						BigDecimal.valueOf(10), 
						BigDecimal.valueOf(8), 
						BigDecimal.valueOf(0.2), 
						BigDecimal.valueOf(50), null
						)
				);

		VehicleUser vehicleUser = new VehicleUser(user, vehicle, data.dataRegisterAutonomy());

		when(vehicleUserRepository.save(any(VehicleUser.class))).thenReturn(vehicleUser);

		// Mock Validation
		ValidationRegisterVehicleUser mockValidation = mock(ValidationRegisterVehicleUser.class);
		doNothing().when(mockValidation).validate(any(DataRegisterVehicleUser.class));

		when(validationRegisterVehicleUserList.size()).thenReturn(1);
		when(validationRegisterVehicleUserList.get(0)).thenReturn(mockValidation);

		// Act
		vehicleUserService.register(data,user.getEmail());

		// Assert
		verify(validationRegisterVehicleUserList).forEach(any());
		verify(vehicleUserRepository).save(any(VehicleUser.class));
	}

	@Test
	@DisplayName("Should update VehicleUser and return DataVehicleUserDetails")
	void testUpdateVehicleUser() {
		// Arrange
		Long vehicleUserId = 1L;
		DataUpdateAutonomy dataUpdateAutonomy = new DataUpdateAutonomy(
				BigDecimal.valueOf(15), 
				BigDecimal.valueOf(12), 
				BigDecimal.valueOf(1.5), 
				BigDecimal.valueOf(100), null
				);
		DataUpdateVehicleUser dataUpdateVehicleUser = new DataUpdateVehicleUser(dataUpdateAutonomy);

		// Mocking the Vehicle, User, and VehicleUser
		Vehicle vehicle = new Vehicle();
		vehicle.setId(1L); // Set the ID for the vehicle

		User user = new User();
		user.setId(1L); // Set the ID for the user

		VehicleUser vehicleUser = new VehicleUser(user, vehicle, new DataRegisterAutonomy(
				BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null
				));
		vehicleUser.setId(vehicleUserId); // Set the ID for the vehicleUser
		vehicleUser.setVehicle(vehicle); // Ensure the vehicle is set
		vehicleUser.setUser(user); // Ensure the user is set

		// Mock repository methods
		when(vehicleUserRepository.getReferenceById(vehicleUserId)).thenReturn(vehicleUser);
		when(vehicleUserRepository.save(any(VehicleUser.class))).thenReturn(vehicleUser);

		// Mock validation
		doNothing().when(validationUpdateVehicleUserList).forEach(any());

		// Act
		DataVehicleUserDetails result = vehicleUserService.updateVehicleUser(dataUpdateVehicleUser, vehicleUserId);

		// Assert
		assertNotNull(result);
		assertEquals(vehicleUserId, result.id()); 
		assertEquals(vehicle.getId(), result.vehicleId()); 
		assertEquals(user.getId(), result.userId()); 
		verify(vehicleUserRepository).save(vehicleUser);
	}



	@Test
	@DisplayName("Should disable vehicle user successfully")
	void testDisableVehicleUserSuccess() {
		// Arrange
		Long vehicleUserId = 1L;
		VehicleUser vehicleUser = new VehicleUser();
		vehicleUser.setId(vehicleUserId);
		vehicleUser.setActivated(true);  

		when(vehicleUserRepository.getReferenceById(vehicleUserId)).thenReturn(vehicleUser);
		doNothing().when(validationDisabledVehicleUsers).forEach(any());

		// Act
		vehicleUserService.disableVehicleUser(vehicleUserId);

		// Assert
		assertFalse(vehicleUser.isActivated());  
		verify(vehicleUserRepository).save(vehicleUser);  
	}



	@Test
	@DisplayName("Should enable VehicleUser")
	void testEnableVehicleUser() {
		// Arrange
		Long id = 1L;
		VehicleUser vehicleUser = mock(VehicleUser.class);

		when(vehicleUserRepository.getReferenceById(id)).thenReturn(vehicleUser);

		// Act
		vehicleUserService.enableVehicleUser(id);

		// Assert
		verify(vehicleUser).enable();
		verify(vehicleUserRepository).save(vehicleUser);
	}

	
	@Test
	@DisplayName("Should get all activated vehicle users")
	void testGetAllVehicleUsersActivated() {
		// Arrange
		User user = new User(); 
		user.setId(1L);

		Vehicle vehicle = new Vehicle(); 
		vehicle.setId(1L);

		VehicleUser vehicleUser = new VehicleUser();
		vehicleUser.setId(1L);
		vehicleUser.setUser(user);
		vehicleUser.setVehicle(vehicle);
		vehicleUser.setMileagePerLiterRoad(BigDecimal.valueOf(10));
		vehicleUser.setMileagePerLiterCity(BigDecimal.valueOf(8));
		vehicleUser.setConsumptionEnergetic(BigDecimal.valueOf(0.2));
		vehicleUser.setAutonomyElectricMode(BigDecimal.valueOf(50));
		vehicleUser.setActivated(true);

		// Mocking repository behavior
		when(vehicleUserRepository.findAllActivated(any(Pageable.class)))
		.thenReturn(new PageImpl<>(List.of(vehicleUser)));

		// Act
		Page<DataVehicleUserDetails> result = vehicleUserService.getAllVehicleUsersActivated(Pageable.unpaged());

		// Assert
		assertNotNull(result);
		assertEquals(1, result.getTotalElements());

		// Verifique se o conteúdo da página está correto
		DataVehicleUserDetails details = result.getContent().get(0);
		assertEquals(1L, details.userId()); 
		assertEquals(1L, details.vehicleId());  
	}



	@Test
	@DisplayName("Should get VehicleUsers by User ID")
	void testGetVehicleUsersByUser() {
		// Arrange
		Long userId = 1L;
		Pageable pageable = mock(Pageable.class);

		String email = "test@example.com";  // Defina um e-mail para o teste

		User user = mock(User.class);  // Mock o User
		when(user.getId()).thenReturn(userId);  // Certifique-se de que getId() retorna o userId
		when(user.getEmail()).thenReturn(email);  // Mock o e-mail do User

		Vehicle vehicle = new Vehicle();
		vehicle.setId(1L);

		VehicleUser vehicleUser = new VehicleUser();
		vehicleUser.setId(1L);
		vehicleUser.setUser(user);  // Configure o User mockado
		vehicleUser.setVehicle(vehicle);
		vehicleUser.setMileagePerLiterRoad(BigDecimal.valueOf(10));
		vehicleUser.setMileagePerLiterCity(BigDecimal.valueOf(8));
		vehicleUser.setConsumptionEnergetic(BigDecimal.valueOf(5));
		vehicleUser.setAutonomyElectricMode(BigDecimal.valueOf(100));
		vehicleUser.setActivated(true);

		Page<VehicleUser> page = new PageImpl<>(Collections.singletonList(vehicleUser));

		when(userRepository.findByEmail(email)).thenReturn(user);  // Mock o retorno do repositório de usuários
		when(vehicleUserRepository.findByUserId(userId, pageable)).thenReturn(page);

		// Act
		Page<DataVehicleUserDetails> result = vehicleUserService.getVehicleUsersByUser(email, pageable);

		// Assert
		assertNotNull(result, "Result should not be null");
		assertEquals(1, result.getTotalElements(), "Total elements should be 1");

		DataVehicleUserDetails details = result.getContent().get(0);
		assertEquals(userId, details.userId(), "User ID should match");
	}




	@Test
	@DisplayName("Should get VehicleUsers by Vehicle ID")
	void testGetVehicleUsersByVehicle() {
		// Arrange
		Long vehicleId = 1L;
		Pageable pageable = mock(Pageable.class);

		// Mock dos objetos necessários
		User user = new User(); 
		user.setId(1L); 

		Vehicle vehicle = new Vehicle(); 
		vehicle.setId(vehicleId); 

		VehicleUser vehicleUser = new VehicleUser();
		vehicleUser.setId(1L);
		vehicleUser.setUser(user);
		vehicleUser.setVehicle(vehicle);
		vehicleUser.setMileagePerLiterRoad(BigDecimal.valueOf(10));
		vehicleUser.setMileagePerLiterCity(BigDecimal.valueOf(8));
		vehicleUser.setConsumptionEnergetic(BigDecimal.valueOf(5));
		vehicleUser.setAutonomyElectricMode(BigDecimal.valueOf(100));
		vehicleUser.setActivated(true);

		Page<VehicleUser> page = new PageImpl<>(Collections.singletonList(vehicleUser));

		// Configura o mock do repositório
		when(vehicleUserRepository.findByVehicleId(vehicleId, pageable)).thenReturn(page);

		// Act
		Page<DataVehicleUserDetails> result = vehicleUserService.getVehicleUsersByVehicle(vehicleId, pageable);

		// Assert
		assertNotNull(result, "Result should not be null");
		assertEquals(1, result.getTotalElements(), "Total elements should be 1");

		DataVehicleUserDetails details = result.getContent().get(0);
		assertEquals(user.getId(), details.userId(), "User ID should match");
		assertEquals(vehicleUser.getMileagePerLiterRoad(), details.mileagePerLiterRoad(),
				() -> "Mileage per liter road should match");
		assertEquals(vehicleUser.getMileagePerLiterCity(), details.mileagePerLiterCity(),
				() -> "Mileage per liter city should match");
		assertEquals(vehicleUser.getConsumptionEnergetic(), details.consumptionEnergetic(),
				() -> "Consumption energetic should match");
		assertEquals(vehicleUser.getAutonomyElectricMode(), details.autonomyElectricMode(),
				() -> "Autonomy electric mode should match");
		assertEquals(vehicleUser.isActivated(), details.activated(),
				() -> "Activated status should match");
	}
}

