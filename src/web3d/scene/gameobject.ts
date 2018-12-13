///<reference path="../util/reflect.ts" />

namespace web3d
{
    /**
     * @public
     */
    export enum HideFlags {
        None = 0x00000000,
        HideInHierarchy = 0x00000001,
        HideInInspector = 0x00000002,
        DontSaveInEditor = 0x00000004,
        NotEditable = 0x00000008,
        DontSaveInBuild = 0x00000010,
        DontUnloadUnusedAsset = 0x00000020,
        DontSave = 0x00000034,
        HideAndDontSave = 0x0000003D
    }

    /**
     * 组件实例接口
     */
    export interface INodeComponent {
        gameObject: GameObject;
        Start();
        Update();
        Clone();
        Dispose();
    }

    /**
     * gameObject类 对应unity中gameObject概念
     */
    @Serialize("GameObject")
    export class GameObject {
        @Attribute
        name: string = "GameObject";

        @Attribute
        beVisible = true;

        @Attribute
        mask: LayerMask= LayerMask.default;
        // @Attribute
        // layer: number = 0;//物件有一个layer 取值范围0~31，各种功能都可以用layer mask 去过滤作用范围


        @Attribute
        transform: Transform;

        // get transform()
        // {
        //     if(this._transform==null)
        //     {
        //         this._transform=new Transform();
        //         this._transform["_gameObject"]=this;
        //     }
        //     return this._transform;
        // }
        // set transform(value:Transform)
        // {   
        //     this._transform=value;
        //     value["_gameObject"]=this;
        // }

        @Attribute
        //components: INodeComponent[] = [];

        comps:{[type:string]:INodeComponent}={};
        private componentsInit: INodeComponent[] = [];

        // meshFilter: MeshFilter;
        
        render: IRender;

        // camera: Camera;
    
        // light: Light;
        // collider: Boxcollider;


        constructor()
        {
            this.transform=new Transform();
            this.transform.gameObject=this;
        }
        /**
         * 初始化 主要是组件的初始化
         */
        start()
        {
            if (this.componentsInit.length==0) return;

            for (let i = 0,len=this.componentsInit.length; i < len; i++) {
                if(this.componentsInit[i].Start==null)
                {
                    console.error(this.componentsInit);
                }
                this.componentsInit[i].Start();
            }
            this.componentsInit.length = 0;
        }

        /**
         * 主update
         */
        update(delta: number) {
            // if (this.components.length==0) return;
            // for (let i = 0,len=this.components.length; i < len; i++) {
            //     this.components[i].Update(delta);
            // }
            for(let key in this.comps)
            {
                this.comps[key].Update();
            }
        }

        /**
         * 根据组件类型添加一个组件
         */
        addComponent<T extends INodeComponent>(type:string): T {
            let className:string=type;
            // for (let key in this.components) {
            //     let comp=this.components[key];
            //     if(getRegistedClassName(comp)==className)
            //     {
            //         console.error("ERROR: This Gameobject already have same type component.\n INFO:component name: " + type)
            //         return comp as T;
            //     }
            // }
            if(this.comps[type]!=null)
            {
                console.error("ERROR: This Gameobject already have same type component.\n INFO:component name: " + type)
                return this.comps[type] as T;
            }

            let comp=creatComponent(className);
            if(comp)
            {
                comp.gameObject = this;

                // this.components.push(comp);
                this.comps[type]=comp;
                this.componentsInit.push(comp);
                if(type==MeshRender.type||type==SimpleSkinMeshRender.type||type==SkinMeshRender.type||type==Text3d.type)
                {
                    this.render = comp;
                }
            }
            return comp;            
        }
//#region  remove component
        /**
         * 根据组件实例移出组件
         */
        removeComponent(comp: INodeComponent) {
            this.comps[comp["type"]].Dispose();
            delete this.comps[comp["type"]];
        }
        /**
         * 根据组件类型移出组件
         */
        removeComponentByType(type: string) 
        {
            this.comps[type].Dispose();
            delete this.comps[type];
        }
        /**
         * 移出所有组件
         */
        removeAllComponents() {
            for(let key in this.comps)
            {
                this.removeComponentByType(key);
            }
            this.comps={};
        }
//#endregion

//#region  get component
        /**
         * 根据类型获取组件 只是自己身上找到的第一个
         */
        getComponent<T extends INodeComponent>(type:string): T {
            return this.comps[type] as T;
        }

        /**
         * 获取自己和所有子物体中 所有该类型的组件
         */
        getComponentsInChildren(name:string): INodeComponent[] {
            let components: INodeComponent[] = [];
            let obj=this;
            let comp=obj.getComponent(name);
            if(comp!=null)
            {
                components.push(comp);
            }
            this.getCompoentInchilds(name,obj,components);
            return components;
        }
        private getCompoentInchilds(name:string,obj:GameObject,comps:INodeComponent[])
        {
            let trans=obj.transform.children;
            for(let i=0,len=trans.length;i<len;i++)
            {
                let comp=trans[i].gameObject.getComponent(name);
                if(comp!=null)
                {
                    comps.push(comp);
                }
                this.getCompoentInchilds(name,trans[i].gameObject,comps);
            }
        }
//#endregion
        /**
         * 释放gameObject
         */
        dispose() {
            this.removeAllComponents();
        }

    }
}

