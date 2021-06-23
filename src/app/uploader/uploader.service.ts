import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import {Post} from './post.model'
import {map, switchMap, take, tap} from 'rxjs/operators';
interface ImageData{
    user: string,
    description: string,
    img: string,
    posts: Post[]
}

@Injectable({
    providedIn:"root"
})


export class UploaderService{
   private _posts = new BehaviorSubject<Post[]>([]);
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
    get posts(){
        return this._posts.asObservable();
        }



        getPhoto(id:string){
            return this.http.get<{id:ImageData}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
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
                  return images[0];
                }),
               )
              
          }

}

