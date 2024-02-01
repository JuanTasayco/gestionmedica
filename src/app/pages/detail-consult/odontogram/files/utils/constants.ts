export class Constants {
  CARIES = 1;
  CORONA_DEFINITIVA = 2;
  CORONA_TEMPORAL = 3;
  DIENTE_AUSENTE = 4;
  FRACTURA = 5;
  DIASTEMA = 8;
  DIENTE_EXTRUIDO = 9;
  DIENTE_EN_CLAVIJA = 10;
  CURACION = 11;
  PROTESIS_REMOVIBLE = 12;
  MIGRACION = 13;
  GIROVERSION = 14;
  FUSION = 15;
  REMANENTE_RADICULAR = 16;
  DIENTE_INTRUIDO = 20;
  ORTONDICO_REMOVIBLE = 23;
  DIENTE_EN_ERUPCION = 24;
  TRANSPOSICION_LEFT = 25;
  TRANSPOSICION_RIGHT = 26;
  SUPER_NUMERARIO = 27;
  PULPAR = 28;
  PROTESIS_TOTAL = 29;
  PERNO_MUNON = 30;
  EDENTULOA_TOTAL = 31;
  ORTODONTICO_FIJO_END = 32;
  ORTODONTICO_FIJO_CENTER = 33;
  PROTESIS_FIJA_LEFT = 34;
  PROTESIS_FIJA_CENTER = 35;
  PROTESIS_FIJA_RIGHT = 36;
  TRATAMIENTO_TEMPORAL = 39;
  SELLANTES = 40;

  // Damages for writing
  IMPLANTE = 6;
  SEMI_IMPACTACI0N = 7;
  MACRODONCIA = 17;
  MICRODONCIA = 18;
  IMPACTACION = 19;
  DIENTE_ECTOPICO = 21;
  DIENTE_DISCR0MICO = 22;
  SUPERFICIE_DESGASTADA = 37;
  POSICION_DENTARIA = 43;


  FOSAS_PROFUNDAS = 42;
  GEMINACION = 44;
  MOVILIDAD_PATOLOGICA = 45;
  PULPOTOMIA = 46;

  DEFECTO_ESMALTE = 41;//22112023

  isWritable(arg: any) {
    var match = false;

    if (arg === this.DIENTE_DISCR0MICO) {
      match = true;
  } else if (arg === this.DIENTE_ECTOPICO) {
      match = true;
  } else if (arg === this.IMPACTACION) {
      match = true;
  } else if (arg === this.FOSAS_PROFUNDAS) {
      match = true;
  } else if (arg === this.REMANENTE_RADICULAR) {
      match = true;
  } else if (arg === this.CORONA_TEMPORAL) {
      match = true;
  } else if (arg === this.SELLANTES) {
      match = true;
  } else if (arg === this.IMPLANTE) {
      match = true;
  } else if (arg === this.MACRODONCIA) {
      match = true;
  } else if (arg === this.MICRODONCIA) {
      match = true;
  } else if (arg === this.SEMI_IMPACTACI0N) {
      match = true;
  } else if (arg === this.SUPERFICIE_DESGASTADA) {
      match = true;
  } else if (arg === this.PULPOTOMIA) {
      match = true;
  } else if (arg === this.DEFECTO_ESMALTE) {
      match = true;
  }

    return match;
  }
}
