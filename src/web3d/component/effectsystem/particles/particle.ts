namespace web3d
{
    export class F14Particle
    {
        private data:F14EmissionBaseData;
        private element:F14Emission;
    
        private totalLife:number;//总生命
        private startScaleRate:number;
        private startScale:MathD.vec3;
        public Starteuler:MathD.vec3;//这个应该为float，只绕了一个轴
        public StartPos:MathD.vec3=MathD.vec3.create();
        public startColor:MathD.vec3;
        public startAlpha:number;
        public colorRate:number;
        private simulationSpeed:number;
        private simulateInLocalSpace:boolean;
        private starTex_ST:MathD.vec4;
    
        private speedDir:MathD.vec3=MathD.vec3.create();
    
        public enableVelocityOverLifetime:boolean;
        private movespeed:MathD.vec3;
    
        public enableSizeOverLifetime:boolean;
        private sizeNodes:NumberKey[];
    
        public enableRotOverLifeTime:boolean;
        public eulerSpeed:number;
    
        public enableColorOverLifetime:boolean;
        private colorNodes:Vector3Key[];
        private alphaNodes:NumberKey[];
    
        public enableTexAnimation:boolean;
        public uvType:UVTypeEnum;
        public tex_ST:MathD.vec4=MathD.vec4.create();;
    
    
        public rotationByEuler = MathD.quat.create();
        public rotationByShape = MathD.quat.create();
        public startRotation = MathD.quat.create();
        public rotAngle:number = 0;
    
        public localMatrix = MathD.mat4.create();
    
        public localTranslate = MathD.vec3.create();
        public localRotation = MathD.quat.create();
        public localScale = MathD.vec3.create(1, 1, 1);
        public color = MathD.vec3.create(1, 1, 1);
        public alpha:number = 1;
    
        private Color:MathD.color=MathD.color.create();
        //-----------------------------------------------------------------------------
        private curLife:number;//当前经过的生命周期
        private life01:number=0;//(0---1)
        public actived:boolean = false;
    
        ////在emission是在simulate in world space 时候,将发射器的这个矩阵保存起来,为静态的
        private emissionMatToWorld:MathD.mat4;
        private emissionWorldRotation:MathD.quat;
        
        private getEmissionMatToWorld():MathD.mat4
        {
            if(this.data.simulateInLocalSpace)
            {
                return this.element.getWorldMatrix();
            }else
            {
                return this.emissionMatToWorld;
            }
        }
        private getemissionWorldRotation():MathD.quat
        {
            if(this.data.simulateInLocalSpace)
            {
                return this.element.getWorldRotation();
            }else
            {
                return this.emissionWorldRotation;
            }
        }

        //private float startTime = 0;
        public constructor(element:F14Emission,data:F14EmissionBaseData)
        {
            this.data = data;
            this.element = element;
            this.initByEmissionData(data);
        }
        public initByEmissionData(data:F14EmissionBaseData)
        {
            this.actived = true;
            this.curLife = 0;
    
            this.totalLife = data.lifeTime.getValue(true);
            this.simulateInLocalSpace = data.simulateInLocalSpace;
            this.simulationSpeed = data.simulationSpeed.getValue(true);
            this.startScaleRate = data.startScaleRate.getValue(true);
            this.startScale=data.startScale.getValue(true);
            // MathD.vec3.scale(this.startScale,this.startScaleRate,this.startScale);
            MathD.vec3.scale(this.startScale,this.startScaleRate,this.startScale);
            this.Starteuler = data.startEuler.getValue(true);
            this.startColor = data.startColor.getValue(true);
            this.startAlpha = data.startAlpha.getValue(true);
            this.colorRate = data.colorRate;
            this.starTex_ST = data.start_tex_st;
            //MathD.vec4.copy(data.start_tex_st,this.starTex_ST);
    
            this.movespeed = data.moveSpeed.getValue(true);
            this.sizeNodes = data.sizeNodes;
            this.eulerSpeed = data.angleSpeed.getValue(true);
            this.colorNodes = data.colorNodes;
            this.alphaNodes = data.alphaNodes;
            this.uvType = data.uvType;
            //tex_ST 与粒子curtime也有相关性
            this.getCurTex_ST(data);
    
            F14EmissionBaseData.getRandomDirAndPosByZEmission(data,this.speedDir,this.StartPos);
            //this.rotationByEuler = Quaternion.Euler(this.Starteuler);
            MathD.quat.FromEuler(this.Starteuler.x,this.Starteuler.y,this.Starteuler.z,this.rotationByEuler);
            this.rotAngle = 0;
            //todo simulateinworld/billboard
    
    
            MathD.vec3.copy(this.startScale,this.localScale);
            MathD.vec3.copy(this.startColor,this.color);
            this.alpha = this.startAlpha;
            //this.tex_ST = this.starTex_ST;
            MathD.vec4.copy(this.starTex_ST,this.tex_ST);

            if(!data.simulateInLocalSpace)
            {
                this.emissionMatToWorld=MathD.mat4.create();
                this.emissionWorldRotation=MathD.quat.create();
                MathD.mat4.copy(this.element.getWorldMatrix(),this.emissionMatToWorld);
                MathD.quat.copy(this.element.getWorldRotation(),this.emissionWorldRotation);
            }
            //--strechbillboard
            if(data.rendermodel == RenderModelEnum.StretchedBillBoard)
            {
                this.emissionMatToWorld=this.getEmissionMatToWorld();
                MathD.mat4.transformVector3(this.speedDir,this.emissionMatToWorld,this.worldspeeddir);
                MathD.vec3.normalize(this.worldspeeddir,this.worldspeeddir);           
                MathD.mat4.transformPoint(this.StartPos,this.emissionMatToWorld,this.worldStartPos);
            }
            // Vector3 worldStartPos = this.getElementMatToWorld() * this.StartPos;
        }
    
        public update(deltaTime:number)
        {
            if (!this.actived) return;
            this.curLife += deltaTime;
            //this.curLife = Time.time - this.startTime;
            this.life01 = this.curLife / this.totalLife;
            if (this.life01 > 1)
            {
                this.actived = false;
                // this.transformVertex = Matrix4x4.zero;
                // this.transformVertex.m33 = 1;
                //this.updateMeshData();
                //this.element.particlelist.Remove(this);
                this.element.deadParticles.push(this);
                return;
            }
            this.updatePos();
            this.updateSize();
            this.updateEuler();
            this.updateRot();
            this.updateLocalMatrix();
            this.updateColor();
            this.updateUV();
            
            //this.updateMeshData(this.curVertexCount);
        }
        private tempos=MathD.vec3.create();
        private temcolor=MathD.color.create();
        private temUv=MathD.vec2.create();
        uploadMeshdata()
        {
            if(this.actived)
            {
                let batch=this.element.batch as F14EmissionBatch;
                for(let i=0;i<this.element.vertexCount;i++)
                {
                    MathD.mat4.transformPoint(this.element.posArr[i],this.transformVertex,this.tempos);
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+0]= this.tempos.x;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+1]= this.tempos.y;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+2]= this.tempos.z;
    
                    if(this.element.colorArr)
                    {
                        MathD.color.multiply(this.element.colorArr[i],this.Color,this.temcolor);
                    }else
                    {
                        MathD.color.copy(this.Color,this.temcolor);
                    }
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+3]= this.temcolor.r;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+4]= this.temcolor.g;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+5]= this.temcolor.b;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+6]= this.temcolor.a;

                    this.temUv.x=this.element.uvArr[i].x*this.tex_ST.x+this.tex_ST.z;
                    this.temUv.y=this.element.uvArr[i].y*this.tex_ST.y+this.tex_ST.w;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+7]= this.temUv.x;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboLen+8]= this.temUv.y;
                }
                for(let i=0;i<this.element.dataforeboLen;i++)
                {
                    batch.dataForEbo[i+batch.curIndexCount]=this.element.meshebo[i]+batch.curVertexcount;
                }
                batch.curRealVboLen+=this.element.dataforvboLen;
                batch.curIndexCount+=this.element.dataforeboLen;
                batch.curVertexcount+=this.element.vertexCount;
            }
        }
        /**
         * 在emission是在simulate in local space 时候，为matTobathcer
         * 在emission是在simulate in world space 时候，为matToWorld
         */
    
        private transformVertex = MathD.mat4.create();
        private updateLocalMatrix()
        {
            MathD.mat4.RTS(this.localTranslate,this.localScale,this.localRotation,this.localMatrix);
            if (this.data.simulateInLocalSpace)
            {
                MathD.mat4.multiply(this.element.localMatrix,this.localMatrix,this.transformVertex);
            }
            else
            {
                MathD.mat4.multiply(this.emissionMatToWorld, this.localMatrix, this.transformVertex);
            }
        }
        private updatePos()
        {
            MathD.vec3.scale(this.speedDir,this.simulationSpeed * this.curLife,this.localTranslate);
            MathD.vec3.add(this.localTranslate,this.StartPos,this.localTranslate);

            if (this.data.enableVelocityOverLifetime)
            {
                MathD.vec3.AddscaledVec(this.localTranslate,this.movespeed,this.curLife,this.localTranslate);
            }
        }
        private updateSize()
        {
            if (this.data.enableSizeOverLifetime&&this.sizeNodes.length>0)
            {
                if(this.sizeNodes[0].key>this.life01)
                {
                    let tar=MathD.numberLerp(1, this.sizeNodes[0].value, this.life01 / this.sizeNodes[0].key);
                    MathD.vec3.scale(this.startScale,tar,this.localScale);
                    return;
                }
                for (let i = 0; i < this.sizeNodes.length - 1; i++)
                {
                    if (this.sizeNodes[i].key <= this.life01 && this.sizeNodes[i + 1].key >= this.life01)
                    {
                        let tar =MathD.numberLerp(this.sizeNodes[i].value, this.sizeNodes[i + 1].value, (this.life01 - this.sizeNodes[i].key) / (this.sizeNodes[i + 1].key - this.sizeNodes[i].key));
                        MathD.vec3.scale(this.startScale,tar,this.localScale);
                        break;
                    }
                }
            }
        }     
    
        private updateEuler()
        {
            if (this.data.enableRotOverLifeTime)
            {
                this.rotAngle = this.eulerSpeed * this.curLife;
            }
        }
        //------temp value
        private angleRot:MathD.quat=MathD.quat.create();
        private worldpos=MathD.vec3.create();
        private tarWorldpos=MathD.vec3.create();
        private worldspeeddir=MathD.vec3.create();
        private lookDir=MathD.vec3.create();
        private temptx=MathD.vec3.create();
        private worldRotation=MathD.quat.create();
        private invParWorldRot=MathD.quat.create();
                
        private worldStartPos=MathD.vec3.create();
        private updateRot()
        {
            if (this.data.rendermodel == RenderModelEnum.Mesh)
            {
                MathD.quat.AxisAngle(MathD.vec3.UP,this.rotAngle,this.angleRot);
                MathD.quat.multiply(this.rotationByEuler,this.angleRot,this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.BillBoard)
            {
                this.emissionMatToWorld=this.getEmissionMatToWorld();
                MathD.mat4.transformPoint(this.localTranslate,this.emissionMatToWorld,this.worldpos);
                let targetTrans=(this.element.effect.renderCamera||Camera.Main).gameObject.transform;
                // this.tarWorldpos=targetTrans.getWorldTranslate();
                //gd3d.math.quatLookat(this.worldpos, this.tarWorldpos, this.worldRotation);

                // targetTrans.getRightInWorld(this.temptx);
                // MathD.vec3.scale(this.temptx,-1,this.temptx);
                // MathD.vec3.subtract(targetTrans.worldPosition,this.worldpos,this.lookDir);
                // MathD.vec3.normalize(this.lookDir,this.lookDir);
                // MathD.vec3.cross(this.lookDir,this.temptx,this.worldspeeddir);
                // math.unitxyzToRotation(this.temptx,this.worldspeeddir,this.lookDir,this.worldRotation);

                MathD.quat.lookat(this.worldpos,targetTrans.worldPosition,this.worldRotation);
                this.emissionWorldRotation=this.getemissionWorldRotation();
                // MathD.quat.inverse(this.emissionWorldRotation,this.invParWorldRot);
                MathD.quat.inverse(this.emissionWorldRotation,this.invParWorldRot);
                // MathD.quat.multiply(this.invParWorldRot, this.worldRotation, this.localRotation);
                MathD.quat.multiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                // MathD.quat.AxisAngle(math.pool.vector3_forward,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                // MathD.quat.multiply(this.localRotation, this.rotationByEuler, this.localRotation);

                MathD.quat.AxisAngle(MathD.vec3.FORWARD,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                MathD.quat.multiply(this.localRotation,this.rotationByEuler,this.localRotation);

            }
            else if (this.data.rendermodel == RenderModelEnum.HorizontalBillBoard)
            {
                this.worldRotation.x = -0.5;
                this.worldRotation.y = 0.5;
                this.worldRotation.z = 0.5;
                this.worldRotation.w = 0.5;

                this.emissionWorldRotation=this.getemissionWorldRotation();
                MathD.quat.inverse(this.emissionWorldRotation,this.invParWorldRot);
                MathD.quat.multiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                MathD.quat.AxisAngle(MathD.vec3.FORWARD,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                MathD.quat.multiply(this.localRotation, this.rotationByEuler, this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.VerticalBillBoard)
            {
                this.emissionMatToWorld=this.getEmissionMatToWorld();
                MathD.mat4.transformPoint(this.localTranslate,this.emissionMatToWorld,this.worldpos);
                let targetTrans=(this.element.effect.renderCamera||Camera.Main).gameObject.transform;

                MathD.vec3.copy(targetTrans.worldPosition, this.tarWorldpos);
                this.tarWorldpos.y=this.worldpos.y;
                MathD.quat.lookat(this.worldpos, this.tarWorldpos, this.worldRotation);
                
                this.emissionWorldRotation=this.getemissionWorldRotation();
                MathD.quat.inverse(this.emissionWorldRotation,this.invParWorldRot);
                MathD.quat.multiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                MathD.quat.AxisAngle(MathD.vec3.FORWARD,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                MathD.quat.multiply(this.localRotation, this.rotationByEuler, this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.StretchedBillBoard)
            {
                this.emissionMatToWorld=this.getEmissionMatToWorld();
                MathD.mat4.transformPoint(this.localTranslate,this.emissionMatToWorld,this.worldpos);
                let targetTrans=(this.element.effect.renderCamera||Camera.Main).gameObject.transform;
                // MathD.vec3.subtract(targetTrans.worldPosition,this.worldpos,this.lookDir);
                // MathD.vec3.normalize(this.lookDir,this.lookDir);
                // MathD.vec3.cross(this.worldspeeddir,this.lookDir,this.temptx);
                // MathD.vec3.cross(this.temptx,this.worldspeeddir,this.lookDir);
                // math.unitxyzToRotation(this.temptx,this.worldspeeddir,this.lookDir,this.worldRotation);

                MathD.quat.lookat(this.worldpos,targetTrans.worldPosition,this.worldRotation,this.worldspeeddir);

                this.emissionWorldRotation=this.getemissionWorldRotation();
                MathD.quat.inverse(this.emissionWorldRotation,this.invParWorldRot);
                MathD.quat.multiply(this.invParWorldRot, this.worldRotation, this.localRotation);
                
            }
        }   
        private updateColor()
        {
            if (this.data.enableColorOverLifetime)
            {
                if (this.colorNodes.length > 0)
                {
                    if(this.colorNodes[0].key>this.life01)
                    {
                        
                        MathD.vec3.lerp(this.startColor, this.colorNodes[0].value, this.life01/ this.colorNodes[0].key,this.color);
                    }else
                    {
                        for (let i = 0; i < this.colorNodes.length - 1; i++)
                        {
                            if (this.colorNodes[i].key <= this.life01 && this.colorNodes[i + 1].key >= this.life01)
                            {
                                MathD.vec3.lerp(this.colorNodes[i].value, this.colorNodes[i + 1].value, (this.life01 - this.colorNodes[i].key) / (this.colorNodes[i + 1].key - this.colorNodes[i].key),this.color);
                                break;
                            }
                        }
                    }
                }
                if (this.alphaNodes.length>0)
                {
                    if (this.alphaNodes[0].key > this.life01)
                    {
                        this.alpha = MathD.numberLerp(this.startAlpha, this.alphaNodes[0].value, this.life01 / this.alphaNodes[0].key);
                        
                    }
                    else
                    {
                        for (let i = 0; i < this.alphaNodes.length - 1; i++)
                        {
                            if (this.alphaNodes[i].key <= this.life01 && this.alphaNodes[i + 1].key >= this.life01)
                            {
                                this.alpha = MathD.numberLerp(this.alphaNodes[i].value, this.alphaNodes[i + 1].value, (this.life01 - this.alphaNodes[i].key) / (this.alphaNodes[i + 1].key - this.alphaNodes[i].key));
                                break;
                            }
                        }
                    }
                }
            }
            this.Color.r = this.color.x;
            this.Color.g = this.color.y;
            this.Color.b = this.color.z;
            this.Color.a = this.alpha;
        }
        private updateUV()
        {
            this.getCurTex_ST(this.data);
        }
        public getCurTex_ST(data:F14EmissionBaseData)
        {
            if (!data.enableTexAnimation) return;
            if (data.uvType == UVTypeEnum.UVRoll)
            {
                this.tex_ST.x = 1;
                this.tex_ST.y = 1;
                this.tex_ST.z = data.uSpeed * this.curLife;
                this.tex_ST.w = data.vSpeed * this.curLife;
            }
            else
            {
                let index = Math.floor(this.life01 * data.count);
                if(index>=data.count) index=data.count-1;
                MathD.spriteAnimation(data.row,data.column,index,this.tex_ST);
            }
        }

        dispose()
        {
            this.data=null;
            this.element=null;
            delete this.sizeNodes;
            delete this.colorNodes;
            delete this.alphaNodes;
        }
    }
    
}