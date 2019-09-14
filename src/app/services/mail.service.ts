import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ThrowStmt } from "@angular/compiler";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { Router } from "@angular/router";
import { Base64 } from "base64-js";
import { on } from "cluster";
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
  decodedBodyData: any = [];
  constructor(private http: HttpClient, private router: Router) {}

  navigateToMain() {
    this.router.navigate(["main"]);
  }
  getEmailIdCall(): Observable<any> {
    const access_token = document
      .getElementById("app-root")
      .getAttribute("data-access_token");
    console.log("got access_token", access_token);
    this.accessToken = access_token;
    return this.http.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q={ "Amazon Order Confirmation" }',
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
    // console.log("sorting button works");
    for (let i = 0; i < this.messageData.length; i++) {
      let holder = this.messageData[i].payload.headers;
      // console.log(holder);
      // holder = Object.values(holder.payload.headers[i]);
      // console.log(holder);
      for (let i = 0; i < holder.length; i++) {
        // console.log(holder[i].name);
        if (holder[i].name == "Subject") {
          // console.log(holder[i].value);
          if (holder[i].value.includes("Amazon Order Confirmation")) {
            this.filteredList.push(this.messageData[i]);
            // console.log(this.messageData[i]);
          }
        }
      }
    }
    console.log(this.filteredList);
  }

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

  decodeData() {
    for (let i = 0; i < this.messageData.length; i++) {
      if (this.messageData[i].payload.parts[0].body.size != 0) {
        this.decodedBodyData.push(
          atob(
            this.messageData[i].payload.parts[0].body.data.replace(/\_/g, "/")
          )
        );
      } else if (this.messageData[i].payload.parts[0].parts[0].body.data) {
        this.decodedBodyData.push(
          this.messageData[i].payload.parts[0].parts[0].body.data.replace(
            /\_/g,
            "/"
          )
        );
      }
      console.log(this.decodedBodyData);
    }
  }
}
