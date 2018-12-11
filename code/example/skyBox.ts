namespace dome
{
    export class Skybox implements IState
    {
        start() {
            this.initSky();
        }
        update(delta: number) {
        }
        initSky()
        {
            web3d.curScene.enableSkyBox();
            let e_Diff: web3d.CubeTexture = new web3d.CubeTexture();
            let e_DiffArr = [];
            e_DiffArr.push("resource/texture/papermill/environment/environment_right_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_left_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_top_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_bottom_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_front_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_back_0.jpg");
            e_Diff.groupCubeTexture(e_DiffArr);
            web3d.SkyBox.setSkyCubeTexture(e_Diff);

            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 10;
            camobj.transform.markDirty();
        }
    }
}