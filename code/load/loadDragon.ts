
namespace dome {
    export class loadDragon implements IState {

        tran: web3d.Transform[] = [];
        skinmeshrender: web3d.SimpleSkinMeshRender[] = [];
        loadModel() {
            let long = web3d.assetMgr.load("resource/prefab/elong/resources/elong_elong.mesh.bin") as web3d.Mesh;
            let mat = web3d.assetMgr.load("resource/prefab/elong/resources/1525_firedragon02_d.mat.json") as web3d.Material;
            let a = 10;
            let b = 10;
            let count = 20;
            for (let i = -count; i <= count; i++) {
                for (let j = -count; j <= count; j++) {
                    let trans = new web3d.Transform();
                    let meshr = trans.gameObject.addComponent<web3d.SimpleSkinMeshRender>("SimpleSkinMeshRender");
                    meshr.material = mat;
                    meshr.mesh = long;
                    web3d.curScene.addChild(trans);
                    trans.localPosition[0] = i * 5;
                    trans.localPosition[1] = 0;
                    trans.localPosition[2] = j * 5;
                    this.tran.push(trans);
                    this.skinmeshrender.push(meshr);
                }
            }
        }
        loadAniclip() {
            web3d.assetMgr.load("resource/prefab/elong/resources/RunFBAni.aniclip.bin", (asset,state) => {
                if (state.beSucces) {
                    let par = new web3d.Transform();
                    par.gameObject.name = "player";
                    web3d.curScene.addChild(par);
                    let aniplayer = par.gameObject.addComponent<web3d.SimpleAnimator>("SimpleAnimator");
                    for (let i = 0; i < this.skinmeshrender.length; i++) {
                        this.skinmeshrender[i].bindPlayer = aniplayer;
                    }
                    aniplayer.play(asset as web3d.Aniclip);
                }
            })
        }
        private camera:web3d.Camera;
        addCamera() {
            let tran2 = new web3d.Transform();
            tran2.gameObject.name = "camera";
            let cam = tran2.gameObject.addComponent<web3d.Camera>("Camera");
            cam.backgroundColor = MathD.color.create(0.3, 0.3, 0.3);
            web3d.curScene.addChild(tran2);
            tran2.localPosition[1] = 235;
            tran2.lookatPoint(MathD.vec3.ZERO);
            tran2.markDirty();

            this.camera=cam;
        }
        addBtn()
        {
            let o = document.createElement('input');
            o.type = 'button';
            o.value="开启（高斯模糊）posteffect";
            o.onclick=()=>{

            }
        }

        start() {
            web3d.assetMgr.load("resource/shader/shader.assetbundle.json",(state)=>{
                this.loadModel();
                this.addCamera();
                this.loadAniclip();
            })
        }

        time: number = 0;
        update(delta: number) {
            this.time += delta;

        }

    }
}