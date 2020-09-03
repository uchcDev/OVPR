import { Component, OnInit, ViewChild, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


import { WinComponent, Windows_CloseClicked, Windows_Event, Windows_Drag } from '../../Components/Utils/win/win/win.component';


import { CommitmentComponent, CommitmentComponent_Event, CommitmentProposalChange, CommitmentSubmit, CommitmentCancel, CommitmentStatusChange } from '../../Components/commitment/commitment.component';

import { CommitmentSummaryComponent } from '../../Components/commitment-summary/commitment-summary.component'

import { PaymentsComponent } from '../../Components/payments/payments.component';

import { SearchComponent, SearchComponent_Event, SearchComitmentSelected,  } from '../../Components/search/search.component';

import {UserComponent} from '../../Components/user/user.component';

import {TypeComponent} from '../../Components/type/type.component';

import {TestComponent} from '../../Components/test/test.component';

import {TreeNode,TreeBuilder} from '../../Components/Utils/win/WinTree';

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
  // CommitmentResult
} from '../../DropDown/DataDeclares';
import { MatTreeNestedDataSource } from '@angular/material/tree';
//import { eraseStyles } from '@angular/animations/browser/src/util';


export class TopMenuEnt {
  public ID: String;
  public Text: String;

  public constructor(id: String, text: String) {

    

    this.ID = id;
    this.Text = text;
  }
}

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {

  topMenu: TopMenuEnt[] = [];
  @ViewChild('windows', { static: true, read :  WinComponent}) windows: WinComponent;

  numberTest: number;

  currentWorkSpace : WorkSpace;
  currentThread : Thread;

  standardTreeView: boolean;
  constructor(private resolver: ComponentFactoryResolver) {
    this.topMenu.push(new TopMenuEnt("addCommitments", "Add Commitments"));
    this.topMenu.push(new TopMenuEnt("manageCommitments", "Manage Commitments"));  
    this.topMenu.push(new TopMenuEnt("appMaintenance", "App Maintenance"));   

  }

  ngOnInit() { 

   

    this.standardTreeView =true;
    this.windows.InitView(TreeBuilder.BuildStandardTree(this.windows)); 

    let me = this;
    this.windows.Events.subscribe(function(e : Windows_Event){ me.onWindowsEvent(e)});
  }

  logOut()
  {    
    let loginPage = window.location.origin + '/Account/Login?ReturnUrl=%2F&message=userClickedLogOut';
    window.location.replace(loginPage);    
  }

  public GetCountdownDisplay() :string
  {

    return  Helpers.GetCountdownDisplay();
  }

  dropa(event: CdkDragDrop<string[]>) {
    //console.log("a");
  }
  
  public onWindowsEvent(e: Windows_Event) {
    if (e instanceof Windows_Drag) {
      this.onWindowsEvent_Drag((e as Windows_Drag));      
    }
    else if (e instanceof Windows_CloseClicked) {
      this.onWindowsEvent_CloseClicked((e as Windows_CloseClicked));      
    }
    
  }
  public onWindowsEvent_Drag(e: Windows_Drag) {
    if(this.currentWorkSpace!= null)
    {
      this.currentWorkSpace = null;
      this.windows.ClearAll();
    }
   
    this.currentThread = null;

    if (e instanceof Windows_Drag) {
      if ((e as Windows_Drag).dataDragged == "add") {
       let addThread =  new Add_Thread(this, this.resolver, this.windows, e.node);
       this.currentThread = addThread;
       addThread.OnInit();        
      }
      else if ((e as Windows_Drag).dataDragged == "edit") {
        let editThread =  new Edit_Thread( this.resolver, this.windows, e.node);
        this.currentThread = editThread;
        editThread.OnInit();    

      }
     
      else if ((e as Windows_Drag).dataDragged == "users") {
        let usersThread =  new MaintainUsers_Thread( this.resolver, this.windows, e.node);
        this.currentThread = usersThread;
        usersThread.OnInit();
      }
      else if ((e as Windows_Drag).dataDragged == "types") {
        let typesThread =  new MaintainTypes_Thread( this.resolver, this.windows, e.node);
        this.currentThread = typesThread;
        typesThread.OnInit();
      }     

    }
  }
  public onWindowsEvent_CloseClicked(e: Windows_CloseClicked) {
    this.windows.Clear(e.node);
  }

 

  topClick(item: TopMenuEnt) {     

    let standardTreeView = true;
    if (item.ID == "manageCommitments") {
        standardTreeView = false;
    }

    if(this.standardTreeView !=standardTreeView)
    {
      if(standardTreeView)
        this.windows.InitView(TreeBuilder.BuildStandardTree(this.windows)); 
      else
        this.windows.InitView(TreeBuilder.BuildLargeTopTree(this.windows)); 

        this.standardTreeView =standardTreeView;

        let me = this;
        setTimeout(function(){   me.loadWorkspace(item) }, 1);
    }
    else
    {
      this.loadWorkspace(item);
    }
     
  }
  public loadWorkspace(item: TopMenuEnt)
  {
    //console.log(item.Text);

    this.windows.ClearAll();

    //console.log("ClearAll()");
    this.currentWorkSpace = null;
    if (item.ID == "addCommitments") {     
      this.currentWorkSpace = new AddCommitmentWorkSpace(this, this.resolver, this.windows);
    }
    else if (item.ID == "manageCommitments") {    
    
      this.currentWorkSpace =  new ManageCommitmentWorkSpace(this.resolver, this.windows);
    }  
    else if (item.ID == "appMaintenance") {
      
      this.currentWorkSpace =  new AppMaintenanceWorkSpace(this.resolver, this.windows);
    }

    if(this.currentWorkSpace!= null)
      this.currentWorkSpace.OnInit();
  }

   
  public CommitmentCreated(commitmentID :number)
  {
    
    if(this.currentThread instanceof Add_Thread)
    {
      let addThread = ( this.currentThread as Add_Thread);

      let editThread =  new Edit_Thread( this.resolver, this.windows, addThread.node);
      this.currentThread = editThread;
      editThread.loadSelectedCommitmentView(commitmentID);
    }
    else if (this.currentWorkSpace instanceof AddCommitmentWorkSpace)
    {
       this.currentWorkSpace = null;
        this.windows.ClearAll();

        let manageCommitmentWorkSpace = new ManageCommitmentWorkSpace(this.resolver, this.windows);
        this.currentWorkSpace =  manageCommitmentWorkSpace;
        manageCommitmentWorkSpace.loadSelectedCommitmentView(commitmentID);

    }
   
  }


}

