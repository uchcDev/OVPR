import { Component, OnInit, EventEmitter,Output ,ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { FormControl } from '@angular/forms';




import { Router, ActivatedRoute } from '@angular/router';

import { DropDownService } from '../../DropDown/drop-down.service';
import { OVPRService } from '../../DropDown/ovpr.service';

import { Observable, Subject } from 'rxjs';
import { switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import {FileUploadComponent} from'../file-upload/file-upload.component';

import{CommitmentSummaryComponent} from '../commitment-summary/commitment-summary.component';

import {Helpers} from '../../Helpers';


import {
  usp_05_Campus_GetCampus_Ent,
  usp_05a_School_GetSchoolByCampusEnt,
  usp_06_CommittmentStatus_GetStatusEnt,
  usp_07_CommittmentType_GetTypesEnt,
  usp_08_PaymentStatus_GetStatusesEnt,
  usp_10_Department_GetDeptsByCampusSchoolEnt,
  usp_11_Sponsor_GetSponsorsByCampusEnt,
  usp_16_GetProposalsByCampusEnt,
  usp_17_GetPIsByCampusEnt,
  usp_16a_GetProposalDetailByPropNo_Ent,
  GetPIsEnt,
  GetSponsorsEnt,
  GetProposalsEnt,

  CommitmentChangeEnt,
  CommitmentEnt,
  //CommitmentResult,
  FileToUpload,
  Result
} from '../../DropDown/DataDeclares';
import { doesNotThrow } from 'assert';
import { inherits } from 'util';
import { utils } from 'protractor';

export enum CommitmentComponentControls {
  campus = "campus",
  type = "type",
  school = "school",
  dept = "dept",
  pi = "pi",
  infoEd = "infoEd",
  date = "date",
  startFY = "startFY",
  numYears = "numYears",
  commitMoney = "commitMoney",
  status = "status",
  commitName = "commitName",
  commitDetail = "commitDetail",

  comSchool = "comSchool",
  comDept = "comDept",
  comPI = "comPI",
  sponsor = "sponsor",
}

export class ControlProperties {
  public ShowValidationMessage: boolean;
  public ValidationMessage: string;
  public ShowDataTrunc: boolean;
  public DataTruncMessage: string;

  public constructor() {
    this.Reset();
  }

  public Reset(): void {

    this.ShowValidationMessage = false;
    this.ValidationMessage = "Required"
    this.ShowDataTrunc = false;
    this.DataTruncMessage = "Only first 500 rows returned"
  }
}

export class CommitmentComponent_Event
{

}

export class CommitmentStatusChange  extends CommitmentComponent_Event 
{
  public status: string;

  constructor(status: string) 
  {
    super();

    this.status = status;
  }
}


export class CommitmentProposalChange  extends CommitmentComponent_Event 
{
  public selectedProposal: usp_16a_GetProposalDetailByPropNo_Ent;

  constructor(selectedProposal: usp_16a_GetProposalDetailByPropNo_Ent) 
  {
    super();

    this.selectedProposal = selectedProposal;
  }
}

export class CommitmentSubmit extends CommitmentComponent_Event
{
    public success : boolean;
    public commitmentID  : number;

   constructor(success: boolean, commitmentID : number) 
  {
    super();

    this.success = success;
    this.commitmentID = commitmentID;
  }
}
export class CommitmentCancel extends CommitmentComponent_Event
{
   constructor() 
  {
    super();    
  }
}


@Component({
  selector: 'app-commitment',
  templateUrl: './commitment.component.html',
  styleUrls: ['./commitment.component.css']
})
export class CommitmentComponent implements OnInit {
 
  @ViewChild('fileUpload', {static: true, read :FileUploadComponent}) fileUpload: FileUploadComponent;
  @ViewChild('placeHolder', {static: true, read :ViewContainerRef}) placeHolder: ViewContainerRef;

  isInSaveMode : boolean =false;
  
  commitmentSummaryComponent : CommitmentSummaryComponent;

  public Events = new EventEmitter<CommitmentComponent_Event>(); 


  message: string;

  campusEnts: usp_05_Campus_GetCampus_Ent[] = [];
  typeEnts: usp_07_CommittmentType_GetTypesEnt[] = [];
  schoolEnts: usp_05a_School_GetSchoolByCampusEnt[] = [];

  deptEnts: usp_10_Department_GetDeptsByCampusSchoolEnt[];
  piData = new GetPIsEnt();

  infoEdData = new GetProposalsEnt();

  statusEnts: usp_06_CommittmentStatus_GetStatusEnt[] = [];

  selectedProposal: usp_16a_GetProposalDetailByPropNo_Ent;

  comSchoolEnts: usp_05a_School_GetSchoolByCampusEnt[] = [];
  comDeptEnts: usp_10_Department_GetDeptsByCampusSchoolEnt[] = [];
  comPIData = new GetPIsEnt();
  comSponserData = new GetSponsorsEnt();

  //comSponserEnts: usp_11_Sponsor_GetSponsorsByCampusEnt[] = [];


  
  campus_Selected_CAMPUS_PK_ID: number = -1;
  type_Selected_COMMITTYPE_PK_ID: number = -1;
  school_Selected_SCHOOL_PK_ID: number = -1;
  dept_Selected_DEPT_PK_ID: number = -1;
  pi_Selected_PI_PK_ID: number = -1;
  infoEdID_Selected_PROP_PK_ID: number = -1;
  singleDueDate = new FormControl(new Date());
  startingFY: string = "";
  numYears: string = "";
  commitmentMoney: string = "";
  commitmentName: string = "";
  commitmentDetail: string = "";
  status_Selected_PAYMENTSTATUS_PK_ID: number = -1;

  comSchool_Selected_SCHOOL_PK_ID: number = -1;
  comDept_Selected_DEPT_PK_ID: number = -1;
  comPI_Selected_PI_PK_ID: number = -1;
  comSponser_Selected_SPONSOR_PK_ID: number = -1;

  searchPIString: string;

  searchComPIString: string;
  searchComSponserString: string;
  searchProposalString: string;


  refreshPIArgsSig: string;
  refreshProposalArgsSig: string;
  refreshComPIArgsSig: string;


  campusEvents: MyEventHandler = new MyEventHandler();
  schoolEvents: MyEventHandler = new MyEventHandler();
  deptEvents: MyEventHandler = new MyEventHandler();

  comSchoolEvents: MyEventHandler = new MyEventHandler();
  comDeptEvents: MyEventHandler = new MyEventHandler();


  //_showInfoEdMatchControls: boolean = null;
  ShowInfoEdControls: boolean = false;
  ShowNonInfoEdControls: boolean = false;



  controlPropertyList: ControlProperties[] = [];

  commitPK: number;// = 779;
  constructor(private ddService: DropDownService, private dataService: OVPRService, private resolver: ComponentFactoryResolver ,private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { 
    for (let c in CommitmentComponentControls) {
      this.controlPropertyList[c] = new ControlProperties();     
    }

    this.piData.Data = [];
    this.piData.WasDataTruncated = false;

    this.infoEdData.Data = [];
    this.infoEdData.WasDataTruncated = false;

    this.comPIData.Data = [];
    this.comPIData.WasDataTruncated = false;
  }
   
  public InitControl(commitPK : number, showInfoEdData : boolean) { 

    this.fileUpload.InitControl(commitPK);
    
 
    if(showInfoEdData)
    {
      const factory = this.resolver.resolveComponentFactory(CommitmentSummaryComponent);
      let commitmentComponentRef = this.placeHolder.createComponent(factory)
      this.commitmentSummaryComponent = commitmentComponentRef.instance;

    }


    this.commitPK = commitPK;    

    this.campusEvents.Subscribe(this.refreshSchool, this);
    this.campusEvents.Subscribe(this.refreshDept, this);
    this.campusEvents.Subscribe(this.refreshPI, this);

    this.campusEvents.Subscribe(this.refreshInfoEdID, this);

    this.campusEvents.Subscribe(this.refreshComSchool, this);
    this.campusEvents.Subscribe(this.refreshComDept, this);
    this.campusEvents.Subscribe(this.refreshComPI, this);
    this.campusEvents.Subscribe(this.refreshComSponser, this);


    this.schoolEvents.Subscribe(this.refreshDept, this);
    this.schoolEvents.Subscribe(this.refreshPI, this);
    this.schoolEvents.Subscribe(this.refreshInfoEdID, this);

    this.deptEvents.Subscribe(this.refreshInfoEdID, this);
    this.deptEvents.Subscribe(this.refreshPI, this);

    this.comSchoolEvents.Subscribe(this.refreshComDept, this);
    this.comSchoolEvents.Subscribe(this.refreshComPI, this);

    this.comDeptEvents.Subscribe(this.refreshComPI, this);


    if (this.commitPK == null) {
      this.refreshCampus();
      this.refreshType();
      this.refreshStatus();     
    }
    else {
      this.dataService.GetCommitment(this.commitPK).subscribe(p => this.loadCommitment(p.ReturnData));
    }
  }

  loadCommitment(commitment: CommitmentEnt) {
    
    let _ShowInfoEdControls= false;
    let _ShowNonInfoEdControls = false;
    let recalc = this. showInfoEdMatchControls_ReCalc(commitment.CommitmentType);
    if(recalc)
    {
      _ShowInfoEdControls= true;
    }
    else
    _ShowNonInfoEdControls = true;

    this.ShowInfoEdControls = _ShowInfoEdControls;
    this.ShowNonInfoEdControls = _ShowNonInfoEdControls;

    
    this.campusInit(commitment.Campus_PK);   
    
   
    this.typeInit(commitment.COMMITTYPE_PARENT_PK);   
    this.schoolInit(commitment.Campus_PK, commitment.School_PK, commitment.School);    
    this.deptInit(commitment.Campus_PK, commitment.School_PK, commitment.Dept_PK, commitment.Dept);    

    if(this.ShowNonInfoEdControls)
       this.piInit(commitment.Campus_PK, commitment.School_PK, commitment.Dept_PK, commitment.PI_PK, commitment.PI);
         
    if(this.ShowInfoEdControls)
    {

      
      this.infoEdInit(commitment.Campus_PK, commitment.School_PK, commitment.Dept_PK, commitment.Project);
      
      let me = this;
      let p1 = new Promise(function (resolve, reject) {me.dataService.GetProposalDetailByPropNo(commitment.Project).subscribe(p => {p=>   console.log(me.selectedProposal); me.selectedProposal =p.ReturnData; resolve(p.ReturnData)});});

              //Promise..all([p1,p2]);

         p1.then(function(){
          me.Events.emit(new CommitmentProposalChange(me.selectedProposal));    
          if(me.commitmentSummaryComponent != null)
            me.commitmentSummaryComponent.selectedProposal = me.selectedProposal
            

               //console.log(me.selectedProposal);
            
        });

    }

        
    
    this.singleDueDate.setValue(commitment.CommitmentDate);
    this.startingFY = commitment.StartingFY.toString();
    this.numYears = commitment.NumberOfYears.toString();
    this.commitmentMoney = commitment.TotalCommitment.toString();

    this.commitmentMoney = Helpers.FormatToNumber(commitment.TotalCommitment);

    

    this.statusInit(commitment.CommitmentStatus);

    this.commitmentName = commitment.CommitmentDesc;
    this.commitmentDetail = commitment.Comment;

    if(this.ShowInfoEdControls)
    {
      this.comSchoolInit(commitment.Campus_PK, commitment.School_PK, commitment.School);
      this.comDeptInit(commitment.Campus_PK, commitment.School_PK, commitment.CorrectedDept_PK);
      this.comPiInit(commitment.Campus_PK, commitment.School_PK, commitment.CorrectedDept_PK, commitment.CorrectedPI_PK);

      this.comSponserInit(commitment.Campus_PK, commitment.CorrectedSponsor_PK);
    }

      
  }

  //campus -----------------------------------------------------------  
  refreshCampus() {
    this.ddService.GetCampus().subscribe(p => this.campusLoaded(p.ReturnData));
  }
  campusLoaded(campusEnts: usp_05_Campus_GetCampus_Ent[]) {  
    
    let find = campusEnts.find(p=>p.CAMPUS_Name == "Storrs");
    if(find != null)
    {
      this.campus_Selected_CAMPUS_PK_ID = find.CAMPUS_PK_ID;
    }
    
    this.campusEnts = campusEnts;
    this.campusEvents.NotifyAll("campusChanged");
  }
  campusChanging() {
    this.campusEvents.NotifyAll("campusChanged");
  }
  campusInit(campus_Selected_CAMPUS_PK_ID: number) {
    this.campus_Selected_CAMPUS_PK_ID = campus_Selected_CAMPUS_PK_ID;
    this.ddService.GetCampus().subscribe(p => this.campusEnts = p.ReturnData);
  }

  //type  -----------------------------------------------------------
  refreshType(): void {
    this.ddService.GetTypes().subscribe(p => this.typeLoaded(p.ReturnData));
  }
  typeLoaded(typeEnts: usp_07_CommittmentType_GetTypesEnt[]) {
    this.type_Selected_COMMITTYPE_PK_ID = -1;
    this.typeEnts = typeEnts;

    this.checkInfoEdID_Visibility();
  }
  typeChanging() {
    this.checkInfoEdID_Visibility();
  }
  typeInit(type_Selected_COMMITTYPE_PK_ID: number) {
    this.type_Selected_COMMITTYPE_PK_ID = type_Selected_COMMITTYPE_PK_ID;
    this.ddService.GetTypes().subscribe(p => this.typeEnts = p.ReturnData);    
  }
  checkInfoEdID_Visibility() {
    let selected = this.typeEnts.find(p => p.COMMITTYPE_PK_ID == this.type_Selected_COMMITTYPE_PK_ID);
    let value = (selected == null) ? null : selected.COMMITTYPE_Description;

    this._checkInfoEdID_Visibility(value);
  }
  _checkInfoEdID_Visibility(value: string) {

    let newValue = this.showInfoEdMatchControls_ReCalc(value);

    let new_ShowInfoEdControls: boolean;
    let new_ShowNonInfoEdControls: boolean;
    if (newValue == null) {
      new_ShowInfoEdControls = false;
      new_ShowNonInfoEdControls = false;
    }
    else if (newValue) {
      new_ShowInfoEdControls = true;
      new_ShowNonInfoEdControls = false;
    }
    else {
      new_ShowInfoEdControls = false;
      new_ShowNonInfoEdControls = true;
    }

    if (new_ShowInfoEdControls != this.ShowInfoEdControls) {
      this.ShowInfoEdControls = new_ShowInfoEdControls;
      if (this.ShowInfoEdControls) {
        this.refreshInfoEdID("");
        this.refreshComSchool("");
        this.refreshComDept("");
        this.refreshComPI("");
        this.refreshComSponser("");
      }
    }
    if (new_ShowNonInfoEdControls != this.ShowNonInfoEdControls) {
      this.ShowNonInfoEdControls = new_ShowNonInfoEdControls;
      if (this.ShowNonInfoEdControls) {
        this.refreshPI("");
      }
    }
  }
  showInfoEdMatchControls_ReCalc(value: string): boolean {
    if (value == null)
      return null;

    return (!value.toLocaleLowerCase().startsWith("other"));
  }


  //school  -----------------------------------------------------------
  refreshSchool(event: string) {
    if (this.campus_Selected_CAMPUS_PK_ID == -1) {
      let empty: usp_05a_School_GetSchoolByCampusEnt[] = [];
      this.schoolLoaded(empty);
    }
    else {
      this.ddService.GetSchoolByCampus(this.campus_Selected_CAMPUS_PK_ID).subscribe(p => this.schoolLoaded(p.ReturnData));
    }
  }
  schoolLoaded(schoolEnts: usp_05a_School_GetSchoolByCampusEnt[]) {
    this.school_Selected_SCHOOL_PK_ID = -1;

    this.schoolEnts = schoolEnts;
    this.schoolEvents.NotifyAll("schoolChanged");
  }
  schoolChanging() {
    this.schoolEvents.NotifyAll("schoolChanged");
  }
  schoolInit(campusPK: number, schoolPK: number, schoolName: string) {
    let me = this;


    //a//lert("schoolInit");
    let schoolPromise = new Promise(function (resolve, reject) {
      me.school_Selected_SCHOOL_PK_ID = schoolPK;
      me.ddService.GetSchoolByCampus(campusPK).subscribe(p => resolve(p.ReturnData));
    }
    );
    schoolPromise.then(function (value: usp_05a_School_GetSchoolByCampusEnt[]) {
      let target = value.find(p => p.SCHOOL_PK_ID == schoolPK);
      if (target == null) {
        let elem = new usp_05a_School_GetSchoolByCampusEnt();
        elem.SCHOOL_PK_ID = schoolPK;
        elem.SCHOOL_Name = schoolName;
        value.splice(0, 0, elem);
      }
      me.schoolEnts = value;
    }
    );

  }

  //dept  -----------------------------------------------------------
  refreshDept(event: string) {
    if (this.campus_Selected_CAMPUS_PK_ID == -1 || this.school_Selected_SCHOOL_PK_ID == -1) {
      let empty: usp_10_Department_GetDeptsByCampusSchoolEnt[] = [];
      this.deptLoaded(event, empty);
    }
    else {
      this.ddService.GetDeptsByCampusSchool(this.campus_Selected_CAMPUS_PK_ID, this.school_Selected_SCHOOL_PK_ID, null).subscribe(p => this.deptLoaded(event, p.ReturnData));
    }
  }

  deptLoaded(event: string, deptEnts: usp_10_Department_GetDeptsByCampusSchoolEnt[]) {
    if (event == "campusChanged" || this.dept_Selected_DEPT_PK_ID == -1) {
      this.dept_Selected_DEPT_PK_ID = -1;
    }
    else {

      let current = this.deptEnts.find(p => p.DEPT_PK_ID == this.dept_Selected_DEPT_PK_ID)
      deptEnts.splice(0, 0, current);
    }

    this.deptEnts = deptEnts;
    this.deptEvents.NotifyAll("deptChanged");
  }
  deptChanging() {
    this.deptEvents.NotifyAll("deptChanged");
  }
  deptInit(campusPK: number, schoolPK: number, deptPK: number, deptName: string) {
    let me = this;

    let deptPromise = new Promise(function (resolve, reject) {
      me.dept_Selected_DEPT_PK_ID = deptPK;
      me.ddService.GetDeptsByCampusSchool(campusPK, schoolPK, deptPK).subscribe(p => resolve(p.ReturnData));
    });
    deptPromise.then(function (value: usp_10_Department_GetDeptsByCampusSchoolEnt[]) {
      me.deptEnts = value;
    });
  }

  //PI -----------------------------------------------------------
  searchPI() {
    this.refreshPI("");
  }

  refreshPI(event: string) {

    if (this.ShowNonInfoEdControls) {

      //console.log(event);
      if (this.campus_Selected_CAMPUS_PK_ID == -1) {
        let empty = new GetPIsEnt();
        empty.WasDataTruncated = false;
        empty.Data = [];

        this.piLoaded(event, empty);
      }
      else {

        //alert("a");
        let schoolPk: number = null;
        let deptPk: number = null;
        let lastName: string = null;

        if (this.school_Selected_SCHOOL_PK_ID != -1) {
          schoolPk = this.school_Selected_SCHOOL_PK_ID;
        }
        if (this.dept_Selected_DEPT_PK_ID != -1) {
          deptPk = this.dept_Selected_DEPT_PK_ID;
        }

        if (this.searchPIString == null || this.searchPIString == "")
          lastName = "*";
        else
          lastName = this.searchPIString;

        let argsSig = this.campus_Selected_CAMPUS_PK_ID + "," + schoolPk + ", " + deptPk + ", " + lastName;
        //console.log(argsSig);
        if (argsSig == this.refreshPIArgsSig) {
          //alert("n");
          this.piLoaded(event, this.piData);
        }
        else {
          //alert("load");
          this.refreshPIArgsSig = argsSig;
          //console.log("call");
          this.ddService.GetPIs(this.campus_Selected_CAMPUS_PK_ID, schoolPk, deptPk, lastName, null).subscribe(p => this.piLoaded(event, p.ReturnData));
        }
      }
    }

  }
  piLoaded(event: string, data: GetPIsEnt) {

    //comPIEnts: usp_17_GetPIsByCampusEnt[]
    if (event == "campusChanged" || this.pi_Selected_PI_PK_ID == -1) {
      this.pi_Selected_PI_PK_ID = -1;
    }
    else {

      if (data.Data.find(p => p.PI_PK_ID == this.pi_Selected_PI_PK_ID) == null) {
        let current = this.piData.Data.find(p => p.PI_PK_ID == this.pi_Selected_PI_PK_ID);
        data.Data.splice(0, 0, current);
      }
    }

    this.piData = data;
  }
  piChanging() {

    if (this.pi_Selected_PI_PK_ID != -1) {
      let selectedPI = this.piData.Data.find(p => p.PI_PK_ID == this.pi_Selected_PI_PK_ID);

      this.school_Selected_SCHOOL_PK_ID = selectedPI.SCHOOL_PK_ID;
      this.ddService.GetSchoolByCampus(this.campus_Selected_CAMPUS_PK_ID).subscribe(p => this.schoolEnts = p.ReturnData);

      this.dept_Selected_DEPT_PK_ID = selectedPI.DEPT_PK_ID;
      this.ddService.GetDeptsByCampusSchool(this.campus_Selected_CAMPUS_PK_ID, this.school_Selected_SCHOOL_PK_ID, selectedPI.DEPT_PK_ID).subscribe(p => this.deptEnts = p.ReturnData);
    }

  }
  piInit(campusPK: number, schoolPK: number, deptPK: number, piPK: number, piName: string) {
    this.refreshPIArgsSig = null;

    let me = this;

    let piPromise = new Promise(function (resolve, reject) {
      me.refreshPIArgsSig = "";
      me.pi_Selected_PI_PK_ID = piPK;
      me.ddService.GetPIs(campusPK, schoolPK, deptPK, "*", piPK).subscribe(p => resolve(p.ReturnData));
    });
    piPromise.then(function (value: GetPIsEnt) {

      me.piData = value;
    });
  }

  //InfoEd -----------------------------------------------------------

  searchProposal() {
    this.refreshInfoEdID("");
  }
  refreshInfoEdID(event: string) {
    if (this.ShowInfoEdControls) {



      if (this.campus_Selected_CAMPUS_PK_ID == -1) {
        let empty = new GetProposalsEnt();
        empty.WasDataTruncated = false;
        empty.Data = [];

        this.infoEdIDLoaded(empty);
      }
      else {

        let searchHelper = InfoEdSearchHelper.InitInfoEdSearchHelper(this.campus_Selected_CAMPUS_PK_ID, this.school_Selected_SCHOOL_PK_ID, this.dept_Selected_DEPT_PK_ID, this.searchProposalString);

        if (searchHelper.argsSig == this.refreshProposalArgsSig) {
          this.infoEdIDLoaded(this.infoEdData)
        }
        else {
          this.refreshProposalArgsSig = searchHelper.argsSig;
          this.ddService.GetProposals(this.campus_Selected_CAMPUS_PK_ID, searchHelper.schoolID, searchHelper.deptID, searchHelper.searchProposal, "").subscribe(p => this.infoEdIDLoaded(p.ReturnData));
        }
      }
    }
  }
  infoEdIDLoaded(getProposalsEnt: GetProposalsEnt) {
    //this.infoEdID_Selected_PROP_PK_ID = -1;

    if( this.infoEdID_Selected_PROP_PK_ID != -1)
    {
      if (getProposalsEnt.Data.find(p => p.PROP_PK_ID == this.infoEdID_Selected_PROP_PK_ID) == null) 
      {
        let current = this.infoEdData.Data.find(p => p.PROP_PK_ID == this.infoEdID_Selected_PROP_PK_ID);
        getProposalsEnt.Data.splice(0, 0, current);
      }
    }

    // if (getProposalsEnt.WasDataTruncated) {
    //alert("trunc");
    // }
    this.infoEdData = getProposalsEnt;
  }
  infoEdIDChanging() {
    if (this.infoEdID_Selected_PROP_PK_ID == -1) {
      this.selectedProposal = null;

      this.Events.emit(new CommitmentProposalChange(this.selectedProposal));  
      if(this.commitmentSummaryComponent != null)
        this.commitmentSummaryComponent.selectedProposal = this.selectedProposal
      
    }
    else {
      let current = this.infoEdData.Data.find(p => p.PROP_PK_ID == this.infoEdID_Selected_PROP_PK_ID);

      this.refreshSelectedProposal(current.PROPPROP_ProposalNumber);
    }
  }
  infoEdInit(campusPK: number, schoolPK: number, deptPK: number, infoEdNumber: string) {
    this.refreshProposalArgsSig = null;

    let me = this;

    let promise = new Promise(function (resolve, reject) {

      //alert(schoolPK);

      let searchHelper = InfoEdSearchHelper.InitInfoEdSearchHelper(campusPK, schoolPK, deptPK, "*");
      // alert( searchHelper.schoolID);
      me.ddService.GetProposals(campusPK, searchHelper.schoolID, searchHelper.deptID, searchHelper.searchProposal, infoEdNumber).subscribe(p => resolve(p.ReturnData));

    });
    promise.then(function (value: GetProposalsEnt) {
      me.infoEdData = value;

      let target = value.Data.find(p => p.PROPPROP_ProposalNumber == infoEdNumber);
      me.infoEdID_Selected_PROP_PK_ID = target.PROP_PK_ID

    });
  }

  //Status -----------------------------------------------------------

  refreshStatus() {
    this.ddService.GetCommittmentStatus().subscribe(p => this.statusLoaded(p.ReturnData));
  }
  statusLoaded(statusEnts: usp_06_CommittmentStatus_GetStatusEnt[]) {
    this.status_Selected_PAYMENTSTATUS_PK_ID = -1;
    this.statusEnts = statusEnts;
  }
  statusChange() {   
   
     let target = this.statusEnts.find(p=> p.COMMITSTATUS_PK_ID == this.status_Selected_PAYMENTSTATUS_PK_ID )
     let newStatus : string = null;
     if(target != null)
     {
        newStatus = target.COMMITSTATUS_Description
     }

     let event = new CommitmentStatusChange(newStatus);
     this.Events.emit(event);  

  }
  statusInit(status: string) {
    let me = this;

    this.ddService.GetCommittmentStatus().subscribe(p => this.statusEnts = p.ReturnData);

    let promise = new Promise(function (resolve, reject) {
      me.ddService.GetCommittmentStatus().subscribe(p => resolve(p.ReturnData))
    });
    promise.then(function (value: usp_06_CommittmentStatus_GetStatusEnt[]) {
      let target = value.find(p => p.COMMITSTATUS_Description == status);
      me.status_Selected_PAYMENTSTATUS_PK_ID = target.COMMITSTATUS_PK_ID;

      me.statusEnts = value;
    });


  }

  refreshSelectedProposal(infoEndNumber: string) {
    this.dataService.GetProposalDetailByPropNo(infoEndNumber).subscribe(p => this.selectedProposalLoaded(p.ReturnData));
  }
  selectedProposalLoaded(selectedProposal: usp_16a_GetProposalDetailByPropNo_Ent) {

    this.schoolInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectDeptSchoolName);
    this.deptInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectedDeptPK, selectedProposal.CorrectedDeptName);
    this.piInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectedDeptPK, selectedProposal.CorrectedPiPK, selectedProposal.OriginalPiName);
    this.comSchoolInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectDeptSchoolName)
    this.comDeptInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectedDeptPK);
    this.comPiInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedDeptSchoolPK, selectedProposal.CorrectedDeptPK, selectedProposal.CorrectedPiPK);
    this.comSponserInit(this.campus_Selected_CAMPUS_PK_ID, selectedProposal.CorrectedSponsorPK);

    this.selectedProposal = selectedProposal;
    this.commitmentName = this.selectedProposal.Title;

    this.Events.emit(new CommitmentProposalChange(this.selectedProposal));    
    if(this.commitmentSummaryComponent != null)
      this.commitmentSummaryComponent.selectedProposal = this.selectedProposal
  }

  refreshComSchool(event: string) {

    if (this.ShowInfoEdControls) {


      if (this.campus_Selected_CAMPUS_PK_ID == -1) {
        let empty: usp_05a_School_GetSchoolByCampusEnt[] = [];
        this.comSchoolLoaded(event, empty);
      }
      else {
        this.ddService.GetSchoolByCampus(this.campus_Selected_CAMPUS_PK_ID).subscribe(p => this.comSchoolLoaded(event, p.ReturnData));
      }
    }
  }
  comSchoolLoaded(event: string, comSchoolEnts: usp_05a_School_GetSchoolByCampusEnt[]) {

    this.comSchool_Selected_SCHOOL_PK_ID = -1;
    this.comSchoolEnts = comSchoolEnts;
    this.comSchoolEvents.NotifyAll("comSchoolChanged");
  }
  comSchoolChanging() {
    this.comSchoolEvents.NotifyAll("comSchoolChanged");
  }
  comSchoolInit(campusPK: number, schoolPK: number, schoolName: string) {
    let me = this;

    let schoolPromise = new Promise(function (resolve, reject) {
      me.comSchool_Selected_SCHOOL_PK_ID = schoolPK;
      me.ddService.GetSchoolByCampus(campusPK).subscribe(p => resolve(p.ReturnData));
    }
    );
    schoolPromise.then(function (value: usp_05a_School_GetSchoolByCampusEnt[]) {
      let target = value.find(p => p.SCHOOL_PK_ID == schoolPK);
      if (target == null) {
        let elem = new usp_05a_School_GetSchoolByCampusEnt();
        elem.SCHOOL_PK_ID = schoolPK;
        elem.SCHOOL_Name = schoolName;
        value.splice(0, 0, elem);
      }
      me.comSchoolEnts = value;
    }
    );

  }
  //----------------------------------------------------------------------
  refreshComDept(event: string) {
    if (this.ShowInfoEdControls) {


      if (this.campus_Selected_CAMPUS_PK_ID == -1 || this.comSchool_Selected_SCHOOL_PK_ID == -1) {
        let empty: usp_10_Department_GetDeptsByCampusSchoolEnt[] = [];
        this.comDeptLoaded(event, empty);
      }
      else {
        this.ddService.GetDeptsByCampusSchool(this.campus_Selected_CAMPUS_PK_ID, this.comSchool_Selected_SCHOOL_PK_ID, null).subscribe(p => this.comDeptLoaded(event, p.ReturnData));
      }
    }
  }
  comDeptLoaded(event: string, comDeptEnts: usp_10_Department_GetDeptsByCampusSchoolEnt[]) {
    if (event == "campusChanged" || this.comDept_Selected_DEPT_PK_ID == -1) {
      this.comDept_Selected_DEPT_PK_ID = -1;
    }
    else {
      let current = this.comDeptEnts.find(p => p.DEPT_PK_ID == this.comDept_Selected_DEPT_PK_ID);
      comDeptEnts.splice(0, 0, current);
    }

    this.comDeptEnts = comDeptEnts;
    this.comDeptEvents.NotifyAll("comDeptChanged");
  }
  comDeptChanging() {
    this.comDeptEvents.NotifyAll("comDeptChanged");
  }
  comDeptInit(campusPK: number, schoolPK: number, deptPK: number) {
    let me = this;

    let deptPromise = new Promise(function (resolve, reject) {
      me.comDept_Selected_DEPT_PK_ID = deptPK;
      me.ddService.GetDeptsByCampusSchool(campusPK, schoolPK, deptPK).subscribe(p => resolve(p.ReturnData));
    });
    deptPromise.then(function (value: usp_10_Department_GetDeptsByCampusSchoolEnt[]) {
      me.comDeptEnts = value;
    });
  }


  searchComPI(searchString: string) {
    this.refreshComPI("");
  }
  refreshComPI(event: string) {

    if (this.ShowInfoEdControls) {


      if (this.campus_Selected_CAMPUS_PK_ID == -1) {
        let empty = new GetPIsEnt();
        empty.WasDataTruncated = false;
        empty.Data = [];

        this.comPILoaded(event, empty);
      }
      else {
        let comSchoolPk: number = null;
        let comDeptPk: number = null;
        let lastName: string = null;

        if (this.comSchool_Selected_SCHOOL_PK_ID != -1) {
          comSchoolPk = this.comSchool_Selected_SCHOOL_PK_ID;
        }
        if (this.comDept_Selected_DEPT_PK_ID != -1) {
          comDeptPk = this.comDept_Selected_DEPT_PK_ID;
        }

        if (this.searchComPIString == null || this.searchComPIString == "")
          lastName = "*";
        else
          lastName = this.searchComPIString;

        // //console.log(this.campus_Selected_CAMPUS_PK_ID + "," + this.comSchool_Selected_SCHOOL_PK_ID + "," + comDeptPk)

        let argsSig = this.campus_Selected_CAMPUS_PK_ID + "," + comSchoolPk + ", " + comDeptPk + ", " + lastName;

        if (argsSig == this.refreshComPIArgsSig) {
          this.comPILoaded(event, this.comPIData)
        }
        else {
          this.refreshComPIArgsSig = argsSig;
          this.ddService.GetPIs(this.campus_Selected_CAMPUS_PK_ID, comSchoolPk, comDeptPk, lastName, null).subscribe(p => this.comPILoaded(event, p.ReturnData));
        }
      }
    }
  }
  comPILoaded(event: string, getPIsEnt: GetPIsEnt) {

    //comPIEnts: usp_17_GetPIsByCampusEnt[]
    if (event == "campusChanged" || this.comPI_Selected_PI_PK_ID == -1) {
      this.comPI_Selected_PI_PK_ID = -1;
    }
    else {
      let current = this.comPIData.Data.find(p => p.PI_PK_ID == this.comPI_Selected_PI_PK_ID);
      getPIsEnt.Data.splice(0, 0, current);
    }

    if (getPIsEnt.WasDataTruncated) {
      //alert("data trunc!");
    }

    this.comPIData = getPIsEnt;
  }
  comPIChanging() {
    if (this.comPI_Selected_PI_PK_ID != -1) {
      let selectedPI = this.comPIData.Data.find(p => p.PI_PK_ID == this.comPI_Selected_PI_PK_ID);

      this.comSchool_Selected_SCHOOL_PK_ID = selectedPI.SCHOOL_PK_ID;
      this.ddService.GetSchoolByCampus(this.campus_Selected_CAMPUS_PK_ID).subscribe(p => this.comSchoolEnts = p.ReturnData);

      this.comDept_Selected_DEPT_PK_ID = selectedPI.DEPT_PK_ID;
      this.ddService.GetDeptsByCampusSchool(this.campus_Selected_CAMPUS_PK_ID, this.comSchool_Selected_SCHOOL_PK_ID, null).subscribe(p => this.comDeptEnts = p.ReturnData);
    }
  }
  comPiInit(campusPK: number, schoolPK: number, deptPK: number, piPK: number) {

    this.refreshComPIArgsSig = null;

    let me = this;

    let piPromise = new Promise(function (resolve, reject) {
      me.refreshComPIArgsSig = "";
      me.comPI_Selected_PI_PK_ID = piPK;
      me.ddService.GetPIs(campusPK, schoolPK, deptPK, "*", piPK).subscribe(p => resolve(p.ReturnData));
    });
    piPromise.then(function (value: GetPIsEnt) {

      me.comPIData = value;
    });
  }


  searchComSponser(searchString: string) {
    this.refreshComSponser("");
  }
  refreshComSponser(event: string) {

    if (this.ShowInfoEdControls) {


      if (this.campus_Selected_CAMPUS_PK_ID != -1) {

        let name: string = null;

        if (this.searchComSponserString == null || this.searchComSponserString == "")
          name = "*";
        else
          name = this.searchComSponserString;

        //alert(name);

        this.ddService.GetSponsorsByCampus(this.campus_Selected_CAMPUS_PK_ID, name, null).subscribe(p => this.comSponserLoaded(event, p.ReturnData));
      }
      else {
        let empty = new GetSponsorsEnt();
        empty.WasDataTruncated = false;
        empty.Data = [];

        this.comSponserLoaded(event, empty);
      }
    }
  }
  comSponserLoaded(event: string, getSponsorsEnt: GetSponsorsEnt) {
    this.comSponser_Selected_SPONSOR_PK_ID = -1;

    if (getSponsorsEnt.WasDataTruncated) {
      // alert("getSponsorsEnt data trunc!");
    }
    this.comSponserData = getSponsorsEnt;

  }
  comSponserChanging() {

  }

  comSponserInit(campusPK: number, sponserPK: number) {
    this.comSponser_Selected_SPONSOR_PK_ID = sponserPK;
    this.ddService.GetSponsorsByCampus(campusPK, "*", sponserPK).subscribe(p => this.comSponserData = p.ReturnData);
  }



  submitData(): void {
    let commitment = new CommitmentChangeEnt();
    for (let c in CommitmentComponentControls) {
      this.controlPropertyList[c].ShowValidationMessage = false;
    }

    //alert(this.campus_Selected_CAMPUS_PK_ID);
    //alert(this.IsValidDDValue(this.campus_Selected_CAMPUS_PK_ID));
    if (!this.IsValidDDValue(this.campus_Selected_CAMPUS_PK_ID)) {
      this.controlPropertyList[CommitmentComponentControls.campus].ShowValidationMessage = true;
    }
    if (!this.IsValidDDValue(this.type_Selected_COMMITTYPE_PK_ID)) {
      this.controlPropertyList[CommitmentComponentControls.type].ShowValidationMessage = true;
    }
    if (!this.IsValidDDValue(this.school_Selected_SCHOOL_PK_ID)) {
      this.controlPropertyList[CommitmentComponentControls.school].ShowValidationMessage = true;
    }
    if (!this.IsValidDDValue(this.dept_Selected_DEPT_PK_ID)) {
      this.controlPropertyList[CommitmentComponentControls.dept].ShowValidationMessage = true;
    }

    if (this.ShowNonInfoEdControls) {
      if (!this.IsValidDDValue(this.pi_Selected_PI_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.pi].ShowValidationMessage = true;
      }
    }

    if (this.ShowInfoEdControls) {
      if (!this.IsValidDDValue(this.infoEdID_Selected_PROP_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.infoEd].ShowValidationMessage = true;
      }
    }


    if (this.singleDueDate.value == null) {
      this.controlPropertyList[CommitmentComponentControls.date].ShowValidationMessage = true;
      this.controlPropertyList[CommitmentComponentControls.date].ValidationMessage = "Required, must be valid date"
    }
    if (!Helpers.IsValidInt(this.startingFY)) {
      this.controlPropertyList[CommitmentComponentControls.startFY].ShowValidationMessage = true;
      this.controlPropertyList[CommitmentComponentControls.startFY].ValidationMessage = "Required, must be valid year"
    }
    if (!Helpers.IsValidInt(this.numYears)) {
      this.controlPropertyList[CommitmentComponentControls.numYears].ShowValidationMessage = true;
      this.controlPropertyList[CommitmentComponentControls.numYears].ValidationMessage = "Required, must be a valid number"
    }
    if (!Helpers.IsValidMoney(this.commitmentMoney)) {
      this.controlPropertyList[CommitmentComponentControls.commitMoney].ShowValidationMessage = true;
      this.controlPropertyList[CommitmentComponentControls.commitMoney].ValidationMessage = "Required, must be valid curreny format"
    }
    if (!this.IsValidDDValue(this.status_Selected_PAYMENTSTATUS_PK_ID)) {
      this.controlPropertyList[CommitmentComponentControls.status].ShowValidationMessage = true;
    }
    if (this.commitmentName == null || this.commitmentName.length == 0) {
      this.controlPropertyList[CommitmentComponentControls.commitName].ShowValidationMessage = true;
    }

    if (this.ShowInfoEdControls) {
      if (!this.IsValidDDValue(this.comSchool_Selected_SCHOOL_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.comSchool].ShowValidationMessage = true;
      }
      if (!this.IsValidDDValue(this.comDept_Selected_DEPT_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.comDept].ShowValidationMessage = true;
      }
      if (!this.IsValidDDValue(this.comPI_Selected_PI_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.comPI].ShowValidationMessage = true;
      }
      if (!this.IsValidDDValue(this.comSponser_Selected_SPONSOR_PK_ID)) {
        this.controlPropertyList[CommitmentComponentControls.sponsor].ShowValidationMessage = true;
      }
    }

    ////console.log(//console.log(this.controlPropertyList.find(p => p.ShowValidationMessage) );
    let isError: boolean = false;
    for (let c in CommitmentComponentControls) {
      if (this.controlPropertyList[c].ShowValidationMessage) {
        isError = true;
        break;
      }
    }

    if (isError) {
      //alert("error");
    }
    else {
      commitment.CommitmentPK = this.commitPK;
      commitment.CampusPK = this.nullIFNegative(this.campus_Selected_CAMPUS_PK_ID);
      commitment.CommitTypePK = this.nullIFNegative(this.type_Selected_COMMITTYPE_PK_ID);
      commitment.CommitSchoolPK = this.nullIFNegative(this.school_Selected_SCHOOL_PK_ID);
      commitment.CommitDeptPK = this.nullIFNegative(this.dept_Selected_DEPT_PK_ID);
      commitment.CommitPiPK = this.nullIFNegative(this.pi_Selected_PI_PK_ID);
      commitment.InfoEdID = this.GetSelectedInfoEdCode();
      commitment.CommitDate = this.singleDueDate.value;
      commitment.FiscalYear = Number.parseInt(this.startingFY) == null ? null : this.startingFY;
      commitment.NoOfYears = Number.parseInt(this.numYears);
      commitment.TotalCommitment = Helpers.parseFloatSafe(this.commitmentMoney);
      commitment.CommitStatusPK = this.nullIFNegative(this.status_Selected_PAYMENTSTATUS_PK_ID);
      commitment.CommitmentDesc = this.commitmentName.substr(0, 255);
      commitment.Comment = this.commitmentDetail.substr(0, 256);
      commitment.CorrectedPropSchoolPK = this.nullIFNegative(this.comSchool_Selected_SCHOOL_PK_ID);
      commitment.CorrectedPropOrgnPK = this.nullIFNegative(this.comDept_Selected_DEPT_PK_ID);
      commitment.CorrectedPropPiPK = this.nullIFNegative(this.comPI_Selected_PI_PK_ID);
      commitment.CorrectedPropSponsorPK = this.nullIFNegative(this.comSponser_Selected_SPONSOR_PK_ID);

      ////console.log(commitment);

      let me = this;
      this.fileUpload.GetFiles().subscribe(p=> me.submitData_OnFilesReady(commitment, p));
     
    }
  }
  submitData_OnFilesReady(commitment: CommitmentChangeEnt, files:FileToUpload[] )
  {
    this.isInSaveMode = true;
    if (this.commitPK == null) {
      this.dataService.CreateCommitment(commitment,files).subscribe(p=> this.done(p));
      
    }
    else {
      this.dataService.UpdateCommitment(commitment,files).subscribe(p=> this.done(p));       
    }
  }
  done( result : Result<number>)
  {
    this.message ="";

    this.isInSaveMode = false;
    //console.log(result);
    //this.Events.emit
    if(result == null || result.IsError)
    {
      this.message = "Error saving";
      //if(result == null)
        //alert("error: http" )
     // else
       //alert("error: " +  result.Message);


       //alert(result.SQL);

       this.Events.emit(new CommitmentSubmit(false, result.ReturnData));
    }   
    else
    {    
      //alert(result.SQL);
       
      this.Events.emit(new CommitmentSubmit(true,result.ReturnData));     
    }    
  }
  cancel()
  {
    this.message ="";
    this.Events.emit(new CommitmentCancel());   
  }
 
  

  public IsValidDDValue(value: number): boolean {
    return value != null && value != -1;
  }

 


  public nullIFNegative(value: number): number {
    if (value == null || value < 0)
      return null;
    else
      return value
  }

  /*
  public cleanString(value: string): string {
    if (value == null)
      return null;
    else
      return value.trim();
  }
  */
  public GetSelectedInfoEdCode(): string {
    if (this.infoEdID_Selected_PROP_PK_ID == null || this.infoEdID_Selected_PROP_PK_ID == -1)
      return null;

    let find = this.infoEdData.Data.find(p => p.PROP_PK_ID == this.infoEdID_Selected_PROP_PK_ID);
    if (find == null)
      return null;
    else
      return find.PROPPROP_ProposalNumber;
  }

}

