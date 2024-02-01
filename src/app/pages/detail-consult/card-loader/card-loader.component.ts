import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mapfre-card-loader',
  templateUrl: './card-loader.component.html',
  styleUrls: ['./card-loader.component.scss']
})
export class CardLoaderComponent implements OnInit {
  @Input() imageSize = 75;
  @Input() barHeight = 15;
  @Input() barWidth = 50;
  @Input() bars = 1;

  // Final properties

  public totalBars = [];
  public finalStyleImage = {};
  public finalStyleBar = {};

  ngOnInit(): void {
    // Calculate total bars
    for (let i = 0; i < this.bars; i++) {
      const randomValue = this.getRandomValue();
      this.totalBars.push({width: `${randomValue}%`, height: `${this.barHeight}px`});
    }

    // img style

    this.finalStyleImage = {
      width: `${this.imageSize}px`,
      height: `${this.imageSize}px`
    };

    // bar style
    this.finalStyleBar = {
      width: `${this.barWidth}%`,
      height: `${this.barHeight}px`,
    };
  }

  getRandomValue() {
    // Generar un número aleatorio entre 0 y 3
    var randomNumber = Math.floor(Math.random() * 4);
  
    // Mapear el número aleatorio a los valores deseados
    switch (randomNumber) {
      case 0:
        return 25;
      case 1:
        return 50;
      case 2:
        return 75;
      case 3:
        return 100;
    }
  }
  
}
