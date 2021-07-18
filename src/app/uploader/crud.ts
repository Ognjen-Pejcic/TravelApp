import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import { Post } from './post.model'
import { Likes } from './likes.model'
import { first, map, switchMap, take, tap } from 'rxjs/operators';

interface ImageData {
  user: string,
  description: string,
  img: string,
  posts: Post[]
  country: string,
  city: string
}


interface LikeData {
  post: string
  userID: string,
  ht: string,
  img: string,
  posts: Post[]
}


@Injectable({
  providedIn: "root"
})


export class UploaderService {
  public _posts = new BehaviorSubject<Post[]>([]);
  public _likes = new BehaviorSubject<Likes[]>([]);
  constructor(private http: HttpClient) {

  }
  addPhoto(user: string, description: string, img: string, country: string, city: string) {
    console.log(user, description, img, country, city)
    let generatedId;
    return this.http.post<{ name: string }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`, {
      user,
      //    posts: {description,
      //     img}
      description, img, country, city
    }).pipe(
      switchMap((resData) => {
        generatedId = resData.name;
        return this.posts;
      }),
      take(1),
      tap((images) => {
        this._posts.next(images.concat({
          id: generatedId,
          user,
          desc: description,
          img, country, city
        }));
      })
      );
     
  }

  getPhotos() {
    console.log(this._posts) //ako je uspesno getovanje vraca to sto si getovao, poruka o uspesnosti
    return this.http.get<{ [key: string]: ImageData }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
      .pipe(
        map((imagesdata) => {
          const images: Post[] = [];
          console.log(imagesdata)
          for (const key in imagesdata) {
            if (imagesdata.hasOwnProperty(key)) {
              images.push({
                id: key,
                user: imagesdata[key].user,
                desc: imagesdata[key].description,
                img: imagesdata[key].img,
                country: imagesdata[key].country,
                city: imagesdata[key].city
              });
            }
          }
          return images;
        })
        ,tap(images => {
          console.log(images);
          this._posts.next(images);
        })
      );
  }


  getLikes() {
    return this.http.get<{ [key: string]: LikeData }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/likes.json`)
      .pipe(
        map((likedata) => {
          const likes: Likes[] = [];
          for (const key in likedata) {
            if (likedata.hasOwnProperty(key)) {

              likes.push({
                id: key,
                post: likedata[key].post,
                user: likedata[key].userID,
                // ht: likedata[key].ht,
                // img: likedata[key].img
              });
            }
          }
          console.log(likes)
          return likes;
        })
        , tap(likes => {
          this._likes.next(likes);
        }),
      );
  }




  getPhotosForUser(idd: string) {
    return this.http.get<{ [key: string]: ImageData }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
      .pipe(
        map((imagesdata) => {
          const images: Post[] = [];
          for (const key in imagesdata) {

            if (imagesdata.hasOwnProperty(key)) {
              console.log(imagesdata[key].user)
              console.log(idd)
              if (imagesdata[key].user === idd) {
                images.push({
                  id: key,
                  user: imagesdata[key].user,
                  desc: imagesdata[key].description,
                  img: imagesdata[key].img,
                  country: imagesdata[key].country,
                  city: imagesdata[key].city

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


  get posts() {
    return this._posts.asObservable();
  }

  get likes() {
    return this._likes.asObservable();
  }

  getPhoto(id: string) {
    return this.http.get<{ id: ImageData }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`)
      .pipe(
        map((imagesdata) => {
          const images: Post[] = [];
          for (const key in imagesdata) {
            if (imagesdata.hasOwnProperty(key)) {
              if (key === id) {
                images.push({
                  id: key,
                  user: imagesdata[key].user,
                  desc: imagesdata[key].description,
                  img: imagesdata[key].img,
                  country: imagesdata[key].country,
                  city: imagesdata[key].city
                });
              }

            }
          }
          console.log(images)
          return images[0];
        }),
      )

  }


  addLike(post: string, userID: string) {
    console.log(post, userID)
    let generatedId;
    console.log("User id je", userID)
    return this.http.post<{ id: number }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/likes.json`, {
      post,
      userID

    }).pipe(
      switchMap((resData) => {
        generatedId = resData.id;
        return this.likes;
      })
      ,
      take(1),
      tap((likes) => {
        this._likes.next(likes.concat({
          post,
          id:userID,user : userID
        }));
      }));
    
  }

  deleteLike(like: string) {
    console.log(like)
    let generatedId;

    //this.http.delete(`https://my-angular8-prjt.firebaseio.com/posts/${id}.json`)
    return this.http.delete<{ id: number }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/likes/${like}.json`, {

    }).pipe(
      switchMap((resData) => {//switch map vraca posledju vrednost observabla
        // generatedId = resData.id;
        return this.likes;
      }),take(1), tap((posts)=>{
        this._likes.next(posts.filter((q)=>q.id!==like))
      })
      //,
      // take(1),
      // tap((likes) => {
      //   this._likes.next(likes.concat({
      //     post,
      //     id:userID
      //   }));
      // }));
    )
  }

  deletePost(id:String){
    console.log(id)
   

    //this.http.delete(`https://my-angular8-prjt.firebaseio.com/posts/${id}.json`)
    return this.http.delete<{ id: number }>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images/${id}.json`, {

    }).pipe(
      switchMap((resData) => {
        // generatedId = resData.id;
        return this.posts;
      }),take(1), tap((posts)=>{
        this._posts.next(posts.filter((q)=>q.id!==id))
      })
    )
  }
}

