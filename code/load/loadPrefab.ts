namespace dome
{
    export class loadPrefab implements IState {
        start() {

            let prefabName="elong";
            prefabName="Cube";
            prefabName="Plane";
            prefabName="chos_town_001";
            prefabName="GameObject";
            web3d.assetMgr.load("resource/prefab/"+prefabName+"/"+prefabName+".prefab.json",(state)=>{
                    let prefab=web3d.assetMgr.load("resource/prefab/"+prefabName+"/"+prefabName+".prefab.json")as web3d.Prefab;
                    let ob0=prefab.instantiate();
                    web3d.curScene.addChild(ob0);
                    //web3d.curScene.addChild(prefab.root);
                    
                    // ob2.translate(4,0,0);
                    // web3d.curScene.addChild(ob2);

                    let camobj=new web3d.GameObject();
                    let cam=camobj.addComponent("Camera") as web3d.Camera;
                    camobj.addComponent("CameraController");
                    web3d.curScene.addChild(camobj.transform);
                    camobj.transform.localPosition[2]=-10;
                    // camobj.transform.lookat(ob0);
                    // let eff=new web3d.Blur();
                    // cam.addPostEffect(eff);
                    
                    // tran2.localTranslate.y=10;
                    // tran2.lookatPoint(new mathD.Vector3());

                    // let ani=prefab.root.gameObject.getComponent<web3d.Animator>(web3d.Animator);
                    // if(ani)
                    // {
                    //     ani.playAniclipByIndex(0);
                    // }
                    

             })

        }
        update(delta: number) {

        }
    }
}