// O conteúdo do arquivo do ambiente atual irá sobrescrevê-lo durante a construção.
// O sistema de compilação usa como padrão o ambiente de desenvolvimento que usa `environment.ts`, mas se você usar
// `ng build --env=prod` então `environment.prod.ts` será usado em seu lugar.
// A lista de quais env mapeia para qual arquivo pode ser encontrada em `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: '/api/backend', 
  googleMapsApiKey: 'AIzaSyCn8EgZ45ta8c69P-j_F9BX4wdsyQsL8_w' // Substitua pela chave de API
};