namespace webGraph
{
    export enum ShaderTypeEnum
    {
        VS,
        FS,
    }
    
    export class glShader
    {
        name:string;
        type:ShaderTypeEnum;
        instance:WebGLShader;
    
        constructor(name:string,type:ShaderTypeEnum,shader:WebGLShader)
        {
            this.name=name;
            this.type=type;
            this.instance=shader;
            
        }
    
        dispose()
        {
            rendingWebgl.deleteShader(this.instance);
        }
    }
}
