namespace web3d
{
    @Serialize("InsID")
    export class InsID
    {
        constructor()
        {
            this.id = InsID.next();
        }
        private static idAll: number = 1;
        private static next(): number
        {
            let next = InsID.idAll;
            InsID.idAll++;
            return next;
        }
        @Attribute
        private id: number;
        /**
         * 获取唯一id
         */
        getInsID(): number
        {
            return this.id;
        }
    }
    
    @Serialize("Transform")
    export class Transform 
    {
        public insId: InsID = new InsID();
    
        @Attribute
        gameObject: GameObject;
        // @Attribute
        // scene:Scene;
    
        //@Attribute
        parent: Transform;
    
        @Attribute
        children: Transform[]=[];
        /**
         * 添加子物体实例
         */
        addChild(node: Transform)
        {
            if (node.parent != null)
            {
                node.parent.removeChild(node);
            }
            this.children.push(node);
            node.parent = this;
    
            node.markDirty();
        }
        /**
         * 移除所有子物体
         */
        removeAllChild()
        {
            //if(this.children==undefined||this.children.length==0) return;
            if(this.children.length==0) return;
            for(let i=0,len=this.children.length;i<len;i++)
            {
                this.children[i].parent=null;
            }
            this.children.length=0;
        }
        /**
         * 移除指定子物体
         */
        removeChild(node: Transform)
        {
            if (node.parent != this || this.children.length == 0)
            {
                throw new Error("not my child.");
            }
            let i = this.children.indexOf(node);
            if (i >= 0)
            {
                this.children.splice(i, 1);
                node.parent = null;
            }
        }
        /**
         * 查找自己以及子物体中是否有指定名称的transform
         */
        find(name: string): Transform
        {
            if (this.gameObject.name == name)
                return this;
            else
            {
                if (this.children.length > 0)
                {
                    for (let i in this.children)
                    {
                        let res = this.children[i].find(name);
                        if (res != null)
                            return res;
                    }
                }
            }
            return null;
        }
    
        findPath(name:string[])
        {
            if(name==null||name.length==0) return null;
    
            let targetTrans:Transform=null;
            let trans=this.findchild(name[0]);
            let index=0;
            while(trans&&index<name.length-1)
            {
                index++;
                trans=trans.findchild(name[index]);
            }
            return trans;
        }
        private findchild(name: string):Transform
        {
            if(this.children.length>0)
            {
                for (let i=0,len=this.children.length;i<len;i++)
                {
                    let child=this.children[i];
                    if (child.gameObject.name == name)
                    {
                        return child;
                    }
                    
                }
            }
            return null;
        }
        /**
         * 标记需要刷新数据(localMatrix/worldMatrix)
         * 通知父节点 本节点 dirty了、通知 子节点 本节点dirty 了
         */
        markDirty()
        {
            // this.dirty = true;
            this.needComputeLocalMat=true;
            this.needComputeWorldMat=true;
    
            this.notifyParentSelfDirty(this);
            this.notifyChildSelfDirty(this);
        }
        /**
         * 通知父节点 本节点 dirty了
         */
        private notifyParentSelfDirty(selfnode:Transform)
        {
            let p = selfnode.parent;
            while (p!=null&&!p.dirtyChild)
            {
                p.dirtyChild = true;
                p = p.parent;
            }
        }
    
