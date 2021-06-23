import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";
import {Post} from './post.model'
interface ImageData{
    user: string,
    description: string,
    img: string
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
        return this.http.post<{name: string}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`, {
            user,
           posts: {description,
            img}
        });
    }

    getPhotos(){
        return this.http.get<{[key: string]:ImageData}>(`https://project-24716-default-rtdb.europe-west1.firebasedatabase.app/images.json`);
    }
    get posts(){
        return this._posts.asObservable();
        }
}

