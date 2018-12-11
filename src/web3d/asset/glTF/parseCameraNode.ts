namespace web3d
{
    export class ParseCameraNode
    {
        static parse(index:number,bundle:glTFBundle):Transform
        {
            let node=bundle.gltf.cameras[index];
            let obj=new GameObject();
            let cam=obj.addComponent("Camera") as Camera;
            switch(node.type)
            {
                case CameraType.PERSPECTIVE:
                    cam.projectionType=ProjectionEnum.perspective;
                    let data=node.perspective;
                    cam.fov=data.yfov;
                    cam.near=data.znear;
                    if(data.zfar)
                    {
                        cam.far=data.zfar;
                    }
                    if(data.aspectRatio)
                    {
                        cam.aspest=data.aspectRatio;
                    }
                    break;
                case CameraType.ORTHOGRAPHIC:
                    cam.projectionType=ProjectionEnum.orthograph;
                    let datao=node.orthographic;
                    cam.near=datao.znear;
                    cam.far=datao.zfar;
                    cam.size=datao.ymag;
                    cam.aspest=datao.xmag/datao.ymag;
                    break;
            }
            return obj.transform;
        }
    }
}
