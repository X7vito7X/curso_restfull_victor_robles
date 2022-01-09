import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { Category } from './models/category';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService, CategoryService]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'blog';
  public identity:any;
  public token:any;
  public url;
  public categories:any;


constructor
(
  private _userService: UserService,
  private _categoryService: CategoryService
)
{
  this.loadUser();
  this.url = global.url;

}
ngOnInit()
{
  console.log('Web App cargada correctamente');
  this.getCategories();
}
ngDoCheck()
{
  this.loadUser();
}
loadUser()
{
  this.identity = this._userService.getIdentity();
  this.token = this._userService.getIdentity();
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
        console.log(this.categories);

      }
    },
    error=>
    {
      console.log(error);
    }

  )
}

}
