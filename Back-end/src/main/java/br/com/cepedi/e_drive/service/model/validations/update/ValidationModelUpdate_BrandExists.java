package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationModelUpdate_BrandExists implements ValidationModelUpdate{

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public void validation(DataUpdateModel data, Long id) {
        if(data.idBrand()!= null){
            if(!brandRepository.existsById(data.idBrand())){
                throw new ValidationException("The required brand does not exist");
            }
        }
    }
}
