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
  const fileName = `${name}.${type}`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
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

export const printPdfBase64 = (data: string): void => {
    const binary = atob(data.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([view], {type: 'application/pdf'});
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
};

export const verifyPercentage = (percentage: number): boolean => {
    return percentage > 0 && percentage <= 100;
};
