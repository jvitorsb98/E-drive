package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validates if a vehicle is not already disabled before performing deactivation operations.
 *
 * This implementation of {@link ValidationDisabledVehicle} ensures that the vehicle
 * with the provided ID is not already disabled. If it is, a validation exception is thrown.
 */
@Component
public class ValidationDisabledVehicle_NotDisabled implements ValidationDisabledVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MessageSource messageSource; // For internationalization

    /**
     * Validates if the vehicle with the provided ID is not already disabled.
     *
     * @param id ID of the vehicle to be validated.
     * @throws ValidationException If the vehicle is already disabled.
     */
    @Override
    public void validate(Long id) {
        if (vehicleRepository.existsById(id)) {
            Vehicle vehicle = vehicleRepository.getReferenceById(id);
            if (!vehicle.isActivated()) {
                String message = messageSource.getMessage(
                        "vehicle.disable.already", new Object[]{id}, Locale.getDefault()
                );
                throw new ValidationException(message);
            }
        }
    }
}
