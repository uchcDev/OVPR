import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
UserEnt,
RolesEnt,
Result
} from './DataDeclares';

import {Helpers} from '../Helpers';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  GetAllUsers(isActive : boolean) : Observable<Result<UserEnt[]>>
  {
      let fullUrl = 'OVPR_API/User/GetAllUsers';    
      return Helpers.HttpClientGet<UserEnt[]>(fullUrl,isActive);
  }
  GetRoles() : Observable<Result<RolesEnt[]>>
  {
      let fullUrl = 'OVPR_API/User/GetRoles';
      return Helpers.HttpClientGet<RolesEnt[]>(fullUrl);
  }

  AddUser(user :UserEnt) : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/User/AddUser';     
    
      return Helpers.HttpClientPost(fullUrl, user);
  }
  UpdateUser(user :UserEnt) : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/User/UpdateUser';        
    
      return Helpers.HttpClientPost<number>(fullUrl, user);
  }

  KeepAlive() : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/User/KeepAlive';        
    
      return Helpers.HttpClientGet<number>(fullUrl);
  }


  GetTimout() : Observable<Result<number>>
  {
      let fullUrl = 'OVPR_API/User/GetTimout';        
    
      return Helpers.HttpClientGet<number>(fullUrl);
  }

}
