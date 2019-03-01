// namespace dome
// {
//     export class testSeralize implements IState
//     {
//         private transroot:web3d.Transform;
//         start() 
//         {
//             let quad=web3d.assetMgr.load("resource/mesh/quad.mesh.bin") as web3d.Mesh;
//             let mat0=web3d.assetMgr.load("resource/mat/diff.mat.json") as web3d.Material;

            
//             let obj1=new web3d.GameObject();
//             obj1.name="obj1";
//             let meshf:web3d.MeshFilter=obj1.addComponent<web3d.MeshFilter>("MeshFilter");
//             let meshr:web3d.MeshRender=obj1.addComponent<web3d.MeshRender>("MeshRender");
//             meshf.mesh=quad;
//             meshr.material=mat0;
//             web3d.curScene.addChild(obj1.transform);

//             let obj2=new web3d.GameObject();
//             obj2.name="obj2";
//             let meshf2:web3d.MeshFilter=obj2.addComponent<web3d.MeshFilter>("MeshFilter");
//             let meshr2:web3d.MeshRender=obj2.addComponent<web3d.MeshRender>("MeshRender");
//             meshf2.mesh=quad;
//             meshr2.material=mat0;
//             obj1.transform.addChild(obj2.transform);

//             this.transroot=obj1.transform;

//             // web3d.Input.addKeyCodeEventListener(web3d.KeyCodeEventEnum.Down,()=>{
//             //     let json=ReflectD.Serlizer.serializeObj(this.transroot);
//             //     console.log(json);
//             // },web3d.KeyCodeEnum.P);
//             this.addbutton();
//         }

//         update(delta: number) {
            
//         }
        
//         private addbutton()
//         {
//             let btn = document.createElement("button");
//             btn.textContent = "Play";
//             btn.onclick = () =>
//             {
//                 let json=ReflectD.Serlizer.serializeObj(this.transroot);
//                 console.log(json);
//             }
//             btn.style.top = "100px";
//             btn.style.left="20px";
//             btn.style.position = "absolute";
//             web3d.app.container.appendChild(btn);
//         }
//     }
// }