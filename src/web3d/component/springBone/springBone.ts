namespace web3d
{
    @NodeComponent
    export class SpringBone implements INodeComponent
    {
        gameObject: GameObject;
        //次のボーン
        public child:Transform;

        //ボーンの向き
        public boneAxis:MathD.vec3 =MathD.vec3.create(0.0, 1.0, 0.0);

        public radius:number = 0.5;

        //バネが戻る力
        public stiffnessForce:number = 0.2;

        //力の減衰力
        public dragForce:number = 0.1;

        public springForce:MathD.vec3 =MathD.vec3.create(0.0, -0.05, 0.0);

        public  colliders:SpringCollider[];

        public  debug:boolean;

        private springLength:number;
        private localRotation:MathD.quat;
        private trs:Transform;
        private currTipPos:MathD.vec3;
        private prevTipPos:MathD.vec3;
          
        Start()
        {
            this.trs = this.gameObject.transform;
            this.localRotation = MathD.quat.clone(this.gameObject.transform.localRotation);

            this.springLength=MathD.vec3.distance(this.trs.worldPosition,this.child.worldPosition);
            this.currTipPos=MathD.vec3.clone(this.child.worldPosition);
            this.prevTipPos=MathD.vec3.clone(this.child.worldPosition);

            // this.boneAxis=MathD.vec3.create(0.0, 1.0, 0.0);
        }

        Update() {
            // if(this.gameObject.transform.find("testcube")==null)
            // {
            //     let obj=new GameObject();
            //     obj.transform.localScale=MathD.vec3.create(0.05,0.5,0.05);
            //     obj.name="testcube";  
            //     let mf=obj.addComponent<MeshFilter>("MeshFilter");
            //     let mr=obj.addComponent<MeshRender>("MeshRender");
            //     mf.mesh=assetMgr.getDefaultMesh("cube");
            //     mr.material=assetMgr.getDefaultMaterial("def");
            //     this.gameObject.transform.addChild(obj.transform);
            // }
            // if(this.child.find("ttcube")==null)
            // {
            //     let obj=new GameObject();
            //     obj.transform.localScale=MathD.vec3.create(0.05,2,0.05);
            //     obj.name="ttcube";  
            //     let mf=obj.addComponent<MeshFilter>("MeshFilter");
            //     let mr=obj.addComponent<MeshRender>("MeshRender");
            //     mf.mesh=assetMgr.getDefaultMesh("cube");
            //     let shader=assetMgr.getShader("def");
            //     let mat=new Material();
            //     mat.setShader(shader);
            //     mat.setColor("_MainColor",MathD.color.create(1,0,0,1));
            //     mr.material=mat;
            //     this.gameObject.transform.addChild(obj.transform);
            // }
        }

        private force:MathD.vec3=MathD.vec3.create();
        private stiffForcee:MathD.vec3=MathD.vec3.create();
        private dragForcee:MathD.vec3=MathD.vec3.create();

        public UpdateSpring()
        {
            if(this.trs==null) return;
            //回転をリセット
            // trs.localRotation = Quaternion.identity * localRotation;
            MathD.quat.copy(this.localRotation,this.trs.localRotation);
            // if(this.trs.gameObject.name=="J_R_HairTail_00")
            // {
            //     console.log("test");
            // }
            this.trs.markDirty();

            // float sqrDt = Time.deltaTime * Time.deltaTime;
            let sqrDt:number=GameTimer.DeltaTime*GameTimer.DeltaTime;

            //stiffness
            // Vector3 force = trs.rotation * (boneAxis * stiffnessForce) / sqrDt;
            MathD.vec3.scale(this.boneAxis,this.stiffnessForce,this.stiffForcee);
            MathD.quat.transformVector(this.trs.worldRotation,this.stiffForcee,this.stiffForcee);
            MathD.vec3.scale(this.stiffForcee,1/sqrDt,this.stiffForcee);

            //drag
            // force += (prevTipPos - currTipPos) * dragForce / sqrDt;
            MathD.vec3.subtract(this.prevTipPos,this.currTipPos,this.dragForcee);
            MathD.vec3.scale(this.dragForcee,this.dragForce/sqrDt,this.dragForcee);

            MathD.vec3.add(this.stiffForcee,this.dragForcee,this.force);
            //force += springForce / sqrDt;
            MathD.vec3.AddscaledVec(this.force,this.springForce,1/sqrDt,this.force);


            //前フレームと値が同じにならないように  前一帧和值不相同
            // Vector3 temp = currTipPos;
            let temp:MathD.vec3=MathD.vec3.clone(this.currTipPos);
            //verlet
            // currTipPos = (currTipPos - prevTipPos) + currTipPos + (force * sqrDt);
            MathD.vec3.scale(this.currTipPos,2,this.currTipPos);
            MathD.vec3.subtract(this.currTipPos,this.prevTipPos,this.currTipPos);
            MathD.vec3.AddscaledVec(this.currTipPos,this.force,sqrDt,this.currTipPos);

            //長さを元に戻す 恢复长度
            // currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            let dir=MathD.vec3.create();
            MathD.vec3.subtract(this.currTipPos,this.trs.worldPosition,dir);
            MathD.vec3.normalize(dir,dir);
            MathD.vec3.AddscaledVec(this.trs.worldPosition,dir,this.springLength,this.currTipPos);
            
            // //衝突判定
            // for (int i = 0; i < colliders.Length; i++)
            // {
            //     if (Vector3.Distance(currTipPos, colliders[i].transform.position) <= (radius + colliders[i].radius))
            //     {
            //         Vector3 normal = (currTipPos - colliders[i].transform.position).normalized;
            //         currTipPos = colliders[i].transform.position + (normal * (radius + colliders[i].radius));
            //         currTipPos = ((currTipPos - trs.position).normalized * springLength) + trs.position;
            //     }
            // }
            for(let i=0;i<this.colliders.length;i++)
            {
                if(MathD.vec3.distance(this.currTipPos,this.colliders[i].gameObject.transform.worldPosition)<=(this.radius+this.colliders[i].radius))
                {
                    let normal=MathD.vec3.create();
                    MathD.vec3.subtract(this.currTipPos,this.colliders[i].gameObject.transform.worldPosition,normal);
                    MathD.vec3.normalize(normal,normal);
                    MathD.vec3.AddscaledVec(this.colliders[i].gameObject.transform.worldPosition,normal,this.radius+this.colliders[i].radius,this.currTipPos);
                    
                    MathD.vec3.subtract(this.currTipPos,this.trs.worldPosition,dir);
                    MathD.vec3.normalize(dir,dir);
                    MathD.vec3.AddscaledVec(this.trs.worldPosition,dir,this.springLength,this.currTipPos);

                    MathD.vec3.recycle(normal);
                }

                // if(this.colliders[i].gameObject.transform.find("ttcube")==null)
                // {
                //     let obj=new GameObject();
                //     obj.transform.localScale=MathD.vec3.create(0.1,0.3,0.1);
                //     obj.name="ttcube";  
                //     let mf=obj.addComponent<MeshFilter>("MeshFilter");
                //     let mr=obj.addComponent<MeshRender>("MeshRender");
                //     mf.mesh=assetMgr.getDefaultMesh("cube");
                //     let shader=assetMgr.getShader("def");
                //     let mat=new Material();
                //     mat.setShader(shader);
                //     mat.setColor("_MainColor",MathD.color.create(1,0,0,1));
                //     mr.material=mat;
                //     this.colliders[i].gameObject.transform.addChild(obj.transform);
                // }
            }
            


            // prevTipPos = temp;
            this.prevTipPos=MathD.vec3.clone(temp);
    
            //回転を適用；
            // Vector3 aimVector = trs.TransformDirection(boneAxis);
            // Quaternion aimRotation = Quaternion.FromToRotation(aimVector, currTipPos - trs.position);
            // trs.rotation = aimRotation * trs.rotation;
    
            let aimVector=MathD.vec3.create();
            this.trs.transformDirection(this.boneAxis,aimVector);
            let aimRotation=MathD.quat.create();
            MathD.vec3.subtract(this.currTipPos,this.trs.worldPosition,dir);
            MathD.quat.fromToRotation(aimVector,dir,aimRotation);

            let rot=MathD.quat.create();
            MathD.quat.multiply(aimRotation,this.trs.worldRotation,rot);
            this.trs.worldRotation=rot;
            this.trs.markDirty();
            MathD.vec3.recycle(dir);
            MathD.vec3.recycle(aimVector);
            MathD.quat.recycle(aimRotation);


            //trs.rotation = trs.rotation*aimRotation ;
        }


        Clone() {
        }
        Dispose() {
        }

    }
}