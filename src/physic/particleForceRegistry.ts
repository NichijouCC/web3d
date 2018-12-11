namespace web3d
{
    export class ParticleForceRegistry
    {
        forceMap:Map<ParticleForceGenerator, Particle[]> = new Map();
    
        add(par:Particle,force:ParticleForceGenerator)
        {
            if(!this.forceMap.has(force))
            {
                this.forceMap.set(force,new Array(par));
            }else
            {
                this.forceMap.get(force).push(par);
            }
        }
    
        remove(par:Particle,force:ParticleForceGenerator)
        {
            let arr=this.forceMap.get(force);
            let index=arr.indexOf(par);
            if(index!=-1)
            {
                arr.splice(index,1);
                if(arr.length==0)
                {
                    this.forceMap.delete(force);
                }
            }
        }
        clear()
        {
            this.forceMap.clear();
        }
        updateForces(detal:number)
        {
            this.forceMap.forEach((pars,force)=>{
                for(let i=0,len=pars.length;i<len;i++)
                {
                    force.updateFore(pars[i],detal);
                }
            })
        }
    }
}