export class Thread {

}

export class MaintainUsers_Thread  extends Thread {

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  node : TreeNode; 

  constructor(resolver: ComponentFactoryResolver, windows: WinComponent, node: TreeNode) {

    super();
  
    this.resolver = resolver;
    this.windows = windows;
    this.node = node;
  }

  public OnInit() {
    this.windows.Clear(this.node);

    const factory = this.resolver.resolveComponentFactory(UserComponent);
    this.node.NodeDisplayName = "Maintain Users";
     this.windows.AddComponent(factory, this.node);   
  }
}

export class MaintainTypes_Thread  extends Thread {

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  node : TreeNode; 

  constructor(resolver: ComponentFactoryResolver, windows: WinComponent, node: TreeNode) {

    super();
  
    this.resolver = resolver;
    this.windows = windows;
    this.node = node;
  }

  public OnInit() {
    this.windows.Clear(this.node);

    const factory = this.resolver.resolveComponentFactory(TypeComponent);
    this.node.NodeDisplayName = "Maintain Types";
    this.windows.AddComponent(factory, this.node);   
  }
}
 
export class Edit_Thread  extends Thread {

  splashScreenComponent :SplashScreenComponent;
  searchComponent: SearchComponent;
  commitmentComponent: CommitmentComponent;
  paymentsComponent: PaymentsComponent;

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  
  node : TreeNode;



  comitmentPK : number;

  constructor(resolver: ComponentFactoryResolver, windows: WinComponent, node: TreeNode) {

    super();
  
    this.resolver = resolver;
    this.windows = windows;
    this.node = node;
  }

  public OnInit() {
    this.Load_SearchView();
  }

  Load_SearchView()
  {
    this.windows.Clear(this.node);

    const searchComponentFactory = this.resolver.resolveComponentFactory(SearchComponent);
    this.node.NodeDisplayName = "Edit";
    let searchComponentRef = this.windows.AddComponent(searchComponentFactory, this.node);
    this.searchComponent = searchComponentRef.instance;
    let me = this;
    this.searchComponent.Events.subscribe(function (e: SearchComponent_Event) { me.onSearchComponentEvent(e) });
  }
  public onSearchComponentEvent(e: SearchComponent_Event) {

    if (e instanceof SearchComitmentSelected) {    

      let comitmentPK = (e as SearchComitmentSelected).resultEnt.Commitment_PK;
      this.loadSelectedCommitmentView(comitmentPK)  
    }
  }

