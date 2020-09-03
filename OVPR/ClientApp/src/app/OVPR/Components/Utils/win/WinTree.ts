 
import {TreeNodeWrapperComponent} from './tree-node-wrapper/tree-node-wrapper.component'
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {WinComponent,mainDIVWrapper} from './win/win.component';




export class TreeResizeArg
{
    nodeToResize : TreeNode;
    requestedAdjustement: number;
    side :string;

    constructor( nodeToResize : TreeNode,  side :string, requestedAdjustement: number)
    {
        this.nodeToResize = nodeToResize;
        this.side =side;
        this. requestedAdjustement = requestedAdjustement;
    }
}


export class TreeNode {
    public ContainingTree: Tree;
    public NodeName: string;
    public NodeDisplayName: string;

    public ParentNode: TreeNode;
    public DepthIndex:number;

    public HideContent:boolean;
    public HideCloseButton:boolean;

    winX: number;
    winY: number;
    winWidth: number;
    winHeight: number;

    headerX : number;
    headerY : number;
    headerWidth: number;
    headerHeight: number;

    contentX : number;
    contentY : number;
    contentWidth: number;
    contentHeight: number;

    verticalSplit: boolean;

    isWinAbsoluteElseRelative: boolean;

    nodeComp : TreeNodeWrapperComponent;

    public divWrapper : mainDIVWrapper
    public containingDIV :HTMLElement;


    public Children: TreeNode[] = [];

    constructor( name: string, verticalSplit: boolean) {
       
        this.NodeName = name;
        this.verticalSplit = verticalSplit;
        this.isWinAbsoluteElseRelative = true;

        this.HideCloseButton = false;
        this.HideContent = false;
    }
    public HideCloseButtonCheck() :boolean
    {
        if(this.nodeComp.placeHolder.length == 0)
            return true;
        else
         return this.HideCloseButton;
    }

    public AddChild( node: TreeNode)
    {
        node.ParentNode = this;
        node.DepthIndex = this.DepthIndex + 1;
        this.Children.push(node);

    }

    public SetContaingDIV(div :HTMLElement)
    {     
        //console.log("SetContaingDIV");
        //console.log(this.NodeName);
       // console.log(div);

        this.containingDIV = div;
    }

    public Drop(event: CdkDragDrop<string[]>) {    
        this.ContainingTree.DropEvent(this, event);       
    }

    public IsHit(mouseX :number, mouseY :number) : string
    {
        //console.log("IsHit");
        //console.log(this.NodeName);
        //console.log(this.divWrapper);
        //console.log(this.containingDIV);

        let elemRect = this.containingDIV.getBoundingClientRect();          

        let X = elemRect.left;      
        let Y = elemRect.top;
        let BOTTOMY = elemRect.bottom;
        let RIGHTX = elemRect.right;  
        let Width = RIGHTX - X;
        let Height = BOTTOMY - Y;     
        if(mouseX >= X  &&  mouseX<= RIGHTX && Math.abs(mouseY - Y) <= 5)
        {
            return "top";            
        }
        else if(mouseX >= X  &&  mouseX<= RIGHTX && Math.abs(mouseY - BOTTOMY) <= 5)
        {
            return "bot";   
        }
        else if(mouseY >= Y && mouseY<=BOTTOMY  && Math.abs(mouseX - X) <= 5)
        {
            return "left"; 
        }
        else if(mouseY >= Y && mouseY<=BOTTOMY  && Math.abs(mouseX - RIGHTX) <= 5)
        {
            return "right"; 
        }
        else 
         return "none";         
    }  


