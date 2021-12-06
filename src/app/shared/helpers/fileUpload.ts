import { Injectable } from '@angular/core';

import { CONTENT_TYPE, EXTENSION_FILES } from './constants';

import * as FileSaver from 'file-saver';

@Injectable()
export class FileUploadService {
    constructor() { }

    downloadFile(extension: string, codeBlob : any, nameReport : string){
  		switch(extension){
  			case "XLS":
          var blob = new Blob([codeBlob], { type: CONTENT_TYPE.excel });
          FileSaver.saveAs(blob, nameReport + EXTENSION_FILES.excel);
  			break;
  			case "PDF":
          var blob = new Blob([codeBlob], { type: CONTENT_TYPE.pdf });
          FileSaver.saveAs(blob, nameReport + EXTENSION_FILES.pdf);
          break;
        case "ZIP":
  				var blob = new Blob([codeBlob], { type: CONTENT_TYPE.zip });
  				FileSaver.saveAs(blob, nameReport + EXTENSION_FILES.zip);
          break;
        default:
          var contenty_type = this.getContentType(nameReport);
          var blob = new Blob([codeBlob], { type: contenty_type });
  				FileSaver.saveAs(blob, nameReport);
  			break;
  		}
    }
      
    getContentType(filename: string) {
        var type = "";
        var items = filename.split(".");
        var extension = "." + items[1];
        var extensionFile = Object.keys(EXTENSION_FILES).find(key => EXTENSION_FILES[key] === extension);
        type = CONTENT_TYPE[extensionFile];
        return type;
      }
}
