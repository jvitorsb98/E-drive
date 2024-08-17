package br.com.cepedi.e_drive.service.model;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.service.model.validations.activated.ValidationModelActivated;
import br.com.cepedi.e_drive.service.model.validations.disabled.ModelValidatorDisabled;
import br.com.cepedi.e_drive.service.model.validations.register.ValidationRegisterModel;
import br.com.cepedi.e_drive.service.model.validations.update.ValidationModelUpdate;
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
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@DisplayName("ModelService Tests")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ModelServiceTest {

    @InjectMocks
    private ModelService modelService;

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private List<ValidationModelUpdate> modelValidationUpdateList;

    @Mock
    private List<ValidationModelActivated> modelValidatorActivatedList;

    @Mock
    private List<ModelValidatorDisabled> modelValidatorDisabledList;

    @Mock
    private List<ValidationRegisterModel> validationRegisterModelList;

    private Faker faker;
    private DataRegisterModel dataRegisterModel;
    private DataUpdateModel dataUpdateModel;
    private Model model;
    private Brand brand;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        faker = new Faker();

        // Arrange: Initialize test data
        dataRegisterModel = new DataRegisterModel(
            faker.lorem().word(),
            faker.number().randomNumber() 
        );

        dataUpdateModel = new DataUpdateModel(
            faker.lorem().word(), null
        );

        brand = new Brand(null, faker.lorem().word(), true); 
        model = new Model(dataRegisterModel, brand);
        model.setId(faker.number().randomNumber());
        model.setActivated(true);
    }
    
    @Test
    @DisplayName("Register - Valid Data - Model Registered")
    void register_ValidData_ModelRegistered() {
        // Arrange
        Long brandId = faker.number().randomNumber();
        String modelName = faker.company().name();

        DataRegisterModel data = new DataRegisterModel(modelName, brandId);
        Brand brand = new Brand();
        brand.setId(brandId);
        
        Model model = new Model();
        model.setId(faker.number().randomNumber());
        model.setName(modelName);
        model.setBrand(brand);

        when(brandRepository.getReferenceById(brandId)).thenReturn(brand);
        when(modelRepository.save(any(Model.class))).thenReturn(model);

        // Act
        DataModelDetails result = modelService.register(data);

        // Assert
        assertAll(
            () -> assertEquals(modelName, result.name(),
            		() -> "Model name should match input data"),
            () -> assertEquals(brandId, model.getBrand().getId(),
            		() -> "Model's brand ID should match the input data")

        );
    }

    @Test
    @DisplayName("Update - Valid Data - Model Updated")
    void update_ValidData_ModelUpdated() {
        // Arrange
        Long id = faker.number().randomNumber();
        Long idBrand = faker.number().randomNumber();
        String updatedModelName = faker.company().name(); // Generates a random company name
        DataUpdateModel dataUpdate = new DataUpdateModel(updatedModelName, idBrand);

        // Mocking the existing model
        Model existingModel = new Model();
        existingModel.setId(id);
        existingModel.setName("Original Model Name");

        // Mocking the brand that is being validated
        Brand mockBrand = new Brand();
        mockBrand.setId(idBrand);
        mockBrand.setName("Test Brand");

        // Set the brand to the existing model
        existingModel.setBrand(mockBrand);

        when(modelRepository.getReferenceById(id)).thenReturn(existingModel);
        when(brandRepository.getReferenceById(idBrand)).thenReturn(mockBrand);
        when(brandRepository.existsById(idBrand)).thenReturn(true); // Ensure that the brand exists in the mock

        // Act
        DataModelDetails result = modelService.update(dataUpdate, id);

        // Assert
        verify(modelRepository, never()).save(any(Model.class)); // Ensure save() was not called
        assertEquals(updatedModelName, result.name(),
                () -> "The returned model name should match the updated value");
        assertEquals(idBrand, result.brand().id(),
                () -> "The returned brand ID should match the updated brand ID");
    }

    @Test
    @DisplayName("Should get model by ID successfully")
    void getModelById_ExistingId_ModelReturned() {
        // Arrange
        when(modelRepository.findById(anyLong())).thenReturn(Optional.of(model));

        // Act
        DataModelDetails result = modelService.getModelById(model.getId());

        // Assert
        assertAll("Get model by ID",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(model.getName(), result.name(), 
                () -> "Returned model name should match the expected name"),
            () -> verify(modelRepository, times(1)).findById(anyLong())
        );
    }

    @Test
    @DisplayName("Should throw exception when model not found by ID")
    void getModelById_NonExistingId_ThrowsException() {
        // Arrange
        when(modelRepository.findById(anyLong())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, 
            () -> modelService.getModelById(model.getId()), 
            () -> "Expected an exception to be thrown when model is not found"
        );
        verify(modelRepository, times(1)).findById(anyLong());
    }

    @Test
    @DisplayName("Should list all models")
    void listAllModels_ModelsReturned() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Model> modelPage = new PageImpl<>(List.of(model));
        when(modelRepository.findAll(pageRequest)).thenReturn(modelPage);

        // Act
        Page<DataModelDetails> result = modelService.listAllModels(pageRequest);

        // Assert
        assertAll("List all models",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(1, result.getTotalElements(), 
                () -> "Total elements should match the expected number of models"),
            () -> verify(modelRepository, times(1)).findAll(pageRequest)
        );
    }

    @Test
    @DisplayName("Should activate a model successfully")
    void activated_ValidId_ModelActivated() {
        // Arrange
        when(modelRepository.getReferenceById(anyLong())).thenReturn(model);

        // Act
        modelService.activated(model.getId());

        // Assert
        assertAll("Activate model",
            () -> verify(modelValidatorActivatedList, times(1)).forEach(any()),
            () -> verify(modelRepository, times(1)).getReferenceById(anyLong()),
            () -> assertTrue(model.getActivated(), "Model should be activated")
        );
    }

    @Test
    @DisplayName("Should list all activated models")
    void listAllModelsActivatedTrue_ModelsReturned() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<Model> modelPage = new PageImpl<>(List.of(model));
        when(modelRepository.findAllByActivatedTrue(pageRequest)).thenReturn(modelPage);

        // Act
        Page<DataModelDetails> result = modelService.listAllModelsActivatedTrue(pageRequest);

        // Assert
        assertAll("List all activated models",
            () -> assertNotNull(result, "Result should not be null"),
            () -> assertEquals(1, result.getTotalElements(), 
                () -> "Total elements should match the expected number of activated models"),
            () -> verify(modelRepository, times(1)).findAllByActivatedTrue(pageRequest)
        );
    }

    @Test
    @DisplayName("Should disable a model successfully")
    void disable_ValidId_ModelDisabled() {
        // Arrange
        when(modelRepository.getReferenceById(anyLong())).thenReturn(model);

        // Act
        modelService.disable(model.getId());

        // Assert
        assertAll("Disable model",
            () -> verify(modelValidatorDisabledList, times(1)).forEach(any()),
            () -> verify(modelRepository, times(1)).getReferenceById(anyLong()),
            () -> assertFalse(model.getActivated(), "Model should be deactivated")
        );
    }
}
