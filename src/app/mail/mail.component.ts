import { Component, OnInit, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-mail",
  templateUrl: "./mail.component.html",
  styleUrls: ["./mail.component.css"]
})
export class MailComponent implements OnInit {
  mailIdList: any[] = [];
  mailMessageList: any[] = [];
  emailData: any = [];
  accessToken: string;
  emailIdList: any = [];
  messageData: any = [];
  constructor(private http: HttpClient) {}

  getMailFromId(): void {
    this.mailIdList.forEach(id => {
      this.http
        .get(`http://www.googleapis.com/gmail/v1/users/me/messages/${id}`)
        .subscribe(response => {
          console.log(response);
        });
    });
  }

  splitIdsOff() {
    for (let i = 0; i < this.emailData.length; i++) {
      this.emailIdList.push(this.emailData[i].id);
    }
  }

  showEmailData() {
    console.log(this.emailData);
  }

  showMessageData() {
    console.log(this.messageData);
  }

  getEmailContent() {
    let messageData = [];
    console.log("getEmailContent button is working");
    for (let i = 0; i < this.emailIdList.length; i++) {
      this.http
        .get(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${this.emailIdList[i]}`,
          {
            headers: { Authorization: "Bearer " + this.accessToken }
          }
        )
        .subscribe(response => {
          messageData.push(response);
          return (this.messageData = messageData);
        });
    }

    // this.emailData.forEach(id => {
    //   // console.dir(id)
    //   this.http
    //     .get(`http://www.googleapis.com/gmail/v1/users/me/messages/${id.id}`, {
    //       headers: { Authorization: "Bearer " + this.accessToken }
    //     })

    //     .subscribe(response => {
    //       console.log(response);
    //     });
    // });
  }

  async ngOnInit() {
    // Jank, wait for page to boot
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(document.getElementById("app-root"));
    const access_token = document
      .getElementById("app-root")
      .getAttribute("data-access_token");
    console.log("got access_token", access_token);
    this.accessToken = access_token;
    const res = await this.http
      .get("https://www.googleapis.com/gmail/v1/users/me/messages", {
        headers: { Authorization: "Bearer " + this.accessToken }
      })

      .subscribe(response => {
        console.log(response);
        let emailData = response.messages;
        // console.log(this.emailData);
        // // console.log(emailData.messages[0].id);
        return (this.emailData = emailData);
        // for (let i = 0; i < response.messages.length; i++) {
        //   this.mailIdList.push(response.messages[i].id);
        // }

        // console.log("res", res);
        // this.getMailFromId();
        // this.splitIdsOff;
        // // this.getEmailContent();
      });
  }
}
