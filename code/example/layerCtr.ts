
namespace dome{
    declare var dat: any;
    export class LayerCtr implements IState
    {

        private model:web3d.Transform;


        load()
        {
            this.uiShow();
            let modelName:string="model4";
            modelName="wm_model";
            let url="resource/scene/"+modelName+"/scene.gltf";
            let bundle=web3d.assetMgr.load(url,(asset,state)=>{
                if(state.beSucces)
                {
                    let obj=bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                    this.model=obj;
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
        private uiAtts:{frame:number}={frame:0};
        private uiShow()
        {
            let gui = new dat.GUI();
            gui.add(this.uiAtts, 'frame',0,1);

            this.addBtn("play",600,600,()=>{
                let anim=this.model.gameObject.getComponent(web3d.Animation.type) as web3d.Animation;
                anim.playAnimationByName("Take 001",0.3);
            });
        }
        start() 
        {
            this.load();
        }
        update(delta: number) 
        {
            if(this.model!=null)
            {
                let anim=this.model.gameObject.getComponent(web3d.Animation.type) as web3d.Animation;
                if(anim)
                {
                    anim.setFrame("Take 001",this.uiAtts.frame);
                }
            }
        }

        private addBtn(text: string,top:number,left:number,act: () => void)
        {
            let btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () =>
            {
                act();
            }
            btn.style.top = top + "px";
            btn.style.left = left + "px";
            btn.style.position = "absolute";
            web3d.app.container.appendChild(btn);
        }

    }
}