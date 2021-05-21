import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL:string

  constructor(public http: HttpClient) { }

  ngOnInit() {
  }
  fileChanged(event){
    const files = event.target.files
    console.log(files)

    const data = new FormData()
    data.append('file', files[0])
    data.append('UPLOADCARE_STORE', '1')
		data.append('UPLOADCARE_PUB_KEY', 'b3c4ed5c426fe0e52794')

console.log(data)

    this.http.post('https://upload.uploadcare.com/base/', data).subscribe(event=>{
      console.log(event)
    //  this.imageURL = event.
    })
  }
}
