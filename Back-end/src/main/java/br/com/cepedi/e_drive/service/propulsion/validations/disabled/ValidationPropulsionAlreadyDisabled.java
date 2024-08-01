package br.com.cepedi.e_drive.service.propulsion.validations.disabled;



import br.com.cepedi.e_drive.repository.PropulsionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationPropulsionAlreadyDisabled implements PropulsionValidatorDisabled {

    @Autowired
    private PropulsionRepository propulsionRepository;

    @Override
    public void validate(Long id) {
        boolean isDeactivated = propulsionRepository.findById(id)
            .map(propulsion -> !propulsion.getActivated())
            .orElseThrow(() -> new IllegalArgumentException("Propulsion with ID " + id + " does not exist."));

        if (isDeactivated) {
            throw new IllegalStateException("Propulsion with ID " + id + " is already disabled.");
        }
    }
}
