package br.com.cepedi.e_drive.service.vehicle.validations.register;

import br.com.cepedi.e_drive.model.records.vehicle.register.DataRegisterVehicle;

/**
 * Interface para validação dos dados de registro de um veículo.
 *
 * Implementações desta interface devem fornecer a lógica para validar as informações
 * fornecidas durante o processo de registro de um veículo.
 */
public interface ValidationRegisterVehicle {

    /**
     * Valida os dados fornecidos para o registro de um veículo.
     *
     * @param data Dados do veículo a serem validados.
     * @throws ValidationException Se os dados do veículo não atenderem aos critérios de validação.
     */
    void validate(DataRegisterVehicle data);
}
