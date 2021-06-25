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
   
    }

    goTo(postID: string){
      console.log(postID)
      this.router.navigate(['/tabs/post/' + postID])
    }

  ngOnInit() {
    const usr = this.user.getUID()
    console.log(usr)
    this.postSub = this.uploaderService.getPhotosForUser(usr).subscribe((posts)=>{
      this.posts = posts;
      console.log(posts);
    })
  }

}
