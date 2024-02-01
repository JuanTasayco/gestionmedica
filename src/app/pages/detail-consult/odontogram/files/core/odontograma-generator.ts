import { Tooth } from '../models/tooth';

export class OdontogramaGenerator {
  currentLoad = 0;

  // variable for how many teeths are in array
  arrayCount = 0;
  separator = 210;
  imgWidth = 40;
  imgHeight = 90;
  engine: any = null;
  settings: any = null;
  constants: any = null;

  setEngine(engine: any) {
    this.engine = engine;
  }

  setSettings(settings: any) {
    this.settings = settings;
  }

  setConstants(constants: any) {
    this.constants = constants;
  }

  updateLoad() {
    this.currentLoad = this.currentLoad + 1;
    if (this.currentLoad >= this.arrayCount) {
      this.engine.start();
    }
  }

  prepareOdontogramaAdult(
    odontograma: any,
    spaces: any,
    canvas: any,
    valor: any
  ) {
    var self = this;
    this.arrayCount = 0;

    // center the ondotograma horizontal
    var width = canvas.width;
    var odontWidth = 16 * this.imgWidth;
    var start = (width - odontWidth) / 2;

    // start of first tooth
    var x = start;

    // center vertial
    var height = canvas.height;
    var odontHeight = 2 * 150;
    var base = (height - odontHeight) / 2;

    // create the 1st group of upper teeth
    for (var i = 18; i > 10; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i > 13) {
            tooth.setSurfaces(5);

        } else {
            tooth.setSurfaces(4);
        }

        var image = new Image();

        image.onload = function () {
            self.updateLoad();
        };

        if (valor == 1) image.src = "assets/print/dentadura-sup-" + i + ".png"; else image.src = "assets/images/dentadura-sup-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base, this.imgWidth, this.imgHeight, 1);//jjallo 11092020

        tooth.setType(0,0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        var space = new Tooth();
        space.setConstants(this.constants);

        space.setSurfaces(5);

        if (i !== 11) {
            var tmpid = (i) + "" + (i - 1);
            space.id = Number(tmpid);

        } else {

            var tmpid = (i) + "" + (21);
            space.id = Number(tmpid);

        }

        //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
        space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo

        space.type = tooth.type;
        space.tooth = false;
        spaces.push(space);
    }

    // create the first 2nd of upper teeth
    for (var i = 21; i < 29; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 24) {
            tooth.setSurfaces(4);
        } else {
            tooth.setSurfaces(5);
        }

        var image = new Image;

        image.onload = function () {
            self.updateLoad();
        };

        if (valor == 1) image.src = "assets/print/dentadura-sup-" + i + ".png"; else image.src = "assets/images/dentadura-sup-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base, this.imgWidth, this.imgHeight, 1);//jjallo 11092020

        tooth.setType(0,0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        if (i < 28) {

            var space = new Tooth();
            space.setConstants(this.constants);
            space.setSurfaces(5);
            var tmpid = (i) + "" + (i + 1);
            space.id = Number(tmpid);

            //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
            space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

            space.type = tooth.type;
            space.tooth = false;
            spaces.push(space);
        }
    }

    // start position of first
    var x = start;
    //debugger;
    // create the 1st group of lower teeth
    for (var i = 48; i > 40; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 44) {
            tooth.setSurfaces(4);

        } else {
            tooth.setSurfaces(5);
        }

        var image = new Image();

        image.onload = function () {
            self.updateLoad();
        };

        if (valor == 1) image.src = "assets/print/dentadura-inf-" + i + ".png"; else image.src = "assets/images/dentadura-inf-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight, 1);//jjallo 11092020

        tooth.setType(1,0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        var space = new Tooth();
        space.setConstants(this.constants);
        space.setSurfaces(5);

        if (i !== 41) {
            var tmpid = (i) + "" + (i - 1);
            space.id = Number(tmpid);

        } else {

            var tmpid = (i) + "" + (31);
            space.id = Number(tmpid);

        }

        //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
        space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

        space.type = tooth.type;
        space.tooth = false;
        spaces.push(space);
    }

    // create the 2nd group of lower teeth
    for (var i = 31; i < 39; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 34) {
            tooth.setSurfaces(4);
        } else {
            tooth.setSurfaces(5);
        }

        var image = new Image();

        image.onload = function () {
            self.updateLoad();
        };

        if (valor == 1) image.src = "assets/print/dentadura-inf-" + i + ".png"; else image.src = "assets/images/dentadura-inf-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight, 1);//jjallo 11092020

        tooth.setType(1,0);

        odontograma[this.arrayCount] = tooth;
        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;
        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        if (i < 38) {

            var space = new Tooth();
            space.setConstants(this.constants);
            space.setSurfaces(5);
            var tmpid = (i) + "" + (i + 1);
            space.id = Number(tmpid);

            //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
            space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

            space.type = tooth.type;
            space.tooth = false;
            spaces.push(space);
        }

    }

