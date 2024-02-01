import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { getOptions } from '@shared/helpers';

@Injectable({
    providedIn: 'root'
})
export class DynamicRouteGuard implements CanActivate {
    roles: any[];
    constructor(private router: Router) {
        this.roles = getOptions();
    }

    canActivate(
        routeSnapshot: ActivatedRouteSnapshot,
        ): boolean {
        const codes = routeSnapshot.data.code;
        const hasRole = this.validateRole(codes, this.roles);
        if (hasRole) {
            return true;
        }
        this.router.navigate(['/'], { replaceUrl: true });
    }

    validateRole(codes, roles) {
        return codes.every((item) => roles.some(a => a === item));
    }
}