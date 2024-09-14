package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe de validação para verificar se um veículo com a mesma versão já está registrado.
 * Implementa a interface {@link ValidationRegisterVehicle}.
 */
@Component
public class ValidationRegisterVehicle_duplicate_data implements ValidationRegisterVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Valida se já existe um veículo registrado com a mesma versão, ignorando diferenças de maiúsculas/minúsculas.
     *
     * @param dataRegisterVehicle O registro de dados do veículo que está sendo validado.
     * @throws RuntimeException se já existir um veículo com a mesma versão.
     */
    @Override
    public void validate(DataRegisterVehicle dataRegisterVehicle) {
        boolean exists = vehicleRepository.existsByVersionIgnoreCase(
                dataRegisterVehicle.version().trim()
        );

        if (exists) {
            throw new RuntimeException("A version vehicle with the name '" + dataRegisterVehicle.version() + "' already exists.");
        }
    }
}