    //jjallo
    //permanente posterior left
    x = start;
    for (var i = 18; i > 10; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight,2);
        tooth.setType(0, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;
        odontograma[this.arrayCount] = tooth;
        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = start;
    for (var i = 18; i > 10; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;
        tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight,3);
        tooth.setType(0);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    //permanente posterior right
    var x1 = x;
    x = x1;
    for (var i = 21; i < 29; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;
        tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight,2);
        tooth.setType(0, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = x1;
    for (var i = 21; i < 29; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;
        tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight,3);
        tooth.setType(0, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    //permanente inferior left
    x = start;
    for (var i = 48; i > 40; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight,2);
        tooth.setType(1, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = start;
    for (var i = 48; i > 40; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight,3);
        tooth.setType(1, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    //permanente inferior right
    var x1 = x;
    x = x1;
    for (var i = 31; i < 39; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight,2);
        tooth.setType(1, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = x1;
    for (var i = 31; i < 39; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();
        image.onload = function () {
            self.updateLoad();
        };

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight,3);
        tooth.setType(1, 1);
        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }
  }

  prepareOdontogramaChild(
    odontograma: any,
    spaces: any,
    canvas: any,
    valor: any
  ) {
    this.arrayCount = 0;

    // center odontograma horizontal
    var width = canvas.width;
    var odontWidth = 10 * this.imgWidth;
    var start = (width - odontWidth) / 2;

    // start of first tooth
    var x = start;

    // center odontograma vertical
    var height = canvas.height;
    var odontHeight = 2 * 150;
    var base = (height - odontHeight) / 2;

    for (var i = 55; i > 50; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i > 53) {
            tooth.setSurfaces(5);

        } else {
            tooth.setSurfaces(4);
        }

        var image = new Image();

        if (valor == 1) image.src = "assets/print/dentadura-sup-" + i + ".png"; else image.src = "assets/images/dentadura-sup-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base, this.imgWidth, this.imgHeight,1);//jjallo 11092020

        tooth.setType(0,0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        var space = new Tooth();
        space.setConstants(this.constants);
        space.setSurfaces(5);

        if (i !== 51) {
            var tmpid = (i) + "" + (i - 1);
            space.id = Number(tmpid);

        } else {

            var tmpid = (i) + "" + (61);
            space.id = Number(tmpid);

        }

        //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
        space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

        space.type = tooth.type;
        space.tooth = false;
        spaces.push(space);
    }

    for (var i = 61; i < 66; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 64) {
            tooth.setSurfaces(4);
        } else {
            tooth.setSurfaces(5);
        }

        var image = new Image;

        if (valor == 1) image.src = "assets/print/dentadura-sup-" + i + ".png"; else image.src = "assets/images/dentadura-sup-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base, this.imgWidth, this.imgHeight,1);//jjallo 11092020


        tooth.setType(0, 0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;

        odontograma[this.arrayCount] = tooth;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);


        if (i < 65) {

            var space = new Tooth();
            space.setConstants(this.constants);

            space.setSurfaces(5);
            var tmpid = (i) + "" + (i + 1);
            space.id = Number(tmpid);

            //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
            space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

            space.type = tooth.type;
            space.tooth = false;
            spaces.push(space);
       }
    }

    // start position of first
    var x = start;

    for (var i = 85; i > 80; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 84) {
            tooth.setSurfaces(4);

        } else {
            tooth.setSurfaces(5);
        }


        var image = new Image();

        if (valor == 1) image.src = "assets/print/dentadura-inf-" + i + ".png"; else image.src = "assets/images/dentadura-inf-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight,1);//jjallo 11092020

        tooth.setType(1, 0);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;

        tooth.createSurfaces(this.settings);

        var space = new Tooth();
        space.setConstants(this.constants);
        space.setSurfaces(5);

        if (i !== 81) {
            var tmpid = (i) + "" + (i - 1);
            space.id = Number(tmpid);

        } else {

            var tmpid = (i) + "" + (71);
            space.id = Number(tmpid);

        }

        //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
        space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

        space.type = tooth.type;
        space.tooth = false;

        spaces.push(space);

    }

    for (var i = 71; i < 76; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        if (i < 74) {
            tooth.setSurfaces(4);
        } else {
            tooth.setSurfaces(5);
        }

        var image = new Image();

        if (valor == 1) image.src = "assets/print/dentadura-inf-" + i + ".png"; else image.src = "assets/images/dentadura-inf-" + i + ".png"; //jjallo 11092020

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator, this.imgWidth, this.imgHeight,1);//jjallo 11092020

        tooth.setType(1, 0);

        odontograma[this.arrayCount] = tooth;
        x += tooth.width + this.settings.TOOTH_PADDING;


        tooth.address = this.arrayCount;
        this.arrayCount++;

        tooth.createSurfaces(this.settings);


        if (i < 75) {

            var space = new Tooth();
            space.setConstants(this.constants);

            space.setSurfaces(5);
            var tmpid = (i) + "" + (i + 1);
            space.id = Number(tmpid);

            //space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height);
            space.setDimens(tooth.rect.x + tooth.rect.width / 2, tooth.rect.y, tooth.rect.width, tooth.rect.height,1);//jjallo 11092020

            space.type = tooth.type;
            space.tooth = false;
            spaces.push(space);
        }
    }

    //jjallo
    //temporal superior left
    x = start;
    for (var i = 55; i > 50; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight,2);//jjallo 11092020
        tooth.setType(0, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = start;
    for (var i = 55; i > 50; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight, 3);//jjallo 11092020

        tooth.setType(0, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    //temporal superior right
    var x1 = x;
    for (var i = 61; i < 66; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image;

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base - 20, this.imgWidth, this.imgHeight,2);//jjallo 11092020

        tooth.setType(0, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;

        odontograma[this.arrayCount] = tooth;

        this.arrayCount++;
    }

    x = x1;
    for (var i = 61; i < 66; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image;

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base - 40, this.imgWidth, this.imgHeight,3);//jjallo 11092020

        tooth.setType(0, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;

        odontograma[this.arrayCount] = tooth;

        this.arrayCount++;
    }

    //temporal inferior left
    x = start;
    for (var i = 85; i > 80; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight,2);//jjallo 11092020

        tooth.setType(1, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    x = start;
    for (var i = 85; i > 80; i--) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";

        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight,3);//jjallo 11092020

        tooth.setType(1, 1);

        x += tooth.width + this.settings.TOOTH_PADDING;

        odontograma[this.arrayCount] = tooth;

        tooth.address = this.arrayCount;

        this.arrayCount++;
    }

    //temporal inferior right
    x = x1;
    for (var i = 71; i < 76; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";
        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator + 20, this.imgWidth, this.imgHeight,2);//jjallo 11092020

        tooth.setType(1, 1);

        odontograma[this.arrayCount] = tooth;
        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;
        this.arrayCount++;
    }

    x = x1;
    for (var i = 71; i < 76; i++) {

        var tooth = new Tooth();
        tooth.setConstants(this.constants);

        var image = new Image();

        image.src = "assets/images/prueba.png";
        tooth.id = i;
        tooth.image = image;

        //tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight);
        tooth.setDimens(x, base + this.separator + 40, this.imgWidth, this.imgHeight,3);//jjallo 11092020

        tooth.setType(1, 1);

        odontograma[this.arrayCount] = tooth;
        x += tooth.width + this.settings.TOOTH_PADDING;

        tooth.address = this.arrayCount;
        this.arrayCount++;
    }
  }
}
