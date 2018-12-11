namespace dome
{
    export class KeyInput implements IState
    {
        target:web3d.Transform;
        cam:web3d.Transform;
        start() {

            let floor=web3d.DebugTool.createCube();
            floor.localScale=MathD.vec3.create(10,0.1,10);
            web3d.curScene.addChild(floor);


            let cube=web3d.DebugTool.createCube();
            this.target=cube;
            web3d.curScene.addChild(cube);

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition=MathD.vec3.create(0,15,15);
            camobj.transform.markDirty();
            this.cam=camobj.transform;
            this.cam.lookat(this.target);
        }
        private deltaMove:number=0.1;
        update(delta: number) {

            

            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.A))
            {
                this.target.localPosition.x-=this.deltaMove;
                this.target.markDirty();
            }
            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.D))
            {
                this.target.localPosition.x+=this.deltaMove;
                this.target.markDirty();
            }            
            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.W))
            {
                this.target.localPosition.z-=this.deltaMove;
                this.target.markDirty();
            }            
            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.S))
            {
                this.target.localPosition.z+=this.deltaMove;
                this.target.markDirty();
            }

        }


    }
}