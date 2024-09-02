package br.com.cepedi.e_drive.service.address.validations.update;

import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da interface {@link ValidationUpdateAddress} que valida se o endereço existe antes de ser atualizado.
 *
 * <p>Esta classe é usada para garantir que um endereço com o ID fornecido realmente exista no sistema antes de permitir qualquer operação de atualização.</p>
 */
@Component
public class ValidationUpdateAddress_AddressExists implements ValidationUpdateAddress {

    @Autowired
    private AddressRepository addressRepository;

    /**
     * Valida se o endereço com o ID fornecido existe no sistema.
     *
     * <p>Se o endereço não existir, uma {@link ValidationException} será lançada.</p>
     *
     * @param id O ID do endereço a ser validado.
     * @throws ValidationException Se o endereço com o ID fornecido não existir.
     */
    @Override
    public void validate(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ValidationException("The provided address id does not exist");
        }
    }
}
