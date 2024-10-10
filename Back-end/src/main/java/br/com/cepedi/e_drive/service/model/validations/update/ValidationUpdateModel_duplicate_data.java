package br.com.cepedi.e_drive.service.model.validations.update;

import br.com.cepedi.e_drive.repository.BrandRepository;
import br.com.cepedi.e_drive.repository.ModelRepository;
import br.com.cepedi.e_drive.model.records.model.input.DataUpdateModel;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Classe de validação responsável por verificar duplicatas ao atualizar um modelo existente.
 * <p>
 * Esta validação assegura que não existam dois modelos com o mesmo nome para a mesma marca.
 * </p>
 */
@Component
public class ValidationUpdateModel_duplicate_data implements ValidationModelUpdate {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Realiza a validação dos dados de atualização do modelo, verificando se já existe um modelo
     * com o mesmo nome associado à marca especificada.
     *
     * @param dataUpdateModel Os dados de entrada para a atualização do modelo.
     * @param id O ID do modelo que está sendo atualizado.
     * @throws ValidationException Se um modelo com o mesmo nome e marca já estiver registrado no sistema.
     */
    @Override
    public void validation(DataUpdateModel dataUpdateModel, Long id) {
        String nameLowerCase = dataUpdateModel.name().trim().toLowerCase(); // Remove espaços e converte para minúsculas

        // Verifica se já existe um modelo com o mesmo nome e ID da marca, ignorando o modelo atual
        boolean exists = modelRepository.existsByNameIgnoreCaseAndBrandId(
                nameLowerCase,
                dataUpdateModel.idBrand()
        );

        if (exists) {
            String brandName = getBrandNameById(dataUpdateModel.idBrand());

            String errorMessage = messageSource.getMessage(
                    "model.update.duplicate",
                    new Object[]{dataUpdateModel.name(), brandName},
                    Locale.getDefault()
            );
            throw new ValidationException(errorMessage);
        }
    }

    // Método auxiliar para buscar o nome da marca pelo ID
    private String getBrandNameById(Long brandId) {
        return brandRepository.findBrandNameById(brandId); // Exemplo de método, você deve criar ou ajustar conforme sua necessidade.
    }
}