    public AdjustValues(winXAdjust : number, winYAdjust  : number, winWidthAdjust  : number, winHeightAdjust, treeResizeArg : TreeResizeArg)
    {
        this.setValues(this.winX + winXAdjust, this.winY + winYAdjust, this.winWidth + winWidthAdjust, this.winHeight + winHeightAdjust , treeResizeArg);
    }   
    public setValues(x: number, y: number, width: number, height: number, treeResizeArg : TreeResizeArg) {
        let headerHeight = 25;
        
        let oldWinHeight =  this.winHeight;
        let oldWinWidth =  this.winWidth;

        this.winX = x;
        this.winY = y;
        this.winWidth = width;
        this.winHeight = height;

        this.headerX =  0;
        this.headerY =  0;
        this.headerWidth =  this.winWidth;
        this.headerHeight = headerHeight

        this.contentX =   0;
        this.contentY =   headerHeight;
        this.contentWidth =  this.winWidth;
        this.contentHeight =  this.winHeight - headerHeight;

        let childx = 0;
        let childy = 0;
        let childwidth = width;
        let childheight = height;

        if( treeResizeArg == null)
        {
            if (this.verticalSplit) {
                
                childwidth = width / this.Children.length;
                for (let c of this.Children) {
                    c.setValues(childx, childy, childwidth, childheight,treeResizeArg)
                    childx += childwidth;
                }    
                
            }
            else 
            {             
                    childheight = height / this.Children.length;
                    for (let c of this.Children) {
                        c.setValues(childx, childy, childwidth, childheight,treeResizeArg)
                        childy += childheight;
                    }
                
            }
        }
        else
        {
            let heightAdjust = (treeResizeArg.side == "top" || treeResizeArg.side == "bot");         

            if (this.verticalSplit) {
                
                if(heightAdjust)
                {                   
                   for (let c of this.Children) {
                       c.setValues(c.winX, c.winY,  c.winWidth, childheight,treeResizeArg);                     
                   }    
                } 
                else
                {                 
                    for (let c of this.Children) {
                        let prct = c.winWidth /  oldWinWidth;                                                      
                        childwidth = width * prct;

                        c.setValues(childx, childy, childwidth, childheight,treeResizeArg)
                        childx += childwidth;
                    }    
 
                }
                
            }
            else 
            {             
                   if(heightAdjust)
                   {                      
                        for (let c of this.Children) {
                           
                            let prct = c.winHeight / oldWinHeight;                                                      
                            childheight = height * prct;
                           
                            c.setValues(childx, childy, childwidth, childheight,treeResizeArg)
                            childy += childheight;
                        }
                   }
                   else                   
                   {                      
                       
                        for (let c of this.Children) {
                            c.setValues(c.winX, c.winY, childwidth, c.winHeight,treeResizeArg);                         
                        }                      
                   } 
            }             
        }
    }

    private DetermineActualAdjustment(toResizeLength : number, nieghborLength : number, toResizeLengthChange: number ) :number
    {
        //console.log("toResizeLength " +  toResizeLength);
        //console.log("nieghborLength"  + nieghborLength);


        let minDistance = 50;

        let aNewWidth = toResizeLength  + toResizeLengthChange;
        let bNewWidth = nieghborLength - toResizeLengthChange;                  
        

        //console.log("aNewWidth " +  aNewWidth);
        //console.log("bNewWidth"  + bNewWidth);

        let actualAdjustment = toResizeLengthChange;
        if(bNewWidth <= minDistance  || aNewWidth <=minDistance)
        {
            if( toResizeLengthChange > 0 )
            {
                actualAdjustment = nieghborLength - minDistance;
            }
            else
            {
                actualAdjustment = -1 * (toResizeLength - minDistance);
            }                           
        }
        return actualAdjustment;
    }
    public ResizeChild( treeResizeArg : TreeResizeArg) {        
        let toResize = this.Children.find(p=>p == treeResizeArg.nodeToResize);
        let indexOfToResize = this.Children.indexOf(toResize);       
        if (this.verticalSplit) { 
              
                if(treeResizeArg.side =="right" &&  this.Children.length >=  indexOfToResize + 2)
                {       
                    let neighbor = this.Children[indexOfToResize + 1];                
                    let actualAdjustment = this.DetermineActualAdjustment(toResize.winWidth, neighbor.winWidth, treeResizeArg.requestedAdjustement );         
                                   
                    toResize.AdjustValues(0,0,actualAdjustment, 0,  treeResizeArg);                                
                    neighbor.AdjustValues(actualAdjustment,0, -actualAdjustment, 0,  treeResizeArg);                    

                }
                else if(treeResizeArg.side =="left" && indexOfToResize + 1 >= 0)
                {
                    let neighbor = this.Children[indexOfToResize - 1];                    
                    let actualAdjustment = -this.DetermineActualAdjustment(toResize.winWidth, neighbor.winWidth, -treeResizeArg.requestedAdjustement );                            
                
                    toResize.AdjustValues(actualAdjustment,0,-actualAdjustment, 0,  treeResizeArg);                                
                    neighbor.AdjustValues(0,0, actualAdjustment, 0,  treeResizeArg);                  
                }            
        }
        else 
        {
           if(treeResizeArg.side =="top" && indexOfToResize - 1 >= 0)
            {          
                let neighbor = this.Children[indexOfToResize - 1];
                let actualAdjustment = -this.DetermineActualAdjustment(toResize.winHeight, neighbor.winHeight, -treeResizeArg.requestedAdjustement );                                                
                
                toResize.AdjustValues(0, actualAdjustment,0, -actualAdjustment,  treeResizeArg);                                       
                neighbor.AdjustValues(0,0, 0, actualAdjustment,  treeResizeArg);
            }
            else if(treeResizeArg.side =="bot" &&  this.Children.length  >=  indexOfToResize + 2)
            {    
                //console.log("hi");
               // console.log(toResize);

                let neighbor = this.Children[indexOfToResize + 1];   
                //console.log(neighbor);

                let actualAdjustment = this.DetermineActualAdjustment(toResize.winHeight, neighbor.winHeight, treeResizeArg.requestedAdjustement ); 

                toResize.AdjustValues(0, 0,0, actualAdjustment,  treeResizeArg);
                neighbor.AdjustValues(0,actualAdjustment, 0, -actualAdjustment,  treeResizeArg);
            }
            
        }
    }
   

