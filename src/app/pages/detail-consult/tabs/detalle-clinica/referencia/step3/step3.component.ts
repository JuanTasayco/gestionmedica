import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: 'referencia-step-3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ReferenciaStep3Component implements OnInit {
  @Input() currentStep: number;
  
  @Output() saveData = new EventEmitter();

  formularioStep3: FormGroup;

  form: any = {};

  isEdit: boolean = true;
  
  constructor() {}
  
  ngOnInit() {
    this.formularioStep3 = new FormGroup({
      observaciones: new FormControl(''),
      resumen: new FormControl(''),
      otros: new FormControl('')
    });
  }

  showCancel() {
    return this.currentStep > 3;
  }

  cancel() {
    this.isEdit = false;
  }

  saveStep() {
    this.isEdit = false;

    const data = {
      observaciones: this.formularioStep3.get('observaciones').value,
      resumen: this.formularioStep3.get('resumen').value,
      otros: this.formularioStep3.get('otros').value
    };

    this.form = data;

    this.saveData.emit({data: data});
  }

  showEdit() {
    this.isEdit = true;

    this.formularioStep3.get('observaciones').patchValue(this.form.observaciones);
    this.formularioStep3.get('resumen').patchValue(this.form.resumen);
    this.formularioStep3.get('otros').patchValue(this.form.otros);
  }
}