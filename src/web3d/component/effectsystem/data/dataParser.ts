namespace web3d
{
    export class EffectDataParser
    {
        static JsonToData(json: any, assetbundle: string):F14EffectData
        {
            let data=new F14EffectData();
            data.beloop = json.beloop;
            data.lifeTime = json.lifeTime;
            let jsonlayer = json.layers;
            for (let i = 0, len = jsonlayer.length; i < len; ++i)
            {
                // let layer = new F14LayerData();                    
                // layer.parse(jsonlayer[i],assetbundle);

                let layerdata=this.jsonToLayerData(jsonlayer[i],assetbundle);
                data.layers.push(layerdata);
            }
            return data;
        }

        static jsonToLayerData(json: any, assetbundle: string):F14LayerData
        {
            let data=new F14LayerData();
            data.Name = json.Name;
            switch (json.type)
            {
                case "particlesType":
                    data.type = F14TypeEnum.particlesType;
                    data.elementdata = EffectDataParser.jsonToParticleData(json.emissiondata, assetbundle);
                    break;
                case "SingleMeshType":
                    data.type = F14TypeEnum.SingleMeshType;
                    data.elementdata = this.jsonToSingleMeshData(json.singlemeshdata, assetbundle);
                    break;
                case "RefType":
                    data.type = F14TypeEnum.RefType;
                    data.elementdata =this.jsonToRefBaseData(json.RefData, assetbundle);
                    break;
                default:
                    console.log("f14Eff parse layerjson error!");
                    return;
            }
            for (let i = 0; i < json.frames.length; i++)
            {
                let framejson = json.frames[i];
                let frameindex = framejson.frameindex;
                let frameitem = new F14FrameData(frameindex, data.type);
                data.frames[frameindex] = frameitem;
                switch (data.type)
                {
                    case F14TypeEnum.SingleMeshType:
                        for (let k = 0; k < framejson.vec3Atts.length; k++)
                        {
                            let name = framejson.vec3Atts[k].name;
                            let strValue = framejson.vec3Atts[k].value;
                            let v3 = MathD.vec3.create();
                            MathD.vec3.copy(strValue, v3);
                            frameitem.singlemeshAttDic[name] = v3;
                        }
                        for (let k = 0; k < framejson.vec4Atts.length; k++)
                        {
                            let name = framejson.vec4Atts[k].name;
                            let strValue = framejson.vec4Atts[k].value;
                            let v4 = MathD.vec4.create();;
                            MathD.vec4.copy(strValue, v4);
                            frameitem.singlemeshAttDic[name] = v4;
                        }
                        for (let k = 0; k < framejson.colorAtts.length; k++)
                        {
                            let name = framejson.colorAtts[k].name;
                            let strValue = framejson.colorAtts[k].value;
                            let color = MathD.color.create();
                            MathD.color.copy(strValue,color);
                            frameitem.singlemeshAttDic[name] = color;
                        }
                        break;
                    case F14TypeEnum.particlesType:
                        let data = EffectDataParser.jsonToParticleData(framejson.emissionData, assetbundle);
                        frameitem.EmissionData = data;
                }
            }
        }

        static jsonToSingleMeshData(json: any, assetbundle: string):SingleMeshBaseData
        {
            let data=new SingleMeshBaseData();
            switch(json.loopenum)
            {
                case "Restart":
                    data.loopenum=LoopEnum.Restart;
                    break;
                case "TimeContinue":
                    data.loopenum=LoopEnum.TimeContinue;
                    break;
            }
            data.mesh=assetMgr.load(json.mesh) as web3d.Mesh;
            data.material=assetMgr.load(json.material) as web3d.Material;
            MathD.vec3.copy(json.position,data.position);
            MathD.vec3.copy(json.scale,data.scale);
            MathD.vec3.copy(json.euler,data.euler);
            MathD.color.copy(json.color,data.color);
            MathD.vec4.copy(json.tex_ST,data.tex_ST);
            data.enableTexAnimation=json.enableTexAnimation;
            if(data.enableTexAnimation)
            {
                switch(json.uvType)
                {
                    case "UVRoll":
                        data.uvType=UVTypeEnum.UVRoll;
                        data.uSpeed=json.uSpeed;
                        data.vSpeed=json.vSpeed;
                        break;
                    case "UVSprite":
                        data.uvType=UVTypeEnum.UVSprite;
                        data.row=json.row;
                        data.column=json.column;
                        data.count=json.count;
                        break;
                    case "NONE":
                        data.uvType=UVTypeEnum.NONE;
                        break;
                }
            }
            if(json.beBillboard!=null)
            {
                data.beBillboard=json.beBillboard;
                switch(json.bindAxis)
                {
                    case "NONE":
                        data.bindAxis=BindAxis.NONE;
                        break;
                    case "X":
                        data.bindAxis=BindAxis.X;
                        break;
                    case "Y":
                        data.bindAxis=BindAxis.Y;
                        break;
                }
            }
            return data;
        }
        static jsonToParticleData(json: any, assetbundle: string):F14EmissionBaseData
        {
            let data=new F14EmissionBaseData();
            switch(json.loopenum)
            {
                case "Restart":
                    data.loopenum=LoopEnum.Restart;
                    break;
                case "TimeContinue":
                    data.loopenum=LoopEnum.TimeContinue;
                    break;
            }
            data.mesh=assetMgr.load(json.mesh) as web3d.Mesh;
            data.material=assetMgr.load(json.material) as web3d.Material;
            MathD.vec3.copy(json.rotPosition,data.rotPosition);
            MathD.vec3.copy(json.rotScale,data.rotScale);
            MathD.vec3.copy(json.rotEuler,data.rotEuler);
            switch(json.rendermodel)
            {
                default:
                case"BillBoard":
                    data.rendermodel=RenderModelEnum.BillBoard;
                    break;
                case"HorizontalBillBoard":
                    data.rendermodel=RenderModelEnum.HorizontalBillBoard;
                    break;
                case"Mesh":
                    data.rendermodel=RenderModelEnum.Mesh;
                    break;
                case"StretchedBillBoard":
                    data.rendermodel=RenderModelEnum.StretchedBillBoard;
                    break;                
                case"VerticalBillBoard":
                    data.rendermodel=RenderModelEnum.VerticalBillBoard;
                    break;
                case"None":
                    data.rendermodel=RenderModelEnum.None;
                    break;
            }
            data.beloop=json.beloop;
            NumberData.FormJson(json.lifeTime,data.lifeTime);
            data.simulateInLocalSpace=json.simulateInLocalSpace;
            NumberData.FormJson(json.startScaleRate,data.startScaleRate);
            Vector3Data.FormJson(json.startScale,data.startScale);
            Vector3Data.FormJson(json.startEuler,data.startEuler);
            Vector3Data.FormJson(json.startColor,data.startColor);
            NumberData.FormJson(json.startAlpha,data.startAlpha);
            data.colorRate=json.colorRate;
            NumberData.FormJson(json.simulationSpeed,data.simulationSpeed);
            MathD.vec4.copy(json.start_tex_st,data.start_tex_st);
            data.delayTime=json.delayTime;
            data.duration=json.duration;
            NumberData.FormJson(json.rateOverTime,data.rateOverTime);
            for(let i=0;i<json.bursts.length;i++)
            {
                let item=json.bursts[i];
                let info=busrtInfo.CreatformJson(item);
                data.bursts.push(info);
            }
            switch(json.shapeType)
            {
                case"NORMAL":
                    data.shapeType=ParticleSystemShape.NORMAL;
                    break;
                case"BOX":
                    data.shapeType=ParticleSystemShape.BOX;
                    data.width=json.width;
                    data.height=json.height;
                    data.depth=json.depth;
                    break;                
                case"SPHERE":
                    data.shapeType=ParticleSystemShape.SPHERE;
                    data.radius=json.radius;
                    break;                
                case"HEMISPHERE":
                    data.shapeType=ParticleSystemShape.HEMISPHERE;
                    data.radius=json.radius;
                    break;                
                case"CONE":
                    data.shapeType=ParticleSystemShape.CONE;
                    data.height=json.height;
                    data.angle=json.angle;
                    data.radius=json.radius;
                    switch(json.emitFrom)
                    {
                        case "base_":
                            data.emitFrom=emitfromenum.base;
                            break;
                        case "volume":
                            data.emitFrom=emitfromenum.volume;
                            break;
                    }
                    break;                
                case"CIRCLE":
                    data.shapeType=ParticleSystemShape.CIRCLE;
                    break;
                case"EDGE":
                    data.shapeType=ParticleSystemShape.EDGE;
                    break;
            }
            data.enableVelocityOverLifetime=json.enableVelocityOverLifetime;
            if(data.enableVelocityOverLifetime)
            {
                Vector3Data.FormJson(json.moveSpeed,data.moveSpeed);
            }
            data.enableSizeOverLifetime=json.enableSizeOverLifetime;
            if(data.enableSizeOverLifetime)
            {
                for(let i=0;i<json.sizeNodes.length;i++)
                {
                    let jsonitem=json.sizeNodes[i];
                    let item=new NumberKey(jsonitem.key,jsonitem.value);
                    data.sizeNodes.push(item);
                }
            }
            data.enableRotOverLifeTime=json.enableRotOverLifeTime;
            if(data.enableRotOverLifeTime)
            { 
                NumberData.FormJson(json.angleSpeed,data.angleSpeed);
            }
            data.enableColorOverLifetime=json.enableColorOverLifetime;
            if(data.enableColorOverLifetime)
            {
                for(let i=0;i<json.colorNodes.length;i++)
                {
                    let jsonitem=json.colorNodes[i];
                    let v3=MathD.vec3.create();
                    MathD.vec3.copy(jsonitem.value,v3);
                    let item=new Vector3Key(jsonitem.key,v3);
                    data.colorNodes.push(item);
                }
                for(let i=0;i<json.alphaNodes.length;i++)
                {
                    let jsonitem=json.alphaNodes[i];
                    let item=new NumberKey(jsonitem.key,jsonitem.value);
                    data.alphaNodes.push(item);
                }
            }
            data.enableTexAnimation=json.enableTexAnimation;
            if(data.enableTexAnimation)
            {
                switch(json.uvType)
                {
                    case "UVRoll":
                        data.uvType=UVTypeEnum.UVRoll;
                        data.uSpeed=json.uSpeed;
                        data.vSpeed=json.vSpeed;
                        break;
                    case "UVSprite":
                        data.uvType=UVTypeEnum.UVSprite;
                        data.row=json.row;
                        data.column=json.column;
                        data.count=json.count;
                        break;
                    case "NONE":
                        data.uvType=UVTypeEnum.NONE;
                        break;
                }
            }
            return data;
        }

        static jsonToRefBaseData(json: any,assetbundle: string):F14RefBaseData 
        {
            let data=new F14RefBaseData();
            data.beLoop=json.beLoop;
            data.refdataName=json.F14EffectData;
            MathD.vec3.copy(json.localPos,data.localPos);
            MathD.vec3.copy(json.localEuler,data.localEuler);
            MathD.vec3.copy(json.localScale,data.localScale);
            return data;
        }
    }
}