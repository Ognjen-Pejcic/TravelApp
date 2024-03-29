import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { UploaderService } from '../uploader/crud';
import {Post} from '../uploader/post.model'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { AlertController } from '@ionic/angular'
import { LoadingController } from '@ionic/angular'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  posts: Post[]
  userPosts
  private postSub: Subscription
  isLoading = false
   username :String
   photoURL:string
  constructor(
    private afs:AngularFirestore, 
    private user:UserService, 
    private uploaderService: UploaderService, 
    private router: Router, 
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {
   
  
    
    //console.log(usr)
    console.log(this.username)
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

   
    }

    goTo(postID: string){
      console.log(postID)
      this.router.navigate(['/tabs/post/' + postID])
    }

    ionViewWillEnter(){

      const usr = this.user.getUID()

      this.postSub = this.uploaderService.getPhotosForUser(usr).subscribe((posts)=>{
        this.posts = posts;
        console.log(posts);
      
      })
  
      console.log(this.posts)
      //this.userPosts = posts.valueChanges
      console.log(this.userPosts)

      this.username = this.user.getUsername();
      console.log(this.username)
      this.photoURL = this.user.getImageURL();
      if(this.photoURL==null)
      this.photoURL = "../../assets/avatar.png"
    }
  ngOnInit() {
    const usr = this.user.getUID()
    this.username = this.user.getUsername()
    console.log(usr)
    this.postSub = this.uploaderService.getPhotosForUser(usr).subscribe((posts)=>{
      this.posts = posts;
      console.log(posts);
    })
  }

//   async presentAlert(title: string, content: string){
//     const alert = await this.alertController.create({
//       header: title,
//       message: content,
//       buttons: ['Ok']
//     })
//     await alert.present()
//   }

//  logout(){
//    return this.afAuth.signOut().then(()=>{
//     this.isLoading = true
//     this.loadingController
//     .create({message:"Loading..."})
//     .then((loadingEl)=>{
//       loadingEl.present();
               
//     this.isLoading = false;
//     this.router.navigate(['/login'])
//     loadingEl.dismiss()
//     })
    
//     this.presentAlert('Success!', 'You are logged out!')
//     this.router.navigate(['/login'])
   
//    })
//  }
 

}
