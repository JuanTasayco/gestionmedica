import { FormGroup } from "@angular/forms";
import { CONTENT_TYPE } from "./constants";

export const isEmptyValue = (val: any): boolean => {
    if(val == undefined || val == '' || val == null) return true;
    else return false;
};

export const isEmptyObject = (obj: Object): boolean => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) return false;
    else return true;
};

export const encodeBase64 = (val: string): string => {
    return btoa(val);
};

export const decodeBase64 = (val: string): string => {
    return atob(val);
};

export const getValuesID = (val: string): Array<string> => {
    return val.split(':');
};

export const getPathUrl = (url: string): string => {
    return url.substr(1).trim();
};

export const downloadFileFromUrl = (url: string): void => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substr(url.lastIndexOf('/') + 1);
    link.click();
};

export const downloadBase64 = (data: string, name: string, type: string): void => {
  const linkSource = `data:${type};base64,${data}`;
  const downloadLink = document.createElement('a');
  const fileName = `${name}`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};

export const getProfile = () => {
    var profile = JSON.parse(localStorage.getItem('profile'));
    return profile;    
  };
  export const searchElementInArray =(element, array) => {
    return array.includes(element);
  };
  export const getOptions = () => {
    var opcionesJson = JSON.parse(localStorage.getItem('opciones'));
    var opciones = [];
    if(opcionesJson){
    opcionesJson.forEach(element => {
      opciones.push(element.nomCorto);
    });
    }
    
    return opciones;    
  };
  export const getEvoProfile = () => {
    var evoProfile = JSON.parse(localStorage.getItem('evoProfile'));
    return evoProfile;    
  };
export const detailNewTab = (detail) => {
    const url = window.location.href+'/detalle-documentos/' + detail.compania + '/'  + detail.numeroConsulta + '/' + detail.codigoItem + '/' + detail.numeroItem;
    return window.open(url, '_blank');
  };

export const substractMonthFromDate = (date: Date, monthsToSubstract: number): Date => {
   date.setMonth(date.getMonth() - monthsToSubstract);
   return date;
  };
export const  formatBytes = (bytes, decimals): any => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  export const b64toBlob = (dataURI, type) => {
    
    var byteString = atob(dataURI.replace(/\s/g, ''));
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
}

export const printPdfBase64 = (data: string): void => {
    const blob = b64toBlob(data, CONTENT_TYPE.pdf)
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
};

export const verifyPercentage = (percentage: number): boolean => {
    return percentage > 0 && percentage <= 100;
};

export const downloadBase64Async = async (data: string, name: string, type: string) => {
  const base64Response = await fetch(`data:${type};base64,${data}`);
  const blob = await base64Response.blob();

  const downloadLink = document.createElement('a');
  const fileName = `${name}`;
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;
  downloadLink.click();
};

export const markFormGroupTouched = (formGroup: FormGroup) => {
  (Object as any).values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    if (control.controls) {
      markFormGroupTouched(control);
    }
  });
};

export const createUrl = (baseUrl, params) => {
  let url = baseUrl;
  let isFirstParam = true;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if (value) {
        const encodedValue = encodeURIComponent(value);
        if (isFirstParam) {
          url += `?${key}=${encodedValue}`;
          isFirstParam = false;
        } else {
          url += `&${key}=${encodedValue}`;
        }
      }
    }
  }
  return url;
};
