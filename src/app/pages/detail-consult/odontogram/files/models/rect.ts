export class Rect {
  id: any = '';
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  state = 0;
  touching = false;
  statetext = 0;

  cavity() {
    this.state = 1;
  }

  restoration() {
    this.state = 11;
  }

  uncheck() {
    this.state = 0;
  }

  checkCollision(cursX: any, cursY: any) {
    var collision = false;

    if (cursX > this.x) {
      if (cursY > this.y) {
        if (cursX < this.x + this.width) {
          if (cursY < this.y + this.height) {
            collision = true;
          }
        }
      }
    }

    return collision;
  }

  highlight(context: any, settings: any) {
    context.beginPath();
    context.globalAlpha = 0.4;
    context.fillStyle = settings.COLOR_ON_TOUCH;

    context.fillRect(this.x, this.y, this.width, this.height);

    context.globalAlpha = 1;
    context.restore();
  }

  highlightWithColor(
    context: any,
    color: any,
    alpha: any,
    indicador?: any,
    posicion?: any
  ) {
    context.beginPath();
    context.globalAlpha = alpha;
    context.fillStyle = color;

    if (indicador == 'IMP') {
      if (posicion > 10 && posicion < 29) {
          context.fillRect(this.x, this.y - 37, this.width, this.height);
      }
      else if (posicion > 30 && posicion < 49)
      {
          //debugger;
          context.fillRect(this.x, this.y +40, this.width, this.height);
      }
      else {
          context.fillRect(this.x, this.y, this.width, this.height);
      }
  }
  else
  {
      /**/
      context.fillRect(this.x, this.y, this.width, this.height);
  }//jjallo 02122020*/

  context.globalAlpha = 1;
  context.restore();
  }

  outline(
    context: any,
    color: any,
    lineWidth?: any,
    estado?: any,
    indicador?: any,
    posicion?: any,
    id?: any
  ) {
    context.beginPath();
    context.lineWidth = lineWidth == undefined ? 1 : lineWidth;
    context.globalAlpha = 1;
    context.strokeStyle = color;
    context.rect(this.x, this.y, this.width, this.height);
    context.stroke();
    context.restore();

    if (estado == 'TEX') {//cuadrado de textbox
      if (posicion == 1) {
          context.beginPath();
          context.fillStyle = "white";

              if (id > 10 && id < 19)
                  context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              else if (id > 20 && id < 29)
                  context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              else if (id > 50 && id < 56)
                  context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              else if (id > 60 && id < 66)
                  context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              else
                  context.fillRect(this.x + 1, this.y + 19, this.width - 2, this.height - 17);

          context.stroke();
      }
      else if (posicion == 2) {
          context.beginPath();
          context.fillStyle = "white";

          if (id > 10 && id < 19)
              context.fillRect(this.x + 1, this.y +19, this.width - 2, this.height - 17);
              //else
              //context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
          else if (id > 20 && id < 29)
              //context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              context.fillRect(this.x + 1, this.y + 19, this.width - 2, this.height - 17);
          else if (id > 50 && id < 56)
              //context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              context.fillRect(this.x + 1, this.y + 19, this.width - 2, this.height - 17);
          else if (id > 60 && id < 66)
              //context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);
              context.fillRect(this.x + 1, this.y + 19, this.width - 2, this.height - 17);
          else
              context.fillRect(this.x + 1, this.y - 1, this.width - 2, this.height - 17);

          //context.fillRect(this.x + 1, this.y -1, this.width - 2, this.height - 17);
          context.stroke();
      }
      else if (posicion == 3) {
          context.beginPath();
          context.fillStyle = "white";


              if (id > 10 && id < 29)
                  context.fillRect(this.x + 1, this.y + 19, this.width - 2, this.height - 17);
              else if (id > 50 && id < 56)
                  context.fillRect(this.x + 1, this.y + 18, this.width - 2, this.height - 17);
              else if (id > 60 && id < 66)
                  context.fillRect(this.x + 1, this.y + 18, this.width - 2, this.height - 17);
              else
                  context.fillRect(this.x + 1, this.y - 2, this.width - 2, this.height - 17);

          context.stroke();
      }
  }

  if (indicador == 'IMP') {//cuadrad de superficiees
      if (estado == 'T' && (this.id.substring(0, 2) < 29)) {
          context.strokeStyle = "#000000";
          context.lineWidth = 1.5;
          context.lineJoin = 'bevel';
          context.strokeRect(this.x - 14, this.y - 23, this.width + 28, this.height + 26);
      }
      else if (estado == 'T' && (this.id.substring(0, 2) > 50 && this.id.substring(0, 2) < 66)) {
          context.strokeStyle = "#000000";
          context.lineWidth = 1.5;
          context.lineJoin = 'bevel';
          context.strokeRect(this.x - 14, this.y - 23, this.width + 28, this.height + 26);
      }
      else if (estado == 'T' && (this.id.substring(0, 2) > 30 || this.id.substring(0, 2) < 49)) {
          context.strokeStyle = "#000000";
          context.lineWidth = 1.5;
          context.lineJoin = 'bevel';
          context.strokeRect(this.x - 14, this.y - 3, this.width + 28, this.height + 26);
      }
  }
  }

  highlightEllipse(context: any, color: any, alpha: any, padding: any) {
    if (padding == undefined) {
      padding = 0;
    }

    context.beginPath();
    context.globalAlpha = alpha;
    context.fillStyle = color;

    context.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      (this.width - padding) / 2,
      (this.height - padding) / 2,
      0,
      0,
      2 * Math.PI
    );

    context.fill();
    context.globalAlpha = 1;
    context.restore();
  }

  fillColor(context: any, color: any) {
    context.beginPath();
    context.fillStyle = color;

    context.fillRect(this.x, this.y, this.width, this.height);

    context.restore();

    context.stroke();
    context.restore();
  }
}
