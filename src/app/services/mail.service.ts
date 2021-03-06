import { Injectable, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
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
  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone
  ) {}

  navigateToMain() {
    this.router.navigate(["main"]);
  }

  navigateToOnboard() {
    this.router.navigate([""]);
  }

  getAmazonEmailIdCall(): Observable<any> {
    // Called from mail component: getAmazonEmailIdCall() gets the access token and stores it in the service then uses that
    // access token to make an API call
    // with the query params and the Bearer headers.  This returns a list of email ID's.
    // This GET specifically targets the emails that contain the specific words we've chosen to identify orders from specific companies
    return this.http.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q={ "Amazon Order Confirmation"}',
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  getTargetEmailIdCall(): Observable<any> {
    // Called from mail component: getTargetEmailIdCall() gets the access token and stores it in the service then uses that
    // access token to make an API call
    // with the query params and the Bearer headers.  This returns a list of email ID's.
    // This GET specifically targets the emails that contain the specific words we've chosen to identify orders from specific companies
    return this.http.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages?q={ from:target subject:"here%27s your order #" }',
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  getEbayEmailIdCall(): Observable<any> {
    // Called from mail component: getTargetEmailIdCall() gets the access token and stores it in the service then uses that
    // access token to make an API call
    // with the query params and the Bearer headers.  This returns a list of email ID's.
    // This GET specifically targets the emails that contain the specific words we've chosen to identify orders from specific companies
    return this.http.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=from:ebay%20subject:order%20confirmed",
      {
        headers: { Authorization: "Bearer " + this.accessToken }
      }
    );
  }

  splitIdsOff(emailData) {
    // Called from mail component. Takes the ID keys of the objects in emailData array and returns an array with just the ID keys
    for (let i = 0; i < emailData.length; i++) {
      if (emailData[i].id) {
        this.emailIdList.push(emailData[i].id);
      }
      // console.log(this.emailIdList);
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
    for (let i = 0; i < this.messageData.length; i++) {
      const holder = this.messageData[i].payload.headers;
      for (let i = 0; i < holder.length; i++) {
        if (holder[i].name == "Subject") {
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
      this.accessToken = googleUser.getAuthResponse(true).access_token;
      console.log(this.accessToken);
      googleUser.disconnect(); // Disconnect user immediately after getting access token
      this.validateAccessCode();
    };
  }
  validateAccessCode() {
    if (this.accessToken) {
      this.zone.run(() => this.navigateToMain());
    } else {
      this.zone.run(() => this.navigateToOnboard());
    }
  }

  // .replace(/-/g, '+').replace(/_/g, '/')
  decodeData() {
    let amazonHTML = "";
    console.log(this.messageData);
    for (let i = 0; i < this.messageData.length; i++) {
      if (this.messageData[i].payload.body.size != 0) {
        this.decodedBodyData = atob(
          this.messageData[i].payload.body.data
            .replace(/\-/g, "+")
            .replace(/\_/g, "/")
        );
      } else if (this.messageData[i].payload.parts[0].body.size != 0) {
        console.log(this.messageData[i].payload.parts[0]);
        this.decodedBodyData = atob(
          this.messageData[i].payload.parts[0].body.data
            .replace(/\_/g, "/")
            .replace(/\-/g, "+")
        );
        if (this.messageData[i].payload.parts[0].mimetype === "text/html") {
          amazonHTML = atob(
            this.messageData[i].payload.parts[0].body.data
              .replace(/\_/g, "/")
              .replace(/\-/g, "+")
          );
        }
      } else if (this.messageData[i].payload.parts[0].parts[0].body.data) {
        this.decodedBodyData = atob(
          this.messageData[i].payload.parts[0].parts[0].body.data.replace(
            /\_/g,
            "/"
          )
        );
        if (this.messageData[i].payload.parts[0].parts[1].body.size != 0) {
          amazonHTML = atob(
            this.messageData[i].payload.parts[0].parts[1].body.data
              .replace(/\_/g, "/")
              .replace(/\-/g, "+")
          );
        }
      }
      // console.log(this.decodedBodyData);
      // If sender is Amazon
      let holder = this.messageData[i].payload.headers;
      let message = this.messageData[i];
      for (let i = 0; i < holder.length; i++) {
        if (holder[i].name === "From") {
          if (holder[i].value.includes("amazon.com")) {
            console.log("The sender is indeed Amazon!");
            this.isolateDataAmazon(this.decodedBodyData, message, amazonHTML);
          } else if (holder[i].value.includes("target.com")) {
            console.log("The sender is indeed Target!");
            this.isolateDataTarget(this.decodedBodyData, message);
          } else if (holder[i].value.includes("ebay.com")) {
            console.log("The sender is indeed Ebay!");
            // this.isolateDataEbay(this.decodedBodyData, message);
          } // Else if's for other retailers
        }
      }
    }
    this.sortOrders();
  }
  // this.isolateDataAmazon(this.decodedBodyData);

  isolateDataAmazon(decodedBodyData, messageData, amazonHTML) {
    // console.log(this.decodedBodyData);
    // Builds a new object with with information needed and pushes to order array
    // {Retailer, Order_num, est_delivery, orderTotal, emailBody, emailHTML, snippet}
    // Order # for Amazon are 3 digits followed by 7 followed by 7
    console.log(decodedBodyData);
    const retailer = "Amazon";
    const orderNumReg = /\d\d\d\D\d\d\d\d\d\d\d\D\d\d\d\d\d\d\d/.exec(
      decodedBodyData
    );
    const orderNum = orderNumReg[0];
    let orderTotal = "";
    if (/Order\sTotal\D\s\D\d+\D\d+/.test(decodedBodyData)) {
      const getOrderTotalReg = /Order\sTotal\D\s\D\d+\D\d+/.exec(
        decodedBodyData
      );
      const orderTotalReg = /\D\d+\D\d+/.exec(getOrderTotalReg[0]);
      orderTotal = orderTotalReg[0];
    }
    // const orderTotalReg = /\D\d+\D\d+/.exec(getOrderTotalReg[0]);
    // orderTotal = orderTotalReg[0];
    let estArrivalDate = "";
    if (/Arriving:/.test(decodedBodyData)) {
      const estArrivalDateReg = /(\w+,\s\w+\D\d+)|(Delivery\sdate\spending)/.exec(
        decodedBodyData
      ); //!keep track
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
      bodyText: decodedBodyData,
      internalDate: Number(messageData.internalDate),
      dateTime: new Date(Number(messageData.internalDate)),
      amazonHTML: amazonHTML
    };
    this.orders.push(order);
  }

  isolateDataTarget(decodedBodyData, messageData) {
    // Builds a new object with with information needed and pushes to order array
    // {Retailer, Order_num, est_delivery, orderTotal, emailBody, emailHTML, snippet}
    // Order # for Target are 13 long
    const retailer = "Target";
    const orderNumReg = /\d\d\d\d\d\d\d\d\d\d\d\d\d/.exec(messageData.snippet);
    const orderNum = orderNumReg[0];
    const getOrderTotalReg = /class="summary-text"\salign="right">\D\d+\D\d+</.exec(
      decodedBodyData
    );
    const orderTotalReg = /\D\d+\D\d+/.exec(getOrderTotalReg[0]);
    const orderTotal = orderTotalReg[0];
    let estArrivalDate = "";
    if (/Arriving\s\w+,\s\w+\s\d+/.test(decodedBodyData)) {
      const getEstArrivalDateReg = /Arriving\s\w+,\s\w+\s\d+/.exec(
        decodedBodyData
      );
      const estArrivalDateReg = /\w+,\s\w+\s\d+/.exec(getEstArrivalDateReg[0]);
      estArrivalDate = estArrivalDateReg[0];
    } else {
      const getEstArrivalDateReg = /class="product-deliv-date">\sarriving\sby\s\w+,\s\w+\s\d+/.exec(
        decodedBodyData
      );
      const estArrivalDateReg = /\w+,\s\w+\s\d+/.exec(getEstArrivalDateReg[0]);
      estArrivalDate = estArrivalDateReg[0];
    }
    const order = {
      retailer: retailer,
      orderNum: orderNum,
      orderTotal: orderTotal,
      estArrivalDate: estArrivalDate,
      bodyText: this.decodedBodyData,
      dateTime: new Date(Number(messageData.internalDate))
    };
    this.orders.push(order);
  }

  sortOrders() {
    this.orders
      .sort((a, b) => (a.internalDate > b.internalDate ? 1 : -1))
      .reverse();
    for (let i = 0; i < this.orders.length; i++) {
      console.log(this.orders[i].dateTime);
    }
  }

  isolateDataEbay(decodedBodyData, messageData) {
    console.log(decodedBodyData);
    const retailer = "Ebay";
    const getOrderNumReg = /(Item\sID\D?(&nbsp;)?\D?\w?\D?\D\s\d+)|(Item\sI\w\D\s\d+)/.exec(
      decodedBodyData
    );
    const orderNumReg = /\d+/.exec(getOrderNumReg[0]);
    const orderNum = orderNumReg[0];
    const getOrderTotalReg = /(\D?\w?\D?Total\D?\D?\w?\D?:\s\D\d+\D\d+)|(PAID\s\D\s\D\d+\D\d+)|(Paid\D\s\D\d+\D\d+)/.exec(
      decodedBodyData
    );
    const orderTotalReg = /\D\d+\D\d+/.exec(getOrderTotalReg[0]);
    const orderTotal = orderTotalReg[0];
    const getEstArrivalDateReg = /(ETA:\s\w+\D\s\w+\D?\s\d+)|(Estimated\sdelivery\D\s+\w+\D?\s\w+\D?\s\d)/.exec(
      decodedBodyData
    );
    const estArrivalDateReg = /\w+\D\s\w+\D?\s\d+/.exec(
      getEstArrivalDateReg[0]
    );
    const estArrivalDate = estArrivalDateReg[0];
    const order = {
      retailer: retailer,
      orderNum: orderNum,
      orderTotal: orderTotal,
      estArrivalDate: estArrivalDate,
      bodyText: decodedBodyData,
      dateTime: new Date(Number(messageData.internalDate))
    };
    this.orders.push(order);
  }
}
