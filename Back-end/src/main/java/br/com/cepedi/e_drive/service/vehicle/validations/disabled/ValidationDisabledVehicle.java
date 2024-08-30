package br.com.cepedi.e_drive.service.vehicle.validations.disabled;

/**
 * Interface para validações relacionadas a veículos desativados.
 *
 * Esta interface define o contrato para validações que devem ser realizadas
 * antes de desativar um veículo, garantindo que as regras de negócio sejam
 * respeitadas.
 */
public interface ValidationDisabledVehicle {

    /**
     * Valida as condições necessárias antes de desativar um veículo.
     *
     * @param id ID do veículo a ser validado.
     * @throws IllegalArgumentException Se o veículo não atender aos critérios de desativação.
     */
    void validate(Long id);
}