        /**
         * 通知 子节点 本节点dirty 了
         */
        private notifyChildSelfDirty(selfnode:Transform)
        {
            if(selfnode.children.length>0)
            {
                for(let i=0,len=selfnode.children.length;i<len;i++)
                {
                    let child=selfnode.children[i];
                    if(!child.needComputeWorldMat)
                    {
                        // child.dirtyParent=true;
                        child.needComputeWorldMat=true;
                        this.notifyChildSelfDirty(selfnode.children[i]);
                    }
                }
            }
        }
        //#region update transfrom 需要的函数，先注掉。目前可以不走每帧updata
        // /**
        //  * 
        //  */
        // private refreshMatrix()
        // {
        //     if(this.needComputeLocalMat)
        //     {
        //         mat4.RTS(this.localPosition, this.localScale, this.localRotation, this._localMatrix);
        //         this.needComputeLocalMat=false;
        //     }
        //     if(this.needComputeWorldMat)
        //     {
        //         if (this.parent == null)
        //         {
        //             mat4.copy(this._localMatrix, this._worldMatrix);
        //         }
        //         else
        //         {
        //             mat4.multiply(this.parent._worldMatrix, this._localMatrix, this._worldMatrix);
        //         }
        //         this.needComputeWorldMat=false;
        //         // this.dirtyWorldDecompose = true;
        //         this.dirtyWorldDecompse=Transform.AllWorldDirty;
        //     }
        // }
        // /**
        //  * 刷新transform状态
        //  */
        // updateTran()
        // {
        //     this.refreshMatrix();
        //     if(this.dirtyChild||this.needComputeLocalMat||this.needComputeWorldMat)
        //     {
        //         for (let i = 0; i < this.children.length; i++)
        //         {
        //             this.children[i].updateTran();
        //         }
        //     }
        //     this.needComputeLocalMat=false;
        //     this.dirtyChild = false;
        //     this.needComputeWorldMat = false;
    
        //     if(this.gameObject.collider)
        //     {
        //         this.gameObject.collider.updateAABB();
        //     }
        // }
        // /**
        //  * 刷新父节点(最靠近root同时该节点之上没有dirty的)到自己这一条线，以得到正确的worldMatrix信息，兄弟节点不刷,自己的子节点也不刷
        //  */
        // private updateTransNow()
        // {
        //     let tranArr:Transform[]=[];
        //     let p=this as Transform;
        //     while(p&&(p.needComputeWorldMat||p.needComputeLocalMat))
        //     {
        //         tranArr.push(p);
        //         p=p.parent;
        //     }
        //     for(let i=tranArr.length-1;i>=0;i--)
        //     {
        //         tranArr[i].refreshMatrix();
        //     }
        // }
    
        //#endregion
    
        //private dirty: boolean = true;//自己的localpositon/localscale/localrotation被修改
        private dirtyChild: boolean = true;//子节点是否有dirty的
        //private dirtyParent:boolean=true;//父节点是否有dirty的
        private dirtyWorldDecompose: boolean = false;
        /**
         * 111 【 r t s (1代表dirty)】
         */
        private dirtyWorldDecompse:number=0x00000000;
        /**
         * 011【 r t s (1代表dirty)】
         */
        private static NotDirtyRotMask:number=0x00000003;//011
        /**
         * 101【 r t s (1代表dirty)】
         */
        private static NotDirtyPosMask:number=0x00000005;//101
        /**
         * 110【 r t s (1代表dirty)】
         */
        private static NotDirtyScaleMask:number=0x00000006;//110
        /**
         * 111【 r t s (1代表dirty)】
         */
        private static AllWorldDirty:number=0x00000007;//111
    
        needComputeLocalMat:boolean=true;
        needComputeWorldMat:boolean=true;
    
        /**
         *localrotate 用起来要遵循get set流程来改变对象值,最好不要赋值 new对象，不符合对象复用原则。 
         *locarotate[0]=xx.这种操作是不允许的，应该没有直接修改四元数某单值得骚操作。
         */
        @Attribute
        localRotation: MathD.quat= MathD.quat.create();
        //private _eulerDirty:boolean=false;
    
        private _localEuler: MathD.vec3= MathD.vec3.create();
        get localEuler()
        {
            MathD.quat.ToEuler(this.localRotation,this._localEuler);
            return this._localEuler;
        }
        set localEuler(value: MathD.vec3)
        {
            this._localEuler=value;
            MathD.quat.FromEuler(this._localEuler[0], this._localEuler[1], this._localEuler[2], this.localRotation);
        }
    
        @Attribute
        localPosition: MathD.vec3= MathD.vec3.create();
    
        @Attribute
        localScale: MathD.vec3= MathD.vec3.create(1,1,1);
    
