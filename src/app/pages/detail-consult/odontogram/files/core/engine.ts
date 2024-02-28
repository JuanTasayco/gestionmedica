import { MatDialog } from "@angular/material";
import { OdontogramaService } from "@shared/services/odontograma.service";
import * as _ from "lodash";
import { OdontogramModalHallazgoComponent } from "../../odontogram-modal-hallazgo/odontogram-modal-hallazgo.component";
import { Constants } from "../utils/constants";
import { Settings } from "../utils/settings";
import { LISTA_HALLAZGOS_SELECCIONAR } from "../utils/util";
import { CollisionHandler } from "./collision-handler";
import { OdontogramaGenerator } from "./odontograma-generator";
import { Renderer } from "./renderer";

export class Engine {
  canvas: any = null;

  canvas1: any = null;

  adultShowing = true;

  // array which contains all the teeth for an odontograma
  public mouth: any = [];

  // array which holds all the spaces between teeth
  spaces: any = [];

  // array for an adult odontograma
  odontAdult: any = [];
  odontAdultcopy: any = [];

  // spaces for a adult odontograma
  odontSpacesAdult: any = [];

  // array for a child odontograma
  odontChild: any = [];
  odontChildtcopy: any = [];

  // spaces for a child odontograma
  odontSpacesChild: any = [];

  // renderer which will render everything on a canvas
  renderer = new Renderer();

  // helper to create odontograma
  odontogramaGenerator = new OdontogramaGenerator();

  // helper for handeling collision
  collisionHandler = new CollisionHandler();

  // settings for application
  settings = new Settings();

  // constants for application
  constants = new Constants();

  // value of the selected damage which should be added or removed
  selectedHallazgo: any = 0;

  // x position of the mouse pointer
  cursorX = 0;

  // y position of the mouse pointer
  cursorY = 0;

  // flag to toggle multiselection on or off
  multiSelect = false;

  // array to hold values for multiselection. When selecting
  // a range of teeth
  multiSelection: any = [];

  callback: any;

  preview = false;

  printPreviewPositionChange = 190;

  // object containing data for print preview
  treatmentData: any = {};

  // observer to consume click events
  observer: any;

  // flag to turn the observer on or off
  observerActivated = false;

  arrayRange: any = [];
  minimo = 0;
  maximo = 0;
  state = 0;
  statetext = 0;

  state2 = 0;
  state3 = 0;
  result: any = [];

  piezaId: any;
  codigoSuperficieDentaria: any;
  pieza: any;
  hallazgo: any;
  listaHallazgos = LISTA_HALLAZGOS_SELECCIONAR;

  textBoxClicked = false;
  textSelected: any;
  seleccion = 0;

  constructor(
    private odontogramaService?: OdontogramaService,
    private dialog?: MatDialog
  ) {}

  setCanvas(canvas: any) {
    this.canvas = canvas;
    this.renderer.init(this.canvas);
  }

  getXpos(event: any) {
    var boundingRect = this.canvas.getBoundingClientRect();

    return Math.round(event.clientX - boundingRect.left);
  }

  getYpos(event: any) {
    var boundingRect = this.canvas.getBoundingClientRect();

    return Math.round(event.clientY - boundingRect.top);
  }

  init(valor: any) {
    this.collisionHandler.setConstants(this.constants);

    // set up the odontograma
    this.odontogramaGenerator.setEngine(this);

    this.odontogramaGenerator.setSettings(this.settings);

    this.odontogramaGenerator.setConstants(this.constants);

    this.odontogramaGenerator.prepareOdontogramaAdult(
      this.odontAdult,
      this.odontSpacesAdult,
      this.canvas,
      valor
    );

    this.odontogramaGenerator.prepareOdontogramaChild(
      this.odontChild,
      this.odontSpacesChild,
      this.canvas,
      valor
    );

    this.mouth = this.odontAdult;

    this.spaces = this.odontSpacesAdult;
  }

  update() {
    this.renderer.clear(this.settings);

    if (!this.preview) {
      // render the teeth
      this.renderer.render(this.mouth, this.settings, this.constants);

      //render spaces
      this.renderer.render(this.spaces, this.settings, this.constants);

      if (this.settings.DEBUG) {
        this.renderer.renderText("DEBUG MODE", 2, 15, "#000000");

        this.renderer.renderText(
          "X: " + this.cursorX + ", Y: " + this.cursorY,
          128,
          15,
          "#000000"
        );
      }
    } else {
      this.printPreview();
    }
  }

  removeHighlight() {
    for (var i = 0; i < this.mouth.length; i++) {
      this.mouth[i].highlight = false;
    }
  }

  highlightMultiSelection(tooth: any) {
    try {

      // only highlight if we the selection is at least 1
      if (this.multiSelection.length > 0) {

          // reset the highlighting
          for (var i = 0; i < this.mouth.length; i++) {
              this.mouth[i].highlight = false;
              this.mouth[i].highlightColor = this.settings.COLOR_HIGHLIGHT;
          }

          var tooth1 = this.multiSelection[0];

          // check if these teeth are same types
          if (tooth1.type === tooth.type) {

              // get indices for both teeth
              var index1 = this.getIndexForTooth(tooth1);
              var index2 = this.getIndexForTooth(tooth);

              var begin = Math.min(index1, index2);
              var end = Math.max(index1, index2);

              // highlight the teeth between begin and end
              for (var i = begin; i <= end; i++) {

                  this.mouth[i].highlight = true;
              }

              // some damages can only have 2 items in multiselection
              if (this.selectedHallazgo === this.constants.TRANSPOSICION_LEFT) {

                  // if count of selection for this damage (max 2) then
                  // change the highlight color, to show that this selection
                  // is not allowed
                  if ((end - begin) > 1) {

                      for (var i = begin; i <= end; i++) {

                          this.mouth[i].highlightColor = this.settings.COLOR_HIGHLIGHT_BAD;
                      }
                  }

              }

          }

          // repaint
          this.update();
      }

  } catch (error) {
      console.log("Engine highlightMultiSelection e: " + error.message);
  }
  }

  printMultiSelection() {
    for (var i = 0; i < this.multiSelection.length; i++) {

      console.log("multiSelection[" + i + "]: " + this.multiSelection[i].id);

  }
  //debugger;
  /*INICIO JJALLO*/
  if (this.multiSelection.length > 0) {
      this.minimo = this.multiSelection[0].id;
      if (this.multiSelection.length > 1)
          this.maximo = this.multiSelection[this.multiSelection.length - 1].id;
      else
          this.maximo = this.minimo;

          if (this.minimo != this.maximo) {

            //var arr1 = [this.minimo, this.maximo];
            //15012024
            if (this.minimo > 10 && this.minimo < 29)
            {
                if (this.minimo > this.maximo ) {
                    if (this.minimo > 20 && this.minimo < 29 && this.minimo > 20)
                        var arr1 = [this.maximo, this.minimo];
                    else
                        var arr1 = [this.minimo, this.maximo];
                }

                else if (this.minimo < this.maximo) {
                    if (this.minimo > 20 && this.minimo < 29 && this.minimo > 20)
                        var arr1 = [this.minimo, this.maximo];
                    else if (this.minimo > 10 && this.minimo < 19 && this.maximo > 20)
                        var arr1 = [this.minimo, this.maximo];
                    else if (this.minimo > 10 && this.minimo < 19 && this.maximo < 19)
                        var arr1 = [this.maximo, this.minimo];
                }
            }

            if (this.minimo > 30 && this.minimo < 49) {
                if (this.minimo > this.maximo && this.minimo > 40)
                    var arr1 = [this.minimo, this.maximo];
                else if (this.minimo < this.maximo && this.minimo > 40)
                    var arr1 = [this.maximo, this.minimo];
                else if (this.minimo < this.maximo && this.minimo > 30) {
                    if (this.minimo > 30 && this.minimo < 39 && this.maximo > 40)
                        var arr1 = [this.maximo, this.minimo];
                    else
                        var arr1 = [this.minimo, this.maximo];
                }
                else if (this.minimo > this.maximo && this.minimo > 30)
                    var arr1 = [this.maximo, this.minimo];
            }

            if (this.minimo > 50 && this.minimo < 66) {
              if (this.minimo > this.maximo) {
                  if (this.minimo > 60 && this.minimo < 66 && this.minimo > 60)
                      var arr1 = [this.maximo, this.minimo];
                  else
                      var arr1 = [this.minimo, this.maximo];
              }
              else if (this.minimo < this.maximo) {
                  if (this.minimo > 60 && this.minimo < 66 && this.minimo > 60)
                      var arr1 = [this.minimo, this.maximo];
                  else if (this.minimo > 50 && this.minimo < 56 && this.maximo > 60)
                      var arr1 = [this.minimo, this.maximo];
                  else if (this.minimo > 50 && this.minimo < 56 && this.maximo < 56)
                      var arr1 = [this.maximo, this.minimo];
              }
          }

          if (this.minimo > 70 && this.minimo < 86) {
              if (this.minimo > this.maximo && this.minimo > 80)
                  var arr1 = [this.minimo, this.maximo];
              else if (this.minimo < this.maximo && this.minimo > 80)
                  var arr1 = [this.maximo, this.minimo];
              else if (this.minimo < this.maximo && this.minimo > 70) {
                  if (this.minimo > 70 && this.minimo < 76 && this.maximo > 80)
                      var arr1 = [this.maximo, this.minimo];
                  else
                      var arr1 = [this.minimo, this.maximo];
              }
              else if (this.minimo > this.maximo && this.minimo > 70)
                  var arr1 = [this.maximo, this.minimo];
          }
            //

            var valor = 0;
            for (var i = 0; i < this.arrayRange.length; i++) {
                if (this.arrayRange[i][0] == this.minimo && this.arrayRange[i][1] == this.maximo) {
                    valor = 1;
                    this.seleccion = 1;//27122023
                    delete this.arrayRange[i][0];
                    delete this.arrayRange[i][1];
                } else if (this.arrayRange[i][0] == this.maximo && this.arrayRange[i][1] == this.minimo) {
                    valor = 1;
                    this.seleccion = 1;//27122023
                    delete this.arrayRange[i][0];
                    delete this.arrayRange[i][1];
                }
            }

            if (valor == 0) {
                this.arrayRange.push(arr1);
            }
        }
  }
  }

  resetMultiSelect() {
    this.selectedHallazgo = "0";
    this.multiSelect = false;
    this.multiSelection.length = 0;
    this.removeHighlight();
    this.update();
  }

  getIndexForTooth(tooth: any) {
    var index = -1;

    for (var i = 0; i < this.mouth.length; i++) {
      if (this.mouth[i].id == tooth.id) {
        index = i;
        break;
      }
    }

    return index;
  }

  handleMultiSelection() {
    // only handle multiselect when 2 teeth have been selected
    // start and end
    if (this.multiSelection.length === 2) {

      var tooth1 = this.multiSelection[0];
      var tooth2 = this.multiSelection[1];

      // get the indices for the teeth which have been selected
      var index1 = this.getIndexForTooth(tooth1);
      var index2 = this.getIndexForTooth(tooth2);

      var valid = true;

      // make sure that we dont select the same tooth 2 times
      if(index1 === index2) {
          valid = false;
      }

      // make sure that both teeth are same type, upper or lower mouth
      if(tooth1.type !== tooth2.type) {
          valid = false;
      }

      // only toggle damages if everyhting is okey
      if (valid) {

          var start = Math.min(index1, index2);
          var end = Math.max(index1, index2);

          // check which damage should be added or removed from the selected
          // teeth
          var acumulador = 0; //29112023
          //debugger;
          if (this.selectedHallazgo === this.constants.ORTODONTICO_FIJO_END) {

              this.mouth[start].toggleDamage(this.constants.ORTODONTICO_FIJO_END, this.constants);
              this.mouth[end].toggleDamage(this.constants.ORTODONTICO_FIJO_END,this.constants);

              for (var i = start + 1; i <= end - 1; i++) {
                  this.mouth[i].toggleDamage(this.constants.ORTODONTICO_FIJO_CENTER,this.constants);
              }

              //29112023
              for (var i = start; i < end; i++) acumulador += 1;
              if (acumulador === 1) this.mouth[end].toggleDamage(this.constants.ORTODONTICO_FIJO_CENTER, this.constants,undefined,undefined,undefined,1);
              //


          } else if (this.selectedHallazgo === this.constants.PROTESIS_FIJA_LEFT) {

              this.mouth[start].toggleDamage(this.constants.PROTESIS_FIJA_RIGHT,
                      this.constants);

              this.mouth[end].toggleDamage(this.constants.PROTESIS_FIJA_LEFT,
                      this.constants);

              for (var i = start + 1; i <= end - 1; i++) {

                  this.mouth[i].toggleDamage(this.constants.PROTESIS_FIJA_CENTER,
                          this.constants);

              }

          } else if (this.selectedHallazgo === this.constants.TRANSPOSICION_LEFT) {

              if (end - start === 1) {

                  this.mouth[start].toggleDamage(this.constants.TRANSPOSICION_LEFT,
                          this.constants);

                  this.mouth[end].toggleDamage(this.constants.TRANSPOSICION_RIGHT,
                          this.constants);
              }

          } else if (this.selectedHallazgo === this.constants.ORTONDICO_REMOVIBLE) {
              for (var i = start; i <= end; i++) {
                  this.mouth[i].toggleDamage(this.constants.ORTONDICO_REMOVIBLE, this.constants);
              }
          }

      }

      // reset multiselection when it is finished
      this.multiSelection.length = 0;

      this.removeHighlight();

      this.update();
  }
  }

  addToMultiSelection(tooth: any) {
    this.multiSelection.push(tooth);

    this.printMultiSelection();

    if (this.multiSelection.length == 2) {
      this.handleMultiSelection();
    }
  }

  isAlphanumeric(input: any) {
    var valid = false;

    var letters = /^[0-9a-zA-Z]+$/;

    if (input.match(letters)) {
      valid = true;
    }

    return valid;
  }

  setTextToTextBox(textBox: any, text: any, text2?: any, text3?: any) {
    if (text !== null ) {
      if (text.length < 4) {

          if (this.isAlphanumeric(text)) {
              //textBox.setNote(text);
              /*jjallo 11092020*/
              if (textBox.enumerador == 1) {
                  textBox.setNote(text);
              }
              if (textBox.enumerador == 2) {
                  textBox.setNote(text);
                  if(text2!= undefined)  textBox.setNote(text2);
              }
              if (textBox.enumerador == 3) {
                  textBox.setNote(text);
                  if (text3 != undefined) textBox.setNote(text3);
              }

          } else if (text === "") {
              //textBox.setNote(text);
              /*jjallo 11092020*/
              if (textBox.enumerador == 1) {
                  textBox.setNote(text);
              }
              if (textBox.enumerador == 2) {
                  textBox.setNote(text);
                  if (text2 != undefined) textBox.setNote(text2);
              }
              if (textBox.enumerador == 3) {
                  textBox.setNote(text);
                  if (text3 != undefined) textBox.setNote(text3);
              }
          }
      }
  }
  }

  onTextBoxClicked = function (textBox) {
    // const temp = _.cloneDeep(textBox);
    if (!this.observerActivated) {
      if (this.hallazgo.tipoSigla == !"S" || this.hallazgo.tipoSigla === "A")
        return;
      this.odontogramaService
        .cargarSiglas(this.hallazgo.codigo, "T")
        .subscribe((siglas: any) => {
          if (textBox.text) {
            const sigla = siglas.find((f) => f.descripcion === textBox.text);
            if (sigla) {
              this.openModal(textBox, siglas);
            }
            return;
          } else {
            this.openModal(textBox, siglas);
          }
        });
    }
  }

  // onTextBoxClicked = function (textBox) {
  //   if (!this.observerActivated) {
  //       var message = "Escribe C\u00F3digo Dental. Max. 3 letras.";

  //       var text = prompt(message, "");
  //       console.log('onTextBoxClicked', textBox);
  //       setTimeout(function() {
  //         this.setTextToTextBox(textBox, text);
  //       }, 1500);
  //   }
  // };

  async openDialog(siglas): Promise<number> {
    const dialogRef = this.dialog.open(OdontogramModalHallazgoComponent, {
      width: "500px",
      data: { siglas, }
    });

    return dialogRef.afterClosed()
      .toPromise() // here you have a Promise instead an Observable
      .then(sigla => {
         console.log("The dialog was closed " + sigla);
         var text = sigla.sigla.descripcion === "<SIN SIGLA>" ? "" : sigla.sigla.descripcion;
         return Promise.resolve(text); // will return a Promise here
      });
   }

  openModal(textBox: any, siglas) {
    const dialogRef = this.dialog.open(OdontogramModalHallazgoComponent, {
      width: "600px",
      data: {
        siglas,
      },
    });
    dialogRef.afterClosed().subscribe((sigla) => {
      this.textBoxClicked = false;
      if (sigla) {
        var text = sigla.sigla.descripcion === "<SIN SIGLA>" ? "" : sigla.sigla.descripcion;
        this.setTextToTextBox(textBox, text);
      }
    });
  }

