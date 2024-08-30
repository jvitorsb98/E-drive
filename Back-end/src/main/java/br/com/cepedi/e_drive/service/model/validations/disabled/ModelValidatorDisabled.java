package br.com.cepedi.e_drive.service.model.validations.disabled;

/**
 * Interface para validação de modelos que estão sendo desativados.
 */
public interface ModelValidatorDisabled {

    /**
     * Valida se um modelo pode ser desativado.
     *
     * @param id O ID do modelo a ser validado.
     */
    void validation(Long id);
}
