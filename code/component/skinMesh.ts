
namespace component{
    export class skinDome implements IState
    {
        load()
        {

            let url="resource/glTF/CesiumMan/glTF/CesiumMan.gltf";
            // url="resource/glTF/CesiumMan/glTF-Binary/CesiumMan.glb";

            //url="resource/glTF/RobotExpressive/RobotExpressive.glb";
            let bundle=web3d.assetMgr.load(url,(asset,state)=>{
                if(state.beSucces)
                {
                    let obj=bundle.Instantiate();
                    // obj.localEuler=MathD.vec3.create(0,-60,0);
                    web3d.curScene.addChild(obj);
                }
            }) as web3d.glTFBundle;


            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition=MathD.vec3.create(2,2,5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);
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