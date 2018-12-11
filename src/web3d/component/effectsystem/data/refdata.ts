namespace web3d
{
    export class F14RefBaseData implements ElementData
    {

        public beLoop:boolean = false;
        public refdataName:string;
        public refData:F14EffectData;
        
        public localPos:MathD.vec3=MathD.vec3.create();
        public localEuler:MathD.vec3=MathD.vec3.create();
        public localScale:MathD.vec3=MathD.vec3.create(1,1,1);



    }
}

