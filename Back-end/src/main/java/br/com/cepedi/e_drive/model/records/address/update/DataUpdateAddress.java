package br.com.cepedi.e_drive.model.records.address.update;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Record que encapsula os dados necessários para atualizar um endereço existente.
 * Este record é utilizado como objeto de transferência de dados (DTO) nas operações de atualização de endereços.
 *
 * @param country        País do endereço. Pode ser nulo.
 * @param zipCode        Código postal do endereço. Pode ser nulo.
 * @param state          Estado do endereço. Pode ser nulo.
 * @param city           Cidade do endereço. Pode ser nulo.
 * @param neighborhood   Bairro do endereço. Pode ser nulo.
 * @param number         Número do endereço. Pode ser nulo.
 * @param street         Rua do endereço. Pode ser nulo.
 * @param plugin         Indica se o endereço possui uma estação de carregamento. Pode ser nulo.
 */
public record DataUpdateAddress(

        String country,

        String zipCode,

        String state,

        String city,

        String neighborhood,

        Integer number,

        String street,

        String complement,

        @JsonProperty("hasChargingStation")
        Boolean plugin

) {
}
