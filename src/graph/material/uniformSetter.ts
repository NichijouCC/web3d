namespace webGraph
{
    export class UniformSetter
    {
        static texIndex=0;        
        static unifomeApplyDic:{[type:number]:(location:WebGLUniformLocation,value:any)=>void}={};
        static uniformEqualDic:{[type:number]:(value1:any,value2:any)=>boolean}={};
        static applyUniform(type:UniformTypeEnum,location:any,value:any)
        {
            let func=this.unifomeApplyDic[type];
            func(location,value);
        }
    
        static initUniformDic()
        {
            this.InitUniformApplyDic();
            this.InitUniformEqualDic();
        }
    
        static InitUniformApplyDic()
        {
            this.unifomeApplyDic[UniformTypeEnum.FLOAT]=(location,value)=>{
                rendingWebgl.uniform1f(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOATV]=(location,value)=>{
                rendingWebgl.uniform1fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC2]=(location,value)=>{
                rendingWebgl.uniform2fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC2V]=(location,value)=>{
                rendingWebgl.uniform2fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC3]=(location,value)=>{
                rendingWebgl.uniform3fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC3V]=(location,value)=>{
                rendingWebgl.uniform3fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC4]=(location,value)=>{
                rendingWebgl.uniform4fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC4V]=(location,value)=>{
                rendingWebgl.uniform4fv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT]=(location,value)=>{
                rendingWebgl.uniform1i(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INTV]=(location,value)=>{
                rendingWebgl.uniform1iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC2]=(location,value)=>{
                rendingWebgl.uniform2iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC2V]=(location,value)=>{
                rendingWebgl.uniform2iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC3]=(location,value)=>{
                rendingWebgl.uniform3iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC3V]=(location,value)=>{
                rendingWebgl.uniform3iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC4]=(location,value)=>{
                rendingWebgl.uniform4iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC4V]=(location,value)=>{
                rendingWebgl.uniform4iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL]=(location,value)=>{
                rendingWebgl.uniform1iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC2]=(location,value)=>{
                rendingWebgl.uniform2iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC3]=(location,value)=>{
                rendingWebgl.uniform3iv(location, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC4]=(location,value)=>{
                rendingWebgl.uniform4iv(location, value);
            };
    
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT2]=(location,value)=>{
                rendingWebgl.uniformMatrix2fv(location,false,value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT3]=(location,value)=>{
                rendingWebgl.uniformMatrix3fv(location,false,value);
            };            
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT4]=(location,value)=>{
                rendingWebgl.uniformMatrix4fv(location,false,value);
            };
    
            this.unifomeApplyDic[UniformTypeEnum.TEXTURE]=(location,value)=>{
    
                let texture:Texture2D=value.glTexture;
                if(texture==null) return;
    
                // if(texture.unit!=null)
                // {
                //     webgl.uniform1i(location, texture.unit);
                // }else
                {
                    // let unit=Graph.getFreeUnit(texture);
                    let unit=this.texIndex;
                    rendingWebgl.activeTexture(rendingWebgl.TEXTURE0+unit);
                    rendingWebgl.bindTexture(rendingWebgl.TEXTURE_2D, texture.instance);
                    rendingWebgl.uniform1i(location, unit);
    
                    //console.warn(value.name+ "unit:"+unit);
                    this.texIndex++;
                }
                // this.texIndex++;
            };
            this.unifomeApplyDic[UniformTypeEnum.TEXTUREV]=(location,value)=>{
                for(let i in value)
                {
                    let texture:Texture2D=value[i].glTexture;
                    if(texture==null) continue;

                    // let unit=Graph.getFreeUnit(texture);
                    let unit=this.texIndex;

                    rendingWebgl.activeTexture(rendingWebgl.TEXTURE0+unit);
                    rendingWebgl.bindTexture(rendingWebgl.TEXTURE_2D, texture.instance);
                    rendingWebgl.uniform1i(location, unit);

                    this.texIndex++;
                }
            };
            this.unifomeApplyDic[UniformTypeEnum.CUBETEXTURE]=(location,value)=>{
                let texture=value.glTexture;
                if(texture==null) return;

                // let unit=Graph.getFreeUnit(texture);
                let unit=this.texIndex;

                rendingWebgl.activeTexture(rendingWebgl.TEXTURE0+unit);
                rendingWebgl.bindTexture(rendingWebgl.TEXTURE_CUBE_MAP, texture.instance);
                rendingWebgl.uniform1i(location, unit);
                this.texIndex++;

            };
            this.unifomeApplyDic[UniformTypeEnum.CUBETEXTUREV]=(location,value)=>{
                for(let i in value)
                {
                    let texture=value[i].glTexture;
                    if(texture==null) continue;

                    // let unit=Graph.getFreeUnit(texture);
                    let unit=this.texIndex;

                    rendingWebgl.activeTexture(rendingWebgl.TEXTURE0+unit);
                    rendingWebgl.bindTexture(rendingWebgl.TEXTURE_2D, texture.instance);
                    rendingWebgl.uniform1i(location, unit);
                    this.texIndex++;

                }
            };
        }
    
        static InitUniformEqualDic()
        {
            this.uniformEqualDic[UniformTypeEnum.FLOAT]=numberEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOATV]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC2]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC2V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC3]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC3V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC4]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC4V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT]=numberEqual;
            this.uniformEqualDic[UniformTypeEnum.INTV]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC2]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC2V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC3]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC3V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC4]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC4V]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL]=numberEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC2]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC3]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC4]=ArrayEqual;
    
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT2]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT3]=ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT4]=ArrayEqual;
    
            this.uniformEqualDic[UniformTypeEnum.TEXTURE]=(value1,value2)=>{
                return value1.glTexture==value2.glTexture
            };
            this.uniformEqualDic[UniformTypeEnum.TEXTUREV]=(value1,value2)=>{
                for(let i in value1)
                {
                    if(value1[i].glTexture!=value2[i].glTexture)
                    {
                        return false;
                    }
                }
                return true;
            };
            this.uniformEqualDic[UniformTypeEnum.CUBETEXTURE]=(value1,value2)=>{
                return value1.glTexture==value2.glTexture
            };
            this.uniformEqualDic[UniformTypeEnum.CUBETEXTUREV]=(value1,value2)=>{
                for(let i in value1)
                {
                    if(value1[i].glTexture!=value2[i].glTexture)
                    {
                        return false;
                    }
                }
                return true;
            };
        }
    
        
    
        static getUniformInfo(program:WebGLProgram):{[name:string]:UniformData}
        {
            let uniformDic:{[name:string]:UniformData}={};
            let numUniforms = rendingWebgl.getProgramParameter(program, rendingWebgl.ACTIVE_UNIFORMS);
            for (let i = 0; i < numUniforms; i++) 
            {
                let uniformInfo = rendingWebgl.getActiveUniform(program, i);
                if (!uniformInfo) break;
                let unifromdata=new UniformData();
    
                let name = uniformInfo.name;
                // remove the array suffix.
                if (name.substr(-3) === "[0]") 
                {
                    name = name.substr(0, name.length - 3);
                }
                let type = this.getUniformtype(program, uniformInfo);
                let location = rendingWebgl.getUniformLocation(program, uniformInfo.name);
                if(location==null) continue;
                unifromdata.name=name;
                unifromdata.location=location;
                unifromdata.type=type;
            
                uniformDic[name]=unifromdata;
            }
            return uniformDic;
        }
    
        private static getUniformtype(program:WebGLProgram,uniformInfo:any):UniformTypeEnum
        {
            let type = uniformInfo.type;
            // Check if this uniform is an array
            let isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]");
            if (type === rendingWebgl.FLOAT && isArray) {
                return UniformTypeEnum.FLOATV;
            }
            if (type === rendingWebgl.FLOAT) {
                return UniformTypeEnum.FLOAT;
            }
            if (type === rendingWebgl.FLOAT_VEC2&&isArray) {
                return UniformTypeEnum.FLOAT_VEC2V;
            }
            if (type === rendingWebgl.FLOAT_VEC2) {
                return UniformTypeEnum.FLOAT_VEC2;
            }
            if (type === rendingWebgl.FLOAT_VEC3&&isArray) {
                return UniformTypeEnum.FLOAT_VEC3V;
            }
            if (type === rendingWebgl.FLOAT_VEC3) {
                return UniformTypeEnum.FLOAT_VEC3;
            }
            if (type === rendingWebgl.FLOAT_VEC4&&isArray) {
                return UniformTypeEnum.FLOAT_VEC4V;
            }
            if (type === rendingWebgl.FLOAT_VEC4) {
                return UniformTypeEnum.FLOAT_VEC4;
            }
            if (type === rendingWebgl.INT && isArray) {
                return UniformTypeEnum.INTV;
            }
            if (type === rendingWebgl.INT) {
                return UniformTypeEnum.INT;             
            }
            if (type === rendingWebgl.INT_VEC2 && isArray) {
                return UniformTypeEnum.INT_VEC2V;
            }
            if (type === rendingWebgl.INT_VEC2) {
                return UniformTypeEnum.INT_VEC2;
            }
            if (type === rendingWebgl.INT_VEC3 && isArray) {
                return UniformTypeEnum.INT_VEC3V;
            }
            if (type === rendingWebgl.INT_VEC3) {
                return UniformTypeEnum.INT_VEC3;
            }
            if (type === rendingWebgl.INT_VEC4 && isArray) {
                return UniformTypeEnum.INT_VEC4V;
            }
            if (type === rendingWebgl.INT_VEC4) {
                return UniformTypeEnum.INT_VEC4;
            }
            if (type === rendingWebgl.BOOL) {
                return UniformTypeEnum.BOOL;
            }
            if (type === rendingWebgl.BOOL_VEC2) {
                return UniformTypeEnum.BOOL_VEC2;
            }
            if (type === rendingWebgl.BOOL_VEC3) {
                return UniformTypeEnum.BOOL_VEC3;
            }
            if (type === rendingWebgl.BOOL_VEC4) {
                return UniformTypeEnum.BOOL_VEC4;
            }
            if (type === rendingWebgl.FLOAT_MAT2) {
                return UniformTypeEnum.FLOAT_MAT2;
            }
            if (type === rendingWebgl.FLOAT_MAT3) {
                return UniformTypeEnum.FLOAT_MAT3;
            }
            if (type === rendingWebgl.FLOAT_MAT4) {
                return UniformTypeEnum.FLOAT_MAT4;
            }
            if (type === rendingWebgl.SAMPLER_2D&&isArray) {
                return UniformTypeEnum.TEXTUREV;
            }
            if (type === rendingWebgl.SAMPLER_2D) {
                return UniformTypeEnum.TEXTURE;
            }
            if (type === rendingWebgl.SAMPLER_CUBE&&isArray) {
                return UniformTypeEnum.CUBETEXTUREV;
            }
            if (type === rendingWebgl.SAMPLER_CUBE) {
                return UniformTypeEnum.CUBETEXTURE;
            }
            throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
        }
    
    }
    
    export enum UniformTypeEnum
    {
        FLOAT,
        FLOATV,
        FLOAT_VEC2,
        FLOAT_VEC2V,
        FLOAT_VEC3,
        FLOAT_VEC3V,
        FLOAT_VEC4,
        FLOAT_VEC4V,
        INT,
        INTV,
        INT_VEC2,
        INT_VEC2V,
        INT_VEC3,
        INT_VEC3V,
        INT_VEC4,
        INT_VEC4V,
        BOOL,
        BOOL_VEC2,
        BOOL_VEC3,
        BOOL_VEC4,
        FLOAT_MAT2,
        FLOAT_MAT3,
        FLOAT_MAT4,
        TEXTURE,
        TEXTUREV,
        CUBETEXTURE,
        CUBETEXTUREV,        
    }
    
    export class UniformData
    {
        name:string;
        location:WebGLUniformLocation;
        type:UniformTypeEnum;
    }
}

