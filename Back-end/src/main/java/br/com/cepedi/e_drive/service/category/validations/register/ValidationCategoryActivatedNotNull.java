package br.com.cepedi.e_drive.service.category.validations.register;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import br.com.cepedi.e_drive.model.records.category.input.DataRegisterCategory;

@Primary
@Component
public class ValidationCategoryActivatedNotNull implements CategoryValidatorRegister{


	@Override
	public void validate(DataRegisterCategory data) {
		if (data.activated() == null) {
			throw new IllegalArgumentException("Activated status cannot be null");
		}
	}
}

