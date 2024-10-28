package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;

import com.github.javafaker.Faker;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.Locale;

/**
 * Testes para validação da existência do modelo associado ao veículo durante a atualização.
 */
class ValidationUpdateVehicle_ModelExistsTest {

    @Mock
    private ModelRepository modelRepository; // Repositório para verificar a existência do modelo

    @Mock
    private MessageSource messageSource; // Fonte de mensagens para internacionalização

    @InjectMocks
    private ValidationUpdateVehicle_ModelExists validation; // Validador a ser testado

    private Faker faker; // Utilitário para gerar dados fictícios

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Inicializa os mocks
        faker = new Faker(); // Inicializa Faker para gerar dados fictícios
    }

    @Test
    @DisplayName("Deve lançar ValidationException quando o modelo não existir")
    void shouldThrowWhenModelDoesNotExist() {
        // Arrange
        Long modelId = faker.number().randomNumber(); // Gera um ID de modelo fictício
        DataUpdateVehicle data = mock(DataUpdateVehicle.class); // Mock do DataUpdateVehicle

        when(data.modelId()).thenReturn(modelId); // Simula o retorno do ID do modelo
        when(modelRepository.existsById(modelId)).thenReturn(false); // Simula que o modelo não existe
        when(messageSource.getMessage("vehicle.update.model.not.found", null, Locale.getDefault()))
                .thenReturn("O ID do modelo fornecido não existe."); // Mensagem de erro

        // Act & Assert
        ValidationException thrown = assertThrows(
                ValidationException.class,
                () -> validation.validate(data, modelId), // Valida o dado
                "Esperava que ValidationException fosse lançada quando o modelo não existir"
        );

        // Assert
        assertEquals("O ID do modelo fornecido não existe.", thrown.getMessage()); // Verifica a mensagem de erro
        verify(modelRepository).existsById(modelId); // Verifica se o repositório foi consultado
    }

    @Test
    @DisplayName("Deve não lançar ValidationException quando o modelo existir")
    void shouldNotThrowWhenModelExists() {
        // Arrange
        Long modelId = faker.number().randomNumber(); // Gera um ID de modelo fictício
        DataUpdateVehicle data = mock(DataUpdateVehicle.class); // Mock do DataUpdateVehicle

        when(data.modelId()).thenReturn(modelId); // Simula o retorno do ID do modelo
        when(modelRepository.existsById(modelId)).thenReturn(true); // Simula que o modelo existe

        // Act & Assert
        assertDoesNotThrow(() -> validation.validate(data, modelId)); // Valida o dado sem lançar exceção

        // Assert
        verify(modelRepository).existsById(modelId); // Verifica se o repositório foi consultado
    }
}
