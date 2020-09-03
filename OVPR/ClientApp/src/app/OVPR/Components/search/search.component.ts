import { Component, OnInit,EventEmitter } from '@angular/core';

import { DropDownService } from '../../DropDown/drop-down.service';
import { OVPRService } from '../../DropDown/ovpr.service';

import{Helpers} from '../../Helpers';

import {
  
  CommitmentsSearchArg,
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
  CommitmentsSearchResultEnt,
  CommitmentsSearchReturnEnt
} from '../../DropDown/DataDeclares';
import { forkJoin } from 'rxjs';
import { Key, utils } from 'protractor';


export class SearchComponent_Event
{

}
export class SearchComitmentSelected  extends SearchComponent_Event 
{
  public resultEnt: CommitmentsSearchResultEnt;

  constructor(resultEnt: CommitmentsSearchResultEnt) 
  {
    super();

    this.resultEnt = resultEnt;
  }
}



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  campusEnts: usp_05_Campus_GetCampus_Ent[] = [];
  typeEnts: usp_07_CommittmentType_GetTypesEnt[] = [];
  statusEnts: usp_06_CommittmentStatus_GetStatusEnt[] = [];

  schoolEnts: usp_05a_School_GetSchoolByCampusEnt[] =[];


  displayedColumns = ['Commitment_PK', 'PI','School','Campus','CommitmentDesc','Project','CommitmentType'
  ,'CommitmentStatus','InfoEdStatus','ProjectTitle','CommitDate','StartingFY','NumberOfYears','TotalCommitment','Paid','NotFunded','OutstandingBalance'];
  resultEnts: CommitmentsSearchResultEnt[] = [];

  CommitmentIDSearch : string = "";

  campusValue: string= "";
  typeValue: string = "";
  statusValue: string= "";

  searchPIString : string= "";
  piData : GetPIsEnt = new GetPIsEnt();
  piValue: string= "";
  schoolValue : string= "";
  descriptionValue : string= "";
  totalCommitmentValue: string= "";
  projectTitleValue: string= "";
  transactionNumberValue: string= "";
  detailValue: string= "";

  pageNumber: number;
  pageSize: number;
  totalPages: number;


  sortBy_Property: string;
  sortBy_PropertyType: string;
  sortBy_IsAsc: boolean; 

  showLoadAnimation :boolean = true;
  public Events = new EventEmitter<SearchComponent_Event>(); 

  constructor(private ddService: DropDownService, private dataService: OVPRService) {
    this.pageNumber = 1;
    this.pageSize = 30;
  }
  ngOnInit() {
   

     
   


    let me = this;
    Promise.all([
      new Promise(function (resolve, reject) { me.ddService.GetCampus().subscribe(p => { me.campusLoaded(p.ReturnData); resolve(p) }); }),
      new Promise(function (resolve, reject) { me.ddService.GetTypes().subscribe(p => { me.typeEnts = p.ReturnData; resolve(p) }); }),
      new Promise(function (resolve, reject) { me.ddService.GetCommittmentStatus().subscribe(p => { me.committmentStatusLoaded(p.ReturnData); resolve(p) }); }),
      new Promise(function (resolve, reject) { me.ddService.GetPIs(null,null,null,null,null,).subscribe(p => { me.piSLoaded(p.ReturnData); resolve(p) }); }),
      new Promise(function (resolve, reject) { me.ddService.GetSchoolByCampus(null).subscribe(p => { me.schoolsLoaded(p.ReturnData); resolve(p) }); }),
     
    ]).then(value => me.resetSearch());     

  }
  campusLoaded(campusEnts: usp_05_Campus_GetCampus_Ent[]) {
    this.campusEnts = campusEnts;
    if (this.campusEnts.length > 0)
      this.campusValue = this.campusEnts[0].CAMPUS_PK_ID.toString();

  }
  committmentStatusLoaded(statusEnts: usp_06_CommittmentStatus_GetStatusEnt[]) {
    this.statusEnts = statusEnts;    
  }
  piSLoaded(piData : GetPIsEnt)
  {
    //console.log(piData);
    this.piValue ="";
    this.piData = piData;
  }
  searchPI(value :string)
  {
    this.ddService.GetPIs(null,null,null,value,null,).subscribe(p => { this.piSLoaded(p.ReturnData)});
  }
  schoolsLoaded(schoolEnts: usp_05a_School_GetSchoolByCampusEnt[]) {
    this.schoolEnts = schoolEnts;    
  }

  //GetPIsEnt
  resetSearch() {   
    this.pageNumber =1;
    this.loadData();
  }

  loadData()
  {
    this.showLoadAnimation = true;
    this.resultEnts = []; 

    if (this.sortBy_Property == null) {
      this.sortBy_Property = "Commitment_PK";     
      this.sortBy_IsAsc = true;    
    }    

    let arg = new CommitmentsSearchArg();
    arg.pageIndex = this.pageNumber - 1;
    arg.pageSize =  this.pageSize;
    arg.sortBy_Property = this.sortBy_Property;
    arg.sortBy_IsAsc = this.sortBy_IsAsc;


    //arg.CommitmentID
    arg.CampusID = Number.parseInt(this.campusValue)
    arg.CommTypeID = Number.parseInt(this.typeValue)
    arg.CommStatusID =  Number.parseInt(this.statusValue)
    arg.PiID = Number.parseInt(this.piValue);
    //console.log( arg.PiID );
    arg.SchoolID = Number.parseInt(this.schoolValue);

    let cleanDescriptionValue = Helpers.CleanString(this.descriptionValue);
    arg.Description = cleanDescriptionValue == "" ? null : cleanDescriptionValue;   

    let parseTotalCommitmentValue =  Number.parseFloat(this.totalCommitmentValue);
    arg.TotalCommitment = parseTotalCommitmentValue == Number.NaN ? null : parseTotalCommitmentValue;
    
    let cleanProjectTitle =  Helpers.CleanString(this.projectTitleValue);
    arg.ProjectTitle = cleanProjectTitle == "" ? null : cleanProjectTitle;

    let cleanTransactionNumberValue =  Helpers.CleanString(this.transactionNumberValue);
    arg.TransactionNumber =  cleanTransactionNumberValue == "" ? null : cleanTransactionNumberValue;  

    let cleanDetailValue =  Helpers.CleanString(this.detailValue);
    arg.Comment =  cleanDetailValue == "" ? null : cleanDetailValue;  

    this.dataService.Search(arg).subscribe(p => this.searchLoaded(p.ReturnData));
  }
  IDSearch()
  {
    if(Helpers.IsValidInt(this.CommitmentIDSearch))
    {
      this.pageNumber = 1;  

      let arg = new CommitmentsSearchArg();
      arg.pageIndex = 0;
      arg.pageSize =  this.pageSize;
      arg.sortBy_Property = this.sortBy_Property;
      arg.sortBy_IsAsc = this.sortBy_IsAsc;
      
      arg.CommitmentID =Number.parseInt(this.CommitmentIDSearch);    

      this.showLoadAnimation = true;
      this.dataService.Search(arg).subscribe(p => this.searchLoaded(p.ReturnData));
    }
    else
    {
      this.resultEnts = []; 
    }
   
  }

  searchLoaded(searchResult: CommitmentsSearchReturnEnt) {    

    this.showLoadAnimation  = false;
    this.totalPages = searchResult.totalPages;
    this.resultEnts =  searchResult.result;   
     
  }
  
  sortIcon(property: string) {
    if (this.sortBy_Property == property) {
      if (this.sortBy_IsAsc != null)
        return this.sortBy_IsAsc ? "(+)" : "(-)";
      else
        return "";
    }
    else
      return "";
  }

  
  sort(property: string, propertyType:string) {
    if (property == this.sortBy_Property) {
      this.sortBy_IsAsc = !this.sortBy_IsAsc;
      this.sortBy_PropertyType = propertyType;
    }
    else {
      this.sortBy_Property = property;
      this.sortBy_IsAsc = true;
      this.sortBy_PropertyType = propertyType;
    }

   
    this.loadData();
  }

  changePage() {

    if (Number.isNaN(this.pageNumber)) {
      this.pageNumber = 1;
    }

    if (this.pageNumber < 1)
      this.pageNumber = 1;

    if (this.pageNumber > this.totalPages)
      this.pageNumber = this.totalPages;

      this.loadData();
  }

  changePageIndex(prev: boolean) {
    if (prev)
      this.pageNumber--;
    else
      this.pageNumber++;

    this.changePage();
  }




  select(ent)
  {
    //alert("select")
    //console.log(ent);

    this.Events.emit(new SearchComitmentSelected(ent));
  }
}

