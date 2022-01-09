import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { global } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService,UserService,PostService]
})
export class CategoryDetailComponent implements OnInit {
  public page_title:any;
  public category:any;
  public posts:any
  public url:any
  public identity;
  public token;
  constructor
  (
    private _route: ActivatedRoute,
    private _router:Router,
    private _categoryService: CategoryService,
    private _postService: PostService,
    private _userService: UserService
  )
  {
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void
  {
    this.getPostByCategory();
  }
  getPostByCategory()
  {
    this._route.params.subscribe
    (
      params=>
      {
        let id=+params['id'];
        this._categoryService.getCategory(id).subscribe
      (
        response=>
        {
          if(response.status = 'success')
          {
            this.category = response.category;
            this._categoryService.getPosts(id).subscribe
            (
              response=>
              {
                if(response.status='success')
                {
                console.log(response);
                this.posts = response.posts;
                }
              },
              error=>
              {
                console.log(error);
                this._router.navigate(['/inicio']);

              }
            )
          }
          else
          {
            this._router.navigate(['/inicio']);
          }
        },
        error=>
        {
          console.log(error);
        }
      );
      }
    );
  }
  deletePost(id:any)
  {
    this._postService.delete(this.token,id).subscribe
    (
      response=>
      {
        this.getPostByCategory();
      },
      error=>
      {
        console.log(error);
      }
    )
  }



}
