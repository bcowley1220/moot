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
    this.showSecond = !this.showSecond;
    this.showThird = !this.showThird;
  }
  goToMain() {
    this.mailService.navigateToMain();
  }
}
