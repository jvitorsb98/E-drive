package br.com.cepedi.e_drive.model.records.address.register;

import jakarta.validation.constraints.NotNull;

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

        @NotNull(message = "User ID cannot be null.")
        Long userId,

        Boolean plugin


) {
}