export class FunctionWrapper {
  public parentInstance: any;
  public func: any;
}

export class MyEventHandler {

  public mfunctions: FunctionWrapper[] = [];

  public Subscribe(func: any, parentInstance: any) {
    let w = new FunctionWrapper();
    w.func = func;
    w.parentInstance = parentInstance;

    this.mfunctions.push(w);
  }

  public NotifyAll(eventName: string) {
    for (let f in this.mfunctions) {
      let fWrapper = this.mfunctions[f];
      fWrapper.func.call(fWrapper.parentInstance, eventName);
    }
  }
}

export class InfoEdSearchHelper {
  schoolID: number = null;
  deptID: number = null;
  searchProposal: string = null;
  argsSig: string = null;

  public static InitInfoEdSearchHelper(selected_campusID: number, selected_schoolID: number, selected_deptID: number, selected_searchProposal: string): InfoEdSearchHelper {
    let ent = new InfoEdSearchHelper();

    if (selected_schoolID == -1)
      ent.schoolID = null;
    else
      ent.schoolID = selected_schoolID;

    if (selected_deptID == -1)
      ent.deptID = null;
    else
      ent.deptID = selected_deptID;

    if (selected_searchProposal == null || selected_searchProposal == "")
      ent.searchProposal = "*";
    else
      ent.searchProposal = selected_searchProposal;

    ent.argsSig = selected_campusID + "," + ent.schoolID + ", " + ent.deptID + ", " + ent.searchProposal;

    return ent;
  }

}



