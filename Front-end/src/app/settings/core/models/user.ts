import { Role } from "./role";

export interface User {
  /**
   * Identificador único do usuário.
   * @type {number}
   */
  id: number;

  /**
   * Nome completo do usuário.
   * @type {string}
   */
  name: string;

  /**
   * Endereço de e-mail do usuário.
   * @type {string}
   */
  email: string;

  /**
   * Número de telefone celular do usuário.
   * @type {string}
   */
  cellPhone: string;

  /**
   * Senha do usuário, armazenada de forma segura.
   * @type {string}
   */
  password: string;

  /**
   * Data de nascimento do usuário. Pode ser nula se não fornecida.
   * @type {Date | null}
   */
  birth: Date | null;

  /**
   * Código do país do usuário.
   * @type {string}
   */
  countryCode: string;

  /**
   * Funções associadas ao usuário, definindo suas permissões e acessos.
   * @type {Role[]}
   */
  roles: Role[];
}
