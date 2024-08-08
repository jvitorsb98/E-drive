package br.com.cepedi.e_drive.model.records.address.update;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataUpdateAddress(


        String country,


        String zipCode,


        String state,


        String city,


        String neighborhood,

        Integer number,


        String street,

        Boolean plugin
) {
}
