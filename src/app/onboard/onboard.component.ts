import { Component, OnInit } from "@angular/core";
import { MailService } from "../services/mail.service";

@Component({
  selector: "app-onboard",
  templateUrl: "./onboard.component.html",
  styleUrls: ["./onboard.component.css"]
})
export class OnboardComponent implements OnInit {
  showFirst: boolean = true;
  showSecond: boolean = false;
  showThird: boolean = false;
  constructor(private mailService: MailService) {}

  ngOnInit() {}

  togglePageOne() {
    this.showFirst = !this.showFirst;
    this.showSecond = !this.showSecond;
  }
  togglePageTwo() {
    this.showThird = !this.showThird;
    this.showSecond = !this.showSecond;
  }
  goToMain() {
    this.mailService.navigateToMain();
  }
}
