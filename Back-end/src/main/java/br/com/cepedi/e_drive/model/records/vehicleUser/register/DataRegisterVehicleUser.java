package br.com.cepedi.e_drive.model.records.vehicleUser.register;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.validation.constraints.NotNull;

/**
 * Record que encapsula os dados necessários para registrar a associação entre um veículo e um usuário.
 * Utilizado para criar um relacionamento entre um usuário e um veículo, incluindo dados de autonomia.
 *
 * @param vehicleId Identificador do veículo que será associado ao usuário.
 * @param dataRegisterAutonomy Dados de autonomia a serem associados ao veículo.
 */
public record DataRegisterVehicleUser(

        /**
         * Identificador do veículo que será associado ao usuário.
         *
         * @return Identificador do veículo.
         */
        @NotNull(message = "Vehicle ID cannot be null.")
        Long vehicleId,

        /**
         * Dados de autonomia a serem associados ao veículo.
         *
         * @return Dados de autonomia.
         */
        @NotNull
        DataRegisterAutonomy dataRegisterAutonomy

) {
}
