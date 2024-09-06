package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.ModelRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateModel_ModelNotDisabled implements ValidationModelUpdate {

    @Autowired
    private ModelRepository modelRepository;

    @Override
    public void validation(DataUpdateModel data, Long id) {
        if (modelRepository.existsById(id)) {
            Model model = modelRepository.getReferenceById(id);
            if (!model.getActivated()) {
                throw new ValidationException("The required model is not activated");
            }
        } else {
            throw new ValidationException("Model not found");
        }
    }
}