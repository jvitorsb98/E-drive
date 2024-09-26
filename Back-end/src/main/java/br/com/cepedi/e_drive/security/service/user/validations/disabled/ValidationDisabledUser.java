package br.com.cepedi.e_drive.security.service.user.validations.disabled;
/**
 * Interface para validação ao desativar um Usúario.
 * Implementações desta interface devem fornecer lógica para validar
 * a desativação de um Usúario específica.
 */
public interface ValidationDisabledUser {
    /**
     * Método para validar a desativação de um Usúario com o ID fornecido.
     *
     * @param id O ID da marca a ser desativada.
     * @throws jakarta.validation.ValidationException se a validação falhar.
     */
    void validation(Long id);
}
