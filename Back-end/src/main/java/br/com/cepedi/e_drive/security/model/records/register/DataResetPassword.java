package br.com.cepedi.e_drive.security.model.records.register;

import br.com.cepedi.e_drive.security.model.records.validations.Password;
import jakarta.validation.constraints.NotBlank;

/**
 * Record que encapsula os dados necessários para redefinir a senha de um usuário.
 * <p>
 * Esta classe record é utilizada para armazenar o token de redefinição de senha e a nova senha do usuário.
 * O token deve ser fornecido e não pode estar em branco, assim como a nova senha, que deve atender aos requisitos
 * de segurança definidos pela anotação {@link Password}.
 * </p>
 *
 * @param token O token de redefinição de senha fornecido ao usuário. Não pode estar em branco.
 * @param password A nova senha do usuário. Deve atender aos requisitos definidos pela anotação {@link Password}.
 */
public record DataResetPassword(

        String token,

        String password

) {
}
