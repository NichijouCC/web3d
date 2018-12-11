namespace web3d
{
    export class SingleMesh implements LayerElement
    {

        drawActive: boolean;
        type: F14TypeEnum;
        layer: EffectLayer;
        private  effect:EffectSystem;
        // public RenderBatch:F14SingleMeshBath;
    
        public position:MathD.vec3=MathD.vec3.create();
        public scale:MathD.vec3=MathD.vec3.create();
        public euler:MathD.vec3=MathD.vec3.create();
        public color:MathD.color=MathD.color.create();
        public tex_ST:MathD.vec4=MathD.vec4.create();
        public baseddata:SingleMeshBaseData;
    
        private localRotate:MathD.quat=MathD.quat.create();
        //-----------------life from to---------------------
        public startFrame:number;
        public endFrame:number;


        
        constructor(effect:EffectSystem,layer:EffectLayer)
        {
            this.type = F14TypeEnum.SingleMeshType;
            this.effect = effect;
            this.layer = layer;
            this.baseddata = layer.baseData as SingleMeshBaseData;
            
            MathD.vec3.copy(this.baseddata.position,this.position);
            MathD.vec3.copy(this.baseddata.scale,this.scale);
            MathD.vec3.copy(this.baseddata.euler,this.euler);
            MathD.quat.FromEuler(this.euler.x, this.euler.y, this.euler.z,this.localRotate);
            MathD.color.copy(this.baseddata.color,this.color);
            MathD.vec4.copy(this.baseddata.tex_ST,this.tex_ST);
            
            this.startFrame=this.layer.frameList[0];
            this.endFrame=this.layer.frameList[this.layer.frameList.length-1];

        }
        public update(deltaTime:number,frame:number, fps:number)
        {
            if (this.layer.frameList.length == 0)
            {
                this.drawActive = false;
                return;
            }
            if (frame < this.startFrame|| frame > this.endFrame)
            {
                this.drawActive = false;
                return;
            }else
            {
                this.drawActive=true;
            }
            ////------------------time line 方式--------------------
            //先传入本身初始的属性值，属性不一定在lin中存在值，需要初始值

            for(var attname in this.layer.Attlines)
            {
                let att = this.layer.Attlines[attname];
                att.getValue(frame,this.baseddata,this[attname]);
            }

            if (this.baseddata.enableTexAnimation)
            {
                this.refreshCurTex_ST(frame,deltaTime,fps);
            }
            this.updateRotByBillboard();
            this.refreshTargetMatrix();
        }
        Render() {
            
        }
        OnEndOnceLoop()
        {
            this.reset();
        }

        targetMat:MathD.mat4=MathD.mat4.create();
        public refreshTargetMatrix()
        {
            // MathD.quat.FromEuler(this.euler.x, this.euler.y, this.euler.z,this.localRotate);
            MathD.mat4.RTS(this.position,this.scale,this.localRotate,this.targetMat);
            //return Matrix4x4.TRS(this.position, Quaternion.Euler(this.euler.x, this.euler.y, this.euler.z),this.scale);
        }
    
    
        public refreshCurTex_ST(curframe:number,detalTime:number,fps:number)
        {
            if (this.baseddata.uvType == UVTypeEnum.UVRoll)
            {
                this.tex_ST.z +=this.baseddata.uSpeed*detalTime;
                this.tex_ST.w +=this.baseddata.vSpeed*detalTime;
            }
            else if(this.baseddata.uvType==UVTypeEnum.UVSprite)
            {
                let lerp = (curframe - this.startFrame) /(this.endFrame+1 - this.startFrame);
                let spritindex =Math.floor(lerp * this.baseddata.count);
                MathD.spriteAnimation(this.baseddata.row,this.baseddata.column,spritindex,this.tex_ST);
            }
        }
        //----------tempt
        private eulerRot=MathD.quat.create();
        private worldpos=MathD.vec3.create();
        private worldRot=MathD.quat.create();
        private inverseRot=MathD.quat.create();

        private lookDir=MathD.vec3.create();
        private worldDirx=MathD.vec3.create();
        private worldDiry=MathD.vec3.create();
        public updateRotByBillboard()
        {
            if(this.baseddata.beBillboard)
            {
                if(this.baseddata.bindAxis==BindAxis.NONE)
                {
                    let mat=this.effect.gameObject.transform.worldMatrix;
                    MathD.mat4.transformPoint(this.position,mat,this.worldpos);
                    let targetpos=(this.effect.renderCamera||Camera.Main).gameObject.transform.worldPosition;
                    MathD.quat.lookat(this.worldpos,targetpos,this.worldRot);

                    let parentRot = this.effect.gameObject.transform.worldRotation;
                    MathD.quat.inverse(parentRot,this.inverseRot);
                    MathD.quat.multiply(this.inverseRot,this.worldRot,this.localRotate);
                    MathD.quat.AxisAngle(MathD.vec3.FORWARD,this.euler.z,this.eulerRot);
                    MathD.quat.multiply(this.localRotate,this.eulerRot,this.localRotate);
                }else if(this.baseddata.bindAxis==BindAxis.X)
                {
                    let mat=this.effect.gameObject.transform.worldMatrix;
                    MathD.mat4.transformPoint(this.position,mat,this.worldpos);
                    let targetpos=(this.effect.renderCamera||Camera.Main).gameObject.transform.worldPosition;
                    MathD.vec3.subtract(targetpos,this.worldpos,this.lookDir);
                    MathD.vec3.normalize(this.lookDir,this.lookDir);
                    MathD.mat4.RTS(this.baseddata.position,this.baseddata.scale,this.localRotate,this.targetMat);
                    MathD.mat4.multiply(mat,this.targetMat,this.targetMat);
                    MathD.mat4.transformVector3(MathD.vec3.RIGHT,this.targetMat,this.worldDirx);
                    MathD.vec3.normalize(this.worldDirx,this.worldDirx);
                    MathD.vec3.cross(this.lookDir,this.worldDirx,this.worldDiry);

                    MathD.quat.lookat(this.worldpos,targetpos,this.worldRot,this.worldDiry);
                    let parentRot = this.effect.gameObject.transform.worldRotation;
                    MathD.quat.inverse(parentRot,this.inverseRot);
                    MathD.quat.multiply(this.inverseRot,this.worldRot,this.localRotate);
                }else
                {
                    let mat=this.effect.gameObject.transform.worldMatrix;
                    MathD.mat4.transformPoint(this.position,mat,this.worldpos);
                    let targetpos=(this.effect.renderCamera||Camera.Main).gameObject.transform.worldPosition;
                    //gd3d.math.quatLookat(this.worldpos,targetpos,this.worldRot);
                    MathD.vec3.subtract(targetpos,this.worldpos,this.lookDir);
                    MathD.vec3.normalize(this.lookDir,this.lookDir);
                    MathD.mat4.RTS(this.position,this.scale,this.localRotate,this.targetMat);
                    MathD.mat4.multiply(mat,this.targetMat,this.targetMat);
                    MathD.mat4.transformVector3(MathD.vec3.UP,this.targetMat,this.worldDiry);
                    MathD.vec3.normalize(this.worldDiry,this.worldDiry);
                    MathD.quat.lookat(this.worldpos,targetpos,this.worldRot,this.worldDiry);
                    let parentRot = this.effect.gameObject.transform.worldRotation;
                    MathD.quat.inverse(parentRot,this.inverseRot);
                    MathD.quat.multiply(this.inverseRot,this.worldRot,this.localRotate);
                }
            }else
            {
                MathD.quat.FromEuler(this.euler.x, this.euler.y, this.euler.z,this.localRotate);
            }
        }
        reset()
        {
            MathD.vec3.copy(this.baseddata.position,this.position);
            MathD.vec3.copy(this.baseddata.scale,this.scale);
            MathD.vec3.copy(this.baseddata.euler,this.euler);
            MathD.quat.FromEuler(this.euler.x, this.euler.y, this.euler.z,this.localRotate);
            MathD.color.copy(this.baseddata.color,this.color);
            MathD.vec4.copy(this.baseddata.tex_ST,this.tex_ST);
        }
        dispose()
        {
            this.layer=null;
            this.baseddata=null;
            this.effect=null;
            // this.posArr.length=0;
            // this.colorArr.length=0;
            // this.uvArr.length=0;
            
        }    }
    
}