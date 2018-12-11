
namespace dome{
    declare var dat: any;
    export class spingBone implements IState
    {

        private model:web3d.Transform;
        load()
        {
            this.uiShow();

            let url="resource/scene/unitychan/scene.gltf";
            let bundle=web3d.assetMgr.load(url,(asset,state)=>{
                if(state.beSucces)
                {
                    let obj=bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                    this.model=obj.find("unitychan");
                }
            }) as web3d.glTFBundle;


            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition=MathD.vec3.create(0,2,5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);


            // let springMgr=web3d.curScene.getRoot().gameObject.getComponentsInChildren("SpringManager") as web3d.SpringManager[];
            // springMgr[0].
        }

        private uiAtts:{rotSpeed:number,maxSpeed:number,windspeed:number}={rotSpeed:0,maxSpeed:1,windspeed:1};
        private uiShow()
        {
            let gui = new dat.GUI();
            gui.add(this.uiAtts, 'rotSpeed',-1,1);
            gui.add(this.uiAtts, 'maxSpeed',0,20);
            gui.add(this.uiAtts, 'windspeed',0,10);


        }

        start() 
        {
            this.load();
        }
        update(delta: number) 
        {
            if(this.model!=null)
            {
                let rot=MathD.quat.create();
                MathD.quat.AxisAngle(MathD.vec3.UP,this.uiAtts.rotSpeed*delta*this.uiAtts.maxSpeed,rot);
                MathD.quat.multiply(this.model.localRotation,rot,this.model.localRotation);
                this.model.markDirty();

                let mgr=this.model.gameObject.getComponent("SpringManager") as web3d.SpringManager;
                mgr.windspeed=this.uiAtts.windspeed;
            }
        }

    }
}