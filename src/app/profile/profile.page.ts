import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { UploaderService } from '../uploader/uploader.service';
import {Post} from '../uploader/post.model'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  posts: Post[]
  userPosts
  private postSub: Subscription

  constructor(private afs:AngularFirestore, private user:UserService, private uploaderService: UploaderService, private router: Router) {
   
    // this.uploaderService.getPhotos().subscribe((ImageData)=>{
    //   console.log(ImageData);
    //   const images:Post[] = [];
    //   for(const key in ImageData){
    //     if(ImageData.hasOwnProperty(key)){
    //       images.push({
    //         id:key,
    //         user:ImageData[key].user,
    //         desc:ImageData[key].desc,
    //         img:ImageData[key].img
    //       });
    //     }
    //   }
    //   this.posts = images;
    //   console.log(this.posts)
    // });

    this.postSub = this.uploaderService.getPhotos().subscribe((posts)=>{
      this.posts = posts;
      console.log(posts);
    })

    console.log(this.posts)
    //this.userPosts = posts.valueChanges
    console.log(this.userPosts)
    }

    goTo(postID: string){
      console.log(postID)
      this.router.navigate(['/tabs/post/' + postID])
    }

  ngOnInit() {
      
  }

}
