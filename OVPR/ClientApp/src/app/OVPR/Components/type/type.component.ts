import { Component, OnInit } from '@angular/core';

import { TypeService } from '../../DropDown/type.service';

import { Helpers } from '../../Helpers';

import {
  TypeEnt,
  TypeLevel2Ent
} from '../../DropDown/DataDeclares';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {

  level1Ents: TypeEnt[] = [];
  level2Ents: TypeEnt[] = [];

  typeDDLValue: string = "";


  typeToEdit: TypeEnt;
  copyOfTypeToEdit: TypeEnt;

  descriptionErrorMessage: string = null;

  constructor(private typeService: TypeService) { }

  ngOnInit() {
    this.typeService.GetLevel1().subscribe(p => this.level1Loaded(p.ReturnData));
  }
  level1Loaded(level1Ents: TypeEnt[] ) {

    let find = level1Ents.find(p=>p.COMMITTYPE_Description == "Other");
    if(find != null)
    {
      this.typeDDLValue = find.COMMITTYPE_PK_ID.toString();
    }

    this.level1Ents = level1Ents;
    this.level1Change();

  }

  level1Change() {
    this.refreshLevel2Ents();
  }
  refreshLevel2Ents() {
    this.typeToEdit = null;
    if (Helpers.IsValidInt(this.typeDDLValue)) {
      this.typeService.GetLevel2(Number.parseInt(this.typeDDLValue)).subscribe(p => this.level2Ents = Helpers.sortBy(p.ReturnData, "COMMITTYPE_Description", "string", true));
    }
  }

  edit(ent: TypeEnt, fromGUI: boolean) {
    if (fromGUI) {
      this.leaveAddMode();
    }

    this.copyOfTypeToEdit = new TypeEnt();
    Object.assign(this.copyOfTypeToEdit, ent);

    this.typeToEdit = ent;
  }
  cancel() {
    this.leaveAddMode();
    this.typeToEdit = null;
  }

  delete(ent: TypeEnt) {
    this.copyOfTypeToEdit = new TypeEnt();
    Object.assign(this.copyOfTypeToEdit, ent);

    //this.typeToEdit = ent;

    this._commit(true);
  }
  save() {
    this._commit(false);
  }

  _commit(isDel: boolean) {

    this.descriptionErrorMessage = null;
    if (!isDel) {
      this.descriptionErrorMessage = null;

      if (!Helpers.HasInput(this.copyOfTypeToEdit.COMMITTYPE_Description))
        this.descriptionErrorMessage = "Required";

    }

    if (this.descriptionErrorMessage != null) {
      //alert("error");
    }
    else {
      let toSave = new TypeLevel2Ent();
      toSave.Level1_PK = Number.parseInt(this.typeDDLValue);
      toSave.Description = Helpers.CleanString(this.copyOfTypeToEdit.COMMITTYPE_Description);
      toSave.CommitType_PK = this.copyOfTypeToEdit.COMMITTYPE_PK_ID;

      if (isDel) {
        toSave.DeleteFlag = true;
        //console.log(toSave);
        this.typeService.UpdateLevel2(toSave).subscribe(p => this.onDeleteComplete())
      }
      else {
        toSave.DeleteFlag = false;
        //console.log(toSave);
        if (this.copyOfTypeToEdit.COMMITTYPE_PK_ID == -1) {
          this.typeService.AddLevel2(toSave).subscribe(p => this.onAddComplete());
        }
        else
          this.typeService.UpdateLevel2(toSave).subscribe(p => this.onUpdateComplete(this.copyOfTypeToEdit))
      }
    }

  }

  onAddComplete() {
    this.typeToEdit = null;
    this.refreshLevel2Ents();
  }
  onUpdateComplete(savedType: TypeEnt) {
    Object.assign(this.typeToEdit, savedType);
    this.typeToEdit = null;
  }
  onDeleteComplete() {
    this.typeToEdit = null;
    this.refreshLevel2Ents();
  }


  addInit() {
    let newType = new TypeEnt();
    newType.COMMITTYPE_PK_ID = -1
    newType.COMMITTYPE_Description = "";
    this.level2Ents.push(newType);
    this.edit(newType, false);
  }
  leaveAddMode() {
    this.level2Ents = this.level2Ents.filter(p => p.COMMITTYPE_PK_ID != -1);

  }


}
