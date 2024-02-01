import { Rect } from "./rect";
export class Damage {
  id: any;
  rect = new Rect();
  x: any;
  y: any;
  width: any;
  height: any;
  type: any;
  direction: any;
  state: any;
  statetext: any;
  indicador: any;
  constructor(
    id: any,
    x: any,
    y: any,
    width: any,
    height: any,
    type: any,
    direction: any,
    state: any,
    statetext: any,
    indicador?: any
  ) {
    this.id = id;
    this.rect.x = x;
    this.rect.y = y;
    this.rect.width = width;
    this.rect.height = height;
    this.direction = direction == undefined ? -1 : direction;
    this.state = state == undefined ? 0 : state;
    this.statetext = statetext == undefined ? 0 : statetext;
    this.type = type;
    this.indicador = indicador == undefined ? "" : indicador;
  }

  drawFractura(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

        /*jjallo 11092020*/
        if (/*this.id == 5 &&*/ this.indicador == 'A') {

            //04042023 Inicio
            //context.moveTo(this.rect.x, this.rect.y + this.rect.height);
            //context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height / 2);
          //012024
          context.moveTo(this.rect.x, this.rect.y + this.rect.height);
            context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height / 2);
            //Fin
        }
        else if (/*his.id == 5 &&*/ this.indicador == 'C') {
            //04042023 Inicio
            //context.moveTo(this.rect.x, this.rect.y + this.rect.height - 5);
            //context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height / 2 + 15);
          //012024
          context.moveTo(this.rect.x, this.rect.y + this.rect.height - 5);
            context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height / 2 + 15); 
            //Fin
        }
        else if (/*this.id == 5 &&*/ this.indicador == 'R') {
            //04042023 Inicio
            //context.moveTo(this.rect.x, this.rect.y + this.rect.height - 30);
            //context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height - 65);
          //012024
          context.moveTo(this.rect.x, this.rect.y + this.rect.height - 30);
            context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height - 65);
            //Fin
        }
        /**/
        //context.moveTo(this.rect.x, this.rect.y + this.rect.height);
        //context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height / 2);
    }
    else {

        /*jjallo 11092020*/
        if (/*this.id == 5 &&*/ this.indicador == 'A') {
            context.moveTo(this.rect.x + this.rect.width, this.rect.y);
            context.lineTo(this.rect.x, this.rect.y + this.rect.height / 2);
        }
        else if (/*his.id == 5 &&*/ this.indicador == 'C') {
            context.moveTo(this.rect.x + (this.rect.width - 5), this.rect.y);
            context.lineTo(this.rect.x , this.rect.y + this.rect.height / 2 -20);
        }
        else if (/*this.id == 5 &&*/ this.indicador == 'R') {
            context.moveTo(this.rect.x, this.rect.y + this.rect.height - 30);
            context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height - 65);
        }
        /**/

        //context.moveTo(this.rect.x + this.rect.width, this.rect.y);
        //context.lineTo(this.rect.x, this.rect.y + this.rect.height / 2);
    }

    context.lineWidth = 2;
    // set line color
    context.strokeStyle = settings.COLOR_RED;
    context.stroke();
    context.restore();
  }

  drawDienteAusente(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      context.moveTo(this.rect.x, this.rect.y + this.rect.height);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height * 0.25);

      context.lineWidth = 2;
      context.strokeStyle = settings.COLOR_BLUE;
      context.stroke();
      context.restore();

      context.moveTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height);

      context.lineTo(this.rect.x, this.rect.y + this.rect.height * 0.25);

      context.strokeStyle = settings.COLOR_BLUE;
      context.stroke();


  } else {


      context.moveTo(this.rect.x, this.rect.y);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height * 0.75);

      context.lineWidth = 2;

      context.strokeStyle = settings.COLOR_BLUE;
      context.stroke();
      context.restore();

      context.moveTo(this.rect.x + this.rect.width, this.rect.y);
      context.lineTo(this.rect.x, this.rect.y + this.rect.height * 0.75);

      context.strokeStyle = settings.COLOR_BLUE;
      context.stroke();

  }

  context.restore();
  }

  drawPulpar(context: any, settings: any) {
    context.beginPath();

    //debugger;
    if (this.type === 0) {
        context.moveTo(this.rect.x + this.rect.width / 2,this.rect.y + 20);
        context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y + (this.rect.height / 2) + 13);
    } else {
        context.moveTo(this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - 20);
        context.lineTo(this.rect.x + this.rect.width / 2,this.rect.y + (this.rect.height / 2) - 13);
    }

    context.lineWidth = 3;

    /*04122023
    //04042023 Inicio
    //context.strokeStyle = settings.COLOR_BLUE;
    if (this.state === 0) {
        context.strokeStyle = settings.COLOR_BLUE;
        sessionStorage.setItem("damages", 0);
    }
    else {
        context.strokeStyle = settings.COLOR_RED;
        sessionStorage.setItem("damages", 1);
    }
    //Fin
    */

    if (this.indicador == 0) context.strokeStyle = settings.COLOR_BLUE; else context.strokeStyle = settings.COLOR_RED;//jjallo 11092020


    context.stroke();
    context.restore();
  }

  drawMigracion(context: any, settings: any) {
    context.beginPath();

    var spacer = 5;

    var xIni = this.rect.x + (this.direction == 0 ? spacer : (this.rect.width - spacer));
    var xFin = xIni + (this.direction == 0 ? 4 : (-4));

    if (this.type === 0) {

        // draw line
        context.moveTo(this.rect.x + spacer, this.rect.y - 5);
        context.lineTo(this.rect.x + this.rect.width - spacer, this.rect.y - 5);

        // upper point
        context.moveTo(xIni, this.rect.y - 5);
        context.lineTo(xFin, this.rect.y - 10);

        // lower point
        context.moveTo(xIni, this.rect.y - 5);
        context.lineTo(xFin, this.rect.y);

    } else {

        // draw line
        context.moveTo(this.rect.x + spacer,
                this.rect.y + this.rect.height + 5);

        context.lineTo(this.rect.x + this.rect.width - spacer,
                this.rect.y + this.rect.height + 5);

        // upper point
        context.moveTo(xIni,
                this.rect.y + this.rect.height + 5);

        context.lineTo(xFin,
                this.rect.y + this.rect.height + 10);

        // upper point
        context.moveTo(xIni,
                this.rect.y + this.rect.height + 5);

        context.lineTo(xFin,
                this.rect.y + this.rect.height);

    }

    context.lineWidth = 2;


    context.strokeStyle = settings.COLOR_BLUE;

    context.stroke();
    context.restore();
  }

  drawOrtondicoRemovible(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      // draw ZigZag
      context.moveTo(this.rect.x, this.rect.y);
      context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y - 10);
      context.lineTo(this.rect.x + this.rect.width, this.rect.y);

  } else {

      // draw ZigZag
      context.moveTo(this.rect.x, this.rect.y + this.rect.height);

      context.lineTo(this.rect.x + this.rect.width / 2,
                     this.rect.y + this.rect.height + 10);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height);

  }

  context.lineWidth = 2;

  //context.strokeStyle = settings.COLOR_BLUE;

  /*INICIO JJALLO*/
  if (this.state === 0)
      context.strokeStyle = settings.COLOR_BLUE;
  else
      context.strokeStyle = settings.COLOR_RED;
  /*FIN JJALLO*/

  context.stroke();
  context.restore();
  }

  drawDienteExtruido(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {
      context.moveTo(this.rect.x + 10, this.rect.y - 10);
      context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y - 15);
      context.lineTo(this.rect.x + this.rect.width - 10, this.rect.y - 10);
      context.moveTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y - 15);
      context.lineTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y);
  } else {
      context.moveTo(this.rect.x + 10, this.rect.y + this.rect.height + 10);
      context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height + 15);
      context.lineTo(this.rect.x + this.rect.width - 10, this.rect.y + this.rect.height + 10);
      context.moveTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y + this.rect.height + 10);
      context.lineTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y + this.rect.height);
  }

  context.lineWidth = 3;
  context.strokeStyle = settings.COLOR_BLUE;
  context.fillStyle = settings.COLOR_BLUE;
  context.stroke();
  context.fill();
  context.restore();
  }

  drawDienteIntruido(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {
      context.moveTo(this.rect.x + 10, this.rect.y - 5);
      context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y);
      context.lineTo(this.rect.x + this.rect.width - 10, this.rect.y - 5);
      context.moveTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y);
      context.lineTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y - 15);
  } else {
      context.moveTo(this.rect.x + 10, this.rect.y + this.rect.height + 5);
      context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height);
      context.lineTo(this.rect.x + this.rect.width - 10, this.rect.y + this.rect.height + 5);
      context.moveTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y + this.rect.height + 5);
      context.lineTo(this.rect.x + this.rect.width / 2 - 1, this.rect.y + this.rect.height + 15);
  }

  context.lineWidth = 3;
  context.strokeStyle = settings.COLOR_BLUE;
  context.fillStyle = settings.COLOR_BLUE;
  context.stroke();
  context.fill();
  context.restore();
  }

  drawProtesisRemovible(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      // draw lower line
      context.moveTo(this.rect.x, this.rect.y);
      context.lineTo(this.rect.x + this.rect.width, this.rect.y);

      // draw upper line
      context.moveTo(this.rect.x, this.rect.y - 10);
      context.lineTo(this.rect.x + this.rect.width, this.rect.y - 10);

  } else {

      // draw lower line
      context.moveTo(this.rect.x, this.rect.y + this.rect.height);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height);

      // draw upper line
      context.moveTo(this.rect.x, this.rect.y + this.rect.height + 10);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height + 10);
  }

  context.lineWidth = 3;

  // set line color
 // context.strokeStyle = settings.COLOR_BLUE;
 // context.fillStyle = settings.COLOR_BLUE;

  /*INICIO JJALLO*/
  if (this.state === 0) {
      context.strokeStyle = settings.COLOR_BLUE;
      context.fillStyle = settings.COLOR_BLUE;
  }
  else {
      context.strokeStyle = settings.COLOR_RED;
      context.fillStyle = settings.COLOR_RED;
  }
  /*FIN JJALLO*/

  context.stroke();
  context.fill();
  context.restore();
  }

  drawRemanenteRadicular(
    context: any,
    settings: any,
    indicador: any,
    posicion: any
  ) {
    if (indicador == 'IMP')
        this.rect.highlightWithColor(context, "#ffffff", 1, indicador, posicion);
    else
        this.rect.highlightWithColor(context, "#ffffff", 1);

    context.textAlign = "center";
    context.fillStyle = settings.COLOR_RED;

    if (indicador == 'IMP') {
        if (posicion > 10 && posicion < 29) {
            context.fillText("RR", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) - 37);
        }
        else if (posicion > 30 && posicion < 49) {
            context.fillText("RR", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 40);
        }
        else if (posicion > 50 && posicion < 66) {
            context.fillText("RR", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 3);
        }
        else {
            context.fillText("RR", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height - 4);
        }
    }
    else {
        context.fillText("RR", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height - 4);
        //context.restore();
    }
    context.restore();
    //Fin

    //context.beginPath();
    //context.fillStyle = settings.COLOR_RED;
    //context.textAlign = 'center';
    //context.font = "20px Arial Bold";
    //if (this.type === 0) {
    //    context.fillText("RR", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
    //} else {
    //    context.fillText("RR", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
    //}
    //context.restore();
    //context.font = "12px Arial";
  }

  drawGiroversion(context: any, settings: any) {
    context.beginPath();

    var cx = this.rect.x + this.rect.width / 2;
    var cy = this.rect.y;
    var radius = (this.rect.width - 10) / 2;

    var xIni = this.rect.x + (this.direction == 0 ? 3 : (this.rect.width - 3));
    var xFin = xIni + (this.direction == 0 ? 8 : (-8));

    if (this.type === 0) {

        // half circle
        context.arc(cx, cy, radius, Math.PI, 2 * Math.PI, false);

        context.moveTo(xIni, this.rect.y);
        context.lineTo(xFin, this.rect.y);

        context.moveTo(xIni, this.rect.y);
        context.lineTo(xIni, this.rect.y - 8);

    } else {
        cy = this.rect.y + this.rect.height;
        // draw lower line
        context.arc(cx, cy, radius, Math.PI, 2 * Math.PI, true);

        context.moveTo(xIni, this.rect.y + this.rect.height);
        context.lineTo(xFin, this.rect.y + this.rect.height);

        context.moveTo(xIni, this.rect.y + this.rect.height);
        context.lineTo(xIni, this.rect.y + this.rect.height + 8);
    }


    context.lineWidth = 2;

    context.strokeStyle = settings.COLOR_BLUE;

    context.stroke();
    context.restore();
  }

  drawPernoMunon(context: any, settings: any) {
    context.beginPath();

    var diff = 26;
    var size = this.rect.width - diff;

    if (this.type === 0) {
        // draw rectangle
        context.rect(this.rect.x + (diff / 2),this.rect.y + this.rect.height - (size / 2) - size,size,size);
        // draw line
        context.moveTo(this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - (size / 2) - size);
        context.lineTo(this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - (size / 2) - 50);
    } else {
        // draw rectangle
        context.rect(this.rect.x + (diff / 2),this.rect.y + (size / 2), size, size);
        // draw line
        context.moveTo(this.rect.x + this.rect.width / 2,this.rect.y + (size / 2) + size);
        context.lineTo(this.rect.x + this.rect.width / 2,this.rect.y + (size / 2) + 50);
    }

    context.lineWidth = 2;
   // context.strokeStyle = settings.COLOR_BLUE;
    /*INICIO JJALLO*/
    if (this.state === 0) {
        context.strokeStyle = settings.COLOR_BLUE;
    }
    else {
        context.strokeStyle = settings.COLOR_RED;
    }
    /*FIN JJALLO*/

    context.stroke();
    context.restore();
  }

  drawDienteEnErupcion(context: any, settings: any) {
    context.beginPath();

    var pad = 2;

    if (this.type === 0) {
        // draw arrow head
        context.moveTo(this.rect.x + pad, this.rect.y + this.rect.height - 6);

        context.lineTo(this.rect.x + this.rect.width / 2,
                       this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + this.rect.width - pad,
                       this.rect.y + this.rect.height - 6);

        // draw zig zag
        context.moveTo(this.rect.x + this.rect.width / 2,
                       this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + this.rect.width / 2,
                       this.rect.y + this.rect.height - 6);

        context.lineTo(this.rect.x + pad * 3,
                       this.rect.y + this.rect.height - 12);

        context.lineTo(this.rect.x + this.rect.width - pad * 3,
                       this.rect.y + this.rect.height - 24);

        context.lineTo(this.rect.x + pad * 3,
                       this.rect.y + this.rect.height - 36);

        context.lineTo(this.rect.x + this.rect.width - pad * 3,
                       this.rect.y + this.rect.height - 48);

        context.lineTo(this.rect.x + pad * 3,
                       this.rect.y + this.rect.height - 60);

    } else {
        // draw arrow head
        context.moveTo(this.rect.x + pad, this.rect.y + 6);
        context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y);
        context.lineTo(this.rect.x + this.rect.width - pad, this.rect.y + 6);

        // draw zig zag
        context.moveTo(this.rect.x + this.rect.width / 2, this.rect.y);
        context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y + 6);
        context.lineTo(this.rect.x + this.rect.width - pad * 3, this.rect.y + 12);
        context.lineTo(this.rect.x + pad * 3, this.rect.y + 24);
        context.lineTo(this.rect.x + this.rect.width - pad * 3, this.rect.y + 36);
        context.lineTo(this.rect.x + pad * 3, this.rect.y + 48);
        context.lineTo(this.rect.x + this.rect.width - pad * 3, this.rect.y + 60);
    }

    context.lineWidth = 3;

    context.strokeStyle = settings.COLOR_BLUE;

    context.stroke();
    context.restore();
  }

  drawProtesisTotal(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {
      //context.moveTo(this.rect.x, this.rect.y + this.rect.height - 10);
      //context.lineTo(this.rect.x + this.rect.width,this.rect.y + this.rect.height - 10);
      //context.moveTo(this.rect.x, this.rect.y + this.rect.height - 15);
      //context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height - 15);
      //012024
        context.moveTo(this.rect.x, this.rect.y + this.rect.height - 10);
        context.lineTo(this.rect.x + this.rect.width,this.rect.y + this.rect.height - 10);
        context.moveTo(this.rect.x, this.rect.y + this.rect.height - 15);
        context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height - 15);

  } else {
      //context.moveTo(this.rect.x, this.rect.y + 10);
      //context.lineTo(this.rect.x + this.rect.width, this.rect.y + 10);
      //context.moveTo(this.rect.x, this.rect.y + 15);
      //context.lineTo(this.rect.x + this.rect.width, this.rect.y + 15);
      //012024
        context.moveTo(this.rect.x, this.rect.y + 10);
        context.lineTo(this.rect.x + this.rect.width, this.rect.y + 10);
        context.moveTo(this.rect.x, this.rect.y + 15);
        context.lineTo(this.rect.x + this.rect.width, this.rect.y + 15);
  }
  //Fin

  context.lineWidth = 2;
  // set line color
  //context.strokeStyle = settings.COLOR_BLUE;

  /*INICIO JJALLO*/
  if (this.state === 0)
      context.strokeStyle = settings.COLOR_BLUE;
  else
      context.strokeStyle = settings.COLOR_RED;
  /*FIN JJALLO*/

  context.stroke();
  context.restore();
  }

  drawEdentuloTotal(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      context.moveTo(this.rect.x, this.rect.y + this.rect.height - 20);

      context.lineTo(this.rect.x + this.rect.width,
                     this.rect.y + this.rect.height - 20);

  } else {

      context.moveTo(this.rect.x, this.rect.y + 20);
      context.lineTo(this.rect.x + this.rect.width, this.rect.y + 20);
  }

  context.lineWidth = 3;
  // set line color
  context.strokeStyle = settings.COLOR_BLUE;
  context.stroke();
  context.restore();
  }

  drawDienteEnClavija(context: any, settings: any) {
    context.beginPath();
    var space = 40;

    context.lineWidth = 3;

    context.strokeStyle = settings.COLOR_BLUE;

    if (this.type === 0) {
        context.moveTo(this.rect.x, this.rect.y + this.rect.height);
        context.lineTo(this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - 30);
        context.lineTo(this.rect.x + this.rect.width, this.rect.y + this.rect.height);
        context.closePath();
    } else {
        context.moveTo(this.rect.x, this.rect.y);
        context.lineTo(this.rect.x + this.rect.width / 2, this.rect.y + 30);
        context.lineTo(this.rect.x + this.rect.width, this.rect.y);
        context.closePath();
    }

    context.stroke();
    context.restore();
  }

  drawFusion(context: any, settings: any) {
    var cx = this.rect.x + this.rect.width / 2;

    var radius = (this.rect.width + 5) / 2;

    context.beginPath();

    if (this.type === 0) {
        var cy = this.rect.y + this.rect.height * 3 / 4;

    } else {
        var cy = this.rect.y + 10;
    }

    context.ellipse(cx, cy, radius, radius - 15, 0, 0, 2 * Math.PI);

    context.lineWidth = 2;
    // set line color
    context.strokeStyle = settings.COLOR_BLUE;
    context.stroke();
    context.restore();
  }

  drawCoronaDefinitiva(context: any, settings: any) {
    var cx = this.rect.x + this.rect.width / 2;
    var cy = 0;

    var radius = (settings.RECT_DIMEN * 3) / 2;
    context.beginPath();

    if (this.type === 0) {
        //cy = this.rect.y + 16;
        /*jjallo 11092020*/
        cx = cx - 17;
        cy = (this.rect.y + 16) + 72;
        /**/
    } else {
        //cy = this.rect.y + this.rect.height - 16;
        /*jjallo 11092020*/
        cx = cx - 17;
        cy = (this.rect.y + this.rect.height - 16) - 105;
        /**/
    }

    //context.ellipse(cx, cy, radius, radius, 0, 0, 2 * Math.PI);
    context.rect(cx, cy, 34, 33);//jjallo 11092020

    context.lineWidth = 2;
    // set line color

    //context.strokeStyle = settings.COLOR_BLUE;
    if (this.indicador == 0) context.strokeStyle = settings.COLOR_BLUE; else context.strokeStyle = settings.COLOR_RED;//jjallo 11092020

    context.stroke();
    context.restore();
  }

  drawCoronaTemporal(context: any, settings: any, indicador: any, posicion: any) {
    context.beginPath();
    context.fillStyle = settings.COLOR_RED;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";

    var cx = this.rect.x + this.rect.width / 2;
    var cy = 0;
    var radius = (settings.RECT_DIMEN * 3) / 2;
    context.beginPath();

    if (this.type === 0) {
        cx = cx - 17;
        cy = (this.rect.y + 16) + 115;
    } else {
        cx = cx - 17;
        cy = (this.rect.y + this.rect.height - 16) - 148;
    }

    if (indicador == 'IMP') {
       if (posicion > 10 && posicion < 29) {
           context.rect(cx, cy + 20, 34, 33);
       }
       else if (posicion > 30 && posicion < 49) {
           context.rect(cx, cy - 20, 34, 33);
       }
       else {
           context.rect(cx, cy, 34, 33);
       }
    }
    else {
        context.rect(cx, cy, 34, 33);
    }

    context.lineWidth = 2;
    context.strokeStyle = settings.COLOR_RED;
    context.stroke();
    context.restore();
  }

  drawDiastema(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      context.lineWidth = 2;
      // set line color
      context.strokeStyle = settings.COLOR_BLUE;

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2 + 15,
              this.rect.y + this.rect.height / 2 + this.rect.height / 4,
              13,
              Math.PI * 0.5, // 90 degress
              Math.PI * 1.5, // 270 degrees
              false);

      context.stroke();

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2 - 15,
              this.rect.y + this.rect.height / 2 + this.rect.height / 4,
              13,
              Math.PI * 0.5, // 90 degress
              Math.PI * 1.5, // 270 degrees
              true);

      context.stroke();

  } else {

      context.lineWidth = 2;
      // set line color
      context.strokeStyle = settings.COLOR_BLUE;

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2 + 15,
              this.rect.y + this.rect.height / 4,
              13,
              Math.PI * 0.5, // 90 degress
              Math.PI * 1.5, // 270 degrees
              false);

      context.stroke();

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2 - 15,
              this.rect.y + this.rect.height / 4,
              13,
              Math.PI * 0.5, // 90 degress
              Math.PI * 1.5, // 270 degrees
              true);

      context.stroke();
  }

  context.restore();
  }

  drawSuperNumerario(context: any, settings: any) {
    context.beginPath();

    if (this.type === 0) {

      context.lineWidth = 2;
      // set line color
      context.strokeStyle = settings.COLOR_BLUE;

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2,
              this.rect.y + 20,
              10,
              0, // 0 degress
              Math.PI * 2, // 360 degrees
              false);

      context.stroke();

      context.textAlign = 'center';
      context.fillStyle = settings.COLOR_BLUE;
      context.font = "16px Arial Bold";
      context.fillText("S", this.rect.x + this.rect.width / 2, this.rect.y + 25);

      context.restore();

  } else {

      context.lineWidth = 2;
      // set line color
      context.strokeStyle = settings.COLOR_BLUE;

      context.beginPath();

      context.arc(this.rect.x + this.rect.width / 2,
              this.rect.y + this.rect.height - 20,
              10,
              0, // 0 degress
              Math.PI * 2, // 360 degrees
              false);

      context.stroke();

      context.textAlign = 'center';
      context.fillStyle = settings.COLOR_BLUE;
      context.font = "16px Arial Bold";

      context.fillText("S", this.rect.x + this.rect.width / 2,
                       this.rect.y + this.rect.height - 15);

      context.restore();
  }

  context.restore();
  }

  drawOrtodonticoFijoEnd(context: any, settings: any) {
    context.beginPath();
    context.lineWidth = 2;
    // set line color
   // context.strokeStyle = settings.COLOR_BLUE;

    /*INICIO JJALLO*/
    if (this.state === 0)
        context.strokeStyle = settings.COLOR_BLUE;
    else
        context.strokeStyle = settings.COLOR_RED;
    /*FIN JJALLO*/

    if (this.type === 0) {

        context.rect(this.rect.x + 10,
                this.rect.y - this.rect.width + 20,
                this.rect.width - 20,
                this.rect.width - 20);

        context.stroke();

        context.beginPath();

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y - this.rect.width + 25);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y - 5);

        context.stroke();

        context.moveTo(this.rect.x + 15,
                this.rect.y - ((this.rect.width - 20) / 2));

        context.lineTo(this.rect.x + this.rect.width - 15,
                this.rect.y - ((this.rect.width - 20) / 2));

        context.stroke();

    } else {


        context.rect(this.rect.x + 10,
                this.rect.y + this.rect.height,
                this.rect.width - 20,
                this.rect.width - 20);

        context.stroke();

        context.beginPath();

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height + 5);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height + this.rect.width - 25);

        context.stroke();

        context.moveTo(this.rect.x + 15,
                this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));

        context.lineTo(this.rect.x + this.rect.width - 15,
                this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));

        context.stroke();

    }

    context.restore();
  }

  drawOrtodonticoFijoCenter(context: any, settings: any) {
    context.beginPath();
    context.lineWidth = 2;
    // set line color
    //context.strokeStyle = settings.COLOR_BLUE;

    /*INICIO JJALLO*/
    if (this.state === 0)
        context.strokeStyle = settings.COLOR_BLUE;
    else
        context.strokeStyle = settings.COLOR_RED;
    /*FIN JJALLO*/

    if (this.type === 0) {

        context.beginPath();
        context.moveTo(this.rect.x - 10,this.rect.y - ((this.rect.width - 20) / 2));

        //29112023
        //context.lineTo(this.rect.x + this.rect.width + 10, this.rect.y - ((this.rect.width - 20) / 2));
        if (this.indicador === 1)
            context.lineTo(this.rect.x + this.rect.width -30, this.rect.y - ((this.rect.width - 20) / 2));
        else
            context.lineTo(this.rect.x + this.rect.width + 10, this.rect.y - ((this.rect.width - 20) / 2));
        //

        context.stroke();

    } else {

        context.beginPath();
        context.moveTo(this.rect.x - 10, this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));

        //29112023
        //context.lineTo(this.rect.x + this.rect.width +10, this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));
        if (this.indicador === 1)
            context.lineTo(this.rect.x + this.rect.width -30, this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));
        else
            context.lineTo(this.rect.x + this.rect.width +10, this.rect.y + this.rect.height + ((this.rect.width - 20) / 2));
        //

        context.stroke();

    }


    context.restore();
  }

  drawProtesisFijaRight(context: any, settings: any) {
    context.beginPath();

    context.lineWidth = 2;
    // set line color
    //context.strokeStyle = settings.COLOR_BLUE;

    /*INICIO JJALLO*/
    if (this.state === 0)
        context.strokeStyle = settings.COLOR_BLUE;
    else
        context.strokeStyle = settings.COLOR_RED;
    /*FIN JJALLO*/

    if (this.type === 0) {

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y - 15);

        context.lineTo(this.rect.x + this.rect.width,
                this.rect.y - 15);

    } else {

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height + 15);

        context.lineTo(this.rect.x + this.rect.width,
                this.rect.y + this.rect.height + 15);

    }

    context.stroke();
    context.restore();
  }

  drawProtesisFijaCenter(context: any, settings: any) {
    context.beginPath();

    context.lineWidth = 2;
    // set line color
    //context.strokeStyle = settings.COLOR_BLUE;

    /*INICIO JJALLO*/
    if (this.state === 0)
        context.strokeStyle = settings.COLOR_BLUE;
    else
        context.strokeStyle = settings.COLOR_RED;
    /*FIN JJALLO*/

    if (this.type === 0) {

        context.moveTo(this.rect.x,
                this.rect.y - 15);

        context.lineTo(this.rect.x + this.rect.width,
                this.rect.y - 15);

    } else {

        context.moveTo(this.rect.x,
                this.rect.y + this.rect.height + 15);

        context.lineTo(this.rect.x + this.rect.width,
                this.rect.y + this.rect.height + 15);

    }

    context.stroke();
    context.restore();
  }

  drawProtesisFijaLeft(context: any, settings: any) {
    context.beginPath();

    context.lineWidth = 2;
    // set line color
   // context.strokeStyle = settings.COLOR_BLUE;

    /*INICIO JJALLO*/
    if (this.state === 0)
        context.strokeStyle = settings.COLOR_BLUE;
    else
        context.strokeStyle = settings.COLOR_RED;
    /*FIN JJALLO*/

    if (this.type === 0) {

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y - 15);

        context.lineTo(this.rect.x,
                this.rect.y - 15);
    } else {

        context.moveTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + this.rect.width / 2,
                this.rect.y + this.rect.height + 15);

        context.lineTo(this.rect.x,
                this.rect.y + this.rect.height + 15);

    }

    context.stroke();
    context.restore();
  }

  drawTransposicionLeft(context: any, settings: any) {
    context.beginPath();

    var cx = this.rect.x + this.rect.width * 0.75;
    var cy = this.rect.y;
    var radiusX = (this.rect.width) / 2;
    var radiusY = 10;

    if (this.type === 0) {

        // half circle
        context.ellipse(cx, cy, radiusX, radiusY, 0, Math.PI, 2 * Math.PI, false);

        context.moveTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y);

        context.lineTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y - 8);

        context.moveTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y);

        context.lineTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2) - 8,
                this.rect.y);

    } else {

        cy = this.rect.y + this.rect.height;

        // half circle
        context.ellipse(cx, cy, radiusX, radiusY, 0, Math.PI, 2 * Math.PI, true);

        context.moveTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y + this.rect.height + 8);

        context.moveTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2),
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + (this.rect.width * 0.75) + (this.rect.width / 2) - 8,
                this.rect.y + this.rect.height);
    }

    context.lineWidth = 2;

    context.strokeStyle = settings.COLOR_BLUE;

    context.stroke();

    context.restore();
  }

  drawTransposicionRight(context: any, settings: any) {
    context.beginPath();

    var cx = this.rect.x + this.rect.width * 0.25;
    var cy = this.rect.y;
    var radiusX = (this.rect.width) / 2;
    var radiusY = 10;

    if (this.type === 0) {

        // half circle
        context.ellipse(cx, cy, radiusX, radiusY, 0, Math.PI, 2 * Math.PI, false);

        context.moveTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y);

        context.lineTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y - 8);

        context.moveTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y);

        context.lineTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2) + 8,
                this.rect.y);

    } else {

        cy = this.rect.y + this.rect.height;

        // half circle
        context.ellipse(cx, cy, radiusX, radiusY, 0, Math.PI, 2 * Math.PI, true);

        context.moveTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y + this.rect.height + 8);

        context.moveTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2),
                this.rect.y + this.rect.height);

        context.lineTo(this.rect.x + (this.rect.width * 0.25) - (this.rect.width / 2) + 8,
                this.rect.y + this.rect.height);
    }

    context.lineWidth = 2;

    context.strokeStyle = settings.COLOR_BLUE;

    context.stroke();
    context.restore();
  }

  drawDienteDiscomico(
    context: any,
    settings: any,
    indicador: any,
    posicion: any
  ) {
    if (indicador == 'IMP')
        this.rect.highlightWithColor(context, "#ffffff", 1, indicador, posicion);//jjallo 02122020
    else
        this.rect.highlightWithColor(context, "#ffffff", 1);
    /**/

    context.textAlign = "center";
    context.fillStyle = settings.COLOR_BLUE;

    /*jjallo 02122020*/
    if (indicador == 'IMP') {
        if (posicion > 10 && posicion < 29) {
            context.fillText("DIS", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) - 37);
        }
        else if (posicion > 30 && posicion < 49) {
            //debugger;
            context.fillText("DIS", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 40);
        }
        else if (posicion > 50 && posicion < 66) {
            context.fillText("DIS", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 3);
        }
        else {
            context.fillText("DIS", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height - 4);
        }
    }
    else {
        /**/

            context.fillText("DIS", this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - 4);
            //context.restore();

    }//jjallo 02122020
    context.restore();
  }

  drawDienteEctopico(
    context: any,
    settings: any
  ) {
    context.beginPath();
    context.fillStyle = settings.COLOR_BLUE;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawImpactacion(context: any, settings: any) {
    context.beginPath();
    context.fillStyle = settings.COLOR_RED;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawFosasProfundas(
    context: any,
    settings: any
  ) {
    context.beginPath();
    context.fillStyle = settings.COLOR_BLUE;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawGeminacion(context: any, settings: any) {
    var cx = this.rect.x + this.rect.width / 2;
    var radius = (this.rect.width + 5) / 2;
    context.beginPath();

    if (this.type === 0) {
        var cy = this.rect.y + this.rect.height * 3 / 4 + 67;

    } else {
        var cy = this.rect.y + 10 - 60;
    }

    context.ellipse(cx, cy, radius, radius - 15, 0, 0, 2 * Math.PI);
    context.lineWidth = 2;
    context.strokeStyle = settings.COLOR_BLUE;
    context.stroke();
    context.restore();
  }

  drawImplante(context: any, settings: any) {
    context.beginPath();
    context.fillStyle = settings.COLOR_RED;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawMacrodoncia(context: any, settings: any) {
    context.beginPath();
    context.fillStyle = settings.COLOR_BLUE;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawMicrodonica(context: any, settings: any) {
    context.beginPath();
    context.fillStyle = settings.COLOR_BLUE;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  drawSemiImpactacion(
    context: any,
    settings: any,
    indicador: any,
    posicion: any
  ) {
    if (indicador == 'IMP')
        this.rect.highlightWithColor(context, "#ffffff", 1, indicador, posicion);//jjallo 02122020
    else
        this.rect.highlightWithColor(context, "#ffffff", 1);
    /**/

    context.textAlign = "center";
    context.fillStyle = settings.COLOR_BLUE;

    /*jjallo 02122020*/
    if (indicador == 'IMP') {
        if (posicion > 10 && posicion < 29) {
            context.fillText("SI", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) - 37);
        }
        else if (posicion > 30 && posicion < 49) {
            //debugger;
            context.fillText("SI", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 40);
        }
        else if (posicion > 50 && posicion < 66) {
            context.fillText("SI", this.rect.x + this.rect.width / 2, (this.rect.y + this.rect.height - 4) + 3);
        }
        else {
            context.fillText("SI", this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height - 4);
        }
    }
    else {
        /**/

            context.fillText("SI", this.rect.x + this.rect.width / 2,this.rect.y + this.rect.height - 4);
            //context.restore();

    }//jjallo 02122020
    context.restore();
  }

  drawSuperficieDesgastada(
    context: any,
    settings: any
  ) {
    context.beginPath();
    context.fillStyle = settings.COLOR_RED;
    context.textAlign = 'center';
    context.font = "20px Arial Bold";
    context.restore();
    context.font = "12px Arial";
  }

  render(
    context: any,
    settings: any,
    constants: any,
    indicador: any,
    posicion: any
  ) {
    if (this.id === constants.FRACTURA) {
      this.drawFractura(context, settings);
  }

  if (this.id === constants.DIENTE_AUSENTE) {
      this.drawDienteAusente(context, settings);
  }

  if (this.id === constants.PULPAR) {
      this.drawPulpar(context, settings);
  }

  if (this.id === constants.MIGRACION) {
      this.drawMigracion(context, settings);
  }

  if (this.id === constants.ORTONDICO_REMOVIBLE) {
      this.drawOrtondicoRemovible(context, settings);
  }

  if (this.id === constants.DIENTE_EXTRUIDO) {
      this.drawDienteExtruido(context, settings);
  }

  if (this.id === constants.DIENTE_INTRUIDO) {
      this.drawDienteIntruido(context, settings);
  }

  if (this.id === constants.PROTESIS_REMOVIBLE) {
      this.drawProtesisRemovible(context, settings);
  }

  if (this.id === constants.REMANENTE_RADICULAR) {
      //this.drawRemanenteRadicular(context, settings);
      this.drawRemanenteRadicular(context, settings, indicador, posicion);//jjallo 02122020
  }

  if (this.id === constants.GIROVERSION) {
      this.drawGiroversion(context, settings);
  }

  if (this.id === constants.PERNO_MUNON) {
      this.drawPernoMunon(context, settings);
  }

  if (this.id === constants.DIENTE_EN_ERUPCION) {
      this.drawDienteEnErupcion(context, settings);
  }

  if (this.id === constants.PROTESIS_TOTAL) {
      this.drawProtesisTotal(context, settings);
  }

  if (this.id === constants.EDENTULOA_TOTAL) {
      this.drawEdentuloTotal(context, settings);
  }

  if (this.id === constants.DIENTE_EN_CLAVIJA) {
      this.drawDienteEnClavija(context, settings);
  }

  if (this.id === constants.FUSION) {
      this.drawFusion(context, settings);
  }

  if (this.id === constants.CORONA_DEFINITIVA) {
      this.drawCoronaDefinitiva(context, settings);
  }

  if (this.id === constants.CORONA_TEMPORAL) {
      // this.drawCoronaTemporal(context, settings);//06122023
      this.drawCoronaTemporal(context, settings, indicador, posicion);//comentado 06122023
  }

  if (this.id === constants.DIASTEMA) {
      this.drawDiastema(context, settings);
  }

  if (this.id === constants.SUPER_NUMERARIO) {
      this.drawSuperNumerario(context, settings);
  }

  if (this.id === constants.ORTODONTICO_FIJO_END) {
      this.drawOrtodonticoFijoEnd(context, settings);
  }

  if (this.id === constants.ORTODONTICO_FIJO_CENTER) {
      this.drawOrtodonticoFijoCenter(context, settings);
  }

  if (this.id === constants.PROTESIS_FIJA_RIGHT) {
      this.drawProtesisFijaRight(context, settings);
  }

  if (this.id === constants.PROTESIS_FIJA_CENTER) {
      this.drawProtesisFijaCenter(context, settings);
  }

  if (this.id === constants.PROTESIS_FIJA_LEFT) {
      this.drawProtesisFijaLeft(context, settings);
  }

  if (this.id === constants.TRANSPOSICION_LEFT) {
      this.drawTransposicionLeft(context, settings);
  }

  if (this.id === constants.TRANSPOSICION_RIGHT) {
      this.drawTransposicionRight(context, settings);
  }

  if (this.id === constants.DIENTE_DISCR0MICO) {
      //this.drawDienteDiscomico(context, settings);
      this.drawDienteDiscomico(context, settings, indicador, posicion);//jjallo 02122020
  }

  if (this.id === constants.IMPACTACION) {
      this.drawImpactacion(context, settings);//06122023
      //this.drawImpactacion(context, settings, indicador, posicion);//comentado 06122023
  }

  /*jjallo 11092020*/
  if (this.id === constants.FOSAS_PROFUNDAS) {
      this.drawFosasProfundas(context, settings);//06122023
      //this.drawFosasProfundas(context, settings, indicador, posicion);//comentado 06122023
  }
  if (this.id === constants.GEMINACION) {
      this.drawGeminacion(context, settings);
  }
  //if (this.id === constants.MOVILIDAD_PATOLOGICA) {
  //    this.drawMovilidad_Patologica(context, settings);
  //}
  /**/

  if (this.id === constants.DIENTE_ECTOPICO) {
      this.drawDienteEctopico(context, settings);//06122023
      //this.drawDienteEctopico(context, settings, indicador, posicion);//comentado 06122023
  }

  if (this.id === constants.IMPLANTE) {
      this.drawImplante(context, settings);//05122023
      //this.drawImplante(context, settings,indicador, posicion);//jjallo 02122020
  }

  if (this.id === constants.MACRODONCIA) {
      this.drawMacrodoncia(context, settings);//06122023
      //this.drawMacrodoncia(context, settings, indicador, posicion);//comentado 06122023
  }

  if (this.id === constants.MICRODONCIA) {
      this.drawMicrodonica(context, settings);
      //this.drawMicrodonica(context, settings, indicador, posicion);//comentario 06122023
  }

  if (this.id === constants.SEMI_IMPACTACI0N) {
      //this.drawSemiImpactaion(context, settings);
      this.drawSemiImpactacion(context, settings, indicador, posicion);//jjallo 02122020
  }

  if (this.id === constants.SUPERFICIE_DESGASTADA) {
      this.drawSuperficieDesgastada(context, settings);//06122023
      //this.drawSuperficieDesgastada(context, settings, indicador, posicion);//comentario 06122023
  }

  if (settings.DEBUG) {
      this.rect.highlight(context, settings);
  }

  }
}
