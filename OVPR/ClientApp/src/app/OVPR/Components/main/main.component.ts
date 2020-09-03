import { Component, OnInit } from '@angular/core';

import { OVPRService } from '../../DropDown/ovpr.service'

import {
  demo_GetAllCommitmentsEnt

  
} from '../../DropDown/DataDeclares';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  data :demo_GetAllCommitmentsEnt[];

  constructor(private dataService: OVPRService) { }

  ngOnInit() {

      //this.dataService.GetAllCommitments().subscribe(p=> this.data = p);
  }

}
