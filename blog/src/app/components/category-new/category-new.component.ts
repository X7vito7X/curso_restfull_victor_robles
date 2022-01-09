import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css'],
  providers: [UserService, CategoryService]
})
export class CategoryNewComponent implements OnInit {

  public page_title:string;
  public identity;
  public token;
  public category: Category;
  public status:any;


  constructor
  (
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _categoryService: CategoryService
  )
  {
    this.page_title = 'Crear nueva categoria';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(1,'');
  }

  ngOnInit(): void {
  }
  onSubmit(form:any)
  {
    this._categoryService.create(this.token, this.category).subscribe
    (
      response =>
      {
        if(response.status = "success")
        {
          this.category = response.caategory;
          this.status = response.status;
          this._router.navigate(['/inicio'])
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

}
