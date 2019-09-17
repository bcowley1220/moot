import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MailService } from "../services/mail.service";

@Component({
  selector: "app-order-modal",
  templateUrl: "./order-modal.component.html",
  styleUrls: ["./order-modal.component.css"]
})
export class OrderModalComponent implements OnInit {
  @Input() ordersArray: [];
  @Input() index: number;
  @Input() orderForModal: any;
  @Output() modalPopUp: EventEmitter<any> = new EventEmitter<any>();

  constructor(private mailService: MailService) {}

  ngOnInit() {
    console.log(this.ordersArray);
    console.log(this.index);
    console.log(this.orderForModal);
  }

  showModal() {
    this.modalPopUp.emit(event);
  }
}
