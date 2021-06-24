import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploaderService } from '../uploader/uploader.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  postID: string
  post
  heartType: string = "heart-outline"
  private postSub: Subscription
  postref: AngularFirestoreDocument
  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private uploaderService:UploaderService, 
    private userService:UserService) { 

  }

  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get('id')
    console.log(this.postID)

    this.postSub = this.uploaderService.getPhoto(this.postID).subscribe((post)=>{
      this.post = post;
      // this.postref = post;
      // this.heartType = post.likes

      console.log(this.post);
    })

    // this.post = this.afs.doc(`posts/${this.postID}`).valueChanges()
    // console.log(this.post)
  }

  toggleHeart(){
    const userid = this.userService.getUID();
    console.log(userid, this.postID)
    this.postSub = this.uploaderService.addLike(this.postID,userid).subscribe((post)=>{
      this.post=post;

    this.heartType = this.heartType == "heart" ? "heart-outline":"heart"
  })
}
}
