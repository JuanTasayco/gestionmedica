import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export class CustomValidators {

    public static formatDatePicker(absCtrl: AbstractControl) {

        if(isNaN(absCtrl.value))
        {            
            return null;
        }
        
        if (moment.isMoment(absCtrl.value)) {
            const ctrl = absCtrl.value.creationData().input;
            if (typeof ctrl === 'string' && 
                (RegularExpression.FormatoFecha).test(ctrl) ||
                typeof ctrl === 'object' && 
                ctrl.hasOwnProperty('year') && 
                ctrl.hasOwnProperty('month') && 
                ctrl.hasOwnProperty('date')
                ) {
                return null;
            }
        }

        if (!absCtrl.value && absCtrl.errors && absCtrl.errors.matDatepickerParse) {
            const dpValue = absCtrl.errors.matDatepickerParse.text;
            if (!dpValue)
                return null;
        }

        return { formatDatePicker: true };
    }

    public static pattern(reg: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {           
            if( String(control.value).trim().length == 0)
            {
                return null;
            }            
            var value = control.value ? <string>control.value : '';                  
            return String(value).match(reg) ? null : { 'pattern': { value } };
        }
    }

    public static compareDates(minDate : any, maxDate : any): ValidatorFn {

        return (control: AbstractControl): { [key: string]: any } => {
            let momentdate : any;

            let fechaMinima : string = moment(minDate).format("YYYY-MM-DD");
            let fechaMaxima : string = moment(maxDate).format("YYYY-MM-DD");

            let value : string = moment(control.value).format("YYYY-MM-DD");

            momentdate = moment(value).isBetween(fechaMinima, fechaMaxima, null, '[]');

            if(momentdate)
                return null
            else
                return { 'compareDates' : true };
            
        }
    }

    public static minYears(years : number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            var minDate = moment().subtract(years, 'years');
            var value = <string>control.value;
            var momentdate = moment(value).isBefore(minDate);
            return momentdate ? { 'minYears': momentdate } : null;
        }
    }

    public static maxYears(years : number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            var maxDate ;
            if (years < 0)
                 maxDate = moment().subtract(Math.abs(years), 'years');
            else
                maxDate = moment().add(years, 'years');

            var value = <string>control.value;
            var momentdate = moment(value).isAfter(maxDate);
            return momentdate ? { 'maxYears': momentdate } : null;
        }
    }

    public static Validator(reg: RegExp, event)
    {
        var key = event.which || event.keyCode;

        let texto: string = event.target.value;                                            
        if (texto.length == 0)
        {
            if (String.fromCharCode(key) == " ")
            {
                return false;
            }
        }
        else if(texto.length > 0)
        {
            if(texto.substring(texto.length - 1, texto.length) == " ")
            {
                if (String.fromCharCode(key) == " ")
                {
                    return false;
                }
            } 
        }        
                
        var regEx;    
        regEx = /[^$%&#<>'?]/;
        // 37: Left Arrow/ 38: Up Arrow/ 39: Right Arrow/ 40: Down Arrow/ 8: Backspace/ 46: Delete keys
        if(key == 37 || key == 38 || key == 39 || key == 40 || key == 8  || key == 46) {                  
            if(regEx.test(String.fromCharCode(key)))
            {
                if (!reg.test(String.fromCharCode(key))) {                    
                    event.preventDefault();
                    return false;
                }
                else{                    
                    return true;
                }
            }
            else{
                return false;
            }
        }
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode);        
    	if (!reg.test(key)) {
        	event.preventDefault();
        	return false;
		}
    }

    public static ValidateEmail(event)
    {
        var keynum;
        var keychar;
        var regEx;       
        keynum = !event.charCode ? event.which : event.charCode;
        keychar = String.fromCharCode(keynum);
        regEx = /[^$#<>?]/;           
        if (keynum == 8 || keynum == 9 || keynum == 35 || keynum == 36 || keynum == 37
            || keynum == 38 || keynum == 39 || keynum == 40 || keynum == 46)
            return regEx.test(keychar);
        regEx = /[A-Z0-9a-z@]/;
        return regEx.test(keychar);
    }

    public static ValidateDecimal(event)
    {
        var key = event.which || event.keyCode;
        let texto: string = event.target.value;
        var regEx; 
        if (String.fromCharCode(key) == " ")
        {
            return false;
        }
        else{
            if((texto.indexOf(".") != -1) && (String.fromCharCode(key) == "."))
            {                
                return false;
            }
            else if((texto.indexOf(".") != -1) && ((texto.length - texto.indexOf(".")) > 2) && (event.target.selectionStart == texto.length))
            {                                                         
                return false;
            }
            else
            {
                regEx = RegularExpression.DECIMAL;
                return regEx.test(String.fromCharCode(key));                
            }                        
        }
    }

    public static RequireMatch(control: AbstractControl) {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { incorrect: true };
        }
        return null;
    }
}

