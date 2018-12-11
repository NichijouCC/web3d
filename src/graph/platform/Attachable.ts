namespace webGraph
{
    /**
     * The attachable interface.
     */
    export interface IAttachable {
        
        /**
         * Attach the specified attachable.
         */
        attach(): void;
        
        /**
         * Detach the specified attachable.
         */
        detach(): void;
    }
}