    public CloseButtonClicked()
    {
        this.NodeDisplayName = "";
       this.ContainingTree.CloseButtonClicked(this);
    }
    public SetNodeComp( nodeComp : TreeNodeWrapperComponent)
    {
        this.nodeComp = nodeComp;
    }
    


    public GetWindowStyle() {
        let style = {};

        style["position"] = this.isWinAbsoluteElseRelative ? "absolute" : "relative";
        style["top"] = this.winY.toString() + "px";
        style["left"] = this.winX.toString() + "px";
        style["width"] = this.winWidth.toString() + "px";;
        style["height"] = this.winHeight.toString() + "px";;        

        return style;
    }

    public GetHeaderStyle() {
        let style = {};

        style["position"] = "absolute";
        style["top"] = this.headerY.toString() + "px";
        style["left"] = this.headerX.toString() + "px";
        style["width"] = this.headerWidth.toString() + "px";;
        style["height"] = this.headerHeight.toString() + "px";;     

        return style;
    }

    public GetContentStyle() {
        let style = {};

        style["position"] = "absolute";
        style["top"] = this.contentY.toString() + "px";
        style["left"] = this.contentX.toString() + "px";
        style["width"] = this.contentWidth.toString() + "px";;
        style["height"] = this.contentHeight.toString() + "px";;       
        style["overflow"] = "scroll";

        return style;
    }

    public print() {

        let windowStyleObj = this.GetWindowStyle();
        let windowStyle  ="style='";
        for (let s in windowStyleObj) {
            windowStyle = windowStyle + s + ":" + windowStyleObj[s] + ";";
        }
        windowStyle = windowStyle + "'";

        let headerStyleObj = this.GetHeaderStyle();
        let headerStyle  ="style='";
        for (let s in headerStyleObj) {
            headerStyle = headerStyle + s + ":" + headerStyleObj[s] + ";";
        }
        headerStyle = headerStyle + "'";

        let contentStyleObj = this.GetContentStyle();
        let contentStyle  ="style='";
        for (let s in contentStyleObj) {
            contentStyle = contentStyle + s + ":" + contentStyleObj[s] + ";";
        }   
        contentStyle = contentStyle + "'";   

        console.log("<div " + windowStyle + " >");
        if(this.Children.length == 0)
        {
            console.log("<div " + headerStyle + " >");
            console.log("</div>");

            console.log("<div " + contentStyle + " >");
            console.log("</div>");
        }
        else
        {
            for (let c of this.Children) {
                c.print();
            }
        }
        console.log("</div>");
    }

    public GetAllViewContainerRef() {   

        let comps : TreeNodeWrapperComponent[] = [];
        this._getAllViewContainerRef(comps);

        return comps;
     }
    public _getAllViewContainerRef(comps : TreeNodeWrapperComponent[]) {         

      if(this.nodeComp != null)
        comps.push(this.nodeComp);
      
      for (let c of this.Children) {
            c._getAllViewContainerRef(comps);
        }      
    }   
    //console.log(div.getBoundingClientRect());
    public GetAllNodes()
    {
        let nodes : TreeNode[] = [];
        this._getAllNodes(nodes);

        return nodes;
    }
    public _getAllNodes(nodes : TreeNode[])
    {
        nodes.push(this);
        for (let c of this.Children) {
            c._getAllNodes(nodes);
        }    
    }

}
export class Tree {
    winComponent: WinComponent;
    rootNode: TreeNode;
   
