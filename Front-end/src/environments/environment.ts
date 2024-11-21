// O conteúdo do arquivo do ambiente atual irá sobrescrevê-lo durante a construção.
// O sistema de compilação usa como padrão o ambiente de desenvolvimento que usa `environment.ts`, mas se você usar
// `ng build --env=prod` então `environment.prod.ts` será usado em seu lugar.
// A lista de quais env mapeia para qual arquivo pode ser encontrada em `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://54.200.23.253:8080', // Use localhost para comunicar-se com o backend
  baseAssets: 'e-drive/assets/',
  googleMapsApiKey: 'AIzaSyCVzPB0CvNAoAR96FJ0pPrlQBXcO4v9yZs' // Substitua pela chave de API
};