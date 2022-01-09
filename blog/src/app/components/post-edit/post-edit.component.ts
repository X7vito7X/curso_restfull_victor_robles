import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from 'src/app/models/post';
import { global } from 'src/app/services/global';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'post-edit',
  templateUrl: '../post-new/post-new.component.html',
  providers:[UserService,CategoryService, PostService]
})
export class PostEditComponent implements OnInit {
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
    this.page_title = 'Editar entrada';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post(1,this.identity.sub,1,'','','',null);
    this.url = global.url;
    this.is_edit = true;
  }

  ngOnInit(): void
  {
    this.getCategories();
    this.getPost();
  }
  onSubmit(form:any)
  {
    this._postService.update(this.token,this.post,this.post.id).subscribe
    (
      response=>
      {
        if(response.status = 'success')
        {
          this.status = 'success';
          //this.post = response.post;
          this._router.navigate(['/entrada',this.post.id]);
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
  getPost()
  {
    //Sacamos el ID del post que quiero sacar
    this._route.params.subscribe
    (
      params=>
      {
        let id = +params['id'];
        //Petición AJAX para sacar los datos del POST.
        this._postService.getPost(id).subscribe
        (
          response=>
          {
            if(response.status='success')
            {
              this.post = response.posts;
              if(this.post.user_id!=this.identity.sub)
              {
                this._router.navigate(['inicio']);
              }
            }
            else
            {
              this._router.navigate(['inicio']);
            }
          },
          error=>
          {
            console.log(error);
            this._router.navigate(['inicio']);
          }
        );
      }
    );
  }

}
