package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Valida se a marca associada ao modelo existe durante a atualização do modelo.
 */
@Component
public class ValidationModelUpdate_BrandExists implements ValidationModelUpdate {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Valida se a marca associada ao modelo existe no repositório.
     *
     * @param data Os dados do modelo que estão sendo atualizados, incluindo o ID da marca.
     * @param id   O ID do modelo que está sendo atualizado.
     * @throws ValidationException Se a marca associada não existir no repositório.
     */
    @Override
    public void validation(DataUpdateModel data, Long id) {
        if (data.idBrand() != null && !brandRepository.existsById(data.idBrand())) {
            String errorMessage = messageSource.getMessage(
                    "model.update.brand.not.found",
                    new Object[]{data.idBrand()}, // Passa o ID da marca para a mensagem, se necessário
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }
}
