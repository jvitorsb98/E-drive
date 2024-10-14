package br.com.cepedi.e_drive.model.records.vehicleUser.details;

import br.com.cepedi.e_drive.model.entitys.VehicleUser;
import java.math.BigDecimal;

/**
 * Record que encapsula os detalhes de um veículo associado a um usuário.
 * Utilizado para representar as informações detalhadas sobre o relacionamento entre um usuário e um veículo,
 * incluindo dados de desempenho e status de ativação.
 *
 * @param id Identificador único do relacionamento entre o usuário e o veículo.
 * @param userId Identificador do usuário associado ao veículo.
 * @param vehicleId Identificador do veículo associado ao usuário.
 * @param mileagePerLiterRoad Consumo de combustível (ou energia) do veículo em estradas.
 * @param mileagePerLiterCity Consumo de combustível (ou energia) do veículo na cidade.
 * @param consumptionEnergetic Consumo energético do veículo.
 * @param autonomyElectricMode Autonomia do veículo em modo elétrico.
 * @param activated Status de ativação do relacionamento (verdadeiro se ativado, falso caso contrário).
 */
public record DataVehicleUserDetails(

        /**
         * Identificador único do relacionamento entre o usuário e o veículo.
         *
         * @return Identificador único.
         */
        Long id,

        /**
         * Identificador do usuário associado ao veículo.
         *
         * @return Identificador do usuário.
         */
        Long userId,

        /**
         * Identificador do veículo associado ao usuário.
         *
         * @return Identificador do veículo.
         */
        Long vehicleId,

        /**
         * Consumo de combustível (ou energia) do veículo em estradas.
         *
         * @return Consumo de combustível em estradas.
         */
        BigDecimal mileagePerLiterRoad,

        /**
         * Consumo de combustível (ou energia) do veículo na cidade.
         *
         * @return Consumo de combustível na cidade.
         */
        BigDecimal mileagePerLiterCity,

        /**
         * Consumo energético do veículo.
         *
         * @return Consumo energético.
         */
        BigDecimal consumptionEnergetic,

        /**
         * Autonomia do veículo em modo elétrico.
         *
         * @return Autonomia elétrica.
         */
        BigDecimal autonomyElectricMode,

        BigDecimal batteryCapacity,


        /**
         * Status de ativação do relacionamento.
         *
         * @return Verdadeiro se o relacionamento estiver ativado, falso caso contrário.
         */
        boolean activated

) {
    /**
     * Construtor que cria uma instância de {@code DataVehicleUserDetails} a partir de um objeto {@code VehicleUser}.
     *
     * @param vehicleUser Objeto {@code VehicleUser} com as informações a serem representadas.
     */
    public DataVehicleUserDetails(VehicleUser vehicleUser) {
        this(
                vehicleUser.getId(),
                vehicleUser.getUser().getId(),
                vehicleUser.getVehicle().getId(),
                vehicleUser.getMileagePerLiterRoad(),
                vehicleUser.getMileagePerLiterCity(),
                vehicleUser.getConsumptionEnergetic(),
                vehicleUser.getAutonomyElectricMode(),
                vehicleUser.getBatteryCapacity(),
                vehicleUser.isActivated()
        );
    }
}
