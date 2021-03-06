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
  emailIdData: any = [];
  targetIdData: any = [];
  amazonIdData: any = [];
  ebayIdData: any = [];
  accessToken: string;
  emailIdList: any = [];
  messageData: any = [];
  filteredList: any = [];
  decodedBodyData: any = [];
  decodedHTMLData: any = [];
  modalBoolean: boolean = false;
  orders: any[];
  arrayLocation: any;
  i: number;

  constructor(private http: HttpClient, private mailService: MailService) {}

  // On Init: Runs an async function that makes the initial API call for the ID list.
  async ngOnInit() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.mailService.getAmazonEmailIdCall().subscribe(
      response => {
        const amazonIdData = response.messages; // Sets Amazon response equal to emailID array
        console.log(amazonIdData);
        return (this.amazonIdData = amazonIdData);
      },
      error => {
        return (this.amazonIdData = []);
      }
    ); // List of 100 message ID's, threadID's and a next page token
    // await this.mailService.getTargetEmailIdCall().subscribe(
    //   response => {
    //     const targetIdData = response.messages;
    //     console.log(targetIdData);
    //     return (this.targetIdData = targetIdData);
    //   },
    //   error => {
    //     return (this.targetIdData = []);
    //   }
    // );
    // await this.mailService.getEbayEmailIdCall().subscribe(
    //   response => {
    //     const ebayIdData = response.messages;
    //     console.log("Ebay Data:", ebayIdData);
    //     return (this.ebayIdData = ebayIdData);
    //   },
    //   error => {
    //     return (this.ebayIdData = []);
    //   }
    // );
    // Sets local variable emailIdData equal to the list of Id's
    // todo: temporarily automatically displays the emails; Must make sure to display the objects we build for the emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Takes the array from the GET requests and merges them into one array
    this.emailIdData = this.amazonIdData.concat(
      this.targetIdData,
      this.ebayIdData
    );
    console.log(this.emailIdData);

    this.splitIdsOff();
    this.getEmailContent();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.decodeData();
    // this.decodeHTMLBody();
    this.getOrdersArray();
  }

  // concatArrays() {
  //   this.mailService.concatArrays()
  // }

  splitIdsOff() {
    // √ This function takes the emailIdData list and breaks it down into an array of just the ID's in our service
    this.mailService.splitIdsOff(this.emailIdData); // Sends the emailIdData List in as a parameter
    this.emailIdList = this.mailService.emailIdList;
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
          console.log(this.messageData);
        });
    }
    return (this.mailService.messageData = messageData);
  }

  // showMessageData() {
  //   this.mailService.messageData = this.messageData;
  //   this.mailService.showMessageData();
  // }

  decodeData() {
    this.mailService.decodedBodyData = this.decodedBodyData;
    this.mailService.decodeData();
  }

  getOrdersArray() {
    this.orders = this.mailService.orders;
  }

  sortingEmails() {
    this.mailService.filteredList = this.filteredList;
    this.mailService.sortingEmails();
  }

  getImage(retailer) {
    switch (retailer) {
      case "Amazon":
        return "url(../assets/amazonLogo.png)";
      case "Target":
        return "url(../assets/target-logo.svg)";
      case "Ebay":
        return "url(../assets/ebay-logo.svg)";
    }
  }

  showModal(i) {
    // console.log(i);
    this.modalBoolean = !this.modalBoolean;
    let arrayLocation = this.orders[i];
    console.log(this.orders[i]);
    return (this.arrayLocation = arrayLocation);
  }
  hideModal() {
    this.modalBoolean = !this.modalBoolean;
  }
}
