namespace web3d
{
    export enum layoutOption 
    {
        LEFT = 1,
        TOP = 2,
        RIGHT = 4,
        BOTTOM = 8,
        H_CENTER = 16,
        V_CENTER = 32
    }
    export interface I2DComponent 
    {
        // onPlay();
        start();
        update(delta: number);
        node2d: Node2d;
        // onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean);
        dispose();
    }
    
    // export interface ICollider2d {
    //     transform: Transform2D;
    //     getBound(): obb2d;
    //     intersectsTransform(tran: Transform2D): boolean;
    // }
    
    export interface IRectRenderer extends I2DComponent
    {
        render(canvas: Canvas);
        // updateTran();
    }
    export class C2DComponent 
    {
        comp: I2DComponent;
        init: boolean;
        constructor(comp: I2DComponent, init: boolean = false) {
            this.comp = comp;
            this.init = init;
        }
    }
    
    export class Transform2D 
    {
        node2d:Node2d;
    
        beVisible = true;
        //CullingMask: number = CullingMask.default;//物件有一个layer 取值范围0~31，各种功能都可以用layer mask 去过滤作用范围
        name: string = "2D Node";
        parent: Transform2D;
        children: Transform2D[]=[];
    
        width: number = 0;
        height: number = 0;
    
    
        /**
         * 左下角（0,0）
         */
        pivot: MathD.vec2 =MathD.vec2.create(0.5,0.5);
    
        localPosition: MathD.vec2 =MathD.vec2.create();
        localScale: MathD.vec2 =MathD.vec2.create(1,1);
        /**
         * 弧度
         */
        localRotation: number = 0;//旋转
    
        private _localMatrix: MathD.mat2d =MathD.mat2d.create();//2d矩阵
        private _worldMatrix: MathD.mat2d =MathD.mat2d.create();
        private canvasWorldMatrix:  MathD.mat2d =MathD.mat2d.create();
        private _worldRotate:MathD.refNumber=new MathD.refNumber();
        private _worldPosition: MathD.vec2 =MathD.vec2.create();
        private _worldScale: MathD.vec2 =MathD.vec2.create(1,1);
    
    
        // private dirty: boolean = true;//自己的localpositon/localscale/localrotation被修改
        // private dirtyChild: boolean = true;//子节点是否有dirty的
        // private dirtyParent:boolean=true;//父节点是否有dirty的
        private dirtyWorldDecompose: boolean = false;
    
        private needComputeLocalMat:boolean=true;
        private needComputeWorldMat:boolean=true;
        private maskRect: MathD.Rect;
    
    
        /**
         * 标记需要刷新数据(localMatrix/worldMatrix)
         * 通知父节点 本节点 dirty了、通知 子节点 本节点dirty 了
         */
        markDirty()
        {
            // this.dirty = true;
            this.needComputeLocalMat=true;
            this.needComputeWorldMat=true;
    
            this.notifyChildSelfDirty(this);
        }
        /**
         * 通知 子节点 本节点dirty 了
         */
        private notifyChildSelfDirty(selfnode:Transform2D)
        {
            if(selfnode.children.length>0)
            {
                for(let i=0,len=selfnode.children.length;i<len;i++)
                {
                    let child=selfnode.children[i];
                    if(!child.needComputeWorldMat)
                    {
                        child.needComputeWorldMat=true;
                        this.notifyChildSelfDirty(selfnode.children[i]);
                    }
                }
            }
        }
    
        get localMatrix(): MathD.mat2d
        {
            if(this.needComputeLocalMat)
            {
                MathD.mat2d.RTS(this.localPosition, this.localScale, this.localRotation, this._localMatrix);
                this.needComputeLocalMat=false;
            }
            return this._localMatrix;
        }
    
        get worldMatrix(): MathD.mat2d
        {
            if(this.needComputeWorldMat)
            {
                if (this.parent == null)
                {
                    MathD.mat2d.copy(this.localMatrix, this._worldMatrix);
                }
                else
                {
                    MathD.mat2d.multiply(this.parent.worldMatrix, this.localMatrix, this._worldMatrix);
                }
                this.needComputeWorldMat=false;
                this.dirtyWorldDecompose = true;
            }
            return this._worldMatrix;
        }
        get worldScale():MathD.vec2
        {
            if (this.dirtyWorldDecompose||this.needComputeWorldMat)
            {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldScale;
        }
    
        get worldPositon():MathD.vec2
        {
            if (this.dirtyWorldDecompose||this.needComputeWorldMat)
            {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldScale;
        }
    
        get worldRotation()
        {
            if (this.dirtyWorldDecompose||this.needComputeWorldMat)
            {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldRotate.value;
        }
    
        private _reshapeMatrix:MathD.mat2d=MathD.mat2d.create();
        get reshapeMatrix():MathD.mat2d
        {
            let _offsetLDpos:MathD.vec2=MathD.vec2.create();
            let scale:MathD.vec2=MathD.vec2.create(this.width,this.height);
            _offsetLDpos[0]=-1*this.pivot[0]*this.width;
            _offsetLDpos[1]=-1*this.pivot[1]*this.height;
    
            MathD.mat2d.RTS(_offsetLDpos,scale,0,this._reshapeMatrix);
            return this._reshapeMatrix;
        }
    
        addChild(node: Transform2D) 
        {
            if (node.parent != null) 
            {
                node.parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];
            this.children.push(node);
            node.parent = this;
            this.markDirty();
        }
        removeChild(node: Transform2D) {
            if (node.parent != this) {
                console.warn("RemoveChild Info: Not my child.");
            }
            var i = this.children.indexOf(node);
            if (i >= 0) {
                this.children.splice(i, 1);
                node.parent = null;
            }
        }
        removeAllChild() {
            this.children.length=0;
        }
    
        dispose() {
            if (this.children) {
                for (var k in this.children) {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
        }
    }
}
