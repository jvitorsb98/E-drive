package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se já existe um veículo registrado com a mesma versão, considerando o modelo.
 */
@Component
public class ValidationUpdateVehicle_duplicate_data implements ValidationUpdateVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ModelRepository modelRepository; // Injeção do repositório do modelo

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se já existe um veículo registrado com a mesma versão, considerando o modelo.
     *
     * @param data O registro de dados do veículo que está sendo validado.
     * @param id   O ID do veículo que está sendo atualizado.
     * @throws ValidationException se já existir um veículo com a mesma versão.
     */
    @Override
    public void validate(DataUpdateVehicle data, Long id) {
        if (data.version() != null) {
            // Verifica se já existe um veículo com o mesmo modelo e versão, exceto o veículo que está sendo atualizado.
            boolean exists = vehicleRepository.existsByModelIdAndVersionIgnoreCaseAndIdNot(
                    data.modelId(),
                    data.version().trim(),
                    id
            );

            if (exists) {
                Model model = modelRepository.getReferenceById(data.modelId());

                String message = messageSource.getMessage(
                        "vehicle.update.version.duplicate",
                        new Object[]{model.getBrand().getName(), model.getName(), data.version()},
                        Locale.getDefault()
                );

                throw new ValidationException(message);
            }
        }
    }
}
