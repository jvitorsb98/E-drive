package br.com.cepedi.e_drive.security.model.records.register;

import br.com.cepedi.e_drive.security.model.records.validations.Password;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

/**
 * Record que encapsula os dados para o registro de um novo usuário.
 * <p>
 * Esta classe record é utilizada para armazenar as informações necessárias para o registro de um usuário,
 * incluindo o email, nome, senha, data de nascimento e número de celular.
 * </p>
 *
 * @param email       O endereço de e-mail do usuário. Deve ser um e-mail válido e não pode estar em branco.
 * @param name        O nome completo do usuário. Não pode estar em branco.
 * @param password    A senha do usuário. Deve atender às regras de senha especificadas.
 * @param birth       A data de nascimento do usuário. Deve ser uma data passada e não pode ser nula.
 * @param cellPhone   O número de celular do usuário. Não pode estar em branco.
 */
public record DataRegisterUser(

        @NotBlank(message = "{notblank.user.email}")
        @Email(message = "{email.user.email}")
        String email,

        @NotBlank(message = "{notblank.user.name}")
        String name,

        @NotBlank(message = "{notblank.user.password}")
        @Password(message = "{password.user.password}")
        String password,

        @NotNull(message = "{notnull.user.birth}")
        @Past(message = "{past.user.birth}")
        LocalDate birth, // Valida que é uma data passada

        @NotBlank(message = "{notblank.user.cellphone}")
        String cellPhone // Adicione o celular

) {}