  mouseRightClickSpace(event: any) {
    var shouldUpdate = false;

    for (var i = 0; i < this.spaces.length; i++) {
      // check collision for current space
      if (
        this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))
      ) {
        this.spaces[i].popDamage();

        shouldUpdate = true;
      }
    }

    // only update if something new has occurred
    if (shouldUpdate) {
      this.update();
    }
  }

  mouseRightClickTooth(event: any) {
    var texto = "";
    var id = "";
    var inicio = 0;
    var fin = 0;

    if (this.mouth.length > 61) fin = 32; else fin = 20;
    /**/

    var shouldUpdate = false;

    // loop through all teeth
    for (var i = 0; i < this.mouth.length; i++) {
      var codID;

      if (this.mouth[i].textBox.rect.checkCollision(this.getXpos(event), this.getYpos(event))) {
        if (this.selectedHallazgo === this.constants.IMPLANTE) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.IMPLANTE) {
                  var valor = this.mouth[i].damages[j].statetext

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                  }
                  codID = this.mouth[i].damages[j].id;
                  this.mouth[i].toggleDamageState(codID, undefined, this.mouth[i].textBox.statetext);
                  break;
              }
          }
      }

      if (this.selectedHallazgo === this.constants.CORONA_DEFINITIVA) { //|| this.constants.PULPAR 04042023
          //debugger;
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.CORONA_DEFINITIVA) {//|| this.mouth[i].damages[j].id === this.constants.PULPAR 04042023
                  var valor = this.mouth[i].damages[j].statetext

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                  }
                  codID = this.mouth[i].damages[j].id;
                 // console.log('corona'+codID);

                  this.mouth[i].toggleDamageState(codID, undefined, this.mouth[i].textBox.statetext);
                  break;
              }
          }
      }

      //04122023
      if (this.selectedHallazgo === this.constants.PULPAR) { //|| this.constants.PULPAR 04042023
          //debugger;
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.PULPAR) {//|| this.mouth[i].damages[j].id === this.constants.PULPAR 04042023
                  var valor = this.mouth[i].damages[j].statetext

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                  }
                  codID = this.mouth[i].damages[j].id;
                  // console.log('corona'+codID);

                  this.mouth[i].toggleDamageState(codID, undefined, this.mouth[i].textBox.statetext);
                  break;
              }
          }
      }
      }

      if (
        this.mouth[i].rect.checkCollision(
          this.getXpos(event),
          this.getYpos(event)
        )
      ) {
        if (this.selectedHallazgo === this.constants.ORTODONTICO_FIJO_END) {
          var cadena = "";
          for (var x = 0; x < this.arrayRange.length; x++) {
              if (this.arrayRange[x][0] != '' && this.arrayRange[x][0] != undefined) {
                  cadena = cadena + this.arrayRange[x][0] + "-";
                  cadena = cadena + this.arrayRange[x][1] + ",";
              }
          }

          var ArregloEntero = [];
          if (cadena != "") {
              var arrayDeCadenas = cadena.split(",");
              for (var k = 0; k < arrayDeCadenas.length; k++) {
                  if (arrayDeCadenas[k] != "") {
                      var Array2 = arrayDeCadenas[k].split("-");
                      var arr1 = Array2[0];
                      var arr2 = Array2[1];
                      if (arr1 > arr2) {
                          valorArr = [arr1, arr2];
                      } else {
                          valorArr = [arr1, arr2];
                      }
                      ArregloEntero.push(valorArr);
                  }
              }
          }

          var mouth_copia = [];
          var rango = [];
          var lista = new Array();
          var mouth = [];

          var encontrar = 0;
          for (var y = 0; y < ArregloEntero.length; y++) {
              for (var x = 0; x < this.mouth.slice(0, fin).length; x++) {
                  if (this.mouth[x].id == ArregloEntero[y][0]) encontrar = 1;
                  if (encontrar == 1) {
                      lista.push(this.mouth[x]);
                      if (encontrar == 1 && this.mouth[x].id == ArregloEntero[y][1]) {
                          encontrar = 2;
                          rango.push(lista);
                          lista = [];
                          break
                      }
                  }
              }
          }

          for (var l = 0; l < rango.length; l++) {
              for (var m = 0; m < rango[l].length; m++) {
                  for (var b = 0; b < rango[l][m].damages.length; b++) {
                      if (this.mouth[i].id == rango[l][m].id && (rango[l][m].damages[b].id == this.constants.ORTODONTICO_FIJO_END || rango[l][m].damages[b].id == this.constants.ORTODONTICO_FIJO_CENTER)) {
                          //debugger;
                          mouth_copia.push(rango[l]);
                          break;
                      }
                  }
              }
          }

          // for (var e = 0; e < mouth_copia.length; e++) {
          //     for (var h = 0; h < mouth_copia[e].length; h++) {
          //         mouth.push(mouth_copia[e][h]);
          //     }
          // }

          //12012024
          var count=0;
          var cantidad_hallazgo;
          for (var e = 0; e < mouth_copia.length; e++) {
              if (count === cantidad_hallazgo) break;
              count = 0;
              cantidad_hallazgo = 0;
              for (var h = 0; h < mouth_copia[e].length; h++) {

                  for (var x = 0; x < mouth_copia[e][h].damages.length; x++) {
                     if (mouth_copia[e][h].damages[x].id == this.constants.ORTODONTICO_FIJO_END || mouth_copia[e][h].damages[x].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                          count = count + 1;
                          mouth.push(mouth_copia[e][h]);
                      }
                  }

                  cantidad_hallazgo = cantidad_hallazgo + 1;

              }

              if (count !== cantidad_hallazgo)
                  // mouth.splice(e, cantidad_hallazgo);
                  mouth.splice( cantidad_hallazgo);

          }
          //


          if (encontrar == 2) {
              for (var m = 0; m <= mouth.length - 1; m++) {
                //for (var n = 0; n < this.mouth.slice(0, fin).length; n++) {
                //if (this.mouth[i].id == mouth[m].id) {
                //if (this.mouth[n].damages.length > 1) {
                //if (this.mouth[i].damages.length > 1) {
                    //for (var y = 0; y < this.mouth[n].damages.length; y++) {
                    for (var y = 0; y < mouth[m].damages.length; y++) {
                        //if (this.mouth[n].damages[y].id == this.constants.ORTODONTICO_FIJO_END) {
                        if (mouth[m].damages[y].id == this.constants.ORTODONTICO_FIJO_END) {
                            //this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                            mouth[m].toggleDamageState(mouth[m].damages[y].id);
                            //break;
                              }
                        //if (this.mouth[n].damages[y].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                        if (mouth[m].damages[y].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                            //this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                            mouth[m].toggleDamageState(mouth[m].damages[y].id);
                            //break;
                          }
                      }
                    //} else {
                    //this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                    //break;
                    // }
                    //}
                    //}
                  //}
              }
          }


          /**
             var cadena = "";
          for (var x = 0; x < this.arrayRange.length; x++) {
              cadena = cadena + this.arrayRange[x][0] + "-";
              cadena = cadena + this.arrayRange[x][1] + ",";
          }

          var ArregloEntero = [];
          if (cadena != "") {
              var arrayDeCadenas = cadena.split(",");
              for (var k = 0; k < arrayDeCadenas.length; k++) {
                  if (arrayDeCadenas[k] != "") {
                      var Array2 = arrayDeCadenas[k].split("-");

                      var arr1 = Array2[0];
                      var arr2 = Array2[1];
                      var valorArr = [];
                      if (arr1 > arr2) {
                          valorArr = [arr2, arr1];
                      } else {
                          valorArr = [arr1, arr2];
                      }
                      ArregloEntero.push(valorArr);
                  }
              }
          }

          for (var l = 0; l < ArregloEntero.length; l++) {
              var encontrar = 0;
              for (var m = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                  if (this.mouth[i].id == m) {
                      encontrar = 1;
                      break;
                  }
              }

              if (encontrar == 1) {
                  for (var m = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                      //for (var n = 0; n < this.mouth.length; n++) {
                      for (var n = 0; n < this.mouth.slice(0, fin).length; n++) { //jjallo 11092020
                          if (this.mouth[n].id == m) {
                              if (this.mouth[n].damages.length > 1) {
                                  for (var y = 0; y < this.mouth[n].damages.length; y++) {
                                      if (this.mouth[n].damages[y].id == this.constants.ORTODONTICO_FIJO_END) {
                                          this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                          break;
                                      }
                                      if (this.mouth[n].damages[y].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                                          this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                          break;
                                      }
                                  }
                              } else {
                                  this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                              }
                          }
                      }
                  }
              }
          }
          */
      }
      //

      //08112023
      if (this.selectedHallazgo === this.constants.ORTONDICO_REMOVIBLE) {
        //debugger;
        var cadena = "";
        for (var x = 0; x < this.arrayRange.length; x++) {
            if (this.arrayRange[x][0] != '' && this.arrayRange[x][0] != undefined) {
                cadena = cadena + this.arrayRange[x][0] + "-";
                cadena = cadena + this.arrayRange[x][1] + ",";
            }
        }

        var ArregloEntero = [];
        if (cadena != "") {
            var arrayDeCadenas = cadena.split(",");
            for (var k = 0; k < arrayDeCadenas.length; k++) {
                if (arrayDeCadenas[k] != "") {
                    var Array2 = arrayDeCadenas[k].split("-");
                    var arr1 = Array2[0];
                    var arr2 = Array2[1];
                    var valorArr = [];
                    if (arr1 > arr2) {
                        //13012024
                        /*if (parseInt(arr1) > 10 && parseInt(arr1) < 19)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 20 && parseInt(arr1) < 29)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 40 && parseInt(arr1) < 49)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 30 && parseInt(arr1) < 39)
                            valorArr = [arr2, arr1];

                        if (parseInt(arr1) > 50 && parseInt(arr1) < 56)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 60 && parseInt(arr1) < 66)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 80 && parseInt(arr1) < 86)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 70 && parseInt(arr1) < 76)
                            valorArr = [arr2, arr1];*/
                        //
                        valorArr = [arr1, arr2];
                    } else {
                        //13012024
                        /*if (parseInt(arr1) > 10 && parseInt(arr1) < 19)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 20 && parseInt(arr1) < 29)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 40 && parseInt(arr1) < 49)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 30 && parseInt(arr1) < 39)
                            valorArr = [arr1, arr2];

                        if (parseInt(arr1) > 50 && parseInt(arr1) < 56)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 60 && parseInt(arr1) < 66)
                            valorArr = [arr1, arr2];
                        if (parseInt(arr1) > 80 && parseInt(arr1) < 86)
                            valorArr = [arr2, arr1];
                        if (parseInt(arr1) > 70 && parseInt(arr1) < 76)
                            valorArr = [arr1, arr2];*/
                        //
                        valorArr = [arr1, arr2];
                    }
                    ArregloEntero.push(valorArr);
                }
            }
        }

        var mouth_copia = [];
        var rango = [];
        var lista = new Array();
        var mouth = [];

        encontrar = 0;
        for (var y = 0; y < ArregloEntero.length; y++) {
            for (var x = 0; x < this.mouth.slice(0, fin).length; x++) {
                if (this.mouth[x].id == ArregloEntero[y][0]) encontrar = 1;
                if (encontrar == 1) {
                    lista.push(this.mouth[x]);
                    if (encontrar == 1 && this.mouth[x].id == ArregloEntero[y][1]) {
                        encontrar = 2;
                        rango.push(lista);
                        lista = [];
                        break
                    }
                }
            }
        }

        for (var l = 0; l < rango.length; l++) {
            for (var m = 0; m < rango[l].length; m++) {
                for (var b = 0; b < rango[l][m].damages.length; b++) {
                    if (this.mouth[i].id == rango[l][m].id && (rango[l][m].damages[b].id == this.constants.ORTONDICO_REMOVIBLE)) {
                        mouth_copia.push(rango[l]);
                        break;
                    }
                }
            }
        }

        //12042024
        var count=0;
        var cantidad_hallazgo;
        for (var e = 0; e < mouth_copia.length; e++) {
            if (count === cantidad_hallazgo) break;
            count = 0;
            cantidad_hallazgo = 0;
            for (var h = 0; h < mouth_copia[e].length; h++) {

                for (var x = 0; x < mouth_copia[e][h].damages.length; x++) {
                    if (mouth_copia[e][h].damages[x].id == this.constants.ORTONDICO_REMOVIBLE) {
                        count = count + 1;
                        mouth.push(mouth_copia[e][h]);
                    }
                }

                cantidad_hallazgo = cantidad_hallazgo + 1;

            }

            if (count !== cantidad_hallazgo)
                mouth.splice(e, cantidad_hallazgo);

        }
        //

        //26122023
        if (encontrar == 2) {
            for (var m = 0; m <= mouth.length - 1; m++) {
                /*for (var n = 0; n < this.mouth.slice(0, fin).length; n++) {
                    if (this.mouth[n].id == mouth[m].id) {
                            if (this.mouth[n].damages.length > 1) {
                                for (var y = 0; y < this.mouth[n].damages.length; y++) {
                                    if (this.mouth[n].damages[y].id == this.constants.ORTONDICO_REMOVIBLE) {
                                        this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                        break;
                                    }
                                }
                            } else {
                                this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                                break;
                            }
                        }
                    }*/


                for (var y = 0; y < mouth[m].damages.length; y++) {
                    if (mouth[m].damages[y].id == this.constants.ORTONDICO_REMOVIBLE)
                        mouth[m].toggleDamageState(mouth[m].damages[y].id);
                }
            }
        }
        //
    }
      //




      if (this.selectedHallazgo == this.constants.IMPLANTE) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.IMPLANTE) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;//05122023

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].damages[j].state = 0; //05122023
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].damages[j].state = 1; //05122023
                  }

                  //05122023
                  if (this.mouth[i].textBox.hallazgo === this.constants.IMPLANTE) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  //

                  if (this.mouth.length > 60) {
                      for (var y = 32; y < this.mouth.length; y++) {
                          if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                              if (this.mouth[y].textBox.hallazgo === this.constants.IMPLANTE) {
                                  this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                  this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[i].damages[j].indicador = 'R';
                              }
                          }
                          if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                              if (this.mouth[y].textBox.hallazgo === this.constants.IMPLANTE) {
                                  this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                  this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[i].damages[j].indicador = 'R';
                              }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  this.mouth[k].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[k].textBox.hallazgo = this.mouth[i].damages[j].id;
                                  this.mouth[k].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[i].damages[j].indicador = 'R';
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  this.mouth[k].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[k].textBox.hallazgo = this.mouth[i].damages[j].id;
                                  this.mouth[k].textBox.statetext = this.mouth[i].damages[j].state;
                                  this.mouth[i].damages[j].indicador = 'R';
                              }
                          }
                      }
                  }
                  //


                  break;
              }
          }
      }

      //06122023
    //   if (this.selectedHallazgo == this.constants.IMPACTACION) {
    //       for (var j = 0; j < this.mouth[i].damages.length; j++) {
    //           if (this.mouth[i].damages[j].id === this.constants.IMPACTACION) {
    //               var valor = this.mouth[i].damages[j].statetext
    //               this.mouth[i].damages[j].automatico = 1;

    //               if (this.mouth[i].damages[j].statetext === 1) {
    //                   this.mouth[i].textBox.statetext = 0;
    //                   this.mouth[i].damages[j].state = 0;
    //               }
    //               else {
    //                   this.mouth[i].textBox.statetext = 1;
    //                   this.mouth[i].damages[j].state = 1;
    //               }

    //               if (this.mouth[i].textBox.hallazgo === this.constants.IMPACTACION) {
    //                   this.mouth[i].damages[j].indicador = 'R';
    //                   this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
    //                   codID = this.mouth[i].damages[j].id;
    //               }
    //               var newArray = [];
    //               newArray = this.mouth.slice(32, 96);

    //               for (var y = 0; y < newArray.length; y++) {
    //                   if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
    //                       if (this.mouth[y].textBox.hallazgo === this.constants.IMPACTACION) {
    //                           this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
    //                           this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
    //                           this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
    //                           this.mouth[i].damages[j].indicador = 'R';
    //                       }
    //                   }
    //                   if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
    //                       if (this.mouth[y].textBox.hallazgo === this.constants.IMPACTACION) {
    //                           this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
    //                           this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
    //                           this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
    //                           this.mouth[i].damages[j].indicador = 'R';
    //                       }
    //                   }
    //               }
    //               break;
    //           }
    //       }
    //   }

      if (this.selectedHallazgo == this.constants.CORONA_TEMPORAL) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.CORONA_TEMPORAL) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].damages[j].state = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].damages[j].state = 1;
                  }

                  if (this.mouth[i].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.SUPERFICIE_DESGASTADA) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.SUPERFICIE_DESGASTADA) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].damages[j].state = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].damages[j].state = 1;
                  }

                  if (this.mouth[i].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.REMANENTE_RADICULAR) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.REMANENTE_RADICULAR) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].damages[j].state = 0;
                  }
                  else {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].damages[j].state = 1;
                  }

                  if (this.mouth[i].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.FOSAS_PROFUNDAS) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.FOSAS_PROFUNDAS) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  //if (this.mouth[i].damages[j].statetext === 1) {
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].damages[j].state = 0;
                  //}
                  //else {
                  //    this.mouth[i].textBox.statetext = 1;
                  //    this.mouth[i].damages[j].state = 1;
                  //}

                  if (this.mouth[i].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.MACRODONCIA) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.MACRODONCIA) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  //if (this.mouth[i].damages[j].statetext === 1) {
                  this.mouth[i].textBox.statetext = 0;
                  this.mouth[i].damages[j].state = 0;
                  //}
                  //else {
                  //    this.mouth[i].textBox.statetext = 1;
                  //    this.mouth[i].damages[j].state = 1;
                  //}

                  if (this.mouth[i].textBox.hallazgo === this.constants.MACRODONCIA) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.MACRODONCIA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.MACRODONCIA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.MICRODONCIA) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.MICRODONCIA) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  //if (this.mouth[i].damages[j].statetext === 1) {
                  this.mouth[i].textBox.statetext = 0;
                  this.mouth[i].damages[j].state = 0;
                  //}
                  //else {
                  //    this.mouth[i].textBox.statetext = 1;
                  //    this.mouth[i].damages[j].state = 1;
                  //}

                  if (this.mouth[i].textBox.hallazgo === this.constants.MICRODONCIA) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.MICRODONCIA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.MICRODONCIA) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }

      if (this.selectedHallazgo == this.constants.DIENTE_ECTOPICO) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.DIENTE_ECTOPICO) {
                  var valor = this.mouth[i].damages[j].statetext
                  this.mouth[i].damages[j].automatico = 1;

                  //if (this.mouth[i].damages[j].statetext === 1) {
                  this.mouth[i].textBox.statetext = 0;
                  this.mouth[i].damages[j].state = 0;
                  //}
                  //else {
                  //    this.mouth[i].textBox.statetext = 1;
                  //    this.mouth[i].damages[j].state = 1;
                  //}

                  if (this.mouth[i].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                      this.mouth[i].damages[j].indicador = 'R';
                      this.mouth[i].damages[j].statetext = this.mouth[i].textBox.statetext;
                      codID = this.mouth[i].damages[j].id;
                  }
                  var newArray = [];
                  newArray = this.mouth.slice(32, 96);

                  for (var y = 0; y < newArray.length; y++) {
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 2) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                      if (this.mouth[y].id == this.mouth[i].id && newArray[y].textBox.enumerador == 3) {
                          if (this.mouth[y].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[y].textBox.statetext = this.mouth[i].damages[j].state;
                              this.mouth[i].damages[j].indicador = 'R';
                          }
                      }
                  }
                  break;
              }
          }
      }
      //

      if (this.selectedHallazgo == this.constants.CORONA_DEFINITIVA) {//|| this.selectedHallazgo == this.constants.PULPAR 04042023
          //debugger;
          var posicion1 = 0;
          var posicion2 = 0;
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.CORONA_DEFINITIVA) {//|| this.mouth[i].damages[j].id === this.constants.PULPAR 04042023
                  this.mouth[i].textBox.statetext = 1;
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              this.mouth[k].textBox.statetext = 1;
                              posicion1 = k;
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              this.mouth[k].textBox.statetext = 1;
                              posicion2 = k;
                          }
                      }
                  }
                  else if (this.mouth.length < 61)
                  {
                   for (var k = 20; k < this.mouth.length; k++) {
                       if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                           this.mouth[k].textBox.statetext = 1;
                           posicion1 = k;
                       }
                       if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                           this.mouth[k].textBox.statetext = 1;
                           posicion2 = k;
                       }
                   }
                  }

                  this.mouth[i].damages[j].indicador = 1;
                  this.mouth[i].damages[j].state = 1;
                  codID = this.mouth[i].damages[j].id;
                  this.mouth[i].toggleDamageState(codID, undefined, this.mouth[i].textBox.statetext);
                  if (this.mouth.length > 60) {
                      this.mouth[posicion1].toggleDamageState(codID, undefined, this.mouth[posicion1].textBox.statetext);
                      this.mouth[posicion2].toggleDamageState(codID, undefined, this.mouth[posicion2].textBox.statetext);
                  }
                  else if (this.mouth.length < 61) {
                      this.mouth[posicion1].toggleDamageState(codID, undefined, this.mouth[posicion1].textBox.statetext);
                      this.mouth[posicion2].toggleDamageState(codID, undefined, this.mouth[posicion2].textBox.statetext);
                  }
                  break;
              }
          }
      }
      /**/

      //08112023
      if (this.selectedHallazgo === this.constants.PROTESIS_FIJA_LEFT) {
              //debugger;
              var cadena = "";
              for (var x = 0; x < this.arrayRange.length; x++) {
                  if (this.arrayRange[x][0] != '' && this.arrayRange[x][0] != undefined) {
                      cadena = cadena + this.arrayRange[x][0] + "-";
                      cadena = cadena + this.arrayRange[x][1] + ",";
                  }
              }

              var ArregloEntero = [];
              if (cadena != "") {
                  var arrayDeCadenas = cadena.split(",");
                  for (var k = 0; k < arrayDeCadenas.length; k++) {
                      if (arrayDeCadenas[k] != "") {
                          var Array2 = arrayDeCadenas[k].split("-");
                          var arr1 = Array2[0];
                          var arr2 = Array2[1];
                          if (arr1 > arr2) {
                              valorArr = [arr1, arr2];
                          } else {
                              valorArr = [arr1, arr2];
                          }
                          ArregloEntero.push(valorArr);
                      }
                  }
              }

              var mouth_copia = [];
              var rango = [];
              var lista = new Array();
              var mouth = [];

              encontrar = 0;
              for (var y = 0; y < ArregloEntero.length; y++) {
                  for (var x = 0; x < this.mouth.slice(0, fin).length; x++) {
                      if (this.mouth[x].id == ArregloEntero[y][0]) encontrar = 1;
                      if (encontrar == 1) {
                          lista.push(this.mouth[x]);
                          if (encontrar == 1 && this.mouth[x].id == ArregloEntero[y][1]) {
                              encontrar = 2;
                              rango.push(lista);
                              lista = [];
                              break
                          }
                      }
                  }
              }

              for (var l = 0; l < rango.length; l++) {
                  for (var m = 0; m < rango[l].length; m++) {
                      //if (this.mouth[i].id == rango[l][m].id) {
                      //    mouth_copia.push(rango[l]);
                      //    break;
                      //}
                      for (var b = 0; b < rango[l][m].damages.length; b++) {
                          if (this.mouth[i].id == rango[l][m].id && (rango[l][m].damages[b].id == this.constants.PROTESIS_FIJA_LEFT || rango[l][m].damages[b].id == this.constants.PROTESIS_FIJA_RIGHT || rango[l][m].damages[b].id == this.constants.PROTESIS_FIJA_CENTER)) {
                              mouth_copia.push(rango[l]);
                              break;
                          }
                      }
                  }
              }


              // for (var e = 0; e < mouth_copia.length; e++) {
              //     for (var h = 0; h < mouth_copia[e].length; h++) {
              //         mouth.push(mouth_copia[e][h]);
              //     }
              // }

              //12012024
              var count=0;
              var cantidad_hallazgo;
              for (var e = 0; e < mouth_copia.length; e++) {
                  if (count === cantidad_hallazgo) break;
                  count = 0;
                  cantidad_hallazgo = 0;
                  for (var h = 0; h < mouth_copia[e].length; h++) {

                      for (var x = 0; x < mouth_copia[e][h].damages.length; x++) {
                          if (mouth_copia[e][h].damages[x].id == this.constants.PROTESIS_FIJA_LEFT || mouth_copia[e][h].damages[x].id == this.constants.PROTESIS_FIJA_RIGHT || mouth_copia[e][h].damages[x].id == this.constants.PROTESIS_FIJA_CENTER) {
                              count = count + 1;
                              mouth.push(mouth_copia[e][h]);
                          }
                      }
                      cantidad_hallazgo = cantidad_hallazgo + 1;
                  }

                  //comentado 17012024
                  //if (count !== cantidad_hallazgo)
                  //    mouth.splice(e, cantidad_hallazgo);
                  //
              }
              //


              if (encontrar == 2) {
                  for (var m = 0; m <= mouth.length - 1; m++) {
                  //for (var m = 0; m <= mouth_copia.length - 1; m++) {
                  //    for (var h = 0; h <= mouth_copia[m].length - 1; h++) {
                      for (var n = 0; n < this.mouth.slice(0, fin).length; n++) {
                              if (this.mouth[n].id == mouth[m].id) {
                              //if (this.mouth[n].id == mouth_copia[m][h].id) {
                                  if (this.mouth[n].damages.length > 1) {
                                      for (var y = 0; y < this.mouth[n].damages.length; y++) {
                                          if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_LEFT) {
                                              this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                              this.mouth[n].damages[y].direction = 0;
                                              break;
                                          }
                                          if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_CENTER) {
                                              this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                              this.mouth[n].damages[y].direction = -1;
                                              break;
                                          }
                                          if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_RIGHT) {
                                              this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                              this.mouth[n].damages[y].direction = 1;
                                              break;
                                          }
                                      }
                                  } else {
                                      this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                                      break;
                                  }
                              }
                          }
                      //}
                  }
              }

          /*
          var cadena = "";
          for (var x = 0; x < this.arrayRange.length; x++) {
              cadena = cadena + this.arrayRange[x][0] + "-";
              cadena = cadena + this.arrayRange[x][1] + ",";
          }
          var ArregloEntero = [];
          if (cadena != "") {
              var arrayDeCadenas = cadena.split(",");
              for (var k = 0; k < arrayDeCadenas.length; k++) {
                  if (arrayDeCadenas[k] != "") {
                      var Array2 = arrayDeCadenas[k].split("-");
                      var arr1 = Array2[0];
                      var arr2 = Array2[1];
                      var valorArr = [];
                      if (arr1 > arr2) {
                          valorArr = [arr2, arr1];
                      } else {
                          valorArr = [arr1, arr2];
                      }
                      ArregloEntero.push(valorArr);
                  }
              }
          }
          for (var l = 0; l < ArregloEntero.length; l++) {
              var encontrar = 0;
              for (var m = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                  if (this.mouth[i].id == m) {
                      encontrar = 1;
                      break;
                  }
              }
              if (encontrar == 1) {
                  for (var m = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                          for (var n = 0; n < this.mouth.slice(0, fin).length; n++) {
                          if (this.mouth[n].id == m) {
                              if (this.mouth[n].damages.length > 1) {
                                  for (var y = 0; y < this.mouth[n].damages.length; y++) {
                                      if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_LEFT) {
                                          this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                          this.mouth[n].damages[y].direction = 0;
                                          break;
                                      }
                                      if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_CENTER) {
                                          this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                          this.mouth[n].damages[y].direction = -1;
                                          break;
                                      }
                                      if (this.mouth[n].damages[y].id == this.constants.PROTESIS_FIJA_RIGHT) {
                                          this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                          this.mouth[n].damages[y].direction = 1;
                                          break;
                                      }
                                  }
                              } else {
                                  this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                              }
                          }
                      }
                  }
              }
          }*/
      }
      //

      if (this.selectedHallazgo === this.constants.PROTESIS_REMOVIBLE) {
          for (var j = 0; j < this.mouth[i].damages.length; j++) {
              if (this.mouth[i].damages[j].id === this.constants.PROTESIS_REMOVIBLE) {
                  codID = this.mouth[i].damages[j].id;
                  this.mouth[i].toggleDamageState(codID);
                  break;
              }
          }
      }

      if (this.selectedHallazgo === this.constants.PROTESIS_TOTAL) {

           var cadena = '';

          if (this.mouth[i].id > 30 && this.mouth[i].id <= 48) {
              //cadena = "48-31";
                    //17012024
                    for (var x = 0; x < this.mouth[i].damages.length; x++) {
                      if (this.mouth[i].damages[x].id === this.constants.PROTESIS_TOTAL) {
                          cadena = "48-31";
                      }
                  }
                  //
          }
          if (this.mouth[i].id > 10 && this.mouth[i].id <= 28) {
              //cadena = "28-11";
                    //17012024
                    for (var x = 0; x < this.mouth[i].damages.length; x++) {
                      if (this.mouth[i].damages[x].id=== this.constants.PROTESIS_TOTAL)
                      {
                          cadena = "28-11";
                      }
                  }
                  //
          }
          if (this.mouth[i].id > 50 && this.mouth[i].id <= 65) {
              //cadena = "65-51";
                    //17012024
                    for (var x = 0; x < this.mouth[i].damages.length; x++) {
                      if (this.mouth[i].damages[x].id === this.constants.PROTESIS_TOTAL) {
                          cadena = "65-51";
                      }
                  }
                  //
          }

          if (this.mouth[i].id > 70 && this.mouth[i].id <= 85) {
              //cadena = "85-71";
                    //17012024
                    for (var x = 0; x < this.mouth[i].damages.length; x++) {
                      if (this.mouth[i].damages[x].id === this.constants.PROTESIS_TOTAL) {
                          cadena = "85-71";
                      }
                  }
                  //
          }

              var ArregloEntero = [];
              if (cadena != "") {
                  var arrayDeCadenas = cadena.split(",");
                  for (var k = 0; k < arrayDeCadenas.length; k++) {
                      if (arrayDeCadenas[k] != "") {
                          var Array2 = arrayDeCadenas[k].split("-");
                          var arr1 = Array2[0];
                          var arr2 = Array2[1];
                          var valorArr = [];
                          if (arr1 > arr2) {
                              valorArr = [arr2, arr1];
                          } else {
                              valorArr = [arr1, arr2];
                          }
                          ArregloEntero.push(valorArr);
                      }
                  }
              }
              for (var l = 0; l < ArregloEntero.length; l++) {
                  for (var m: number = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                      if (this.mouth[i].id == m) {
                          encontrar = 1;
                      }
                  }
                  if (encontrar == 1) {
                      for (var m: number = ArregloEntero[l][0]; m <= ArregloEntero[l][1]; m++) {
                          //for (var n = 0; n < this.mouth.length; n++) {
                              for (var n = 0; n < this.mouth.slice(0, fin).length; n++) { //jjallo 11092020
                              if (this.mouth[n].id == m) {
                                  if (this.mouth[n].damages.length > 1) {
                                      for (var y = 0; y < this.mouth[n].damages.length; y++) {
                                          if (this.mouth[n].damages[y].id == this.constants.PROTESIS_TOTAL) {
                                              this.mouth[n].toggleDamageState(this.mouth[n].damages[y].id);
                                              this.mouth[n].damages[y].direction = 0;
                                              break;
                                          }
                                      }
                                  } else {
                                    this.mouth[n].toggleDamageState(this.mouth[n].damages[0].id);
                                  }
                              }
                          }
                      }
                  }

              }
      }


        shouldUpdate = true;
      }
      /*FIN JJALLO*/

      //comprobar si hay una colisi�n con una de las superficies de los dientes
      for (var j = 0; j < this.mouth[i].checkBoxes.length; j++) {
        // console.log('id'+ this.mouth[i].id);
        /* for (var n = 0; n < this.mouth[i].damages.length; n++) {
            }*/

        // console.log('aqui esta entrando solo para pintar los textbox');

        if (
          this.mouth[i].checkBoxes[j].checkCollision(
            this.getXpos(event),
            this.getYpos(event)
          )
        ) {
          //   console.log('aqui esta entrando solo para pintar los checkBoxes');
          // handle collision with surface

          /*jjallo 11092020*/
          if (this.mouth[i].checkBoxes[j].state == 1)
            this.mouth[i].checkBoxes[j].state = -1;
          else if (this.mouth[i].checkBoxes[j].state == 11)
            this.mouth[i].checkBoxes[j].state = -11;
          else if (this.mouth[i].checkBoxes[j].state == 39)
            this.mouth[i].checkBoxes[j].state = -39;
          //else if (this.mouth[i].checkBoxes[j].state == 40) this.mouth[i].checkBoxes[j].state = -40;
          //else if (this.mouth[i].checkBoxes[j].state == 46) this.mouth[i].checkBoxes[j].state = -46;
          // /**/ else this.mouth[i].checkBoxes[j].state = 0;

          else
                {
                    if(this.mouth[i].checkBoxes[j].state !== this.constants.SELLANTES || this.mouth[i].checkBoxes[j].state !== this.constants.PULPOTOMIA)
                        this.mouth[i].checkBoxes[j].state = 0;
                }

          if (this.mouth[i].textBox.hallazgo === this.constants.CARIES) {
            this.mouth[i].textBox.text = ""
            this.mouth[i].textBox.statetext = 0;
            this.mouth[i].textBox.hallazgo = 0;
          }
          if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
              this.mouth[i].textBox2.text = ""
              this.mouth[i].textBox2.statetext = 0;
              this.mouth[i].textBox2.hallazgo = 0;
          }
          if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
              this.mouth[i].textBox3.text = ""
              this.mouth[i].textBox3.statetext = 0;
              this.mouth[i].textBox3.hallazgo = 0;
          }

          if (this.mouth.length > 20) {
            var newArray_ = [];
            newArray_ = this.mouth;//.slice(20, 60);
            var contador = 0;
            for (var n = 20; n < newArray_.length; n++) {
                if (this.mouth[i].id == newArray_[n].id) {
                    if (contador === 0) {
                        //this.mouth[i].textBox2.state2 = parseInt(newArray_[n].textBox.state2);
                        //this.mouth[i].textBox2.statetext = parseInt(newArray_[n].textBox.statetext);
                        //this.mouth[i].textBox2.text = newArray_[n].textBox.text;
                        //this.mouth[i].textBox2.hallazgo = newArray_[n].textBox.hallazgo;
                        if (this.mouth[n].textBox.hallazgo === this.constants.CARIES) {
                            this.mouth[n].textBox.state2 = 0;
                            this.mouth[n].textBox.statetext = 0;
                            this.mouth[n].textBox.text = '';
                            this.mouth[n].textBox.hallazgo = 0;
                        }
                    }
                    if (contador === 1) {
                        if (this.mouth[n].textBox.hallazgo === this.constants.CARIES) {
                            this.mouth[n].textBox.state3 = 0;
                            this.mouth[n].textBox.statetext = 0;
                            this.mouth[n].textBox.text = '';
                            this.mouth[n].textBox.hallazgo = 0;
                        }
                    }
                    contador++;
                }
            }
        }

          shouldUpdate = true;
        }
      }
    }

    /*jjallo 11092020*/
    for (var i = 0; i < this.mouth.length; i++) {
      if (this.mouth[i].id == id) {
        if (this.mouth[i].textBox.text == "") {
          this.mouth[i].textBox.text = texto;
          this.mouth[i].state = 1;
        } else if (this.mouth[i].textBox2.text == "") {
          this.mouth[i].textBox2.text = texto;
          this.mouth[i].state2 = 1;
        } else if (this.mouth[i].textBox3.text == "") {
          this.mouth[i].textBox3.text = texto;
          this.mouth[i].state3 = 1;
        }
        break;
      }
    }
    /**/
    //console.log('engine.this');
    // console.log(this);

    // only update if something new has occurred
    if (shouldUpdate) {
      this.update();
    }
  }

  mouseClickSpaces(event: any) {
    console.log('aca entra')
    var shouldUpdate = false;

    for (var i = 0; i < this.spaces.length; i++) {
      // check collision for current space
      if (
        this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))
      ) {
        this.collisionHandler.handleCollision(
          this.spaces[i],
          this.selectedHallazgo
        );

        shouldUpdate = true;
      }
    }

    // only update if something new has occurred
    if (shouldUpdate) {
      this.update();
    }
  }

  async mouseClickTeeth(event: any) {
    console.log('entra click')
    var shouldUpdate = false;
    var texto = "";
    var id = "";
    var opcion = "";
    var contador = 0;

    //21112023
    var contador: number;
    if (this.mouth.length > 60) {
      for (var x = 0; x < this.mouth.length; x++) {
          if (x < 32) {
              contador = 0;
              for (var z = 32; z < this.mouth.length; z++) {
                  if (contador === 2) break;
                  if (this.mouth[z].id === this.mouth[x].id) {
                      if (this.mouth[x].damages.length > 0) {
                          /*comentado 30112023
                          if (contador === 0) this.mouth[x].textBox2.text = this.mouth[z].textBox.text
                          if (contador === 1) this.mouth[x].textBox3.text = this.mouth[z].textBox.text
                          */
                          //30112023
                          if (contador === 0) {
                              this.mouth[x].textBox2.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox2.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox2.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox2.statetext = this.mouth[z].textBox.statetext;
                          }
                          if (contador === 1) {
                              this.mouth[x].textBox3.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox3.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox3.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox3.statetext = this.mouth[z].textBox.statetext;
                          }
                          //
                          contador++;
                      }
                  }
              }
          }
      }
  }
    //
    var contador1: any;
    if (this.mouth.length <= 60) {
      for (var x = 0; x < this.mouth.length; x++) {
          if (x < 20) {
              contador1 = 0;
              for (var z = 20; z < this.mouth.length; z++) {
                  if (contador1 === 2) break;
                  if (this.mouth[z].id === this.mouth[x].id) {
                      if (this.mouth[x].damages.length > 0) {

                          /*comentado 04122023
                          if (contador1 === 0) {
                              this.mouth[x].textBox2.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox2.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox2.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox2.statetext = this.mouth[z].textBox.statetext;
                          }
                          if (contador1 === 1) {
                              this.mouth[x].textBox3.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox3.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox3.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox3.statetext = this.mouth[z].textBox.statetext;
                          }
                          */

                          //30112023
                          if (contador1 === 0) {
                              this.mouth[x].textBox2.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox2.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox2.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox2.statetext = this.mouth[z].textBox.statetext;
                          }
                          if (contador1 === 1) {
                              this.mouth[x].textBox3.enumerador = this.mouth[z].textBox.enumerador;
                              this.mouth[x].textBox3.hallazgo = this.mouth[z].textBox.hallazgo;
                              this.mouth[x].textBox3.text = this.mouth[z].textBox.text;
                              this.mouth[x].textBox3.statetext = this.mouth[z].textBox.statetext;
                          }
                          //


                          contador1++;
                      }
                  }
              }
          }
      }
  }

    for (var i = 0; i < this.mouth.length; i++) {
      // check if there is a collision with the textBox
      if (
        this.mouth[i].textBox.rect.checkCollision(
          this.getXpos(event),
          this.getYpos(event)
        )
      ) {
        const siglas = await this.odontogramaService.cargarSiglas(this.hallazgo.codigo, "T").toPromise();
        const result = await this.openDialog(siglas);
        if (this.hallazgo.tipoSigla == !"S" || this.hallazgo.tipoSigla === "A")    return;
        this.setTextToTextBox(this.mouth[i].textBox, result);
        // this.onTextBoxClicked(this.mouth[i].textBox);
        //22112023
        if (this.selectedHallazgo === this.constants.IMPLANTE && this.mouth[i].textBox.touching === true) {
          this.mouth[i].textBox.text = "";
          this.collisionHandler.handleCollision(this.mouth[i], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
          shouldUpdate = true;
      }

      if (this.selectedHallazgo === this.constants.CORONA_DEFINITIVA) {
        if (this.mouth[i].textBox.text !== '') {
            this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
            for (var y = 0; y < this.mouth.length; y++) {
                if (y < 32) {
                    if (this.mouth[y].id === this.mouth[i].id) {
                        for (var x = 0; x < this.mouth[y].damages.length; x++) {
                            if (this.mouth[y].damages[x].id === this.constants.CORONA_DEFINITIVA) {
                                if (parseInt(this.mouth[y].damages[x].indicador) === 1)
                                    this.mouth[i].textBox.statetext = parseInt(this.mouth[y].damages[x].indicador);
                                else
                                    this.mouth[i].textBox.statetext = 0;
                            }
                        }
                    }
                }
            }
        }
    }
    //

    //04122023
    if (this.selectedHallazgo === this.constants.CURACION) {
        if (this.mouth[i].textBox.text !== '') {
            this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
            for (var y = 0; y < this.mouth.length; y++) {
                if (y < 32) {
                    if (this.mouth[y].id === this.mouth[i].id)
                    {
                        for (var x = 0; x < this.mouth[y].checkBoxes.length; x++) {
                            if (this.mouth[y].checkBoxes[x].state === this.constants.CURACION) {
                                if (this.mouth[y].checkBoxes[x].clic_check === 3)
                                    this.mouth[i].textBox.statetext = this.mouth[y].checkBoxes[x].statetext;

                                if (this.mouth[y].checkBoxes[x].clic_check === 1)
                                    this.mouth[i].textBox.statetext = this.mouth[y].checkBoxes[x].statetext;
                            }
                        }
                    }
                }
            }
        }
    }
    if (this.selectedHallazgo === this.constants.PULPAR) {
        if (this.mouth[i].textBox.text !== '') {
            this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
            for (var y = 0; y < this.mouth.length; y++) {
                if (y < 32) {
                    if (this.mouth[y].id === this.mouth[i].id) {
                        for (var x = 0; x < this.mouth[y].damages.length; x++) {
                            if (this.mouth[y].damages[x].id === this.constants.PULPAR) {
                                if (parseInt(this.mouth[y].damages[x].indicador) === 1)
                                    this.mouth[i].textBox.statetext = parseInt(this.mouth[y].damages[x].indicador);
                                else
                                    this.mouth[i].textBox.statetext = 0;
                            }
                        }
                    }
                }
            }
        }
    }
    if (this.selectedHallazgo === this.constants.DIENTE_AUSENTE) {
        if (this.mouth[i].textBox.text !== '') {
            this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
            for (var y = 0; y < this.mouth.length; y++) {
                if (y < 32) {
                    if (this.mouth[y].id === this.mouth[i].id) {
                        for (var x = 0; x < this.mouth[y].damages.length; x++) {
                            if (this.mouth[y].damages[x].id === this.constants.DIENTE_AUSENTE) {
                                if (parseInt(this.mouth[y].damages[x].indicador) === 0) {
                                    //    this.mouth[i].textBox.statetext = parseInt(this.mouth[y].damages[x].indicador);
                                    //else
                                    this.mouth[i].textBox.statetext = 0;
                                    this.mouth[y].damages[x].indicador = 'E';
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    if (this.selectedHallazgo === this.constants.POSICION_DENTARIA) {
        if (this.mouth.length > 60) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                        }
                    }
                }
            }
            else {

                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.POSICION_DENTARIA) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
        if (this.mouth.length < 61) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                        }
                    }
                }
            }
            else {

                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.POSICION_DENTARIA) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
    }

    if (this.selectedHallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
        if (this.mouth.length > 60) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                            this.mouth[y].textBox.statetext = 1;
                            this.mouth[i].textBox.statetext = 1;
                        }
                    }
                }
            }
            else {
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
        if (this.mouth.length < 61) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                            this.mouth[y].textBox.statetext = 1;
                            this.mouth[i].textBox.statetext = 1;
                        }
                    }
                }
            }
            else {

                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
    }

    if (this.selectedHallazgo === this.constants.DEFECTO_ESMALTE) {
        if (this.mouth.length > 60) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                            this.mouth[y].textBox.statetext = 1;
                            this.mouth[i].textBox.statetext = 1;
                        }
                    }
                }
            }
            else {
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.DEFECTO_ESMALTE) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
        if (this.mouth.length < 61) {
            if (this.mouth[i].textBox.text !== '') {
                this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador);
                            shouldUpdate = true;
                            this.mouth[y].textBox.statetext = 1;
                            this.mouth[i].textBox.statetext = 1;
                        }
                    }
                }
            }
            else {

                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 20) {
                        if (this.mouth[y].id === this.mouth[i].id && this.mouth[i].textBox.hallazgo === this.constants.DEFECTO_ESMALTE) {
                            this.collisionHandler.handleCollision(this.mouth[y], this.selectedHallazgo, undefined, undefined, undefined, undefined, 'E');
                            shouldUpdate = true;
                            this.mouth[i].textBox.text = '';
                            this.mouth[i].textBox.hallazgo = 0;
                            this.mouth[i].textBox.statetext = 0;
                        }
                    }
                }
            }
        }
    }

    if (this.selectedHallazgo === this.constants.CARIES) {
        if (this.mouth[i].textBox.text !== '') {
            this.mouth[i].textBox.hallazgo = this.selectedHallazgo;
            this.mouth[i].textBox.statetext = 1;
        }
        else
        {
            this.mouth[i].textBox.hallazgo = 0;
            this.mouth[i].textBox.statetext = 0;
            this.mouth[i].textBox.state = 0;
        }

            //if (this.mouth.length > 20) {
            //    var newArray_ = [];
            //    newArray_ = this.mouth;
            //    contador = 0;

                /*for (var n = 20; n < newArray_.length; n++) {
                    if (this.mouth[i].id == newArray_[n].id) {
                        if (contador === 0) {
                            if (this.mouth[n].textBox.hallazgo === this.constants.CARIES) {
                                this.mouth[i].textBox.state2 = parseInt(newArray_[n].textBox.state2);
                                this.mouth[i].textBox.statetext = parseInt(newArray_[n].textBox.statetext);
                                this.mouth[i].textBox.text = newArray_[n].textBox.text;
                                this.mouth[i].textBox.hallazgo = newArray_[n].textBox.hallazgo;
                            }
                        }
                        if (contador === 1) {
                            if (this.mouth[n].textBox.hallazgo === this.constants.CARIES) {
                                this.mouth[i].textBox.state3 = parseInt(newArray_[n].textBox.state3);
                                this.mouth[i].textBox.statetext = parseInt(newArray_[n].textBox.statetext);
                                this.mouth[i].textBox.text = newArray_[n].textBox.text;
                                this.mouth[i].textBox.hallazgo = newArray_[n].textBox.hallazgo;
                            }
                        }
                        contador++;
                    }
                }*/


                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            for (var x = 0; x < this.mouth[y].damages.length; x++) {
                                if (this.mouth[y].damages[x].id === this.constants.PULPAR) {
                                    if (parseInt(this.mouth[y].damages[x].indicador) === 1)
                                        this.mouth[i].textBox.statetext = parseInt(this.mouth[y].damages[x].indicador);
                                    else
                                        this.mouth[i].textBox.statetext = 0;
                                }
                            }
                        }
                    }
                }

                for (var y = 0; y < this.mouth.length; y++) {
                    if (y < 32) {
                        if (this.mouth[y].id === this.mouth[i].id) {
                            for (var x = 0; x < this.mouth[y].damages.length; x++) {
                                if (this.mouth[y].damages[x].id === this.constants.DIENTE_AUSENTE) {
                                    if (parseInt(this.mouth[y].damages[x].indicador) === 1)
                                        this.mouth[i].textBox.statetext = parseInt(this.mouth[y].damages[x].indicador);
                                    else
                                        this.mouth[i].textBox.statetext = 0;
                                }
                            }
                        }
                    }
                }

            //}
    }
      //
      }

      // check collision for current tooth
      if (
        this.mouth[i].rect.checkCollision(
          this.getXpos(event),
          this.getYpos(event)
        )
      ) {
        if (this.multiSelect) {
          this.addToMultiSelection(this.mouth[i]);
        } else {
          console.log('mouseClickTeetheeee',this.mouth[i]);
          this.textSelected = this.mouth[i];
          if (!this.observerActivated) {
            // handle collision with tooth
            if (
              this.selectedHallazgo === this.constants.EDENTULOA_TOTAL ||
              this.selectedHallazgo === this.constants.PROTESIS_TOTAL
            ) {
              this.mouth.forEach(function (item, index) {
                  if (i < 32) {//jjallo 012024
                      if (item.type === this.mouth[i].type) this.collisionHandler.handleCollision(item, this.selectedHallazgo);
                  }//jjallo 012024
              }, this)
            } else {
              /*jjallo 11092020*/
              if (this.selectedHallazgo == this.constants.PULPAR)
                        {
                            contador = 0;//012024
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (parseInt(this.mouth[i].damages[j].indicador) == 0) {
                                        contador = 1;
                                        this.mouth[i].damages[j].indicador = 'R';
                                    }
                                    else if(parseInt(this.mouth[i].damages[j].indicador) === 1) {
                                        contador = 0;
                                        this.mouth[i].damages[j].indicador = 'E';
                                    }
                                    //else {
                                    //    contador = 0;
                                    //    this.mouth[i].damages[j].indicador = 'A';
                                    //}

                                    if (contador === 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.PULPAR) this.mouth[i].textBox.statetext = 1;
                                        if (this.mouth[i].textBox2.hallazgo === this.constants.PULPAR) this.mouth[i].textBox2.statetext = 1;
                                        if (this.mouth[i].textBox3.hallazgo === this.constants.PULPAR) this.mouth[i].textBox3.statetext = 1;
                                    }
                                    else if (contador === 0) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.PULPAR) {
                                            this.mouth[i].textBox.text = ""
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                        }
                                        if (this.mouth[i].textBox2.hallazgo === this.constants.PULPAR) {
                                            this.mouth[i].textBox2.text = ""
                                            this.mouth[i].textBox2.statetext = 0;
                                            this.mouth[i].textBox2.hallazgo = 0;
                                        }
                                        if (this.mouth[i].textBox3.hallazgo === this.constants.PULPAR) {
                                            this.mouth[i].textBox3.text = ""
                                            this.mouth[i].textBox3.statetext = 0;
                                            this.mouth[i].textBox3.hallazgo = 0;
                                        }
                                    }
                                    if (this.mouth.length > 60) {
                                        for (var k = 32; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //


                        //06122023
                        if (this.selectedHallazgo == this.constants.DIENTE_AUSENTE) {
                          contador = 0;//10012024
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].damages[j].indicador === 'E') {
                                        contador = 0;
                                        //this.mouth[i].damages[j].indicador = 'R';
                                    }
                                    //else if (parseInt(this.mouth[i].damages[j].indicador) === 1) {
                                    //    contador = 0;
                                    //    this.mouth[i].damages[j].indicador = 'E';
                                    //}
                                    else {
                                        contador = 1;
                                        //this.mouth[i].damages[j].indicador = 'A';
                                    }

                                    if (contador === 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.DIENTE_AUSENTE) this.mouth[i].textBox.statetext = 1;
                                        if (this.mouth[i].textBox2.hallazgo === this.constants.DIENTE_AUSENTE) this.mouth[i].textBox2.statetext = 1;
                                        if (this.mouth[i].textBox3.hallazgo === this.constants.DIENTE_AUSENTE) this.mouth[i].textBox3.statetext = 1;
                                    }
                                    else if (contador === 0) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                            this.mouth[i].textBox.text = ""
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                        }
                                        if (this.mouth[i].textBox2.hallazgo === this.constants.DIENTE_AUSENTE) {
                                            this.mouth[i].textBox2.text = ""
                                            this.mouth[i].textBox2.statetext = 0;
                                            this.mouth[i].textBox2.hallazgo = 0;
                                        }
                                        if (this.mouth[i].textBox3.hallazgo === this.constants.DIENTE_AUSENTE) {
                                            this.mouth[i].textBox3.text = ""
                                            this.mouth[i].textBox3.statetext = 0;
                                            this.mouth[i].textBox3.hallazgo = 0;
                                        }
                                    }
                                    if (this.mouth.length > 60) {
                                        for (var k = 32; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[i].damages[j].indicador === 'R') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 1;
                                                    }
                                                }
                                                if (this.mouth[i].damages[j].indicador === 'E') {
                                                    if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                                        this.mouth[k].textBox.statetext = 0;
                                                        this.mouth[k].textBox.text = '';
                                                        this.mouth[k].textBox.hallazgo = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //

                        if (this.selectedHallazgo == this.constants.CORONA_DEFINITIVA )
                        {
                          contador = 0;//10012024
                                var posicion1 = 0;
                                var posicion2 = 0;
                                for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                    if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                        //if (this.mouth[i].damages[j].indicador == 0)
                                        //{
                                        //    contador =1 ;
                                        //    this.mouth[i].damages[j].indicador = 'R';
                                        //}
                                        //else
                                        //{
                                        //    contador = 0;
                                        //    this.mouth[i].damages[j].indicador = 'A';
                                        //}

                                        if (parseInt(this.mouth[i].damages[j].indicador) == 0) {
                                            contador = 1;
                                            this.mouth[i].damages[j].indicador = 'R';
                                        }
                                        else if (parseInt(this.mouth[i].damages[j].indicador) === 1) {
                                            contador = 0;
                                            this.mouth[i].damages[j].indicador = 'E';
                                        }

                                        //29112023
                                        if (contador === 1)
                                        {
                                            //30112023
                                            if (this.mouth[i].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) this.mouth[i].textBox.statetext = 1;
                                            if (this.mouth[i].textBox2.hallazgo === this.constants.CORONA_DEFINITIVA) this.mouth[i].textBox2.statetext = 1;
                                            if (this.mouth[i].textBox3.hallazgo === this.constants.CORONA_DEFINITIVA) this.mouth[i].textBox3.statetext = 1;
                                            //

                                        }
                                        else if (contador === 0)
                                        {
                                            //30112023
                                            if (this.mouth[i].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                this.mouth[i].textBox.text = ""
                                                this.mouth[i].textBox.statetext = 0;
                                                this.mouth[i].textBox.hallazgo = 0;
                                            }
                                            if (this.mouth[i].textBox2.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                this.mouth[i].textBox2.text = ""
                                                this.mouth[i].textBox2.statetext = 0;
                                                this.mouth[i].textBox2.hallazgo = 0;
                                            }
                                            if (this.mouth[i].textBox3.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                this.mouth[i].textBox3.text = ""
                                                this.mouth[i].textBox3.statetext = 0;
                                                this.mouth[i].textBox3.hallazgo = 0;
                                            }
                                            //
                                        }
                                        //

                                        if (this.mouth.length > 60) {
                                            for (var k = 32; k < this.mouth.length; k++) {
                                                if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {

                                                    //21112023
                                                    if (this.mouth[i].damages[j].indicador === 'R') {
                                                        //30112023
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA)
                                                        {
                                                            this.mouth[k].textBox.statetext = 1;
                                                        }
                                                        //
                                                    }
                                                    if (this.mouth[i].damages[j].indicador === 'E') {

                                                        //30112023
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA)
                                                        {
                                                            this.mouth[k].textBox.statetext = 0;
                                                            this.mouth[k].textBox.text = '';
                                                            this.mouth[k].textBox.hallazgo = 0;
                                                        }
                                                        //
                                                    }
                                                    //

                                                }
                                                if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {

                                                    //21112023
                                                    if (this.mouth[i].damages[j].indicador === 'R') {
                                                        //30112023
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 1;
                                                        }
                                                        //
                                                    }
                                                    if (this.mouth[i].damages[j].indicador === 'E') {
                                                        //30112023
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 0;
                                                            this.mouth[k].textBox.text = '';
                                                            this.mouth[k].textBox.hallazgo = 0;
                                                        }
                                                        //
                                                    }
                                                    //

                                                }
                                            }
                                        }
                                        else if (this.mouth.length < 61) {
                                            for (var k = 20; k < this.mouth.length; k++) {
                                                if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                    //04122023
                                                    if (this.mouth[i].damages[j].indicador === 'R') {
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 1;
                                                        }
                                                    }
                                                    if (this.mouth[i].damages[j].indicador === 'E') {
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 0;
                                                            this.mouth[k].textBox.text = '';
                                                            this.mouth[k].textBox.hallazgo = 0;
                                                        }
                                                    }
                                                    //

                                                }
                                                if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                    //04122023
                                                    if (this.mouth[i].damages[j].indicador === 'R') {
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 1;
                                                        }
                                                    }
                                                    if (this.mouth[i].damages[j].indicador === 'E') {
                                                        if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                                            this.mouth[k].textBox.statetext = 0;
                                                            this.mouth[k].textBox.text = '';
                                                            this.mouth[k].textBox.hallazgo = 0;
                                                        }
                                                    }
                                                    //

                                                }
                                            }
                                        }
                                    }
                                }
                        }

                        //05122023
                        if (this.selectedHallazgo == this.constants.IMPLANTE) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.IMPLANTE) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.IMPLANTE) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.IMPLANTE) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //


                        //06122023
                        if (this.selectedHallazgo == this.constants.IMPACTACION) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.IMPACTACION) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.IMPACTACION) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.IMPACTACION) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.IMPACTACION) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.IMPACTACION) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.CORONA_TEMPORAL) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.SUPERFICIE_DESGASTADA) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.REMANENTE_RADICULAR) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.FOSAS_PROFUNDAS) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.MACRODONCIA) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.MACRODONCIA) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.MACRODONCIA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.MACRODONCIA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.MACRODONCIA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.MACRODONCIA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.MICRODONCIA) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.MICRODONCIA) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.MICRODONCIA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.MICRODONCIA) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.MICRODONCIA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.MICRODONCIA) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.selectedHallazgo == this.constants.DIENTE_ECTOPICO) {
                            for (var j = 0; j < this.mouth[i].damages.length; j++) {
                                if (this.mouth[i].damages[j].id === this.selectedHallazgo) {

                                    if (this.mouth[i].textBox.enumerador == 1) {
                                        if (this.mouth[i].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                                            this.mouth[i].textBox.text = '';
                                            this.mouth[i].textBox.statetext = 0;
                                            this.mouth[i].textBox.hallazgo = 0;
                                            this.mouth[i].damages[j].automatico = 1;
                                        }
                                    }

                                    if (this.mouth.length > 60) {
                                        for (var y = 32; y < this.mouth.length; y++) {
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                                if (this.mouth[y].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                                                    this.mouth[y].textBox.statetext = 0;
                                                    this.mouth[y].textBox.hallazgo = 0;
                                                    this.mouth[y].textBox.text = '';
                                                    this.mouth[y].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                    else if (this.mouth.length < 61) {
                                        for (var k = 20; k < this.mouth.length; k++) {
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state2 = 0;
                                                    this.mouth[i].textBox2.text = '';
                                                    this.mouth[i].textBox2.statetext = 0;
                                                    this.mouth[i].textBox2.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                            if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                                if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                                                    this.mouth[k].textBox.statetext = 0;
                                                    this.mouth[k].textBox.hallazgo = 0;
                                                    this.mouth[k].textBox.text = '';
                                                    this.mouth[k].textBox.state3 = 0;
                                                    this.mouth[i].textBox3.text = '';
                                                    this.mouth[i].textBox3.statetext = 0;
                                                    this.mouth[i].textBox3.hallazgo = 0;
                                                    this.mouth[i].damages[j].automatico = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }


              //this.collisionHandler.handleCollision(this.mouth[i], this.selectedHallazgo);
            this.piezaId = this.mouth[i].id;
            this.collisionHandler.handleCollision(this.mouth[i], this.selectedHallazgo, undefined, undefined, undefined, undefined, contador); //jjallo 11092020

            if (this.selectedHallazgo === this.constants.IMPLANTE) {
              //var newArray_ = [];
              //newArray = this.mouth;
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.IMPLANTE) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.setTextToTextBox(this.mouth[i].textBox, 'IMP', '', '');
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              this.mouth[i].damages[j].indicador = 'A';
                              break;
                          }
                      }

                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'IMP', '');
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;
                                      this.mouth[i].damages[j].indicador = 'A';

                                      this.mouth[i].textBox2.text = 'IMP';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'IMP');
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;
                                      this.mouth[i].damages[j].indicador = 'A';

                                      this.mouth[i].textBox3.text = 'IMP';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var k = 20; k < this.mouth.length; k++) {
                              if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                                  if (this.mouth[k].textBox.text === '') {
                                      this.setTextToTextBox(this.mouth[k].textBox, '', 'IMP', '');
                                      this.mouth[k].textBox.statetext = 0;
                                      this.mouth[k].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;
                                      this.mouth[i].damages[j].indicador = 'A';

                                      this.mouth[i].textBox2.text = 'IMP';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                                  if (this.mouth[k].textBox.text === '') {
                                      this.setTextToTextBox(this.mouth[k].textBox, '', '', 'IMP');
                                      this.mouth[k].textBox.statetext = 0;
                                      this.mouth[k].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;
                                      this.mouth[i].damages[j].indicador = 'A';

                                      this.mouth[i].textBox3.text = 'IMP';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }
          //

          //06122023
          if (this.selectedHallazgo === this.constants.IMPACTACION) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.IMPACTACION) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'I', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'I', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'I';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'I');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'I';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'I', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'I';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'I');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'I';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.CORONA_TEMPORAL) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.CORONA_TEMPORAL) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 1;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'CT', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'CT', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'CT';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'CT');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'CT';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'CT', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'CT';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'CT');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'CT';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }


          if (this.selectedHallazgo === this.constants.SUPERFICIE_DESGASTADA) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.SUPERFICIE_DESGASTADA) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 1;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'DES', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'DES', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'DES';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'DES');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'DES';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'DES', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'DES';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'DES');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'DES';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.REMANENTE_RADICULAR) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.REMANENTE_RADICULAR) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 1;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'RR', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'RR', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'RR';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'RR');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'RR';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'RR', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'RR';
                                      this.mouth[i].textBox2.statetext = 1;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 1;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'RR');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'RR';
                                      this.mouth[i].textBox3.statetext = 1;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.FOSAS_PROFUNDAS) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.FOSAS_PROFUNDAS) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'FFP', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'FFP', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'FFP';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'FFP');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'FFP';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'FFP', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'FFP';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'FFP');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'FFP';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.MACRODONCIA) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.MACRODONCIA) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'MAC', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'MAC', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'MAC';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'MAC');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'MAC';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'MAC', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'MAC';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'MAC');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'MAC';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.MICRODONCIA) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.MICRODONCIA) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'MIC', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'MIC', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'MIC';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'MIC');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'MIC';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'MIC', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'MIC';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'MIC');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'MIC';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

          if (this.selectedHallazgo === this.constants.DIENTE_ECTOPICO) {
              for (var j = 0; j < this.mouth[i].damages.length; j++) {
                  if (this.mouth[i].damages[j].id === this.constants.DIENTE_ECTOPICO) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '') {
                              this.mouth[i].textBox.state2 = 0;
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.setTextToTextBox(this.mouth[i].textBox, 'E', '', '');
                              this.mouth[i].textBox.hallazgo = this.mouth[i].damages[j].id;
                              this.mouth[i].damages[j].automatico = 1;
                              break;
                          }
                      }
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'E', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'E';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'E');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'E';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                      else if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 2) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', 'E', '');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox2.text = 'E';
                                      this.mouth[i].textBox2.statetext = 0;
                                      this.mouth[i].textBox2.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[y].textBox.enumerador == 3) {
                                  if (this.mouth[y].textBox.text === '') {
                                      this.mouth[y].textBox.statetext = 0;
                                      this.mouth[y].textBox.state2 = 0;
                                      this.setTextToTextBox(this.mouth[y].textBox, '', '', 'E');
                                      this.mouth[y].textBox.hallazgo = this.mouth[i].damages[j].id;
                                      this.mouth[i].damages[j].automatico = 1;

                                      this.mouth[i].textBox3.text = 'E';
                                      this.mouth[i].textBox3.statetext = 0;
                                      this.mouth[i].textBox3.hallazgo = this.mouth[i].damages[j].id;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
          }

            }

            shouldUpdate = true;
          } else {
            if (this.observer !== undefined) {
              this.observer(this.mouth[i].id);
            }
          }
        }
        this.piezaId = this.mouth[i].id;
        shouldUpdate = true;
      }

      //comprobar si hay una colisi�n con una de las superficies de los dientes
      for (var j = 0; j < this.mouth[i].checkBoxes.length; j++) {
        if (
          this.mouth[i].checkBoxes[j].checkCollision(
            this.getXpos(event),
            this.getYpos(event)
          )
        ) {
          this.piezaId = this.mouth[i].id;
          this.pieza = this.mouth[i];
          //debugger;
          if (!this.observerActivated) {
            // handle collision with surface
            this.collisionHandler.handleCollisionCheckBox(
              this.mouth[i].checkBoxes[j],
              this.selectedHallazgo
            );

            shouldUpdate = true;

            //17012024
            if (this.selectedHallazgo === this.constants.SELLANTES) {
              if (this.mouth[i].checkBoxes[j].touching == true && this.mouth[i].checkBoxes[j].clic_check == undefined) {
                  this.mouth[i].checkBoxes[j].clic_check = 1;
                  if (this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                              this.setTextToTextBox(this.mouth[i].textBox, 'S', '', '');
                              this.mouth[i].textBox.statetext = 0;
                              this.mouth[i].textBox.state = 0;
                              this.mouth[i].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                              break;
                          }
                      }
                  }

                  if (this.mouth[i].textBox.hallazgo !== this.constants.SELLANTES) {
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                  if (this.mouth[y].textBox.enumerador == 2) {
                                      if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                          this.setTextToTextBox(this.mouth[y].textBox, '', 'S', '');
                                          this.mouth[y].textBox.statetext = 0;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox2.text = 'S';
                                          this.mouth[i].textBox2.statetext = 0;
                                          this.mouth[i].textBox2.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          break;
                                      }
                                      else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                          break;
                                      }
                                  }
                                  else if (this.mouth[y].textBox.enumerador == 3) {
                                      if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                          this.setTextToTextBox(this.mouth[y].textBox, '', '', 'S');
                                          this.mouth[y].textBox.statetext = 0;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox3.text = 'S';
                                          this.mouth[i].textBox3.statetext = 0;
                                          this.mouth[i].textBox3.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          break;
                                      }
                                      else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                          break;
                                      }
                                  }
                              }
                          }
                      }

                      if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                  if (this.mouth[y].textBox.enumerador == 2) {
                                      if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                          this.setTextToTextBox(this.mouth[y].textBox, '', 'S', '');
                                          this.mouth[y].textBox.statetext = 0;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox2.text = 'S';
                                          this.mouth[i].textBox2.statetext = 0;
                                          this.mouth[i].textBox2.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          break;
                                      }
                                      else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                          break;
                                      }
                                  }
                                  else if (this.mouth[y].textBox.enumerador == 3) {
                                      if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                          this.setTextToTextBox(this.mouth[y].textBox, '', '', 'S');
                                          this.mouth[y].textBox.statetext = 0;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox3.text = 'S';
                                          this.mouth[i].textBox3.statetext = 0;
                                          this.mouth[i].textBox3.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          break;
                                      }
                                      else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                          break;
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
              else if (this.mouth[i].checkBoxes[j].clic_check != undefined && this.mouth[i].checkBoxes[j].clic_check < 3) {
                  this.mouth[i].checkBoxes[j].clic_check = parseInt(this.mouth[i].checkBoxes[j].clic_check) + 2;
                  this.mouth[i].checkBoxes[j].statetext = 1;

                  if (this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                      if (this.mouth[i].textBox.enumerador == 1 && this.mouth[i].textBox.hallazgo === this.constants.SELLANTES) {
                          if (this.mouth[i].textBox.text !== '') {
                              this.mouth[i].textBox.statetext = 1;
                              this.mouth[i].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                          }
                      }
                  }

                  if (this.mouth[i].textBox.hallazgo !== this.constants.SELLANTES) {
                      if (this.mouth.length > 60) {
                          for (var y = 32; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                  if (this.mouth[y].textBox.enumerador == 2 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                      if (this.mouth[y].textBox.text !== '') {
                                          this.mouth[y].textBox.statetext = 1;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox2.statetext = 1;
                                      }
                                  }
                                  else if (this.mouth[y].textBox.enumerador == 3 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                      if (this.mouth[i].textBox.text !== '') {
                                          this.mouth[y].textBox.statetext = 1;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox3.statetext = 1;
                                      }
                                  }
                              }
                          }
                      }
                      if (this.mouth.length < 61) {
                          for (var y = 20; y < this.mouth.length; y++) {
                              if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                  if (this.mouth[y].textBox.enumerador == 2 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                      if (this.mouth[y].textBox.text !== '') {
                                          this.mouth[y].textBox.statetext = 1;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox2.statetext = 1;
                                      }
                                  }
                                  else if (this.mouth[y].textBox.enumerador == 3 && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                      if (this.mouth[i].textBox.text !== '') {
                                          this.mouth[y].textBox.statetext = 1;
                                          this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                          this.mouth[i].textBox3.statetext = 1;
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
              else if (this.mouth[i].checkBoxes[j].clic_check == 3 && this.mouth[i].checkBoxes[j].touching == true) {
                  if (this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                      if (this.mouth[i].textBox.enumerador == 1) {
                          if (this.mouth[i].textBox.text !== '' && this.mouth[i].textBox.hallazgo === this.constants.SELLANTES) {
                              this.mouth[i].textBox.text = '';
                              this.mouth[i].textBox.statetext = 0;
                              //this.mouth[i].textBox.hallazgo = 0;
                              this.mouth[i].checkBoxes[j].statetext = 0;
                              this.mouth[i].checkBoxes[j].state = 0;
                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                              this.mouth[i].checkBoxes[j].touching = false;
                          }
                          else if (this.mouth[i].textBox.text === '' && this.mouth[i].textBox.hallazgo === this.constants.SELLANTES) {
                              this.mouth[i].checkBoxes[j].statetext = 0;
                              this.mouth[i].checkBoxes[j].state = 0;
                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                              this.mouth[i].checkBoxes[j].touching = false;
                          }
                      }

                      if (this.mouth[i].textBox.hallazgo !== this.constants.SELLANTES) {
                          if (this.mouth.length > 60) {
                              for (var y = 32; y < this.mouth.length; y++) {
                                  if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                      if (this.mouth[y].textBox.enumerador == 2) {
                                          if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[y].textBox.text = '';
                                              this.mouth[y].textBox.statetext = 0;
                                              //this.mouth[y].textBox.hallazgo = 0;
                                              this.mouth[i].textBox2.text = '';
                                              this.mouth[i].textBox2.statetext = 0;
                                              //this.mouth[i].textBox2.hallazgo = 0;
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                          else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                      }
                                      else if (this.mouth[y].textBox.enumerador == 3) {
                                          if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[y].textBox.text = '';
                                              this.mouth[y].textBox.statetext = 0;
                                              //this.mouth[y].textBox.hallazgo = 0;
                                              this.mouth[i].textBox3.text = '';
                                              this.mouth[i].textBox3.statetext = 0;
                                              //this.mouth[i].textBox2.hallazgo = 0;
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                          else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                      }
                                  }
                              }
                          }
                          if (this.mouth.length < 61) {
                              for (var y = 20; y < this.mouth.length; y++) {
                                  if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.SELLANTES) {
                                      if (this.mouth[y].textBox.enumerador == 2) {
                                          if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[y].textBox.text = '';
                                              this.mouth[y].textBox.statetext = 0;
                                              //this.mouth[y].textBox.hallazgo = 0;
                                              this.mouth[i].textBox2.text = '';
                                              this.mouth[i].textBox2.statetext = 0;
                                              //this.mouth[i].textBox2.hallazgo = 0;
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                          else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                      }
                                      else if (this.mouth[y].textBox.enumerador == 3) {
                                          if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[y].textBox.text = '';
                                              this.mouth[y].textBox.statetext = 0;
                                              //this.mouth[y].textBox.hallazgo = 0;
                                              this.mouth[i].textBox3.text = '';
                                              this.mouth[i].textBox3.statetext = 0;
                                              //this.mouth[i].textBox2.hallazgo = 0;
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                          else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.SELLANTES) {
                                              this.mouth[i].checkBoxes[j].statetext = 0;
                                              this.mouth[i].checkBoxes[j].state = 0;
                                              this.mouth[i].checkBoxes[j].clic_check = undefined;
                                              this.mouth[i].checkBoxes[j].touching = false;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
            }

            if (this.selectedHallazgo === this.constants.PULPOTOMIA) {
                if (this.mouth[i].checkBoxes[j].touching == true && this.mouth[i].checkBoxes[j].clic_check == undefined) {
                    this.mouth[i].checkBoxes[j].clic_check = 1;
                    if (this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                        if (this.mouth[i].textBox.enumerador == 1) {
                            if (this.mouth[i].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                this.setTextToTextBox(this.mouth[i].textBox, 'PP', '', '');
                                this.mouth[i].textBox.statetext = 0;
                                this.mouth[i].textBox.state = 0;
                                this.mouth[i].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                break;
                            }
                        }
                    }

                    if (this.mouth[i].textBox.hallazgo !== this.constants.PULPOTOMIA) {
                        if (this.mouth.length > 60) {
                            for (var y = 32; y < this.mouth.length; y++) {
                                if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                    if (this.mouth[y].textBox.enumerador == 2) {
                                        if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                            this.setTextToTextBox(this.mouth[y].textBox, '', 'PP', '');
                                            this.mouth[y].textBox.statetext = 0;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox2.text = 'PP';
                                            this.mouth[i].textBox2.statetext = 0;
                                            this.mouth[i].textBox2.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            break;
                                        }
                                        else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                            break;
                                        }
                                    }
                                    else if (this.mouth[y].textBox.enumerador == 3) {
                                        if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                            this.setTextToTextBox(this.mouth[y].textBox, '', '', 'PP');
                                            this.mouth[y].textBox.statetext = 0;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox3.text = 'PP';
                                            this.mouth[i].textBox3.statetext = 0;
                                            this.mouth[i].textBox3.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            break;
                                        }
                                        else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        if (this.mouth.length < 61) {
                            for (var y = 20; y < this.mouth.length; y++) {
                                if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                    if (this.mouth[y].textBox.enumerador == 2) {
                                        if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                            this.setTextToTextBox(this.mouth[y].textBox, '', 'PP', '');
                                            this.mouth[y].textBox.statetext = 0;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox2.text = 'PP';
                                            this.mouth[i].textBox2.statetext = 0;
                                            this.mouth[i].textBox2.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            break;
                                        }
                                        else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                            break;
                                        }
                                    }
                                    else if (this.mouth[y].textBox.enumerador == 3) {
                                        if (this.mouth[y].textBox.text === '' && this.mouth[i].checkBoxes[j].statetext === 0) {
                                            this.setTextToTextBox(this.mouth[y].textBox, '', '', 'PP');
                                            this.mouth[y].textBox.statetext = 0;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox3.text = 'PP';
                                            this.mouth[i].textBox3.statetext = 0;
                                            this.mouth[i].textBox3.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            break;
                                        }
                                        else if (this.mouth[y].textBox.text !== '' && this.mouth[i].checkBoxes[j].statetext === 0 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (this.mouth[i].checkBoxes[j].clic_check != undefined && this.mouth[i].checkBoxes[j].clic_check < 3) {
                    this.mouth[i].checkBoxes[j].clic_check = parseInt(this.mouth[i].checkBoxes[j].clic_check) + 2;
                    this.mouth[i].checkBoxes[j].statetext = 1;

                    if (this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                        if (this.mouth[i].textBox.enumerador == 1 && this.mouth[i].textBox.hallazgo === this.constants.PULPOTOMIA) {
                            if (this.mouth[i].textBox.text !== '') {
                                this.mouth[i].textBox.statetext = 1;
                                this.mouth[i].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                            }
                        }
                    }

                    if (this.mouth[i].textBox.hallazgo !== this.constants.PULPOTOMIA) {
                        if (this.mouth.length > 60) {
                            for (var y = 32; y < this.mouth.length; y++) {
                                if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                    if (this.mouth[y].textBox.enumerador == 2 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                        if (this.mouth[y].textBox.text !== '') {
                                            this.mouth[y].textBox.statetext = 1;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox2.statetext = 1;
                                        }
                                    }
                                    else if (this.mouth[y].textBox.enumerador == 3 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                        if (this.mouth[i].textBox.text !== '') {
                                            this.mouth[y].textBox.statetext = 1;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox3.statetext = 1;
                                        }
                                    }
                                }
                            }
                        }
                        if (this.mouth.length < 61) {
                            for (var y = 20; y < this.mouth.length; y++) {
                                if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                    if (this.mouth[y].textBox.enumerador == 2 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                        if (this.mouth[y].textBox.text !== '') {
                                            this.mouth[y].textBox.statetext = 1;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox2.statetext = 1;
                                        }
                                    }
                                    else if (this.mouth[y].textBox.enumerador == 3 && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                        if (this.mouth[i].textBox.text !== '') {
                                            this.mouth[y].textBox.statetext = 1;
                                            this.mouth[y].textBox.hallazgo = this.mouth[i].checkBoxes[j].state;
                                            this.mouth[i].textBox3.statetext = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (this.mouth[i].checkBoxes[j].clic_check == 3 && this.mouth[i].checkBoxes[j].touching == true) {
                    if (this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                        if (this.mouth[i].textBox.enumerador == 1) {
                            if (this.mouth[i].textBox.text !== '' && this.mouth[i].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                this.mouth[i].textBox.text = '';
                                this.mouth[i].textBox.statetext = 0;
                                //this.mouth[i].textBox.hallazgo = 0;
                                this.mouth[i].checkBoxes[j].statetext = 0;
                                this.mouth[i].checkBoxes[j].state = 0;
                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                this.mouth[i].checkBoxes[j].touching = false;
                            }
                            else if (this.mouth[i].textBox.text === '' && this.mouth[i].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                this.mouth[i].checkBoxes[j].statetext = 0;
                                this.mouth[i].checkBoxes[j].state = 0;
                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                this.mouth[i].checkBoxes[j].touching = false;
                            }
                        }

                        if (this.mouth[i].textBox.hallazgo !== this.constants.PULPOTOMIA) {
                            if (this.mouth.length > 60) {
                                for (var y = 32; y < this.mouth.length; y++) {
                                    if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                        if (this.mouth[y].textBox.enumerador == 2) {
                                            if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[y].textBox.text = '';
                                                this.mouth[y].textBox.statetext = 0;
                                                //this.mouth[y].textBox.hallazgo = 0;
                                                this.mouth[i].textBox2.text = '';
                                                this.mouth[i].textBox2.statetext = 0;
                                                //this.mouth[i].textBox2.hallazgo = 0;
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                            else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                        }
                                        else if (this.mouth[y].textBox.enumerador == 3) {
                                            if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[y].textBox.text = '';
                                                this.mouth[y].textBox.statetext = 0;
                                                //this.mouth[y].textBox.hallazgo = 0;
                                                this.mouth[i].textBox3.text = '';
                                                this.mouth[i].textBox3.statetext = 0;
                                                //this.mouth[i].textBox2.hallazgo = 0;
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                            else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.mouth.length < 61) {
                                for (var y = 20; y < this.mouth.length; y++) {
                                    if (this.mouth[y].id == this.mouth[i].id && this.mouth[i].checkBoxes[j].state === this.constants.PULPOTOMIA) {
                                        if (this.mouth[y].textBox.enumerador == 2) {
                                            if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[y].textBox.text = '';
                                                this.mouth[y].textBox.statetext = 0;
                                                //this.mouth[y].textBox.hallazgo = 0;
                                                this.mouth[i].textBox2.text = '';
                                                this.mouth[i].textBox2.statetext = 0;
                                                //this.mouth[i].textBox2.hallazgo = 0;
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                            else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                        }
                                        else if (this.mouth[y].textBox.enumerador == 3) {
                                            if (this.mouth[y].textBox.text !== '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[y].textBox.text = '';
                                                this.mouth[y].textBox.statetext = 0;
                                                //this.mouth[y].textBox.hallazgo = 0;
                                                this.mouth[i].textBox3.text = '';
                                                this.mouth[i].textBox3.statetext = 0;
                                                //this.mouth[i].textBox2.hallazgo = 0;
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                            else if (this.mouth[y].textBox.text === '' && this.mouth[y].textBox.hallazgo === this.constants.PULPOTOMIA) {
                                                this.mouth[i].checkBoxes[j].statetext = 0;
                                                this.mouth[i].checkBoxes[j].state = 0;
                                                this.mouth[i].checkBoxes[j].clic_check = undefined;
                                                this.mouth[i].checkBoxes[j].touching = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
          //

            if (this.selectedHallazgo == this.constants.CURACION) {
              if (this.mouth[i].checkBoxes[j].touching == true && this.mouth[i].checkBoxes[j].clic_check == undefined) {
                  this.mouth[i].checkBoxes[j].clic_check = 1;
                  this.mouth[i].textBox.state2 = 0;
                  this.mouth[i].textBox.state = 0;
                  //this.mouth[i].textBox.statetext = 0;
              }
              else if (this.mouth[i].checkBoxes[j].clic_check != undefined && this.mouth[i].checkBoxes[j].clic_check < 3) {
                  this.mouth[i].checkBoxes[j].clic_check = parseInt(this.mouth[i].checkBoxes[j].clic_check) + 2;
                  this.mouth[i].checkBoxes[j].statetext = 1;//24112023
                  //04122023
                  if (this.mouth[i].checkBoxes[j].state === this.constants.CURACION) {
                      if (this.mouth[i].textBox.hallazgo === this.constants.CURACION) {
                          this.mouth[i].textBox.statetext = 1;
                          //this.mouth[i].textBox.state = 1;
                      }
                  }

                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[i].checkBoxes[j].state === this.constants.CURACION) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox2.state2 = 1;
                                  posicion1 = k;
                              }
                              //
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox3.state3 = 1;
                                  posicion1 = k;
                              }
                              //
                          }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[i].checkBoxes[j].state === this.constants.CURACION) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox2.state2 = 1;
                                  posicion1 = k;
                              }
                              //
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox3.state3 = 1;
                                  posicion1 = k;
                              }
                              //
                          }
                      }
                      }
                  }
              }
              else if (this.mouth[i].checkBoxes[j].clic_check == 3 && this.mouth[i].checkBoxes[j].touching == true) {
                  this.mouth[i].checkBoxes[j].statetext = 0;//14112023
                  this.mouth[i].checkBoxes[j].state = 0;//24112023
                  this.mouth[i].checkBoxes[j].clic_check = undefined;
                  this.mouth[i].checkBoxes[j].touching = false;

                  //04122023
                  if (this.mouth[i].textBox.hallazgo === this.constants.CURACION) {
                      this.mouth[i].textBox.text = "";
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].textBox.state = 0;
                      this.mouth[i].textBox.hallazgo = 0;
                  }
                  //

                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[k].textBox.hallazgo = 0;
                                  this.mouth[i].textBox2.text = '';
                                  this.mouth[i].textBox2.state = 0;
                                  this.mouth[i].textBox2.state2 = 0;
                                  this.mouth[i].textBox2.statetext = 0;
                                  this.mouth[i].textBox2.hallazgo = 0;
                              }
                              //

                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[k].textBox.hallazgo = 0;
                                  this.mouth[i].textBox3.text = '';
                                  this.mouth[i].textBox3.state = 0;
                                  this.mouth[i].textBox3.state3 = 0;
                                  this.mouth[i].textBox3.statetext = 0;
                                  this.mouth[i].textBox3.hallazgo = 0;
                              }
                              //
                          }
                  }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[k].textBox.hallazgo = 0;
                                  this.mouth[i].textBox2.state = 0;
                                  this.mouth[i].textBox2.state2 = 0;
                                  this.mouth[i].textBox2.statetext = 0;
                                  this.mouth[i].textBox2.hallazgo = 0;
                              }
                              //
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              //04122023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CURACION) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[k].textBox.hallazgo = 0;
                                  this.mouth[i].textBox3.state = 0;
                                  this.mouth[i].textBox3.state3 = 0;
                                  this.mouth[i].textBox3.statetext = 0;
                                  this.mouth[i].textBox3.hallazgo = 0;
                              }
                              //
                          }
                      }
                  }
              }
            }

            if (this.selectedHallazgo == this.constants.CARIES) {
              if (this.mouth[i].checkBoxes[j].touching == true) {
                  //this.mouth[i].checkBoxes[j].clic_check = 1;
                  this.mouth[i].checkBoxes[j].statetext = 1;

                  if (this.mouth[i].textBox.hallazgo === this.constants.CARIES) {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].textBox.state = 1;
                  }
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                      }
                  }

              }
              /*
              else
              {
                  if (this.mouth[i].textBox.hallazgo === this.constants.CARIES) {
                      this.mouth[i].checkBoxes[j].statetext = 0;
                      this.mouth[i].textBox.text = "";
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].textBox.state = 0;
                  }
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                      }
                  }
              }*/

              /*
              else if (this.mouth[i].checkBoxes[j].clic_check != undefined && this.mouth[i].checkBoxes[j].clic_check < 3) {
                  this.mouth[i].checkBoxes[j].clic_check = parseInt(this.mouth[i].checkBoxes[j].clic_check) + 2;
                  this.mouth[i].checkBoxes[j].statetext = 1;
                  if (this.mouth[i].textBox.hallazgo === this.constants.CARIES) {
                      this.mouth[i].textBox.statetext = 1;
                      this.mouth[i].textBox.state = 1;
                  }
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.statetext = 1;
                                  this.mouth[i].textBox.state = 1;
                                  posicion1 = k;
                              }
                          }
                      }
                  }
              }
              else if (this.mouth[i].checkBoxes[j].clic_check == 3 && this.mouth[i].checkBoxes[j].touching == true) {
                  this.mouth[i].checkBoxes[j].statetext = 0;
                  this.mouth[i].checkBoxes[j].state = 0;
                  this.mouth[i].checkBoxes[j].clic_check = undefined;
                  this.mouth[i].checkBoxes[j].touching = false;

                  if (this.mouth[i].textBox.hallazgo === this.constants.CARIES) {
                      this.mouth[i].textBox.text = "";
                      this.mouth[i].textBox.statetext = 0;
                      this.mouth[i].textBox.state = 0;
                  }
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                         if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                             if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                      }
                  }
                  else if (this.mouth.length < 61) {
                      for (var k = 20; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[i].textBox2.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                          if (this.mouth[k].id == this.mouth[i].id && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[i].textBox3.hallazgo === this.constants.CARIES) {
                                  this.mouth[k].textBox.text = "";
                                  this.mouth[k].textBox.statetext = 0;
                                  this.mouth[i].textBox.state = 0;
                                  this.mouth[i].textBox.statetext = 0;
                              }
                          }
                      }
                  }

              }*/
            }



          //
            this.piezaId = this.mouth[i].id;
            /**/
          } else {
            if (this.observer !== undefined) {
              this.observer(this.mouth[i].checkBoxes[j].id);
            }
          }
        }
      }

    }



    // only update if something new has occurred
    if (shouldUpdate) {
      this.update();
    }
  }

  onMouseClick(event: any) {
    if (!this.preview) {
      if (event.which == 3) {
        // check what is in foreground
        if (this.settings.HIHGLIGHT_SPACES) {
          this.mouseRightClickSpace(event);
        } else {
          this.mouseRightClickTooth(event);
        }
      } else {
        // check what is in foreground
        if (this.settings.HIHGLIGHT_SPACES) {
          this.mouseClickSpaces(event);
        } else {
          this.mouseClickTeeth(event);
        }
      }
    }
  }

  followMouse(event: any) {
    this.cursorX = this.getXpos(event);
    this.cursorY = this.getYpos(event);

    this.update();
  }

  mouseMoveSpaces(event: any) {
    for (var i = 0; i < this.spaces.length; i++) {
      var update = false;
      if (
        this.spaces[i].checkCollision(this.getXpos(event), this.getYpos(event))
      ) {
        this.spaces[i].onTouch(true);

        update = true;
      } else {
        this.spaces[i].onTouch(false);
      }
    }

    if (update) {
      this.update();
    }
  }

  mouseMoveTeeth(event: any) {
    for (var i = 0; i < this.mouth.length; i++) {

        if (this.mouth[i].textBox.rect.checkCollision(this.getXpos(event),
                this.getYpos(event))) {

            this.mouth[i].textBox.touching = true;

        } else {

            this.mouth[i].textBox.touching = false;

        }

        if (this.mouth[i].checkCollision(this.getXpos(event),
                this.getYpos(event)))
        {
            this.mouth[i].onTouch(true);

            if (this.multiSelect) {

                if (this.multiSelection.length > 0) {
                    this.highlightMultiSelection(this.mouth[i]);
                }
            }

            //04122023
            //else {


            //}
            //

        } else {
            this.mouth[i].onTouch(false);
        }

        for (var j = 0; j < this.mouth[i].checkBoxes.length; j++) {

            if (this.mouth[i].checkBoxes[j].checkCollision(
                    this.getXpos(event), this.getYpos(event)))
            {
                this.mouth[i].checkBoxes[j].touching = true;

            } else {
                this.mouth[i].checkBoxes[j].touching = false;
            }
        }
    }
  }

  onMouseMove(event: any) {
    if (!this.preview) {
      // are the spaces in forground
      if (this.settings.HIHGLIGHT_SPACES) {
        this.mouseMoveSpaces(event);
      } else {
        this.mouseMoveTeeth(event);
      }

      // update mouse cooridnates
      this.followMouse(event);
    }
  }

  reset() {
    for (var i = 0; i < this.mouth.length; i++) {
      this.mouth[i].damages.length = 0;

      this.mouth[i].textBox.text = "";

      for (var j = 0; j < this.mouth[i].checkBoxes.length; j++) {
        this.mouth[i].checkBoxes[j].state = 0;
      }
    }

    // reset all spaces
    for (var i = 0; i < this.spaces.length; i++) {
      this.spaces[i].damages.length = 0;
    }

    // repaint
    this.update();
  }

  getData() {
    var list = Array();
    //debugger;

    // Get data for all the spaces in the odontograma
    for (var i = 0; i < this.odontSpacesAdult.length; i++) {
        var t1 = this.odontSpacesAdult[i];
        for (var j = 0; j < t1.damages.length; j++) {
            var d: any = new Object();
            d.tooth = t1.id;
            d.damage = t1.damages[j].id;
            d.diagnostic = "";
            d.surface = "X";
            d.note = "";
            d.direction = t1.damages[j].direction;
            list.push(d);
        }
    }


    /*jjallo 11092020*/
    if (this.odontAdult.length > 32)
    {
        var newArray = [];
        var newArray_ = [];

        newArray = this.odontAdult.slice(0, 32);
        newArray_ = this.odontAdult.slice(32, 96);

        for (var j = 0; j < newArray.length; j++) {
            if (newArray[j].textBox.text == "") newArray[j].textBox.state = 0;

            for (var i = 0; i < newArray_.length; i++) {
                if (newArray[j].id == newArray_[i].id) {

                    if (newArray_[i].textBox.enumerador == 2) {

                        newArray[j].textBox2.text = newArray_[i].textBox.text;
                        newArray[j].textBox2.enumerador = newArray_[i].textBox.enumerador;
                        newArray[j].textBox2.statetext = newArray_[i].textBox.statetext;
                        newArray[j].textBox2.hallazgo = (newArray_[i].textBox.text !== '' ? newArray_[i].textBox.hallazgo : 0);//30112023
                        if (newArray[j].textBox2.text == "") newArray[j].textBox2.state2 = 0; else newArray[j].textBox2.state2 = newArray_[i].textBox.state;

                    //30112023
                        //newArray[j].textBox.text = newArray_[i].textBox.text;
                        //newArray[j].textBox.enumerador = newArray_[i].textBox.enumerador;
                        //newArray[j].textBox.statetext = newArray_[i].textBox.statetext;
                        //newArray[j].textBox.hallazgo = newArray_[i].textBox.hallazgo;
                        //if (newArray[j].textBox.text == "") newArray[j].textBox.state2 = 0; else newArray[j].textBox.state2 = newArray_[i].textBox.state;

                        //newArray[j].textBox2.text = newArray_[i].textBox.text;
                        //newArray[j].textBox2.enumerador = newArray_[i].textBox.enumerador;
                        //newArray[j].textBox2.statetext = newArray_[i].textBox.statetext;
                        //newArray[j].textBox2.hallazgo = newArray_[i].textBox.hallazgo;
                        //if (newArray[j].textBox2.text == "") newArray[j].textBox2.state2 = 0; else newArray[j].textBox2.state2 = newArray_[i].textBox.state;
                    //

                    }
                    if (newArray_[i].textBox.enumerador == 3) {

                        newArray[j].textBox3.text = newArray_[i].textBox.text;
                        newArray[j].textBox3.enumerador = newArray_[i].textBox.enumerador;
                        newArray[j].textBox3.statetext = newArray_[i].textBox.statetext;
                        newArray[j].textBox3.hallazgo = (newArray_[i].textBox.text !== '' ? newArray_[i].textBox.hallazgo : 0);//30112023
                        if (newArray[j].textBox3.text == "") newArray[j].textBox3.state3 = 0; else newArray[j].textBox3.state3 = newArray_[i].textBox.state;


                        //30112023
                        //newArray[j].textBox.text = newArray_[i].textBox.text;
                        //newArray[j].textBox.enumerador = newArray_[i].textBox.enumerador;
                        //newArray[j].textBox.statetext = newArray_[i].textBox.statetext;
                        //newArray[j].textBox.hallazgo = newArray_[i].textBox.hallazgo;//30112023
                        //if (newArray[j].textBox.text == "") newArray[j].textBox.state3 = 0; else newArray[j].textBox.state3 = newArray_[i].textBox.state;
                        //
                    }
                }
            }
        }
        this.odontAdult = [];
        this.odontAdult = newArray;
        //sessionStorage.setItem("odontAdult", this.odontAdult);
    }
    //debugger;
    /**/
    //debugger;

    // get all data from the teeth in the odontograma
    for (var i = 0; i < this.odontAdult.length; i++) {
        var t1 = this.odontAdult[i];
        // get the notes from the text boxes

        //VALIDACION PARA LOS AUTOMATICOS DE TEXTO EN DURO
        //if (t1.textBox.text !== "") {
        if (t1.textBox.text !== ""  && t1.textBox.text != "PP" && t1.textBox.text != "PC" && t1.textBox.text != "TC"
            && t1.textBox.text != "CM" && t1.textBox.text != "CF" && t1.textBox.text != "CMC" && t1.textBox.text != "CV" && t1.textBox.text != "CJ" && t1.textBox.text != "S"
            && t1.textBox.text != "AM" && t1.textBox.text != "R" && t1.textBox.text != "IV" && t1.textBox.text != "IE" && t1.textBox.text != "C"
            ) {//jjallo 11092020
            var d: any = new Object();
            d.tooth = t1.id;
            d.damage = 0;
            d.diagnostic = "";
            d.surface = "X";
            //d.note = t1.textBox.text;  05122023
            d.direction = -1;

            //d.state = 0;  //jjallo 23052018
            //if (t1.textBox.text != "")

            /*comentado 05122023
            d.state = t1.textBox.state;
            d.statetext = t1.textBox.statetext;
            d.note2 = t1.textBox2.text;
            d.state2 = t1.textBox2.state2;
            d.note3 = t1.textBox3.text;
            d.state3 = t1.textBox3.state3;
            /**/

            //05122023
            if (t1.textBox.hallazgo === this.constants.IMPLANTE) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.IMPLANTE) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.IMPLANTE) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }
            //

            //06122023
            if (t1.textBox.hallazgo === this.constants.IMPACTACION) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.IMPACTACION) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.IMPACTACION) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }


            if (t1.textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.MACRODONCIA) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.MACRODONCIA) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.MACRODONCIA) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.MICRODONCIA) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.MICRODONCIA) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.MICRODONCIA) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.DIENTE_ECTOPICO) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.DIENTE_ECTOPICO) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }
            //


            list.push(d);
        }

        // get the damages registered for the tooth
        for (var j = 0; j < t1.damages.length; j++) {

            var d: any = new Object();

            d.tooth = t1.id;
            d.damage = t1.damages[j].id;
            d.diagnostic = "";
            d.surface = "X";
            //d.note = "";
            if (t1.damages[j].id > 0) {
                d.note = "";
            }
            else {
                d.note = t1.textBox.text !== "" ? t1.textBox.text : "";
                /*jjallo 11092020*/
                //if (t1.textBox.text != "")
                d.note2 = t1.textBox2.text != "" ? t1.textBox2.text : "";
                d.note3 = t1.textBox3.text != "" ? t1.textBox3.text : "";
                d.state = t1.textBox.state;  //1;
                d.state2 = t1.textBox2.state2; //1;
                d.state3 = t1.textBox3.state3; //1;
                //if (t1.textBox2.text != "")
                //if (t1.textBox3.text != "")
                /**/
            }

            /*INI JJALLO*/
            if (t1.damages[j].id === 32) t1.damages[j].direction = 1;//08112023
            if (t1.damages[j].id === 33) t1.damages[j].direction = 1;
            if (t1.damages[j].id === 23) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 30) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 34) t1.damages[j].direction = 1;
            if (t1.damages[j].id === 35) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 36) t1.damages[j].direction = 0;
            if (t1.damages[j].id === 12) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 2) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 28) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 29) t1.damages[j].direction = -1;
            /*FIN JJALLO*/
            if (t1.damages[j].id === 6)

            d.direction = t1.damages[j].direction;
            //d.state = t1.damages[j].state; //comentado jjallo 11092020 30112023

            //comentado 04122023
                //d.note = t1.textBox.text !== "" ? t1.textBox.text : "";
                //d.note2 = t1.textBox2.text != "" ? t1.textBox2.text : "";
                //d.note3 = t1.textBox3.text != "" ? t1.textBox3.text : "";
            //

            //29112023  validar los campos

            if (t1.damages[j].id > 0)
                d.statetext = 0;
            //else
                //d.statetext = t1.textBox.statetext;  30112023

            /*jjallo 11092020*/
            d.PHLLZGO = t1.damages[j].indicador;

            /*comentado 05122023
            if (t1.damages[j].id == this.constants.IMPLANTE)
            {
                d.statetext = t1.damages[j].indicador == '' ? 0 : t1.damages[j].indicador;
            }
            */

            if (t1.damages[j].id == this.constants.PERNO_MUNON)
            {
                if (t1.damages[j].state == 1) {
                    t1.damages[j].indicador = 'R';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.damages[j].state == 0) {
                    t1.damages[j].indicador = 'A';
                    d.statetext = t1.damages[j].state;
                }
                //if (t1.damages[j].indicador == 'R')
                //    d.statetext= t1.damages[j].state;
                //else if(t1.damages[j].indicador == 'R')
                //    d.statetext = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PULPAR)
            {
                //debugger;
                //04042023 Inicio
                //d.note = t1.textBox.text;
                //d.state = 0;
                //d.state2 = 0;
                //d.state3 = 0;


                /*comentado 04122023
                if (t1.damages[j].state == 1) {
                    t1.damages[j].indicador = 'R';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.damages[j].state == 0) {
                    t1.damages[j].indicador = 'A';
                    d.statetext = t1.damages[j].state;
                }
                */

                d.state = t1.damages[j].state;//012024

                //04122023
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
                //
            }

            //06122023
            if (t1.damages[j].id == this.constants.DIENTE_AUSENTE) {
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;

                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
            }
            //


            //if (t1.damages[j].id == this.constants.MOVILIDAD_PATOLOGICA)
            //{
            //    d.note = "M" + t1.damages[j].indicador;
            //    d.state = 1;
            //}
            if (t1.damages[j].id == this.constants.CORONA_DEFINITIVA) {//|| t1.damages[j].id == this.constants.PULPAR  04042023

                /*debugger; comentado 30112023
                d.note =  (t1.textBox.text  !== "CF" ? null : t1.textBox.text);//29112023
                d.note2 = (t1.textBox2.text !== "CF" ? null : t1.textBox2.text);//29112023
                d.note3 = (t1.textBox3.text !== "CF" ? null : t1.textBox3.text);//29112023
                d.state = (t1.textBox.statetext == undefined ? 0 : t1.textBox.statetext);
                d.state2 = (t1.textBox2.statetext == undefined ? 0 : t1.textBox2.statetext);
                d.state3 = (t1.textBox3.statetext == undefined ? 0 : t1.textBox3.statetext);
                d.statetext = (t1.textBox.statetext == undefined ? 0 : t1.textBox.statetext);
                d.statetext = (t1.textBox2.statetext == undefined ? 0 : t1.textBox2.statetext);
                d.statetext = (t1.textBox3.statetext == undefined ? 0 : t1.textBox3.statetext);
                */

                d.state = t1.damages[j].state; //10012024

                //30112023
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;

                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
                //
            }

            if (t1.damages[j].id == this.constants.SUPERFICIE_DESGASTADA)
            {
                d.state = 1;
                d.state2 = 0;
                d.state3 = 0;
            }

            /**/

            //26122023
            if (t1.damages[j].id == this.constants.ORTONDICO_REMOVIBLE) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.ORTODONTICO_FIJO_END) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                d.state = t1.damages[j].state;
            }
            //


            //012024
            if (t1.damages[j].id == this.constants.PROTESIS_REMOVIBLE) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_LEFT) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_CENTER) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_RIGHT) {
                d.state = t1.damages[j].state;
            }
            //

            //23012024
            if (t1.damages[j].id == this.constants.PROTESIS_TOTAL) {
              d.state = t1.damages[j].state;
          }
          //

            //05122023
            if (t1.damages[j].id == this.constants.IMPLANTE) {
                if (t1.textBox.hallazgo === this.constants.IMPLANTE) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.IMPLANTE) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.IMPLANTE) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }
            //

            //06122023
            if (t1.damages[j].id == this.constants.IMPACTACION) {
                if (t1.textBox.hallazgo === this.constants.IMPACTACION) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.IMPACTACION) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.IMPACTACION) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.CORONA_TEMPORAL) {
                if (t1.textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.SUPERFICIE_DESGASTADA) {
                if (t1.textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.REMANENTE_RADICULAR) {
                if (t1.textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.FOSAS_PROFUNDAS) {
                if (t1.textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MACRODONCIA) {
                if (t1.textBox.hallazgo === this.constants.MACRODONCIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MACRODONCIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MACRODONCIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MICRODONCIA) {
                if (t1.textBox.hallazgo === this.constants.MICRODONCIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MICRODONCIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MICRODONCIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.DIENTE_ECTOPICO) {
                if (t1.textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.POSICION_DENTARIA) {
                if (t1.textBox.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MOVILIDAD_PATOLOGICA) {
                if (t1.textBox.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }


            if (t1.damages[j].id == this.constants.DEFECTO_ESMALTE) {
                if (t1.textBox.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }
            //

            list.push(d);
        }

        // get data for the checkboxes (surfaces) for current tooth
        for (var j = 0; j < t1.checkBoxes.length; j++) {

            if (t1.checkBoxes[j].state !== 0) {
                var d: any = new Object();

                d.tooth = t1.id;
                //d.damage = t1.checkBoxes[j].state;//24112023

                //14112023
                //if (this.constants.CURACION === this.selectedHallazgo) {
                if (this.constants.CURACION === t1.checkBoxes[j].state) {//24112023
                    //d.damage = this.selectedHallazgo;
                    d.damage = t1.checkBoxes[j].state;//24112023
                    //d.state = t1.checkBoxes[j].statetext; //06122023
                    //t1.textBox.state = parseInt(t1.checkBoxes[j].state);
                    t1.textBox.state = parseInt(t1.checkBoxes[j].statetext);//24112023

                    //04122023
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        d.state = t1.textBox.statetext;

                    }
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        d.state3 = t1.textBox3.statetext;
                    }
                    //


                }
                //else {
                //    d.damage = t1.checkBoxes[j].state;
                //}
                //

                //24112023
                else if (this.constants.CARIES === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    //d.state = t1.checkBoxes[j].state;
                    //t1.textBox.state = parseInt(t1.checkBoxes[j].state);
                    t1.textBox.state = parseInt(t1.checkBoxes[j].statetext);//24112023

                    //04122023
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        d.state = t1.textBox.statetext;

                    }
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === this.odontAdult[i].textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        d.state3 = t1.textBox3.statetext;
                    }
                    //

                }
                //16012024
                else if (this.constants.SELLANTES === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    if (t1.checkBoxes[j].state === t1.textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        t1.textBox.state = t1.textBox.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state = t1.textBox.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        t1.textBox2.state = t1.textBox2.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        t1.textBox3.state = t1.textBox3.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state3 = t1.textBox3.statetext
                    }
                }
                else if (this.constants.PULPOTOMIA === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    if (t1.checkBoxes[j].state === t1.textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        t1.textBox.state = t1.textBox.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state = t1.textBox.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        t1.textBox2.state = t1.textBox2.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        t1.textBox3.state = t1.textBox3.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state3 = t1.textBox3.statetext
                    }
                }
                //
                else {
                    d.damage = t1.checkBoxes[j].state;
                }

                d.diagnostic = "";
                d.surface = t1.checkBoxes[j].id;
                //d.note = t1.textBox.text; comentado 04122023
                d.direction = -1;

                /*comentado 06122023
                if ( (t1.checkBoxes[j].state == this.constants.SELLANTES || t1.checkBoxes[j].state == -40) && d.note =="S") {
                    if (t1.checkBoxes[j].clic_check == 1)
                        d.state = 0;
                    else if(t1.checkBoxes[j].clic_check >2)
                        d.state = 1;
                        d.damage = 40;
                }*/

                 if (t1.checkBoxes[j].state == this.constants.CURACION || t1.checkBoxes[j].state == this.constants.CARIES) {//24112023
                    d.state = t1.checkBoxes[j].statetext;
                }
                //04042023 Inicio
                //else if ((t1.checkBoxes[j].state == this.constants.PULPOTOMIA || t1.checkBoxes[j].state == -46) && d.note == "PP") {
                //    if (t1.checkBoxes[j].clic_check == 1)
                //        d.state = 0;
                //    else if (t1.checkBoxes[j].clic_check > 2)
                //        d.state = 1;
                //        d.damage = 46;
                //}
                //Fin
                list.push(d);
            }
        }

    }

    // Get data for all the spaces in the odontograma
    for (var i = 0; i < this.odontSpacesChild.length; i++) {
        var t1 = this.odontSpacesChild[i];
        for (var j = 0; j < t1.damages.length; j++) {
            var d: any = new Object();
            d.tooth = t1.id;
            d.damage = t1.damages[j].id;
            d.diagnostic = "";
            d.surface = "X";
            d.note = "";
            d.direction = t1.damages[j].direction;
            list.push(d);
        }
    }


    /*jjallo 11092020*/
    if (this.odontChild.length > 20) {
        var newArray2 = [];
        var newArray2_ = [];

        newArray2 = this.odontChild.slice(0, 20);
        newArray2_ = this.odontChild.slice(20, 60);

        for (var j = 0; j < newArray2.length; j++) {
            if (newArray2[j].textBox.text == "") newArray2[j].textBox.state = 0;
            for (var i = 0; i < newArray2_.length; i++) {
                if (newArray2[j].id == newArray2_[i].id) {
                    if (newArray2_[i].textBox.enumerador == 2) {

                        /*comentado 30112023
                        newArray2[j].textBox2.text = newArray2_[i].textBox.text;
                        //newArray[j].textBox.enumerador == newArray_[i].textBox.enumerador;
                        newArray2[j].textBox2.enumerador == newArray2_[i].textBox.enumerador;
                        newArray2[j].textBox2.statetext = newArray2_[i].textBox.statetext;
                        //newArray[j].textBox2.state2 = newArray_[i].textBox.state;
                        if (newArray2[j].textBox2.text == "") newArray2[j].textBox2.state2 = 0; else newArray2[j].textBox2.state2 = newArray2_[i].textBox.state;
                        */

                        //30112023
                        newArray2[j].textBox2.text = newArray2_[i].textBox.text;
                        newArray2[j].textBox2.enumerador = newArray2_[i].textBox.enumerador;
                        newArray2[j].textBox2.statetext = newArray2_[i].textBox.statetext;
                        newArray2[j].textBox2.hallazgo = (newArray2_[i].textBox.text !== '' ? newArray2_[i].textBox.hallazgo : 0);//30112023
                        if (newArray2[j].textBox2.text == "") newArray2[j].textBox2.state2 = 0; else newArray2[j].textBox2.state2 = newArray2_[i].textBox.state;
                        //
                    }
                    if (newArray2_[i].textBox.enumerador == 3) {
                        /*comentado 30112023
                        if (newArray2[j].textBox3.text == "") newArray2[j].textBox3.state = 0;
                        newArray2[j].textBox3.text = newArray2_[i].textBox.text;
                        //newArray[j].textBox.enumerador == newArray_[i].textBox.enumerador;
                        newArray2[j].textBox3.enumerador == newArray2_[i].textBox.enumerador;
                        newArray2[j].textBox3.statetext = newArray2_[i].textBox.statetext;
                        //newArray[j].textBox3.state3 = newArray_[i].textBox.state;
                        if (newArray2[j].textBox3.text == "") newArray2[j].textBox3.state3 = 0; else newArray2[j].textBox3.state3 = newArray2_[i].textBox.state;
                        */

                        //30112023
                        newArray2[j].textBox3.text = newArray2_[i].textBox.text;
                        newArray2[j].textBox3.enumerador = newArray2_[i].textBox.enumerador;
                        newArray2[j].textBox3.statetext = newArray2_[i].textBox.statetext;
                        newArray2[j].textBox3.hallazgo = (newArray2_[i].textBox.text !== '' ? newArray2_[i].textBox.hallazgo : 0);//30112023
                        if (newArray2[j].textBox3.text == "") newArray2[j].textBox3.state3 = 0; else newArray2[j].textBox3.state3 = newArray2_[i].textBox.state;
                        //
                    }
                    //break;
                }
            }
        }
        this.odontChild = [];
        this.odontChild = newArray2;
        sessionStorage.setItem("odontChild", this.odontChild);
    }
    //debugger;
    /**/


    // get all data from the teeth in the odontograma
    for (var i = 0; i < this.odontChild.length; i++) {
        var t1 = this.odontChild[i];

        // get the notes from the text boxes
        //if (t1.textBox.text !== "") {
        if (t1.textBox.text !== ""  && t1.textBox.text != "PP" && t1.textBox.text != "PC" && t1.textBox.text != "TC"
       && t1.textBox.text != "CM" && t1.textBox.text != "CF" && t1.textBox.text != "CMC" && t1.textBox.text != "CV" && t1.textBox.text != "CJ" && t1.textBox.text != "S"
            && t1.textBox.text != "AM" && t1.textBox.text != "R" && t1.textBox.text != "IV" && t1.textBox.text != "IE" && t1.textBox.text != "C"
       ) {//jjallo 11092020

            var d: any = new Object();
            d.tooth = t1.id;
            d.damage = 0;
            d.diagnostic = "";
            d.surface = "X";
            //d.note = t1.textBox.text;  05122023
            d.direction = -1;

            /*comentado 05122023
            d.state = t1.textBox.state;
            d.statetext = t1.textBox.statetext;
            d.note2 = t1.textBox2.text;
            d.state2 = t1.textBox2.state2;
            d.note3 = t1.textBox3.text;
            d.state3= t1.textBox3.state3;
            */

            //05122023
            if (t1.textBox.hallazgo === this.constants.IMPLANTE) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.IMPLANTE) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.IMPLANTE) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }
            //

            //06122023
            if (t1.textBox.hallazgo === this.constants.IMPACTACION) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.IMPACTACION) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.IMPACTACION) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.CORONA_TEMPORAL) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }

            if (t1.textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note = t1.textBox.text;
                d.state = t1.textBox.statetext;
                d.damage = t1.textBox.hallazgo;

            }
            if (t1.textBox2.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note2 = t1.textBox2.text;
                d.state2 = t1.textBox2.statetext;
                d.damage = t1.textBox2.hallazgo;
            }
            if (t1.textBox3.hallazgo === this.constants.REMANENTE_RADICULAR) {
                d.note3 = t1.textBox3.text;
                d.state3 = t1.textBox3.statetext;
                d.damage = t1.textBox3.hallazgo;
            }
            //

            list.push(d);
        }

        // get the damages registered for the tooth
        for (var j = 0; j < t1.damages.length; j++) {

            var d: any = new Object();

            d.tooth = t1.id;
            d.damage = t1.damages[j].id;
            d.diagnostic = "";
            d.surface = "X";
            //d.note = "";

            if (t1.damages[j].id > 0) {
                d.note = "";
            }
            else {
                d.note = t1.textBox.text !== "" ? t1.textBox.text : "";
                /*jjallo 11092020*/
                //if (t1.textBox.text != "") d.state = 1;
                //d.note2 = t1.textBox2.text != "" ? t1.textBox2.text : "";
                //if (t1.textBox2.text != "") d.state2 = 1;
                //d.note3 = t1.textBox3.text != "" ? t1.textBox3.text : "";
                //if (t1.textBox3.text != "") d.state3 = 1;
                d.note2 = t1.textBox2.text != "" ? t1.textBox2.text : "";
                d.note3 = t1.textBox3.text != "" ? t1.textBox3.text : "";
                d.state = t1.textBox.state;  //1;
                d.state2 = t1.textBox2.state2; //1;
                d.state3 = t1.textBox3.state3; //1;
                /**/
            }

            /*INI JJALLO*/
            if (t1.damages[j].id === 32) t1.damages[j].direction = 1;
            if (t1.damages[j].id === 33) t1.damages[j].direction = 0;
            if (t1.damages[j].id === 23) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 30) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 34) t1.damages[j].direction = 1;
            if (t1.damages[j].id === 35) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 36) t1.damages[j].direction = 0;
            if (t1.damages[j].id === 12) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 2) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 28) t1.damages[j].direction = -1;
            if (t1.damages[j].id === 29) t1.damages[j].direction = -1;
            /*FIN JJALLO*/

            d.direction = t1.damages[j].direction;
            //d.state = d.state = t1.damages[j].state; //comentado jjallo 11092020 30112023

            /*comentado 04122023
            d.note = t1.textBox.text != "" ? t1.textBox.text : "";
            d.note2 = t1.textBox2.text != "" ? t1.textBox2.text : "";
            d.note3 = t1.textBox3.text != "" ? t1.textBox3.text : "";
            */

            if (t1.damages[j].id > 0)
                d.statetext = 0;
            //else
            //    d.statetext = t1.textBox.statetext; 30112023

            d.PHLLZGO = t1.damages[j].indicador;

            /*comentado 05122023
            if (t1.damages[j].id == this.constants.IMPLANTE) {
                d.statetext = t1.damages[j].indicador == '' ? 0 : t1.damages[j].indicador;
            }
            */

            if (t1.damages[j].id == this.constants.PERNO_MUNON) {
                if (t1.damages[j].state == 1) {
                    t1.damages[j].indicador = 'R';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.damages[j].state == 0) {
                    t1.damages[j].indicador = 'A';
                    d.statetext = t1.damages[j].state;
                }
                //if (t1.damages[j].indicador == 'R')
                //    d.statetext = t1.damages[j].state;
                //else if (t1.damages[j].indicador == 'R')
                //    d.statetext = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PULPAR) {
                //debugger;
                //04042023 Inicio
                //d.note = t1.textBox.text;
                //d.state = 0;
                //d.state2 = 0;
                //d.state3 = 0;


                /*if (t1.damages[j].state == 1) {
                    t1.damages[j].indicador = 'R';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.damages[j].state == 0) {
                    t1.damages[j].indicador = 'A';
                    d.statetext = t1.damages[j].state;
                }*/
                //Fin

                d.state = t1.damages[j].state;//012024

                //04122023
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;

                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
                //

            }

            //06122023
            if (t1.damages[j].id == this.constants.DIENTE_AUSENTE) {
                if (t1.damages[j].state == 1) {
                    t1.damages[j].indicador = 'R';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.damages[j].state == 0) {
                    t1.damages[j].indicador = 'A';
                    d.statetext = t1.damages[j].state;
                }
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;

                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
            }
            //

            //if (t1.damages[j].id == this.constants.MOVILIDAD_PATOLOGICA) {
            //    d.note = "M" + t1.damages[j].indicador;
            //    d.state = 1;
            //}
            if (t1.damages[j].id == this.constants.CORONA_DEFINITIVA) {//|| t1.damages[j].id == this.constants.PULPAR 04042023
                /*comentado 30112023
                debugger;
                d.note = t1.textBox.text;
                d.note2 = t1.textBox2.text;
                d.note3 = t1.textBox3.text;
                d.state = (t1.textBox.statetext == undefined ? 0 : t1.textBox.statetext);
                d.state2 = (t1.textBox2.statetext == undefined ? 0 : t1.textBox2.statetext);
                d.state3 = (t1.textBox3.statetext == undefined ? 0 : t1.textBox3.statetext);
                d.statetext = (t1.textBox.statetext == undefined ? 0 : t1.textBox.statetext);
                d.statetext = (t1.textBox2.statetext == undefined ? 0 : t1.textBox2.statetext);
                d.statetext = (t1.textBox3.statetext == undefined ? 0 : t1.textBox3.statetext);
                */

                d.state = t1.damages[j].state; //10012024

                //30112023
                if (t1.textBox.hallazgo === t1.damages[j].id) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;

                }
                if (t1.textBox2.hallazgo === t1.damages[j].id) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                }
                if (t1.textBox3.hallazgo === t1.damages[j].id) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                }
                //


            }

            if (t1.damages[j].id == this.constants.SUPERFICIE_DESGASTADA) {
                d.state = 1;
                d.state2 = 0;
                d.state3 = 0;
            }

            /**/


            //26122023
            if (t1.damages[j].id == this.constants.ORTONDICO_REMOVIBLE) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.ORTODONTICO_FIJO_END) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.ORTODONTICO_FIJO_CENTER) {
                d.state = t1.damages[j].state;
            }
            //

            //012024
            if (t1.damages[j].id == this.constants.PROTESIS_REMOVIBLE) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_LEFT) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_CENTER) {
                d.state = t1.damages[j].state;
            }
            if (t1.damages[j].id == this.constants.PROTESIS_FIJA_RIGHT) {
                d.state = t1.damages[j].state;
            }
            //

            //23012024
            if (t1.damages[j].id == this.constants.PROTESIS_TOTAL) {
              d.state = t1.damages[j].state;
            }
            //

            //05122023
            if (t1.damages[j].id == this.constants.IMPLANTE) {
                if (t1.textBox.hallazgo === this.constants.IMPLANTE) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.IMPLANTE) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.IMPLANTE) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }
            //

            //06122023
            if (t1.damages[j].id == this.constants.IMPACTACION) {
                if (t1.textBox.hallazgo === this.constants.IMPACTACION) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.IMPACTACION) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.IMPACTACION) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.CORONA_TEMPORAL) {
                if (t1.textBox.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.CORONA_TEMPORAL) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.SUPERFICIE_DESGASTADA) {
                if (t1.textBox.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.SUPERFICIE_DESGASTADA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }


            if (t1.damages[j].id == this.constants.REMANENTE_RADICULAR) {
                if (t1.textBox.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.REMANENTE_RADICULAR) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.FOSAS_PROFUNDAS) {
                if (t1.textBox.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.FOSAS_PROFUNDAS) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MACRODONCIA) {
                if (t1.textBox.hallazgo === this.constants.MACRODONCIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MACRODONCIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MACRODONCIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MICRODONCIA) {
                if (t1.textBox.hallazgo === this.constants.MICRODONCIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MICRODONCIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MICRODONCIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.DIENTE_ECTOPICO) {
                if (t1.textBox.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.DIENTE_ECTOPICO) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.POSICION_DENTARIA) {
                if (t1.textBox.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.POSICION_DENTARIA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.MOVILIDAD_PATOLOGICA) {
                if (t1.textBox.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.MOVILIDAD_PATOLOGICA) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }

            if (t1.damages[j].id == this.constants.DEFECTO_ESMALTE) {
                if (t1.textBox.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note = t1.textBox.text;
                    d.state = t1.textBox.statetext;
                    d.damage = t1.textBox.hallazgo;

                }
                if (t1.textBox2.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note2 = t1.textBox2.text;
                    d.state2 = t1.textBox2.statetext;
                    d.damage = t1.textBox2.hallazgo;
                }
                if (t1.textBox3.hallazgo === this.constants.DEFECTO_ESMALTE) {
                    d.note3 = t1.textBox3.text;
                    d.state3 = t1.textBox3.statetext;
                    d.damage = t1.textBox3.hallazgo;
                }
            }
            //

            list.push(d);
        }

        // get data for the checkboxes (surfaces) for current tooth
        for (var j = 0; j < t1.checkBoxes.length; j++) {
            if (t1.checkBoxes[j].state !== 0) {
                var d: any = new Object();
                d.tooth = t1.id;
                //d.damage = t1.checkBoxes[j].state; //24112023

                //14112023
                if (this.constants.CURACION === t1.checkBoxes[j].state) {

                    d.damage = t1.checkBoxes[j].state;
                    //d.state = t1.checkBoxes[j].state;
                    t1.textBox.state = parseInt(t1.checkBoxes[j].statetext);//24112023

                    //04122023
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        d.state = t1.textBox.statetext;

                    }
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        d.state3 = t1.textBox3.statetext;
                    }
                    //


                }
                //else {
                //    d.damage = t1.checkBoxes[j].state;
                //}
                //

                //24112023
                else if (this.constants.CARIES === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    //d.state = t1.checkBoxes[j].state;
                    t1.textBox.state = parseInt(t1.checkBoxes[j].statetext);//24112023

                    //04122023
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        d.state = t1.textBox.statetext;

                    }
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === this.odontChild[i].textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        d.state3 = t1.textBox3.statetext;
                    }
                    //

                }
                    //16012024
                else if (this.constants.SELLANTES === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    if (t1.checkBoxes[j].state === t1.textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        t1.textBox.state = t1.textBox.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state = t1.textBox.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        t1.textBox2.state = t1.textBox2.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        t1.textBox3.state = t1.textBox3.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state3 = t1.textBox3.statetext
                    }
                }
                else if (this.constants.PULPOTOMIA === t1.checkBoxes[j].state) {
                    d.damage = t1.checkBoxes[j].state;
                    if (t1.checkBoxes[j].state === t1.textBox.hallazgo) {
                        d.note = t1.textBox.text;
                        t1.textBox.state = t1.textBox.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state = t1.textBox.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox2.hallazgo) {
                        d.note2 = t1.textBox2.text;
                        t1.textBox2.state = t1.textBox2.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state2 = t1.textBox2.statetext;
                    }
                    if (t1.checkBoxes[j].state === t1.textBox3.hallazgo) {
                        d.note3 = t1.textBox3.text;
                        t1.textBox3.state = t1.textBox3.statetext;
                        d.statetext = t1.checkBoxes[j].statetext;
                        d.state3 = t1.textBox3.statetext
                    }
                }
                    //
                else {
                    d.damage = t1.checkBoxes[j].state;
                }
                //

                d.diagnostic = "";
                d.surface = t1.checkBoxes[j].id;
                //d.note = t1.textBox.text;comentado 04122023
                d.direction = -1;


                /*comentado 06122023
                if ((t1.checkBoxes[j].state == this.constants.SELLANTES || t1.checkBoxes[j].state == -40) && d.note == "S") {
                    if (t1.checkBoxes[j].clic_check == 1)
                        d.state = 0;
                    else if (t1.checkBoxes[j].clic_check > 2)
                        d.state = 1;
                    d.damage = 40;
                }*/
                if (t1.checkBoxes[j].state == this.constants.CURACION || t1.checkBoxes[j].state == this.constants.CARIES) {//24112023

                    /*comentado 04122023
                    d.note2 = t1.textBox2.text;
                    d.note3 = t1.textBox3.text;
                    //d.state = t1.textBox.statetext;
                    //d.state = t1.checkBoxes[j].state;//14112023
                    d.state = t1.checkBoxes[j].statetext;//24112023
                    d.state2 = t1.textBox2.statetext;
                    d.state3 = t1.textBox3.statetext;
                    */

                    d.state = t1.checkBoxes[j].statetext;//04122023

                }
                //04042023 Inicio
                //else if ((t1.checkBoxes[j].state == this.constants.PULPOTOMIA || t1.checkBoxes[j].state == -46) && d.note == "PP") {
                //    if (t1.checkBoxes[j].clic_check == 1)
                //        d.state = 0;
                //    else if (t1.checkBoxes[j].clic_check > 2)
                //        d.state = 1;
                //        d.damage = 46;
                //}
                //Fin
                list.push(d);
            }
        }

    }

    return list;
  }

  save() {
    // save image as png
    var link = document.createElement("a");

    // create a unique name
    var name = Date.now() + ".png";

    link.download = name;

    // Create an image stream of the canvas
    link.href = this.canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    // download the image
    link.click();
  }

  keyMapper(event: any) {
    var value = 0;

    if (event.key === "q") {
      value = 10;
    } else if (event.key === "w") {
      value = 11;
    } else if (event.key === "e") {
      value = 12;
    } else if (event.key === "r") {
      value = 13;
    } else if (event.key === "t") {
      value = 14;
    } else if (event.key === "y") {
      value = 15;
    } else if (event.key === "u") {
      value = 16;
    } else if (event.key === "i") {
      value = 17;
    } else if (event.key === "o") {
      value = 18;
    } else if (event.key === "p") {
      value = 19;
    } else if (event.key === "a") {
      value = 20;
    } else if (event.key === "s") {
      value = 21;
    } else if (event.key === "d") {
      value = 22;
    } else if (event.key === "f") {
      value = 23;
    } else if (event.key === "g") {
      value = 24;
    } else if (event.key === "h") {
      value = 25;
    } else if (event.key === "j") {
      value = 27;
    } else if (event.key === "k") {
      value = 28;
    } else if (event.key === "l") {
      value = 29;
    } else if (event.key === "x") {
      value = 30;
    } else if (event.key === "c") {
      value = 31;
    } else if (event.key === "b") {
      value = 32;
    } else if (event.key === "n") {
      value = 34;
    } else if (event.key === "m") {
      value = 38;
    }

    return value;
  }

  onButtonClick(event: any) {

    // key combination Ctrl + Q to activate debug mode
    if ((event.which == 81 || event.keyCode == 81) && event.ctrlKey) {
      this.settings.DEBUG = !this.settings.DEBUG;

      this.update();
    }
  }

  setDamage(damage: any) {
    this.multiSelect = false;
    this.multiSelection.length = 0;

    this.selectedHallazgo = parseInt(damage, 10) || 0;

    if (this.selectedHallazgo === this.constants.TRANSPOSICION_LEFT) {
      this.multiSelect = true;
      this.multiSelection.length = 0;
    }

    if (this.selectedHallazgo === this.constants.ORTODONTICO_FIJO_END) {
      this.multiSelect = true;
      this.multiSelection.length = 0;
    }

    if (this.selectedHallazgo === this.constants.PROTESIS_FIJA_LEFT) {
      this.multiSelect = true;
      this.multiSelection.length = 0;
    }

    if (this.selectedHallazgo === this.constants.ORTONDICO_REMOVIBLE) {
      this.multiSelect = true;
      this.multiSelection.length = 0;
    }

    if (this.selectedHallazgo === this.constants.SUPER_NUMERARIO) {
      this.settings.HIHGLIGHT_SPACES = true;
      this.update();
    }

    if (this.selectedHallazgo === this.constants.DIASTEMA) {
      this.settings.HIHGLIGHT_SPACES = true;
      this.update();
    }

    if (
      this.selectedHallazgo !== this.constants.DIASTEMA &&
      this.selectedHallazgo !== this.constants.SUPER_NUMERARIO
    ) {
      this.settings.HIHGLIGHT_SPACES = false;
      this.update();
    }
  }

  changeView(which: any) {
    if (which == "1") {
      this.adultShowing = false;
      this.mouth = this.odontChild;
      this.spaces = this.odontSpacesChild;
      this.update();
    } else {
      this.adultShowing = true;
      this.mouth = this.odontAdult;
      this.spaces = this.odontSpacesAdult;
      this.update();
    }

    if (this.callback != null) {
      this.callback(which);
    }
  }

  start() {
    var self = this;
    // setTimeout(function () {
    self.update();
    // }, 1500);
  }

  getToothById(id: any) {
    var tooth;

    for (var i = 0; i < this.mouth.length; i++) {
        if (this.mouth[i].id === id) {

            tooth = this.mouth[i];
            break;
        }
    }

    var newArray_ = [];
    /*jjallo 11092020*/
    if (id < 51) {
      if (this.odontAdult.length > 32) {
          //var newArray_ = []; comentado 29112023
          newArray_ = this.odontAdult.slice(32, 96);
          for (var j = 0; j < newArray_.length; j++) {
              if (tooth.id == newArray_[j].id) {
                  tooth.state2 = newArray_[j].state2;
                  tooth.state3 = newArray_[j].state3;
                  if (newArray_[j].textBox2.enumerador == 2) {
                      tooth.textBox2.state2 = parseInt(newArray_[j].textBox2.state2);
                      tooth.textBox2.statetext = parseInt(newArray_[j].textBox2.state2);
                      tooth.textBox2.text = newArray_[j].textBox2.text;
                  }
                  if (newArray_[j].textBox3.enumerador == 3) {
                      tooth.textBox3.state3 = parseInt(newArray_[j].textBox3.state3);
                      tooth.textBox3.statetext = parseInt(newArray_[j].textBox3.state3);
                      tooth.textBox3.text = newArray_[j].textBox3.text;
                  }
              }
          }
      }
  }

    var contador;
    for (var x = 0; x < this.odontAdult.length; x++) {
      if (x < 32) {
          contador = 0;
          for (var z = 0; z < newArray_.length; z++) {
              if (contador === 2) break;
              if (this.odontAdult[x].id === newArray_[z].id) {
                  //if (this.mouth[x].damages.length > 0) {
                  //    if (contador === 0) this.mouth[x].textBox2.text = newArray_[z].textBox.text
                  //    if (contador === 1) this.mouth[x].textBox3.text = newArray_[z].textBox.text
                  //    contador++;
                  //}
                  if (contador === 0 && newArray_[z].textBox2.enumerador === 2) this.mouth[x].textBox2.text = newArray_[z].textBox.text;
                  if (contador === 1 && newArray_[z].textBox3.enumerador === 3) this.mouth[x].textBox3.text = newArray_[z].textBox.text;
                  contador++;
              }
          }
      }
  }

  if (id > 50) {
    for (var i = 0; i < this.odontChild.length; i++) {
        if (this.odontChild[i].id === id) {

            tooth = this.odontChild[i];
            break;
        }
    }

    if (this.odontChild.length > 20) {
        var newArray_ = [];
        newArray_ = this.odontChild.slice(20, 60);
        for (var j = 0; j < newArray_.length; j++) {
            if (tooth.id == newArray_[j].id) {
                tooth.state2 = newArray_[j].state2;
                tooth.state3 = newArray_[j].state3;
                if (newArray_[j].textBox.enumerador == 2) {
                    tooth.textBox2.state2 = parseInt(newArray_[j].textBox2.state2);
                    tooth.textBox2.statetext = parseInt(newArray_[j].textBox2.state2);
                    tooth.textBox2.text = newArray_[j].textBox2.text;
                    //tooth.textBox2.statetext = 1;
                }
                if (newArray_[j].textBox.enumerador == 3) {
                    tooth.textBox3.state3 = parseInt(newArray_[j].textBox3.state3);
                    tooth.textBox3.statetext = parseInt(newArray_[j].textBox3.state3);
                    tooth.textBox3.text = newArray_[j].textBox3.text;
                    //tooth.textBox3.statetext = 1;
                }

                //tooth.state2 = newArray_[j].state2;
                //tooth.state3 = newArray_[j].state3;
                //if (newArray_[j].textBox2.enumerador == 2) tooth.textBox2.text = newArray_[j].textBox2.text;
                //if (newArray_[j].textBox3.enumerador == 3) tooth.textBox3.text = newArray_[j].textBox3.text;
            }
        }
    }
}
    /**/

    return tooth;
  }

  getSpaceById(id: any) {
    var space;

    for (var i = 0; i < this.spaces.length; i++) {
      if (this.spaces[i].id == id) {
        space = this.spaces[i];
        break;
      }
    }

    return space;
  }

  load(
    tooth: any,
    damage: any,
    surface: any,
    note: any,
    note2: any,
    note3: any,
    direction: any,
    state: any,
    state2: any,
    state3: any,
    statetext: any,
    posicion: any
  ) {
    var t1 = tooth;
    //console.log('valor->'+tooth);

    /*jjallo 22052018*/
    if(t1 > 10 && t1 < 49){

      this.mouth = this.odontAdult;
      this.spaces = this.odontSpacesAdult;

      /*jjallo 11092020*/
      for (var i = 0; i < this.mouth.length; i++) {
          if (i > 32) {
              this.mouth[i].textBox2.text = "";
              this.mouth[i].textBox3.text = "";
              this.mouth[i].textBox2.enumerador = 2;
              this.mouth[i].textBox3.enumerador = 3;
          }
      }
      /**/


      if (tooth !==0 && damage === 0) {
          for (var i = 0; i < this.mouth.length; i++) {
              if (this.mouth[i].id === tooth) {
                  this.mouth[i].text = note;
                  this.mouth[i].textBox.statetext = statetext
                  this.mouth[i].state = state;

                  if (this.mouth[i].textBox.enumerador == 1) {
                      this.mouth[i].textBox.text = note
                      this.mouth[i].textBox.state = parseInt(state);
                      this.mouth[i].textBox.statetext = parseInt(state);
                  }
                  else if (this.mouth[i].textBox.enumerador ==2) {
                      this.mouth[i].textBox.text = note2;
                      this.mouth[i].textBox.state = parseInt(state2);
                      this.mouth[i].textBox.statetext = parseInt(state2);
                  }
                  else   if (this.mouth[i].textBox.enumerador ==3) {
                      this.mouth[i].textBox.text = note3;
                      this.mouth[i].textBox.state = parseInt(state3);
                      this.mouth[i].textBox.statetext = parseInt(state3);
                  }
              }
          }
      }
      /**/

  } else  if(t1 > 50 && t1 < 85){

      this.mouth = this.odontChild;
      this.spaces = this.odontSpacesChild;

      /*jjallo 11092020*/
      for (var i = 0; i < this.mouth.length; i++) {
          if (i < 20) {
              this.mouth[i].textBox2.text = "";
              this.mouth[i].textBox3.text = "";
              this.mouth[i].textBox2.enumerador = 2;
              this.mouth[i].textBox3.enumerador = 3;
          }
      }

      if (tooth !== 0 && damage === 0) {
          for (var i = 0; i < this.mouth.length; i++) {

              if (this.mouth[i].id === tooth) {
                  this.mouth[i].text = note;
                  this.mouth[i].textBox.statetext = statetext
                  this.mouth[i].state = state;

                  if (this.mouth[i].textBox.enumerador == 1) {
                      this.mouth[i].textBox.text = note
                      this.mouth[i].textBox.state = parseInt(state);
                      this.mouth[i].textBox.statetext = parseInt(state);
                  }
                  else if (this.mouth[i].textBox.enumerador ==2) {
                      this.mouth[i].textBox.text = note2;
                      this.mouth[i].textBox.state = parseInt(state2);
                      this.mouth[i].textBox.statetext = parseInt(state2);
                  }
                  else if (this.mouth[i].textBox.enumerador == 3) {
                      this.mouth[i].textBox.text = note3;
                      this.mouth[i].textBox.state = parseInt(state3);
                      this.mouth[i].textBox.statetext = parseInt(state3);
                  }

              }
          }
      }
      /**/
  } else if(t1 > 1000 && t1 < 5000){

      this.mouth = this.odontAdult;
      this.spaces = this.odontSpacesAdult;


  } else if(t1 > 5000){

      this.mouth = this.odontChild;
      this.spaces = this.odontSpacesChild;

  }

    // check if we should add damage to a tooth
    if (surface === "X") {

      // if id is less than 1000 then we have to find a tooth
      if (tooth < 1000) {

          var t = this.getToothById(tooth);

          /*jjallo 11092020*/
          var xcontador = '';
          //if (damage == this.constants.MOVILIDAD_PATOLOGICA && note != '' && note != undefined) {
          //    xcontador = note.substr(1, 1);
          //    t.contador = parseInt(xcontador);
          //    note = '';
          //}
          if (damage == this.constants.CORONA_DEFINITIVA)//|| damage == this.constants.PULPAR 04042023
          {
              //30112023
              //xcontador = state;
              if (state !== "0") xcontador = state;
              else if (state2 !== "0") xcontador = state2;
              else if (state3 !== "0") xcontador = state3;
              //
          }

          if (damage == this.constants.PULPAR) {
              if (state !== "0") {
                  xcontador = state;
                  state = 0;
              }
              else if (state2 !== "0") xcontador = state2;
              else if (state3 !== "0") xcontador = state3;
              //
          }
          /**/

          //06122023
          if (damage == this.constants.DIENTE_AUSENTE) {
              if (state !== "0") {
                  xcontador = state;
                  state = 0;
              }
              else if (state2 !== "0") xcontador = state2;
              else if (state3 !== "0") xcontador = state3;
              //
          }
          //

          //05122023
          if (damage == this.constants.IMPLANTE) {
              if (state !== "0") {
                  xcontador = state;
                  state = 0;
              }
              else if (state2 !== "0") xcontador = state2;
              else if (state3 !== "0") xcontador = state3;
          }
          //

          //this.collisionHandler.handleCollision(t, damage, direction, state, statetext);
          this.collisionHandler.handleCollision(t, damage, direction, state, statetext, posicion, xcontador);//jjallo 11092020


          //04122023
          if (damage == this.constants.CORONA_DEFINITIVA) {
              if (note !== undefined && note !== "") this.setTextToTextBox(t.textBox, note, note2, note3); //jjallo 11092020
              t.textBox.text = t.textBox.text;
              t.textBox.statetext = t.textBox.statetext;
              t.textBox.hallazgo = t.textBox.hallazgo;
              t.textBox.enumerador = t.textBox.enumerador;
          }
          //





          if (damage == this.constants.CORONA_DEFINITIVA) {//|| damage == this.constants.PULPAR 04042023
              //debugger;
              if ((note2 !== undefined && note2 !== "") || (note3 !== undefined && note3 !== "")) {
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {

                          //04122023
                          //if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 1) {
                          //    this.mouth[i].textBox.text = note
                          //    this.mouth[i].textBox.state = parseInt(state);
                          //    this.mouth[i].textBox.statetext = parseInt(state);
                          //}
                          //

                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 2) {

                              /*comentado 30112023
                              //this.mouth[k].textBox.statetext = parseInt(state);
                              this.mouth[k].textBox.statetext = parseInt(state2);//21112023
                              this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                              t.textBox2.text = this.mouth[k].textBox.text;//29112023
                              t.textBox2.statetext = this.mouth[k].textBox.statetext;//29112023
                              t.textBox2.enumerador = this.mouth[k].textBox.enumerador;//29112023
                              */
                              //30112023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA)
                              {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.mouth[k].textBox.text;
                                  t.textBox2.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.mouth[k].textBox.enumerador;
                              }
                              //
                          }
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 3) {

                              /*comentado 30112023
                              //this.mouth[k].textBox.statetext = parseInt(state);
                              this.mouth[k].textBox.statetext = parseInt(state3);//21112023
                              this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                              t.textBox3.text = this.mouth[k].textBox.text;//29112023
                              t.textBox3.statetext = this.mouth[k].textBox.statetext;//29112023
                              t.textBox3.enumerador = this.mouth[k].textBox.enumerador;//29112023
                              */

                              //30112023
                              if (this.mouth[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.mouth[k].textBox.text;
                                  t.textBox3.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.mouth[k].textBox.enumerador;
                              }
                              //
                          }
                      }
                  }

                  //if (this.mouth.length < 61)
                  if (this.odontChild.length < 61)
                  {
                      for (var k = 20; k < this.odontChild.length; k++) {
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 2) {

                              /* comentado 30112023
                              this.odontChild[k].textBox.statetext = parseInt(state2);//21112023
                              this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                              */

                              //30112023
                              if (this.odontChild[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.odontChild[k].textBox.text;
                                  t.textBox2.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                              //

                          }
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 3) {

                              /*comentado 30112023
                              this.odontChild[k].textBox.statetext = parseInt(state3);//21112023
                              this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                              */

                              //30112023
                              if (this.odontChild[k].textBox.hallazgo === this.constants.CORONA_DEFINITIVA) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.odontChild[k].textBox.text;
                                  t.textBox3.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                              //
                          }
                      }
                  }
              }
          }


          //04122023
          if (damage == this.constants.PULPAR) {
              if (note !== undefined && note !== "") this.setTextToTextBox(t.textBox, note, note2, note3); //jjallo 11092020
              t.textBox.text = t.textBox.text;
              t.textBox.statetext = t.textBox.statetext;
              t.textBox.hallazgo = t.textBox.hallazgo;
              t.textBox.enumerador = t.textBox.enumerador;
          }
          if (damage == this.constants.PULPAR) {
              //debugger;
              if ((note2 !== undefined && note2 !== "") || (note3 !== undefined && note3 !== "")) {
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.mouth[k].textBox.text;
                                  t.textBox2.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.PULPAR) {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.mouth[k].textBox.text;
                                  t.textBox3.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                      }
                  }
                  if (this.odontChild.length < 61) {
                      for (var k = 20; k < this.odontChild.length; k++) {
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 2) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.PULPAR) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.odontChild[k].textBox.text;
                                  t.textBox2.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 3) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.PULPAR) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.odontChild[k].textBox.text;
                                  t.textBox3.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                      }
                  }
              }
          }
          //

          //06122023
          if (damage == this.constants.DIENTE_AUSENTE) {
              if (note !== undefined && note !== "") this.setTextToTextBox(t.textBox, note, note2, note3);
              t.textBox.text = t.textBox.text;
              t.textBox.statetext = t.textBox.statetext;
              t.textBox.hallazgo = t.textBox.hallazgo;
              t.textBox.enumerador = t.textBox.enumerador;
          }
          if (damage == this.constants.DIENTE_AUSENTE) {
              if ((note2 !== undefined && note2 !== "") || (note3 !== undefined && note3 !== "")) {
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.mouth[k].textBox.text;
                                  t.textBox2.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                  this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.mouth[k].textBox.text;
                                  t.textBox3.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                      }
                  }
                  if (this.odontChild.length < 61) {
                      for (var k = 20; k < this.odontChild.length; k++) {
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 2) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.odontChild[k].textBox.text;
                                  t.textBox2.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 3) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.DIENTE_AUSENTE) {
                                  this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.odontChild[k].textBox.text;
                                  t.textBox3.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                      }
                  }
              }
          }
          //

          //05122023
          if (damage == this.constants.IMPLANTE) {
              t.textBox.text = t.textBox.text;
              t.textBox.statetext = t.textBox.statetext;
              t.textBox.hallazgo = t.textBox.hallazgo;
              t.textBox.enumerador = t.textBox.enumerador;
          }
              //debugger;
              if ((note2 !== undefined && note2 !== "") || (note3 !== undefined && note3 !== "")) {
                  if (this.mouth.length > 60) {
                      for (var k = 32; k < this.mouth.length; k++) {
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 2) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  //this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.mouth[k].textBox.text;
                                  t.textBox2.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                          if (this.mouth[k].id == tooth && this.mouth[k].textBox.enumerador == 3) {
                              if (this.mouth[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  //this.setTextToTextBox(this.mouth[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.mouth[k].textBox.text;
                                  t.textBox3.statetext = this.mouth[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.mouth[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.mouth[k].textBox.enumerador;
                              }
                          }
                      }
                  }
                  if (this.odontChild.length < 61) {
                      for (var k = 20; k < this.odontChild.length; k++) {
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 2) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  //this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox2.text = this.odontChild[k].textBox.text;
                                  t.textBox2.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox2.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox2.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                          if (this.odontChild[k].id == tooth && this.odontChild[k].textBox.enumerador == 3) {
                              if (this.odontChild[k].textBox.hallazgo === this.constants.IMPLANTE) {
                                  //this.setTextToTextBox(this.odontChild[k].textBox, note, note2, note3);
                                  t.textBox3.text = this.odontChild[k].textBox.text;
                                  t.textBox3.statetext = this.odontChild[k].textBox.statetext;
                                  t.textBox3.hallazgo = this.odontChild[k].textBox.hallazgo;
                                  t.textBox3.enumerador = this.odontChild[k].textBox.enumerador;
                              }
                          }
                      }
                  }
          }
          //


      }
      else {
          // if the id is greater than 1000
          // then we have to find a space
          this.collisionHandler.handleCollision(this.getSpaceById(tooth), damage);
      }
  } else {
      //debugger;
      // the damage should be added to a surface of a tooth
      var surfaceId = tooth + "_" + surface;

      var t = this.getToothById(tooth);
      var surface = t.getSurfaceById(surfaceId);

      /*jjallo 11092020*/
      //if (damage == this.constants.CURACION || damage == 1)
      if (damage == this.constants.CURACION || damage == this.constants.CARIES) //24112023
      {
          if (damage === this.constants.CURACION) {  //05122023

              //surface.clic_check = 1; comentado 05122023
              //05122023
              if (parseInt(state) === 1)
                  surface.clic_check = 3;
              else
                  surface.clic_check = 2;
              //

              surface.touching = true;
              //surface.statetext = 0;
              surface.statetext = (state === '11' ? 0 : parseInt(state));//06122023
              surface.state = damage;//24112023

              //comentado 29112023
              //t.textBox.text = note;
              //t.textBox.statetext = parseInt(state);//24112023
              //t.textBox2.text = note2;
              //t.textBox2.statetext = parseInt(state);//24112023
              //t.textBox3.text = note3;
              //t.textBox3.statetext = parseInt(state);//24112023
              //

              //29112023
              if (note !== undefined && note !== '') {
                  t.textBox.text = note;
                  t.textBox.statetext = (state === '11' ? 0 : parseInt(state));//06122023
                  t.textBox.hallazgo == damage;//05122023
              }
              if (note2 !== undefined && note2 !== '') {
                  t.textBox2.text = note2;
                  t.textBox2.statetext = (state === '11' ? 0 : parseInt(state));//06122023
                  t.textBox2.hallazgo == damage;//05122023
              }
              if (note3 !== undefined && note3 !== '') {
                  t.textBox3.text = note3;
                  t.textBox3.statetext = (state === '11' ? 0 : parseInt(state));//06122023
                  t.textBox3.hallazgo == damage; //05122023
              }
              //
          }
          //else if (damage = 1) {
          if (damage === this.constants.CARIES) {//04122023

              /*comentado 04122023
              //t.textBox.statetext = state;
              //surface.clic_check = 3;
              surface.touching = true;
              //surface.statetext = 1;
              surface.statetext = parseInt(state);//24112023
              surface.state = damage;//24112023

              t.textBox.text = note;
              //t.textBox.statetext = state;
              t.textBox.statetext = parseInt(state);//24112023
              t.textBox2.text = note2;
              //t.textBox2.statetext = state2;
              t.textBox2.statetext = parseInt(state);//24112023
              t.textBox3.text = note3;
              //t.textBox3.statetext = state3
              t.textBox3.statetext = parseInt(state);//24112023
              */

              //04122023
              if (note !== undefined && note !== '') {
                  t.textBox.text = note;
                  t.textBox.statetext = parseInt(state);
                  t.textBox.hallazgo == damage;
              }
              if (note2 !== undefined && note2 !== '') {
                  t.textBox2.text = note2;
                  t.textBox2.statetext = parseInt(state);
                  t.textBox2.hallazgo = damage;
              }
              if (note3 !== undefined && note3 !== '') {
                  t.textBox3.text = note3;
                  t.textBox3.statetext = parseInt(state);
                  t.textBox3.hallazgo == damage;
              }
              //

          }
      }

      /*comentado 06122023
      if ( (damage == this.constants.SELLANTES) && note == "S")
      {
          if (state == 0) {
              t.textBox.statetext = state;
              surface.clic_check = 1;
              surface.touching = true;
              surface.statetext = 0;
          }
          else if (state = 1)
          {
              t.textBox.statetext = state;
              surface.clic_check = 3;
              surface.touching = true;
              surface.statetext = 1;
              surface.state = -40;
          }
      }
      */
      //16012024
      if (damage === this.constants.SELLANTES) {
        if (note !== undefined && note !== '') {
            surface.touching = true;
            surface.statetext = parseInt(statetext);
            surface.state = damage;
            t.textBox.text = note;
            t.textBox.statetext =  parseInt(state);
            t.textBox.hallazgo = damage;
        }
        if (note2 !== undefined && note2 !== '') {

            surface.touching = true;
            surface.statetext = parseInt(statetext);
            surface.state = damage;
            t.textBox2.text = note2;
            t.textBox2.statetext = parseInt(state2);
            t.textBox2.hallazgo = damage;
        }
        if (note3 !== undefined && note3 !== '') {

            surface.touching = true;
            surface.statetext = parseInt(statetext);
            surface.state = damage;
            t.textBox3.text = note3;
            t.textBox3.statetext = parseInt(state3);
            t.textBox3.hallazgo = damage;
        }
      }
      if (damage === this.constants.PULPOTOMIA) {
          if (note !== undefined && note !== '') {
              surface.touching = true;
              surface.statetext = parseInt(statetext);
              surface.state = damage;
              t.textBox.text = note;
              t.textBox.statetext = parseInt(state);
              t.textBox.hallazgo = damage;
          }
          if (note2 !== undefined && note2 !== '') {

              surface.touching = true;
              surface.statetext = parseInt(statetext);
              surface.state = damage;
              t.textBox2.text = note2;
              t.textBox2.statetext = parseInt(state2);
              t.textBox2.hallazgo = damage;
          }
          if (note3 !== undefined && note3 !== '') {

              surface.touching = true;
              surface.statetext = parseInt(statetext);
              surface.state = damage;
              t.textBox3.text = note3;
              t.textBox3.statetext = parseInt(state3);
              t.textBox3.hallazgo = damage;
          }
      }
      //


      //04042023 Inicio
      //if (damage === this.constants.PULPOTOMIA && note === "PP")
      //{
      //    if (parseInt(state) === 0) {
      //        t.textBox.statetext = state;
      //        surface.clic_check = 1;
      //        surface.touching = true;
      //        surface.statetext = 0;
      //    }
      //    else if (parseInt(state) === 1) {
      //        t.textBox.statetext = state;
      //        surface.clic_check = 3;
      //        surface.touching = true;
      //        surface.statetext = 1;
      //        surface.state = -46;
      //    }
      //}
      //Fin

      /**/


      //14112023
      if (damage === this.constants.CURACION ) {
          if (state === 0 || state === 11 || state === "0") {
              if (t.textBox.hallazgo === this.constants.CURACION) {//05122023
                  t.textBox.statetext = parseInt(state);
                  t.textBox.state = 0;
                  surface.clic_check = 1;
                  surface.touching = true;
                  //surface.statetext = 0;
                  //state.statetext = -1;
                  surface.statetext = damage;//24112023
                  surface.state = damage;//24112023
              }//05122023
          }
          else if (state === '1') {

              /*comentado 05122023
                  t.textBox.statetext = parseInt(state);//24112023
                  //t.textBox.statetext = parseInt(damage);
                  //t.textBox.state = damage;
                  t.textBox.state = parseInt(state);//24112023
                  surface.clic_check = 3;
                  surface.touching = true;
                  //surface.statetext = damage;
                  surface.statetext = parseInt(state);//24112023
                  surface.state = damage;
              */

              //05122023
              if (t.textBox.hallazgo === this.constants.CURACION) {
                  t.textBox.statetext = parseInt(state);
                  t.textBox.state = parseInt(state);
                  surface.clic_check = 3;
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              if (t.textBox2.hallazgo === this.constants.CURACION) {
                  t.textBox2.statetext = parseInt(state);
                  t.textBox2.state = parseInt(state);
                  surface.clic_check = 3;
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              if (t.textBox3.hallazgo === this.constants.CURACION) {
                  t.textBox3.statetext = parseInt(state);
                  t.textBox3.state = parseInt(state);
                  surface.clic_check = 3;
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              //

          }
      }
      //


      //16012024
      if (damage === this.constants.SELLANTES) {
        if (this.mouth.length > 60) {
            if (statetext === 0 || statetext === "0") {
                if (t.textBox.hallazgo === this.constants.SELLANTES) {
                    t.textBox.statetext = parseInt(state);
                    t.textBox.state = 0;
                    t.textBox.click = 1;
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = 0;
                    surface.state = damage;
                }
                if (t.textBox2.hallazgo === this.constants.SELLANTES) {
                    t.textBox2.statetext = parseInt(state);
                    t.textBox2.state = parseInt(state);
                    if (note2 !== '') {
                        t.textBox2.text = note2;
                        for (var i = 32; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox3.hallazgo === this.constants.SELLANTES) {
                    t.textBox3.statetext = parseInt(state);
                    t.textBox3.state = parseInt(state);
                    if (note3 !== '') {
                        t.textBox3.text = note3;
                        for (var i = 32; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
            }
            else if (statetext === '1') {
                if (t.textBox.hallazgo === this.constants.SELLANTES) {
                    t.textBox.statetext = parseInt(state);
                    t.textBox.state = parseInt(state);
                    if (note !== '') {
                        t.textBox.text = note;
                        t.textBox.click = 1;
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox2.hallazgo === this.constants.SELLANTES) {
                    t.textBox2.statetext = parseInt(state);
                    t.textBox2.state = parseInt(state);
                    if (note2 !== '') {
                        t.textBox2.text = note2;
                        for (var i = 32; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox3.hallazgo === this.constants.SELLANTES) {
                    t.textBox3.statetext = parseInt(state);
                    t.textBox3.state = parseInt(state);
                    if (note3 !== '') {
                        t.textBox3.text = note3;
                        for (var i = 32; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
            }
        }
        else if (this.mouth.length < 61) {
            if (statetext === 0 || statetext === "0") {
                if (t.textBox.hallazgo === this.constants.SELLANTES) {
                    t.textBox.statetext = parseInt(state);
                    t.textBox.state = 0;
                    t.textBox.click = 1;
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = 0;
                    surface.state = damage;
                }
                if (t.textBox2.hallazgo === this.constants.SELLANTES) {
                    t.textBox2.statetext = parseInt(state);
                    t.textBox2.state = parseInt(state);
                    if (note2 !== '') {
                        t.textBox2.text = note2;
                        for (var i = 20; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox3.hallazgo === this.constants.SELLANTES) {
                    t.textBox3.statetext = parseInt(state);
                    t.textBox3.state = parseInt(state);
                    if (note3 !== '') {
                        t.textBox3.text = note3;
                        for (var i = 20; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 1;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
            }
            else if (statetext === '1') {
                if (t.textBox.hallazgo === this.constants.SELLANTES) {
                    t.textBox.statetext = parseInt(state);
                    t.textBox.state = parseInt(state);
                    if (note !== '') {
                        t.textBox.text = note;
                        t.textBox.click = 1;
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox2.hallazgo === this.constants.SELLANTES) {
                    t.textBox2.statetext = parseInt(state);
                    t.textBox2.state = parseInt(state);
                    if (note2 !== '') {
                        t.textBox2.text = note2;
                        for (var i = 20; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
                if (t.textBox3.hallazgo === this.constants.SELLANTES) {
                    t.textBox3.statetext = parseInt(state);
                    t.textBox3.state = parseInt(state);
                    if (note3 !== '') {
                        t.textBox3.text = note3;
                        for (var i = 20; i < this.mouth.length; i++) {
                            if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                this.mouth[i].textBox.click = 1;
                        }
                    }
                    surface.clic_check = 3;
                    surface.touching = true;
                    surface.statetext = parseInt(statetext);
                    surface.state = damage;
                }
            }
        }
      }

      if (damage === this.constants.PULPOTOMIA) {
          if (this.mouth.length > 60) {
              if (statetext === 0 || statetext === "0") {
                  if (t.textBox.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox.statetext = parseInt(state);
                      t.textBox.state = 0;
                      t.textBox.click = 1;
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = 0;
                      surface.state = damage;
                  }
                  if (t.textBox2.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox2.statetext = parseInt(state);
                      t.textBox2.state = parseInt(state);
                      if (note2 !== '') {
                          t.textBox2.text = note2;
                          for (var i = 32; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox3.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox3.statetext = parseInt(state);
                      t.textBox3.state = parseInt(state);
                      if (note3 !== '') {
                          t.textBox3.text = note3;
                          for (var i = 32; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
              }
              else if (statetext === '1') {
                  if (t.textBox.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox.statetext = parseInt(state);
                      t.textBox.state = parseInt(state);
                      if (note !== '') {
                          t.textBox.text = note;
                          t.textBox.click = 1;
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox2.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox2.statetext = parseInt(state);
                      t.textBox2.state = parseInt(state);
                      if (note2 !== '') {
                          t.textBox2.text = note2;
                          for (var i = 32; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox3.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox3.statetext = parseInt(state);
                      t.textBox3.state = parseInt(state);
                      if (note3 !== '') {
                          t.textBox3.text = note3;
                          for (var i = 32; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
              }
          }
          else if (this.mouth.length < 61) {
              if (statetext === 0 || statetext === "0") {
                  if (t.textBox.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox.statetext = parseInt(state);
                      t.textBox.state = 0;
                      t.textBox.click = 1;
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = 0;
                      surface.state = damage;
                  }
                  if (t.textBox2.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox2.statetext = parseInt(state);
                      t.textBox2.state = parseInt(state);
                      if (note2 !== '') {
                          t.textBox2.text = note2;
                          for (var i = 20; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox3.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox3.statetext = parseInt(state);
                      t.textBox3.state = parseInt(state);
                      if (note3 !== '') {
                          t.textBox3.text = note3;
                          for (var i = 20; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 1;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
              }
              else if (statetext === '1') {
                  if (t.textBox.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox.statetext = parseInt(state);
                      t.textBox.state = parseInt(state);
                      if (note !== '') {
                          t.textBox.text = note;
                          t.textBox.click = 1;
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox2.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox2.statetext = parseInt(state);
                      t.textBox2.state = parseInt(state);
                      if (note2 !== '') {
                          t.textBox2.text = note2;
                          for (var i = 20; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 2)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
                  if (t.textBox3.hallazgo === this.constants.PULPOTOMIA) {
                      t.textBox3.statetext = parseInt(state);
                      t.textBox3.state = parseInt(state);
                      if (note3 !== '') {
                          t.textBox3.text = note3;
                          for (var i = 20; i < this.mouth.length; i++) {
                              if (this.mouth[i].id === tooth && this.mouth[i].textBox.enumerador === 3)
                                  this.mouth[i].textBox.click = 1;
                          }
                      }
                      surface.clic_check = 3;
                      surface.touching = true;
                      surface.statetext = parseInt(statetext);
                      surface.state = damage;
                  }
              }
          }
      }
    //

      //24112023
      if (damage === this.constants.CARIES) {
          if (state === 0 || state === 11) {
              if (t.textBox.hallazgo === this.constants.CARIES) {//05122023
                  t.textBox.statetext = parseInt(state);
                  t.textBox.state = 0;
                  surface.clic_check = 1;
                  surface.touching = true;
                  surface.statetext = damage;
                  surface.state = damage;
              }//05122023
          }
          else if (state === '1') {

              /*comentado 05122023
              //t.textBox.statetext = parseInt(state);
              //t.textBox.state = parseInt(state);
              //surface.clic_check = 3;
              //surface.touching = true;
              //surface.statetext = parseInt(state);
              //surface.state = damage;
              */

              //05122023
              if (t.textBox.hallazgo === this.constants.CARIES) {
                  t.textBox.statetext = parseInt(state);
                  t.textBox.state = parseInt(state);
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              if (t.textBox2.hallazgo === this.constants.CARIES) {
                  t.textBox2.statetext = parseInt(state);
                  t.textBox2.state = parseInt(state);
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              if (t.textBox3.hallazgo === this.constants.CARIES) {
                  t.textBox3.statetext = parseInt(state);
                  t.textBox3.state = parseInt(state);
                  surface.touching = true;
                  surface.statetext = parseInt(state);
                  surface.state = damage;
              }
              //
          }
      }
      //

      //setDataSource();
      this.collisionHandler.handleCollisionCheckBox(surface, damage);

      //if (note !== undefined && note !== "") this.setTextToTextBox(t.textBox, note);
      if (note !== undefined && note !== "") this.setTextToTextBox(t.textBox, note, note2, note3);//jjallo 11092020

      //if (damage == this.constants.CURACION) {
      //    if (note2 !== undefined && note2 !== "") this.setTextToTextBox(t.textBox2, note, note2, note3);//jjallo 11092020
      //    if (note3 !== undefined && note3 !== "") this.setTextToTextBox(t.textBox3, note, note2, note3);//jjallo 11092020
      //}
  }
  }

  setDataSource(dataArray: any) {
    this.reset();

    var res = dataArray.split(",");

    var i = 0;

    while (i < res.length) {

        /*jjallo 11092020*/
        if (this.odontAdult.length > 32) {
            //for (var j = 32; j < this.odontAdult.length; j++) {
            for (var j = 0; j < this.odontAdult.length; j++) {//30112023
                if (this.odontAdult[j].id == parseInt(res[i])) {

                    //30112023
                    if (this.odontAdult[j].textBox.enumerador == 1) {
                        if (this.odontAdult[j].textBox.text === "") {
                            this.odontAdult[j].textBox.text = res[i + 3];
                            this.odontAdult[j].textBox.state2 = res[i + 7];
                            this.odontAdult[j].textBox.statetext = res[i + 7];
                            this.odontAdult[j].textBox.hallazgo = (res[i + 3] !== '' ? parseInt(res[i + 1]) : 0);
                        }
                    }
                    //

                    if (this.odontAdult[j].textBox.enumerador == 2) {
                        //21112023
                        if (this.odontAdult[j].textBox.text === "")
                        {
                            //this.odontAdult[j].textBox.text = res[i + 4]; comentado 29112023
                            this.odontAdult[j].textBox.text = res[i + 4];
                            this.odontAdult[j].textBox.state2 = res[i + 8];
                            //this.odontAdult[j].textBox.statetext = res[i + 8];//21112023 comentado 29112023
                            this.odontAdult[j].textBox.statetext = res[i + 8];//21112023
                            this.odontAdult[j].textBox.hallazgo = (res[i + 4] !== '' ? parseInt(res[i + 1]) : 0);//30112023 04122023  ver por la cantidad de hallazgos res[i+13]
                        }
                        //

                        //this.odontAdult[j].textBox.text = res[i + 4];
                        //this.odontAdult[j].textBox2.text = res[i + 4];
                        //this.odontAdult[j].textBox2.state2 = res[i + 8];
                    }
                    if (this.odontAdult[j].textBox.enumerador == 3) {
                        //21112023
                        if (this.odontAdult[j].textBox.text === "") {//30112023
                            //this.odontAdult[j].textBox.text = res[i + 4]; comentado 29112023
                            this.odontAdult[j].textBox.text = res[i + 5]; //30112023
                            this.odontAdult[j].textBox.state2 = res[i + 9]; //30112023
                            //this.odontAdult[j].textBox.statetext = res[i + 8];//21112023 comentado 29112023
                            this.odontAdult[j].textBox.statetext = res[i + 9];//21112023 //30112023
                            this.odontAdult[j].textBox.hallazgo = (res[i + 5] !== '' ? parseInt(res[i + 1]) : 0);//30112023 04122023  ver por la cantidad de hallazgos res[i+13]
                        }
                        //

                        //this.odontAdult[j].textBox.text = res[i + 5];
                        //this.odontAdult[j].textBox3.text = res[i + 5];
                        //this.odontAdult[j].textBox3.state3 = res[i + 9]
                    }
                }
            }
        }

        if (this.odontChild.length > 20) {
            //for (var j = 20; j < this.odontChild.length; j++) {
            for (var j = 0; j < this.odontChild.length; j++) {//30112023
                if (this.odontChild[j].id == parseInt(res[i])) {

                    //30112023
                    if (this.odontChild[j].textBox.enumerador == 1) {
                        if (this.odontChild[j].textBox.text === "") {
                            this.odontChild[j].textBox.text = res[i + 3];
                            this.odontChild[j].textBox.state2 = res[i + 7];
                            this.odontChild[j].textBox.statetext = res[i + 7];
                            this.odontChild[j].textBox.hallazgo = (res[i + 3] !== '' ? parseInt(res[i + 1]) : 0);
                        }
                    }
                    //


                    if (this.odontChild[j].textBox.enumerador == 2) {

                        //21112023
                        if (this.odontChild[j].textBox.text === "") {
                            /*comentado 30112023
                            this.odontChild[j].textBox.text = res[i + 4];
                            this.odontChild[j].textBox2.text = res[i + 4];
                            this.odontChild[j].textBox2.state2 = res[i + 8];
                            this.odontChild[j].textBox.statetext = res[i + 8];//21112023
                            this.odontChild[j].textBox2.statetext = res[i + 8];//21112023
                            */

                            //30112023
                            this.odontChild[j].textBox.text = res[i + 4];
                            this.odontChild[j].textBox.state2 = res[i + 8];
                            this.odontChild[j].textBox.statetext = res[i + 8];
                            this.odontChild[j].textBox.hallazgo = (res[i + 4] !== '' ? parseInt(res[i + 1]) : 0);
                            //
                        }
                        //

                        //this.odontChild[j].textBox.text = res[i + 4];
                        //this.odontChild[j].textBox2.text = res[i + 4];
                        //this.odontChild[j].textBox2.state2 = parseInt( res[i + 8])
                    }
                    if (this.odontChild[j].textBox.enumerador == 3) {

                        //21112023
                        if (this.odontChild[j].textBox.text === "") {
                            /*comentado 30112023
                            this.odontChild[j].textBox.text = res[i + 4];
                            this.odontChild[j].textBox3.text = res[i + 4];
                            this.odontChild[j].textBox3.state2 = res[i + 8];
                            this.odontChild[j].textBox.statetext = res[i + 8];//21112023
                            this.odontChild[j].textBox3.statetext = res[i + 8];//21112023
                            */

                            //30112023
                            this.odontChild[j].textBox.text = res[i + 5];
                            this.odontChild[j].textBox.state2 = res[i + 9];
                            this.odontChild[j].textBox.statetext = res[i + 9];
                            this.odontChild[j].textBox.hallazgo = (res[i + 5] !== '' ? parseInt(res[i + 1]) : 0);
                            //
                        }
                        //
                    }
                }
            }
        }
        /**/

        //this.load(Number(res[i]), Number(res[i + 1]), res[i + 2], res[i + 3], res[i + 4], res[i + 5], res[i + 6]);
        this.load(Number(res[i]), Number(res[i + 1]), res[i + 2], res[i + 3], res[i + 4], res[i + 5], res[i + 6], res[i + 7], res[i + 8], res[i + 9], res[i + 10], res[i + 11]);//jjallo 11092020
        //i = i + 7;
        i = i + 12; //jjallo 11092020
    }

    this.mouth = this.odontAdult;
    this.spaces = this.odontSpacesAdult;
    sessionStorage.setItem("mouth", JSON.stringify(this.mouth));

    //08112023
    //debugger;
    var encontrarFija = 0;
    var encontrarFijo = 0;
    var encontrarRemovible = 0;
    var finOdontAdult = 32;
    var finOdontChild = 20;
    var cadena = '';
    var minimo = 0;
    var maximo = 0;
    for (var n = 0; n < this.odontAdult.slice(0, finOdontAdult).length; n++) {
        for (var y = 0; y < this.odontAdult[n].damages.length; y++) {
            if (this.odontAdult[n].damages[y].id == this.constants.PROTESIS_FIJA_RIGHT) {
                encontrarFija = 1;
                minimo = this.odontAdult[n].id;
            }
            if (encontrarFija == 1 && this.odontAdult[n].damages[y].id == this.constants.PROTESIS_FIJA_LEFT) {
                maximo = this.odontAdult[n].id;
                var arr1 = [minimo, maximo];
                this.arrayRange.push(arr1);
                encontrarFija = 0;
            }

            if (this.odontAdult[n].damages[y].id == this.constants.ORTODONTICO_FIJO_END) {
                if (this.odontAdult[n].damages[y].id == this.constants.ORTODONTICO_FIJO_END && encontrarFijo == 0) {
                    encontrarFijo = 1;
                    minimo = this.odontAdult[n].id;
                }
                else if (encontrarFijo == 1 && this.odontAdult[n].damages[y].id == this.constants.ORTODONTICO_FIJO_END) {

                    //if (this.odontAdult[n + 1].damages.length == 0) {comentado 30112023
                    if (this.odontAdult[n + 1].damages.length == 0 || this.odontAdult[n + 1].damages.length > 0) {//30112023
                        maximo = this.odontAdult[n].id;
                        var arr1 = [minimo, maximo];


                        //30112023
                        var aumento = 0;
                        var mayor = 0;
                        var menor = 0;
                        if (arr1[0] > arr1[1]) {
                            mayor = arr1[0];
                            menor = arr1[1];
                        }
                        else {
                            mayor = arr1[1];
                            menor = arr1[0];
                        }

                        for (var i = menor; i < mayor; i++) aumento++;
                        if (aumento === 1) {
                            for (var z = 0; z < this.odontAdult[n].damages.length; z++) {
                                if (this.odontAdult[n].damages[z].id === this.constants.ORTODONTICO_FIJO_CENTER)
                                    this.odontAdult[n].damages[z].indicador = 1;
                            }
                            aumento = 0;
                        }
                        //


                        this.arrayRange.push(arr1);
                        encontrarFijo = 0;
                    }
                    /*for (var x = 0; x < this.odontAdult[n + 1].damages.length; x++) { comentado 30112023
                        if (this.odontAdult[n + 1].damages[x].id != this.constants.ORTODONTICO_FIJO_END) {
                            maximo = this.odontAdult[n].id;
                            var arr1 = [minimo, maximo];
                            this.arrayRange.push(arr1);
                            encontrarFijo = 0;
                        }
                    }*/
                }
            }
            //29112023
           /* else if (this.odontAdult[n].damages[y].id === this.constants.ORTODONTICO_FIJO_CENTER) {
                var aumento = 0;
                var mayor = 0;
                var menor = 0;
                if (maximo === 0 && this.arrayRange.length === 0) {
                    maximo = this.odontAdult[n].id;
                    var arr1 = [minimo, maximo];
                    this.arrayRange.push(arr1);

                    for (var x = 0; x < this.arrayRange.length; x++) aumento++;
                    if (aumento === 1) this.odontAdult[n].damages[y].indicador = 1;
                }
                else if (encontrarFijo === 0 && this.odontAdult[n].damages[y].id === this.constants.ORTODONTICO_FIJO_CENTER && this.arrayRange.length > 0) {
                    for (var x = 0; x < this.arrayRange.length; x++) {

                        if (this.arrayRange[x][0] > this.arrayRange[x][1]) {
                            mayor = this.arrayRange[x][0];
                            menor = this.arrayRange[x][1];
                        }
                        else {
                            mayor = this.arrayRange[x][1];
                            menor = this.arrayRange[x][0];
                        }

                        for (var i = menor; i < mayor; i++) aumento++;
                        if (aumento === 1) {
                            this.odontAdult[n].damages[y].indicador = 1;
                            aumento = 0;
                        }
                    }
                }
            }*/
            //

            if (this.odontAdult[n].damages[y].id == this.constants.ORTONDICO_REMOVIBLE) {
                if (this.odontAdult[n].damages[y].id == this.constants.ORTONDICO_REMOVIBLE && encontrarRemovible == 0) {
                    encontrarRemovible = 1;
                    minimo = this.odontAdult[n].id;
                }
                else if (encontrarRemovible == 1 && this.odontAdult[n].damages[y].id == this.constants.ORTONDICO_REMOVIBLE) {

                    if (this.odontAdult[n + 1].damages.length == 0) {
                        maximo = this.odontAdult[n].id;
                        var arr1 = [minimo, maximo];
                        this.arrayRange.push(arr1);
                        encontrarRemovible = 0;
                    }
                    for (var x = 0; x < this.odontAdult[n + 1].damages.length; x++) {
                        if (this.odontAdult[n + 1].damages[x].id != this.constants.ORTONDICO_REMOVIBLE) {
                            maximo = this.odontAdult[n].id;
                            var arr1 = [minimo, maximo];
                            this.arrayRange.push(arr1);
                            encontrarRemovible = 0;
                        }
                    }
                }
            }
        }
    }

    //29112023
    encontrarFijo = 0;
    minimo = 0;
    maximo = 0;
    //

    for (var a = 0; a < this.odontChild.slice(0, finOdontChild).length; a++) {
        for (var b = 0; b < this.odontChild[a].damages.length; b++) {
            if (this.odontChild[a].damages[b].id == this.constants.PROTESIS_FIJA_RIGHT) {
                encontrarFija = 1;
                minimo = this.odontChild[a].id;
            }
            if (encontrarFija == 1 && this.odontChild[a].damages[b].id == this.constants.PROTESIS_FIJA_LEFT) {
                maximo = this.odontChild[a].id;
                var arr1 = [minimo, maximo];
                this.arrayRange.push(arr1)
                encontrarFija = 0;
            }

            if (this.odontChild[a].damages[b].id == this.constants.ORTODONTICO_FIJO_END) {
                if (this.odontChild[a].damages[b].id == this.constants.ORTODONTICO_FIJO_END && encontrarFijo == 0) {
                    encontrarFijo = 1;
                    minimo = this.odontChild[a].id;
                }
                else if (encontrarFijo == 1 && this.odontChild[a].damages[b].id == this.constants.ORTODONTICO_FIJO_END) {

                    //if (this.odontChild[a + 1].damages.length == 0) { //comentado 30112023
                    if (this.odontChild[a + 1].damages.length == 0 || this.odontChild[a + 1].damages.length > 0) {//30112023
                        maximo = this.odontChild[a].id;
                        var arr1 = [minimo, maximo];


                        //30112023
                        var aumento = 0;
                        var mayor = 0;
                        var menor = 0;
                        if (arr1[0] > arr1[1]) {
                            mayor = arr1[0];
                            menor = arr1[1];
                        }
                        else {
                            mayor = arr1[1];
                            menor = arr1[0];
                        }

                        for (var i = menor; i < mayor; i++) aumento++;
                        if (aumento === 1) {
                            for (var z = 0; z < this.odontChild[a].damages.length; z++) {
                                if (this.odontChild[a].damages[z].id === this.constants.ORTODONTICO_FIJO_CENTER)
                                    this.odontChild[a].damages[z].indicador = 1;
                            }
                            aumento = 0;
                        }
                        //

                        this.arrayRange.push(arr1);
                        encontrarFijo = 0;
                    }
                    /*for (var x = 0; x < this.odontChild[a + 1].damages.length; x++) {  30112023 comentado
                        if (this.odontChild[a + 1].damages[x].id != this.constants.ORTODONTICO_FIJO_END) {
                            maximo = this.odontChild[a].id;
                            var arr1 = [minimo, maximo];
                            this.arrayRange.push(arr1);
                            encontrarFijo = 0;
                        }
                    }*/
                }
            }
            //29112023
            /*else if (this.odontChild[a].damages[b].id === this.constants.ORTODONTICO_FIJO_CENTER) {
                var aumento = 0;
                var mayor = 0;
                var menor = 0;
                if (maximo === 0 && this.arrayRange.length === 0) {
                    maximo = this.odontChild[a].id;
                    var arr1 = [minimo, maximo];
                    this.arrayRange.push(arr1);

                    for (var x = 0; x < this.arrayRange.length; x++) aumento++;
                    if (aumento === 1) this.odontChild[a].damages[b].indicador = 1;
                }
                else if (maximo === 0 && this.arrayRange.length > 0) {
                    maximo = this.odontChild[a].id;
                    var arr1 = [minimo, maximo];
                    this.arrayRange.push(arr1);

                    for (var x = 0; x < this.arrayRange.length; x++)
                    {
                        if (this.arrayRange[x][0] > this.arrayRange[x][1]) {
                            mayor = this.arrayRange[x][0];
                            menor = this.arrayRange[x][1];
                        }
                        else {
                            mayor = this.arrayRange[x][1];
                            menor = this.arrayRange[x][0];
                        }

                        for (var i = menor; i < mayor; i++) aumento++;
                        if (aumento === 1) {
                            this.odontChild[a].damages[b].indicador = 1;
                            aumento = 0;
                        }
                    }
                }
                else if (encontrarFijo === 0 && this.odontChild[a].damages[b].id === this.constants.ORTODONTICO_FIJO_CENTER && this.arrayRange.length > 0) {
                    for (var x = 0; x < this.arrayRange.length; x++) {

                        if (this.arrayRange[x][0] > this.arrayRange[x][1]) {
                            mayor = this.arrayRange[x][0];
                            menor = this.arrayRange[x][1];
                        }
                        else {
                            mayor = this.arrayRange[x][1];
                            menor = this.arrayRange[x][0];
                        }

                        for (var i = menor; i < mayor; i++) aumento++;
                        if (aumento === 1) {
                            this.odontChild[a].damages[b].indicador = 1;
                            aumento = 0;
                        }
                    }
                }
            }*/
            //

            if (this.odontChild[a].damages[b].id == this.constants.ORTONDICO_REMOVIBLE) {
                if (this.odontChild[a].damages[b].id == this.constants.ORTONDICO_REMOVIBLE && encontrarRemovible == 0) {
                    encontrarRemovible = 1;
                    minimo = this.odontChild[a].id;
                }
                else if (encontrarRemovible == 1 && this.odontChild[a].damages[b].id == this.constants.ORTONDICO_REMOVIBLE) {

                    if (this.odontChild[a + 1].damages.length == 0) {
                        maximo = this.odontChild[a].id;
                        var arr1 = [minimo, maximo];
                        this.arrayRange.push(arr1);
                        encontrarRemovible = 0;
                    }
                    for (var x = 0; x < this.odontChild[a + 1].damages.length; x++) {
                        if (this.odontChild[a + 1].damages[x].id != this.constants.ORTONDICO_REMOVIBLE) {
                            maximo = this.odontChild[a].id;
                            var arr1 = [minimo, maximo];
                            this.arrayRange.push(arr1);
                            encontrarRemovible = 0;
                        }
                    }
                }
            }
        }
    }

    if (cadena != '') {
        for (var i = 0; i < cadena.split(',').length; i++) {
            this.arrayRange.push(cadena.split(',')[i]);
        }
    }
  }

  setCallback(callback: any) {
    this.callback = callback;
  }

  imprimirDocumento() {
    this.preview = !this.preview;

    this.odontAdultcopy = this.odontAdult;
    this.odontChildtcopy = this.odontChild;
    /**/

    if (!this.preview) {
      this.hidePrintPreview();
    } else {
      this.showPrintPreview();
    }
  }

  togglePrintPreview() {
    this.preview = !this.preview;

    this.odontAdultcopy = this.odontAdult;
    this.odontChildtcopy = this.odontChild;
    /**/

    if (!this.preview) {
      this.hidePrintPreview();
    } else {
      this.showPrintPreview();
      this.print();
    }
  }

  togglePrintPreviewDocumento() {
    //debugger;
    // this.preview = !this.preview;
    // this.odontAdultcopy = this.odontAdult;
    // this.odontChildtcopy = this.odontChild;
    // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // if (!this.preview) {
    //   this.hidePrintPreview();
    // } else {
    //   this.showPrintPreview();
    //   var windowContent = '<!DOCTYPE html>';
    //   windowContent += '<html lang="en">';
    //   windowContent += '<head>';
    //   windowContent +=
    //     '<meta http-equiv="content-type" content="text/html;charset=utf-8" />';
    //   windowContent += '<title>OIM Odontograma</title>';
    //   windowContent += '</head>';
    //   windowContent += '<body style=" margin:0;">';
    //   windowContent +=
    //     '<img style="display: block;margin-left: auto;margin-right: auto;" src="' +
    //     canvas.toDataURL() +
    //     '">';
    //   windowContent += '</body>';
    //   windowContent += '</html>';
    //   var processItemsDeferred: any = [];
    //   var param = "{html:'" + windowContent + "'}";
    //   $.ajax({
    //     type: 'POST',
    //     url: 'Odontograma.aspx/cargaDocumentos',
    //     data: param,
    //     contentType: 'application/json; charset=utf-8',
    //     dataType: 'json',
    //     async: true,
    //     success: function (data) {
    //       if (data.d !== '0') {
    //         console.log('cargaDocumentos-idDocumento:' + data.d);
    //         processItemsDeferred.push(this.processItem(data.d));
    //         processItemsDeferred.push($.Deferred().reject());
    //         $.when.apply($, processItemsDeferred).always(this.everythingDone());
    //       } else {
    //         return;
    //       }
    //     },
    //     error: function (error) {
    //       console.log('error togglePrintPreviewDocumento:' + error.status);
    //     },
    //   });
    // }
  }

  processItem(data: any) {
    // var dfd = $.Deferred();
    // dfd.resolve();
    // this.result.push(data);
    // console.log('processItem-data' + data);
    // return dfd.promise();
  }

  everythingDone() {
    var params: any;
    params = this.result[0];

    if (params.length > 0) {
      this.printDocumento();
    }
  }

  printDocumento() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var dataUrl = canvas.toDataURL();

    var windowContent = "<!DOCTYPE html>";
    windowContent += '<html lang="en">';
    windowContent += "<head>";
    windowContent +=
      '<meta http-equiv="content-type" content="text/html;charset=utf-8" />';
    windowContent += "<title>OIM Odontograma</title>";
    windowContent += "</head>";
    windowContent += '<body style=" margin:0;">';
    windowContent +=
      '<img style="display: block;margin-left: auto;margin-right: auto;" src="' +
      dataUrl +
      '">';
    windowContent += "</body>";
    windowContent += "</html>";

    var printWin: any = window.open(
      "",
      "",
      "width=" + screen.availWidth + ",height=" + screen.availHeight + 200
    );
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener(
      "load",
      function () {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();
      },
      true
    );

    this.preview = false;
    this.hidePrintPreview();
  }

  showPrintPreview() {
    this.renderer.setCanvasSize(this.renderer.width, 1700);

  for (var i = 0; i < this.odontAdult.length; i++) {
      if (this.odontAdult[i].type === 1) {
          this.odontAdult[i].moveUpDown(this.printPreviewPositionChange * 2 + 120);
          this.odontAdult[i].textBox.rect.y += 20;
      } else {
          this.odontAdult[i].moveUpDown(120);
          this.odontAdult[i].textBox.rect.y -= 20;
      }
  }

  for (var i = 0; i < this.odontSpacesAdult.length; i++) {
      if (this.odontSpacesAdult[i].type === 1) {
          this.odontSpacesAdult[i].moveUpDown(this.printPreviewPositionChange * 2 + 120);
      } else {
          this.odontSpacesAdult[i].moveUpDown(120);
      }
  }

  for (var i = 0; i < this.odontChild.length; i++) {
      this.odontChild[i].moveUpDown(this.printPreviewPositionChange + 120);
      if (this.odontChild[i].type === 0) {
          this.odontChild[i].textBox.rect.y -= this.printPreviewPositionChange;
      } else {
          this.odontChild[i].textBox.rect.y += this.printPreviewPositionChange;
      }
  }

  for (var i = 0; i < this.odontSpacesChild.length; i++) {
      this.odontSpacesChild[i].moveUpDown(this.printPreviewPositionChange + 120);
  }

  // realligne all teeth and damages
  for (var i = 0; i < this.odontAdult.length; i++) {
      this.odontAdult[i].refresh(this.constants);
  }

  for (var i = 0; i < this.odontChild.length; i++) {
      this.odontChild[i].refresh(this.constants);
  }


    this.update();
  }

  hidePrintPreview() {
    this.renderer.setCanvasSize(this.renderer.width, this.renderer.height);

    var contador_10_19 = 0;
    var contador_20_29 = 0;
    var contador_30_39 = 0;
    var contador_40_49 = 0;
    var contador_50_56 = 0;
    var contador_60_66 = 0;

    var posicion1 = 0;
    var posicion2 = 0;
    var posicion3 = 0;
    var posicion4 = 0;
    var posicion_1 = 0;

    var canvas = document.getElementById("canvas");
    this.setCanvas(canvas);


    for (var i = 0; i < this.odontAdult.length; i++) {
      var cadena = this.odontAdult[i].image.src.split("/");
      var img =
        "/gestionmedica/assets/print/" + cadena[cadena.length - 1].substring(1); //pruebas

      //debugger;
      this.odontAdult[i].image.src = img;
      if (this.odontAdult[i].id > 10 && this.odontAdult[i].id < 19) {
        contador_10_19++;
        this.odontAdult[i].y = 220;
        this.odontAdult[i].textBox.rect.y = 158 + posicion1;
        if (contador_10_19 == 8) {
          contador_10_19 = 0;
          posicion1 = posicion1 - 20;
        }
      }
      if (this.odontAdult[i].id > 20 && this.odontAdult[i].id < 29) {
        contador_20_29++;
        this.odontAdult[i].y = 220;
        this.odontAdult[i].textBox.rect.y = 158 + posicion2;
        if (contador_20_29 == 8) {
          contador_20_29 = 0;
          posicion2 = posicion2 - 20;
        }
      }
      if (this.odontAdult[i].id > 30 && this.odontAdult[i].id < 39) {
        contador_30_39++;
        this.odontAdult[i].y = 810;
        this.odontAdult[i].textBox.rect.y = 942 + posicion3;
        if (contador_30_39 == 8) {
          contador_30_39 = 0;
          posicion3 = posicion3 + 20;
        }
      }
      if (this.odontAdult[i].id > 40 && this.odontAdult[i].id < 49) {
        contador_40_49++;
        this.odontAdult[i].y = 810;
        this.odontAdult[i].textBox.rect.y = 942 + posicion4;
        if (contador_40_49 == 8) {
          contador_40_49 = 0;
          posicion4 = posicion4 + 20;
        }
      }
      /**/

      if (this.odontAdult[i].type == 1) {
        this.odontAdult[i].moveUpDown(
          -this.printPreviewPositionChange * 2 - 120
        );
        this.odontAdult[i].textBox.rect.y -= 20;
      } else {
        this.odontAdult[i].moveUpDown(-120);
        this.odontAdult[i].textBox.rect.y += 20;
      }
    }

    for (var i = 0; i < this.odontSpacesAdult.length; i++) {
      if (this.odontSpacesAdult[i].type == 1) {
        this.odontSpacesAdult[i].moveUpDown(
          -this.printPreviewPositionChange * 2 - 120
        );
      } else {
        this.odontSpacesAdult[i].moveUpDown(-120);
      }
    }

    /*jjallo 02122020*/
    posicion1 = 0;
    posicion2 = 0;
    /**/

    for (var i = 0; i < this.odontChild.length; i++) {
      /*jjallo 11092020*/
      var cadena = this.odontChild[i].image.src.split("/");
      //var img = cadena[0] + '//' + cadena[2] + '/images/' + cadena[cadena.length - 1].substring(1); //desarrollo
      var img =
        "/gestionmedica/assets/print/" + cadena[cadena.length - 1].substring(1); //pruebas

      this.odontChild[i].image.src = img;
      // if (this.odontChild[i].id > 50 && this.odontChild[i].id < 56) this.odontChild[i].y = 410;
      // if (this.odontChild[i].id > 60 && this.odontChild[i].id < 66) this.odontChild[i].y = 410;
      if (this.odontChild[i].id > 50 && this.odontChild[i].id < 56) {
        contador_50_56++;
        this.odontChild[i].y = 410;
        this.odontChild[i].textBox.rect.y = 178 + posicion1;
        if (contador_50_56 == 5) {
          contador_50_56 = 0;
          posicion1 = posicion1 - 20;
        }
      }
      if (this.odontChild[i].id > 60 && this.odontChild[i].id < 66) {
        contador_60_66++;
        this.odontChild[i].y = 410;
        this.odontChild[i].textBox.rect.y = 178 + posicion2;
        if (contador_60_66 == 5) {
          contador_60_66 = 0;
          posicion2 = posicion2 - 20;
        }
      }
      /**/

      this.odontChild[i].moveUpDown(-this.printPreviewPositionChange - 120);
      if (this.odontChild[i].type == 0) {
        this.odontChild[i].textBox.rect.y += this.printPreviewPositionChange;
      } else {
        this.odontChild[i].textBox.rect.y -= this.printPreviewPositionChange;
      }
    }

    for (var i = 0; i < this.odontSpacesChild.length; i++) {
      this.odontSpacesChild[i].moveUpDown(
        -this.printPreviewPositionChange - 120
      );
    }

    for (var i = 0; i < this.odontAdult.length; i++) {
      this.odontAdult[i].refresh();
    }

    for (var i = 0; i < this.odontChild.length; i++) {
      this.odontChild[i].refresh();
    }

    this.update();
  }

  loadPatientData(data: any) {
    this.treatmentData.office = data.office;
    this.treatmentData.patient = data.patient;
    this.treatmentData.number = data.number;
    this.treatmentData.treatmentNumber = data.treatmentNumber;
    this.treatmentData.treatmentDate = data.treatmentDate;
    this.treatmentData.dentist = data.dentist;
    this.treatmentData.observations = data.observations;
    this.treatmentData.specs = data.specs;
    this.treatmentData.plan = data.plan;
    //
    this.treatmentData.sede = data.sede;
    this.treatmentData.numero_historia = data.numero_historia;
    this.treatmentData.paciente = data.paciente;
    this.treatmentData.numero_consulta = data.numero_consulta;
    this.treatmentData.fecha_consulta = data.fecha_consulta;
    this.treatmentData.odontologo = data.odontologo;
    //
    this.treatmentData.especificaciones = data.especificaciones;
    this.treatmentData.observaciones = data.observaciones;
    this.treatmentData.plan_tratamiento = data.plan_tratamiento;

  }

  createDate() {
    var today: any = new Date();
    var dd: any = today.getDate();
    var mm: any = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "/" + mm + "/" + yyyy;

    return today;
  }

  createHeader() {
    var seperation = 13;

    //this.renderer.renderTextCenter16("Odontograma",
    this.renderer.renderTextCenter16(
      "",
      this.renderer.width / 2,
      seperation,
      "#000000"
    );

    this.renderer.renderText14(
      "Fecha: " + this.createDate(),
      this.renderer.width / 2 + 200,
      seperation,
      "#000000"
    );

    seperation = 15;

    this.renderer.renderText14("Sede", 4, seperation * 2, "#000000");

    this.renderer.renderText14(
      ": " + this.treatmentData.sede,
      100,
      seperation * 2,
      "#000000"
    );

    this.renderer.renderText14(
      "Nro. HC",
      this.renderer.width / 2 + 50,
      seperation * 2,
      "#000000"
    );

    this.renderer.renderText14(
      ": " + this.treatmentData.numero_historia,
      this.renderer.width / 2 + 200,
      seperation * 2,
      "#000000"
    );

    this.renderer.renderText14("Paciente", 4, seperation * 3, "#000000");

    this.renderer.renderText14(
      ": " + this.treatmentData.paciente,
      100,
      seperation * 3,
      "#000000"
    );

    this.renderer.renderText14("Nro. Consulta", 4, seperation * 4, "#000000");

    this.renderer.renderText14(
      ": " + this.treatmentData.numero_consulta,
      100,
      seperation * 4,
      "#000000"
    );

    this.renderer.renderText14(
      "Fecha de consulta",
      this.renderer.width / 2 + 50,
      seperation * 4,
      "#000000"
    );

    this.renderer.renderText14(
      ": " + this.treatmentData.fecha_consulta,
      this.renderer.width / 2 + 200,
      seperation * 4,
      "#000000"
    );

    this.renderer.renderText14("Odont\u00F3logo", 4, seperation * 5, "#000000");

    this.renderer.renderText14(
      ": " + this.treatmentData.odontologo,
      100,
      seperation * 5,
      "#000000"
    );
  }

  printPreview() {
    this.renderer.clear(this.settings, 1);
    var contador_10_19 = 0;
    var contador_20_29 = 0;
    var contador_30_39 = 0;
    var contador_40_49 = 0;
    var contador_50_56 = 0;
    var contador_60_66 = 0;
    var contador_70_76 = 0;
    var contador_80_86 = 0;
    var posicion1 = 0;
    var posicion2 = 0;
    var posicion3 = 0;
    var posicion4 = 0;
    var posicion_1 = 0;
    var posicion_2 = 0;
    var posicion_3 = 0;
    var posicion_4 = 0;
    /**/

    this.createHeader();
    this.odontAdultcopy = (this.odontAdult);

    for (var i = 0; i <= this.odontAdultcopy.length - 1; i++) {
      const cadena = this.odontAdultcopy[i].image.src.split("/");
      const img = "/gestionmedica/assets/print/" + cadena[cadena.length - 1]; //pruebas
      this.odontAdultcopy[i].image.src = img;
      if (this.odontAdultcopy[i].id > 10 && this.odontAdultcopy[i].id < 19) {
        contador_10_19++;
        this.odontAdultcopy[i].y = 264;
        this.odontAdultcopy[i].textBox.rect.y = 121 + posicion1;
        if (contador_10_19 == 8) {
          contador_10_19 = 0;
          posicion1 = posicion1 - 20;
        }
        /**/
      }
      if (this.odontAdultcopy[i].id > 20 && this.odontAdultcopy[i].id < 29) {
        contador_20_29++;
        this.odontAdultcopy[i].y = 264;

        if (this.odontAdultcopy[i].surfaces > 0) {
          this.odontAdultcopy[i].textBox.rect.y = 121 + posicion2;
          if (contador_20_29 == 8) {
            contador_20_29 = 0;
            posicion2 = posicion2 - 20;
          }
        } else if (this.odontAdultcopy[i].surfaces == 0 && i > 47 && i < 56) {
          this.odontAdultcopy[i].textBox.rect.y = 121 + posicion2;
          if (contador_20_29 == 8) {
            contador_20_29 = 0;
            posicion2 = posicion2 + 60;
          }
        } else if (this.odontAdultcopy[i].surfaces == 0 && i > 55 && i < 64) {
          this.odontAdultcopy[i].textBox.rect.y = 41 + posicion2;
          if (contador_20_29 == 8) {
            contador_20_29 = 0;
            posicion2 = posicion2 - 40;
          }
        }
        /**/
      }

      if (this.odontAdultcopy[i].id > 30 && this.odontAdultcopy[i].id < 39) {
        contador_30_39++;
        this.odontAdultcopy[i].y = 809;
        this.odontAdultcopy[i].textBox.rect.y = 982 + posicion3;
        if (contador_30_39 == 8) {
          contador_30_39 = 0;
          posicion3 = posicion3 + 20;
        }
      }
      if (this.odontAdultcopy[i].id > 40 && this.odontAdultcopy[i].id < 49) {
        contador_40_49++;
        this.odontAdultcopy[i].y = 809;
        this.odontAdultcopy[i].textBox.rect.y = 982 + posicion4;
        if (contador_40_49 == 8) {
          contador_40_49 = 0;
          posicion4 = posicion4 + 20;
        }
      }
    }

    this.odontChildtcopy = (this.odontChild);

    for (var j = 0; j <= this.odontChildtcopy.length - 1; j++) {
      const cadena = this.odontChildtcopy[j].image.src.split("/");
      //var img = cadena[0] + '//' + cadena[2] + '/images/d' + cadena[cadena.length - 1]; //desarrollo
      const img = "/gestionmedica/assets/print/" + cadena[cadena.length - 1]; //pruebas
      this.odontChildtcopy[j].image.src = img;
      if (this.odontChildtcopy[j].id > 50 && this.odontChildtcopy[j].id < 56) {
        contador_50_56++;
        this.odontChildtcopy[j].y = 454;

        this.odontChildtcopy[j].textBox.rect.y = 181 + posicion_1;
        if (contador_50_56 == 5) {
          contador_50_56 = 0;
          posicion_1 = posicion_1 - 20;
        }
        /**/
      }
      if (this.odontChildtcopy[j].id > 60 && this.odontChildtcopy[j].id < 66) {
        contador_60_66++;
        this.odontChildtcopy[j].y = 454;

        this.odontChildtcopy[j].textBox.rect.y = 181 + posicion_2;
        if (contador_60_66 == 5) {
          contador_60_66 = 0;
          posicion_2 = posicion_2 - 20;
        }
        /**/
      }
    }

    const odontoSpacesAdultCopy = (this.odontSpacesAdult);
    const odontoSpacesChildCopy = (this.odontSpacesChild);

    this.renderer.render(
      this.odontAdultcopy,
      this.settings,
      this.constants,
      "IMP"
    );
    this.renderer.render(odontoSpacesAdultCopy, this.settings, this.constants);

    this.renderer.render(
      this.odontChildtcopy,
      this.settings,
      this.constants,
      "IMP"
    );
    this.renderer.render(odontoSpacesChildCopy, this.settings, this.constants);

    if (this.settings.DEBUG) {
      this.renderer.renderText("DEBUG MODE", 2, 15, "#000000");
      this.renderer.renderText(
        "X: " + this.cursorX + ", Y: " + this.cursorY,
        128,
        15,
        "#000000"
      );
    }

    this.renderer.renderText("Especificaciones: ", 4, 1100, "#000000");
    this.renderer.wrapText(
      this.treatmentData.especificaciones,
      8,
      1122,
      this.renderer.width - 8,
      14,
      8
    );
    this.renderer.renderText("Observaciones: ", 4, 1300, "#000000"); //1300
    this.renderer.wrapText(
      this.treatmentData.observaciones,
      8,
      1322,
      this.renderer.width - 8,
      14,
      8
    );

    this.renderer.renderText("Plan de tratamiento: ", 4, 1500, "#000000");
    this.renderer.wrapText(
      this.treatmentData.plan_tratamiento,
      8,
      1522,
      this.renderer.width - 8,
      14,
      5
    );
    this.renderer.renderText("------------------------------------------------------------------------------------------******", 320, 1650, "#000000");
    this.renderer.wrapText(
     'FIRMA Y SELLO DEL PROFESIONAL TRATANTE',
      338,
      1672,
      this.renderer.width - 8,
      14,
      5
    );
    /**/
  }

  getBase64() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    // const base64Canvas = canvas.toDataURL("application/pdf").split(';base64,')[1];
    // return base64Canvas;
  }

  print() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const base64Canvas = canvas
      .toDataURL("application/pdf")
      .split(";base64,")[1];
    var dataUrl = canvas.toDataURL();

    var windowContent = "<!DOCTYPE html>";
    windowContent += '<html lang="en">';
    windowContent += "<head>";
    windowContent +=
      '<meta http-equiv="content-type" content="text/html;charset=utf-8" />';
    windowContent += "<title>OIM Odontograma</title>";
    windowContent += "</head>";
    windowContent += '<body style=" margin:0;">';
    windowContent +=
      '<img style="display: block;margin-left: auto;margin-right: auto;" src="' +
      dataUrl +
      '">'; //jjallo 11092020
    windowContent += "</body>";
    windowContent += "</html>";

    var printWin: any = window.open(
      "",
      "",
      "width=" + screen.availWidth + ",height=" + screen.availHeight + 200
    );
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener(
      "load",
      function () {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();
      },
      true
    );

    this.preview = false;
    this.hidePrintPreview();
  }

  toggleObserverActivation(b: any) {
    this.observerActivated = b;
  }

  setObserver(obs: any) {
    this.observer = obs;
  }
}
