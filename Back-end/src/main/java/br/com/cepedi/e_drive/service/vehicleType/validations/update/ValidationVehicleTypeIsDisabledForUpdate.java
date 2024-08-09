package br.com.cepedi.e_drive.service.vehicleType.validations.update;


import br.com.cepedi.e_drive.model.entitys.VehicleType;
import br.com.cepedi.e_drive.model.records.vehicleType.input.DataUpdateVehicleType;
import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import br.com.cepedi.e_drive.service.vehicleType.validations.update.ValidationVehicleTypeUpdate;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationVehicleTypeIsDisabledForUpdate implements ValidationVehicleTypeUpdate {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validation(DataUpdateVehicleType data) {
        if (vehicleTypeRepository.existsById(data.id())) {
            VehicleType vehicleType = vehicleTypeRepository.getReferenceById(data.id());
            if (!vehicleType.isActivated()) {
                throw new ValidationException("The required vehicle type is disabled");
            }
        }
    }
}
