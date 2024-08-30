package br.com.cepedi.e_drive.service.vehicleUser.validations.update;

/**
 * Interface para validações relacionadas à atualização de usuários de veículos.
 * Implementações desta interface devem fornecer a lógica para validar um usuário de veículo
 * com base no ID fornecido antes de realizar uma atualização.
 */
public interface ValidationUpdateVehicleUser {

    /**
     * Valida um usuário de veículo com base no ID fornecido.
     *
     * @param id ID do usuário de veículo a ser validado.
     */
    void validate(Long id);

}
