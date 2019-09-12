import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ThrowStmt } from "@angular/compiler";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
@Injectable({
  providedIn: "root"
})
export class MailService {
  mailIdList: any[] = [];
  mailMessageList: any[] = [];
  emailData: any = [];
  accessToken: string;
  emailIdList: any = [];
  messageData: any = [];
  encodedBody: any;
  filteredList: any = [];
  constructor(private http: HttpClient) {}

  getEmailIdCall(): Observable<any> {
    const access_token = document
      .getElementById("app-root")
      .getAttribute("data-access_token");
    console.log("got access_token", access_token);
    this.accessToken = access_token;
    return this.http.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  getEmailContent(id) {
    return this.http.get(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}`,
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  sortingEmails() {
    console.log("sortingbutton works");
    for (let i = 0; i < this.messageData.length; i++) {
      let holder = this.messageData[i].payload.headers;
      // console.log(holder);
      // holder = Object.values(holder.payload.headers[i]);
      // console.log(holder);
      for (let i = 0; i < holder.length; i++) {
        // console.log(holder[i].name);
        if (holder[i].name == "Subject") {
          // console.log(holder[i].value);
          if (holder[i].value.includes("Your Amazon.com order")) {
            this.filteredList.push(this.messageData[i]);
            // console.log(this.messageData[i]);
          }
        }
      }
    }
    console.log(this.filteredList);
  }
  // let searchList = this.messageData;
  // searchList = searchList.payload.JSON.stringify(Headers);
  // console.log(holder.length);
  // console.log(holder[0][0].name.includes("Delivered-To"));

  // console.log(this.messageData[0].payload.headers.includes("Blizzard"));

  // for (let i = 0; i < searchList.length; i++) {
  //   if (searchList[i].payload.headers.includes("Linkedin")) {
  //     // headerList.push(this.messageData[i]);
  //     console.log(searchList[i]);
  //   }
  // }
  // console.log(headerList);

  showEmailData() {
    console.log(this.emailData);
  }

  showMessageData() {
    console.dir(this.messageData);
  }

  splitIdsOff(emailData) {
    for (let i = 0; i < emailData.length; i++) {
      this.emailIdList.push(emailData[i].id);
    }
    // console.log(this.emailIdList);
    return this.emailIdList;
  }
  // !Returning Variable Section
  // returnMailIdList(){
  //   return this.mailIdList;
  // }
  // returnMailMessage(){
  //   return this.mailIdList;
  // }

  decodeData() {
    // this.encodedBody = JSON.stringify(this.messageData[0].payload.body.data)
    //   .replace(/-/g, "+")
    //   .replace(/_/g, "/");
    // console.log(this.encodedBody);
    // this.encodedBody.replace(/-/g, "+").replace(/_/g, "/");
    // .replace(/\s/g, "");
    // console.log(decodeURIComponent(escape(window.atob(this.encodedBody))));
    // console.log(window.atob(this.encodedBody));
    // console.log(atob(this.encodedBody.replace(/-/g, "+").replace(/_/g, "/")));
  }
  // !Set Up Return Methods For Variables
}
