import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-travel-tips',
  templateUrl: './travel-tips.component.html',
  styleUrl: './travel-tips.component.scss'
})
export class TravelTipsComponent {
  @ViewChild('fullContent') fullContentElement!: ElementRef;
  isReading = false;
  isLoggedIn = false;
  private synth = window.speechSynthesis;
  private utterance!: SpeechSynthesisUtterance;

  constructor() { }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('token') !== null;
  }

  ngAfterViewInit() {
    // Clona o conteúdo para manipular o DOM sem afetar a página real
    const clonedContent = this.fullContentElement.nativeElement.cloneNode(true);

    // Remove todos os elementos <mat-icon> clonados
    const icons = clonedContent.querySelectorAll('mat-icon');
    icons.forEach((icon: { remove: () => any; }) => icon.remove());

    // Obtém apenas o texto, sem tags HTML nem os ícones
    let textContent = clonedContent.textContent || '';

    // Adiciona espaçamento para pausas em pontuações, se necessário
    textContent = textContent
        .replace(/\./g, '.   ')  // Espaço após pontos para pausa
        .replace(/,/g, ',  ');   // Espaço após vírgulas para pausa

    // Configura a síntese de fala com o texto limpo
    this.utterance = new SpeechSynthesisUtterance(textContent);
    this.utterance.lang = 'pt-BR'; // Português do Brasil
    this.utterance.rate = 1.4;     // Ajusta a velocidade da fala

    // Detecta quando a fala termina para atualizar o botão
    this.utterance.onend = () => {
        this.isReading = false;
    };
}




  toggleRead() {
    if (this.isReading) {
      this.synth.cancel();
      this.isReading = false;
    } else {
      this.synth.speak(this.utterance);
      this.isReading = true;
    }
  }


  tips = [
    {
      icon: 'map', // Ícone para Planejamento de Rotas
      title: 'Planejamento de Rotas e Pontos de Carregamento',
      description: 'Uma das principais considerações ao usar um carro elétrico é planejar a rota de forma eficiente.',
      points: [
        'Conhecer os pontos de carregamento disponíveis por meio de aplicativos especializados.',
        'Planejar paradas estratégicas para recarga e descanso em viagens longas.',
        'Considerar o tempo de recarga ao escolher estações de carregamento rápido para otimizar o tempo de viagem.'
      ]
    },
    {
      icon: 'battery_charging_full', // Ícone para Gerenciamento de Energia
      title: 'Gerenciamento de Energia e Otimização da Bateria',
      description: 'Para obter o máximo de autonomia da bateria, siga essas práticas:',
      points: [
        'Evite manter altas velocidades constantemente, pois isso consome mais energia.',
        'Utilize o freio regenerativo sempre que possível para recuperar energia e aumentar a autonomia.',
        'Reduza o uso do ar-condicionado e do aquecimento, pois esses sistemas exigem bastante energia.',
        'Mantenha os pneus calibrados corretamente para melhorar a eficiência energética do veículo.'
      ]
    },
    {
      icon: 'ev_station', // Ícone para Carregamento Eficiente
      title: 'Práticas para Carregamento Eficiente da Bateria',
      description: 'Para prolongar a vida útil da bateria e manter o desempenho ideal, considere estas práticas de carregamento:',
      points: [
        'Evite cargas rápidas com frequência, pois elas podem reduzir a vida útil da bateria a longo prazo.',
        'Evite descarregar a bateria completamente antes de recarregá-la.',
        'Programe o carregamento para ocorrer durante a noite, quando a energia é mais barata e a demanda na rede é menor.'
      ]
    },
    {
      icon: 'thermostat', // Ícone para Cuidado com a Temperatura
      title: 'Cuidado com a Temperatura',
      description: 'Temperaturas extremas podem afetar a performance e a durabilidade da bateria, então siga estas recomendações:',
      points: [
        'Evite expor o carro a temperaturas extremas, pois isso pode reduzir a capacidade da bateria.',
        'Pré-aqueça ou pré-resfrie o carro enquanto ele estiver carregando, para otimizar o consumo de energia e manter o conforto.'
      ]
    },
    {
      icon: 'update', // Ícone para Manter o Carro Atualizado
      title: 'Mantenha o Carro Atualizado',
      description: 'Manter o software do carro atualizado é essencial para garantir a eficiência e a segurança do veículo.',
      points: [
        'Verifique regularmente se há atualizações de software disponíveis para o veículo.',
        'Configure lembretes para manutenção preventiva, garantindo que todos os componentes funcionem de maneira ideal.'
      ]
    },
    {
      icon: 'eco', // Ícone para Utilização Consciente e Sustentável
      title: 'Utilização Consciente e Sustentável',
      description: 'A utilização consciente do carro elétrico contribui para a economia de energia e o meio ambiente.',
      points: [
        'Combine viagens para otimizar percursos e reduzir o consumo de energia.',
        'Evite deslocamentos desnecessários e opte por alternativas sustentáveis, como transporte público ou bicicleta, sempre que possível.'
      ]
    }
  ];

}
