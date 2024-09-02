package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.model.entitys.Brand;
import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe responsável pela validação do status de ativação de uma marca antes de realizar a operação de atualização.
 * Implementa a interface {@link ValidationBrandUpdate}.
 */
@Component
public class ValidationBrandIsActivatedForUpdate implements ValidationBrandUpdate {

    @Autowired
    private BrandRepository brandRepository;

    /**
     * Valida se a marca com o ID fornecido está ativada.
     * Se a marca estiver desativada, lança uma {@link ValidationException}.
     *
     * @param id O ID da marca a ser validada.
     * @throws ValidationException se a marca estiver desativada.
     */
    @Override
    public void validation(Long id) {
        if (brandRepository.existsById(id)) {
            Brand brand = brandRepository.getReferenceById(id);
            if (!brand.getActivated()) {
                throw new ValidationException("The required brand is disabled");
            }
        }
    }
}
