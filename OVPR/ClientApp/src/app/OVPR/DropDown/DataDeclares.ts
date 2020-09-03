
export class Result<T>
{
    ReturnData :T;
    IsError :boolean;
    Message: string;   
    SQL: string;  
    
    IsConnectionError :boolean;

}


export class usp_05_Campus_GetCampus_Ent
{
    CAMPUS_PK_ID : number;
    CAMPUS_Name : string;   
}
export class usp_05a_School_GetSchoolByCampusEnt
{
    CAMPUS_PK_ID : number;
    CAMPUS_Name : string;
    SCHOOL_PK_ID : number;
    SCHOOL_Code : string;
    SCHOOL_Name : string;     
}
export class usp_06_CommittmentStatus_GetStatusEnt
{
    COMMITSTATUS_PK_ID : number;
    COMMITSTATUS_Description : string;   
}
export class usp_07_CommittmentType_GetTypesEnt
{
    COMMITTYPE_PK_ID : number;
    COMMITTYPE_FK_COMMITTYPE_Parent : string;
    COMMITTYPE_Description : string;
    Level1_Desc : string;   
}
export class usp_08_PaymentStatus_GetStatusesEnt
{
    PAYMENTSTATUS_PK_ID : string;
    PAYMENTSTATUS_Description : string;   
}
export class usp_10_Department_GetDeptsByCampusSchoolEnt
{
    CAMPUS_PK_ID : string;
    CAMPUS_Name : string;
    SCHOOL_PK_ID : string;
    SCHOOL_Code : string;
    SCHOOL_Name : string;
    DEPT_PK_ID : number;
    DEPT_Code : string;
    DEPT_Name : string;    
}
export class usp_11_Sponsor_GetSponsorsByCampusEnt
{
    CAMPUS_PK_ID : string;
    CAMPUS_Name : string;
    SPONSOR_PK_ID : number;
    SPONSOR_Code : string;
    SPONSOR_CrossCampusSponsorID : string;
    SPONSOR_Name : string;
}

export class GetSponsorsEnt
{
    WasDataTruncated : boolean;
    Data : usp_11_Sponsor_GetSponsorsByCampusEnt[];
}






export class usp_16_GetProposalsByCampusEnt
{
    CAMPUS_PK_ID : string;
    CAMPUS_Name : string;
    PROP_PK_ID : number;
    PROPPROP_InfoEdSurrogateKey : string;
    PROPPROP_ProposalNumber : string;
}

export class GetProposalsEnt
{
    WasDataTruncated : boolean;
    Data : usp_16_GetProposalsByCampusEnt[];
}


     

export class GetPIsEnt
{
    WasDataTruncated : boolean;
    Data : usp_17_GetPIsByCampusEnt[];
}

export class usp_17_GetPIsByCampusEnt
{
    CAMPUS_PK_ID : string;
    CAMPUS_Name : string;
    SCHOOL_PK_ID : number;
    SCHOOL_Code : string;
    SCHOOL_Name : string;
    DEPT_PK_ID : number;
    DEPT_Code : string;
    DEPT_Name : string;   


    PI_PK_ID : number;
    PI_Code : string;
    PI_LastName : string;
    PI_Firstname : string;
    PI_MI : string;

    PI_DisplayName : string;
}
 


export class usp_16a_GetProposalDetailByPropNo_Ent
{
    PROP_PK_ID : string;
    InfoEdSurrogateKey : string;
    ProposalNumber : string;
    Title : string;
    PROP_Type : string;
    PROP_Status : string;
    ProcessDat : string;
    ProjectStartDate : string;
    ProjectEndDate : string;
    RequestedStartDate : string;
    RequestedEndDate : string;
    OriginalDeptCode : string;
    OriginalDeptName : string;
    OriginalSponsorCode : string;
    OriginalSponsorName : string;
    OriginalPiCode : string;
    OriginalPiName : string;
    CorrectedDeptPK : number;
    CorrectedDeptCode : string;
    CorrectedDeptName : string;
    CorrectedDeptSchoolPK : number;
    CorrectedDeptSchoolCode : string;
    CorrectDeptSchoolName : string;
    CorrectDeptCampusPK : string;
    CorrectedDeptCampusName : string;
    CorrectedSponsorPK : number;
    CorrectedSponsorCode : string;
    CorrectedSponsorName : string;
    CorrectedPiPK: number;
    CorrectedPiName : string;
}

export class CommitmentChangeEnt
{
    CommitmentPK : number;

    CampusPK : number;
    CommitTypePK : number;
    CommitSchoolPK : number;
    CommitDeptPK : number;
    CommitPiPK : number;
    InfoEdID : string
    CommitDate : Date
    FiscalYear : string
    NoOfYears : number;
    TotalCommitment : number;
    CommitStatusPK : number;
    Comment : string
    CommitmentDesc: string
    CorrectedPropSchoolPK : number;
    CorrectedPropOrgnPK : number;
    CorrectedPropPiPK : number;
    CorrectedPropSponsorPK : number;
}

export class UpdateCommitmentArg
{
   
    CommitmentChangeEnt : CommitmentChangeEnt
    Files : FileToUpload[];
    
}

