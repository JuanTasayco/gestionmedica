import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { LoaderService } from '@core/services';

@Component({
  selector: 'mapfre-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {
  
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
  }

}
