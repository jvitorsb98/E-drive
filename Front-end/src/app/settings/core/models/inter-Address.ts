export interface IAddressRequest {
  country: string; // país
  zipCode: string; // CEP
  state: string; // estado
  city: string; // cidade
  neighborhood: string; // bairro
  number: number; // numero da casa
  street: string; // nome da rua/ logradouro
  complement: string; // complemento
  hasChargingStation: boolean; // tem uma estação de carregamento
}

export interface IAddressResponse {
  id: number; // id
  country: string; // país
  zipCode: string; // CEP
  state: string; // estado
  city: string; // cidade
  neighborhood: string; // bairro
  number: number; // numero da casa
  street: string; // nome da rua/ logradouro
  userId: number; // id do proprietário
  hasChargingStation: boolean; // tem uma estação de carregamento
  complement: string; // complemento
  activated: boolean; // ativo
}
