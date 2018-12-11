namespace component
{
    export class Text3d_html implements IState
    {
        private cube:web3d.Transform;
        start() {

            let obj=new web3d.GameObject();
            let text=obj.addComponent("Text3dHtml") as web3d.Text3dHtml;
            text.textContent="hello world!"
            obj.transform.localPosition=MathD.vec3.create(0.5,0.5,0.5);
            web3d.curScene.addChild(obj.transform);

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=15;
            camobj.transform.markDirty();


            let cube=new web3d.GameObject();
            this.cube=cube.transform;
            let meshf=cube.addComponent<web3d.MeshFilter>("MeshFilter");
            let meshr=cube.addComponent<web3d.MeshRender>("MeshRender");
            meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
            meshr.material=web3d.assetMgr.getDefaultMaterial("def");
            web3d.curScene.addChild(cube.transform);
            cube.transform.addChild(obj.transform);

        }
        private timer:number=0;
        update(delta: number) {
            this.timer+=delta*80;
            MathD.quat.FromEuler(45,45,this.timer,this.cube.localRotation);
            this.cube.markDirty();
        }

        
    }

}