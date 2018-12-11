namespace web3d
{
    @NodeComponent
    export class SpringManager implements INodeComponent
    {
        gameObject: GameObject;
        springBones:SpringBone[];
        
        private springcolliders:SpringCollider[];
        Start() {
            this.springBones=this.gameObject.getComponentsInChildren("SpringBone") as SpringBone[];
            this.springcolliders=this.gameObject.getComponentsInChildren("SpringCollider") as SpringCollider[];

            for(let key in this.springBones)
            {
                this.springBones[key].colliders=this.springcolliders;
                this.springBones[key].child=this.springBones[key].gameObject.transform.findPath(["GameObject"]);
            }
        }
        Update() {
            this.randomWind();
            this.LateUpdate();
        }
        Clone() {
            
        }
        Dispose() {
            
        }
        
        private LateUpdate()
        {
            for (let i = 0; i < this.springBones.length; i++)
            {
                this.springBones[i].UpdateSpring();
            }
        }

        enablewind:boolean=true;
        windspeed:number=1
        private SpringForce:MathD.vec3=MathD.vec3.create();
        private randomWind()
        {
            if(this.enablewind)
            {
                this.SpringForce.x=(Math.sin(GameTimer.Time)+1)*0.001*this.windspeed;
            }
            for (let i = 0; i < this.springBones.length; i++)
            {
                MathD.vec3.copy(this.SpringForce,this.springBones[i].springForce);
            }
        }
    }

}