package br.com.cepedi.e_drive.model.records.vehicleType.input;

import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para atualizar um tipo de veículo.
 * Utilizado para representar as informações que podem ser alteradas ao atualizar um tipo de veículo existente.
 *
 * @param name Nome do tipo de veículo.
 */
public record DataUpdateVehicleType(

        /**
         * Nome do tipo de veículo.
         *
         * <p>Este campo pode ser nulo. Quando fornecido, deve ter no máximo 100 caracteres.</p>
         *
         * @return Nome do tipo de veículo.
         */
        @Size(max = 100, message = "{size.vehicleType.name}")
        String name

) {
}
