package br.com.cepedi.e_drive.model.records.vehicle.details;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.records.autonomy.details.DataAutonomyDetails;
import br.com.cepedi.e_drive.model.records.brand.details.DataBrandDetails;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;

import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DataVehicleDetails(

        @NotNull(message = "Identifier cannot be null.")
        Long id,

        @NotNull(message = "Motor cannot be null.")
        @Size(min = 1, max = 100, message = "Motor must be between 1 and 100 characters.")
        String motor,

        @NotNull(message = "Version cannot be null.")
        @Size(min = 1, max = 100, message = "Version must be between 1 and 100 characters.")
        String version,

        @NotNull(message = "Model cannot be null.")
        DataModelDetails model,

        @NotNull(message = "Category cannot be null.")
        DataCategoryDetails category,

        @NotNull(message = "Type cannot be null.")
        DataVehicleTypeDetails type,


        @NotNull(message = "Propulsion cannot be null.")
        DataPropulsionDetails propulsion,

        @NotNull(message = "Autonomy cannot be null.")
        DataAutonomyDetails autonomy

) {
    public DataVehicleDetails(Vehicle vehicle) {
        this(
                vehicle.getId(),
                vehicle.getMotor(),
                vehicle.getVersion(),
                new DataModelDetails(vehicle.getModel()),
                new DataCategoryDetails(vehicle.getCategory()),
                new DataVehicleTypeDetails(vehicle.getType()),
                new DataPropulsionDetails(vehicle.getPropulsion()),
                new DataAutonomyDetails(vehicle.getAutonomy())
        );
    }
}
