package br.com.cepedi.e_drive.service.model.validations.activated;

/**
 * Interface para a validação da ativação de um modelo.
 * Implementações dessa interface devem fornecer a lógica para validar
 * se um modelo está ativado com base no seu ID.
 */
public interface ValidationModelActivated {

    /**
     * Valida se um modelo está ativado.
     *
     * @param id O ID do modelo a ser validado.
     */
    void validation(Long id);
}
