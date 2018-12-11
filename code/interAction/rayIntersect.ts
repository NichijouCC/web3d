namespace dome_ray
{
    /**
     * 鼠标左键点击屏幕发射射线，检测是否碰到盒子
     */
    export class rayIntersect implements IState
    {
        target:web3d.Transform;
        targetMesh:web3d.Mesh;
        start() {
            let obj=web3d.DebugTool.createCube();
            this.target=obj;
            this.targetMesh=obj.gameObject.getComponent<web3d.MeshFilter>(web3d.MeshFilter.type).mesh;
            web3d.curScene.addChild(obj);

            let camobj=new web3d.GameObject();
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            // cam.near=5;
            camobj.addComponent("CameraController");
            camobj.transform.localPosition=MathD.vec3.create(15,15,15);
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.lookat(this.target);

            // let tir=new web3d.Mesh();
            // tir.setVertexData(webGraph.VertexAttTypeEnum.Position,[0,0,0,10,0,0,0,0,10]);
            // tir.setIndexData([0,1,2]);

            // let obj2=web3d.DebugTool.createCube();
            // obj2.gameObject.getComponent<web3d.MeshFilter>(web3d.MeshFilter.type).mesh=tir;
            // web3d.curScene.addChild(obj2);
        }        
        
        update(delta: number) 
        {
            if(web3d.Input.getMouseDown(web3d.MouseKeyEnum.Left))
            {
                let ray=web3d.Camera.Main.screenPointToRay(web3d.Input.mousePosition);

                // let mat=MathD.mat4.create();
                // MathD.mat4.invert(this.taret.worldMatrix,mat);
                // MathD.mat4.transformPoint(,);

                if(web3d.Physics.rayIntersectMesh(ray.origin,ray.direction,this.targetMesh))
                {
                    let endpos=MathD.vec3.create();
                    MathD.vec3.scale(ray.direction,100,endpos);
                    let trans=web3d.DebugTool.drawLine(ray.origin,endpos);
                    web3d.curScene.addChild(trans);

                    let mat=this.target.gameObject.getComponent<web3d.MeshRender>(web3d.MeshRender.type).materials[0];
                    mat.setColor("_MainColor",MathD.color.create(1,0,0,1));
                    setTimeout(() => {
                        mat.setColor("_MainColor",MathD.color.create(1,1,1,1));
                    }, 100);
                }
            }
        }

        
    }
}