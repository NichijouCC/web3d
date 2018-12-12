namespace web3d
{
    export class RenderContext
    {  
        activeTexCount:number=0;
    
        viewPortPixel: MathD.Rect = new MathD.Rect(0, 0, 0, 0);//像素的viewport
        campos: MathD.vec3;
    
        matrixModel: MathD.mat4;
        matrixNormalToworld: MathD.mat4=MathD.mat4.create();
        matrixModelView: MathD.mat4= MathD.mat4.create();
        matrixModelViewProject: MathD.mat4 = MathD.mat4.create();
        
        matrixView: MathD.mat4;
        matrixProject: MathD.mat4;
        matrixViewProject: MathD.mat4;
        
        //matrixNormal: matrix = new matrix();
        //最多8灯，再多不管
        intLightCount: number = 0;
        vec4LightPos: Float32Array = new Float32Array(32);
        vec4LightDir: Float32Array = new Float32Array(32);
        floatLightSpotAngleCos: Float32Array = new Float32Array(8);
    
        lightmap: Texture[] = null;
        // lightmapUV: number = 1;
        // lightmapOffset: MathD.vec4 = vec4.create(1, 1, 0, 0);
    
        curMat:Material;
        curPorgram:webGraph.ShaderProgram;//同一个mat，在加载完成前和完成后shader并不相同。
        curMesh:GlMesh;
        curRender:IRender;
        curCamera:Camera;
    
        //----------------------frame data
        lightmapIndex:number;
        lightmapTilingOffset: MathD.vec4;
        // jointMatrixs:Float32Array;
        //-------------
        updateCamera(camera: Camera)
        {
            this.curCamera=camera;
            this.matrixView=camera.ViewMatrix;
            this.matrixProject=camera.ProjectMatrix;
            this.matrixViewProject=camera.ViewProjectMatrix;
            this.campos=camera.gameObject.transform.worldPosition;
        }
    
        updateOverlay()
        {
            MathD.mat4.identity(this.matrixModelViewProject);
        }
        updateModel(model: Transform)
        {
            this.matrixModel=model.worldMatrix;
            MathD.mat4.multiply(this.matrixView, this.matrixModel, this.matrixModelView);
            MathD.mat4.multiply(this.matrixViewProject, this.matrixModel, this.matrixModelViewProject);
        }

        updateModeTrail()
        {
            MathD.mat4.copy(this.matrixView, this.matrixModelView);
            MathD.mat4.copy(this.matrixViewProject, this.matrixModelViewProject);
        }
    
    }
}
