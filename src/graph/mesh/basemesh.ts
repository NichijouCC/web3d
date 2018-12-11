namespace webGraph
{

    export enum PrimitiveRenderEnum
    {
        Points=GLConstants.POINTS,
        Lines=GLConstants.LINES,
        Triangles=GLConstants.TRIANGLES,
        Wireframe=GLConstants.LINE_STRIP
    }
    
    export enum PrimitiveDataEnum
    {
        static=GLConstants.STATIC_DRAW,
        dynamic=GLConstants.DYNAMIC_DRAW
    }
    
    export enum RenderModelEnum
    {
        static=<number>GLConstants.STATIC_DRAW,
        dynamic=GLConstants.DYNAMIC_DRAW,
        stream=GLConstants.STREAM_DRAW
    }
    
    export interface BaseMesh
    {
        vbo:VertexBuffer;
        VertexAttDic:{[attType:string]:VertexAttribute};
        ebo:ElementBuffer;
        vaoDic:{[key:number]:VAO};
        submeshs: IMeshInfo[];
    }

    export interface IMeshInfo
    {
        start: number;
        size: number;
        beUseEbo:boolean;
        renderType:PrimitiveRenderEnum;
    }
}
