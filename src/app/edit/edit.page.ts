import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  busy = false;
  currusername:String
  password:string
  confpassword:string
  @ViewChild('fileButton') fileButton
  imageURL:string;
  url:string
  username:string
  isLoading = false
  constructor(public user: UserService, public http: HttpClient,private router:Router, public afstore: AngularFirestore
    ,    public afAuth: AngularFireAuth, public alertController: AlertController,
    private loadingController: LoadingController,public alert: AlertController ) { }

    ionViewWillEnter(){
      this.currusername = this.user.getUsername();
      console.log(this.currusername)
    }
  ngOnInit() {
    this.currusername = this.user.getUsername();
    this.url = this.user.getImageURL();
      if(this.url==null)
      this.url = "../../assets/avatar.png"
  }
  uploadFile(){
    console.log("radi")
    this.fileButton.nativeElement.click()
  }
  fileChanged(event){
    this.busy = true
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
      this.url = "https://ucarecdn.com/" + this.imageURL + "/" 
      this.busy = false
    })
  }
  async edit(){
   
    try {
      const password = this.password
      const confpassword = this.confpassword
      const  username = this.username
      this.currusername = username
     
      if(password!=confpassword){
        this.showAlert("Error!", "Passwords don't match")
        return
      }
      if(password.length>0 &&password.length<6){
        this.showAlert("Error!", "Passwords must have at least 6 characters")
        return
      }
      const nesto = await this.afAuth.currentUser
       nesto.updateProfile({
        photoURL: this.url
      }).then(() =>{

      })
      //nesto.photoURL = this.url
      console.log(username)
      if(username==null ||username==undefined){}
      else{
        nesto.updatePassword(password)
         const res = nesto.updateEmail(username + '@gmail.com')
        // nesto.email = username + '@gmail.com'
        // const res = nesto.updateProfile(nesto)
        this.isLoading = true;
        console.log(res)
        this.showAlert("Success!", "Profile updated")
        // this.router.navigate(['/tabs'])
  
  
        this.afstore.doc(`users/${nesto.uid}`).set({
          username
        })
  
        this.user.setUser({
          username,
          uid: nesto.uid,
          photoURL:nesto.photoURL
        })

       
        
      }
      // const res = nesto.updateEmail(username + '@gmail.com')
      // // nesto.email = username + '@gmail.com'
      // // const res = nesto.updateProfile(nesto)
      // this.isLoading = true;
      // console.log(res)
      // this.showAlert("Success!", "Profile updated")
      // this.router.navigate(['/tabs'])


      // this.afstore.doc(`users/${nesto.uid}`).set({
      //   username
      // })

      // this.user.setUser({
      //   username,
      //   uid: nesto.uid,
      //   photoURL:nesto.photoURL
      // })
     


      this.router.navigate(['/tabs'])
      this.loadingController
          .create({message:"Loading..."})
          .then((loadingEl)=>{
            loadingEl.present();
                     
          this.isLoading = false;
          //this.presentAlert('Success!', 'You are registred!')
          this.router.navigate(['/tabs/profile'])
          loadingEl.dismiss()
          })

      // this.presentAlert('Success!', 'You are registred!')
      // this.router.navigate(['/tabs'])
      
    } catch (error) {
      console.dir(error)
      this.showAlert("Error!", "Error")
    }
  }
  async showAlert(header: string, message: string){
    const alert = this.alert.create({
      header: message, buttons: ["OK"]
    })
  await (await alert).present()
  }
  async presentAlert(title: string, content: string){
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['Ok']
    })
    await alert.present()
  }
  
}
