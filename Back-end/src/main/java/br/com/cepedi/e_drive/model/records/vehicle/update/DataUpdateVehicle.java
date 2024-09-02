package br.com.cepedi.e_drive.model.records.vehicle.update;

import br.com.cepedi.e_drive.model.records.autonomy.register.DataRegisterAutonomy;

/**
 * Record que encapsula os dados necessários para atualizar as informações de um veículo.
 * Utilizado para atualizar as propriedades de um veículo existente no sistema.
 *
 * @param motor Motor do veículo.
 * @param version Versão do veículo.
 * @param modelId Identificador do modelo do veículo.
 * @param categoryId Identificador da categoria do veículo.
 * @param typeId Identificador do tipo de veículo.
 * @param brandId Identificador da marca do veículo.
 * @param propulsionId Identificador do tipo de propulsão do veículo.
 * @param year Ano de fabricação do veículo.
 * @param dataRegisterAutonomy Dados de autonomia a serem atualizados.
 */
public record DataUpdateVehicle(

        /**
         * Motor do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Motor do veículo.
         */
        String motor,

        /**
         * Versão do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Versão do veículo.
         */
        String version,

        /**
         * Identificador do modelo do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Identificador do modelo.
         */
        Long modelId,

        /**
         * Identificador da categoria do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Identificador da categoria.
         */
        Long categoryId,

        /**
         * Identificador do tipo de veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Identificador do tipo.
         */
        Long typeId,

        /**
         * Identificador da marca do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Identificador da marca.
         */
        Long brandId,

        /**
         * Identificador do tipo de propulsão do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Identificador do tipo de propulsão.
         */
        Long propulsionId,

        /**
         * Ano de fabricação do veículo.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Ano de fabricação do veículo.
         */
        Long year,

        /**
         * Dados de autonomia a serem atualizados.
         *
         * <p>Este campo é opcional e pode ser nulo se não houver alteração desejada.</p>
         *
         * @return Dados de autonomia.
         */
        DataRegisterAutonomy dataRegisterAutonomy

) {
}
