export class CollisionHandler {
  constants: any = null;

  setConstants(constants: any) {
    this.constants = constants;
  }

  handleCollision(
    tooth: any,
    argument: any,
    direction?: any,
    state?: any,
    statetext?: any,
    posicion?: any,
    contador?: any
  ) {
    var newArg;

    try {
      newArg = Number(argument);
    } catch (e) {}

    if (newArg == 0) {
      tooth.toggleDamage(newArg, direction, state, statetext);
    }

    if (newArg !== 0 && newArg !== undefined && !isNaN(newArg)) {
      if (
        newArg !== this.constants.CARIES &&
        newArg !== this.constants.CURACION
      ) {
        tooth.toggleDamage(
          newArg,
          direction,
          state,
          statetext,
          posicion,
          contador
        );
      }
    }
  }

  handleCollisionCheckBox(checkBox: any, argument: any) {
    var newArg;

    try {
      newArg = Number(argument);
    } catch (e) {
      console.log("Handle Collision Exception: " + e.message);
    }

    if (newArg === this.constants.CARIES) {
      // if (checkBox.state === 1) {
      //   checkBox.state = 0;
      // } else {
      //   checkBox.state = 1;
      // }
      checkBox.state = this.constants.CARIES; //24112023
    } else if (newArg === this.constants.CURACION) {
      // if (checkBox.state === 11) {
      //   checkBox.state = 0;
      // } else {
      //   checkBox.state = 11;
      // }
      checkBox.state = this.constants.CURACION; //24112023
    } else if (newArg === this.constants.TRATAMIENTO_TEMPORAL) {
      if (checkBox.state === 39) {
        checkBox.state = 0;
      } else {
        checkBox.state = 39;
      }
    } else if (newArg === this.constants.SELLANTES) {
      //15012024
        /*
        if (checkBox.state === 40 || checkBox.state === 0) {
            checkBox.state = 40;
        } else {
            checkBox.state = -40;
        }*/
        checkBox.state = this.constants.SELLANTES;
        //
    }
    //04042023 Inicio
    else if (newArg === this.constants.PULPOTOMIA) {
      if (checkBox.state === 46 || checkBox.state === 0) {
        checkBox.state = 46;
      } else {
        checkBox.state = -46;
      }
    }
  }
}
