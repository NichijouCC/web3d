namespace component
{
    export class UI_rawImage implements IState
    {
        private cube:web3d.Transform;
        start() {

            let obj=new web3d.Node2d();
            obj.transform2d.width=100;
            obj.transform2d.height=100;
            let image2d=obj.addComponent(web3d.RawImage2D.name);
            web3d.curScene.addChild(obj.transform2d);

        }
        update(delta: number) {

        }
    }

}