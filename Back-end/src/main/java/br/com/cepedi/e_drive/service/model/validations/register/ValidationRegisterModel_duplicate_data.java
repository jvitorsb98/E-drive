package br.com.cepedi.e_drive.service.model.validations.register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;
import br.com.cepedi.e_drive.service.model.validations.register.ValidationRegisterModel;
import br.com.cepedi.e_drive.repository.ModelRepository;

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

    /**
     * Realiza a validação dos dados de registro do modelo, verificando se já existe um modelo
     * com o mesmo nome associado à marca especificada.
     *
     * @param dataRegisterModel Os dados de entrada para o registro do modelo.
     * @throws RuntimeException Se um modelo com o mesmo nome e marca já estiver registrado no sistema.
     */
    @Override
    public void validation(DataRegisterModel dataRegisterModel) {
        String nameLowerCase = dataRegisterModel.name().toLowerCase();

        boolean exists = modelRepository.existsByNameAndBrandId(nameLowerCase, dataRegisterModel.idBrand());

        if (exists) {
            throw new RuntimeException("A model with the name '" + dataRegisterModel.name() + "' already exists for the given brand.");
        }
    }

}
