/**
 * Interface que representa os dados de requisição para um endereço.
 */
export interface IAddressRequest {
  /**
   * País do endereço.
   * @type {string}
   */
  country: string; // país

  /**
   * Código postal (CEP) do endereço.
   * @type {string}
   */
  zipCode: string; // CEP

  /**
   * Estado do endereço.
   * @type {string}
   */
  state: string; // estado

  /**
   * Cidade do endereço.
   * @type {string}
   */
  city: string; // cidade

  /**
   * Bairro do endereço.
   * @type {string}
   */
  neighborhood: string; // bairro

  /**
   * Número da casa ou edifício do endereço.
   * @type {number}
   */
  number: number; // numero da casa

  /**
   * Nome da rua ou logradouro do endereço.
   * @type {string}
   */
  street: string; // nome da rua/ logradouro

  /**
   * Complemento do endereço (opcional).
   * @type {string}
   */
  complement: string; // complemento

  /**
   * Indica se há uma estação de carregamento.
   * @type {boolean}
   */
  hasChargingStation: boolean; // tem uma estação de carregamento
}

/**
 * Interface que representa a resposta de um endereço.
 */
export interface IAddressResponse {
  /**
   * Identificador único do endereço.
   * @type {number}
   */
  id: number; // id

  /**
   * País do endereço.
   * @type {string}
   */
  country: string; // país

  /**
   * Código postal (CEP) do endereço.
   * @type {string}
   */
  zipCode: string; // CEP

  /**
   * Estado do endereço.
   * @type {string}
   */
  state: string; // estado

  /**
   * Cidade do endereço.
   * @type {string}
   */
  city: string; // cidade

  /**
   * Bairro do endereço.
   * @type {string}
   */
  neighborhood: string; // bairro

  /**
   * Número da casa ou edifício do endereço.
   * @type {number}
   */
  number: number; // numero da casa

  /**
   * Nome da rua ou logradouro do endereço.
   * @type {string}
   */
  street: string; // nome da rua/ logradouro

  /**
   * Identificador do proprietário do endereço.
   * @type {number}
   */
  userId: number; // id do proprietário

  /**
   * Indica se há uma estação de carregamento.
   * @type {boolean}
   */
  hasChargingStation: boolean; // tem uma estação de carregamento

  /**
   * Complemento do endereço (opcional).
   * @type {string}
   */
  complement: string; // complemento

  /**
   * Indica se o endereço está ativo.
   * @type {boolean}
   */
  activated: boolean; // ativo
}

/**
 * Interface que representa os detalhes de um endereço.
 */
export interface DataAddressDetails {
  /**
   * Identificador único do endereço.
   * @type {number}
   */
  id: number; // id

  /**
   * País do endereço.
   * @type {string}
   */
  country: string; // país

  /**
   * Código postal (CEP) do endereço.
   * @type {string}
   */
  zipCode: string; // CEP

  /**
   * Estado do endereço.
   * @type {string}
   */
  state: string; // estado

  /**
   * Cidade do endereço.
   * @type {string}
   */
  city: string; // cidade

  /**
   * Bairro do endereço.
   * @type {string}
   */
  neighborhood: string; // bairro

  /**
   * Número da casa ou edifício do endereço.
   * @type {number}
   */
  number: number; // numero da casa

  /**
   * Nome da rua ou logradouro do endereço.
   * @type {string}
   */
  street: string; // nome da rua/ logradouro

  /**
   * Identificador do proprietário do endereço.
   * @type {number}
   */
  userId: number; // id do proprietário

  /**
   * Indica se há uma estação de carregamento.
   * @type {boolean}
   */
  hasChargingStation: boolean; // tem uma estação de carregamento

  /**
   * Complemento do endereço (opcional).
   * @type {string}
   */
  complement: string; // complemento

  /**
   * Indica se o endereço está ativo.
   * @type {boolean}
   */
  activated: boolean; // ativo
}

/**
 * Interface que representa os dados de endereço com um título associado.
 */
export interface AddressData {
  /**
   * Detalhes do endereço.
   * @type {DataAddressDetails}
   */
  address: DataAddressDetails;

  /**
   * Título associado ao endereço.
   * @type {string}
   */
  title: string;
}
