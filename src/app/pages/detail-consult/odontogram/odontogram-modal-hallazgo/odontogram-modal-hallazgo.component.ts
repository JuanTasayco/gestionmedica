import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "mapfre-odontogram-modal-hallazgo",
  templateUrl: "./odontogram-modal-hallazgo.component.html",
  styleUrls: ["./odontogram-modal-hallazgo.component.scss"],
})
export class OdontogramModalHallazgoComponent implements OnInit, AfterContentChecked {
  sigla: any;
  siglas: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
      this.siglas = this.data.siglas;
      this.changeDetector.detectChanges();
  }

  siglaChanged(event: any) {
    this.data.sigla = event;
  }

  valorSeleccionados() {}
}
