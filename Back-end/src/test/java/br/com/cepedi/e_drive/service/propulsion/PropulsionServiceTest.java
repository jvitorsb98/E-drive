package br.com.cepedi.e_drive.service.propulsion;

import br.com.cepedi.e_drive.model.entitys.Propulsion;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.propulsion.input.DataRegisterPropulsion;
import br.com.cepedi.e_drive.model.records.propulsion.update.DataUpdatePropulsion;
import br.com.cepedi.e_drive.repository.PropulsionRepository;
import br.com.cepedi.e_drive.service.propulsion.validations.disabled.PropulsionValidatorDisabled;
import br.com.cepedi.e_drive.service.propulsion.validations.update.ValidationUpdatePropulsion;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@DisplayName("PropulsionService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PropulsionServiceTest {

    @Mock
    private PropulsionRepository propulsionRepository;

    @Mock
    private List<PropulsionValidatorDisabled> propulsionValidatorDisabledList;

    @Mock
    private List<ValidationUpdatePropulsion> propulsionValidatorUpdateList;

    @InjectMocks
    private PropulsionService propulsionService;

    private Faker faker;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();
    }

    @Test
    @DisplayName("Register - Should create and return a propulsion")
    void register_ShouldCreateAndReturnPropulsion() {
        // Arrange
        DataRegisterPropulsion data = new DataRegisterPropulsion(faker.lorem().word());
        Propulsion propulsion = new Propulsion(data);
        Propulsion savedPropulsion = new Propulsion(data);
        savedPropulsion.setId(1L);

        when(propulsionRepository.save(any(Propulsion.class))).thenReturn(savedPropulsion);

        // Act
        DataPropulsionDetails result = propulsionService.register(data);

        // Assert
        assertNotNull(result);
        assertEquals(savedPropulsion.getId(), result.id());
        verify(propulsionRepository, times(1)).save(any(Propulsion.class));
    }

    @Test
    @DisplayName("List All - Should return paginated list of propulsions")
    void listAll_ShouldReturnPaginatedList() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Propulsion propulsion = new Propulsion(null, faker.lorem().word(), true);
        Page<Propulsion> page = new PageImpl<>(Collections.singletonList(propulsion), pageable, 1);

        when(propulsionRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<DataPropulsionDetails> result = propulsionService.listAll(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(propulsionRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("List All Deactivated - Should return paginated list of deactivated propulsions")
    void listAllDeactivated_ShouldReturnPaginatedList() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Propulsion propulsion = new Propulsion(null, faker.lorem().word(), false);
        Page<Propulsion> page = new PageImpl<>(Collections.singletonList(propulsion), pageable, 1);

        when(propulsionRepository.findAllByActivatedFalse(pageable)).thenReturn(page);

        // Act
        Page<DataPropulsionDetails> result = propulsionService.listAllDeactivated(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(propulsionRepository, times(1)).findAllByActivatedFalse(pageable);
    }

    @Test
    @DisplayName("List By Name - Should return paginated list of propulsions by name")
    void listByName_ShouldReturnPaginatedList() {
        // Arrange
        String name = faker.lorem().word();
        Pageable pageable = PageRequest.of(0, 10);
        Propulsion propulsion = new Propulsion(null, name, true);
        Page<Propulsion> page = new PageImpl<>(Collections.singletonList(propulsion), pageable, 1);

        when(propulsionRepository.findByNameContaining(name, pageable)).thenReturn(page);

        // Act
        Page<DataPropulsionDetails> result = propulsionService.listByName(name, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(propulsionRepository, times(1)).findByNameContaining(name, pageable);
    }

    @Test
    @DisplayName("Get By Id - Should return propulsion details by id")
    void getById_ShouldReturnPropulsionDetails() {
        // Arrange
        Long id = faker.number().randomNumber();
        Propulsion propulsion = new Propulsion(id, faker.lorem().word(), true);
        propulsion.setId(id);

        when(propulsionRepository.findById(id)).thenReturn(Optional.of(propulsion));

        // Act
        DataPropulsionDetails result = propulsionService.getById(id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.id());
        verify(propulsionRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Get By Id - Should throw exception if propulsion not found")
    void getById_ShouldThrowExceptionIfNotFound() {
        // Arrange
        Long id = faker.number().randomNumber();

        when(propulsionRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> propulsionService.getById(id),
                "Expected getById() to throw RuntimeException when propulsion is not found");
        assertEquals("Propulsion not found", thrown.getMessage());
    }

    @Test
    @DisplayName("Update - Should update and return the propulsion")
    void update_ShouldUpdateAndReturnPropulsion() {
        // Arrange
        Long id = faker.number().randomNumber();
        DataUpdatePropulsion data = new DataUpdatePropulsion(faker.lorem().word());
        Propulsion existingPropulsion = new Propulsion(id, faker.lorem().word(), true);
        existingPropulsion.setId(id);

        when(propulsionRepository.getReferenceById(id)).thenReturn(existingPropulsion);
        when(propulsionRepository.save(existingPropulsion)).thenReturn(existingPropulsion);

        // Act
        DataPropulsionDetails result = propulsionService.update(data, id);

        // Assert
        assertNotNull(result);
        assertEquals(id, result.id());
        verify(propulsionRepository, times(1)).getReferenceById(id);
        verify(propulsionRepository, times(1)).save(existingPropulsion);
    }

   



    @Test
    @DisplayName("Disabled - Should deactivate the propulsion")
    void disabled_ShouldDeactivatePropulsion() {
        // Arrange
        Long id = faker.number().randomNumber();
        Propulsion propulsion = new Propulsion(id, faker.lorem().word(), true);
        propulsion.setId(id);

        when(propulsionRepository.getReferenceById(id)).thenReturn(propulsion);
        when(propulsionRepository.save(propulsion)).thenReturn(propulsion);

        // Act
        propulsionService.disabled(id);

        // Assert
        assertFalse(propulsion.getActivated());
        verify(propulsionRepository, times(1)).getReferenceById(id);
        verify(propulsionRepository, times(1)).save(propulsion);
    }

 

}