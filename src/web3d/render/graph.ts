namespace web3d
{
    /**
     * 
     * 按照Geometry-》AlphaTest-》Background-》Transparent-》Overlay的顺序进行渲染
     * 
     * 非透明物体/透明物体都要按照queue排序
     * 
     * 非透明物体暂时没发现需要按照距离排序（近到远）
     * 
     * 透明物体按照距离排序（远到近）
     * 
     */
    export class Graph
    {
        renderlist: RenderList;

        renderCameras: Camera[] = [];//需要camera class 
        renderLights: Light[] = [];//需要光源 class

        constructor()
        {
            this.renderlist = new RenderList();
        }

        beforeRender()
        {
            this.renderlist.clear();
            this.renderCameras.length = 0;
            this.renderLights.length = 0;
            webgl.clearStencil(0);
            webgl.clear(webgl.STENCIL_BUFFER_BIT);
        }

        renderScene(scen:Scene)
        {
            this.beforeRender();
            this._fillRenderer(scen.getRoot());

            //排序camera 并绘制
            if (this.renderCameras.length > 1)
            {
                this.renderCameras.sort((a, b) =>
                {
                    return a.order - b.order;
                })
            };

            // this.sortRendersByRenderQueue();
            //renderContext.updateLights(scen.renderLights);
            for (let i = 0,len=this.renderCameras.length; i < len; i++)
            {
                let curCam=this.renderCameras[i];
                renderContext.curCamera=curCam;

                renderContext.updateCamera(curCam);
                curCam.frustum.setFromMatrix(curCam.ViewProjectMatrix);
                // this.sortTransparentByZ();

                let lens=curCam.postEffectQueue.length;
                if(lens>0)
                {
                    PostEffectMgr.render(curCam.postEffectQueue);
                }else
                {
                    curCam.clear();
                    curCam.viewPort();
                    this.renderOnce();                
                }
            }
            
        }
        private _fillRenderer(node: Transform)
        {
            if (node.gameObject.beVisible)
            {
                let obj=node.gameObject;
                //之前的流程 addtorenderlist--》list排序--》物体render--》物体rendercheck---》真的draw
                //现在改为---物体rendercheck--》addtorenderlist--》list排序--》物体render---》真的draw
                if(obj.render != null)
                {
                    this.renderlist.addRenderer(obj.render);
                }
                if(obj.getComponent(Light.type)!=null)
                {
                    this.renderLights.push(obj.getComponent(Light.type));
                }
                if(obj.getComponent(Camera.type)!=null)
                {
                    this.renderCameras.push(obj.getComponent(Camera.type));
                }
                for (let i = 0,len=node.children.length; i < len; i++)
                {
                    this._fillRenderer(node.children[i]);
                }
            }
        }
        
        renderOnce()
        {
            this.renderlist.renderAll(renderContext.curCamera,(cam,list)=>{
                this.instanceRenderAll(cam,list);
            });
        }

        globalDrawType:DrawTypeEnum=DrawTypeEnum.SKIN;
        activeInstanceDrawType:boolean=false;
        private instanceCount:number;
        draw(mesh:Mesh,mat:Material,submesh:subMeshInfo,localDrawType:DrawTypeEnum)
        {
            if(this.activeInstanceDrawType)
            {
                let drawtype=DrawTypeEnum.INSTANCe;
                mat=mat||assetMgr.getDefaultMaterial("def");
                let pass=mat.getShaderPass(drawtype);
                if(pass==null) return;
                for(let i=0;i<pass.program.length;i++)
                {
                    let usingProgram=pass.program[i];
                    webGraph.render.bindProgram(usingProgram);
                    webGraph.render.bindMeshDataDirectly(mesh.glMesh,usingProgram);

                    webGraph.render.BindeVertexData(this.posAtt);
                    webGraph.render.BindeVertexData(this.rotAtt);
                    webGraph.render.BindeVertexData(this.scaleAtt);

                    // ShaderVariant.PassAllUniforms(usingProgram,mat);
                    webGraph.render.applyMatUniforms(usingProgram,ShaderVariant.AutoUniformDic,mat.UniformDic,mat.getShader().mapUniformDef);

                    webgl.drawElementsInstanced(submesh.renderType,submesh.size,webgl.UNSIGNED_SHORT,submesh.start,this.instanceCount);
                }
            
            }else
            {
                let drawtype=this.globalDrawType&localDrawType;
                if(mat==null||mat.getShaderPass(drawtype)==null)
                {
                    mat=assetMgr.getDefaultMaterial("defcolor");
                }
                let pass=mat.getShaderPass(drawtype);
                for(let i=0;i<pass.program.length;i++)
                {
                    this.bindMat(mat,drawtype,i);
                    this.drawMeshNow(mesh,i);
                }
            }
        }
        private InstanceMaxCount:number=10000;
        private instanceDataInit:boolean=false;
        private realPosDataArr:Float32Array;
        private realRotDataArr:Float32Array;
        private realScaleDataArr:Float32Array;

        private posArr: MathD.vec3[]=[];
        private rotArr:MathD.quat[]=[];
        private scaleArr: MathD.vec3[]=[];

        private posAtt:webGraph.VertexAttribute;
        private rotAtt:webGraph.VertexAttribute;
        private scaleAtt:webGraph.VertexAttribute;

        private instanceRenderAll(cam:Camera,instanceList:{[matId:number]:IRender[]})
        {
            this.activeInstanceDrawType=true;
            if(this.instanceDataInit==false)
            {
                this.instanceDataInit=true;

                this.realPosDataArr=new Float32Array(this.InstanceMaxCount*3);
                this.realRotDataArr=new Float32Array(this.InstanceMaxCount*4);
                this.realScaleDataArr=new Float32Array(this.InstanceMaxCount*3);

                for(let i=0;i<this.InstanceMaxCount;i++)
                {
                    this.posArr[i]=new Float32Array(this.realPosDataArr.buffer,i*12,3) as MathD.vec3;
                    this.rotArr[i]=new Float32Array(this.realRotDataArr.buffer,i*16,4) as MathD.quat;
                    this.scaleArr[i]=new Float32Array(this.realScaleDataArr.buffer,i*12,3) as MathD.vec3;
                }

                this.posAtt=webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_pos,this.realPosDataArr);
                this.rotAtt=webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_rot,this.realRotDataArr);
                this.scaleAtt=webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_scale,this.realScaleDataArr);
            }

            for(let key in instanceList)
            {
                let arr=instanceList[key];
                let instanceCount=arr.length;
                if(instanceCount>this.InstanceMaxCount)
                {
                    instanceCount=this.InstanceMaxCount;
                    console.warn(" gpu instance Maxcount（"+this.InstanceMaxCount+"） 需要更大！,当前Instance数量："+arr.length);
                }
                for(let k=0;k<instanceCount;k++)
                {
                    let render=arr[k];
                    let worldPos=render.gameObject.transform.worldPosition;
                    let worldrot=render.gameObject.transform.worldRotation;
                    let worldscale=render.gameObject.transform.worldScale;

                    MathD.vec3.copy(worldPos,this.posArr[k]);
                    MathD.quat.copy(worldrot,this.rotArr[k]);
                    MathD.vec3.copy(worldscale,this.scaleArr[k]);
                }

                this.posAtt.refreshVboData(this.realPosDataArr);
                this.rotAtt.refreshVboData(this.realRotDataArr);
                this.scaleAtt.refreshVboData(this.realScaleDataArr);

                this.instanceCount=instanceCount;
                if(cam.cullingMask&arr[0].mask)
                {
                    arr[0].Render();
                }
            }
            this.activeInstanceDrawType=false;
        }
        bindMat(mat:Material,drawType:DrawTypeEnum,programIndex:number=0)
        {
            if(mat==null)
            {
                // this.bindMat(assetMgr.getDefaultMaterial("defcolor"),drawType,programIndex);
                return;
            }
            let shader=mat.getShader();
            if(shader==null)
            {
                this.bindMat(assetMgr.getDefaultMaterial("defcolor"),drawType,programIndex);
                return;
            }
            let pass=shader.getPass(drawType);
            if(pass==null)
            {
                this.bindMat(assetMgr.getDefaultMaterial("defcolor"),drawType,programIndex);
                return;
            }
            this.bindShaderPass(pass,programIndex,mat.UniformDic,shader.mapUniformDef); 
        }

        bindShaderPass(pass:ShaderPass,programIndex:number=0,uniformDic:{[id:string]:any},defUniform:{[id:string]:any})
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
        drawSubMesh(mesh:Mesh,mat:Material,matrix:MathD.mat4=null,drawType:DrawTypeEnum=null,layer:LayerMask=null,submeshIndex:number=null,cam:Camera=null)
        {
            if(mesh==null||mat==null) return;
            this.renderlist.addRenderItem({ mesh:mesh,
                                            matrix:matrix||MathD.mat4.Identity,
                                            mat:mat,
                                            drawType:drawType||DrawTypeEnum.BASE,
                                            layermask:layer||LayerMask.default,
                                            submeshIndex:submeshIndex||0,
                                            cam:cam});
        }
        drawMesh(mesh:Mesh,mat:Material[],matrix:MathD.mat4,drawType:DrawTypeEnum,layer:LayerMask,cam:Camera=null)
        {
            for(let i=0;i<mesh.submeshs.length;i++)
            {
                this.drawSubMesh(mesh,mat[i],matrix,drawType,layer,i,cam);
            }
        }

        drawMeshNow(mesh:Mesh,submeshIndex:number)
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
        
        drawObjectsNow(cam:Camera,renderlist:RenderList)
        {
            renderlist.foreach((item:IRenderItem)=>{
                if(cam.cullingMask&item.layermask)//check render layer和相机mask 
                {
                    //check 视锥剔除
                    if(!cam.frustum.intersectSphere(item.mesh.getBoundingSphere(),item.matrix)) return;
                    let mat=item.mat;
                    let drawType=this.globalDrawType&item.drawType;

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
        matrix:MathD.mat4;
        drawType:DrawTypeEnum;
        layermask:LayerMask;
        submeshIndex:number;
        cam?:Camera;
    }

    /**
     * @private
     */
    export class RenderList
    {
        private layerLists:{[layer:number]:LayerList}={};
        constructor()
        {
            this.layerLists[RenderLayerEnum.Background]=new LayerList("Background");
            this.layerLists[RenderLayerEnum.Geometry]=new LayerList("Geometry");
            this.layerLists[RenderLayerEnum.AlphaTest]=new LayerList("AlphaTest");
            this.layerLists[RenderLayerEnum.Transparent]=new LayerList("Transparent");
            this.layerLists[RenderLayerEnum.Overlay]=new LayerList("Overlay");
        }
        clear()
        {
            for(let key in this.layerLists)
            {
                this.layerLists[key].clear();
            }
        }
        addRenderItem(item:IRenderItem)
        {
            let layerIndex=item.mat.layer;
            this.layerLists[layerIndex].addRender(item);
        }
        setLayerSortFunc(layer:RenderLayerEnum,queuesortfunc:(a:IRenderItem[])=>void)
        {
            this.layerLists[layer].queueSortFunc=queuesortfunc;
        }
        foreach(fuc:(item:IRenderItem)=>void)
        {
            this.layerLists[RenderLayerEnum.Background].foreach(fuc);
            this.layerLists[RenderLayerEnum.Geometry].foreach(fuc);
            this.layerLists[RenderLayerEnum.AlphaTest].foreach(fuc);
            this.layerLists[RenderLayerEnum.Transparent].foreach(fuc);
            this.layerLists[RenderLayerEnum.Overlay].foreach(fuc);
        }
    }

    export class LayerList
    {
        private layer:string;

        private queDic:{[queue:number]:IRenderItem[]}={};
        private queArr:number[]=[];

        constructor(layerType:string,queueSortFunc:(arr:IRenderItem[])=>void=null)
        {
            this.layer=layerType;
            this.queueSortFunc=queueSortFunc;
        }
        queueSortFunc:(arr:IRenderItem[])=>void;


        addRender(item:IRenderItem)
        {
            let queue=item.mat.queue;
            let value=this.queDic[queue];
            if(value==null)
            {
                this.queDic[queue]=[];
                this.queArr.push(queue);
            }
            this.queDic[queue].push(item);
        }

        sort()
        {
            if(this.queArr.length>1)
            {
                this.queArr.sort();
            }
            for(let i=0,len1=this.queArr.length;i<len1;i++)
            {
                let arr=this.queDic[this.queArr[i]];
                if(this.queueSortFunc)
                {
                    this.queueSortFunc(arr);
                }
            }
        }
        foreach(fuc:(item:IRenderItem)=>void)
        {
            for(let i=0,len1=this.queArr.length;i<len1;i++)
            {
                let arr=this.queDic[this.queArr[i]];
                arr.forEach((item)=>{
                    fuc(item);
                });
            }
        }

        clear()
        {
            this.queDic={};
            this.queArr.length=0;
        }

    }

}
