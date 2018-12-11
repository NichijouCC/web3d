namespace web3d
{
    export enum ScreenMatchEnum
    {
        Height,
        Width
    }
    
    export class Canvas
    {
        private static _inc:Canvas;
        static get inc():Canvas
        {
            if(this._inc==null)
            {
                this._inc=new Canvas();
            }
            return this._inc;
        }
    
        private rootNode: Node2d;
        private get rootTrans():Transform2D
        {
            return this.rootNode.transform2d;
        }
        constructor()
        {
            this.rootNode = new Node2d();
            this.onScreenResize();
            GameScreen.addListenertoCanvasResize(()=>{
                this.onScreenResize();
            });
        }
        addChild(node: Transform2D)
        {
            this.rootTrans.addChild(node);
        }
        removeChild(node: Transform2D)
        {
            this.rootTrans.removeChild(node);
        }
        getChildren(): Transform2D[]
        {
            return this.rootTrans.children;
        }
        getChildCount(): number
        {
            return this.rootTrans.children.length;
        }
        getChild(index: number): Transform2D
        {
            return this.rootTrans.children[index];
        }
    
        /**
         * 屏幕匹配参考宽度
         */
        private match_width = 800;
        /**
         * 屏幕匹配参考高度
         */
        private match_height =600;
    
        realheight:number;
        realWidth:number;
        matchScale:number;
        //----------高度自适应
        screenMatchType:ScreenMatchEnum=ScreenMatchEnum.Height;
        private onScreenResize()
        {
            switch(this.screenMatchType)
            {
                case ScreenMatchEnum.Height:
                    this.realheight=this.match_height;
                    this.realWidth=GameScreen.aspect*this.realheight;
                    break;
                case ScreenMatchEnum.Width:
                    this.realWidth=this.match_width;
                    this.realheight=this.realWidth/GameScreen.aspect;
                    break;
            }
    
            this.matchScale=GameScreen.Height/this.realheight;
        }
        update(delta: number)
        {
            // this.rootTrans.updateTran();
            this.updateGameObject(this.rootNode,delta);
        }
    
        private updateGameObject(node: Node2d, delta:number)
        {
            node.start();//组件还未初始化的初始化
            node.update(delta);
            for (let i = 0,len=node.transform2d.children.length; i < len; i++)
            {
                this.updateGameObject(node.transform2d.children[i].node2d, delta);
            }
        }
    
        render()
        {
            renderContext2d.updateCamera(this);
            this.drawScene(this.rootNode);
        }
        /**
         * 绘制2d节点
         */
        private drawScene(node: Node2d)
        {
            if(!node.beVisible)return;
            if (node.renderer != null)
            {
                node.renderer.render(this);
            }
            if (node.transform2d.children != null)
            {
                for (var i = 0; i < node.transform2d.children.length; i++)
                {
                    this.drawScene(node.transform2d.children[i].node2d);
                }
            }
        }
        getRoot(): Node2d
        {
            return this.rootNode;
        }
    
        addRenderData(mat:Material,meshdata:number[])
        {
            
        }
    }
}