export class RegularExpression {
    public static readonly NoRequiredBoxes_Letters: RegExp = /^((^$)|([A-Za-zÑñáéíóúÁÉÍÓÚ ]+))$/;
    public static readonly SOLO_LETRA: RegExp = /^([A-Za-z]+)$/;
    public static readonly LETRAS_TILDE_ENIE: RegExp = /^([A-Za-zÑñáéíóúÁÉÍÓÚ ]+)$/;
    public static readonly LETRAS_TILDE_ENIE_NUMERO_SPACIO: RegExp = /^([A-Za-zÑñáéíóúÁÉÍÓÚ0-9]+\s)*[A-Za-zÑñáéíóúÁÉÍÓÚ0-9]*$/;
    public static readonly LETRAS_TILDE_ENIE_NUMERO_SPACIO_CARACTERES: 
    RegExp = /^([A-Za-zÑñáéíóúÁÉÍÓÚ0-9,\[\]\\()\'\"+:\-;*{}\_!¿=%$#/.-?|?&]+\s)*[A-Za-zÑñáéíóúÁÉÍÓÚ0-9,\[\]\\()\'\"+:-;*{}\_:!¿|=%$#/.\-?&]*$/;
    public static readonly LETRAS_TILDE_ENIE_PUNTO: RegExp = /^()([A-Za-zÑñáéíóúÁÉÍÓÚ.]+)$/;
    public static readonly LETRAS_TILDE_ENIE_NUMERO: RegExp = /^([A-Za-z0-9ÑñáéíóúÁÉÍÓÚ ]*)$/;
    public static readonly LETRAS_TILDE_ENIE_NUMERO_SIGNO: RegExp = /^([A-Za-z0-9ÑñáéíóúÁÉÍÓÚ ]*)$/;
    public static readonly LETRAS_TILDE_PATTERN: RegExp = /^(^$)|\w+(\s\w+)*$/; //valida texto con espacios entre palabras
    public static readonly LETRAS_ENIE: RegExp = /^([A-Za-zÑñ ]+)$/;
    public static readonly LETRAS_ENIE_SNESPACIO: RegExp = /^([A-Za-zÑñ]+)$/;
    public static readonly LETRAS_ENIE_NUM_SNESPACIO: RegExp = /^([A-Za-z0-9Ññ]+)$/;
    public static readonly NUMERO_ESPACIO: RegExp = /^[0-9]*$/;        // Solo cadena vacia o numeros
    public static readonly SOLO_NUMERO: RegExp = /^[0-9]+$/;           // Solo numeros. No se admite cadena vacia
    public static readonly FormatoFecha: RegExp = /^\d{2}\/\d{2}\/\d{4}$/;           // Solo numeros. No se admite cadena vacia
    //public static readonly FormatEmail: RegExp = /^(([^<>()\[n\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static readonly FormatEmail: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static readonly NUMBER_PHONE: RegExp = /^[-()*]|([0-9]+$)/;
    public static readonly NUMERO_LETRAS: RegExp = /^[a-zA-Z0-9]*$/;    
    //public static readonly LETRAS_TILDE_PATTERN: RegExp = /^\w+(\s\w+)*$/; //valida texto con espacios entre palabras    
    //public static readonly DECIMAL: RegExp = /\d+(\.\d{1,2})?/;
    public static readonly DECIMAL: RegExp = /^[0-9.]+$/;
    public static readonly DECIMAL_FORMAT: RegExp = /^\d+\.?\d{0,2}$/;
    public static readonly CHARACTERES_FORMAT: RegExp = /^([A-Za-zÑñáéíóúÁÉÍÓÚ0-9,\[\]\\()\'\"+:\-;*{}\_!¿=%$#\/\.-?|?&]+\s)*[A-Za-zÑñáéíóúÁÉÍÓÚ0-9,\[\]\\()\'\"+:-;*{}\_:!¿|=%$#\/\.\-?&]*$/;
}

export class RegularExpressionMessage {
    public static readonly SOLO_LETRA_MSG: string = 'Solo se permite letras.';
    public static readonly LETRAS_TILDE_ENIE_MSG: string = 'Solo se permite letras.';
    public static readonly LETRAS_TILDE_ENIE_PUNTO_MSG: string = 'Solo se permite letras, ñ y punto.';
    public static readonly NUMERO_ESPACIO_MSG: string = 'Solo se permite espacios y números.';
    public static readonly SOLO_NUMERO_MSG: string = 'Solo se permite números.';
    public static readonly LETRAS_TILDE_ENIE_NUMERO_MSG: string = 'Solo se permite letras y números';

}

export class MessagesValidation {
    public static readonly CAMPO_OBLIGATORIO_MSG: string = 'Campo Obligatorio';
    public static readonly SELECCIONE_OPCION_MSG: string = 'Seleccione una opción';
    public static readonly SELECCIONE_UBIGEO_MSG: string = 'Seleccione todos los campos de Ubigeo (País, Departamento, Provincia y Distrito)';
    public static readonly SELECCIONE_AFILIADO_MSG: string = 'Busque y seleccione un Afiliado';
    public static readonly SELECCIONE_PROMOTOR_MSG: string = 'Busque y seleccione un Promotor';
    public static readonly SELECCIONE_PLAN_MSG: string = 'Busque y seleccione un Plan';
    public static readonly SELECCIONE_CONTRATANTE_MSG: string = 'Busque y seleccione un Contratante';
    public static readonly SELECCIONE_CONTRATO_MSG: string = 'Busque y seleccione un Contrato';
    public static readonly SELECCIONE_PREFACTURA_MSG: string = 'Busque y seleccione una Prefactura';
    public static readonly MINIMAS_CUOTAS_MSG: string = 'La cantidad mínima de cuotas es de {0}';
    public static readonly MAXIMA_CUOTAS_MSG: string = 'La cantidad máxima de cuotas es de {0}';
    public static readonly MINIMO_MONTO_MSG: string = 'El monto mínimo de cuotas es de S/{0}';
    public static readonly MAXIMO_MONTO_MSG: string = 'El monto máximo de cuotas es de S/{0}';
    public static readonly FECHA_MAXIMA_MSG: string = 'La fecha máxima es incorrecta';
    public static readonly FECHA_MINIMA_MSG: string = 'La fecha mínima es incorrecta';
    public static readonly FORMATDATE_INVALID_MSG: string = 'Formato de fecha invalido';
    public static readonly FORMATMAIL_INVALID_MSG: string = 'Formato de correo invalido';
}
