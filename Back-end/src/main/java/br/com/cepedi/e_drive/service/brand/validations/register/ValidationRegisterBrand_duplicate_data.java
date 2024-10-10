package br.com.cepedi.e_drive.service.brand.validations.register;

import br.com.cepedi.e_drive.model.records.brand.input.DataRegisterBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável por validar se já existe uma marca com o mesmo nome durante o processo de registro.
 * <p>
 * Esta classe implementa a validação que verifica a duplicidade de nomes de marcas, ignorando diferenças de maiúsculas e minúsculas.
 */
@Component
public class ValidationRegisterBrand_duplicate_data implements ValidationBrandRegister {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se já existe uma marca com o mesmo nome no sistema.
     * <p>
     * Se o nome fornecido para a marca já existir (ignorando maiúsculas e minúsculas), uma exceção será lançada.
     *
     * @param dataRegisterBrand Os dados da marca que estão sendo registrados.
     * @throws ValidationException Se o nome da marca já estiver cadastrado no sistema.
     */
    @Override
    public void validation(DataRegisterBrand dataRegisterBrand) {
        String trimmedName = dataRegisterBrand.name().trim();

        boolean exists = brandRepository.existsByNameIgnoreCase(trimmedName);

        if (exists) {
            String errorMessage = messageSource.getMessage(
                    "brand.register.duplicate",
                    new Object[]{trimmedName},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
