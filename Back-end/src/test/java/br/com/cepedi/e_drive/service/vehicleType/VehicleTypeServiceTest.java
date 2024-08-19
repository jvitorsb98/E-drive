package br.com.cepedi.e_drive.service.vehicleType;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import br.com.cepedi.e_drive.service.vehicleType.validations.activated.ValidationVehicleTypeActivated;
import br.com.cepedi.e_drive.service.vehicleType.validations.disabled.VehicleTypeValidatorDisabled;
import br.com.cepedi.e_drive.service.vehicleType.validations.update.ValidationUpdateVehicleType;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


class VehicleTypeServiceTest {

	@InjectMocks
	private VehicleTypeService vehicleTypeService;

	@Mock
	private VehicleTypeRepository vehicleTypeRepository;

	@Mock
	private List<ValidationUpdateVehicleType> vehicleTypeValidationUpdateList;

	@Mock
	private List<ValidationVehicleTypeActivated> vehicleTypeValidatorActivatedList;

	@Mock
	private List<VehicleTypeValidatorDisabled> vehicleTypeValidatorDisabledList;

    @Mock
    private ValidationUpdateVehicleType validator1;

    @Mock
    private ValidationUpdateVehicleType validator2;
	
	@Mock
	private ValidationUpdateVehicleType validationUpdateVehicleType;

	@Mock
	private VehicleType vehicleType;


	private Faker faker;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		faker = new Faker();
		 vehicleTypeValidationUpdateList = List.of(validator1, validator2);
    }
	

	@Test
	@DisplayName("Should register a vehicle type")
	void shouldRegisterVehicleType() {
		DataRegisterVehicleType dataRegister = new DataRegisterVehicleType(
				faker.lorem().word()
				);

		when(vehicleTypeRepository.save(any(VehicleType.class))).thenReturn(vehicleType);
		when(vehicleType.getId()).thenReturn(faker.number().randomNumber());

		DataVehicleTypeDetails result = vehicleTypeService.register(dataRegister);

		assertNotNull(result);
		assertEquals(vehicleType.getId(), result.id());
		verify(vehicleTypeRepository).save(any(VehicleType.class));
	}




	@Test
	@DisplayName("Should get vehicle type by ID")
	void shouldGetVehicleTypeById() {
		Long vehicleTypeId = faker.number().randomNumber();
		when(vehicleTypeRepository.findById(vehicleTypeId)).thenReturn(Optional.of(vehicleType));
		when(vehicleType.getId()).thenReturn(vehicleTypeId);

		DataVehicleTypeDetails result = vehicleTypeService.getById(vehicleTypeId);

		assertNotNull(result);
		assertEquals(vehicleTypeId, result.id());
		verify(vehicleTypeRepository).findById(vehicleTypeId);
	}

	@Test
	@DisplayName("Should list all vehicle types")
	void shouldListAllVehicleTypes() {
		Pageable pageable = Pageable.ofSize(10);
		when(vehicleTypeRepository.findAll(pageable)).thenReturn(Page.empty());

		Page<DataVehicleTypeDetails> result = vehicleTypeService.listAll(pageable);

		assertNotNull(result);
		assertTrue(result.isEmpty());
		verify(vehicleTypeRepository).findAll(pageable);
	}


	@Test
	@DisplayName("Should activate a vehicle type")
	void shouldActivateVehicleType() {
		Long vehicleTypeId = faker.number().randomNumber();

		when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);

		vehicleTypeService.activated(vehicleTypeId);

		verify(vehicleTypeValidatorActivatedList).forEach(any());
		verify(vehicleType).activated();
	}

	@Test
	@DisplayName("Should list all activated vehicle types")
	void shouldListAllActivatedVehicleTypes() {
		Pageable pageable = Pageable.ofSize(10);
		when(vehicleTypeRepository.findAllByActivatedTrue(pageable)).thenReturn(Page.empty());

		Page<DataVehicleTypeDetails> result = vehicleTypeService.listAllActivated(pageable);

		assertNotNull(result);
		assertTrue(result.isEmpty());
		verify(vehicleTypeRepository).findAllByActivatedTrue(pageable);
	}

	@Test
	@DisplayName("Should disable a vehicle type")
	void shouldDisableVehicleType() {
		Long vehicleTypeId = faker.number().randomNumber();

		when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);

		vehicleTypeService.disabled(vehicleTypeId);

		verify(vehicleTypeValidatorDisabledList).forEach(any());
		verify(vehicleType).disabled();
	}

	@Disabled
	@Test
    @DisplayName("Should update VehicleType and return updated details")
    void testUpdateVehicleType() {
        // Arrange
        Long vehicleTypeId = 226L;
        String newName = "UpdatedName";
        DataUpdateVehicleType dataUpdate = new DataUpdateVehicleType(newName);
        VehicleType vehicleType = mock(VehicleType.class);

        // Configura o comportamento esperado
        when(vehicleTypeRepository.getReferenceById(vehicleTypeId)).thenReturn(vehicleType);
        when(vehicleTypeRepository.save(vehicleType)).thenReturn(vehicleType);
        doNothing().when(validator1).validation(vehicleTypeId);
        doNothing().when(validator2).validation(vehicleTypeId);
        doNothing().when(vehicleType).updateDataVehicleType(dataUpdate);

        // Act
        DataVehicleTypeDetails result = vehicleTypeService.update(dataUpdate, vehicleTypeId);

        // Assert
        verify(validator1, times(1)).validation(vehicleTypeId);
        verify(validator2, times(1)).validation(vehicleTypeId);
        verify(vehicleType, times(1)).updateDataVehicleType(dataUpdate);
        verify(vehicleTypeRepository, times(1)).save(vehicleType);

        // Verifica o resultado esperado
        DataVehicleTypeDetails expectedDetails = new DataVehicleTypeDetails(vehicleTypeId, newName, true);
        assertEquals(expectedDetails, result, "Expected the updated vehicle type details to match the result");
    }
}



