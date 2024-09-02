package br.com.cepedi.e_drive.service.brand.validations.disabled;

/**
 * Interface para validação ao desativar uma marca.
 * Implementações desta interface devem fornecer lógica para validar
 * a desativação de uma marca específica.
 */
public interface BrandValidatorDisabled {

    /**
     * Método para validar a desativação de uma marca com o ID fornecido.
     *
     * @param id O ID da marca a ser desativada.
     * @throws jakarta.validation.ValidationException se a validação falhar.
     */
    void validation(Long id);
}
