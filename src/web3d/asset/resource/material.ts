namespace web3d
{
    @GameAsset    
    export class Material extends Web3dAsset
    {
        private static assetDic:{[name:string]:Material}={};
        constructor(name:string|null=null,url:string|null=null,bedef:boolean=false)
        {
            super(name,url,bedef);
            // let defshader=assetMgr.getShader("def");
            // this.shader=defshader;
            this.type="Material";
        }
        private shader: Shader;
        get layer()
        {
            return this.shader.layer;
        }
        @Attribute
        queue:number=0;
    
        UniformDic:{[id:string]:any}={};//参数//get by set..(setfloat)
    
        uniformDirty:boolean=true;
        uniformDirtyArr:{[id:string]:any}={};
        private markUniformDirty(uniformName:string,value:any)
        {
            this.uniformDirtyArr[uniformName]=value;
            if(value instanceof GameAsset &&value.loadState!=LoadEnum.Success)
            {
                value.addListenerToLoadEnd(()=>{
                    this.uniformDirtyArr[uniformName]=value;
                });
            }
        }
    
        setShader(shader: Shader)
        {    
            if(shader!=null)
            {
                this.shader = shader;
                if(shader.loadState!=LoadEnum.Success)
                {
                    shader.addListenerToLoadEnd(()=>{
                        this.uniformDirty=true;
                    });
                }
            }
            //这里改写因为shader可能没有加载完，此时赋值的话，没有传入正确的defuniform
            //this.UniformDic.defmap=this.shader.mapUniformDef;
            // this.layer=shader.layer;
        }
        getShader()
        {
            return this.shader;
        }
    
        getShaderPass(drawtype:DrawTypeEnum):ShaderPass
        {   
            if(this.shader==null) return null;
            return this.shader.getPass(drawtype);
        }
        /**
         * 不需要对unifrom设值做检查，shaderrender的时候从shaderunifromssetter中进行遍历，每次指定一个需要传值的属性，自行在material的uniformmap和defmap中找对应的value
         * 虽然找的value的shader的类型，可能不同，但是这也是由于用户自己set的value，自己背锅去。
         */
        setInt(id:string,_int:number)
        {
            this.UniformDic[id]=_int;
            this.markUniformDirty(id,_int);
        }
    
        setFloat(id: string, _number: number)
        {
            this.UniformDic[id]=_number;
            this.markUniformDirty(id,_number);
        }
        setFloatv(id: string, _numbers: Float32Array)
        {
            this.UniformDic[id]=_numbers;
            this.markUniformDirty(id,_numbers);
        }
        setVector2(id:string,_vector2:MathD.vec2)
        {
            this.UniformDic[id]=_vector2;
            this.markUniformDirty(id,_vector2);
        }
        setVector3(id:string,_vector3: MathD.vec3)
        {
            this.UniformDic[id]=_vector3;
            this.markUniformDirty(id,_vector3);
        }
        setVector4(id: string, _vector4: MathD.vec4)
        {
            this.UniformDic[id]=_vector4;
            this.markUniformDirty(id,_vector4);
        }
        setColor(id: string, _vector4: MathD.color)
        {
            this.UniformDic[id]=_vector4;
            this.markUniformDirty(id,_vector4);
        }
        //自行将 vec4[]处理为float32array
        setVector4v(id: string, _vector4v:Float32Array)
        {
            this.UniformDic[id]=_vector4v;
            this.markUniformDirty(id,_vector4v);
        }
        setMatrix(id: string, _matrix: MathD.mat4)
        {
            this.UniformDic[id]=_matrix;
            this.markUniformDirty(id,_matrix);
        }
        //自行将  mat4[]处理为float32array
        setMatrixv(id: string, _matrixv: Float32Array)
        {
            this.UniformDic[id]=_matrixv;
            this.markUniformDirty(id,_matrixv);
        }
        setTexture(id: string, _texture: ITextrue)
        {
            this.UniformDic[id]=_texture;
            //x = 1/width, y = 1/height, z = width, w = height
            if(_texture!=null)
            {
                this.setVector2(id+"_Size",MathD.vec2.create(_texture.width,_texture.height));
            }
            this.markUniformDirty(id,_texture);
        }
        setCubeTexture(id: string, _texture: CubeTexture)
        {
            this.UniformDic[id]=_texture;
            this.markUniformDirty(id,_texture);
        }
        dispose()
        {
            if(this.beDefaultAsset) return;
        }
    
        beActiveInstance:boolean=false;
        /**
         * gpu instance
         * @param state 
         */
        ToggleInstance(state:boolean=true)
        {
            this.beActiveInstance=state;
        }
    }
}
