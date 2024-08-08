package br.com.cepedi.e_drive.model.records.vehicleUser.details;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import java.math.BigDecimal;

public record DataVehicleUserDetails(
        Long id,
        Long userId,
        Long vehicleId,
        BigDecimal mileagePerLiterRoad,
        BigDecimal mileagePerLiterCity,
        BigDecimal consumptionEnergetic,
        BigDecimal autonomyElectricMode,
        boolean activated
) {
    public DataVehicleUserDetails(VehicleUser vehicleUser) {
        this(
                vehicleUser.getId(),
                vehicleUser.getUser().getId(),
                vehicleUser.getVehicle().getId(),
                vehicleUser.getMileagePerLiterRoad(),
                vehicleUser.getMileagePerLiterCity(),
                vehicleUser.getConsumptionEnergetic(),
                vehicleUser.getAutonomyElectricMode(),
                vehicleUser.isActivated()
        );
    }
}