        translate(x:number=0,y:number=0,z:number=0)
        {
            this.localPosition[0]+=x;
            this.localPosition[1]+=y;
            this.localPosition[2]+=z;
            this.markDirty();
        }
        scale(x:number=1,y:number=1,z:number=1)
        {
            this.localScale[0]*=x;
            this.localScale[1]*=y;
            this.localScale[2]*=z;
            this.markDirty();
        }
        rotate(x:number=0,y:number=0,z:number=0)
        {
            let temprot=MathD.quat.create();
            MathD.quat.FromEuler(x,y,z,temprot);
            MathD.quat.multiply(this.localRotation,temprot,this.localRotation);
            MathD.quat.recycle(temprot);
            //MathD.quat.FromEuler(this._localEulerAngles[0], this._localEulerAngles[1], this._localEulerAngles[2], this._localRotate);
            this.markDirty();
        }
        private _localMatrix: MathD.mat4 = MathD.mat4.create();
        private _worldMatrix: MathD.mat4 = MathD.mat4.create();
        private _worldRotate: MathD.quat = MathD.quat.create();
        private _worldPosition: MathD.vec3 = MathD.vec3.create(0, 0, 0);
        private _worldScale: MathD.vec3 = MathD.vec3.create(1, 1, 1);
    
        /**
         * 获取世界坐标系下的位移
         */
        get worldPosition()
        {
            if((this.dirtyWorldDecompse|Transform.NotDirtyPosMask)==Transform.AllWorldDirty||this.needComputeWorldMat)
            {
                MathD.mat4.getTranslationing(this.worldMatrix,this._worldPosition);
                this.dirtyWorldDecompse=this.dirtyWorldDecompse&Transform.NotDirtyPosMask;
            }
            return this._worldPosition;
        }

        set worldPosition(pos:MathD.vec3)
        {
            if(this.parent==null) {
                console.error("Error: scene root cannot be move！");
                return;
            }
            if(this.parent.parent==null)
            {
                MathD.vec3.copy(pos,this.localPosition);
            }else
            {
                let invparentworld = MathD.mat4.create();
                MathD.mat4.invert(this.parent.worldMatrix,invparentworld);
                MathD.mat4.transformPoint(pos,invparentworld,this.localPosition);
                MathD.mat4.recycle(invparentworld);
            }
            this.markDirty();
        }

        /**
         * 获取世界坐标系下的缩放
         */
        get worldScale()
        {
            if((this.dirtyWorldDecompse|Transform.NotDirtyScaleMask)==Transform.AllWorldDirty||this.needComputeWorldMat)
            {
                MathD.mat4.getScaling(this.worldMatrix,this._worldScale);
                this.dirtyWorldDecompse=this.dirtyWorldDecompse&Transform.NotDirtyRotMask;
            }
            MathD.mat4.getScaling(this._worldMatrix,this._worldScale);
            return this._worldScale;
        }
        /**
         * 获取世界坐标系下的旋转
         */
        get worldRotation()
        {
            if((this.dirtyWorldDecompse|Transform.NotDirtyRotMask)==Transform.AllWorldDirty||this.needComputeWorldMat)
            {
                MathD.mat4.getRotationing(this.worldMatrix,this._worldRotate,this.worldScale);
                this.dirtyWorldDecompse=this.dirtyWorldDecompse&Transform.NotDirtyRotMask;
            }
            return this._worldRotate;
        }
        set worldRotation(rot:MathD.quat)
        {
            if(this.parent==null) {
                console.error("Error: scene root cannot be move！");
                return;
            }
            if(this.parent.parent==null)
            {
                MathD.vec3.copy(rot,this.localRotation);
            }else
            {
                let invparentworldrot = MathD.quat.create();
                MathD.quat.inverse(this.parent.worldRotation,invparentworldrot);
                MathD.quat.multiply(invparentworldrot,rot,this.localRotation);
                MathD.quat.recycle(invparentworldrot);
            }
            this.markDirty();
        }

