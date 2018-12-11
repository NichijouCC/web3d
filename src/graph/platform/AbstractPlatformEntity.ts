namespace webGraph
{
    // export declare let webgl: WebGLRenderingContext;  
    /**
     * The abstract platform entity class.
     */
    export abstract class abstractPlatformEntity<T extends WebGLObject> implements IAttachable {
        public instance: T;

        /**
         * Constructor.
         * @param instance The native platform entity instance
         */
        protected constructor(instance: T) {
            this.instance = instance;
        }

        public abstract attach(): void;
        public abstract detach(): void;
    }
}

