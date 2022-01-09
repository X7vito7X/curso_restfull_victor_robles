import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit
{
  @Input() posts:any;
  @Input() identity:any;
  @Input() url:any;
  @Output() delete = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  deletePost(post_id:any)
  {
    this.delete.emit(post_id);
  }

}
