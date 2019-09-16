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
  filteredList: any = [];
  decodedBodyData: any;
  decodedHTMLData: any = [];
  modalBoolean: boolean = false;
  orders: any[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  navigateToMain() {
    this.router.navigate(["main"]);
  }

  getEmailIdCall(): Observable<any> {
    // Called from mail component: getEmailIdCall() gets the access token and stores it in the service then uses that
    // access token to make an API call
    // with the query params and the Bearer headers.  This returns a list of email ID's.
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
    console.log(this.emailIdList);
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
    for (let i = 0; i < this.messageData.length; i++) {
      const holder = this.messageData[i].payload.headers;
      for (let i = 0; i < holder.length; i++) {
        if (holder[i].name == "Subject") {
          // console.log(holder[i].value);
          if (holder[i].value.includes("Amazon Order Confirmation")) {
            this.filteredList.push(this.messageData[i]);
          }
        }
      }
    }
    console.log(this.filteredList);
  }

  async getAccessToken() {
    console.log("Async getAccess Token is working");
    (window as any).onSignIn = googleUser => {
      console.log("onSignIn function working");
      this.accessToken = googleUser.getAuthResponse(true).access_token;
      // const element = document.getElementById("app-root");
      // this.accessToken = access_token;
      console.log(this.accessToken);
      // element.setAttribute('data-access_token', access_token);
    };
  }

  decodeData() {
    // console.log(this.messageData);
    for (let i = 0; i < this.messageData.length; i++) {
      if (this.messageData[i].payload.parts[0].body.size !== 0) {
        this.decodedBodyData = atob(
          this.messageData[i].payload.parts[0].body.data.replace(/\_/g, "/")
        );
      } else if (this.messageData[i].payload.parts[0].parts[0].body.data) {
        this.decodedBodyData = atob(
          this.messageData[i].payload.parts[0].parts[0].body.data.replace(
            /\_/g,
            "/"
          )
        );
      }
      console.log(this.decodedBodyData);
      // this.isolateDataAmazon(this.decodedBodyData);
    }
  }

  // .replace(/-/g, '+').replace(/_/g, '/')
  decodeHTMLBody() {
    console.log(this.messageData);
    for (let i = 0; i < this.messageData.length; i++) {
      if (this.messageData[i].payload.parts[0].body.size !== 0) {
        this.decodedHTMLData.push(
          atob(
            this.messageData[i].payload.parts[1].body.data
              .replace(/\_/g, "/")
              .replace(/-/g, "+")
            // this.messageData[i].payload.parts[1].body.data
            //     .replace(/-/g, "+")
            //     .replace(/_/g, "/")
          )
        );
        // } else if (this.messageData[i].payload.parts[1].parts[0].body.size != 0) {
        //   this.decodedHTMLData.push(
        //     atob(
        //       this.messageData[i].payload.parts[0].parts[1].body.data
        //         .replace(/\_/g, "/")
        //         .replace(/-/g, "+")
        //       // )
        //       // this.messageData[i].payload.parts[0].parts[1].body.data
        //       //     .replace(/-/g, "+")
        //       //     .replace(/_/g, "/")
        //     )
        //   );
      } else {
        this.decodedHTMLData.push(
          atob(
            this.messageData[i].payload.parts[0].parts[1].body.data
              .replace(/\_/g, "/")
              .replace(/-/g, "+")
            // )
            // this.messageData[i].payload.parts[0].parts[1].body.data
            //     .replace(/-/g, "+")
            //     .replace(/_/g, "/")
          )
        );
      }

      // this.isolateDataAmazon(this.decodedBodyData);
    }
    console.log(this.decodedHTMLData);
    console.log(this.decodedBodyData);
    // If sender is Amazon
    let holder = this.messageData[i].payload.headers;
    for (let i = 0; i < holder.length; i++) {
      if (holder[i].name === "From") {
        if (holder[i].value.includes("amazon.com")) {
          console.log("The sender is indeed Amazon!");
          this.isolateDataAmazon(this.decodedBodyData);
        } // Else if's for other retailers
      }
    }
  }
  // this.isolateDataAmazon(this.decodedBodyData);

  isolateDataAmazon(decodedBodyData) {
    // Builds a new object with with information needed and pushes to order array
    // {Retailer, Order_num, est_delivery, orderTotal, emailBody, emailHTML, snippet}
    // Order # for Amazon are 3 digits followed by 7 followed by 7
    const retailer = "Amazon";
    const orderNumReg = /\d\d\d\D\d\d\d\d\d\d\d\D\d\d\d\d\d\d\d/.exec(
      this.decodedBodyData
    );
    const orderNum = orderNumReg[0];
    const orderTotalReg = /Order\sTotal\D\s\D\d+\D\d+/.exec(
      this.decodedBodyData
    );
    const orderTotal = orderTotalReg[0];
    let estArrivalDate = "";
    if (/Arriving:/.test(this.decodedBodyData)) {
      const estArrivalDateReg = /\w+,\s\w+\D\d+/.exec(this.decodedBodyData);
      estArrivalDate = estArrivalDateReg[0];
    } else if (/delivery date:/.test(this.decodedBodyData)) {
      const estArrivalDateReg = /\w+\D\s\w+\s\d+\D\s\d+/.exec(
        this.decodedBodyData
      );
      estArrivalDate = estArrivalDateReg[0];
    } else {
      estArrivalDate = "";
    }
    const order = {
      retailer: retailer,
      orderNum: orderNum,
      orderTotal: orderTotal,
      estArrivalDate: estArrivalDate,
      bodyText: this.decodedBodyData
    };
    this.orders.push(order);
  }

  // showModal() {
  //   // console.log(`You have clicked the index of ${{ index }} `);
  //   this.modalBoolean = !this.modalBoolean;
  // }
}
