// namespace web3d
// {
//     export class wx_LoadTextureSample implements IAssetLoader
//     {
//         load(url: string,state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void): Web3dAsset 
//         {
//             let name=AssetMgr.getFileName(url);
//             let texture:Texture=new Texture(name);

//             state.progress=loadImg(url,(tex,err)=>{
//                 if(err)
//                 {
//                     let errorMsg="ERROR: Load Image Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
//                     state.err=new Error(errorMsg);
//                 }else
//                 {
//                     LoadTextureSample.parse(texture,tex as HTMLImageElement);
//                     state.beSucces=true;
//                 }
//                 if(onFinish)
//                 {
//                     onFinish(texture,state);
//                 }
//             },null);
//             return texture;
//         }
//         private static parse(tex:Texture,image:HTMLImageElement)
//         {
//             tex.imageData=image;
//             tex.width=image.width;
//             tex.height=image.height;
//             tex.applyToGLTarget();
//         }
//     }

//     export class LoadTexture implements IAssetLoader
//     {
//         load(url: string,state:AssetLoadInfo,onFinish: (asset:IAsset,state: AssetLoadInfo) => void,onProgress: (downLoadinfo:DownloadInfo) => void=null): IAsset {
//             let name=AssetMgr.getFileName(url);
//             let texture:Texture=new Texture(name);
//             //-------------load image des

//             let request=loadText(url,(txt,err)=>{
                
//                 if(err)
//                 {
//                     let errorMsg="ERROR: Load Image Des Error!\n Info: LOAD URL: "+url+"  LOAD MSG:"+err.message;
//                     state.err=new Error(errorMsg);
//                     if(onFinish)
//                     {
//                         onFinish(texture,state);
//                     }
//                 }else
//                 {
//                     let desjson=JSON.parse(txt as string);
//                     let imgName=desjson.texture;
//                     let desname=AssetMgr.getFileName(url);

//                     let imgurl=url.replace(desname,imgName);
//                     let request=loadImg(imgurl,(tex,err)=>{
//                         if(err)
//                         {
//                             let errorMsg="ERROR: Load Image Error!\n Info: LOAD URL: "+imgurl+"  LOAD MSG:"+err.message;
//                             state.err=new Error(errorMsg);
//                             console.error(errorMsg);
//                         }else
//                         {
//                             LoadTexture.parse(texture,tex as HTMLImageElement,desjson);
//                             state.beSucces=true;
//                         }
//                         if(onFinish)
//                         {
//                             onFinish(texture,state);
//                         }
//                     });
//                 }
//             },(info)=>{
//                 if(onprogress)
//                 {
//                     onProgress(info);
//                 }
//             });
//             return texture;
//         }

//         private static parse(tex:Texture,image:HTMLImageElement,Desjson:any,keepOrigeData=true)
//         {
//             let texop=this.getFromDesJson(Desjson);
//             texop.data=image;
//             texop.width=image.width;
//             texop.height=image.height;

//             tex.samplerInfo=texop;

//             tex.imageData=image;
//             tex.applyToGLTarget();
//         }

//         static getFromDesJson(json:any):textureOption
//         {
//             let op=new textureOption();
//             //---------------暂时先这样
//             if(json.flip_y)
//             {
//                 op.flip_y=json.flip_y;
//             }
//             if(json.filterMode)
//             {
//                 switch(json.filterMode)
//                 {
//                     case "Bilinear":
//                     case "Trilinear":
//                         op.max_filter=texFilterEnum.linear;
//                         break;
//                     case "Point":
//                         op.max_filter=texFilterEnum.nearest;
//                         break;
//                 }
//             }
//             if(json.wrapMode)
//             {
//                 switch(json.wrapMode)
//                 {
//                     case "Clamp":
//                         op.wrap_s=texWrapEnum.clampToEdge;
//                         op.wrap_t=texWrapEnum.clampToEdge;
//                         break;
//                     case "Repeat":
//                         op.wrap_s=texWrapEnum.repeat;
//                         op.wrap_t=texWrapEnum.repeat;
//                         break;
//                 }
//             }
//             if(json.premultiplyAlpha)
//             {
//                 op.preMultiply_alpha=json.premultiplyAlpha;
//             }
//             if(json.flip_y)
//             {
//                 op.flip_y=json.flip_y;
//             }
//             return op;
//         }
//     }
//     const _loadTextureSample=new LoadTextureSample();
//     const _loadtexture=new LoadTexture();
//     AssetMgr.RegisterAssetLoader(".png",()=>{return _loadTextureSample;});
//     AssetMgr.RegisterAssetLoader(".jpg",()=>{return _loadTextureSample;});
//     AssetMgr.RegisterAssetLoader(".imgdes.json",()=>{ return _loadtexture;});
// }