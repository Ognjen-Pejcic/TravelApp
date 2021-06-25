import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {UploaderService} from '../uploader/uploader.service';
import {Post} from '../uploader/post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  posts:Post[]
  heartType: string = "heart-outline"
  private postsub: Subscription
  public toggled: boolean = false

  
  constructor(private uploaderService:UploaderService) {
    this.toggled = false
  }

  
  cancelSearch(){
    this.toggled = !this.toggled;
  }
  public toggle(): void {
    this.toggled = !this.toggled;
 }

  ngOnInit() {
  this.postsub = this.uploaderService.getPhotos().subscribe((posts)=>{
    this.posts = posts;
    console.log(posts)
  })
  
  }
  toggleHeart(){
    this.heartType = this.heartType == "heart" ? "heart-outline":"heart"
  }
}
