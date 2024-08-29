package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationDisabledAddress} que valida se um endereço existe antes de permitir a sua desativação.
 *
 * <p>Esta classe verifica se o endereço com o identificador fornecido existe no repositório.
 * Se o endereço não existir, uma {@link ValidationException} é lançada.</p>
 */
@Component
public class ValidationDisabledAddress_AddressExists implements ValidationDisabledAddress {

    private final AddressRepository addressRepository;

    /**
     * Construtor que injeta o repositório de endereços.
     *
     * @param addressRepository o repositório de endereços a ser injetado.
     */
    @Autowired
    public ValidationDisabledAddress_AddressExists(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    /**
     * Valida se o endereço com o identificador fornecido existe.
     *
     * <p>Se o endereço não existir, uma {@link ValidationException} será lançada.</p>
     *
     * @param id O identificador único do endereço a ser validado.
     * @throws ValidationException se o endereço não existir.
     */
    @Override
    public void validate(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ValidationException("The provided address id does not exist");
        }
    }

}
