package br.com.cepedi.e_drive.model.records.vehicle.register;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Record que encapsula os dados necessários para registrar um novo veículo.
 * Utilizado para a criação de um veículo no sistema.
 *
 * @param motor Motor do veículo. Deve ter entre 1 e 100 caracteres e não pode ser nulo.
 * @param version Versão do veículo. Deve ter entre 1 e 100 caracteres e não pode ser nula.
 * @param modelId Identificador do modelo do veículo. Não pode ser nulo.
 * @param categoryId Identificador da categoria do veículo. Não pode ser nulo.
 * @param typeId Identificador do tipo de veículo. Não pode ser nulo.
 * @param propulsionId Identificador da propulsão do veículo. Não pode ser nulo.
 * @param year Ano de fabricação do veículo. Não pode ser nulo.
 * @param dataRegisterAutonomy Dados de registro da autonomia do veículo. Não pode ser nulo.
 */
public record DataRegisterVehicle(

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
         * Identificador do modelo do veículo.
         *
         * @return Identificador do modelo do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Model cannot be null.")
        Long modelId,

        /**
         * Identificador da categoria do veículo.
         *
         * @return Identificador da categoria do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Category cannot be null.")
        Long categoryId,

        /**
         * Identificador do tipo de veículo.
         *
         * @return Identificador do tipo de veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Type cannot be null.")
        Long typeId,

        /**
         * Identificador da propulsão do veículo.
         *
         * @return Identificador da propulsão do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Propulsion cannot be null.")
        Long propulsionId,

        /**
         * Ano de fabricação do veículo.
         *
         * @return Ano de fabricação do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Year cannot be null.")
        Long year,

        /**
         * Dados de registro da autonomia do veículo.
         *
         * @return Dados de registro da autonomia do veículo.
         * @throws jakarta.validation.constraints.NotNull se o valor for nulo.
         */
        @NotNull(message = "Autonomy cannot be null.")
        DataRegisterAutonomy dataRegisterAutonomy

) {
}
