package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationBrandIsActivatedForUpdate implements ValidationBrandUpdate {
    @Autowired
    private BrandRepository brandRepository;


    @Override
    public void validation(Long id) {
        if(brandRepository.existsById(id)){
            Brand brand = brandRepository.getReferenceById(id);
            if(!brand.getActivated()){
                throw new ValidationException("The required brand is disabled");
            }
        }
    }
}
