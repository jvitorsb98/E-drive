package br.com.cepedi.e_drive.service.category.validations.register;

import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.model.records.category.input.DataRegisterCategory;


@Component
public class ValidationCategoryNameNotNull implements CategoryValidatorRegister {
	
	@Override
    public void validate(DataRegisterCategory data) {
        if (data.name() == null) {
            throw new IllegalArgumentException("Name cannot be null");
        }
    }
}
