import {Injectable} from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { UrlSegment } from '@angular/router'
import {first} from 'rxjs/operators'

interface user{
    username: string,
    uid: string,
    photoURL:string,
   // about:string
}

@Injectable()
export class UserService{
    private user: user

    constructor(private afAuth: AngularFireAuth){

    }

    setUser(user: user){
        this.user = user
    }

    async isAuthenticated(){
        if(this.user)
            return true

        const user = await this.afAuth.authState.pipe(first()).toPromise()
        
        if(user){
            this.setUser({
                username: user.email.split('@')[0],
                uid: user.uid,
                photoURL:user.photoURL,
            //    about:user.displayName
            })
            return true
        }
        return false
    }

    getUID(): string{
        // if(!this.user){
        //     if(this.afAuth.currentUser){
        //         const user  = this.afAuth.currentUser
        //         this.setUser({
        //             username: user.email.split('@')[0],
        //             uid: user.uid
        //         })
        //         return user.uid
        //     }else{
        //         throw new Error("User not logged in")
        //     }
        // }else{
        //     return this.user.uid
        // }
        return this.user.uid
    }

    getUsername(): string {
		return this.user.username
	}
    getImageURL(): string {
		return this.user.photoURL
	}
}