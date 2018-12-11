namespace web3d
{
    export interface ParticleForceGenerator
    {
        updateFore(par:Particle,delta:number);
    }
    
    /**
     * 重力
     */
    export class ParticleGravity implements ParticleForceGenerator
    {
        gravity: MathD.vec3;
        constructor(gravity: MathD.vec3)
        {
            this.gravity=gravity;
        }
    
        private force=MathD.vec3.create();
        updateFore(par: Particle, delta: number) {
    
            MathD.vec3.scale(this.gravity,par.getMass(),this.force);
            par.addForce(this.force);
        }
        
    }
    /**
     * 基本弹力
     */
    export class ParticleSpring implements ParticleForceGenerator
    {
        other:Particle;
    
        springConstant:number;
    
        restLength:number;
    
        constructor(other:Particle,sprinconstant:number,restlen:number)
        {
            this.other=other;
            this.springConstant=sprinconstant;
            this.restLength=restlen;
        }
    
    
        private force: MathD.vec3=MathD.vec3.create();
        updateFore(par: Particle, delta: number) {
            let pos=par.getpositon();
            let pos2=this.other.getpositon();
    
            MathD.vec3.subtract(pos,pos2,this.force);
            let len=MathD.vec3.magnitude(this.force);
    
            len=Math.abs(len-this.restLength);
            len*=this.springConstant;
    
            MathD.vec3.normalize(this.force,this.force);
            MathD.vec3.scale(this.force,-len,this.force);
    
            par.addForce(this.force);
        }
    
        
    }
    /**
     * 固定点弹力
     */
    export class ParticleAnchoredSpring implements ParticleForceGenerator
    {
        anchor: MathD.vec3;
        
        springConstant:number;
        restLength:number;
    
        constructor(anchor: MathD.vec3,sprinconstant:number,restlen:number)
        {
            this.anchor=anchor;
            this.springConstant=sprinconstant;
            this.restLength=restlen;
        }
    
        private force: MathD.vec3=MathD.vec3.create();
        updateFore(par: Particle, delta: number) {
            let pos=par.getpositon();
            MathD.vec3.subtract(pos,this.anchor,this.force);
    
            let len=MathD.vec3.magnitude(this.force);
    
            len=Math.abs(len-this.restLength);
            len*=this.springConstant;
    
            MathD.vec3.normalize(this.force,this.force);
            MathD.vec3.scale(this.force,-len,this.force);
    
            par.addForce(this.force);
        }
        
    }
    
    export class ParticleBungee implements ParticleForceGenerator
    {
    
    
        other:Particle;
        springConstant:number;
        restLenghth:number;
    
        constructor(other:Particle,springConstance:number,restLen:number)
        {
            this.other=other;
            this.springConstant=this.springConstant;
            this.restLenghth=restLen;
        }
        private force: MathD.vec3=MathD.vec3.create();
        updateFore(par: Particle, delta: number) {
            let pos=par.getpositon();
            MathD.vec3.subtract(pos,par.getpositon(),this.force);
            let len=MathD.vec3.magnitude(this.force);
            if(len<=this.restLenghth) return;
            len=this.springConstant*(this.restLenghth-len);
            
            MathD.vec3.normalize(this.force,this.force);
            MathD.vec3.scale(this.force,-len,this.force);
            par.addForce(this.force);
        }
    }
    
    /**
     * 浮力
     */
    export class ParticleBuoyancy implements ParticleForceGenerator
    {
        /**
         * 刚好产生最大浮力时候的深度
         */
        maxDepth:number;//高度一半
        volume:number;
        waterHeight:number;
        liquidDensity:number;
    
        constructor(maxdepth:number,volume:number,waterheight:number,liquiddensity:number=1000.0)
        {
            this.maxDepth=maxdepth;
            this.volume=volume;
            this.waterHeight=waterheight;
            this.liquidDensity=liquiddensity;
        }
    
        private force: MathD.vec3=MathD.vec3.create();
        updateFore(par: Particle, delta: number) 
        {
            let pos=par.getpositon();
            if(pos[1]>=this.waterHeight+this.maxDepth) return;
            if(pos[1]<=this.waterHeight-this.maxDepth)
            {
                this.force[1]=this.liquidDensity*this.volume;
                par.addForce(this.force);
                return;
            }
            this.force[1]=this.liquidDensity*this.volume*(pos[1]-this.maxDepth-this.waterHeight)/(2*this.maxDepth);
            par.addForce(this.force);
        }
        
    }
    
    export class ParticleFakeSpring implements ParticleForceGenerator {
        anchor: MathD.vec3;
        springConstant:number;
        restLength:number;
        damping:number;
    
        private pos: MathD.vec3=MathD.vec3.create();//相对位置
        private c: MathD.vec3=MathD.vec3.create();
        private target: MathD.vec3=MathD.vec3.create();
        private ac: MathD.vec3=MathD.vec3.create();
        private tempt: MathD.vec3=MathD.vec3.create();
        
        
        updateFore(par: Particle, delta: number) {
            if(!par.hasFiniteMass()) return;
            let pos=par.getpositon();
            MathD.vec3.subtract(pos,this.anchor,this.pos);
    
            let gamma=0.5*Math.sqrt(4*this.springConstant-this.damping*this.damping);
            if(gamma==0) return;
            MathD.vec3.scale(this.pos,this.damping*0.5,this.c);
            MathD.vec3.add(this.c,par.getVelocity(),this.c);
            MathD.vec3.scale(this.c,1.0/gamma,this.c);
    
            //target pos
            MathD.vec3.scale(this.pos,Math.cos(gamma*delta),this.target);
            MathD.vec3.scale(this.c,Math.sin(gamma*delta),this.c);
            MathD.vec3.add(this.target,this.c,this.target);
            MathD.vec3.scale(this.target,Math.exp(-0.5*delta*this.damping),this.target);
    
            //------a  f
            MathD.vec3.subtract(this.target,this.pos,this.ac);
            MathD.vec3.scale(this.ac,1.0/(delta*delta),this.ac);
            MathD.vec3.scale(par.getVelocity(),delta,this.tempt);
            MathD.vec3.subtract(this.ac,this.tempt,this.ac);
            MathD.vec3.scale(this.ac,par.getMass(),this.ac);
            par.addForce(this.ac);
        }
    }
}
