package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationDisabledAddress} que valida se um endereço não está desativado antes de permitir outras operações.
 *
 * <p>Esta classe verifica se o endereço com o identificador fornecido existe e está ativo.
 * Se o endereço estiver desativado, uma {@link ValidationException} é lançada.</p>
 */
@Component
public class ValidationDisabledAddress_AddressNotDisabled implements ValidationDisabledAddress {

    private final AddressRepository addressRepository;

    /**
     * Construtor que injeta o repositório de endereços.
     *
     * @param addressRepository o repositório de endereços a ser injetado.
     */
    @Autowired
    public ValidationDisabledAddress_AddressNotDisabled(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    /**
     * Valida se o endereço com o identificador fornecido não está desativado.
     *
     * <p>Se o endereço estiver desativado, uma {@link ValidationException} será lançada.</p>
     *
     * @param id O identificador único do endereço a ser validado.
     * @throws ValidationException se o endereço estiver desativado.
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
