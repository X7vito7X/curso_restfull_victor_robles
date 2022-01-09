import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers:[PostService,UserService]
})
export class IndexComponent implements OnInit {

  public page_title: string;
  public url = global.url;
  public posts:any;
  public token:any;
  public identity:any;

  constructor
  (
    private _postService: PostService,
    private _userService: UserService
  ) {
    this.page_title = 'Página de inicio';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void
  {
    this.getPosts();
  }
  getPosts()
  {
    this._postService.getPosts().subscribe
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
        this.getPosts();
      },
      error=>
      {
        console.log(error);
      }
    )
  }

}
