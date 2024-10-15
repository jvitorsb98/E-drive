/**
 * Interface que representa a requisição de login.
 */
export interface ILoginRequest {
  /**
   * Nome de usuário ou e-mail utilizado para login.
   * @type {string}
   */
  login: string;

  /**
   * Senha do usuário para autenticação.
   * @type {string}
   */
  password: string;
}

/**
 * Interface que representa a resposta de login.
 */
export interface ILoginResponse {
  /**
   * Token de autenticação gerado após um login bem-sucedido.
   * @type {string}
   */
  token: string;
}

/**
 * Interface que representa a requisição para recuperação de senha.
 */
export interface IRecoverPasswordRequest {
  /**
   * E-mail do usuário para enviar as instruções de recuperação de senha.
   * @type {string}
   */
  email: string;
}

/**
 * Interface que representa a requisição para recuperação de conta.
 */
export interface IRecoverAccountRequest {
  /**
   * E-mail do usuário para enviar as instruções de recuperação da conta.
   * @type {string}
   */
  email: string;
}

/**
 * Interface que representa a resposta para recuperação de senha.
 */
export interface IRecoverPasswordResponse {
  /**
   * Token gerado para a recuperação de senha.
   * @type {string}
   */
  token: string;
}

/**
 * Interface que representa a resposta para recuperação de conta.
 */
export interface IRecoverAccountResponse {
  /**
   * Token gerado para a recuperação da conta.
   * @type {string}
   */
  token: string;
}

/**
 * Interface que representa a requisição para redefinição de senha.
 */
export interface IResetPasswordRequest {
  /**
   * Token recebido para a redefinição de senha.
   * @type {string}
   */
  token: string;

  /**
   * Nova senha que será definida.
   * @type {string}
   */
  password: string;
}


export interface IRecoverPasswordResponse {
  /**
   * Mensagem após uma solicitação bem-sucedida.
   * @type {string}
   */
  message: string;
}