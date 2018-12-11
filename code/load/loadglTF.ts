
namespace dome{
    export class LoadGlTF implements IState
    {
        load()
        {
            let url="resource/glTF/box/Box.gltf";
            url="resource/glTF/BoxAnimated/glTF/BoxAnimated.gltf";
            url="resource/glTF/RiggedSimple/glTF/RiggedSimple.gltf";
            //url="resource/glTF/apple/AppleTree.gltf";
            //url="resource/glTF/duck/Duck.gltf";
            // url="resource/glTF/FlightHelmet/FlightHelmet.gltf";
            url="resource/glTF/CesiumMan/glTF/CesiumMan.gltf";
            // url="resource/glTF/Monster/glTF/Monster.gltf";
            // url="resource/glTF/Cerberus_LP/glTF/Cerberus_LP.gltf";

            //url="resource/glTF/TextureCoordinateTest/glTF/TextureCoordinateTest.gltf";
            //url="resource/glTF/DamagedHelmet/glTF/DamagedHelmet.gltf";
            // url="resource/glTF/AnimatedMorphCube/glTF/AnimatedMorphCube.gltf";
            // url="resource/glTF/BoxAnimated/glTF-Binary/BoxAnimated.glb";
            url="resource/glTF/CesiumMan/glTF-Binary/CesiumMan.glb";

            let bundle=web3d.assetMgr.load(url,(asset,state)=>{
                if(state.beSucces)
                {
                    let obj=bundle.Instantiate();
                    // obj.localEuler=MathD.vec3.create(0.1,0.1,0.1);
                    // obj.localEuler=MathD.vec3.create(-90,0,0);
                    web3d.curScene.addChild(obj);
                }
            }) as web3d.glTFBundle;

            // let mat=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;
            // let obj=new web3d.GameObject();
            // let meshf=obj.addComponent<web3d.MeshFilter>("MeshFilter");
            // meshf.mesh=mesh;
            // let meshr=obj.addComponent<web3d.MeshRender>("MeshRender");
            // meshr.material=mat;

            let camobj=new web3d.GameObject();
            let cam=camobj.addComponent("Camera") as web3d.Camera;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition=MathD.vec3.create(0,0,25);

            //camobj.transform.lookatPoint(MathD.vec3.ZERO);

            let trans=new web3d.GameObject().transform;
            web3d.curScene.addChild(trans);
            

        }


        start() 
        {
            this.load();


        }
        update(delta: number) 
        {


        }

    }
}