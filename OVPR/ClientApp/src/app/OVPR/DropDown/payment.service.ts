import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {  of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {Helpers} from '../Helpers';

import {ErrorService} from '../DropDown/error.service';

import { 
  PaymentEnt,
  PaymentChangeEnt,
  Result
} from './DataDeclares';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor()  
  { } 

  GetAllPayments(CommitPK :number, PayStatus: string ) : Observable<Result<PaymentEnt[]>>
  {
      let fullUrl = 'OVPR_API/Payment/GetAllPayments'; 
      return Helpers.HttpClientGet<PaymentEnt[]>(fullUrl,CommitPK,PayStatus);
  }  

  GetCurrentFiscalYear() : Observable<Result<string>>
  {
      let fullUrl = 'OVPR_API/Payment/GetCurrentFiscalYear';
      return Helpers.HttpClientGet<string>(fullUrl);
  }
  GetNextAvailablePaymentNumber(Commitment_PK :number ) : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/Payment/GetNextAvailablePaymentNumber'; 
      return  Helpers.HttpClientGet<number>(fullUrl,Commitment_PK);
  }

  AddPayment(ent : PaymentChangeEnt) : Observable<Result<number>>
  {
    let fullUrl = 'OVPR_API/Payment/AddPayment';
    return Helpers.HttpClientPost(fullUrl, ent);
    }

  EditPayment(ent : PaymentChangeEnt) : Observable<Result<number>>
  {
    let fullUrl = 'OVPR_API/Payment/EditPayment';                
    return Helpers.HttpClientPost(fullUrl, ent);
  }
  
  DeletePayment(Commitment_PK : number, Payment_PK : number, PayStatus:string) : Observable<Result<number>>
  {
    let fullUrl = 'OVPR_API/Payment/DeletePayment';       
    return Helpers.HttpClientGet(fullUrl, Commitment_PK , Payment_PK , PayStatus);
  }
}
