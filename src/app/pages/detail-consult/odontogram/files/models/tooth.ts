import { TextBox } from "./text-box";
import { Rect } from "./rect";
import { Constants } from "../utils/constants";
import { Damage } from "./damage";

export class Tooth {
  id = 0;
  tooth = true;
  surfaces = 0;
  highlight = false;
  highlightColor = "";
  damages: any = Array();
  checkBoxes = Array();
  rect: any = new Rect();
  textBox = new TextBox();
  textBox2 = new TextBox();
  textBox3 = new TextBox();
  spacer = 20;
  touching = false;
  address = 0;
  normalY = null;
  highY: any = null;
  blocked = false;
  constants: any = null;
  state = 0;

  // state2 = 0;
  // state3 = 0;
  // indicador = 0;
  // contador = 0;
  // clic_check = 0;
  /**/
  estado = "";
  x: any;
  y: any;
  width: any;
  height: any;
  type: any;
  lbl: any;
  image: any;

  setDimens(x: any, y: any, width: any, height: any, enumerador: any) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.rect.x = x;
    this.rect.y = y;
    this.rect.width = width;
    this.rect.height = height;

    this.normalY = y;

    if (enumerador == 2)
    {
        this.textBox2.setDimens(x, y, width, 20, enumerador);
        this.textBox2.setLabel(this.id);
    }
    else if (enumerador == 3) {
        this.textBox3.setDimens(x, y, width, 20, enumerador);
        this.textBox3.setLabel(this.id);
    }

