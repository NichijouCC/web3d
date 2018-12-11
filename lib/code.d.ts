/// <reference path="web3d.d.ts" />
/// <reference path="jsloader.d.ts" />
interface IState {
    start(): any;
    update(delta: number): any;
}
declare class main implements web3d.IUserCode {
    app: web3d.application;
    state: IState;
    onStart(): void;
    private columnArr;
    private columnOffset;
    private btns;
    private addBtn;
    private clearBtn;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace dome {
    class PBR implements IState {
        start(): void;
        update(delta: number): void;
        load(): void;
    }
}
declare namespace component {
    class UI_rawImage implements IState {
        private cube;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace component {
    class skinDome implements IState {
        load(): void;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace component {
    class Text3d_html implements IState {
        private cube;
        start(): void;
        private timer;
        update(delta: number): void;
    }
}
declare namespace dome {
    class rimlight implements IState {
        start(): void;
        update(delta: number): void;
        private loadmodel;
    }
}
declare namespace dome {
    class LooKAt implements IState {
        private centerObj;
        private otherObjs;
        start(): void;
        private timer;
        update(delta: number): void;
    }
}
declare namespace gltf {
    class CubesAndSpheres implements IState {
        transList: web3d.Transform[];
        init(): void;
        start(): void;
        camTrans: web3d.Transform;
        time: number;
        update(delta: number): void;
    }
}
declare namespace dome {
    class LayerCtr implements IState {
        private model;
        load(): void;
        private uiAtts;
        private uiShow;
        start(): void;
        update(delta: number): void;
        private addBtn;
    }
}
declare namespace dome {
    class Skybox implements IState {
        start(): void;
        update(delta: number): void;
        initSky(): void;
    }
}
declare namespace dome {
    class spingBone implements IState {
        private model;
        load(): void;
        private uiAtts;
        private uiShow;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class Stencil implements IState {
        private model;
        load(): void;
        private uiShow;
        start(): void;
        update(delta: number): void;
        private addBtn;
    }
}
declare namespace dome {
    class DynamicFont implements IState {
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class KeyInput implements IState {
        target: web3d.Transform;
        cam: web3d.Transform;
        start(): void;
        private deltaMove;
        update(delta: number): void;
    }
}
declare namespace dome_ray {
    class rayIntersect implements IState {
        target: web3d.Transform;
        targetMesh: web3d.Mesh;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class loaditem implements IState {
        load(): void;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class loadDragon implements IState {
        tran: web3d.Transform[];
        skinmeshrender: web3d.SimpleSkinMeshRender[];
        loadModel(): void;
        loadAniclip(): void;
        private camera;
        addCamera(): void;
        addBtn(): void;
        start(): void;
        time: number;
        update(delta: number): void;
    }
}
declare namespace dome {
    class loadPrefab implements IState {
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class loadScene implements IState {
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class loadSeriesCube implements IState {
        transList: web3d.Transform[];
        loadmesh(): void;
        test(): void;
        start(): void;
        trans: web3d.Transform;
        time: number;
        update(delta: number): void;
    }
}
declare namespace dome {
    class LoadGlTF implements IState {
        load(): void;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace Render {
    class GpuInstance implements IState {
        transList: web3d.Transform[];
        init(): void;
        start(): void;
        camTrans: web3d.Transform;
        time: number;
        update(delta: number): void;
    }
}
declare namespace dome {
    class pbrAtt {
        modelName: string;
        BaseColor: number[];
        metalFactor: number;
        roughnessFactor: number;
        LightColor: number[];
        LightRotY: number;
        LightRotZ: number;
        Env_diffuseIntensity: number;
        Env_SpeculerIntensity: number;
        IBL_Intensity: number;
        Base_Texture: string;
        BRDF_Texture: string;
        IBL_Texture: string;
    }
    class PBR_UI implements IState {
        pbratt: pbrAtt;
        pbrShader: web3d.Shader;
        pbrMat: any;
        start(): void;
        private resetmat;
        update(delta: number): void;
        private uiShow;
        private showobjType;
        private showObj;
        private gunobj;
        private gunmat;
        loadGun(): void;
        sphereObj: web3d.GameObject;
        matarr: web3d.Material[];
        loadSphere(): void;
        brdfTex: web3d.Texture;
        env_diffTex: web3d.CubeTexture;
        env_speTex: web3d.CubeTexture;
        load(): void;
    }
}
declare namespace Render {
    class postEffect implements IState {
        cam: web3d.Camera;
        transList: web3d.Transform[];
        test(): void;
        start(): void;
        trans: web3d.Transform;
        time: number;
        update(delta: number): void;
        private effectAtt;
        private effectDic;
        private uiShow;
    }
}
declare namespace Render {
    class sampleModel implements IState {
        load(): void;
        start(): void;
        update(delta: number): void;
    }
}
declare namespace Render {
    class VaoTest implements IState {
        transList: web3d.Transform[];
        init(): void;
        "": any;
        start(): void;
        camTrans: web3d.Transform;
        time: number;
        private beuseVao;
        update(delta: number): void;
        private btn;
        private addBtn;
    }
}
declare namespace dome {
    class testloopRun implements IState {
        start(): void;
        pos: MathD.vec3;
        scale: MathD.vec3;
        rot: MathD.quat;
        mat: Float32Array;
        func1(onfinish: () => void): void;
        func2(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class testRenderState implements IState {
        start(): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class testSeralize implements IState {
        private transroot;
        start(): void;
        update(delta: number): void;
        private addbutton;
    }
}
