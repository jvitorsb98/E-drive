package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import br.com.cepedi.e_drive.repository.ModelRepository; // Importar ModelRepository
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe de validação para verificar se um veículo com a mesma versão já está registrado.
 * Implementa a interface {@link ValidationRegisterVehicle}.
 */
@Component
public class ValidationRegisterVehicle_duplicate_data implements ValidationRegisterVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ModelRepository modelRepository; // Injeção do repositório do modelo

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se já existe um veículo registrado com a mesma versão, considerando o modelo.
     *
     * @param dataRegisterVehicle O registro de dados do veículo que está sendo validado.
     * @throws ValidationException se já existir um veículo com a mesma versão.
     */
    @Override
    public void validate(DataRegisterVehicle dataRegisterVehicle) {
        boolean exists = vehicleRepository.existsByModelIdAndVersionIgnoreCase(
                dataRegisterVehicle.modelId(),
                dataRegisterVehicle.version().trim()
        );

        if (exists) {
            Model model = modelRepository.getReferenceById(dataRegisterVehicle.modelId());


            String message = messageSource.getMessage("vehicle.register.version.duplicate",
                    new Object[]{model.getBrand().getName(), model.getName(), dataRegisterVehicle.version()},
                    Locale.getDefault());

            throw new ValidationException(message);
        }
    }
}
