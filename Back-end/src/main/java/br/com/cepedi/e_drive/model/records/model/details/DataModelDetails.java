package br.com.cepedi.e_drive.model.records.model.details;

import br.com.cepedi.e_drive.model.entitys.Model;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataModelDetails(

        Long id,

        DataBrandDetails brand,

        String name,

        Boolean activated



) {
    public DataModelDetails(Model model) {
        this(model.getId(), new DataBrandDetails(model.getBrand()) ,model.getName(), model.getActivated());
    }
}
