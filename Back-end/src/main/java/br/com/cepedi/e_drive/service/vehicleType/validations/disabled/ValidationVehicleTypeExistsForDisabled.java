package br.com.cepedi.e_drive.service.vehicleType.validations.disabled;


import br.com.cepedi.e_drive.repository.VehicleTypeRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationVehicleTypeExistsForDisabled implements VehicleTypeValidatorDisabled {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public void validation(Long id) {
        if(!vehicleTypeRepository.existsById(id)){
            throw new ValidationException("The required vehicle type does not exist");
        }
    }
}
