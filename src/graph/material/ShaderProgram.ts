namespace webGraph
{
    export class ProgramID
    {
        private static idAll: number = 0;
        static next(): number
        {
            let next = ProgramID.idAll;
            ProgramID.idAll++;
            return next;
        }
    }
    
    
    /**
     * shader att 是全局状态.即下一个mesh可以用上一个mesh的设定(vertexattributepointer)
     * shader uniform 是 sahder state,即set unform value 都和 当前shader相绑定
     */
    export class ShaderProgram
    {
    
        type:string;
        name:string;
        instance:WebGLProgram;
        state:StateOption;
        // uniformSetters:{[name:string]:(value:any)=>void};
        // attribSetters:{[name:string]:(value:VertexAttribute)=>void};
    
        uniformDic:{[name:string]:UniformData};
        attribDic:{[type:string]:number};
        
        cachevalue:{[uniformName:string]:any}={};
        readonly ID:number;
        constructor(name:string,type:string,program:WebGLProgram)
        {
            this.ID=ProgramID.next();
            this.name=name;
            this.type=type;
            this.instance=program;
    
            this.attribDic=AttributeSetter.getAttributeInfo(this.instance);
            this.uniformDic=UniformSetter.getUniformInfo(this.instance);
        }
        /**
         * rebind program、reSet renderState
         */
        attach()
        {
            rendingWebgl.useProgram(this.instance);
            // ShaderProgram.curprogram=this.instance;
        }

        public detach()
        {
            rendingWebgl.useProgram(null);
        }
        
        public dispose()
        {
            rendingWebgl.deleteProgram(this.instance);
        }
    
        getUniformLocation(name:string):WebGLUniformLocation
        {
            return this.uniformDic[name].location;
        }
        getAttributeLocation(attType:VertexAttTypeEnum):number
        {
            return this.attribDic[attType];
        }
    
        private cacheUniformDic:{[name:string]:any}={};
        applyUniformWithCache(name:string,value:any)
        {
            let data=this.uniformDic[name];
            let equalFuc=UniformSetter.uniformEqualDic[data.type];
            let cacheValue=this.cacheUniformDic[name];
            if(cacheValue!=null&&equalFuc(value,cacheValue))
            {
                return;
            };
            this.cacheUniformDic[name]=cacheValue;
            this.applyUniform(name,value);
        }
        applyUniform(name:string,value:any)
        {
            let data=this.uniformDic[name];
            UniformSetter.applyUniform(data.type,data.location,value);
        }
    }
}
