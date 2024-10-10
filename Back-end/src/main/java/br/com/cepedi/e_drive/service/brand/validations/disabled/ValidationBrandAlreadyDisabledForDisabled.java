package br.com.cepedi.e_drive.service.brand.validations.disabled;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável pela validação se uma marca já está desativada antes de realizar a operação de desativação.
 * Implementa a interface {@link BrandValidatorDisabled}.
 */
@Component
public class ValidationBrandAlreadyDisabledForDisabled implements BrandValidatorDisabled {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource;

    /**
     * Valida se a marca com o ID fornecido já está desativada.
     * Se a marca já estiver desativada, lança uma {@link ValidationException}.
     *
     * @param id O ID da marca a ser validada.
     * @throws ValidationException se a marca já estiver desativada.
     */
    @Override
    public void validation(Long id) {
        if (brandRepository.existsById(id)) {
            Brand brand = brandRepository.getReferenceById(id);
            if (!brand.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "brand.disabled.already.disabled",
                        new Object[]{brand.getName()},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
