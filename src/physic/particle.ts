namespace web3d
{
    export class Particle
    {
        position: MathD.vec3=MathD.vec3.create();
    
        velocity: MathD.vec3=MathD.vec3.create();
    
        acceleration: MathD.vec3=MathD.vec3.create();
    
        damping:number=0.995;
    
        inverseMass:number=1.0;
    
        forceAccum: MathD.vec3=MathD.vec3.create();
    
        //--------tempt
        private resultAcc=MathD.vec3.create();
        integrate(detal:number)
        {
            MathD.vec3.AddscaledVec(this.position,this.velocity,detal,this.position);
    
            MathD.vec3.copy(this.acceleration,this.resultAcc);
            MathD.vec3.AddscaledVec(this.resultAcc,this.forceAccum,this.inverseMass,this.resultAcc);
    
    
            MathD.vec3.AddscaledVec(this.velocity,this.resultAcc,detal,this.velocity);
            MathD.vec3.scale(this.velocity,this.damping,this.velocity);
    
    
            this.clearAccumlator();
        }
    
        addForce(force: MathD.vec3)
        {
            MathD.vec3.add(this.forceAccum,force,this.forceAccum);
        }
    
        clearAccumlator()
        {
            MathD.vec3.toZero(this.forceAccum);
        }
    
        getMass():number
        {
            return 1.0/this.inverseMass;
        }
    
        getpositon(): MathD.vec3
        {
            return this.position;
        }
    
        getVelocity(): MathD.vec3
        {
            return this.velocity;
        }
    
        hasFiniteMass():boolean
        {
            return true;
        }
    
    }
}
