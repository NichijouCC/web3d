namespace web3d
{
    export enum LightTypeEnum
    {
        Direction,
        Point,
        Spot,
    }
    
     /**
     * 灯光组件
     */
    @NodeComponent
    export class Light implements INodeComponent
    {
        static type:string="Light";
    
         /**
         * 挂载的gameobject
         */
        gameObject: GameObject;
        /**
         * 光源类型
         */
        type:LightTypeEnum;
         /**
         * @private
         */
        spotAngelCos:number =0.9;
        Start()
        {
    
        }
        Update()
        {
            
        }
         /**
         * @private
         */
        Dispose()
        {
    
        }
         /**
         * @private
         */
        Clone()
        {
    
        }
    }
}
