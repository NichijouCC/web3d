///<reference path="../util/reflect.ts" />

namespace web3d
{
     /**
     * Text3d组件
     */
    @NodeComponent
    export class Text3d implements IRender
    {
        static type:string="Text3d";

        layer: RenderLayerEnum=RenderLayerEnum.Transparent;
        queue: number=0;
        mask: CullingMask=CullingMask.default;

        materials: Material[]=[];
        BeRenderable(): boolean {
            if(this.textMesh==null) return false;
            return true;
        }
        BeInstantiable(): boolean {
            return false;
        }
        gameObject: GameObject;

        fontSize:number=15;
        fontOffset:number=0;

        private _textContent:string;
        private _textWidth:number;
        get textContent():string
        {
            return this._textContent;
        }
        set textContent(value:string)
        {
            this._textContent=value;
            DynamicFont.Inc.checkText(value);
            this.refreshMeshData();
        }
        private textMesh:Mesh;
        private refreshMeshData()
        {
            this.posArr=[];
            this.uvArr=[];
            //-----------0-----1
            //-----------|     |
            //-----------|     |
            //-----------2-----3
            let posArr: MathD.vec3[]=[];
            let uvArr:MathD.vec2[]=[];
            for(let i=0;i<4;i++)
            {
                posArr[i]=MathD.vec3.create();
                uvArr[i]=MathD.vec2.create();
            }
            let xAddvance:number=0;
            let scale=this.fontSize/DynamicFont.Inc.fontsize;
            for(let i=0;i<this._textContent.length;i++)
            {
                let key = this._textContent.charAt(i);
                let charinfo=DynamicFont.Inc.getCharInfo(key);
                posArr[0][0]=xAddvance;
                posArr[0][1]=charinfo.ySize*scale;

                posArr[1][0]=xAddvance+charinfo.xSize*scale;
                posArr[1][1]=charinfo.ySize*scale;

                posArr[2][0]=xAddvance;
                posArr[2][1]=0;

                posArr[3][0]=xAddvance+charinfo.xSize*scale;
                posArr[3][1]=0;

                uvArr[0][0]=charinfo.x;
                uvArr[0][1]=charinfo.y;

                uvArr[1][0]=charinfo.x+charinfo.w;
                uvArr[1][1]=charinfo.y;

                uvArr[2][0]=charinfo.x;
                uvArr[2][1]=charinfo.y+charinfo.h;

                uvArr[3][0]=charinfo.x+charinfo.w;
                uvArr[3][1]=charinfo.y+charinfo.h;

                xAddvance+=charinfo.xSize*scale;
                this.addQuad(posArr,uvArr,i);
            }
            this._textWidth=xAddvance;
            if(this.textMesh==null)
            {
                this.textMesh=new Mesh();
            }
            this.textMesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position,this.posArr);
            this.textMesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0,this.uvArr);
            this.textMesh.createVbowithAtts();
            this.textMesh.setIndexData(this.indexArr);
            let submeshInfo=new subMeshInfo();
            submeshInfo.size=this.indexArr.length;
            this.textMesh.submeshs=[];
            this.textMesh.submeshs.push(submeshInfo);
        }

        private posArr:number[]=[];
        private uvArr:number[]=[]; 
        private indexArr:number[]=[];

        private addQuad(posArr: MathD.vec3[],uvArr:MathD.vec2[],index:number)
        {
            for(let i=0;i<4;i++)
            {
                this.posArr.push(posArr[i][0],posArr[i][1],posArr[i][2]);
                this.uvArr.push(uvArr[i][0],uvArr[i][1]);
            }

            this.indexArr.push(0+index*4,1+index*4,2+index*4,2+index*4,1+index*4,3+index*4);
        }


        Start()
        {
            this.materials[0]=assetMgr.getDefaultMaterial("text3d");
        }
        Update()
        {

        }
        private viewPos: MathD.vec3=MathD.vec3.create();
        private ndcPos: MathD.vec3=MathD.vec3.create();
        Render() {
            renderContext.curRender=this;
            renderContext.updateModel(this.gameObject.transform);
            MathD.mat4.transformPoint(this.gameObject.transform.localPosition,renderContext.matrixModelView,this.viewPos);

            // if(this.viewPos.z>=0) return;
            // this.viewPos.z=-renderContext.curCamera.far;
            // //
            // let scale=-renderContext.curCamera.far/this.viewPos.z;
            // vec3.scale(this.viewPos,scale,this.viewPos);
            // this.materials[0].setVector3("u_viewPos",this.viewPos);
            
            //this.materials[0].setMatrix("u_mat_oh_project",renderContext.curCamera.getOrthoLH_ProjectMatrix());

            let scale=-this.viewPos.z;
            MathD.mat4.translate(renderContext.matrixProject,this.viewPos,renderContext.matrixProject);
            MathD.mat4.scale(renderContext.matrixProject,MathD.vec3.create(scale/webgl.canvas.height,scale/webgl.canvas.height,1),renderContext.matrixProject);

            for (let i = 0; i < this.textMesh.submeshs.length; i++)
            {
                let sm = this.textMesh.submeshs[i];
                let usemat = this.materials[i];
                renderMgr.draw(this.textMesh,usemat,sm,DrawTypeEnum.BASE);
            }
        }
        Dispose()
        {
            // if(this.mesh)
            //     this.mesh.unuse(true);
        }
        Clone()
        {

        }

        private _boundingSphere:BoundingSphere;
        get bouningSphere(): BoundingSphere
        {
            if(this._boundingSphere==null)
            {
                this._boundingSphere=new BoundingSphere();
            }
            MathD.vec3.copy(this.gameObject.transform.worldPosition,this._boundingSphere.center);
            return this._boundingSphere;
        }
    }

    export class charinfo
    {
        x: number = 0;//uv
        y: number = 0;
        w: number = 0;
        h: number = 0;
        xSize: number = 0;
        ySize: number = 0;
        xOffset: number = 0;//偏移
        yOffset: number = 0;
    }

    export class DynamicFont
    {
        private static _inc:DynamicFont;
        public static get Inc():DynamicFont
        {
            if(this._inc==null)
            {
                this._inc=new DynamicFont();
            }
            return this._inc;
        }
        //所有的收集到的文本字体
        public static charFromText = "";
        //在导入的文本库中缺少的字体
        public static newChar = "";
        private contex2d: CanvasRenderingContext2D;
        static fontTex: Texture=new Texture();
        texSize =400;
        fontsize: number = 20;
        private cmap: { [id: string]: charinfo } = {};
        private constructor()
        {
            let can2d = document.createElement("canvas");
            can2d.width=this.texSize;
            can2d.height=this.texSize;
            can2d.className = "fontcanvas";
            can2d.style.right = "0px";
            can2d.style.top = "0px";
            // can2d.style.width =this.texSize+"px";
            // can2d.style.height =this.texSize+"px";
            can2d.style.zIndex="10";
            // can2d.style.backgroundColor = "#000000";
            can2d.style.position = "absolute";
            (webgl.canvas.parentElement as HTMLElement).appendChild(can2d);
            this.contex2d = can2d.getContext("2d") as CanvasRenderingContext2D;
            //this.charlenInRow = Math.floor(1000 / 32);
            // DynamicFont.fontTex =new Texture();
            DynamicFont.fontTex.imageData=can2d;
            DynamicFont.fontTex.samplerInfo.setWrap(webGraph.TexWrapEnum.clampToEdge,webGraph.TexWrapEnum.clampToEdge);
            DynamicFont.fontTex.samplerInfo.setPixsStore(true,false);
            DynamicFont.fontTex.samplerInfo.setFilterModel(webGraph.TexFilterEnum.linear,webGraph.TexFilterEnum.nearest);

            this.contex2d.clearRect(0, 0, can2d.width, can2d.height);
            this.contex2d.textAlign="left";
            this.contex2d.textBaseline = "top";
            this.contex2d.fillStyle = "white";
            this.contex2d.font = this.fontsize + "px monospace";//Roboto   monospace

            // this.contex2d.textBaseline="bottom";
            // this.imageData=new Uint8Array(this.texSize*this.texSize*4);

            // this.yAddvance=this.y_offset;
        }
        // private y_offset:number=3;//--------textBaseline = "bottom"字会被裁掉上部分.
        checkText(str: string)
        {
            if (str == null) return;
            let updateData = false;
            for (let i = 0; i < str.length; i++) {
                let key = str.charAt(i);
                if (this.cmap[key]) continue;
                this.adddNewChar(key);
                DynamicFont.newChar += key;
                updateData = true;
            }
            if (updateData)
            {
                DynamicFont.fontTex.applyToGLTarget();
            }
        }
        getCharInfo(key:string)
        {
            return this.cmap[key];
        }
        private xAddvance: number = 0;
        private yAddvance: number = 0;
        private adddNewChar(key: string)
        {
            //-------------验证是否有足够的位置写字
            if(this.xAddvance+this.fontsize>=this.texSize)
            {
                this.xAddvance = 0;
                this.yAddvance += (this.fontsize+4);
                // this.y_offset+=5;
            }
            //-------------写字
            this.contex2d.fillText(key, this.xAddvance,this.yAddvance);
            // this.contex2d.strokeStyle="blue";
            // this.contex2d.moveTo(this.xAddvance,this.yAddvance-this.y_offset);
            // this.contex2d.lineTo(this.xAddvance,this.yAddvance+this.fontsize-this.y_offset);
            // this.contex2d.stroke();
            
            //-------------刷新xaddvance/yaddvance
            let charwidth = this.contex2d.measureText(key).width;
            let info=new charinfo();
            this.cmap[key]=info;
            info.x=this.xAddvance/this.texSize;
            info.y=this.yAddvance/this.texSize;
            info.w=charwidth/this.texSize;
            info.h=(this.fontsize+1)/this.texSize;
            info.xSize=charwidth;
            info.ySize=this.fontsize;

            console.log(key+"  width:"+charwidth)
            this.xAddvance += (charwidth+1);
        }
    }
}

