namespace Render
{
    export class VaoTest implements IState
    {
        transList:web3d.Transform[]=[];
        init()
        {
            let tex1=web3d.assetMgr.load("resource/texture/def1.png") as web3d.Texture;
            let tex2=web3d.assetMgr.load("resource/texture/def2.png") as web3d.Texture;
            // let tex3=web3d.assetMgr.load("resource/mat/2.jpg") as web3d.Texture;


            let shader1=web3d.assetMgr.load("resource/shader/diffuse.shader.json") as web3d.Shader;
            let mat2=new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex",tex1);
            mat2.setVector4("_MainColor",MathD.vec4.create(0.9,0.5,0.5,1));


            let mat3=new web3d.Material();
            mat3.setShader(shader1);
            mat3.setTexture("_MainTex",tex1);
            mat3.setVector4("_MainColor",MathD.vec4.create(0.5,0.5,0.9,1));


            for(let k=0;k<20;k++)
            {
                for(let i=-10;i<=10;i++)
                {
                    for(let j=-10;j<=10;j++)
                    {
                        let obj=new web3d.GameObject();
                        let meshf=obj.addComponent<web3d.MeshFilter>("MeshFilter");
                        let meshr=obj.addComponent<web3d.MeshRender>("MeshRender");

                        meshf.mesh=web3d.assetMgr.getDefaultMesh("cube");
                        meshr.material=Math.random()>0.5?mat2:mat3;
                        
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0]=i*2;
                        obj.transform.localPosition[1]=j*2;
                        obj.transform.localPosition[2]=k*2;

                        let scale=MathD.random(0.3,1.3);
                        obj.transform.localScale=MathD.vec3.create(scale,scale,scale);

                        this.transList.push(obj.transform);
                    }
                }
            }

            let camobj=new web3d.GameObject();
            camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2]=50;
            camobj.transform.markDirty();

            this.camTrans=camobj.transform;

            this.btn=this.addBtn("开启Vao",100,300,()=>{
                this.beuseVao=!this.beuseVao;
                webGraph.render.BeUseVao=this.beuseVao;
                this.btn.textContent=this.beuseVao?"关闭VAO":"开启VAO"
            });
        }""

        start() 
        {
            this.init();
        }


        camTrans:web3d.Transform;
        time:number=0;
        private beuseVao:boolean=false;
        update(delta: number) {
            this.time+=delta;
            for(let i=0;i<this.transList.length;i++)
            {
                let tran=this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP,this.time,tran.localRotation);
                tran.markDirty();
            }
        }
        private btn:HTMLButtonElement;
        private addBtn(text: string,x:number,y:number,act: () => void):HTMLButtonElement
        {
            let btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () =>
            {
                act();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            web3d.app.container.appendChild(btn);
            return btn;
        }

    }
    
}