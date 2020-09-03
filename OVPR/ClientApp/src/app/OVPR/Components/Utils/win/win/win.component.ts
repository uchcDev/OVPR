import {ChangeDetectorRef, ComponentRef,ComponentFactory,EventEmitter,ComponentFactoryResolver,HostListener,ViewChild, Component, OnInit,ViewContainerRef ,TemplateRef,ViewChildren,QueryList,Input,AfterViewInit, AfterContentInit} from '@angular/core';
import {Tree, TreeBuilder, TreeNode} from '../WinTree';

import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class Windows_Event
{

}
export class Windows_Drag extends Windows_Event
{
  //public locaton : WindowLocation;
  
  public node :TreeNode;
  public dataDragged : string;

  constructor(node : TreeNode, dataDragged : string)
  {
    super();

    this.node = node;
    this. dataDragged = dataDragged;
  }
}

export class Windows_CloseClicked extends Windows_Event
{  
  
  public node :TreeNode;  

  constructor(node : TreeNode)
  {
    super();

    this.node = node;  
  }
}


 
@Component({
  selector: 'mainDIV-wrapper',
  template: '{{node.NodeName}}'
 
})
export class mainDIVWrapper implements OnInit {
  @Input () node: TreeNode;   
  @Input () _mainDIV: HTMLElement;     

  ngOnInit() {  
    this.node.SetContaingDIV(this._mainDIV);
    this.node.divWrapper =this;
  
  }
}

 

@Component({
  selector: 'app-win',
  templateUrl: './win.component.html',
  styleUrls: ['./win.component.css']
})
export class WinComponent implements OnInit , AfterViewInit{  
 
  tree : Tree ;
   

  mouseX:number;
  mouseY:number;

  windowWidth: number;
  windowHeight : number;


  nodeToResize : TreeNode;
  nodeToResizeDIR = "";
  cursorType :string;
  mouseXSnapShot: number;
  mouseYSnapShot: number;

  public Events = new EventEmitter<Windows_Event>(); 

  
  constructor(private cdRef:ChangeDetectorRef, private resolver: ComponentFactoryResolver) 
  {  
    
  }

  ngOnInit() {
    this.cursorType = "default";   
  }

  ngAfterViewInit() {   
   
  }

  InitView(tree : Tree)
  {     
    this.tree = tree;
  }  

  public FindNode(nodeName: string) : TreeNode
  {
    return this.tree.GetAllNodes().filter(p=> p.NodeName == nodeName)[0];
  }
  public AddComponentByName<T>(componentFactory: ComponentFactory<T>, nodeName: string, nodeDisplayName : string, hideCloseButton : boolean): ComponentRef<T> {    
    
    let node = this.FindNode(nodeName);
    node.NodeDisplayName = nodeDisplayName;
    node.HideCloseButton = hideCloseButton;
    return node.nodeComp.placeHolder.createComponent(componentFactory);
  }

  public AddComponent<T>(componentFactory: ComponentFactory<T>, node: TreeNode): ComponentRef<T> {    
    return node.nodeComp.placeHolder.createComponent(componentFactory);
  }

  public ClearAll() {
    for (let c of  this.tree.GetAllNodes())
    {
      if( c.nodeComp  != null)
        this.Clear(c);
    }
  }
 

  public ClearByName(nodeName: string) {
    let node = this.FindNode(nodeName);
    this.Clear(node)  ;
}  
  public Clear(node: TreeNode) {
   
      node.nodeComp.placeHolder.clear(); 
      node.HideCloseButton = false;
      node.NodeDisplayName = ""    ;
  }  

  public DropEvent(node: TreeNode,   event: CdkDragDrop<string[]>) {  
    //alert(node.NodeName);
    this.Events.emit( new Windows_Drag(node, event.item.data));   
   
  }
  public CloseButtonClicked(node: TreeNode)
  {
    this.Events.emit( new Windows_CloseClicked(node));   
  }
 

//--------------------------------------------------------------------resize logic
  public mouseDown(e) {

    this.windowWidth = window.screen.width;
    this.windowHeight = window.screen.height;
    
    let allNodes = this.tree.GetAllNodes();
    this.nodeToResize =null;
    this.nodeToResizeDIR ="";

    //console.log(allNodes);
    for(let node of allNodes)
    {

      if(node != this.tree.rootNode && node != this.tree.rootNode.Children[0])
      {
       let hitDIR = node.IsHit( e.clientX, e.clientY);          

       if( hitDIR != "none" )
       {
          if(this.nodeToResize == null || node.DepthIndex < this.nodeToResize.DepthIndex)
          {
            this.nodeToResize = node;
            this.nodeToResizeDIR = hitDIR;
          }        
       }        
      }
    }
    if( this.nodeToResize != null && this.nodeToResize != this.tree.rootNode)
    {
      //console.log("hit!");
      //console.log(this.nodeToResize );

      let allNodes = this.tree.GetAllNodes();     
      for(let node of allNodes)
        node.HideContent =true;

      this.mouseXSnapShot = e.clientX;
      this.mouseYSnapShot = e.clientY;

      if(this.nodeToResizeDIR == "left" || this.nodeToResizeDIR == "right")
        this.cursorType = "col-resize";
      else
        this.cursorType = "row-resize";
    }
  }

  onMouseMove(e) {
   
  }

  @HostListener('document:mouseup', ['$event'])
  public onMouseUp(e) {   

    if(this.nodeToResize != null)
    {
      let length : number;
      if(this.nodeToResizeDIR == "left" || this.nodeToResizeDIR == "right" )
      {
          length = e.clientX - this.mouseXSnapShot;
      }
      else
      {
        length = e.clientY - this.mouseYSnapShot;
      }

       
      //console.log("HIT");
      //console.log(this.nodeToResize);
      
   
      this.tree.Resize(this.nodeToResize, this.nodeToResizeDIR, length);

      this.nodeToResize = null;
      this.cursorType = "default";

      let allNodes = this.tree.GetAllNodes();     
      for(let node of allNodes)
        node.HideContent =false;
    }     
  }   
   
}
