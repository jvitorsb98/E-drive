package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.repository.ModelRepository;

import jakarta.validation.ValidationException;
import java.util.Locale;

/**
 * Classe de validação responsável por verificar duplicatas ao registrar um novo modelo.
 * <p>
 * Esta validação assegura que não existam dois modelos com o mesmo nome para a mesma marca.
 * </p>
 */
@Component
public class ValidationRegisterModel_duplicate_data implements ValidationRegisterModel {

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private MessageSource messageSource; // Injeção do MessageSource para internacionalização

    /**
     * Realiza a validação dos dados de registro do modelo, verificando se já existe um modelo
     * com o mesmo nome associado à marca especificada.
     *
     * @param dataRegisterModel Os dados de entrada para o registro do modelo.
     * @throws ValidationException Se um modelo com o mesmo nome e marca já estiver registrado no sistema.
     */
    @Override
    public void validation(DataRegisterModel dataRegisterModel) {
        String nameLowerCase = dataRegisterModel.name().trim().toLowerCase(); // Remove espaços e converte para minúsculas

        // Verifica se já existe um modelo com o mesmo nome e ID da marca
        boolean exists = modelRepository.existsByNameIgnoreCaseAndBrandId(nameLowerCase, dataRegisterModel.idBrand());

        if (exists) {
            // Aqui, vamos buscar o nome da marca para incluir na mensagem de erro
            String brandName = getBrandNameById(dataRegisterModel.idBrand());

            String errorMessage = messageSource.getMessage(
                    "model.register.duplicate",
                    new Object[]{dataRegisterModel.name(), brandName}, // Adiciona o nome da marca
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