  public loadSelectedCommitmentView(comitmentPK:number)
  {
     this.comitmentPK =comitmentPK;

      this.windows.Clear(this.node);
      this.node.NodeDisplayName = "Edit";
      const commitmentFactory = this.resolver.resolveComponentFactory(CommitmentComponent);
      let commitmentComponentRef = this.windows.AddComponent(commitmentFactory,this.node);
      this.commitmentComponent = commitmentComponentRef.instance;
      
      let me = this;
      this.commitmentComponent.Events.subscribe(function (e: CommitmentComponent_Event) { me.onCommitmentComponentEvent(e) });

      this.commitmentComponent.InitControl(this.comitmentPK, true);


      const paymentsComponentFactory = this.resolver.resolveComponentFactory(PaymentsComponent);
      let paymentsComponentRef = this.windows.AddComponent(paymentsComponentFactory, this.node);
      this.paymentsComponent = paymentsComponentRef.instance;
  
      this.paymentsComponent.InitControl(this.comitmentPK);
  }

  public onCommitmentComponentEvent(e: CommitmentComponent_Event) {
    
    if (e instanceof CommitmentSubmit) {
      if(e.success)
       {
          let commitmentSubmit = e as CommitmentSubmit;
          this.splashScreenComponent.CommitmentCreated(commitmentSubmit.commitmentID);
               }

    }
    else if (e instanceof CommitmentCancel) {
      //alert("cancel");
      this.OnInit();
    }
    else if (e instanceof CommitmentStatusChange)
    {
      let commitmentStatusChange  = (e as CommitmentStatusChange);
     this.paymentsComponent.load_proposalStatus(commitmentStatusChange.status);

    }
    else {

    }

  }

}



export class Add_Thread extends Thread {  

  windows: WinComponent;
  splashScreenComponent :SplashScreenComponent;
  commitmentComponent: CommitmentComponent;
  paymentsComponent: PaymentsComponent;

  resolver: ComponentFactoryResolver;
  node: TreeNode;

 
  constructor(splashScreenComponent :SplashScreenComponent ,resolver: ComponentFactoryResolver, windows: WinComponent, node: TreeNode) {
    super();

    this.splashScreenComponent =splashScreenComponent;
    this.resolver = resolver;
    this.node = node;
    this.windows = windows;
  }

  public OnInit() {
    this.Load_CommitmentView();
  }

  Load_CommitmentView()
  {
    this.windows.Clear(this.node);
    const commitmentFactory = this.resolver.resolveComponentFactory(CommitmentComponent);

    this.node.NodeDisplayName = "Add"
    let commitmentComponentRef = this.windows.AddComponent(commitmentFactory, this.node);
    this.commitmentComponent = commitmentComponentRef.instance; 
    let me = this;
    this.commitmentComponent.Events.subscribe(function (e: CommitmentComponent_Event) { me.OnCommitmentEvent(e) });
    this.commitmentComponent.InitControl(null, true);
  }
  
  public OnCommitmentEvent(e: CommitmentComponent_Event) {
    //alert("event");
    if (e instanceof CommitmentSubmit) {
      if(e.success){
        let commitmentSubmit = e as CommitmentSubmit;
        this.splashScreenComponent.CommitmentCreated(commitmentSubmit.commitmentID);
      }

    }
    else if (e instanceof CommitmentCancel) {
      //alert("cancel");
      this.OnInit();
    }
    else {

    }

  }



}


export class WorkSpace {

  public OnInit() :void{}
}

export class AppMaintenanceWorkSpace extends WorkSpace 
{
  userComponent : UserComponent;
  typeComponent : TypeComponent;

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  constructor(resolver: ComponentFactoryResolver, windows: WinComponent) {

    super();
    this.resolver = resolver;
    this.windows = windows;
  }
  public  OnInit() { 

    const userComponentFactory = this.resolver.resolveComponentFactory(UserComponent);
    let userComponentRef = this.windows.AddComponentByName(userComponentFactory, "winA", "Workspace : Maintenance : Users", true);
    this.userComponent = userComponentRef.instance;

    const typeComponentFactory = this.resolver.resolveComponentFactory(TypeComponent);
    let  typeComponentRef = this.windows.AddComponentByName( typeComponentFactory, "winB","Workspace : Maintenance : Types", true);
    this.typeComponent =  typeComponentRef.instance;
  }

}

 
export class ManageCommitmentWorkSpace extends WorkSpace {
  searchComponent: SearchComponent;
  commitmentComponent: CommitmentComponent;
  commitmentSummaryComponent: CommitmentSummaryComponent;
  paymentsComponent: PaymentsComponent;

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  constructor(resolver: ComponentFactoryResolver, windows: WinComponent) {

    super();
    this.resolver = resolver;
    this.windows = windows;
  }

