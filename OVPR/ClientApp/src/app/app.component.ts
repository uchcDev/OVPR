import { Component, OnInit, HostListener } from '@angular/core';
import { ErrorService } from './OVPR/DropDown/error.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './OVPR/DropDown/user.service';

import {Result} from './OVPR/DropDown/DataDeclares';

import {Helpers} from './OVPR/Helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  public static errorService: ErrorService;
  public static httpClient: HttpClient;
  public static countdown_display: string;

  this_errorService: ErrorService;

  countdown_seconds: number;
  //countdown_display: string;

  timeOut_minutes: number;

  dateTimeLoaded :string;

  constructor(private errorService: ErrorService, private user: UserService, private httpClient: HttpClient) {
    AppComponent.errorService = errorService;
    AppComponent.httpClient = httpClient;

    this.this_errorService= errorService;
  }
  public GetCountdownDisplay() :string
  {

    return  Helpers.GetCountdownDisplay();
  }

  ngOnInit() {
    
  var currentdate = new Date(); 
  var datetime = "Last Sync: " + currentdate.getDate() + "/"
  + (currentdate.getMonth()+1)  + "/" 
  + currentdate.getFullYear() + " @ "  
  + currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds();


    this.dateTimeLoaded = datetime;

    let me = this;
    this.user.GetTimout().subscribe(p => me.GetTimeOutReturn(p));
  }

  GetTimeOutReturn(r: Result<number>)
  {
      if(r.IsConnectionError)
        this.redirectToLogin("connectionError");

      this.startCountdown(r.ReturnData);
  }

  startCountdown(timeOut_minutes: number) {
    this.timeOut_minutes = timeOut_minutes;

    this.resetLogOutTimer();
    let me = this;

    setInterval(function () { me.onEveryCountdownSecond(); }, 1000);

    //keep cookie alive every minute
    setInterval(function () { me.keepAlive(); }, 1000 * 60);
  }

  keepAlive() {
    //console.log("keep alive");
    this.user.KeepAlive().subscribe();
  }

  @HostListener('window:mousemove', [ ])
  @HostListener('window:keyup', [ ])
  resetLogOutTimer(): void {
    this.setCountdown(this.timeOut_minutes * 60);
  }
  onEveryCountdownSecond(): void {

    if (this.countdown_seconds <= 0) {
      this.redirectToLogin("timeOut");
    }

    this.setCountdown(this.countdown_seconds - 1);
  }
  redirectToLogin(message : string): void {
    let loginPage = window.location.origin + '/Account/Login?ReturnUrl=%2F&message=' + message;
    window.location.replace(loginPage);
  }


  setCountdown(seconds: number) {
    this.countdown_seconds = seconds;

    let minutes = Math.floor(this.countdown_seconds / 60);
    let hours = Math.floor(minutes / 60);
    let _seconds = this.countdown_seconds - (minutes * 60);

    if (hours > 0)
       AppComponent.countdown_display = hours + ":";

    AppComponent.countdown_display = this.pad(minutes) + ":" + this.pad(_seconds);
  }

  pad(timePart: number): string {
    if (timePart < 10)
      return "0" + timePart;
    else
      return timePart.toString();
  }

  clearMesssages() {
    this.errorService.ClearMessages();
  }

}