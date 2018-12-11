namespace web3d
{
    /**
     * @author mrdoob / http://mrdoob.com/
     * @modify lights translate -> typescript
     */
    /**
     * @private
     */
    export class Stats
    {
        constructor(app:application)
        {
            this.app = app;

            this.container = document.createElement('div');
            this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.7;z-index:1';
            this.container.addEventListener('click', (event) =>
            {

                event.preventDefault();
                this.showPanel(++this.mode % this.container.children.length);

            }, false);

            //

            this.beginTime = (performance || Date).now(), this.prevTime = this.beginTime, this.frames = 0;

            this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
            this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
            this.ratePanel = this.addPanel(new Panel('%', '#0f0', '#020'));
            this.userratePanel = this.addPanel(new Panel('%', '#0f0', '#020'));
            if (self.performance && self.performance["memory"])
            {

                this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));

            }

            this.showPanel(0);
        }

        update()
        {
            this.beginTime = this.end();
        }
        app:application;
        container: HTMLDivElement;
        private mode = 0;
        private REVISION: 16;
        private beginTime: number;
        private prevTime: number;
        private frames: number;
        private fpsPanel: Panel;
        private msPanel: Panel;
        private memPanel: Panel;
        private ratePanel:Panel;
        private userratePanel:Panel;
        private showPanel(id: number)
        {

            for (let i = 0; i < this.container.children.length; i++)
            {

                this.container.children[i]["style"].display = i === id ? 'block' : 'none';

            }
            this.mode = id;
        }

        private addPanel(panel: Panel): Panel
        {
            this.container.appendChild(panel.canvas);
            return panel;
        }

        private begin()
        {

            this.beginTime = (performance || Date).now();

        }

        private end(): number
        {

            this.frames++;

            let time = (performance || Date).now();

            this.msPanel.update(time - this.beginTime, 200);
            if (time > this.prevTime + 1000)
            {
                let fps = (this.frames * 1000) / (time - this.prevTime);

                this.fpsPanel.update(fps, 100);
                // this.ratePanel.update(this.app.getUpdateTimer() * this.frames / 10, 100);
                // this.userratePanel.update(this.app.getUserUpdateTimer() * this.frames / 10, 100);

                this.prevTime = time;
                this.frames = 0;

                if (this.memPanel)
                {

                    let memory = performance["memory"];
                    this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);

                }

            }

            return time;

        }


    }
    /**
     * @private
     */
    class Panel
    {
        constructor(name: string, fg: string, bg: string)
        {
            this.name = name;
            this.fg = fg;
            this.bg = bg;

            this.min = Infinity;
            this.max = 0;
            this.PR = Math.round(window.devicePixelRatio || 1);

            this.WIDTH = 80 * this.PR;
            this.HEIGHT = 48 * this.PR;

            this.TEXT_X = 3 * this.PR;
            this.TEXT_Y = 2 * this.PR;
            this.GRAPH_X = 3 * this.PR;
            this.GRAPH_Y = 15 * this.PR;
            this.GRAPH_WIDTH = 74 * this.PR, this.GRAPH_HEIGHT = 30 * this.PR;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.WIDTH;
            this.canvas.height = this.HEIGHT;
            this.canvas.style.cssText = 'width:80px;height:48px';

            this.context = this.canvas.getContext('2d');
            this.context.font = 'bold ' + (9 * this.PR) + 'px Helvetica,Arial,sans-serif';
            this.context.textBaseline = 'top';

            this.context.fillStyle = bg;
            this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            this.context.fillStyle = fg;
            this.context.fillText(name, this.TEXT_X, this.TEXT_Y);
            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);

            this.context.fillStyle = bg;
            this.context.globalAlpha = 0.9;
            this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
        }
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        name: string;
        PR: number;
        fg: string;
        bg: string;
        min: number;
        max: number;
        WIDTH: number;
        HEIGHT: number;
        TEXT_X: number;
        TEXT_Y: number;
        GRAPH_X: number;
        GRAPH_Y: number;
        GRAPH_WIDTH: number;
        GRAPH_HEIGHT: number;

        update(value, maxValue)
        {

            this.min = Math.min(this.min, value);
            this.max = Math.max(this.max, value);

            this.context.fillStyle = this.bg;
            this.context.globalAlpha = 1;
            this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
            this.context.fillStyle = this.fg;
            this.context.fillText(Math.round(value) + ' ' + this.name + ' (' + Math.round(this.min) + '-' + Math.round(this.max) + ')', this.TEXT_X, this.TEXT_Y);

            this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT);

            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);

            this.context.fillStyle = this.bg;
            this.context.globalAlpha = 0.9;
            this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, Math.round((1 - (value / maxValue)) * this.GRAPH_HEIGHT));

        }
    }
}
