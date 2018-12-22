/// <reference path="../../mathD/color.ts" />
namespace webGraph
{
    export class render
    {
        static BeUseVao:boolean=false;
        /**
         * vbo、ebo cache
         */
        static BeUseMeshDataCache:boolean=true;
        static BeUseUniformCache:boolean=false;
        static BeUseProgramCache:boolean=true;
        //------------texture unit cache
        //------------viewport cache
        private static _viewportCached:{x:number,y:number,w:number,h:number}={x:undefined,y:undefined,w:undefined,h:undefined};
        static viewPort(x:number,y:number,w:number,h:number)
        {
            if(x!=this._viewportCached.x||y!=this._viewportCached.y||w!=this._viewportCached.w||h!=this._viewportCached.h)
            {
                rendingWebgl.viewport(x,y,w,h);
                this._viewportCached.x=x;
                this._viewportCached.y=y;
                this._viewportCached.w=w;
                this._viewportCached.h=h;
            }
        }
        
        private static _colorcached:MathD.color=MathD.color.create();
        private static _depthcached:number;
        private static _stencilcached:number;
        static clears(clearcolor:boolean,color:MathD.color,cleardepth:boolean,depth:number,clearStencil:boolean,stencil:number)
        {
            let cleartype=0;
            if(clearcolor)
            {
                if(!MathD.color.equals(this._colorcached,color))
                {
                    MathD.color.copy(color,this._colorcached);
                    rendingWebgl.clearColor(color[0], color[1], color[2], color[3]);
                }
                cleartype=cleartype|rendingWebgl.COLOR_BUFFER_BIT;
            }
            if(cleardepth)
            {
                if(depth!=this._depthcached)
                {
                    this._depthcached=depth;
                    rendingWebgl.clearDepth(depth);
                }
                cleartype=cleartype|rendingWebgl.DEPTH_BUFFER_BIT;
            }
            if(clearStencil)
            {
                if(stencil!=this._stencilcached)
                {
                    this._stencilcached=stencil;
                    rendingWebgl.clearStencil(stencil);
                }
                cleartype=cleartype=cleartype|rendingWebgl.STENCIL_BUFFER_BIT;
            }
            rendingWebgl.clear(cleartype);
        }

        static clearColor(color:MathD.color)
        {
            if(!MathD.color.equals(this._colorcached,color))
            {
                MathD.color.copy(color,this._colorcached);
                rendingWebgl.clearColor(color[0], color[1], color[2], color[3]);
            }
            rendingWebgl.clear(rendingWebgl.COLOR_BUFFER_BIT);
        }

        static clearDepth(depth:number)
        {
            if(depth!=this._depthcached)
            {
                this._depthcached=depth;
                rendingWebgl.clearDepth(depth);
            }
            rendingWebgl.clear(rendingWebgl.DEPTH_BUFFER_BIT);
        }

        static clearStencil(stencil:number)
        {
            if(stencil!=this._stencilcached)
            {
                this._stencilcached=stencil;
                rendingWebgl.clearStencil(stencil);
            }
            rendingWebgl.clear(rendingWebgl.STENCIL_BUFFER_BIT);
        }
        
        static drawMeshNow(mesh:BaseMesh,matindex:number=0,matrix:MathD.mat4=MathD.mat4.Identity)
        {
            this.bindMeshData(mesh,this._programCached);
            let subinfo=mesh.submeshs[matindex];
            if(subinfo.beUseEbo)
            {
                // rendingWebgl.drawElements(,);
            }
        }


        static bindMeshAndProgram(mesh:BaseMesh,program:ShaderProgram)
        {
            this.bindProgram(program);
            this.bindMeshData(mesh,program);
        }
        
