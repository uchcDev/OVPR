import { Component, OnInit } from '@angular/core';
import { UserService } from '../../DropDown/user.service';

import { Helpers } from '../../Helpers';

import {
  UserEnt,
  RolesEnt,
  Result
} from '../../DropDown/DataDeclares';




@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: UserEnt[] = [];
  roles: RolesEnt[] = [];

  activeFilter: boolean = true;

  userToEdit: UserEnt = null;
  copyOfUserToEdit: UserEnt = null;

  propertyErrorMessages: Object = new Object();

  constructor(private userService: UserService) {
    for (let property in new UserEnt()) {
      this.propertyErrorMessages[property] = null;
    }
  }

  ngOnInit() {
    this.filter();
  }
  filter() {
    this.userService.GetAllUsers(this.activeFilter).subscribe(p => this.users = p.ReturnData);
  }
  edit(ent: UserEnt, fromGUI: boolean) {
    if(fromGUI)
    {
      this.leaveAddMode();
    }
    
    if (this.roles.length == 0)
      this.userService.GetRoles().subscribe(p => this.roles = p.ReturnData);

    this.copyOfUserToEdit = new UserEnt();
    Object.assign(this.copyOfUserToEdit, ent);

    this.userToEdit = ent;
  }
  cancel()
  {
    this.leaveAddMode();
    this.userToEdit = null;
  }
  save() {
    for (let p in this.propertyErrorMessages) {
      this.propertyErrorMessages[p] = null;
    }

    if (!Helpers.HasInput(this.copyOfUserToEdit.USER_FirstName)) {
      this.propertyErrorMessages["USER_FirstName"] = "Required";
    }
    if (!Helpers.HasInput(this.copyOfUserToEdit.USER_LastName)) {
      this.propertyErrorMessages["USER_LastName"] = "Required";
    }
    if (!Helpers.HasInput(this.copyOfUserToEdit.USER_EmailAddress)) {
      this.propertyErrorMessages["USER_LastName"] = "Required";
    }
    if (!Helpers.HasInput(this.copyOfUserToEdit.ROLE_PK_ID)) {
      this.propertyErrorMessages["ROLE_PK_ID"] = "Required";
    }

    let isError: Boolean = false;
    for (let p in this.propertyErrorMessages) {
      if (this.propertyErrorMessages[p] != null) {
        isError = true;
        break;
      }
    }

    if (isError) {
      //alert("error");
    }
    else{      
      let localCopy = this.copyOfUserToEdit;     
      
      //console.log(localCopy);
      if(localCopy.USER_PK_ID == -1)
      {
          this.userService.AddUser(localCopy).subscribe(p=> this.onAddComplete());
      }
      else
          this.userService.UpdateUser(localCopy).subscribe(p=> this.onUpdateComplete(this.copyOfUserToEdit))
    }

  }
  onAddComplete()
  {
    this.userToEdit = null;
    this.filter();
  }
  onUpdateComplete( savedUser :UserEnt)
  {
    Object.assign(this.userToEdit, savedUser);
    this.userToEdit = null;
  }
  addInit()
  {
    let newUser = new UserEnt();
    newUser.USER_PK_ID = -1;
    newUser.USER_IsActive = true;
    this.users.push(newUser);
    this.edit(newUser, false);
  }
  leaveAddMode()
  {
    this.users = this.users.filter(p=> p.USER_PK_ID != -1);

  }

}
