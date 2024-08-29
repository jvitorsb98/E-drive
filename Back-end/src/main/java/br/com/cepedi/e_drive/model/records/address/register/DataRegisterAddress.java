package br.com.cepedi.e_drive.model.records.address.register;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

/**
 * Record que encapsula os dados necessários para registrar um novo endereço.
 * Este record é utilizado como objeto de transferência de dados (DTO) nas operações de criação de endereços.
 *
 * @param country          País do endereço. Não pode ser nulo.
 * @param zipCode          Código postal do endereço. Não pode ser nulo.
 * @param state            Estado do endereço. Não pode ser nulo.
 * @param city             Cidade do endereço. Não pode ser nulo.
 * @param neighborhood     Bairro do endereço. Não pode ser nulo.
 * @param number           Número do endereço. Não pode ser nulo.
 * @param street           Rua do endereço. Não pode ser nulo.
 * @param complement       Complemento do endereço. Pode ser nulo.
 * @param plugin           Indica se o endereço possui uma estação de carregamento.
 */
public record DataRegisterAddress(

        @NotNull(message = "Country cannot be null.")
        String country,

        @NotNull(message = "Zip code cannot be null.")
        String zipCode,

        @NotNull(message = "State cannot be null.")
        String state,

        @NotNull(message = "City cannot be null.")
        String city,

        @NotNull(message = "Neighborhood cannot be null.")
        String neighborhood,

        @NotNull(message = "Number cannot be null.")
        Integer number,

        @NotNull(message = "Street cannot be null.")
        String street,

        String complement,

        @JsonProperty("hasChargingStation")
        Boolean plugin

) {
}
