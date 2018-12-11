///<reference path="../../util/reflect.ts" />

namespace web3d
{
    /**
     * 2d图片组件</p>
     * 参照UGUI的思路，rawImage只拿整个图片来显示，不关心Sprite、九宫、填充等。这些统一都在iamge中处理
     */
    @NodeComponent2d
    export class RawImage2D implements IRectRenderer
    {
        constructor()
        {
            this.mat=new Material();
            this.mat.setShader(assetMgr.getShader("defui"));
        }
        node2d: Node2d;

        private _image: Texture;
        get image():Texture
        {
            return this._image;
        }
        set image(value:Texture)
        {
            this._image=value;
            this.mat.setTexture("_MainTex",this._image);
        }
        color:MathD.color=MathD.color.create();
        // private static readonly defUIShader = "defui";
        private mat:Material;

        render(canvas: Canvas)
        {
            renderContext2d.updateModel(this.node2d.transform2d);

            let program=this.mat.getShaderPass(DrawTypeEnum.BASE).program[0];
            let mesh=assetMgr.getDefaultMesh("UI_base");
            let submesh=mesh.submeshs[0];

            webGraph.render.bindProgram(program);
            webGraph.render.bindMeshData(mesh.glMesh,program);
            webGraph.render.applyMatUniforms(program,ShaderVariant.AutoUniformDic,this.mat.UniformDic,this.mat.getShader().mapUniformDef);
            webgl.drawElements(submesh.renderType,submesh.size,webgl.UNSIGNED_SHORT,submesh.start);
        }

        uploadMeshData()
        {

        }
        
        start()
        {

        }
        update(delta: number)
        {

        }
        
        dispose() {
            
        }
    }
}
