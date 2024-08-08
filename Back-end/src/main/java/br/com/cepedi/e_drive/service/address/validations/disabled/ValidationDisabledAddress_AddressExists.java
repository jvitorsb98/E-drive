package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationDisabledAddress_AddressExists implements  ValidationDisabledAddress {

    @Autowired
    private AddressRepository addressRepository;


    @Override
    public void validate(Long id) {
        if(!addressRepository.existsById(id)){
            throw new ValidationException("The provided address id does not exist");
        }
    }

}
