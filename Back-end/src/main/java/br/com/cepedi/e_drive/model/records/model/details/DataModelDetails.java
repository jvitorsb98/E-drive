package br.com.cepedi.e_drive.model.records.model.details;

import br.com.cepedi.e_drive.model.entitys.Model;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataModelDetails(

        Long id,

        String name,

        Boolean activated



) {
    public DataModelDetails(Model model) {
        this(model.getId(), model.getName(), model.getActivated());
    }
}
