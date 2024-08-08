package br.com.cepedi.e_drive.service.address.validations.update;


import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.repository.AddressRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ValidationUpdateAddress_AddressNotDisabled implements ValidationUpdateAddress{

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public void validate(Long id) {
        if (addressRepository.existsById(id)) {
            Address address = addressRepository.getReferenceById(id);
            if(!address.getActivated()){
                throw new ValidationException("The provided address id is disabled");
            }
        }
    }
}