    this.textBox.setDimens(x, y, width, 20, enumerador);
    this.textBox.setLabel(this.id);
  }

  setType(type: any, lbl?: any) {
    this.type = type;
    this.lbl = lbl;

    if (type == 0) {
      this.highY = this.y - 10;

      this.textBox.rect.y = this.y - 42;
    } else {
      this.highY = this.y + 10;

      this.textBox.rect.y = this.rect.y + this.rect.height + 22;
    }
  }

  setConstants(constants: any) {
    this.constants = constants;
  }

  checkCollision(eX: any, eY: any) {
    return this.rect.checkCollision(eX, eY);
  }

  setSurfaces(surfaces: any) {
    this.surfaces = surfaces;
  }

  toggleSelected(selected: any) {
    this.highlight = selected;
  }

  create4Surfaces(settings: any) {
    var width = settings.RECT_DIMEN;

    var startX = this.x + 10;

    /*
     * ids are in the following order
     *
     * upper
     *   1
     * 2   4
     *   3
     * lower
     *   3
     * 4   2
     *   1
     */

    if (this.type === 0) {

        var rect1 = new Rect();

        rect1.width = width;
        rect1.height = width;
        rect1.x = startX;
        rect1.y = this.y + this.height + width;
        rect1.id = this.id + "_M";

        this.checkBoxes.push(rect1);

        var rect2 = new Rect();

        rect2.width = width;
        rect2.height = width;
        rect2.x = startX + width;
        rect2.y = this.y + this.height + width;
        rect2.id = this.id + "_D";

        this.checkBoxes.push(rect2);

        var rect3 = new Rect();

        rect3.width = width;
        rect3.height = width;
        rect3.x = startX + 5;
        rect3.y = this.y + this.height;
        rect3.id = this.id + "_V";

        this.checkBoxes.push(rect3);

        var rect4 = new Rect();

        rect4.width = width;
        rect4.height = width;
        rect4.x = startX + 5;
        rect4.y = this.y + this.height + width * 2;
        rect4.id = this.id + "_L";

        this.checkBoxes.push(rect4);

    } else {
        
        var rect1 = new Rect();

        rect1.width = width;
        rect1.height = width;
        rect1.x = startX;
        rect1.y = this.y - width * 2;
        rect1.id = this.id + "_M";

        this.checkBoxes.push(rect1);

        var rect2 = new Rect();

        rect2.width = width;
        rect2.height = width;
        rect2.x = startX + width;
        rect2.y = this.y - width * 2;
        rect2.id = this.id + "_D";

        this.checkBoxes.push(rect2);

        var rect3 = new Rect();

        rect3.width = width;
        rect3.height = width;
        rect3.x = startX + 5;
        rect3.y = this.y - width;
        rect3.id = this.id + "_L";

        this.checkBoxes.push(rect3);

        var rect4 = new Rect();

        rect4.width = width;
        rect4.height = width;
        rect4.x = startX + 5;
        rect4.y = this.y - width * 3;
        rect4.id = this.id + "_V";

        this.checkBoxes.push(rect4);

    }
  }

  create5Surfaces(settings: any) {
    var width = settings.RECT_DIMEN;

    var startX = this.x + 5;

    /*
     * ids are in the following order
     *
     * upper
     *   1
     * 2 5 4
     *   3
     *
     * lower
     *   3
     * 4 5 2
     *   1
     */

    if (this.type === 0) {

      var rect1 = new Rect();

      rect1.width = width;
      rect1.height = width;
      rect1.x = startX;
      rect1.y = this.y + this.height + width;
      rect1.id = this.id + "_M";

      this.checkBoxes.push(rect1);

      var rect2 = new Rect();

      rect2.width = width;
      rect2.height = width;
      rect2.x = startX + width;
      rect2.y = this.y + this.height + width;
      rect2.id = this.id + "_O";

      this.checkBoxes.push(rect2);

      var rect3 = new Rect();

      rect3.width = width;
      rect3.height = width;
      rect3.x = startX + width * 2;
      rect3.y = this.y + this.height + width;
      rect3.id = this.id + "_D";

      this.checkBoxes.push(rect3);

      var rect4 = new Rect();

      rect4.width = width;
      rect4.height = width;
      rect4.x = startX + width;
      rect4.y = this.y + this.height;
      rect4.id = this.id + "_V";

      this.checkBoxes.push(rect4);

      var rect5 = new Rect();

      rect5.width = width;
      rect5.height = width;
      rect5.x = startX + width;
      rect5.y = this.y + this.height + width * 2;
      rect5.id = this.id + "_L";

      this.checkBoxes.push(rect5);
  
  } else {
      
      var rect1 = new Rect();

      rect1.width = width;
      rect1.height = width;
      rect1.x = startX;
      rect1.y = this.y - width * 2;
      rect1.id = this.id + "_M";

      this.checkBoxes.push(rect1);

      var rect2 = new Rect();

      rect2.width = width;
      rect2.height = width;
      rect2.x = startX + width;
      rect2.y = this.y - width * 2;
      rect2.id = this.id + "_O";

      this.checkBoxes.push(rect2);

      var rect3 = new Rect();

      rect3.width = width;
      rect3.height = width;
      rect3.x = startX + width * 2;
      rect3.y = this.y - width * 2;
      rect3.id = this.id + "_D";

      this.checkBoxes.push(rect3);

      var rect4 = new Rect();

      rect4.width = width;
      rect4.height = width;
      rect4.x = startX + width;
      rect4.y = this.y - width;
      rect4.id = this.id + "_L";

      this.checkBoxes.push(rect4);

      var rect5 = new Rect();

      rect5.width = width;
      rect5.height = width;
      rect5.x = startX + width;
      rect5.y = this.y - width * 3;
      rect5.id = this.id + "_V";

      this.checkBoxes.push(rect5);

  }
  }

  createSurfaces(settings: any) {
    if (this.surfaces == 4) {
      this.create4Surfaces(settings);
    } else {
      this.create5Surfaces(settings);
    }
  }

  drawId(context: any) {
    if (this.lbl == 0) {


      context.beginPath();
      context.textAlign = 'center';
      context.fillStyle = "#000000";
      context.font = "15px Arial Bold";

      var space = 40;

      if (this.type === 0) {
          // draw id
          context.fillText("" + this.id, this.rect.x + this.rect.width / 2,
                           this.rect.y + this.rect.height + space + 10);

          // draw id border
          context.moveTo(this.rect.x, this.rect.y + this.rect.height + space + 20);

          context.lineTo(this.rect.x + this.rect.width,
                         this.rect.y + this.rect.height + space + 20);

          context.moveTo(this.rect.x + this.rect.width,
                         this.rect.y + this.rect.height + space + 20);

          context.lineTo(this.rect.x + this.rect.width,
                         this.rect.y + this.rect.height + space);
      } else {
          // draw id
          context.fillText("" + this.id, this.rect.x + this.rect.width / 2,
                           this.rect.y - space - 5);

          // draw id border
          context.moveTo(this.rect.x, this.rect.y - space - 20);
          context.lineTo(this.rect.x + this.rect.width, this.rect.y - space - 20);

          context.moveTo(this.rect.x + this.rect.width, this.rect.y - space - 20);
          context.lineTo(this.rect.x + this.rect.width, this.rect.y - space);
      }

      context.lineWidth = 1;
      // set line color
      context.strokeStyle = '#000000';
      context.stroke();
      context.restore();
    }
  }

  drawCheckBoxes(context: any, settings: any, indicador: any) {
    for (var i = 0; i < this.checkBoxes.length; i++)
    {
         
        if (this.checkBoxes[i].state === 1) { //LESION DE CARIES DENTAL        
            

            //24112023
            if (this.checkBoxes[i].statetext === 1 || this.checkBoxes[i].state === 1) {//06122023
                this.checkBoxes[i].fillColor(context, settings.COLOR_RED);
                this.checkBoxes[i].outline(context, "#000000");
            }
            else {
                this.checkBoxes[i].fillColor(context, settings.COLOR_BLUE);
                this.checkBoxes[i].outline(context, "#000000");
            }
            
            if (i === this.checkBoxes.length - 1)
                this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);

            if (this.constants.CARIES === this.checkBoxes[i].statetext) this.checkBoxes[i].statetext = this.checkBoxes[i].state;
            //

        } else if (this.checkBoxes[i].state === 11) { //RESTAURACION        

            //24112023
            if (this.checkBoxes[i].statetext === 1 || this.checkBoxes[i].state === 1) {//06122023
                this.checkBoxes[i].fillColor(context, settings.COLOR_RED);
                this.checkBoxes[i].outline(context, "#000000");
            }
            else {
                this.checkBoxes[i].fillColor(context, settings.COLOR_BLUE);
                this.checkBoxes[i].outline(context, "#000000");
            }  

            if (i === this.checkBoxes.length - 1)
                this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);            

        } else if (this.checkBoxes[i].state === 39) {//TRATAMIENTO TEMPORAL

            var auxRect = new Rect();
            auxRect.x = this.checkBoxes[i].x + 1;
            auxRect.y = this.checkBoxes[i].y + 1;
            auxRect.width = this.checkBoxes[i].width - 2;
            auxRect.height = this.checkBoxes[i].height - 2;
            auxRect.outline(context, settings.COLOR_RED, 3.5);
            this.checkBoxes[i].outline(context, "#000000");

            /*jjallo 02122020*/
            if (i === this.checkBoxes.length - 1)
                this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);
            /**/
        } else if (this.checkBoxes[i].state === this.constants.SELLANTES) { //SELLANTES
            
            //06122023
            if (this.checkBoxes[i].statetext === 1) {
                var auxRect = new Rect();
                auxRect.x = this.checkBoxes[i].x + 1;
                auxRect.y = this.checkBoxes[i].y + 1;
                auxRect.width = this.checkBoxes[i].width - 2;
                auxRect.height = this.checkBoxes[i].height - 2;
                auxRect.outline(context, settings.COLOR_RED, 3.5);
                this.checkBoxes[i].outline(context, "#000000");

                if (i === this.checkBoxes.length - 1)
                    this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);
            }
            else {
                console.log('pintado diente=', this.checkBoxes[i].state);
                var auxRect = new Rect();
                auxRect.x = this.checkBoxes[i].x + 1;
                auxRect.y = this.checkBoxes[i].y + 1;
                auxRect.width = this.checkBoxes[i].width - 2;
                auxRect.height = this.checkBoxes[i].height - 2;
                auxRect.outline(context, settings.COLOR_BLUE, 3.5);
                this.checkBoxes[i].outline(context, "#000000");

                if (i === this.checkBoxes.length - 1)
                    this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);
            }
            //

        }
            /*comentado 06122023
        else if (this.checkBoxes[i].state === -40) {
            var auxRect = new Rect();
            auxRect.x = this.checkBoxes[i].x + 1;
            auxRect.y = this.checkBoxes[i].y + 1;
            auxRect.width = this.checkBoxes[i].width - 2;
            auxRect.height = this.checkBoxes[i].height - 2;
            auxRect.outline(context, settings.COLOR_RED, 3.5);
            this.checkBoxes[i].outline(context, "#000000");
            
            if (i === this.checkBoxes.length - 1)
                this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);
            
        }*/

        /*jjallo 11092020*/
        else if (this.checkBoxes[i].state === -1 || this.checkBoxes[i].state === -11 || this.checkBoxes[i].state === -39) { //LESION DE CARIES DENTAL- RESTAURACION - TRATAMIENTO TEMPORAL
            this.checkBoxes[i].outline(context, "#000000");
        }       
        /**/


        //04042023 Inicio //PULPOTOMIA
        else if (this.checkBoxes[i].state === this.constants.PULPOTOMIA) {
            //06122023
            if (this.checkBoxes[i].statetext === 1) {
                this.checkBoxes[i].fillColor(context, settings.COLOR_RED);
                this.checkBoxes[i].outline(context, "#000000");
            }
            else {
                this.checkBoxes[i].fillColor(context, settings.COLOR_BLUE);
                this.checkBoxes[i].outline(context, "#000000");
            }
            //
            //20112023
            //this.checkBoxes[i].fillColor(context, settings.COLOR_BLUE);
            //this.checkBoxes[i].outline(context, "#000000");
            //
        }
        //else if (this.checkBoxes[i].state === -46) {            

        //    //20112023
        //    this.checkBoxes[i].fillColor(context, settings.COLOR_RED);
        //    this.checkBoxes[i].outline(context, "#000000");
        //    //
        //}
        //Fin
        else {
            //this.checkBoxes[i].outline(context, "#000000");
            /*jjallo 26112020*/
            if (i === this.checkBoxes.length - 1)
                this.checkBoxes[i].outline(context, "#000000", undefined, 'T', indicador);
            else
                this.checkBoxes[i].outline(context, "#000000");
            /**/
        }

    }
  }

  drawTextBox(
    context: any,
    settings: any,
    estado: any,
    indicador: any,
    posicion: any,
    id: any,
    data?: any,
    variable?: any
  ) {
    for (var i = 0; i < this.damages.length; i++) {

      if (this.damages[i].id === this.constants.CURACION) {//06122023
          //this.textBox.statetext = 0;
          //this.textBox.render(context, settings.COLOR_BLUE);

          if (variable.textBox.hallazgo === this.constants.CURACION) {
              this.textBox.statetext = 0;
              this.textBox.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox2.hallazgo === this.constants.CURACION) {
              this.textBox2.statetext = 0;
              this.textBox2.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox3.hallazgo === this.constants.CURACION) {
              this.textBox3.statetext = 0;
              this.textBox3.render(context, settings.COLOR_BLUE);
          }

      }

      if (this.damages[i].id == 0) {
          if (this.damages[i].statetext == 1) {
              this.textBox.statetext = 1;
              this.textBox.render(context, settings.COLOR_RED);
          }
      }

      if (this.damages[i].id === this.constants.PULPAR) { //06122023            
          if (this.damages[i].statetext == 1 || this.damages[i].state == 1) {                
              if (variable.textBox.hallazgo == this.constants.PULPAR) {
                  this.textBox.statetext = 1;
                  this.textBox.render(context, settings.COLOR_RED);
              }
              if (variable.textBox2.hallazgo == this.constants.PULPAR) {
                  this.textBox2.statetext = 1;
                  this.textBox2.render(context, settings.COLOR_RED);
              }
              if (variable.textBox3.hallazgo == this.constants.PULPAR) {
                  this.textBox3.statetext = 1;
                  this.textBox3.render(context, settings.COLOR_RED);
              }
          }
      }

      //06122023
      if (this.damages[i].id === this.constants.DIENTE_AUSENTE) {           
          if (this.damages[i].statetext === 1 || this.damages[i].state === 1) {
              if (variable.textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                  this.textBox.statetext = 1;
                  this.textBox.render(context, settings.COLOR_BLUE);
              }
              if (variable.textBox2.hallazgo === this.constants.DIENTE_AUSENTE) {
                  this.textBox2.statetext = 1;
                  this.textBox2.render(context, settings.COLOR_BLUE);
              }
              if (variable.textBox3.hallazgo === this.constants.DIENTE_AUSENTE) {
                  this.textBox3.statetext = 1;
                  this.textBox3.render(context, settings.COLOR_BLUE);
              }
          }
      }
      //

      //04042023
      if (this.damages[i].id === this.constants.IMPLANTE) {//06122023  

          //if (this.damages[i].statetext === 1) {
          //    //if (this.damages[i].statetext === 1) {                
          //    this.textBox.statetext = 1;
          //    this.textBox.render(context, settings.COLOR_RED);
          //}

          if (variable.textBox.hallazgo === this.constants.IMPLANTE) {

              if (this.damages[i].indicador === 'A')
              {
                  this.textBox.statetext = 0;
                  this.textBox.render(context, settings.COLOR_BLUE);
              }
              else if (this.damages[i].indicador === 'R') {                    
                  this.textBox.statetext = 1;
                  this.textBox.render(context, settings.COLOR_RED);
              }              
          }
          if (variable.textBox2.hallazgo === this.constants.IMPLANTE) {
              if (this.damages[i].indicador === 'A') {
                  this.textBox2.statetext = 0;
                  this.textBox2.render(context, settings.COLOR_BLUE);
              }
              else if (this.damages[i].indicador === 'R') {
                  this.textBox2.statetext = 1;
                  this.textBox2.render(context, settings.COLOR_RED);
              }
          }
          if (variable.textBox3.hallazgo === this.constants.IMPLANTE) {
              if (this.damages[i].indicador === 'A') {
                  this.textBox3.statetext = 0;
                  this.textBox3.render(context, settings.COLOR_BLUE);
              }
              else if (this.damages[i].indicador === 'R') {
                  this.textBox3.statetext = 1;
                  this.textBox3.render(context, settings.COLOR_RED);
              }
          }

      }
      //


      //06122023   

      if (this.damages[i].id === this.constants.CORONA_DEFINITIVA) { //06122023
          //debugger;
          if (this.damages[i].statetext === 1 || this.damages[i].state === 1) {
              //this.textBox.statetext = 1;
              //this.textBox.render(context, settings.COLOR_RED);

              if (variable.textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox.statetext = 1;
                  this.textBox.render(context, settings.COLOR_RED);
              }
              if (variable.textBox2.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox2.statetext = 1;
                  this.textBox2.render(context, settings.COLOR_RED);
              }
              if (variable.textBox3.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox3.statetext = 1;
                  this.textBox3.render(context, settings.COLOR_RED);
              }

          }
          else {
              //this.textBox.statetext = 0;
              //this.textBox.render(context, settings.COLOR_BLUE);

              if (variable.textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox.statetext = 0;
                  this.textBox.render(context, settings.COLOR_BLUE);
              }
              if (variable.textBox2.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox2.statetext = 0;
                  this.textBox2.render(context, settings.COLOR_BLUE);
              }
              if (variable.textBox3.hallazgo === this.constants.CORONA_DEFINITIVA) {
                  this.textBox3.statetext = 0;
                  this.textBox3.render(context, settings.COLOR_BLUE);
              }
          }
      }

      if (this.damages[i].id === this.constants.IMPACTACION) {
          //debugger;
          //this.damages[i].statetext === 0;
          //this.textBox.statetext = 0;
          //this.textBox.render(context, settings.COLOR_BLUE);

          if (variable.textBox.hallazgo === this.constants.IMPACTACION)
          {
             
              if (this.damages[i].state === 1) {
                  this.textBox.statetext = this.damages[i].state;
                  this.textBox.render(context, settings.COLOR_RED);
              }
              else {
                  this.textBox.statetext = this.damages[i].state;
                  this.textBox.render(context, settings.COLOR_BLUE);
              }
          }
          if (variable.textBox2.hallazgo === this.constants.IMPACTACION) {
              if (this.damages[i].state === 1) {
                  this.textBox2.statetext = this.damages[i].state;
                  this.textBox2.render(context, settings.COLOR_RED);
              }
              else {
                  this.textBox2.statetext = this.damages[i].state;
                  this.textBox2.render(context, settings.COLOR_BLUE);
              }
          }
          if (variable.textBox3.hallazgo === this.constants.IMPACTACION) {
              if (this.damages[i].state === 1) {
                  this.textBox3.statetext = this.damages[i].state;
                  this.textBox3.render(context, settings.COLOR_RED);
              }
              else {
                  this.textBox3.statetext = this.damages[i].state;
                  this.textBox3.render(context, settings.COLOR_BLUE);
              }
          }
      }

      if (this.damages[i].id === this.constants.CORONA_TEMPORAL) {           
          if (variable.textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
              this.damages[i].state=1;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_RED);
          }
          if (variable.textBox2.hallazgo === this.constants.CORONA_TEMPORAL) {
              this.damages[i].state = 1;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_RED);
          }
          if (variable.textBox3.hallazgo === this.constants.CORONA_TEMPORAL) {
              this.damages[i].state = 1;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_RED);
          }
      }

      if (this.damages[i].id === this.constants.SUPERFICIE_DESGASTADA) {
          if (variable.textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
              this.damages[i].state = 1;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_RED);
          }
          if (variable.textBox2.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
              this.damages[i].state = 1;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_RED);
          }
          if (variable.textBox3.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
              this.damages[i].state = 1;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_RED);
          }
      }

      if (this.damages[i].id === this.constants.REMANENTE_RADICULAR) {
          if (variable.textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
              this.damages[i].state = 1;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_RED);
          }
          if (variable.textBox2.hallazgo === this.constants.REMANENTE_RADICULAR) {
              this.damages[i].state = 1;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_RED);
          }
          if (variable.textBox3.hallazgo === this.constants.REMANENTE_RADICULAR) {
              this.damages[i].state = 1;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_RED);
          }
      }

      if (this.damages[i].id === this.constants.FOSAS_PROFUNDAS) {
          if (variable.textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
              this.damages[i].state = 0;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox2.hallazgo === this.constants.FOSAS_PROFUNDAS) {
              this.damages[i].state = 0;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox3.hallazgo === this.constants.FOSAS_PROFUNDAS) {
              this.damages[i].state = 0;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_BLUE);
          }
      }

      if (this.damages[i].id === this.constants.MACRODONCIA) {
          if (variable.textBox.hallazgo === this.constants.MACRODONCIA) {
              this.damages[i].state = 0;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox2.hallazgo === this.constants.MACRODONCIA) {
              this.damages[i].state = 0;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox3.hallazgo === this.constants.MACRODONCIA) {
              this.damages[i].state = 0;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_BLUE);
          }
      }

      if (this.damages[i].id === this.constants.MICRODONCIA) {
          if (variable.textBox.hallazgo === this.constants.MICRODONCIA) {
              this.damages[i].state = 0;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox2.hallazgo === this.constants.MICRODONCIA) {
              this.damages[i].state = 0;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox3.hallazgo === this.constants.MICRODONCIA) {
              this.damages[i].state = 0;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_BLUE);
          }
      }

      if (this.damages[i].id === this.constants.DIENTE_ECTOPICO) {
          if (variable.textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
              this.damages[i].state = 0;
              this.textBox.statetext = this.damages[i].state;
              this.textBox.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox2.hallazgo === this.constants.DIENTE_ECTOPICO) {
              this.damages[i].state = 0;
              this.textBox2.statetext = this.damages[i].state;
              this.textBox2.render(context, settings.COLOR_BLUE);
          }
          if (variable.textBox3.hallazgo === this.constants.DIENTE_ECTOPICO) {
              this.damages[i].state = 0;
              this.textBox3.statetext = this.damages[i].state;
              this.textBox3.render(context, settings.COLOR_BLUE);
          }
      }
      //

    }



  //if (this.textBox.statetext === 1)
  if (this.textBox.statetext === 1 || this.textBox.statetext === 11 || this.textBox.statetext == "1")//14112023
      this.textBox.render(context, settings.COLOR_RED, estado, indicador, posicion, id);//jjallo 30112020
 else
      this.textBox.render(context, settings.COLOR_BLUE, estado, indicador, posicion, id);//jjallo 30112020



  //04042023 Inicio
  //DIENTE AUSENTE
  if (this.textBox.text == "DNE" || this.textBox.text == "DEX" || this.textBox.text == "DAO") {
      this.textBox.render(context, settings.COLOR_BLUE, estado, indicador, posicion, id);
      this.textBox.state = 1;
      this.textBox.state2 = 1;
      this.textBox.state3 = 1;
  }

  if (this.textBox.text == "MB" || this.textBox.text == "CE" || this.textBox.text == "CD" || this.textBox.text == "CDP") {
      this.textBox.render(context, settings.COLOR_RED, estado, indicador, posicion, id);
      this.textBox.state = 1;
      this.textBox.state2 = 1;
      this.textBox.state3 = 1;
  }


  if (this.textBox.text == "O" || this.textBox.text == "PE") {
      this.textBox.render(context, settings.COLOR_RED, estado, indicador, posicion, id);
      this.textBox.state = 1;
      this.textBox.state2 = 1;
      this.textBox.state3 = 1;
  }

  //POSICION DENTARIA
  if (this.textBox.text == "M" || this.textBox.text == "D" || this.textBox.text == "V" || this.textBox.text == "P" || this.textBox.text == "L") {
      this.textBox.render(context, settings.COLOR_BLUE, estado, indicador, posicion, id);
      this.textBox.state = 1;
      this.textBox.state2 = 1;
      this.textBox.state3 = 1;
  }


  if (this.textBox.text == "M1" || this.textBox.text == "M2" || this.textBox.text == "M3" || this.textBox.text == "M4" || this.textBox.text == "M5" || this.textBox.text == "M6" || this.textBox.text == "M7" || this.textBox.text == "M8" || this.textBox.text == "M9" || this.textBox.text == "M10"||
      this.textBox.text == "M11" || this.textBox.text == "M12" || this.textBox.text == "M13" || this.textBox.text == "M14" || this.textBox.text == "M15" || this.textBox.text == "M16" || this.textBox.text == "M17" || this.textBox.text == "M18" || this.textBox.text == "M19" || this.textBox.text == "M20" ||
      this.textBox.text == "M21" || this.textBox.text == "M22" || this.textBox.text == "M23" || this.textBox.text == "M24" || this.textBox.text == "M25" || this.textBox.text == "M26" || this.textBox.text == "M27" || this.textBox.text == "M28" || this.textBox.text == "M29" || this.textBox.text == "M30" ||
      this.textBox.text == "M31" || this.textBox.text == "M32" || this.textBox.text == "M33" || this.textBox.text == "M34" || this.textBox.text == "M35" || this.textBox.text == "M36" || this.textBox.text == "M37" || this.textBox.text == "M38" || this.textBox.text == "M39" || this.textBox.text == "M40" ||
      this.textBox.text == "M41" || this.textBox.text == "M42" || this.textBox.text == "M43" || this.textBox.text == "M44" || this.textBox.text == "M45" || this.textBox.text == "M46" || this.textBox.text == "M47" || this.textBox.text == "M48" || this.textBox.text == "M49" || this.textBox.text == "M50" ||
      this.textBox.text == "M51" || this.textBox.text == "M52" || this.textBox.text == "M53" || this.textBox.text == "M54" || this.textBox.text == "M55" || this.textBox.text == "M56" || this.textBox.text == "M57" || this.textBox.text == "M58" || this.textBox.text == "M59" || this.textBox.text == "M60" ||
      this.textBox.text == "M61" || this.textBox.text == "M62" || this.textBox.text == "M63" || this.textBox.text == "M64" || this.textBox.text == "M65" || this.textBox.text == "M66" || this.textBox.text == "M67" || this.textBox.text == "M68" || this.textBox.text == "M69" || this.textBox.text == "M70" ||
      this.textBox.text == "M71" || this.textBox.text == "M72" || this.textBox.text == "M73" || this.textBox.text == "M74" || this.textBox.text == "M75" || this.textBox.text == "M76" || this.textBox.text == "M77" || this.textBox.text == "M78" || this.textBox.text == "M79" || this.textBox.text == "M80" ||
      this.textBox.text == "M81" || this.textBox.text == "M82" || this.textBox.text == "M83" || this.textBox.text == "M84" || this.textBox.text == "M85" || this.textBox.text == "M86" || this.textBox.text == "M87" || this.textBox.text == "M88" || this.textBox.text == "M89" || this.textBox.text == "M90" ||
      this.textBox.text == "M91" || this.textBox.text == "M92" || this.textBox.text == "M93" || this.textBox.text == "M94" || this.textBox.text == "M95" || this.textBox.text == "M96" || this.textBox.text == "M97" || this.textBox.text == "M98" || this.textBox.text == "M99"
      ) {

      this.textBox.render(context, settings.COLOR_RED, estado, indicador, posicion, id); //jjallo 30112020
      this.textBox.state = 1;
      this.textBox.state2 = 1;
      this.textBox.state3 = 1;
  }
  if (this.textBox.touching) {
      this.textBox.rect.highlightWithColor(context, "#36BE1B", 0.6);
  }
  }


  Color(textbox, context, settings, estado, indicador, posicion, id) {
    if (textbox.statetext === 1)

      textbox.render(
        context,
        settings.COLOR_RED,
        estado,
        indicador,
        posicion,
        id
      );

    else
      textbox.render(
        context,
        settings.COLOR_BLUE,
        estado,
        indicador,
        posicion,
        id
      );
  }

  onTouch(touch: any) {
    if (touch) {
      this.y = this.highY;
    } else {
      this.y = this.normalY;
    }

    this.rect.touching = touch;
  }

  createDamage(
    damageId: any,
    direction?: any,
    state?: any,
    statetext?: any,
    indicador?: any
  ) {
    var damage;

    // attach damage in the proper position
    // first check if the damage should be positioned in the checkboxes area
    if (damageId === this.constants.DIENTE_EN_CLAVIJA ||
        damageId === this.constants.FUSION
        /*||damageId === this.constants.CORONA_DEFINITIVA*/ //comentado por jjallo 11092020
        /*||damageId === this.constants.CORONA_TEMPORAL*/  //comentado por jjallo 11092020
        ) {

        //04042023 Inicio
      if (damageId === this.constants.DIENTE_EN_CLAVIJA) {
          // set the damage to proper position
          if (this.type === 0) {
              damage = new Damage(damageId,
                      this.rect.x,
                      this.rect.y + (this.rect.height - 140),
                      this.width,
                      60,
                      this.type,
                      direction, state,
                      statetext);
          } else {
              damage = new Damage(damageId,
                      this.rect.x,
                      this.rect.y + 80,
                      this.width,
                      60,                        
                      this.type,
                      direction, state,
                      statetext);
          }
      }
      else {            
          if (this.type === 0) {
              damage = new Damage(damageId,
                      this.rect.x,
                      this.rect.y + this.rect.height,
                      this.width,
                      60,                        
                      this.type,
                      direction, state,
                      statetext);
          } else {
              damage = new Damage(damageId,
                      this.rect.x,
                      this.rect.y - 60,
                      this.width,
                      60,                       
                      this.type,
                      direction, state,
                      statetext);
          }
      } 

    } else if (this.constants.isWritable(damageId)) {
        // damage should be attached to the textBox area
        damage = new Damage(damageId,
                this.textBox.rect.x,
                this.textBox.rect.y,
                this.textBox.rect.width,
                this.textBox.rect.height,
                this.type,
                //direction,state,statetext);
                direction, state,
                statetext
                ,indicador //jjallo 11092020
            );

    } else {

      if (indicador === 1) {
          damage = new Damage(damageId,
            this.rect.x,
            this.rect.y,
            this.rect.width,
            this.rect.height,
            this.type,
            direction,
            state,
            statetext,
            (damageId == 5 ? indicador : indicador)
            );
      }
      else {

          damage = new Damage(damageId,
                  this.rect.x,
                  this.rect.y,
                  this.rect.width,
                  this.rect.height,
                  this.type,
                  direction,
                  state,
                  statetext,
                  (damageId == 5 ? indicador : indicador) //jjallo 11092020
                  );

      }
    }

    return damage;
  }

  toggleDamage(
    damageId: any,
    iniDirection: any,
    states: any,
    statetexts: any,
    posicion: any,
    contador: any
  ) {
    var exists = false;
    var splicer = -1;
    var direction = Number(iniDirection === undefined ? -1 : iniDirection);

    //var indicador = 'CR'; //jjallo 11092020 - CORONA_RAIZ = FRACTURA
    var indicador: any = ''; //jjallo 11092020 - CORONA_RAIZ = FRACTURA

    /*INICIO JJALLO*/
    var state = Number(states === undefined ? 0 : states);
    var statetext = Number(statetexts === undefined ? 0 : statetexts);

    /*FIN JJALLO*/
    //debugger;
    // check to see if this damage exists
    if (this.damages.length >= 1) {
      for (var i = 0; i < this.damages.length; i++) {            
          //debugger;
          // found this damage
          if (this.damages[i].id === damageId) {                
              splicer = i;
              exists = true;
              direction = this.damages[i].direction;
              state = this.damages[i].state;
              this.damages[i].statetext = statetext;

              /*jjallo 11092020*/
              indicador = this.damages[i].indicador;
              //if (damageId == 2 && indicador == 0)
              //{
              //    splicer = -1;
              //    exists = true;
              //    this.damages[i].indicador = 'E';
              //    indicador = this.damages[i].indicador;
              //}

              if (damageId == this.constants.FRACTURA && this.damages[i].indicador == 'A')
              {
                  splicer = 0;
                  exists = false;
                  this.damages[i].indicador == 'C';
                  state = 1;
              } else if (damageId == this.constants.FRACTURA && this.damages[i].indicador == 'C') {
                  splicer = 0;
                  exists = false;
                  this.damages[i].indicador == 'R';
                  state = 1;
              }
              else if (damageId == this.constants.FRACTURA && this.damages[i].indicador == 'R') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = 'E';
                  indicador = this.damages[i].indicador;
              }
              
              if (damageId == this.constants.PERNO_MUNON && indicador == 'A')
              {
                  splicer = 0;
                  exists = false;
                  this.damages[i].indicador = 'R';
                  state = 1;
                  this.damages[i].state = 1;
                  this.damages[i].statetext = 1;
              }
              else if (damageId == this.constants.PERNO_MUNON && indicador == 'R')
              {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = '';
                  state = 0;
                  //this.damages[i].state = 1;
                  //this.damages[i].statetext = 1;
              }

              /*comentado 04122023
              //04042023 Inicio
              if (damageId === this.constants.PULPAR) {
                  if (sessionStorage.getItem("damages") === "1") {
                      indicador = 'R';
                      this.damages[i].indicador = 'R';
                      state = 1;
                      this.damages[i].state = 1;
                      this.damages[i].statetext = 1;
                  }
              }
              if (damageId == this.constants.PULPAR && indicador == 'A') {
                  debugger;
                  splicer = 0;
                  exists = false;
                  this.damages[i].indicador = 'R';
                  state = 1;
                  this.damages[i].state = 1;
                  this.damages[i].statetext = 1;
                  
                  sessionStorage.setItem("damages", 1); //04042023 color Rojo   
              }
              else if (damageId == this.constants.PULPAR && indicador == 'R') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = '';
                  state = 0;                    
                  sessionStorage.setItem("damages", 2);//04042023 sin color                    
              }
              //
              */

              //04122023
              //if (damageId == this.constants.PULPAR && indicador == 'A') {
              //    splicer = 0;
              //    exists = false;
              //    this.damages[i].indicador = 'R';
              //    state = 1;
              //    this.damages[i].state = 1;
              //    this.damages[i].statetext = 1;
              //}
              if (damageId == this.constants.PULPAR && this.damages[i].indicador == 'R') {
                  //debugger;
                  splicer = 0;
                  exists = false;
                  state = 1;
              }
              else if (damageId == this.constants.PULPAR && this.damages[i].indicador == 'E') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = 'E';
                  indicador = this.damages[i].indicador;
              }
              //

              //06122023
              //if (damageId == this.constants.DIENTE_AUSENTE && this.damages[i].indicador == 'R') {
              //    //debugger;
              //    splicer = 0;
              //    exists = false;
              //    state = 1;
              //}
              //else

                  if (damageId == this.constants.DIENTE_AUSENTE && this.damages[i].indicador == 'E') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = 'E';
                  indicador = this.damages[i].indicador;
              }
              //
              //

              if (damageId == this.constants.CORONA_DEFINITIVA && this.damages[i].indicador == 'R') {
                  //debugger;
                  splicer = 0;
                  exists = false;
                  state = 1;
              }
              else if (damageId == this.constants.CORONA_DEFINITIVA && this.damages[i].indicador == 'E') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = 'E';
                  indicador = this.damages[i].indicador;
              }


              //05122023
              //if (damageId == this.constants.IMPLANTE && this.damages[i].indicador == 1) {
              //    splicer = 0;
              //    exists = false;
              //    state = 1;
              //}
              //if (damageId == this.constants.IMPLANTE && this.damages[i].indicador == 'R') {                    
              //    splicer = 0;
              //    exists = false;
              //    state = 1;
              //}
              if (damageId == this.constants.IMPLANTE && this.damages[i].indicador == 'R') {
                  splicer = -1;
                  exists = true;
                  this.damages[i].indicador = 'E';
                  indicador = this.damages[i].indicador;
              }
              //

              //06122023
              if (damageId == this.constants.POSICION_DENTARIA && this.damages[i].indicador == 'E') {                                        
                  exists = true;                    
              }
              if (damageId == this.constants.MOVILIDAD_PATOLOGICA && this.damages[i].indicador == 'E') {
                  exists = true;
              }
              if (damageId == this.constants.DEFECTO_ESMALTE && this.damages[i].indicador == 'E') {
                  exists = true;
              }
              //


              //if (damageId == this.constants.MOVILIDAD_PATOLOGICA) {
              //    state = 1;
              //}
              /**/
              break;
          }
      }
    }

    //Cambio de direcci�n del hallazgo, s�lo si no es carga de inicio
    if (iniDirection === undefined && (damageId === this.constants.GIROVERSION || damageId === this.constants.MIGRACION)) {
        if (exists) this.damages.splice(splicer, 1);
        direction = direction === -1 ? 0 : direction === 0 ? 1 : -1;
        exists = direction === -1;
    }

      // check if damage exists and doesn't have direction
      if (!exists) {

        if (this.surfaces > 0) {//jjallo 11092020

          /*jjallo 11092020*/
          if (damageId == this.constants.REMANENTE_RADICULAR)
          {
              state = 1;
          }                        

          if ((damageId == this.constants.CURACION ) && this.damages.length > 0) {
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == damageId && this.damages[i].indicador == 'R') {
                      this.damages[i].indicador = 'E';
                      indicador = 1;
                      //break;
                      this.damages.splice(i, 1);
                  }
                  else {
                      indicador = 0;
                  }
              }
          }
          else if ((damageId == this.constants.CURACION) && this.damages.length == 0) {
              if (contador != 0 || contador != undefined) indicador = contador; else indicador = 0;
          }



          if (damageId == this.constants.FRACTURA && this.damages.length > 0)
          {
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == damageId) {
                      if (this.damages[i].indicador == 'A') {
                          this.damages[i].indicador = 'C';
                          indicador = this.damages[i].indicador;
                          this.damages.splice(i, 1);
                      }
                      else if (this.damages[i].indicador == 'C') {
                          this.damages[i].indicador = 'R';
                          indicador = this.damages[i].indicador;
                          this.damages.splice(i, 1);
                      }
                      else if (this.damages[i].indicador == 'R') {
                          this.damages[i].indicador = 'E';
                          indicador = this.damages[i].indicador;
                          this.damages.splice(i, 1);
                      }
                  }
                  else {
                      if (posicion == undefined) indicador = 'A'; else indicador = posicion;
                  }
              }
          } else if (damageId == this.constants.FRACTURA && this.damages.length == 0) {
              if (posicion == undefined) indicador = 'A'; else indicador = posicion;
              state = 1;
          }

          //if (damageId == this.constants.POSICION_DENTARIA)
          //{
          //    state = 1;
          //}

          if (damageId == this.constants.IMPLANTE && this.damages.length > 0) {
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == damageId) this.damages[i].indicador = (this.damages[i].state == 0 ? 'A' : 'R');
              }
          } else if (damageId == this.constants.IMPLANTE && this.damages.length == 0) {
              indicador = state;
              indicador = statetext;
          }               

          if ((damageId == this.constants.PULPAR) && this.damages.length > 0) {                    
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == this.constants.PULPAR) {
                      if (this.damages[i].id == damageId && this.damages[i].indicador == 'R') {
                          this.damages[i].indicador = 'E';
                          indicador = 1;                                
                          this.damages.splice(i, 1);
                      }
                      else {
                          indicador = 0;
                      }                        
                  }
                  else {
                      if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
                  }
              }
          }
          else if ((damageId == this.constants.PULPAR) && this.damages.length == 0) {                   
              if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
          }

          //06122023
          if ((damageId == this.constants.DIENTE_AUSENTE) && this.damages.length > 0) {
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == this.constants.DIENTE_AUSENTE) {
                      if (this.damages[i].id == damageId && this.damages[i].indicador == 'R') {
                          this.damages[i].indicador = 'E';
                          indicador = 1;
                          this.damages.splice(i, 1);
                      }
                      else {
                          indicador = 0;
                      }
                  }
                  else {
                      if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
                  }
              }
          }
          else if ((damageId == this.constants.DIENTE_AUSENTE) && this.damages.length == 0) {
              if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
          }
          //

          if ((damageId == this.constants.CORONA_DEFINITIVA) && this.damages.length > 0) {                    
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == this.constants.CORONA_DEFINITIVA) {
                  if (this.damages[i].id == damageId && this.damages[i].indicador == 'R') {
                      this.damages[i].indicador = 'E';
                      indicador = 1;                            
                      this.damages.splice(i, 1);
                  }
                  else {
                      indicador = 0;
                  }
                  }
                  else {
                      if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
                  }
              }
          }
          else if ((damageId == this.constants.CORONA_DEFINITIVA) && this.damages.length == 0) {                    
              if (contador != 0 && contador != undefined) indicador = contador; else indicador = 0;
          }

          if (damageId == this.constants.PERNO_MUNON && this.damages.length == 0) {
              indicador = 'A';
              state = statetext
          }
          else if (damageId == this.constants.PERNO_MUNON && this.damages.length > 0) {
              for (var i = 0; i < this.damages.length; i++) {
                  if (this.damages[i].id == damageId) {                           
                      if (this.damages[i].id == damageId)
                      {
                          indicador = this.damages[i].indicador;
                          this.damages[i].state = 1;
                          this.damages[i].statetext = 1;
                          break;
                      }
                  }
              }
              if (indicador == '') {
                  //indicador = (statetext == 1 ? 'R' : 'A');
                  //statetext == 1;
                  if (statetext == 1) {
                      indicador = '';
                      state = statetext;
                  }
                  else if (statetext == 0)
                  {
                      indicador = 'A';
                      state = statetext;
                  }
                  
                  
              }
              
          }

          if (damageId == this.constants.MOVILIDAD_PATOLOGICA) {
              indicador = contador;
          }
          /**/

          //debugger;
          if (damageId === this.constants.ORTODONTICO_FIJO_CENTER) indicador = contador;//29112023

          if (damageId === this.constants.IMPLANTE) indicador = (contador === '1' ? 'R' : 0);//05122023

          //var d = this.createDamage(damageId, direction, state, statetext);
          var d = this.createDamage(damageId, direction, state, statetext, indicador);//jjallo 11092020


          //06122023
          if (d.id === this.constants.PULPAR && parseInt(indicador) == 1)
              d.state = parseInt(indicador);

          if (d.id === this.constants.IMPLANTE)
              d.automatico = 1;

          if (d.id === this.constants.DIENTE_AUSENTE)
              d.indicador = 'E';

          if (d.id === this.constants.POSICION_DENTARIA)
              d.indicador = 'E';

          if (d.id === this.constants.MOVILIDAD_PATOLOGICA) {
              d.indicador = 'E';
              d.state = 1;
          }

          if (d.id === this.constants.DEFECTO_ESMALTE) {
              d.indicador = 'E';
              d.state = 1;
          }
          //


          if (d !== undefined) {
              this.damages.push(d);
              console.log(this.tooth);

              /*jjallo 11092020*/
              if (damageId == 30 && indicador == 'R') {//PERNO MUNON
                  for (var i = 0; i < this.damages.length; i++) {
                      if (this.damages[i].id == damageId && this.damages[i].indicador == 'R') {
                          this.damages.splice(i, 1);
                          break;
                      }                            
                  }
              }
              /**/

              //05122023
              if (damageId == this.constants.IMPLANTE && indicador == 0) {
                  for (var i = 0; i < this.damages.length; i++) {
                      if (this.damages[i].id == this.constants.IMPLANTE && this.damages[i].indicador == 'R') {                                
                          this.damages.splice(i, 1);
                          break;
                      }
                  }
              }
              //                
          }
        }//jjallo 11092020

      } else {
          // if damage already exists, then we remove it


          //05122023
          // for (var x = 0; x < this.damages.length; x++) {
          //   if (this.damages[x].id === this.constants.IMPLANTE && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }


          //   //27122023
          //   if (this.damages[x].id === this.constants.ORTODONTICO_FIJO_END) { this.damages.splice(x, 1); break; }
          //   if (this.damages[x].id === this.constants.ORTODONTICO_FIJO_CENTER) { this.damages.splice(x, 1); break; }
          //   if (this.damages[x].id === this.constants.ORTONDICO_REMOVIBLE) { this.damages.splice(x, 1); break; }
          //   //
            
          //   //06122023
            //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
            //if (this.damages[x].id === damageId && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
          //   //if (this.damages[x].id === damageId && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
          //   //
          // }
            //

          if (damageId === this.constants.IMPLANTE) {
            for (var x = 0; x < this.damages.length; x++) {
                //if (this.damages[x].id === this.constants.IMPLANTE && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
                if (this.damages[x].id === this.constants.IMPLANTE && this.damages[x].automatico === 1) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.ORTODONTICO_FIJO_END) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.ORTODONTICO_FIJO_END) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.ORTODONTICO_FIJO_CENTER) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.ORTODONTICO_FIJO_CENTER) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.ORTONDICO_REMOVIBLE) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.ORTONDICO_REMOVIBLE) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PROTESIS_TOTAL) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PROTESIS_TOTAL) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.EDENTULOA_TOTAL) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.EDENTULOA_TOTAL) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.FRACTURA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.FRACTURA && this.damages[x].indicador === 'E') { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.EDENTULOA_TOTAL) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.EDENTULOA_TOTAL) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PROTESIS_FIJA_LEFT) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PROTESIS_FIJA_LEFT) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PROTESIS_FIJA_CENTER) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PROTESIS_FIJA_CENTER) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PROTESIS_FIJA_RIGHT) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PROTESIS_FIJA_RIGHT) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PROTESIS_REMOVIBLE) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PROTESIS_REMOVIBLE) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PERNO_MUNON) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PERNO_MUNON) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_EN_CLAVIJA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_EN_CLAVIJA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_EN_CLAVIJA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_EN_CLAVIJA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_EN_ERUPCION) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_EN_ERUPCION) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_EXTRUIDO) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_EXTRUIDO) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_INTRUIDO) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_INTRUIDO) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.FUSION) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.FUSION) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.GEMINACION) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.GEMINACION) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.TRANSPOSICION_LEFT) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.TRANSPOSICION_LEFT) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.TRANSPOSICION_RIGHT) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.TRANSPOSICION_RIGHT) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.SUPER_NUMERARIO) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.SUPER_NUMERARIO) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.PULPAR) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.PULPAR) { this.damages.splice(x, 1); break; }
            }
          }
        else if (damageId === this.constants.DIENTE_AUSENTE) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_AUSENTE) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.DIENTE_ECTOPICO) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.DIENTE_ECTOPICO) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.IMPACTACION) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.IMPACTACION) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.MACRODONCIA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.MACRODONCIA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.MICRODONCIA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.MICRODONCIA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.REMANENTE_RADICULAR) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.REMANENTE_RADICULAR) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.SUPERFICIE_DESGASTADA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.SUPERFICIE_DESGASTADA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.CORONA_DEFINITIVA) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.CORONA_DEFINITIVA) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.CORONA_TEMPORAL) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.CORONA_TEMPORAL) { this.damages.splice(x, 1); break; }
            }
        }
        else if (damageId === this.constants.FOSAS_PROFUNDAS) {
            for (var x = 0; x < this.damages.length; x++) {
                if (this.damages[x].id === this.constants.FOSAS_PROFUNDAS) { this.damages.splice(x, 1); break; }
            }
        }

          //this.damages.splice(splicer, 1); comentado 05122023

      }
  }

  toggleDamageState(damageId: any, iniState: any, iniStateText: any) {
    var estado = 0;
    var posicion = 0;

    //debugger;

    //console.log('toggleDamageState');
    //console.log('toggleDamageState-id' + damageId);

    /*INICIO JJALLO*/
    if (damageId == 28 ) {
      for (var i = 0; i < this.damages.length; i++) {
          if (damageId === this.damages[i].id) {
              posicion = i;
              this.damages[i].statetext = iniStateText;
          }

      }
      this.damages[posicion].statetext = iniStateText;
      //console.log('si llego entrar aca');
  }
  else if (damageId == 6) {
      //console.log('toggleDamageState - damageId +' + damageId);
      //console.log('toggleDamageState - iniStateText +' + iniStateText);

      for (var i = 0; i < this.damages.length; i++) {
          if (damageId === this.damages[i].id) {
              posicion = i;
              //console.log('toggleDamageState - for +' + this.damages[i].statetext);
              this.damages[i].statetext = iniStateText;
          }
      }
      this.damages[posicion].statetext = iniStateText;
     // console.log('toggleDamageState - estado +' + this.damages[posicion].statetext);
  }
  else if (damageId == 2) {
      for (var i = 0; i < this.damages.length; i++) {
          if (damageId === this.damages[i].id) {
              posicion = i;
              this.damages[i].statetext = iniStateText;
          }
      }
      if(this.damages.length >0 ) //jjallo 11092020
      this.damages[posicion].statetext = iniStateText;
  }
  else if (damageId === 0) {

      //console.log('********' + damageId);
      if (this.damages.length < 1) {

          var d = this.createDamage(damageId);

          if (d !== undefined) {
              this.damages.push(d);
          }
          //console.log('valor damage 0');
         // console.log(d);
      }

      for (var i = 0; i < this.damages.length; i++) {
          //console.log('this.damages[i].id' + this.damages[i].id);
         // console.log('damageId' + damageId);

          if (damageId === this.damages[i].id) {
              posicion = i;
              this.damages[i].statetext = iniStateText;
          }
      }
      this.damages[posicion].statetext = iniStateText;

     // console.log('this.damages[posicion].statetext' + this.damages[posicion].statetext);
  }
  else {
      /*FIN JJALLO*/

      //console.log('toggleDamageState - damageId <--> +' + damageId);

      for (var i = 0; i < this.damages.length; i++) {
          if (damageId === this.damages[i].id) {
              posicion = i;
              estado = this.damages[i].state === 0 ? 1 : 0;
          }
      }
      if (iniState !== undefined) estado = iniState;
      this.damages[posicion].state = estado;

      //console.log('toggleDamageState - estado <--> +' + estado);
 }
  }

  render(
    context: any,
    settings: any,
    constants: any,
    indicador: any,
    posicion: any,
    data: any,
    variable: any
  ) {
    if (this.tooth) {

      //this.textBox.drawLabel(context);
      this.textBox.drawLabel(context, indicador, posicion, this.id); //jjallo 26112020

      // draw the image of the tooth
      if (this.image !== undefined) {

          // center of tooth
          var cx = (this.x + this.width / 2);

          // centerinng of the tooth in x axis
          var dx = cx - this.image.naturalWidth / 2;

          // draw tooth
          context.drawImage(this.image, dx, this.y);
      }

      // id
      this.drawId(context);

      // checkboxes
      //this.drawCheckBoxes(context, settings);
      this.drawCheckBoxes(context, settings,indicador); //jjallo 26112020

      if (this.highlight) {
          this.rect.highlightWithColor(context, this.highlightColor, 0.3);
      }

     // console.log('si ingresa');

  } else {

      // highlight the spaces between the teeths
      if (settings.HIHGLIGHT_SPACES) {

          if (this.rect.touching) {
              this.rect.highlightEllipse(context, "#00AEFF", 0.5, -10);
          } else {
              this.rect.highlightEllipse(context, "#19B900", 0.2, 10);
          }
      }
  }


  //04042023 Inicio
  //if (this.constants.PULPAR === 28) {
  //    for (var i = 0; i < data.length; i++) {
  //        if (data[i].id === this.id) {
  //            debugger;
  //            //data[i].TextBox.text = this.textBox.text;
  //            //data[i].textBox.text = this.textBox.text;

  //            //this.datos = data[i];
  //            //this.damages.push(datos);
  //        }
  //    }
  //}
  //Fin

  // draw all damages
  for (var i = 0; i < this.damages.length; i++) {
      //this.damages[i].render(context, settings, constants);
      this.damages[i].render(context, settings, constants, indicador, this.id);//jjallo 02122020
  }

  // highlight textboxes
  for (var i = 0; i < this.checkBoxes.length; i++)
  {
      if (this.checkBoxes[i].touching) {
          this.checkBoxes[i].highlightWithColor(context, "#36BE1B", 0.6);
      }
  }

  // Draw textboxes
  if (this.tooth) {
      //this.drawTextBox(context, settings, indicador);

      //04042023 Inicio
      //this.drawTextBox(context, settings, 'TEX', indicador, posicion, this.id);
      this.drawTextBox(context, settings, 'TEX', indicador, posicion, this.id, data, variable);
      //Fin
  }

   // show area of tooth or space, only in DEBUG MODE
  if (settings.DEBUG) {

      if (this.tooth) {
          this.rect.outline(context, "#000000");
      } else {
          this.rect.highlightEllipse(context, "#FFD100", 0.4, 2);
      }
    }
  }

  getSurfaceById(id: any) {
    var surface;

    for (var i = 0; i < this.checkBoxes.length; i++) {
      if (this.checkBoxes[i].id == id) {
        surface = this.checkBoxes[i];
        break;
      }
    }

    return surface;
  }

  moveUpDown(movement: any) {
    this.normalY += movement;
    this.y += movement;
    this.rect.y += movement;

    this.textBox.rect.y += movement;

    for (var i = 0; i < this.checkBoxes.length; i++) {
      this.checkBoxes[i].y += movement;
    }

    for (var i = 0; i < this.damages.length; i++) {
      this.damages[i].rect.y += movement;
    }
  }

  popDamage() {
    var tail = this.damages.length - 1; // last item
    var idDamageDel = this.damages[tail].id;
    if (tail >= 0) {
        this.damages.splice(tail, 1);
    }
    return idDamageDel;
  }

  refresh(constants: any) {
    for (var i = 0; i < this.damages.length; i++) {
      if (constants.isWritable(this.damages[i].id)) {
        this.damages[i].rect.x = this.textBox.rect.x;
        this.damages[i].rect.y = this.textBox.rect.y;
      }
    }

    this.rect.y = this.normalY;
    this.touching = false;

    this.textBox.touching = false;

    for (var i = 0; i < this.checkBoxes.length; i++) {
      this.checkBoxes[i].touching = false;
    }
  }
}
