import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { routing } from 'src/app/app.routing';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: string;
  public token: string;
  public identity: string;


  constructor
  (
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.status = '';
    this.token = '';
    this.identity = '';
    this.page_title = 'Identificate';
    this.user = new User(1, '','','ROLE_USER','','','','');
  }

  ngOnInit(): void
  {
    //TODOS SE EJECUTA Y CIERRA SOLO CUANDO LLEGA EL PARAMETRO SURE POR LA URL
    this.logOut();
  }

  onSubmit(form:any)
  {
    this._userService.signup(this.user).subscribe
    (
      response =>
      {
        //todos TOKEN
        if(response.status!='error')
        {
          this.status = 'success';
          this.token = response;

          //TODOS OBJETO USUARIO IDENTIFICADO
          this._userService.signup(this.user,true).subscribe
            (
              response =>
              {
                this.identity = response;
                //TODOS USAR EL USUARIO IDENTIFICADO
                console.log(this.token);
                console.log(this.identity);
                localStorage.setItem('token',this.token);
                localStorage.setItem('identity',JSON.stringify(this.identity));
                //TODOS REDIRECCION  A LA PAGINA PRINCIPAL
              this._router.navigate(['inicio']);
              },
              error =>
              {
                this.status = 'error';
                console.log(<any>error);
              }
            );
        }
        else
        {
          this.status = 'error';
        }
      },
      error =>
      {
        this.status = 'error';
        console.log(<any>error);
      }
    )
  }
  logOut()
  {
    this._route.params.subscribe(params =>

      {
        let logout = +params['sure'];
        if(logout == 1)
        {
          localStorage.removeItem('identity');
          localStorage.removeItem('token');

          this.identity = '';
          this.token = '';

          //! REDIRECCION  A LA PAGINA PRINCIPAL
          this._router.navigate(['inicio']);

        }
      }

      )
  }

}
