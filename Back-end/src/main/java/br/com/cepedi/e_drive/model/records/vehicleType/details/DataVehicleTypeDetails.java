package br.com.cepedi.e_drive.model.records.vehicleType.details;

import br.com.cepedi.e_drive.model.entitys.VehicleType;

public record DataVehicleTypeDetails(
        Long id,
        String name,
        Boolean activated
) {
    public DataVehicleTypeDetails(VehicleType vehicleType) {
        this(
                vehicleType.getId(),
                vehicleType.getName(),
                vehicleType.isActivated()
        );
    }
}
