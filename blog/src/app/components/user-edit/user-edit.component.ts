import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { global } from 'src/app/services/global';


@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title:string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public froala_option = "";
  public files:any =[];
  public url;

  public afuConfig=
  {
    uploadAPI:
    {
      url: global.url+'users/upload',
      headers:
      {
        "Authorization": this._userService.getToken()
      },
      responseType: 'json',
    },

    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg, .gif",
    maxSise: "50",
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts:
    {
      attachPinBtn: 'Sube tu avatar de usuario',
    }
  }
  constructor
  (
    private _userService: UserService
  )
  {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page_title = 'Ajustes de usuario';
    this.user = new User(1, '','','ROLE_USER','','','','');
    this.status ='';
    //! RELLENAR OBJETO USUARIO
    this.user = new User
    (
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,
      '',
      this.identity.description,
      this.identity.image
    );
    this.url = global.url;

  }

  ngOnInit(): void {
  }
  onSubmit(form:any)
  {
    this._userService.update(this.token,this.user).subscribe
    (
      response =>
      {
        if(response && response.status)
        {
          this.status = 'success';
          //Actualizar el usuario en la session
          if(response.actualizado.name)
          {
            this.user.name = response.actualizado.name;
          }
          if(response.actualizado.surname)
          {
            this.user.surname = response.actualizado.surname;
          }
          if(response.actualizado.email)
          {
            this.user.email = response.actualizado.email;
          }
          if(response.actualizado.description)
          {
            this.user.description = response.actualizado.description;
          }
          if(response.actualizado.image)
          {
            this.user.image = response.actualizado.image;
          }
          this.identity = this.user;
          localStorage.setItem('identity',JSON.stringify(this.identity));
        }
        else
        {
          this.status = 'error';
        }
        console.log(response);
      },
      error=>
      {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
  avatarUpload(datos:any)
  {
    console.log(datos);
    let data = datos.body.image;
    this.user.image = data;
    this.identity.image = data;
  }

}
