package br.com.cepedi.e_drive.service.brand.validations.update;

import br.com.cepedi.e_drive.repository.BrandRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Classe responsável pela validação da existência de uma marca antes de realizar a operação de atualização.
 * Implementa a interface {@link ValidationBrandUpdate}.
 */
@Component
public class ValidationBrandExistsForUpdate implements ValidationBrandUpdate {

    @Autowired
    private BrandRepository brandRepository;

    /**
     * Valida se a marca com o ID fornecido existe no repositório.
     * Se a marca não existir, lança uma {@link ValidationException}.
     *
     * @param id O ID da marca a ser validada.
     * @throws ValidationException se a marca não existir.
     */
    @Override
    public void validation(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new ValidationException("The required brand does not exist");
        }
    }
}
