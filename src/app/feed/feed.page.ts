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
  
  constructor(private uploaderService:UploaderService) { }

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
