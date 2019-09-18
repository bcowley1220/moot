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

  async ngOnInit() {
    await this.mailService.getAccessToken();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  public loadScript() {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  togglePageOne() {
    this.showFirst = !this.showFirst;
    this.showSecond = !this.showSecond;
  }

  togglePageTwo() {
    this.loadScript();
    this.showSecond = !this.showSecond;
    this.showThird = !this.showThird;
  }

  goToMain() {
    this.mailService.navigateToMain();
  }
}
