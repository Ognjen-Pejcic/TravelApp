import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UploaderService} from './uploader.service';
import{Post} from './post.model';

import { UserService } from '../user.service';
// import {firestore} from 'firebase/app';
  
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})


export class UploaderPage implements OnInit {

  imageURL:string
  desc: string
  posts: Post[]
  private postSub: Subscription



  @ViewChild('fileButton') fileButton

  constructor(
    public http: HttpClient,
    public user: UserService,
    public uploaderService:UploaderService
    ) { }

  ngOnInit() {
    this.uploaderService.getPhotos().subscribe((ImageData)=>{
      console.log(ImageData);
      const images:Post[] = [];
      for(const key in ImageData){
        if(ImageData.hasOwnProperty(key)){
          images.push({
            id:key,
            user:ImageData[key].user,
            desc:ImageData[key].desc,
            img:ImageData[key].img
          });
        }
      }
      this.posts = images;
    });
  }

  createPost(){
    const img = this.imageURL
    const desc = this.desc
    const usr = this.user.getUID()
  
console.log(usr);
    // this.afstore.doc(`users/${this.user.getUID()}`).update({
    //   posts: firebase.firestore.FieldValue.arrayUnion({
    //     image, desc
    //   })
     
    
      // this.http.post<{name: string}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`, {
      //     usr,
      //     desc,
      //     img
      // });

      this.uploaderService.addPhoto(usr, desc, img).subscribe((posts)=>{});
  }

  uploadFile(){
    this.fileButton.nativeElement.click()
  }

  fileChanged(event){
    const files = event.target.files
    console.log(files)

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
		data.append('UPLOADCARE_PUB_KEY', 'b3c4ed5c426fe0e52794')

console.log(data)
//https://ucarecdn.com/  https://upload.uploadcare.com/base/
    this.http.post('https://upload.uploadcare.com/base/', data).subscribe(event=>{
      console.log(event)
      this.imageURL = event['file']
    })
  }
}
