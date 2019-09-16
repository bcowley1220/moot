import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { MailComponent } from "./mail/mail.component";
import { OnboardComponent } from "./onboard/onboard.component";
import { MailService } from "./services/mail.service";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from './main/main.component';


const appRoutes: Routes = [
  { path: "", redirectTo: "/onboard", pathMatch: "full" },
  { path: "main", component: MainComponent },
  { path: "onboard", component: OnboardComponent }
];
@NgModule({
  declarations: [AppComponent, MailComponent, OnboardComponent, MainComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  providers: [MailService],
  bootstrap: [AppComponent]
})
export class AppModule {}