    constructor(rootNode: TreeNode) {       
        this.rootNode = rootNode;
        this.rootNode.isWinAbsoluteElseRelative = false;
    }

    public Print() {
        this.rootNode.print();
    }

    public SetRoot(x: number, y: number, width: number, height: number) {
        this.rootNode.setValues(x, y, width, height, null);
    }

    public GetAllViewContainerRef() { 
        return this.rootNode.GetAllViewContainerRef() ;
    }

    public GetAllNodes()
    {
        return this.rootNode.GetAllNodes();
    }

    public Resize(node: TreeNode, side: string, x : number)
    { 
        //console.log("HIT");
        //console.log(node.NodeName);
        //console.log(side);        


        let arg = new TreeResizeArg(node, side, x);
        node.ParentNode.ResizeChild(arg);
    }

    public DropEvent(node: TreeNode,   event: CdkDragDrop<string[]>) {       
        //alert("drop:" + node.NodeName + " : " + event.item.data);
        this.winComponent.DropEvent(node,   event);
       
    }

    public CloseButtonClicked(node: TreeNode)
    {
        this.winComponent.CloseButtonClicked(node);
    }


}

export class TreeBuilder {
    
    //root node hack
    public static BuildLargeTopTree (winComponent: WinComponent) :Tree
    {
        //aaa
        //bcd
        let root = new TreeNode("BuildLargeTopTreeroot", true);//root node hack
        let parent = new TreeNode("BuildLargeTopTreeParent", false);
        let winA = new TreeNode("winA", true);
        let parent2 = new TreeNode("parent2", true);
        let winB = new TreeNode("winB", true);
        let winC = new TreeNode("winC", true);

        root.DepthIndex =0;
        root.AddChild(parent);

        //parent.DepthIndex =0;
        parent.AddChild(winA);
        parent.AddChild(parent2);

        parent2.AddChild(winB);
        parent2.AddChild(winC);

        let tree = new Tree( root);
        tree.winComponent = winComponent;
        for(let c of tree.GetAllNodes())
        {
            c.ContainingTree =  tree;           
        }     
      
        let winWidth = window.screen.width *.9;
        let winHeight = window.screen.height *.8;
        tree.SetRoot(0,0,winWidth, winHeight);


        return tree;
    }
    public static BuildStandardTree (winComponent: WinComponent) :Tree
    {
        //aaa
        //bcd
        
        let root = new TreeNode("StandardTreeroot", true);//root node hack
        let parent = new TreeNode("StandardTreeParent", true);
        let winA = new TreeNode("winA", true);
        let parent2 = new TreeNode("parent2", false);
        let winB = new TreeNode("winB", true);
        let winC = new TreeNode("winC", true);

        root.DepthIndex =0;
        root.AddChild(parent);

        //parent.DepthIndex =0;
        parent.AddChild(winA);
        parent.AddChild(parent2);

        parent2.AddChild(winB);
        parent2.AddChild(winC);

        let tree = new Tree( root);
        tree.winComponent = winComponent;
        for(let c of tree.GetAllNodes())
        {
            c.ContainingTree =  tree;           
        }     
      
        let winWidth = window.screen.width *.9;
        let winHeight = window.screen.height *.8;
        tree.SetRoot(0,0,winWidth, winHeight);


        return tree;
    }

    public static Build1Window (winComponent: WinComponent) :Tree
    {
        //aaa
        //bcd
        let root = new TreeNode("1Windowroot", true);//root node hack
        let parent = new TreeNode("parent", true);
        let winA = new TreeNode("winA", true);
       
        root.DepthIndex =0;
        root.AddChild(parent);
      
        parent.AddChild(winA);      

        let tree = new Tree(parent);
        tree.winComponent = winComponent;
        for(let c of tree.GetAllNodes())
        {
            c.ContainingTree =  tree;           
        }     
      
        let winWidth = window.screen.width *.9;
        let winHeight = window.screen.height *.8;
        tree.SetRoot(0,0,winWidth, winHeight);


        return tree;
    }
}




