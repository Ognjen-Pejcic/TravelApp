import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoading = false
  constructor(   private router: Router, 
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
    private loadingController: LoadingController,) {}

    async presentAlert(title: string, content: string){
      const alert = await this.alertController.create({
        header: title,
        message: content,
        buttons: ['Ok']
      })
      await alert.present()
    }
  logout(){
    return this.afAuth.signOut().then(()=>{
      this.isLoading = true
      this.loadingController
      .create({message:"Loading..."})
      .then((loadingEl)=>{
        loadingEl.present();
                 
      this.isLoading = false;
      this.router.navigate(['/login'])
      loadingEl.dismiss()
      })
   
      this.presentAlert('Success!', 'You are logged out!')
      
      this.router.navigate(['/login'])
     
     })
  }
  edit(){
    this.router.navigate(['/tabs/edit'])
  }
}
