package br.com.cepedi.e_drive.service.vehicle.validations.activated;

import br.com.cepedi.e_drive.repository.VehicleRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Validates the existence of a vehicle before performing activation operations.
 *
 * This implementation of {@link ValidationActivatedVehicle} ensures that the vehicle
 * with the provided ID exists and is currently activated. If it is not activated, a validation
 * exception is thrown.
 */
@Component
public class ValidationActivatedVehicle_Exists implements ValidationActivatedVehicle {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private MessageSource messageSource; // For internationalization

    /**
     * Validates if the vehicle with the provided ID is activated.
     *
     * @param id ID of the vehicle to be validated.
     * @throws ValidationException If the vehicle does not exist or is not activated.
     */
    @Override
    public void validate(Long id) {
        if (!vehicleRepository.existsById(id)) {
            String message = messageSource.getMessage(
                    "vehicle.activate.not.exist", new Object[]{id}, Locale.getDefault()
            );
            throw new ValidationException(message);
        }


    }
}
