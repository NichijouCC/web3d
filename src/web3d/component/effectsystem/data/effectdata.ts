namespace web3d
{
    export class F14EffectData
    {
        beloop: boolean = false;
        /**
         * 帧数
         */
        lifeTime: number = 100;
        layers: F14LayerData[] = [];
    }
    export class F14LayerData
    {
        Name: string = "newLayer";
        type: F14TypeEnum = F14TypeEnum.SingleMeshType;
        elementdata: ElementData;
        frames: { [frame: number]: F14FrameData } = {};
    }

    export class F14FrameData
    {
        public frameindex: number;
        singlemeshAttDic: { [name: string]: any };
        EmissionData: F14EmissionBaseData;
        constructor(index: number, type: F14TypeEnum)
        {
            this.frameindex = index;
            if (type == F14TypeEnum.SingleMeshType)
            {
                this.singlemeshAttDic = {};
            } else
            {
                this.EmissionData = new F14EmissionBaseData();
            }
        }
    }
}