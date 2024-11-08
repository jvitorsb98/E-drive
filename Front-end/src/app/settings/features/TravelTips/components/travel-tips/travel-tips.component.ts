import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-travel-tips',
  templateUrl: './travel-tips.component.html',
  styleUrl: './travel-tips.component.scss'
})
export class TravelTipsComponent {
  @ViewChild('fullContent') fullContentElement!: ElementRef;
  isReading = false;
  private synth = window.speechSynthesis;
  private utterance!: SpeechSynthesisUtterance;

  constructor() {}

  ngAfterViewInit() {
    let textContent = this.fullContentElement.nativeElement.textContent;
    // Remove pontos finais e outras pontuações que você quer ignorar
    textContent = textContent
      .replace(/\./g, '.   ')  // Adiciona espaço após ponto para criar pausa
      .replace(/,/g, ',  ');  // Adiciona espaço após vírgula para pequena pausa

    this.utterance = new SpeechSynthesisUtterance(textContent);
    this.utterance.lang = 'pt-BR'; // Configura para português do Brasil
    this.utterance.rate = 1.8; // Ajuste a velocidade da fala se necessário

    // Detecta quando a fala termina para mudar o botão
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

}
