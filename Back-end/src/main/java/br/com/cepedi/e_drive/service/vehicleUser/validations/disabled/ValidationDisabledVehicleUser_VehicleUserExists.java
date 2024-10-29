package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationDisabledVehicleUser} para validar a existência de um usuário de veículo.
 */
@Component
public class ValidationDisabledVehicleUser_VehicleUserExists implements ValidationDisabledVehicleUser {

    private final VehicleUserRepository vehicleUserRepository;
    private final MessageSource messageSource;

    /**
     * Construtor que injeta o repositório de usuários de veículos e o MessageSource.
     *
     * @param vehicleUserRepository o repositório de usuários de veículos a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationDisabledVehicleUser_VehicleUserExists(VehicleUserRepository vehicleUserRepository, MessageSource messageSource) {
        this.vehicleUserRepository = vehicleUserRepository;
        this.messageSource = messageSource;
    }

    /**
     * Valida se o usuário de veículo com o ID fornecido existe.
     *
     * <p>Se o usuário de veículo não existir, uma {@link ValidationException} será lançada.</p>
     *
     * @param id ID do usuário de veículo a ser validado.
     * @throws ValidationException se o usuário de veículo não existir.
     */
    @Override
    public void validate(Long id) {
        if (!vehicleUserRepository.existsById(id)) {
            String errorMessage = messageSource.getMessage(
                    "vehicleUser.not.exist",   // Chave da mensagem para usuário de veículo não existente
                    new Object[]{id},          // Parâmetro da mensagem (ID)
                    Locale.getDefault()        // Locale padrão
            );
            throw new ValidationException(errorMessage);
        }
    }
}
