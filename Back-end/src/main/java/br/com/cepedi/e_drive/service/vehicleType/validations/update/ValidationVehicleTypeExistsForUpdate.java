package br.com.cepedi.e_drive.service.vehicleType.validations.update;

import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationVehicleTypeExistsForUpdate implements ValidationVehicleTypeUpdate {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validation(DataUpdateVehicleType data) {
        if (!vehicleTypeRepository.existsById(data.id())) {
            throw new ValidationException("The required vehicle type does not exist");
        }
    }
}
