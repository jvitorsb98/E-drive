package br.com.cepedi.e_drive.service.vehicleType.validations.activated;

/**
 * Interface para validação de ativação de tipos de veículos.
 * Implementações desta interface devem verificar se um tipo de veículo está ativado.
 */
public interface ValidationVehicleTypeActivated {

    /**
     * Valida se o tipo de veículo com o ID fornecido está ativado.
     *
     * @param id ID do tipo de veículo a ser validado.
     * @throws RuntimeException Se o tipo de veículo não estiver ativado.
     */
    void validation(Long id);
}
