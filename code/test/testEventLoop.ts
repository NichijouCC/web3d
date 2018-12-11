namespace dome
{
    export class testloopRun implements IState
    {
        start() {
            this.func1(this.func2);
            
        }
        pos=MathD.vec3.create();
        scale=MathD.vec3.create();
        rot=MathD.quat.create();
        mat=MathD.mat4.create();
        func1(onfinish:()=>void)
        {
            for(let i=0;i<5000;i++)
            {
                MathD.mat4.RTS(this.pos,this.scale,this.rot,this.mat);
            }
            if(onfinish!=null)
            {
                onfinish();
            }
        }
        func2()
        {
            for(let i=0;i<5000;i++)
            {
                MathD.mat4.RTS(this.pos,this.scale,this.rot,this.mat);
            }
        }

        update(delta: number) {

        }
        
    }
}