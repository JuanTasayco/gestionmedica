import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { LoaderService } from '@core/services';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    private totalRequests = 0;

    constructor(public loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.loaderService.show();
        if (request.url.startsWith(environment.urlService) || request.url.startsWith(environment.oimApiPath)) {
            var access_token = localStorage.getItem('jwtMapfreToken_jwtMapfreToken');

            if (access_token) {
                request = request.clone({ setHeaders: { Authorization: `Bearer ${access_token}` } });
                return next.handle(request).pipe(
                    finalize(() => {
                        this.totalRequests--;
                        if (this.totalRequests === 0) this.loaderService.hide();
                    })
                );
            } else {
                return next.handle(request).pipe(
                    finalize(() => {
                        this.totalRequests--;
                        if (this.totalRequests === 0) this.loaderService.hide();
                    })
                );
            }
        } else {
            return next.handle(request).pipe(
                finalize(() => {
                    this.totalRequests--;
                    if (this.totalRequests === 0) this.loaderService.hide();
                })
            );
        }
    }
}
