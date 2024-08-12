package br.com.cepedi.e_drive.service.address;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.repository.AddressRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.address.validations.disabled.ValidationDisabledAddress;
import br.com.cepedi.e_drive.service.address.validations.register.ValidationRegisterAddress;
import br.com.cepedi.e_drive.service.address.validations.update.ValidationUpdateAddress;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private List<ValidationRegisterAddress> validationRegisterAddressList;

    @Autowired
    private List<ValidationUpdateAddress> validationUpdateAddressList;

    @Autowired
    private List<ValidationDisabledAddress> validationDisabledAddressList;

    public DataAddressDetails register(DataRegisterAddress data) {
        validationRegisterAddressList.forEach(v -> v.validate(data));
        User user = userRepository.getReferenceById(data.userId());
        Address address = new Address(data,user);
        address = addressRepository.save(address);
        return new DataAddressDetails(address);
    }

    public Page<DataAddressDetails> getAll(Pageable pageable) {
        return addressRepository.findAll(pageable).map(DataAddressDetails::new);
    }

    public Page<DataAddressDetails> getByUserId(Long userId, Pageable pageable) {
        return addressRepository.findByUserIdAndActivated(userId ,pageable)
                .map(DataAddressDetails::new);
    }

    public DataAddressDetails getById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        return new DataAddressDetails(address);
    }

    public DataAddressDetails update(DataUpdateAddress data, Long id) {
        validationUpdateAddressList.forEach(v -> v.validate(id));
        Address address = addressRepository.getReferenceById(id);
        address.updateData(data);
        addressRepository.save(address);
        return new DataAddressDetails(address);
    }

    public void disable(Long id) {
        validationDisabledAddressList.forEach(v -> v.validate(id));
        Address address = addressRepository.getReferenceById(id);
        address.disable();
        addressRepository.save(address);
    }

    public void enable(Long id) {
        Address address = addressRepository.getReferenceById(id);
        address.enable();
        addressRepository.save(address);
    }
}
