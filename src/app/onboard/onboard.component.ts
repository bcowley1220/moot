import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {
  
  showBoard: boolean = false;
  showEmail: boolean = true;
  showFirst: boolean = false;
  showSecond: boolean = true;
  showThird: boolean = true;

  constructor() { }

  toggleBoard():void {
    this.showBoard = !this.showBoard;
    this.showEmail = !this.showEmail;
  }
  
  togglePageOne(){
    this.showFirst = !this.showFirst;
    this.showSecond = !this.showSecond;
  }
  togglePageTwo(){
    this.showThird = !this.showThird;
    this.showSecond = !this.showSecond;
  }

  ngOnInit() {
  }

}
