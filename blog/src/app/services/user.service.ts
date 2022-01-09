import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { global } from "./global";


@Injectable()
export class UserService
{

  public url: string;
  public identity:any;
  public token:any;

  constructor
  (
    public _http: HttpClient
  )
  {
    this.url = global.url;
  }
  test()
  {
    return "Hola mundo desde un servicio!!";
  }
  register(user:any): Observable<any>
  {
    let json = JSON.stringify(user);
    let params = 'json='+json;

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.post(this.url+'users/register', params, {headers:headers});
  }
  signup(user:any, getToken:any = null): Observable<any>
  {
    if(getToken != null)
    {
      user.getToken = 'true';
    }
    let json = JSON.stringify(user);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.post(this.url+'users/login', params, {headers:headers});
  }
  update(token:any, user:any): Observable<any>
  {
    let json = JSON.stringify(user);
    let params = 'json='+json;
    //!DEFINIMOS LAS CABECERAS
    let headers = new HttpHeaders()
                                  .set('Content-Type','application/x-www-form-urlencoded')
                                  .set('Authorization',token);
    return this._http.put(this.url+'users/update', params, {headers:headers});
  }
  getIdentity()
  {
    let identity = JSON.parse(localStorage.getItem('identity')||'{}');
    if(identity && identity != "undefined")
    {
        this.identity = identity;
    }
    else
    {
      this.identity = null;
    }
    return this.identity;
  }
  getToken()
  {
    let token = localStorage.getItem('token');
    if(token != 'undefined')
    {
      this.token = token;
    }
    else
    {
      this.token = null;
    }
    return this.token;
  }
  getPosts(id:any): Observable<any>
  {
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'post/user/'+id, {headers:headers});
  }
  getUser(id:any): Observable<any>
  {
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'users/details/'+id, {headers:headers});
  }


}
