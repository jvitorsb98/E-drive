package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.brand.input.DataUpdateBrand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe responsável pela validação do status de ativação de uma marca antes de realizar a operação de atualização.
 * Implementa a interface {@link ValidationBrandUpdate}.
 */
@Component
public class ValidationBrandIsActivatedForUpdate implements ValidationBrandUpdate {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource;

    /**
     * Valida se a marca com o ID fornecido está ativada.
     * Se a marca estiver desativada, lança uma {@link ValidationException}.
     *
     * @param id O ID da marca a ser validada.
     * @throws ValidationException se a marca estiver desativada.
     */
    @Override
    public void validation(Long id , DataUpdateBrand dataUpdateBrand) {
        if (brandRepository.existsById(id)) {
            Brand brand = brandRepository.getReferenceById(id);
            if (!brand.getActivated()) {
                String errorMessage = messageSource.getMessage(
                        "brand.update.not.activated",
                        new Object[]{brand.getName()},
                        Locale.getDefault()
                );
                throw new ValidationException(errorMessage);
            }
        }
    }
}
