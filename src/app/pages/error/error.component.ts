import { Component, OnInit } from '@angular/core';
import { getPathUrl } from '@shared/helpers';
import { Router } from '@angular/router';
import { IMessageRoute } from '@shared/models/common/interfaces';
import { ERROR_ROUTE } from '@shared/helpers'

@Component({
  selector: 'mapfre-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  path: string
  data: IMessageRoute[] = ERROR_ROUTE;
  info: IMessageRoute;
  title: string;
  message: string;

  constructor(private router: Router) {
    this.path = getPathUrl(this.router.url);
  }

  ngOnInit() {
    let info = this.data.filter(o => o.path === this.path);
    this.title = info[0].data.title;
    this.message = info[0].data.message;
  }

}
