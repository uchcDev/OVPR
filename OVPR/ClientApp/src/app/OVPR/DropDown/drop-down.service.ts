import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
GetSponsorsEnt,
GetPIsEnt,
GetProposalsEnt,
Result
} from './DataDeclares';

import {Helpers} from '../Helpers';


@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  constructor() { }

  GetCampus() : Observable<Result<usp_05_Campus_GetCampus_Ent[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetCampus';          
      return Helpers.HttpClientGet<usp_05_Campus_GetCampus_Ent[]>(fullUrl);
  }     

  GetSchoolByCampus(CampusPK :number) : Observable<Result<usp_05a_School_GetSchoolByCampusEnt[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetSchoolByCampus'; 
      return Helpers.HttpClientGet<usp_05a_School_GetSchoolByCampusEnt[]>(fullUrl,CampusPK);
  }

  GetCommittmentStatus() : Observable<Result<usp_06_CommittmentStatus_GetStatusEnt[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetCommittmentStatus';    
      return Helpers.HttpClientGet<usp_06_CommittmentStatus_GetStatusEnt[]>(fullUrl);
  }

  GetTypes() : Observable<Result<usp_07_CommittmentType_GetTypesEnt[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetTypes';  
      return Helpers.HttpClientGet<usp_07_CommittmentType_GetTypesEnt[]>(fullUrl);
  }

  GetStatuses() : Observable<Result<usp_08_PaymentStatus_GetStatusesEnt[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetStatuses'; 
      return Helpers.HttpClientGet<usp_08_PaymentStatus_GetStatusesEnt[]>(fullUrl);
  }

  GetDeptsByCampusSchool(CampusPK : number,  SchoolPK :number, ensureExists_DeptPK: number) : Observable<Result<usp_10_Department_GetDeptsByCampusSchoolEnt[]>>
  {
      let fullUrl = 'OVPR_API/DropDown/GetDeptsByCampusSchool';  
      return Helpers.HttpClientGet<usp_10_Department_GetDeptsByCampusSchoolEnt[]>(fullUrl,CampusPK,SchoolPK,ensureExists_DeptPK);
  }

  GetSponsorsByCampus(CampusPK : number, SponsorNameSearch : string, EnsureExists_SponserPK :number) : Observable<Result<GetSponsorsEnt>>
  {
    if(SponsorNameSearch == null || SponsorNameSearch == ""  )
    {
        SponsorNameSearch = "*";
    }

      let fullUrl = 'OVPR_API/DropDown/GetSponsorsByCampus';    
      return Helpers.HttpClientGet<GetSponsorsEnt>(fullUrl,CampusPK,SponsorNameSearch,EnsureExists_SponserPK);
  }

  GetProposals(CampusPK: number, SchoolPK: number, DeptPK: number, proposalNumberSearch: string, ensureExists_ProposalNumber: string) : Observable<Result<GetProposalsEnt>>
  {  
    if(ensureExists_ProposalNumber == null || ensureExists_ProposalNumber == ""  )
    {
        ensureExists_ProposalNumber = "*";
    }
     
    let fullUrl = 'OVPR_API/DropDown/GetProposals';  
    return Helpers.HttpClientGet<GetProposalsEnt>(fullUrl,CampusPK,SchoolPK,DeptPK,proposalNumberSearch,ensureExists_ProposalNumber);
  }  

  GetPIs(CampusPK : number, SchoolPK: number, DeptPK: number, ProposalNumberSearch: string, EnsureExists_ProposalNumber: number) : Observable<Result<GetPIsEnt>>
  {
    if(ProposalNumberSearch == null || ProposalNumberSearch == ""  )
    {
        ProposalNumberSearch = "*";
    }

    let fullUrl ='OVPR_API/DropDown/GetPIsByLastName';
    return Helpers.HttpClientGet<GetPIsEnt>(fullUrl,CampusPK,SchoolPK,DeptPK,ProposalNumberSearch,EnsureExists_ProposalNumber);
  }
  
}
