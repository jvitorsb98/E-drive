package br.com.cepedi.e_drive.security.model.records.register;

/**
 * Record que encapsula os dados de autenticação de um usuário.
 * <p>
 * Esta classe record é usada para representar as credenciais de login de um usuário,
 * incluindo o nome de usuário (login) e a senha.
 * </p>
 *
 * @param login    O nome de usuário ou e-mail utilizado para autenticação.
 * @param password A senha utilizada para autenticação.
 */
public record DataAuth(String login, String password) {
}
