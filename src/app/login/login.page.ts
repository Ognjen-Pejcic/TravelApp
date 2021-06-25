import { ThrowStmt } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = ""
  password: string = ""
  isLoading = false

  constructor(
    public afAuth: AngularFireAuth, 
    public user: UserService, 
    public router: Router, 
    private loadingController: LoadingController,
    public alertController: AlertController
    ) { }


  ngOnInit() {
  }

  async presentAlert(title: string, content: string){
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['Ok']
    })
    await alert.present()
  }

  async login() {
    const { username, password } = this
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(username + '@gmail.com', password)
      this.isLoading = true;
      if(res.user) {
          this.user.setUser({
            username,
            uid: res.user.uid
          })
          this.loadingController
          .create({message:"Loading..."})
          .then((loadingEl)=>{
            loadingEl.present();
                     
          this.isLoading = false;
          this.presentAlert('Success!', 'You are logged in!')
          this.router.navigate(['/tabs/feed'])
          loadingEl.dismiss()
          })
      }
    } catch (err) {
      console.dir(err)
      if (err.code === "auth/user-not-found") {
        console.log("user not found")
      }
    }
    this.username = ""
    this.password = ""
   
  }




  

 
}
