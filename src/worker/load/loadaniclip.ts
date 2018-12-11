// namespace web3d.io
// {
//     export function loadAniclip(buffer:ArrayBuffer):any
//     {
//         let read: web3d.io.binReader = new web3d.io.binReader(buffer);
//         let namelen=read.readInt();
//         let clipName=read.readStringUtf8FixLength(namelen);

//         let fps = read.readInt();
//         let loop = read.readBoolean();
//         let boneCount=read.readInt();
//         let frameCount = read.readInt();

//         let bonesMixMat:Float32Array=new Float32Array(frameCount*boneCount*8);
//         let frames:Frame[] = [];
//         for (let i = 0; i < frameCount; i++)
//         {
//             let _fid = read.readInt().toString();
//             let _key = read.readBoolean();

//             let _frame=new Frame();
//             for (let k = 0; k <boneCount; k++)
//             {
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 0] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 1] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 2] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 3] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 4] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 5] =read.readSingle();
//                 _frame.bonesMixMat[k * Aniclip.perBoneDataLen + 6] =read.readSingle();
//             }
//             frames[_fid] =_frame;
//         }
//     }
// }