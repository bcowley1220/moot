import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MailService } from "../services/mail.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-order-modal",
  templateUrl: "./order-modal.component.html",
  styleUrls: ["./order-modal.component.css"]
})
export class OrderModalComponent implements OnInit {
  @Input() ordersArray: [];
  @Input() index: number;
  @Input() orderForModal: any;
  // @Output() modalBoolean: EventEmitter<any> = new EventEmitter<any>();
  dynamicHTML: any;
  htmlData: any;
  orders: any[];
  constructor(
    private mailService: MailService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // console.log(this.ordersArray);
    // console.log(this.index);
    // console.log(this.orderForModal);
    this.dynamicHTML = `<div>${this.orderForModal.bodyText}</div>`;

    this.sanitizeHTMLContent();
    this.orders = this.mailService.orders;
    console.log(this.orderForModal.dateTime);
  }

  sanitizeHTMLContent() {
    this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.dynamicHTML);
  }
  // showModal() {
  //   console.log("x button is working");
  //   this.modalBoolean.emit(event);
  // }
}
