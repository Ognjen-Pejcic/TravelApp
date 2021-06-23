import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { UploaderService } from '../uploader/uploader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userPosts

  constructor(private afs:AngularFirestore, private user:UserService, private uploaderService: UploaderService) {
    const posts = uploaderService.getPhotos()
    console.log(posts)
   // this.userPosts = posts.valueChanges
    console.log(this.userPosts)
    }

  ngOnInit() {
  }

}
