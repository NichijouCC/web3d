namespace web3d
{
    export enum F14TypeEnum
    {
        SingleMeshType,//单mesh
        particlesType,//发射器
        RefType//索引
    }
    export interface LayerElement
    {
        type:F14TypeEnum;
        update(deltaTime:number,frame:number, fps:number);
        Render();
        dispose();
        reset();
        OnEndOnceLoop();
        // changeColor(value:MathD.color);
        layer:EffectLayer;
        drawActive:boolean;
    }
}

