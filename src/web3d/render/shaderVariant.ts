namespace web3d
{
    export class ShaderVariant
    {
        static AutoUniformDic:{[name:string]:any}={};
        static registAutoUniform()
        {
            this.AutoUniformDic["u_mat_model"]=()=>{return renderContext.matrixModel};
            this.AutoUniformDic["u_mat_view"]=()=>{return renderContext.matrixView};
            this.AutoUniformDic["u_mat_project"]=()=>{return renderContext.matrixProject};
            this.AutoUniformDic["u_mat_ModelView"]=()=>{return renderContext.matrixModelView};
            this.AutoUniformDic["u_mat_viewproject"]=()=>{return renderContext.matrixViewProject};
            this.AutoUniformDic["u_mat_mvp"]=()=>{return renderContext.matrixModelViewProject};
            this.AutoUniformDic["u_mat_ui"]=()=>{return renderContext2d.matrix_UI};
    
            this.AutoUniformDic["u_mat_normal"]=()=>{
                MathD.mat4.invert(renderContext.matrixModel,renderContext.matrixNormalToworld);
                MathD.mat4.transpose(renderContext.matrixNormalToworld,renderContext.matrixNormalToworld);
                return renderContext.matrixNormalToworld;
            };
            
            this.AutoUniformDic["u_timer"]=()=>{return GameTimer.Time};
    
            this.AutoUniformDic["u_campos"]=()=>{return renderContext.campos};
            this.AutoUniformDic["u_LightmapTex"]=()=>{
                return renderContext.lightmap[renderContext.lightmapIndex];};
            this.AutoUniformDic["u_lightmapOffset"]=()=>{return renderContext.lightmapTilingOffset};
            this.AutoUniformDic["u_lightposs"]=()=>{return renderContext.vec4LightPos};
            this.AutoUniformDic["u_lightdirs"]=()=>{return renderContext.vec4LightDir};
            this.AutoUniformDic["u_spotangelcoss"]=()=>{return renderContext.floatLightSpotAngleCos};
            this.AutoUniformDic["u_jointMatirx"]=()=>{return renderContext.jointMatrixs};
            
            
        }
    }
}
