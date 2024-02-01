import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConsultaMedicaService } from '@shared/services/consultas-medicas.service';
import { EventTrackerService } from '@shared/services/event-tracker.service';

@Component({
  selector: 'medical-rest',
  templateUrl: './medical-rest.component.html',
  styleUrls: ['./medical-rest.component.scss']
})

export class MedicalRestComponent implements OnInit {
  buttonText = 'Registrar';

  baseForm = this.fb.group({
    dias: ['', [Validators.required, Validators.min(1)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private consultaMedService: ConsultaMedicaService,
              private matDialogRef: MatDialogRef<MedicalRestComponent>, private eventTracker: EventTrackerService) { }

  ngOnInit() {
    if (this.data.dias) {
      this.buttonText = 'Actualizar';
      this.baseForm.controls.dias.setValue(this.data.dias);
    }
  }

  sendValue() {
    this.data.data ? this.updateMedicalRest() : this.createMedicalRest();
  }

  createMedicalRest() {
    const request: any = {
      numeroDiaDescanso: +this.baseForm.get('dias').value
    };

    const filtro = {
      "numeroDiaDescanso": request.numeroDiaDescanso,
      "numeroConsulta": this.data.numeroConsulta
    }
    this.eventTracker.postEventTracker("opc50", JSON.stringify(filtro)).subscribe()

    this.consultaMedService.registrarDescansoMedico(+this.data.numeroConsulta, request)
      .subscribe((response: any) => {
        console.log(response);
        this.matDialogRef.close();
      });
  }

  updateMedicalRest() {
    const request: any = {
      numeroDiaDescanso: +this.baseForm.get('dias').value
    };
    this.consultaMedService.actualizarDescansoMedico(+this.data.numeroConsulta, request)
      .subscribe((response: any) => {
        console.log(response);
        this.matDialogRef.close();
      });
  }

  keyFunc(e: any) {
    const value = this.baseForm.get('dias').value.toString();
    const key = e.keyCode || e.charCode;

    // si la tecla es un cero y el primer carácter es un cero
    if (key === 48 ||  key === 96 && value[0] === '0') {
      // se eliminan los ceros delanteros
      this.baseForm.controls.dias.setValue(value.replace(/^0+/, ''));
    }
  }

}
