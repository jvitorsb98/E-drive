// Definindo a interface para um passo no stepsArray
export interface Step {
    distance: number; // Distância da etapa
    duration: string; // Duração da etapa
    instructions: string; // Instruções para a manobra
    travelMode: string; // Modo de viagem
    path: google.maps.LatLng[]; // Caminho da viagem
    maneuver: string; // Tipo de manobra
    roadType: string; // Categoria da estrada (cidad / estrada)
  }
  