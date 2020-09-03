import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  messages : string[] = [];

  constructor() 
  { 

     
  }
  public ClearMessages()
  {
    this.messages = [];
  }

  public LogError(message : string)
  {
      this.messages.push(message);
      //this.messages.length
  }


}
