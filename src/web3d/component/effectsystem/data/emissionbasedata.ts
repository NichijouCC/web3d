namespace web3d
{
    export class F14EmissionBaseData implements ElementData
    {
        public loopenum:LoopEnum = LoopEnum.Restart;
        public mesh:Mesh;
        public material:Material;
    
        public rotPosition:MathD.vec3 = MathD.vec3.create();
        public rotScale:MathD.vec3 = MathD.vec3.create(1,1,1);
        public rotEuler:MathD.vec3 = MathD.vec3.create();
    
        //----------------render
        public rendermodel:RenderModelEnum = RenderModelEnum.Mesh;
        //public Material material;  
        //public Mesh mesh;//仅在rendermodel为mesh的时候显示     
        public beloop:boolean = true;
        public lifeTime:NumberData = new NumberData(20);
        public simulateInLocalSpace:boolean = true;//粒子运动运动空间（世界还是本地)
        public startScaleRate:NumberData = new NumberData(1);
        public startScale:Vector3Data = new Vector3Data(1, 1, 1);
        public startEuler:Vector3Data = new Vector3Data();
        //public Vector4 startColor = new Vector4(1, 1, 1, 1);//直接分为color和alpha，不纠结了
        public startColor:Vector3Data = new Vector3Data(1, 1, 1);
        public startAlpha:NumberData = new NumberData(1);
        public colorRate:number = 1;
        public simulationSpeed:NumberData = new NumberData(1);
        //20171018增加的
        public start_tex_st:MathD.vec4 =MathD.vec4.create(1,1,0,0);
        //----------------emision
        public delayTime:number = 0;
        public duration:number = 10;
        //public NumberData emissionCount = new NumberData(4);
        //20171017增加的
        public rateOverTime:NumberData = new NumberData(1);
        //burst 只在basedata中展示，不在关键帧编辑窗口展示
        public bursts:busrtInfo[] = [];

    
        //----------------emission shape
        public shapeType:ParticleSystemShape = ParticleSystemShape.NORMAL;
        //box---/width/height/depth
        public width:number;
        public height:number;
        public depth:number;
        //sphere---/radius/
        public radius:number;
        //hemisphere---/radius/
        //cone---/angle/radius/height/emitfrom
        public angle:number;
        public emitFrom:emitfromenum = emitfromenum.base;
    
    
        //----------------------------------------可选类型-----------------------------------------------------------
        //-----------------position over lifetime
        public enableVelocityOverLifetime:boolean = false;
        public moveSpeed:Vector3Data = new Vector3Data(0);
    
        //-----------------scale over lifetime
        public enableSizeOverLifetime:boolean = false;
        public sizeNodes:NumberKey[] =[];
    
        //-----------------rot over lifetime
        public enableRotOverLifeTime:boolean = false;
        public angleSpeed:NumberData = new NumberData(0);
    
        //-----------------color & alpha over lifetime
        public enableColorOverLifetime:boolean = false;
        public colorNodes:Vector3Key[] = [];
        public alphaNodes:NumberKey[] =[];
    
        //-----------------texture animation
        public enableTexAnimation:boolean = false;
        public uvType:UVTypeEnum = UVTypeEnum.NONE;
        //uvroll---/uspeed/vspeed
        public uSpeed:number;
        public vSpeed:number;
        //UVSprite---/row/column/count
        public row:number;
        public column:number;
        public count:number;

        public static getRandomDirAndPosByZEmission(emission:F14EmissionBaseData,outDir:MathD.vec3,outPos:MathD.vec3)
        {

            switch(emission.shapeType)
            {
                case ParticleSystemShape.NORMAL:
                    MathD.vec3.copy(MathD.vec3.ZERO,outPos);
                    MathD.vec3.copy(MathD.vec3.UP,outDir);
                    break;
                case ParticleSystemShape.SPHERE:
                    var θ = Math.random()*Math.PI*2;
                    var φ = Math.random()*Math.PI;
                    outDir.x=Math.sin(φ)*Math.cos(θ);
                    outDir.y=Math.cos(φ);         
                    outDir.z=Math.sin(φ)*Math.sin(θ);
                    var radius=Math.random()*emission.radius;
                    MathD.vec3.scale(outDir,radius,outPos);
                    break;
                case ParticleSystemShape.HEMISPHERE:
                    var θ = Math.random()*Math.PI*2;
                    var φ = Math.random()*Math.PI*0.5;
                    var radius=Math.random()*emission.radius;
                    outDir.x=Math.sin(φ)*Math.cos(θ);
                    outDir.y=Math.cos(φ);         
                    outDir.z=Math.sin(φ)*Math.sin(θ);
                    MathD.vec3.scale(outDir,radius,outPos);
                    break;
                case ParticleSystemShape.BOX:
                
                    outPos.x = MathD.random(-emission.width / 2, emission.width / 2);
                    outPos.y = MathD.random(-emission.height / 2, emission.height / 2);
                    outPos.z = MathD.random(-emission.depth / 2, emission.depth / 2);
                    MathD.vec3.normalize(outPos,outDir);
                    break;
                case ParticleSystemShape.CONE:
                    var randomAngle=Math.random()*Math.PI*2;//弧度
                    var randomHeight=Math.random()*emission.height;
                    var upradius=randomHeight*Math.tan(emission.angle*Math.PI/180)+emission.radius;
                    var radomRadius=Math.random()*upradius;

                    var bottompos=MathD.vec3.create();
                    bottompos.x=emission.radius*Math.cos(randomAngle);
                    bottompos.y=0;
                    bottompos.z=emission.radius*Math.sin(randomAngle);

                    if(emission.emitFrom==emitfromenum.base)
                    {
                        MathD.vec3.copy(bottompos,outPos);
                    }
                    else if(emission.emitFrom==emitfromenum.volume)
                    {
                        outPos.x=radomRadius*Math.cos(randomAngle);
                        outPos.z=radomRadius*Math.sin(randomAngle);
                        outPos.y=randomHeight;
                    }
                    outDir.x=Math.cos(randomAngle)*Math.sin(emission.angle*Math.PI/180);
                    outDir.z=Math.sin(randomAngle)*Math.sin(emission.angle*Math.PI/180);
                    outDir.y=Math.cos(emission.angle*Math.PI/180);
                    break;
            }
        }
    
    }
    export class busrtInfo
    {
        public time:number = 0;
        public count:NumberData=new NumberData(10);

        static CreatformJson(json:any):busrtInfo
        {
            let info=new busrtInfo();
            info.time=json.time;
            NumberData.FormJson(json.count,info.count);
            return info
        }
    }
    export enum ParticleSystemShape 
    {
        NORMAL,
        BOX,
        SPHERE,
        HEMISPHERE,
        CONE,
        EDGE,
        CIRCLE
    }
    export enum RenderModelEnum
    {
        None,
        BillBoard,
        StretchedBillBoard,
        HorizontalBillBoard,
        VerticalBillBoard,
        Mesh
    }
    export enum emitfromenum
    {
        base,
        volume
    }
}