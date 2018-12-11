namespace web3d
{
    export class DefMatrial
    {
        static initDefaultMat()
        {
            let mat=new Material("def");
            let shader=assetMgr.getShader("def");
            mat.setShader(shader);
            let textue=assetMgr.getDefaultTexture("grid");
            mat.setTexture("_MainTex",textue);
            mat.setVector4("_MainColor",MathD.vec4.create(1,1,1,1))
            assetMgr.mapDefaultMat["def"]=mat;
    
            let mat1=new Material("defcolor");
            let shader1=assetMgr.getShader("defcolor");
            mat1.setShader(shader1);
            mat1.setVector4("_MainColor",MathD.vec4.create(1,1,1,1))
            assetMgr.mapDefaultMat["defcolor"]=mat1;

            let mat2=new Material("deferror");
            let shader2=assetMgr.getShader("deferror");
            mat2.setShader(shader2);
            assetMgr.mapDefaultMat["deferror"]=mat2;
    
            let mat3=new Material("text3d");
            let shader_text3d=assetMgr.getShader("text3d");
            mat3.setShader(shader_text3d);
            mat3.setTexture("_MainTex",DynamicFont.fontTex);
            assetMgr.mapDefaultMat["text3d"]=mat3;
        }
    }
}
