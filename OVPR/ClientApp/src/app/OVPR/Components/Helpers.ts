
import { Observable } from 'rxjs';
//import { of, map } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {

  Result
} from './DropDown/DataDeclares';


import { ErrorService } from './DropDown/error.service';


import { AppComponent } from '../../app/app.component';
//import { stringify } from '@angular/core/src/util';

export class Nothing
{cccc

}
export class Helpers {

  public static GetCountdownDisplay() :string
  {
    return AppComponent.countdown_display;
  }

  //shows xx,xx (no decimal placed unledd exists)
  public static FormatToNumber(val : any):string
  {   
    if (val == null)
      return "";

    let cleanString = parseFloat(val.toString());
    return cleanString.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')   
  } 

  //shows xx,xx.00 (always shows decimal)
  public static FormatToNumberTwoDecimal(val : any):string
  {
    if (val == null)
      return "";

    let cleanString = parseFloat(val.toString()).toFixed(2);
    return cleanString.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


  public static IsValidInt(value: string): boolean {
    return Helpers.IsANumber(value) && Number.isInteger(Number.parseFloat(value));
  }
  public static IsValidMoney(value: string): boolean {
    let castAsString = value as string;
    castAsString = castAsString.replace("$","");
    castAsString = castAsString.replace(",","");

    let indexOf = castAsString.indexOf(".");
    if (indexOf >= 0)
      return (castAsString.length - (indexOf + 1)) <= 2 && Helpers.IsANumber(castAsString)
    else
      return Helpers.IsANumber(castAsString);
  }

  //parseFloat(4,000.00) = 4
  //use parseFloatSafe instead
  public static parseFloatSafe(value : any) :number
  {
    let castAsString = value as string;
    castAsString = castAsString.replace("$","");
    castAsString = castAsString.replace(",","");

    return parseFloat(castAsString);

  }
  public static IsANumber(val : any) : boolean
  {    
    let castAsNumber = val as number;
    return !isNaN(castAsNumber)
  }

  public static CleanString(value: string): string {
    if (value == null)
      return null;
    else
      return value.trim();
  }

  public static HasInput(value: any): Boolean {

    if (value == null)
      return false;
    else if (typeof value === 'string' || value instanceof String) {
      return value.trim() != "";
    }
    else
      return true;
  }

  public static IsValidDate(value: string): Boolean {
    return !Number.isNaN(Date.parse(value));
  }

  public static CopyAllPropertyAndValues<T>(target: any, source: any) {
    Object.assign(target, source);
  }
  public static GetCurrentDateTime() :string  {
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    return datetime;
  }
  
  public static HttpClientPost<T>(
    fullUrl: string,
    body : any  ) : Observable<Result<T>>
  {
    return    Helpers._HttpClient<T>(false, 
      fullUrl,
      body      
    );
  }

  public static HttpClientGet<T>(
    fullUrl: string,
    p1 : any = new Nothing(),
    p2 : any = new Nothing(),
    p3 : any = new Nothing(),
    p4 : any = new Nothing(),
    p5 : any = new Nothing(),
    p6 : any = new Nothing() ) : Observable<Result<T>>
  {
    return    Helpers._HttpClient<T>(true, 
      fullUrl,
      null,
      p1,
      p2,
      p3 ,
      p4,
      p5 ,
      p6
    );
  }

   private static _HttpClient<T>(get: boolean, 
    fullUrl: string,
    body:any,
    p1 : any = new Nothing(),
    p2 : any = new Nothing(),
    p3 : any = new Nothing(),
    p4 : any = new Nothing(),
    p5 : any = new Nothing(),
    p6 : any = new Nothing() ) : Observable<Result<T>>
  {
    let params :string = "";

    let paramsList : any[]= [];
    paramsList.push(p1);
    paramsList.push(p2);
    paramsList.push(p3);
    paramsList.push(p4);
    paramsList.push(p5);
    paramsList.push(p6);
    
    for(let p of paramsList){
       if(!(p instanceof Nothing))
          params += "/" + p;

    }
    
    fullUrl += params;

    //console.log(fullUrl);
    
    if(get)
      return AppComponent.httpClient.get<Result<T>>(fullUrl).pipe(Helpers.HandleAllErrors);   
    else{

      //console.log("fullUrl");
     // console.log(fullUrl);
      //console.log("body");
     // console.log(body);
      return AppComponent.httpClient.post<Result<T>>(fullUrl, body).pipe(Helpers.HandleAllErrors);   
    }
  }

  public static HandleAllErrors<T>(p: Observable<Result<T>>): Observable<Result<T>> {
    //return p.pipe(map(result => Helpers.HandleAppErrors(result))).pipe(catchError(Helpers.HandelWebErrors<T>("", null)));

    return p.pipe(map(result => Helpers.HandleAppErrors(result))).pipe(catchError(Helpers.HandelWebErrors<T>("")));


  }
  public static HandleAppErrors<T>(result: Result<T>): Result<T> {

    //AppComponent.errorService.LogError("a");
    if(result.IsError)
    {
      AppComponent.errorService.LogError("App error " + Helpers.GetCurrentDateTime());  
      AppComponent.errorService.LogError("___" + result.Message);
    }


    return result;//.ReturnData;
  }

  public static HandelWebErrors<T>(operation = 'operation') {
    return (error: any): Observable<Result<T>> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      
      AppComponent.errorService.LogError("Connection error " + Helpers.GetCurrentDateTime());      
      for(let property in error)
      {        
        AppComponent.errorService.LogError("HandelWebErrors___:" + property.toString() + ": " +  error[property]);
      }


      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      //return of(result as T);

    

      let r  = new Result<T>();
      r.IsConnectionError = true;

      //console.log(r);
      return of(r);


    };
  }

/*
  public static handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  */


  public static sortBy(array: any[], propertyName: string, propertyType: string, sortAsc: boolean): any[] {
    if (propertyType == "number") {

      return array.sort(function (a, b) {
        let dif: number = a[propertyName] - b[propertyName];
        return sortAsc ? dif : dif * -1;
      });

    }
    else if (propertyType == "date") {
      return array.sort(function (a, b) {
        let aDate = new Date(a[propertyName]);
        let bDate = new Date(b[propertyName]);
        let dif = aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
        return sortAsc ? dif : dif * -1;
      });
    }
    else {
      return array.sort(function (a, b) {
        let dif: number = ('' + a[propertyName]).localeCompare(b[propertyName]);
        return sortAsc ? dif : dif * -1;
      });
    }
  }


}
