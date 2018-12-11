namespace web3d
{
    export class SkyBox
    {
        private static beActived:boolean=false;
    
        private static texcube:CubeTexture;
        private static tex2d:Texture;
        private static enableRender2D:boolean=false;//是否适用2d图片作为背景
        private static trans:Transform;
        private static mat:Material;
    
        private static cubeShader:Shader;
        private static texShader:Shader;
        
        static init()
        {
            this.mat=new Material();
            this.cubeShader=assetMgr.load("resource/shader/skyCube.shader.json") as Shader;
            this.trans=new GameObject().transform;
            let meshf=this.trans.gameObject.addComponent("MeshFilter") as MeshFilter;
            let meshr=this.trans.gameObject.addComponent("MeshRender") as MeshRender;
            meshf.mesh=assetMgr.getDefaultMesh("cube");
            meshr.material=this.mat;
            this.trans.gameObject.beVisible=false;
            this.trans.gameObject.name="SkyBox";
            curScene.addChild(this.trans);
        }
    
        static setSkyCubeTexture(cubtex:CubeTexture)
        {
            this.texcube=cubtex;
            this.enableRender2D=false;
            this.mat.setShader(this.cubeShader);
            this.mat.setCubeTexture("_MainTex",cubtex);
        }
    
        static setSky2DTexture(tex:Texture)
        {
            this.tex2d=tex;
            this.enableRender2D=true;
            this.mat.setShader(this.texShader);
            this.mat.setTexture("_MainTex",tex);
        }
    
        static setActive(active:boolean)
        {
            this.beActived=active;
            this.trans.gameObject.beVisible=active;
            if(active)
            {
                curScene.addChild(this.trans);
            }
        }
    
    }
}

