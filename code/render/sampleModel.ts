
namespace Render{
    export class sampleModel implements IState
    {
        load()
        {
            web3d.glTFBundle.BeUsePBRMaterial=true;

            let url="resource/glTF/FlightHelmet/FlightHelmet.gltf";
            let bundle=web3d.assetMgr.load(url,(asset,state)=>{
                if(state.beSucces)
                {
                    let obj=bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                }
            }) as web3d.glTFBundle;

            let camobj=new web3d.GameObject();
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition=MathD.vec3.create(0,0,2);
        }

        start() 
        {
            this.load();
        }
        update(delta: number) 
        {


        }

    }
}