import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
import { Post } from "../models/post";

@Injectable()
export class PostService
{
  public url: string;
  constructor
  (
    private _http: HttpClient
  )
  {
    this.url = global.url;
  }
  prueba()
  {
    return "Hola desde el servicio de entradas!!";
  }
  create(token:any,post:any):Observable<any>
  {
    let json = JSON.stringify(post);
    let params = "json="+json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization',token);
    return this._http.post(this.url+'post',params, {headers:headers});
  }
  getPosts():Observable<any>
  {
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'post',{headers:headers});
  }
  getPost(id:any):Observable<any>
  {
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'post/'+id,{headers:headers});
  }
  update(token:any,post:any,id:any):Observable<any>
  {
    let json = JSON.stringify(post);
    let params = "json="+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                .set('Authorization',token);
    return this._http.put(this.url+'post/'+id,params,{headers:headers});
  }
  delete(token:any,id:any)
  {
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                .set('Authorization',token);
    return this._http.delete(this.url+'post/'+id,{headers:headers});
  }
}
