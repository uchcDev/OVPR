import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {Helpers} from '../Helpers';

import {
  TypeEnt,
TypeLevel2Ent,
Result
} from './DataDeclares';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor() { }

  GetLevel1() : Observable<Result<TypeEnt[]>>
  {
      let fullUrl = 'OVPR_API/Type/GetLevel1';         
      return Helpers.HttpClientGet<TypeEnt[]>(fullUrl);
  }
  GetLevel2(Level1_PK : number) : Observable<Result<TypeEnt[]>>
  {
      let fullUrl = 'OVPR_API/Type/GetLevel2';    
      return Helpers.HttpClientGet<TypeEnt[]>(fullUrl,Level1_PK);
  }

  UpdateLevel2(ent : TypeLevel2Ent) : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/Type/UpdateLevel2';      
      return  Helpers.HttpClientPost<number>(fullUrl,ent);
  }

  AddLevel2(ent : TypeLevel2Ent) : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/Type/AddLevel2';
            return  Helpers.HttpClientPost<number>(fullUrl,ent);
   }

  
}
