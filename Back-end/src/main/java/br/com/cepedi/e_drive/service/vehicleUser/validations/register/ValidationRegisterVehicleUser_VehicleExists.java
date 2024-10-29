package br.com.cepedi.e_drive.service.vehicleUser.validations.register;

import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação de {@link ValidationRegisterVehicleUser} que valida se o veículo
 * associado ao usuário existe no repositório de veículos.
 */
@Component
public class ValidationRegisterVehicleUser_VehicleExists implements ValidationRegisterVehicleUser {

    private final VehicleRepository vehicleRepository;
    private final MessageSource messageSource;

    /**
     * Construtor que injeta o repositório de veículos e o MessageSource.
     *
     * @param vehicleRepository o repositório de veículos a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationRegisterVehicleUser_VehicleExists(VehicleRepository vehicleRepository, MessageSource messageSource) {
        this.vehicleRepository = vehicleRepository;
        this.messageSource = messageSource;
    }

    /**
     * Valida se o veículo com o ID fornecido existe no repositório.
     *
     * <p>Se o veículo não existir, uma {@link ValidationException} será lançada.</p>
     *
     * @param data Dados de registro do usuário de veículo contendo o ID do veículo.
     * @throws ValidationException se o ID do veículo fornecido não existir no repositório.
     */
    @Override
    public void validate(DataRegisterVehicleUser data) {
        if (!vehicleRepository.existsById(data.vehicleId())) {
            String errorMessage = messageSource.getMessage(
                    "vehicle.notExists",            // Chave da mensagem para veículo inexistente
                    new Object[]{data.vehicleId()}, // Parâmetro da mensagem (ID do veículo)
                    Locale.getDefault()             // Locale padrão
            );
            throw new ValidationException(errorMessage);
        }
    }
}
