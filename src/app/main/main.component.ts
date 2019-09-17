import { Component, OnInit } from "@angular/core";
import { MailService } from "../services/mail.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  constructor(private mailService: MailService) {}

  ngOnInit() {}
}
