namespace web3d
{
    export class Graphics
    {

        static bindShaderPass(pass:ShaderPass,programIndex:number=0,uniformDic:{[id:string]:any},defUniform:{[id:string]:any})
        {
            let program=pass.program[programIndex];
            if(program==null)
            {
                this.bindMat(assetMgr.getDefaultMaterial("defcolor"),pass.drawtype,programIndex);
                return;
            }
            webGraph.render.bindProgram(program);
            webGraph.render.applyMatUniforms(program,ShaderVariant.AutoUniformDic,uniformDic,defUniform);
        }

        static bindMat(mat:Material,drawType:DrawTypeEnum,programIndex:number=0)
        {
            if(mat==null)
            {
                // this.bindMat(assetMgr.getDefaultMaterial("defcolor"),drawType,programIndex);
                return;
            }
            let shader=mat.getShader();
            if(shader==null)
            {
                shader=assetMgr.getShader("defcolor");
                return;
            }
            let pass=shader.getPass(drawType);
            if(pass==null)
            {
                shader=assetMgr.getShader("defcolor");
                pass=shader.getPass(drawType);
            }
            this.bindShaderPass(pass,programIndex,mat.UniformDic,shader.mapUniformDef); 
        }

        static drawSubMesh(mesh:Mesh,mat:Material,matrix:MathD.mat4=null,drawType:DrawTypeEnum=null,layer:LayerMask=null,submeshIndex:number=null,cam:Camera=null)
        {
            if(mesh==null||mat==null) return;
            renderMgr.renderlist.addRenderItem({ mesh:mesh,
                                            matrix:matrix||MathD.mat4.Identity,
                                            mat:mat,
                                            drawType:renderMgr.globalDrawType&(drawType||DrawTypeEnum.BASE),
                                            layermask:layer||LayerMask.default,
                                            submeshIndex:submeshIndex||0,
                                            cam:cam});
        }

        static drawSubMeshInstanced(mesh:Mesh,mat:Material,matrix:MathD.mat4[],drawType:DrawTypeEnum=null,layer:LayerMask=null,submeshIndex:number=null,cam:Camera=null)
        {
            if(mesh==null||mat==null) return;
            renderMgr.renderlist.addRenderItem({ mesh:mesh,
                                            matrix:matrix,
                                            mat:mat,
                                            drawType:renderMgr.globalDrawType&(drawType||DrawTypeEnum.BASE),
                                            layermask:layer||LayerMask.default,
                                            submeshIndex:submeshIndex||0,
                                            intanceCount:matrix.length,
                                            cam:cam});
        }

        static drawMesh(mesh:Mesh,mat:Material[],matrix:MathD.mat4,drawType:DrawTypeEnum,layer:LayerMask,cam:Camera=null)
        {
            for(let i=0;i<mesh.submeshs.length;i++)
            {
                this.drawSubMesh(mesh,mat[i],matrix,drawType,layer,i,cam);
            }
        }

        static drawMeshNow(mesh:Mesh,submeshIndex:number)
        {
            let submesh=mesh.submeshs[submeshIndex];
            webGraph.render.bindMeshData(mesh.glMesh);
            if(submesh.beUseEbo)
            {
                webgl.drawElements(submesh.renderType,submesh.size,webgl.UNSIGNED_SHORT,submesh.start);
                if(webGraph.RenderStateMgr.currentOP.clearDepth)
                {
                    webgl.clear(webgl.DEPTH_BUFFER_BIT);
                }
            }else
            {
                webgl.drawArrays(submesh.renderType,submesh.start,submesh.size);
            }
        }

        static drawObjectsNow(cam:Camera,renderlist:RenderList)
        {
            renderlist.foreach((item:IRenderItem)=>{
                if(cam.cullingMask&item.layermask)//check render layer和相机mask 
                {
                    //check 视锥剔除
                    if(!cam.frustum.intersectSphere(item.mesh.getBoundingSphere(),item.matrix as MathD.mat4)) return;
                    let mat=item.mat;
                    let drawType=item.drawType;

                    let shader=mat.getShader();
                    if(shader==null)
                    {
                        shader=assetMgr.getDefaultMaterial("defcolor").getShader();
                    }
                    let pass=shader.getPass(drawType);
                    if(pass==null)
                    {
                        pass=assetMgr.getDefaultMaterial("defcolor").getShader().getPass(drawType);
                    }
                    for(let i=0;i<pass.program.length;i++)
                    {
                        this.bindShaderPass(pass,i,item.mat.UniformDic,shader.mapUniformDef);
                        this.drawMeshNow(item.mesh,item.submeshIndex);
                    }
                }
            });
        }

    }


    export interface IRenderItem
    {
        mesh:Mesh;
        mat:Material;
        matrix:MathD.mat4|MathD.mat4[];
        drawType:DrawTypeEnum;
        layermask:LayerMask;
        submeshIndex:number;
        intanceCount?:number;
        cam?:Camera;
    }
}
