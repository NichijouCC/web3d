namespace webGraph
{
    export class ShaderMgr
    {
        private mapVS: { [id: string]: glShader } = {};
        private mapFS: { [id: string]: glShader } = {};
        private mapProgram: { [id: string]:ShaderProgram } = {};
    
        CreatShader(type:ShaderTypeEnum,name:string,stringSource:string):glShader|null
        {
            let beVertex=type==ShaderTypeEnum.VS;
            let target=beVertex?GLConstants.VERTEX_SHADER:GLConstants.FRAGMENT_SHADER;
            
            let item =rendingWebgl.createShader(target);
            if(item==null) return null;
            rendingWebgl.shaderSource(item, stringSource);
            rendingWebgl.compileShader(item);
            let r1 = rendingWebgl.getShaderParameter(item, rendingWebgl.COMPILE_STATUS);
            if (r1 == false)
            {
                let debug=beVertex?"ERROR: compile  VS Shader Error! VS:":"ERROR: compile FS Shader Error! FS:";
                debug=debug+name+".\n";
                console.error(debug+rendingWebgl.getShaderInfoLog(item));
                rendingWebgl.deleteShader(item);
                return null;
            }else
            {
                let shader=new glShader(name,type,item);
                let dic=beVertex?this.mapVS:this.mapFS;
                dic[name]=shader;
                return shader;
            }
        }
    
        CreatProgram(vs:string,fs:string,type:string):ShaderProgram|null
        {
            let item=rendingWebgl.createProgram();
            if(item==null) return null;
            rendingWebgl.attachShader(item,this.mapVS[vs].instance);
            rendingWebgl.attachShader(item,this.mapFS[fs].instance);
            rendingWebgl.linkProgram(item);
            let r3 = rendingWebgl.getProgramParameter(item, rendingWebgl.LINK_STATUS);
            if (r3 == false)
            {
                let debguInfo="ERROR: compile program Error!"+"VS:" + vs+ "   FS:" + fs + "\n" + rendingWebgl.getProgramInfoLog(item);
                console.error(debguInfo);
                rendingWebgl.deleteProgram(item);
                return null;
            }else
            {
                let name=vs+"_"+fs;
                let programe=new ShaderProgram(name,type,item);
                this.mapProgram[name]=programe;
                return programe;
            }
        }
    
    }
}
