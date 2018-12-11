namespace web3d
{
    export class Node2d
    {
        beVisible = true;
        //CullingMask: number = CullingMask.default;//物件有一个layer 取值范围0~31，各种功能都可以用layer mask 去过滤作用范围
        name: string = "2D Node";
        transform2d:Transform2D;
    
        renderer: IRectRenderer;
        // collider: ICollider2d;
        components: I2DComponent[] = [];
        private componentsInit :I2DComponent[]=[];
    
        constructor()
        {
            this.transform2d=new Transform2D();
            this.transform2d.node2d=this;
        }
    
        start() {
            if (this.componentsInit.length==0) return;
            for (let i = 0,len=this.componentsInit.length; i < len; i++) {
                this.componentsInit[i].start();
            }
            this.componentsInit.length = 0;
        }
        /**
         * 当前节点的update
         */
        update(delta: number) {
            if (this.components.length == 0) return;
            for (let i = 0; i < this.components.length; i++)
            {
                this.components[i].update(delta);
            }
        }
        /**
         * 根据组件类型添加一个组件
         */
        addComponent<T extends I2DComponent>(type:string): T {
            let className=type;
            for (let key in this.components) {
                let comp=this.components[key];
                if(getRegistedClassName(comp)==className)
                {
                    console.error("ERROR: This Gameobject already have same type component.\n INFO:component name: " + type)
                    return comp as T;
                }
            }
            let comp=creatComponent2d(type);
            if(comp)
            {
                comp.node2d = this;
                this.components.push(comp);
                this.componentsInit.push(comp);
    
                switch(type)
                {
                    case RawImage2D.name:
                        this.renderer = comp;
                        break;
                    // case Camera.name:
                    //     this.camera= comp;
                    //     break;
                    // case light.name:
                    //     this.light = comp;
                    //     break;
                    // case MeshFilter.name:
                    //     this.meshFilter=comp;
                }
            }
            return comp;            
        }
    
    
        removeComponent(comp: I2DComponent) {
            if (!comp) return;
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i] == comp) {
                    let p = this.components.splice(i, 1);
                    comp.dispose();
                    break;
                }
            }
        }
    
        removeAllComponents() {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].dispose();
            }
            if (this.renderer) this.renderer = null;
            // if (this.collider) this.renderer = null;
            this.components.length = 0;
        }
        getComponent<T extends I2DComponent>(type:Function): T {
            for (let i = 0,len=this.components.length; i < len; i++) {
                
                let cname = getRegistedClassName(this.components[i]);
                if (cname == type.name) {
                    return this.components[i] as T;
                }
            }
            return null;
        }
    }
}
