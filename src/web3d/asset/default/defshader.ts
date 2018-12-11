namespace web3d
{
    export class DefShader
    {
        static UI_vscode: string = "\
        attribute vec2 a_pos;   \
        attribute vec4 a_texcoord0;         \
        uniform highp mat3 u_mat_ui;      \
        varying highp vec2 xlv_TEXCOORD0;           \
        void main()                                     \
        {                                               \
            highp vec3 tmplet_1=u_mat_ui*vec3(a_pos,1.0);                        \
            xlv_TEXCOORD0 = a_texcoord0.xy;     \
            gl_Position = vec4(tmplet_1,1.0);  \
        }";
    
        static UI_fscode: string = "         \
        uniform sampler2D _MainTex;                                                 \
        varying highp vec2 xlv_TEXCOORD0;   \
        void main() \
        {\
            lowp vec4 tmplet_3= texture2D(_MainTex, xlv_TEXCOORD0);\
            gl_FragData[0] = tmplet_3;\
        }\
        ";
    
        static vs_color:string = "\
        attribute vec4 a_pos;\
        uniform highp mat4 u_mat_mvp;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz = a_pos.xyz;\
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
        static fs_color:string = "\
        uniform highp vec4 _MainColor;\
        void main()\
        {\
            gl_FragData[0] = _MainColor;\
        }";

        static vs_color_skin="\
        attribute vec4 a_pos;\
        uniform highp mat4 u_mat_viewproject;\
        attribute lowp vec4 a_blendindex4;\
        attribute lowp vec4 a_blendweight4;\
        uniform highp mat4 u_jointMatirx[55];\
        highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)\
        {\
            mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x \
                     + u_jointMatirx[int(blendIndex.y)]*blendWeight.y \
                     + u_jointMatirx[int(blendIndex.z)]*blendWeight.z \
                     + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;\
            return mat;\
        }\
        void main()\
        {\
            highp vec4 position=vec4(a_pos.xyz,1.0);\
            position = u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;;\
            gl_Position =position;\
        }";

        static vsColor:string = "\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_mvp;\
        varying highp vec2 xlv_TEXCOORD0;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz = a_pos.xyz;\
            xlv_TEXCOORD0 = a_texcoord0.xy;     \
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
    
        static text3d:string = "\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_project;\
        varying highp vec2 xlv_TEXCOORD0;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz =a_pos.xyz;\
            xlv_TEXCOORD0 = a_texcoord0.xy;\
            gl_Position = u_mat_project* tmplet_1;\
        }";
        static vscolor_skin="\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_viewproject;\
        varying highp vec2 xlv_TEXCOORD0;\
        attribute lowp vec4 a_blendindex4;\
        attribute lowp vec4 a_blendweight4;\
        uniform highp mat4 u_jointMatirx[55];\
        highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)\
        {\
            mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x \
                     + u_jointMatirx[int(blendIndex.y)]*blendWeight.y \
                     + u_jointMatirx[int(blendIndex.z)]*blendWeight.z \
                     + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;\
            return mat;\
        }\
        void main()\
        {\
            highp vec4 position=vec4(a_pos.xyz,1.0);\
            xlv_TEXCOORD0 = a_texcoord0.xy;\
            position = u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;;\
            gl_Position =position;\
        }";
    
        static fsColor:string = "\
        uniform sampler2D _MainTex;\
        uniform highp vec4 _MainColor;\
        varying highp vec2 xlv_TEXCOORD0;   \
        void main()\
        {\
            lowp vec4 tmplet_3= (_MainColor * texture2D(_MainTex, xlv_TEXCOORD0));\
            gl_FragData[0] = tmplet_3;\
        }";
    
        static def_error_vs:string="\
        attribute vec3 a_pos;\
        uniform highp mat4 u_mat_mvp;\
        void main()\
        {\
            highp vec4 tmplet_1=vec4(a_pos.xyz,1.0);\
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
    
        static def_error_fs:string="\
        void main()\
        {\
            gl_FragData[0] = vec4(1,0,0,1);\
        }";
    
    
        static add_vs:string="\
        attribute highp vec3 a_pos;\
        //attribute lowp vec4 a_color;\
        attribute mediump vec2 a_texcoord0;\
        uniform highp mat4 u_mat_mvp;\
        uniform mediump vec4 _MainTex_ST;\
        uniform mediump vec4 _Mask_ST;\
        uniform mediump vec4 _Main_Color;\
        varying mediump vec2 _maintex_uv;\
        varying mediump vec2 _mask_uv;\
        varying lowp vec4 v_color;\
        void main()\
        {\
            _maintex_uv = a_texcoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\
            _mask_uv = a_texcoord0.xy * _Mask_ST.xy + _Mask_ST.zw;\
            v_color =_Main_Color;\
            gl_Position = (u_mat_mvp * vec4(a_pos.xyz, 1.0));\
        }"
        static add_fs:string="\
        uniform sampler2D _MainTex; \
        uniform sampler2D _Mask; \
        varying lowp vec4 v_color;\
        varying mediump vec2 _maintex_uv;\
        varying mediump vec2 _mask_uv;\
        void main()\
        {\
            lowp vec4 basecolor=texture2D(_MainTex,_maintex_uv);\
            lowp vec4 mask_color=texture2D(_Mask,_mask_uv);\
            lowp vec3 tempcolor=v_color.rgb*basecolor.rgb*2.0;\
            //lowp vec3 tempcolor=v_color.rgb*basecolor.rgb*4.0*basecolor.a;\
            lowp float tempAlpha=basecolor.a*v_color.a*2.0;\
            gl_FragData[0]=vec4(tempcolor,tempAlpha);\
        }"
    
        static initDefaultShader()
        {
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"defui",DefShader.UI_vscode);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS,"defui",DefShader.UI_fscode);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"def",DefShader.vsColor);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"text3d",DefShader.text3d);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS,"def",DefShader.fsColor);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"def_skin",DefShader.vscolor_skin);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"deferror",DefShader.def_error_vs);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS,"deferror",DefShader.def_error_fs);
    
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"defcolor",DefShader.vs_color);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS,"defcolor_skin",DefShader.vs_color_skin);
            assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS,"defcolor",DefShader.fs_color);


            // shaderMgr.CreatShader(ShaderTypeEnum.VS,"add",DefShader.add_vs);
            // shaderMgr.CreatShader(ShaderTypeEnum.FS,"add",DefShader.add_fs);
            {
                let sh = new Shader("defui",null,true);
                let pro=assetMgr.shaderMgr.CreatProgram("defui","defui","base");
                let option=new webGraph.StateOption();
                option.setZstate(false,false);
                pro.state=option;
                let p = new ShaderPass();
                p.program.push(pro);
                sh.passes={};
                sh.mapUniformDef={};
                sh.layer=RenderLayerEnum.Geometry;
                let tex=assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"]={type:webGraph.UniformTypeEnum.TEXTURE,value:tex};
                sh.passes[DrawTypeEnum.BASE] =p;
    
                assetMgr.mapShader[sh.name] = sh;
    
            }
    
            {
                let sh = new Shader("def",null,true);
                let pro=assetMgr.shaderMgr.CreatProgram("def","def","base");
                let option=new webGraph.StateOption();
                // option.setZstate(true,true);
                pro.state=option;
                let p = new ShaderPass();
                p.program.push(pro);
                // sh["_passes"]={};
                // sh["_mapUniformDef"]={};
                // sh["_layer"]=RenderLayerEnum.Geometry;
                sh.passes={};
                sh.mapUniformDef={};
                sh.layer=RenderLayerEnum.Geometry;
                let tex=assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"]={type:webGraph.UniformTypeEnum.TEXTURE,value:tex};
                sh.mapUniformDef["_MainColor"]={type:webGraph.UniformTypeEnum.FLOAT_VEC4,value:MathD.vec4.create(0,1,0,1)};
                sh.passes[DrawTypeEnum.BASE] =p;
    
                let skinpro=assetMgr.shaderMgr.CreatProgram("def_skin","def","skin");
                skinpro.state=option;
                let skinpass = new ShaderPass();
                skinpass.program.push(skinpro);
                sh.passes[DrawTypeEnum.SKIN] =skinpass;
    
                assetMgr.mapShader[sh.name] = sh;
    
            }
            {
                let sh = new Shader("defcolor",null,true);
                let pro=assetMgr.shaderMgr.CreatProgram("defcolor","defcolor","base");
                let option=new webGraph.StateOption();
                // option.setZstate(true,true);
                pro.state=option;
                let p = new ShaderPass();
                p.program.push(pro);
                // sh["_passes"]={};
                // sh["_mapUniformDef"]={};
                // sh["_layer"]=RenderLayerEnum.Geometry;
                sh.passes={};
                sh.mapUniformDef={};
                sh.layer=RenderLayerEnum.Geometry;

                sh.passes[DrawTypeEnum.BASE] =p;
    
                let skinpro=assetMgr.shaderMgr.CreatProgram("defcolor_skin","defcolor","skin");
                skinpro.state=option;
                let skinpass = new ShaderPass();
                skinpass.program.push(skinpro);
                sh.passes[DrawTypeEnum.SKIN] =skinpass;
    
                assetMgr.mapShader[sh.name] = sh;
    
            }
            {
                let sh = new Shader("text3d",null,true);
                let pro=assetMgr.shaderMgr.CreatProgram("text3d","def","base");
                let option=new webGraph.StateOption();
                option.setBlend(webGraph.BlendModeEnum.Blend_PreMultiply);
                option.setZstate(false,false);
                pro.state=option;
    
                let p = new ShaderPass();
                p.program.push(pro);
                // sh["_passes"]={};
                // sh["_mapUniformDef"]={};
                // sh["_layer"]=RenderLayerEnum.Geometry;
                sh.passes={};
                sh.mapUniformDef={};
                sh.layer=RenderLayerEnum.Geometry;
                let tex=assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"]={type:webGraph.UniformTypeEnum.TEXTURE,value:tex};
                sh.mapUniformDef["_MainColor"]={type:webGraph.UniformTypeEnum.FLOAT_VEC4,value:MathD.vec4.create(1,1,1,1)};
                sh.passes[DrawTypeEnum.BASE] =p;
    
                assetMgr.mapShader[sh.name] = sh;
    
            }
            // {
            //     let sh = new Shader("shader/defcolor",true);
            //     sh.beDefaultAsset = true;
            //     let pro=shaderMgr.CreatProgram("defcolor","defcolor");
            //     let option=new StateOption();
            //     let p = new ShaderPass(pro,option);
            //     sh.passes={};
            //     sh.mapUniformDef={};
            //     sh.layer=RenderLayerEnum.Geometry;
            //     let tex=assetMgr.getDefaultTexture("grid");
            //     sh.mapUniformDef["_MainTex"]=new UniformData(UniformTypeEnum.SAMPLER_2D,tex);
            //     sh.passes[drawTypeEnum.BASE] =p;
            //     assetMgr.mapShader[sh.name] = sh;
            // }
            {
                let sh = new Shader("deferror",null,true);
                let pro=assetMgr.shaderMgr.CreatProgram("deferror","deferror","base");
                pro.state=new webGraph.StateOption();
                let p = new ShaderPass();
                p.program.push(pro);
                // sh["_passes"]={};
                // sh["_mapUniformDef"]={};
                // sh["_layer"]=RenderLayerEnum.Geometry;
                sh.passes={};
                sh.mapUniformDef={};
                sh.layer=RenderLayerEnum.Geometry;
                sh.passes[DrawTypeEnum.BASE] =p;
                assetMgr.mapShader[sh.name] = sh;
            }
            // {
            //     let sh = new Shader("shader/add");
            //     sh.beDefaultAsset = true;
            //     let pro=shaderMgr.CreatProgram("add","add");
            //     let option=new StateOption();
            //     option.setCullingFace(CullingFaceEnum.ALL);
            //     option.setZstate(false,false);
            //     option.setBlend(BlendModeEnum.Add);
            //     let p = new ShaderPass(pro,option);
            //     sh.passes["base"] =p;
            //     assetMgr.mapShader[sh.name] = sh;
            // }
        }
    }
}