export class CommitmentEnt
{
    Commitment_PK : number;

    Campus_PK : number;
    Campus :string;

    COMMITTYPE_PK : number;
    CommitmentType :string;

    School_PK : number;
    School :string;

    Dept_PK : number;
    Dept :string;

    PI_PK : number;
    PI :string;

    Project :string; //infoed num/
    InfoEdStatus :string;

    CommitDate :Date;
    StartingFY : number;
    NumberOfYears : number;
    TotalCommitment : number;
    CommitmentStatus :string;

    ProjectTitle :string;
    Comment :string;
    CommitmentDesc :string;

    CorrectedDept_PK : number;
    CorrectedPI_PK : number;
    CorrectedSponsor_PK : number;

    COMMITTYPE_PARENT_PK;
    CommitmentParent :string;
    FullCommitmentType :string;

    CommitmentDate :Date;

}

export class demo_GetAllCommitmentsEnt
{
        Commitment_PK :string;
        CommitmentDesc  :string;
        PI :string;
        Campus :string;
        School :string;
        Dept :string;
        Project :string;
        CommitmentType :string;
        CommitmentStatus :string;
        CommitDate :string;
        InfoEdStatus :string;
        ProjectTitle :string;
        CommitmentDate :string;
        StartingFY :string;
        NumberOfYears :string;
        TotalCommitment :string;
        Paid :string;
        NotFunded :string;
        OutstandingBalance :string;

}
 


export class PaymentEnt
{
    PaymentPK: number;
    CommitmentNumber : number;

    //all
    PayStatusDesc: string;
    FY: string;   
    PaymentNo: number;        
    PaymentComment: string;      

    //pending
    DueDate: Date;  
    AmountDue: string;  

    //completed
    DatePaid: Date;  
    TransactionNumber: string;  
    FromAccount: string;  
    ToAccount: string;   
    AmountPaid: string;  

    //notFunded
    AmountNotFunded: string;   
    NotFundedReason: string;   

    PayStatHist_PK: number;
    CurrentStatus: string;
    Comment: string;    

    
}

export class PaymentChangeEnt
{
    Payment_PK : number;
    Commitment_PK : number;
    FY : string;
    PaymentNumber : number;
    DueDate : Date;
    PayStatus : string;
    PayComment : string;
    Amount : string;
    TransNumber : string;
    PaymentDate : Date;
    AcctFrom : string;
    AcctTo : string;
    Reason : string;
}

export class CommitmentsSearchArg
{
    sortBy_Property :string;
    sortBy_IsAsc :boolean;
    pageIndex: number;
    pageSize: number;

    CommitmentID : number;
    CampusID : number;
    CommTypeID : number;
    CommStatusID : number;

    PiID : number;
    SchoolID : number;
    Description :string;
    TotalCommitment: number;
    ProjectTitle:string;
    TransactionNumber:string;
    Comment:string;
}


export class CommitmentsSearchResultEnt
{
    Commitment_PK : number;
    CommitmentDesc : string;
    PI : string;
    Campus : string;
    School : string;
    Dept : string;
    Project : string;
    CommitmentType : string;
    CommitmentStatus : string;
    InfoEdStatus : string;
    ProjectTitle : string;
    CommitDate : Date;
    StartingFY : number;
    NumberOfYears : number;
    TotalCommitment : string;
    Paid : number;
    NotFunded : number;
    OutstandingBalance : number;
}

export class CommitmentsSearchReturnEnt
{
    totalRows : number;
    totalPages : number;
    result : CommitmentsSearchResultEnt[];
}
 
export class FileToUpload
{
    public DocumentPK :number;
    public  FileName : string;
    public  FileSize : number;
    public  FileType : string; 
    public  FileAsBase64 : string;

    public constructor(documentPK :number, file:File, fileAsBase64 :string)
    {
        this.DocumentPK = documentPK;

        if(file != null)
        {
            this.FileName = file.name;
            this.FileSize = file.size;
            this.FileType = file.type;
            this.FileAsBase64 = fileAsBase64;       
        }
    }
    
}

export class DocumentEnt
{
    public constructor(){}
    public  COMMIT_PK : number;
    public  CommitmentDesc : string;
    public  Document_PK : number;
    public  DocumentFileName : string;
    
}



export class UserEnt
{
    public  USER_PK_ID : number = null;
    public  USER_EmailAddress : string = null;
    public  USER_Password : number = null;
    public  USER_LastName : string = null;
    public  USER_FirstName : string = null;
    public  USER_MI : string = null;
    public  ROLE_PK_ID : number = null;
    public  ROLE_Name : string = null;
    public  USER_IsActive : boolean = null;
   
}

export class RolesEnt
{
    public  ROLE_PK_ID : number;
    public  ROLE_Name : string;
}

export class TypeEnt
{
    public  COMMITTYPE_PK_ID : number= null;
    public  COMMITTYPE_Description : string= null;
}

export class TypeLevel2Ent
{
    public  Level1_PK : number= null;
    public  CommitType_PK : number= null;
    public  Description : string= null;
    public  DeleteFlag : boolean= null;
}


 
