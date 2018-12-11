
namespace web3d
{
    export class StateMgr
    {
        //#region 各种性能面板管控
        /**
         * 各种性能面板
         */
        static stats:Stats;
        static showFps()
        {
            if (this.stats == null)
            {
                this.stats = new Stats(app);
                this.stats. container.style.position = 'absolute'; //绝对坐标  
                this.stats.container.style.left = '0px';// (0,0)px,左上角  
                this.stats.container.style.top = '0px';
                app.container.appendChild(this.stats.container);
            }
            else
            {
                app.container.appendChild(this.stats.container);
            }
        }
    
        /**
         * 关闭性能参数面板
         */
        static closeFps()
        {
            if (this.stats != null)
            {
                app.container.removeChild(this.stats.container);
            }
        }
        //#endregion
    }
}
