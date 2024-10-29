package br.com.cepedi.e_drive.service.address.validations.update;

import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationUpdateAddress} que valida se o endereço existe antes de ser atualizado.
 *
 * <p>Esta classe é usada para garantir que um endereço com o ID fornecido realmente exista no sistema antes de permitir qualquer operação de atualização.</p>
 */
@Component
public class ValidationUpdateAddress_AddressExists implements ValidationUpdateAddress {

    private final AddressRepository addressRepository;
    private final MessageSource messageSource;

    /**
     * Construtor que injeta o repositório de endereços e o MessageSource.
     *
     * @param addressRepository o repositório de endereços a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationUpdateAddress_AddressExists(AddressRepository addressRepository, MessageSource messageSource) {
        this.addressRepository = addressRepository;
        this.messageSource = messageSource;
    }

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
            String errorMessage = messageSource.getMessage(
                    "address.notExists", // Chave da mensagem para endereço não existente
                    new Object[]{id}, // Parâmetro da mensagem (ID)
                    Locale.getDefault() // Locale padrão
            );
            throw new ValidationException(errorMessage);
        }
    }
}
