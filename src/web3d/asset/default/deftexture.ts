namespace web3d
{
    export class DefTexture
    {
        static initDefaultTexture()
        {
            let white = new Texture("white",null,true);
            white.glTexture =getdefTexture(defTextureEnum.white);
            assetMgr.mapDefaultTexture["white"] = white;
    
            let gray = new Texture("gray",null,true);
            gray.glTexture =getdefTexture(defTextureEnum.gray);
            assetMgr.mapDefaultTexture["gray"] = gray;
    
    
            let grid = new Texture("grid",null,true);
            grid.glTexture =getdefTexture(defTextureEnum.grid);
            assetMgr.mapDefaultTexture["grid"] = grid;
    
            let cube=new CubeTexture("black",null,true);
            let blackData=new Uint8ClampedArray(4);
            blackData[0]=blackData[1]=blackData[2]=0;
            blackData[3]=255;
            let defimagedata=new ImageData(blackData,1,1);
    
            let whiteData=new Uint8ClampedArray(4);
            whiteData[0]=whiteData[1]=whiteData[2]=whiteData[3]=255;
            let defimagedata2=new ImageData(whiteData,1,1);
    
    
            let imagedataArr:ImageData[]=[];
            for(let i=0;i<9;i++)
            {
                if(i>6)
                {
                    imagedataArr.push(defimagedata2);
                }else
                {
                    imagedataArr.push(defimagedata);
                }
            }
            let cubtex=new webGraph.CubeTex(imagedataArr);
            cube.glTexture=cubtex;
            assetMgr.mapDefaultCubeTexture["black"] = cube;
        }
    }
    export enum defTextureEnum
    {
        gray,
        white,
        black,
        grid
    }
    export function getdefTexture(type:defTextureEnum):webGraph.Texture2D
    {
        let data;
        let width = 1;
        let height = 1;
        switch(type)
        {
            case defTextureEnum.gray:
                data = new Uint8Array(4);
                data[0] = 128;
                data[1] = 128;
                data[2] = 128;
                data[3] = 255;
                break;
            case defTextureEnum.white:
                data = new Uint8Array(4);
                data[0] = 255;
                data[1] = 255;
                data[2] = 255;
                data[3] = 255;
                break;
            case defTextureEnum.black:
                data = new Uint8Array(4);
                data[0] = 0;
                data[1] = 0;
                data[2] = 0;
                data[3] = 255;
                break;
            case defTextureEnum.grid:
                width = 256;
                height = 256;
                data = new Uint8Array(width * width * 4);
                for (let y = 0; y < height; y++)
                {
                    for (let x = 0; x < width; x++)
                    {
                        let seek = (y * width + x) * 4;
    
                        if (((x - width * 0.5) * (y - height * 0.5)) > 0)
                        {
                            data[seek] = 0;
                            data[seek + 1] = 0;
                            data[seek + 2] = 0;
                            data[seek + 3] = 255;
                        }
                        else
                        {
                            data[seek] = 255;
                            data[seek + 1] = 255;
                            data[seek + 2] = 255;
                            data[seek + 3] = 255;
                        }
                    }
                }
                break;
        }
        let texop=new webGraph.TextureOption();
        texop.data=data;
        texop.width=width;
        texop.height=height;
        let texture=new webGraph.Texture2D(data,texop);
        return texture;
    }
    
}
