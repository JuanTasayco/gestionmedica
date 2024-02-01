import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NurseGuard implements CanActivate {
    profile: any;
    constructor(private router: Router) {
        this.profile = JSON.parse(localStorage.getItem('evoProfile'));
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        const isNurse = this.isNurse(this.profile);
        if (!isNurse) {
            return true;
        }
        this.router.navigate(['/'], { replaceUrl: true });
    }

    isNurse(profile: any) {
        const rolesCode: any = (profile.rolesCode).find(r => r.nombreAplicacion === 'GESMED');
        if (rolesCode && rolesCode.codigoRol === 'ENFERMERO') {
            return true;
        }
        return false;
    }
}
