namespace web3d
{
    @NodeComponent
    export class Text3dHtml implements INodeComponent
    {
        static type:string="Text3dHtml";
    
        gameObject: GameObject;
        private textNode:Text
        private _textContent:string;
        get textContent():string
        {
            return this._textContent;
        }
        set textContent(value:string)
        {
            if(this.textNode==null)
            {
                this.textNode=Text3dHtml.creatTextDiv();
            }
            this.textNode.nodeValue=value;
            this._textContent=value;
        }
    
        Start()
        {
            
        }
        private windowPos: MathD.vec3=MathD.vec3.create();      
        Update() {
            if(this._textContent!=null&&Camera.Main!=null)
            {
                Camera.Main.calcWindowPosFromWorldPos(this.gameObject.transform.worldPosition,this.windowPos);
                this.textNode.parentElement.style.left=this.windowPos[0]+"px";
                this.textNode.parentElement.style.top=this.windowPos[1]+"px";
            }
        }
        Dispose() {
    
        }
        Clone() {
    
        }
    
        static creatTextDiv():Text
        {
            let div = document.createElement("div");
            div.className = "floating-div";
            div.style.position="absolute";
            div.style.userSelect="none";
            div.style.color="pink";
            let textNode = document.createTextNode("");
            div.appendChild(textNode);
            GameScreen.divcontiner.appendChild(div);
            return textNode;
        }
    
    
    }
}

