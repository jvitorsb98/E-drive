package br.com.cepedi.e_drive.model.entitys;

import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataRegisterVehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class VehicleTypeTest {

    private final Faker faker = new Faker();
    private VehicleType vehicleType;

    @BeforeEach
    public void setUp() {
        vehicleType = new VehicleType();
    }

    @Test
    @DisplayName("Should activate the vehicle type")
    public void testActivate() {
        // Arrange
        vehicleType.disabled(); // Desativa o veículo tipo primeiro

        // Act
        vehicleType.activated(); // Ativa o veículo tipo

        // Assert
        assertTrue(vehicleType.isActivated(), "O tipo de veículo deve estar ativado.");
    }

    @Test
    @DisplayName("Should deactivate the vehicle type")
    public void testDeactivate() {
        // Arrange
        vehicleType.activated(); // Ativa o veículo tipo primeiro

        // Act
        vehicleType.disabled(); // Desativa o veículo tipo

        // Assert
        assertFalse(vehicleType.isActivated(), "O tipo de veículo deve estar desativado.");
    }

    @Test
    @DisplayName("Should update vehicle type data with new values")
    public void testUpdateDataVehicleType() {
        // Arrange
        String newName = faker.lorem().word(); // Gera um nome aleatório

        DataUpdateVehicleType data = mock(DataUpdateVehicleType.class);
        when(data.name()).thenReturn(newName);

        // Act
        vehicleType.updateDataVehicleType(data);

        // Assert
        assertEquals(newName, vehicleType.getName(), "O nome do tipo de veículo deve ser atualizado.");
    }

    @Test
    @DisplayName("Should initialize vehicle type from registration data")
    public void testConstructorFromDataRegisterVehicleType() {
        // Arrange
        String name = faker.lorem().word(); // Gera um nome aleatório
        boolean activated = faker.bool().bool(); // Gera um valor booleano aleatório

        DataRegisterVehicleType data = mock(DataRegisterVehicleType.class);
        when(data.name()).thenReturn(name);
        when(data.activated()).thenReturn(activated);

        // Act
        VehicleType vehicleType = new VehicleType(data);

        // Assert
        assertEquals(name, vehicleType.getName(), "O nome do tipo de veículo deve ser inicializado corretamente.");
        assertEquals(activated, vehicleType.isActivated(), "O tipo de veículo deve estar ativado ou desativado corretamente.");
    }
}

