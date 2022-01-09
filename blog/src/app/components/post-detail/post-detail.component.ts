import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers:[PostService,UserService]
})
export class PostDetailComponent implements OnInit {
  public post:any;
  public identity:any;
  constructor
  (
    private _postService: PostService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  )
  {
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void
  {
    this.getPost();
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
              console.log(this.post);
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
