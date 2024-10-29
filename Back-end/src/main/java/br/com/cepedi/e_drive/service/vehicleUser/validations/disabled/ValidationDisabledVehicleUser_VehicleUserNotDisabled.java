package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import br.com.cepedi.e_drive.repository.VehicleUserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationDisabledVehicleUser} para verificar se um usuário de veículo não está desativado.
 */
@Component
public class ValidationDisabledVehicleUser_VehicleUserNotDisabled implements ValidationDisabledVehicleUser {

    private final VehicleUserRepository vehicleUserRepository;
    private final MessageSource messageSource;

    /**
     * Construtor que injeta o repositório de usuários de veículos e o MessageSource.
     *
     * @param vehicleUserRepository o repositório de usuários de veículos a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationDisabledVehicleUser_VehicleUserNotDisabled(VehicleUserRepository vehicleUserRepository, MessageSource messageSource) {
        this.vehicleUserRepository = vehicleUserRepository;
        this.messageSource = messageSource;
    }

    /**
     * Valida se o usuário de veículo com o ID fornecido está ativado.
     *
     * <p>Se o usuário de veículo estiver desativado, uma {@link ValidationException} será lançada.</p>
     *
     * @param id ID do usuário de veículo a ser validado.
     * @throws ValidationException se o usuário de veículo estiver desativado.
     */
    @Override
    public void validate(Long id) {
        if (vehicleUserRepository.existsById(id)) {
            VehicleUser vehicleUser = vehicleUserRepository.getReferenceById(id);
            if (!vehicleUser.isActivated()) {
                String errorMessage = messageSource.getMessage(
                        "vehicleUser.disabled",     // Chave da mensagem para usuário de veículo desativado
                        new Object[]{id},           // Parâmetro da mensagem (ID)
                        Locale.getDefault()         // Locale padrão
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
