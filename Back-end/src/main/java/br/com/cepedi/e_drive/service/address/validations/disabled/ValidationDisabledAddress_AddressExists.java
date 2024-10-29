package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationDisabledAddress} que valida se um endereço existe antes de permitir a sua desativação.
 *
 * <p>Esta classe verifica se o endereço com o identificador fornecido existe no repositório.
 * Se o endereço não existir, uma {@link ValidationException} é lançada.</p>
 */
@Component
public class ValidationDisabledAddress_AddressExists implements ValidationDisabledAddress {

    private final AddressRepository addressRepository;
    private final MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Construtor que injeta o repositório de endereços e o MessageSource.
     *
     * @param addressRepository o repositório de endereços a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationDisabledAddress_AddressExists(AddressRepository addressRepository, MessageSource messageSource) {
        this.addressRepository = addressRepository;
        this.messageSource = messageSource;
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
            String errorMessage = messageSource.getMessage(
                    "address.disabled.notExist", // Chave da mensagem para endereço inexistente
                    new Object[]{id}, // Parâmetro da mensagem (ID)
                    Locale.getDefault() // Locale padrão
            );
            throw new ValidationException(errorMessage);
        }
    }
}