  public  OnInit() {   
   this.Load_SearchView();
  }
  public  Load_SearchView() {     


    const searchComponentFactory = this.resolver.resolveComponentFactory(SearchComponent);
    let searchComponentRef = this.windows.AddComponentByName(searchComponentFactory, "winA", "Workspace : Manage : Search", true);
    this.searchComponent = searchComponentRef.instance;
    let me = this;
    this.searchComponent.Events.subscribe(function (e: SearchComponent_Event) { me.onSearchComponentEvent(e) });

  }
  public onSearchComponentEvent(e: SearchComponent_Event) {
    if (e instanceof SearchComitmentSelected) {
      let comitmentPK = (e as SearchComitmentSelected).resultEnt.Commitment_PK;

      this.loadSelectedCommitmentView(comitmentPK);
    }
  }
  public loadSelectedCommitmentView(comitmentPK:number)
  {   

    this.windows.ClearByName("winB");
    const commitmentFactory = this.resolver.resolveComponentFactory(CommitmentComponent);
    let commitmentComponentRef = this.windows.AddComponentByName(commitmentFactory, "winB", "Workspace : Manage : Edit", true);
    this.commitmentComponent = commitmentComponentRef.instance;
    let me = this;
    this.commitmentComponent.Events.subscribe(function (e: CommitmentComponent_Event) { me.onCommitmentComponentEvent(e) });

    this.commitmentComponent.InitControl(comitmentPK, true);


    this.windows.ClearByName("winC");
    const paymentsComponentFactory = this.resolver.resolveComponentFactory(PaymentsComponent);
    let paymentsComponentRef = this.windows.AddComponentByName(paymentsComponentFactory, "winC", "Workspace : Manage : Edit Payment", true);
    this.paymentsComponent = paymentsComponentRef.instance;

    this.paymentsComponent.InitControl(comitmentPK);
  }


  public onCommitmentComponentEvent(e: CommitmentComponent_Event)  
  {
    if (e instanceof CommitmentStatusChange)
    {
      let commitmentStatusChange  = (e as CommitmentStatusChange);
     this.paymentsComponent.load_proposalStatus(commitmentStatusChange.status);

    }
  }


}
 
export class AddCommitmentWorkSpace extends WorkSpace{
  splashScreenComponent :SplashScreenComponent;
  commitmentComponent: CommitmentComponent;
  commitmentSummaryComponent: CommitmentSummaryComponent;

  resolver: ComponentFactoryResolver;
  windows: WinComponent;

  constructor(splashScreenComponent :SplashScreenComponent , resolver: ComponentFactoryResolver, windows: WinComponent) {
    super();
    this.splashScreenComponent = splashScreenComponent;
    this.resolver = resolver;
    this.windows = windows;
  }

  public OnInit() {
    this.windows.ClearAll();
    const commitmentFactory = this.resolver.resolveComponentFactory(CommitmentComponent);
    let commitmentComponentRef = this.windows.AddComponentByName(commitmentFactory, "winA", "Workspace : Add : Add", true);
    this.commitmentComponent = commitmentComponentRef.instance;


    let me = this;
    this.commitmentComponent.Events.subscribe(function (e: CommitmentComponent_Event) { me.onCommitmentComponentEvent(e) });
    this.commitmentComponent.InitControl(null, false);

    const commitmentSummaryComponentFactory = this.resolver.resolveComponentFactory(CommitmentSummaryComponent);
    let commitmentSummaryComponentRef = this.windows.AddComponentByName(commitmentSummaryComponentFactory, "winB", "Workspace : Add : Info", true);
    this.commitmentSummaryComponent = commitmentSummaryComponentRef.instance;

  }
  public onCommitmentComponentEvent(e: CommitmentComponent_Event) {
    if (e instanceof CommitmentProposalChange) {
      this.commitmentSummaryComponent.selectedProposal = (e as CommitmentProposalChange).selectedProposal;
    }
    else if (e instanceof CommitmentSubmit) {
     //alert("submit");
      if(e.success)
      {
        let commitmentSubmit = e  as  CommitmentSubmit;
        this.splashScreenComponent.CommitmentCreated(commitmentSubmit.commitmentID);
      }

    }
    else if (e instanceof CommitmentCancel) {
      //alert("cancel");
      this.OnInit();
    }
    else {

    }

  }

}
 
