import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-email-body",
  templateUrl: "./email-body.component.html",
  styleUrls: ["./email-body.component.css"]
})
export class EmailBodyComponent implements OnInit {
  @Input() message: object;
  @Input() messageIndex: number;
  @Output() seeModal = new EventEmitter<any>();
  constructor() {}

  modalBoolean: boolean = false;
  ngOnInit() {}

  showModal() {
    console.log("show Modal from child component is working");
    console.log(this.messageIndex);
    this.modalBoolean = !this.modalBoolean;
  }
}
