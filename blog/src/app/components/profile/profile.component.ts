import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[PostService,UserService]
})
export class ProfileComponent implements OnInit {


  public url = global.url;
  public posts:any;
  public token:any;
  public identity:any;
  public user: any;

  constructor
  (
    private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void
  {
    this.getProfile();
  }
  getProfile()
  {
    this._route.params.subscribe
    (
      params=>
      {
        let userId = +params['id'];
        this.getPosts(userId);
        this.getUser(userId);
        //Petición AJAX para sacar los datos del POST.
      }
    );
  }
  getPosts(userId:any)
  {
    this._userService.getPosts(userId).subscribe
    (
      response=>
      {
        if(response.status = 'success')
        {
          this.posts = response.posts;
          console.log(this.posts);
        }
      },
      error=>
      {
        console.log(error);
      }
    )
  }
  deletePost(id:any)
  {
    this._postService.delete(this.token,id).subscribe
    (
      response=>
      {
        this.getProfile();
      },
      error=>
      {
        console.log(error);
      }
    )
  }
  getUser(userId:any)
  {
    this._userService.getUser(userId).subscribe
    (
      response=>
      {
        if(response.status = 'success')
        {
          this.user = response.user;
          console.log(this.user);
        }
      },
      error=>
      {
        console.log(error);
      }
    )
  }

}
