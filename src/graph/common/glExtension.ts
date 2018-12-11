namespace webGraph
{
    
    export class GLExtension
    {
        static vaoExt:OES_vertex_array_object|null;
        static hasVAOExt:boolean=false;
        static SRGBExt:any;
        static hasSRGBExt:boolean=false;
        static hasLODExt:boolean=false;
        static lodExt:EXT_shader_texture_lod|null;
        static hasOES:boolean=false;
        static OES:OES_standard_derivatives|null;
        static hasTexfloat:boolean=false;
        static texFloat:OES_texture_float|null;
        static hasTexLiner:boolean=false;
        static texLiner:OES_texture_float_linear|null;
        static objInstance:ANGLE_instanced_arrays|null;
        static hasObjInstance:boolean=false;
        static initExtension()
        {
            this.vaoExt = rendingWebgl.getExtension('OES_vertex_array_object');
            if(this.vaoExt!=null)
            {
                this.hasVAOExt=true;
                rendingWebgl.bindVertexArray=this.vaoExt.bindVertexArrayOES.bind(this.vaoExt);
                rendingWebgl.createVertexArray=this.vaoExt.createVertexArrayOES.bind(this.vaoExt);
                rendingWebgl.deleteVertexArray=this.vaoExt.deleteVertexArrayOES.bind(this.vaoExt);
            }
            this.SRGBExt=rendingWebgl.getExtension('EXT_SRGB');
            if(this.SRGBExt!=null)
            {
                this.hasSRGBExt=true;
            }
            this.lodExt=rendingWebgl.getExtension('EXT_shader_texture_lod');
            if(this.lodExt!=null)
            {
                this.hasLODExt=true;
            }
            this.OES=rendingWebgl.getExtension('OES_standard_derivatives');
            if(this.OES)
            {
                this.hasOES=true;
            }
            this.texFloat=rendingWebgl.getExtension('OES_texture_float');
            if(this.texFloat)
            {
                this.hasTexfloat=true;
            }
            this.texLiner=rendingWebgl.getExtension('OES_texture_float_linear');
            if(this.texLiner)
            {
                this.hasTexLiner=true;
            }
            this.objInstance= rendingWebgl.getExtension("ANGLE_instanced_arrays");
            if(this.objInstance)
            {
                this.hasObjInstance=true;
                rendingWebgl.drawElementsInstanced=this.objInstance.drawElementsInstancedANGLE.bind(this.objInstance);
                rendingWebgl.drawArraysInstanced=this.objInstance.drawArraysInstancedANGLE.bind(this.objInstance);
                rendingWebgl.vertexAttribDivisor=this.objInstance.vertexAttribDivisorANGLE.bind(this.objInstance);
            }
            Float32Array.prototype["x"] = function() 
            { 
                return this[0];
            }
            Float32Array.prototype["y"]=function(){
                return this[1];
            }
            Float32Array.prototype["z"]=function(){
                return this[2];
            }
            Float32Array.prototype["w"]=function(){
                return this[3];
            }
        }
        /**
         * returns an array of strings, one for each supported extension.
         */
        static queryAvailableExtension():string[]|null
        {
            let available_extensions = rendingWebgl.getSupportedExtensions();
            return available_extensions;
        }
    
    }
}
