namespace dome
{
    export class LooKAt implements IState
    {
        private centerObj:web3d.GameObject;
        private otherObjs:web3d.Transform[]=[];
        start() {
            let tex1=web3d.assetMgr.load("resource/texture/def1.png") as web3d.Texture;
            let mat1=new web3d.Material();
            let shader=web3d.assetMgr.getShader("def") as web3d.Shader;
            mat1.setShader(shader);
            mat1.setTexture("_MainTex",tex1);
            mat1.setVector4("_MainColor",MathD.vec4.create(1,1,1,1));


            let objCount:number=6;
            let radius=6;
            for(let i=0;i<6;i++)
            {
                let obj=new web3d.GameObject();
                let meshf=obj.addComponent<web3d.MeshFilter>("MeshFilter");
                let meshr=obj.addComponent<web3d.MeshRender>("MeshRender");
                meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
                meshr.material=mat1;
                obj.transform.localPosition=MathD.vec3.create(radius*Math.cos(Math.PI*2*i/objCount),0,radius*Math.sin(Math.PI*2*i/objCount));
                web3d.curScene.addChild(obj.transform);
                this.otherObjs.push(obj.transform);
            }


            let mat2=new web3d.Material();
            mat2.setShader(shader);
            mat2.setTexture("_MainTex",tex1);
            mat2.setVector4("_MainColor",MathD.vec4.create(1,0,0,1));

            let obj1=new web3d.GameObject();
            this.centerObj=obj1;
            web3d.curScene.addChild(obj1.transform);
            let meshf=obj1.addComponent<web3d.MeshFilter>("MeshFilter");
            let meshr=obj1.addComponent<web3d.MeshRender>("MeshRender");
            meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
            meshr.material=mat2;

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=50;
            camobj.transform.markDirty();

        }
        private timer:number=0;
        update(delta: number) {
            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.Z))
            {
                this.centerObj.transform.localPosition[1]+=0.1;
                this.centerObj.transform.markDirty();
            }
            if(web3d.Input.getKeyDown(web3d.KeyCodeEnum.X))
            {
                this.centerObj.transform.localPosition[1]-=0.1;
                this.centerObj.transform.markDirty();
            }

            this.timer+=delta;
            this.centerObj.transform.localPosition[1]=Math.sin(this.timer)*10;
            this.centerObj.transform.markDirty();

            for(let i=0;i<this.otherObjs.length;i++)
            {
                this.otherObjs[i].lookat(this.centerObj.transform);
            }
        }
    }
}