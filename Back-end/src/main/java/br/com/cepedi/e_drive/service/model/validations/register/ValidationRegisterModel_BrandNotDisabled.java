package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ValidationRegisterModel_BrandNotDisabled implements ValidationRegisterModel{

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public void validation(DataRegisterModel dataRegisterModel) {
        if(brandRepository.existsById(dataRegisterModel.idBrand())){
            Brand brand = brandRepository.getReferenceById(dataRegisterModel.idBrand());
            if(!brand.getActivated()){
                throw new ValidationException("The required brand is disabled");
            }
        }
    }
}
