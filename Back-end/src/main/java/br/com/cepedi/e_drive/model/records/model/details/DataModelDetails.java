package br.com.cepedi.e_drive.model.records.model.details;

import br.com.cepedi.e_drive.model.entitys.Model;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataModelDetails(

        @NotNull(message = "Identifier cannot be null.")
        Long id,

        @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters.")
        String name,

        @NotNull(message = "Activation status must be specified.")
        Boolean activated

) {
    public DataModelDetails(Model model) {
        this(model.getId(), model.getName(), model.getActivated());
    }
}
