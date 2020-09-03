import { Component, OnInit,Input } from '@angular/core';

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
  //CommitmentResult
} from '../../DropDown/DataDeclares';



@Component({
  selector: 'app-commitment-summary',
  templateUrl: './commitment-summary.component.html',
  styleUrls: ['./commitment-summary.component.css']
})
export class CommitmentSummaryComponent implements OnInit {

  @Input() selectedProposal: usp_16a_GetProposalDetailByPropNo_Ent;   

  constructor() { 
    //this.selectedProposal = new usp_16a_GetProposalDetailByPropNo_Ent();

  }

  ngOnInit() {
  }

}
