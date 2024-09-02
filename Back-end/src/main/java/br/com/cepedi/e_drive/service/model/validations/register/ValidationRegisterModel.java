package br.com.cepedi.e_drive.service.model.validations.register;

import br.com.cepedi.e_drive.model.records.model.input.DataRegisterModel;

/**
 * Interface para validação dos dados durante o registro de um novo modelo.
 */
public interface ValidationRegisterModel {

    /**
     * Valida os dados fornecidos para o registro de um modelo.
     *
     * @param dataRegisterModel Dados do modelo a serem validados.
     */
    void validation(DataRegisterModel dataRegisterModel);

}
