package br.com.cepedi.e_drive.service.vehicleType.validations.update;

/**
 * Interface para validação de tipos de veículos durante processos de atualização.
 * Implementações desta interface são responsáveis por garantir que os tipos de veículos
 * atendam a certos critérios antes de realizar operações de atualização.
 */
public interface ValidationUpdateVehicleType {

    /**
     * Valida o tipo de veículo com o ID fornecido.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws ValidationException Se o tipo de veículo não atender aos critérios de validação.
     */
    void validation(Long id);
}
