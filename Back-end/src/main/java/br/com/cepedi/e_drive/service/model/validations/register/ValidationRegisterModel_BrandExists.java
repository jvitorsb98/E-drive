package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Valida se a marca associada ao modelo existe durante o registro do modelo.
 */
@Component
public class ValidationRegisterModel_BrandExists implements ValidationRegisterModel {

    @Autowired
    private BrandRepository brandRepository;

    /**
     * Valida se a marca associada ao modelo existe no repositório.
     *
     * @param dataRegisterModel Os dados do modelo que está sendo registrado, incluindo o ID da marca.
     * @throws ValidationException Se a marca associada não existir no repositório.
     */
    @Override
    public void validation(DataRegisterModel dataRegisterModel) {
        if (!brandRepository.existsById(dataRegisterModel.idBrand())) {
            throw new ValidationException("The required brand does not exist.");
        }
    }
}
