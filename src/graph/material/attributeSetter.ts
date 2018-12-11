namespace webGraph
{
    export class AttributeSetter
    {
        // static attLocationDic:{[name:string]:number}={};
        // static attTypeDic:{[name:string]:VertexAttTypeEnum}={};
        static CustomAttDic:{[name:string]:{location:number,type:VertexAttTypeEnum}}={};
    
        static getAttributeInfo(program:WebGLProgram):{[name:string]:number}
        {
            let attdic:{[type:string]:number}={};
            let numAttribs = rendingWebgl.getProgramParameter(program, rendingWebgl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < numAttribs; i++)
            {
                let attribInfo = rendingWebgl.getActiveAttrib(program, i);
                if (!attribInfo) break;
                let attIndex = rendingWebgl.getAttribLocation(program, attribInfo.name);
                let attName=attribInfo.name;
                if(this.CustomAttDic[attName]==null)
                {
                    console.error("ERROR：Shader Att name isnot predetermined。INFO：shaderName Att name："+attName);  
                }else
                {
                    rendingWebgl.bindAttribLocation(program,this.CustomAttDic[attName].location,attName);
                    let atttype=this.CustomAttDic[attName].type;
                    if(atttype!=VertexAttTypeEnum.instance_pos&&atttype!=VertexAttTypeEnum.instance_rot&&atttype!=VertexAttTypeEnum.instance_scale)
                    {
                        attdic[this.CustomAttDic[attName].type]=this.CustomAttDic[attName].location;
                    }
                }
            }
            rendingWebgl.linkProgram(program);
            return attdic;
        }
    
        static applyAttribute(value:VertexAttribute)
        {
            rendingWebgl.enableVertexAttribArray(value.location);
            rendingWebgl.vertexAttribPointer(value.location, value.componentSize, value.componentDataType, value.normalize, value.strideInBytes, value.offsetInBytes);
        }
    
    
        static initAttDic()
        {
            this.CustomAttDic["a_pos"]={location:VertexAttLocationEnum.Position,type:VertexAttTypeEnum.Position};
            this.CustomAttDic["a_texcoord0"]={location:VertexAttLocationEnum.UV0,type:VertexAttTypeEnum.UV0};
            this.CustomAttDic["a_color"]={location:VertexAttLocationEnum.Color0,type:VertexAttTypeEnum.Color0};
            this.CustomAttDic["a_blendindex4"]={location:VertexAttLocationEnum.BlendIndex4,type:VertexAttTypeEnum.BlendIndex4};
            this.CustomAttDic["a_blendweight4"]={location:VertexAttLocationEnum.BlendWeight4,type:VertexAttTypeEnum.BlendWeight4};
            this.CustomAttDic["a_normal"]={location:VertexAttLocationEnum.Normal,type:VertexAttTypeEnum.Normal};
            this.CustomAttDic["a_tangent"]={location:VertexAttLocationEnum.Tangent,type:VertexAttTypeEnum.Tangent};
            this.CustomAttDic["a_texcoord1"]={location:VertexAttLocationEnum.UV1,type:VertexAttTypeEnum.UV1};
            this.CustomAttDic["a_color1"]={location:VertexAttLocationEnum.Color1,type:VertexAttTypeEnum.Color1};
            this.CustomAttDic["a_InstancePos"]={location:VertexAttLocationEnum.instance_pos,type:VertexAttTypeEnum.instance_pos};
            this.CustomAttDic["a_InstanceRot"]={location:VertexAttLocationEnum.instance_rot,type:VertexAttTypeEnum.instance_rot};
            this.CustomAttDic["a_InstanceScale"]={location:VertexAttLocationEnum.instance_scale,type:VertexAttTypeEnum.instance_scale};
    
            this.typeDic[VertexAttTypeEnum.Position]=VertexAttLocationEnum.Position;
            this.typeDic[VertexAttTypeEnum.UV0]=VertexAttLocationEnum.UV0;
            this.typeDic[VertexAttTypeEnum.Color0]=VertexAttLocationEnum.Color0;
            this.typeDic[VertexAttTypeEnum.Normal]=VertexAttLocationEnum.Normal;
            this.typeDic[VertexAttTypeEnum.Tangent]=VertexAttLocationEnum.Tangent;
            this.typeDic[VertexAttTypeEnum.BlendIndex4]=VertexAttLocationEnum.BlendIndex4;
            this.typeDic[VertexAttTypeEnum.BlendWeight4]=VertexAttLocationEnum.BlendWeight4;
            this.typeDic[VertexAttTypeEnum.UV1]=VertexAttLocationEnum.UV1;
            this.typeDic[VertexAttTypeEnum.Color1]=VertexAttLocationEnum.Color1;
            this.typeDic[VertexAttTypeEnum.instance_pos]=VertexAttLocationEnum.instance_pos;
            this.typeDic[VertexAttTypeEnum.instance_rot]=VertexAttLocationEnum.instance_rot;
            this.typeDic[VertexAttTypeEnum.instance_scale]=VertexAttLocationEnum.instance_scale;
    
        }
    
        private static typeDic:{[type:string]:number}={};
        static getAttLocationByType(type:VertexAttTypeEnum):VertexAttLocationEnum
        {
            return this.typeDic[type];
        }
    
    }
}
