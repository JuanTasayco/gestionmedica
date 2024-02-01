import { Rect } from './rect';
export class TextBox {
  text = '';
  rect = new Rect();
  touching = false;
  label: any;
  enumerador: any;
  statetext: any;
  state: any;
  state2: any;
  state3: any;

  setDimens(x: any, y: any, width: any, height: any, enumerador: any) {
    this.rect.x = x;
    this.rect.y = y;
    this.rect.width = width;
    this.rect.height = height;
    this.text = '';
    this.label = '';
    this.enumerador = enumerador;
  }

  setText(text: any) {
    this.text = text;
  }

  setLabel(label: any) {
    this.label = label;
  }

  drawLabel(context: any, indicador: any, posicion: any, id: any) {
    if (indicador == 'IMP') {
      this.rect.outline(
        context,
        '#000000',
        undefined,
        'TEX',
        undefined,
        posicion,
        id
      );
    } else {
      this.rect.outline(context, '#000000');
    }

    context.beginPath();

    context.textAlign = 'center';
    context.fillStyle = '#9a9a9a';
    context.font = '11px Arial';

    context.fillText(
      this.label,
      this.rect.x + this.rect.width / 2,
      this.rect.y + this.rect.height - 4
    );

    context.stroke();

    context.restore();
  }

  drawText(
    context: any,
    color: any,
    estado: any,
    indicador: any,
    posicion: any,
    id: any
  ) {
    context.beginPath();

    if (this.text !== '') {
      context.fillStyle = '#ffffff';
      context.fillRect(
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    }

    this.rect.outline(
      context,
      '#000000',
      undefined,
      estado,
      indicador,
      posicion,
      id
    );

    context.textAlign = 'center';
    context.fillStyle = color;
    context.font = '13px Arial';
    context.fillText(
      this.text,
      this.rect.x + this.rect.width / 2,
      this.rect.y + this.rect.height - 4
    );
    context.stroke();
    context.restore();
  }

  render(
    context: any,
    color: any,
    estado?: any,
    indicador?: any,
    posicion?: any,
    id?: any
  ) {
    this.drawText(context, color, estado, indicador, posicion, id);
  }

  setNote(note: any) {
    this.text = note.toUpperCase();
  }
}
