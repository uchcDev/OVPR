import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PaymentService } from '../../DropDown/payment.service';
import { DropDownService } from '../../DropDown/drop-down.service';
import{OVPRService} from '../../DropDown/ovpr.service';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Helpers } from '../../Helpers';


import {
  PaymentEnt,
  PaymentChangeEnt,
  usp_08_PaymentStatus_GetStatusesEnt,
  Result
   
} from '../../DropDown/DataDeclares';
import { empty } from 'rxjs';
import { utils } from 'protractor';


export class PaymentComponent_Event
{

}




@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  paymentEnts: PaymentEnt[] = [];
  statuses: usp_08_PaymentStatus_GetStatusesEnt[] = [];

  paymentEdit: PaymentEnt;

  view_AddPreviewElseSave: boolean = true;
  action_addElseUpdate: boolean = null;

  controlPropertyList: string[] = [];

  allowEdit : boolean = false;

  constructor(private  ovprService:OVPRService, private paymentService: PaymentService, private ddService: DropDownService) {

    let toAdd = new PaymentEnt();
    toAdd.PayStatusDesc = "Pending";
 
    this.paymentService.GetCurrentFiscalYear().subscribe(p => this.paymentEdit.FY = p.ReturnData);

    this.paymentEdit = toAdd;

    for (let c in PaymentComponentControls) {
      this.controlPropertyList[c] = null;
    }
  }

  commitmentPK: number ;

   
  ngOnInit() {
    //this.InitControl(this.commitmentPK);
  }
  public InitControl(commitmentPK: number) {
    this.commitmentPK = commitmentPK;    
    this.loadData();    
  }
  loadData()
  {
    this.loadPayments();
    this.ddService.GetStatuses().subscribe(p => this.load_statuses(p.ReturnData));
    this.ovprService.GetCommitmentStatus(this.commitmentPK).subscribe(p => this.load_proposalStatus(p.ReturnData));
  }  

  public loadPayments()
  {
    this.paymentService.GetAllPayments(this.commitmentPK, "all").subscribe(p => this.load_paymentEnts(p.ReturnData));
  }
  public load_paymentEnts(paymentEnts: PaymentEnt[]) {


    
    this.paymentEnts = paymentEnts;

    this.view_AddPreviewElseSave = true;
  }
  public load_statuses(statuses: usp_08_PaymentStatus_GetStatusesEnt[]) {
    this.statuses = statuses;
  }
  //allowEdit
  public load_proposalStatus(status : string) {
    if(status == null)
    this.allowEdit = false;
    else
      this.allowEdit = (status.toLocaleLowerCase() ==  'awarded');
  }

  gotoSaveView() {
    this.view_AddPreviewElseSave = false;
    
    if(!Helpers.HasInput(this.paymentEdit.PaymentComment))
      this.paymentEdit.PaymentComment = "na"

    this.paymentService.GetNextAvailablePaymentNumber(this.commitmentPK).subscribe(p => this.paymentEdit.PaymentNo = p.ReturnData);
    this.action_addElseUpdate = true;

  }
  editPayment(ent: PaymentEnt) {
    let toEdit = new PaymentEnt();


    for (var key in ent) {
      toEdit[key] = ent[key];
    }

     toEdit["AmountPaid"] =  Helpers.FormatToNumberTwoDecimal(ent["AmountPaid"]);
     toEdit["AmountDue"] =  Helpers.FormatToNumberTwoDecimal(ent["AmountDue"]);
     toEdit["AmountNotFunded"] =  Helpers.FormatToNumberTwoDecimal(ent["AmountNotFunded"]);

    //console.log(ent);
    //console.log(toEdit);

    this.paymentEdit = toEdit;

    this.view_AddPreviewElseSave = false;
    this.action_addElseUpdate = false;
  }
  isValid(): boolean {
    for (let c in PaymentComponentControls) {
      this.controlPropertyList[c] = null;
    }

    if (!Helpers.HasInput(this.paymentEdit.PayStatusDesc)) {
      this.controlPropertyList[PaymentComponentControls.status] = "required"
    }
    if (!Helpers.IsValidInt(this.paymentEdit.FY)) {
      this.controlPropertyList[PaymentComponentControls.fy] = "valid year is required"
    }
    if (!Helpers.HasInput(this.paymentEdit.PaymentComment)) {
      this.controlPropertyList[PaymentComponentControls.paymentComment] = "comment is required"
    }

    if (this.paymentEdit.PayStatusDesc == "Pending") {
      if (this.paymentEdit.DueDate == null) {
        this.controlPropertyList[PaymentComponentControls.dueDate] = "valid date date is required"
      }
      if (!Helpers.IsValidMoney(this.paymentEdit.AmountDue)) {
        this.controlPropertyList[PaymentComponentControls.amountDue] = "valid amount is required"
      }
    }
    else if (this.paymentEdit.PayStatusDesc == "Not Funded") {
      if (!Helpers.IsValidMoney(this.paymentEdit.AmountNotFunded)) {
        this.controlPropertyList[PaymentComponentControls.amountNotFunded] = "valid amount is required"
      }
      
      if (!Helpers.HasInput(this.paymentEdit.NotFundedReason)) {
        this.controlPropertyList[PaymentComponentControls.notFundedReason] = "reason is required"
      }   
    }
    else if (this.paymentEdit.PayStatusDesc == "Completed") {

      if (this.paymentEdit.DatePaid == null) {
        this.controlPropertyList[PaymentComponentControls.datePaid] = "valid date date is required"
      }    
      if (!Helpers.HasInput(this.paymentEdit.TransactionNumber)) {
        this.controlPropertyList[PaymentComponentControls.transactionNumber] = "required"
      }      
      if (!Helpers.HasInput(this.paymentEdit.FromAccount)) {
        this.controlPropertyList[PaymentComponentControls.fromAccount] = "required"
      }  
       if (!Helpers.HasInput(this.paymentEdit.ToAccount)) {
        this.controlPropertyList[PaymentComponentControls.toAccount] = "required"
      }   
      if (!Helpers.IsValidMoney(this.paymentEdit.AmountPaid)) {
        this.controlPropertyList[PaymentComponentControls.amountPaid] = "valid amount is required";
      }
    }
    for (let c in PaymentComponentControls) {
      if (this.controlPropertyList[c] != null)
        return false;
    }
    return true;
  }
  savePayment() { 

    if (this.isValid() && this.action_addElseUpdate != null) {
      let changeEnt = new PaymentChangeEnt();
      changeEnt.Reason = "";

      changeEnt.Payment_PK = this.paymentEdit.PaymentPK;
      changeEnt.Commitment_PK = this.commitmentPK;

      changeEnt.PayStatus = this.paymentEdit.PayStatusDesc;
      changeEnt.FY = this.paymentEdit.FY;
      changeEnt.PaymentNumber = this.paymentEdit.PaymentNo;
      changeEnt.PayComment = this.paymentEdit.PaymentComment;

      if (changeEnt.PayStatus == "Pending") {
        changeEnt.DueDate = this.paymentEdit.DueDate;
        changeEnt.Amount = Helpers.parseFloatSafe(this.paymentEdit.AmountDue).toString();
      }
      else if (changeEnt.PayStatus == "Not Funded") {
        changeEnt.Amount = Helpers.parseFloatSafe(this.paymentEdit.AmountNotFunded).toString();
        changeEnt.Reason = this.paymentEdit.NotFundedReason;
      }
      else if (changeEnt.PayStatus == "Completed") {        
        changeEnt.PaymentDate = this.paymentEdit.DatePaid;      
        changeEnt.Amount = Helpers.parseFloatSafe(this.paymentEdit.AmountPaid).toString();
        changeEnt.TransNumber = this.paymentEdit.TransactionNumber;
        changeEnt.AcctFrom = this.paymentEdit.FromAccount;
        changeEnt.AcctTo = this.paymentEdit.ToAccount;
      }
      //else error     

      if (this.action_addElseUpdate) {
        //alert("add");
        this.paymentService.AddPayment(changeEnt).subscribe(p => this.saveCompleted(p));
      }
      else {
        //alert("update");
        this.paymentService.EditPayment(changeEnt).subscribe(p => this.saveCompleted(p));
      }

      this.view_AddPreviewElseSave = true;
      this.action_addElseUpdate = null;
    }
  }  
 
  cancel() {
    this.view_AddPreviewElseSave = true;
    this.action_addElseUpdate = null;
  }

  delRow(ent: PaymentEnt) {
    let ruSure = confirm("are you sure");    
    if(ruSure)
      this.paymentService.DeletePayment(ent.CommitmentNumber, ent.PaymentPK, ent.PayStatusDesc).subscribe(p => this.saveCompleted(p));
  }
  saveCompleted(results : Result<number>) {
    
    if(results == null || results.IsError)
    {
         
    }
    else     
      this.loadPayments();
  }
}

  /*
  displayError( commitmentResult : PaymentResult)
  {
    console.log(commitmentResult);
    if(commitmentResult == null)
    {
      alert("error: http" )
    }
    else if(commitmentResult.IsError)
    {
      alert("error: " +  commitmentResult.ErrorMessage);
    }   
  }}
  */

export enum PaymentComponentControls {
  status = "status",
  fy = "fy",
  paymentComment = "paymentComment",
  dueDate = "dueDate",
  amountDue = "amountDue",
  datePaid = "datePaid",
  transactionNumber = "transactionNumber",
  fromAccount = "fromAccount",
  toAccount = "toAccount",
  amountPaid = "amountPaid",
  amountNotFunded = "amountNotFunded",
  notFundedReason = "notFundedReason"

}


