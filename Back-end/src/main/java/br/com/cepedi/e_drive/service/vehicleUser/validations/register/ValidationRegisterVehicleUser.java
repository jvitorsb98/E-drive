package br.com.cepedi.e_drive.service.vehicleUser.validations.register;

import br.com.cepedi.e_drive.model.records.vehicleUser.register.DataRegisterVehicleUser;

/**
 * Interface para validação de dados de registro de usuário de veículo.
 */
public interface ValidationRegisterVehicleUser {

    /**
     * Valida os dados fornecidos para o registro de um usuário de veículo.
     *
     * @param data Dados a serem validados para o registro do usuário de veículo.
     */
    void validate(DataRegisterVehicleUser data);

}
