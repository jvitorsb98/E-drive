package br.com.cepedi.e_drive.model.records.brand.details;

import br.com.cepedi.e_drive.model.entitys.Brand;

public record DataBrandDetails(
    Long id,
    String name,
    Boolean activated
) {
    public DataBrandDetails(Brand brand) {
        this(
            brand.getId(),
            brand.getName(),
            brand.getActivated()
        );
    }
}
