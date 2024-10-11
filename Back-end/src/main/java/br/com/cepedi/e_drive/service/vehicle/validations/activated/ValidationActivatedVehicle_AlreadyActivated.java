package br.com.cepedi.e_drive.service.vehicle.validations.activated;

import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validates if a vehicle is already activated before performing activation operations.
 *
 * This implementation ensures that the vehicle with the provided ID is not already activated.
 * If it is already activated, a validation exception is thrown.
 */
@Component
public class ValidationActivatedVehicle_AlreadyActivated {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MessageSource messageSource; // For internationalization

    /**
     * Validates if the vehicle with the provided ID is already activated.
     *
     * @param id ID of the vehicle to be validated.
     * @throws ValidationException If the vehicle is already activated.
     */
    public void validate(Long id) {
        if (vehicleRepository.existsById(id)) {
            if (vehicleRepository.getReferenceById(id).isActivated()) {
                String message = messageSource.getMessage(
                        "vehicle.activate.already.activated", new Object[]{id}, Locale.getDefault()
                );
                throw new ValidationException(message);
            }
        }
    }
}
