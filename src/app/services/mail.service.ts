import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ThrowStmt } from "@angular/compiler";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { Router } from "@angular/router";
import { Base64 } from "base64-js";
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
    let bodyData = this.messageData[0].payload.parts[0].body.data;
    bodyData = bodyData.replace(/\-/g, "+");
    bodyData = bodyData.replace(/\_/g, "/");
    bodyData = bodyData.replace(/\s/g, "");
    console.log(bodyData);
    console.log(atob(bodyData));
  }

  // .replace(/\-/g, "+")
  // .replace(/\_/g, "/")
  // .replace(/\s/g, "")
}

// var swees = "QW1hem9uLmNvbSBPcmRlciBDb25maXJtYXRpb24NCnd3dy5hbWF6b24uY29tL3JlZj1URV9zaW1wX3RleF9oDQpfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18NCg0KSGVsbG8gQXNpYSwNCg0KICBUaGFuayB5b3UgZm9yIHNob3BwaW5nIHdpdGggdXMuIFlvdSBvcmRlcmVkICAgIlNXRUVTIENvbXBhdGlibGUgZm9yIGlQYWQuLi4iICBhbmQgMiBvdGhlciBpdGVtcy4NCg0KICAgIFdl4oCZbGwgc2VuZCBhIGNvbmZpcm1hdGlvbiB3aGVuIHlvdXIgaXRlbXMgc2hpcC4NCg0KDQpZb3VyIHB1cmNoYXNlIGhhcyBiZWVuIGRpdmlkZWQgaW50byAyIG9yZGVycy4NCg0KVmlldyBvciBtYW5hZ2UgeW91ciBvcmRlcnMgaW4gWW91ciBPcmRlcnM6DQpodHRwczovL3d3dy5hbWF6b24uY29tL2dwL2Nzcy95b3VyLW9yZGVycy1hY2Nlc3MvcmVmPVRFX3NpbXBfb25fc2hfZw0KDQpPcmRlciAxIG9mIDINCk9yZGVyICMxMTMtOTY2OTQ5Ny02MzkyMjAwDQoNCiAgICBBcnJpdmluZzoNCiAgICBTdW5kYXksIFNlcHRlbWJlciAyMw0KDQogICAgU2hpcCB0bzoNCiAgICBBc2lhDQogICAgMzc1NCBCQUxEV0lOIFNULi4uDQoJDQogICAgDQogICAgVG90YWwgQmVmb3JlIFRheDogJDI0Ljk4ICAgICAgIAkJIA0KICAgIEVzdGltYXRlZCBUYXg6ICQwLjcyDQoNCiAgICBPcmRlciBUb3RhbDogJDI1LjcwDQoNCj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQ0KDQoNClZpZXcgb3IgbWFuYWdlIHlvdXIgb3JkZXJzIGluIFlvdXIgT3JkZXJzOg0KaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9ncC9jc3MveW91ci1vcmRlcnMtYWNjZXNzL3JlZj1URV9zaW1wX29uX3NoX2cNCg0KT3JkZXIgMiBvZiAyDQpPcmRlciAjMTEzLTI2NjU1MzUtNzY5MDY0NQ0KDQogICAgQXJyaXZpbmc6DQogICAgVGh1cnNkYXksIFNlcHRlbWJlciAyNw0KDQogICAgU2hpcCB0bzoNCiAgICBBc2lhDQogICAgMzc1NCBCQUxEV0lOIFNULi4uDQoJDQogICAgDQogICAgVG90YWwgQmVmb3JlIFRheDogJDUuOTkgICAgICAgCQkgDQogICAgRXN0aW1hdGVkIFRheDogJDAuMDANCg0KICAgIE9yZGVyIFRvdGFsOiAkNS45OQ0KDQo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0NCg0KV2UgaG9wZSB0byBzZWUgeW91IGFnYWluIHNvb24uDQoNCkFtYXpvbi5jb20NCnd3dy5hbWF6b24uY29tL3JlZj1URV9zaW1wX3RleF90eQ0KX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fDQoNClRoZSBwYXltZW50IGZvciB5b3VyIGludm9pY2UgaXMgcHJvY2Vzc2VkIGJ5IEFtYXpvbiBQYXltZW50cywgSW5jLiBQLk8uIEJveCA4MTIyNiBTZWF0dGxlLCBXYXNoaW5ndG9uIDk4MTA4LTEyMjYuIElmIHlvdSBuZWVkIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSBjb250YWN0ICg4NjYpIDIxNi0xMDc1Lg0KIA0KVW5sZXNzIG90aGVyd2lzZSBub3RlZCwgaXRlbXMgc29sZCBieSBBbWF6b24uY29tIGFyZSBzdWJqZWN0IHRvIHNhbGVzIHRheCBpbiBzZWxlY3Qgc3RhdGVzIGluIGFjY29yZGFuY2Ugd2l0aCB0aGUgYXBwbGljYWJsZSBsYXdzIG9mIHRoYXQgc3RhdGUuIElmIHlvdXIgb3JkZXIgY29udGFpbnMgb25lIG9yIG1vcmUgaXRlbXMgZnJvbSBhIHNlbGxlciBvdGhlciB0aGFuIEFtYXpvbi5jb20sIGl0IG1heSBiZSBzdWJqZWN0IHRvIHN0YXRlIGFuZCBsb2NhbCBzYWxlcyB0YXgsIGRlcGVuZGluZyB1cG9uIHRoZSBzZWxsZXIncyBidXNpbmVzcyBwb2xpY2llcyBhbmQgdGhlIGxvY2F0aW9uIG9mIHRoZWlyIG9wZXJhdGlvbnMuIExlYXJuIG1vcmUgYWJvdXQgdGF4IGFuZCBzZWxsZXIgaW5mb3JtYXRpb24gYXQ6DQpodHRwczovL3d3dy5hbWF6b24uY29tL2dwL2hlbHAvY3VzdG9tZXIvZGlzcGxheS5odG1sL3JlZj1ocF9iY19uYXY_aWU9VVRGOCZub2RlSWQ9MjAyMDI5NzAwDQoNClRoaXMgZW1haWwgd2FzIHNlbnQgZnJvbSBhIG5vdGlmaWNhdGlvbi1vbmx5IGFkZHJlc3MgdGhhdCBjYW5ub3QgYWNjZXB0IGluY29taW5nIGVtYWlsLiBQbGVhc2UgZG8gbm90IHJlcGx5IHRvIHRoaXMgbWVzc2FnZS4=";
// var swees = swees.replace(/\-/g, "+");
// var swees = swees.replace(/\_/g, "/");
// var swees = swees.replace(/\s/g, "");
// atob(swees);
