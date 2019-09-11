import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
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

  showEmailData() {
    console.log(this.emailData);
  }

  showMessageData() {
    console.log(this.messageData);
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

  // !Set Up Return Methods For Variables
}
