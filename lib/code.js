var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let main = class main {
    constructor() {
        this.columnArr = [100, 100, 100, 100];
        this.columnOffset = 200;
        this.btns = [];
    }
    onStart() {
        console.log("i am here.");
        this.app = web3d.app;
        this.addBtn("component_text3d_html", () => new component.Text3d_html(), 0);
        this.addBtn("component_UI_rawImage", () => new component.UI_rawImage(), 0);
        this.addBtn("component_skin", () => new component.skinDome(), 0);
        this.addBtn("Render_vaoCompared", () => new Render.VaoTest(), 1);
        this.addBtn("Render_GpuInstance", () => new Render.GpuInstance(), 1);
        this.addBtn("Render_postEffect", () => new Render.postEffect(), 1);
        this.addBtn("Render_Pbr", () => new Render.sampleModel(), 1);
        this.addBtn("interAction_move_WSAD", () => new dome.KeyInput(), 0);
        this.addBtn("interAction_rayIntersect_Mouse", () => new dome_ray.rayIntersect(), 0);
        this.addBtn("Math_LooKAt", () => new dome.LooKAt(), 2);
        this.addBtn("dome_skyBox", () => new dome.Skybox(), 2);
        this.addBtn("dome_dynamicFont", () => new dome.DynamicFont(), 2);
        this.addBtn("gltf_cubeAndSphere", () => new gltf.CubesAndSpheres(), 2);
        this.addBtn("dome_springBone", () => new dome.spingBone(), 2);
        this.addBtn("dome_LayerCtr", () => new dome.LayerCtr(), 2);
        this.addBtn("dome_Stencil", () => new dome.Stencil(), 2);
        this.addBtn("loadgltf", () => new dome.LoadGlTF());
    }
    addBtn(text, act, column = 3) {
        let btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = () => {
            this.clearBtn();
            this.state = act();
            this.state.start();
        };
        btn.style.top = this.columnArr[column] + "px";
        this.columnArr[column] += 25;
        btn.style.left = this.columnOffset * column + "px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
    }
    clearBtn() {
        for (let i = 0, len = this.btns.length; i < len; i++) {
            this.app.container.removeChild(this.btns[i]);
        }
        this.btns.length = 0;
    }
    onUpdate(delta) {
        if (this.state != null)
            this.state.update(delta);
    }
    isClosed() {
        return false;
    }
};
main = __decorate([
    web3d.UserCode
], main);
var dome;
(function (dome) {
    class PBR {
        start() {
            this.load();
        }
        update(delta) {
        }
        load() {
            let mat = new web3d.Material();
            let shader = web3d.assetMgr.load("resource/shader/pbr_UI.shader.json");
            mat.setShader(shader);
            let rolename = "Cerberus_LP";
            let baseTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_A.png");
            let normalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_N.png");
            let metalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_M.png");
            let roughnessTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_R.png");
            let brdfTex = web3d.assetMgr.load("resource/texture/brdfLUT.imgdes.json");
            let e_cubeDiff = new web3d.CubeTexture();
            let e_diffuseArr = [];
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
            e_cubeDiff.groupCubeTexture(e_diffuseArr);
            let env_speTex = new web3d.CubeTexture();
            for (let i = 0; i < 10; i++) {
                let urlarr = [];
                urlarr.push("resource/texture/papermill/specular/specular_right_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_left_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_top_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_bottom_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_front_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_back_" + i + ".jpg");
                env_speTex.groupMipmapCubeTexture(urlarr, i, 9);
            }
            mat.setTexture("u_BaseColorSampler", baseTex);
            mat.setTexture("u_NormalSampler", normalTex);
            mat.setTexture("u_metalSampler", metalTex);
            mat.setTexture("u_roughnessSampler", roughnessTex);
            mat.setTexture("u_brdfLUT", brdfTex);
            mat.setCubeTexture("u_DiffuseEnvSampler", e_cubeDiff);
            mat.setCubeTexture("u_SpecularEnvSampler", env_speTex);
            let url = "resource/glTF/Cerberus_LP/glTF/Cerberus_LP.gltf";
            web3d.assetMgr.load(url, (prefab) => {
                let pre = prefab;
                let gun = pre.Instantiate();
                let renders = gun.gameObject.getComponentsInChildren("MeshRender");
                renders[0].material = mat;
                web3d.curScene.addChild(gun);
            });
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = -10;
            camobj.transform.markDirty();
            web3d.curScene.enableSkyBox();
            let e_Diff = new web3d.CubeTexture();
            let e_DiffArr = [];
            e_DiffArr.push("resource/texture/papermill/environment/environment_right_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_left_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_top_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_bottom_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_front_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_back_0.jpg");
            e_Diff.groupCubeTexture(e_DiffArr);
            web3d.SkyBox.setSkyCubeTexture(e_Diff);
        }
    }
    dome.PBR = PBR;
})(dome || (dome = {}));
var component;
(function (component) {
    class UI_rawImage {
        start() {
            let obj = new web3d.Node2d();
            obj.transform2d.width = 100;
            obj.transform2d.height = 100;
            let image2d = obj.addComponent(web3d.RawImage2D.name);
            web3d.curScene.addChild(obj.transform2d);
        }
        update(delta) {
        }
    }
    component.UI_rawImage = UI_rawImage;
})(component || (component = {}));
var component;
(function (component) {
    class skinDome {
        load() {
            let url = "resource/glTF/CesiumMan/glTF/CesiumMan.gltf";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                }
            });
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(2, 2, 5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);
        }
        start() {
            this.load();
        }
        update(delta) {
        }
    }
    component.skinDome = skinDome;
})(component || (component = {}));
var component;
(function (component) {
    class Text3d_html {
        constructor() {
            this.timer = 0;
        }
        start() {
            let obj = new web3d.GameObject();
            let text = obj.addComponent("Text3dHtml");
            text.textContent = "hello world!";
            obj.transform.localPosition = MathD.vec3.create(0.5, 0.5, 0.5);
            web3d.curScene.addChild(obj.transform);
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 15;
            camobj.transform.markDirty();
            let cube = new web3d.GameObject();
            this.cube = cube.transform;
            let meshf = cube.addComponent("MeshFilter");
            let meshr = cube.addComponent("MeshRender");
            meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
            meshr.material = web3d.assetMgr.getDefaultMaterial("def");
            web3d.curScene.addChild(cube.transform);
            cube.transform.addChild(obj.transform);
        }
        update(delta) {
            this.timer += delta * 80;
            MathD.quat.FromEuler(45, 45, this.timer, this.cube.localRotation);
            this.cube.markDirty();
        }
    }
    component.Text3d_html = Text3d_html;
})(component || (component = {}));
var dome;
(function (dome) {
    class rimlight {
        start() {
            throw new Error("Method not implemented.");
        }
        update(delta) {
            throw new Error("Method not implemented.");
        }
        loadmodel() {
            let long = web3d.assetMgr.load("resource/prefab/elong/resources/elong_elong.mesh.bin");
            let mat = web3d.assetMgr.load("resource/prefab/elong/resources/1525_firedragon02_d.mat.json");
            let trans = new web3d.Transform();
            let meshr = trans.gameObject.addComponent(web3d.SkinMeshRender.type);
            meshr.material = mat;
            meshr.mesh = long;
            web3d.curScene.addChild(trans);
        }
    }
    dome.rimlight = rimlight;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class LooKAt {
        constructor() {
            this.otherObjs = [];
            this.timer = 0;
        }
        start() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.png");
            let mat1 = new web3d.Material();
            let shader = web3d.assetMgr.getShader("def");
            mat1.setShader(shader);
            mat1.setTexture("_MainTex", tex1);
            mat1.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            let objCount = 6;
            let radius = 6;
            for (let i = 0; i < 6; i++) {
                let obj = new web3d.GameObject();
                let meshf = obj.addComponent("MeshFilter");
                let meshr = obj.addComponent("MeshRender");
                meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
                meshr.material = mat1;
                obj.transform.localPosition = MathD.vec3.create(radius * Math.cos(Math.PI * 2 * i / objCount), 0, radius * Math.sin(Math.PI * 2 * i / objCount));
                web3d.curScene.addChild(obj.transform);
                this.otherObjs.push(obj.transform);
            }
            let mat2 = new web3d.Material();
            mat2.setShader(shader);
            mat2.setTexture("_MainTex", tex1);
            mat2.setVector4("_MainColor", MathD.vec4.create(1, 0, 0, 1));
            let obj1 = new web3d.GameObject();
            this.centerObj = obj1;
            web3d.curScene.addChild(obj1.transform);
            let meshf = obj1.addComponent("MeshFilter");
            let meshr = obj1.addComponent("MeshRender");
            meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
            meshr.material = mat2;
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            camobj.transform.markDirty();
        }
        update(delta) {
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.Z)) {
                this.centerObj.transform.localPosition[1] += 0.1;
                this.centerObj.transform.markDirty();
            }
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.X)) {
                this.centerObj.transform.localPosition[1] -= 0.1;
                this.centerObj.transform.markDirty();
            }
            this.timer += delta;
            this.centerObj.transform.localPosition[1] = Math.sin(this.timer) * 10;
            this.centerObj.transform.markDirty();
            for (let i = 0; i < this.otherObjs.length; i++) {
                this.otherObjs[i].lookat(this.centerObj.transform);
            }
        }
    }
    dome.LooKAt = LooKAt;
})(dome || (dome = {}));
var gltf;
(function (gltf) {
    class CubesAndSpheres {
        constructor() {
            this.transList = [];
            this.time = 0;
        }
        init() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.png");
            let tex2 = web3d.assetMgr.load("resource/texture/def2.png");
            let tex3 = web3d.assetMgr.load("resource/mat/2.jpg");
            let mat0 = web3d.assetMgr.load("resource/mat/diff.mat.json");
            let shader = web3d.assetMgr.getShader("def");
            let mat1 = new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex", tex1);
            mat1.setVector4("_MainColor", MathD.vec4.create(0.9, 0.5, 0.5, 1));
            let shader1 = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let mat2 = new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex", tex3);
            mat2.setVector4("_MainColor", MathD.vec4.create(0.5, 0.5, 0.9, 1));
            let promiseArr = [];
            Promise.all([web3d.assetMgr.loadAsync("resource/glTF/Cube/Cube.gltf"),
                web3d.assetMgr.loadAsync("resource/glTF/Sphere/Sphere.gltf")])
                .then(([cube, sphere]) => {
                let cubePrefab = cube;
                let spherePrefab = sphere;
                for (let k = 0; k < 20; k++) {
                    for (let i = -10; i <= 10; i++) {
                        for (let j = -10; j <= 10; j++) {
                            let becube = Math.random() > 0.5;
                            let obj = becube ? cubePrefab.Instantiate() : spherePrefab.Instantiate();
                            let render = obj.gameObject.getComponentsInChildren("MeshRender");
                            render[0].material = Math.random() > 0.5 ? mat1 : mat2;
                            ;
                            web3d.curScene.addChild(obj);
                            obj.localPosition[0] = i * 2;
                            obj.localPosition[1] = j * 2;
                            obj.localPosition[2] = -k * 2;
                            this.transList.push(obj);
                        }
                    }
                }
            });
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            camobj.transform.markDirty();
            this.camTrans = camobj.transform;
        }
        start() {
            this.init();
        }
        update(delta) {
            this.time += delta;
            for (let i = 0; i < this.transList.length; i++) {
                let tran = this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP, this.time, tran.localRotation);
                tran.markDirty();
            }
        }
    }
    gltf.CubesAndSpheres = CubesAndSpheres;
})(gltf || (gltf = {}));
var dome;
(function (dome) {
    class LayerCtr {
        constructor() {
            this.uiAtts = { frame: 0 };
        }
        load() {
            this.uiShow();
            let modelName = "model4";
            modelName = "wm_model";
            let url = "resource/scene/" + modelName + "/scene.gltf";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                    this.model = obj;
                }
            });
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 2, 5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);
        }
        uiShow() {
            let gui = new dat.GUI();
            gui.add(this.uiAtts, 'frame', 0, 1);
            this.addBtn("play", 600, 600, () => {
                let anim = this.model.gameObject.getComponent(web3d.Animation.type);
                anim.playAnimationByName("Take 001", 0.3);
            });
        }
        start() {
            this.load();
        }
        update(delta) {
            if (this.model != null) {
                let anim = this.model.gameObject.getComponent(web3d.Animation.type);
                if (anim) {
                    anim.setFrame("Take 001", this.uiAtts.frame);
                }
            }
        }
        addBtn(text, top, left, act) {
            let btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () => {
                act();
            };
            btn.style.top = top + "px";
            btn.style.left = left + "px";
            btn.style.position = "absolute";
            web3d.app.container.appendChild(btn);
        }
    }
    dome.LayerCtr = LayerCtr;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class Skybox {
        start() {
            this.initSky();
        }
        update(delta) {
        }
        initSky() {
            web3d.curScene.enableSkyBox();
            let e_Diff = new web3d.CubeTexture();
            let e_DiffArr = [];
            e_DiffArr.push("resource/texture/papermill/environment/environment_right_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_left_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_top_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_bottom_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_front_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_back_0.jpg");
            e_Diff.groupCubeTexture(e_DiffArr);
            web3d.SkyBox.setSkyCubeTexture(e_Diff);
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 10;
            camobj.transform.markDirty();
        }
    }
    dome.Skybox = Skybox;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class spingBone {
        constructor() {
            this.uiAtts = { rotSpeed: 0, maxSpeed: 1, windspeed: 1 };
        }
        load() {
            this.uiShow();
            let url = "resource/scene/unitychan/scene.gltf";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                    this.model = obj.find("unitychan");
                }
            });
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 2, 5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);
        }
        uiShow() {
            let gui = new dat.GUI();
            gui.add(this.uiAtts, 'rotSpeed', -1, 1);
            gui.add(this.uiAtts, 'maxSpeed', 0, 20);
            gui.add(this.uiAtts, 'windspeed', 0, 10);
        }
        start() {
            this.load();
        }
        update(delta) {
            if (this.model != null) {
                let rot = MathD.quat.create();
                MathD.quat.AxisAngle(MathD.vec3.UP, this.uiAtts.rotSpeed * delta * this.uiAtts.maxSpeed, rot);
                MathD.quat.multiply(this.model.localRotation, rot, this.model.localRotation);
                this.model.markDirty();
                let mgr = this.model.gameObject.getComponent("SpringManager");
                mgr.windspeed = this.uiAtts.windspeed;
            }
        }
    }
    dome.spingBone = spingBone;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class Stencil {
        load() {
            this.uiShow();
            let url = "resource/scene/Cube/scene.gltf";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                    this.model = obj;
                }
            });
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 2, 5);
            camobj.transform.lookatPoint(MathD.vec3.ZERO);
        }
        uiShow() {
        }
        start() {
            this.load();
        }
        update(delta) {
        }
        addBtn(text, top, left, act) {
            let btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () => {
                act();
            };
            btn.style.top = top + "px";
            btn.style.left = left + "px";
            btn.style.position = "absolute";
            web3d.app.container.appendChild(btn);
        }
    }
    dome.Stencil = Stencil;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class DynamicFont {
        start() {
            let obj = new web3d.GameObject();
            let text3d = obj.addComponent("Text3d");
            text3d.textContent = "hello world!";
            web3d.curScene.addChild(obj.transform);
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 15;
            camobj.transform.markDirty();
            let cube = new web3d.GameObject();
            let meshf = cube.addComponent("MeshFilter");
            let meshr = cube.addComponent("MeshRender");
            meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
            meshr.material = web3d.assetMgr.getDefaultMaterial("def");
            web3d.curScene.addChild(cube.transform);
            cube.transform.addChild(obj.transform);
        }
        update(delta) {
        }
    }
    dome.DynamicFont = DynamicFont;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class KeyInput {
        constructor() {
            this.deltaMove = 0.1;
        }
        start() {
            let floor = web3d.DebugTool.createCube();
            floor.localScale = MathD.vec3.create(10, 0.1, 10);
            web3d.curScene.addChild(floor);
            let cube = web3d.DebugTool.createCube();
            this.target = cube;
            web3d.curScene.addChild(cube);
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 15, 15);
            camobj.transform.markDirty();
            this.cam = camobj.transform;
            this.cam.lookat(this.target);
        }
        update(delta) {
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.A)) {
                this.target.localPosition.x -= this.deltaMove;
                this.target.markDirty();
            }
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.D)) {
                this.target.localPosition.x += this.deltaMove;
                this.target.markDirty();
            }
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.W)) {
                this.target.localPosition.z -= this.deltaMove;
                this.target.markDirty();
            }
            if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.S)) {
                this.target.localPosition.z += this.deltaMove;
                this.target.markDirty();
            }
        }
    }
    dome.KeyInput = KeyInput;
})(dome || (dome = {}));
var dome_ray;
(function (dome_ray) {
    class rayIntersect {
        start() {
            let obj = web3d.DebugTool.createCube();
            this.target = obj;
            this.targetMesh = obj.gameObject.getComponent(web3d.MeshFilter.type).mesh;
            web3d.curScene.addChild(obj);
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            camobj.transform.localPosition = MathD.vec3.create(15, 15, 15);
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.lookat(this.target);
        }
        update(delta) {
            if (web3d.Input.getMouseDown(web3d.MouseKeyEnum.Left)) {
                let ray = web3d.Camera.Main.screenPointToRay(web3d.Input.mousePosition);
                if (web3d.Physics.rayIntersectMesh(ray.origin, ray.direction, this.targetMesh)) {
                    let endpos = MathD.vec3.create();
                    MathD.vec3.scale(ray.direction, 100, endpos);
                    let trans = web3d.DebugTool.drawLine(ray.origin, endpos);
                    web3d.curScene.addChild(trans);
                    let mat = this.target.gameObject.getComponent(web3d.MeshRender.type).materials[0];
                    mat.setColor("_MainColor", MathD.color.create(1, 0, 0, 1));
                    setTimeout(() => {
                        mat.setColor("_MainColor", MathD.color.create(1, 1, 1, 1));
                    }, 100);
                }
            }
        }
    }
    dome_ray.rayIntersect = rayIntersect;
})(dome_ray || (dome_ray = {}));
var dome;
(function (dome) {
    class loaditem {
        load() {
            let shader = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let tex1 = web3d.assetMgr.load("resource/texture/2.jpg");
            let cube = web3d.assetMgr.load("resource/mesh/quad.mesh.bin");
            let quad = web3d.assetMgr.getDefaultMesh("quad");
            let mat = web3d.assetMgr.load("resource/mat/diff.mat.json");
            let obj = new web3d.GameObject();
            let meshf = obj.addComponent("MeshFilter");
            meshf.mesh = quad;
            let render = obj.addComponent("MeshRender");
            let shader1 = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let mat2 = new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex", tex1);
            mat2.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            render.material = mat2;
            web3d.curScene.addChild(obj.transform);
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            camobj.transform.localPosition[2] = -50;
            web3d.curScene.addChild(camobj.transform);
        }
        start() {
            this.load();
        }
        update(delta) {
        }
    }
    dome.loaditem = loaditem;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class loadDragon {
        constructor() {
            this.tran = [];
            this.skinmeshrender = [];
            this.time = 0;
        }
        loadModel() {
            let long = web3d.assetMgr.load("resource/prefab/elong/resources/elong_elong.mesh.bin");
            let mat = web3d.assetMgr.load("resource/prefab/elong/resources/1525_firedragon02_d.mat.json");
            let a = 10;
            let b = 10;
            let count = 20;
            for (let i = -count; i <= count; i++) {
                for (let j = -count; j <= count; j++) {
                    let trans = new web3d.Transform();
                    let meshr = trans.gameObject.addComponent("SimpleSkinMeshRender");
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
            web3d.assetMgr.load("resource/prefab/elong/resources/RunFBAni.aniclip.bin", (asset, state) => {
                if (state.beSucces) {
                    let par = new web3d.Transform();
                    par.gameObject.name = "player";
                    web3d.curScene.addChild(par);
                    let aniplayer = par.gameObject.addComponent("SimpleAnimator");
                    for (let i = 0; i < this.skinmeshrender.length; i++) {
                        this.skinmeshrender[i].bindPlayer = aniplayer;
                    }
                    aniplayer.play(asset);
                }
            });
        }
        addCamera() {
            let tran2 = new web3d.Transform();
            tran2.gameObject.name = "camera";
            let cam = tran2.gameObject.addComponent("Camera");
            cam.backgroundColor = MathD.color.create(0.3, 0.3, 0.3);
            web3d.curScene.addChild(tran2);
            tran2.localPosition[1] = 235;
            tran2.lookatPoint(MathD.vec3.ZERO);
            tran2.markDirty();
            this.camera = cam;
        }
        addBtn() {
            let o = document.createElement('input');
            o.type = 'button';
            o.value = "开启（高斯模糊）posteffect";
            o.onclick = () => {
            };
        }
        start() {
            web3d.assetMgr.load("resource/shader/shader.assetbundle.json", (state) => {
                this.loadModel();
                this.addCamera();
                this.loadAniclip();
            });
        }
        update(delta) {
            this.time += delta;
        }
    }
    dome.loadDragon = loadDragon;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class loadPrefab {
        start() {
            let prefabName = "elong";
            prefabName = "Cube";
            prefabName = "Plane";
            prefabName = "chos_town_001";
            prefabName = "GameObject";
            web3d.assetMgr.load("resource/prefab/" + prefabName + "/" + prefabName + ".prefab.json", (state) => {
                let prefab = web3d.assetMgr.load("resource/prefab/" + prefabName + "/" + prefabName + ".prefab.json");
                let ob0 = prefab.instantiate();
                web3d.curScene.addChild(ob0);
                let camobj = new web3d.GameObject();
                let cam = camobj.addComponent("Camera");
                camobj.addComponent("CameraController");
                web3d.curScene.addChild(camobj.transform);
                camobj.transform.localPosition[2] = -10;
            });
        }
        update(delta) {
        }
    }
    dome.loadPrefab = loadPrefab;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class loadScene {
        start() {
            let sceneName = "lightmap";
            sceneName = "Town";
            web3d.assetMgr.load("resource/scene/" + sceneName + "/" + sceneName + ".scene.json", (state) => {
                let Scene = web3d.assetMgr.load("resource/scene/" + sceneName + "/" + sceneName + ".scene.json");
                web3d.curScene.addChild(Scene.root);
                web3d.renderContext.lightmap = Scene.lightMap;
                web3d.curScene.enableLightMap();
                let camobj = new web3d.GameObject();
                let cam = camobj.addComponent("Camera");
                camobj.addComponent("CameraController");
                web3d.curScene.addChild(camobj.transform);
                camobj.transform.localPosition[1] = 10;
                camobj.transform.localPosition[2] = 10;
                camobj.transform.markDirty();
            });
        }
        update(delta) {
        }
    }
    dome.loadScene = loadScene;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class loadSeriesCube {
        constructor() {
            this.transList = [];
            this.time = 0;
        }
        loadmesh() {
        }
        test() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.jpg");
            let tex2 = web3d.assetMgr.load("resource/texture/def2.png");
            let tex3 = web3d.assetMgr.load("resource/mat/2.imgdes.json");
            let mat0 = web3d.assetMgr.load("resource/mat/diff.mat.json");
            let shader = web3d.assetMgr.getShader("def");
            let mat1 = new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex", tex1);
            mat1.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            for (let k = 0; k < 10; k++) {
                for (let i = -10; i <= 10; i++) {
                    for (let j = -10; j <= 10; j++) {
                        let obj = new web3d.GameObject();
                        let meshf = obj.addComponent("MeshFilter");
                        let becube = Math.random() > 0.5;
                        meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
                        let render = obj.addComponent("MeshRender");
                        render.material = mat1;
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0] = i * 2;
                        obj.transform.localPosition[1] = j * 2;
                        obj.transform.localPosition[2] = -k * 2;
                        this.transList.push(obj.transform);
                    }
                }
            }
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            camobj.transform.markDirty();
            this.trans = camobj.transform;
        }
        start() {
            this.test();
        }
        update(delta) {
            this.time += delta;
        }
    }
    dome.loadSeriesCube = loadSeriesCube;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class LoadGlTF {
        load() {
            let url = "resource/glTF/box/Box.gltf";
            url = "resource/glTF/BoxAnimated/glTF/BoxAnimated.gltf";
            url = "resource/glTF/RiggedSimple/glTF/RiggedSimple.gltf";
            url = "resource/glTF/CesiumMan/glTF/CesiumMan.gltf";
            url = "resource/glTF/CesiumMan/glTF-Binary/CesiumMan.glb";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                }
            });
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 0, 25);
            let trans = new web3d.GameObject().transform;
            web3d.curScene.addChild(trans);
        }
        start() {
            this.load();
        }
        update(delta) {
        }
    }
    dome.LoadGlTF = LoadGlTF;
})(dome || (dome = {}));
var Render;
(function (Render) {
    class GpuInstance {
        constructor() {
            this.transList = [];
            this.time = 0;
        }
        init() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.png");
            let tex2 = web3d.assetMgr.load("resource/texture/def2.png");
            let mat0 = web3d.assetMgr.load("resource/mat/diff.mat.json");
            let shader = web3d.assetMgr.getShader("def");
            let mat1 = new web3d.Material();
            mat1.setShader(shader);
            mat1.setTexture("_MainTex", tex1);
            mat1.setVector4("_MainColor", MathD.vec4.create(0.9, 0.5, 0.5, 1));
            let shader1 = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let mat2 = new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex", tex1);
            mat2.setVector4("_MainColor", MathD.vec4.create(0.9, 0.5, 0.5, 1));
            mat2.ToggleInstance();
            let mat3 = new web3d.Material();
            mat3.setShader(shader1);
            mat3.setTexture("_MainTex", tex1);
            mat3.setVector4("_MainColor", MathD.vec4.create(0.5, 0.5, 0.9, 1));
            mat3.ToggleInstance();
            for (let k = 0; k < 20; k++) {
                for (let i = -10; i <= 10; i++) {
                    for (let j = -10; j <= 10; j++) {
                        let obj = new web3d.GameObject();
                        let meshf = obj.addComponent("MeshFilter");
                        let meshr = obj.addComponent("MeshRender");
                        meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
                        meshr.material = Math.random() > 0.5 ? mat2 : mat3;
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0] = i * 2;
                        obj.transform.localPosition[1] = j * 2;
                        obj.transform.localPosition[2] = k * 2;
                        let scale = MathD.random(0.3, 1.3);
                        obj.transform.localScale = MathD.vec3.create(scale, scale, scale);
                        this.transList.push(obj.transform);
                    }
                }
            }
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            camobj.transform.markDirty();
            this.camTrans = camobj.transform;
        }
        start() {
            this.init();
        }
        update(delta) {
            this.time += delta;
            for (let i = 0; i < this.transList.length; i++) {
                let tran = this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP, this.time, tran.localRotation);
                tran.markDirty();
            }
        }
    }
    Render.GpuInstance = GpuInstance;
})(Render || (Render = {}));
var dome;
(function (dome) {
    class pbrAtt {
        constructor() {
            this.modelName = "sphere";
            this.BaseColor = [255, 255, 255];
            this.metalFactor = 1;
            this.roughnessFactor = 1;
            this.LightColor = [255, 255, 255];
            this.LightRotY = 0;
            this.LightRotZ = 0;
            this.Env_diffuseIntensity = 1;
            this.Env_SpeculerIntensity = 1;
            this.IBL_Intensity = 1;
            this.Base_Texture = "none";
            this.BRDF_Texture = "none";
            this.IBL_Texture = "none";
        }
    }
    dome.pbrAtt = pbrAtt;
    class PBR_UI {
        constructor() {
            this.showobjType = "sphere";
        }
        start() {
            this.pbratt = new pbrAtt();
            this.load();
            this.showobjType = this.pbratt.modelName;
            this.loadSphere();
        }
        resetmat(mat, metalScale = 1, roughnessScale = 1) {
            mat.setVector4("u_BaseColorFactor", MathD.vec4.create(this.pbratt.BaseColor[0] / 255, this.pbratt.BaseColor[1] / 255, this.pbratt.BaseColor[2] / 255, 1.0));
            mat.setFloat("u_metalFactor", this.pbratt.metalFactor * metalScale);
            mat.setFloat("u_roughnessFactor", this.pbratt.roughnessFactor * roughnessScale);
            switch (this.pbratt.Base_Texture) {
                case "Main":
                    mat.setVector4("u_ScaleBaseTex", MathD.vec4.create(1.0, 0, 0, 0));
                    break;
                case "Metal":
                    mat.setVector4("u_ScaleBaseTex", MathD.vec4.create(0, 1.0, 0, 0));
                    break;
                case "Roughness":
                    mat.setVector4("u_ScaleBaseTex", MathD.vec4.create(0, 0, 1.0, 0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_ScaleBaseTex", MathD.vec4.create(0, 0, 0, 0));
                    break;
            }
            switch (this.pbratt.BRDF_Texture) {
                case "F":
                    mat.setVector4("u_Scalebrdf", MathD.vec4.create(1.0, 0, 0, 0));
                    break;
                case "G":
                    mat.setVector4("u_Scalebrdf", MathD.vec4.create(0, 1.0, 0, 0));
                    break;
                case "D":
                    mat.setVector4("u_Scalebrdf", MathD.vec4.create(0, 0, 1.0, 0));
                    break;
                case "F*G*D/(4.0*NdotL*NdotV)":
                    mat.setVector4("u_Scalebrdf", MathD.vec4.create(0, 0, 0, 1.0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_Scalebrdf", MathD.vec4.create(0, 0, 0, 0));
                    break;
            }
            switch (this.pbratt.IBL_Texture) {
                case "preDiffuse":
                    mat.setVector4("u_ScaleIBL", MathD.vec4.create(1.0, 0, 0, 0));
                    break;
                case "preSpeculer":
                    mat.setVector4("u_ScaleIBL", MathD.vec4.create(0, 1.0, 0, 0));
                    break;
                case "Env_diffuse":
                    mat.setVector4("u_ScaleIBL", MathD.vec4.create(0, 0, 1.0, 0));
                    break;
                case "Env_speculer":
                    mat.setVector4("u_ScaleIBL", MathD.vec4.create(0, 0, 0, 1.0));
                    break;
                case "none":
                default:
                    mat.setVector4("u_ScaleIBL", MathD.vec4.create(0, 0, 0, 0));
                    break;
            }
        }
        update(delta) {
            if (this.pbrMat) {
                if (this.pbrMat instanceof Array && this.pbrMat.length > 1) {
                    for (let i = 0; i < 7; i++) {
                        for (let k = 0; k < 7; k++) {
                            let mat = this.pbrMat[i * 7 + k];
                            this.resetmat(mat, i / 6.0, k / 6.0);
                        }
                    }
                }
                else if (this.pbrMat instanceof web3d.Material) {
                    this.resetmat(this.pbrMat);
                }
            }
            if (this.pbratt.modelName != this.showobjType) {
                switch (this.pbratt.modelName) {
                    case "gun":
                        this.loadGun();
                        break;
                    case "sphere":
                        this.loadSphere();
                        break;
                }
                this.showobjType = this.pbratt.modelName;
            }
        }
        uiShow() {
            let gui = new dat.GUI();
            gui.add(this.pbratt, 'modelName', ['sphere', 'gun']);
            let baseData = gui.addFolder('baseData');
            baseData.addColor(this.pbratt, 'BaseColor');
            baseData.add(this.pbratt, 'metalFactor', 0, 1);
            baseData.add(this.pbratt, 'roughnessFactor', 0, 1);
            let light = gui.addFolder('Light');
            light.addColor(this.pbratt, 'LightColor');
            light.add(this.pbratt, 'LightRotY', 0, 360);
            light.add(this.pbratt, 'LightRotZ', 0, 360);
            let IBL = gui.addFolder('IBL');
            IBL.add(this.pbratt, 'Env_diffuseIntensity', 0, 5);
            IBL.add(this.pbratt, 'Env_diffuseIntensity', 0, 5);
            IBL.add(this.pbratt, 'IBL_Intensity', 0, 5);
            gui.add(this.pbratt, 'Base_Texture', ["none", 'Main', 'Metal', 'Roughness']);
            gui.add(this.pbratt, 'BRDF_Texture', ["none", 'F', 'G', 'D', 'F*G*D/(4.0*NdotL*NdotV)']);
            gui.add(this.pbratt, 'IBL_Texture', ["none", 'preDiffuse', 'preSpeculer', 'Env_diffuse', 'Env_speculer']);
        }
        loadGun() {
            if (this.showObj) {
                this.showObj.beVisible = false;
            }
            if (this.gunobj != null) {
                this.gunobj.beVisible = true;
                this.showObj = this.gunobj;
                this.pbrMat = this.gunmat;
                return;
            }
            let mat = new web3d.Material();
            this.gunmat = mat;
            mat.setShader(this.pbrShader);
            this.pbrMat = mat;
            let rolename = "Cerberus_LP";
            let baseTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_A.png");
            let normalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_N.png");
            let metalTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_M.png");
            let roughnessTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_R.png");
            let AOTex = web3d.assetMgr.load("resource/prefab/" + rolename + "/resources/Cerberus_AO.png");
            mat.setTexture("u_BaseColorSampler", baseTex);
            mat.setTexture("u_NormalSampler", normalTex);
            mat.setTexture("u_metalSampler", metalTex);
            mat.setTexture("u_roughnessSampler", roughnessTex);
            mat.setTexture("u_OcclusionSampler", AOTex);
            mat.setTexture("u_brdfLUT", this.brdfTex);
            mat.setCubeTexture("u_DiffuseEnvSampler", this.env_diffTex);
            mat.setCubeTexture("u_SpecularEnvSampler", this.env_speTex);
            web3d.assetMgr.load("resource/glTF/Cerberus_LP/glTF/Cerberus_LP.gltf", (prefab) => {
                let pre = prefab;
                let gun = pre.Instantiate();
                let renders = gun.gameObject.getComponentsInChildren("MeshRender");
                renders[0].material = mat;
                web3d.curScene.addChild(gun);
                this.gunobj = gun.gameObject;
                this.showObj = gun.gameObject;
            });
        }
        loadSphere() {
            if (this.showObj) {
                this.showObj.beVisible = false;
            }
            if (this.sphereObj != null) {
                this.sphereObj.beVisible = true;
                this.showObj = this.sphereObj;
                this.pbrMat = this.matarr;
                return;
            }
            let matarr = [];
            this.matarr = matarr;
            this.pbrMat = matarr;
            let normalTex = web3d.assetMgr.load("resource/texture/121.png");
            let objroot = new web3d.GameObject();
            this.sphereObj = objroot;
            this.showObj = objroot;
            web3d.assetMgr.loadAsync("resource/glTF/Sphere/Sphere.gltf").then((bundle) => {
                for (let i = -3; i < 4; i++) {
                    for (let k = -3; k < 4; k++) {
                        let mat = new web3d.Material();
                        mat.setShader(this.pbrShader);
                        mat.setTexture("u_brdfLUT", this.brdfTex);
                        mat.setTexture("u_NormalSampler", normalTex);
                        mat.setCubeTexture("u_DiffuseEnvSampler", this.env_diffTex);
                        mat.setCubeTexture("u_SpecularEnvSampler", this.env_speTex);
                        matarr.push(mat);
                        let obj = bundle.Instantiate();
                        let meshr = obj.gameObject.getComponentsInChildren("MeshRender");
                        meshr[0].material = mat;
                        obj.localPosition[0] = k * 1.5;
                        obj.localPosition[1] = i * 1.5;
                        objroot.transform.addChild(obj);
                    }
                }
            });
            web3d.curScene.addChild(objroot.transform);
        }
        load() {
            web3d.LoadScript("lib/dat.gui.min.js", () => {
                this.uiShow();
            });
            this.pbrShader = web3d.assetMgr.load("resource/shader/pbr_UI.shader.json");
            let brdfTex = web3d.assetMgr.load("resource/texture/brdfLUT.png");
            this.brdfTex = brdfTex;
            let e_cubeDiff = new web3d.CubeTexture();
            this.env_diffTex = e_cubeDiff;
            let e_diffuseArr = [];
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
            e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
            e_cubeDiff.groupCubeTexture(e_diffuseArr);
            let env_speTex = new web3d.CubeTexture();
            this.env_speTex = env_speTex;
            for (let i = 0; i < 10; i++) {
                let urlarr = [];
                urlarr.push("resource/texture/papermill/specular/specular_right_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_left_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_top_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_bottom_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_front_" + i + ".jpg");
                urlarr.push("resource/texture/papermill/specular/specular_back_" + i + ".jpg");
                env_speTex.groupMipmapCubeTexture(urlarr, i, 9);
            }
            let camobj = new web3d.GameObject();
            camobj.name = "camera";
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 10;
            camobj.transform.markDirty();
            web3d.curScene.enableSkyBox();
            let e_Diff = new web3d.CubeTexture();
            let e_DiffArr = [];
            e_DiffArr.push("resource/texture/papermill/environment/environment_right_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_left_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_top_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_bottom_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_front_0.jpg");
            e_DiffArr.push("resource/texture/papermill/environment/environment_back_0.jpg");
            e_Diff.groupCubeTexture(e_DiffArr);
            web3d.SkyBox.setSkyCubeTexture(e_Diff);
        }
    }
    dome.PBR_UI = PBR_UI;
})(dome || (dome = {}));
var Render;
(function (Render) {
    class postEffect {
        constructor() {
            this.transList = [];
            this.time = 0;
            this.effectAtt = { type: "高斯模糊" };
            this.effectDic = {};
        }
        test() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.png");
            let tex2 = web3d.assetMgr.load("resource/texture/def2.png");
            let mat0 = web3d.assetMgr.load("resource/mat/diff.mat.json");
            let shader1 = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let mat2 = new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex", tex1);
            mat2.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            for (let i = -10; i <= 10; i++) {
                for (let j = -10; j <= 10; j++) {
                    let obj = new web3d.GameObject();
                    let meshf = obj.addComponent("MeshFilter");
                    meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
                    let render = obj.addComponent("MeshRender");
                    render.material = Math.random() > 0.5 ? mat0 : mat2;
                    web3d.curScene.addChild(obj.transform);
                    obj.transform.localPosition[0] = i * 2;
                    obj.transform.localPosition[1] = j * 2;
                    this.transList.push(obj.transform);
                }
            }
            let camobj = new web3d.GameObject();
            this.trans = camobj.transform;
            let cam = camobj.addComponent("Camera");
            this.cam = cam;
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            let eff = new web3d.Blur();
            cam.addPostEffect(eff);
            camobj.transform.markDirty();
        }
        start() {
            this.test();
            this.uiShow();
        }
        update(delta) {
            this.time += delta;
            for (let i = 0; i < this.transList.length; i++) {
                let tran = this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP, this.time, tran.localRotation);
                tran.markDirty();
            }
        }
        uiShow() {
            let gui = new dat.GUI();
            let controller = gui.add(this.effectAtt, 'type', ['高斯模糊', '马赛克']);
            controller.onChange((value) => {
                switch (value) {
                    case "高斯模糊":
                        this.cam.clearPostEffect();
                        if (this.effectDic[value] == null) {
                            this.effectDic[value] = new web3d.Blur();
                        }
                        this.cam.addPostEffect(this.effectDic[value]);
                        break;
                    case "马赛克":
                        this.cam.clearPostEffect();
                        if (this.effectDic[value] == null) {
                            this.effectDic[value] = new web3d.Mosaic();
                        }
                        this.cam.addPostEffect(this.effectDic[value]);
                        break;
                }
            });
        }
    }
    Render.postEffect = postEffect;
})(Render || (Render = {}));
var Render;
(function (Render) {
    class sampleModel {
        load() {
            web3d.glTFBundle.BeUsePBRMaterial = true;
            let url = "resource/glTF/FlightHelmet/FlightHelmet.gltf";
            let bundle = web3d.assetMgr.load(url, (asset, state) => {
                if (state.beSucces) {
                    let obj = bundle.Instantiate();
                    web3d.curScene.addChild(obj);
                }
            });
            let camobj = new web3d.GameObject();
            let cam = camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition = MathD.vec3.create(0, 0, 2);
        }
        start() {
            this.load();
        }
        update(delta) {
        }
    }
    Render.sampleModel = sampleModel;
})(Render || (Render = {}));
var Render;
(function (Render) {
    class VaoTest {
        constructor() {
            this.transList = [];
            this.time = 0;
            this.beuseVao = false;
        }
        init() {
            let tex1 = web3d.assetMgr.load("resource/texture/def1.png");
            let tex2 = web3d.assetMgr.load("resource/texture/def2.png");
            let shader1 = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
            let mat2 = new web3d.Material();
            mat2.setShader(shader1);
            mat2.setTexture("_MainTex", tex1);
            mat2.setVector4("_MainColor", MathD.vec4.create(0.9, 0.5, 0.5, 1));
            let mat3 = new web3d.Material();
            mat3.setShader(shader1);
            mat3.setTexture("_MainTex", tex1);
            mat3.setVector4("_MainColor", MathD.vec4.create(0.5, 0.5, 0.9, 1));
            for (let k = 0; k < 20; k++) {
                for (let i = -10; i <= 10; i++) {
                    for (let j = -10; j <= 10; j++) {
                        let obj = new web3d.GameObject();
                        let meshf = obj.addComponent("MeshFilter");
                        let meshr = obj.addComponent("MeshRender");
                        meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
                        meshr.material = Math.random() > 0.5 ? mat2 : mat3;
                        web3d.curScene.addChild(obj.transform);
                        obj.transform.localPosition[0] = i * 2;
                        obj.transform.localPosition[1] = j * 2;
                        obj.transform.localPosition[2] = k * 2;
                        let scale = MathD.random(0.3, 1.3);
                        obj.transform.localScale = MathD.vec3.create(scale, scale, scale);
                        this.transList.push(obj.transform);
                    }
                }
            }
            let camobj = new web3d.GameObject();
            camobj.addComponent("Camera");
            camobj.addComponent("CameraController");
            web3d.curScene.addChild(camobj.transform);
            camobj.transform.localPosition[2] = 50;
            camobj.transform.markDirty();
            this.camTrans = camobj.transform;
            this.btn = this.addBtn("开启Vao", 100, 300, () => {
                this.beuseVao = !this.beuseVao;
                webGraph.render.BeUseVao = this.beuseVao;
                this.btn.textContent = this.beuseVao ? "关闭VAO" : "开启VAO";
            });
        }
        start() {
            this.init();
        }
        update(delta) {
            this.time += delta;
            for (let i = 0; i < this.transList.length; i++) {
                let tran = this.transList[i];
                MathD.quat.AxisAngle(MathD.vec3.UP, this.time, tran.localRotation);
                tran.markDirty();
            }
        }
        addBtn(text, x, y, act) {
            let btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () => {
                act();
            };
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            web3d.app.container.appendChild(btn);
            return btn;
        }
    }
    Render.VaoTest = VaoTest;
})(Render || (Render = {}));
var dome;
(function (dome) {
    class testloopRun {
        constructor() {
            this.pos = MathD.vec3.create();
            this.scale = MathD.vec3.create();
            this.rot = MathD.quat.create();
            this.mat = MathD.mat4.create();
        }
        start() {
            this.func1(this.func2);
        }
        func1(onfinish) {
            for (let i = 0; i < 5000; i++) {
                MathD.mat4.RTS(this.pos, this.scale, this.rot, this.mat);
            }
            if (onfinish != null) {
                onfinish();
            }
        }
        func2() {
            for (let i = 0; i < 5000; i++) {
                MathD.mat4.RTS(this.pos, this.scale, this.rot, this.mat);
            }
        }
        update(delta) {
        }
    }
    dome.testloopRun = testloopRun;
})(dome || (dome = {}));
var dome;
(function (dome) {
    class testRenderState {
        start() {
            let gl = web3d.webgl;
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            let srccolor = gl.SRC_ALPHA;
            gl.blendFunc(srccolor, gl.DST_COLOR);
            let src = gl.getParameter(gl.BLEND_SRC_RGB);
            gl.flush();
            gl.disable(gl.BLEND);
            gl.flush();
            gl.enable(gl.BLEND);
            let src1 = gl.getParameter(gl.BLEND_SRC_RGB);
            gl.flush();
            console.log("srccolor:" + srccolor + "  //src0:" + src + "  //src1:" + src1);
        }
        update(delta) {
        }
    }
    dome.testRenderState = testRenderState;
})(dome || (dome = {}));
//# sourceMappingURL=code.js.map