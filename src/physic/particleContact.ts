namespace web3d
{
    export class ParticleContact
    {
        particles:Particle[];
    
        restitution:number;
    
        contactNormal: MathD.vec3;
    
        //相交深度
        penetration:number;
    
        /**
         * 解决碰撞后的速度和嵌入
         * @param detal 
         */
        resolve(detal:number)
        {
            this.resolveVelocity(detal);
            this.resolveInterpenetration(detal);
        };
        /**
         * 计算碰撞后分开时的速度
         */
        private relativeSped=MathD.vec3.create();
        calculateSeparatingVelocity()
        {
            let sped1=this.particles[0].getVelocity();
    
            if(this.particles[1]!=null)
            {
                let sped2=this.particles[1].getVelocity();
                MathD.vec3.subtract(sped1,sped2,this.relativeSped);
            }
            return MathD.vec3.dot(this.relativeSped,this.contactNormal);
        }
    
        temptVec3: MathD.vec3=MathD.vec3.create();
        movePerIMass: MathD.vec3=MathD.vec3.create();
        impulsePerIMass: MathD.vec3=MathD.vec3.create();
        /**
         * 处理碰撞冲量
         * @param detal 
         */
        private resolveVelocity(detal:number)
        {
            let separatingSped=this.calculateSeparatingVelocity();
            if(separatingSped>0) return;
    
            let newsepVelocity=-separatingSped*this.restitution;
            let deltaVelocity=newsepVelocity-separatingSped;
    
            let totalInverseMass=this.particles[0].getMass();
            if(this.particles[1]) totalInverseMass+=this.particles[1].getMass();
    
            if(totalInverseMass<=0) return;
    
            let impulse=deltaVelocity/totalInverseMass;
    
            MathD.vec3.scale(this.contactNormal,impulse,this.impulsePerIMass);
    
            MathD.vec3.scale(this.impulsePerIMass,this.particles[0].getMass(),this.temptVec3);
            MathD.vec3.add(this.temptVec3,this.particles[0].getVelocity(),this.particles[0].velocity);
    
            if(this.particles[1])
            {
                MathD.vec3.scale(this.impulsePerIMass,-1*this.particles[1].getMass(),this.temptVec3);
                MathD.vec3.add(this.temptVec3,this.particles[1].getVelocity(),this.particles[1].velocity);
            }
        }
        resolveInterpenetration(detal:number)
        {
            if(this.penetration<=0) return;
    
            let totalInverseMass=this.particles[0].getMass();
    
            if(this.particles[1])
            {
                totalInverseMass+=this.particles[1].getMass();
            }
    
            if(totalInverseMass<=0) return;
    
            MathD.vec3.scale(this.contactNormal,-this.penetration/totalInverseMass,this.movePerIMass);
            MathD.vec3.scale(this.movePerIMass,this.particles[0].getMass(),this.temptVec3);
            MathD.vec3.add(this.particles[0].position,this.temptVec3,this.particles[0].position);
    
           if(this.particles[1])
           {
                MathD.vec3.scale(this.movePerIMass,this.particles[1].getMass(),this.temptVec3);
                MathD.vec3.add(this.particles[1].position,this.temptVec3,this.particles[1].position);
           }
        }
    }
}
