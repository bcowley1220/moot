import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { MailComponent } from "./mail/mail.component";
import { OnboardComponent } from "./onboard/onboard.component";
import { MailService } from "./services/mail.service";
import { RouterModule, Routes } from "@angular/router";

import { EmailBodyComponent } from "./email-body/email-body.component";

import { MainComponent } from "./main/main.component";
import { OrderModalComponent } from "./order-modal/order-modal.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "/onboard", pathMatch: "full" },
  { path: "main", component: MainComponent },
  { path: "onboard", component: OnboardComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    MailComponent,
    OnboardComponent,
    MainComponent,
    OrderModalComponent
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  providers: [MailService],
  bootstrap: [AppComponent]
})
export class AppModule {}
