package br.com.cepedi.e_drive.model.records.vehicleType.details;

import br.com.cepedi.e_drive.model.entitys.VehicleType;

/**
 * Record que encapsula os detalhes de um tipo de veículo.
 * Utilizado para representar as informações de um tipo de veículo em detalhes.
 *
 * @param id Identificador do tipo de veículo.
 * @param name Nome do tipo de veículo.
 * @param activated Status de ativação do tipo de veículo.
 */
public record DataVehicleTypeDetails(

        /**
         * Identificador do tipo de veículo.
         *
         * @return Identificador do tipo de veículo.
         */
        Long id,

        /**
         * Nome do tipo de veículo.
         *
         * @return Nome do tipo de veículo.
         */
        String name,

        /**
         * Status de ativação do tipo de veículo.
         *
         * <p>Indica se o tipo de veículo está ativado ou não.</p>
         *
         * @return {@code true} se o tipo de veículo estiver ativado, {@code false} caso contrário.
         */
        Boolean activated

) {
    /**
     * Construtor que cria uma instância de {@link DataVehicleTypeDetails} a partir de um objeto {@link VehicleType}.
     *
     * @param vehicleType Objeto do tipo {@link VehicleType} do qual os dados serão extraídos.
     */
    public DataVehicleTypeDetails(VehicleType vehicleType) {
        this(
                vehicleType.getId(),
                vehicleType.getName(),
                vehicleType.isActivated()
        );
    }
}
