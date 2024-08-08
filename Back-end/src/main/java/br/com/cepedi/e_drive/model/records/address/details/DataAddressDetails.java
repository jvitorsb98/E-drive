package br.com.cepedi.e_drive.model.records.address.details;

import br.com.cepedi.e_drive.model.entitys.Address;

public record DataAddressDetails(
        Long id,
        String country,
        String zipCode,
        String state,
        String city,
        String neighborhood,
        Integer number,
        String street,
        Long userId,
        Boolean plugin,
        Boolean activated
) {
    public DataAddressDetails(Address address) {
        this(
                address.getId(),
                address.getCountry(),
                address.getZipCode(),
                address.getState(),
                address.getCity(),
                address.getNeighborhood(),
                address.getNumber(),
                address.getStreet(),
                address.getUser().getId(),
                address.getPlugin(),
                address.getActivated()
        );
    }
}
