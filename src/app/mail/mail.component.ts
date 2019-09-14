import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MailService } from '../services/mail.service';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  mailIdList: any[] = [];
  mailMessageList: any[] = [];
  emailIdData: any = [];
  accessToken: string;
  emailIdList: any = [];
  messageData: any = [];
  filteredList: any = [];
  googleUser;
  constructor(private http: HttpClient, private mailService: MailService) {}

  // On Init: Runs an async function that makes the initial API call for the ID list.
  async ngOnInit() {
    // Jank, wait for page to boot
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.mailService.getEmailIdCall().subscribe(response => {
      console.log(response);
      const emailIdData = response.messages; // List of 100 message ID's, threadID's and a next page token
      return (this.emailIdData = emailIdData); // Sets local variable emailIdData equal to the list of Id's
    });
    // todo: temporarily automatically displays the emails; Must make sure to display the objects we build for the emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.splitIdsOff();
    this.getEmailContent();
  }

  splitIdsOff() {
    // √ This function takes the emailIdData list and breaks it down into an array of just the ID's in our service
    this.mailService.splitIdsOff(this.emailIdData); // Sends the emailIdData List in as a parameter
    this.emailIdList = this.mailService.emailIdList;
    // console.log(this.emailIdList);
  }

  getEmailContent() {
    // √ This function takes the split Id list and makes a GET request for each ID in the list and adds the response
    // to a new array. The response is a JSON object for each email retrieved.
    const messageData = [];
    for (let i = 0; i < this.emailIdList.length; i++) {
      this.mailService
        .getEmailContent(this.emailIdList[i]) // Sends one ID from the emailIdList to the GET request in the service.
        .subscribe(response => {
          messageData.push(response); // Full unedited emails
          return (this.messageData = messageData); // Sets array from service equal to the array in the component.
        });
    }
  }

  // showMessageData() {
  //   this.mailService.messageData = this.messageData;
  //   this.mailService.showMessageData();
  // }

  decodeData() {
    this.mailService.decodeData();
  }
  sortingEmails() {
    this.mailService.filteredList = this.filteredList;
    this.mailService.sortingEmails();
  }
}
