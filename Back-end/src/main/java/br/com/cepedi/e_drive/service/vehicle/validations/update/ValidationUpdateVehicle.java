package br.com.cepedi.e_drive.service.vehicle.validations.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateVehicle;

/**
 * Interface para validação dos dados de atualização de um veículo.
 */
public interface ValidationUpdateVehicle {

    /**
     * Valida os dados de atualização do veículo.
     *
     * @param data Dados de atualização do veículo a serem validados.
     */
    void validate(DataUpdateVehicle data, Long id);
}
