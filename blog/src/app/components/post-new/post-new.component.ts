import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from 'src/app/models/post';
import { global } from 'src/app/services/global';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers:[UserService,CategoryService, PostService]
})
export class PostNewComponent implements OnInit {
  public page_title:string;
  public identity:any;
  public token:any;
  public post: Post;
  public status:any;
  public categories:any;
  public url;
  public is_edit:any;

  public afuConfig=
  {
    uploadAPI:
    {
      url: global.url+'post/upload',
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
      attachPinBtn: 'Carga una imágen',
    }
  }
  constructor
  (
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _postService: PostService
  )
  {
    this.page_title = 'Crear una entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1,this.identity.sub,1,'','','',null);
    this.url = global.url;

  }

  ngOnInit(): void
  {
    //console.log(this.post);
    this.getCategories();
  }
  onSubmit(form:any)
  {
    this._postService.create(this.token,this.post).subscribe
    (
      response=>
      {
        if(response.status = 'success')
        {
          this.post = response.post;
          this.status = 'success';
          this._router.navigate(['/inicio']);
        }
        else
        {
          this.status='error';
        }
      },
      error=>
      {
        console.log(error);
        this.status='error';
      }
    )
  }
  getCategories()
  {
    this._categoryService.getCategories().subscribe
    (
      response=>
      {
        if(response.status = 'success')
        {
          this.categories = response.categories;
        }
      },
      error=>
      {
        console.log(error);
      }
    )
  }
  imageUpload(datos:any)
  {

    console.log(datos);
    let data = datos.body.image;
    this.post.image = data;
    this.identity.image = data;

  }

}
