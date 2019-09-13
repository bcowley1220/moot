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

  getEmailIdCall(): Observable<any> {
    // Called from mail component: getEmailIdCall() gets the access token and stores it in the service then uses that
    // access token to make an API call
    // with the query params and the Bearer headers.  This returns a list of email ID's.
    const accessToken = document
      .getElementById("app-root")
      .getAttribute("data-access_token");
    console.log("got access_token", accessToken);
    this.accessToken = accessToken;
    // This GET specifically targets the emails that contain the specific words we've chosen to identify orders from specific companies
    return this.http.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q={ "Amazon Order Confirmation" }',
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  splitIdsOff(emailData) {
    // Called from mail component. Takes the ID keys of the objects in emailData array and returns an array with just the ID keys
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

  // todo: NOT SURE IF ACTUALLY NEEDED ANYMORE NOW THAT WE ARE QUERYING OUR GET LIST
  sortingEmails() {
    // console.log("sortingbutton works");
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

  // showEmailData() {
  //   console.log(this.emailData);
  // }
  //
  // showMessageData() {
  //   console.dir(this.messageData);
  // }


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
