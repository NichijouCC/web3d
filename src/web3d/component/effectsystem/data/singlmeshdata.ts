namespace web3d
{
    export enum LoopEnum
    {
        Restart=0,
        TimeContinue=1
    }
    export enum UVTypeEnum
    {
        NONE,
        UVRoll,
        UVSprite
    }
    export enum BindAxis
    {
        X=0,
        Y=1,
        NONE=2
    }
    export class SingleMeshBaseData implements ElementData 
    {
        public loopenum:LoopEnum= LoopEnum.Restart;
    
        public mesh:Mesh;
        public material:Material;
    
        //public bool beloop = false;
    
        public position:MathD.vec3=MathD.vec3.create();
        public scale:MathD.vec3=MathD.vec3.create(1,1,1);
        public euler:MathD.vec3 = MathD.vec3.create();
        public color:MathD.color = MathD.color.create();
        public tex_ST:MathD.vec4 = MathD.vec4.create();
        //-----------------texture animation
        public enableTexAnimation:boolean = false;
        public uvType: UVTypeEnum= UVTypeEnum.NONE;
        //uvroll---/uspeed/vspeed
        public uSpeed:number;
        public vSpeed:number;
        //UVSprite---/row/column/count
        public row:number;
        public column:number;
        public count:number;

            //-------------billboard
        public beBillboard:boolean=false;
        public bindAxis:BindAxis=BindAxis.NONE;


        //-----------------attline 计算插值
        //firtstFrame:number=0;   
    }
}