namespace dome
{
    export class DynamicFont implements IState
    {
        start() {

            let obj=new web3d.GameObject();
            let text3d=obj.addComponent("Text3d") as web3d.Text3d;
            text3d.textContent="hello world!"
            web3d.curScene.addChild(obj.transform);

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=15;
            camobj.transform.markDirty();


            let cube=new web3d.GameObject();
            let meshf=cube.addComponent<web3d.MeshFilter>("MeshFilter");
            let meshr=cube.addComponent<web3d.MeshRender>("MeshRender");
            meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
            meshr.material=web3d.assetMgr.getDefaultMaterial("def");
            web3d.curScene.addChild(cube.transform);
            cube.transform.addChild(obj.transform);

        }        
        update(delta: number) {

        }

        
    }

}