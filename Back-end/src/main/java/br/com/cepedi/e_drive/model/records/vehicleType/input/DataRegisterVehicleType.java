package br.com.cepedi.e_drive.model.records.vehicleType.input;

import jakarta.validation.constraints.NotBlank;

/**
 * Record que encapsula os dados necessários para registrar um novo tipo de veículo.
 * Utilizado para representar as informações que são necessárias para criar um novo tipo de veículo.
 *
 * @param name Nome do tipo de veículo.
 */
public record DataRegisterVehicleType(

        /**
         * Nome do tipo de veículo.
         *
         * <p>Este campo é obrigatório e não pode estar em branco.</p>
         *
         * @return Nome do tipo de veículo.
         */
        @NotBlank(message = "Name cannot be blank")
        String name

) {
}
