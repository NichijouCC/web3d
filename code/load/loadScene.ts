namespace dome
{
    export class loadScene implements IState {
        start() {

            let sceneName="lightmap";
            sceneName="Town";
             web3d.assetMgr.load("resource/scene/"+sceneName+"/"+sceneName+".scene.json",(state)=>{
                    let Scene=web3d.assetMgr.load("resource/scene/"+sceneName+"/"+sceneName+".scene.json")as web3d.SceneInfo;
                    web3d.curScene.addChild(Scene.root);
                    
                    web3d.renderContext.lightmap=Scene.lightMap;
                    web3d.curScene.enableLightMap();
                    
                    let camobj=new web3d.GameObject();
                    let cam=camobj.addComponent("Camera") as web3d.Camera;
                    camobj.addComponent("CameraController");
                    web3d.curScene.addChild(camobj.transform);
                    camobj.transform.localPosition[1]=10;
                    camobj.transform.localPosition[2]=10;
                    camobj.transform.markDirty();
                    // let eff=new web3d.Blur();
                    // cam.addPostEffect(eff);
                    
                    // tran2.localTranslate.y=10;
                    //camobj.transform.lookatPoint(MathD.vec3.create());

             })

        }
        update(delta: number) {

        }
    }
}