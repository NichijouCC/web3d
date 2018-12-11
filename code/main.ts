/// <reference path="../lib/web3d.d.ts" />


interface IState
{
    start();
    update(delta: number);
}
//需加上这个反射标记，引擎才能通过名字找到这个类，并自动创建他
@web3d.UserCode
class main implements web3d.IUserCode
{
    app: web3d.application;
    state: IState;
    onStart()
    {
        console.log("i am here.");
        this.app =web3d.app;


        this.addBtn("component_text3d_html", () => new component.Text3d_html(),0);
        this.addBtn("component_UI_rawImage", () => new component.UI_rawImage(),0);
        this.addBtn("component_skin", () => new component.skinDome(),0);

        this.addBtn("Render_vaoCompared",()=>new Render.VaoTest(),1);
        this.addBtn("Render_GpuInstance",()=>new Render.GpuInstance(),1);
        this.addBtn("Render_postEffect", () => new Render.postEffect(),1);
        this.addBtn("Render_Pbr", () => new Render.sampleModel(),1);

        this.addBtn("interAction_move_WSAD", () => new dome.KeyInput(),0);
        this.addBtn("interAction_rayIntersect_Mouse", () => new dome_ray.rayIntersect(),0);

        this.addBtn("Math_LooKAt", () => new dome.LooKAt(),2);
        this.addBtn("dome_skyBox",()=>new dome.Skybox(),2);
        this.addBtn("dome_dynamicFont", () => new dome.DynamicFont(),2);
        this.addBtn("gltf_cubeAndSphere", () => new gltf.CubesAndSpheres(),2);
        this.addBtn("dome_springBone",()=>new dome.spingBone(),2);
        this.addBtn("dome_LayerCtr",()=>new dome.LayerCtr(),2);
        this.addBtn("dome_Stencil",()=>new dome.Stencil(),2);





        // this.addBtn("pbr", () => new dome.PBR());
        // this.addBtn("pbr_UI", () => new dome.PBR_UI());
        // this.addBtn("loaditem", () => new dome.loaditem());
        
        // this.addBtn("loadSeriesCube", () => new dome.loadSeriesCube());
        // this.addBtn("loadprefab", () => new dome.loadPrefab());
        // this.addBtn("loadscene", () => new dome.loadScene());
        this.addBtn("loadgltf", () => new dome.LoadGlTF());


        // this.addBtn("testrenderstate", () => new dome.testRenderState());
        // this.addBtn("loadShader", () => new dome.loaditem());
        // // this.addBtn("testmath", () => new dome.testMat4());

        // //this.addBtn("test_blend", () => new test.testblend());
        // this.addBtn("test_looprun", () => new dome.testloopRun());
        // this.addBtn("test_seralize", () => new dome.testSeralize());


        // this.addBtn("loadDragon",()=>new dome.loadDragon());
        
    }
    private columnArr:number[]=[100,100,100,100];
    private columnOffset:number=200;
    private btns: HTMLButtonElement[] = [];
    private addBtn(text: string, act: () => IState,column:number=3)
    {
        let btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = () =>
        {
            this.clearBtn();
            this.state = act();
            this.state.start();
        }
        btn.style.top = this.columnArr[column] + "px";
        this.columnArr[column]+=25;
        btn.style.left = this.columnOffset*column + "px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);

    }
    private clearBtn()
    {
        for (let i = 0,len=this.btns.length; i < len; i++)
        {
            this.app.container.removeChild(this.btns[i]);
        }
        this.btns.length = 0;
    }
    onUpdate(delta: number)
    {
        if (this.state != null)
            this.state.update(delta);
    }
    isClosed(): boolean
    {
        return false;
    }
}
