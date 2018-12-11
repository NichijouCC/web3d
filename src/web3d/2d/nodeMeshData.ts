namespace web3d
{
    export class UIMeshData
    {
        static vboData: number[] = [
            //3 pos  4 color  2 uv 4 color2
            0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
            1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
            0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ];
        static eboData:number[]=[0,2,1,0,2,3];
    
    }
}
