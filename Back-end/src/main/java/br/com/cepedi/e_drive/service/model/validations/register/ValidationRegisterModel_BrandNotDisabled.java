package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementação da validação que garante que a marca associada ao modelo
 * não esteja desativada durante o registro do modelo.
 */
@Component
public class ValidationRegisterModel_BrandNotDisabled implements ValidationRegisterModel {

    @Autowired
    private BrandRepository brandRepository;

    /**
     * Valida se a marca associada ao modelo está ativada.
     *
     * @param dataRegisterModel Os dados do modelo que estão sendo registrados, incluindo o ID da marca.
     * @throws ValidationException Se a marca associada estiver desativada.
     */
    @Override
    public void validation(DataRegisterModel dataRegisterModel) {
        if (brandRepository.existsById(dataRegisterModel.idBrand())) {
            Brand brand = brandRepository.getReferenceById(dataRegisterModel.idBrand());
            if (!brand.getActivated()) {
                throw new ValidationException("The required brand is disabled.");
            }
        }
    }
}
