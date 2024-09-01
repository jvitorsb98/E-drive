package br.com.cepedi.e_drive.security.model.records.validations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.Pattern;

import java.lang.annotation.*;

/**
 * Annotation para validação de senha. Esta annotation é usada para garantir que a senha atenda a um conjunto de requisitos
 * de segurança específicos.
 * <p>
 * A senha deve ter pelo menos 8 caracteres e incluir pelo menos uma letra maiúscula, uma letra minúscula e um caractere especial.
 * Além disso, a senha não pode conter espaços em branco.
 * </p>
 *
 * @see Pattern
 */
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Documented
@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>])(?=\\S+$).{8,}$",
        message = "A senha deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula e um caractere especial.")
@ReportAsSingleViolation
public @interface Password {

    /**
     * Mensagem padrão a ser usada quando a senha não atender aos requisitos.
     *
     * @return A mensagem de erro padrão.
     */
    String message() default "Invalid password";

    /**
     * Grupos de validação para os quais a annotation deve ser aplicada.
     *
     * @return Os grupos de validação.
     */
    Class<?>[] groups() default {};

    /**
     * Payload associado à annotation. Pode ser usado para fornecer informações adicionais.
     *
     * @return O payload associado.
     */
    Class<? extends Payload>[] payload() default {};
}
