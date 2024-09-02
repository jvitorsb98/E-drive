package br.com.cepedi.e_drive.model.records.vehicleUser.update;

import br.com.cepedi.e_drive.model.records.vehicle.update.DataUpdateAutonomy;

/**
 * Record que encapsula os dados necessários para atualizar a associação entre um veículo e um usuário.
 * Utilizado para atualizar os dados de autonomia associados a um veículo de um usuário.
 *
 * @param dataUpdateAutonomy Dados de autonomia a serem atualizados para o veículo associado ao usuário.
 */
public record DataUpdateVehicleUser(

        /**
         * Dados de autonomia a serem atualizados para o veículo associado ao usuário.
         *
         * @return Dados de autonomia.
         */
        DataUpdateAutonomy dataUpdateAutonomy

) {
}
