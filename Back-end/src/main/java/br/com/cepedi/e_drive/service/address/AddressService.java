package br.com.cepedi.e_drive.service.address;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.model.records.address.details.DataAddressDetails;
import br.com.cepedi.e_drive.model.records.address.register.DataRegisterAddress;
import br.com.cepedi.e_drive.model.records.address.update.DataUpdateAddress;
import br.com.cepedi.e_drive.repository.AddressRepository;
import br.com.cepedi.e_drive.security.model.entitys.User;
import br.com.cepedi.e_drive.security.repository.UserRepository;
import br.com.cepedi.e_drive.service.address.validations.disabled.ValidationDisabledAddress;
import br.com.cepedi.e_drive.service.address.validations.update.ValidationUpdateAddress;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável por gerenciar endereços, incluindo registro, atualização, desativação e ativação.
 */
@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private List<ValidationUpdateAddress> validationUpdateAddressList;

    @Autowired
    private List<ValidationDisabledAddress> validationDisabledAddressList;

    /**
     * Registra um novo endereço para o usuário com o e-mail fornecido.
     *
     * @param data  Os dados do endereço a ser registrado.
     * @param email O e-mail do usuário ao qual o endereço pertence.
     * @return Detalhes do endereço registrado.
     */
    public DataAddressDetails register(DataRegisterAddress data, String email) {
        User user = userRepository.findByEmail(email);
        Address address = new Address(data, user);
        address = addressRepository.save(address);
        return new DataAddressDetails(address);
    }

    /**
     * Retorna uma página de detalhes de todos os endereços.
     *
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos endereços.
     */
    public Page<DataAddressDetails> getAll(Pageable pageable) {
        return addressRepository.findAll(pageable).map(DataAddressDetails::new);
    }

    /**
     * Retorna uma página de detalhes dos endereços ativados de um usuário específico.
     *
     * @param email    O e-mail do usuário.
     * @param pageable Informações de paginação.
     * @return Página de detalhes dos endereços do usuário.
     */
    public Page<DataAddressDetails> getByUserId(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email);
        return addressRepository.findByUserIdAndActivated(user.getId(), pageable)
                .map(DataAddressDetails::new);
    }

    /**
     * Retorna os detalhes de um endereço pelo seu ID.
     *
     * @param id O ID do endereço.
     * @return Detalhes do endereço.
     * @throws EntityNotFoundException Se o endereço não for encontrado.
     */
    public DataAddressDetails getById(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        return new DataAddressDetails(address);
    }

    /**
     * Atualiza os dados de um endereço existente.
     *
     * @param data Os novos dados do endereço.
     * @param id   O ID do endereço a ser atualizado.
     * @return Detalhes do endereço atualizado.
     */
    public DataAddressDetails update(DataUpdateAddress data, Long id) {
        validationUpdateAddressList.forEach(v -> v.validate(id));
        Address address = addressRepository.getReferenceById(id);
        address.updateData(data);
        addressRepository.save(address);
        return new DataAddressDetails(address);
    }

    /**
     * Desativa um endereço existente.
     *
     * @param id O ID do endereço a ser desativado.
     */
    public void disable(Long id) {
        validationDisabledAddressList.forEach(v -> v.validate(id));
        Address address = addressRepository.getReferenceById(id);
        address.disable();
        addressRepository.save(address);
    }

    /**
     * Ativa um endereço previamente desativado.
     *
     * @param id O ID do endereço a ser ativado.
     */
    public void enable(Long id) {
        Address address = addressRepository.getReferenceById(id);
        address.enable();
        addressRepository.save(address);
    }
}
