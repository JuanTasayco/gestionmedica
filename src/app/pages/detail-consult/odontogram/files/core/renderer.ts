export class Renderer {
  context: any = null;
  width = 0;
  height = 0;
  settings = null;
  variable = Array();

  drawSplash() {
    this.context.fillStyle ="#ffffff";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.beginPath();
    this.context.textAlign = 'center';
    this.context.fillStyle = "#000000";
    this.context.font = "32px sans-serif Bold";
    this.context.fillText("OdontoGraph 1.0.0", this.width / 2,
                           this.height / 2 - 16);

    this.context.font = "18px sans-serif Bold";
    this.context.fillStyle = "#000000";
  }

  init(canvas: any) {
    this.context = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.drawSplash();
  }

  clear(settings: any, valor?: any) {
    if (settings.DEBUG) {
      this.context.fillStyle ="#e6fff3";
  } else {
      this.context.fillStyle ="#ffffff";
  }

  this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

  this.context.restore();

  //PINTAR LINEA TRANSVERSAL CENTRAL VERTICAL
  this.context.beginPath();
  this.context.lineWidth = 2;
  this.context.strokeStyle = settings.COLOR_BLACK;


  //this.context.moveTo(this.context.canvas.width / 2, 0);
  //this.context.lineTo(this.context.canvas.width / 2, this.context.canvas.height);
  /*jjallo 11092020*/
  //console.log('valor_clear', valor);
  if (valor == 1) {
      this.context.moveTo(this.context.canvas.width /2, 130);
      this.context.lineTo(this.context.canvas.width / 2, (this.context.canvas.height / 2) + 190); //pinta la l�nea vertical para la impresion  215
  } else {
      this.context.moveTo(this.context.canvas.width / 2, 0);
      //this.context.lineTo(this.context.canvas.width / 2, this.context.canvas.height);
      this.context.lineTo(this.context.canvas.width / 2, 500);//600
  }
  /**/

  this.context.stroke();
  }

  render(data: any, settings: any, constants?: any, indicador?: any) {
    // draw the teeth
    var posicion = 0;//jjallo 26112020
    for (var i = 0; i < data.length; i++) {

        /*jjallo 26112020*/
        if (data.length == 96) {
            if (indicador == 'IMP') {
                if (i >= 0 && i < 16) //primera fila de 16 cuadrados superior(18,11 - 21,28)
                    posicion = 1;
                else if (i > 15 && i < 32) //primera fila de 16 cuadrados inferior(41,48 - 31,38)
                    posicion = 1;
                else if (i > 31 && i < 40)//segunda fila de 8 cuadrados inferior(18,11)
                    posicion = 2;
                else if (i > 39 && i < 48)//tercera fila de 8 cuadrados inferior(18,11)
                    posicion = 3;
                else if (i > 47 && i < 56) //segunda fila de 8 cuadrados superior(21,28)
                    posicion = 2;
                else if (i > 55 && i < 64) //tercera fila de 8 cuadrados superior(21,28)
                    posicion = 3;
                else if (i > 63 && i < 72) //segunda fila de 8 cuadrados inferior(41,48)
                    posicion = 2;
                else if (i > 71 && i < 80) //tercera fila de 8 cuadrados inferior(41,48)
                    posicion = 3;
                else if (i > 79 && i < 88) //segunda fila de 8 cuadrados inferior(31,38)
                    posicion = 2;
                else if (i > 87 && i <= 95) //tercera fila de 8 cuadrados inferior(31,38)
                    posicion = 3;
            }
        }
        else if (data.length == 60) {
            if (indicador == 'IMP') {
                if (i >= 0 && i < 10) //primera fila de 10 cuadrados superior(55,51 - 61,65)
                    posicion = 1;
                else if (i > 9 && i < 20) //primera fila de 10 cuadrados inferior(85,81 - 71,75)
                    posicion = 1;
                else if (i > 19 && i < 25) //segunda fila de 5 cuadrados superior(55,51)
                    posicion = 2;
                else if (i > 24 && i < 30) //tercera fila de 5 cuadrados superior(55,51)
                    posicion = 3;
                else if (i > 29 && i < 35) //segunda fila de 5 cuadrados superior(61,65)
                    posicion = 2;
                else if (i > 34 && i < 40) //tercera fila de 5 cuadrados superior(61,65)
                    posicion = 3;
                else if (i > 39 && i < 45) //segunda fila de 5 cuadrados superior(85,81)
                    posicion = 2;
                else if (i > 44 && i < 50) //tercera fila de 5 cuadrados superior(85,81)
                    posicion = 3;
                else if (i > 49 && i < 55) //segunda fila de 5 cuadrados superior(71,75)
                    posicion = 2;
                else if (i > 54 && i <= 59) //tercera fila de 5 cuadrados superior(71,75)
                    posicion = 3;
            }
        }
        /**/
        //data[i].render(this.context, settings, constants);


        //04042023 Inicio
        //data[i].render(this.context, settings, constants, indicador, posicion);
        this.variable = data[i];
        data[i].render(this.context, settings, constants, indicador, posicion, data, this.variable);
        //Fin
    }
  }

  renderText(text: any, x: any, y: any, color: any) {
    if (color == undefined) {
      color = '#000000'; // default color = black
    }

    this.context.textAlign = 'left';
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
    this.context.restore();
  }

  setSettings(settings: any) {
    this.settings = settings;
  }

  setCanvasSize(width: any, height: any) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
  }

  renderTextCenter16(text: any, x: any, y: any, color: any) {
    if (color == undefined) {
      color = '#000000'; // default color = black
    }

    this.context.font = '16px sans-serif';
    this.context.textAlign = 'center';
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
    this.context.restore();
  }

  renderText14(text: any, x: any, y: any, color: any) {
    if (color == undefined) {
      color = '#000000'; // default color = black
    }

    this.context.font = '14px sans-serif';

    this.context.textAlign = 'left';
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
    this.context.restore();
  }

  wrapText(
    text: any,
    x: any,
    y: any,
    maxWidth: any,
    lineHeight: any,
    maxLines: any
  ) {
    var input = '';

    try {
      input += text.toString();
    } catch (exception) {
      // console.log('Renderer WrapText() ex: ' + exception.message);
    }

    var words = input.split(" ");

    var line = "";

    var lineNumber = 1;

    for (var n = 0; n < words.length; n++) {

        var testLine = line + words[n] + " ";

        var metrics = this.context.measureText(testLine);

        var testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {

            this.renderText(line, x, y, "#000000");
            //this.context.fillText(line, x, y);

            line = words[n] + " ";

            y += lineHeight;

            lineNumber++;

        } else {

            line = testLine;

        }

        if (lineNumber > maxLines) {
            break;
        }
    }

    this.renderText(line, x, y, "#000000");
  }

  drawImage(src: any, x: any, y: any, width: any, height: any) {
    this.context.drawImage(src, x, y, width, height);
  }
}
