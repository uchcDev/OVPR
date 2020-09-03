import { Component, OnInit,ViewContainerRef,ViewChild ,Input} from '@angular/core';
import {TreeNode} from  '../WinTree';


@Component({
  selector: 'app-tree-node-wrapper',
  templateUrl: './tree-node-wrapper.component.html',
  styleUrls: ['./tree-node-wrapper.component.css']
})
export class TreeNodeWrapperComponent  implements OnInit {

  @ViewChild('placeHolder', {static: true, read: ViewContainerRef} ) public placeHolder: ViewContainerRef;
  @Input () node: TreeNode;       

  constructor() 
  {      
  }
  ngOnInit() {
    this.node.SetNodeComp(this);
  }

}
