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
    export class Rendermgr
    {
        renderlistall: renderListAll;
        renderlist:RenderList=new RenderList();
        renderCameras: Camera[] = [];//需要camera class 
        renderLights: Light[] = [];//需要光源 class

        constructor()
        {
            this.renderlistall = new renderListAll();
        }

        beforeRender()
        {
            this.renderlistall.clear();
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
                    this.renderlistall.addRenderer(obj.render);
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
            this.renderlistall.renderAll(renderContext.curCamera,(cam,list)=>{
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
    }

    /**
     * 渲染的层级(从小到大绘制)
     */
    export enum RenderLayerEnum
    {
        Background=1000,
        Geometry=2000,
        AlphaTest=2450,
        Transparent=3000,//透明
        Overlay=4000//Overlay层
    }
    /**
     * 渲染mask枚举
     */
    export enum LayerMask
    {
        ui = 0x00000001,
        default = 0x00000002,
        editor = 0x00000004,
        model = 0x00000008,
        everything = 0xffffffff,
        nothing = 0x00000000,
        modelbeforeui = 0x00000008
    }
    /**
     * 渲染器接口 继承自组件接口
     */
    export interface IRender extends INodeComponent
    {
        layer:RenderLayerEnum;
        queue:number;
        mask: LayerMask
        Render();
        materials:Material[];
        // addToRenderList():void;
        BeRenderable():boolean;
        BeInstantiable():boolean;
        bouningSphere:BoundingSphere;
    }

    /**
     * @private
     */
    export class renderListAll
    {
        private renderLists:{[layer:number]:RenderContainer}={};

        private instanceList:{[matId:number]:IRender[]}={};
        constructor()
        {
            this.renderLists[RenderLayerEnum.Background]=new RenderContainer("Background");
            this.renderLists[RenderLayerEnum.Geometry]=new RenderContainer("Geometry");
            this.renderLists[RenderLayerEnum.AlphaTest]=new RenderContainer("AlphaTest");
            this.renderLists[RenderLayerEnum.Transparent]=new RenderContainer("Transparent",(arr:IRender[])=>{
                arr.sort((a,b)=>{
                    let matrixView = renderContext.matrixView;
                    let az = MathD.vec3.create();
                    let bz = MathD.vec3.create();
                    MathD.mat4.transformPoint(a.gameObject.transform.worldPosition, matrixView, az);
                    MathD.mat4.transformPoint(b.gameObject.transform.worldPosition, matrixView, bz);
                    let out=bz[2]- az[2];
                    MathD.vec3.recycle(az);
                    MathD.vec3.recycle(bz);
                    return out;
                })
            });
            this.renderLists[RenderLayerEnum.Overlay]=new RenderContainer("Overlay");
        }
        clear()
        {
            this.instanceList={};
            for(let key in this.renderLists)
            {
                this.renderLists[key].clear();
            }
        }
        addRenderer(renderer: IRender)
        {
            if(renderer.BeRenderable())
            {
                if(renderer.BeInstantiable()&&webGraph.GLExtension.hasObjInstance)
                {
                    let key=renderer.materials[0].guid;
                    if(this.instanceList[key]==null)
                    {
                        this.instanceList[key]=[];
                    }else
                    {
                        this.instanceList[key].push(renderer);
                    }
                }else
                {
                    this.renderLists[renderer.layer].addRender(renderer);
                }
            }
        }

        renderAll(cam:Camera,instanceDraw:(cam:Camera,instanceList:{[matId:number]:IRender[]})=>void)
        {
            this.renderLists[RenderLayerEnum.Background].foreachRender(cam);
            this.renderLists[RenderLayerEnum.Geometry].foreachRender(cam);
            this.renderLists[RenderLayerEnum.AlphaTest].foreachRender(cam);

            instanceDraw(cam,this.instanceList);
            // this.InstanceRenderAll(cam);

            this.renderLists[RenderLayerEnum.Transparent].foreachRender(cam);
            this.renderLists[RenderLayerEnum.Overlay].foreachRender(cam);
        }


    }

    export class RenderContainer
    {
        private layer:string;

        private queDic:{[queue:number]:IRender[]}={};
        private queArr:number[]=[];

        addRender(render:IRender)
        {
            let value=this.queDic[render.queue];
            if(value==null)
            {
                //不存在这种queue的
                this.queDic[render.queue]=[];
                this.queArr.push(render.queue);
            }
            this.queDic[render.queue].push(render);
        }

        constructor(layerType:string,queueSortFunc:(arr:IRender[])=>void=null)
        {
            this.layer=layerType;
            this._queueSortFunc=queueSortFunc;
        }
        private _queueSortFunc:(arr:IRender[])=>void;

        /**
         * 遍历
         */
        foreachRender(cam:Camera)
        {
            if(this.queArr.length>1)
            {
                this.queArr.sort();
            }
            for(let i=0,len=this.queArr.length;i<len;i++)
            {
                let arr=this.queDic[this.queArr[i]];
                if(this._queueSortFunc)
                {
                    this._queueSortFunc(arr);
                }
                for(let k=0,len2=arr.length;k<len2;k++)
                {
                    let render=arr[k];
                    if(cam.cullingMask&render.mask&&cam.frustum.intersectRender(render))
                    {
                        render.Render();
                    }
                }
            }
        }

        clear()
        {
            this.queDic={};
            this.queArr.length=0;
        }

    }

}
