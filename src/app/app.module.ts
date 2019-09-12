import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { MailComponent } from "./mail/mail.component";
import { OnboardComponent } from "./onboard/onboard.component";
import { MailService } from "./services/mail.service";

@NgModule({
  declarations: [AppComponent, MailComponent, OnboardComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [MailService],
  bootstrap: [AppComponent]
})
export class AppModule {}
