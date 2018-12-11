namespace webGraph
{
    /**
     * The buffer class.
     */
    export abstract class BaseBuffer extends abstractPlatformEntity<WebGLBuffer> {
        protected target: number;
        protected rendermodel:number;
        /**
         * Constructor.
         * @param target The buffer target
         */
        public constructor(target: number,rendermodel:number=rendingWebgl.STATIC_DRAW) {
            super(rendingWebgl.createBuffer());
            this.target = target;
            this.rendermodel=rendermodel;
        }

        /**
         * Write the specified buffer data to the buffer. 
         * @param bufferData The buffer data
         */
        //public abstract bufferData(bufferData: any[]);

        public attach(): void { rendingWebgl.bindBuffer(this.target, this.instance); }


        public detach(): void { rendingWebgl.bindBuffer(this.target, null); }

        public dispose()
        {
            rendingWebgl.deleteBuffer(this.instance);
        }
    }
}
