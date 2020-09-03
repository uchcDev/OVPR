import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Helpers } from '../Helpers';

import {
  CommitmentsSearchReturnEnt,
  usp_16a_GetProposalDetailByPropNo_Ent,
  CommitmentChangeEnt,
  UpdateCommitmentArg,
  CommitmentEnt,
  CommitmentsSearchArg,
  //CommitmentResult,
  //CommitmentsSearchResultEnt,
  FileToUpload,
  //UploadArgs,
  DocumentEnt,
  Result

} from './DataDeclares';

@Injectable({
  providedIn: 'root'
})
export class OVPRService {


  constructor(private httpClient: HttpClient) { }

  GetProposalDetailByPropNo(proposalNum: string): Observable<Result<usp_16a_GetProposalDetailByPropNo_Ent>> {
    let fullUrl = 'OVPR_API/OVPR/GetProposalDetailByPropNo';
    return Helpers.HttpClientGet<usp_16a_GetProposalDetailByPropNo_Ent>(fullUrl, proposalNum);
  }
 

  CreateCommitment(ent: CommitmentChangeEnt, files: FileToUpload[]): Observable<Result<number>> {
    let updateCommitmentEnt = new UpdateCommitmentArg();
    updateCommitmentEnt.CommitmentChangeEnt = ent;
    updateCommitmentEnt.Files = files;

    let fullUrl = 'OVPR_API/OVPR/CreateCommitment';
    return Helpers.HttpClientPost<number>(fullUrl, updateCommitmentEnt);
  }

  UpdateCommitment(ent: CommitmentChangeEnt, files: FileToUpload[]): Observable<Result<number>> {
    let updateCommitmentEnt = new UpdateCommitmentArg();
    updateCommitmentEnt.CommitmentChangeEnt = ent;
    updateCommitmentEnt.Files = files;



    let fullUrl = 'OVPR_API/OVPR/UpdateCommitment';
    //console.log(fullUrl);
    //console.log(updateCommitmentEnt);
    return Helpers.HttpClientPost<number>(fullUrl, updateCommitmentEnt);
  }


  GetCommitment(Commitment_PK: number): Observable<Result<CommitmentEnt>> {
    let fullUrl = 'OVPR_API/OVPR/GetCommitment';
    return Helpers.HttpClientGet<CommitmentEnt>(fullUrl, Commitment_PK);
  }
  GetCommitmentStatus(Commitment_PK: number): Observable<Result<string>> {
    let fullUrl = 'OVPR_API/OVPR/GetCommitmentStatus';
    return Helpers.HttpClientGet<string>(fullUrl, Commitment_PK);
  }

  /*
  GetAllCommitments() : Observable<demo_GetAllCommitmentsEnt[]>
  {   
    let fullUrl = 'OVPR_API/OVPR/GetAllCommitments';     
    return this.httpClient.get<demo_GetAllCommitmentsEnt[]>(fullUrl);     
  }
  */
  //CommitmentsSearchResultEnt
  Search(arg : CommitmentsSearchArg): Observable<Result<CommitmentsSearchReturnEnt>> {
    let fullUrl = 'OVPR_API/OVPR/Search';
    return Helpers.HttpClientPost<CommitmentsSearchReturnEnt>(fullUrl, arg);
  }

  GetDocuments(Commitment_PK: number): Observable<Result<DocumentEnt[]>> {
    let fullUrl = 'OVPR_API/OVPR/GetDocuments';
    return Helpers.HttpClientGet<DocumentEnt[]>(fullUrl, Commitment_PK);
  }


  public GetFile(docID: number): Observable<Blob> {

    let url = "OVPR_API/OVPR/GetFile";
    url += "/" + docID;

    return this.httpClient.get(url, { responseType: 'blob' });

  }

}



