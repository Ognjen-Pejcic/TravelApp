import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import {Post} from './post.model'
import {Likes} from './likes.model'
import {map, switchMap, take, tap} from 'rxjs/operators';
interface ImageData{
    user: string,
    description: string,
    img: string,
    posts: Post[]
}


interface LikeData{
  user: string,
  posts: Post[]
}


@Injectable({
    providedIn:"root"
})


export class UploaderService{
   private _posts = new BehaviorSubject<Post[]>([]);
   private _likes = new BehaviorSubject<Likes[]>([]);
    constructor( private http: HttpClient){ 
        
    }
    addPhoto(user: string, description: string, img: string){
        console.log(user, description,img)
        let generatedId;
        return this.http.post<{name: string}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`, {
            user,
        //    posts: {description,
        //     img}
            description, img
        }).pipe(
            switchMap((resData) => {
              generatedId = resData.name;
              return this.posts;
            }),
            take(1),
            tap((images) => {
              this._posts.next(images.concat({
                id : generatedId,
                user,
                desc:description,
                img
              }));
            }));
      
    }

    getPhotos(){
        return this.http.get<{[key: string]:ImageData}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
        .pipe(
            map((imagesdata) => {
              const images: Post[] = [];
              for (const key in imagesdata) {
                if (imagesdata.hasOwnProperty(key)) {
                  images.push({
                    id: key,
                    user:imagesdata[key].user,
                    desc:imagesdata[key].description,
                    img:imagesdata[key].img
                  });
                }
              }
              return images;
            }),
            tap(images => {
              this._posts.next(images);
            })
          );
      }


      getPhotosForUser(idd:string){
        return this.http.get<{[key: string]:ImageData}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
        .pipe(
            map((imagesdata) => {
              const images: Post[] = [];
              for (const key in imagesdata) {
                
                if (imagesdata.hasOwnProperty(key)) {
                  console.log(imagesdata[key].user)
                  console.log(idd)
                  if(imagesdata[key].user===idd){
                    images.push({
                      id: key,
                      user:imagesdata[key].user,
                      desc:imagesdata[key].description,
                      img:imagesdata[key].img
                    });
                  }
                  
                }
              }
              return images;
            }),
            tap(images => {
              this._posts.next(images);
            })
          );
      }


    get posts(){
        return this._posts.asObservable();
        }

        get likes(){
          return this._likes.asObservable();
        }

        getPhoto(id:string){
            return this.http.get<{id:ImageData}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
            .pipe(
                map((imagesdata) => {
                  const images: Post[] = [];
                  for (const key in imagesdata) {
                    if (imagesdata.hasOwnProperty(key)) {
                      if(key===id){
                        images.push({
                          id: key,
                          user:imagesdata[key].user,
                          desc:imagesdata[key].description,
                          img:imagesdata[key].img
                        });
                      }
                  
                    }
                  }
                  console.log(images)
                  return images[0];
                }),
               )
              
          }


          addLike(post: string, userID:string){
            console.log(post, userID)
            let generatedId;
            return this.http.post<{id: number}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/likes.json`, {
              post,
            //    posts: {description,
            //     img}
            generatedId:userID
            }).pipe(
                switchMap((resData) => {
                  generatedId = resData.id;
                  return this.likes;
                })
                //,
                // take(1),
                // tap((likes) => {
                //   this._likes.next(likes.concat({
                //     post,
                //     id:userID
                //   }));
                // }));
            )}
         

}

