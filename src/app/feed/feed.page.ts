import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {UploaderService} from '../uploader/uploader.service';
import {UserService} from '../user.service';
import {Post} from '../uploader/post.model';
import {Likes} from '../uploader/likes.model';
import { Router } from '@angular/router';


interface PostData{
  post:string
  likeid: string,
  ht:string,
  img:string,
  desc:string
  user:string,
  country:string,
  city:string
}
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})


export class FeedPage implements OnInit {
  filterTerm:string
  posts:Post[]
  likes: Array<PostData> = [];
  temp: Array<PostData> = [];
  likess: Array<Likes> = [];
  //likes:Likes[]
   heartType: string = "heart-outline"
  private postsub: Subscription
  public toggled: boolean = false
  search=""
  cancelSearch(){
    this.toggled = !this.toggled;
  }
  public toggle(): void {
    this.toggled = !this.toggled;
 }
  private likessub: Subscription
  constructor(private uploaderService:UploaderService, private userService:UserService, private router:Router) { this.toggled = false }

  ngOnInit(){
    console.log(this.userService.getUID())
    if(this.userService.getUID()==null)
      this.router.navigate(['/login'])

  } 
   ionViewWillEnter(){
 this.likes= [];
 this.likess=[];
   this.postsub = this.uploaderService.getLikes().subscribe((likes)=>{
      this.likess = likes;
      console.log(this.likess)
   

   console.log(this.likess)
  this.postsub = this.uploaderService.getPhotos().subscribe((posts)=>{
    this.posts = posts;
    console.log(posts)
    
    this.posts.forEach(post => {
      let provera = false;
      this.likess.forEach(like=>{
        console.log(post.id,like.post, like.user,this.userService.getUID())
        if(post.id==like.post && like.user==this.userService.getUID()){
          provera=true
          var myObject = {} as PostData;
          myObject.likeid = like.id;
          myObject.post = post.id;
          myObject.desc = post.desc
          myObject.user = like.user;
          myObject.ht = "heart";
          myObject.img = post.img;
          myObject.country = post.country;
          myObject.city = post.city;
          this.likes.push(myObject)
         
        }
      })
      if(provera==false){
        var myObject = {} as PostData;
          myObject.post = post.id;
          myObject.desc = post.desc;
          myObject.ht = "heart-outline";
          myObject.img = post.img;
          myObject.country = post.country;
          myObject.city = post.city;
          this.likes.push(myObject)
      }
    });
    })
    this.temp = this.likes
    console.log(this.likes)
  });
  }
  toggleHeart(id:string){
    const usrid = this.userService.getUID()
    console.log(this.posts)
    console.log(id)

    this.likessub = this.uploaderService.getLikes().subscribe((likes)=>{
      this.likess = likes;
      console.log(this.likess)
   });
    this.likes.forEach(like => {
     if(like.post===id){
      //element.ht = this.heartType == "heart" ? "heart-outline":"heart"
      if(like.ht === "heart-outline"){
        like.ht = "heart"
        this.postsub = this.uploaderService.addLike(like.post,usrid).subscribe((like)=>{
          console.log("lajkovano")
        })
        this.likessub = this.uploaderService.getLikes().subscribe((likes)=>{
          this.likess = likes;
          console.log(this.likess)
       });
      }else{
        console.log(like.likeid)
        console.log(this.likess)
        console.log(this.likes)
        this.likess.forEach(entity => {
          console.log(entity.post,id,entity.user,this.userService.getUID())
          if(entity.post==id && entity.user==this.userService.getUID()){
            this.postsub = this.uploaderService.deleteLike(entity.id).subscribe((like)=>{
             // console.log('izbrisan')
            })
          }
        });
       
        like.ht = "heart-outline"
      }
     } 
    });
   
  }
  searchThis($event){
    console.log(this.filterTerm, $event, $event.key)
    if( $event.code=="ShiftLeft" || $event.code=="CapsLock" || $event.code=="Escape"){}
    else if($event.keyCode!=8 )
    this.search = this.search + $event.key
    
    else
    this.search = this.search.substr(0,this.search.length-1 )
    console.log("search string je:" + this.search)
    if(this.search=="" || this.search===undefined){
      this.likes = this.temp
    }else{
    this.likes = [];
    console.log(this.posts)
    this.posts.forEach(post => {
      if(post.city.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || post.country.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())){
      let provera = false;
      this.likess.forEach(like=>{
        console.log(post.id,like.post, like.user,this.userService.getUID())
        if(post.id==like.post && like.user==this.userService.getUID()){
          provera=true
          var myObject = {} as PostData;
          myObject.likeid = like.id;
          myObject.post = post.id;
          myObject.desc = post.desc
          myObject.user = like.user;
          myObject.ht = "heart";
          myObject.img = post.img;
          myObject.country = post.country;
          myObject.city = post.city;
          this.likes.push(myObject)
         
        }
      })
      if(provera==false){
        var myObject = {} as PostData;
          myObject.post = post.id;
          myObject.desc = post.desc;
          myObject.ht = "heart-outline";
          myObject.img = post.img;
          myObject.country = post.country;
          myObject.city = post.city;
          this.likes.push(myObject)
      }
    }
    });
  }
  }
}
