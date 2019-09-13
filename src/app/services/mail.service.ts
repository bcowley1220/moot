import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class MailService {
  accessToken: string; // from getEmailCall()
  mailIdList: any[] = [];
  mailMessageList: any[] = [];
  emailData: any = [];
  emailIdList: any = [];
  messageData: any = [];
  decodedBody: any;
  filteredList: any = [];
  constructor(private http: HttpClient, private router: Router) {}

  navigateToMain() {
    this.router.navigate(["main"]);
  }

  // Called from mail component: getEmailIdCall() gets the access token and stores it in the service then uses that
  // access token to make an API call
  // with the query params and the Bearer headers.  This returns a list of email ID's.

  getEmailIdCall(): Observable<any> {
    const accessToken = document
      .getElementById("app-root")
      .getAttribute("data-access_token");
    console.log("got access_token", accessToken);
    this.accessToken = accessToken;
    return this.http.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q={from:Amazon Order Confirmation}",
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  splitIdsOff(emailData) {
    for (let i = 0; i < emailData.length; i++) {
      this.emailIdList.push(emailData[i].id);
    }
    return this.emailIdList;
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
          if (holder[i].value.includes("Order")) {
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


  decodeData() {
    const bodyData = this.messageData[0].payload.parts[0].body.data;
    console.log(atob(bodyData));
    this.decodedBody = bodyData;
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