        get localMatrix(): MathD.mat4
        {
            if(this.needComputeLocalMat)
            {
                MathD.mat4.RTS(this.localPosition, this.localScale, this.localRotation, this._localMatrix);
                this.needComputeLocalMat=false;
            }
            return this._localMatrix;
        }
        get worldMatrix(): MathD.mat4
        {
            if(this.needComputeWorldMat)
            {
                if (this.parent == null)
                {
                    MathD.mat4.copy(this.localMatrix, this._worldMatrix);
                }
                else
                {
                    MathD.mat4.multiply(this.parent.worldMatrix, this.localMatrix, this._worldMatrix);
                }
                this.needComputeWorldMat=false;
                // this.dirtyWorldDecompose = true;
                this.dirtyWorldDecompse=Transform.AllWorldDirty;
            }
            return this._worldMatrix;
        }
    
        /**
         * 获取世界坐标系下当前z轴的朝向
         */
        getForwardInWorld(out: MathD.vec3)
        {
            MathD.mat4.transformVector3(MathD.vec3.FORWARD, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
        getRightInWorld(out: MathD.vec3)
        {
            MathD.mat4.transformVector3(MathD.vec3.RIGHT, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
        getUpInWorld(out: MathD.vec3)
        {
            MathD.mat4.transformVector3(MathD.vec3.UP, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
    
        // setWorldPosition(pos: MathD.vec3)
        // {
        //     if(this.parent==null) {
        //         console.error("Error: scene root cannot be move！");
        //         return;
        //     }
        //     if(this.parent.parent=null)
        //     {
        //         MathD.vec3.copy(pos,this.localPosition);
        //     }else
        //     {
        //         let parentworldMat=this.parent.worldMatrix;
        //         let invparentworld = MathD.mat4.create();
        //         MathD.mat4.invert(parentworldMat,invparentworld);
        //         MathD.mat4.transformPoint(pos,invparentworld,this.localPosition);
        //         MathD.mat4.recycle(invparentworld);
        //     }
        //     this.markDirty();
        // }
    
        setLocalMatrix(mat:MathD.mat4)
        {
            // mat4.recycle(this._localMatrix);
            // this._localMatrix=mat;
            MathD.mat4.copy(mat,this._localMatrix);
            this.markDirty();
            this.needComputeLocalMat=false;
            MathD.mat4.decompose(this._localMatrix, this.localScale, this.localRotation, this.localPosition);
        }
    
        /**
         * 旋转当前transform到z轴指向给定transform
         */
        lookat(trans: Transform)
        {
            // trans.updateTransNow();//update得到正确的位置和矩阵信息
            this.lookatPoint(trans.worldPosition);
        }
        /**
         * 旋转当前transform到z轴指向给定坐标
         * @param point 给定的坐标
         */
        lookatPoint(point: MathD.vec3)
        {
            // this.updateTransNow();//update得到正确的位置和矩阵信息
            let p0 = this.worldPosition;
            let p1 = point;
    
            // let dir = MathD.vec3.create();
            // vec3.subtract(p1, p0, dir);
    
            let worldRot = MathD.quat.create();
            let InverseParentQuat = MathD.quat.create();
            MathD.quat.lookat(p0, p1, worldRot);
            let parWorldQuat = this.parent.worldRotation;
            MathD.quat.inverse(parWorldQuat, InverseParentQuat);
            MathD.quat.multiply(InverseParentQuat, worldRot, this.localRotation);
            this.markDirty();
    
            // vec3.recycle(dir);
            MathD.quat.recycle(worldRot);
            MathD.quat.recycle(InverseParentQuat);
        }

        
        //@Attribute
        // get gameObject()
        // {
        //     return this.gameObject;
        // }
    
        // set gameObject(value:GameObject)
        // {
        //     this._gameObject=value;
        //     value["_transform"]=this;
        // }
        transformDirection(dir:MathD.vec3,out:MathD.vec3)
        {
            MathD.mat4.transformVector3(dir,this.worldMatrix,out);
        }
        get beDispose():boolean
        {
            return this._beDispose;
        }
        private _beDispose:boolean = false;//是否被释放了 
        dispose()
        {
            if(this._beDispose)  return;
            if (this.children.length>0)
            {
                for (let k in this.children)
                {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
            this.gameObject.dispose();
            this._beDispose = true;
        }
    }
}

