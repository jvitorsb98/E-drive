package br.com.cepedi.e_drive.service.address.validations.update;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationUpdateAddress} que valida se o endereço não está desativado antes de ser atualizado.
 *
 * <p>Esta classe verifica se o endereço com o ID fornecido está ativo antes de permitir operações de atualização.</p>
 */
@Component
public class ValidationUpdateAddress_AddressNotDisabled implements ValidationUpdateAddress {

    @Autowired
    private AddressRepository addressRepository;

    /**
     * Valida se o endereço com o ID fornecido não está desativado.
     *
     * <p>Se o endereço estiver desativado, uma {@link ValidationException} será lançada.</p>
     *
     * @param id O ID do endereço a ser validado.
     * @throws ValidationException Se o endereço com o ID fornecido estiver desativado.
     */
    @Override
    public void validate(Long id) {
        if (addressRepository.existsById(id)) {
            Address address = addressRepository.getReferenceById(id);
            if (!address.getActivated()) {
                throw new ValidationException("The provided address id is disabled");
            }
        }
    }
}
