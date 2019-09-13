import { Component, OnInit, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MailService } from "../services/mail.service";
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
  filteredList: any = [];
  constructor(private http: HttpClient, private mailService: MailService) {}

  // getMailFromId() {
  //   this.mailService.getMailFromId().subscribe(response => {
  //     console.log(response);
  //   });
  // }

  getEmailContent() {
    let messageData = [];
    console.log("getEmailContent button is working");
    for (let i = 0; i < this.emailIdList.length; i++) {
      this.mailService
        .getEmailContent(this.emailIdList[i])
        .subscribe(response => {
          messageData.push(response);
          return (this.messageData = messageData);
        });
    }
  }

  async ngOnInit() {
    // Jank, wait for page to boot
    await new Promise(resolve => setTimeout(resolve, 2000));
    // console.log(document.getElementById("app-root"));
    // const access_token = document
    //   .getElementById("app-root")
    //   .getAttribute("data-access_token");
    // console.log("got access_token", access_token);
    // this.accessToken = access_token;
    const res = await this.mailService.getEmailIdCall().subscribe(response => {
      console.log(response);
      let emailData = response.messages;
      return (this.emailData = emailData);
    });
  }

  splitIdsOff() {
    // console.log(this.emailData);
    this.mailService.splitIdsOff(this.emailData);
    this.emailIdList = this.mailService.emailIdList;
    console.log(this.emailIdList);
  }

  showEmailData() {
    this.mailService.showEmailData();
    this.sortingEmails();
  }

  showMessageData() {
    this.mailService.messageData = this.messageData;
    this.mailService.showMessageData();
  }

  decodeData() {
    this.mailService.decodeData();
  }
  sortingEmails() {
    this.mailService.filteredList = this.filteredList;
    this.mailService.sortingEmails();
  }
}

// console.log(this.messageData[i].payload.headers[16]
//   sortingEmails() {
//     for (let i = 0; i < this.messageData.length; i++) {
//       this.messageData[i].payload.JSON.Stringify.headers[21].value.includes("Linkedin");
//       if (true) {
//         console.log(this.messageData[i].payload.headers[21].value);
//       }
//     }
