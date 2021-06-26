import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UploaderService } from '../uploader/uploader.service';
import { UserService } from '../user.service';
import { Post } from '../uploader/post.model'
import { Likes } from '../uploader/likes.model'



let error = false;
function doAsyncTask() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject('error');
      } else {
        resolve('done');
      }
    }, 1000);
  });
}

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  postID: string
  post: Post
  likess: Array<Likes> = [];
  heartType: string = "heart-outline"
  private postSub: Subscription
  private likeSub: Subscription
  postref: AngularFirestoreDocument
  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private uploaderService: UploaderService,
    private userService: UserService, private router: Router) {

  }
  ionViewWillEnter() {
    this.likeSub = this.uploaderService.getLikes().subscribe((likes) => {
      this.likess = likes;
      console.log(this.likess);
    });
    console.log(this.likess);
  }


  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get('id');
    console.log(this.postID);

    this.postSub = this.uploaderService.getPhoto(this.postID).subscribe((post) => {
      this.post = post;
      console.log(this.post);

      this.likeSub = this.uploaderService.getLikes().subscribe((likes) => {
        this.likess = likes;
        console.log(this.likess);



        this.likess.forEach((like) => {

          console.log(like.user, this.userService.getUID(), like.post, this.post.id)
          if (like.user == this.userService.getUID() && like.post == this.post.id) {
            this.heartType = "heart";
          }
        });
      });
    });
    //  console.log(this.likess);
    // console.log("linija 38");


  }

  toggleHeart() {
    const userid = this.userService.getUID();
    console.log(userid, this.postID)
    this.postSub = this.uploaderService.getLikes().subscribe((likes) => {
      this.likess = likes;
      console.log(this.likess)
    });
    if (this.heartType == "heart-outline") {
      this.postSub = this.uploaderService.addLike(this.postID, userid).subscribe((post) => {
        //  this.post=post;
        console.log("Lajkovano")



      })
      this.heartType = "heart"
      this.postSub = this.uploaderService.getLikes().subscribe((likes) => {
        this.likess = likes;
        console.log(this.likess)
      });
    }
    else {
      this.likess.forEach(entity => {
        console.log(entity.post, this.post.id, entity.user, this.userService.getUID())



        if (entity.post == this.post.id && entity.user == this.userService.getUID()) {
          this.postSub = this.uploaderService.deleteLike(entity.id).subscribe((like) => {
            // console.log('izbrisan')
          })
        }

      });



      this.heartType = "heart-outline";
    }
  }
 async delete() {
     this.postSub = await this.uploaderService.deletePost(this.postID).subscribe((post) => {
      console.log('izbrisan');
      this.router.navigate(['/tabs/profile'])
    })
  }
}

  


