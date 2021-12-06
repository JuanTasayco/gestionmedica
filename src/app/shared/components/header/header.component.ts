import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { environment } from '@environments/environment';

import { ICrumb } from '@shared/models/common/interfaces';
import { CRUMBS_LIST, PATH_URL_DATA, TYPE_LOGIN } from '@shared/helpers';
import { AuthenticationService } from '@shared/services/authentication.service';


@Component({
  selector: 'mapfre-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isPopupPerfilResponsiveVisible: boolean;
  isPopupPerfilDesktopVisible: boolean;

  token: string;
  perfilEjecutivo: string;
  fullUsername: string;

  crumbs: ICrumb[];

  constructor(private router: Router, private authService: AuthenticationService) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.setBreadCrumbs(event.url);
      }
    });
  }

  ngOnInit() {
    var profile = JSON.parse(localStorage.getItem('evoProfile'));
    var roles = profile.rolesCode;
    var loadTeCuidamos = false;
    roles.forEach(role => {
      if(role.nombreAplicacion == 'TCUID') loadTeCuidamos = true;
    })

    if(!loadTeCuidamos) {
      window.location.href = environment.oimHome;
    } else {
      var name = '';
      if(profile) {
        for (var key in TYPE_LOGIN) {
          if ((!TYPE_LOGIN[key].subType || TYPE_LOGIN[key].subType == profile.userSubType) &&
            TYPE_LOGIN[key].type == profile.userType)
            name = TYPE_LOGIN[key].headerName;
        }
        this.perfilEjecutivo = '/ ' + name;
        this.fullUsername = profile ? profile.userName : '';
      } else {
        this.goLogin();
      }
    }
  }

  setBreadCrumbs(path: string) {
    this.crumbs = [];
    let basePath = path.substring(1).split('/')[0];
    let relativePath = path.substring(1).split('/')[1];
    let pathDetalleDocumento = null;
    let crumbList = null

    if(relativePath == 'detalle-documentos' ||  relativePath == 'cargar-documentos'){
     pathDetalleDocumento =basePath;
     crumbList = CRUMBS_LIST.filter(obj=> obj.href == relativePath);
    }else{
      crumbList = CRUMBS_LIST.filter(obj=> obj.href == basePath);
    }
     if(crumbList.length != 0) this.getCrumFromParent(crumbList[0],pathDetalleDocumento);
  }

  getCrumFromParent(crumb : ICrumb,pathDetalle?) {
    let bandejaDocumento= 'bandeja-documentos';
    let historialDocumento = 'historial-documentos';
    let bandejaHistoria = 'bandeja-historias';

    let crumbList = CRUMBS_LIST.filter(obj=> obj.title == crumb.parent);
    if(crumb.parent != '') {
      if(pathDetalle){
        switch(pathDetalle){
          case bandejaDocumento: crumbList = CRUMBS_LIST.filter(obj=> obj.title == bandejaDocumento);break;
          case historialDocumento: crumbList = CRUMBS_LIST.filter(obj=> obj.title == historialDocumento);break;
          case bandejaHistoria: crumbList = CRUMBS_LIST.filter(obj=> obj.title == bandejaHistoria);break;
        }
      }

      if(crumbList.length != 0) this.getCrumFromParent(crumbList[0]);
    }
    this.crumbs.push(crumb);
  }

  toggleSelectPerfilResponsive() {
    this.isPopupPerfilResponsiveVisible = !this.isPopupPerfilResponsiveVisible;
    var heightPopupPerfil = window.innerHeight - 55;
    var mnList = document.getElementById('g-perfil-list-responsive') as HTMLInputElement;
    mnList.style.height = heightPopupPerfil + 'px';
  }

  toggleSelectPerfilDesktop() {
    this.isPopupPerfilDesktopVisible = !this.isPopupPerfilDesktopVisible;
  }

  goHome() {
    window.location.href = environment.oimHome;
  }

  goLogin() {
    localStorage.clear();
    window.location.href = environment.oimHome + 'login';
  }

  signOut() {
    this.authService.logout().subscribe((response: any) => {
      this.goLogin();
    });
  }

  openView(id) {
    switch(id){
      case 0: this.router.navigate([PATH_URL_DATA.urlDefault]) ; break;
      case 20: this.router.navigate([PATH_URL_DATA.urlBandejaDocumento ]) ; break;
      case 5: this.router.navigate([PATH_URL_DATA.urlHistorialDocumento ]) ; break;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    var a = event.target;
    var isClickedElementChildOfPopupPerfilDesktop = false;
    var isClickedElementChildOfPopupPerfilResponsive = false;

    var notFindParentDesktop = true;
    var notFindParentResponsive = true;

    // Inicio - Menu Desktop
    while (notFindParentDesktop && a) {
      if(a.parentNode != null) {
        if (a.parentNode.id == 'menu-perfil-desktop') {
          notFindParentDesktop = false;
          isClickedElementChildOfPopupPerfilDesktop = true;
        }

        a = a.parentNode;

        if (a.tagName == 'HTML' || a.tagName == 'html') a = '';
      } else {
        break;
      }
    }

    if (isClickedElementChildOfPopupPerfilDesktop) return;

    this.isPopupPerfilDesktopVisible = false;

    // Fin - Menu Desktop

    var a = event.target;

    // Inicio - Menu Responsive
    while (notFindParentResponsive && a) {
      if(a.parentNode != null) {
        if (a.parentNode.id == 'menu-perfil-responsive') {
          notFindParentResponsive = false;
          isClickedElementChildOfPopupPerfilResponsive = true;
          var isBackground = document.getElementsByClassName('menu-perfil-background').length > 0;
          if (!isBackground) {
              var node = document.createElement('div');
              document.body.appendChild(node).setAttribute('class', 'menu-perfil-background');
              document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
          }
        }

        a = a.parentNode;

        if (a.tagName == 'HTML' || a.tagName == 'html') a = '';

      } else {
        break;
      }
    }

    if (isClickedElementChildOfPopupPerfilResponsive) {
      var paras = document.getElementsByClassName('menu-perfil-background');
      if (paras.length > 0 && !this.isPopupPerfilResponsiveVisible) {
          while(paras[0]) paras[0].parentNode.removeChild( paras[0] );
          document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
      }
      return;
    }

    this.isPopupPerfilResponsiveVisible = false;
    var paras = document.getElementsByClassName('menu-perfil-background');

    if (paras.length > 0) {
      while(paras[0]) paras[0].parentNode.removeChild( paras[0] );
      document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
    }

    // Fin - Menu Responsive
  }

  @HostListener('window:resize')
  onResize() {
    var isDesktop = window.innerWidth > 991;
    if (isDesktop) {
        this.isPopupPerfilResponsiveVisible = false;
        var paras = document.getElementsByClassName('menu-perfil-background');
        if (paras.length > 0 && !this.isPopupPerfilResponsiveVisible) {
            while(paras[0]) {
                paras[0].parentNode.removeChild(paras[0]);
            }
        }

        document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
    }
  }

}
