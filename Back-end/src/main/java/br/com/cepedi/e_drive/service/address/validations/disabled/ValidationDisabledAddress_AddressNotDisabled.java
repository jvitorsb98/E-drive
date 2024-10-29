package br.com.cepedi.e_drive.service.address.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Address;
import br.com.cepedi.e_drive.repository.AddressRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Implementação da interface {@link ValidationDisabledAddress} que valida se um endereço não está desativado antes de permitir outras operações.
 *
 * <p>Esta classe verifica se o endereço com o identificador fornecido existe e está ativo.
 * Se o endereço estiver desativado, uma {@link ValidationException} é lançada.</p>
 */
@Component
public class ValidationDisabledAddress_AddressNotDisabled implements ValidationDisabledAddress {

    private final AddressRepository addressRepository;
    private final MessageSource messageSource;

    /**
     * Construtor que injeta o repositório de endereços e o MessageSource.
     *
     * @param addressRepository o repositório de endereços a ser injetado.
     * @param messageSource o MessageSource para suporte a internacionalização.
     */
    @Autowired
    public ValidationDisabledAddress_AddressNotDisabled(AddressRepository addressRepository, MessageSource messageSource) {
        this.addressRepository = addressRepository;
        this.messageSource = messageSource;
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
                String errorMessage = messageSource.getMessage(
                        "address.disabled.isDisabled", // Chave da mensagem para endereço desativado
                        new Object[]{id}, // Parâmetro da mensagem (ID)
                        Locale.getDefault() // Locale padrão
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
