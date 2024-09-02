package br.com.cepedi.e_drive.service.vehicleUser.validations.disabled;

/**
 * Interface para validações relacionadas à desativação de um usuário de veículo.
 */
public interface ValidationDisabledVehicleUser {

    /**
     * Valida se a desativação de um usuário de veículo é permitida.
     *
     * @param id ID do usuário de veículo a ser validado.
     */
    void validate(Long id);
}
