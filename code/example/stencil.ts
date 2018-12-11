
namespace dome{
    export class Stencil implements IState
    {

        private model:web3d.Transform;
        load()
        {
            this.uiShow();

            let url="resource/scene/Cube/scene.gltf";
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
        private uiShow()
        {
            
        }
        start() 
        {
            this.load();
        }
        update(delta: number) 
        {
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