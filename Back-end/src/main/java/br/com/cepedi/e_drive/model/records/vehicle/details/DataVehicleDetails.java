package br.com.cepedi.e_drive.model.records.vehicle.details;

import br.com.cepedi.e_drive.model.entitys.Vehicle;
import br.com.cepedi.e_drive.model.records.autonomy.details.DataAutonomyDetails;
import br.com.cepedi.e_drive.model.records.category.details.DataCategoryDetails;
import br.com.cepedi.e_drive.model.records.model.details.DataModelDetails;
import br.com.cepedi.e_drive.model.records.propulsion.details.DataPropulsionDetails;
import br.com.cepedi.e_drive.model.records.vehicleType.details.DataVehicleTypeDetails;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os detalhes de um veículo.
 * Utilizado para transferir informações detalhadas sobre um veículo específico.
 *
 * @param id Identificador único do veículo. Não pode ser nulo.
 * @param motor Motor do veículo. Deve ter entre 1 e 100 caracteres e não pode ser nulo.
 * @param version Versão do veículo. Deve ter entre 1 e 100 caracteres e não pode ser nula.
 * @param model Detalhes do modelo do veículo. Não pode ser nulo.
 * @param category Detalhes da categoria do veículo. Não pode ser nula.
 * @param type Detalhes do tipo de veículo. Não pode ser nulo.
 * @param propulsion Detalhes da propulsão do veículo. Pode ser nulo.
 * @param autonomy Detalhes da autonomia do veículo. Pode ser nulo.
 * @param year Ano de fabricação do veículo. Pode ser nulo.
 */
public record DataVehicleDetails(

        /**
         * Identificador único do veículo.
         *
         * @return Identificador do veículo.
         */
        @NotNull(message = "Identifier cannot be null.")
        Long id,

        /**
         * Motor do veículo.
         *
         * <p>Este campo deve ter entre 1 e 100 caracteres. Se o valor fornecido estiver fora deste intervalo,
         * uma mensagem de erro será gerada.</p>
         *
         * @return Motor do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         * @throws jakarta.validation.constraints.Size se o valor estiver fora do intervalo especificado.
         */
        @NotNull(message = "Motor cannot be null.")
        @Size(min = 1, max = 100, message = "Motor must be between 1 and 100 characters.")
        String motor,

        /**
         * Versão do veículo.
         *
         * <p>Este campo deve ter entre 1 e 100 caracteres. Se o valor fornecido estiver fora deste intervalo,
         * uma mensagem de erro será gerada.</p>
         *
         * @return Versão do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         * @throws jakarta.validation.constraints.Size se o valor estiver fora do intervalo especificado.
         */
        @NotNull(message = "Version cannot be null.")
        @Size(min = 1, max = 100, message = "Version must be between 1 and 100 characters.")
        String version,

        /**
         * Detalhes do modelo do veículo.
         *
         * @return Detalhes do modelo do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Model cannot be null.")
        DataModelDetails model,

        /**
         * Detalhes da categoria do veículo.
         *
         * @return Detalhes da categoria do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Category cannot be null.")
        DataCategoryDetails category,

        /**
         * Detalhes do tipo de veículo.
         *
         * @return Detalhes do tipo de veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Type cannot be null.")
        DataVehicleTypeDetails type,

        /**
         * Detalhes da propulsão do veículo.
         *
         * @return Detalhes da propulsão do veículo. Pode ser nulo se não aplicável.
         */
        DataPropulsionDetails propulsion,

        /**
         * Detalhes da autonomia do veículo.
         *
         * @return Detalhes da autonomia do veículo. Pode ser nulo se não aplicável.
         */
        DataAutonomyDetails autonomy,

        /**
         * Ano de fabricação do veículo.
         *
         * @return Ano de fabricação do veículo. Pode ser nulo se não aplicável.
         */
        Long year,

        /**
         * Detalhes de ativação do veículo.
         *
         * @return 'true' se o veículo estiver ativo, 'false' caso contrário..
         */
        Boolean activated

) {
    /**
     * Construtor que cria uma instância de {@link DataVehicleDetails} a partir de um objeto {@link Vehicle}.
     *
     * @param vehicle O veículo do qual os detalhes serão extraídos.
     */
    public DataVehicleDetails(Vehicle vehicle) {
        this(
                vehicle.getId(),
                vehicle.getMotor(),
                vehicle.getVersion(),
                new DataModelDetails(vehicle.getModel()),
                new DataCategoryDetails(vehicle.getCategory()),
                new DataVehicleTypeDetails(vehicle.getType()),
                new DataPropulsionDetails(vehicle.getPropulsion()),
                new DataAutonomyDetails(vehicle.getAutonomy()),
                vehicle.getYear(),
                vehicle.isActivated()
        );
    }
}