        static _programCached:ShaderProgram;
        static bindProgram(program:ShaderProgram)
        {
            if(this.BeUseProgramCache&&this._programCached!=program)
            {
                this._programCached=program;
                program.attach();
            }else
            {
                program.attach();
            }

            renderstateMgr.applyRenderState(program.state);
        }
        /**
         * uniform 传参
         */
        static applyMatUniforms(program:ShaderProgram,SetValueDic:{[uniform:string]:any})
        {
            UniformSetter.texIndex=0;
            if(this.BeUseUniformCache)
            {
                this.applyUniformsWithCache(program,SetValueDic);
            }else
            {
                this.applyUniformsDirectly(program,SetValueDic);
            }
        }
        private static applyUniformsDirectly(program:ShaderProgram,SetValueDic:{[uniform:string]:any})
        {
            // for(let key in program.uniformDic)
            // {
            //     let uniformValue:any=SetValueDic[key];
                
            //     program.applyUniform(key,uniformValue);
            // }

            for(let key in SetValueDic)
            {
                if(program.uniformDic[key]!=null)
                {
                    program.applyUniform(key,SetValueDic[key]);
                }
            }
        }
        private static applyUniformsWithCache(program:ShaderProgram,SetValueDic:{[uniform:string]:any})
        {
            // for(let key in program.uniformDic)
            // {
            //     let uniformValue:any=SetValueDic[key];
            //     program.applyUniformWithCache(key,uniformValue);
            // }

            for(let key in SetValueDic)
            {
                if(program.uniformDic[key]!=null)
                {
                    program.applyUniformWithCache(key,SetValueDic[key]);
                }
            }
        }
    
        /**
         * bind vbo、ebo、vertexattributepointer(描述vbo数据的构成)
         */
        static bindMeshData(mesh:BaseMesh,program?:ShaderProgram,extralData?:{[attType:string]:VertexAttribute})
        {
            program=program||this._programCached;
            if(GLExtension.hasVAOExt&&this.BeUseVao)
            {
                this.bindMeshDataWithVao(mesh,program);
            }else
            {
                if(this.BeUseMeshDataCache)
                {
                    this.bindMeshDataWithCache(mesh,program,extralData||{});
                }else
                {
                    this.bindMeshDataDirectly(mesh,program,extralData||{});
                }
            }
        }
        static bindMeshDataDirectly(mesh:BaseMesh,program:ShaderProgram,extralData?:{[attType:string]:VertexAttribute})
        {
            let dic=program.attribDic;
            mesh.vbo.attach();
            for(let key in dic)
            {
                this.applyAttribute(mesh.VertexAttDic[key]||extralData[key]);
            }
            if(mesh.ebo)
            {
                mesh.ebo.attach();
            }
        }
        static bindMeshDataWithCache(mesh:BaseMesh,program:ShaderProgram,extralData?:{[attType:string]:VertexAttribute})
        {
            let dic=program.attribDic;
            mesh.vbo.attachWithCache();
            for(let key in dic)
            {
                AttributeSetter.applyAttribute(mesh.VertexAttDic[key]||extralData[key]);
            }
            if(mesh.ebo)
            {
                mesh.ebo.attachWithCache();
            }
        }
        //----------------------mesh vao
        private static bindMeshDataWithVao(mesh:BaseMesh,program:ShaderProgram)
        {
            if(mesh.vaoDic[program.ID]==null)
            {
                mesh.vaoDic[program.ID]=this.creatVertexArrayObject(mesh,program);
            }
            mesh.vaoDic[program.ID].attach();
        }
        private static creatVertexArrayObject(mesh:BaseMesh,program:ShaderProgram):VAO
        {
            let vao=new VAO();
            vao.attach();
            this.bindMeshDataDirectly(mesh,program);
            mesh.ebo.attach();
            return vao;
        }
    
        static BindeVertexData(value:VertexAttribute)
        {
            value.vbo.attach();
            AttributeSetter.applyAttribute(value);
            if(value.beInstanceAtt)
            {
                rendingWebgl.vertexAttribDivisor(value.location,1);
            }
        }
        static applyAttribute(value:VertexAttribute)
        {
            value.vbo.attachWithCache();
            AttributeSetter.applyAttribute(value);
            if(value.beInstanceAtt)
            {
                rendingWebgl.vertexAttribDivisor(value.location,1);
            }
        }
    
    }
}

