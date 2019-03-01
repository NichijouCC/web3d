var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var web3d;
(function (web3d) {
    class DebugTool {
        static createCube() {
            let obj = new web3d.GameObject();
            let meshf = obj.addComponent(web3d.MeshFilter.type);
            let meshr = obj.addComponent(web3d.MeshRender.type);
            meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
            meshr.material = web3d.assetMgr.getDefaultMaterial("def");
            return obj.transform;
        }
        static drawLine(from, to) {
            let obj = new web3d.GameObject();
            let meshf = obj.addComponent(web3d.MeshFilter.type);
            let meshr = obj.addComponent(web3d.MeshRender.type);
            let mesh = new web3d.Mesh();
            meshf.mesh = mesh;
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position, [from.x, from.y, from.z, to.x, to.y, to.z]);
            mesh.createVbowithAtts();
            let info = new web3d.subMeshInfo();
            info.beUseEbo = false;
            info.renderType = webGraph.PrimitiveRenderEnum.Lines;
            info.size = 2;
            mesh.submeshs.push(info);
            meshr.material = web3d.assetMgr.getDefaultMaterial("deferror");
            return obj.transform;
        }
    }
    web3d.DebugTool = DebugTool;
})(web3d || (web3d = {}));
var webGraph;
(function (webGraph) {
    class Graph {
        static init(_webgl) {
            webGraph.rendingWebgl = _webgl;
            webGraph.renderstateMgr = new webGraph.RenderStateMgr();
            webGraph.GLExtension.initExtension();
            webGraph.UniformSetter.initUniformDic();
            webGraph.AttributeSetter.initAttDic();
            this.maxTexImageUnits = webGraph.rendingWebgl.getParameter(webGraph.rendingWebgl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) - 1;
            for (let i = 0; i < this.maxTexImageUnits; i++) {
                this.unitFreeArr.push(i);
            }
        }
        static getFreeUnit(tex) {
            let freeSlot;
            if (this.unitFreeArr.length > 0) {
                freeSlot = this.unitFreeArr.shift();
                this.unitUsingArr.push(freeSlot);
                this.unitDic[freeSlot] = tex;
            }
            else {
                freeSlot = this.unitUsingArr.shift();
                this.unitDic[freeSlot].unit = null;
                this.unitUsingArr.push(freeSlot);
                this.unitDic[freeSlot] = tex;
            }
            tex.unit = freeSlot;
            return freeSlot;
        }
    }
    Graph.unitFreeArr = [];
    Graph.unitUsingArr = [];
    Graph.unitDic = {};
    webGraph.Graph = Graph;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    function numberEqual(a, b) {
        return a == b;
    }
    webGraph.numberEqual = numberEqual;
    function ArrayEqual(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
    webGraph.ArrayEqual = ArrayEqual;
    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
    webGraph.isPowerOf2 = isPowerOf2;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class GLExtension {
        static initExtension() {
            this.vaoExt = webGraph.rendingWebgl.getExtension('OES_vertex_array_object');
            if (this.vaoExt != null) {
                this.hasVAOExt = true;
                webGraph.rendingWebgl.bindVertexArray = this.vaoExt.bindVertexArrayOES.bind(this.vaoExt);
                webGraph.rendingWebgl.createVertexArray = this.vaoExt.createVertexArrayOES.bind(this.vaoExt);
                webGraph.rendingWebgl.deleteVertexArray = this.vaoExt.deleteVertexArrayOES.bind(this.vaoExt);
            }
            this.SRGBExt = webGraph.rendingWebgl.getExtension('EXT_SRGB');
            if (this.SRGBExt != null) {
                this.hasSRGBExt = true;
            }
            this.lodExt = webGraph.rendingWebgl.getExtension('EXT_shader_texture_lod');
            if (this.lodExt != null) {
                this.hasLODExt = true;
            }
            this.OES = webGraph.rendingWebgl.getExtension('OES_standard_derivatives');
            if (this.OES) {
                this.hasOES = true;
            }
            this.texFloat = webGraph.rendingWebgl.getExtension('OES_texture_float');
            if (this.texFloat) {
                this.hasTexfloat = true;
            }
            this.texLiner = webGraph.rendingWebgl.getExtension('OES_texture_float_linear');
            if (this.texLiner) {
                this.hasTexLiner = true;
            }
            this.objInstance = webGraph.rendingWebgl.getExtension("ANGLE_instanced_arrays");
            if (this.objInstance) {
                this.hasObjInstance = true;
                webGraph.rendingWebgl.drawElementsInstanced = this.objInstance.drawElementsInstancedANGLE.bind(this.objInstance);
                webGraph.rendingWebgl.drawArraysInstanced = this.objInstance.drawArraysInstancedANGLE.bind(this.objInstance);
                webGraph.rendingWebgl.vertexAttribDivisor = this.objInstance.vertexAttribDivisorANGLE.bind(this.objInstance);
            }
            Float32Array.prototype["x"] = function () {
                return this[0];
            };
            Float32Array.prototype["y"] = function () {
                return this[1];
            };
            Float32Array.prototype["z"] = function () {
                return this[2];
            };
            Float32Array.prototype["w"] = function () {
                return this[3];
            };
        }
        static queryAvailableExtension() {
            let available_extensions = webGraph.rendingWebgl.getSupportedExtensions();
            return available_extensions;
        }
    }
    GLExtension.hasVAOExt = false;
    GLExtension.hasSRGBExt = false;
    GLExtension.hasLODExt = false;
    GLExtension.hasOES = false;
    GLExtension.hasTexfloat = false;
    GLExtension.hasTexLiner = false;
    GLExtension.hasObjInstance = false;
    webGraph.GLExtension = GLExtension;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let GLConstants;
    (function (GLConstants) {
        GLConstants[GLConstants["DEPTH_BUFFER_BIT"] = 256] = "DEPTH_BUFFER_BIT";
        GLConstants[GLConstants["STENCIL_BUFFER_BIT"] = 1024] = "STENCIL_BUFFER_BIT";
        GLConstants[GLConstants["COLOR_BUFFER_BIT"] = 16384] = "COLOR_BUFFER_BIT";
        GLConstants[GLConstants["POINTS"] = 0] = "POINTS";
        GLConstants[GLConstants["LINES"] = 1] = "LINES";
        GLConstants[GLConstants["LINE_LOOP"] = 2] = "LINE_LOOP";
        GLConstants[GLConstants["LINE_STRIP"] = 3] = "LINE_STRIP";
        GLConstants[GLConstants["TRIANGLES"] = 4] = "TRIANGLES";
        GLConstants[GLConstants["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        GLConstants[GLConstants["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
        GLConstants[GLConstants["ZERO"] = 0] = "ZERO";
        GLConstants[GLConstants["ONE"] = 1] = "ONE";
        GLConstants[GLConstants["SRC_COLOR"] = 768] = "SRC_COLOR";
        GLConstants[GLConstants["ONE_MINUS_SRC_COLOR"] = 769] = "ONE_MINUS_SRC_COLOR";
        GLConstants[GLConstants["SRC_ALPHA"] = 770] = "SRC_ALPHA";
        GLConstants[GLConstants["ONE_MINUS_SRC_ALPHA"] = 771] = "ONE_MINUS_SRC_ALPHA";
        GLConstants[GLConstants["DST_ALPHA"] = 772] = "DST_ALPHA";
        GLConstants[GLConstants["ONE_MINUS_DST_ALPHA"] = 773] = "ONE_MINUS_DST_ALPHA";
        GLConstants[GLConstants["DST_COLOR"] = 774] = "DST_COLOR";
        GLConstants[GLConstants["ONE_MINUS_DST_COLOR"] = 775] = "ONE_MINUS_DST_COLOR";
        GLConstants[GLConstants["SRC_ALPHA_SATURATE"] = 776] = "SRC_ALPHA_SATURATE";
        GLConstants[GLConstants["FUNC_ADD"] = 32774] = "FUNC_ADD";
        GLConstants[GLConstants["BLEND_EQUATION"] = 32777] = "BLEND_EQUATION";
        GLConstants[GLConstants["BLEND_EQUATION_RGB"] = 32777] = "BLEND_EQUATION_RGB";
        GLConstants[GLConstants["BLEND_EQUATION_ALPHA"] = 34877] = "BLEND_EQUATION_ALPHA";
        GLConstants[GLConstants["FUNC_SUBTRACT"] = 32778] = "FUNC_SUBTRACT";
        GLConstants[GLConstants["FUNC_REVERSE_SUBTRACT"] = 32779] = "FUNC_REVERSE_SUBTRACT";
        GLConstants[GLConstants["BLEND_DST_RGB"] = 32968] = "BLEND_DST_RGB";
        GLConstants[GLConstants["BLEND_SRC_RGB"] = 32969] = "BLEND_SRC_RGB";
        GLConstants[GLConstants["BLEND_DST_ALPHA"] = 32970] = "BLEND_DST_ALPHA";
        GLConstants[GLConstants["BLEND_SRC_ALPHA"] = 32971] = "BLEND_SRC_ALPHA";
        GLConstants[GLConstants["CONSTANT_COLOR"] = 32769] = "CONSTANT_COLOR";
        GLConstants[GLConstants["ONE_MINUS_CONSTANT_COLOR"] = 32770] = "ONE_MINUS_CONSTANT_COLOR";
        GLConstants[GLConstants["CONSTANT_ALPHA"] = 32771] = "CONSTANT_ALPHA";
        GLConstants[GLConstants["ONE_MINUS_CONSTANT_ALPHA"] = 32772] = "ONE_MINUS_CONSTANT_ALPHA";
        GLConstants[GLConstants["BLEND_COLOR"] = 32773] = "BLEND_COLOR";
        GLConstants[GLConstants["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
        GLConstants[GLConstants["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
        GLConstants[GLConstants["ARRAY_BUFFER_BINDING"] = 34964] = "ARRAY_BUFFER_BINDING";
        GLConstants[GLConstants["ELEMENT_ARRAY_BUFFER_BINDING"] = 34965] = "ELEMENT_ARRAY_BUFFER_BINDING";
        GLConstants[GLConstants["STREAM_DRAW"] = 35040] = "STREAM_DRAW";
        GLConstants[GLConstants["STATIC_DRAW"] = 35044] = "STATIC_DRAW";
        GLConstants[GLConstants["DYNAMIC_DRAW"] = 35048] = "DYNAMIC_DRAW";
        GLConstants[GLConstants["BUFFER_SIZE"] = 34660] = "BUFFER_SIZE";
        GLConstants[GLConstants["BUFFER_USAGE"] = 34661] = "BUFFER_USAGE";
        GLConstants[GLConstants["CURRENT_VERTEX_ATTRIB"] = 34342] = "CURRENT_VERTEX_ATTRIB";
        GLConstants[GLConstants["FRONT"] = 1028] = "FRONT";
        GLConstants[GLConstants["BACK"] = 1029] = "BACK";
        GLConstants[GLConstants["FRONT_AND_BACK"] = 1032] = "FRONT_AND_BACK";
        GLConstants[GLConstants["CULL_FACE"] = 2884] = "CULL_FACE";
        GLConstants[GLConstants["BLEND"] = 3042] = "BLEND";
        GLConstants[GLConstants["DITHER"] = 3024] = "DITHER";
        GLConstants[GLConstants["STENCIL_TEST"] = 2960] = "STENCIL_TEST";
        GLConstants[GLConstants["DEPTH_TEST"] = 2929] = "DEPTH_TEST";
        GLConstants[GLConstants["SCISSOR_TEST"] = 3089] = "SCISSOR_TEST";
        GLConstants[GLConstants["POLYGON_OFFSET_FILL"] = 32823] = "POLYGON_OFFSET_FILL";
        GLConstants[GLConstants["SAMPLE_ALPHA_TO_COVERAGE"] = 32926] = "SAMPLE_ALPHA_TO_COVERAGE";
        GLConstants[GLConstants["SAMPLE_COVERAGE"] = 32928] = "SAMPLE_COVERAGE";
        GLConstants[GLConstants["NO_ERROR"] = 0] = "NO_ERROR";
        GLConstants[GLConstants["INVALID_ENUM"] = 1280] = "INVALID_ENUM";
        GLConstants[GLConstants["INVALID_VALUE"] = 1281] = "INVALID_VALUE";
        GLConstants[GLConstants["INVALID_OPERATION"] = 1282] = "INVALID_OPERATION";
        GLConstants[GLConstants["OUT_OF_MEMORY"] = 1285] = "OUT_OF_MEMORY";
        GLConstants[GLConstants["CW"] = 2304] = "CW";
        GLConstants[GLConstants["CCW"] = 2305] = "CCW";
        GLConstants[GLConstants["LINE_WIDTH"] = 2849] = "LINE_WIDTH";
        GLConstants[GLConstants["ALIASED_POINT_SIZE_RANGE"] = 33901] = "ALIASED_POINT_SIZE_RANGE";
        GLConstants[GLConstants["ALIASED_LINE_WIDTH_RANGE"] = 33902] = "ALIASED_LINE_WIDTH_RANGE";
        GLConstants[GLConstants["CULL_FACE_MODE"] = 2885] = "CULL_FACE_MODE";
        GLConstants[GLConstants["FRONT_FACE"] = 2886] = "FRONT_FACE";
        GLConstants[GLConstants["DEPTH_RANGE"] = 2928] = "DEPTH_RANGE";
        GLConstants[GLConstants["DEPTH_WRITEMASK"] = 2930] = "DEPTH_WRITEMASK";
        GLConstants[GLConstants["DEPTH_CLEAR_VALUE"] = 2931] = "DEPTH_CLEAR_VALUE";
        GLConstants[GLConstants["DEPTH_FUNC"] = 2932] = "DEPTH_FUNC";
        GLConstants[GLConstants["STENCIL_CLEAR_VALUE"] = 2961] = "STENCIL_CLEAR_VALUE";
        GLConstants[GLConstants["STENCIL_FUNC"] = 2962] = "STENCIL_FUNC";
        GLConstants[GLConstants["STENCIL_FAIL"] = 2964] = "STENCIL_FAIL";
        GLConstants[GLConstants["STENCIL_PASS_DEPTH_FAIL"] = 2965] = "STENCIL_PASS_DEPTH_FAIL";
        GLConstants[GLConstants["STENCIL_PASS_DEPTH_PASS"] = 2966] = "STENCIL_PASS_DEPTH_PASS";
        GLConstants[GLConstants["STENCIL_REF"] = 2967] = "STENCIL_REF";
        GLConstants[GLConstants["STENCIL_VALUE_MASK"] = 2963] = "STENCIL_VALUE_MASK";
        GLConstants[GLConstants["STENCIL_WRITEMASK"] = 2968] = "STENCIL_WRITEMASK";
        GLConstants[GLConstants["STENCIL_BACK_FUNC"] = 34816] = "STENCIL_BACK_FUNC";
        GLConstants[GLConstants["STENCIL_BACK_FAIL"] = 34817] = "STENCIL_BACK_FAIL";
        GLConstants[GLConstants["STENCIL_BACK_PASS_DEPTH_FAIL"] = 34818] = "STENCIL_BACK_PASS_DEPTH_FAIL";
        GLConstants[GLConstants["STENCIL_BACK_PASS_DEPTH_PASS"] = 34819] = "STENCIL_BACK_PASS_DEPTH_PASS";
        GLConstants[GLConstants["STENCIL_BACK_REF"] = 36003] = "STENCIL_BACK_REF";
        GLConstants[GLConstants["STENCIL_BACK_VALUE_MASK"] = 36004] = "STENCIL_BACK_VALUE_MASK";
        GLConstants[GLConstants["STENCIL_BACK_WRITEMASK"] = 36005] = "STENCIL_BACK_WRITEMASK";
        GLConstants[GLConstants["VIEWPORT"] = 2978] = "VIEWPORT";
        GLConstants[GLConstants["SCISSOR_BOX"] = 3088] = "SCISSOR_BOX";
        GLConstants[GLConstants["COLOR_CLEAR_VALUE"] = 3106] = "COLOR_CLEAR_VALUE";
        GLConstants[GLConstants["COLOR_WRITEMASK"] = 3107] = "COLOR_WRITEMASK";
        GLConstants[GLConstants["UNPACK_ALIGNMENT"] = 3317] = "UNPACK_ALIGNMENT";
        GLConstants[GLConstants["PACK_ALIGNMENT"] = 3333] = "PACK_ALIGNMENT";
        GLConstants[GLConstants["MAX_TEXTURE_SIZE"] = 3379] = "MAX_TEXTURE_SIZE";
        GLConstants[GLConstants["MAX_VIEWPORT_DIMS"] = 3386] = "MAX_VIEWPORT_DIMS";
        GLConstants[GLConstants["SUBPIXEL_BITS"] = 3408] = "SUBPIXEL_BITS";
        GLConstants[GLConstants["RED_BITS"] = 3410] = "RED_BITS";
        GLConstants[GLConstants["GREEN_BITS"] = 3411] = "GREEN_BITS";
        GLConstants[GLConstants["BLUE_BITS"] = 3412] = "BLUE_BITS";
        GLConstants[GLConstants["ALPHA_BITS"] = 3413] = "ALPHA_BITS";
        GLConstants[GLConstants["DEPTH_BITS"] = 3414] = "DEPTH_BITS";
        GLConstants[GLConstants["STENCIL_BITS"] = 3415] = "STENCIL_BITS";
        GLConstants[GLConstants["POLYGON_OFFSET_UNITS"] = 10752] = "POLYGON_OFFSET_UNITS";
        GLConstants[GLConstants["POLYGON_OFFSET_FACTOR"] = 32824] = "POLYGON_OFFSET_FACTOR";
        GLConstants[GLConstants["TEXTURE_BINDING_2D"] = 32873] = "TEXTURE_BINDING_2D";
        GLConstants[GLConstants["SAMPLE_BUFFERS"] = 32936] = "SAMPLE_BUFFERS";
        GLConstants[GLConstants["SAMPLES"] = 32937] = "SAMPLES";
        GLConstants[GLConstants["SAMPLE_COVERAGE_VALUE"] = 32938] = "SAMPLE_COVERAGE_VALUE";
        GLConstants[GLConstants["SAMPLE_COVERAGE_INVERT"] = 32939] = "SAMPLE_COVERAGE_INVERT";
        GLConstants[GLConstants["COMPRESSED_TEXTURE_FORMATS"] = 34467] = "COMPRESSED_TEXTURE_FORMATS";
        GLConstants[GLConstants["DONT_CARE"] = 4352] = "DONT_CARE";
        GLConstants[GLConstants["FASTEST"] = 4353] = "FASTEST";
        GLConstants[GLConstants["NICEST"] = 4354] = "NICEST";
        GLConstants[GLConstants["GENERATE_MIPMAP_HINT"] = 33170] = "GENERATE_MIPMAP_HINT";
        GLConstants[GLConstants["BYTE"] = 5120] = "BYTE";
        GLConstants[GLConstants["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        GLConstants[GLConstants["SHORT"] = 5122] = "SHORT";
        GLConstants[GLConstants["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        GLConstants[GLConstants["INT"] = 5124] = "INT";
        GLConstants[GLConstants["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        GLConstants[GLConstants["FLOAT"] = 5126] = "FLOAT";
        GLConstants[GLConstants["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
        GLConstants[GLConstants["ALPHA"] = 6406] = "ALPHA";
        GLConstants[GLConstants["RGB"] = 6407] = "RGB";
        GLConstants[GLConstants["RGBA"] = 6408] = "RGBA";
        GLConstants[GLConstants["LUMINANCE"] = 6409] = "LUMINANCE";
        GLConstants[GLConstants["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
        GLConstants[GLConstants["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
        GLConstants[GLConstants["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
        GLConstants[GLConstants["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
        GLConstants[GLConstants["FRAGMENT_SHADER"] = 35632] = "FRAGMENT_SHADER";
        GLConstants[GLConstants["VERTEX_SHADER"] = 35633] = "VERTEX_SHADER";
        GLConstants[GLConstants["MAX_VERTEX_ATTRIBS"] = 34921] = "MAX_VERTEX_ATTRIBS";
        GLConstants[GLConstants["MAX_VERTEX_UNIFORM_VECTORS"] = 36347] = "MAX_VERTEX_UNIFORM_VECTORS";
        GLConstants[GLConstants["MAX_varying_VECTORS"] = 36348] = "MAX_varying_VECTORS";
        GLConstants[GLConstants["MAX_COMBINED_TEXTURE_IMAGE_UNITS"] = 35661] = "MAX_COMBINED_TEXTURE_IMAGE_UNITS";
        GLConstants[GLConstants["MAX_VERTEX_TEXTURE_IMAGE_UNITS"] = 35660] = "MAX_VERTEX_TEXTURE_IMAGE_UNITS";
        GLConstants[GLConstants["MAX_TEXTURE_IMAGE_UNITS"] = 34930] = "MAX_TEXTURE_IMAGE_UNITS";
        GLConstants[GLConstants["MAX_FRAGMENT_UNIFORM_VECTORS"] = 36349] = "MAX_FRAGMENT_UNIFORM_VECTORS";
        GLConstants[GLConstants["SHADER_TYPE"] = 35663] = "SHADER_TYPE";
        GLConstants[GLConstants["DELETE_STATUS"] = 35712] = "DELETE_STATUS";
        GLConstants[GLConstants["LINK_STATUS"] = 35714] = "LINK_STATUS";
        GLConstants[GLConstants["VALIDATE_STATUS"] = 35715] = "VALIDATE_STATUS";
        GLConstants[GLConstants["ATTACHED_SHADERS"] = 35717] = "ATTACHED_SHADERS";
        GLConstants[GLConstants["ACTIVE_UNIFORMS"] = 35718] = "ACTIVE_UNIFORMS";
        GLConstants[GLConstants["ACTIVE_ATTRIBUTES"] = 35721] = "ACTIVE_ATTRIBUTES";
        GLConstants[GLConstants["SHADING_LANGUAGE_VERSION"] = 35724] = "SHADING_LANGUAGE_VERSION";
        GLConstants[GLConstants["CURRENT_PROGRAM"] = 35725] = "CURRENT_PROGRAM";
        GLConstants[GLConstants["NEVER"] = 512] = "NEVER";
        GLConstants[GLConstants["LESS"] = 513] = "LESS";
        GLConstants[GLConstants["EQUAL"] = 514] = "EQUAL";
        GLConstants[GLConstants["LEQUAL"] = 515] = "LEQUAL";
        GLConstants[GLConstants["GREATER"] = 516] = "GREATER";
        GLConstants[GLConstants["NOTEQUAL"] = 517] = "NOTEQUAL";
        GLConstants[GLConstants["GEQUAL"] = 518] = "GEQUAL";
        GLConstants[GLConstants["ALWAYS"] = 519] = "ALWAYS";
        GLConstants[GLConstants["KEEP"] = 7680] = "KEEP";
        GLConstants[GLConstants["REPLACE"] = 7681] = "REPLACE";
        GLConstants[GLConstants["INCR"] = 7682] = "INCR";
        GLConstants[GLConstants["DECR"] = 7683] = "DECR";
        GLConstants[GLConstants["INVERT"] = 5386] = "INVERT";
        GLConstants[GLConstants["INCR_WRAP"] = 34055] = "INCR_WRAP";
        GLConstants[GLConstants["DECR_WRAP"] = 34056] = "DECR_WRAP";
        GLConstants[GLConstants["VENDOR"] = 7936] = "VENDOR";
        GLConstants[GLConstants["RENDERER"] = 7937] = "RENDERER";
        GLConstants[GLConstants["VERSION"] = 7938] = "VERSION";
        GLConstants[GLConstants["NEAREST"] = 9728] = "NEAREST";
        GLConstants[GLConstants["LINEAR"] = 9729] = "LINEAR";
        GLConstants[GLConstants["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
        GLConstants[GLConstants["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
        GLConstants[GLConstants["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
        GLConstants[GLConstants["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
        GLConstants[GLConstants["TEXTURE_MAG_FILTER"] = 10240] = "TEXTURE_MAG_FILTER";
        GLConstants[GLConstants["TEXTURE_MIN_FILTER"] = 10241] = "TEXTURE_MIN_FILTER";
        GLConstants[GLConstants["TEXTURE_WRAP_S"] = 10242] = "TEXTURE_WRAP_S";
        GLConstants[GLConstants["TEXTURE_WRAP_T"] = 10243] = "TEXTURE_WRAP_T";
        GLConstants[GLConstants["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
        GLConstants[GLConstants["TEXTURE"] = 5890] = "TEXTURE";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
        GLConstants[GLConstants["TEXTURE_BINDING_CUBE_MAP"] = 34068] = "TEXTURE_BINDING_CUBE_MAP";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
        GLConstants[GLConstants["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
        GLConstants[GLConstants["MAX_CUBE_MAP_TEXTURE_SIZE"] = 34076] = "MAX_CUBE_MAP_TEXTURE_SIZE";
        GLConstants[GLConstants["TEXTURE0"] = 33984] = "TEXTURE0";
        GLConstants[GLConstants["TEXTURE1"] = 33985] = "TEXTURE1";
        GLConstants[GLConstants["TEXTURE2"] = 33986] = "TEXTURE2";
        GLConstants[GLConstants["TEXTURE3"] = 33987] = "TEXTURE3";
        GLConstants[GLConstants["TEXTURE4"] = 33988] = "TEXTURE4";
        GLConstants[GLConstants["TEXTURE5"] = 33989] = "TEXTURE5";
        GLConstants[GLConstants["TEXTURE6"] = 33990] = "TEXTURE6";
        GLConstants[GLConstants["TEXTURE7"] = 33991] = "TEXTURE7";
        GLConstants[GLConstants["TEXTURE8"] = 33992] = "TEXTURE8";
        GLConstants[GLConstants["TEXTURE9"] = 33993] = "TEXTURE9";
        GLConstants[GLConstants["TEXTURE10"] = 33994] = "TEXTURE10";
        GLConstants[GLConstants["TEXTURE11"] = 33995] = "TEXTURE11";
        GLConstants[GLConstants["TEXTURE12"] = 33996] = "TEXTURE12";
        GLConstants[GLConstants["TEXTURE13"] = 33997] = "TEXTURE13";
        GLConstants[GLConstants["TEXTURE14"] = 33998] = "TEXTURE14";
        GLConstants[GLConstants["TEXTURE15"] = 33999] = "TEXTURE15";
        GLConstants[GLConstants["TEXTURE16"] = 34000] = "TEXTURE16";
        GLConstants[GLConstants["TEXTURE17"] = 34001] = "TEXTURE17";
        GLConstants[GLConstants["TEXTURE18"] = 34002] = "TEXTURE18";
        GLConstants[GLConstants["TEXTURE19"] = 34003] = "TEXTURE19";
        GLConstants[GLConstants["TEXTURE20"] = 34004] = "TEXTURE20";
        GLConstants[GLConstants["TEXTURE21"] = 34005] = "TEXTURE21";
        GLConstants[GLConstants["TEXTURE22"] = 34006] = "TEXTURE22";
        GLConstants[GLConstants["TEXTURE23"] = 34007] = "TEXTURE23";
        GLConstants[GLConstants["TEXTURE24"] = 34008] = "TEXTURE24";
        GLConstants[GLConstants["TEXTURE25"] = 34009] = "TEXTURE25";
        GLConstants[GLConstants["TEXTURE26"] = 34010] = "TEXTURE26";
        GLConstants[GLConstants["TEXTURE27"] = 34011] = "TEXTURE27";
        GLConstants[GLConstants["TEXTURE28"] = 34012] = "TEXTURE28";
        GLConstants[GLConstants["TEXTURE29"] = 34013] = "TEXTURE29";
        GLConstants[GLConstants["TEXTURE30"] = 34014] = "TEXTURE30";
        GLConstants[GLConstants["TEXTURE31"] = 34015] = "TEXTURE31";
        GLConstants[GLConstants["ACTIVE_TEXTURE"] = 34016] = "ACTIVE_TEXTURE";
        GLConstants[GLConstants["REPEAT"] = 10497] = "REPEAT";
        GLConstants[GLConstants["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
        GLConstants[GLConstants["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
        GLConstants[GLConstants["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
        GLConstants[GLConstants["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
        GLConstants[GLConstants["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
        GLConstants[GLConstants["INT_VEC2"] = 35667] = "INT_VEC2";
        GLConstants[GLConstants["INT_VEC3"] = 35668] = "INT_VEC3";
        GLConstants[GLConstants["INT_VEC4"] = 35669] = "INT_VEC4";
        GLConstants[GLConstants["BOOL"] = 35670] = "BOOL";
        GLConstants[GLConstants["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
        GLConstants[GLConstants["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
        GLConstants[GLConstants["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
        GLConstants[GLConstants["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
        GLConstants[GLConstants["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
        GLConstants[GLConstants["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
        GLConstants[GLConstants["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
        GLConstants[GLConstants["SAMPLER_CUBE"] = 35680] = "SAMPLER_CUBE";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_ENABLED"] = 34338] = "VERTEX_ATTRIB_ARRAY_ENABLED";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_SIZE"] = 34339] = "VERTEX_ATTRIB_ARRAY_SIZE";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_STRIDE"] = 34340] = "VERTEX_ATTRIB_ARRAY_STRIDE";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_TYPE"] = 34341] = "VERTEX_ATTRIB_ARRAY_TYPE";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_NORMALIZED"] = 34922] = "VERTEX_ATTRIB_ARRAY_NORMALIZED";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_POINTER"] = 34373] = "VERTEX_ATTRIB_ARRAY_POINTER";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_BUFFER_BINDING"] = 34975] = "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING";
        GLConstants[GLConstants["IMPLEMENTATION_COLOR_READ_TYPE"] = 35738] = "IMPLEMENTATION_COLOR_READ_TYPE";
        GLConstants[GLConstants["IMPLEMENTATION_COLOR_READ_FORMAT"] = 35739] = "IMPLEMENTATION_COLOR_READ_FORMAT";
        GLConstants[GLConstants["COMPILE_STATUS"] = 35713] = "COMPILE_STATUS";
        GLConstants[GLConstants["LOW_FLOAT"] = 36336] = "LOW_FLOAT";
        GLConstants[GLConstants["MEDIUM_FLOAT"] = 36337] = "MEDIUM_FLOAT";
        GLConstants[GLConstants["HIGH_FLOAT"] = 36338] = "HIGH_FLOAT";
        GLConstants[GLConstants["LOW_INT"] = 36339] = "LOW_INT";
        GLConstants[GLConstants["MEDIUM_INT"] = 36340] = "MEDIUM_INT";
        GLConstants[GLConstants["HIGH_INT"] = 36341] = "HIGH_INT";
        GLConstants[GLConstants["FRAMEBUFFER"] = 36160] = "FRAMEBUFFER";
        GLConstants[GLConstants["RENDERBUFFER"] = 36161] = "RENDERBUFFER";
        GLConstants[GLConstants["RGBA4"] = 32854] = "RGBA4";
        GLConstants[GLConstants["RGB5_A1"] = 32855] = "RGB5_A1";
        GLConstants[GLConstants["RGB565"] = 36194] = "RGB565";
        GLConstants[GLConstants["DEPTH_COMPONENT16"] = 33189] = "DEPTH_COMPONENT16";
        GLConstants[GLConstants["STENCIL_INDEX"] = 6401] = "STENCIL_INDEX";
        GLConstants[GLConstants["STENCIL_INDEX8"] = 36168] = "STENCIL_INDEX8";
        GLConstants[GLConstants["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
        GLConstants[GLConstants["RENDERBUFFER_WIDTH"] = 36162] = "RENDERBUFFER_WIDTH";
        GLConstants[GLConstants["RENDERBUFFER_HEIGHT"] = 36163] = "RENDERBUFFER_HEIGHT";
        GLConstants[GLConstants["RENDERBUFFER_INTERNAL_FORMAT"] = 36164] = "RENDERBUFFER_INTERNAL_FORMAT";
        GLConstants[GLConstants["RENDERBUFFER_RED_SIZE"] = 36176] = "RENDERBUFFER_RED_SIZE";
        GLConstants[GLConstants["RENDERBUFFER_GREEN_SIZE"] = 36177] = "RENDERBUFFER_GREEN_SIZE";
        GLConstants[GLConstants["RENDERBUFFER_BLUE_SIZE"] = 36178] = "RENDERBUFFER_BLUE_SIZE";
        GLConstants[GLConstants["RENDERBUFFER_ALPHA_SIZE"] = 36179] = "RENDERBUFFER_ALPHA_SIZE";
        GLConstants[GLConstants["RENDERBUFFER_DEPTH_SIZE"] = 36180] = "RENDERBUFFER_DEPTH_SIZE";
        GLConstants[GLConstants["RENDERBUFFER_STENCIL_SIZE"] = 36181] = "RENDERBUFFER_STENCIL_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE"] = 36048] = "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_OBJECT_NAME"] = 36049] = "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL"] = 36050] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE"] = 36051] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE";
        GLConstants[GLConstants["COLOR_ATTACHMENT0"] = 36064] = "COLOR_ATTACHMENT0";
        GLConstants[GLConstants["DEPTH_ATTACHMENT"] = 36096] = "DEPTH_ATTACHMENT";
        GLConstants[GLConstants["STENCIL_ATTACHMENT"] = 36128] = "STENCIL_ATTACHMENT";
        GLConstants[GLConstants["DEPTH_STENCIL_ATTACHMENT"] = 33306] = "DEPTH_STENCIL_ATTACHMENT";
        GLConstants[GLConstants["NONE"] = 0] = "NONE";
        GLConstants[GLConstants["FRAMEBUFFER_COMPLETE"] = 36053] = "FRAMEBUFFER_COMPLETE";
        GLConstants[GLConstants["FRAMEBUFFER_INCOMPLETE_ATTACHMENT"] = 36054] = "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";
        GLConstants[GLConstants["FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"] = 36055] = "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";
        GLConstants[GLConstants["FRAMEBUFFER_INCOMPLETE_DIMENSIONS"] = 36057] = "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";
        GLConstants[GLConstants["FRAMEBUFFER_UNSUPPORTED"] = 36061] = "FRAMEBUFFER_UNSUPPORTED";
        GLConstants[GLConstants["FRAMEBUFFER_BINDING"] = 36006] = "FRAMEBUFFER_BINDING";
        GLConstants[GLConstants["RENDERBUFFER_BINDING"] = 36007] = "RENDERBUFFER_BINDING";
        GLConstants[GLConstants["MAX_RENDERBUFFER_SIZE"] = 34024] = "MAX_RENDERBUFFER_SIZE";
        GLConstants[GLConstants["INVALID_FRAMEBUFFER_OPERATION"] = 1286] = "INVALID_FRAMEBUFFER_OPERATION";
        GLConstants[GLConstants["UNPACK_FLIP_Y_WEBGL"] = 37440] = "UNPACK_FLIP_Y_WEBGL";
        GLConstants[GLConstants["UNPACK_PREMULTIPLY_ALPHA_WEBGL"] = 37441] = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
        GLConstants[GLConstants["CONTEXT_LOST_WEBGL"] = 37442] = "CONTEXT_LOST_WEBGL";
        GLConstants[GLConstants["UNPACK_COLORSPACE_CONVERSION_WEBGL"] = 37443] = "UNPACK_COLORSPACE_CONVERSION_WEBGL";
        GLConstants[GLConstants["BROWSER_DEFAULT_WEBGL"] = 37444] = "BROWSER_DEFAULT_WEBGL";
        GLConstants[GLConstants["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
        GLConstants[GLConstants["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
        GLConstants[GLConstants["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
        GLConstants[GLConstants["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
        GLConstants[GLConstants["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
        GLConstants[GLConstants["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
        GLConstants[GLConstants["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
        GLConstants[GLConstants["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
        GLConstants[GLConstants["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
        GLConstants[GLConstants["DOUBLE"] = 5130] = "DOUBLE";
        GLConstants[GLConstants["READ_BUFFER"] = 3074] = "READ_BUFFER";
        GLConstants[GLConstants["UNPACK_ROW_LENGTH"] = 3314] = "UNPACK_ROW_LENGTH";
        GLConstants[GLConstants["UNPACK_SKIP_ROWS"] = 3315] = "UNPACK_SKIP_ROWS";
        GLConstants[GLConstants["UNPACK_SKIP_PIXELS"] = 3316] = "UNPACK_SKIP_PIXELS";
        GLConstants[GLConstants["PACK_ROW_LENGTH"] = 3330] = "PACK_ROW_LENGTH";
        GLConstants[GLConstants["PACK_SKIP_ROWS"] = 3331] = "PACK_SKIP_ROWS";
        GLConstants[GLConstants["PACK_SKIP_PIXELS"] = 3332] = "PACK_SKIP_PIXELS";
        GLConstants[GLConstants["COLOR"] = 6144] = "COLOR";
        GLConstants[GLConstants["DEPTH"] = 6145] = "DEPTH";
        GLConstants[GLConstants["STENCIL"] = 6146] = "STENCIL";
        GLConstants[GLConstants["RED"] = 6403] = "RED";
        GLConstants[GLConstants["RGB8"] = 32849] = "RGB8";
        GLConstants[GLConstants["RGBA8"] = 32856] = "RGBA8";
        GLConstants[GLConstants["RGB10_A2"] = 32857] = "RGB10_A2";
        GLConstants[GLConstants["TEXTURE_BINDING_3D"] = 32874] = "TEXTURE_BINDING_3D";
        GLConstants[GLConstants["UNPACK_SKIP_IMAGES"] = 32877] = "UNPACK_SKIP_IMAGES";
        GLConstants[GLConstants["UNPACK_IMAGE_HEIGHT"] = 32878] = "UNPACK_IMAGE_HEIGHT";
        GLConstants[GLConstants["TEXTURE_3D"] = 32879] = "TEXTURE_3D";
        GLConstants[GLConstants["TEXTURE_WRAP_R"] = 32882] = "TEXTURE_WRAP_R";
        GLConstants[GLConstants["MAX_3D_TEXTURE_SIZE"] = 32883] = "MAX_3D_TEXTURE_SIZE";
        GLConstants[GLConstants["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
        GLConstants[GLConstants["MAX_ELEMENTS_VERTICES"] = 33000] = "MAX_ELEMENTS_VERTICES";
        GLConstants[GLConstants["MAX_ELEMENTS_INDICES"] = 33001] = "MAX_ELEMENTS_INDICES";
        GLConstants[GLConstants["TEXTURE_MIN_LOD"] = 33082] = "TEXTURE_MIN_LOD";
        GLConstants[GLConstants["TEXTURE_MAX_LOD"] = 33083] = "TEXTURE_MAX_LOD";
        GLConstants[GLConstants["TEXTURE_BASE_LEVEL"] = 33084] = "TEXTURE_BASE_LEVEL";
        GLConstants[GLConstants["TEXTURE_MAX_LEVEL"] = 33085] = "TEXTURE_MAX_LEVEL";
        GLConstants[GLConstants["MIN"] = 32775] = "MIN";
        GLConstants[GLConstants["MAX"] = 32776] = "MAX";
        GLConstants[GLConstants["DEPTH_COMPONENT24"] = 33190] = "DEPTH_COMPONENT24";
        GLConstants[GLConstants["MAX_TEXTURE_LOD_BIAS"] = 34045] = "MAX_TEXTURE_LOD_BIAS";
        GLConstants[GLConstants["TEXTURE_COMPARE_MODE"] = 34892] = "TEXTURE_COMPARE_MODE";
        GLConstants[GLConstants["TEXTURE_COMPARE_FUNC"] = 34893] = "TEXTURE_COMPARE_FUNC";
        GLConstants[GLConstants["CURRENT_QUERY"] = 34917] = "CURRENT_QUERY";
        GLConstants[GLConstants["QUERY_RESULT"] = 34918] = "QUERY_RESULT";
        GLConstants[GLConstants["QUERY_RESULT_AVAILABLE"] = 34919] = "QUERY_RESULT_AVAILABLE";
        GLConstants[GLConstants["STREAM_READ"] = 35041] = "STREAM_READ";
        GLConstants[GLConstants["STREAM_COPY"] = 35042] = "STREAM_COPY";
        GLConstants[GLConstants["STATIC_READ"] = 35045] = "STATIC_READ";
        GLConstants[GLConstants["STATIC_COPY"] = 35046] = "STATIC_COPY";
        GLConstants[GLConstants["DYNAMIC_READ"] = 35049] = "DYNAMIC_READ";
        GLConstants[GLConstants["DYNAMIC_COPY"] = 35050] = "DYNAMIC_COPY";
        GLConstants[GLConstants["MAX_DRAW_BUFFERS"] = 34852] = "MAX_DRAW_BUFFERS";
        GLConstants[GLConstants["DRAW_BUFFER0"] = 34853] = "DRAW_BUFFER0";
        GLConstants[GLConstants["DRAW_BUFFER1"] = 34854] = "DRAW_BUFFER1";
        GLConstants[GLConstants["DRAW_BUFFER2"] = 34855] = "DRAW_BUFFER2";
        GLConstants[GLConstants["DRAW_BUFFER3"] = 34856] = "DRAW_BUFFER3";
        GLConstants[GLConstants["DRAW_BUFFER4"] = 34857] = "DRAW_BUFFER4";
        GLConstants[GLConstants["DRAW_BUFFER5"] = 34858] = "DRAW_BUFFER5";
        GLConstants[GLConstants["DRAW_BUFFER6"] = 34859] = "DRAW_BUFFER6";
        GLConstants[GLConstants["DRAW_BUFFER7"] = 34860] = "DRAW_BUFFER7";
        GLConstants[GLConstants["DRAW_BUFFER8"] = 34861] = "DRAW_BUFFER8";
        GLConstants[GLConstants["DRAW_BUFFER9"] = 34862] = "DRAW_BUFFER9";
        GLConstants[GLConstants["DRAW_BUFFER10"] = 34863] = "DRAW_BUFFER10";
        GLConstants[GLConstants["DRAW_BUFFER11"] = 34864] = "DRAW_BUFFER11";
        GLConstants[GLConstants["DRAW_BUFFER12"] = 34865] = "DRAW_BUFFER12";
        GLConstants[GLConstants["DRAW_BUFFER13"] = 34866] = "DRAW_BUFFER13";
        GLConstants[GLConstants["DRAW_BUFFER14"] = 34867] = "DRAW_BUFFER14";
        GLConstants[GLConstants["DRAW_BUFFER15"] = 34868] = "DRAW_BUFFER15";
        GLConstants[GLConstants["MAX_FRAGMENT_UNIFORM_COMPONENTS"] = 35657] = "MAX_FRAGMENT_UNIFORM_COMPONENTS";
        GLConstants[GLConstants["MAX_VERTEX_UNIFORM_COMPONENTS"] = 35658] = "MAX_VERTEX_UNIFORM_COMPONENTS";
        GLConstants[GLConstants["SAMPLER_3D"] = 35679] = "SAMPLER_3D";
        GLConstants[GLConstants["SAMPLER_2D_SHADOW"] = 35682] = "SAMPLER_2D_SHADOW";
        GLConstants[GLConstants["FRAGMENT_SHADER_DERIVATIVE_HINT"] = 35723] = "FRAGMENT_SHADER_DERIVATIVE_HINT";
        GLConstants[GLConstants["PIXEL_PACK_BUFFER"] = 35051] = "PIXEL_PACK_BUFFER";
        GLConstants[GLConstants["PIXEL_UNPACK_BUFFER"] = 35052] = "PIXEL_UNPACK_BUFFER";
        GLConstants[GLConstants["PIXEL_PACK_BUFFER_BINDING"] = 35053] = "PIXEL_PACK_BUFFER_BINDING";
        GLConstants[GLConstants["PIXEL_UNPACK_BUFFER_BINDING"] = 35055] = "PIXEL_UNPACK_BUFFER_BINDING";
        GLConstants[GLConstants["FLOAT_MAT2x3"] = 35685] = "FLOAT_MAT2x3";
        GLConstants[GLConstants["FLOAT_MAT2x4"] = 35686] = "FLOAT_MAT2x4";
        GLConstants[GLConstants["FLOAT_MAT3x2"] = 35687] = "FLOAT_MAT3x2";
        GLConstants[GLConstants["FLOAT_MAT3x4"] = 35688] = "FLOAT_MAT3x4";
        GLConstants[GLConstants["FLOAT_MAT4x2"] = 35689] = "FLOAT_MAT4x2";
        GLConstants[GLConstants["FLOAT_MAT4x3"] = 35690] = "FLOAT_MAT4x3";
        GLConstants[GLConstants["SRGB"] = 35904] = "SRGB";
        GLConstants[GLConstants["SRGB8"] = 35905] = "SRGB8";
        GLConstants[GLConstants["SRGB8_ALPHA8"] = 35907] = "SRGB8_ALPHA8";
        GLConstants[GLConstants["COMPARE_REF_TO_TEXTURE"] = 34894] = "COMPARE_REF_TO_TEXTURE";
        GLConstants[GLConstants["RGBA32F"] = 34836] = "RGBA32F";
        GLConstants[GLConstants["RGB32F"] = 34837] = "RGB32F";
        GLConstants[GLConstants["RGBA16F"] = 34842] = "RGBA16F";
        GLConstants[GLConstants["RGB16F"] = 34843] = "RGB16F";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_INTEGER"] = 35069] = "VERTEX_ATTRIB_ARRAY_INTEGER";
        GLConstants[GLConstants["MAX_ARRAY_TEXTURE_LAYERS"] = 35071] = "MAX_ARRAY_TEXTURE_LAYERS";
        GLConstants[GLConstants["MIN_PROGRAM_TEXEL_OFFSET"] = 35076] = "MIN_PROGRAM_TEXEL_OFFSET";
        GLConstants[GLConstants["MAX_PROGRAM_TEXEL_OFFSET"] = 35077] = "MAX_PROGRAM_TEXEL_OFFSET";
        GLConstants[GLConstants["MAX_varying_COMPONENTS"] = 35659] = "MAX_varying_COMPONENTS";
        GLConstants[GLConstants["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
        GLConstants[GLConstants["TEXTURE_BINDING_2D_ARRAY"] = 35869] = "TEXTURE_BINDING_2D_ARRAY";
        GLConstants[GLConstants["R11F_G11F_B10F"] = 35898] = "R11F_G11F_B10F";
        GLConstants[GLConstants["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
        GLConstants[GLConstants["RGB9_E5"] = 35901] = "RGB9_E5";
        GLConstants[GLConstants["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BUFFER_MODE"] = 35967] = "TRANSFORM_FEEDBACK_BUFFER_MODE";
        GLConstants[GLConstants["MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS"] = 35968] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_varyingS"] = 35971] = "TRANSFORM_FEEDBACK_varyingS";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BUFFER_START"] = 35972] = "TRANSFORM_FEEDBACK_BUFFER_START";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BUFFER_SIZE"] = 35973] = "TRANSFORM_FEEDBACK_BUFFER_SIZE";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN"] = 35976] = "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN";
        GLConstants[GLConstants["RASTERIZER_DISCARD"] = 35977] = "RASTERIZER_DISCARD";
        GLConstants[GLConstants["MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS"] = 35978] = "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS";
        GLConstants[GLConstants["MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS"] = 35979] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS";
        GLConstants[GLConstants["INTERLEAVED_ATTRIBS"] = 35980] = "INTERLEAVED_ATTRIBS";
        GLConstants[GLConstants["SEPARATE_ATTRIBS"] = 35981] = "SEPARATE_ATTRIBS";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BUFFER"] = 35982] = "TRANSFORM_FEEDBACK_BUFFER";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BUFFER_BINDING"] = 35983] = "TRANSFORM_FEEDBACK_BUFFER_BINDING";
        GLConstants[GLConstants["RGBA32UI"] = 36208] = "RGBA32UI";
        GLConstants[GLConstants["RGB32UI"] = 36209] = "RGB32UI";
        GLConstants[GLConstants["RGBA16UI"] = 36214] = "RGBA16UI";
        GLConstants[GLConstants["RGB16UI"] = 36215] = "RGB16UI";
        GLConstants[GLConstants["RGBA8UI"] = 36220] = "RGBA8UI";
        GLConstants[GLConstants["RGB8UI"] = 36221] = "RGB8UI";
        GLConstants[GLConstants["RGBA32I"] = 36226] = "RGBA32I";
        GLConstants[GLConstants["RGB32I"] = 36227] = "RGB32I";
        GLConstants[GLConstants["RGBA16I"] = 36232] = "RGBA16I";
        GLConstants[GLConstants["RGB16I"] = 36233] = "RGB16I";
        GLConstants[GLConstants["RGBA8I"] = 36238] = "RGBA8I";
        GLConstants[GLConstants["RGB8I"] = 36239] = "RGB8I";
        GLConstants[GLConstants["RED_INTEGER"] = 36244] = "RED_INTEGER";
        GLConstants[GLConstants["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
        GLConstants[GLConstants["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
        GLConstants[GLConstants["SAMPLER_2D_ARRAY"] = 36289] = "SAMPLER_2D_ARRAY";
        GLConstants[GLConstants["SAMPLER_2D_ARRAY_SHADOW"] = 36292] = "SAMPLER_2D_ARRAY_SHADOW";
        GLConstants[GLConstants["SAMPLER_CUBE_SHADOW"] = 36293] = "SAMPLER_CUBE_SHADOW";
        GLConstants[GLConstants["UNSIGNED_INT_VEC2"] = 36294] = "UNSIGNED_INT_VEC2";
        GLConstants[GLConstants["UNSIGNED_INT_VEC3"] = 36295] = "UNSIGNED_INT_VEC3";
        GLConstants[GLConstants["UNSIGNED_INT_VEC4"] = 36296] = "UNSIGNED_INT_VEC4";
        GLConstants[GLConstants["INT_SAMPLER_2D"] = 36298] = "INT_SAMPLER_2D";
        GLConstants[GLConstants["INT_SAMPLER_3D"] = 36299] = "INT_SAMPLER_3D";
        GLConstants[GLConstants["INT_SAMPLER_CUBE"] = 36300] = "INT_SAMPLER_CUBE";
        GLConstants[GLConstants["INT_SAMPLER_2D_ARRAY"] = 36303] = "INT_SAMPLER_2D_ARRAY";
        GLConstants[GLConstants["UNSIGNED_INT_SAMPLER_2D"] = 36306] = "UNSIGNED_INT_SAMPLER_2D";
        GLConstants[GLConstants["UNSIGNED_INT_SAMPLER_3D"] = 36307] = "UNSIGNED_INT_SAMPLER_3D";
        GLConstants[GLConstants["UNSIGNED_INT_SAMPLER_CUBE"] = 36308] = "UNSIGNED_INT_SAMPLER_CUBE";
        GLConstants[GLConstants["UNSIGNED_INT_SAMPLER_2D_ARRAY"] = 36311] = "UNSIGNED_INT_SAMPLER_2D_ARRAY";
        GLConstants[GLConstants["DEPTH_COMPONENT32F"] = 36012] = "DEPTH_COMPONENT32F";
        GLConstants[GLConstants["DEPTH32F_STENCIL8"] = 36013] = "DEPTH32F_STENCIL8";
        GLConstants[GLConstants["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING"] = 33296] = "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE"] = 33297] = "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_RED_SIZE"] = 33298] = "FRAMEBUFFER_ATTACHMENT_RED_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_GREEN_SIZE"] = 33299] = "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_BLUE_SIZE"] = 33300] = "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE"] = 33301] = "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE"] = 33302] = "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE"] = 33303] = "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE";
        GLConstants[GLConstants["FRAMEBUFFER_DEFAULT"] = 33304] = "FRAMEBUFFER_DEFAULT";
        GLConstants[GLConstants["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
        GLConstants[GLConstants["DEPTH24_STENCIL8"] = 35056] = "DEPTH24_STENCIL8";
        GLConstants[GLConstants["UNSIGNED_NORMALIZED"] = 35863] = "UNSIGNED_NORMALIZED";
        GLConstants[GLConstants["DRAW_FRAMEBUFFER_BINDING"] = 36006] = "DRAW_FRAMEBUFFER_BINDING";
        GLConstants[GLConstants["READ_FRAMEBUFFER"] = 36008] = "READ_FRAMEBUFFER";
        GLConstants[GLConstants["DRAW_FRAMEBUFFER"] = 36009] = "DRAW_FRAMEBUFFER";
        GLConstants[GLConstants["READ_FRAMEBUFFER_BINDING"] = 36010] = "READ_FRAMEBUFFER_BINDING";
        GLConstants[GLConstants["RENDERBUFFER_SAMPLES"] = 36011] = "RENDERBUFFER_SAMPLES";
        GLConstants[GLConstants["FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER"] = 36052] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER";
        GLConstants[GLConstants["MAX_COLOR_ATTACHMENTS"] = 36063] = "MAX_COLOR_ATTACHMENTS";
        GLConstants[GLConstants["COLOR_ATTACHMENT1"] = 36065] = "COLOR_ATTACHMENT1";
        GLConstants[GLConstants["COLOR_ATTACHMENT2"] = 36066] = "COLOR_ATTACHMENT2";
        GLConstants[GLConstants["COLOR_ATTACHMENT3"] = 36067] = "COLOR_ATTACHMENT3";
        GLConstants[GLConstants["COLOR_ATTACHMENT4"] = 36068] = "COLOR_ATTACHMENT4";
        GLConstants[GLConstants["COLOR_ATTACHMENT5"] = 36069] = "COLOR_ATTACHMENT5";
        GLConstants[GLConstants["COLOR_ATTACHMENT6"] = 36070] = "COLOR_ATTACHMENT6";
        GLConstants[GLConstants["COLOR_ATTACHMENT7"] = 36071] = "COLOR_ATTACHMENT7";
        GLConstants[GLConstants["COLOR_ATTACHMENT8"] = 36072] = "COLOR_ATTACHMENT8";
        GLConstants[GLConstants["COLOR_ATTACHMENT9"] = 36073] = "COLOR_ATTACHMENT9";
        GLConstants[GLConstants["COLOR_ATTACHMENT10"] = 36074] = "COLOR_ATTACHMENT10";
        GLConstants[GLConstants["COLOR_ATTACHMENT11"] = 36075] = "COLOR_ATTACHMENT11";
        GLConstants[GLConstants["COLOR_ATTACHMENT12"] = 36076] = "COLOR_ATTACHMENT12";
        GLConstants[GLConstants["COLOR_ATTACHMENT13"] = 36077] = "COLOR_ATTACHMENT13";
        GLConstants[GLConstants["COLOR_ATTACHMENT14"] = 36078] = "COLOR_ATTACHMENT14";
        GLConstants[GLConstants["COLOR_ATTACHMENT15"] = 36079] = "COLOR_ATTACHMENT15";
        GLConstants[GLConstants["FRAMEBUFFER_INCOMPLETE_MULTISAMPLE"] = 36182] = "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE";
        GLConstants[GLConstants["MAX_SAMPLES"] = 36183] = "MAX_SAMPLES";
        GLConstants[GLConstants["HALF_FLOAT"] = 5131] = "HALF_FLOAT";
        GLConstants[GLConstants["RG"] = 33319] = "RG";
        GLConstants[GLConstants["RG_INTEGER"] = 33320] = "RG_INTEGER";
        GLConstants[GLConstants["R8"] = 33321] = "R8";
        GLConstants[GLConstants["RG8"] = 33323] = "RG8";
        GLConstants[GLConstants["R16F"] = 33325] = "R16F";
        GLConstants[GLConstants["R32F"] = 33326] = "R32F";
        GLConstants[GLConstants["RG16F"] = 33327] = "RG16F";
        GLConstants[GLConstants["RG32F"] = 33328] = "RG32F";
        GLConstants[GLConstants["R8I"] = 33329] = "R8I";
        GLConstants[GLConstants["R8UI"] = 33330] = "R8UI";
        GLConstants[GLConstants["R16I"] = 33331] = "R16I";
        GLConstants[GLConstants["R16UI"] = 33332] = "R16UI";
        GLConstants[GLConstants["R32I"] = 33333] = "R32I";
        GLConstants[GLConstants["R32UI"] = 33334] = "R32UI";
        GLConstants[GLConstants["RG8I"] = 33335] = "RG8I";
        GLConstants[GLConstants["RG8UI"] = 33336] = "RG8UI";
        GLConstants[GLConstants["RG16I"] = 33337] = "RG16I";
        GLConstants[GLConstants["RG16UI"] = 33338] = "RG16UI";
        GLConstants[GLConstants["RG32I"] = 33339] = "RG32I";
        GLConstants[GLConstants["RG32UI"] = 33340] = "RG32UI";
        GLConstants[GLConstants["VERTEX_ARRAY_BINDING"] = 34229] = "VERTEX_ARRAY_BINDING";
        GLConstants[GLConstants["R8_SNORM"] = 36756] = "R8_SNORM";
        GLConstants[GLConstants["RG8_SNORM"] = 36757] = "RG8_SNORM";
        GLConstants[GLConstants["RGB8_SNORM"] = 36758] = "RGB8_SNORM";
        GLConstants[GLConstants["RGBA8_SNORM"] = 36759] = "RGBA8_SNORM";
        GLConstants[GLConstants["SIGNED_NORMALIZED"] = 36764] = "SIGNED_NORMALIZED";
        GLConstants[GLConstants["COPY_READ_BUFFER"] = 36662] = "COPY_READ_BUFFER";
        GLConstants[GLConstants["COPY_WRITE_BUFFER"] = 36663] = "COPY_WRITE_BUFFER";
        GLConstants[GLConstants["COPY_READ_BUFFER_BINDING"] = 36662] = "COPY_READ_BUFFER_BINDING";
        GLConstants[GLConstants["COPY_WRITE_BUFFER_BINDING"] = 36663] = "COPY_WRITE_BUFFER_BINDING";
        GLConstants[GLConstants["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
        GLConstants[GLConstants["UNIFORM_BUFFER_BINDING"] = 35368] = "UNIFORM_BUFFER_BINDING";
        GLConstants[GLConstants["UNIFORM_BUFFER_START"] = 35369] = "UNIFORM_BUFFER_START";
        GLConstants[GLConstants["UNIFORM_BUFFER_SIZE"] = 35370] = "UNIFORM_BUFFER_SIZE";
        GLConstants[GLConstants["MAX_VERTEX_UNIFORM_BLOCKS"] = 35371] = "MAX_VERTEX_UNIFORM_BLOCKS";
        GLConstants[GLConstants["MAX_FRAGMENT_UNIFORM_BLOCKS"] = 35373] = "MAX_FRAGMENT_UNIFORM_BLOCKS";
        GLConstants[GLConstants["MAX_COMBINED_UNIFORM_BLOCKS"] = 35374] = "MAX_COMBINED_UNIFORM_BLOCKS";
        GLConstants[GLConstants["MAX_UNIFORM_BUFFER_BINDINGS"] = 35375] = "MAX_UNIFORM_BUFFER_BINDINGS";
        GLConstants[GLConstants["MAX_UNIFORM_BLOCK_SIZE"] = 35376] = "MAX_UNIFORM_BLOCK_SIZE";
        GLConstants[GLConstants["MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS"] = 35377] = "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS";
        GLConstants[GLConstants["MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS"] = 35379] = "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS";
        GLConstants[GLConstants["UNIFORM_BUFFER_OFFSET_ALIGNMENT"] = 35380] = "UNIFORM_BUFFER_OFFSET_ALIGNMENT";
        GLConstants[GLConstants["ACTIVE_UNIFORM_BLOCKS"] = 35382] = "ACTIVE_UNIFORM_BLOCKS";
        GLConstants[GLConstants["UNIFORM_TYPE"] = 35383] = "UNIFORM_TYPE";
        GLConstants[GLConstants["UNIFORM_SIZE"] = 35384] = "UNIFORM_SIZE";
        GLConstants[GLConstants["UNIFORM_BLOCK_INDEX"] = 35386] = "UNIFORM_BLOCK_INDEX";
        GLConstants[GLConstants["UNIFORM_OFFSET"] = 35387] = "UNIFORM_OFFSET";
        GLConstants[GLConstants["UNIFORM_ARRAY_STRIDE"] = 35388] = "UNIFORM_ARRAY_STRIDE";
        GLConstants[GLConstants["UNIFORM_MATRIX_STRIDE"] = 35389] = "UNIFORM_MATRIX_STRIDE";
        GLConstants[GLConstants["UNIFORM_IS_ROW_MAJOR"] = 35390] = "UNIFORM_IS_ROW_MAJOR";
        GLConstants[GLConstants["UNIFORM_BLOCK_BINDING"] = 35391] = "UNIFORM_BLOCK_BINDING";
        GLConstants[GLConstants["UNIFORM_BLOCK_DATA_SIZE"] = 35392] = "UNIFORM_BLOCK_DATA_SIZE";
        GLConstants[GLConstants["UNIFORM_BLOCK_ACTIVE_UNIFORMS"] = 35394] = "UNIFORM_BLOCK_ACTIVE_UNIFORMS";
        GLConstants[GLConstants["UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES"] = 35395] = "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES";
        GLConstants[GLConstants["UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER"] = 35396] = "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER";
        GLConstants[GLConstants["UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER"] = 35398] = "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER";
        GLConstants[GLConstants["INVALID_INDEX"] = 4294967295] = "INVALID_INDEX";
        GLConstants[GLConstants["MAX_VERTEX_OUTPUT_COMPONENTS"] = 37154] = "MAX_VERTEX_OUTPUT_COMPONENTS";
        GLConstants[GLConstants["MAX_FRAGMENT_INPUT_COMPONENTS"] = 37157] = "MAX_FRAGMENT_INPUT_COMPONENTS";
        GLConstants[GLConstants["MAX_SERVER_WAIT_TIMEOUT"] = 37137] = "MAX_SERVER_WAIT_TIMEOUT";
        GLConstants[GLConstants["OBJECT_TYPE"] = 37138] = "OBJECT_TYPE";
        GLConstants[GLConstants["SYNC_CONDITION"] = 37139] = "SYNC_CONDITION";
        GLConstants[GLConstants["SYNC_STATUS"] = 37140] = "SYNC_STATUS";
        GLConstants[GLConstants["SYNC_FLAGS"] = 37141] = "SYNC_FLAGS";
        GLConstants[GLConstants["SYNC_FENCE"] = 37142] = "SYNC_FENCE";
        GLConstants[GLConstants["SYNC_GPU_COMMANDS_COMPLETE"] = 37143] = "SYNC_GPU_COMMANDS_COMPLETE";
        GLConstants[GLConstants["UNSIGNALED"] = 37144] = "UNSIGNALED";
        GLConstants[GLConstants["SIGNALED"] = 37145] = "SIGNALED";
        GLConstants[GLConstants["ALREADY_SIGNALED"] = 37146] = "ALREADY_SIGNALED";
        GLConstants[GLConstants["TIMEOUT_EXPIRED"] = 37147] = "TIMEOUT_EXPIRED";
        GLConstants[GLConstants["CONDITION_SATISFIED"] = 37148] = "CONDITION_SATISFIED";
        GLConstants[GLConstants["WAIT_FAILED"] = 37149] = "WAIT_FAILED";
        GLConstants[GLConstants["SYNC_FLUSH_COMMANDS_BIT"] = 1] = "SYNC_FLUSH_COMMANDS_BIT";
        GLConstants[GLConstants["VERTEX_ATTRIB_ARRAY_DIVISOR"] = 35070] = "VERTEX_ATTRIB_ARRAY_DIVISOR";
        GLConstants[GLConstants["ANY_SAMPLES_PASSED"] = 35887] = "ANY_SAMPLES_PASSED";
        GLConstants[GLConstants["ANY_SAMPLES_PASSED_CONSERVATIVE"] = 36202] = "ANY_SAMPLES_PASSED_CONSERVATIVE";
        GLConstants[GLConstants["SAMPLER_BINDING"] = 35097] = "SAMPLER_BINDING";
        GLConstants[GLConstants["RGB10_A2UI"] = 36975] = "RGB10_A2UI";
        GLConstants[GLConstants["INT_2_10_10_10_REV"] = 36255] = "INT_2_10_10_10_REV";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK"] = 36386] = "TRANSFORM_FEEDBACK";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_PAUSED"] = 36387] = "TRANSFORM_FEEDBACK_PAUSED";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_ACTIVE"] = 36388] = "TRANSFORM_FEEDBACK_ACTIVE";
        GLConstants[GLConstants["TRANSFORM_FEEDBACK_BINDING"] = 36389] = "TRANSFORM_FEEDBACK_BINDING";
        GLConstants[GLConstants["COMPRESSED_R11_EAC"] = 37488] = "COMPRESSED_R11_EAC";
        GLConstants[GLConstants["COMPRESSED_SIGNED_R11_EAC"] = 37489] = "COMPRESSED_SIGNED_R11_EAC";
        GLConstants[GLConstants["COMPRESSED_RG11_EAC"] = 37490] = "COMPRESSED_RG11_EAC";
        GLConstants[GLConstants["COMPRESSED_SIGNED_RG11_EAC"] = 37491] = "COMPRESSED_SIGNED_RG11_EAC";
        GLConstants[GLConstants["COMPRESSED_RGB8_ETC2"] = 37492] = "COMPRESSED_RGB8_ETC2";
        GLConstants[GLConstants["COMPRESSED_SRGB8_ETC2"] = 37493] = "COMPRESSED_SRGB8_ETC2";
        GLConstants[GLConstants["COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2";
        GLConstants[GLConstants["COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2";
        GLConstants[GLConstants["COMPRESSED_RGBA8_ETC2_EAC"] = 37496] = "COMPRESSED_RGBA8_ETC2_EAC";
        GLConstants[GLConstants["COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"] = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC";
        GLConstants[GLConstants["TEXTURE_IMMUTABLE_FORMAT"] = 37167] = "TEXTURE_IMMUTABLE_FORMAT";
        GLConstants[GLConstants["MAX_ELEMENT_INDEX"] = 36203] = "MAX_ELEMENT_INDEX";
        GLConstants[GLConstants["TEXTURE_IMMUTABLE_LEVELS"] = 33503] = "TEXTURE_IMMUTABLE_LEVELS";
        GLConstants[GLConstants["MAX_TEXTURE_MAX_ANISOTROPY_EXT"] = 34047] = "MAX_TEXTURE_MAX_ANISOTROPY_EXT";
    })(GLConstants = webGraph.GLConstants || (webGraph.GLConstants = {}));
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class caps {
    }
    webGraph.caps = caps;
    class webglkit {
        static SetMaxVertexAttribArray(webgl, count) {
            for (let i = count; i < webglkit._maxVertexAttribArray; i++) {
                webgl.disableVertexAttribArray(i);
            }
            webglkit._maxVertexAttribArray = count;
        }
        static GetTextureNumber(webgl, index) {
            webglkit.initConst(webgl);
            return webglkit._texNumber[index];
        }
        static initConst(webgl) {
            if (webglkit._texNumber == null) {
                webglkit._texNumber = [];
                webglkit._texNumber.push(webgl.TEXTURE0);
                webglkit._texNumber.push(webgl.TEXTURE1);
                webglkit._texNumber.push(webgl.TEXTURE2);
                webglkit._texNumber.push(webgl.TEXTURE3);
                webglkit._texNumber.push(webgl.TEXTURE4);
                webglkit._texNumber.push(webgl.TEXTURE5);
                webglkit._texNumber.push(webgl.TEXTURE6);
                webglkit._texNumber.push(webgl.TEXTURE7);
                webglkit._texNumber.push(webgl.TEXTURE8);
                webglkit._texNumber.push(webgl.TEXTURE9);
                webglkit.LEQUAL = webgl.LEQUAL;
                webglkit.NEVER = webgl.NEVER;
                webglkit.EQUAL = webgl.EQUAL;
                webglkit.GEQUAL = webgl.GEQUAL;
                webglkit.NOTEQUAL = webgl.NOTEQUAL;
                webglkit.LESS = webgl.LESS;
                webglkit.GREATER = webgl.GREATER;
                webglkit.ALWAYS = webgl.ALWAYS;
                webglkit.FUNC_ADD = webgl.FUNC_ADD;
                webglkit.FUNC_SUBTRACT = webgl.FUNC_SUBTRACT;
                webglkit.FUNC_REVERSE_SUBTRACT = webgl.FUNC_REVERSE_SUBTRACT;
                webglkit.ONE = webgl.ONE;
                webglkit.ZERO = webgl.ZERO;
                webglkit.SRC_ALPHA = webgl.SRC_ALPHA;
                webglkit.SRC_COLOR = webgl.SRC_COLOR;
                webglkit.ONE_MINUS_SRC_ALPHA = webgl.ONE_MINUS_SRC_ALPHA;
                webglkit.ONE_MINUS_SRC_COLOR = webgl.ONE_MINUS_SRC_COLOR;
                webglkit.ONE_MINUS_DST_ALPHA = webgl.ONE_MINUS_DST_ALPHA;
                webglkit.ONE_MINUS_DST_COLOR = webgl.ONE_MINUS_DST_COLOR;
                webglkit.caps.standardDerivatives = (webgl.getExtension('OES_standard_derivatives') !== null);
                webglkit.caps.pvrtcExtension = webgl.getExtension('WEBGL_compressed_texture_pvrtc');
            }
        }
    }
    webglkit._maxVertexAttribArray = 0;
    webglkit._texNumber = null;
    webglkit.caps = new caps();
    webGraph.webglkit = webglkit;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class ProgramID {
        static next() {
            let next = ProgramID.idAll;
            ProgramID.idAll++;
            return next;
        }
    }
    ProgramID.idAll = 0;
    webGraph.ProgramID = ProgramID;
    class ShaderProgram {
        constructor(name, type, program) {
            this.cachevalue = {};
            this.cacheUniformDic = {};
            this.ID = ProgramID.next();
            this.name = name;
            this.type = type;
            this.instance = program;
            this.attribDic = webGraph.AttributeSetter.getAttributeInfo(this.instance);
            this.uniformDic = webGraph.UniformSetter.getUniformInfo(this.instance);
        }
        attach() {
            webGraph.rendingWebgl.useProgram(this.instance);
        }
        detach() {
            webGraph.rendingWebgl.useProgram(null);
        }
        dispose() {
            webGraph.rendingWebgl.deleteProgram(this.instance);
        }
        getUniformLocation(name) {
            return this.uniformDic[name].location;
        }
        getAttributeLocation(attType) {
            return this.attribDic[attType];
        }
        applyUniformWithCache(name, value, defValue) {
            let data = this.uniformDic[name];
            let equalFuc = webGraph.UniformSetter.uniformEqualDic[data.type];
            let cacheValue = this.cacheUniformDic[name];
            if (cacheValue != null && equalFuc(value, cacheValue)) {
                return;
            }
            ;
            this.cacheUniformDic[name] = cacheValue;
            this.applyUniform(name, value, defValue);
        }
        applyUniform(name, value, defValue) {
            let data = this.uniformDic[name];
            webGraph.UniformSetter.applyUniform(data.type, data.location, value, defValue);
        }
    }
    webGraph.ShaderProgram = ShaderProgram;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class AttributeSetter {
        static getAttributeInfo(program) {
            let attdic = {};
            let numAttribs = webGraph.rendingWebgl.getProgramParameter(program, webGraph.rendingWebgl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < numAttribs; i++) {
                let attribInfo = webGraph.rendingWebgl.getActiveAttrib(program, i);
                if (!attribInfo)
                    break;
                let attIndex = webGraph.rendingWebgl.getAttribLocation(program, attribInfo.name);
                let attName = attribInfo.name;
                if (this.CustomAttDic[attName] == null) {
                    console.error("ERROR：Shader Att name isnot predetermined。INFO：shaderName Att name：" + attName);
                }
                else {
                    webGraph.rendingWebgl.bindAttribLocation(program, this.CustomAttDic[attName].location, attName);
                    let atttype = this.CustomAttDic[attName].type;
                    if (atttype != webGraph.VertexAttTypeEnum.instance_pos && atttype != webGraph.VertexAttTypeEnum.instance_rot && atttype != webGraph.VertexAttTypeEnum.instance_scale) {
                        attdic[this.CustomAttDic[attName].type] = this.CustomAttDic[attName].location;
                    }
                }
            }
            webGraph.rendingWebgl.linkProgram(program);
            return attdic;
        }
        static applyAttribute(value) {
            webGraph.rendingWebgl.enableVertexAttribArray(value.location);
            webGraph.rendingWebgl.vertexAttribPointer(value.location, value.componentSize, value.componentDataType, value.normalize, value.strideInBytes, value.offsetInBytes);
        }
        static initAttDic() {
            this.CustomAttDic["a_pos"] = { location: webGraph.VertexAttLocationEnum.Position, type: webGraph.VertexAttTypeEnum.Position };
            this.CustomAttDic["a_texcoord0"] = { location: webGraph.VertexAttLocationEnum.UV0, type: webGraph.VertexAttTypeEnum.UV0 };
            this.CustomAttDic["a_color"] = { location: webGraph.VertexAttLocationEnum.Color0, type: webGraph.VertexAttTypeEnum.Color0 };
            this.CustomAttDic["a_blendindex4"] = { location: webGraph.VertexAttLocationEnum.BlendIndex4, type: webGraph.VertexAttTypeEnum.BlendIndex4 };
            this.CustomAttDic["a_blendweight4"] = { location: webGraph.VertexAttLocationEnum.BlendWeight4, type: webGraph.VertexAttTypeEnum.BlendWeight4 };
            this.CustomAttDic["a_normal"] = { location: webGraph.VertexAttLocationEnum.Normal, type: webGraph.VertexAttTypeEnum.Normal };
            this.CustomAttDic["a_tangent"] = { location: webGraph.VertexAttLocationEnum.Tangent, type: webGraph.VertexAttTypeEnum.Tangent };
            this.CustomAttDic["a_texcoord1"] = { location: webGraph.VertexAttLocationEnum.UV1, type: webGraph.VertexAttTypeEnum.UV1 };
            this.CustomAttDic["a_color1"] = { location: webGraph.VertexAttLocationEnum.Color1, type: webGraph.VertexAttTypeEnum.Color1 };
            this.CustomAttDic["a_InstancePos"] = { location: webGraph.VertexAttLocationEnum.instance_pos, type: webGraph.VertexAttTypeEnum.instance_pos };
            this.CustomAttDic["a_InstanceRot"] = { location: webGraph.VertexAttLocationEnum.instance_rot, type: webGraph.VertexAttTypeEnum.instance_rot };
            this.CustomAttDic["a_InstanceScale"] = { location: webGraph.VertexAttLocationEnum.instance_scale, type: webGraph.VertexAttTypeEnum.instance_scale };
            this.typeDic[webGraph.VertexAttTypeEnum.Position] = webGraph.VertexAttLocationEnum.Position;
            this.typeDic[webGraph.VertexAttTypeEnum.UV0] = webGraph.VertexAttLocationEnum.UV0;
            this.typeDic[webGraph.VertexAttTypeEnum.Color0] = webGraph.VertexAttLocationEnum.Color0;
            this.typeDic[webGraph.VertexAttTypeEnum.Normal] = webGraph.VertexAttLocationEnum.Normal;
            this.typeDic[webGraph.VertexAttTypeEnum.Tangent] = webGraph.VertexAttLocationEnum.Tangent;
            this.typeDic[webGraph.VertexAttTypeEnum.BlendIndex4] = webGraph.VertexAttLocationEnum.BlendIndex4;
            this.typeDic[webGraph.VertexAttTypeEnum.BlendWeight4] = webGraph.VertexAttLocationEnum.BlendWeight4;
            this.typeDic[webGraph.VertexAttTypeEnum.UV1] = webGraph.VertexAttLocationEnum.UV1;
            this.typeDic[webGraph.VertexAttTypeEnum.Color1] = webGraph.VertexAttLocationEnum.Color1;
            this.typeDic[webGraph.VertexAttTypeEnum.instance_pos] = webGraph.VertexAttLocationEnum.instance_pos;
            this.typeDic[webGraph.VertexAttTypeEnum.instance_rot] = webGraph.VertexAttLocationEnum.instance_rot;
            this.typeDic[webGraph.VertexAttTypeEnum.instance_scale] = webGraph.VertexAttLocationEnum.instance_scale;
        }
        static getAttLocationByType(type) {
            return this.typeDic[type];
        }
    }
    AttributeSetter.CustomAttDic = {};
    AttributeSetter.typeDic = {};
    webGraph.AttributeSetter = AttributeSetter;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let CullingFaceEnum;
    (function (CullingFaceEnum) {
        CullingFaceEnum[CullingFaceEnum["ALL"] = 0] = "ALL";
        CullingFaceEnum[CullingFaceEnum["CCW"] = 1] = "CCW";
        CullingFaceEnum[CullingFaceEnum["CW"] = 2] = "CW";
    })(CullingFaceEnum = webGraph.CullingFaceEnum || (webGraph.CullingFaceEnum = {}));
    let BlendModeEnum;
    (function (BlendModeEnum) {
        BlendModeEnum[BlendModeEnum["Blend"] = 0] = "Blend";
        BlendModeEnum[BlendModeEnum["Blend_PreMultiply"] = 1] = "Blend_PreMultiply";
        BlendModeEnum[BlendModeEnum["Add"] = 2] = "Add";
        BlendModeEnum[BlendModeEnum["Add_PreMultiply"] = 3] = "Add_PreMultiply";
        BlendModeEnum[BlendModeEnum["custom"] = 4] = "custom";
    })(BlendModeEnum = webGraph.BlendModeEnum || (webGraph.BlendModeEnum = {}));
    class blendOption {
        constructor(src = webGraph.GLConstants.SRC_ALPHA, dest = webGraph.GLConstants.ONE, blendEquation = webGraph.GLConstants.FUNC_ADD) {
            this.blendEquation = blendEquation;
            this.Src = src;
            this.Dest = dest;
        }
    }
    webGraph.blendOption = blendOption;
    class StateOption {
        constructor() {
            this.cullingFace = CullingFaceEnum.ALL;
            this.Ztest = true;
            this.ZtestMethod = webGraph.GLConstants.LEQUAL;
            this.Zwrite = true;
            this.enableBlend = false;
            this.blend = BlendModeEnum.Add;
            this.blendEquation = webGraph.GLConstants.FUNC_ADD;
            this.Src = webGraph.GLConstants.SRC_ALPHA;
            this.Dest = webGraph.GLConstants.ONE;
            this.stencilTest = false;
            this.refValue = 1;
            this.stencilFuc = webGraph.GLConstants.ALWAYS;
            this.sZfail = webGraph.GLConstants.KEEP;
            this.sPass = webGraph.GLConstants.REPLACE;
            this.sFail = webGraph.GLConstants.KEEP;
            this.enablaColormask = false;
            this.colorMask = { r: true, g: true, b: true, a: true };
            this.clearDepth = false;
        }
        setCullingFace(cullingFace) {
            this.cullingFace = cullingFace;
        }
        setZstate(Ztest = null, Zwrite = null, ZtestMethod = webGraph.GLConstants.LEQUAL) {
            if (Ztest != null) {
                this.Ztest = Ztest;
            }
            if (Zwrite != null) {
                this.Zwrite = Zwrite;
            }
            this.ZtestMethod = ZtestMethod;
        }
        setBlend(blend, detailOp = null) {
            this.enableBlend = true;
            this.blend = blend;
            if (blend == BlendModeEnum.Add) {
                this.Src = webGraph.GLConstants.SRC_ALPHA;
                this.Dest = webGraph.GLConstants.ONE;
            }
            else if (blend == BlendModeEnum.Add_PreMultiply) {
                this.Src = webGraph.GLConstants.ONE;
                this.Dest = webGraph.GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if (blend == BlendModeEnum.Blend) {
                this.Src = webGraph.GLConstants.SRC_ALPHA;
                this.Dest = webGraph.GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if (blend == BlendModeEnum.Blend_PreMultiply) {
                this.Src = webGraph.GLConstants.ONE;
                this.Dest = webGraph.GLConstants.ONE_MINUS_SRC_ALPHA;
            }
            else if (blend == BlendModeEnum.custom && detailOp != null) {
                this.blendEquation = detailOp.blendEquation;
                this.Src = detailOp.Src;
                this.Dest = detailOp.Dest;
            }
        }
        setStencilFuc(stencil, refValue = 1, stencilFuc = webGraph.GLConstants.ALWAYS) {
            this.stencilTest = stencil;
            this.refValue = refValue;
            this.stencilFuc = stencilFuc;
        }
        setStencilOP(spass, sFail = webGraph.GLConstants.KEEP, sZfail = webGraph.GLConstants.KEEP) {
            this.sPass = spass;
            this.sFail = sFail;
            this.sZfail = sZfail;
        }
    }
    webGraph.StateOption = StateOption;
    let DrawModeEnum;
    (function (DrawModeEnum) {
        DrawModeEnum[DrawModeEnum["VboTri"] = 0] = "VboTri";
        DrawModeEnum[DrawModeEnum["VboLine"] = 1] = "VboLine";
        DrawModeEnum[DrawModeEnum["EboTri"] = 2] = "EboTri";
        DrawModeEnum[DrawModeEnum["EboLine"] = 3] = "EboLine";
    })(DrawModeEnum = webGraph.DrawModeEnum || (webGraph.DrawModeEnum = {}));
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let ShaderTypeEnum;
    (function (ShaderTypeEnum) {
        ShaderTypeEnum[ShaderTypeEnum["VS"] = 0] = "VS";
        ShaderTypeEnum[ShaderTypeEnum["FS"] = 1] = "FS";
    })(ShaderTypeEnum = webGraph.ShaderTypeEnum || (webGraph.ShaderTypeEnum = {}));
    class glShader {
        constructor(name, type, shader) {
            this.name = name;
            this.type = type;
            this.instance = shader;
        }
        dispose() {
            webGraph.rendingWebgl.deleteShader(this.instance);
        }
    }
    webGraph.glShader = glShader;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class ShaderMgr {
        constructor() {
            this.mapVS = {};
            this.mapFS = {};
            this.mapProgram = {};
        }
        CreatShader(type, name, stringSource) {
            let beVertex = type == webGraph.ShaderTypeEnum.VS;
            let target = beVertex ? webGraph.GLConstants.VERTEX_SHADER : webGraph.GLConstants.FRAGMENT_SHADER;
            let item = webGraph.rendingWebgl.createShader(target);
            if (item == null)
                return null;
            webGraph.rendingWebgl.shaderSource(item, stringSource);
            webGraph.rendingWebgl.compileShader(item);
            let r1 = webGraph.rendingWebgl.getShaderParameter(item, webGraph.rendingWebgl.COMPILE_STATUS);
            if (r1 == false) {
                let debug = beVertex ? "ERROR: compile  VS Shader Error! VS:" : "ERROR: compile FS Shader Error! FS:";
                debug = debug + name + ".\n";
                console.error(debug + webGraph.rendingWebgl.getShaderInfoLog(item));
                webGraph.rendingWebgl.deleteShader(item);
                return null;
            }
            else {
                let shader = new webGraph.glShader(name, type, item);
                let dic = beVertex ? this.mapVS : this.mapFS;
                dic[name] = shader;
                return shader;
            }
        }
        CreatProgram(vs, fs, type) {
            let item = webGraph.rendingWebgl.createProgram();
            if (item == null)
                return null;
            webGraph.rendingWebgl.attachShader(item, this.mapVS[vs].instance);
            webGraph.rendingWebgl.attachShader(item, this.mapFS[fs].instance);
            webGraph.rendingWebgl.linkProgram(item);
            let r3 = webGraph.rendingWebgl.getProgramParameter(item, webGraph.rendingWebgl.LINK_STATUS);
            if (r3 == false) {
                let debguInfo = "ERROR: compile program Error!" + "VS:" + vs + "   FS:" + fs + "\n" + webGraph.rendingWebgl.getProgramInfoLog(item);
                console.error(debguInfo);
                webGraph.rendingWebgl.deleteProgram(item);
                return null;
            }
            else {
                let name = vs + "_" + fs;
                let programe = new webGraph.ShaderProgram(name, type, item);
                this.mapProgram[name] = programe;
                return programe;
            }
        }
    }
    webGraph.ShaderMgr = ShaderMgr;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class UniformSetter {
        static applyUniform(type, location, value, defValue) {
            let func = this.unifomeApplyDic[type];
            func(location, value, defValue);
        }
        static initUniformDic() {
            this.InitUniformApplyDic();
            this.InitUniformEqualDic();
        }
        static InitUniformApplyDic() {
            this.unifomeApplyDic[UniformTypeEnum.FLOAT] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform1f(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOATV] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform1fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC2] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform2fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC2V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform2fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC3] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform3fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC3V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform3fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC4] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform4fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_VEC4V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform4fv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform1i(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INTV] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform1iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC2] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform2iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC2V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform2iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC3] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform3iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC3V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform3iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC4] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform4iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.INT_VEC4V] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform4iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform1iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC2] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform2iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC3] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform3iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.BOOL_VEC4] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniform4iv(location, value || defValue);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT2] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniformMatrix2fv(location, false, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT3] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniformMatrix3fv(location, false, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.FLOAT_MAT4] = (location, value, defValue) => {
                webGraph.rendingWebgl.uniformMatrix4fv(location, false, value);
            };
            this.unifomeApplyDic[UniformTypeEnum.TEXTURE] = (location, value, defValue) => {
                let texture = (value || defValue).glTexture || defValue.glTexture;
                {
                    let unit = this.texIndex;
                    webGraph.rendingWebgl.activeTexture(webGraph.rendingWebgl.TEXTURE0 + unit);
                    webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_2D, texture.instance);
                    webGraph.rendingWebgl.uniform1i(location, unit);
                    this.texIndex++;
                }
            };
            this.unifomeApplyDic[UniformTypeEnum.TEXTUREV] = (location, value, defValue) => {
                for (let i in value) {
                    let texture = (value[i] || defValue).glTexture || defValue.glTexture;
                    let unit = this.texIndex;
                    webGraph.rendingWebgl.activeTexture(webGraph.rendingWebgl.TEXTURE0 + unit);
                    webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_2D, texture.instance);
                    webGraph.rendingWebgl.uniform1i(location, unit);
                    this.texIndex++;
                }
            };
            this.unifomeApplyDic[UniformTypeEnum.CUBETEXTURE] = (location, value, defValue) => {
                let texture = (value || defValue).glTexture || defValue.glTexture;
                let unit = this.texIndex;
                webGraph.rendingWebgl.activeTexture(webGraph.rendingWebgl.TEXTURE0 + unit);
                webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, texture.instance);
                webGraph.rendingWebgl.uniform1i(location, unit);
                this.texIndex++;
            };
            this.unifomeApplyDic[UniformTypeEnum.CUBETEXTUREV] = (location, value, defValue) => {
                for (let i in value) {
                    let texture = (value[i] || defValue).glTexture || defValue.glTexture;
                    let unit = this.texIndex;
                    webGraph.rendingWebgl.activeTexture(webGraph.rendingWebgl.TEXTURE0 + unit);
                    webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_2D, texture.instance);
                    webGraph.rendingWebgl.uniform1i(location, unit);
                    this.texIndex++;
                }
            };
        }
        static InitUniformEqualDic() {
            this.uniformEqualDic[UniformTypeEnum.FLOAT] = webGraph.numberEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOATV] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC2] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC2V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC3] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC3V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC4] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_VEC4V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT] = webGraph.numberEqual;
            this.uniformEqualDic[UniformTypeEnum.INTV] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC2] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC2V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC3] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC3V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC4] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.INT_VEC4V] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL] = webGraph.numberEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC2] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC3] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.BOOL_VEC4] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT2] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT3] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.FLOAT_MAT4] = webGraph.ArrayEqual;
            this.uniformEqualDic[UniformTypeEnum.TEXTURE] = (value1, value2) => {
                return value1.glTexture == value2.glTexture;
            };
            this.uniformEqualDic[UniformTypeEnum.TEXTUREV] = (value1, value2) => {
                for (let i in value1) {
                    if (value1[i].glTexture != value2[i].glTexture) {
                        return false;
                    }
                }
                return true;
            };
            this.uniformEqualDic[UniformTypeEnum.CUBETEXTURE] = (value1, value2) => {
                return value1.glTexture == value2.glTexture;
            };
            this.uniformEqualDic[UniformTypeEnum.CUBETEXTUREV] = (value1, value2) => {
                for (let i in value1) {
                    if (value1[i].glTexture != value2[i].glTexture) {
                        return false;
                    }
                }
                return true;
            };
        }
        static getUniformInfo(program) {
            let uniformDic = {};
            let numUniforms = webGraph.rendingWebgl.getProgramParameter(program, webGraph.rendingWebgl.ACTIVE_UNIFORMS);
            for (let i = 0; i < numUniforms; i++) {
                let uniformInfo = webGraph.rendingWebgl.getActiveUniform(program, i);
                if (!uniformInfo)
                    break;
                let unifromdata = new UniformData();
                let name = uniformInfo.name;
                if (name.substr(-3) === "[0]") {
                    name = name.substr(0, name.length - 3);
                }
                let type = this.getUniformtype(program, uniformInfo);
                let location = webGraph.rendingWebgl.getUniformLocation(program, uniformInfo.name);
                if (location == null)
                    continue;
                unifromdata.name = name;
                unifromdata.location = location;
                unifromdata.type = type;
                uniformDic[name] = unifromdata;
            }
            return uniformDic;
        }
        static getUniformtype(program, uniformInfo) {
            let type = uniformInfo.type;
            let isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === "[0]");
            if (type === webGraph.rendingWebgl.FLOAT && isArray) {
                return UniformTypeEnum.FLOATV;
            }
            if (type === webGraph.rendingWebgl.FLOAT) {
                return UniformTypeEnum.FLOAT;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC2 && isArray) {
                return UniformTypeEnum.FLOAT_VEC2V;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC2) {
                return UniformTypeEnum.FLOAT_VEC2;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC3 && isArray) {
                return UniformTypeEnum.FLOAT_VEC3V;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC3) {
                return UniformTypeEnum.FLOAT_VEC3;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC4 && isArray) {
                return UniformTypeEnum.FLOAT_VEC4V;
            }
            if (type === webGraph.rendingWebgl.FLOAT_VEC4) {
                return UniformTypeEnum.FLOAT_VEC4;
            }
            if (type === webGraph.rendingWebgl.INT && isArray) {
                return UniformTypeEnum.INTV;
            }
            if (type === webGraph.rendingWebgl.INT) {
                return UniformTypeEnum.INT;
            }
            if (type === webGraph.rendingWebgl.INT_VEC2 && isArray) {
                return UniformTypeEnum.INT_VEC2V;
            }
            if (type === webGraph.rendingWebgl.INT_VEC2) {
                return UniformTypeEnum.INT_VEC2;
            }
            if (type === webGraph.rendingWebgl.INT_VEC3 && isArray) {
                return UniformTypeEnum.INT_VEC3V;
            }
            if (type === webGraph.rendingWebgl.INT_VEC3) {
                return UniformTypeEnum.INT_VEC3;
            }
            if (type === webGraph.rendingWebgl.INT_VEC4 && isArray) {
                return UniformTypeEnum.INT_VEC4V;
            }
            if (type === webGraph.rendingWebgl.INT_VEC4) {
                return UniformTypeEnum.INT_VEC4;
            }
            if (type === webGraph.rendingWebgl.BOOL) {
                return UniformTypeEnum.BOOL;
            }
            if (type === webGraph.rendingWebgl.BOOL_VEC2) {
                return UniformTypeEnum.BOOL_VEC2;
            }
            if (type === webGraph.rendingWebgl.BOOL_VEC3) {
                return UniformTypeEnum.BOOL_VEC3;
            }
            if (type === webGraph.rendingWebgl.BOOL_VEC4) {
                return UniformTypeEnum.BOOL_VEC4;
            }
            if (type === webGraph.rendingWebgl.FLOAT_MAT2) {
                return UniformTypeEnum.FLOAT_MAT2;
            }
            if (type === webGraph.rendingWebgl.FLOAT_MAT3) {
                return UniformTypeEnum.FLOAT_MAT3;
            }
            if (type === webGraph.rendingWebgl.FLOAT_MAT4) {
                return UniformTypeEnum.FLOAT_MAT4;
            }
            if (type === webGraph.rendingWebgl.SAMPLER_2D && isArray) {
                return UniformTypeEnum.TEXTUREV;
            }
            if (type === webGraph.rendingWebgl.SAMPLER_2D) {
                return UniformTypeEnum.TEXTURE;
            }
            if (type === webGraph.rendingWebgl.SAMPLER_CUBE && isArray) {
                return UniformTypeEnum.CUBETEXTUREV;
            }
            if (type === webGraph.rendingWebgl.SAMPLER_CUBE) {
                return UniformTypeEnum.CUBETEXTURE;
            }
            throw ("unknown type: 0x" + type.toString(16));
        }
    }
    UniformSetter.texIndex = 0;
    UniformSetter.unifomeApplyDic = {};
    UniformSetter.uniformEqualDic = {};
    webGraph.UniformSetter = UniformSetter;
    let UniformTypeEnum;
    (function (UniformTypeEnum) {
        UniformTypeEnum[UniformTypeEnum["FLOAT"] = 0] = "FLOAT";
        UniformTypeEnum[UniformTypeEnum["FLOATV"] = 1] = "FLOATV";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC2"] = 2] = "FLOAT_VEC2";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC2V"] = 3] = "FLOAT_VEC2V";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC3"] = 4] = "FLOAT_VEC3";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC3V"] = 5] = "FLOAT_VEC3V";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC4"] = 6] = "FLOAT_VEC4";
        UniformTypeEnum[UniformTypeEnum["FLOAT_VEC4V"] = 7] = "FLOAT_VEC4V";
        UniformTypeEnum[UniformTypeEnum["INT"] = 8] = "INT";
        UniformTypeEnum[UniformTypeEnum["INTV"] = 9] = "INTV";
        UniformTypeEnum[UniformTypeEnum["INT_VEC2"] = 10] = "INT_VEC2";
        UniformTypeEnum[UniformTypeEnum["INT_VEC2V"] = 11] = "INT_VEC2V";
        UniformTypeEnum[UniformTypeEnum["INT_VEC3"] = 12] = "INT_VEC3";
        UniformTypeEnum[UniformTypeEnum["INT_VEC3V"] = 13] = "INT_VEC3V";
        UniformTypeEnum[UniformTypeEnum["INT_VEC4"] = 14] = "INT_VEC4";
        UniformTypeEnum[UniformTypeEnum["INT_VEC4V"] = 15] = "INT_VEC4V";
        UniformTypeEnum[UniformTypeEnum["BOOL"] = 16] = "BOOL";
        UniformTypeEnum[UniformTypeEnum["BOOL_VEC2"] = 17] = "BOOL_VEC2";
        UniformTypeEnum[UniformTypeEnum["BOOL_VEC3"] = 18] = "BOOL_VEC3";
        UniformTypeEnum[UniformTypeEnum["BOOL_VEC4"] = 19] = "BOOL_VEC4";
        UniformTypeEnum[UniformTypeEnum["FLOAT_MAT2"] = 20] = "FLOAT_MAT2";
        UniformTypeEnum[UniformTypeEnum["FLOAT_MAT3"] = 21] = "FLOAT_MAT3";
        UniformTypeEnum[UniformTypeEnum["FLOAT_MAT4"] = 22] = "FLOAT_MAT4";
        UniformTypeEnum[UniformTypeEnum["TEXTURE"] = 23] = "TEXTURE";
        UniformTypeEnum[UniformTypeEnum["TEXTUREV"] = 24] = "TEXTUREV";
        UniformTypeEnum[UniformTypeEnum["CUBETEXTURE"] = 25] = "CUBETEXTURE";
        UniformTypeEnum[UniformTypeEnum["CUBETEXTUREV"] = 26] = "CUBETEXTUREV";
    })(UniformTypeEnum = webGraph.UniformTypeEnum || (webGraph.UniformTypeEnum = {}));
    class UniformData {
    }
    webGraph.UniformData = UniformData;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let PrimitiveRenderEnum;
    (function (PrimitiveRenderEnum) {
        PrimitiveRenderEnum[PrimitiveRenderEnum["Points"] = 0] = "Points";
        PrimitiveRenderEnum[PrimitiveRenderEnum["Lines"] = 1] = "Lines";
        PrimitiveRenderEnum[PrimitiveRenderEnum["Triangles"] = 4] = "Triangles";
        PrimitiveRenderEnum[PrimitiveRenderEnum["Wireframe"] = 3] = "Wireframe";
    })(PrimitiveRenderEnum = webGraph.PrimitiveRenderEnum || (webGraph.PrimitiveRenderEnum = {}));
    let PrimitiveDataEnum;
    (function (PrimitiveDataEnum) {
        PrimitiveDataEnum[PrimitiveDataEnum["static"] = 35044] = "static";
        PrimitiveDataEnum[PrimitiveDataEnum["dynamic"] = 35048] = "dynamic";
    })(PrimitiveDataEnum = webGraph.PrimitiveDataEnum || (webGraph.PrimitiveDataEnum = {}));
    let RenderModelEnum;
    (function (RenderModelEnum) {
        RenderModelEnum[RenderModelEnum["static"] = webGraph.GLConstants.STATIC_DRAW] = "static";
        RenderModelEnum[RenderModelEnum["dynamic"] = 35048] = "dynamic";
        RenderModelEnum[RenderModelEnum["stream"] = 35040] = "stream";
    })(RenderModelEnum = webGraph.RenderModelEnum || (webGraph.RenderModelEnum = {}));
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let VertexAttTypeEnum;
    (function (VertexAttTypeEnum) {
        VertexAttTypeEnum["Position"] = "a_pos";
        VertexAttTypeEnum["UV0"] = "a_texcoord0";
        VertexAttTypeEnum["Color0"] = "a_color";
        VertexAttTypeEnum["BlendIndex4"] = "a_blendindex4";
        VertexAttTypeEnum["BlendWeight4"] = "a_blendweight4";
        VertexAttTypeEnum["Normal"] = "a_normal";
        VertexAttTypeEnum["Tangent"] = "a_tangent";
        VertexAttTypeEnum["UV1"] = "a_texcoord1";
        VertexAttTypeEnum["Color1"] = "a_color1";
        VertexAttTypeEnum["instance_pos"] = "a_InstancePos";
        VertexAttTypeEnum["instance_scale"] = "a_InstanceScale";
        VertexAttTypeEnum["instance_rot"] = "a_InstanceRot";
    })(VertexAttTypeEnum = webGraph.VertexAttTypeEnum || (webGraph.VertexAttTypeEnum = {}));
    let VertexAttLocationEnum;
    (function (VertexAttLocationEnum) {
        VertexAttLocationEnum[VertexAttLocationEnum["Position"] = 1] = "Position";
        VertexAttLocationEnum[VertexAttLocationEnum["UV0"] = 2] = "UV0";
        VertexAttLocationEnum[VertexAttLocationEnum["Color0"] = 3] = "Color0";
        VertexAttLocationEnum[VertexAttLocationEnum["BlendIndex4"] = 4] = "BlendIndex4";
        VertexAttLocationEnum[VertexAttLocationEnum["BlendWeight4"] = 5] = "BlendWeight4";
        VertexAttLocationEnum[VertexAttLocationEnum["Normal"] = 6] = "Normal";
        VertexAttLocationEnum[VertexAttLocationEnum["Tangent"] = 7] = "Tangent";
        VertexAttLocationEnum[VertexAttLocationEnum["UV1"] = 8] = "UV1";
        VertexAttLocationEnum[VertexAttLocationEnum["Color1"] = 9] = "Color1";
        VertexAttLocationEnum[VertexAttLocationEnum["instance_pos"] = 10] = "instance_pos";
        VertexAttLocationEnum[VertexAttLocationEnum["instance_scale"] = 11] = "instance_scale";
        VertexAttLocationEnum[VertexAttLocationEnum["instance_rot"] = 12] = "instance_rot";
    })(VertexAttLocationEnum = webGraph.VertexAttLocationEnum || (webGraph.VertexAttLocationEnum = {}));
    function getCompnentSizeByVertexType(type) {
        switch (type) {
            case VertexAttTypeEnum.UV0:
            case VertexAttTypeEnum.UV1:
                return 2;
            case VertexAttTypeEnum.Position:
            case VertexAttTypeEnum.Normal:
            case VertexAttTypeEnum.Tangent:
            case VertexAttTypeEnum.instance_pos:
            case VertexAttTypeEnum.instance_scale:
                return 3;
            case VertexAttTypeEnum.Color0:
            case VertexAttTypeEnum.Color1:
            case VertexAttTypeEnum.BlendIndex4:
            case VertexAttTypeEnum.BlendWeight4:
            case VertexAttTypeEnum.instance_rot:
                return 4;
            default:
                console.error("vertex type error!");
        }
    }
    webGraph.getCompnentSizeByVertexType = getCompnentSizeByVertexType;
    class VertexAttribute {
        constructor() {
            this.beInstanceAtt = false;
            this.offsetInBytes = 0;
            this.strideInBytes = 0;
        }
        static PrepareVertexAttribute(type, view, componentSize, byteStride) {
            let att = new VertexAttribute();
            att.type = type;
            att.location = webGraph.AttributeSetter.getAttLocationByType(type);
            att.componentSize = componentSize;
            att.componentSize = componentSize || getCompnentSizeByVertexType(type);
            att.componentDataType = webGraph.GLConstants.FLOAT;
            att.normalize = false;
            att.vbo = new webGraph.VertexBuffer();
            att.vbo.bufferData(view);
            if (type == VertexAttTypeEnum.instance_pos || type == VertexAttTypeEnum.instance_rot || type == VertexAttTypeEnum.instance_scale) {
                att.beInstanceAtt = true;
            }
            return att;
        }
        static createByType(type, attinfo) {
            let att = new VertexAttribute();
            att.type = type;
            att.location = webGraph.AttributeSetter.getAttLocationByType(type);
            if (type == VertexAttTypeEnum.instance_pos || type == VertexAttTypeEnum.instance_rot || type == VertexAttTypeEnum.instance_scale) {
                att.beInstanceAtt = true;
            }
            if (attinfo != null) {
                att.componentSize = attinfo.componentSize || getCompnentSizeByVertexType(type);
                att.componentDataType = attinfo.componentDataType || webGraph.GLConstants.FLOAT;
                att.normalize = attinfo.normalize || false;
            }
            else {
                att.componentSize = getCompnentSizeByVertexType(type);
                att.componentDataType = webGraph.GLConstants.FLOAT;
                att.normalize = false;
            }
            return att;
        }
        refreshVboData(vbodata) {
            this.vbo.bufferData(vbodata);
        }
    }
    webGraph.VertexAttribute = VertexAttribute;
    let ViewDataType;
    (function (ViewDataType) {
        ViewDataType[ViewDataType["BYTE"] = 5120] = "BYTE";
        ViewDataType[ViewDataType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        ViewDataType[ViewDataType["SHORT"] = 5122] = "SHORT";
        ViewDataType[ViewDataType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        ViewDataType[ViewDataType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        ViewDataType[ViewDataType["FLOAT"] = 5126] = "FLOAT";
    })(ViewDataType = webGraph.ViewDataType || (webGraph.ViewDataType = {}));
    function GetDataArr(view, byteStride, compoentSize, compenttype = ViewDataType.FLOAT) {
        let dataArr = [];
        let count = view.byteLength / byteStride;
        for (let i = 0; i < count; i++) {
            dataArr.push(GetTypedArry(compenttype, view.buffer, view.byteOffset + i * byteStride, compoentSize));
        }
        return dataArr;
    }
    webGraph.GetDataArr = GetDataArr;
    function GetTypedArry(componentType, buffer, byteOffset, Len) {
        switch (componentType) {
            case ViewDataType.BYTE: return new Int8Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, Len);
            case ViewDataType.SHORT: return new Int16Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, Len);
            case ViewDataType.UNSIGNED_INT: return new Uint32Array(buffer, byteOffset, Len);
            case ViewDataType.FLOAT: return new Float32Array(buffer, byteOffset, Len);
            default: throw new Error(`Invalid component type ${componentType}`);
        }
    }
    webGraph.GetTypedArry = GetTypedArry;
    function GetByteSize(componentType, componentSize) {
        switch (componentType) {
            case ViewDataType.BYTE:
                return componentSize * Int8Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_BYTE:
                return componentSize * Uint8Array.BYTES_PER_ELEMENT;
            case ViewDataType.SHORT:
                return componentSize * Int16Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_SHORT:
                return componentSize * Uint16Array.BYTES_PER_ELEMENT;
            case ViewDataType.UNSIGNED_INT:
                return componentSize * Uint32Array.BYTES_PER_ELEMENT;
            case ViewDataType.FLOAT:
                return componentSize * Float32Array.BYTES_PER_ELEMENT;
            default: throw new Error(`Invalid component type ${componentType}`);
        }
    }
    webGraph.GetByteSize = GetByteSize;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class abstractPlatformEntity {
        constructor(instance) {
            this.instance = instance;
        }
    }
    webGraph.abstractPlatformEntity = abstractPlatformEntity;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class BaseBuffer extends webGraph.abstractPlatformEntity {
        constructor(target, rendermodel = webGraph.rendingWebgl.STATIC_DRAW) {
            super(webGraph.rendingWebgl.createBuffer());
            this.target = target;
            this.rendermodel = rendermodel;
        }
        attach() { webGraph.rendingWebgl.bindBuffer(this.target, this.instance); }
        detach() { webGraph.rendingWebgl.bindBuffer(this.target, null); }
        dispose() {
            webGraph.rendingWebgl.deleteBuffer(this.instance);
        }
    }
    webGraph.BaseBuffer = BaseBuffer;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class ElementBuffer extends webGraph.BaseBuffer {
        constructor(data = null, rendermodel = webGraph.GLConstants.STATIC_DRAW) {
            super(webGraph.rendingWebgl.ELEMENT_ARRAY_BUFFER, rendermodel);
            if (data == null)
                return;
            this.bufferData(data);
        }
        bufferData(bufferData) {
            this.attach();
            if (typeof bufferData == "number") {
                webGraph.rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
            }
            else {
                webGraph.rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
            }
        }
        attachWithCache() {
            if (this.instance != ElementBuffer.curEbo) {
                webGraph.rendingWebgl.bindBuffer(this.target, this.instance);
                ElementBuffer.curEbo = this.instance;
            }
        }
        attach() {
            webGraph.rendingWebgl.bindBuffer(this.target, this.instance);
            ElementBuffer.curEbo = this.instance;
        }
        bufferSubData(data, offset = 0) {
            this.attach();
            webGraph.rendingWebgl.bufferSubData(this.target, offset, data);
        }
        setSize(indexcount) {
            this.attach();
            webGraph.rendingWebgl.bufferData(this.target, indexcount, this.rendermodel);
            this.detach();
        }
    }
    webGraph.ElementBuffer = ElementBuffer;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class FboOption {
        constructor() {
            this.width = 10;
            this.height = 10;
            this.colorTextures = null;
            this.colorRenderBuffers = null;
            this.depthTexture = null;
            this.depthRenderBuffer = null;
            this.stencilRenderBuffer = null;
            this.depthStencilTexture = null;
            this.depthStencilRenderBuffer = null;
        }
        static getDefColorDepthComboOP(width, height) {
            let op = new FboOption();
            op.width = width;
            op.height = height;
            let texop = new webGraph.TextureOption();
            texop.setNullImageData(width, height);
            texop.setWrap(webGraph.TexWrapEnum.clampToEdge, webGraph.TexWrapEnum.clampToEdge);
            let glTexture = new webGraph.Texture2D(null, texop);
            op.colorTextures = [];
            op.colorTextures.push(glTexture);
            op.depthRenderBuffer = webGraph.rendingWebgl.createRenderbuffer();
            return op;
        }
    }
    webGraph.FboOption = FboOption;
    class FrameBuffer extends webGraph.abstractPlatformEntity {
        constructor(option = null) {
            super(webGraph.rendingWebgl.createFramebuffer());
            this.colorTextures = null;
            this.colorRenderBuffers = null;
            this.activeColorAttachments = null;
            this.depthTexture = null;
            this.depthRenderBuffer = null;
            this.stencilRenderBuffer = null;
            this.depthStencilTexture = null;
            this.depthStencilRenderBuffer = null;
            if (option == null)
                return;
            this.attach();
            if (option.colorTextures != null) {
                if (this.colorTextures == null) {
                    this.colorTextures = [];
                }
                if (this.activeColorAttachments == null) {
                    this.activeColorAttachments = [];
                }
                for (let i = 0, len = option.colorTextures.length; i < len; i++) {
                    let tex = option.colorTextures[i];
                    let attachment = webGraph.rendingWebgl.COLOR_ATTACHMENT0 + i;
                    this.attachTexture(tex, attachment);
                    this.activeColorAttachments[i] = attachment;
                    this.colorTextures[i] = tex;
                }
            }
            if (option.colorRenderBuffers != undefined) {
                if (this.colorRenderBuffers == null) {
                    this.colorRenderBuffers = [];
                }
                for (let i = 0, len = option.colorRenderBuffers.length; i < len; i++) {
                    let renderbuffer = option.colorRenderBuffers[i];
                    let attachment = webGraph.rendingWebgl.COLOR_ATTACHMENT0 + i;
                    this.attachRenderBuffer(renderbuffer, attachment);
                    this.colorRenderBuffers[i] = renderbuffer;
                }
            }
            if (option.depthTexture != undefined) {
                let attachment = webGraph.rendingWebgl.DEPTH_ATTACHMENT;
                this.attachTexture(option.depthTexture, attachment);
                this.depthTexture = option.depthTexture;
            }
            if (option.depthRenderBuffer != undefined) {
                let attachment = webGraph.rendingWebgl.DEPTH_ATTACHMENT;
                this.attachDepthBuffer(option.depthRenderBuffer, option.width, option.height, attachment);
                this.depthRenderBuffer = option.depthRenderBuffer;
            }
            if (option.stencilRenderBuffer != undefined) {
                let attachment = webGraph.rendingWebgl.STENCIL_ATTACHMENT;
                this.attachRenderBuffer(option.stencilRenderBuffer, attachment);
                this.stencilRenderBuffer = option.stencilRenderBuffer;
            }
            if (option.depthStencilTexture != undefined) {
                let attachment = webGraph.rendingWebgl.DEPTH_STENCIL_ATTACHMENT;
                this.attachTexture(option.depthStencilTexture, attachment);
                this.depthStencilTexture = option.depthStencilTexture;
            }
            if (option.depthStencilRenderBuffer != undefined) {
                let attachment = webGraph.rendingWebgl.DEPTH_STENCIL_ATTACHMENT;
                this.attachRenderBuffer(option.depthStencilRenderBuffer, attachment);
                this.depthStencilRenderBuffer = option.depthStencilRenderBuffer;
            }
            this.detach();
        }
        attachTexture(textue, attachment = webGraph.rendingWebgl.COLOR_ATTACHMENT0) {
            textue.attach();
            webGraph.rendingWebgl.framebufferTexture2D(webGraph.rendingWebgl.FRAMEBUFFER, attachment, webGraph.rendingWebgl.TEXTURE_2D, textue.instance, 0);
        }
        attachRenderBuffer(renderbuffer, attachment = webGraph.rendingWebgl.COLOR_ATTACHMENT0) {
            webGraph.rendingWebgl.framebufferRenderbuffer(webGraph.rendingWebgl.FRAMEBUFFER, attachment, webGraph.rendingWebgl.RENDERBUFFER, renderbuffer);
        }
        attachDepthBuffer(depthBuffer, width, height, attachment = webGraph.rendingWebgl.DEPTH_ATTACHMENT) {
            webGraph.rendingWebgl.bindRenderbuffer(webGraph.rendingWebgl.RENDERBUFFER, depthBuffer);
            webGraph.rendingWebgl.renderbufferStorage(webGraph.rendingWebgl.RENDERBUFFER, webGraph.rendingWebgl.DEPTH_COMPONENT16, width, height);
            webGraph.rendingWebgl.framebufferRenderbuffer(webGraph.rendingWebgl.FRAMEBUFFER, webGraph.rendingWebgl.DEPTH_ATTACHMENT, webGraph.rendingWebgl.RENDERBUFFER, depthBuffer);
        }
        attach() { webGraph.rendingWebgl.bindFramebuffer(webGraph.rendingWebgl.FRAMEBUFFER, this.instance); }
        detach() { webGraph.rendingWebgl.bindFramebuffer(webGraph.rendingWebgl.FRAMEBUFFER, null); }
        dispose() {
            if (this.colorTextures) {
                this.colorTextures.length = 0;
                this.colorTextures = null;
            }
            if (this.colorRenderBuffers) {
                this.colorRenderBuffers.length = 0;
                this.colorRenderBuffers = null;
            }
            if (this.activeColorAttachments) {
                this.activeColorAttachments.length = 0;
                this.activeColorAttachments = null;
            }
            webGraph.rendingWebgl.deleteFramebuffer(this.instance);
        }
    }
    webGraph.FrameBuffer = FrameBuffer;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class RenderBuffer extends webGraph.abstractPlatformEntity {
        constructor(option = null) {
            super(webGraph.rendingWebgl.createRenderbuffer());
            if (option == null)
                return;
            this.attach();
            this.init(option.format, option.width, option.height);
            this.detach();
        }
        attach() {
            webGraph.rendingWebgl.bindRenderbuffer(webGraph.rendingWebgl.RENDERBUFFER, this.instance);
        }
        detach() {
            webGraph.rendingWebgl.bindRenderbuffer(webGraph.rendingWebgl.RENDERBUFFER, null);
        }
        init(format, width, height) {
            webGraph.rendingWebgl.renderbufferStorage(webGraph.rendingWebgl.RENDERBUFFER, format, width, height);
        }
        dispose() {
            webGraph.rendingWebgl.deleteRenderbuffer(this.instance);
        }
    }
    webGraph.RenderBuffer = RenderBuffer;
    class RboOption {
    }
    webGraph.RboOption = RboOption;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class Texture2D extends webGraph.abstractPlatformEntity {
        constructor(imagedata, sampler) {
            super(webGraph.rendingWebgl.createTexture());
            if (sampler == null) {
                sampler = new webGraph.TextureOption();
            }
            webGraph.rendingWebgl.activeTexture(webGraph.GLConstants.TEXTURE0);
            this.attach();
            this.bufferData(imagedata, sampler);
            this.detach();
        }
        bufferData(imagedata, sampler) {
            if (imagedata instanceof HTMLImageElement || imagedata instanceof HTMLCanvasElement) {
                let image = imagedata;
                webGraph.rendingWebgl.pixelStorei(webGraph.GLConstants.UNPACK_FLIP_Y_WEBGL, Number(sampler.flip_y));
                webGraph.rendingWebgl.pixelStorei(webGraph.GLConstants.UNPACK_PREMULTIPLY_ALPHA_WEBGL, Number(sampler.preMultiply_alpha));
                webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_2D, 0, sampler.pixelFormat, sampler.pixelFormat, sampler.pixelDatatype, image);
                if (webGraph.isPowerOf2(image.width) && webGraph.isPowerOf2(image.height)) {
                    webGraph.rendingWebgl.generateMipmap(webGraph.rendingWebgl.TEXTURE_2D);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_S, sampler.wrap_s);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, webGraph.GLConstants.LINEAR_MIPMAP_NEAREST);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                }
                else {
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_S, webGraph.TexWrapEnum.clampToEdge);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_T, webGraph.TexWrapEnum.clampToEdge);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, sampler.min_filter);
                    webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                }
            }
            else if (imagedata instanceof Uint8Array) {
                webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_2D, 0, sampler.pixelFormat, sampler.width, sampler.height, 0, sampler.pixelFormat, sampler.pixelDatatype, imagedata);
                webGraph.rendingWebgl.pixelStorei(webGraph.GLConstants.UNPACK_FLIP_Y_WEBGL, Number(sampler.flip_y));
                webGraph.rendingWebgl.pixelStorei(webGraph.GLConstants.UNPACK_PREMULTIPLY_ALPHA_WEBGL, Number(sampler.preMultiply_alpha));
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, sampler.min_filter);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_S, sampler.wrap_s);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
            }
            else {
                if (sampler.width > 0 && sampler.height > 0) {
                    webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_2D, 0, sampler.pixelFormat, sampler.width, sampler.height, 0, sampler.pixelFormat, sampler.pixelDatatype, null);
                }
                else {
                    webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_2D, 0, sampler.pixelFormat, sampler.pixelFormat, sampler.pixelDatatype, null);
                }
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_S, sampler.wrap_s);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_WRAP_T, sampler.wrap_t);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, sampler.min_filter);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_2D, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, sampler.max_filter);
            }
        }
        attach() {
            webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_2D, this.instance);
        }
        detach() { webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_2D, null); }
        dispose() { webGraph.rendingWebgl.deleteTexture(this.instance); }
    }
    webGraph.Texture2D = Texture2D;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class VAO extends webGraph.abstractPlatformEntity {
        constructor() {
            super(webGraph.rendingWebgl.createVertexArray());
        }
        attach() {
            webGraph.rendingWebgl.bindVertexArray(this.instance);
        }
        detach() {
            webGraph.rendingWebgl.bindVertexArray(null);
        }
        dispose() {
            webGraph.rendingWebgl.deleteVertexArray(this.instance);
        }
    }
    webGraph.VAO = VAO;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class VertexBuffer extends webGraph.BaseBuffer {
        constructor(rendermodel = webGraph.GLConstants.STATIC_DRAW, data = null) {
            super(webGraph.rendingWebgl.ARRAY_BUFFER, rendermodel);
            if (data == null)
                return;
            this.bufferData(data);
        }
        bufferData(bufferData) {
            this.attach();
            if (typeof bufferData == "number") {
                webGraph.rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
            }
            else {
                webGraph.rendingWebgl.bufferData(this.target, bufferData, this.rendermodel);
            }
        }
        bufferSubData(data, offset = 0) {
            this.attach();
            webGraph.rendingWebgl.bufferSubData(this.target, offset, data);
        }
        attachWithCache() {
            if (this.instance != VertexBuffer.curVbo) {
                webGraph.rendingWebgl.bindBuffer(this.target, this.instance);
                VertexBuffer.curVbo = this.instance;
            }
        }
        attach() {
            webGraph.rendingWebgl.bindBuffer(this.target, this.instance);
            VertexBuffer.curVbo = this.instance;
        }
        detach() {
            VertexBuffer.curVbo = null;
            webGraph.rendingWebgl.bindBuffer(this.target, null);
        }
    }
    webGraph.VertexBuffer = VertexBuffer;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class CubeTex extends webGraph.abstractPlatformEntity {
        constructor(imagedArr) {
            super(webGraph.rendingWebgl.createTexture());
            if (imagedArr == null)
                return;
            webGraph.rendingWebgl.activeTexture(webGraph.rendingWebgl.TEXTURE0);
            this.attach();
            webGraph.rendingWebgl.pixelStorei(webGraph.rendingWebgl.UNPACK_FLIP_Y_WEBGL, 0);
            webGraph.rendingWebgl.pixelStorei(webGraph.rendingWebgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            for (let i = 0; i < 6; i++) {
                webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
            }
            webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, webGraph.rendingWebgl.LINEAR);
            webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, webGraph.rendingWebgl.LINEAR);
            webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_WRAP_S, webGraph.rendingWebgl.CLAMP_TO_EDGE);
            webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_WRAP_T, webGraph.rendingWebgl.CLAMP_TO_EDGE);
        }
        uploadImage(imagedArr, mipmapLevel = -1) {
            if (mipmapLevel == -1) {
                webGraph.rendingWebgl.activeTexture(webGraph.GLConstants.TEXTURE0);
                this.attach();
                for (let i = 0; i < 6; i++) {
                    webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
                }
            }
            else {
                webGraph.rendingWebgl.activeTexture(webGraph.GLConstants.TEXTURE0);
                this.attach();
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_WRAP_S, webGraph.rendingWebgl.CLAMP_TO_EDGE);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_WRAP_T, webGraph.rendingWebgl.CLAMP_TO_EDGE);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_MIN_FILTER, webGraph.rendingWebgl.LINEAR_MIPMAP_LINEAR);
                webGraph.rendingWebgl.texParameteri(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, webGraph.rendingWebgl.TEXTURE_MAG_FILTER, webGraph.rendingWebgl.LINEAR);
                webGraph.rendingWebgl.pixelStorei(webGraph.rendingWebgl.UNPACK_FLIP_Y_WEBGL, 0);
                webGraph.rendingWebgl.pixelStorei(webGraph.rendingWebgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
                for (let i = 0; i < 6; i++) {
                    webGraph.rendingWebgl.texImage2D(webGraph.rendingWebgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, mipmapLevel, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.RGBA, webGraph.rendingWebgl.UNSIGNED_BYTE, imagedArr[i]);
                }
            }
        }
        attach() { webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, this.instance); }
        detach() { webGraph.rendingWebgl.bindTexture(webGraph.rendingWebgl.TEXTURE_CUBE_MAP, null); }
        dispose() { webGraph.rendingWebgl.deleteTexture(this.instance); }
    }
    webGraph.CubeTex = CubeTex;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    class TextureOption {
        constructor() {
            this.preMultiply_alpha = false;
            this.flip_y = false;
            this.max_filter = TexFilterEnum.linear;
            this.min_filter = TexFilterEnum.nearest;
            this.wrap_s = TexWrapEnum.repeat;
            this.wrap_t = TexWrapEnum.repeat;
            this.pixelFormat = PixelFormat.rgba;
            this.pixelDatatype = PixelDatatype.UNSIGNED_BYTE;
            this.width = 1;
            this.height = 1;
        }
        setPixsStore(preMultiply_alpha, flip_y) {
            this.preMultiply_alpha = preMultiply_alpha;
            this.flip_y = flip_y;
        }
        setWrap(wrap_s, wrap_t) {
            this.wrap_s = wrap_s;
            this.wrap_t = wrap_t;
        }
        setFilterModel(maxf, minf) {
            this.max_filter = maxf;
            this.min_filter = minf;
        }
        setArrayData(data, width, height, format = PixelFormat.rgba, dataType = PixelDatatype.UNSIGNED_BYTE) {
            this.data = data;
            this.width = width;
            this.height = height;
            this.pixelFormat = format;
            this.pixelDatatype = dataType;
        }
        setImageData(data, format = PixelFormat.rgba, dataType = PixelDatatype.UNSIGNED_BYTE) {
            this.data = data;
            this.pixelFormat = format;
            this.pixelDatatype = dataType;
        }
        setNullImageData(width, height, format = PixelFormat.rgba, dataType = PixelDatatype.UNSIGNED_BYTE) {
            this.data = null;
            this.width = width;
            this.height = height;
            this.pixelFormat = format;
            this.pixelDatatype = dataType;
        }
        static getDefFboTextureOp(width, height) {
            let op = new TextureOption();
            op.data = null;
            op.width = width;
            op.height = height;
            op.wrap_s = TexWrapEnum.clampToEdge;
            op.wrap_t = TexWrapEnum.clampToEdge;
            return op;
        }
    }
    webGraph.TextureOption = TextureOption;
    let TexWrapEnum;
    (function (TexWrapEnum) {
        TexWrapEnum[TexWrapEnum["clampToEdge"] = webGraph.GLConstants.CLAMP_TO_EDGE] = "clampToEdge";
        TexWrapEnum[TexWrapEnum["repeat"] = 10497] = "repeat";
        TexWrapEnum[TexWrapEnum["mirroredRepeat"] = 33648] = "mirroredRepeat";
    })(TexWrapEnum = webGraph.TexWrapEnum || (webGraph.TexWrapEnum = {}));
    let TexFilterEnum;
    (function (TexFilterEnum) {
        TexFilterEnum[TexFilterEnum["linear"] = 9729] = "linear";
        TexFilterEnum[TexFilterEnum["nearest"] = 9728] = "nearest";
        TexFilterEnum[TexFilterEnum["nearest_mipmap_nearest"] = 9984] = "nearest_mipmap_nearest";
        TexFilterEnum[TexFilterEnum["linear_mipmap_nearest"] = 9985] = "linear_mipmap_nearest";
        TexFilterEnum[TexFilterEnum["nearest_mipmap_linear"] = 9986] = "nearest_mipmap_linear";
        TexFilterEnum[TexFilterEnum["linear_mipmap_linear"] = 9987] = "linear_mipmap_linear";
    })(TexFilterEnum = webGraph.TexFilterEnum || (webGraph.TexFilterEnum = {}));
    let PixelFormat;
    (function (PixelFormat) {
        PixelFormat[PixelFormat["depth_component"] = 6402] = "depth_component";
        PixelFormat[PixelFormat["depth_stencil"] = 34041] = "depth_stencil";
        PixelFormat[PixelFormat["alpha"] = 6406] = "alpha";
        PixelFormat[PixelFormat["rgb"] = 6407] = "rgb";
        PixelFormat[PixelFormat["rgba"] = 6408] = "rgba";
        PixelFormat[PixelFormat["luminance"] = 6409] = "luminance";
        PixelFormat[PixelFormat["luminance_alpha"] = 6410] = "luminance_alpha";
        PixelFormat[PixelFormat["rgb_dxt1"] = 33776] = "rgb_dxt1";
        PixelFormat[PixelFormat["rgba_dxt1"] = 33777] = "rgba_dxt1";
        PixelFormat[PixelFormat["rgba_dxt3"] = 33778] = "rgba_dxt3";
        PixelFormat[PixelFormat["rgba_dxt5"] = 33779] = "rgba_dxt5";
        PixelFormat[PixelFormat["rgb_pvrtc_2bppv1"] = 35841] = "rgb_pvrtc_2bppv1";
        PixelFormat[PixelFormat["rgb_pvrtc_4bppv1"] = 35840] = "rgb_pvrtc_4bppv1";
        PixelFormat[PixelFormat["rgba_pvrtc_2bppv1"] = 35843] = "rgba_pvrtc_2bppv1";
        PixelFormat[PixelFormat["rgba_pvrtc_4bppv1"] = 35842] = "rgba_pvrtc_4bppv1";
        PixelFormat[PixelFormat["rgb_etc1"] = 36196] = "rgb_etc1";
    })(PixelFormat = webGraph.PixelFormat || (webGraph.PixelFormat = {}));
    let PixelDatatype;
    (function (PixelDatatype) {
        PixelDatatype[PixelDatatype["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        PixelDatatype[PixelDatatype["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        PixelDatatype[PixelDatatype["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        PixelDatatype[PixelDatatype["FLOAT"] = 5126] = "FLOAT";
        PixelDatatype[PixelDatatype["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
        PixelDatatype[PixelDatatype["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
        PixelDatatype[PixelDatatype["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
        PixelDatatype[PixelDatatype["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
    })(PixelDatatype = webGraph.PixelDatatype || (webGraph.PixelDatatype = {}));
})(webGraph || (webGraph = {}));
var MathD;
(function (MathD) {
    class color extends Float32Array {
        constructor(r = 1, g, b = 1, a = 1) {
            super(4);
            this[0] = r;
            this[1] = g;
            this[2] = b;
            this[3] = a;
        }
        get r() {
            return this[0];
        }
        set r(value) {
            this[0] = value;
        }
        get g() {
            return this[1];
        }
        set g(value) {
            this[1] = value;
        }
        get b() {
            return this[2];
        }
        set b(value) {
            this[2] = value;
        }
        get a() {
            return this[3];
        }
        set a(value) {
            this[3] = value;
        }
        static create(r = 1, g = 1, b = 1, a = 1) {
            if (color.Recycle && color.Recycle.length > 0) {
                let item = color.Recycle.pop();
                item[0] = r;
                item[1] = g;
                item[2] = b;
                item[3] = a;
                return item;
            }
            else {
                let item = new color(r, g, b, a);
                return item;
            }
        }
        static clone(from) {
            if (color.Recycle.length > 0) {
                let item = color.Recycle.pop();
                color.copy(from, item);
                return item;
            }
            else {
                let item = new color(from[0], from[1], from[2], from[3]);
                return item;
            }
        }
        static recycle(item) {
            color.Recycle.push(item);
        }
        static disposeRecycledItems() {
            color.Recycle.length = 0;
        }
        static setWhite(out) {
            out[0] = 1;
            out[1] = 1;
            out[2] = 1;
            out[3] = 1;
            return out;
        }
        static setBlack(out) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
        }
        static setGray(out) {
            out[0] = 0.5;
            out[1] = 0.5;
            out[2] = 0.5;
            out[3] = 1;
        }
        static multiply(srca, srcb, out) {
            out[0] = srca[0] * srcb[0];
            out[1] = srca[1] * srcb[1];
            out[2] = srca[2] * srcb[2];
            out[3] = srca[3] * srcb[3];
        }
        static scaleToRef(src, scale, out) {
            out[0] = src[0] * scale;
            out[1] = src[1] * scale;
            out[2] = src[2] * scale;
            out[3] = src[3] * scale;
        }
        static lerp(srca, srcb, t, out) {
            t = MathD.clamp(t);
            out[0] = t * (srcb[0] - srca[0]) + srca[0];
            out[1] = t * (srcb[1] - srca[1]) + srca[1];
            out[2] = t * (srcb[2] - srca[2]) + srca[2];
            out[3] = t * (srcb[3] - srca[3]) + srca[3];
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            return Math.abs(a0 - b0) <= MathD.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= MathD.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= MathD.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= MathD.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
        }
    }
    color.WHITE = new color(1, 1, 1, 1);
    color.Recycle = [];
    MathD.color = color;
})(MathD || (MathD = {}));
var webGraph;
(function (webGraph) {
    class render {
        static viewPort(x, y, w, h) {
            if (x != this._viewportCached.x || y != this._viewportCached.y || w != this._viewportCached.w || h != this._viewportCached.h) {
                webGraph.rendingWebgl.viewport(x, y, w, h);
                this._viewportCached.x = x;
                this._viewportCached.y = y;
                this._viewportCached.w = w;
                this._viewportCached.h = h;
            }
        }
        static clears(clearcolor, color, cleardepth, depth, clearStencil, stencil) {
            let cleartype = 0;
            if (clearcolor) {
                if (!MathD.color.equals(this._colorcached, color)) {
                    MathD.color.copy(color, this._colorcached);
                    webGraph.rendingWebgl.clearColor(color[0], color[1], color[2], color[3]);
                }
                cleartype = cleartype | webGraph.rendingWebgl.COLOR_BUFFER_BIT;
            }
            if (cleardepth) {
                if (depth != this._depthcached) {
                    this._depthcached = depth;
                    webGraph.rendingWebgl.clearDepth(depth);
                }
                cleartype = cleartype | webGraph.rendingWebgl.DEPTH_BUFFER_BIT;
            }
            if (clearStencil) {
                if (stencil != this._stencilcached) {
                    this._stencilcached = stencil;
                    webGraph.rendingWebgl.clearStencil(stencil);
                }
                cleartype = cleartype = cleartype | webGraph.rendingWebgl.STENCIL_BUFFER_BIT;
            }
            webGraph.rendingWebgl.clear(cleartype);
        }
        static clearColor(color) {
            if (!MathD.color.equals(this._colorcached, color)) {
                MathD.color.copy(color, this._colorcached);
                webGraph.rendingWebgl.clearColor(color[0], color[1], color[2], color[3]);
            }
            webGraph.rendingWebgl.clear(webGraph.rendingWebgl.COLOR_BUFFER_BIT);
        }
        static clearDepth(depth) {
            if (depth != this._depthcached) {
                this._depthcached = depth;
                webGraph.rendingWebgl.clearDepth(depth);
            }
            webGraph.rendingWebgl.clear(webGraph.rendingWebgl.DEPTH_BUFFER_BIT);
        }
        static clearStencil(stencil) {
            if (stencil != this._stencilcached) {
                this._stencilcached = stencil;
                webGraph.rendingWebgl.clearStencil(stencil);
            }
            webGraph.rendingWebgl.clear(webGraph.rendingWebgl.STENCIL_BUFFER_BIT);
        }
        static drawMeshNow(mesh, matindex = 0, matrix = MathD.mat4.Identity) {
            this.bindMeshData(mesh, this._programCached);
            let subinfo = mesh.submeshs[matindex];
            if (subinfo.beUseEbo) {
            }
        }
        static bindMeshAndProgram(mesh, program) {
            this.bindProgram(program);
            this.bindMeshData(mesh, program);
        }
        static bindProgram(program) {
            if (this.BeUseProgramCache && this._programCached != program) {
                this._programCached = program;
                program.attach();
            }
            else {
                program.attach();
            }
            webGraph.renderstateMgr.applyRenderState(program.state);
        }
        static applyMatUniforms(program, AutoUniformDic, SetValueDic, defUniformDic) {
            webGraph.UniformSetter.texIndex = 0;
            if (this.BeUseUniformCache) {
                this.applyUniformsWithCache(program, AutoUniformDic, SetValueDic, defUniformDic);
            }
            else {
                this.applyUniformsDirectly(program, AutoUniformDic, SetValueDic, defUniformDic);
            }
        }
        static applyUniformsDirectly(program, AutoUniformDic, SetValueDic, defUniformDic) {
            for (let key in program.uniformDic) {
                let uniformValue;
                if (AutoUniformDic[key] != null) {
                    let func = AutoUniformDic[key];
                    uniformValue = func();
                }
                else if (SetValueDic[key] != null) {
                    uniformValue = SetValueDic[key];
                }
                let defvalue;
                if (defUniformDic[key] != null) {
                    defvalue = defUniformDic[key].value;
                }
                program.applyUniform(key, uniformValue, defvalue);
            }
        }
        static applyUniformsWithCache(program, AutoUniformDic, SetValueDic, defUniformDic) {
            for (let key in program.uniformDic) {
                let uniformValue, defvalue;
                if (AutoUniformDic[key] != null) {
                    let func = AutoUniformDic[key];
                    uniformValue = func();
                }
                else if (SetValueDic[key] != null) {
                    uniformValue = SetValueDic[key];
                }
                if (defUniformDic[key] != null) {
                    defvalue = defUniformDic[key].value;
                }
                program.applyUniformWithCache(key, uniformValue, defvalue);
            }
        }
        static bindMeshData(mesh, program, extralData) {
            program = program || this._programCached;
            if (webGraph.GLExtension.hasVAOExt && this.BeUseVao) {
                this.bindMeshDataWithVao(mesh, program);
            }
            else {
                if (this.BeUseMeshDataCache) {
                    this.bindMeshDataWithCache(mesh, program, extralData || {});
                }
                else {
                    this.bindMeshDataDirectly(mesh, program, extralData || {});
                }
            }
        }
        static bindMeshDataDirectly(mesh, program, extralData) {
            let dic = program.attribDic;
            mesh.vbo.attach();
            for (let key in dic) {
                this.applyAttribute(mesh.VertexAttDic[key] || extralData[key]);
            }
            if (mesh.ebo) {
                mesh.ebo.attach();
            }
        }
        static bindMeshDataWithCache(mesh, program, extralData) {
            let dic = program.attribDic;
            mesh.vbo.attachWithCache();
            for (let key in dic) {
                webGraph.AttributeSetter.applyAttribute(mesh.VertexAttDic[key] || extralData[key]);
            }
            if (mesh.ebo) {
                mesh.ebo.attachWithCache();
            }
        }
        static bindMeshDataWithVao(mesh, program) {
            if (mesh.vaoDic[program.ID] == null) {
                mesh.vaoDic[program.ID] = this.creatVertexArrayObject(mesh, program);
            }
            mesh.vaoDic[program.ID].attach();
        }
        static creatVertexArrayObject(mesh, program) {
            let vao = new webGraph.VAO();
            vao.attach();
            this.bindMeshDataDirectly(mesh, program);
            mesh.ebo.attach();
            return vao;
        }
        static BindeVertexData(value) {
            value.vbo.attach();
            webGraph.AttributeSetter.applyAttribute(value);
            if (value.beInstanceAtt) {
                webGraph.rendingWebgl.vertexAttribDivisor(value.location, 1);
            }
        }
        static applyAttribute(value) {
            value.vbo.attachWithCache();
            webGraph.AttributeSetter.applyAttribute(value);
            if (value.beInstanceAtt) {
                webGraph.rendingWebgl.vertexAttribDivisor(value.location, 1);
            }
        }
    }
    render.BeUseVao = false;
    render.BeUseMeshDataCache = true;
    render.BeUseUniformCache = false;
    render.BeUseProgramCache = true;
    render._viewportCached = { x: undefined, y: undefined, w: undefined, h: undefined };
    render._colorcached = MathD.color.create();
    webGraph.render = render;
})(webGraph || (webGraph = {}));
var webGraph;
(function (webGraph) {
    let ClearType;
    (function (ClearType) {
        ClearType[ClearType["COLOR"] = 16384] = "COLOR";
        ClearType[ClearType["DEPTH"] = 256] = "DEPTH";
        ClearType[ClearType["ColorAndDepth"] = 16640] = "ColorAndDepth";
    })(ClearType = webGraph.ClearType || (webGraph.ClearType = {}));
    class RenderStateMgr {
        constructor() {
            this.showface = null;
            this.Zwrite = null;
            this.Ztest = null;
            this.ztestFunc = null;
            this.stencilTest = null;
            this.enableBlend = null;
            this.blendEquation = null;
            this.src = null;
            this.dest = null;
            this.enableColorMask = false;
        }
        applyRenderState(state) {
            RenderStateMgr.currentOP = state;
            let PassOption = state;
            if (PassOption.enablaColormask != this.enableColorMask) {
                this.enableColorMask = PassOption.enablaColormask;
                if (PassOption.enablaColormask) {
                    webGraph.rendingWebgl.colorMask(PassOption.colorMask.r, PassOption.colorMask.g, PassOption.colorMask.b, PassOption.colorMask.a);
                }
                else {
                    webGraph.rendingWebgl.colorMask(true, true, true, true);
                }
            }
            else {
                if (PassOption.enablaColormask) {
                    webGraph.rendingWebgl.colorMask(PassOption.colorMask.r, PassOption.colorMask.g, PassOption.colorMask.b, PassOption.colorMask.a);
                }
            }
            if (PassOption.cullingFace != this.showface) {
                if (PassOption.cullingFace == webGraph.CullingFaceEnum.ALL) {
                    webGraph.rendingWebgl.disable(webGraph.GLConstants.CULL_FACE);
                }
                else {
                    webGraph.rendingWebgl.enable(webGraph.GLConstants.CULL_FACE);
                    if (PassOption.cullingFace == webGraph.CullingFaceEnum.CCW) {
                        webGraph.rendingWebgl.frontFace(webGraph.rendingWebgl.CCW);
                    }
                    else {
                        webGraph.rendingWebgl.frontFace(webGraph.rendingWebgl.CW);
                    }
                    webGraph.rendingWebgl.cullFace(webGraph.rendingWebgl.BACK);
                }
                this.showface = PassOption.cullingFace;
            }
            if (PassOption.stencilTest != this.stencilTest) {
                this.stencilTest = PassOption.stencilTest;
                if (PassOption.stencilTest) {
                    webGraph.rendingWebgl.enable(webGraph.rendingWebgl.STENCIL_TEST);
                    webGraph.rendingWebgl.stencilFunc(PassOption.stencilFuc, PassOption.refValue, 0xFF);
                    webGraph.rendingWebgl.stencilOp(PassOption.sFail, PassOption.sZfail, PassOption.sPass);
                }
                else {
                    webGraph.rendingWebgl.disable(webGraph.rendingWebgl.STENCIL_TEST);
                }
            }
            else {
                if (PassOption.stencilTest) {
                    webGraph.rendingWebgl.enable(webGraph.rendingWebgl.STENCIL_TEST);
                    webGraph.rendingWebgl.stencilFunc(PassOption.stencilFuc, PassOption.refValue, 0xFF);
                    webGraph.rendingWebgl.stencilOp(PassOption.sFail, PassOption.sZfail, PassOption.sPass);
                }
            }
            if (PassOption.Zwrite != this.Zwrite) {
                if (PassOption.Zwrite) {
                    webGraph.rendingWebgl.depthMask(true);
                }
                else {
                    webGraph.rendingWebgl.depthMask(false);
                }
                this.Zwrite = PassOption.Zwrite;
            }
            if (PassOption.Ztest != this.Ztest) {
                if (PassOption.Ztest) {
                    webGraph.rendingWebgl.enable(webGraph.GLConstants.DEPTH_TEST);
                    if (PassOption.ZtestMethod != this.ztestFunc) {
                        webGraph.rendingWebgl.depthFunc(PassOption.ZtestMethod);
                        this.ztestFunc = PassOption.ZtestMethod;
                    }
                }
                else {
                    webGraph.rendingWebgl.disable(webGraph.GLConstants.DEPTH_TEST);
                }
                this.Ztest = PassOption.Ztest;
            }
            else {
                if (this.Ztest) {
                    if (this.ztestFunc != PassOption.ZtestMethod) {
                        webGraph.rendingWebgl.depthFunc(PassOption.ZtestMethod);
                        this.ztestFunc = PassOption.ZtestMethod;
                    }
                }
            }
            if (PassOption.enableBlend != this.enableBlend) {
                if (PassOption.enableBlend) {
                    webGraph.rendingWebgl.enable(webGraph.GLConstants.BLEND);
                    if (PassOption.blendEquation != this.blendEquation) {
                        webGraph.rendingWebgl.blendEquation(PassOption.blendEquation);
                        this.blendEquation = PassOption.blendEquation;
                    }
                    if (PassOption.Src != this.src || PassOption.Dest != this.dest) {
                        webGraph.rendingWebgl.blendFunc(PassOption.Src, PassOption.Dest);
                        this.src = PassOption.Src;
                        this.dest = PassOption.Dest;
                    }
                }
                else {
                    webGraph.rendingWebgl.disable(webGraph.GLConstants.BLEND);
                }
                this.enableBlend = PassOption.enableBlend;
            }
            else {
                if (this.enableBlend) {
                    if (PassOption.blendEquation != this.blendEquation) {
                        webGraph.rendingWebgl.blendEquation(PassOption.blendEquation);
                        this.blendEquation = PassOption.blendEquation;
                    }
                    if (PassOption.Src != this.src || PassOption.Dest != this.dest) {
                        webGraph.rendingWebgl.blendFunc(PassOption.Src, PassOption.Dest);
                        this.src = PassOption.Src;
                        this.dest = PassOption.Dest;
                    }
                }
            }
        }
    }
    webGraph.RenderStateMgr = RenderStateMgr;
})(webGraph || (webGraph = {}));
var MathD;
(function (MathD) {
    MathD.EPSILON = 0.000001;
    function clamp(v, min = 0, max = 1) {
        if (v <= min)
            return min;
        else if (v >= max)
            return max;
        else
            return v;
    }
    MathD.clamp = clamp;
    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
    MathD.isPowerOf2 = isPowerOf2;
    function lerp(from, to, lerp, out) {
        out = (to - from) * lerp + from;
    }
    MathD.lerp = lerp;
    function random(min = 0, max = 1) {
        let bund = max - min;
        return min + bund * Math.random();
    }
    MathD.random = random;
    function numberEqual(a, b) {
        return a == b;
    }
    MathD.numberEqual = numberEqual;
    function arrayEqual(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
    MathD.arrayEqual = arrayEqual;
    function spriteAnimation(row, column, index, out) {
        var width = 1.0 / column;
        var height = 1.0 / row;
        var offsetx = width * (index % column);
        var offsety = height * row - height * (Math.floor(index / column) + 1);
        out.x = width;
        out.y = height;
        out.z = offsetx;
        out.w = offsety;
    }
    MathD.spriteAnimation = spriteAnimation;
    function numberLerp(fromV, toV, v) {
        return fromV * (1 - v) + toV * v;
    }
    MathD.numberLerp = numberLerp;
    function disposeAllRecyle() {
        MathD.color.disposeRecycledItems();
        MathD.mat2d.disposeRecycledItems();
        MathD.mat3.disposeRecycledItems();
        MathD.mat4.disposeRecycledItems();
        MathD.quat.disposeRecycledItems();
        MathD.vec2.disposeRecycledItems();
        MathD.vec3.disposeRecycledItems();
        MathD.vec4.disposeRecycledItems();
    }
    MathD.disposeAllRecyle = disposeAllRecyle;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class mat2d extends Float32Array {
        static create() {
            if (mat2d.Recycle && mat2d.Recycle.length > 0) {
                let item = mat2d.Recycle.pop();
                mat2d.identity(item);
                return item;
            }
            else {
                let item = new Float32Array(6);
                this[0] = 1;
                this[3] = 1;
                return item;
            }
        }
        static clone(from) {
            if (mat2d.Recycle.length > 0) {
                let item = mat2d.Recycle.pop();
                mat2d.copy(from, item);
                return item;
            }
            else {
                let out = new Float32Array(9);
                out[0] = from[0];
                out[1] = from[1];
                out[2] = from[2];
                out[3] = from[3];
                out[4] = from[4];
                out[5] = from[5];
                return out;
            }
        }
        static recycle(item) {
            mat2d.Recycle.push(item);
        }
        static disposeRecycledItems() {
            mat2d.Recycle.length = 0;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        }
        static identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        static invert(out, a) {
            let aa = a[0], ab = a[1], ac = a[2], ad = a[3];
            let atx = a[4], aty = a[5];
            let det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        }
        static determinant(a) {
            return a[0] * a[3] - a[1] * a[2];
        }
        static multiply(a, b, out) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            out[4] = a0 * b4 + a2 * b5 + a4;
            out[5] = a1 * b4 + a3 * b5 + a5;
            return out;
        }
        static rotate(out, a, rad) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
        static scale(out, a, v) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
            let v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
        static translate(out, a, v) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
            let v0 = v[0], v1 = v[1];
            out[0] = a0;
            out[1] = a1;
            out[2] = a2;
            out[3] = a3;
            out[4] = a0 * v0 + a2 * v1 + a4;
            out[5] = a1 * v0 + a3 * v1 + a5;
            return out;
        }
        static fromRotation(rad, out) {
            let s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = -s;
            out[3] = c;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        static getRotationing(mat, out, scale = null) {
            let outscale = scale;
            if (outscale == null) {
                outscale = MathD.vec2.create();
                this.getScaling(mat, outscale);
            }
            let cosa = mat[0] / outscale[0];
            let sina = mat[1] / outscale[1];
            if (cosa >= 0) {
                out.value = Math.asin(sina);
            }
            else {
                out.value = Math.asin(-sina) + Math.PI;
            }
            return out;
        }
        static fromScaling(v, out) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = v[1];
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        static getScaling(mat, out) {
            let m11 = mat[0];
            let m12 = mat[1];
            let m21 = mat[2];
            let m22 = mat[3];
            out[0] = Math.sqrt(m11 * m11 + m12 * m12);
            out[1] = Math.sqrt(m21 * m21 + m22 * m22);
            return out;
        }
        static fromTranslation(v, out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = v[0];
            out[5] = v[1];
            return out;
        }
        static getTranslationing(mat, out) {
            out[0] = mat[4];
            out[1] = mat[5];
            return out;
        }
        static RTS(pos, scale, rot, out) {
            var matS = mat2d.create();
            this.fromScaling(scale, matS);
            var matR = mat2d.create();
            this.fromRotation(rot, matR);
            this.multiply(matR, matS, out);
            out[4] = pos[0];
            out[5] = pos[1];
            mat2d.recycle(matS);
            mat2d.recycle(matR);
        }
        static decompose(src, pos, scale, rot) {
            this.getTranslationing(src, pos);
            this.getScaling(src, scale);
            this.getRotationing(src, rot, scale);
        }
        static str(a) {
            return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
        }
        static frob(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
        }
        static add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            return out;
        }
        static subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            return out;
        }
        static multiplyScalar(out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            return out;
        }
        static multiplyScalarAndAdd(out, a, b, scale) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            out[4] = a[4] + b[4] * scale;
            out[5] = a[5] + b[5] * scale;
            return out;
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON && Math.abs(a2 - b2) <= MathD.EPSILON && Math.abs(a3 - b3) <= MathD.EPSILON && Math.abs(a4 - b4) <= MathD.EPSILON && Math.abs(a5 - b5) <= MathD.EPSILON;
        }
    }
    mat2d.Recycle = [];
    MathD.mat2d = mat2d;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class mat3 extends Float32Array {
        static create() {
            if (mat3.Recycle && mat3.Recycle.length > 0) {
                let item = mat3.Recycle.pop();
                mat3.identity(item);
                return item;
            }
            else {
                let item = new Float32Array(9);
                this[0] = 1;
                this[4] = 1;
                this[8] = 1;
                return item;
            }
        }
        static clone(from) {
            if (mat3.Recycle.length > 0) {
                let item = mat3.Recycle.pop();
                mat3.copy(from, item);
                return item;
            }
            else {
                let out = new Float32Array(9);
                out[0] = from[0];
                out[1] = from[1];
                out[2] = from[2];
                out[3] = from[3];
                out[4] = from[4];
                out[5] = from[5];
                out[6] = from[6];
                out[7] = from[7];
                out[8] = from[8];
                return out;
            }
        }
        static recycle(item) {
            mat3.Recycle.push(item);
        }
        static disposeRecycledItems() {
            mat3.Recycle.length = 0;
        }
        static fromMat4(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[4];
            out[4] = a[5];
            out[5] = a[6];
            out[6] = a[8];
            out[7] = a[9];
            out[8] = a[10];
            return out;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        static identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        static transpose(out, a) {
            if (out === a) {
                let a01 = a[1], a02 = a[2], a12 = a[5];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a01;
                out[5] = a[7];
                out[6] = a02;
                out[7] = a12;
            }
            else {
                out[0] = a[0];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a[1];
                out[4] = a[4];
                out[5] = a[7];
                out[6] = a[2];
                out[7] = a[5];
                out[8] = a[8];
            }
            return out;
        }
        static invert(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2];
            let a10 = a[3], a11 = a[4], a12 = a[5];
            let a20 = a[6], a21 = a[7], a22 = a[8];
            let b01 = a22 * a11 - a12 * a21;
            let b11 = -a22 * a10 + a12 * a20;
            let b21 = a21 * a10 - a11 * a20;
            let det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = b01 * det;
            out[1] = (-a22 * a01 + a02 * a21) * det;
            out[2] = (a12 * a01 - a02 * a11) * det;
            out[3] = b11 * det;
            out[4] = (a22 * a00 - a02 * a20) * det;
            out[5] = (-a12 * a00 + a02 * a10) * det;
            out[6] = b21 * det;
            out[7] = (-a21 * a00 + a01 * a20) * det;
            out[8] = (a11 * a00 - a01 * a10) * det;
            return out;
        }
        static adjoint(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2];
            let a10 = a[3], a11 = a[4], a12 = a[5];
            let a20 = a[6], a21 = a[7], a22 = a[8];
            out[0] = a11 * a22 - a12 * a21;
            out[1] = a02 * a21 - a01 * a22;
            out[2] = a01 * a12 - a02 * a11;
            out[3] = a12 * a20 - a10 * a22;
            out[4] = a00 * a22 - a02 * a20;
            out[5] = a02 * a10 - a00 * a12;
            out[6] = a10 * a21 - a11 * a20;
            out[7] = a01 * a20 - a00 * a21;
            out[8] = a00 * a11 - a01 * a10;
            return out;
        }
        static determinant(a) {
            let a00 = a[0], a01 = a[1], a02 = a[2];
            let a10 = a[3], a11 = a[4], a12 = a[5];
            let a20 = a[6], a21 = a[7], a22 = a[8];
            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        }
        static multiply(out, a, b) {
            let a00 = a[0], a01 = a[1], a02 = a[2];
            let a10 = a[3], a11 = a[4], a12 = a[5];
            let a20 = a[6], a21 = a[7], a22 = a[8];
            let b00 = b[0], b01 = b[1], b02 = b[2];
            let b10 = b[3], b11 = b[4], b12 = b[5];
            let b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return out;
        }
        static translate(out, a, v) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a10;
            out[4] = a11;
            out[5] = a12;
            out[6] = x * a00 + y * a10 + a20;
            out[7] = x * a01 + y * a11 + a21;
            out[8] = x * a02 + y * a12 + a22;
            return out;
        }
        static rotate(out, a, rad) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c * a00 + s * a10;
            out[1] = c * a01 + s * a11;
            out[2] = c * a02 + s * a12;
            out[3] = c * a10 - s * a00;
            out[4] = c * a11 - s * a01;
            out[5] = c * a12 - s * a02;
            out[6] = a20;
            out[7] = a21;
            out[8] = a22;
            return out;
        }
        ;
        static scale(out, a, v) {
            let x = v[0], y = v[1];
            out[0] = x * a[0];
            out[1] = x * a[1];
            out[2] = x * a[2];
            out[3] = y * a[3];
            out[4] = y * a[4];
            out[5] = y * a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        static fromTranslation(out, v) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = v[0];
            out[7] = v[1];
            out[8] = 1;
            return out;
        }
        static fromRotation(out, rad) {
            let s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = 0;
            out[3] = -s;
            out[4] = c;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        static fromScaling(out, v) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = v[1];
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        static fromMat2d(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = 0;
            out[3] = a[2];
            out[4] = a[3];
            out[5] = 0;
            out[6] = a[4];
            out[7] = a[5];
            out[8] = 1;
            return out;
        }
        static fromQuat(out, q) {
            let x = q[0], y = q[1], z = q[2], w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            let xx = x * x2;
            let yx = y * x2;
            let yy = y * y2;
            let zx = z * x2;
            let zy = z * y2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            out[0] = 1 - yy - zz;
            out[3] = yx - wz;
            out[6] = zx + wy;
            out[1] = yx + wz;
            out[4] = 1 - xx - zz;
            out[7] = zy - wx;
            out[2] = zx - wy;
            out[5] = zy + wx;
            out[8] = 1 - xx - yy;
            return out;
        }
        static normalFromMat4(out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b00 = a00 * a11 - a01 * a10;
            let b01 = a00 * a12 - a02 * a10;
            let b02 = a00 * a13 - a03 * a10;
            let b03 = a01 * a12 - a02 * a11;
            let b04 = a01 * a13 - a03 * a11;
            let b05 = a02 * a13 - a03 * a12;
            let b06 = a20 * a31 - a21 * a30;
            let b07 = a20 * a32 - a22 * a30;
            let b08 = a20 * a33 - a23 * a30;
            let b09 = a21 * a32 - a22 * a31;
            let b10 = a21 * a33 - a23 * a31;
            let b11 = a22 * a33 - a23 * a32;
            let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            return out;
        }
        static projection(out, width, height) {
            out[0] = 2 / width;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = -2 / height;
            out[5] = 0;
            out[6] = -1;
            out[7] = 1;
            out[8] = 1;
            return out;
        }
        static str(a) {
            return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
        }
        static frob(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
        }
        static add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            return out;
        }
        static subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            out[6] = a[6] - b[6];
            out[7] = a[7] - b[7];
            out[8] = a[8] - b[8];
            return out;
        }
        static multiplyScalar(out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            out[6] = a[6] * b;
            out[7] = a[7] * b;
            out[8] = a[8] * b;
            return out;
        }
        static multiplyScalarAndAdd(out, a, b, scale) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            out[4] = a[4] + b[4] * scale;
            out[5] = a[5] + b[5] * scale;
            out[6] = a[6] + b[6] * scale;
            out[7] = a[7] + b[7] * scale;
            out[8] = a[8] + b[8] * scale;
            return out;
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON && Math.abs(a2 - b2) <= MathD.EPSILON && Math.abs(a3 - b3) <= MathD.EPSILON && Math.abs(a4 - b4) <= MathD.EPSILON && Math.abs(a5 - b5) <= MathD.EPSILON && Math.abs(a6 - b6) <= MathD.EPSILON && Math.abs(a7 - b7) <= MathD.EPSILON && Math.abs(a8 - b8) <= MathD.EPSILON;
        }
    }
    mat3.Recycle = [];
    MathD.mat3 = mat3;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class mat4 extends Float32Array {
        static create() {
            if (mat4.Recycle && mat4.Recycle.length > 0) {
                let item = mat4.Recycle.pop();
                mat4.identity(item);
                return item;
            }
            else {
                let item = new Float32Array(16);
                this[0] = 1;
                this[5] = 1;
                this[10] = 1;
                this[15] = 1;
                return item;
            }
        }
        static clone(from) {
            if (mat4.Recycle.length > 0) {
                let item = mat4.Recycle.pop();
                mat4.copy(from, item);
                return item;
            }
            else {
                let out = new Float32Array(16);
                out[0] = from[0];
                out[1] = from[1];
                out[2] = from[2];
                out[3] = from[3];
                out[4] = from[4];
                out[5] = from[5];
                out[6] = from[6];
                out[7] = from[7];
                out[8] = from[8];
                out[9] = from[9];
                out[10] = from[10];
                out[11] = from[11];
                out[12] = from[12];
                out[13] = from[13];
                out[14] = from[14];
                out[15] = from[15];
                return out;
            }
        }
        static recycle(item) {
            mat4.Recycle.push(item);
        }
        static disposeRecycledItems() {
            mat4.Recycle.length = 0;
        }
        static copy(src, out) {
            out[0] = src[0];
            out[1] = src[1];
            out[2] = src[2];
            out[3] = src[3];
            out[4] = src[4];
            out[5] = src[5];
            out[6] = src[6];
            out[7] = src[7];
            out[8] = src[8];
            out[9] = src[9];
            out[10] = src[10];
            out[11] = src[11];
            out[12] = src[12];
            out[13] = src[13];
            out[14] = src[14];
            out[15] = src[15];
            return out;
        }
        static identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static transpose(a, out) {
            if (out === a) {
                let a01 = a[1], a02 = a[2], a03 = a[3];
                let a12 = a[6], a13 = a[7];
                let a23 = a[11];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            }
            else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }
            return out;
        }
        static invert(a, out) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b00 = a00 * a11 - a01 * a10;
            let b01 = a00 * a12 - a02 * a10;
            let b02 = a00 * a13 - a03 * a10;
            let b03 = a01 * a12 - a02 * a11;
            let b04 = a01 * a13 - a03 * a11;
            let b05 = a02 * a13 - a03 * a12;
            let b06 = a20 * a31 - a21 * a30;
            let b07 = a20 * a32 - a22 * a30;
            let b08 = a20 * a33 - a23 * a30;
            let b09 = a21 * a32 - a22 * a31;
            let b10 = a21 * a33 - a23 * a31;
            let b11 = a22 * a33 - a23 * a32;
            let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            return out;
        }
        static adjoint(a, out) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
            out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
            out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
            out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
            out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
            out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
            out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
            out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
            out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
            out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
            out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
            out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
            out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
            out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
            out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
            out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
            return out;
        }
        static determinant(a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b00 = a00 * a11 - a01 * a10;
            let b01 = a00 * a12 - a02 * a10;
            let b02 = a00 * a13 - a03 * a10;
            let b03 = a01 * a12 - a02 * a11;
            let b04 = a01 * a13 - a03 * a11;
            let b05 = a02 * a13 - a03 * a12;
            let b06 = a20 * a31 - a21 * a30;
            let b07 = a20 * a32 - a22 * a30;
            let b08 = a20 * a33 - a23 * a30;
            let b09 = a21 * a32 - a22 * a31;
            let b10 = a21 * a33 - a23 * a31;
            let b11 = a22 * a33 - a23 * a32;
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        }
        static multiply(lhs, rhs, out) {
            let a00 = lhs[0], a01 = lhs[1], a02 = lhs[2], a03 = lhs[3];
            let a10 = lhs[4], a11 = lhs[5], a12 = lhs[6], a13 = lhs[7];
            let a20 = lhs[8], a21 = lhs[9], a22 = lhs[10], a23 = lhs[11];
            let a30 = lhs[12], a31 = lhs[13], a32 = lhs[14], a33 = lhs[15];
            let b0 = rhs[0], b1 = rhs[1], b2 = rhs[2], b3 = rhs[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = rhs[4];
            b1 = rhs[5];
            b2 = rhs[6];
            b3 = rhs[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = rhs[8];
            b1 = rhs[9];
            b2 = rhs[10];
            b3 = rhs[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = rhs[12];
            b1 = rhs[13];
            b2 = rhs[14];
            b3 = rhs[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        }
        static translate(a, v, out) {
            let x = v[0], y = v[1], z = v[2];
            let a00 = void 0, a01 = void 0, a02 = void 0, a03 = void 0;
            let a10 = void 0, a11 = void 0, a12 = void 0, a13 = void 0;
            let a20 = void 0, a21 = void 0, a22 = void 0, a23 = void 0;
            if (a === out) {
                out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            }
            else {
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a20;
                out[9] = a21;
                out[10] = a22;
                out[11] = a23;
                out[12] = a00 * x + a10 * y + a20 * z + a[12];
                out[13] = a01 * x + a11 * y + a21 * z + a[13];
                out[14] = a02 * x + a12 * y + a22 * z + a[14];
                out[15] = a03 * x + a13 * y + a23 * z + a[15];
            }
            return out;
        }
        static scale(a, v, out) {
            let x = v[0], y = v[1], z = v[2];
            out[0] = a[0] * x;
            out[1] = a[1] * x;
            out[2] = a[2] * x;
            out[3] = a[3] * x;
            out[4] = a[4] * y;
            out[5] = a[5] * y;
            out[6] = a[6] * y;
            out[7] = a[7] * y;
            out[8] = a[8] * z;
            out[9] = a[9] * z;
            out[10] = a[10] * z;
            out[11] = a[11] * z;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        static rotate(a, rad, axis, out) {
            let x = axis[0], y = axis[1], z = axis[2];
            let len = Math.sqrt(x * x + y * y + z * z);
            let s = void 0, c = void 0, t = void 0;
            let a00 = void 0, a01 = void 0, a02 = void 0, a03 = void 0;
            let a10 = void 0, a11 = void 0, a12 = void 0, a13 = void 0;
            let a20 = void 0, a21 = void 0, a22 = void 0, a23 = void 0;
            let b00 = void 0, b01 = void 0, b02 = void 0;
            let b10 = void 0, b11 = void 0, b12 = void 0;
            let b20 = void 0, b21 = void 0, b22 = void 0;
            if (Math.abs(len) < 0.000001) {
                return null;
            }
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;
            a00 = a[0];
            a01 = a[1];
            a02 = a[2];
            a03 = a[3];
            a10 = a[4];
            a11 = a[5];
            a12 = a[6];
            a13 = a[7];
            a20 = a[8];
            a21 = a[9];
            a22 = a[10];
            a23 = a[11];
            b00 = x * x * t + c;
            b01 = y * x * t + z * s;
            b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;
            b11 = y * y * t + c;
            b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;
            b21 = y * z * t - x * s;
            b22 = z * z * t + c;
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;
            if (a !== out) {
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            return out;
        }
        static rotateX(a, rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a10 = a[4];
            let a11 = a[5];
            let a12 = a[6];
            let a13 = a[7];
            let a20 = a[8];
            let a21 = a[9];
            let a22 = a[10];
            let a23 = a[11];
            if (a !== out) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
        }
        static rotateY(a, rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a00 = a[0];
            let a01 = a[1];
            let a02 = a[2];
            let a03 = a[3];
            let a20 = a[8];
            let a21 = a[9];
            let a22 = a[10];
            let a23 = a[11];
            if (a !== out) {
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
        }
        static rotateZ(a, rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            let a00 = a[0];
            let a01 = a[1];
            let a02 = a[2];
            let a03 = a[3];
            let a10 = a[4];
            let a11 = a[5];
            let a12 = a[6];
            let a13 = a[7];
            if (a !== out) {
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            out[0] = a00 * c + a10 * s;
            out[1] = a01 * c + a11 * s;
            out[2] = a02 * c + a12 * s;
            out[3] = a03 * c + a13 * s;
            out[4] = a10 * c - a00 * s;
            out[5] = a11 * c - a01 * s;
            out[6] = a12 * c - a02 * s;
            out[7] = a13 * c - a03 * s;
            return out;
        }
        static fromTranslation(v, out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }
        static fromScaling(v, out) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = v[1];
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = v[2];
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static fromRotation(rad, axis, out) {
            let x = axis[0], y = axis[1], z = axis[2];
            let len = Math.sqrt(x * x + y * y + z * z);
            let s = void 0, c = void 0, t = void 0;
            if (Math.abs(len) < 0.000001) {
                return null;
            }
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;
            out[0] = x * x * t + c;
            out[1] = y * x * t + z * s;
            out[2] = z * x * t - y * s;
            out[3] = 0;
            out[4] = x * y * t - z * s;
            out[5] = y * y * t + c;
            out[6] = z * y * t + x * s;
            out[7] = 0;
            out[8] = x * z * t + y * s;
            out[9] = y * z * t - x * s;
            out[10] = z * z * t + c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static fromXRotation(rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = c;
            out[6] = s;
            out[7] = 0;
            out[8] = 0;
            out[9] = -s;
            out[10] = c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static fromYRotation(rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            out[0] = c;
            out[1] = 0;
            out[2] = -s;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = s;
            out[9] = 0;
            out[10] = c;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static fromZRotation(rad, out) {
            let s = Math.sin(rad);
            let c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = 0;
            out[3] = 0;
            out[4] = -s;
            out[5] = c;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static getTranslationing(mat, out) {
            out[0] = mat[12];
            out[1] = mat[13];
            out[2] = mat[14];
            return out;
        }
        static getScaling(mat, out) {
            let m11 = mat[0];
            let m12 = mat[1];
            let m13 = mat[2];
            let m21 = mat[4];
            let m22 = mat[5];
            let m23 = mat[6];
            let m31 = mat[8];
            let m32 = mat[9];
            let m33 = mat[10];
            out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
            out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
            out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
            return out;
        }
        static getRotation(mat, out) {
            let trace = mat[0] + mat[5] + mat[10];
            let S = 0;
            if (trace > 0) {
                S = Math.sqrt(trace + 1.0) * 2;
                out[3] = 0.25 * S;
                out[0] = (mat[6] - mat[9]) / S;
                out[1] = (mat[8] - mat[2]) / S;
                out[2] = (mat[1] - mat[4]) / S;
            }
            else if (mat[0] > mat[5] && mat[0] > mat[10]) {
                S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
                out[3] = (mat[6] - mat[9]) / S;
                out[0] = 0.25 * S;
                out[1] = (mat[1] + mat[4]) / S;
                out[2] = (mat[8] + mat[2]) / S;
            }
            else if (mat[5] > mat[10]) {
                S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
                out[3] = (mat[8] - mat[2]) / S;
                out[0] = (mat[1] + mat[4]) / S;
                out[1] = 0.25 * S;
                out[2] = (mat[6] + mat[9]) / S;
            }
            else {
                S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
                out[3] = (mat[1] - mat[4]) / S;
                out[0] = (mat[8] + mat[2]) / S;
                out[1] = (mat[6] + mat[9]) / S;
                out[2] = 0.25 * S;
            }
            return out;
        }
        static fromRotationTranslationScaleOrigin(q, v, s, o, out) {
            let x = q[0], y = q[1], z = q[2], w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            let sx = s[0];
            let sy = s[1];
            let sz = s[2];
            let ox = o[0];
            let oy = o[1];
            let oz = o[2];
            out[0] = (1 - (yy + zz)) * sx;
            out[1] = (xy + wz) * sx;
            out[2] = (xz - wy) * sx;
            out[3] = 0;
            out[4] = (xy - wz) * sy;
            out[5] = (1 - (xx + zz)) * sy;
            out[6] = (yz + wx) * sy;
            out[7] = 0;
            out[8] = (xz + wy) * sz;
            out[9] = (yz - wx) * sz;
            out[10] = (1 - (xx + yy)) * sz;
            out[11] = 0;
            out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
            out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
            out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
            out[15] = 1;
            return out;
        }
        static fromQuat(q, out) {
            let x = q[0], y = q[1], z = q[2], w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            let xx = x * x2;
            let yx = y * x2;
            let yy = y * y2;
            let zx = z * x2;
            let zy = z * y2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            out[0] = 1 - yy - zz;
            out[1] = yx + wz;
            out[2] = zx - wy;
            out[3] = 0;
            out[4] = yx - wz;
            out[5] = 1 - xx - zz;
            out[6] = zy + wx;
            out[7] = 0;
            out[8] = zx + wy;
            out[9] = zy - wx;
            out[10] = 1 - xx - yy;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        static frustum(left, right, bottom, top, near, far, out) {
            let rl = 1 / (right - left);
            let tb = 1 / (top - bottom);
            let nf = 1 / (near - far);
            out[0] = near * 2 * rl;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = near * 2 * tb;
            out[6] = 0;
            out[7] = 0;
            out[8] = (right + left) * rl;
            out[9] = (top + bottom) * tb;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = far * near * 2 * nf;
            out[15] = 0;
            return out;
        }
        static lookAt(eye, center, up, out) {
            let x0 = void 0, x1 = void 0, x2 = void 0, y0 = void 0, y1 = void 0, y2 = void 0, z0 = void 0, z1 = void 0, z2 = void 0, len = void 0;
            let eyex = eye[0];
            let eyey = eye[1];
            let eyez = eye[2];
            let upx = up[0];
            let upy = up[1];
            let upz = up[2];
            let centerx = center[0];
            let centery = center[1];
            let centerz = center[2];
            if (Math.abs(eyex - centerx) < 0.000001 && Math.abs(eyey - centery) < 0.000001 && Math.abs(eyez - centerz) < 0.000001) {
                return mat4.identity(out);
            }
            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            }
            else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            }
            else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }
            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            out[15] = 1;
            return out;
        }
        static targetTo(eye, target, up, out) {
            let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
            let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
            let len = z0 * z0 + z1 * z1 + z2 * z2;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                z0 *= len;
                z1 *= len;
                z2 *= len;
            }
            let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
            out[0] = x0;
            out[1] = x1;
            out[2] = x2;
            out[3] = 0;
            out[4] = z1 * x2 - z2 * x1;
            out[5] = z2 * x0 - z0 * x2;
            out[6] = z0 * x1 - z1 * x0;
            out[7] = 0;
            out[8] = z0;
            out[9] = z1;
            out[10] = z2;
            out[11] = 0;
            out[12] = eyex;
            out[13] = eyey;
            out[14] = eyez;
            out[15] = 1;
            return out;
        }
        ;
        static str(a) {
            return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
        }
        static frob(a) {
            return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
        }
        static add(a, b, out) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            out[9] = a[9] + b[9];
            out[10] = a[10] + b[10];
            out[11] = a[11] + b[11];
            out[12] = a[12] + b[12];
            out[13] = a[13] + b[13];
            out[14] = a[14] + b[14];
            out[15] = a[15] + b[15];
            return out;
        }
        static subtract(lhs, rhs, out) {
            out[0] = lhs[0] - rhs[0];
            out[1] = lhs[1] - rhs[1];
            out[2] = lhs[2] - rhs[2];
            out[3] = lhs[3] - rhs[3];
            out[4] = lhs[4] - rhs[4];
            out[5] = lhs[5] - rhs[5];
            out[6] = lhs[6] - rhs[6];
            out[7] = lhs[7] - rhs[7];
            out[8] = lhs[8] - rhs[8];
            out[9] = lhs[9] - rhs[9];
            out[10] = lhs[10] - rhs[10];
            out[11] = lhs[11] - rhs[11];
            out[12] = lhs[12] - rhs[12];
            out[13] = lhs[13] - rhs[13];
            out[14] = lhs[14] - rhs[14];
            out[15] = lhs[15] - rhs[15];
            return out;
        }
        static multiplyScalar(a, b, out) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            out[6] = a[6] * b;
            out[7] = a[7] * b;
            out[8] = a[8] * b;
            out[9] = a[9] * b;
            out[10] = a[10] * b;
            out[11] = a[11] * b;
            out[12] = a[12] * b;
            out[13] = a[13] * b;
            out[14] = a[14] * b;
            out[15] = a[15] * b;
            return out;
        }
        static multiplyScalarAndAdd(a, b, scale, out) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            out[4] = a[4] + b[4] * scale;
            out[5] = a[5] + b[5] * scale;
            out[6] = a[6] + b[6] * scale;
            out[7] = a[7] + b[7] * scale;
            out[8] = a[8] + b[8] * scale;
            out[9] = a[9] + b[9] * scale;
            out[10] = a[10] + b[10] * scale;
            out[11] = a[11] + b[11] * scale;
            out[12] = a[12] + b[12] * scale;
            out[13] = a[13] + b[13] * scale;
            out[14] = a[14] + b[14] * scale;
            out[15] = a[15] + b[15] * scale;
            return out;
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
            let a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
            let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            let b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
            let b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
            let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON && Math.abs(a2 - b2) <= MathD.EPSILON && Math.abs(a3 - b3) <= MathD.EPSILON && Math.abs(a4 - b4) <= MathD.EPSILON && Math.abs(a5 - b5) <= MathD.EPSILON && Math.abs(a6 - b6) <= MathD.EPSILON && Math.abs(a7 - b7) <= MathD.EPSILON && Math.abs(a8 - b8) <= MathD.EPSILON && Math.abs(a9 - b9) <= MathD.EPSILON && Math.abs(a10 - b10) <= MathD.EPSILON && Math.abs(a11 - b11) <= MathD.EPSILON && Math.abs(a12 - b12) <= MathD.EPSILON && Math.abs(a13 - b13) <= MathD.EPSILON && Math.abs(a14 - b14) <= MathD.EPSILON && Math.abs(a15 - b15) <= MathD.EPSILON;
        }
        static transformPoint(vector, mat, out) {
            let x = vector[0], y = vector[1], z = vector[2];
            let w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
            w = w || 1.0;
            out[0] = (mat[0] * x + mat[4] * y + mat[8] * z + mat[12]) / w;
            out[1] = (mat[1] * x + mat[5] * y + mat[9] * z + mat[13]) / w;
            out[2] = (mat[2] * x + mat[6] * y + mat[10] * z + mat[14]) / w;
            return out;
        }
        static transformVector3(vector, mat, out) {
            let x = vector[0], y = vector[1], z = vector[2];
            out[0] = mat[0] * x + mat[4] * y + mat[8] * z;
            out[1] = mat[1] * x + mat[5] * y + mat[9] * z;
            out[2] = mat[2] * x + mat[6] * y + mat[10] * z;
            return out;
        }
        static project_PerspectiveLH(fovy, aspect, near, far, out) {
            let f = 1.0 / Math.tan(fovy / 2);
            let nf = 1 / (near - far);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = 2 * far * near * nf;
            out[15] = 0;
            return out;
        }
        static project_OrthoLH(width, height, near, far, out) {
            let lr = -1 / width;
            let bt = -1 / height;
            let nf = 1 / (near - far);
            out[0] = -2 * lr;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = -2 * bt;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = (far + near) * nf;
            out[15] = 1;
            return out;
        }
        static RTS(pos, scale, rot, out) {
            let x = rot[0], y = rot[1], z = rot[2], w = rot[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            let sx = scale[0];
            let sy = scale[1];
            let sz = scale[2];
            out[0] = (1 - (yy + zz)) * sx;
            out[1] = (xy + wz) * sx;
            out[2] = (xz - wy) * sx;
            out[3] = 0;
            out[4] = (xy - wz) * sy;
            out[5] = (1 - (xx + zz)) * sy;
            out[6] = (yz + wx) * sy;
            out[7] = 0;
            out[8] = (xz + wy) * sz;
            out[9] = (yz - wx) * sz;
            out[10] = (1 - (xx + yy)) * sz;
            out[11] = 0;
            out[12] = pos[0];
            out[13] = pos[1];
            out[14] = pos[2];
            out[15] = 1;
            return out;
        }
        static RT(q, v, out) {
            let x = q[0], y = q[1], z = q[2], w = q[3];
            let x2 = x + x;
            let y2 = y + y;
            let z2 = z + z;
            let xx = x * x2;
            let xy = x * y2;
            let xz = x * z2;
            let yy = y * y2;
            let yz = y * z2;
            let zz = z * z2;
            let wx = w * x2;
            let wy = w * y2;
            let wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }
        static decompose(src, scale, rotation, translation) {
            mat4.getTranslationing(src, translation);
            mat4.getScaling(src, scale);
            mat4.getRotationing(src, rotation, scale);
        }
        static getRotationing(matrix, result, scale = null) {
            let scalex = 1, scaley = 1, scalez = 1;
            if (scale == null) {
                scalex = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1] + matrix[2] * matrix[2]);
                scaley = Math.sqrt(matrix[4] * matrix[4] + matrix[5] * matrix[5] + matrix[6] * matrix[6]);
                scalez = Math.sqrt(matrix[8] * matrix[8] + matrix[9] * matrix[9] + matrix[10] * matrix[10]);
            }
            else {
                scalex = scale[0];
                scaley = scale[1];
                scalez = scale[2];
            }
            if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
                result[0] = 0;
                result[1] = 0;
                result[2] = 0;
                result[3] = 1;
                return;
            }
            let m11 = matrix[0] / scalex, m12 = matrix[4] / scaley, m13 = matrix[8] / scalez;
            let m21 = matrix[1] / scalex, m22 = matrix[5] / scaley, m23 = matrix[9] / scalez;
            let m31 = matrix[2] / scalex, m32 = matrix[6] / scaley, m33 = matrix[10] / scalez;
            let trace = m11 + m22 + m33;
            let s;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                result[3] = 0.25 / s;
                result[0] = (m32 - m23) * s;
                result[1] = (m13 - m31) * s;
                result[2] = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                result[3] = (m32 - m23) / s;
                result[0] = 0.25 * s;
                result[1] = (m12 + m21) / s;
                result[2] = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                result[3] = (m13 - m31) / s;
                result[0] = (m12 + m21) / s;
                result[1] = 0.25 * s;
                result[2] = (m23 + m32) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                result[3] = (m21 - m12) / s;
                result[0] = (m13 + m31) / s;
                result[1] = (m23 + m32) / s;
                result[2] = 0.25 * s;
            }
        }
    }
    mat4.Recycle = [];
    mat4.Identity = mat4.create();
    MathD.mat4 = mat4;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class quat extends Float32Array {
        constructor() {
            super(4);
            this[3] = 1;
        }
        get x() {
            return this[0];
        }
        set x(value) {
            this[0] = value;
        }
        get y() {
            return this[1];
        }
        set y(value) {
            this[1] = value;
        }
        get z() {
            return this[2];
        }
        set z(value) {
            this[2] = value;
        }
        get w() {
            return this[3];
        }
        set w(value) {
            this[3] = value;
        }
        static create() {
            if (quat.Recycle && quat.Recycle.length > 0) {
                let item = quat.Recycle.pop();
                quat.identity(item);
                return item;
            }
            else {
                let item = new quat();
                return item;
            }
        }
        static clone(from) {
            if (quat.Recycle.length > 0) {
                let item = quat.Recycle.pop();
                quat.copy(from, item);
                return item;
            }
            else {
                let item = new quat();
                item[0] = from[0];
                item[1] = from[1];
                item[2] = from[2];
                item[3] = from[3];
                return item;
            }
        }
        static recycle(item) {
            quat.Recycle.push(item);
        }
        static disposeRecycledItems() {
            quat.Recycle.length = 0;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        static identity(out) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }
        static getAxisAngle(out_axis, q) {
            let rad = Math.acos(q[3]) * 2.0;
            let s = Math.sin(rad / 2.0);
            if (s != 0.0) {
                out_axis[0] = q[0] / s;
                out_axis[1] = q[1] / s;
                out_axis[2] = q[2] / s;
            }
            else {
                out_axis[0] = 1;
                out_axis[1] = 0;
                out_axis[2] = 0;
            }
            return rad;
        }
        static add(a, b, out) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        }
        static multiply(a, b, out) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bx = b[0], by = b[1], bz = b[2], bw = b[3];
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        }
        static scale(a, b, out) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        }
        static length_(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        static squaredLength(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return x * x + y * y + z * z + w * w;
        }
        static normalize(src, out) {
            let x = src[0];
            let y = src[1];
            let z = src[2];
            let w = src[3];
            let len = x * x + y * y + z * z + w * w;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = x * len;
                out[1] = y * len;
                out[2] = z * len;
                out[3] = w * len;
            }
            return out;
        }
        static dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
        static lerp(a, b, t, out) {
            let ax = a[0];
            let ay = a[1];
            let az = a[2];
            let aw = a[3];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            out[3] = aw + t * (b[3] - aw);
            return out;
        }
        static slerp(a, b, t, out) {
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bx = b[0], by = b[1], bz = b[2], bw = b[3];
            let omega = void 0, cosom = void 0, sinom = void 0, scale0 = void 0, scale1 = void 0;
            cosom = ax * bx + ay * by + az * bz + aw * bw;
            if (cosom < 0.0) {
                cosom = -cosom;
                bx = -bx;
                by = -by;
                bz = -bz;
                bw = -bw;
            }
            if (1.0 - cosom > 0.000001) {
                omega = Math.acos(cosom);
                sinom = Math.sin(omega);
                scale0 = Math.sin((1.0 - t) * omega) / sinom;
                scale1 = Math.sin(t * omega) / sinom;
            }
            else {
                scale0 = 1.0 - t;
                scale1 = t;
            }
            out[0] = scale0 * ax + scale1 * bx;
            out[1] = scale0 * ay + scale1 * by;
            out[2] = scale0 * az + scale1 * bz;
            out[3] = scale0 * aw + scale1 * bw;
            return out;
        }
        static sqlerp(a, b, c, d, t, out) {
            let temp1 = quat.create();
            let temp2 = quat.create();
            quat.slerp(a, d, t, temp1);
            quat.slerp(b, c, t, temp2);
            quat.slerp(temp1, temp2, 2 * t * (1 - t), out);
            return out;
        }
        static inverse(a, out) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
            let invDot = dot ? 1.0 / dot : 0;
            out[0] = -a0 * invDot;
            out[1] = -a1 * invDot;
            out[2] = -a2 * invDot;
            out[3] = a3 * invDot;
            return out;
        }
        static conjugate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a[3];
            return out;
        }
        static str(a) {
            return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }
        static rotateX(a, rad, out) {
            rad *= 0.5;
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bx = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw + aw * bx;
            out[1] = ay * bw + az * bx;
            out[2] = az * bw - ay * bx;
            out[3] = aw * bw - ax * bx;
            return out;
        }
        static rotateY(a, rad, out) {
            rad *= 0.5;
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let by = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw - az * by;
            out[1] = ay * bw + aw * by;
            out[2] = az * bw + ax * by;
            out[3] = aw * bw - ay * by;
            return out;
        }
        static rotateZ(a, rad, out) {
            rad *= 0.5;
            let ax = a[0], ay = a[1], az = a[2], aw = a[3];
            let bz = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw + ay * bz;
            out[1] = ay * bw - ax * bz;
            out[2] = az * bw + aw * bz;
            out[3] = aw * bw - az * bz;
            return out;
        }
        static fromMat3(m, out) {
            let fTrace = m[0] + m[4] + m[8];
            let fRoot = void 0;
            if (fTrace > 0.0) {
                fRoot = Math.sqrt(fTrace + 1.0);
                out[3] = 0.5 * fRoot;
                fRoot = 0.5 / fRoot;
                out[0] = (m[5] - m[7]) * fRoot;
                out[1] = (m[6] - m[2]) * fRoot;
                out[2] = (m[1] - m[3]) * fRoot;
            }
            else {
                let i = 0;
                if (m[4] > m[0])
                    i = 1;
                if (m[8] > m[i * 3 + i])
                    i = 2;
                let j = (i + 1) % 3;
                let k = (i + 2) % 3;
                fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
                out[i] = 0.5 * fRoot;
                fRoot = 0.5 / fRoot;
                out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
                out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
                out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
            }
            return out;
        }
        static setAxes(view, right, up, out) {
            let matr = MathD.mat3.create();
            matr[0] = right[0];
            matr[3] = right[1];
            matr[6] = right[2];
            matr[1] = up[0];
            matr[4] = up[1];
            matr[7] = up[2];
            matr[2] = -view[0];
            matr[5] = -view[1];
            matr[8] = -view[2];
            quat.fromMat3(matr, out);
            matr = null;
            return quat.normalize(out, out);
        }
        static calculateW(a, out) {
            let x = a[0], y = a[1], z = a[2];
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
            return out;
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        }
        static fromYawPitchRoll(yaw, pitch, roll, result) {
            let halfRoll = roll * 0.5;
            let halfPitch = pitch * 0.5;
            let halfYaw = yaw * 0.5;
            let sinRoll = Math.sin(halfRoll);
            let cosRoll = Math.cos(halfRoll);
            let sinPitch = Math.sin(halfPitch);
            let cosPitch = Math.cos(halfPitch);
            let sinYaw = Math.sin(halfYaw);
            let cosYaw = Math.cos(halfYaw);
            result[0] = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
            result[1] = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
            result[2] = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
            result[3] = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
        }
        static FromEuler(x, y, z, out) {
            x *= 0.5 * Math.PI / 180;
            y *= 0.5 * Math.PI / 180;
            z *= 0.5 * Math.PI / 180;
            let cosX = Math.cos(x), sinX = Math.sin(x);
            let cosY = Math.cos(y), sinY = Math.sin(y);
            let cosZ = Math.cos(z), sinZ = Math.sin(z);
            out[0] = sinX * cosY * cosZ + cosX * sinY * sinZ;
            out[1] = cosX * sinY * cosZ - sinX * cosY * sinZ;
            out[2] = cosX * cosY * sinZ - sinX * sinY * cosZ;
            out[3] = cosX * cosY * cosZ + sinX * sinY * sinZ;
            this.normalize(out, out);
            return out;
        }
        static ToEuler(src, out) {
            let x = src[0], y = src[1], z = src[2], w = src[3];
            let temp = 2.0 * (w * x - y * z);
            temp = MathD.clamp(temp, -1.0, 1.0);
            out[0] = Math.asin(temp);
            out[1] = Math.atan2(2.0 * (w * y + z * x), 1.0 - 2.0 * (y * y + x * x));
            out[2] = Math.atan2(2.0 * (w * z + y * x), 1.0 - 2.0 * (x * x + z * z));
            out[0] /= Math.PI / 180;
            out[1] /= Math.PI / 180;
            out[2] /= Math.PI / 180;
        }
        static AxisAngle(axis, rad, out) {
            rad = rad * 0.5;
            let s = Math.sin(rad);
            out[0] = s * axis[0];
            out[1] = s * axis[1];
            out[2] = s * axis[2];
            out[3] = Math.cos(rad);
            return out;
        }
        static rotationTo(from, to, out) {
            let tmpvec3 = MathD.vec3.create();
            let xUnitVec3 = MathD.vec3.RIGHT;
            let yUnitVec3 = MathD.vec3.UP;
            let dot = MathD.vec3.dot(from, to);
            if (dot < -0.999999) {
                MathD.vec3.cross(tmpvec3, xUnitVec3, from);
                if (MathD.vec3.magnitude(tmpvec3) < 0.000001)
                    MathD.vec3.cross(tmpvec3, yUnitVec3, from);
                MathD.vec3.normalize(tmpvec3, tmpvec3);
                quat.AxisAngle(tmpvec3, Math.PI, out);
                return out;
            }
            else if (dot > 0.999999) {
                out[0] = 0;
                out[1] = 0;
                out[2] = 0;
                out[3] = 1;
                return out;
            }
            else {
                MathD.vec3.cross(tmpvec3, from, to);
                out[0] = tmpvec3[0];
                out[1] = tmpvec3[1];
                out[2] = tmpvec3[2];
                out[3] = 1 + dot;
                return quat.normalize(out, out);
            }
        }
        static myLookRotation(dir, out, up = MathD.vec3.UP) {
            if (MathD.vec3.exactEquals(dir, MathD.vec3.ZERO)) {
                console.log("Zero direction in MyLookRotation");
                return quat.norot;
            }
            if (!MathD.vec3.exactEquals(dir, up)) {
                let tempv = MathD.vec3.create();
                MathD.vec3.scale(up, MathD.vec3.dot(up, dir), tempv);
                MathD.vec3.subtract(dir, tempv, tempv);
                let qu = quat.create();
                this.rotationTo(MathD.vec3.FORWARD, tempv, qu);
                let qu2 = quat.create();
                this.rotationTo(tempv, dir, qu2);
                quat.multiply(qu, qu2, out);
            }
            else {
                this.rotationTo(MathD.vec3.FORWARD, dir, out);
            }
        }
        static LookRotation(lookAt, up = MathD.vec3.UP) {
            let forward = MathD.vec3.create();
            MathD.vec3.normalize(lookAt, forward);
            let right = MathD.vec3.create();
            MathD.vec3.cross(up, forward, right);
        }
        static transformVector(src, vector, out) {
            var x1, y1, z1, w1;
            var x2 = vector[0], y2 = vector[1], z2 = vector[2];
            w1 = -src[0] * x2 - src[1] * y2 - src[2] * z2;
            x1 = src[3] * x2 + src[1] * z2 - src[2] * y2;
            y1 = src[3] * y2 - src[0] * z2 + src[2] * x2;
            z1 = src[3] * z2 + src[0] * y2 - src[1] * x2;
            out.x = -w1 * src[0] + x1 * src[3] - y1 * src[2] + z1 * src[1];
            out.y = -w1 * src[1] + x1 * src[2] + y1 * src[3] - z1 * src[0];
            out.z = -w1 * src[2] - x1 * src[1] + y1 * src[0] + z1 * src[3];
        }
        static unitxyzToRotation(xAxis, yAxis, zAxis, out) {
            var m11 = xAxis[0], m12 = yAxis[0], m13 = zAxis[0];
            var m21 = xAxis[1], m22 = yAxis[1], m23 = zAxis[1];
            var m31 = xAxis[2], m32 = yAxis[2], m33 = zAxis[2];
            var trace = m11 + m22 + m33;
            var s;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                out.w = 0.25 / s;
                out.x = (m32 - m23) * s;
                out.y = (m13 - m31) * s;
                out.z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                out.w = (m32 - m23) / s;
                out.x = 0.25 * s;
                out.y = (m12 + m21) / s;
                out.z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                out.w = (m13 - m31) / s;
                out.x = (m12 + m21) / s;
                out.y = 0.25 * s;
                out.z = (m23 + m32) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                out.w = (m21 - m12) / s;
                out.x = (m13 + m31) / s;
                out.y = (m23 + m32) / s;
                out.z = 0.25 * s;
            }
        }
        static lookat(pos, targetpos, out, up = MathD.vec3.UP) {
            let dirz = MathD.vec3.create();
            MathD.vec3.subtract(pos, targetpos, dirz);
            MathD.vec3.normalize(dirz, dirz);
            let dirx = MathD.vec3.create();
            MathD.vec3.cross(up, dirz, dirx);
            MathD.vec3.normalize(dirx, dirx);
            let diry = MathD.vec3.create();
            MathD.vec3.cross(dirz, dirx, diry);
            this.unitxyzToRotation(dirx, diry, dirz, out);
            MathD.vec3.recycle(dirx);
            MathD.vec3.recycle(diry);
            MathD.vec3.recycle(dirz);
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON && Math.abs(a2 - b2) <= MathD.EPSILON && Math.abs(a3 - b3) <= MathD.EPSILON;
        }
        static fromToRotation(from, to, out) {
            let dir1 = MathD.vec3.create();
            let dir2 = MathD.vec3.create();
            MathD.vec3.normalize(from, dir1);
            MathD.vec3.normalize(to, dir2);
            let dir = MathD.vec3.create();
            MathD.vec3.cross(dir1, dir2, dir);
            if (MathD.vec3.magnitude(dir) < 0.001) {
                MathD.quat.identity(out);
            }
            else {
                let dot = MathD.vec3.dot(dir1, dir2);
                MathD.vec3.normalize(dir, dir);
                quat.AxisAngle(dir, Math.acos(dot), out);
            }
            MathD.vec3.recycle(dir);
            MathD.vec3.recycle(dir1);
            MathD.vec3.recycle(dir2);
        }
    }
    quat.Recycle = [];
    quat.norot = quat.create();
    MathD.quat = quat;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class Rect extends Float32Array {
        constructor(x = 0, y = 0, w = 0, h = 0) {
            super(4);
            this[0] = x;
            this[1] = y;
            this[2] = w;
            this[3] = h;
        }
        get x() {
            return this[0];
        }
        set x(value) {
            this[0] = value;
        }
        get y() {
            return this[1];
        }
        set y(value) {
            this[1] = value;
        }
        get z() {
            return this[2];
        }
        set z(value) {
            this[2] = value;
        }
        get width() {
            return this[2];
        }
        get height() {
            return this[3];
        }
        get w() {
            return this[3];
        }
        set w(value) {
            this[3] = value;
        }
        static create(x = 0, y = 0, w = 0, h = 0) {
            if (Rect.Recycle && Rect.Recycle.length > 0) {
                let item = Rect.Recycle.pop();
                item[0] = x;
                item[1] = y;
                item[2] = w;
                item[3] = h;
                return item;
            }
            else {
                let item = new Rect(x, y, w, h);
                return item;
            }
        }
        static clone(from) {
            if (Rect.Recycle.length > 0) {
                let item = Rect.Recycle.pop();
                Rect.copy(from, item);
                return item;
            }
            else {
                let item = new Rect(from[0], from[1], from[2], from[3]);
                return item;
            }
        }
        static recycle(item) {
            Rect.Recycle.push(item);
        }
        static disposeRecycledItems() {
            Rect.Recycle.length = 0;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        static euqal(a, b) {
            if (a[0] != b[0])
                return false;
            if (a[1] != b[1])
                return false;
            if (a[2] != b[2])
                return false;
            if (a[3] != b[3])
                return false;
            return true;
        }
    }
    Rect.Recycle = [];
    MathD.Rect = Rect;
    function rectSet_One(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 1;
        out[3] = 1;
    }
    MathD.rectSet_One = rectSet_One;
    function rectSet_Zero(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
    }
    MathD.rectSet_Zero = rectSet_Zero;
    function rectEqul(src1, src2) {
        return !((src1[0] != src2[0]) ||
            (src1[1] != src2[1]) ||
            (src1[2] != src2[2]) ||
            (src1[3] != src2[3]));
    }
    MathD.rectEqul = rectEqul;
    function rectInner(x, y, src) {
        if (x < src[0] || x > src[0] + src[2] ||
            y < src[1] || y > src[1] + src[3]) {
            return false;
        }
        return true;
    }
    MathD.rectInner = rectInner;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class refNumber {
        constructor() {
            this.value = 0;
        }
    }
    MathD.refNumber = refNumber;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class vec2 extends Float32Array {
        constructor(x = 0, y = 0) {
            super(2);
            this[0] = x;
            this[1] = y;
        }
        get x() {
            return this[0];
        }
        set x(value) {
            this[0] = value;
        }
        get y() {
            return this[1];
        }
        set y(value) {
            this[1] = value;
        }
        static create(x = 0, y = 0) {
            if (vec2.Recycle && vec2.Recycle.length > 0) {
                let item = vec2.Recycle.pop();
                item[0] = x;
                item[1] = y;
                return item;
            }
            else {
                let item = new vec2(x, y);
                return item;
            }
        }
        static clone(from) {
            if (vec2.Recycle.length > 0) {
                let item = vec2.Recycle.pop();
                vec2.copy(from, item);
                return item;
            }
            else {
                let item = new vec2(from[0], from[1]);
                return item;
            }
        }
        static recycle(item) {
            vec2.Recycle.push(item);
        }
        static disposeRecycledItems() {
            vec2.Recycle.length = 0;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }
        static add(a, b, out) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        }
        static subtract(a, b, out) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        }
        static multiply(a, b, out) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }
        static divide(a, b, out) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        }
        static ceil(a, out) {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            return out;
        }
        static floor(a, out) {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            return out;
        }
        static min(a, b, out) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        }
        static max(a, b, out) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            return out;
        }
        static round(a, out) {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            return out;
        }
        static scale(a, b, out) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            return out;
        }
        static scaleByVec2(a, b, out) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }
        static scaleAndAdd(a, b, scale, out) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            return out;
        }
        static distance(a, b) {
            let x = b[0] - a[0], y = b[1] - a[1];
            return Math.sqrt(x * x + y * y);
        }
        static squaredDistance(a, b) {
            let x = b[0] - a[0], y = b[1] - a[1];
            return x * x + y * y;
        }
        static length_(a) {
            let x = a[0], y = a[1];
            return Math.sqrt(x * x + y * y);
        }
        static squaredLength(a) {
            let x = a[0], y = a[1];
            return x * x + y * y;
        }
        static negate(a, out) {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        }
        static inverse(a, out) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            return out;
        }
        static normalize(a, out) {
            let x = a[0], y = a[1];
            let len = x * x + y * y;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        }
        static dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }
        static cross(a, b, out) {
            let z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        }
        static lerp(from, to, lerp, out) {
            let ax = from[0], ay = from[1];
            out[0] = ax + lerp * (to[0] - ax);
            out[1] = ay + lerp * (to[1] - ay);
            return out;
        }
        static random(scale = 1, out) {
            scale = scale || 1.0;
            let r = Math.random() * 2.0 * Math.PI;
            out[0] = Math.cos(r) * scale;
            out[1] = Math.sin(r) * scale;
            return out;
        }
        static transformMat2d(a, m, out) {
            let x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        }
        static transformMat4(a, m, out) {
            let x = a[0];
            let y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        }
        static str(a) {
            return 'vec2(' + a[0] + ', ' + a[1] + ')';
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1];
            let b0 = b[0], b1 = b[1];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON;
        }
    }
    vec2.Recycle = [];
    MathD.vec2 = vec2;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class vec3 extends Float32Array {
        constructor(x = 0, y = 0, z = 0) {
            super(3);
            this[0] = x;
            this[1] = y;
            this[2] = z;
        }
        get x() {
            return this[0];
        }
        set x(value) {
            this[0] = value;
        }
        get y() {
            return this[1];
        }
        set y(value) {
            this[1] = value;
        }
        get z() {
            return this[2];
        }
        set z(value) {
            this[2] = value;
        }
        static create(x = 0, y = 0, z = 0) {
            if (vec3.Recycle && vec3.Recycle.length > 0) {
                let item = vec3.Recycle.pop();
                item[0] = x;
                item[1] = y;
                item[2] = z;
                return item;
            }
            else {
                let item = new vec3(x, y, z);
                return item;
            }
        }
        static clone(from) {
            if (vec3.Recycle.length > 0) {
                let item = vec3.Recycle.pop();
                vec3.copy(from, item);
                return item;
            }
            else {
                let item = new vec3(from[0], from[1], from[2]);
                return item;
            }
        }
        static recycle(item) {
            vec3.Recycle.push(item);
        }
        static disposeRecycledItems() {
            vec3.Recycle.length = 0;
        }
        static copy(from, out) {
            out[0] = from[0];
            out[1] = from[1];
            out[2] = from[2];
            return out;
        }
        static add(lhs, rhs, out) {
            out[0] = lhs[0] + rhs[0];
            out[1] = lhs[1] + rhs[1];
            out[2] = lhs[2] + rhs[2];
            return out;
        }
        static toZero(a) {
            a[0] = a[1] = a[2] = 0;
        }
        static subtract(lhs, rhs, out) {
            out[0] = lhs[0] - rhs[0];
            out[1] = lhs[1] - rhs[1];
            out[2] = lhs[2] - rhs[2];
            return out;
        }
        static multiply(a, b, out) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            return out;
        }
        static center(a, b, out) {
            this.add(a, b, out);
            this.scale(out, 0.5, out);
            return out;
        }
        static divide(out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            return out;
        }
        static ceil(out, a) {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            out[2] = Math.ceil(a[2]);
            return out;
        }
        static floor(out, a) {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            out[2] = Math.floor(a[2]);
            return out;
        }
        static min(a, b, out) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            return out;
        }
        static max(out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            return out;
        }
        static round(out, a) {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            out[2] = Math.round(a[2]);
            return out;
        }
        static scale(a, b, out) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            return out;
        }
        static AddscaledVec(lhs, rhs, scale, out) {
            out[0] = lhs[0] + rhs[0] * scale;
            out[1] = lhs[1] + rhs[1] * scale;
            out[2] = lhs[2] + rhs[2] * scale;
            return out;
        }
        static distance(a, b) {
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        static squaredDistance(a, b) {
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            return x * x + y * y + z * z;
        }
        static magnitude(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        static squaredLength(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            return x * x + y * y + z * z;
        }
        static negate(a, out) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            return out;
        }
        static inverse(a, out) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            return out;
        }
        static normalize(src, out) {
            let x = src[0];
            let y = src[1];
            let z = src[2];
            let len = x * x + y * y + z * z;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = src[0] * len;
                out[1] = src[1] * len;
                out[2] = src[2] * len;
            }
            return out;
        }
        static dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        static cross(lhs, rhs, out) {
            let ax = lhs[0], ay = lhs[1], az = lhs[2];
            let bx = rhs[0], by = rhs[1], bz = rhs[2];
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        }
        static lerp(lhs, rhs, lerp, out) {
            let ax = lhs[0];
            let ay = lhs[1];
            let az = lhs[2];
            out[0] = ax + lerp * (rhs[0] - ax);
            out[1] = ay + lerp * (rhs[1] - ay);
            out[2] = az + lerp * (rhs[2] - az);
            return out;
        }
        static hermite(out, a, b, c, d, t) {
            let factorTimes2 = t * t;
            let factor1 = factorTimes2 * (2 * t - 3) + 1;
            let factor2 = factorTimes2 * (t - 2) + t;
            let factor3 = factorTimes2 * (t - 1);
            let factor4 = factorTimes2 * (3 - 2 * t);
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            return out;
        }
        static bezier(out, a, b, c, d, t) {
            let inverseFactor = 1 - t;
            let inverseFactorTimesTwo = inverseFactor * inverseFactor;
            let factorTimes2 = t * t;
            let factor1 = inverseFactorTimesTwo * inverseFactor;
            let factor2 = 3 * t * inverseFactorTimesTwo;
            let factor3 = 3 * factorTimes2 * inverseFactor;
            let factor4 = factorTimes2 * t;
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            return out;
        }
        static random(out, scale = 1) {
            scale = scale || 1.0;
            let r = Math.random() * 2.0 * Math.PI;
            let z = Math.random() * 2.0 - 1.0;
            let zScale = Math.sqrt(1.0 - z * z) * scale;
            out[0] = Math.cos(r) * zScale;
            out[1] = Math.sin(r) * zScale;
            out[2] = z * scale;
            return out;
        }
        static transformQuat(out, a, q) {
            let x = a[0], y = a[1], z = a[2];
            let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
            let ix = qw * x + qy * z - qz * y;
            let iy = qw * y + qz * x - qx * z;
            let iz = qw * z + qx * y - qy * x;
            let iw = -qx * x - qy * y - qz * z;
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return out;
        }
        static rotateX(out, a, b, c) {
            let p = [], r = [];
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            r[0] = p[0];
            r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
            r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        static rotateY(out, a, b, c) {
            let p = [], r = [];
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
            r[1] = p[1];
            r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        static rotateZ(out, a, b, c) {
            let p = [], r = [];
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
            r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
            r[2] = p[2];
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        static angle(a, b) {
            let tempA = vec3.clone(a);
            let tempB = vec3.clone(b);
            vec3.normalize(tempA, tempA);
            vec3.normalize(tempB, tempB);
            let cosine = vec3.dot(tempA, tempB);
            if (cosine > 1.0) {
                return 0;
            }
            else if (cosine < -1.0) {
                return Math.PI;
            }
            else {
                return Math.acos(cosine);
            }
        }
        static str(a) {
            return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2];
            let b0 = b[0], b1 = b[1], b2 = b[2];
            return Math.abs(a0 - b0) <= MathD.EPSILON && Math.abs(a1 - b1) <= MathD.EPSILON && Math.abs(a2 - b2) <= MathD.EPSILON;
        }
    }
    vec3.UP = vec3.create(0, 1, 0);
    vec3.DOWN = vec3.create(0, -1, 0);
    vec3.RIGHT = vec3.create(1, 0, 0);
    vec3.LEFT = vec3.create(-1, 0, 0);
    vec3.FORWARD = vec3.create(0, 0, 1);
    vec3.BACKWARD = vec3.create(0, 0, -1);
    vec3.ONE = vec3.create(1, 1, 1);
    vec3.ZERO = vec3.create(0, 0, 0);
    vec3.Recycle = [];
    MathD.vec3 = vec3;
})(MathD || (MathD = {}));
var MathD;
(function (MathD) {
    class vec4 extends Float32Array {
        constructor(x = 0, y = 0, z = 0, w = 0) {
            super(4);
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this[3] = w;
        }
        get x() {
            return this[0];
        }
        set x(value) {
            this[0] = value;
        }
        get y() {
            return this[1];
        }
        set y(value) {
            this[1] = value;
        }
        get z() {
            return this[2];
        }
        set z(value) {
            this[2] = value;
        }
        get w() {
            return this[3];
        }
        set w(value) {
            this[3] = value;
        }
        static create(x = 0, y = 0, z = 0, w = 0) {
            if (vec4.Recycle && vec4.Recycle.length > 0) {
                let item = vec4.Recycle.pop();
                item[0] = x;
                item[1] = y;
                item[2] = z;
                item[3] = w;
                return item;
            }
            else {
                let item = new vec4(x, y, z, w);
                return item;
            }
        }
        static clone(from) {
            if (vec4.Recycle.length > 0) {
                let item = vec4.Recycle.pop();
                vec4.copy(from, item);
                return item;
            }
            else {
                let item = new vec4(from[0], from[1], from[2], from[3]);
                return item;
            }
        }
        static recycle(item) {
            vec4.Recycle.push(item);
        }
        static disposeRecycledItems() {
            vec4.Recycle.length = 0;
        }
        static copy(a, out) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        static add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        }
        static subtract(a, b, out) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            return out;
        }
        static multiply(a, b, out) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            out[3] = a[3] * b[3];
            return out;
        }
        static divide(a, b, out) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            out[3] = a[3] / b[3];
            return out;
        }
        static ceil(a, out) {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            out[2] = Math.ceil(a[2]);
            out[3] = Math.ceil(a[3]);
            return out;
        }
        static floor(a, out) {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            out[2] = Math.floor(a[2]);
            out[3] = Math.floor(a[3]);
            return out;
        }
        static min(a, b, out) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            out[3] = Math.min(a[3], b[3]);
            return out;
        }
        static max(a, b, out) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            out[3] = Math.max(a[3], b[3]);
            return out;
        }
        static round(a, out) {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            out[2] = Math.round(a[2]);
            out[3] = Math.round(a[3]);
            return out;
        }
        static scale(a, b, out) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        }
        static scaleAndAdd(a, b, scale, out) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            out[3] = a[3] + b[3] * scale;
            return out;
        }
        static distance(a, b) {
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            let w = b[3] - a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        static squaredDistance(a, b) {
            let x = b[0] - a[0];
            let y = b[1] - a[1];
            let z = b[2] - a[2];
            let w = b[3] - a[3];
            return x * x + y * y + z * z + w * w;
        }
        static length_(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        static squaredLength(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            return x * x + y * y + z * z + w * w;
        }
        static negate(a, out) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = -a[3];
            return out;
        }
        static inverse(a, out) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            out[3] = 1.0 / a[3];
            return out;
        }
        static normalize(a, out) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            let w = a[3];
            let len = x * x + y * y + z * z + w * w;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = x * len;
                out[1] = y * len;
                out[2] = z * len;
                out[3] = w * len;
            }
            return out;
        }
        static dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
        static lerp(lhs, rhs, lerp, out) {
            let ax = lhs[0];
            let ay = lhs[1];
            let az = lhs[2];
            let aw = lhs[3];
            out[0] = ax + lerp * (rhs[0] - ax);
            out[1] = ay + lerp * (rhs[1] - ay);
            out[2] = az + lerp * (rhs[2] - az);
            out[3] = aw + lerp * (rhs[3] - aw);
            return out;
        }
        static random(scale, out) {
            scale = scale || 1.0;
            out[0] = Math.random();
            out[1] = Math.random();
            out[2] = Math.random();
            out[3] = Math.random();
            vec4.normalize(out, out);
            vec4.scale(out, scale, out);
            return out;
        }
        static transformMat4(a, m, out) {
            let x = a[0], y = a[1], z = a[2], w = a[3];
            out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
            out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
            out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
            out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
            return out;
        }
        static transformQuat(a, q, out) {
            let x = a[0], y = a[1], z = a[2];
            let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
            let ix = qw * x + qy * z - qz * y;
            let iy = qw * y + qz * x - qx * z;
            let iz = qw * z + qx * y - qy * x;
            let iw = -qx * x - qy * y - qz * z;
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            out[3] = a[3];
            return out;
        }
        static str(a) {
            return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        }
        static equals(a, b) {
            let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            return Math.abs(a0 - b0) <= MathD.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= MathD.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= MathD.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= MathD.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
        }
    }
    vec4.Recycle = [];
    MathD.vec4 = vec4;
})(MathD || (MathD = {}));
var web3d;
(function (web3d) {
    class AABB {
        constructor() {
            this.maxPoint = MathD.vec3.create();
            this.minPoint = MathD.vec3.create();
            this.centerPoint = MathD.vec3.create();
        }
        setMaxPoint(pos) {
            MathD.vec3.copy(pos, this.maxPoint);
        }
        setMinPoint(pos) {
            MathD.vec3.copy(pos, this.minPoint);
        }
        setFromPoints(pos) {
            if (pos instanceof Array) {
                for (let key in pos) {
                    MathD.vec3.min(this.minPoint, pos[key], this.minPoint);
                    MathD.vec3.max(this.maxPoint, pos[key], this.maxPoint);
                }
            }
            else {
                MathD.vec3.min(this.minPoint, pos, this.minPoint);
                MathD.vec3.max(this.maxPoint, pos, this.maxPoint);
            }
            MathD.vec3.center(this.minPoint, this.maxPoint, this.centerPoint);
            return this;
        }
        setFromMesh(mesh) {
            let points = mesh.vertexAttData[webGraph.VertexAttTypeEnum.Position].data;
            this.setFromPoints(points);
            return this;
        }
        addAABB(box) {
            MathD.vec3.min(this.minPoint, box.minPoint, this.minPoint);
            MathD.vec3.max(this.maxPoint, box.maxPoint, this.maxPoint);
            MathD.vec3.center(this.minPoint, this.maxPoint, this.centerPoint);
        }
        beEmpty() {
            return (this.minPoint[0] > this.maxPoint[0]) || (this.minPoint[1] > this.maxPoint[1]) || (this.minPoint[2] > this.maxPoint[2]);
        }
        containPoint(point) {
            return (point[0] >= this.minPoint[0]) && (point[0] <= this.maxPoint[0]) &&
                (point[1] >= this.minPoint[1]) && (point[1] <= this.maxPoint[1]) &&
                (point[2] >= this.minPoint[2]) && (point[2] <= this.maxPoint[2]);
        }
        intersectAABB(box) {
            let interMin = box.minPoint;
            let interMax = box.maxPoint;
            if (this.minPoint[0] > interMax[0])
                return false;
            if (this.minPoint[1] > interMax[1])
                return false;
            if (this.minPoint[2] > interMax[2])
                return false;
            if (this.maxPoint[0] > interMin[0])
                return false;
            if (this.maxPoint[1] > interMin[1])
                return false;
            if (this.maxPoint[2] > interMin[2])
                return false;
            return true;
        }
        applyMatrix(mat) {
            if (this.beEmpty())
                return;
            let min = MathD.vec3.create();
            let max = MathD.vec3.create();
            min[0] += mat[12];
            max[0] += mat[12];
            min[1] += mat[13];
            max[1] += mat[13];
            min[2] += mat[14];
            max[2] += mat[14];
            for (let i = 0; i < 3; i++) {
                for (let k = 0; k < 3; k++) {
                    if (mat[k + i * 4] > 0) {
                        min[i] += mat[k + i * 4] * this.minPoint[i];
                        max[i] += mat[k + i * 4] * this.maxPoint[i];
                    }
                    else {
                        min[i] += mat[k + i * 4] * this.maxPoint[i];
                        max[i] += mat[k + i * 4] * this.minPoint[i];
                    }
                }
            }
            MathD.vec3.recycle(this.minPoint);
            MathD.vec3.recycle(this.maxPoint);
            this.minPoint = min;
            this.maxPoint = max;
        }
    }
    web3d.AABB = AABB;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Frustum {
        constructor(p0 = null, p1 = null, p2 = null, p3 = null, p4 = null, p5 = null) {
            this.planes = [];
            this.planes[0] = (p0 != null) ? p0 : new web3d.Plane();
            this.planes[1] = (p1 != null) ? p1 : new web3d.Plane();
            this.planes[2] = (p2 != null) ? p2 : new web3d.Plane();
            this.planes[3] = (p3 != null) ? p3 : new web3d.Plane();
            this.planes[4] = (p4 != null) ? p4 : new web3d.Plane();
            this.planes[5] = (p5 != null) ? p5 : new web3d.Plane();
        }
        set(p0, p1, p2, p3, p4, p5) {
            this.planes[0].copy(p0);
            this.planes[1].copy(p1);
            this.planes[2].copy(p2);
            this.planes[3].copy(p3);
            this.planes[4].copy(p4);
            this.planes[5].copy(p5);
        }
        setFromMatrix(me) {
            let planes = this.planes;
            let me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
            let me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
            let me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
            let me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];
            planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12);
            planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12);
            planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13);
            planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13);
            planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14);
            planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14);
            return this;
        }
        intersectRender(render) {
            let sphere = render.bouningSphere.clone();
            sphere.applyMatrix(render.gameObject.transform.worldMatrix);
            let result = this.intersectSphere(sphere);
            web3d.BoundingSphere.recycle(sphere);
            return result;
        }
        intersectSphere(sphere, mat = null) {
            let planes = this.planes;
            if (mat != null) {
                let clonesphere = sphere.clone();
                clonesphere.applyMatrix(mat);
                let center = clonesphere.center;
                let negRadius = -clonesphere.radius;
                for (let i = 0; i < 6; i++) {
                    let distance = planes[i].distanceToPoint(center);
                    if (distance < negRadius) {
                        return false;
                    }
                }
                web3d.BoundingSphere.recycle(sphere);
            }
            else {
                let center = sphere.center;
                let negRadius = -sphere.radius;
                for (let i = 0; i < 6; i++) {
                    let distance = planes[i].distanceToPoint(center);
                    if (distance < negRadius) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    web3d.Frustum = Frustum;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Line {
        intersectTriangle(v0, v1, v2, intersectPoint) {
            let u = MathD.vec3.create();
            MathD.vec3.subtract(v1, v0, u);
            let v = MathD.vec3.create();
            MathD.vec3.subtract(v2, v0, v);
            let normal = MathD.vec3.create();
            MathD.vec3.cross(u, v, normal);
            if (MathD.vec3.equals(normal, MathD.vec3.ZERO)) {
                return false;
            }
            let origin = this.startPoint;
            let direction = MathD.vec3.create();
            MathD.vec3.subtract(this.endPoint, this.startPoint, direction);
            MathD.vec3.normalize(direction, direction);
            let b = MathD.vec3.dot(normal, direction);
            if (Math.abs(b) < 0.0001) {
                return false;
            }
            let w0 = MathD.vec3.create();
            MathD.vec3.subtract(origin, v0, w0);
            let a = -(MathD.vec3.dot(normal, w0));
            let r = a / b;
            if (r < 0 || r > 1) {
                return false;
            }
            let interPoint = MathD.vec3.create();
            MathD.vec3.AddscaledVec(origin, direction, r, interPoint);
            let uu = MathD.vec3.dot(u, u);
            let uv = MathD.vec3.dot(u, v);
            let vv = MathD.vec3.dot(v, v);
            let w = MathD.vec3.create();
            MathD.vec3.subtract(interPoint, v0, w);
            let wu = MathD.vec3.dot(w, u);
            let wv = MathD.vec3.dot(w, v);
            let D = uv * uv - uu * vv;
            let s = (uv * wv - vv * wu) / D;
            if (s < 0.0 || s > 1.0)
                return false;
            let t = (uv * wu - uu * wv) / D;
            if (t < 0.0 || (s + t) > 1.0)
                return false;
            if (intersectPoint != null) {
                MathD.vec3.copy(interPoint, intersectPoint);
            }
            return true;
        }
        interSectAABB(aabb, intersectPoint) {
            let ptOnPlane = MathD.vec3.create();
            let min = aabb.minPoint;
            let max = aabb.maxPoint;
            let dir = MathD.vec3.create();
            MathD.vec3.subtract(this.endPoint, this.startPoint, dir);
            MathD.vec3.normalize(dir, dir);
            let origin = this.startPoint;
            let t;
            if (dir.x != 0) {
                if (dir.x > 0)
                    t = (min.x - origin.x) / dir.x;
                else
                    t = (max.x - origin.x) / dir.x;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.y < ptOnPlane.y && ptOnPlane.y < max.y && min.z < ptOnPlane.z && ptOnPlane.z < max.z) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            if (dir.y != 0) {
                if (dir.y > 0)
                    t = (min.y - origin.y) / dir.y;
                else
                    t = (max.y - origin.y) / dir.y;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.z < ptOnPlane.z && ptOnPlane.z < max.z && min.x < ptOnPlane.x && ptOnPlane.x < max.x) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            if (dir.z != 0) {
                if (dir.z > 0)
                    t = (min.z - origin.z) / dir.z;
                else
                    t = (max.z - origin.z) / dir.z;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.x < ptOnPlane.x && ptOnPlane.x < max.x && min.y < ptOnPlane.y && ptOnPlane.y < max.y) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        intersectTriangleMesh(mesh) {
            let posatt = mesh.getVertexData(webGraph.VertexAttTypeEnum.Position);
            let posArr = posatt.data;
            let triCount = mesh.trisindex.length / 3;
            for (let i = 0; i < triCount; i++) {
                let index0 = mesh.trisindex[i * 3 + 0];
                let index1 = mesh.trisindex[i * 3 + 1];
                let index2 = mesh.trisindex[i * 3 + 2];
                let beCollided = this.intersectTriangle(posArr[index0], posArr[index1], posArr[index2]);
                if (beCollided) {
                    return true;
                }
            }
            return false;
        }
    }
    web3d.Line = Line;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Particle {
        constructor() {
            this.position = MathD.vec3.create();
            this.velocity = MathD.vec3.create();
            this.acceleration = MathD.vec3.create();
            this.damping = 0.995;
            this.inverseMass = 1.0;
            this.forceAccum = MathD.vec3.create();
            this.resultAcc = MathD.vec3.create();
        }
        integrate(detal) {
            MathD.vec3.AddscaledVec(this.position, this.velocity, detal, this.position);
            MathD.vec3.copy(this.acceleration, this.resultAcc);
            MathD.vec3.AddscaledVec(this.resultAcc, this.forceAccum, this.inverseMass, this.resultAcc);
            MathD.vec3.AddscaledVec(this.velocity, this.resultAcc, detal, this.velocity);
            MathD.vec3.scale(this.velocity, this.damping, this.velocity);
            this.clearAccumlator();
        }
        addForce(force) {
            MathD.vec3.add(this.forceAccum, force, this.forceAccum);
        }
        clearAccumlator() {
            MathD.vec3.toZero(this.forceAccum);
        }
        getMass() {
            return 1.0 / this.inverseMass;
        }
        getpositon() {
            return this.position;
        }
        getVelocity() {
            return this.velocity;
        }
        hasFiniteMass() {
            return true;
        }
    }
    web3d.Particle = Particle;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParticleContact {
        constructor() {
            this.relativeSped = MathD.vec3.create();
            this.temptVec3 = MathD.vec3.create();
            this.movePerIMass = MathD.vec3.create();
            this.impulsePerIMass = MathD.vec3.create();
        }
        resolve(detal) {
            this.resolveVelocity(detal);
            this.resolveInterpenetration(detal);
        }
        ;
        calculateSeparatingVelocity() {
            let sped1 = this.particles[0].getVelocity();
            if (this.particles[1] != null) {
                let sped2 = this.particles[1].getVelocity();
                MathD.vec3.subtract(sped1, sped2, this.relativeSped);
            }
            return MathD.vec3.dot(this.relativeSped, this.contactNormal);
        }
        resolveVelocity(detal) {
            let separatingSped = this.calculateSeparatingVelocity();
            if (separatingSped > 0)
                return;
            let newsepVelocity = -separatingSped * this.restitution;
            let deltaVelocity = newsepVelocity - separatingSped;
            let totalInverseMass = this.particles[0].getMass();
            if (this.particles[1])
                totalInverseMass += this.particles[1].getMass();
            if (totalInverseMass <= 0)
                return;
            let impulse = deltaVelocity / totalInverseMass;
            MathD.vec3.scale(this.contactNormal, impulse, this.impulsePerIMass);
            MathD.vec3.scale(this.impulsePerIMass, this.particles[0].getMass(), this.temptVec3);
            MathD.vec3.add(this.temptVec3, this.particles[0].getVelocity(), this.particles[0].velocity);
            if (this.particles[1]) {
                MathD.vec3.scale(this.impulsePerIMass, -1 * this.particles[1].getMass(), this.temptVec3);
                MathD.vec3.add(this.temptVec3, this.particles[1].getVelocity(), this.particles[1].velocity);
            }
        }
        resolveInterpenetration(detal) {
            if (this.penetration <= 0)
                return;
            let totalInverseMass = this.particles[0].getMass();
            if (this.particles[1]) {
                totalInverseMass += this.particles[1].getMass();
            }
            if (totalInverseMass <= 0)
                return;
            MathD.vec3.scale(this.contactNormal, -this.penetration / totalInverseMass, this.movePerIMass);
            MathD.vec3.scale(this.movePerIMass, this.particles[0].getMass(), this.temptVec3);
            MathD.vec3.add(this.particles[0].position, this.temptVec3, this.particles[0].position);
            if (this.particles[1]) {
                MathD.vec3.scale(this.movePerIMass, this.particles[1].getMass(), this.temptVec3);
                MathD.vec3.add(this.particles[1].position, this.temptVec3, this.particles[1].position);
            }
        }
    }
    web3d.ParticleContact = ParticleContact;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParticleGravity {
        constructor(gravity) {
            this.force = MathD.vec3.create();
            this.gravity = gravity;
        }
        updateFore(par, delta) {
            MathD.vec3.scale(this.gravity, par.getMass(), this.force);
            par.addForce(this.force);
        }
    }
    web3d.ParticleGravity = ParticleGravity;
    class ParticleSpring {
        constructor(other, sprinconstant, restlen) {
            this.force = MathD.vec3.create();
            this.other = other;
            this.springConstant = sprinconstant;
            this.restLength = restlen;
        }
        updateFore(par, delta) {
            let pos = par.getpositon();
            let pos2 = this.other.getpositon();
            MathD.vec3.subtract(pos, pos2, this.force);
            let len = MathD.vec3.magnitude(this.force);
            len = Math.abs(len - this.restLength);
            len *= this.springConstant;
            MathD.vec3.normalize(this.force, this.force);
            MathD.vec3.scale(this.force, -len, this.force);
            par.addForce(this.force);
        }
    }
    web3d.ParticleSpring = ParticleSpring;
    class ParticleAnchoredSpring {
        constructor(anchor, sprinconstant, restlen) {
            this.force = MathD.vec3.create();
            this.anchor = anchor;
            this.springConstant = sprinconstant;
            this.restLength = restlen;
        }
        updateFore(par, delta) {
            let pos = par.getpositon();
            MathD.vec3.subtract(pos, this.anchor, this.force);
            let len = MathD.vec3.magnitude(this.force);
            len = Math.abs(len - this.restLength);
            len *= this.springConstant;
            MathD.vec3.normalize(this.force, this.force);
            MathD.vec3.scale(this.force, -len, this.force);
            par.addForce(this.force);
        }
    }
    web3d.ParticleAnchoredSpring = ParticleAnchoredSpring;
    class ParticleBungee {
        constructor(other, springConstance, restLen) {
            this.force = MathD.vec3.create();
            this.other = other;
            this.springConstant = this.springConstant;
            this.restLenghth = restLen;
        }
        updateFore(par, delta) {
            let pos = par.getpositon();
            MathD.vec3.subtract(pos, par.getpositon(), this.force);
            let len = MathD.vec3.magnitude(this.force);
            if (len <= this.restLenghth)
                return;
            len = this.springConstant * (this.restLenghth - len);
            MathD.vec3.normalize(this.force, this.force);
            MathD.vec3.scale(this.force, -len, this.force);
            par.addForce(this.force);
        }
    }
    web3d.ParticleBungee = ParticleBungee;
    class ParticleBuoyancy {
        constructor(maxdepth, volume, waterheight, liquiddensity = 1000.0) {
            this.force = MathD.vec3.create();
            this.maxDepth = maxdepth;
            this.volume = volume;
            this.waterHeight = waterheight;
            this.liquidDensity = liquiddensity;
        }
        updateFore(par, delta) {
            let pos = par.getpositon();
            if (pos[1] >= this.waterHeight + this.maxDepth)
                return;
            if (pos[1] <= this.waterHeight - this.maxDepth) {
                this.force[1] = this.liquidDensity * this.volume;
                par.addForce(this.force);
                return;
            }
            this.force[1] = this.liquidDensity * this.volume * (pos[1] - this.maxDepth - this.waterHeight) / (2 * this.maxDepth);
            par.addForce(this.force);
        }
    }
    web3d.ParticleBuoyancy = ParticleBuoyancy;
    class ParticleFakeSpring {
        constructor() {
            this.pos = MathD.vec3.create();
            this.c = MathD.vec3.create();
            this.target = MathD.vec3.create();
            this.ac = MathD.vec3.create();
            this.tempt = MathD.vec3.create();
        }
        updateFore(par, delta) {
            if (!par.hasFiniteMass())
                return;
            let pos = par.getpositon();
            MathD.vec3.subtract(pos, this.anchor, this.pos);
            let gamma = 0.5 * Math.sqrt(4 * this.springConstant - this.damping * this.damping);
            if (gamma == 0)
                return;
            MathD.vec3.scale(this.pos, this.damping * 0.5, this.c);
            MathD.vec3.add(this.c, par.getVelocity(), this.c);
            MathD.vec3.scale(this.c, 1.0 / gamma, this.c);
            MathD.vec3.scale(this.pos, Math.cos(gamma * delta), this.target);
            MathD.vec3.scale(this.c, Math.sin(gamma * delta), this.c);
            MathD.vec3.add(this.target, this.c, this.target);
            MathD.vec3.scale(this.target, Math.exp(-0.5 * delta * this.damping), this.target);
            MathD.vec3.subtract(this.target, this.pos, this.ac);
            MathD.vec3.scale(this.ac, 1.0 / (delta * delta), this.ac);
            MathD.vec3.scale(par.getVelocity(), delta, this.tempt);
            MathD.vec3.subtract(this.ac, this.tempt, this.ac);
            MathD.vec3.scale(this.ac, par.getMass(), this.ac);
            par.addForce(this.ac);
        }
    }
    web3d.ParticleFakeSpring = ParticleFakeSpring;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParticleForceRegistry {
        constructor() {
            this.forceMap = new Map();
        }
        add(par, force) {
            if (!this.forceMap.has(force)) {
                this.forceMap.set(force, new Array(par));
            }
            else {
                this.forceMap.get(force).push(par);
            }
        }
        remove(par, force) {
            let arr = this.forceMap.get(force);
            let index = arr.indexOf(par);
            if (index != -1) {
                arr.splice(index, 1);
                if (arr.length == 0) {
                    this.forceMap.delete(force);
                }
            }
        }
        clear() {
            this.forceMap.clear();
        }
        updateForces(detal) {
            this.forceMap.forEach((pars, force) => {
                for (let i = 0, len = pars.length; i < len; i++) {
                    force.updateFore(pars[i], detal);
                }
            });
        }
    }
    web3d.ParticleForceRegistry = ParticleForceRegistry;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Physics {
        static Raycast(origin, direction, distance = Number.MAX_VALUE) {
        }
        static rayIntersect(origin, rayDir, v0, v1, v2, intersectPoint) {
            let u = MathD.vec3.create();
            MathD.vec3.subtract(v1, v0, u);
            let v = MathD.vec3.create();
            MathD.vec3.subtract(v2, v0, v);
            let normal = MathD.vec3.create();
            MathD.vec3.cross(u, v, normal);
            if (MathD.vec3.equals(normal, MathD.vec3.ZERO)) {
                return false;
            }
            let b = MathD.vec3.dot(normal, rayDir);
            if (Math.abs(b) < 0.0001) {
                return false;
            }
            let w0 = MathD.vec3.create();
            MathD.vec3.subtract(origin, v0, w0);
            let a = -(MathD.vec3.dot(normal, w0));
            let r = a / b;
            if (r < 0) {
                return false;
            }
            let interPoint = MathD.vec3.create();
            MathD.vec3.AddscaledVec(origin, rayDir, r, interPoint);
            let uu = MathD.vec3.dot(u, u);
            let uv = MathD.vec3.dot(u, v);
            let vv = MathD.vec3.dot(v, v);
            let w = MathD.vec3.create();
            MathD.vec3.subtract(interPoint, v0, w);
            let wu = MathD.vec3.dot(w, u);
            let wv = MathD.vec3.dot(w, v);
            let D = uv * uv - uu * vv;
            let s = (uv * wv - vv * wu) / D;
            if (s < 0.0 || s > 1.0)
                return false;
            let t = (uv * wu - uu * wv) / D;
            if (t < 0.0 || (s + t) > 1.0)
                return false;
            if (intersectPoint != null) {
                MathD.vec3.copy(interPoint, intersectPoint);
            }
            return true;
        }
        static rayIntersectMesh(origin, rayDir, mesh) {
            let ray = new web3d.Ray(origin, rayDir);
            return ray.intersectTriangleMesh(mesh);
        }
    }
    web3d.Physics = Physics;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Plane {
        constructor() {
            this.normal = MathD.vec3.create(0, 1, 0);
            this.constant = 0;
        }
        distanceToPoint(point) {
            return MathD.vec3.dot(point, this.normal) + this.constant;
        }
        copy(to) {
            MathD.vec3.copy(this.normal, to.normal);
            to.constant = this.constant;
        }
        setComponents(nx, ny, nz, ds) {
            this.normal[0] = nx;
            this.normal[1] = ny;
            this.normal[2] = nz;
            let inverseNormalLength = 1.0 / MathD.vec3.magnitude(this.normal);
            MathD.vec3.scale(this.normal, inverseNormalLength, this.normal);
            this.constant = ds * inverseNormalLength;
        }
    }
    web3d.Plane = Plane;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Ray {
        constructor(origin, dir) {
            this.origin = origin;
            this.direction = dir;
        }
        intersectTriangle(v0, v1, v2, intersectPoint) {
            let u = MathD.vec3.create();
            MathD.vec3.subtract(v1, v0, u);
            let v = MathD.vec3.create();
            MathD.vec3.subtract(v2, v0, v);
            let normal = MathD.vec3.create();
            MathD.vec3.cross(u, v, normal);
            if (MathD.vec3.equals(normal, MathD.vec3.ZERO)) {
                return false;
            }
            let b = MathD.vec3.dot(normal, this.direction);
            if (Math.abs(b) < 0.0001) {
                return false;
            }
            let w0 = MathD.vec3.create();
            MathD.vec3.subtract(this.origin, v0, w0);
            let a = -(MathD.vec3.dot(normal, w0));
            let r = a / b;
            if (r < 0) {
                return false;
            }
            let interPoint = MathD.vec3.create();
            MathD.vec3.AddscaledVec(this.origin, this.direction, r, interPoint);
            let uu = MathD.vec3.dot(u, u);
            let uv = MathD.vec3.dot(u, v);
            let vv = MathD.vec3.dot(v, v);
            let w = MathD.vec3.create();
            MathD.vec3.subtract(interPoint, v0, w);
            let wu = MathD.vec3.dot(w, u);
            let wv = MathD.vec3.dot(w, v);
            let D = uv * uv - uu * vv;
            let s = (uv * wv - vv * wu) / D;
            if (s < 0.0 || s > 1.0)
                return false;
            let t = (uv * wu - uu * wv) / D;
            if (t < 0.0 || (s + t) > 1.0)
                return false;
            if (intersectPoint != null) {
                MathD.vec3.copy(interPoint, intersectPoint);
            }
            return true;
        }
        interSectAABB(aabb, intersectPoint) {
            let ptOnPlane = MathD.vec3.create();
            let min = aabb.minPoint;
            let max = aabb.maxPoint;
            let dir = this.direction;
            let origin = this.origin;
            let t;
            if (dir.x != 0) {
                if (dir.x > 0)
                    t = (min.x - origin.x) / dir.x;
                else
                    t = (max.x - origin.x) / dir.x;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.y < ptOnPlane.y && ptOnPlane.y < max.y && min.z < ptOnPlane.z && ptOnPlane.z < max.z) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            if (dir.y != 0) {
                if (dir.y > 0)
                    t = (min.y - origin.y) / dir.y;
                else
                    t = (max.y - origin.y) / dir.y;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.z < ptOnPlane.z && ptOnPlane.z < max.z && min.x < ptOnPlane.x && ptOnPlane.x < max.x) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            if (dir.z != 0) {
                if (dir.z > 0)
                    t = (min.z - origin.z) / dir.z;
                else
                    t = (max.z - origin.z) / dir.z;
                if (t > 0) {
                    MathD.vec3.AddscaledVec(origin, dir, t, ptOnPlane);
                    if (min.x < ptOnPlane.x && ptOnPlane.x < max.x && min.y < ptOnPlane.y && ptOnPlane.y < max.y) {
                        if (intersectPoint != null) {
                            MathD.vec3.copy(ptOnPlane, intersectPoint);
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        intersectTriangleMesh(mesh) {
            let posatt = mesh.getVertexData(webGraph.VertexAttTypeEnum.Position);
            let posArr = posatt.data;
            let triCount = mesh.trisindex.length / 3;
            for (let i = 0; i < triCount; i++) {
                let index0 = mesh.trisindex[i * 3 + 0];
                let index1 = mesh.trisindex[i * 3 + 1];
                let index2 = mesh.trisindex[i * 3 + 2];
                let beCollided = this.intersectTriangle(posArr[index0], posArr[index1], posArr[index2]);
                if (beCollided) {
                    return true;
                }
            }
            return false;
        }
    }
    web3d.Ray = Ray;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class BoundingSphere {
        constructor() {
            this.center = MathD.vec3.create();
            this.radius = 0;
        }
        applyMatrix(mat) {
            MathD.mat4.transformPoint(this.center, mat, this.center);
        }
        setFromPoints(points, center = null) {
            if (center != null) {
                MathD.vec3.copy(center, this.center);
            }
            else {
                let center = new web3d.AABB().setFromPoints(points).centerPoint;
                MathD.vec3.copy(center, this.center);
            }
            for (let i = 0; i < points.length; i++) {
                let dis = MathD.vec3.distance(points[i], this.center);
                if (dis > this.radius) {
                    this.radius = dis;
                }
            }
        }
        setFromMesh(mesh, center = null) {
            let points = mesh.vertexAttData[webGraph.VertexAttTypeEnum.Position].data;
            this.setFromPoints(points, center);
            return this;
        }
        copyTo(to) {
            MathD.vec3.copy(this.center, to.center);
            to.radius = this.radius;
        }
        clone() {
            let newSphere = BoundingSphere.create();
            this.copyTo(newSphere);
            return newSphere;
        }
        static create() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            else {
                return new BoundingSphere();
            }
        }
        static recycle(item) {
            this.pool.push(item);
        }
    }
    BoundingSphere.pool = [];
    web3d.BoundingSphere = BoundingSphere;
    class BoundingBox {
        constructor() {
            this.center = MathD.vec3.create();
            this.halfSize = MathD.vec3.create(1, 1, 1);
        }
        static create() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            else {
                return new BoundingBox();
            }
        }
        static recycle(item) {
            this.pool.push(item);
        }
    }
    BoundingBox.pool = [];
    web3d.BoundingBox = BoundingBox;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class GlobalMgr {
        constructor(_app) {
            web3d.app = _app;
            this.initAllSingleton(null);
        }
        initAllSingleton(Onfinish) {
            web3d.webgl = web3d.app.webgl;
            webGraph.Graph.init(web3d.app.webgl);
            web3d.renderContext = new web3d.RenderContext();
            web3d.renderContext2d = new web3d.RenderContext2d();
            web3d.renderMgr = new web3d.Rendermgr();
            web3d.assetMgr = new web3d.AssetMgr();
            web3d.sceneMgr = new web3d.SceneMgr();
            web3d.ShaderVariant.registAutoUniform();
            web3d.Input.init();
            web3d.assetMgr.initDefAsset();
            web3d.SkyBox.init();
        }
    }
    web3d.GlobalMgr = GlobalMgr;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class GameScreen {
        static get Height() {
            return GameScreen.canvasheight;
        }
        static get Width() {
            return GameScreen.canvaswidth;
        }
        static get windowWidth() {
            return this._windowWidth;
        }
        static get windowHeight() {
            return this._windowHeight;
        }
        static get aspect() {
            return this.apset;
        }
        static SetCanvasSize(scale) {
            GameScreen.scale = scale;
            this.OnResizeCanvas();
        }
        static init(canvas) {
            this.canvas = canvas;
            this.OnResizeCanvas();
            window.onresize = () => {
                this.OnResizeCanvas();
            };
            let divcontiner = document.createElement("div");
            divcontiner.className = "divContiner";
            divcontiner.style.overflow = "hidden";
            divcontiner.style.left = "0px";
            divcontiner.style.top = "0px";
            canvas.parentElement.appendChild(divcontiner);
            this.divcontiner = divcontiner;
        }
        static OnResizeCanvas() {
            console.warn("canvas resize!");
            this._windowWidth = window.innerWidth;
            this._windowHeight = window.innerHeight;
            let pixelRatio = window.devicePixelRatio || 1;
            this.canvaswidth = pixelRatio * this.scale * this._windowWidth;
            this.canvasheight = pixelRatio * this.scale * this._windowHeight;
            this.canvas.width = this.canvaswidth;
            this.canvas.height = this.canvasheight;
            this.apset = this.canvaswidth / this.canvasheight;
            for (let i = 0; i < this.resizeListenerArr.length; i++) {
                let fuc = this.resizeListenerArr[i];
                fuc();
            }
        }
        static addListenertoCanvasResize(fuc) {
            this.resizeListenerArr.push(fuc);
        }
    }
    GameScreen.scale = 1;
    GameScreen.resizeListenerArr = [];
    web3d.GameScreen = GameScreen;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class application {
        constructor() {
            this.version = "v0.0.1";
            this.build = "b000010";
            this._userCode = [];
            this._userCodeNew = [];
        }
        start(div) {
            console.log("version: " + this.version + "  build: " + this.build);
            div.style.overflow = "hidden";
            this.container = div;
            let canvas = document.createElement("canvas");
            div.appendChild(canvas);
            canvas.style.position = "absolute";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            this.boost(canvas);
        }
        startByWxPlatform() {
            let canvas = document.createElement("canvas");
            this.boost(canvas);
        }
        boost(canvas) {
            web3d.GameScreen.init(canvas);
            this.webgl = canvas.getContext("webgl", {
                premultipliedAlpha: false, alpha: false, stencil: true
            });
            new web3d.GlobalMgr(this);
            web3d.GameTimer.Init();
            web3d.GameTimer.OnUpdate = (delta) => { this.Loop(delta); };
            web3d.GameTimer.addListenToTimerUpdate((delta) => {
                if (web3d.StateMgr.stats != null) {
                    web3d.StateMgr.stats.update();
                }
            });
        }
        Loop(delta) {
            this.updateUserCode(delta);
            web3d.sceneMgr.update(delta);
        }
        updateUserCode(delta) {
            for (let i = this._userCodeNew.length - 1; i >= 0; i--) {
                let c = this._userCodeNew[i];
                if (c.isClosed() == false) {
                    c.onStart(this);
                    this._userCode.push(c);
                    this._userCodeNew.splice(i, 1);
                }
            }
            let closeindex = -1;
            for (let i = 0; i < this._userCode.length; i++) {
                let c = this._userCode[i];
                if (c.isClosed() == false) {
                    c.onUpdate(delta);
                }
                else if (closeindex < 0) {
                    closeindex = i;
                }
            }
            if (closeindex >= 0) {
                this._userCode.splice(closeindex, 1);
            }
        }
        addUserCodeDirect(program) {
            this._userCodeNew.push(program);
        }
        addUserCode(classname) {
            let code = web3d.creatUserCode(classname);
            if (code) {
                this.addUserCodeDirect(code);
            }
        }
    }
    web3d.application = application;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let ScreenMatchEnum;
    (function (ScreenMatchEnum) {
        ScreenMatchEnum[ScreenMatchEnum["Height"] = 0] = "Height";
        ScreenMatchEnum[ScreenMatchEnum["Width"] = 1] = "Width";
    })(ScreenMatchEnum = web3d.ScreenMatchEnum || (web3d.ScreenMatchEnum = {}));
    class Canvas {
        constructor() {
            this.match_width = 800;
            this.match_height = 600;
            this.screenMatchType = ScreenMatchEnum.Height;
            this.rootNode = new web3d.Node2d();
            this.onScreenResize();
            web3d.GameScreen.addListenertoCanvasResize(() => {
                this.onScreenResize();
            });
        }
        static get inc() {
            if (this._inc == null) {
                this._inc = new Canvas();
            }
            return this._inc;
        }
        get rootTrans() {
            return this.rootNode.transform2d;
        }
        addChild(node) {
            this.rootTrans.addChild(node);
        }
        removeChild(node) {
            this.rootTrans.removeChild(node);
        }
        getChildren() {
            return this.rootTrans.children;
        }
        getChildCount() {
            return this.rootTrans.children.length;
        }
        getChild(index) {
            return this.rootTrans.children[index];
        }
        onScreenResize() {
            switch (this.screenMatchType) {
                case ScreenMatchEnum.Height:
                    this.realheight = this.match_height;
                    this.realWidth = web3d.GameScreen.aspect * this.realheight;
                    break;
                case ScreenMatchEnum.Width:
                    this.realWidth = this.match_width;
                    this.realheight = this.realWidth / web3d.GameScreen.aspect;
                    break;
            }
            this.matchScale = web3d.GameScreen.Height / this.realheight;
        }
        update(delta) {
            this.updateGameObject(this.rootNode, delta);
        }
        updateGameObject(node, delta) {
            node.start();
            node.update(delta);
            for (let i = 0, len = node.transform2d.children.length; i < len; i++) {
                this.updateGameObject(node.transform2d.children[i].node2d, delta);
            }
        }
        render() {
            web3d.renderContext2d.updateCamera(this);
            this.drawScene(this.rootNode);
        }
        drawScene(node) {
            if (!node.beVisible)
                return;
            if (node.renderer != null) {
                node.renderer.render(this);
            }
            if (node.transform2d.children != null) {
                for (var i = 0; i < node.transform2d.children.length; i++) {
                    this.drawScene(node.transform2d.children[i].node2d);
                }
            }
        }
        getRoot() {
            return this.rootNode;
        }
        addRenderData(mat, meshdata) {
        }
    }
    web3d.Canvas = Canvas;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Node2d {
        constructor() {
            this.beVisible = true;
            this.name = "2D Node";
            this.components = [];
            this.componentsInit = [];
            this.transform2d = new web3d.Transform2D();
            this.transform2d.node2d = this;
        }
        start() {
            if (this.componentsInit.length == 0)
                return;
            for (let i = 0, len = this.componentsInit.length; i < len; i++) {
                this.componentsInit[i].start();
            }
            this.componentsInit.length = 0;
        }
        update(delta) {
            if (this.components.length == 0)
                return;
            for (let i = 0; i < this.components.length; i++) {
                this.components[i].update(delta);
            }
        }
        addComponent(type) {
            let className = type;
            for (let key in this.components) {
                let comp = this.components[key];
                if (web3d.getRegistedClassName(comp) == className) {
                    console.error("ERROR: This Gameobject already have same type component.\n INFO:component name: " + type);
                    return comp;
                }
            }
            let comp = web3d.creatComponent2d(type);
            if (comp) {
                comp.node2d = this;
                this.components.push(comp);
                this.componentsInit.push(comp);
                switch (type) {
                    case web3d.RawImage2D.name:
                        this.renderer = comp;
                        break;
                }
            }
            return comp;
        }
        removeComponent(comp) {
            if (!comp)
                return;
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
            if (this.renderer)
                this.renderer = null;
            this.components.length = 0;
        }
        getComponent(type) {
            for (let i = 0, len = this.components.length; i < len; i++) {
                let cname = web3d.getRegistedClassName(this.components[i]);
                if (cname == type.name) {
                    return this.components[i];
                }
            }
            return null;
        }
    }
    web3d.Node2d = Node2d;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class UIMeshData {
    }
    UIMeshData.vboData = [
        0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
        1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];
    UIMeshData.eboData = [0, 2, 1, 0, 2, 3];
    web3d.UIMeshData = UIMeshData;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class RenderContext2d {
        constructor() {
            this.matrixMatchCanvasToRealCanvas = MathD.mat2d.create();
            this.matrixProject = MathD.mat2d.create();
            this.mat_ui = MathD.mat2d.create();
            this.matrix_UI = MathD.mat3.create();
        }
        updateModel(transform2d) {
            this.matrixToMatchCanvas = transform2d.worldMatrix;
            this.matrixReshape = transform2d.reshapeMatrix;
            MathD.mat2d.multiply(this.matrixToMatchCanvas, this.matrixReshape, this.mat_ui);
            MathD.mat2d.multiply(this.matrixMatchCanvasToRealCanvas, this.mat_ui, this.mat_ui);
            MathD.mat2d.multiply(this.matrixProject, this.mat_ui, this.mat_ui);
            MathD.mat3.fromMat2d(this.mat_ui, this.matrix_UI);
        }
        updateCamera(canvas) {
            webGraph.render.viewPort(0, 0, web3d.GameScreen.Width, web3d.GameScreen.Height);
            this.canvasMatchMatrix(canvas, this.matrixMatchCanvasToRealCanvas);
            this.canvasProjectMatrix(this.matrixProject);
        }
        canvasProjectMatrix(mat) {
            mat[0] = 2 / web3d.GameScreen.Width;
            mat[3] = 2 / web3d.GameScreen.Height;
        }
        canvasMatchMatrix(canvas, mat) {
            mat[0] = canvas.matchScale;
            mat[3] = canvas.matchScale;
        }
    }
    web3d.RenderContext2d = RenderContext2d;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let layoutOption;
    (function (layoutOption) {
        layoutOption[layoutOption["LEFT"] = 1] = "LEFT";
        layoutOption[layoutOption["TOP"] = 2] = "TOP";
        layoutOption[layoutOption["RIGHT"] = 4] = "RIGHT";
        layoutOption[layoutOption["BOTTOM"] = 8] = "BOTTOM";
        layoutOption[layoutOption["H_CENTER"] = 16] = "H_CENTER";
        layoutOption[layoutOption["V_CENTER"] = 32] = "V_CENTER";
    })(layoutOption = web3d.layoutOption || (web3d.layoutOption = {}));
    class C2DComponent {
        constructor(comp, init = false) {
            this.comp = comp;
            this.init = init;
        }
    }
    web3d.C2DComponent = C2DComponent;
    class Transform2D {
        constructor() {
            this.beVisible = true;
            this.name = "2D Node";
            this.children = [];
            this.width = 0;
            this.height = 0;
            this.pivot = MathD.vec2.create(0.5, 0.5);
            this.localPosition = MathD.vec2.create();
            this.localScale = MathD.vec2.create(1, 1);
            this.localRotation = 0;
            this._localMatrix = MathD.mat2d.create();
            this._worldMatrix = MathD.mat2d.create();
            this.canvasWorldMatrix = MathD.mat2d.create();
            this._worldRotate = new MathD.refNumber();
            this._worldPosition = MathD.vec2.create();
            this._worldScale = MathD.vec2.create(1, 1);
            this.dirtyWorldDecompose = false;
            this.needComputeLocalMat = true;
            this.needComputeWorldMat = true;
            this._reshapeMatrix = MathD.mat2d.create();
        }
        markDirty() {
            this.needComputeLocalMat = true;
            this.needComputeWorldMat = true;
            this.notifyChildSelfDirty(this);
        }
        notifyChildSelfDirty(selfnode) {
            if (selfnode.children.length > 0) {
                for (let i = 0, len = selfnode.children.length; i < len; i++) {
                    let child = selfnode.children[i];
                    if (!child.needComputeWorldMat) {
                        child.needComputeWorldMat = true;
                        this.notifyChildSelfDirty(selfnode.children[i]);
                    }
                }
            }
        }
        get localMatrix() {
            if (this.needComputeLocalMat) {
                MathD.mat2d.RTS(this.localPosition, this.localScale, this.localRotation, this._localMatrix);
                this.needComputeLocalMat = false;
            }
            return this._localMatrix;
        }
        get worldMatrix() {
            if (this.needComputeWorldMat) {
                if (this.parent == null) {
                    MathD.mat2d.copy(this.localMatrix, this._worldMatrix);
                }
                else {
                    MathD.mat2d.multiply(this.parent.worldMatrix, this.localMatrix, this._worldMatrix);
                }
                this.needComputeWorldMat = false;
                this.dirtyWorldDecompose = true;
            }
            return this._worldMatrix;
        }
        get worldScale() {
            if (this.dirtyWorldDecompose || this.needComputeWorldMat) {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldScale;
        }
        get worldPositon() {
            if (this.dirtyWorldDecompose || this.needComputeWorldMat) {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldScale;
        }
        get worldRotation() {
            if (this.dirtyWorldDecompose || this.needComputeWorldMat) {
                MathD.mat2d.decompose(this.worldMatrix, this._worldPosition, this._worldScale, this._worldRotate);
                this.dirtyWorldDecompose = false;
            }
            return this._worldRotate.value;
        }
        get reshapeMatrix() {
            let _offsetLDpos = MathD.vec2.create();
            let scale = MathD.vec2.create(this.width, this.height);
            _offsetLDpos[0] = -1 * this.pivot[0] * this.width;
            _offsetLDpos[1] = -1 * this.pivot[1] * this.height;
            MathD.mat2d.RTS(_offsetLDpos, scale, 0, this._reshapeMatrix);
            return this._reshapeMatrix;
        }
        addChild(node) {
            if (node.parent != null) {
                node.parent.removeChild(node);
            }
            if (this.children == null)
                this.children = [];
            this.children.push(node);
            node.parent = this;
            this.markDirty();
        }
        removeChild(node) {
            if (node.parent != this) {
                console.warn("RemoveChild Info: Not my child.");
            }
            var i = this.children.indexOf(node);
            if (i >= 0) {
                this.children.splice(i, 1);
                node.parent = null;
            }
        }
        removeAllChild() {
            this.children.length = 0;
        }
        dispose() {
            if (this.children) {
                for (var k in this.children) {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
        }
    }
    web3d.Transform2D = Transform2D;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    const DataInfo = {};
    function Attribute(target, _key) {
        if (target["_web3d"] == null)
            target["_web3d"] = {};
        if (target["_web3d"]["atts"] == undefined)
            target["_web3d"]["atts"] = [];
        target["_web3d"]["atts"].push(_key);
    }
    web3d.Attribute = Attribute;
    function getClassFunctionByName(name) {
        return DataInfo["_web3d"][name]["func"];
    }
    web3d.getClassFunctionByName = getClassFunctionByName;
    function Class(constructor, SeralizeName) {
        let target = constructor.prototype;
        let className = SeralizeName;
        if (target["_web3d"] == null)
            target["_web3d"] = {};
        target["_web3d"]["class"] = className;
        if (DataInfo["_web3d"] == null)
            DataInfo["_web3d"] = {};
        if (DataInfo["_web3d"][className] == null)
            DataInfo["_web3d"][className] = {};
        DataInfo["_web3d"][className]["contor"] = target.constructor;
        DataInfo["_web3d"][className]["func"] = constructor;
    }
    web3d.Class = Class;
    function ClassWithTag(constructor, tagInfo) {
        let target = constructor.prototype;
        let className = constructor["type"] ? constructor["type"] : target.constructor.name;
        if (target["_web3d"] == undefined)
            target["_web3d"] = {};
        target["_web3d"]["class"] = className;
        if (DataInfo["_web3d"] == null)
            DataInfo["_web3d"] = {};
        if (DataInfo["_web3d"][className] == null)
            DataInfo["_web3d"][className] = {};
        DataInfo["_web3d"][className]["contor"] = target.constructor;
        DataInfo["_web3d"][className]["tag"] = tagInfo;
        DataInfo["_web3d"][className]["func"] = constructor;
    }
    web3d.ClassWithTag = ClassWithTag;
    function createInstanceByName(className) {
        let classInfo = DataInfo["_web3d"][className];
        if (classInfo) {
            let ctor = classInfo["contor"];
            return new ctor();
        }
        else {
            console.error("ERROR: creatInstance by ClassName Failed.\n INFO: Class: " + className + "not reg!");
            return null;
        }
    }
    web3d.createInstanceByName = createInstanceByName;
    function getRegistedClassName(obj) {
        let proto = Object.getPrototypeOf(obj);
        if (proto["_web3d"]) {
            return proto["_web3d"]["class"];
        }
        else {
            console.error("getRegistedClassName failed", obj);
            return null;
        }
    }
    web3d.getRegistedClassName = getRegistedClassName;
    function haveRegClass(obj) {
        let classname = obj.constructor.name;
        let classInfo = DataInfo["_web3d"][classname];
        return classInfo != null;
    }
    web3d.haveRegClass = haveRegClass;
    function Serialize(name) {
        return (target) => {
            Class(target, name);
        };
    }
    web3d.Serialize = Serialize;
    function NodeComponent(constructorObj) {
        ClassWithTag(constructorObj, "comp");
    }
    web3d.NodeComponent = NodeComponent;
    function NodeComponent2d(constructorObj) {
        ClassWithTag(constructorObj, "comp2d");
    }
    web3d.NodeComponent2d = NodeComponent2d;
    function GameAsset(constructorObj) {
        ClassWithTag(constructorObj, "Asset");
    }
    web3d.GameAsset = GameAsset;
    function creatComponent(classsName) {
        let classInfo = DataInfo["_web3d"][classsName];
        if (classInfo["tag"] == "comp") {
            let ctor = classInfo["contor"];
            return new ctor();
        }
        else {
            console.error("ERROR: creat component failed.\n INFO: " + classsName + " component" + +" not Exist!");
            return null;
        }
    }
    web3d.creatComponent = creatComponent;
    function creatComponent2d(classsName) {
        let classInfo = DataInfo["_web3d"][classsName];
        if (classInfo["tag"] == "comp2d") {
            let ctor = classInfo["contor"];
            return new ctor();
        }
        else {
            console.error("ERROR: creat component failed.\n INFO: " + classsName + " component" + +" not Exist!");
            return null;
        }
    }
    web3d.creatComponent2d = creatComponent2d;
    function BeCompoentType(type) {
        let classInfo = DataInfo["_web3d"][type];
        if (classInfo == null)
            return false;
        let becomp = classInfo["tag"] == "comp";
        return becomp;
    }
    web3d.BeCompoentType = BeCompoentType;
    function BeAssetType(type) {
        let classInfo = DataInfo["_web3d"][type];
        if (classInfo == null)
            return false;
        let becomp = classInfo["tag"] == "Asset";
        return becomp;
    }
    web3d.BeAssetType = BeAssetType;
    function UserCode(constructorObj) {
        ClassWithTag(constructorObj, "usercode");
    }
    web3d.UserCode = UserCode;
    function creatUserCode(classsname) {
        let classInfo = DataInfo["_web3d"][classsname];
        if (classInfo["tag"] == "usercode") {
            let ctor = classInfo["contor"];
            return new ctor();
        }
        else {
            console.error("ERROR: creat usercode failed.\n INFO: " + classsname + " class " + +"is not user-defined class or have not registed.");
            return null;
        }
    }
    web3d.creatUserCode = creatUserCode;
    function getAtts(obj) {
        let proto = Object.getPrototypeOf(obj);
        if (proto["_web3d"]) {
            return proto["_web3d"]["atts"];
        }
        else {
            return null;
        }
    }
    web3d.getAtts = getAtts;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let RawImage2D = class RawImage2D {
        constructor() {
            this.color = MathD.color.create();
            this.mat = new web3d.Material();
            this.mat.setShader(web3d.assetMgr.getShader("defui"));
        }
        get image() {
            return this._image;
        }
        set image(value) {
            this._image = value;
            this.mat.setTexture("_MainTex", this._image);
        }
        render(canvas) {
            web3d.renderContext2d.updateModel(this.node2d.transform2d);
            let program = this.mat.getShaderPass(web3d.DrawTypeEnum.BASE).program[0];
            let mesh = web3d.assetMgr.getDefaultMesh("UI_base");
            let submesh = mesh.submeshs[0];
            webGraph.render.bindProgram(program);
            webGraph.render.bindMeshData(mesh.glMesh, program);
            webGraph.render.applyMatUniforms(program, web3d.ShaderVariant.AutoUniformDic, this.mat.UniformDic, this.mat.getShader().mapUniformDef);
            web3d.webgl.drawElements(submesh.renderType, submesh.size, web3d.webgl.UNSIGNED_SHORT, submesh.start);
        }
        uploadMeshData() {
        }
        start() {
        }
        update(delta) {
        }
        dispose() {
        }
    };
    RawImage2D = __decorate([
        web3d.NodeComponent2d,
        __metadata("design:paramtypes", [])
    ], RawImage2D);
    web3d.RawImage2D = RawImage2D;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ResID {
        static next() {
            let next = ResID.idAll;
            ResID.idAll++;
            return next;
        }
    }
    ResID.idAll = 0;
    web3d.ResID = ResID;
    class Web3dAsset {
        constructor(name, url = null, bedef = false) {
            this.URL = "";
            this.loadState = web3d.LoadEnum.None;
            this.beDefaultAsset = false;
            this.type = "None";
            this.loadEndListeners = [];
            this.guid = ResID.next();
            if (name == null) {
                this.name = "asset_" + this.guid;
            }
            else {
                this.name = name;
            }
            this.beDefaultAsset = bedef;
            if (bedef) {
                this.loadState = web3d.LoadEnum.Success;
            }
        }
        onLoadEnd() {
            if (this.loadEndListeners) {
                for (let key in this.loadEndListeners) {
                    this.loadEndListeners[key]();
                }
            }
            this.loadEndListeners = null;
        }
        addListenerToLoadEnd(onloadEnd) {
            if (this.loadEndListeners == null) {
                this.loadEndListeners = [];
            }
            this.loadEndListeners.push(onloadEnd);
        }
        dispose() { }
    }
    __decorate([
        web3d.Attribute,
        __metadata("design:type", String)
    ], Web3dAsset.prototype, "name", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", String)
    ], Web3dAsset.prototype, "URL", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Boolean)
    ], Web3dAsset.prototype, "beDefaultAsset", void 0);
    web3d.Web3dAsset = Web3dAsset;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let LoadEnum;
    (function (LoadEnum) {
        LoadEnum["Success"] = "Success";
        LoadEnum["Failed"] = "Failed";
        LoadEnum["Loading"] = "Loading";
        LoadEnum["None"] = "None";
    })(LoadEnum = web3d.LoadEnum || (web3d.LoadEnum = {}));
    class AssetLoadInfo {
        constructor(url) {
            this.beSucces = false;
            this.url = url;
        }
        set err(err) {
            this._err = err;
            console.error(err);
        }
        ;
        get err() {
            return this._err;
        }
    }
    web3d.AssetLoadInfo = AssetLoadInfo;
    class DefaultAssetMgr {
        constructor() {
            this.mapDefaultMesh = {};
            this.mapDefaultTexture = {};
            this.mapDefaultCubeTexture = {};
            this.mapDefaultMat = {};
        }
        initDefAsset() {
            web3d.DefTexture.initDefaultTexture();
            web3d.DefMesh.initDefaultMesh();
            web3d.DefShader.initDefaultShader();
            web3d.DefMatrial.initDefaultMat();
        }
        getDefaultMesh(name) {
            return this.mapDefaultMesh[name];
        }
        getDefaultTexture(name) {
            return this.mapDefaultTexture[name];
        }
        getDefaultCubeTexture(name) {
            return this.mapDefaultCubeTexture[name];
        }
        getDefaultMaterial(name) {
            return this.mapDefaultMat[name];
        }
    }
    web3d.DefaultAssetMgr = DefaultAssetMgr;
    class AssetMgr extends DefaultAssetMgr {
        constructor() {
            super();
            this.mapShader = {};
            this.loadMap = {};
            this.loadingUrl = {};
            this.loadMapBundle = {};
            this.shaderMgr = new webGraph.ShaderMgr();
        }
        static RegisterAssetLoader(extral, factory) {
            this.RESLoadDic[extral] = factory;
        }
        static RegisterAssetExtensionLoader(extral, factory) {
            this.RESExtensionLoadDic[extral] = factory;
        }
        getShader(name) {
            return this.mapShader[name];
        }
        getAssetLoadInfo(url) {
            if (this.loadMap[url]) {
                return this.loadMap[url].loadinfo;
            }
            else {
                return null;
            }
        }
        load(url, onFinish = null, onProgress = null) {
            if (this.loadMap[url]) {
                if (onFinish) {
                    switch (this.loadMap[url].asset.loadState) {
                        case LoadEnum.Success:
                        case LoadEnum.Failed:
                            onFinish(this.loadMap[url].asset, this.loadMap[url].loadinfo);
                            break;
                        case LoadEnum.Loading:
                            if (this.loadingUrl[url] == null) {
                                this.loadingUrl[url] = [];
                            }
                            this.loadingUrl[url].push(onFinish);
                            break;
                        default:
                        case LoadEnum.None:
                            console.error("load error 为啥出现这种情况！");
                            break;
                    }
                }
                return this.loadMap[url].asset;
            }
            else {
                let extralType = AssetMgr.getAssetExtralName(url);
                let _state = new AssetLoadInfo(url);
                if (AssetMgr.RESLoadDic[extralType] == null) {
                    let errorMsg = "ERROR: load Asset error. INfo: not have Load Func to handle (" + AssetMgr.getAssetExtralName(url) + ") type File.  load URL:" + url;
                    _state.err = new Error(errorMsg);
                    console.error(errorMsg);
                    this.loadMap[url] = { asset: null, loadinfo: _state };
                    if (onFinish) {
                        onFinish(null, _state);
                    }
                    return null;
                }
                else {
                    let factory = AssetMgr.RESLoadDic[extralType]();
                    let asset = factory.load(url, _state, (asset, state) => {
                        if (state.beSucces) {
                            asset.loadState = LoadEnum.Success;
                            if (asset.onLoadEnd) {
                                asset.onLoadEnd();
                            }
                            if (factory instanceof web3d.LoadShader) {
                                let name = AssetMgr.getFileName(url);
                                this.mapShader[name] = asset;
                            }
                        }
                        else {
                            asset.loadState = LoadEnum.Failed;
                        }
                        let arr = this.loadingUrl[url];
                        this.loadingUrl[url] = null;
                        delete this.loadingUrl[url];
                        if (onFinish) {
                            onFinish(asset, state);
                        }
                        if (arr) {
                            arr.forEach((func) => {
                                func(asset, state);
                            });
                        }
                    }, (state) => {
                        if (onProgress) {
                            onProgress(state);
                        }
                    });
                    asset.loadState = LoadEnum.Loading;
                    this.loadMap[url] = { asset: asset, loadinfo: _state };
                    return asset;
                }
            }
        }
        loadAsync(url) {
            return new Promise((resolve, reject) => {
                this.load(url, (asset, loadInfo) => {
                    if (loadInfo.beSucces) {
                        resolve(asset);
                    }
                    else {
                        reject(new Error("Load Failed."));
                    }
                });
            });
        }
        loadTypedAsset(url, type, onFinish = null, onProgress = null) {
            if (this.loadMap[url]) {
                if (onFinish) {
                    switch (this.loadMap[url].asset.loadState) {
                        case LoadEnum.Success:
                        case LoadEnum.Failed:
                            onFinish(this.loadMap[url].asset, this.loadMap[url].loadinfo);
                            break;
                        case LoadEnum.Loading:
                            if (this.loadingUrl[url] == null) {
                                this.loadingUrl[url] = [];
                            }
                            this.loadingUrl[url].push(onFinish);
                            break;
                        default:
                        case LoadEnum.None:
                            console.error("load error 为啥出现这种情况！");
                            break;
                    }
                }
                return this.loadMap[url].asset;
            }
            else {
                let extralType = type;
                let _state = new AssetLoadInfo(url);
                if (AssetMgr.RESLoadDic[extralType] == null) {
                    let errorMsg = "ERROR: load Asset error. INfo: not have Load Func to handle (" + AssetMgr.getAssetExtralName(url) + ") type File.  load URL:" + url;
                    _state.err = new Error(errorMsg);
                    console.error(errorMsg);
                    this.loadMap[url] = { asset: null, loadinfo: _state };
                    if (onFinish) {
                        onFinish(null, _state);
                    }
                    return null;
                }
                else {
                    let factory = AssetMgr.RESLoadDic[extralType]();
                    let asset = factory.load(url, _state, (asset, state) => {
                        if (state.beSucces) {
                            asset.loadState = LoadEnum.Success;
                            if (asset.onLoadEnd) {
                                asset.onLoadEnd();
                            }
                            if (factory instanceof web3d.LoadShader) {
                                let name = AssetMgr.getFileName(url);
                                this.mapShader[name] = asset;
                            }
                        }
                        else {
                            asset.loadState = LoadEnum.Failed;
                        }
                        let arr = this.loadingUrl[url];
                        this.loadingUrl[url] = null;
                        delete this.loadingUrl[url];
                        if (onFinish) {
                            onFinish(asset, state);
                        }
                        if (arr) {
                            arr.forEach((func) => {
                                func(asset, state);
                            });
                        }
                    }, (state) => {
                        if (onProgress) {
                            onProgress(state);
                        }
                    });
                    asset.loadState = LoadEnum.Loading;
                    this.loadMap[url] = { asset: asset, loadinfo: _state };
                    return asset;
                }
            }
        }
        static getFileName(url) {
            let filei = url.lastIndexOf("/");
            let file = url.substr(filei + 1);
            return file;
        }
        static getFileNameWithoutExtralName(url) {
            let filei = url.lastIndexOf("/");
            let file = url.substr(filei + 1);
            let index = file.indexOf(".", 0);
            let name = file.substr(0, index);
            return name;
        }
        static getAssetExtralName(url) {
            let index = url.lastIndexOf("/");
            let filename = url.substr(index + 1);
            index = filename.indexOf(".", 0);
            let extname = filename.substr(index);
            return extname;
        }
    }
    AssetMgr.RESLoadDic = {};
    AssetMgr.RESExtensionLoadDic = {};
    web3d.AssetMgr = AssetMgr;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DefMatrial {
        static initDefaultMat() {
            let mat = new web3d.Material("def");
            let shader = web3d.assetMgr.getShader("def");
            mat.setShader(shader);
            let textue = web3d.assetMgr.getDefaultTexture("grid");
            mat.setTexture("_MainTex", textue);
            mat.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            web3d.assetMgr.mapDefaultMat["def"] = mat;
            let mat1 = new web3d.Material("defcolor");
            let shader1 = web3d.assetMgr.getShader("defcolor");
            mat1.setShader(shader1);
            mat1.setVector4("_MainColor", MathD.vec4.create(1, 1, 1, 1));
            web3d.assetMgr.mapDefaultMat["defcolor"] = mat1;
            let mat2 = new web3d.Material("deferror");
            let shader2 = web3d.assetMgr.getShader("deferror");
            mat2.setShader(shader2);
            web3d.assetMgr.mapDefaultMat["deferror"] = mat2;
            let mat3 = new web3d.Material("text3d");
            let shader_text3d = web3d.assetMgr.getShader("text3d");
            mat3.setShader(shader_text3d);
            mat3.setTexture("_MainTex", web3d.DynamicFont.fontTex);
            web3d.assetMgr.mapDefaultMat["text3d"] = mat3;
        }
    }
    web3d.DefMatrial = DefMatrial;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DefMesh {
        static initDefaultMesh() {
            web3d.assetMgr.mapDefaultMesh["quad"] = this.createDefaultMesh("quad");
            web3d.assetMgr.mapDefaultMesh["cube"] = this.createDefaultMesh("cube");
            web3d.assetMgr.mapDefaultMesh["UI_base"] = this.createDefaultMesh_UIQuad("UI_base");
        }
        static createDefaultMesh(name) {
            switch (name) {
                case "quad":
                    let mesh = new web3d.Mesh("quad", null, true);
                    let pos = [-0.5, -0.5, 0,
                        0.5, -0.5, 0,
                        0.5, 0.5, 0,
                        -0.5, 0.5, 0];
                    let uv = [0, 0, 1, 0, 1, 1, 0, 1];
                    mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position, pos);
                    mesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0, uv);
                    let trisindex = [0, 2, 1, 0, 3, 2];
                    mesh.setIndexData(trisindex);
                    let info = new web3d.subMeshInfo();
                    info.start = 0;
                    info.size = 6;
                    mesh.submeshs.push(info);
                    mesh.createVbowithAtts();
                    return mesh;
                case "cube":
                    let cubemesh = new web3d.Mesh("cube", null, true);
                    let cubepos = [0.5, -0.5, 0.5,
                        -0.5, -0.5, 0.5,
                        0.5, 0.5, 0.5,
                        -0.5, 0.5, 0.5,
                        0.5, 0.5, -0.5,
                        -0.5, 0.5, -0.5,
                        0.5, -0.5, -0.5,
                        -0.5, -0.5, -0.5,
                        0.5, 0.5, 0.5,
                        -0.5, 0.5, 0.5,
                        0.5, 0.5, -0.5,
                        -0.5, 0.5, -0.5,
                        0.5, -0.5, -0.5,
                        -0.5, -0.5, 0.5,
                        -0.5, -0.5, -0.5,
                        0.5, -0.5, 0.5,
                        -0.5, -0.5, 0.5,
                        -0.5, 0.5, -0.5,
                        -0.5, -0.5, -0.5,
                        -0.5, 0.5, 0.5,
                        0.5, -0.5, -0.5,
                        0.5, 0.5, 0.5,
                        0.5, -0.5, 0.5,
                        0.5, 0.5, -0.5
                    ];
                    let cubeuv = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
                        0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
                        0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0
                    ];
                    cubemesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position, cubepos);
                    cubemesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0, cubeuv);
                    let cubetrisindex = [0, 3, 1,
                        0, 2, 3,
                        8, 5, 9,
                        8, 4, 5,
                        10, 7, 11,
                        10, 6, 7,
                        12, 13, 14,
                        12, 15, 13,
                        16, 17, 18,
                        16, 19, 17,
                        20, 21, 22,
                        20, 23, 21];
                    cubemesh.setIndexData(cubetrisindex);
                    let cubeinfo = new web3d.subMeshInfo();
                    cubeinfo.start = 0;
                    cubeinfo.size = 36;
                    cubemesh.submeshs.push(cubeinfo);
                    cubemesh.createVbowithAtts();
                    return cubemesh;
            }
        }
        static createDefaultMesh_UIQuad(name) {
            let mesh = new web3d.Mesh(name, null, true);
            let pos = [0, 0,
                1, 0,
                0, 1,
                1, 1];
            let uv = [0, 0, 1, 0, 0, 1, 1, 1];
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position, pos, { componentSize: 2 });
            mesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0, uv);
            let trisindex = [0, 2, 3, 0, 3, 1];
            mesh.setIndexData(trisindex);
            let info = new web3d.subMeshInfo();
            info.start = 0;
            info.size = 6;
            mesh.submeshs.push(info);
            mesh.createVbowithAtts();
            return mesh;
        }
    }
    web3d.DefMesh = DefMesh;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DefShader {
        static initDefaultShader() {
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "defui", DefShader.UI_vscode);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS, "defui", DefShader.UI_fscode);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "def", DefShader.vsColor);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "text3d", DefShader.text3d);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS, "def", DefShader.fsColor);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "def_skin", DefShader.vscolor_skin);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "deferror", DefShader.def_error_vs);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS, "deferror", DefShader.def_error_fs);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "defcolor", DefShader.vs_color);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, "defcolor_skin", DefShader.vs_color_skin);
            web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS, "defcolor", DefShader.fs_color);
            {
                let sh = new web3d.Shader("defui", null, true);
                let pro = web3d.assetMgr.shaderMgr.CreatProgram("defui", "defui", "base");
                let option = new webGraph.StateOption();
                option.setZstate(false, false);
                pro.state = option;
                let p = new web3d.ShaderPass();
                p.program.push(pro);
                sh.passes = {};
                sh.mapUniformDef = {};
                sh.layer = web3d.RenderLayerEnum.Geometry;
                let tex = web3d.assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"] = { type: webGraph.UniformTypeEnum.TEXTURE, value: tex };
                sh.passes[web3d.DrawTypeEnum.BASE] = p;
                web3d.assetMgr.mapShader[sh.name] = sh;
            }
            {
                let sh = new web3d.Shader("def", null, true);
                let pro = web3d.assetMgr.shaderMgr.CreatProgram("def", "def", "base");
                let option = new webGraph.StateOption();
                pro.state = option;
                let p = new web3d.ShaderPass();
                p.program.push(pro);
                sh.passes = {};
                sh.mapUniformDef = {};
                sh.layer = web3d.RenderLayerEnum.Geometry;
                let tex = web3d.assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"] = { type: webGraph.UniformTypeEnum.TEXTURE, value: tex };
                sh.mapUniformDef["_MainColor"] = { type: webGraph.UniformTypeEnum.FLOAT_VEC4, value: MathD.vec4.create(0, 1, 0, 1) };
                sh.passes[web3d.DrawTypeEnum.BASE] = p;
                let skinpro = web3d.assetMgr.shaderMgr.CreatProgram("def_skin", "def", "skin");
                skinpro.state = option;
                let skinpass = new web3d.ShaderPass();
                skinpass.program.push(skinpro);
                sh.passes[web3d.DrawTypeEnum.SKIN] = skinpass;
                web3d.assetMgr.mapShader[sh.name] = sh;
            }
            {
                let sh = new web3d.Shader("defcolor", null, true);
                let pro = web3d.assetMgr.shaderMgr.CreatProgram("defcolor", "defcolor", "base");
                let option = new webGraph.StateOption();
                pro.state = option;
                let p = new web3d.ShaderPass();
                p.program.push(pro);
                sh.passes = {};
                sh.mapUniformDef = {};
                sh.layer = web3d.RenderLayerEnum.Geometry;
                sh.passes[web3d.DrawTypeEnum.BASE] = p;
                let skinpro = web3d.assetMgr.shaderMgr.CreatProgram("defcolor_skin", "defcolor", "skin");
                skinpro.state = option;
                let skinpass = new web3d.ShaderPass();
                skinpass.program.push(skinpro);
                sh.passes[web3d.DrawTypeEnum.SKIN] = skinpass;
                web3d.assetMgr.mapShader[sh.name] = sh;
            }
            {
                let sh = new web3d.Shader("text3d", null, true);
                let pro = web3d.assetMgr.shaderMgr.CreatProgram("text3d", "def", "base");
                let option = new webGraph.StateOption();
                option.setBlend(webGraph.BlendModeEnum.Blend_PreMultiply);
                option.setZstate(false, false);
                pro.state = option;
                let p = new web3d.ShaderPass();
                p.program.push(pro);
                sh.passes = {};
                sh.mapUniformDef = {};
                sh.layer = web3d.RenderLayerEnum.Geometry;
                let tex = web3d.assetMgr.getDefaultTexture("grid");
                sh.mapUniformDef["_MainTex"] = { type: webGraph.UniformTypeEnum.TEXTURE, value: tex };
                sh.mapUniformDef["_MainColor"] = { type: webGraph.UniformTypeEnum.FLOAT_VEC4, value: MathD.vec4.create(1, 1, 1, 1) };
                sh.passes[web3d.DrawTypeEnum.BASE] = p;
                web3d.assetMgr.mapShader[sh.name] = sh;
            }
            {
                let sh = new web3d.Shader("deferror", null, true);
                let pro = web3d.assetMgr.shaderMgr.CreatProgram("deferror", "deferror", "base");
                pro.state = new webGraph.StateOption();
                let p = new web3d.ShaderPass();
                p.program.push(pro);
                sh.passes = {};
                sh.mapUniformDef = {};
                sh.layer = web3d.RenderLayerEnum.Geometry;
                sh.passes[web3d.DrawTypeEnum.BASE] = p;
                web3d.assetMgr.mapShader[sh.name] = sh;
            }
        }
    }
    DefShader.UI_vscode = "\
        attribute vec2 a_pos;   \
        attribute vec4 a_texcoord0;         \
        uniform highp mat3 u_mat_ui;      \
        varying highp vec2 xlv_TEXCOORD0;           \
        void main()                                     \
        {                                               \
            highp vec3 tmplet_1=u_mat_ui*vec3(a_pos,1.0);                        \
            xlv_TEXCOORD0 = a_texcoord0.xy;     \
            gl_Position = vec4(tmplet_1,1.0);  \
        }";
    DefShader.UI_fscode = "         \
        uniform sampler2D _MainTex;                                                 \
        varying highp vec2 xlv_TEXCOORD0;   \
        void main() \
        {\
            lowp vec4 tmplet_3= texture2D(_MainTex, xlv_TEXCOORD0);\
            gl_FragData[0] = tmplet_3;\
        }\
        ";
    DefShader.vs_color = "\
        attribute vec4 a_pos;\
        uniform highp mat4 u_mat_mvp;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz = a_pos.xyz;\
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
    DefShader.fs_color = "\
        uniform highp vec4 _MainColor;\
        void main()\
        {\
            gl_FragData[0] = _MainColor;\
        }";
    DefShader.vs_color_skin = "\
        attribute vec4 a_pos;\
        uniform highp mat4 u_mat_viewproject;\
        attribute lowp vec4 a_blendindex4;\
        attribute lowp vec4 a_blendweight4;\
        uniform highp mat4 u_jointMatirx[55];\
        highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)\
        {\
            mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x \
                     + u_jointMatirx[int(blendIndex.y)]*blendWeight.y \
                     + u_jointMatirx[int(blendIndex.z)]*blendWeight.z \
                     + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;\
            return mat;\
        }\
        void main()\
        {\
            highp vec4 position=vec4(a_pos.xyz,1.0);\
            position = u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;;\
            gl_Position =position;\
        }";
    DefShader.vsColor = "\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_mvp;\
        varying highp vec2 xlv_TEXCOORD0;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz = a_pos.xyz;\
            xlv_TEXCOORD0 = a_texcoord0.xy;     \
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
    DefShader.text3d = "\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_project;\
        varying highp vec2 xlv_TEXCOORD0;\
        void main()\
        {\
            highp vec4 tmplet_1;\
            tmplet_1.w = 1.0;\
            tmplet_1.xyz =a_pos.xyz;\
            xlv_TEXCOORD0 = a_texcoord0.xy;\
            gl_Position = u_mat_project* tmplet_1;\
        }";
    DefShader.vscolor_skin = "\
        attribute vec4 a_pos;\
        attribute vec4 a_texcoord0;\
        uniform highp mat4 u_mat_viewproject;\
        varying highp vec2 xlv_TEXCOORD0;\
        attribute lowp vec4 a_blendindex4;\
        attribute lowp vec4 a_blendweight4;\
        uniform highp mat4 u_jointMatirx[55];\
        highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)\
        {\
            mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x \
                     + u_jointMatirx[int(blendIndex.y)]*blendWeight.y \
                     + u_jointMatirx[int(blendIndex.z)]*blendWeight.z \
                     + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;\
            return mat;\
        }\
        void main()\
        {\
            highp vec4 position=vec4(a_pos.xyz,1.0);\
            xlv_TEXCOORD0 = a_texcoord0.xy;\
            position = u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;;\
            gl_Position =position;\
        }";
    DefShader.fsColor = "\
        uniform sampler2D _MainTex;\
        uniform highp vec4 _MainColor;\
        varying highp vec2 xlv_TEXCOORD0;   \
        void main()\
        {\
            lowp vec4 tmplet_3= (_MainColor * texture2D(_MainTex, xlv_TEXCOORD0));\
            gl_FragData[0] = tmplet_3;\
        }";
    DefShader.def_error_vs = "\
        attribute vec3 a_pos;\
        uniform highp mat4 u_mat_mvp;\
        void main()\
        {\
            highp vec4 tmplet_1=vec4(a_pos.xyz,1.0);\
            gl_Position = (u_mat_mvp * tmplet_1);\
        }";
    DefShader.def_error_fs = "\
        void main()\
        {\
            gl_FragData[0] = vec4(1,0,0,1);\
        }";
    DefShader.add_vs = "\
        attribute highp vec3 a_pos;\
        //attribute lowp vec4 a_color;\
        attribute mediump vec2 a_texcoord0;\
        uniform highp mat4 u_mat_mvp;\
        uniform mediump vec4 _MainTex_ST;\
        uniform mediump vec4 _Mask_ST;\
        uniform mediump vec4 _Main_Color;\
        varying mediump vec2 _maintex_uv;\
        varying mediump vec2 _mask_uv;\
        varying lowp vec4 v_color;\
        void main()\
        {\
            _maintex_uv = a_texcoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;\
            _mask_uv = a_texcoord0.xy * _Mask_ST.xy + _Mask_ST.zw;\
            v_color =_Main_Color;\
            gl_Position = (u_mat_mvp * vec4(a_pos.xyz, 1.0));\
        }";
    DefShader.add_fs = "\
        uniform sampler2D _MainTex; \
        uniform sampler2D _Mask; \
        varying lowp vec4 v_color;\
        varying mediump vec2 _maintex_uv;\
        varying mediump vec2 _mask_uv;\
        void main()\
        {\
            lowp vec4 basecolor=texture2D(_MainTex,_maintex_uv);\
            lowp vec4 mask_color=texture2D(_Mask,_mask_uv);\
            lowp vec3 tempcolor=v_color.rgb*basecolor.rgb*2.0;\
            //lowp vec3 tempcolor=v_color.rgb*basecolor.rgb*4.0*basecolor.a;\
            lowp float tempAlpha=basecolor.a*v_color.a*2.0;\
            gl_FragData[0]=vec4(tempcolor,tempAlpha);\
        }";
    web3d.DefShader = DefShader;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DefTexture {
        static initDefaultTexture() {
            let white = new web3d.Texture("white", null, true);
            white.glTexture = getdefTexture(defTextureEnum.white);
            web3d.assetMgr.mapDefaultTexture["white"] = white;
            let gray = new web3d.Texture("gray", null, true);
            gray.glTexture = getdefTexture(defTextureEnum.gray);
            web3d.assetMgr.mapDefaultTexture["gray"] = gray;
            let grid = new web3d.Texture("grid", null, true);
            grid.glTexture = getdefTexture(defTextureEnum.grid);
            web3d.assetMgr.mapDefaultTexture["grid"] = grid;
            let cube = new web3d.CubeTexture("black", null, true);
            let blackData = new Uint8ClampedArray(4);
            blackData[0] = blackData[1] = blackData[2] = 0;
            blackData[3] = 255;
            let defimagedata = new ImageData(blackData, 1, 1);
            let whiteData = new Uint8ClampedArray(4);
            whiteData[0] = whiteData[1] = whiteData[2] = whiteData[3] = 255;
            let defimagedata2 = new ImageData(whiteData, 1, 1);
            let imagedataArr = [];
            for (let i = 0; i < 9; i++) {
                if (i > 6) {
                    imagedataArr.push(defimagedata2);
                }
                else {
                    imagedataArr.push(defimagedata);
                }
            }
            let cubtex = new webGraph.CubeTex(imagedataArr);
            cube.glTexture = cubtex;
            web3d.assetMgr.mapDefaultCubeTexture["black"] = cube;
        }
    }
    web3d.DefTexture = DefTexture;
    let defTextureEnum;
    (function (defTextureEnum) {
        defTextureEnum[defTextureEnum["gray"] = 0] = "gray";
        defTextureEnum[defTextureEnum["white"] = 1] = "white";
        defTextureEnum[defTextureEnum["black"] = 2] = "black";
        defTextureEnum[defTextureEnum["grid"] = 3] = "grid";
    })(defTextureEnum = web3d.defTextureEnum || (web3d.defTextureEnum = {}));
    function getdefTexture(type) {
        let data;
        let width = 1;
        let height = 1;
        switch (type) {
            case defTextureEnum.gray:
                data = new Uint8Array(4);
                data[0] = 128;
                data[1] = 128;
                data[2] = 128;
                data[3] = 255;
                break;
            case defTextureEnum.white:
                data = new Uint8Array(4);
                data[0] = 255;
                data[1] = 255;
                data[2] = 255;
                data[3] = 255;
                break;
            case defTextureEnum.black:
                data = new Uint8Array(4);
                data[0] = 0;
                data[1] = 0;
                data[2] = 0;
                data[3] = 255;
                break;
            case defTextureEnum.grid:
                width = 256;
                height = 256;
                data = new Uint8Array(width * width * 4);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        let seek = (y * width + x) * 4;
                        if (((x - width * 0.5) * (y - height * 0.5)) > 0) {
                            data[seek] = 0;
                            data[seek + 1] = 0;
                            data[seek + 2] = 0;
                            data[seek + 3] = 255;
                        }
                        else {
                            data[seek] = 255;
                            data[seek + 1] = 255;
                            data[seek + 2] = 255;
                            data[seek + 3] = 255;
                        }
                    }
                }
                break;
        }
        let texop = new webGraph.TextureOption();
        texop.data = data;
        texop.width = width;
        texop.height = height;
        let texture = new webGraph.Texture2D(data, texop);
        return texture;
    }
    web3d.getdefTexture = getdefTexture;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class PrimitiveNode {
    }
    web3d.PrimitiveNode = PrimitiveNode;
    class ParsePrimitiveNode {
        static get vertexAttMap() {
            if (!this.beinit) {
                this._vertexAttDic["POSITION"] = { type: webGraph.VertexAttTypeEnum.Position, location: webGraph.VertexAttLocationEnum.Position };
                this._vertexAttDic["NORMAL"] = { type: webGraph.VertexAttTypeEnum.Normal, location: webGraph.VertexAttLocationEnum.Normal };
                this._vertexAttDic["TEXCOORD_0"] = { type: webGraph.VertexAttTypeEnum.UV0, location: webGraph.VertexAttLocationEnum.UV0 };
                this._vertexAttDic["TEXCOORD_1"] = { type: webGraph.VertexAttTypeEnum.UV1, location: webGraph.VertexAttLocationEnum.UV1 };
                this._vertexAttDic["COLOR_0"] = { type: webGraph.VertexAttTypeEnum.Color0, location: webGraph.VertexAttLocationEnum.Color0 };
                this._vertexAttDic["TANGENT"] = { type: webGraph.VertexAttTypeEnum.Tangent, location: webGraph.VertexAttLocationEnum.Tangent };
                this._vertexAttDic["JOINTS_0"] = { type: webGraph.VertexAttTypeEnum.BlendIndex4, location: webGraph.VertexAttLocationEnum.BlendIndex4 };
                this._vertexAttDic["WEIGHTS_0"] = { type: webGraph.VertexAttTypeEnum.BlendWeight4, location: webGraph.VertexAttLocationEnum.BlendWeight4 };
                this.beinit = true;
            }
            return this._vertexAttDic;
        }
        static parse(node, loader) {
            const promises = new Array();
            let nodedata = new PrimitiveNode();
            promises.push(this.parseMesh(node, loader).then((mesh) => {
                nodedata.mesh = mesh;
            }));
            promises.push(this.parseMaterial(node, loader).then((mat) => {
                nodedata.mat = mat;
            }));
            return Promise.all(promises).then(() => {
                return nodedata;
            });
        }
        static parseMesh(node, loader) {
            let promise = loader.getExtensionData(node, this.extensionName);
            if (promise) {
                return promise;
            }
            let mesh = new web3d.Mesh();
            let attributes = node.attributes;
            let index = node.indices;
            if (index == null)
                return null;
            let vbopro = this.parseVboData(attributes, mesh, loader);
            let ebopro = this.parseEboData(index, mesh, loader);
            return Promise.all([vbopro, ebopro]).then(() => {
                mesh.createVbowithAtts();
                return mesh;
            });
        }
        static parseMaterial(node, loader) {
            let matindex = node.material;
            if (matindex != null) {
                return web3d.ParseMaterialNode.parse(matindex, loader);
            }
            else {
                return Promise.resolve(null);
            }
        }
        static parseVboData(attributes, mesh, loader) {
            let taskArr = [];
            for (let key in attributes) {
                let index = attributes[key];
                taskArr.push(this.parseVertexAtt(index, key, mesh, loader));
            }
            return Promise.all(taskArr).then(() => { });
        }
        static parseVertexAtt(index, type, mesh, loader) {
            let attinfo = ParsePrimitiveNode.vertexAttMap[type];
            if (attinfo == null) {
                console.error("gltf mesh attribute type not handle yet.");
                return Promise.reject("gltf mesh attribute type not handle yet.");
            }
            else {
                return web3d.parseAccessorNode.parse(index, loader).then((node) => {
                    if (node == null) {
                        return Promise.reject("loadfailed");
                    }
                    else {
                        mesh.setVertexAttData(attinfo.type, node.view, { componentSize: node.componentSize, componentDataType: node.componentType, viewByteStride: node.byteStride });
                    }
                });
            }
        }
        static parseEboData(index, mesh, loader) {
            return new Promise((resolve, reject) => {
                web3d.parseAccessorNode.parse(index, loader).then((node) => {
                    if (node) {
                        if (node.view instanceof Uint16Array || node.view instanceof Uint32Array) {
                            mesh.setIndexData(node.view);
                        }
                        else {
                            let trisindex = new Uint16Array(node.count);
                            for (let i = 0; i < trisindex.length; i++) {
                                trisindex[i] = node.data[i];
                            }
                            mesh.setIndexData(trisindex);
                        }
                        let submeshinfo = new web3d.subMeshInfo();
                        submeshinfo.size = mesh.trisindex.length;
                        mesh.submeshs = [];
                        mesh.submeshs.push(submeshinfo);
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        }
    }
    ParsePrimitiveNode.beinit = false;
    ParsePrimitiveNode._vertexAttDic = {};
    ParsePrimitiveNode.extensionName = "KHR_draco_mesh_compression";
    web3d.ParsePrimitiveNode = ParsePrimitiveNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class glTFBundle extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.meshNodeCache = {};
            this.skinNodeCache = {};
            this.bufferviewNodeCache = {};
            this.bufferNodeCache = {};
            this.materialNodeCache = {};
            this.textrueNodeCache = {};
            this.beContainAnimation = false;
            this.animationNodeCache = {};
            this.nodeDic = {};
            this.type = "glTFBundle";
            let index = url.lastIndexOf("/");
            let dirpath = url.substring(0, index);
            this.rootURL = dirpath;
        }
        Instantiate() {
            let gltf = this.gltf;
            let sceneindex = gltf.scene;
            if (sceneindex == null)
                return null;
            if (gltf.scenes == null)
                return null;
            let sceneRoot = new web3d.GameObject();
            if (this.beContainAnimation) {
                this.bundleAnimator = sceneRoot.addComponent("Animator");
                for (let key in this.animationNodeCache) {
                    let clip = this.animationNodeCache[key];
                    this.bundleAnimator.addClip(clip);
                }
            }
            let scene = gltf.scenes[sceneindex];
            for (let k = 0; k < scene.nodes.length; k++) {
                let nodeIndex = scene.nodes[k];
                if (gltf.nodes == null)
                    return;
                let trans = web3d.ParseSceneNode.parse(nodeIndex, this);
                sceneRoot.transform.addChild(trans);
            }
            return sceneRoot.transform;
        }
        dispose() {
        }
    }
    glTFBundle.BeUsePBRMaterial = false;
    web3d.glTFBundle = glTFBundle;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let AccessorComponentType;
    (function (AccessorComponentType) {
        AccessorComponentType[AccessorComponentType["BYTE"] = 5120] = "BYTE";
        AccessorComponentType[AccessorComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        AccessorComponentType[AccessorComponentType["SHORT"] = 5122] = "SHORT";
        AccessorComponentType[AccessorComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        AccessorComponentType[AccessorComponentType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        AccessorComponentType[AccessorComponentType["FLOAT"] = 5126] = "FLOAT";
    })(AccessorComponentType = web3d.AccessorComponentType || (web3d.AccessorComponentType = {}));
    let AccessorType;
    (function (AccessorType) {
        AccessorType["SCALAR"] = "SCALAR";
        AccessorType["VEC2"] = "VEC2";
        AccessorType["VEC3"] = "VEC3";
        AccessorType["VEC4"] = "VEC4";
        AccessorType["MAT2"] = "MAT2";
        AccessorType["MAT3"] = "MAT3";
        AccessorType["MAT4"] = "MAT4";
    })(AccessorType = web3d.AccessorType || (web3d.AccessorType = {}));
    let AnimationChannelTargetPath;
    (function (AnimationChannelTargetPath) {
        AnimationChannelTargetPath["TRANSLATION"] = "translation";
        AnimationChannelTargetPath["ROTATION"] = "rotation";
        AnimationChannelTargetPath["SCALE"] = "scale";
        AnimationChannelTargetPath["WEIGHTS"] = "weights";
    })(AnimationChannelTargetPath = web3d.AnimationChannelTargetPath || (web3d.AnimationChannelTargetPath = {}));
    let AnimationSamplerInterpolation;
    (function (AnimationSamplerInterpolation) {
        AnimationSamplerInterpolation["LINEAR"] = "LINEAR";
        AnimationSamplerInterpolation["STEP"] = "STEP";
        AnimationSamplerInterpolation["CUBICSPLINE"] = "CUBICSPLINE";
    })(AnimationSamplerInterpolation = web3d.AnimationSamplerInterpolation || (web3d.AnimationSamplerInterpolation = {}));
    let CameraType;
    (function (CameraType) {
        CameraType["PERSPECTIVE"] = "perspective";
        CameraType["ORTHOGRAPHIC"] = "orthographic";
    })(CameraType = web3d.CameraType || (web3d.CameraType = {}));
    let ImageMimeType;
    (function (ImageMimeType) {
        ImageMimeType["JPEG"] = "image/jpeg";
        ImageMimeType["PNG"] = "image/png";
    })(ImageMimeType = web3d.ImageMimeType || (web3d.ImageMimeType = {}));
    let MaterialAlphaMode;
    (function (MaterialAlphaMode) {
        MaterialAlphaMode["OPAQUE"] = "OPAQUE";
        MaterialAlphaMode["MASK"] = "MASK";
        MaterialAlphaMode["BLEND"] = "BLEND";
    })(MaterialAlphaMode = web3d.MaterialAlphaMode || (web3d.MaterialAlphaMode = {}));
    let MeshPrimitiveMode;
    (function (MeshPrimitiveMode) {
        MeshPrimitiveMode[MeshPrimitiveMode["POINTS"] = 0] = "POINTS";
        MeshPrimitiveMode[MeshPrimitiveMode["LINES"] = 1] = "LINES";
        MeshPrimitiveMode[MeshPrimitiveMode["LINE_LOOP"] = 2] = "LINE_LOOP";
        MeshPrimitiveMode[MeshPrimitiveMode["LINE_STRIP"] = 3] = "LINE_STRIP";
        MeshPrimitiveMode[MeshPrimitiveMode["TRIANGLES"] = 4] = "TRIANGLES";
        MeshPrimitiveMode[MeshPrimitiveMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        MeshPrimitiveMode[MeshPrimitiveMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(MeshPrimitiveMode = web3d.MeshPrimitiveMode || (web3d.MeshPrimitiveMode = {}));
    let TextureMagFilter;
    (function (TextureMagFilter) {
        TextureMagFilter[TextureMagFilter["NEAREST"] = 9728] = "NEAREST";
        TextureMagFilter[TextureMagFilter["LINEAR"] = 9729] = "LINEAR";
    })(TextureMagFilter = web3d.TextureMagFilter || (web3d.TextureMagFilter = {}));
    let TextureMinFilter;
    (function (TextureMinFilter) {
        TextureMinFilter[TextureMinFilter["NEAREST"] = 9728] = "NEAREST";
        TextureMinFilter[TextureMinFilter["LINEAR"] = 9729] = "LINEAR";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_NEAREST"] = 9984] = "NEAREST_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_NEAREST"] = 9985] = "LINEAR_MIPMAP_NEAREST";
        TextureMinFilter[TextureMinFilter["NEAREST_MIPMAP_LINEAR"] = 9986] = "NEAREST_MIPMAP_LINEAR";
        TextureMinFilter[TextureMinFilter["LINEAR_MIPMAP_LINEAR"] = 9987] = "LINEAR_MIPMAP_LINEAR";
    })(TextureMinFilter = web3d.TextureMinFilter || (web3d.TextureMinFilter = {}));
    let TextureWrapMode;
    (function (TextureWrapMode) {
        TextureWrapMode[TextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
        TextureWrapMode[TextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
        TextureWrapMode[TextureWrapMode["REPEAT"] = 10497] = "REPEAT";
    })(TextureWrapMode = web3d.TextureWrapMode || (web3d.TextureWrapMode = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class GLTFUtils {
        static GetByteStrideFromType(accessor) {
            let type = accessor.type;
            switch (type) {
                case "VEC2": return 2 * 4;
                case "VEC3": return 3 * 4;
                case "VEC4": return 4 * 4;
                case "MAT2": return 4 * 4;
                case "MAT3": return 9 * 4;
                case "MAT4": return 16 * 4;
                default: return 1 * 4;
            }
        }
    }
    web3d.GLTFUtils = GLTFUtils;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadGlTF {
        constructor() {
            this.dependLoadInfos = [];
        }
        load(url, state, onFinish, onProgress) {
            this.url = url;
            let name = web3d.AssetMgr.getFileName(url);
            this.bundle = new web3d.glTFBundle(name, url);
            this.loadinfo = state;
            this.loadinfo.progress = new web3d.DownloadInfo();
            this.onProgress = onProgress;
            this.onFinish = onFinish;
            this.loadAsync().then(() => {
                this.loadinfo.beSucces = true;
                if (this.onFinish) {
                    this.onFinish(this.bundle, this.loadinfo);
                }
            });
            return this.bundle;
        }
        static regExtension(type, extension) {
            this.ExtensionDic[type] = extension;
        }
        getExtensionData(node, extendname) {
            if (node.extensions == null)
                return null;
            let extension = LoadGlTF.ExtensionDic[extendname];
            if (extension == null)
                return null;
            let info = node.extensions[extendname];
            if (info == null)
                return null;
            return extension.load(info, this);
        }
        loadAsync() {
            if (this.url.endsWith(".gltf")) {
                return this.loadglTFJson().then(() => {
                    let promises = [];
                    promises.push(this.relyOnTransTree());
                    promises.push(this.loadMeshNodes());
                    promises.push(this.loadSkinNodes());
                    return Promise.all(promises).then(() => {
                    });
                });
            }
            else {
                return this.loadglTFBin().then((value) => {
                    this.bundle.gltf = value.json;
                    for (let i = 0; i < value.chunkbin.length; i++) {
                        this.bundle.bufferNodeCache[i] = value.chunkbin[i].buffer;
                    }
                    let promises = [];
                    promises.push(this.relyOnTransTree());
                    promises.push(this.loadMeshNodes());
                    promises.push(this.loadSkinNodes());
                    return Promise.all(promises).then(() => {
                    });
                });
            }
        }
        loadglTFJson() {
            if (this.bundle.gltf) {
                return Promise.resolve(this.bundle.gltf);
            }
            else {
                return new Promise((resolve, reject) => {
                    web3d.loadJson(this.url, (txt, err) => {
                        if (err) {
                            let errorMsg = "ERROR: Load gltf .gltf file Error!\n Info: LOAD URL: " + this.url + "  LOAD MSG:" + err.message;
                            console.error(errorMsg);
                            reject();
                        }
                        else {
                            this.bundle.gltf = txt;
                            resolve(txt);
                        }
                    });
                });
            }
        }
        loadglTFBin() {
            return new Promise((resolve, reject) => {
                web3d.loadArrayBuffer(this.url, (bin, err) => {
                    if (err) {
                        let errorMsg = "ERROR: Load gltf .gltf file Error!\n Info: LOAD URL: " + this.url + "  LOAD MSG:" + err.message;
                        console.error(errorMsg);
                        reject();
                    }
                    else {
                        const Binary = {
                            Magic: 0x46546C67
                        };
                        let breader = new web3d.binReader(bin);
                        let magic = breader.readUint32();
                        if (magic !== Binary.Magic) {
                            throw new Error("Unexpected magic: " + magic);
                        }
                        let version = breader.readUint32();
                        if (version != 2) {
                            throw new Error("Unsupported version:" + version);
                        }
                        let length = breader.readUint32();
                        if (length !== breader.getLength()) {
                            throw new Error("Length in header does not match actual data length: " + length + " != " + breader.getLength());
                        }
                        let ChunkFormat = {
                            JSON: 0x4E4F534A,
                            BIN: 0x004E4942
                        };
                        let chunkLength = breader.readUint32();
                        let chunkFormat = breader.readUint32();
                        if (chunkFormat !== ChunkFormat.JSON) {
                            throw new Error("First chunk format is not JSON");
                        }
                        let _json = JSON.parse(breader.readUint8ArrToString(chunkLength));
                        let _chunkbin = [];
                        while (breader.canread() > 0) {
                            const chunkLength = breader.readUint32();
                            const chunkFormat = breader.readUint32();
                            switch (chunkFormat) {
                                case ChunkFormat.JSON:
                                    throw new Error("Unexpected JSON chunk");
                                case ChunkFormat.BIN:
                                    _chunkbin.push(breader.readUint8Array(chunkLength));
                                    break;
                                default:
                                    breader.skipBytes(chunkLength);
                                    break;
                            }
                        }
                        resolve({ json: _json, chunkbin: _chunkbin });
                    }
                });
            });
        }
        relyOnTransTree() {
            this.expandNodeData();
            let promises = [];
            promises.push(this.loadAnimations());
            return Promise.all(promises).then(() => {
            });
        }
        expandNodeData() {
            let gltf = this.bundle.gltf;
            if (gltf.scenes) {
                for (let i = 0; i < gltf.scenes.length; i++) {
                    let scene = gltf.scenes[i];
                    for (let k = 0; k < scene.nodes.length; k++) {
                        this.addNodeparent(gltf, scene.nodes[k]);
                    }
                }
            }
        }
        addNodeparent(gltf, index) {
            let node = gltf.nodes[index];
            if (node.name == null) {
                node.name = "node_" + index;
            }
            if (node.children) {
                for (let i = 0, len = node.children.length; i < len; i++) {
                    let childIndex = node.children[i];
                    let child = gltf.nodes[childIndex];
                    child.parent = index;
                    this.addNodeparent(gltf, childIndex);
                }
            }
        }
        getNodePath(nodes, index) {
            let node = nodes[index];
            let pathArr = [];
            while (node != null) {
                pathArr.unshift(node.name);
                if (node.parent != null) {
                    node = nodes[node.parent];
                }
                else {
                    node = null;
                }
            }
            return pathArr;
        }
        loadAnimations() {
            let promises = [];
            let gltf = this.bundle.gltf;
            if (gltf.animations != null) {
                if (gltf.animations.length > 0) {
                    this.bundle.beContainAnimation = true;
                }
                for (let i = 0; i < gltf.animations.length; i++) {
                    promises.push(web3d.ParseAnimationNode.parse(i, this));
                }
            }
            return Promise.all(promises).then(() => {
            });
        }
        loadMeshNodes() {
            let promises = [];
            let gltf = this.bundle.gltf;
            if (gltf.meshes != null) {
                for (let i = 0; i < gltf.meshes.length; i++) {
                    promises.push(web3d.ParseMeshNode.parse(i, this));
                }
            }
            return Promise.all(promises).then(() => {
            });
        }
        loadSkinNodes() {
            let promises = [];
            let gltf = this.bundle.gltf;
            if (gltf.skins != null) {
                for (let i = 0; i < gltf.skins.length; i++) {
                    promises.push(web3d.ParseSkinNode.parse(i, this));
                }
            }
            return Promise.all(promises).then(() => {
            });
        }
        loadDependAsset(url, onFinish = null, type = null) {
            if (type == null) {
                let asset = web3d.assetMgr.load(url, onFinish, () => {
                    this.executeOnprogress();
                });
                let loadinfo = web3d.assetMgr.getAssetLoadInfo(url);
                this.dependLoadInfos.push(loadinfo);
                return asset;
            }
            else {
                let asset = web3d.assetMgr.loadTypedAsset(url, type, onFinish, () => {
                    this.executeOnprogress();
                });
                let loadinfo = web3d.assetMgr.getAssetLoadInfo(url);
                this.dependLoadInfos.push(loadinfo);
                return asset;
            }
        }
        executeOnprogress() {
            let info = this.loadinfo.progress;
            info.loaded = 0;
            info.total = 0;
            for (let i = 0; i < this.dependLoadInfos.length; i++) {
                info.loaded += this.dependLoadInfos[i].progress.loaded;
                info.total += this.dependLoadInfos[i].progress.total;
            }
            if (this.onProgress) {
                this.onProgress(this.loadinfo.progress);
            }
        }
    }
    LoadGlTF.ExtensionDic = {};
    web3d.LoadGlTF = LoadGlTF;
    web3d.AssetMgr.RegisterAssetLoader(".gltf", () => new LoadGlTF());
    web3d.AssetMgr.RegisterAssetLoader(".glb", () => new LoadGlTF());
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class AccessorNode {
        constructor() {
            this.data = [];
        }
    }
    web3d.AccessorNode = AccessorNode;
    class parseAccessorNode {
        static parse(index, loader) {
            let accessor = loader.bundle.gltf.accessors[index];
            let node = new AccessorNode();
            node.componentSize = this.getComponentSize(accessor.type);
            node.componentType = accessor.componentType;
            node.count = accessor.count;
            node.byteSize = this.getByteSize(node.componentType, node.componentSize);
            let bufferdata;
            if (accessor.bufferView != null) {
                bufferdata = web3d.ParseBufferViewNode.parse(accessor.bufferView, loader);
            }
            else {
                let viewdata = new web3d.BufferviewNode();
                viewdata.view = this.GetTyedArryByLen(accessor.componentType, accessor.count);
                bufferdata = Promise.resolve(viewdata);
            }
            ;
            return bufferdata.then((viewnode) => {
                let byteoffset = accessor.byteOffset || 0;
                node.view = this.GetTypedArry(node.componentType, viewnode.view, byteoffset, node.componentSize * accessor.count);
                node.byteStride = viewnode.byteStride || node.byteSize;
                for (let i = 0; i < node.count; i++) {
                    let value = this.GetTypedArry(node.componentType, node.view, i * node.byteStride, node.componentSize);
                    node.data.push(value);
                }
                if (accessor.sparse) {
                    let sparseNode = accessor.sparse;
                    let indexPromise = web3d.ParseBufferViewNode.parse(sparseNode.indices.bufferView, loader);
                    let valuePromise = web3d.ParseBufferViewNode.parse(sparseNode.values.bufferView, loader);
                    Promise.all([indexPromise, valuePromise]).then(([indexViewNode, dataViewNode]) => {
                        let indexArr = this.GetTypedArry(sparseNode.indices.componentType, indexViewNode.view, sparseNode.indices.byteOffset, sparseNode.count);
                        let dataArr = this.GetTypedArry(accessor.componentType, dataViewNode.view, sparseNode.values.byteOffset, sparseNode.count);
                        for (let i = 0; i < indexArr.length; i++) {
                            let index = indexArr[i] * node.componentSize;
                            for (let k = 0; k < node.componentSize; k++) {
                                viewnode.view[index + k] = dataArr[index + k];
                            }
                        }
                        return node;
                    });
                }
                else {
                    return node;
                }
            });
        }
        static GetTyedArryByLen(componentType, Len) {
            switch (componentType) {
                case web3d.AccessorComponentType.BYTE: return new Int8Array(Len);
                case web3d.AccessorComponentType.UNSIGNED_BYTE: return new Uint8Array(Len);
                case web3d.AccessorComponentType.SHORT: return new Int16Array(Len);
                case web3d.AccessorComponentType.UNSIGNED_SHORT: return new Uint16Array(Len);
                case web3d.AccessorComponentType.UNSIGNED_INT: return new Uint32Array(Len);
                case web3d.AccessorComponentType.FLOAT: return new Float32Array(Len);
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
        static GetTypedArry(componentType, bufferview, byteOffset, Len) {
            let buffer = bufferview.buffer;
            byteOffset = bufferview.byteOffset + (byteOffset || 0);
            switch (componentType) {
                case web3d.AccessorComponentType.BYTE: return new Int8Array(buffer, byteOffset, Len);
                case web3d.AccessorComponentType.UNSIGNED_BYTE: return new Uint8Array(buffer, byteOffset, Len);
                case web3d.AccessorComponentType.SHORT: return new Int16Array(buffer, byteOffset, Len);
                case web3d.AccessorComponentType.UNSIGNED_SHORT: return new Uint16Array(buffer, byteOffset, Len);
                case web3d.AccessorComponentType.UNSIGNED_INT: return new Uint32Array(buffer, byteOffset, Len);
                case web3d.AccessorComponentType.FLOAT:
                    {
                        if ((byteOffset / 4) % 1 != 0) {
                            console.error("??");
                        }
                        return new Float32Array(buffer, byteOffset, Len);
                    }
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
        static getComponentSize(type) {
            switch (type) {
                case "SCALAR":
                    return 1;
                case "VEC2":
                    return 2;
                case "VEC3":
                    return 3;
                case "VEC4":
                case "MAT2":
                    return 4;
                case "MAT3":
                    return 9;
                case "MAT4":
                    return 16;
            }
        }
        static getByteSize(componentType, componentSize) {
            switch (componentType) {
                case web3d.AccessorComponentType.BYTE:
                    return componentSize * Int8Array.BYTES_PER_ELEMENT;
                case web3d.AccessorComponentType.UNSIGNED_BYTE:
                    return componentSize * Uint8Array.BYTES_PER_ELEMENT;
                case web3d.AccessorComponentType.SHORT:
                    return componentSize * Int16Array.BYTES_PER_ELEMENT;
                case web3d.AccessorComponentType.UNSIGNED_SHORT:
                    return componentSize * Uint16Array.BYTES_PER_ELEMENT;
                case web3d.AccessorComponentType.UNSIGNED_INT:
                    return componentSize * Uint32Array.BYTES_PER_ELEMENT;
                case web3d.AccessorComponentType.FLOAT:
                    return componentSize * Float32Array.BYTES_PER_ELEMENT;
                default: throw new Error(`Invalid component type ${componentType}`);
            }
        }
        static isInteger(obj) {
            return typeof obj === 'number' && obj % 1 === 0;
        }
    }
    web3d.parseAccessorNode = parseAccessorNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseAnimationNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            let animation = bundle.gltf.animations[index];
            let newAniclip = new web3d.AnimationClip(animation.name);
            let taskarr = [];
            for (let i = 0; i < animation.channels.length; i++) {
                let channeltarget = animation.channels[i].target;
                let sampleNode = animation.samplers[animation.channels[i].sampler];
                let channelTask = this.parseChannelData(channeltarget, sampleNode, loader).then((channel) => {
                    newAniclip.channels.push(channel);
                    if (channel.endFrame > newAniclip.totalFrame) {
                        newAniclip.totalFrame = channel.endFrame;
                    }
                });
                taskarr.push(channelTask);
            }
            return Promise.all(taskarr).then(() => {
                bundle.animationNodeCache[index] = newAniclip;
            });
        }
        static parseChannelData(channeltarget, sampleNode, loader) {
            let chan = new web3d.AnimationCurve();
            chan.path = loader.getNodePath(loader.bundle.gltf.nodes, channeltarget.node);
            chan.propertyName = channeltarget.path;
            chan.interPolationType = sampleNode.interpolation;
            switch (channeltarget.path) {
                case web3d.AnimationChannelTargetPath.ROTATION:
                    chan.propertyName = "localRotation";
                    chan.lerpFunc = (from, to, lerp, obj) => {
                        MathD.quat.lerp(from, to, lerp, obj.localRotation);
                        MathD.quat.normalize(obj.localRotation, obj.localRotation);
                    };
                    break;
                case web3d.AnimationChannelTargetPath.SCALE:
                    chan.propertyName = "localScale";
                    chan.lerpFunc = (from, to, lerp, obj) => {
                        MathD.vec3.lerp(from, to, lerp, obj.localScale);
                    };
                    break;
                case web3d.AnimationChannelTargetPath.TRANSLATION:
                    chan.propertyName = "localPosition";
                    chan.lerpFunc = (from, to, lerp, obj) => {
                        MathD.vec3.lerp(from, to, lerp, obj.localPosition);
                    };
                    break;
                case web3d.AnimationChannelTargetPath.WEIGHTS:
                    chan.lerpFunc = (from, to, lerp, obj) => {
                        let out = 0;
                        lerp(from, to, lerp, out);
                        obj["WEIGHTS"] = out;
                    };
                    console.warn(" animtion weights not handle yet.");
                    break;
                default:
                    console.error("channeltarget.path not conform to animation asset rule！");
                    break;
            }
            let task = Promise.all([
                web3d.parseAccessorNode.parse(sampleNode.input, loader),
                web3d.parseAccessorNode.parse(sampleNode.output, loader)
            ]).then(([inputdata, outputdata]) => {
                let timedata = inputdata.data;
                for (let i = 0; i < timedata.length; i++) {
                    chan.keys[i] = (timedata[i] * web3d.AnimationClip.FPS) | 0;
                }
                chan.value = outputdata.data;
                chan.startFrame = chan.keys[0];
                chan.endFrame = chan.keys[chan.keys.length - 1];
                return chan;
            });
            return task;
        }
    }
    web3d.ParseAnimationNode = ParseAnimationNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseBufferNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            if (bundle.bufferNodeCache[index]) {
                return Promise.resolve(bundle.bufferNodeCache[index]);
            }
            else {
                let buffer = bundle.gltf.buffers[index];
                return new Promise((resolve, reject) => {
                    loader.loadDependAsset(bundle.rootURL + "/" + buffer.uri, (asset, state) => {
                        if (state.beSucces) {
                            let abuffer = asset.content;
                            bundle.bufferNodeCache[index] = abuffer;
                            resolve(abuffer);
                        }
                        else {
                            console.error("ERROR: Failed to load gltf mesh bin. URL:" + state.url);
                            reject("ERROR: Failed to load gltf mesh bin. URL:" + state.url);
                        }
                    });
                });
            }
        }
    }
    web3d.ParseBufferNode = ParseBufferNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class BufferviewNode {
    }
    web3d.BufferviewNode = BufferviewNode;
    class ParseBufferViewNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            if (bundle.bufferviewNodeCache[index]) {
                return Promise.resolve(bundle.bufferviewNodeCache[index]);
            }
            else {
                let bufferview = bundle.gltf.bufferViews[index];
                let node = new BufferviewNode();
                if (bufferview.byteStride != null) {
                    node.byteStride = bufferview.byteStride;
                }
                let bufferindex = bufferview.buffer;
                return web3d.ParseBufferNode.parse(bufferindex, loader).then((buffer) => {
                    node.view = new Uint8Array(buffer, bufferview.byteOffset, bufferview.byteLength);
                    bundle.bufferviewNodeCache[index] = node;
                    return node;
                });
            }
        }
    }
    web3d.ParseBufferViewNode = ParseBufferViewNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseCameraNode {
        static parse(index, bundle) {
            let node = bundle.gltf.cameras[index];
            let obj = new web3d.GameObject();
            let cam = obj.addComponent("Camera");
            switch (node.type) {
                case web3d.CameraType.PERSPECTIVE:
                    cam.projectionType = web3d.ProjectionEnum.perspective;
                    let data = node.perspective;
                    cam.fov = data.yfov;
                    cam.near = data.znear;
                    if (data.zfar) {
                        cam.far = data.zfar;
                    }
                    if (data.aspectRatio) {
                        cam.aspest = data.aspectRatio;
                    }
                    break;
                case web3d.CameraType.ORTHOGRAPHIC:
                    cam.projectionType = web3d.ProjectionEnum.orthograph;
                    let datao = node.orthographic;
                    cam.near = datao.znear;
                    cam.far = datao.zfar;
                    cam.size = datao.ymag;
                    cam.aspest = datao.xmag / datao.ymag;
                    break;
            }
            return obj.transform;
        }
    }
    web3d.ParseCameraNode = ParseCameraNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseMaterialNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            if (bundle.materialNodeCache[index]) {
                return Promise.resolve(bundle.materialNodeCache[index]);
            }
            else {
                if (bundle.gltf.materials == null) {
                    return Promise.resolve(null);
                }
                let node = bundle.gltf.materials[index];
                let mat = new web3d.Material(node.name);
                mat.queue = node.queue || 0;
                if (!web3d.glTFBundle.BeUsePBRMaterial) {
                    let shaderName = node.shader;
                    if (shaderName != null && shaderName != "Standard") {
                        let shader = web3d.assetMgr.load("resource/shader/" + shaderName + ".shader.json");
                        mat.setShader(shader);
                        let tex = web3d.ParseTextureNode.parse(node.pbrMetallicRoughness.baseColorTexture.index, loader).then((tex) => {
                            mat.setTexture("_MainTex", tex);
                        });
                        return Promise.resolve(mat);
                    }
                    else if (node.pbrMetallicRoughness) {
                        if (node.pbrMetallicRoughness.baseColorTexture) {
                            let shader = web3d.assetMgr.load("resource/shader/diffuse.shader.json");
                            mat.setShader(shader);
                            let tex = web3d.ParseTextureNode.parse(node.pbrMetallicRoughness.baseColorTexture.index, loader).then((tex) => {
                                mat.setTexture("_MainTex", tex);
                            });
                            return Promise.resolve(mat);
                        }
                        else {
                            let shader = web3d.assetMgr.load("resource/shader/color.shader.json");
                            mat.setShader(shader);
                            if (node.pbrMetallicRoughness.baseColorFactor) {
                                let color = node.pbrMetallicRoughness.baseColorFactor;
                                mat.setColor("_MainColor", MathD.color.create(color[0], color[1], color[2], color[3]));
                            }
                            return Promise.resolve(mat);
                        }
                    }
                    else {
                        mat.setShader(web3d.assetMgr.getShader("def"));
                        return Promise.resolve(mat);
                    }
                }
                let pbrShader = web3d.assetMgr.load("resource/shader/pbr_glTF.shader.json");
                mat.setShader(pbrShader);
                if (node.pbrMetallicRoughness) {
                    let nodeMR = node.pbrMetallicRoughness;
                    if (nodeMR.baseColorFactor) {
                        let baseColorFactor = MathD.vec4.create();
                        MathD.vec4.copy(nodeMR.baseColorFactor, baseColorFactor);
                        mat.setVector4("u_BaseColorFactor", baseColorFactor);
                    }
                    if (nodeMR.metallicFactor) {
                        mat.setFloat("u_metalFactor", nodeMR.metallicFactor);
                    }
                    if (nodeMR.roughnessFactor) {
                        mat.setFloat("u_roughnessFactor", nodeMR.roughnessFactor);
                    }
                    if (nodeMR.baseColorTexture) {
                        let tex = web3d.ParseTextureNode.parse(nodeMR.baseColorTexture.index, loader).then((tex) => {
                            mat.setTexture("u_BaseColorSampler", tex);
                        });
                    }
                    if (nodeMR.metallicRoughnessTexture) {
                        let tex = web3d.ParseTextureNode.parse(nodeMR.metallicRoughnessTexture.index, loader).then((tex) => {
                            mat.setTexture("u_MetallicRoughnessSampler", tex);
                        });
                    }
                }
                if (node.normalTexture) {
                    let nodet = node.normalTexture;
                    let tex = web3d.ParseTextureNode.parse(nodet.index, loader).then((tex) => {
                        mat.setTexture("u_NormalSampler", tex);
                    });
                    if (nodet.scale) {
                        mat.setFloat("u_NormalScale", nodet.scale);
                    }
                }
                if (node.emissiveTexture) {
                    let nodet = node.emissiveTexture;
                    let tex = web3d.ParseTextureNode.parse(nodet.index, loader).then((tex) => {
                        mat.setTexture("u_EmissiveSampler", tex);
                    });
                    ;
                }
                if (node.emissiveFactor) {
                    let ve3 = MathD.vec3.create();
                    MathD.vec3.copy(node.emissiveFactor, ve3);
                    mat.setVector3("u_EmissiveFactor", ve3);
                }
                if (node.occlusionTexture) {
                    let nodet = node.occlusionTexture;
                    if (nodet.strength) {
                        mat.setFloat("u_OcclusionStrength", nodet.strength);
                    }
                }
                let brdfTex = web3d.assetMgr.load("resource/texture/brdfLUT.imgdes.json");
                mat.setTexture("u_brdfLUT", brdfTex);
                let e_cubeDiff = new web3d.CubeTexture();
                let e_diffuseArr = [];
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_right_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_left_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_top_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_bottom_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_front_0.jpg");
                e_diffuseArr.push("resource/texture/papermill/diffuse/diffuse_back_0.jpg");
                e_cubeDiff.groupCubeTexture(e_diffuseArr);
                let env_speTex = new web3d.CubeTexture();
                for (let i = 0; i < 10; i++) {
                    let urlarr = [];
                    urlarr.push("resource/texture/papermill/specular/specular_right_" + i + ".jpg");
                    urlarr.push("resource/texture/papermill/specular/specular_left_" + i + ".jpg");
                    urlarr.push("resource/texture/papermill/specular/specular_top_" + i + ".jpg");
                    urlarr.push("resource/texture/papermill/specular/specular_bottom_" + i + ".jpg");
                    urlarr.push("resource/texture/papermill/specular/specular_front_" + i + ".jpg");
                    urlarr.push("resource/texture/papermill/specular/specular_back_" + i + ".jpg");
                    env_speTex.groupMipmapCubeTexture(urlarr, i, 9);
                }
                mat.setCubeTexture("u_DiffuseEnvSampler", e_cubeDiff);
                mat.setCubeTexture("u_SpecularEnvSampler", env_speTex);
                return Promise.resolve(mat);
            }
        }
    }
    web3d.ParseMaterialNode = ParseMaterialNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseMeshNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            if (bundle.meshNodeCache[index]) {
                return Promise.resolve(bundle.meshNodeCache[index]);
            }
            else {
                let node = bundle.gltf.meshes[index];
                let dataArr = [];
                if (node.primitives) {
                    for (let key in node.primitives) {
                        let primitive = node.primitives[key];
                        let data = web3d.ParsePrimitiveNode.parse(primitive, loader);
                        dataArr.push(data);
                    }
                }
                let task = Promise.all(dataArr);
                task.then((value) => {
                    bundle.meshNodeCache[index] = value;
                });
                return task;
            }
        }
    }
    web3d.ParseMeshNode = ParseMeshNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseSceneNode {
        static parse(index, bundle) {
            let node = bundle.gltf.nodes[index];
            let trans = new web3d.GameObject().transform;
            bundle.nodeDic[index] = trans;
            if (node.name) {
                trans.gameObject.name = node.name;
            }
            else {
                trans.gameObject.name = "node" + index;
            }
            if (node.matrix) {
                trans.setLocalMatrix(node.matrix);
            }
            if (node.translation) {
                MathD.vec3.copy(node.translation, trans.localPosition);
                trans.markDirty();
            }
            if (node.rotation) {
                MathD.quat.copy(node.rotation, trans.localRotation);
                trans.markDirty();
            }
            if (node.scale) {
                MathD.vec3.copy(node.scale, trans.localScale);
                trans.markDirty();
            }
            if (node.children) {
                for (let i = 0; i < node.children.length; i++) {
                    let nodeindex = node.children[i];
                    let childtrans = this.parse(nodeindex, bundle);
                    trans.addChild(childtrans);
                }
            }
            if (node.camera != null) {
                let camtrans = web3d.ParseCameraNode.parse(node.camera, bundle);
                trans.addChild(camtrans);
            }
            if (node.skin != null && node.mesh != null) {
                let nodemeshdata = bundle.meshNodeCache[node.mesh];
                let skindata = bundle.skinNodeCache[node.skin];
                for (let key in nodemeshdata) {
                    let data = nodemeshdata[key];
                    let obj = new web3d.GameObject();
                    trans.addChild(obj.transform);
                    let meshr = obj.addComponent("SkinMeshRender");
                    meshr.mesh = data.mesh;
                    meshr.material = data.mat;
                    for (let i = 0; i < skindata.jointIndexs.length; i++) {
                        let trans = bundle.nodeDic[skindata.jointIndexs[i]];
                        if (trans == null) {
                            console.error("解析gltf 异常！");
                        }
                        meshr.joints.push(trans);
                    }
                    meshr.bindPoses = skindata.inverseBindMat;
                    meshr.bindPlayer = bundle.bundleAnimator;
                }
            }
            else if (node.mesh != null) {
                let nodemeshdata = bundle.meshNodeCache[node.mesh];
                for (let key in nodemeshdata) {
                    let data = nodemeshdata[key];
                    let obj = new web3d.GameObject();
                    let meshf = obj.addComponent("MeshFilter");
                    let meshr = obj.addComponent("MeshRender");
                    meshf.mesh = data.mesh;
                    meshr.material = data.mat;
                    trans.addChild(obj.transform);
                }
            }
            if (node.comps) {
                for (let key in node.comps) {
                    let compNode = node.comps[key];
                    let comp = trans.gameObject.addComponent(compNode["type"]);
                    for (let key in compNode) {
                        let att = compNode[key];
                        if (att instanceof Array) {
                            for (let i = 0; i < att.length; i++) {
                                comp[key][i] = att[i];
                            }
                        }
                        else {
                            comp[key] = att;
                        }
                    }
                }
            }
            return trans;
        }
    }
    web3d.ParseSceneNode = ParseSceneNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class SkinNode {
        constructor() {
            this.jointIndexs = [];
            this.inverseBindMat = [];
        }
    }
    web3d.SkinNode = SkinNode;
    class ParseSkinNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            let data = new SkinNode();
            let node = bundle.gltf.skins[index];
            data.jointIndexs = node.joints;
            if (node.inverseBindMatrices != null) {
                return web3d.parseAccessorNode.parse(node.inverseBindMatrices, loader).then((accessordata) => {
                    data.inverseBindMat = accessordata.data;
                    bundle.skinNodeCache[index] = data;
                    return data;
                });
            }
            else {
                for (let i = 0; i < node.joints.length; i++) {
                    let mat = MathD.mat4.create();
                    data.inverseBindMat.push(mat);
                }
                bundle.skinNodeCache[index] = data;
                return Promise.resolve(data);
            }
        }
    }
    web3d.ParseSkinNode = ParseSkinNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ParseTextureNode {
        static parse(index, loader) {
            let bundle = loader.bundle;
            if (bundle.textrueNodeCache[index]) {
                return Promise.resolve(bundle.textrueNodeCache[index]);
            }
            else {
                if (bundle.gltf.textures == null)
                    return null;
                let node = bundle.gltf.textures[index];
                if (bundle.gltf.images == null)
                    return null;
                let imageNode = bundle.gltf.images[node.source];
                let asset;
                if (imageNode.uri != null) {
                    asset = loader.loadDependAsset(bundle.rootURL + "/" + imageNode.uri);
                    if (node.sampler != null) {
                        let samplerinfo = bundle.gltf.samplers[node.sampler];
                        if (samplerinfo.wrapS != null) {
                            asset.samplerInfo.wrap_s = samplerinfo.wrapS;
                        }
                        if (samplerinfo.wrapT) {
                            asset.samplerInfo.wrap_s = samplerinfo.wrapT;
                        }
                        if (samplerinfo.magFilter) {
                            asset.samplerInfo.max_filter = samplerinfo.magFilter;
                        }
                        if (samplerinfo.minFilter) {
                            asset.samplerInfo.min_filter = samplerinfo.minFilter;
                        }
                    }
                    bundle.textrueNodeCache[index] = asset;
                    return Promise.resolve(asset);
                }
                else {
                    return web3d.ParseBufferViewNode.parse(imageNode.bufferView, loader).then((viewnode) => {
                        let bob = new Blob([viewnode.view], { type: imageNode.mimeType });
                        web3d.loadImg(bob, () => { }, null);
                        asset = new web3d.Texture();
                        if (node.sampler != null) {
                            let samplerinfo = bundle.gltf.samplers[node.sampler];
                            if (samplerinfo.wrapS != null) {
                                asset.samplerInfo.wrap_s = samplerinfo.wrapS;
                            }
                            if (samplerinfo.wrapT) {
                                asset.samplerInfo.wrap_s = samplerinfo.wrapT;
                            }
                            if (samplerinfo.magFilter) {
                                asset.samplerInfo.max_filter = samplerinfo.magFilter;
                            }
                            if (samplerinfo.minFilter) {
                                asset.samplerInfo.min_filter = samplerinfo.minFilter;
                            }
                        }
                        asset.applyToGLTarget();
                        return asset;
                    });
                }
            }
        }
    }
    web3d.ParseTextureNode = ParseTextureNode;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DracoCompression {
        constructor() {
        }
        static get DecoderAvailable() {
            if (typeof DracoDecoderModule !== "undefined") {
                return true;
            }
            const decoder = DracoCompression.Configuration.decoder;
            if (decoder) {
                if (decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") {
                    return true;
                }
                if (decoder.fallbackUrl) {
                    return true;
                }
            }
            return false;
        }
        dispose() {
        }
        decodeMeshAsync(data, attributes) {
            const dataView = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
            return DracoCompression._GetDecoderModule().then(wrappedModule => {
                const module = wrappedModule.module;
                const newMesh = new web3d.Mesh();
                const buffer = new module.DecoderBuffer();
                buffer.Init(dataView, dataView.byteLength);
                const decoder = new module.Decoder();
                let geometry;
                let status;
                try {
                    const type = decoder.GetEncodedGeometryType(buffer);
                    switch (type) {
                        case module.TRIANGULAR_MESH:
                            geometry = new module.Mesh();
                            status = decoder.DecodeBufferToMesh(buffer, geometry);
                            break;
                        case module.POINT_CLOUD:
                            geometry = new module.PointCloud();
                            status = decoder.DecodeBufferToPointCloud(buffer, geometry);
                            break;
                        default:
                            throw new Error(`Invalid geometry type ${type}`);
                    }
                    if (!status.ok() || !geometry.ptr) {
                        throw new Error(status.error_msg());
                    }
                    const numPoints = geometry.num_points();
                    if (type === module.TRIANGULAR_MESH) {
                        const numFaces = geometry.num_faces();
                        const faceIndices = new module.DracoInt32Array();
                        try {
                            const indices = new Uint32Array(numFaces * 3);
                            for (let i = 0; i < numFaces; i++) {
                                decoder.GetFaceFromMesh(geometry, i, faceIndices);
                                const offset = i * 3;
                                indices[offset + 0] = faceIndices.GetValue(0);
                                indices[offset + 1] = faceIndices.GetValue(1);
                                indices[offset + 2] = faceIndices.GetValue(2);
                            }
                            newMesh.setIndexData(indices);
                        }
                        finally {
                            module.destroy(faceIndices);
                        }
                    }
                    for (const kind in attributes) {
                        const uniqueId = attributes[kind];
                        const attribute = decoder.GetAttributeByUniqueId(geometry, uniqueId);
                        const dracoData = new module.DracoFloat32Array();
                        try {
                            decoder.GetAttributeFloatForAllPoints(geometry, attribute, dracoData);
                            const babylonData = new Float32Array(numPoints * attribute.num_components());
                            for (let i = 0; i < babylonData.length; i++) {
                                babylonData[i] = dracoData.GetValue(i);
                            }
                            newMesh.setVertexAttData(kind, babylonData);
                        }
                        finally {
                            module.destroy(dracoData);
                        }
                    }
                    newMesh.createVbowithAtts();
                }
                finally {
                    if (geometry) {
                        module.destroy(geometry);
                    }
                    module.destroy(decoder);
                    module.destroy(buffer);
                }
                let submeshinfo = new web3d.subMeshInfo();
                submeshinfo.size = newMesh.trisindex.length;
                newMesh.submeshs = [];
                newMesh.submeshs.push(submeshinfo);
                return newMesh;
            });
        }
        static _GetDecoderModule() {
            if (!DracoCompression._DecoderModulePromise) {
                let promise = null;
                let config = {};
                if (typeof DracoDecoderModule !== "undefined") {
                    promise = Promise.resolve();
                }
                else {
                    const decoder = DracoCompression.Configuration.decoder;
                    if (decoder) {
                        if (decoder.wasmUrl && decoder.wasmBinaryUrl && typeof WebAssembly === "object") {
                            promise = Promise.all([
                                DracoCompression._LoadScriptAsync(decoder.wasmUrl),
                                DracoCompression._LoadFileAsync(decoder.wasmBinaryUrl).then(data => {
                                    config.wasmBinary = data;
                                })
                            ]);
                        }
                        else if (decoder.fallbackUrl) {
                            promise = DracoCompression._LoadScriptAsync(decoder.fallbackUrl);
                        }
                    }
                }
                if (!promise) {
                    throw new Error("Draco decoder module is not available");
                }
                DracoCompression._DecoderModulePromise = promise.then(() => {
                    return new Promise(resolve => {
                        config.onModuleLoaded = (decoderModule) => {
                            resolve({ module: decoderModule });
                        };
                        DracoDecoderModule(config);
                    });
                });
            }
            return DracoCompression._DecoderModulePromise;
        }
        static _LoadScriptAsync(url) {
            return new Promise((resolve, reject) => {
                web3d.LoadScript(url, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        }
        static _LoadFileAsync(url) {
            return new Promise((resolve, reject) => {
                web3d.loadArrayBuffer(url, (data, err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        }
    }
    DracoCompression.Configuration = {
        decoder: {
            wasmUrl: "https://preview.babylonjs.com/draco_wasm_wrapper_gltf.js",
            wasmBinaryUrl: "https://preview.babylonjs.com/draco_decoder_gltf.wasm",
            fallbackUrl: "https://preview.babylonjs.com/draco_decoder_gltf.js"
        }
    };
    web3d.DracoCompression = DracoCompression;
    class KHR_draco_mesh_compression {
        get dracoCompression() {
            if (this._dracoCompression == null) {
                this._dracoCompression = new DracoCompression();
            }
            return this._dracoCompression;
        }
        load(extensionNode, loader) {
            let node = extensionNode;
            let attDic = {};
            for (let key in node.attributes) {
                let type = web3d.ParsePrimitiveNode.vertexAttMap[key].type;
                attDic[type] = node.attributes[key];
            }
            return web3d.ParseBufferViewNode.parse(node.bufferView, loader).then((viewdata) => {
                return this.dracoCompression.decodeMeshAsync(viewdata.view, attDic);
            });
        }
    }
    KHR_draco_mesh_compression.extendName = "KHR_draco_mesh_compression";
    web3d.KHR_draco_mesh_compression = KHR_draco_mesh_compression;
    web3d.LoadGlTF.regExtension(KHR_draco_mesh_compression.extendName, new KHR_draco_mesh_compression());
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class BundleInfo {
        constructor(name, url) {
            this.mapNamed = {};
            this.name = name;
            this.url = url;
        }
    }
    web3d.BundleInfo = BundleInfo;
    class ABTreeParse {
        constructor(name, url) {
            this.objDIC = {};
            this.tranDIC = {};
            this.assetDIC = {};
            this.resDir = "";
            this.totalAssetTask = 0;
            this.bundleInfo = new BundleInfo(name, url);
            web3d.assetMgr.loadMapBundle[name] = this.bundleInfo;
        }
        loadAllAsset() {
            for (let key in this.assetDIC) {
                let hashId = parseInt(key);
                let url = this.assetDIC[key].json.URL;
                this.assetDIC[key].obj = web3d.assetMgr.load(this.resDir + url);
                this.bundleInfo.mapNamed[web3d.AssetMgr.getFileName(this.resDir + url)] = this.resDir + url;
            }
        }
        deserialize(json) {
            let objs = json.gameobjects;
            let trans = json.transforms;
            let assets = json.web3dassets;
            for (let key in objs) {
                let objjson = objs[key];
                if (objjson.type != "GameObject")
                    continue;
                let gameobj = web3d.createInstanceByName(objjson.type);
                let realid = parseInt(key);
                this.objDIC[realid] = { json: objjson, obj: gameobj };
            }
            for (let key in trans) {
                let tranJson = trans[key];
                if (tranJson.type != "Transform")
                    continue;
                let tranobj = web3d.createInstanceByName(tranJson.type);
                let realid = parseInt(key);
                this.tranDIC[realid] = { json: tranJson, obj: tranobj };
            }
            for (let key in assets) {
                this.totalAssetTask++;
                let assetjson = assets[key];
                let realid = parseInt(key);
                this.assetDIC[realid] = { json: assetjson, obj: null };
            }
        }
        parseObjTree() {
            for (let key in this.tranDIC) {
                this.deserializeObj(this.tranDIC[key].json, this.tranDIC[key].obj, false);
            }
            for (let key in this.objDIC) {
                this.deserializeObj(this.objDIC[key].json, this.objDIC[key].obj, false);
            }
            for (let key in this.tranDIC) {
                this.deserializeObj(this.tranDIC[key].json, this.tranDIC[key].obj, true);
            }
            for (let key in this.objDIC) {
                this.deserializeObj(this.objDIC[key].json, this.objDIC[key].obj, true);
            }
        }
        deserializeObj(json, obj, deltWithIdType) {
            let type = json.type;
            let value = json.value;
            for (let key in value) {
                let jsonValue = value[key];
                if (jsonValue.type == null) {
                    obj[key] = jsonValue;
                }
                else {
                    let atttype = jsonValue.type;
                    if (jsonValue.id) {
                        if (deltWithIdType) {
                            if (atttype == "GameObject") {
                                obj[key] = this.objDIC[jsonValue.id].obj;
                            }
                            else if (atttype == "Transform") {
                                obj[key] = this.tranDIC[jsonValue.id].obj;
                            }
                            else if (web3d.BeAssetType(atttype)) {
                                obj[key] = this.assetDIC[jsonValue.id].obj;
                            }
                            else {
                                console.error("what type(" + atttype + ") with id Not Considered!!");
                            }
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        switch (atttype) {
                            case "Array":
                                for (let i = 0; i < jsonValue.value.length; i++) {
                                    let item = jsonValue.value[i];
                                    if (item.id) {
                                        if (deltWithIdType) {
                                            if (item.type == "GameObject") {
                                                obj[key][i] = this.objDIC[item.id].obj;
                                            }
                                            else if (item.type == "Transform") {
                                                if (obj instanceof web3d.Transform) {
                                                    let child = this.tranDIC[item.id].obj;
                                                    obj.addChild(child);
                                                }
                                                else {
                                                    obj[key][i] = this.tranDIC[item.id].obj;
                                                }
                                            }
                                            else if (web3d.BeAssetType(item.type)) {
                                                obj[key][i] = this.assetDIC[item.id].obj;
                                            }
                                            else {
                                                console.error("what type(" + item.type + ") with id Not Considered!!");
                                            }
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    else {
                                        if (obj instanceof web3d.GameObject && web3d.BeCompoentType(item.type)) {
                                            if (deltWithIdType) {
                                                this.deserializeObj(jsonValue.value[i], obj[key][i], deltWithIdType);
                                            }
                                            else {
                                                let func = web3d.getClassFunctionByName(item.type);
                                                let comp = obj.addComponent(item.type);
                                                this.deserializeObj(jsonValue.value[i], comp, deltWithIdType);
                                            }
                                        }
                                        else {
                                            if (deltWithIdType) {
                                                this.deserializeObj(jsonValue.value[i], obj[key][i], deltWithIdType);
                                            }
                                            else {
                                                if (item.type) {
                                                    let value = web3d.createInstanceByName(item.type);
                                                    this.deserializeObj(jsonValue.value[i], value, deltWithIdType);
                                                    obj[key][i] = value;
                                                }
                                                else {
                                                    obj[key][i] = item;
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                            case "vec2":
                            case "vec3":
                            case "vec4":
                            case "quat":
                            case "mat4":
                            case "mat3":
                            case "mat2":
                            case "mat2d":
                            case "color":
                            case "rect":
                                if (deltWithIdType)
                                    continue;
                                let value = web3d.createInstanceByName(atttype);
                                let vstr = jsonValue.value;
                                let arr = vstr.split(",");
                                for (let i = 0; i < arr.length; i++) {
                                    value[i] = Number(arr[i]);
                                }
                                obj[key] = value;
                                break;
                            default:
                                if (deltWithIdType) {
                                    this.deserializeObj(jsonValue.value, obj[key], deltWithIdType);
                                }
                                else {
                                    let _value = web3d.createInstanceByName(atttype);
                                    this.deserializeObj(jsonValue.value, _value, deltWithIdType);
                                    obj[key] = _value;
                                }
                                break;
                        }
                    }
                }
            }
        }
    }
    web3d.ABTreeParse = ABTreeParse;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadAniclip {
        load(url, state, onFinish, onProgress) {
            let name = web3d.AssetMgr.getFileName(url);
            let clip = new web3d.Aniclip(name);
            state.progress = web3d.loadArrayBuffer(url, (bin, err) => {
                if (err) {
                    let errorMsg = "ERROR:Load Anclip Error!\n  Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    LoadAniclip.Parse(clip, bin);
                    state.beSucces = true;
                }
                if (onFinish) {
                    onFinish(clip, state);
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return clip;
        }
        static Parse(clip, buf) {
            let read = new web3d.binReader(buf);
            let _name = read.readStrLenAndContent();
            let fps = read.readFloat();
            let loop = read.readBoolean();
            let boneCount = read.readInt();
            let bones = {};
            for (let i = 0; i < boneCount; i++) {
                let name = read.readStrLenAndContent();
                bones[name] = i;
            }
            let frameCount = read.readInt();
            let frames = [];
            for (let i = 0; i < frameCount; i++) {
                let _fid = read.readInt();
                let _frame = new web3d.Frame();
                for (let k = 0; k < boneCount; k++) {
                    let posx = read.readFloat();
                    let posy = read.readFloat();
                    let posz = read.readFloat();
                    let rotx = read.readFloat();
                    let roty = read.readFloat();
                    let rotz = read.readFloat();
                    let rotw = read.readFloat();
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 0] = rotx;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 1] = roty;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 2] = rotz;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 3] = rotw;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 4] = posx;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 5] = posy;
                    _frame.bonesMixMat[k * web3d.Aniclip.perBoneDataLen + 6] = posz;
                }
                frames[_fid] = _frame;
            }
            clip.fps = fps;
            clip.beLoop = loop;
            clip.frames = frames;
            clip.bones = bones;
        }
    }
    web3d.LoadAniclip = LoadAniclip;
    const _loadaniclip = new LoadAniclip();
    web3d.AssetMgr.RegisterAssetLoader(".Aniclip.bin", () => { return _loadaniclip; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadAssetBundle {
        load(url, state, onFinish, onProgress = null) {
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load AB TXT Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    console.error(errorMsg);
                    state.err = new Error(errorMsg);
                }
                else {
                    let json = JSON.parse(txt);
                    let index = url.lastIndexOf("/");
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return null;
        }
    }
    web3d.LoadAssetBundle = LoadAssetBundle;
    const _loadAssetBundle = new LoadAssetBundle();
    web3d.AssetMgr.RegisterAssetLoader(".assetbundle.json", () => _loadAssetBundle);
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadBin {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let binas = new web3d.BinAsset(name);
            state.progress = web3d.loadArrayBuffer(url, (bin, err) => {
                if (err) {
                    let errorMsg = "ERROR:Load *.bin Error!\n  Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    LoadBin.Parse(binas, bin);
                    state.beSucces = true;
                }
                if (onFinish) {
                    onFinish(binas, state);
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return binas;
        }
        static Parse(binas, bin) {
            binas.content = bin;
        }
    }
    web3d.LoadBin = LoadBin;
    const _loadbin = new LoadBin();
    web3d.AssetMgr.RegisterAssetLoader(".bin", () => { return _loadbin; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadJson {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let text = new web3d.JsonAsset(name, url);
            state.progress = web3d.loadJson(url, (json, err) => {
                if (err) {
                    let errorMsg = "ERROR:Load json Error!\n  Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    LoadJson.Parse(text, json);
                    state.beSucces = true;
                }
                if (onFinish) {
                    onFinish(text, state);
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return text;
        }
        static Parse(text, txt) {
            text.content = txt;
        }
    }
    web3d.LoadJson = LoadJson;
    const _loadjson = new LoadJson();
    web3d.AssetMgr.RegisterAssetLoader(".json", () => { return _loadjson; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class RegexpUtil {
    }
    RegexpUtil.textureRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*'(.+)'[ ]*\{[ ]*([a-zA-Z]*)[ ]*([a-zA-Z]*)[ ]*\}/;
    RegexpUtil.vector4regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.vector3regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.vector2regexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.floatRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\)[ ]*=[ ]*([0-9.-]+)/;
    RegexpUtil.rangeRegexp = /([_0-9a-zA-Z]+)[ ]*\([ ]*'(.+)'[ ]*,[ ]*([0-9a-zA-Z]+)[ ]*\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)[ ]*\)[ ]*=[ ]*([0-9.-]+)/;
    RegexpUtil.vector4Regexp = /\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.vector3Regexp = /\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.vector2Regexp = /\([ ]*([0-9.-]+)[ ]*,[ ]*([0-9.-]+)[ ]*\)/;
    RegexpUtil.vector3FloatOrRangeRegexp = /([0-9.-]+|\[[0-9.-]+,[0-9.-]+\]),([0-9.-]+|\[[0-9.-]+,[0-9.-]+\]),([0-9.-]+|\[[0-9.-]+,[0-9.-]+\])/;
    web3d.RegexpUtil = RegexpUtil;
    class LoadMaterial {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let mat = new web3d.Material(name);
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load MAterial Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    let matDirPath = url.replace(name, "");
                    let json = JSON.parse(txt);
                    LoadMaterial.loadDependAssets(json, matDirPath);
                    LoadMaterial.ParseMatUniform(mat, json, matDirPath);
                    LoadMaterial.Parse(mat, json, (err) => {
                        if (err) {
                            state.err = err;
                        }
                        else {
                            state.beSucces = true;
                        }
                        if (onFinish) {
                            onFinish(mat, state);
                        }
                    });
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return mat;
        }
        static ParseMatUniform(mat, json, matDirPath) {
            let mapUniform = json["mapUniform"];
            for (let i in mapUniform) {
                let jsonChild = mapUniform[i];
                let _uniformType = jsonChild["type"];
                switch (_uniformType) {
                    case "Float":
                        let _valuef = jsonChild["value"];
                        mat.setFloat(i, parseFloat(_valuef));
                        break;
                    case "Vector4":
                        let tempValue = jsonChild["value"];
                        let _values = tempValue.match(RegexpUtil.vector4Regexp);
                        if (_values != null) {
                            let _float4 = MathD.vec4.create(parseFloat(_values[1]), parseFloat(_values[2]), parseFloat(_values[3]), parseFloat(_values[4]));
                            mat.setVector4(i, _float4);
                        }
                        else {
                            let errorMsg = "ERROR: Material parse json Error! \n Json的mapuniform中的vector4的值与type不相符：" + _values;
                            console.error(errorMsg);
                        }
                        break;
                    case "Vector3":
                        let v3Value = jsonChild["value"];
                        let _v3values = v3Value.match(RegexpUtil.vector3Regexp);
                        if (_v3values != null) {
                            let _float3 = MathD.vec3.create(parseFloat(_v3values[1]), parseFloat(_v3values[2]), parseFloat(_v3values[3]));
                            mat.setVector3(i, _float3);
                        }
                        else {
                            let errorMsg = "ERROR: Material parse json Error! \n Json的mapuniform中的vector3的值与type不相符：" + _v3values;
                            console.error(errorMsg);
                        }
                        break;
                    case "Texture":
                        let _value = jsonChild["value"];
                        let _texture = web3d.assetMgr.load(matDirPath + _value);
                        mat.setTexture(i, _texture);
                        break;
                    default:
                        let errorMsg = "ERROR: Material parse json Error! \n" + "Type：" + jsonChild["type"] + " not handle yet！！";
                        console.error(errorMsg);
                }
            }
        }
        static Parse(mat, json, onFinish) {
            let shaderName = json["shader"];
            web3d.assetMgr.load("resource/shader/" + shaderName, (asset, state) => {
                if (state.beSucces) {
                    let shader = web3d.assetMgr.getShader(shaderName);
                    mat.setShader(shader);
                    if (onFinish) {
                        onFinish(null);
                    }
                }
                else {
                    let errorMsg = "ERROR: failed to Parase Mat.info: shader(" + shaderName + ") is null!";
                    console.error(errorMsg);
                    if (onFinish) {
                        onFinish(new Error(errorMsg));
                    }
                }
            });
        }
        ;
        static loadDependAssets(json, matPath) {
            let depends = json.dependencies;
            for (let key in depends) {
                let url = depends[key];
                web3d.assetMgr.load(matPath + url);
            }
        }
    }
    web3d.LoadMaterial = LoadMaterial;
    const _loadMat = new LoadMaterial();
    web3d.AssetMgr.RegisterAssetLoader(".mat.json", () => { return _loadMat; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadPrefab {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let prefa = new web3d.Prefab(name);
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load AB TXT Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    let json = JSON.parse(txt);
                    let index = url.lastIndexOf("/");
                    let abbundle = new PrefabTreeParse(name, url);
                    abbundle.loadABAsset(prefa, json, url.substring(0, index + 1));
                    if (onFinish) {
                        state.beSucces = true;
                        onFinish(prefa, state);
                    }
                }
            }, (info) => {
                if (onProgress) {
                    onProgress(info);
                }
            });
            return prefa;
        }
    }
    web3d.LoadPrefab = LoadPrefab;
    class PrefabTreeParse extends web3d.ABTreeParse {
        constructor(name, url) {
            super(name, url);
        }
        parasePrefabData() {
            if (this.prefabNode == null || this.prefabNode.root == null)
                return null;
            let rootid = this.prefabNode.root;
            return this.tranDIC[rootid].obj;
        }
        loadABAsset(prefab, abjson, resDir) {
            this.resDir = resDir;
            this.json = abjson;
            this.prefabNode = this.json.prefabData;
            this.deserialize(abjson);
            this.loadAllAsset();
            this.parseObjTree();
            prefab.root = this.parasePrefabData();
        }
    }
    web3d.PrefabTreeParse = PrefabTreeParse;
    const _loadprefab = new LoadPrefab();
    web3d.AssetMgr.RegisterAssetLoader(".prefab.json", () => _loadprefab);
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadScene {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let sceneinfo = new web3d.SceneInfo(name);
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load AB TXT Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    let json = JSON.parse(txt);
                    let index = url.lastIndexOf("/");
                    let abbundle = new SceneTreeParse(name, url);
                    abbundle.loadABAsset(sceneinfo, json, url.substring(0, index + 1), () => {
                        if (onFinish) {
                            state.beSucces = true;
                            onFinish(sceneinfo, state);
                        }
                    });
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return sceneinfo;
        }
    }
    web3d.LoadScene = LoadScene;
    class SceneTreeParse extends web3d.ABTreeParse {
        ParaseSceneData(sceneinfo) {
            if (this.sceneNode == null || this.sceneNode.root == null)
                return;
            let rootid = this.sceneNode.root;
            sceneinfo.root = this.tranDIC[rootid].obj;
            if (this.sceneNode.lightMap) {
                sceneinfo.useLightmap = true;
                let texid = this.sceneNode.lightMap.id;
                let tex = this.assetDIC[texid].obj;
                sceneinfo.lightMap.push(tex);
            }
            if (this.sceneNode.fog) {
                sceneinfo.useFog = true;
                let info = new web3d.FogInfo();
                this.deserializeObj(sceneinfo.fog, info, false);
            }
        }
        loadABAsset(sceneinfo, abjson, resDir, onFinish) {
            this.resDir = resDir;
            this.json = abjson;
            this.sceneNode = this.json.sceneData;
            this.deserialize(abjson);
            this.loadAllAsset();
            this.parseObjTree();
            this.ParaseSceneData(sceneinfo);
            if (onFinish) {
                onFinish();
            }
        }
    }
    web3d.SceneTreeParse = SceneTreeParse;
    const _loadscene = new LoadScene();
    web3d.AssetMgr.RegisterAssetLoader(".scene.json", () => { return _loadscene; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let DrawTypeEnum;
    (function (DrawTypeEnum) {
        DrawTypeEnum[DrawTypeEnum["BASE"] = 0] = "BASE";
        DrawTypeEnum[DrawTypeEnum["SKIN"] = 1] = "SKIN";
        DrawTypeEnum[DrawTypeEnum["LIGHTMAP"] = 2] = "LIGHTMAP";
        DrawTypeEnum[DrawTypeEnum["FOG"] = 4] = "FOG";
        DrawTypeEnum[DrawTypeEnum["INSTANCe"] = 8] = "INSTANCe";
        DrawTypeEnum[DrawTypeEnum["NOFOG"] = 3] = "NOFOG";
        DrawTypeEnum[DrawTypeEnum["NOLIGHTMAP"] = 5] = "NOLIGHTMAP";
    })(DrawTypeEnum = web3d.DrawTypeEnum || (web3d.DrawTypeEnum = {}));
    class LoadShader {
        constructor() {
            LoadShader.drawtypeDic["base"] = DrawTypeEnum.BASE;
            LoadShader.drawtypeDic["fog"] = DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["skin"] = DrawTypeEnum.SKIN;
            LoadShader.drawtypeDic["skin_fog"] = DrawTypeEnum.SKIN | DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["lightmap"] = DrawTypeEnum.LIGHTMAP;
            LoadShader.drawtypeDic["lightmap_fog"] = DrawTypeEnum.LIGHTMAP | DrawTypeEnum.FOG;
            LoadShader.drawtypeDic["instance"] = DrawTypeEnum.INSTANCe;
        }
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let shader = new web3d.Shader(name, url);
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load shader Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    let index = url.lastIndexOf("/");
                    let shaderurl = url.substring(0, index + 1);
                    LoadShader.parse(shader, txt, shaderurl, (err) => {
                        if (err) {
                            state.err = err;
                        }
                        else {
                            state.beSucces = true;
                        }
                        if (onFinish) {
                            onFinish(shader, state);
                        }
                    });
                }
                ;
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return shader;
        }
        static parse(shader, txt, shaderUrl, onFinish) {
            let shaderpass = {};
            let mapUniformDef = {};
            let shaderlayer = web3d.RenderLayerEnum.Geometry;
            let json = JSON.parse(txt);
            if (json.layer) {
                let layer = json.layer;
                if (layer == "transparent")
                    shaderlayer = web3d.RenderLayerEnum.Transparent;
                else if (layer == "overlay")
                    shaderlayer = web3d.RenderLayerEnum.Overlay;
                else if (layer == "Background")
                    shaderlayer = web3d.RenderLayerEnum.Background;
                else {
                    shaderlayer = web3d.RenderLayerEnum.Geometry;
                }
            }
            let errr = LoadShader.parseProperties(shader, json.properties, mapUniformDef);
            if (errr != null && onFinish != null) {
                onFinish(errr);
                return;
            }
            let passes = json.passes;
            let taskArr = [];
            for (let key in passes) {
                let task = new Promise((resolve, reject) => {
                    let pass = passes[key];
                    LoadShader.ParseShaderPass(shader, shaderpass, pass, key, shaderUrl, (err, type) => {
                        if (err) {
                            reject();
                        }
                        else {
                            resolve();
                        }
                    });
                });
                taskArr.push(task);
            }
            Promise.all(taskArr).then(() => {
                shader.mapUniformDef = mapUniformDef;
                shader.layer = shaderlayer;
                shader.passes = shaderpass;
                if (onFinish) {
                    onFinish(null);
                }
            }, () => {
                if (onFinish) {
                    onFinish(new Error("load failed"));
                }
            });
        }
        static parseProperties(shader, properties, mapUniformDef) {
            for (let index in properties) {
                let property = properties[index];
                let words = property.match(web3d.RegexpUtil.floatRegexp);
                if (words == null)
                    words = property.match(web3d.RegexpUtil.rangeRegexp);
                if (words == null)
                    words = property.match(web3d.RegexpUtil.vector4regexp);
                if (words == null)
                    words = property.match(web3d.RegexpUtil.vector3regexp);
                if (words == null)
                    words = property.match(web3d.RegexpUtil.vector2regexp);
                if (words == null)
                    words = property.match(web3d.RegexpUtil.textureRegexp);
                if (words == null) {
                    let errorMsg = "ERROR:  parse shader(" + shader.name + " )Property json Error! \n" + " Info:" + property + "check match failed.";
                    console.error(errorMsg);
                    return new Error(errorMsg);
                }
                if (words != null && words.length >= 4) {
                    let key = words[1];
                    let showName = words[2];
                    let type = words[3].toLowerCase();
                    switch (type) {
                        case "float":
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.FLOAT, value: parseFloat(words[4]) };
                            break;
                        case "range":
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.FLOAT, value: parseFloat(words[6]) };
                            break;
                        case "vector2":
                            let vector2 = MathD.vec2.create(parseFloat(words[4]), parseFloat(words[5]));
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.FLOAT_VEC2, value: vector2 };
                            break;
                        case "vector3":
                            let vector3 = MathD.vec3.create(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]));
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.FLOAT_VEC3, value: vector3 };
                            break;
                        case "vector4":
                        case "color":
                            let _vector = MathD.vec4.create(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]), parseFloat(words[7]));
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.FLOAT_VEC4, value: _vector };
                            break;
                        case "texture":
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.TEXTURE, value: web3d.assetMgr.getDefaultTexture(words[4]) };
                            break;
                        case "cubetexture":
                            mapUniformDef[key] = { type: webGraph.UniformTypeEnum.TEXTURE, value: web3d.assetMgr.getDefaultCubeTexture(words[4]) };
                            break;
                        default:
                            let errorMsg = "ERROR: parse shader(" + shader.name + " )Property json Error! \n" + "Info: unknown type : " + type;
                            console.error(errorMsg);
                            return new Error(errorMsg);
                    }
                }
            }
            return null;
        }
        static ParseShaderPass(shader, shaderpass, json, type, shaderFolderUrl, OnFinish) {
            let pass = new web3d.ShaderPass();
            shaderpass[this.drawtypeDic[type]] = pass;
            pass.drawtype = this.drawtypeDic[type];
            let taskCount = json.length;
            let errs = [];
            let taskArr = [];
            for (let i = 0; i < json.length; i++) {
                let passJson = json[i];
                let vsurl = shaderFolderUrl + passJson.vs + ".vs.glsl";
                let fsurl = shaderFolderUrl + passJson.fs + ".fs.glsl";
                let vstask = new Promise((resolve, reject) => {
                    web3d.assetMgr.load(vsurl, (asset, state) => {
                        if (state.beSucces) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    });
                });
                let fstask = new Promise((resolve, reject) => {
                    web3d.assetMgr.load(fsurl, (asset, state) => {
                        if (state.beSucces) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    });
                });
                let protask = Promise.all([vstask, fstask]).then(() => {
                    let vsStr = web3d.assetMgr.load(vsurl);
                    let fsStr = web3d.assetMgr.load(fsurl);
                    let program = this.compileShaderPass(passJson, shader.name, type, vsStr.content, fsStr.content);
                    if (program == null) {
                        let errorMsg = "Error: compile shader(" + shader.name + "/" + type + "/" + i + ") failed.";
                        errs.push(new Error(errorMsg));
                    }
                    else {
                        pass.program[i] = program;
                    }
                });
                taskArr.push(protask);
            }
            Promise.all(taskArr).then(() => {
                OnFinish(null, type);
            });
        }
        static compileShaderPass(json, shaderName, type, vsStr, fsStr) {
            let drawtype = this.drawtypeDic[type];
            if (type == "base") {
            }
            else if (type == "fog") {
                vsStr = "#define FOG \n" + vsStr;
                fsStr = "#define FOG \n" + fsStr;
            }
            else if (type == "skin") {
                vsStr = "#define SKIN \n" + vsStr;
                fsStr = "#define SKIN \n" + fsStr;
            }
            else if (type == "skin_fog") {
                vsStr = "#define SKIN \n" + "#define FOG \n" + vsStr;
                fsStr = "#define SKIN \n" + "#define FOG \n" + fsStr;
            }
            else if (type == "lightmap") {
                vsStr = "#define LIGHTMAP \n" + vsStr;
                fsStr = "#define LIGHTMAP \n" + fsStr;
            }
            else if (type == "lightmap_fog") {
                vsStr = "#define LIGHTMAP \n" + "#define FOG \n" + vsStr;
                fsStr = "#define LIGHTMAP \n" + "#define FOG \n" + fsStr;
            }
            else if (type == "instance") {
                vsStr = "#define INSTANCE \n" + vsStr;
                fsStr = "#define INSTANCE \n" + fsStr;
            }
            let vsname = shaderName + "_" + type;
            let fsname = shaderName + "_" + type;
            let vsshader = web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.VS, vsname, vsStr);
            let fsshader = web3d.assetMgr.shaderMgr.CreatShader(webGraph.ShaderTypeEnum.FS, fsname, fsStr);
            let program = web3d.assetMgr.shaderMgr.CreatProgram(vsname, fsname, type);
            program.state = this.parseShaderState(json, shaderName, type);
            return program;
        }
        static parseShaderState(json, shaderName, passType, index = 0) {
            let passOp = new webGraph.StateOption();
            if (json.showface != null) {
                if (json.showface == "ccw") {
                    passOp.cullingFace = webGraph.CullingFaceEnum.CCW;
                }
                else if (json.showface == "cw") {
                    passOp.cullingFace = webGraph.CullingFaceEnum.CW;
                }
                else if (json.showface == "all") {
                    passOp.cullingFace = webGraph.CullingFaceEnum.ALL;
                }
            }
            if (json.blendmode) {
                passOp.enableBlend = true;
                let blendmode = json.blendmode;
                if (blendmode == "custom") {
                    passOp.blend = webGraph.BlendModeEnum.custom;
                    let src = this.getblendfunc(json.source, shaderName, passType, index);
                    let dst = this.getblendfunc(json.destination, shaderName, passType, index);
                    if (src != null && dst != null) {
                        let detailop = new webGraph.blendOption(src, dst);
                        passOp.setBlend(webGraph.BlendModeEnum.custom, detailop);
                    }
                }
                else {
                    if (blendmode == "add") {
                        passOp.setBlend(webGraph.BlendModeEnum.Add);
                    }
                    else if (blendmode == "addpre") {
                        passOp.setBlend(webGraph.BlendModeEnum.Add_PreMultiply);
                    }
                    else if (blendmode = "blend") {
                        passOp.setBlend(webGraph.BlendModeEnum.Blend);
                    }
                    else if (blendmode = "blendpre") {
                        passOp.setBlend(webGraph.BlendModeEnum.Blend_PreMultiply);
                    }
                }
            }
            else {
                passOp.enableBlend = false;
            }
            if (json.ztest != null) {
                passOp.Ztest = json.ztest;
                if (json.ztestmethod != null) {
                    switch (json.ztestmethod) {
                        case "greater":
                            passOp.ZtestMethod = webGraph.GLConstants.GREATER;
                            break;
                        case "gequal":
                            passOp.ZtestMethod = webGraph.GLConstants.GEQUAL;
                            break;
                        case "less":
                            passOp.ZtestMethod = webGraph.GLConstants.LESS;
                            break;
                        case "equal":
                            passOp.ZtestMethod = webGraph.GLConstants.EQUAL;
                            break;
                        case "notequal":
                            passOp.ZtestMethod = webGraph.GLConstants.NOTEQUAL;
                            break;
                        case "always":
                            passOp.ZtestMethod = webGraph.GLConstants.ALWAYS;
                            break;
                        case "never":
                            passOp.ZtestMethod = webGraph.GLConstants.NEVER;
                            break;
                        case "lequal":
                        default:
                            passOp.ZtestMethod = webGraph.GLConstants.LEQUAL;
                            break;
                    }
                }
            }
            if (json.zwrite != null) {
                passOp.Zwrite = json.zwrite;
            }
            if (json.stencil != null) {
                passOp.stencilTest = true;
                let node = json.stencil;
                if (node.ref) {
                    passOp.refValue = node.ref;
                }
                if (node.comp) {
                    passOp.stencilFuc = this.getStencilFuc(node.comp);
                }
                if (node.fail) {
                    passOp.sFail = this.getStencilOP(node.fail);
                }
                if (node.pass) {
                    passOp.sPass = this.getStencilOP(node.pass);
                }
                if (node.zfail) {
                    passOp.sZfail = this.getStencilOP(node.zfail);
                }
            }
            if (json.colormask != null) {
                passOp.enablaColormask = true;
                let maskstr = json.colormask;
                if (maskstr.includes("r")) {
                    passOp.colorMask.r = false;
                }
                if (maskstr.includes("g")) {
                    passOp.colorMask.g = false;
                }
                if (maskstr.includes("b")) {
                    passOp.colorMask.b = false;
                }
                if (maskstr.includes("a")) {
                    passOp.colorMask.a = false;
                }
            }
            if (json.cleardepth != null) {
                passOp.clearDepth = json.cleardepth;
            }
            return passOp;
        }
        static getStencilFuc(type) {
            switch (type.toUpperCase()) {
                case "NEVER":
                    return webGraph.GLConstants.NEVER;
                case "LESS":
                    return webGraph.GLConstants.LESS;
                case "EQUAL":
                    return webGraph.GLConstants.EQUAL;
                case "LEQUAL":
                    return webGraph.GLConstants.LEQUAL;
                case "GREATER":
                    return webGraph.GLConstants.GREATER;
                case "NOTEQUAL":
                    return webGraph.GLConstants.NOTEQUAL;
                case "GEQUAL":
                    return webGraph.GLConstants.GEQUAL;
                case "ALWAYS":
                    return webGraph.GLConstants.ALWAYS;
                default:
                    console.error("stencilfunc setting  Not right. info:" + type);
                    return webGraph.GLConstants.NEVER;
            }
        }
        static getStencilOP(type) {
            switch (type.toUpperCase()) {
                case "KEEP":
                    return webGraph.GLConstants.KEEP;
                case "REPLACE":
                    return webGraph.GLConstants.REPLACE;
                case "ZERO":
                    return webGraph.GLConstants.ZERO;
                case "INCR":
                    return webGraph.GLConstants.INCR;
                case "INCR_WRAP":
                    return webGraph.GLConstants.INCR_WRAP;
                case "DECR":
                    return webGraph.GLConstants.DECR;
                case "DECR_WRAP":
                    return webGraph.GLConstants.DECR_WRAP;
                case "INVERT":
                    return webGraph.GLConstants.INVERT;
                default:
                    console.error("stencilop setting Not right. info:" + type);
                    return webGraph.GLConstants.KEEP;
            }
        }
        static getblendfunc(func, shaderName, passType, index = 0) {
            if (func == "one") {
                return webGraph.GLConstants.ONE;
            }
            else if (func == "srcalpha") {
                return webGraph.GLConstants.SRC_ALPHA;
            }
            else if (func == "srccolor") {
                return webGraph.GLConstants.SRC_COLOR;
            }
            else if (func == "dstcolor") {
                return webGraph.GLConstants.DST_COLOR;
            }
            else if (func == "dstalpha") {
                return webGraph.GLConstants.DST_ALPHA;
            }
            else {
                console.error("ERROR: parse shader(" + shaderName + "/" + passType + "/" + index + ") blend func defined error.\n" + " Info: func name:" + func);
                return null;
            }
        }
    }
    LoadShader.drawtypeDic = {};
    web3d.LoadShader = LoadShader;
    const _loadShader = new LoadShader();
    web3d.AssetMgr.RegisterAssetLoader(".shader.json", () => { return _loadShader; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadTextureSample {
        load(url, state, onFinish) {
            let name = web3d.AssetMgr.getFileName(url);
            let texture = new web3d.Texture(name);
            state.progress = web3d.loadImg(url, (tex, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load Image Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    LoadTextureSample.parse(texture, tex);
                    state.beSucces = true;
                }
                if (onFinish) {
                    onFinish(texture, state);
                }
            }, null);
            return texture;
        }
        static parse(tex, image) {
            tex.imageData = image;
            tex.width = image.width;
            tex.height = image.height;
            tex.applyToGLTarget();
        }
    }
    web3d.LoadTextureSample = LoadTextureSample;
    class LoadTexture {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let texture = new web3d.Texture(name);
            let request = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR: Load Image Des Error!\n Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                    if (onFinish) {
                        onFinish(texture, state);
                    }
                }
                else {
                    let desjson = JSON.parse(txt);
                    let imgName = desjson.texture;
                    let desname = web3d.AssetMgr.getFileName(url);
                    let imgurl = url.replace(desname, imgName);
                    let request = web3d.loadImg(imgurl, (tex, err) => {
                        if (err) {
                            let errorMsg = "ERROR: Load Image Error!\n Info: LOAD URL: " + imgurl + "  LOAD MSG:" + err.message;
                            state.err = new Error(errorMsg);
                            console.error(errorMsg);
                        }
                        else {
                            LoadTexture.parse(texture, tex, desjson);
                            state.beSucces = true;
                        }
                        if (onFinish) {
                            onFinish(texture, state);
                        }
                    });
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return texture;
        }
        static parse(tex, image, Desjson, keepOrigeData = true) {
            let texop = this.getFromDesJson(Desjson);
            texop.data = image;
            texop.width = image.width;
            texop.height = image.height;
            tex.samplerInfo = texop;
            tex.imageData = image;
            tex.applyToGLTarget();
        }
        static getFromDesJson(json) {
            let op = new webGraph.TextureOption();
            if (json.flip_y) {
                op.flip_y = json.flip_y;
            }
            if (json.filterMode) {
                switch (json.filterMode) {
                    case "Bilinear":
                    case "Trilinear":
                        op.max_filter = webGraph.TexFilterEnum.linear;
                        break;
                    case "Point":
                        op.max_filter = webGraph.TexFilterEnum.nearest;
                        break;
                }
            }
            if (json.wrapMode) {
                switch (json.wrapMode) {
                    case "Clamp":
                        op.wrap_s = webGraph.TexWrapEnum.clampToEdge;
                        op.wrap_t = webGraph.TexWrapEnum.clampToEdge;
                        break;
                    case "Repeat":
                        op.wrap_s = webGraph.TexWrapEnum.repeat;
                        op.wrap_t = webGraph.TexWrapEnum.repeat;
                        break;
                }
            }
            if (json.premultiplyAlpha) {
                op.preMultiply_alpha = json.premultiplyAlpha;
            }
            if (json.flip_y) {
                op.flip_y = json.flip_y;
            }
            return op;
        }
    }
    web3d.LoadTexture = LoadTexture;
    const _loadTextureSample = new LoadTextureSample();
    const _loadtexture = new LoadTexture();
    web3d.AssetMgr.RegisterAssetLoader(".png", () => { return _loadTextureSample; });
    web3d.AssetMgr.RegisterAssetLoader(".jpg", () => { return _loadTextureSample; });
    web3d.AssetMgr.RegisterAssetLoader(".imgdes.json", () => { return _loadtexture; });
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class LoadTxt {
        load(url, state, onFinish, onProgress = null) {
            let name = web3d.AssetMgr.getFileName(url);
            let text = new web3d.TextAsset(name, url);
            state.progress = web3d.loadText(url, (txt, err) => {
                if (err) {
                    let errorMsg = "ERROR:Load Txt/json Error!\n  Info: LOAD URL: " + url + "  LOAD MSG:" + err.message;
                    state.err = new Error(errorMsg);
                }
                else {
                    LoadTxt.Parse(text, txt);
                    state.beSucces = true;
                }
                if (onFinish) {
                    onFinish(text, state);
                }
            }, (info) => {
                if (onprogress) {
                    onProgress(info);
                }
            });
            return text;
        }
        static Parse(text, txt) {
            text.content = txt;
        }
    }
    web3d.LoadTxt = LoadTxt;
    const _loadtxt = new LoadTxt();
    web3d.AssetMgr.RegisterAssetLoader(".vs.glsl", () => _loadtxt);
    web3d.AssetMgr.RegisterAssetLoader(".fs.glsl", () => _loadtxt);
    web3d.AssetMgr.RegisterAssetLoader(".txt", () => _loadtxt);
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SceneInfo = class SceneInfo extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.root = null;
            this.useLightmap = false;
            this.lightMap = [];
            this.useFog = false;
            this.fog = null;
            this.type = "SceneInfo";
        }
        instantiate() {
            if (this.root == null) {
                return null;
            }
            else {
                let json = web3d.Serlizer.serializeObj(this.root);
                json.prefabData = {};
                json.prefabData.root = this.root.insId.getInsID();
                let parser = new web3d.PrefabTreeParse(this.name, this.URL);
                let prefab = new web3d.Prefab();
                let index = this.URL.lastIndexOf("/");
                parser.loadABAsset(prefab, json, this.URL.substring(0, index + 1));
                return prefab.root;
            }
        }
        dispose() {
            if (this.root) {
                this.root.dispose();
            }
            for (let key in this.lightMap) {
                this.lightMap[key].dispose();
            }
            delete this.root;
            delete this.lightMap;
        }
    };
    SceneInfo = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], SceneInfo);
    web3d.SceneInfo = SceneInfo;
    class FogInfo {
        constructor() {
            this.color = MathD.color.create();
            this.near = 0;
            this.far = 1000;
        }
    }
    web3d.FogInfo = FogInfo;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Aniclip = class Aniclip extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url, false);
            this.fps = 30;
            this.beLoop = false;
            this.frames = null;
            this.bones = {};
            this.type = "Aniclip";
        }
        dispose() {
        }
    };
    Aniclip.maxBone = 55;
    Aniclip.perBoneDataLen = 8;
    Aniclip = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], Aniclip);
    web3d.Aniclip = Aniclip;
    class Frame {
        constructor() {
            this.bonesMixMat = new Float32Array(Aniclip.maxBone * Aniclip.perBoneDataLen);
        }
    }
    web3d.Frame = Frame;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let AnimationClip = class AnimationClip extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url, false);
            this.beLoop = true;
            this.channels = [];
            this.totalFrame = 0;
            this.type = "AnimationClip";
        }
        dispose() {
        }
        static get perBoneDataLen() {
            if (this.enableScaleAnimation) {
                return 16;
            }
            else {
                return 8;
            }
        }
    };
    AnimationClip.enableScaleAnimation = false;
    AnimationClip.maxBone = 55;
    AnimationClip.FPS = 30;
    AnimationClip = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], AnimationClip);
    web3d.AnimationClip = AnimationClip;
    class AnimationCurve {
        constructor() {
            this.keys = [];
            this.value = [];
        }
        addKey(keyframe, value) {
            if (this.keys.indexOf(keyframe) < 0) {
                this.keys.push(keyframe);
                this.keys.sort();
            }
            let index = this.keys.indexOf(keyframe);
            this.value[index] = value;
        }
    }
    web3d.AnimationCurve = AnimationCurve;
    let AnimationInterpolationEnum;
    (function (AnimationInterpolationEnum) {
        AnimationInterpolationEnum["LINEAR"] = "LINEAR";
        AnimationInterpolationEnum["STEP"] = "STEP";
        AnimationInterpolationEnum["CUBICSPLINE"] = "CUBICSPLINE";
    })(AnimationInterpolationEnum = web3d.AnimationInterpolationEnum || (web3d.AnimationInterpolationEnum = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let BinAsset = class BinAsset extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.content = null;
            this.type = "BinAsset";
        }
        dispose() {
            this.content = null;
        }
    };
    BinAsset = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], BinAsset);
    web3d.BinAsset = BinAsset;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let CubeTexture = class CubeTexture extends web3d.Web3dAsset {
        constructor(assetName = null, url = null, bedef = false) {
            super(assetName, url, bedef);
            this.width = 0;
            this.height = 0;
            this._tex2dItems = [];
            this.beDefRef = true;
            this.currentLevel = -1;
            if (!bedef) {
            }
            this.type = "CubeTexture";
        }
        groupCubeTexture(urlArr) {
            let taskArr = [];
            for (let i = 0; i < urlArr.length; i++) {
                taskArr.push(this.loadImage(urlArr[i]));
            }
            Promise.all(taskArr).then((imagarr) => {
                this.glTexture = new webGraph.CubeTex(imagarr);
            });
        }
        groupMipmapCubeTexture(urlArr, mipmaplevel, maxLevel) {
            let taskArr = [];
            for (let i = 0; i < urlArr.length; i++) {
                taskArr.push(this.loadImage(urlArr[i]));
            }
            Promise.all(taskArr).then((imagarr) => {
                if (this.groupTexture == null) {
                    this.groupTexture = new webGraph.CubeTex(null);
                }
                this.groupTexture.uploadImage(imagarr, mipmaplevel);
                this.currentLevel++;
                if (this.currentLevel == maxLevel) {
                    this.glTexture = this.groupTexture;
                }
            });
        }
        loadImage(url) {
            return new Promise((resolve, reject) => {
                web3d.assetMgr.load(url, (asset) => {
                    if (asset) {
                        resolve(asset.imageData);
                    }
                    else {
                        reject("load failed");
                    }
                });
            });
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
            this.glTexture.dispose();
        }
    };
    CubeTexture = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String, Boolean])
    ], CubeTexture);
    web3d.CubeTexture = CubeTexture;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let JsonAsset = class JsonAsset extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.content = null;
            this.type = "TextAsset";
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
            this.content = null;
        }
    };
    JsonAsset = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], JsonAsset);
    web3d.JsonAsset = JsonAsset;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Material = class Material extends web3d.Web3dAsset {
        constructor(name = null, url = null, bedef = false) {
            super(name, url, bedef);
            this.queue = 0;
            this.UniformDic = {};
            this.uniformDirty = true;
            this.uniformDirtyArr = {};
            this.beActiveInstance = false;
            this.type = "Material";
        }
        get layer() {
            return this.shader.layer;
        }
        markUniformDirty(uniformName, value) {
            this.uniformDirtyArr[uniformName] = value;
            if (value instanceof web3d.Web3dAsset && value.loadState != web3d.LoadEnum.Success) {
                value.addListenerToLoadEnd(() => {
                    this.uniformDirtyArr[uniformName] = value;
                });
            }
        }
        setShader(shader) {
            if (shader != null) {
                this.shader = shader;
                if (shader.loadState != web3d.LoadEnum.Success) {
                    shader.addListenerToLoadEnd(() => {
                        this.uniformDirty = true;
                    });
                }
            }
        }
        getShader() {
            return this.shader;
        }
        getShaderPass(drawtype) {
            if (this.shader == null)
                return null;
            return this.shader.getPass(drawtype);
        }
        setInt(id, _int) {
            this.UniformDic[id] = _int;
            this.markUniformDirty(id, _int);
        }
        setFloat(id, _number) {
            this.UniformDic[id] = _number;
            this.markUniformDirty(id, _number);
        }
        setFloatv(id, _numbers) {
            this.UniformDic[id] = _numbers;
            this.markUniformDirty(id, _numbers);
        }
        setVector2(id, _vector2) {
            this.UniformDic[id] = _vector2;
            this.markUniformDirty(id, _vector2);
        }
        setVector3(id, _vector3) {
            this.UniformDic[id] = _vector3;
            this.markUniformDirty(id, _vector3);
        }
        setVector4(id, _vector4) {
            this.UniformDic[id] = _vector4;
            this.markUniformDirty(id, _vector4);
        }
        setColor(id, _vector4) {
            this.UniformDic[id] = _vector4;
            this.markUniformDirty(id, _vector4);
        }
        setVector4v(id, _vector4v) {
            this.UniformDic[id] = _vector4v;
            this.markUniformDirty(id, _vector4v);
        }
        setMatrix(id, _matrix) {
            this.UniformDic[id] = _matrix;
            this.markUniformDirty(id, _matrix);
        }
        setMatrixv(id, _matrixv) {
            this.UniformDic[id] = _matrixv;
            this.markUniformDirty(id, _matrixv);
        }
        setTexture(id, _texture) {
            this.UniformDic[id] = _texture;
            if (_texture != null) {
                this.setVector2(id + "_Size", MathD.vec2.create(_texture.width, _texture.height));
            }
            this.markUniformDirty(id, _texture);
        }
        setCubeTexture(id, _texture) {
            this.UniformDic[id] = _texture;
            this.markUniformDirty(id, _texture);
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
        }
        ToggleInstance(state = true) {
            this.beActiveInstance = state;
        }
    };
    Material.assetDic = {};
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Number)
    ], Material.prototype, "queue", void 0);
    Material = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String, Boolean])
    ], Material);
    web3d.Material = Material;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Mesh = class Mesh extends web3d.Web3dAsset {
        constructor(name = null, url = null, bedef = false) {
            super(name, url, bedef);
            this.glMesh = null;
            this.dataType = webGraph.RenderModelEnum.static;
            this.vertexAttData = {};
            this.submeshs = [];
            this.type = "Mesh";
        }
        getVertexData(type) {
            return this.vertexAttData[type];
        }
        setVertexAttData(type, arr, attInfo) {
            let viewArr = arr instanceof Array ? new Float32Array(arr) : arr;
            this.vertexAttData[type] = new vertexAttInfo(type, viewArr, attInfo);
        }
        createVbowithAtts() {
            if (this.glMesh == null) {
                this.glMesh = new web3d.GlMesh();
            }
            this.glMesh.declareVboWithAtts(this.vertexAttData, this.dataType);
        }
        refreshMeshVboWithAtt(type, vbodata) {
            this.vertexAttData[type].view = vbodata;
            this.glMesh.refreshVboWithAtt(this.vertexAttData[type]);
        }
        setInterleavedVertexData(vbodata, attInfo) {
            if (this.glMesh == null) {
                this.glMesh = new web3d.GlMesh();
            }
            this.glMesh.declareVboWithInterleavedData(vbodata, attInfo, this.dataType);
        }
        refreshInterleavedMeshVbo(vbodata) {
            this.glMesh.refreshVboWithInterleavedData(vbodata);
        }
        setIndexData(arr) {
            if (arr instanceof Array) {
                this.trisindex = new Uint16Array(arr);
            }
            else {
                this.trisindex = arr;
            }
            if (this.glMesh == null) {
                this.glMesh = new web3d.GlMesh();
            }
            this.glMesh.declareEboWithData(this.trisindex);
        }
        refreshMeshebo(ebodata) {
            this.glMesh.refreshEboWithData(ebodata);
        }
        getIndexData() {
            return this.trisindex;
        }
        getBoudingBox() {
            if (this._boundingAABB == null) {
                this._boundingAABB = new web3d.AABB().setFromMesh(this);
            }
            return this._boundingAABB;
        }
        getBoundingSphere() {
            if (this._boundingSphere == null) {
                this._boundingSphere = new web3d.BoundingSphere().setFromMesh(this, this.getBoudingBox().centerPoint);
            }
            return this._boundingSphere;
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
            if (this.glMesh) {
                this.glMesh.dispose();
            }
            delete this.submeshs;
        }
    };
    Mesh = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String, Boolean])
    ], Mesh);
    web3d.Mesh = Mesh;
    class subMeshInfo {
        constructor() {
            this.start = 0;
            this.size = 0;
            this.beUseEbo = true;
            this.renderType = webGraph.PrimitiveRenderEnum.Triangles;
        }
    }
    web3d.subMeshInfo = subMeshInfo;
    class vertexAttInfo {
        constructor(type, view, attInfo) {
            this.type = type;
            this.view = view;
            if (attInfo != null) {
                this.componentSize = attInfo.componentSize || webGraph.getCompnentSizeByVertexType(this.type);
                this.componentDataType = attInfo.componentDataType || webGraph.GLConstants.FLOAT;
                this.normalize = attInfo.normalize || false;
                this.viewByteStride = attInfo.viewByteStride || (this.view.BYTES_PER_ELEMENT * this.componentSize);
            }
            else {
                this.componentSize = webGraph.getCompnentSizeByVertexType(this.type);
                this.componentDataType = webGraph.GLConstants.FLOAT;
                this.normalize = false;
                this.viewByteStride = this.view.BYTES_PER_ELEMENT * this.componentSize;
            }
            this.byteSize = this.view.BYTES_PER_ELEMENT * this.componentSize;
        }
        get data() {
            return webGraph.GetDataArr(this.view, this.viewByteStride || this.byteSize, this.componentSize);
        }
        get count() {
            return this.view.length / this.componentSize;
        }
    }
    web3d.vertexAttInfo = vertexAttInfo;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var Prefab_1;
    let Prefab = Prefab_1 = class Prefab extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.root = null;
            this.type = "Prefab";
        }
        instantiate() {
            if (this.root == null) {
                return null;
            }
            else {
                let json = web3d.Serlizer.serializeObj(this.root);
                json.prefabData = {};
                json.prefabData.root = this.root.insId.getInsID();
                let parser = new web3d.PrefabTreeParse(this.name, this.URL);
                let prefab = new Prefab_1();
                let index = this.URL.lastIndexOf("/");
                parser.loadABAsset(prefab, json, this.URL.substring(0, index + 1));
                return prefab.root;
            }
        }
        dispose() {
            if (this.root) {
                this.root.dispose();
            }
            delete this.root;
        }
    };
    Prefab = Prefab_1 = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], Prefab);
    web3d.Prefab = Prefab;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Shader extends web3d.Web3dAsset {
        constructor(name = null, url = null, bedef = false) {
            super(name, url, bedef);
            this.passes = {};
            this.mapUniformDef = {};
            this.layer = web3d.RenderLayerEnum.Geometry;
            if (!bedef) {
            }
            this.type = "Shader";
        }
        dispose() {
            return;
        }
        getPass(drawtype) {
            return this.passes[drawtype];
        }
    }
    web3d.Shader = Shader;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let TextAsset = class TextAsset extends web3d.Web3dAsset {
        constructor(name = null, url = null) {
            super(name, url);
            this.content = null;
            this.type = "TextAsset";
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
            this.content = null;
        }
    };
    TextAsset = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String])
    ], TextAsset);
    web3d.TextAsset = TextAsset;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Texture = class Texture extends web3d.Web3dAsset {
        constructor(assetName = null, url = null, bedef = false) {
            super(assetName, url, bedef);
            this.width = 0;
            this.height = 0;
            this.samplerInfo = new webGraph.TextureOption();
            if (!bedef) {
            }
            this.type = "Texture";
        }
        applyToGLTarget() {
            this.glTexture = new webGraph.Texture2D(this.imageData, this.samplerInfo);
        }
        dispose() {
            if (this.beDefaultAsset)
                return;
            this.glTexture.dispose();
        }
    };
    Texture = __decorate([
        web3d.GameAsset,
        __metadata("design:paramtypes", [String, String, Boolean])
    ], Texture);
    web3d.Texture = Texture;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Text3d = class Text3d {
        constructor() {
            this.layer = web3d.RenderLayerEnum.Transparent;
            this.queue = 0;
            this.mask = web3d.LayerMask.default;
            this.materials = [];
            this.fontSize = 15;
            this.fontOffset = 0;
            this.posArr = [];
            this.uvArr = [];
            this.indexArr = [];
            this.viewPos = MathD.vec3.create();
            this.ndcPos = MathD.vec3.create();
        }
        BeRenderable() {
            if (this.textMesh == null)
                return false;
            return true;
        }
        BeInstantiable() {
            return false;
        }
        get textContent() {
            return this._textContent;
        }
        set textContent(value) {
            this._textContent = value;
            DynamicFont.Inc.checkText(value);
            this.refreshMeshData();
        }
        refreshMeshData() {
            this.posArr = [];
            this.uvArr = [];
            let posArr = [];
            let uvArr = [];
            for (let i = 0; i < 4; i++) {
                posArr[i] = MathD.vec3.create();
                uvArr[i] = MathD.vec2.create();
            }
            let xAddvance = 0;
            let scale = this.fontSize / DynamicFont.Inc.fontsize;
            for (let i = 0; i < this._textContent.length; i++) {
                let key = this._textContent.charAt(i);
                let charinfo = DynamicFont.Inc.getCharInfo(key);
                posArr[0][0] = xAddvance;
                posArr[0][1] = charinfo.ySize * scale;
                posArr[1][0] = xAddvance + charinfo.xSize * scale;
                posArr[1][1] = charinfo.ySize * scale;
                posArr[2][0] = xAddvance;
                posArr[2][1] = 0;
                posArr[3][0] = xAddvance + charinfo.xSize * scale;
                posArr[3][1] = 0;
                uvArr[0][0] = charinfo.x;
                uvArr[0][1] = charinfo.y;
                uvArr[1][0] = charinfo.x + charinfo.w;
                uvArr[1][1] = charinfo.y;
                uvArr[2][0] = charinfo.x;
                uvArr[2][1] = charinfo.y + charinfo.h;
                uvArr[3][0] = charinfo.x + charinfo.w;
                uvArr[3][1] = charinfo.y + charinfo.h;
                xAddvance += charinfo.xSize * scale;
                this.addQuad(posArr, uvArr, i);
            }
            this._textWidth = xAddvance;
            if (this.textMesh == null) {
                this.textMesh = new web3d.Mesh();
            }
            this.textMesh.setVertexAttData(webGraph.VertexAttTypeEnum.Position, this.posArr);
            this.textMesh.setVertexAttData(webGraph.VertexAttTypeEnum.UV0, this.uvArr);
            this.textMesh.createVbowithAtts();
            this.textMesh.setIndexData(this.indexArr);
            let submeshInfo = new web3d.subMeshInfo();
            submeshInfo.size = this.indexArr.length;
            this.textMesh.submeshs = [];
            this.textMesh.submeshs.push(submeshInfo);
        }
        addQuad(posArr, uvArr, index) {
            for (let i = 0; i < 4; i++) {
                this.posArr.push(posArr[i][0], posArr[i][1], posArr[i][2]);
                this.uvArr.push(uvArr[i][0], uvArr[i][1]);
            }
            this.indexArr.push(0 + index * 4, 1 + index * 4, 2 + index * 4, 2 + index * 4, 1 + index * 4, 3 + index * 4);
        }
        Start() {
            this.materials[0] = web3d.assetMgr.getDefaultMaterial("text3d");
        }
        Update() {
        }
        Render() {
            web3d.renderContext.curRender = this;
            web3d.renderContext.updateModel(this.gameObject.transform);
            MathD.mat4.transformPoint(this.gameObject.transform.localPosition, web3d.renderContext.matrixModelView, this.viewPos);
            let scale = -this.viewPos.z;
            MathD.mat4.translate(web3d.renderContext.matrixProject, this.viewPos, web3d.renderContext.matrixProject);
            MathD.mat4.scale(web3d.renderContext.matrixProject, MathD.vec3.create(scale / web3d.webgl.canvas.height, scale / web3d.webgl.canvas.height, 1), web3d.renderContext.matrixProject);
            for (let i = 0; i < this.textMesh.submeshs.length; i++) {
                let sm = this.textMesh.submeshs[i];
                let usemat = this.materials[i];
                web3d.renderMgr.draw(this.textMesh, usemat, sm, web3d.DrawTypeEnum.BASE);
            }
        }
        Dispose() {
        }
        Clone() {
        }
        get bouningSphere() {
            if (this._boundingSphere == null) {
                this._boundingSphere = new web3d.BoundingSphere();
            }
            MathD.vec3.copy(this.gameObject.transform.worldPosition, this._boundingSphere.center);
            return this._boundingSphere;
        }
    };
    Text3d.type = "Text3d";
    Text3d = __decorate([
        web3d.NodeComponent
    ], Text3d);
    web3d.Text3d = Text3d;
    class charinfo {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.xSize = 0;
            this.ySize = 0;
            this.xOffset = 0;
            this.yOffset = 0;
        }
    }
    web3d.charinfo = charinfo;
    class DynamicFont {
        constructor() {
            this.texSize = 400;
            this.fontsize = 20;
            this.cmap = {};
            this.xAddvance = 0;
            this.yAddvance = 0;
            let can2d = document.createElement("canvas");
            can2d.width = this.texSize;
            can2d.height = this.texSize;
            can2d.className = "fontcanvas";
            can2d.style.right = "0px";
            can2d.style.top = "0px";
            can2d.style.zIndex = "10";
            can2d.style.position = "absolute";
            web3d.webgl.canvas.parentElement.appendChild(can2d);
            this.contex2d = can2d.getContext("2d");
            DynamicFont.fontTex.imageData = can2d;
            DynamicFont.fontTex.samplerInfo.setWrap(webGraph.TexWrapEnum.clampToEdge, webGraph.TexWrapEnum.clampToEdge);
            DynamicFont.fontTex.samplerInfo.setPixsStore(true, false);
            DynamicFont.fontTex.samplerInfo.setFilterModel(webGraph.TexFilterEnum.linear, webGraph.TexFilterEnum.nearest);
            this.contex2d.clearRect(0, 0, can2d.width, can2d.height);
            this.contex2d.textAlign = "left";
            this.contex2d.textBaseline = "top";
            this.contex2d.fillStyle = "white";
            this.contex2d.font = this.fontsize + "px monospace";
        }
        static get Inc() {
            if (this._inc == null) {
                this._inc = new DynamicFont();
            }
            return this._inc;
        }
        checkText(str) {
            if (str == null)
                return;
            let updateData = false;
            for (let i = 0; i < str.length; i++) {
                let key = str.charAt(i);
                if (this.cmap[key])
                    continue;
                this.adddNewChar(key);
                DynamicFont.newChar += key;
                updateData = true;
            }
            if (updateData) {
                DynamicFont.fontTex.applyToGLTarget();
            }
        }
        getCharInfo(key) {
            return this.cmap[key];
        }
        adddNewChar(key) {
            if (this.xAddvance + this.fontsize >= this.texSize) {
                this.xAddvance = 0;
                this.yAddvance += (this.fontsize + 4);
            }
            this.contex2d.fillText(key, this.xAddvance, this.yAddvance);
            let charwidth = this.contex2d.measureText(key).width;
            let info = new charinfo();
            this.cmap[key] = info;
            info.x = this.xAddvance / this.texSize;
            info.y = this.yAddvance / this.texSize;
            info.w = charwidth / this.texSize;
            info.h = (this.fontsize + 1) / this.texSize;
            info.xSize = charwidth;
            info.ySize = this.fontsize;
            console.log(key + "  width:" + charwidth);
            this.xAddvance += (charwidth + 1);
        }
    }
    DynamicFont.charFromText = "";
    DynamicFont.newChar = "";
    DynamicFont.fontTex = new web3d.Texture();
    web3d.DynamicFont = DynamicFont;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Boxcollider {
        constructor() {
            this.aabb = new web3d.AABB();
            this.dirty = false;
            this._center = MathD.vec3.create();
            this._size = MathD.vec3.create(1, 1, 1);
            this._visible = false;
        }
        get center() {
            return this._center;
        }
        set center(value) {
            this._center = value;
        }
        get size() {
            return this._size;
        }
        set size(value) {
            this._size = value;
            let tempt = MathD.vec3.create();
            MathD.vec3.scale(this.size, -0.5, tempt);
            this.aabb.setMinPoint(tempt);
            MathD.vec3.scale(this.size, 0.5, tempt);
            this.aabb.setMaxPoint(tempt);
            MathD.vec3.recycle(tempt);
            this.dirty = true;
        }
        get visible() {
            return this._visible;
        }
        set visible(value) {
            this._visible = value;
        }
        Start() {
            this.colliderObj = new web3d.GameObject();
            this.gameObject.transform.addChild(this.colliderObj.transform);
        }
        Update() {
            if (this._visible) {
                let meshf = this.colliderObj.addComponent("MeshFilter");
                let meshr = this.colliderObj.addComponent("MeshRender");
                meshf.mesh = this.colliderMesh;
                MathD.vec3.copy(this._center, this.colliderObj.transform.localPosition);
            }
        }
        updateAABB() {
            this.aabb.applyMatrix(this.colliderObj.transform.worldMatrix);
        }
        Dispose() {
        }
        Clone() {
        }
    }
    Boxcollider.type = "Boxcollider";
    web3d.Boxcollider = Boxcollider;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var Camera_1;
    let ProjectionEnum;
    (function (ProjectionEnum) {
        ProjectionEnum[ProjectionEnum["perspective"] = 0] = "perspective";
        ProjectionEnum[ProjectionEnum["orthograph"] = 1] = "orthograph";
    })(ProjectionEnum = web3d.ProjectionEnum || (web3d.ProjectionEnum = {}));
    let Camera = Camera_1 = class Camera {
        constructor() {
            this._near = 0.01;
            this._far = 1000;
            this._beMainCamera = false;
            this.order = 0;
            this.clearOption_Color = true;
            this.clearOption_Depth = false;
            this.clearOption_Stencil = false;
            this.backgroundColor = MathD.color.create(0.3, 0.3, 0.3, 1);
            this.dePthValue = 1.0;
            this.stencilValue = 0;
            this.cullingMask = web3d.LayerMask.default | web3d.LayerMask.ui;
            this.viewport = MathD.Rect.create(0, 0, 1, 1);
            this.projectionType = ProjectionEnum.perspective;
            this.fov = Math.PI * 0.25;
            this.size = 2;
            this.postEffectQueue = [];
            this.frustum = new web3d.Frustum();
            this._viewMatrix = MathD.mat4.create();
            this._Projectmatrix = MathD.mat4.create();
            this._viewProjectMatrix = MathD.mat4.create();
            this.needComputeViewMat = true;
            this.needcomputeProjectMat = true;
            this.needcomputeViewProjectMat = true;
            if (Camera_1.Main == null) {
                Camera_1.Main = this;
            }
        }
        get near() {
            return this._near;
        }
        set near(val) {
            if (this.projectionType == ProjectionEnum.perspective && val < 0.01) {
                val = 0.01;
            }
            if (val >= this.far)
                val = this.far - 0.01;
            this._near = val;
        }
        get far() {
            return this._far;
        }
        set far(val) {
            if (val <= this.near)
                val = this.near + 0.01;
            this._far = val;
        }
        get beMainCamera() {
            return this._beMainCamera;
        }
        set beMainCamera(value) {
            this._beMainCamera = value;
            if (value == true) {
                Camera_1.Main = this;
            }
        }
        addPostEffect(eff) {
            this.postEffectQueue.push(eff);
        }
        clearPostEffect() {
            this.postEffectQueue = [];
        }
        Start() {
        }
        Update() {
            this.restToDirty();
        }
        viewPort(rendertarget = null) {
            let w, h;
            if (rendertarget == null) {
                w = web3d.GameScreen.Width;
                h = web3d.GameScreen.Height;
            }
            else {
                w = rendertarget.width;
                h = rendertarget.height;
            }
            webGraph.render.viewPort(w * this.viewport[0], h * this.viewport[1], w * this.viewport[2], h * this.viewport[3]);
        }
        clear() {
            webGraph.render.clears(this.clearOption_Color, this.backgroundColor, this.clearOption_Depth, this.dePthValue, this.clearOption_Stencil, this.stencilValue);
        }
        get ViewMatrix() {
            if (this.needComputeViewMat) {
                let camworld = this.gameObject.transform.worldMatrix;
                MathD.mat4.invert(camworld, this._viewMatrix);
                this.needComputeViewMat = false;
            }
            return this._viewMatrix;
        }
        get ProjectMatrix() {
            if (this.needcomputeProjectMat) {
                if (this.projectionType == ProjectionEnum.perspective) {
                    MathD.mat4.project_PerspectiveLH(this.fov, web3d.GameScreen.aspect, this.near, this.far, this._Projectmatrix);
                }
                else {
                    MathD.mat4.project_OrthoLH(this.size * web3d.GameScreen.aspect, this.size, this.near, this.far, this._Projectmatrix);
                }
                this.needcomputeProjectMat = false;
            }
            return this._Projectmatrix;
        }
        get ViewProjectMatrix() {
            if (this.needcomputeViewProjectMat) {
                MathD.mat4.multiply(this.ProjectMatrix, this.ViewMatrix, this._viewProjectMatrix);
                this.needcomputeViewProjectMat = false;
            }
            return this._viewProjectMatrix;
        }
        restToDirty() {
            this.needComputeViewMat = true;
            this.needcomputeProjectMat = true;
            this.needcomputeViewProjectMat = true;
        }
        screenToWorldPoint(screenPos, outWorldPos) {
            let matinv = MathD.mat4.create();
            MathD.mat4.invert(this.ViewProjectMatrix, matinv);
            let vppos = MathD.vec2.create(screenPos[0] / web3d.GameScreen.Width * 2 - 1, 1 - screenPos[1] / web3d.GameScreen.Height * 2);
            outWorldPos[0] = vppos[0];
            outWorldPos[1] = vppos[1];
            outWorldPos[2] = screenPos[2];
            MathD.mat4.transformPoint(outWorldPos, matinv, outWorldPos);
            MathD.mat4.recycle(matinv);
            MathD.vec2.recycle(vppos);
        }
        worldToScreenpos(worldPos, outScreenPos) {
            let ndcPos = MathD.vec3.create();
            MathD.mat4.transformPoint(worldPos, this.ViewProjectMatrix, ndcPos);
            outScreenPos[0] = (ndcPos[0] + 1) * web3d.GameScreen.Width / 2;
            outScreenPos[1] = (1 - ndcPos[1]) * web3d.GameScreen.Height / 2;
            MathD.vec3.recycle(ndcPos);
        }
        calcWindowPosFromWorldPos(worldPos, outDocument) {
            let ndcPos = MathD.vec3.create();
            MathD.mat4.transformPoint(worldPos, this.ViewProjectMatrix, ndcPos);
            outDocument[0] = (ndcPos[0] + 1) * web3d.GameScreen.windowWidth / 2;
            outDocument[1] = (1 - ndcPos[1]) * web3d.GameScreen.windowHeight / 2;
            MathD.vec3.recycle(ndcPos);
        }
        screenPointToRay(screenpos) {
            let src1 = MathD.vec3.create();
            src1.x = screenpos.x;
            src1.y = screenpos.y;
            src1.z = -1;
            let src2 = MathD.vec3.create();
            src2.x = screenpos.x;
            src2.y = screenpos.y;
            src2.z = 1;
            let dest1 = MathD.vec3.create();
            let dest2 = MathD.vec3.create();
            this.screenToWorldPoint(src1, dest1);
            this.screenToWorldPoint(src2, dest2);
            let dir = MathD.vec3.create();
            MathD.vec3.subtract(dest2, dest1, dir);
            MathD.vec3.normalize(dir, dir);
            let ray = new web3d.Ray(dest1, dir);
            return ray;
        }
        Dispose() {
        }
        Clone() {
        }
    };
    Camera.type = "Camera";
    Camera = Camera_1 = __decorate([
        web3d.NodeComponent,
        __metadata("design:paramtypes", [])
    ], Camera);
    web3d.Camera = Camera;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let CameraController = class CameraController {
        constructor() {
            this.moveSpeed = 0.2;
            this.movemul = 5;
            this.wheelSpeed = 1;
            this.rotateSpeed = 0.1;
            this.keyMap = {};
            this.beRightClick = false;
            this.rotAngle = MathD.vec3.create();
            this.inverseDir = -1;
            this.moveVector = MathD.vec3.create();
            this.camrot = MathD.quat.create();
        }
        Start() {
            if (this.gameObject.comps[web3d.Camera.type] != null) {
                this.active();
            }
        }
        Clone() {
            throw new Error("Method not implemented.");
        }
        Update() {
            this.doMove(web3d.GameTimer.DeltaTime);
        }
        active() {
            MathD.quat.ToEuler(this.gameObject.transform.localRotation, this.rotAngle);
            web3d.Input.addMouseEventListener(web3d.MouseEventEnum.Move, (ev) => {
                if (web3d.Input.getMouseDown(web3d.MouseKeyEnum.Right)) {
                    this.doRotate(ev.movementX, ev.movementY);
                }
            });
            web3d.Input.addKeyCodeEventListener(web3d.KeyCodeEventEnum.Up, (ev) => {
                this.moveSpeed = 0.2;
            });
            web3d.Input.addMouseEventListener(web3d.MouseEventEnum.Rotate, (ev) => {
                this.doMouseWheel(ev);
            });
        }
        doMove(delta) {
            if (this.gameObject.getComponent(web3d.Camera.type) == null)
                return;
            if (web3d.Input.getMouseDown(web3d.MouseKeyEnum.Right)) {
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.A)) {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getRightInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector, -1 * this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.D)) {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getRightInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector, this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.W)) {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getForwardInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector, this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.scale(this.moveVector, this.inverseDir, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.S)) {
                    this.moveSpeed += this.movemul * delta;
                    this.gameObject.transform.getForwardInWorld(this.moveVector);
                    MathD.vec3.scale(this.moveVector, -1 * this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.scale(this.moveVector, this.inverseDir, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.E)) {
                    this.moveSpeed += this.movemul * delta;
                    MathD.vec3.scale(MathD.vec3.UP, this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                if (web3d.Input.getKeyDown(web3d.KeyCodeEnum.Q)) {
                    this.moveSpeed += this.movemul * delta;
                    MathD.vec3.scale(MathD.vec3.DOWN, this.moveSpeed * delta, this.moveVector);
                    MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
                }
                this.gameObject.transform.markDirty();
            }
        }
        doRotate(rotateX, rotateY) {
            MathD.quat.FromEuler(0, rotateX * this.rotateSpeed * this.inverseDir, 0, this.camrot);
            MathD.quat.multiply(this.camrot, this.gameObject.transform.localRotation, this.gameObject.transform.localRotation);
            MathD.quat.FromEuler(rotateY * this.rotateSpeed * this.inverseDir, 0, 0, this.camrot);
            MathD.quat.multiply(this.gameObject.transform.localRotation, this.camrot, this.gameObject.transform.localRotation);
            this.gameObject.transform.markDirty();
        }
        doMouseWheel(ev) {
            if (this.gameObject.getComponent(web3d.Camera.type) == null)
                return;
            this.gameObject.transform.getForwardInWorld(this.moveVector);
            MathD.vec3.scale(this.moveVector, this.wheelSpeed * ev.rotateDelta * (-0.0001) * this.inverseDir, this.moveVector);
            MathD.vec3.add(this.gameObject.transform.localPosition, this.moveVector, this.gameObject.transform.localPosition);
            this.gameObject.transform.markDirty();
        }
        Dispose() {
        }
    };
    CameraController.type = "CameraController";
    CameraController = __decorate([
        web3d.NodeComponent
    ], CameraController);
    web3d.CameraController = CameraController;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let LightTypeEnum;
    (function (LightTypeEnum) {
        LightTypeEnum[LightTypeEnum["Direction"] = 0] = "Direction";
        LightTypeEnum[LightTypeEnum["Point"] = 1] = "Point";
        LightTypeEnum[LightTypeEnum["Spot"] = 2] = "Spot";
    })(LightTypeEnum = web3d.LightTypeEnum || (web3d.LightTypeEnum = {}));
    let Light = class Light {
        constructor() {
            this.spotAngelCos = 0.9;
        }
        Start() {
        }
        Update() {
        }
        Dispose() {
        }
        Clone() {
        }
    };
    Light.type = "Light";
    Light = __decorate([
        web3d.NodeComponent
    ], Light);
    web3d.Light = Light;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let MeshFilter = class MeshFilter {
        Start() {
        }
        Update() {
        }
        Dispose() {
        }
        Clone() {
        }
    };
    MeshFilter.type = "MeshFilter";
    __decorate([
        web3d.Attribute,
        __metadata("design:type", web3d.Mesh)
    ], MeshFilter.prototype, "mesh", void 0);
    MeshFilter = __decorate([
        web3d.NodeComponent
    ], MeshFilter);
    web3d.MeshFilter = MeshFilter;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let MeshRender = class MeshRender {
        constructor() {
            this.mask = web3d.LayerMask.default;
            this._layer = web3d.RenderLayerEnum.Geometry;
            this._queue = 0;
            this.materials = [];
            this.lightmapIndex = -1;
            this.lightmapTilingOffset = MathD.vec4.create(1, 1, 0, 0);
            this.localDrawType = web3d.DrawTypeEnum.BASE;
        }
        get layer() {
            if (this.materials[0] != null) {
                return this.materials[0].layer;
            }
            else {
                return web3d.RenderLayerEnum.Geometry;
            }
        }
        get queue() {
            if (this.materials[0] != null) {
                return this.materials[0].queue;
            }
            else {
                return 0;
            }
        }
        set material(value) {
            if (value == null) {
                this.materials.length = 0;
                return;
            }
            if (value instanceof Array) {
                this.materials.length = 0;
                this.materials = value;
            }
            else {
                this.materials[0] = value;
            }
        }
        Start() {
        }
        Update() {
        }
        Render() {
            let mesh = this.gameObject.comps[web3d.MeshFilter.type].mesh;
            web3d.renderContext.curRender = this;
            web3d.renderContext.updateModel(this.gameObject.transform);
            web3d.renderContext.lightmapIndex = this.lightmapIndex;
            web3d.renderContext.lightmapTilingOffset = this.lightmapTilingOffset;
            for (let i = 0; i < mesh.submeshs.length; i++) {
                let sm = mesh.submeshs[i];
                let usemat = this.materials[i];
                web3d.renderMgr.draw(mesh, usemat, sm, this.lightmapIndex >= 0 ? web3d.DrawTypeEnum.LIGHTMAP : web3d.DrawTypeEnum.BASE);
            }
        }
        BeInstantiable() {
            if (this.materials[0] == null)
                return false;
            return this.materials[0].beActiveInstance;
        }
        BeRenderable() {
            if (this.gameObject.comps[web3d.MeshFilter.type] == null)
                return false;
            let mesh = this.gameObject.comps[web3d.MeshFilter.type].mesh;
            if (mesh == null || mesh.glMesh == null)
                return false;
            if (this.materials[0] == null || this.materials[0].getShader() == null)
                return false;
            return true;
        }
        get bouningSphere() {
            return this.gameObject.comps[web3d.MeshFilter.type].mesh.getBoundingSphere();
        }
        Dispose() {
            this.materials.length = 0;
        }
        Clone() {
        }
    };
    MeshRender.type = "MeshRender";
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], MeshRender.prototype, "materials", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Number)
    ], MeshRender.prototype, "lightmapIndex", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", MathD.vec4)
    ], MeshRender.prototype, "lightmapTilingOffset", void 0);
    MeshRender = __decorate([
        web3d.NodeComponent
    ], MeshRender);
    web3d.MeshRender = MeshRender;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var Text3dHtml_1;
    let Text3dHtml = Text3dHtml_1 = class Text3dHtml {
        constructor() {
            this.windowPos = MathD.vec3.create();
        }
        get textContent() {
            return this._textContent;
        }
        set textContent(value) {
            if (this.textNode == null) {
                this.textNode = Text3dHtml_1.creatTextDiv();
            }
            this.textNode.nodeValue = value;
            this._textContent = value;
        }
        Start() {
        }
        Update() {
            if (this._textContent != null && web3d.Camera.Main != null) {
                web3d.Camera.Main.calcWindowPosFromWorldPos(this.gameObject.transform.worldPosition, this.windowPos);
                this.textNode.parentElement.style.left = this.windowPos[0] + "px";
                this.textNode.parentElement.style.top = this.windowPos[1] + "px";
            }
        }
        Dispose() {
        }
        Clone() {
        }
        static creatTextDiv() {
            let div = document.createElement("div");
            div.className = "floating-div";
            div.style.position = "absolute";
            div.style.userSelect = "none";
            div.style.color = "pink";
            let textNode = document.createTextNode("");
            div.appendChild(textNode);
            web3d.GameScreen.divcontiner.appendChild(div);
            return textNode;
        }
    };
    Text3dHtml.type = "Text3dHtml";
    Text3dHtml = Text3dHtml_1 = __decorate([
        web3d.NodeComponent
    ], Text3dHtml);
    web3d.Text3dHtml = Text3dHtml;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let PlayStateEnum;
    (function (PlayStateEnum) {
        PlayStateEnum[PlayStateEnum["Play"] = 0] = "Play";
        PlayStateEnum[PlayStateEnum["Stop"] = 1] = "Stop";
        PlayStateEnum[PlayStateEnum["Pause"] = 2] = "Pause";
    })(PlayStateEnum = web3d.PlayStateEnum || (web3d.PlayStateEnum = {}));
    class LastClipData {
        constructor(Aniclip, curFrame) {
            this.Aniclip = Aniclip;
            this.lerpStartFrame = curFrame + 1;
            this.restFrame = this.Aniclip.frames.length - (this.lerpStartFrame + 1);
        }
    }
    web3d.LastClipData = LastClipData;
    web3d.compSimpleAnimator = "SimpleAnimator";
    let SimpleAnimator = class SimpleAnimator {
        constructor() {
            this.Aniclips = [];
            this.playRate = 1;
            this.FPS = 30;
            this.autoPlay = true;
            this.timer = 0;
            this.curFrame = 0;
            this.PlayState = PlayStateEnum.Stop;
            this.enableTimeFlow = false;
            this.beMixed = true;
            this.mixrot = MathD.quat.create();
            this.mixpos = MathD.vec3.create();
            this.temrot = MathD.quat.create();
            this.tempos = MathD.vec3.create();
            this.temLastRot = MathD.quat.create();
            this.temLastpos = MathD.vec3.create();
        }
        Start() {
            if (this.gameObject.transform.children.length > 0) {
                let childs = this.gameObject.transform.children;
                for (let key in childs) {
                    let render = childs[key].gameObject.getComponent("SimpleSkinMeshRender");
                    if (render) {
                        render.bindPlayer = this;
                    }
                }
            }
            if (this.autoPlay) {
                this.playAniclipByIndex(0);
            }
        }
        Update() {
            if (this.curAniclip == null)
                return;
            if (!this.enableTimeFlow)
                return;
            if (this.curAniclip.frames == null)
                return;
            this.timer += web3d.GameTimer.DeltaTime * this.playRate;
            this.curFrame = (this.timer * this.FPS) | 0;
            if (!this.curAniclip.beLoop && this.curFrame >= this.curAniclip.frames.length) {
                this.enableTimeFlow = false;
                return;
            }
            this.curFrame = this.curFrame % this.curAniclip.frames.length;
            this.clipFrame = this.curAniclip.frames[this.curFrame];
        }
        Dispose() {
        }
        Clone() {
        }
        playAniclipByIndex(index) {
            let clip = this.Aniclips[index];
            if (clip != null) {
                this.play(clip);
            }
        }
        play(clip, mixTime = 0, mix = false, speed = 1) {
            if (this.playRate == PlayStateEnum.Play) {
                this.lastclipData = new LastClipData(this.curAniclip, this.curFrame);
            }
            this.curAniclip = clip;
            this.beMixed = mix;
            this.FPS = this.curAniclip.fps;
            this.playRate = speed;
            this.PlayState = PlayStateEnum.Play;
            this.enableTimeFlow = true;
        }
        pause() {
            if (this.PlayState == PlayStateEnum.Pause) {
                this.PlayState = PlayStateEnum.Play;
                this.enableTimeFlow = true;
            }
            else {
                this.PlayState = PlayStateEnum.Pause;
                this.enableTimeFlow = false;
            }
        }
        stop() {
            this.reset();
            this.PlayState = PlayStateEnum.Stop;
            this.enableTimeFlow = false;
        }
        reset() {
            this.timer = 0;
        }
        RefreshSkinBoneData(bonesname, bonesRotPos) {
            if (this.beMixed && this.lastclipData != null) {
                for (let i = 0, len = bonesname.length; i < len; i++) {
                    let name = bonesname[i];
                    let boneIndex = this.curAniclip.bones[name];
                    if (this.lastclipData.restFrame > this.curFrame) {
                        this.temrot[0] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 0];
                        this.temrot[1] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 1];
                        this.temrot[2] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 2];
                        this.temrot[3] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 3];
                        this.tempos[0] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 4];
                        this.tempos[1] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 5];
                        this.tempos[2] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 6];
                        this.temLastRot[0] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 0];
                        this.temLastRot[1] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 1];
                        this.temLastRot[2] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 2];
                        this.temLastRot[3] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 3];
                        this.temLastpos[0] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 4];
                        this.temLastpos[1] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 5];
                        this.temLastpos[2] = this.lastclipData.Aniclip.frames[this.lastclipData.lerpStartFrame + this.curFrame].bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + 6];
                        let lerp = (this.curFrame + 1) / this.lastclipData.restFrame;
                        MathD.vec3.lerp(this.temLastpos, this.tempos, lerp, this.mixpos);
                        MathD.quat.slerp(this.temLastRot, this.temrot, lerp, this.mixrot);
                        for (let k = 0; k < 4; k++) {
                            bonesRotPos[i * web3d.Aniclip.perBoneDataLen + k] = this.mixrot[k];
                        }
                        for (let k = 0; k < 3; k++) {
                            bonesRotPos[i * web3d.Aniclip.perBoneDataLen + k + 3] = this.mixpos[k];
                        }
                    }
                    else {
                        for (let k = 0; k < web3d.Aniclip.perBoneDataLen; k++) {
                            bonesRotPos[i * web3d.Aniclip.perBoneDataLen + k] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + k];
                        }
                    }
                }
            }
            else {
                for (let i = 0, len = bonesname.length; i < len; i++) {
                    let name = bonesname[i];
                    let boneIndex = this.curAniclip.bones[name];
                    for (let k = 0; k < web3d.Aniclip.perBoneDataLen; k++) {
                        bonesRotPos[i * web3d.Aniclip.perBoneDataLen + k] = this.clipFrame.bonesMixMat[boneIndex * web3d.Aniclip.perBoneDataLen + k];
                    }
                }
            }
        }
    };
    SimpleAnimator.type = "SimpleAnimator";
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], SimpleAnimator.prototype, "Aniclips", void 0);
    SimpleAnimator = __decorate([
        web3d.NodeComponent
    ], SimpleAnimator);
    web3d.SimpleAnimator = SimpleAnimator;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SimpleSkinMeshRender = class SimpleSkinMeshRender {
        constructor() {
            this.mask = web3d.LayerMask.default;
            this.layer = web3d.RenderLayerEnum.Geometry;
            this.queue = 0;
            this.materials = [];
            this.bones = [];
            this.bonesname = [];
            this.inverseBindmatrixs = [];
        }
        set material(value) {
            if (value == null) {
                this.materials.length = 0;
                return;
            }
            if (value instanceof Array) {
                this.materials.length = 0;
                this.materials = value;
            }
            else {
                this.materials[0] = value;
            }
            this.layer = this.materials[0].layer;
            this.queue = this.materials[0].queue;
        }
        Start() {
            this.bonesRotPos = new Float32Array(this.bonesname.length * web3d.Aniclip.perBoneDataLen);
        }
        Update() {
        }
        Render() {
            web3d.renderContext.curRender = this;
            for (let i = 0; i < this.mesh.submeshs.length; i++) {
                let sm = this.mesh.submeshs[i];
                let usemat = this.materials[i];
                if (this.bindPlayer && this.bindPlayer.clipFrame) {
                    web3d.renderContext.updateModel(this.bindPlayer.gameObject.transform);
                    this.bindPlayer.RefreshSkinBoneData(this.bonesname, this.bonesRotPos);
                    web3d.renderMgr.draw(this.mesh, usemat, sm, web3d.DrawTypeEnum.SKIN);
                }
                else {
                    web3d.renderContext.updateModel(this.gameObject.transform);
                    web3d.renderMgr.draw(this.mesh, usemat, sm, web3d.DrawTypeEnum.BASE);
                }
            }
        }
        BeRenderable() {
            if (this.mesh == null || this.mesh.glMesh == null)
                return false;
            return true;
        }
        BeInstantiable() {
            return this.materials[0].beActiveInstance;
        }
        Dispose() {
            this.materials.length = 0;
        }
        Clone() {
        }
        get bouningSphere() {
            return this.mesh.getBoundingSphere();
        }
    };
    SimpleSkinMeshRender.type = "SimpleSkinMeshRender";
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], SimpleSkinMeshRender.prototype, "materials", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", web3d.Mesh)
    ], SimpleSkinMeshRender.prototype, "mesh", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], SimpleSkinMeshRender.prototype, "bonesname", void 0);
    SimpleSkinMeshRender = __decorate([
        web3d.NodeComponent
    ], SimpleSkinMeshRender);
    web3d.SimpleSkinMeshRender = SimpleSkinMeshRender;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let Animation = class Animation {
        constructor() {
            this.beAutoPlay = true;
            this.animations = [];
            this.animationDic = {};
            this.timer = 0;
            this.lastFrame = 0;
            this.curFrame = 0;
            this.playRate = 1;
            this.PlayState = web3d.PlayStateEnum.Stop;
            this.enableTimeFlow = false;
            this.beMixed = false;
            this.pathDic = new Map();
        }
        addClip(newAnimation) {
            let name = newAnimation.name;
            this.animationDic[name] = newAnimation;
            this.animations.push(newAnimation);
        }
        playAnimationByName(name, timeScale = 1) {
            let animation = this.animationDic[name];
            if (animation) {
                this.play(animation, timeScale);
            }
            else {
                console.error(" animation :" + name + " not exist!");
            }
        }
        setFrame(name, frame) {
            if (this.animationDic[name] == null)
                return;
            this.curAni = this.animationDic[name];
            this.curFrame = Math.floor(this.curAni.totalFrame * frame);
        }
        play(animation, timeScale = 1) {
            if (animation == null)
                return;
            this.playRate = timeScale;
            this.curAni = animation;
            this.PlayState = web3d.PlayStateEnum.Play;
            this.enableTimeFlow = true;
            this.timerInit();
        }
        timerInit() {
            this.timer = 0;
            this.curFrame = 0;
            this.lastFrame = -1;
        }
        Start() {
            if (this.beAutoPlay && this.animations.length > 0) {
                this.play(this.animations[0]);
            }
        }
        Update() {
            if (!this.curAni)
                return;
            if (this.enableTimeFlow) {
                this.timer += web3d.GameTimer.DeltaTime * this.playRate;
                this.curFrame = (this.timer * web3d.AnimationClip.FPS) | 0;
                if (this.curFrame > this.curAni.totalFrame) {
                    if (this.curAni.beLoop) {
                        this.curFrame = this.curFrame % this.curAni.totalFrame;
                    }
                    else {
                        this.enableTimeFlow = false;
                        this.curFrame = this.curAni.totalFrame;
                    }
                }
            }
            if (this.curFrame != this.lastFrame) {
                this.lastFrame = this.curFrame;
                for (let i = 0, len = this.curAni.channels.length; i < len; i++) {
                    let channel = this.curAni.channels[i];
                    let transTarget;
                    if (this.pathDic.has(channel)) {
                        transTarget = this.pathDic.get(channel);
                    }
                    else {
                        transTarget = this.gameObject.transform.findPath(channel.path);
                        this.pathDic.set(channel, transTarget);
                    }
                    if (transTarget == null) {
                        continue;
                    }
                    ;
                    if (this.curFrame < channel.startFrame || this.curFrame > channel.endFrame)
                        continue;
                    let startIndex = ((channel.keys.length - 1) * this.curFrame / channel.endFrame) | 0;
                    while (channel.keys[startIndex] > this.curFrame && startIndex > 0) {
                        startIndex--;
                    }
                    let endIndex = startIndex + 1;
                    if (endIndex > channel.keys.length - 1) {
                        let target = channel.value[channel.keys.length - 1];
                        channel.lerpFunc(target, target, 0, transTarget);
                        transTarget.markDirty();
                    }
                    else {
                        while (channel.keys[endIndex] <= this.curFrame && endIndex < channel.keys.length - 1) {
                            endIndex++;
                        }
                        let lerp = (this.curFrame - channel.keys[startIndex]) / (channel.keys[endIndex] - channel.keys[startIndex]);
                        channel.lerpFunc(channel.value[startIndex], channel.value[endIndex], lerp, transTarget);
                        transTarget.markDirty();
                    }
                }
            }
        }
        Dispose() {
        }
        Clone() {
        }
    };
    Animation.type = "Animator";
    Animation = __decorate([
        web3d.NodeComponent
    ], Animation);
    web3d.Animation = Animation;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SkinMeshRender = class SkinMeshRender {
        constructor() {
            this.mask = web3d.LayerMask.default;
            this.layer = web3d.RenderLayerEnum.Geometry;
            this.queue = 0;
            this.materials = [];
            this.joints = [];
            this.jointMatrixs = [];
            this.bindPoses = [];
        }
        set material(value) {
            if (value == null) {
                this.materials.length = 0;
                return;
            }
            if (value instanceof Array) {
                this.materials.length = 0;
                this.materials = value;
            }
            else {
                this.materials[0] = value;
            }
            this.layer = this.materials[0].layer;
            this.queue = this.materials[0].queue;
        }
        Start() {
            this.realjointMatrixData = new Float32Array(this.joints.length * 16);
            for (let i = 0; i < this.joints.length; i++) {
                this.jointMatrixs[i] = new Float32Array(this.realjointMatrixData.buffer, i * 64, 16);
            }
        }
        Update() {
            this.layer = this.materials[0].layer;
        }
        Render() {
            web3d.renderContext.curRender = this;
            for (let i = 0; i < this.mesh.submeshs.length; i++) {
                let sm = this.mesh.submeshs[i];
                let usemat = this.materials[i];
                for (let i = 0; i < this.joints.length; i++) {
                    MathD.mat4.multiply(this.joints[i].worldMatrix, this.bindPoses[i], this.jointMatrixs[i]);
                }
                usemat.setMatrix("u_jointMatirx", this.realjointMatrixData);
                web3d.renderMgr.draw(this.mesh, usemat, sm, web3d.DrawTypeEnum.SKIN);
            }
        }
        BeRenderable() {
            if (this.mesh == null || this.mesh.glMesh == null)
                return false;
            return true;
        }
        get bouningSphere() {
            return this.mesh.getBoundingSphere();
        }
        BeInstantiable() {
            return this.materials[0].beActiveInstance;
        }
        Dispose() {
            this.materials.length = 0;
        }
        Clone() {
        }
    };
    SkinMeshRender.type = "SkinMeshRender";
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], SkinMeshRender.prototype, "materials", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", web3d.Mesh)
    ], SkinMeshRender.prototype, "mesh", void 0);
    SkinMeshRender = __decorate([
        web3d.NodeComponent
    ], SkinMeshRender);
    web3d.SkinMeshRender = SkinMeshRender;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SpringBone = class SpringBone {
        constructor() {
            this.boneAxis = MathD.vec3.create(0.0, 1.0, 0.0);
            this.radius = 0.5;
            this.stiffnessForce = 0.2;
            this.dragForce = 0.1;
            this.springForce = MathD.vec3.create(0.0, -0.05, 0.0);
            this.force = MathD.vec3.create();
            this.stiffForcee = MathD.vec3.create();
            this.dragForcee = MathD.vec3.create();
        }
        Start() {
            this.trs = this.gameObject.transform;
            this.localRotation = MathD.quat.clone(this.gameObject.transform.localRotation);
            this.springLength = MathD.vec3.distance(this.trs.worldPosition, this.child.worldPosition);
            this.currTipPos = MathD.vec3.clone(this.child.worldPosition);
            this.prevTipPos = MathD.vec3.clone(this.child.worldPosition);
        }
        Update() {
        }
        UpdateSpring() {
            if (this.trs == null)
                return;
            MathD.quat.copy(this.localRotation, this.trs.localRotation);
            this.trs.markDirty();
            let sqrDt = web3d.GameTimer.DeltaTime * web3d.GameTimer.DeltaTime;
            MathD.vec3.scale(this.boneAxis, this.stiffnessForce, this.stiffForcee);
            MathD.quat.transformVector(this.trs.worldRotation, this.stiffForcee, this.stiffForcee);
            MathD.vec3.scale(this.stiffForcee, 1 / sqrDt, this.stiffForcee);
            MathD.vec3.subtract(this.prevTipPos, this.currTipPos, this.dragForcee);
            MathD.vec3.scale(this.dragForcee, this.dragForce / sqrDt, this.dragForcee);
            MathD.vec3.add(this.stiffForcee, this.dragForcee, this.force);
            MathD.vec3.AddscaledVec(this.force, this.springForce, 1 / sqrDt, this.force);
            let temp = MathD.vec3.clone(this.currTipPos);
            MathD.vec3.scale(this.currTipPos, 2, this.currTipPos);
            MathD.vec3.subtract(this.currTipPos, this.prevTipPos, this.currTipPos);
            MathD.vec3.AddscaledVec(this.currTipPos, this.force, sqrDt, this.currTipPos);
            let dir = MathD.vec3.create();
            MathD.vec3.subtract(this.currTipPos, this.trs.worldPosition, dir);
            MathD.vec3.normalize(dir, dir);
            MathD.vec3.AddscaledVec(this.trs.worldPosition, dir, this.springLength, this.currTipPos);
            for (let i = 0; i < this.colliders.length; i++) {
                if (MathD.vec3.distance(this.currTipPos, this.colliders[i].gameObject.transform.worldPosition) <= (this.radius + this.colliders[i].radius)) {
                    let normal = MathD.vec3.create();
                    MathD.vec3.subtract(this.currTipPos, this.colliders[i].gameObject.transform.worldPosition, normal);
                    MathD.vec3.normalize(normal, normal);
                    MathD.vec3.AddscaledVec(this.colliders[i].gameObject.transform.worldPosition, normal, this.radius + this.colliders[i].radius, this.currTipPos);
                    MathD.vec3.subtract(this.currTipPos, this.trs.worldPosition, dir);
                    MathD.vec3.normalize(dir, dir);
                    MathD.vec3.AddscaledVec(this.trs.worldPosition, dir, this.springLength, this.currTipPos);
                    MathD.vec3.recycle(normal);
                }
            }
            this.prevTipPos = MathD.vec3.clone(temp);
            let aimVector = MathD.vec3.create();
            this.trs.transformDirection(this.boneAxis, aimVector);
            let aimRotation = MathD.quat.create();
            MathD.vec3.subtract(this.currTipPos, this.trs.worldPosition, dir);
            MathD.quat.fromToRotation(aimVector, dir, aimRotation);
            let rot = MathD.quat.create();
            MathD.quat.multiply(aimRotation, this.trs.worldRotation, rot);
            this.trs.worldRotation = rot;
            this.trs.markDirty();
            MathD.vec3.recycle(dir);
            MathD.vec3.recycle(aimVector);
            MathD.quat.recycle(aimRotation);
        }
        Clone() {
        }
        Dispose() {
        }
    };
    SpringBone = __decorate([
        web3d.NodeComponent
    ], SpringBone);
    web3d.SpringBone = SpringBone;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SpringCollider = class SpringCollider {
        constructor() {
            this.radius = 0.5;
        }
        Start() {
        }
        Update() {
        }
        Clone() {
        }
        Dispose() {
        }
    };
    SpringCollider = __decorate([
        web3d.NodeComponent
    ], SpringCollider);
    web3d.SpringCollider = SpringCollider;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let SpringManager = class SpringManager {
        constructor() {
            this.enablewind = true;
            this.windspeed = 1;
            this.SpringForce = MathD.vec3.create();
        }
        Start() {
            this.springBones = this.gameObject.getComponentsInChildren("SpringBone");
            this.springcolliders = this.gameObject.getComponentsInChildren("SpringCollider");
            for (let key in this.springBones) {
                this.springBones[key].colliders = this.springcolliders;
                this.springBones[key].child = this.springBones[key].gameObject.transform.findPath(["GameObject"]);
            }
        }
        Update() {
            this.randomWind();
            this.LateUpdate();
        }
        Clone() {
        }
        Dispose() {
        }
        LateUpdate() {
            for (let i = 0; i < this.springBones.length; i++) {
                this.springBones[i].UpdateSpring();
            }
        }
        randomWind() {
            if (this.enablewind) {
                this.SpringForce.x = (Math.sin(web3d.GameTimer.Time) + 1) * 0.001 * this.windspeed;
            }
            for (let i = 0; i < this.springBones.length; i++) {
                MathD.vec3.copy(this.SpringForce, this.springBones[i].springForce);
            }
        }
    };
    SpringManager = __decorate([
        web3d.NodeComponent
    ], SpringManager);
    web3d.SpringManager = SpringManager;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Input {
        static init() {
            web3d.Mouse.init();
            web3d.Keyboard.init();
        }
        static getKeyDown(key) {
            let state = web3d.Keyboard.StateInfo[key];
            return state || false;
        }
        static getMouseDown(key) {
            let state = web3d.Mouse.StateInfo[key];
            return state || false;
        }
        static addMouseEventListener(eventType, func, key = web3d.MouseKeyEnum.None) {
            if (web3d.Mouse.MouseEvent[key] == null) {
                web3d.Mouse.MouseEvent[key] = {};
            }
            if (web3d.Mouse.MouseEvent[key][eventType] == null) {
                web3d.Mouse.MouseEvent[key][eventType] = [];
            }
            web3d.Mouse.MouseEvent[key][eventType].push(func);
        }
        static addKeyCodeEventListener(eventType, func, key = null) {
            if (key == null) {
                if (web3d.Keyboard.anyKeyEvent[eventType] == null) {
                    web3d.Keyboard.anyKeyEvent[eventType] = [];
                }
                web3d.Keyboard.anyKeyEvent[eventType].push(func);
            }
            else {
                if (web3d.Keyboard.KeyEvent[key] == null) {
                    web3d.Keyboard[key] = {};
                }
                if (web3d.Keyboard[key][eventType] == null) {
                    web3d.Keyboard[key][eventType] = [];
                }
                web3d.Keyboard[key][eventType].push(func);
            }
        }
    }
    Input.mousePosition = MathD.vec2.create();
    web3d.Input = Input;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let KeyCodeEnum;
    (function (KeyCodeEnum) {
        KeyCodeEnum["A"] = "A";
        KeyCodeEnum["B"] = "B";
        KeyCodeEnum["C"] = "C";
        KeyCodeEnum["D"] = "D";
        KeyCodeEnum["E"] = "E";
        KeyCodeEnum["F"] = "F";
        KeyCodeEnum["G"] = "G";
        KeyCodeEnum["H"] = "H";
        KeyCodeEnum["I"] = "I";
        KeyCodeEnum["J"] = "J";
        KeyCodeEnum["K"] = "K";
        KeyCodeEnum["L"] = "L";
        KeyCodeEnum["M"] = "M";
        KeyCodeEnum["N"] = "N";
        KeyCodeEnum["O"] = "O";
        KeyCodeEnum["P"] = "P";
        KeyCodeEnum["Q"] = "Q";
        KeyCodeEnum["R"] = "R";
        KeyCodeEnum["S"] = "S";
        KeyCodeEnum["T"] = "T";
        KeyCodeEnum["U"] = "U";
        KeyCodeEnum["V"] = "V";
        KeyCodeEnum["W"] = "W";
        KeyCodeEnum["X"] = "X";
        KeyCodeEnum["Y"] = "Y";
        KeyCodeEnum["Z"] = "Z";
        KeyCodeEnum["SPACE"] = " ";
        KeyCodeEnum["ESC"] = "ESC";
    })(KeyCodeEnum = web3d.KeyCodeEnum || (web3d.KeyCodeEnum = {}));
    let KeyCodeEventEnum;
    (function (KeyCodeEventEnum) {
        KeyCodeEventEnum["Up"] = "KeyUp";
        KeyCodeEventEnum["Down"] = "KeyDown";
    })(KeyCodeEventEnum = web3d.KeyCodeEventEnum || (web3d.KeyCodeEventEnum = {}));
    class Keyboard {
        static init() {
            this.initKeyCodeMap();
            document.onkeydown = (ev) => {
                this.OnKeyDown(ev);
            };
            document.onkeyup = (ev) => {
                this.OnKeyUp(ev);
            };
        }
        static OnKeyDown(ev) {
            let key = ev.keyCode;
            let keystr = ev.key.toUpperCase();
            this.StateInfo[keystr] = true;
            this.executeKeyboardEvent(keystr, KeyCodeEventEnum.Down, ev);
            this.excuteAnyKeyEvent(KeyCodeEventEnum.Down, ev);
        }
        static OnKeyUp(ev) {
            let key = ev.keyCode;
            let keystr = ev.key.toUpperCase();
            this.StateInfo[keystr] = false;
            this.executeKeyboardEvent(keystr, KeyCodeEventEnum.Up, ev);
            this.excuteAnyKeyEvent(KeyCodeEventEnum.Up, ev);
        }
        static executeKeyboardEvent(key, event, ev) {
            if (this.KeyEvent[key] == null)
                return;
            let funcArr = this.KeyEvent[key][event];
            for (let key in funcArr) {
                let func = funcArr[key];
                func(ev);
            }
        }
        static excuteAnyKeyEvent(event, ev) {
            let fucArr = this.anyKeyEvent[event];
            if (fucArr == null)
                return;
            for (let key in fucArr) {
                let func = fucArr[key];
                func(ev);
            }
        }
        static initKeyCodeMap() {
            this.KeyCodeDic[65] = "A";
            this.KeyCodeDic[66] = "B";
            this.KeyCodeDic[67] = "C";
            this.KeyCodeDic[68] = "D";
            this.KeyCodeDic[69] = "E";
            this.KeyCodeDic[70] = "F";
            this.KeyCodeDic[71] = "G";
            this.KeyCodeDic[72] = "H";
            this.KeyCodeDic[73] = "I";
            this.KeyCodeDic[74] = "J";
            this.KeyCodeDic[75] = "K";
            this.KeyCodeDic[76] = "L";
            this.KeyCodeDic[77] = "M";
            this.KeyCodeDic[78] = "N";
            this.KeyCodeDic[79] = "O";
            this.KeyCodeDic[80] = "P";
            this.KeyCodeDic[81] = "Q";
            this.KeyCodeDic[82] = "R";
            this.KeyCodeDic[83] = "S";
            this.KeyCodeDic[84] = "T";
            this.KeyCodeDic[85] = "U";
            this.KeyCodeDic[86] = "V";
            this.KeyCodeDic[87] = "W";
            this.KeyCodeDic[88] = "X";
            this.KeyCodeDic[89] = "Y";
            this.KeyCodeDic[90] = "Z";
            this.KeyCodeDic[32] = "SPACE";
            this.KeyCodeDic[27] = "ESC";
        }
    }
    Keyboard.KeyCodeDic = {};
    Keyboard.StateInfo = {};
    Keyboard.KeyEvent = {};
    Keyboard.anyKeyEvent = {};
    Keyboard.keyDic = {};
    web3d.Keyboard = Keyboard;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let MouseKeyEnum;
    (function (MouseKeyEnum) {
        MouseKeyEnum["Left"] = "MouseLeft";
        MouseKeyEnum["Middle"] = "MouseMiddle";
        MouseKeyEnum["Right"] = "MouseRight";
        MouseKeyEnum["None"] = "MouseNone";
    })(MouseKeyEnum = web3d.MouseKeyEnum || (web3d.MouseKeyEnum = {}));
    let MouseEventEnum;
    (function (MouseEventEnum) {
        MouseEventEnum["Up"] = "mouseUp";
        MouseEventEnum["Down"] = "mouseDown";
        MouseEventEnum["Move"] = "mouseMove";
        MouseEventEnum["Rotate"] = "mouseRotate";
    })(MouseEventEnum = web3d.MouseEventEnum || (web3d.MouseEventEnum = {}));
    class ClickEvent {
    }
    web3d.ClickEvent = ClickEvent;
    class Mouse {
        static init() {
            this.keyDic[0] = MouseKeyEnum.Left;
            this.keyDic[1] = MouseKeyEnum.Middle;
            this.keyDic[2] = MouseKeyEnum.Right;
            document.oncontextmenu = (e) => {
                return false;
            };
            web3d.app.webgl.canvas.addEventListener("mousedown", (ev) => {
                let key = ev.button;
                let keyEnum = this.keyDic[key];
                this.StateInfo[keyEnum] = true;
                let event = this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(keyEnum, MouseEventEnum.Down, event);
                this.executeMouseEvent(MouseKeyEnum.None, MouseEventEnum.Up, event);
            });
            web3d.app.webgl.canvas.addEventListener("mouseup", (ev) => {
                let key = ev.button;
                let keyEnum = this.keyDic[key];
                this.StateInfo[keyEnum] = false;
                let event = this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(keyEnum, MouseEventEnum.Up, event);
                this.executeMouseEvent(MouseKeyEnum.None, MouseEventEnum.Up, event);
            });
            web3d.app.webgl.canvas.addEventListener("mousemove", (ev) => {
                let event = this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(MouseKeyEnum.None, MouseEventEnum.Move, event);
            });
            web3d.app.webgl.canvas.addEventListener("mousewheel", (ev) => {
                let event = this.getClickEventByMouseEvent(ev);
                this.executeMouseEvent(MouseKeyEnum.None, MouseEventEnum.Rotate, event);
            });
        }
        static executeMouseEvent(key, event, ev) {
            if (this.MouseEvent[key] == null)
                return;
            let funcArr = this.MouseEvent[key][event];
            if (funcArr == null)
                return;
            for (let key in funcArr) {
                let func = funcArr[key];
                func(ev);
            }
        }
        static getClickEventByMouseEvent(ev) {
            let event = new ClickEvent();
            event.pointx = ev.offsetX;
            event.pointy = ev.offsetY;
            web3d.Input.mousePosition.x = ev.offsetX;
            web3d.Input.mousePosition.y = ev.offsetY;
            event.movementX = ev.movementX;
            event.movementY = ev.movementY;
            event.rotateDelta = ev.detail | ev.wheelDelta;
            return event;
        }
    }
    Mouse.StateInfo = {};
    Mouse.MouseEvent = {};
    Mouse.keyDic = {};
    web3d.Mouse = Mouse;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class binBuffer {
        constructor(bufSize = 65536) {
            if (bufSize < 1024)
                bufSize = 1024;
            if (bufSize > 1024 * 256)
                bufSize = 1024 * 256;
            this._bufSize = bufSize;
            this._buf = [];
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._buf[0] = new Uint8Array(bufSize);
            this._seekReadPos = 0;
        }
        getLength() {
            return (this._seekWriteIndex * this._bufSize + this._seekWritePos) - (this._seekReadPos);
        }
        getBufLength() {
            return this._buf.length * this._bufSize;
        }
        getBytesAvailable() {
            return this.getLength();
        }
        reset() {
            this._buf = [];
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._buf[0] = new Uint8Array(this._bufSize);
            this._seekReadPos = 0;
        }
        dispose() {
            this._buf.splice(0);
            this._seekWritePos = 0;
            this._seekWriteIndex = 0;
            this._seekReadPos = 0;
        }
        read(target, offset = 0, length = -1) {
            if (length < 0)
                length = target.length;
            for (let i = offset; i < offset + length; i++) {
                if (this._seekReadPos >= this._seekWritePos && 0 == this._seekWriteIndex) {
                    this.reset();
                    throw new Error("no data to read.");
                }
                target[i] = this._buf[0][this._seekReadPos];
                this._seekReadPos++;
                if (this._seekReadPos >= this._bufSize) {
                    this._seekWriteIndex--;
                    this._seekReadPos = 0;
                    let freebuf = this._buf.shift();
                    this._buf.push(freebuf);
                }
            }
        }
        write(array, offset = 0, length = -1) {
            if (length < 0)
                length = array.length;
            for (let i = offset; i < offset + length; i++) {
                this._buf[this._seekWriteIndex][this._seekWritePos] = array[i];
                this._seekWritePos++;
                if (this._seekWritePos >= this._bufSize) {
                    this._seekWriteIndex++;
                    this._seekWritePos = 0;
                    if (this._buf.length <= this._seekWriteIndex) {
                        this._buf.push(new Uint8Array(this._bufSize));
                    }
                }
            }
        }
        getBuffer() {
            let length = 0;
            if (this._seekWriteIndex > 0) {
                length = this._bufSize * (this._seekWriteIndex - 1) + this._seekWritePos;
            }
            else {
                length = this._seekWritePos;
            }
            let array = new Uint8Array(length);
            for (let i = 0; i < this._seekWriteIndex - 1; i++) {
                array.set(this._buf[i], i * this._bufSize);
            }
            for (let i = 0; i < this._seekWritePos; i++) {
                array[length - this._seekWritePos + i] = this._buf[this._seekWriteIndex][i];
            }
            return array;
        }
        getUint8Array() {
            return new Uint8Array(this.getBuffer());
        }
    }
    web3d.binBuffer = binBuffer;
    class converter {
        static getApplyFun(value) {
            return Array.prototype.concat.apply([], value);
        }
        static ULongToArray(value, target = null, offset = 0) {
            let uint1 = value % 0x100000000;
            let uint2 = (value / 0x100000000) | 0;
            converter.dataView.setUint32(0, uint1, true);
            converter.dataView.setUint32(4, uint2, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static LongToArray(value, target = null, offset = 0) {
            let uint1 = value % 0x100000000;
            let uint2 = (value / 0x100000000) | 0;
            converter.dataView.setInt32(0, uint1, true);
            converter.dataView.setInt32(4, uint2, true);
            let _array = new Int8Array(converter.dataView.buffer);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Float64ToArray(value, target = null, offset = 0) {
            converter.dataView.setFloat64(0, value, false);
            if (target == null) {
                target = new Uint8Array(converter.dataView.buffer);
            }
            else {
                for (let i = 0; i < 8; i++) {
                    target[offset + i] = converter.dataView.buffer[i];
                }
            }
            return target;
        }
        static Float32ToArray(value, target = null, offset = 0) {
            converter.dataView.setFloat32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int32ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int16ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 2);
            }
            else {
                for (let i = 0; i < 2; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Int8ToArray(value, target = null, offset = 0) {
            converter.dataView.setInt8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 1);
            }
            else {
                for (let i = 0; i < 1; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint32toArray(value, target = null, offset = 0) {
            converter.dataView.setInt32(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 4);
            }
            else {
                for (let i = 0; i < 4; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint16ToArray(value, target = null, offset = 0) {
            converter.dataView.setUint16(0, value, true);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 2);
            }
            else {
                for (let i = 0; i < 2; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static Uint8ToArray(value, target = null, offset = 0) {
            converter.dataView.setUint8(0, value);
            let _array = new Uint8Array(converter.dataView.buffer);
            if (target == null) {
                target = converter.getApplyFun(_array).slice(0, 1);
            }
            else {
                for (let i = 0; i < 1; i++) {
                    target[offset + i] = _array[i];
                }
            }
            return target;
        }
        static StringToUtf8Array(str) {
            let bstr = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return new Uint8Array(bstr);
        }
        static ArrayToLong(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getInt32(0, true);
            for (let i = 4; i < 8; i++) {
                converter.dataView.setInt8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getInt32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }
        static ArrayToULong(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n1 = converter.dataView.getUint32(0, true);
            for (let i = 4; i < 8; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            let n2 = converter.dataView.getUint32(4, true);
            n1 += n2 * 0x100000000;
            return n1;
        }
        static ArrayToFloat64(buf, offset = 0) {
            for (let i = 0; i < 8; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getFloat64(0, true);
        }
        static ArrayToFloat32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getFloat32(0, true);
        }
        static ArrayToInt32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt32(0, true);
        }
        static ArrayToInt16(buf, offset = 0) {
            for (let i = 0; i < 2; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt16(0, true);
        }
        static ArrayToInt8(buf, offset = 0) {
            for (let i = 0; i < 1; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getInt8(0);
        }
        static ArraytoUint32(buf, offset = 0) {
            for (let i = 0; i < 4; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint32(0, true);
        }
        static ArrayToUint16(buf, offset = 0) {
            for (let i = 0; i < 2; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint16(0, true);
        }
        static ArrayToUint8(buf, offset = 0) {
            for (let i = 0; i < 1; i++) {
                converter.dataView.setUint8(i, buf[offset + i]);
            }
            return converter.dataView.getUint8(0);
        }
        static ArrayToString(buf, offset = 0) {
            let ret = [];
            for (let i = 0; i < buf.length; i++) {
                let cc = buf[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = buf[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = buf[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                }
                else {
                    ret.push(String.fromCharCode(buf[i]));
                }
            }
            return ret.join('');
        }
    }
    converter.dataView = new DataView(new ArrayBuffer(8), 0, 8);
    web3d.converter = converter;
    class binTool extends binBuffer {
        readSingle() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToFloat32(array);
        }
        readLong() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToLong(array);
        }
        readULong() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToULong(array);
        }
        readDouble() {
            let array = new Uint8Array(8);
            this.read(array);
            return converter.ArrayToFloat64(array);
        }
        readInt8() {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToInt8(array);
        }
        readUInt8() {
            let array = new Uint8Array(1);
            this.read(array);
            return converter.ArrayToUint8(array);
        }
        readInt16() {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToInt16(array);
        }
        readUInt16() {
            let array = new Uint8Array(2);
            this.read(array);
            return converter.ArrayToUint16(array);
        }
        readInt32() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArrayToInt32(array);
        }
        readUInt32() {
            let array = new Uint8Array(4);
            this.read(array);
            return converter.ArraytoUint32(array);
        }
        readBoolean() {
            return this.readUInt8() > 0;
        }
        readByte() {
            return this.readUInt8();
        }
        readUnsignedShort() {
            return this.readUInt16();
        }
        readUnsignedInt() {
            return this.readUInt32();
        }
        readFloat() {
            return this.readSingle();
        }
        readSymbolByte() {
            return this.readInt8();
        }
        readShort() {
            return this.readInt16();
        }
        readInt() {
            return this.readInt32();
        }
        readBytes(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return array;
        }
        readStringUtf8() {
            let length = this.readInt8();
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringUtf8FixLength(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readUTFBytes(length) {
            let array = new Uint8Array(length);
            this.read(array);
            return converter.ArrayToString(array);
        }
        readStringAnsi() {
            let slen = this.readUInt8();
            let bs = "";
            for (let i = 0; i < slen; i++) {
                bs += String.fromCharCode(this.readByte());
            }
            return bs;
        }
        get length() {
            return this.getLength();
        }
        writeInt8(num) {
            this.write(converter.Int8ToArray(num));
        }
        writeUInt8(num) {
            this.write(converter.Uint8ToArray(num));
        }
        writeInt16(num) {
            this.write(converter.Int16ToArray(num));
        }
        writeUInt16(num) {
            this.write(converter.Uint16ToArray(num));
        }
        writeInt32(num) {
            this.write(converter.Int32ToArray(num));
        }
        writeUInt32(num) {
            this.write(converter.Uint32toArray(num));
        }
        writeSingle(num) {
            this.write(converter.Float32ToArray(num));
        }
        writeLong(num) {
            this.write(converter.LongToArray(num));
        }
        writeULong(num) {
            this.write(converter.ULongToArray(num));
        }
        writeDouble(num) {
            this.write(converter.Float64ToArray(num));
        }
        writeStringAnsi(str) {
            let slen = str.length;
            this.writeUInt8(slen);
            for (let i = 0; i < slen; i++) {
                this.writeUInt8(str.charCodeAt(i));
            }
        }
        writeStringUtf8(str) {
            let bstr = converter.StringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.write(bstr);
        }
        writeStringUtf8DataOnly(str) {
            let bstr = converter.StringToUtf8Array(str);
            this.write(bstr);
        }
        writeByte(num) {
            this.write(converter.Uint8ToArray(num));
        }
        writeBytes(array, offset = 0, length = -1) {
            this.write(array, offset, length);
        }
        writeUint8Array(array, offset = 0, length = -1) {
            this.write(array, offset, length);
        }
        writeUnsignedShort(num) {
            this.write(converter.Uint16ToArray(num));
        }
        writeUnsignedInt(num) {
            this.write(converter.Uint32toArray(num));
        }
        writeFloat(num) {
            this.write(converter.Float32ToArray(num));
        }
        writeUTFBytes(str) {
            this.write(converter.StringToUtf8Array(str));
        }
        writeSymbolByte(num) {
            this.write(converter.Int8ToArray(num));
        }
        writeShort(num) {
            this.write(converter.Int16ToArray(num));
        }
        writeInt(num) {
            this.write(converter.Int32ToArray(num));
        }
    }
    web3d.binTool = binTool;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    function stringToBlob(content) {
        let u8 = new Uint8Array(stringToUtf8Array(content));
        let blob = new Blob([u8]);
        return blob;
    }
    web3d.stringToBlob = stringToBlob;
    function stringToUtf8Array(str) {
        let bstr = [];
        for (let i = 0; i < str.length; i++) {
            let c = str.charAt(i);
            let cc = c.charCodeAt(0);
            if (cc > 0xFFFF) {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80) {
                if (cc < 0x07FF) {
                    let c1 = (cc >>> 6) | 0xC0;
                    let c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else {
                    let c1 = (cc >>> 12) | 0xE0;
                    let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    let c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else {
                bstr.push(cc);
            }
        }
        return bstr;
    }
    web3d.stringToUtf8Array = stringToUtf8Array;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DownloadInfo {
    }
    web3d.DownloadInfo = DownloadInfo;
    let LoadStateEnum;
    (function (LoadStateEnum) {
        LoadStateEnum[LoadStateEnum["Loading"] = 0] = "Loading";
        LoadStateEnum[LoadStateEnum["Finish"] = 1] = "Finish";
        LoadStateEnum[LoadStateEnum["Failed"] = 2] = "Failed";
    })(LoadStateEnum = web3d.LoadStateEnum || (web3d.LoadStateEnum = {}));
    let ResponseTypeEnum;
    (function (ResponseTypeEnum) {
        ResponseTypeEnum["text"] = "text";
        ResponseTypeEnum["json"] = "json";
        ResponseTypeEnum["blob"] = "blob";
        ResponseTypeEnum["arraybuffer"] = "arraybuffer";
    })(ResponseTypeEnum = web3d.ResponseTypeEnum || (web3d.ResponseTypeEnum = {}));
    function LoadScript(scriptUrl, onFinish) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
        script.onload = () => {
            if (onFinish) {
                onFinish(null);
            }
        };
        script.onerror = (e) => {
            if (onFinish) {
                onFinish(new Error("Unable to load script:" + scriptUrl));
            }
        };
        head.appendChild(script);
    }
    web3d.LoadScript = LoadScript;
    function httpRequeset(url, type, onFinish, onProgress = null) {
        let info = new DownloadInfo();
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = type;
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    onFinish(null, new Error("got a 404:" + url));
                    return;
                }
                onFinish(req.response, null);
            }
        };
        req.onprogress = (e) => {
            if (onProgress) {
                info.loaded = e.loaded;
                info.total = e.total;
                onProgress(info);
            }
        };
        req.onerror = () => {
            onFinish(null, new Error("onerr in req:"));
        };
        req.send();
        return info;
    }
    function loadJson(url, onFinish, onProgress = null) {
        return httpRequeset(url, ResponseTypeEnum.json, onFinish, onProgress);
    }
    web3d.loadJson = loadJson;
    function loadText(url, onFinish, onProgress = null) {
        return httpRequeset(url, ResponseTypeEnum.text, onFinish, onProgress);
    }
    web3d.loadText = loadText;
    function loadArrayBuffer(url, onFinish, onProgress = null) {
        return httpRequeset(url, ResponseTypeEnum.arraybuffer, onFinish, onProgress);
    }
    web3d.loadArrayBuffer = loadArrayBuffer;
    function loadBlob(url, onFinish, onProgress = null) {
        return httpRequeset(url, ResponseTypeEnum.arraybuffer, onFinish, onProgress);
    }
    web3d.loadBlob = loadBlob;
    function loadImg(input, fun, onProgress = null) {
        let info = new DownloadInfo();
        let url;
        if (input instanceof ArrayBuffer) {
            url = URL.createObjectURL(new Blob([input]));
        }
        else if (input instanceof Blob) {
            url = URL.createObjectURL(input);
        }
        else {
            url = input;
        }
        let img = new Image();
        img.src = url;
        img.onerror = (error) => {
            if (error != null) {
                fun(null, new Error(error.message));
            }
        };
        img.onprogress = (e) => {
            if (onProgress) {
                info.loaded = e.loaded;
                info.total = e.total;
                onProgress(info);
            }
        };
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            fun(img, null);
        };
        return info;
    }
    web3d.loadImg = loadImg;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class binReader {
        constructor(buf, seek = 0) {
            this._arrayBuffer = buf;
            this._byteOffset = seek;
            this._data = new DataView(buf, seek);
        }
        seek(seek) {
            this._byteOffset = seek;
        }
        peek() {
            return this._byteOffset;
        }
        getPosition() {
            return this._byteOffset;
        }
        getLength() {
            return this._data.byteLength;
        }
        canread() {
            return this._data.byteLength - this._byteOffset;
        }
        skipBytes(len) {
            this._byteOffset += len;
        }
        readString() {
            let slen = this._data.getUint8(this._byteOffset);
            this._byteOffset++;
            let bs = "";
            for (let i = 0; i < slen; i++) {
                bs += String.fromCharCode(this._data.getUint8(this._byteOffset));
                this._byteOffset++;
            }
            return bs;
        }
        readStrLenAndContent() {
            let leng = this.readByte();
            return this.readUint8ArrToString(leng);
        }
        static _decodeBufferToText(buffer) {
            let result = "";
            const length = buffer.byteLength;
            for (let i = 0; i < length; i++) {
                result += String.fromCharCode(buffer[i]);
            }
            return result;
        }
        static utf8ArrayToString(array) {
            let ret = [];
            for (let i = 0; i < array.length; i++) {
                let cc = array[i];
                if (cc == 0)
                    break;
                let ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = array[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                }
                else {
                    ret.push(String.fromCharCode(array[i]));
                }
            }
            return ret.join('');
        }
        readUint8ArrToString(length) {
            let arr = this.readUint8Array(length);
            return binReader._decodeBufferToText(arr);
        }
        readSingle() {
            let num = this._data.getFloat32(this._byteOffset, true);
            this._byteOffset += 4;
            return num;
        }
        readDouble() {
            let num = this._data.getFloat64(this._byteOffset, true);
            this._byteOffset += 8;
            return num;
        }
        readInt8() {
            let num = this._data.getInt8(this._byteOffset);
            this._byteOffset += 1;
            return num;
        }
        readUInt8() {
            let num = this._data.getUint8(this._byteOffset);
            this._byteOffset += 1;
            return num;
        }
        readInt16() {
            let num = this._data.getInt16(this._byteOffset, true);
            this._byteOffset += 2;
            return num;
        }
        readUInt16() {
            let num = this._data.getUint16(this._byteOffset, true);
            this._byteOffset += 2;
            return num;
        }
        readInt32() {
            let num = this._data.getInt32(this._byteOffset, true);
            this._byteOffset += 4;
            return num;
        }
        readUint32() {
            let num = this._data.getUint32(this._byteOffset, true);
            this._byteOffset += 4;
            return num;
        }
        readUint8Array(length) {
            const value = new Uint8Array(this._arrayBuffer, this._byteOffset, length);
            this._byteOffset += length;
            return value;
        }
        readUint8ArrayByOffset(target, offset, length = 0) {
            if (length < 0)
                length = target.length;
            for (let i = 0; i < length; i++) {
                target[i] = this._data.getUint8(offset);
                offset++;
            }
            return target;
        }
        set position(value) {
            this.seek(value);
        }
        get position() {
            return this.peek();
        }
        readBoolean() {
            return this.readUInt8() > 0;
        }
        readByte() {
            return this.readUInt8();
        }
        readUnsignedShort() {
            return this.readUInt16();
        }
        readUnsignedInt() {
            return this.readUint32();
        }
        readFloat() {
            return this.readSingle();
        }
        readSymbolByte() {
            return this.readInt8();
        }
        readShort() {
            return this.readInt16();
        }
        readInt() {
            return this.readInt32();
        }
    }
    web3d.binReader = binReader;
    class binWriter {
        constructor() {
            let buf = new ArrayBuffer(1024);
            this._length = 0;
            this._buf = new Uint8Array(buf);
            this._data = new DataView(this._buf.buffer);
            this._seek = 0;
        }
        sureData(addlen) {
            let nextlen = this._buf.byteLength;
            while (nextlen < (this._length + addlen)) {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength) {
                let newbuf = new Uint8Array(nextlen);
                for (let i = 0; i < this._length; i++) {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
                this._data = new DataView(this._buf.buffer);
            }
            this._length += addlen;
        }
        getLength() {
            return length;
        }
        getBuffer() {
            return this._buf.buffer.slice(0, this._length);
        }
        seek(seek) {
            this._seek = seek;
        }
        peek() {
            return this._seek;
        }
        writeInt8(num) {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;
        }
        writeUInt8(num) {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        }
        writeInt16(num) {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        }
        writeUInt16(num) {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        }
        writeInt32(num) {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        }
        writeUInt32(num) {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        }
        writeSingle(num) {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        }
        writeDouble(num) {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        }
        writeStringAnsi(str) {
            let slen = str.length;
            this.sureData(slen + 1);
            this._data.setUint8(this._seek, slen);
            this._seek++;
            for (let i = 0; i < slen; i++) {
                this._data.setUint8(this._seek, str.charCodeAt(i));
                this._seek++;
            }
        }
        writeStringUtf8(str) {
            let bstr = binWriter.stringToUtf8Array(str);
            this.writeUInt8(bstr.length);
            this.writeUint8Array(bstr);
        }
        static stringToUtf8Array(str) {
            let bstr = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return bstr;
        }
        writeStringUtf8DataOnly(str) {
            let bstr = binWriter.stringToUtf8Array(str);
            this.writeUint8Array(bstr);
        }
        writeUint8Array(array, offset = 0, length = -1) {
            if (length < 0)
                length = array.length;
            this.sureData(length);
            for (let i = offset; i < offset + length; i++) {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        }
        get length() {
            return this._seek;
        }
        writeByte(num) {
            this.writeUInt8(num);
        }
        writeBytes(array, offset = 0, length = 0) {
            this.writeUint8Array(array, offset, length);
        }
        writeUnsignedShort(num) {
            this.writeUInt16(num);
        }
        writeUnsignedInt(num) {
            this.writeUInt32(num);
        }
        writeFloat(num) {
            this.writeSingle(num);
        }
        writeUTFBytes(str) {
            let strArray = binWriter.stringToUtf8Array(str);
            this.writeUint8Array(strArray);
        }
        writeSymbolByte(num) {
            this.writeInt8(num);
        }
        writeShort(num) {
            this.writeInt16(num);
        }
        writeInt(num) {
            this.writeInt32(num);
        }
    }
    web3d.binWriter = binWriter;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class webworker {
        constructor() {
            this.workerLoad = {};
            this.worker = new Worker("");
            this.worker.onmessage = (msg) => {
                this.onMsg(msg);
            };
        }
        static get inc() {
            if (!this._inc) {
                this._inc = new webworker();
            }
            return this._inc;
        }
        ;
        Load(msg, onFinish = null) {
            let taskid = new WebWorkerTaskID();
            msg.id = taskid.getID();
            this.worker.postMessage(msg);
            this.workerLoad[msg.id] = onFinish;
        }
        onMsg(msg) {
            console.log("assetmgr receive msg: type: " + msg.data.id);
            let onFinish = this.workerLoad[msg.data.id];
            if (onFinish)
                onFinish(msg.data);
        }
    }
    web3d.webworker = webworker;
    class WebWorkerTaskID {
        constructor() {
            this.id = WebWorkerTaskID.next();
        }
        static next() {
            let next = WebWorkerTaskID.idAll;
            WebWorkerTaskID.idAll++;
            return next;
        }
        getID() {
            return this.id;
        }
    }
    WebWorkerTaskID.idAll = 1;
    web3d.WebWorkerTaskID = WebWorkerTaskID;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class PostEffectMgr {
        static get depthTex() {
            if (this._depthTex == null) {
                this._depthTex = new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height);
                this.renderSceneTobaseTex();
            }
            return this._depthTex;
        }
        static render(effects) {
            if (!this.beInit) {
                this.beInit = true;
                this.baseTex = new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height);
                this.tempt1.push(new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height));
                this.tempt1.push(new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height));
                let shader = web3d.assetMgr.load("resource/shader/posteffect/bassPosteffect.shader.json");
                this.endmat = new web3d.Material();
                this.endmat.setShader(shader);
            }
            this.renderSceneTobaseTex();
            this.lastRenderTex = this.baseTex;
            for (let i = 0, len = effects.length; i < len; i++) {
                effects[i].OnBeforeRender(this.lastRenderTex);
                effects[i].OnRender(this.tempt1[i % 2]);
                this.lastRenderTex = effects[i].renderTarget;
            }
            this.OnPostEffectEndRender();
        }
        static renderSceneTobaseTex() {
            this.baseTex.fbo.attach();
            web3d.webgl.clearColor(0.3, 0.3, 0.3, 1);
            web3d.webgl.clearDepth(1.0);
            web3d.webgl.clear(web3d.webgl.COLOR_BUFFER_BIT | web3d.webgl.DEPTH_BUFFER_BIT);
            web3d.renderContext.curCamera.viewPort(this.baseTex);
            web3d.renderMgr.renderOnce();
        }
        static renderSceneToDepthTex() {
        }
        static OnPostEffectEndRender() {
            web3d.webgl.bindFramebuffer(web3d.webgl.FRAMEBUFFER, null);
            web3d.renderContext.curCamera.viewPort();
            web3d.webgl.depthMask(true);
            web3d.webgl.clearColor(0, 0, 0, 1);
            web3d.webgl.clearDepth(1.0);
            web3d.webgl.clear(web3d.webgl.COLOR_BUFFER_BIT | web3d.webgl.DEPTH_BUFFER_BIT);
            let mesh = web3d.assetMgr.getDefaultMesh("quad");
            this.endmat.setTexture("_MainTex", this.lastRenderTex);
            web3d.renderMgr.draw(mesh, this.endmat, mesh.submeshs[0], web3d.DrawTypeEnum.BASE);
        }
    }
    PostEffectMgr.tempt1 = [];
    PostEffectMgr.beInit = false;
    web3d.PostEffectMgr = PostEffectMgr;
    class BassPostEffect {
        constructor() {
            this.mat = new web3d.Material();
        }
        OnBeforeRender(srcTex) {
            this.mat.setTexture("_MainTex", srcTex);
        }
        OnRender(dstTex) {
            if (this.renderTarget == null) {
                this.renderTarget = dstTex;
            }
            this.renderTarget.fbo.attach();
            web3d.renderContext.curCamera.viewPort(this.renderTarget);
            web3d.webgl.depthMask(true);
            web3d.webgl.clearColor(1, 1, 1, 1);
            web3d.webgl.clearDepth(1.0);
            web3d.webgl.clear(web3d.webgl.COLOR_BUFFER_BIT | web3d.webgl.DEPTH_BUFFER_BIT);
            let mesh = web3d.assetMgr.getDefaultMesh("quad");
            web3d.renderMgr.draw(mesh, this.mat, mesh.submeshs[0], web3d.DrawTypeEnum.BASE);
        }
    }
    web3d.BassPostEffect = BassPostEffect;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Blur extends web3d.BassPostEffect {
        constructor() {
            super();
            this.renderTarget = new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height);
            let shader = web3d.assetMgr.load("resource/shader/posteffect/blur.shader.json");
            this.mat.setShader(shader);
        }
    }
    web3d.Blur = Blur;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Mosaic extends web3d.BassPostEffect {
        constructor() {
            super();
            this.renderTarget = new web3d.RenderTexture(web3d.GameScreen.Width, web3d.GameScreen.Height);
            let shader = web3d.assetMgr.load("resource/shader/posteffect/mosaic.shader.json");
            this.mat.setShader(shader);
        }
    }
    web3d.Mosaic = Mosaic;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ShaderPass {
        constructor() {
            this.program = [];
        }
    }
    web3d.ShaderPass = ShaderPass;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class DynamicBatch {
        constructor(mesh, mat) {
        }
    }
    web3d.DynamicBatch = DynamicBatch;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class GlMesh {
        constructor() {
            this.renderModel = webGraph.rendingWebgl.STATIC_DRAW;
            this.vaoDic = {};
            this.VertexAttDic = {};
        }
        declareVboWithAtts(vertexInfos, model = webGraph.RenderModelEnum.static) {
            this.vertexByteSize = 0;
            for (let key in vertexInfos) {
                this.vertexByteSize += vertexInfos[key].byteSize;
            }
            this.vertexCount = vertexInfos[webGraph.VertexAttTypeEnum.Position].count;
            let vbo = new webGraph.VertexBuffer(model);
            vbo.bufferData(this.vertexByteSize * this.vertexCount);
            let offset = 0;
            for (let key in vertexInfos) {
                let att = vertexInfos[key];
                vbo.bufferSubData(att.view, offset);
                this.VertexAttDic[key] = webGraph.VertexAttribute.createByType(key, vertexInfos[key]);
                this.VertexAttDic[key].offsetInBytes = offset;
                this.VertexAttDic[key].strideInBytes = att.byteSize;
                this.VertexAttDic[key].vbo = vbo;
                offset += att.byteSize * att.count;
            }
            if (this.vbo != null) {
                this.vbo.dispose();
            }
            this.vbo = vbo;
        }
        refreshVboWithAtt(att) {
            this.vbo.bufferSubData(att.view, this.VertexAttDic[att.type].offsetInBytes);
        }
        declareVboWithInterleavedData(vbodata, attInfo, model = webGraph.RenderModelEnum.static) {
            let vbo = new webGraph.VertexBuffer(model);
            vbo.bufferData(vbodata);
            for (let key in attInfo) {
                let att = attInfo[key];
                this.VertexAttDic[att.attName] = webGraph.VertexAttribute.createByType(key);
                this.VertexAttDic[att.attName].offsetInBytes = att.offsetInBytes;
                this.VertexAttDic[att.attName].strideInBytes = att.strideInBytes;
                this.VertexAttDic[att.attName].vbo = vbo;
            }
            if (this.vbo != null) {
                this.vbo.dispose();
            }
            this.vbo = vbo;
        }
        refreshVboWithInterleavedData(vbodata) {
            this.vbo.bufferData(vbodata);
        }
        declareEboWithData(ebodata) {
            if (this.ebo != null) {
                this.ebo.dispose();
            }
            this.ebo = new webGraph.ElementBuffer();
            this.ebo.bufferData(ebodata);
        }
        refreshEboWithData(ebodata) {
            this.ebo.bufferData(ebodata);
        }
        dispose() {
        }
    }
    web3d.GlMesh = GlMesh;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Graphics {
        static bindShaderPass(pass, programIndex = 0, uniformDic, defUniform) {
            let program = pass.program[programIndex];
            if (program == null) {
                this.bindMat(web3d.assetMgr.getDefaultMaterial("defcolor"), pass.drawtype, programIndex);
                return;
            }
            webGraph.render.bindProgram(program);
            webGraph.render.applyMatUniforms(program, web3d.ShaderVariant.AutoUniformDic, uniformDic, defUniform);
        }
        static bindMat(mat, drawType, programIndex = 0) {
            if (mat == null) {
                return;
            }
            let shader = mat.getShader();
            if (shader == null) {
                shader = web3d.assetMgr.getShader("defcolor");
                return;
            }
            let pass = shader.getPass(drawType);
            if (pass == null) {
                shader = web3d.assetMgr.getShader("defcolor");
                pass = shader.getPass(drawType);
            }
            this.bindShaderPass(pass, programIndex, mat.UniformDic, shader.mapUniformDef);
        }
        static drawSubMesh(mesh, mat, matrix = null, drawType = null, layer = null, submeshIndex = null, cam = null) {
            if (mesh == null || mat == null)
                return;
            web3d.renderMgr.renderlist.addRenderItem({ mesh: mesh,
                matrix: matrix || MathD.mat4.Identity,
                mat: mat,
                drawType: web3d.renderMgr.globalDrawType & (drawType || web3d.DrawTypeEnum.BASE),
                layermask: layer || web3d.LayerMask.default,
                submeshIndex: submeshIndex || 0,
                cam: cam });
        }
        static drawSubMeshInstanced(mesh, mat, matrix, drawType = null, layer = null, submeshIndex = null, cam = null) {
            if (mesh == null || mat == null)
                return;
            web3d.renderMgr.renderlist.addRenderItem({ mesh: mesh,
                matrix: matrix,
                mat: mat,
                drawType: web3d.renderMgr.globalDrawType & (drawType || web3d.DrawTypeEnum.BASE),
                layermask: layer || web3d.LayerMask.default,
                submeshIndex: submeshIndex || 0,
                intanceCount: matrix.length,
                cam: cam });
        }
        static drawMesh(mesh, mat, matrix, drawType, layer, cam = null) {
            for (let i = 0; i < mesh.submeshs.length; i++) {
                this.drawSubMesh(mesh, mat[i], matrix, drawType, layer, i, cam);
            }
        }
        static drawMeshNow(mesh, submeshIndex) {
            let submesh = mesh.submeshs[submeshIndex];
            webGraph.render.bindMeshData(mesh.glMesh);
            if (submesh.beUseEbo) {
                web3d.webgl.drawElements(submesh.renderType, submesh.size, web3d.webgl.UNSIGNED_SHORT, submesh.start);
                if (webGraph.RenderStateMgr.currentOP.clearDepth) {
                    web3d.webgl.clear(web3d.webgl.DEPTH_BUFFER_BIT);
                }
            }
            else {
                web3d.webgl.drawArrays(submesh.renderType, submesh.start, submesh.size);
            }
        }
        static drawObjectsNow(cam, renderlist) {
            renderlist.foreach((item) => {
                if (cam.cullingMask & item.layermask) {
                    if (!cam.frustum.intersectSphere(item.mesh.getBoundingSphere(), item.matrix))
                        return;
                    let mat = item.mat;
                    let drawType = item.drawType;
                    let shader = mat.getShader();
                    if (shader == null) {
                        shader = web3d.assetMgr.getDefaultMaterial("defcolor").getShader();
                    }
                    let pass = shader.getPass(drawType);
                    if (pass == null) {
                        pass = web3d.assetMgr.getDefaultMaterial("defcolor").getShader().getPass(drawType);
                    }
                    for (let i = 0; i < pass.program.length; i++) {
                        this.bindShaderPass(pass, i, item.mat.UniformDic, shader.mapUniformDef);
                        this.drawMeshNow(item.mesh, item.submeshIndex);
                    }
                }
            });
        }
    }
    web3d.Graphics = Graphics;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class RenderTexture {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            let fboOp = webGraph.FboOption.getDefColorDepthComboOP(width, height);
            this.fbo = new webGraph.FrameBuffer(fboOp);
            this.glTexture = this.fbo.colorTextures[0];
        }
    }
    web3d.RenderTexture = RenderTexture;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class RenderContext {
        constructor() {
            this.activeTexCount = 0;
            this.viewPortPixel = new MathD.Rect(0, 0, 0, 0);
            this.matrixNormalToworld = MathD.mat4.create();
            this.matrixModelView = MathD.mat4.create();
            this.matrixModelViewProject = MathD.mat4.create();
            this.intLightCount = 0;
            this.vec4LightPos = new Float32Array(32);
            this.vec4LightDir = new Float32Array(32);
            this.floatLightSpotAngleCos = new Float32Array(8);
            this.lightmap = null;
        }
        updateCamera(camera) {
            this.curCamera = camera;
            this.matrixView = camera.ViewMatrix;
            this.matrixProject = camera.ProjectMatrix;
            this.matrixViewProject = camera.ViewProjectMatrix;
            this.campos = camera.gameObject.transform.worldPosition;
        }
        updateOverlay() {
            MathD.mat4.identity(this.matrixModelViewProject);
        }
        updateModel(model) {
            this.matrixModel = model.worldMatrix;
            MathD.mat4.multiply(this.matrixView, this.matrixModel, this.matrixModelView);
            MathD.mat4.multiply(this.matrixViewProject, this.matrixModel, this.matrixModelViewProject);
        }
        updateModeTrail() {
            MathD.mat4.copy(this.matrixView, this.matrixModelView);
            MathD.mat4.copy(this.matrixViewProject, this.matrixModelViewProject);
        }
    }
    web3d.RenderContext = RenderContext;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class RenderList {
        constructor() {
            this.layerLists = {};
            this.layerLists[web3d.RenderLayerEnum.Background] = new LayerList("Background");
            this.layerLists[web3d.RenderLayerEnum.Geometry] = new LayerList("Geometry");
            this.layerLists[web3d.RenderLayerEnum.AlphaTest] = new LayerList("AlphaTest");
            this.layerLists[web3d.RenderLayerEnum.Transparent] = new LayerList("Transparent");
            this.layerLists[web3d.RenderLayerEnum.Overlay] = new LayerList("Overlay");
        }
        clear() {
            for (let key in this.layerLists) {
                this.layerLists[key].clear();
            }
        }
        addRenderItem(item) {
            let layerIndex = item.mat.layer;
            this.layerLists[layerIndex].addRender(item);
        }
        setLayerSortFunc(layer, queuesortfunc) {
            this.layerLists[layer].queueSortFunc = queuesortfunc;
        }
        foreach(fuc) {
            this.layerLists[web3d.RenderLayerEnum.Background].foreach(fuc);
            this.layerLists[web3d.RenderLayerEnum.Geometry].foreach(fuc);
            this.layerLists[web3d.RenderLayerEnum.AlphaTest].foreach(fuc);
            this.layerLists[web3d.RenderLayerEnum.Transparent].foreach(fuc);
            this.layerLists[web3d.RenderLayerEnum.Overlay].foreach(fuc);
        }
        static get(cam) {
            if (this.map[cam.gameObject.id] != null) {
                return this.map[cam.gameObject.id];
            }
            else {
                let list = new RenderList();
                this.map[cam.gameObject.id] = list;
                return list;
            }
        }
    }
    RenderList.map = {};
    web3d.RenderList = RenderList;
    class LayerList {
        constructor(layerType, queueSortFunc = null) {
            this.queDic = {};
            this.queArr = [];
            this.layer = layerType;
            this.queueSortFunc = queueSortFunc;
        }
        addRender(item) {
            let queue = item.mat.queue;
            let value = this.queDic[queue];
            if (value == null) {
                this.queDic[queue] = [];
                this.queArr.push(queue);
            }
            this.queDic[queue].push(item);
        }
        sort() {
            if (this.queArr.length > 1) {
                this.queArr.sort();
            }
            for (let i = 0, len1 = this.queArr.length; i < len1; i++) {
                let arr = this.queDic[this.queArr[i]];
                if (this.queueSortFunc) {
                    this.queueSortFunc(arr);
                }
            }
        }
        foreach(fuc) {
            for (let i = 0, len1 = this.queArr.length; i < len1; i++) {
                let arr = this.queDic[this.queArr[i]];
                arr.forEach((item) => {
                    fuc(item);
                });
            }
        }
        clear() {
            this.queDic = {};
            this.queArr.length = 0;
        }
    }
    web3d.LayerList = LayerList;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Rendermgr {
        constructor() {
            this.renderlist = new web3d.RenderList();
            this.renderCameras = [];
            this.renderLights = [];
            this.globalDrawType = web3d.DrawTypeEnum.SKIN;
            this.activeInstanceDrawType = false;
            this.InstanceMaxCount = 10000;
            this.instanceDataInit = false;
            this.posArr = [];
            this.rotArr = [];
            this.scaleArr = [];
            this.renderlistall = new renderListAll();
        }
        beforeRender() {
            this.renderlistall.clear();
            this.renderCameras.length = 0;
            this.renderLights.length = 0;
            web3d.webgl.clearStencil(0);
            web3d.webgl.clear(web3d.webgl.STENCIL_BUFFER_BIT);
        }
        renderScene(scen) {
            this.beforeRender();
            this._fillRenderer(scen.getRoot());
            if (this.renderCameras.length > 1) {
                this.renderCameras.sort((a, b) => {
                    return a.order - b.order;
                });
            }
            ;
            for (let i = 0, len = this.renderCameras.length; i < len; i++) {
                let curCam = this.renderCameras[i];
                web3d.renderContext.curCamera = curCam;
                web3d.renderContext.updateCamera(curCam);
                curCam.frustum.setFromMatrix(curCam.ViewProjectMatrix);
                let lens = curCam.postEffectQueue.length;
                if (lens > 0) {
                    web3d.PostEffectMgr.render(curCam.postEffectQueue);
                }
                else {
                    curCam.clear();
                    curCam.viewPort();
                    this.renderOnce();
                }
            }
        }
        _fillRenderer(node) {
            if (node.gameObject.beVisible) {
                let obj = node.gameObject;
                if (obj.render != null) {
                    this.renderlistall.addRenderer(obj.render);
                }
                if (obj.getComponent(web3d.Light.type) != null) {
                    this.renderLights.push(obj.getComponent(web3d.Light.type));
                }
                if (obj.getComponent(web3d.Camera.type) != null) {
                    this.renderCameras.push(obj.getComponent(web3d.Camera.type));
                }
                for (let i = 0, len = node.children.length; i < len; i++) {
                    this._fillRenderer(node.children[i]);
                }
            }
        }
        renderOnce() {
            this.renderlistall.renderAll(web3d.renderContext.curCamera, (cam, list) => {
                this.instanceRenderAll(cam, list);
            });
        }
        draw(mesh, mat, submesh, localDrawType) {
            if (this.activeInstanceDrawType) {
                let drawtype = web3d.DrawTypeEnum.INSTANCe;
                mat = mat || web3d.assetMgr.getDefaultMaterial("def");
                let pass = mat.getShaderPass(drawtype);
                if (pass == null)
                    return;
                for (let i = 0; i < pass.program.length; i++) {
                    let usingProgram = pass.program[i];
                    webGraph.render.bindProgram(usingProgram);
                    webGraph.render.bindMeshDataDirectly(mesh.glMesh, usingProgram);
                    webGraph.render.BindeVertexData(this.posAtt);
                    webGraph.render.BindeVertexData(this.rotAtt);
                    webGraph.render.BindeVertexData(this.scaleAtt);
                    webGraph.render.applyMatUniforms(usingProgram, web3d.ShaderVariant.AutoUniformDic, mat.UniformDic, mat.getShader().mapUniformDef);
                    web3d.webgl.drawElementsInstanced(submesh.renderType, submesh.size, web3d.webgl.UNSIGNED_SHORT, submesh.start, this.instanceCount);
                }
            }
            else {
                let drawtype = this.globalDrawType & localDrawType;
                if (mat == null || mat.getShaderPass(drawtype) == null) {
                    mat = web3d.assetMgr.getDefaultMaterial("defcolor");
                }
                let pass = mat.getShaderPass(drawtype);
                for (let i = 0; i < pass.program.length; i++) {
                    this.bindMat(mat, drawtype, i);
                    this.drawMeshNow(mesh, i);
                }
            }
        }
        instanceRenderAll(cam, instanceList) {
            this.activeInstanceDrawType = true;
            if (this.instanceDataInit == false) {
                this.instanceDataInit = true;
                this.realPosDataArr = new Float32Array(this.InstanceMaxCount * 3);
                this.realRotDataArr = new Float32Array(this.InstanceMaxCount * 4);
                this.realScaleDataArr = new Float32Array(this.InstanceMaxCount * 3);
                for (let i = 0; i < this.InstanceMaxCount; i++) {
                    this.posArr[i] = new Float32Array(this.realPosDataArr.buffer, i * 12, 3);
                    this.rotArr[i] = new Float32Array(this.realRotDataArr.buffer, i * 16, 4);
                    this.scaleArr[i] = new Float32Array(this.realScaleDataArr.buffer, i * 12, 3);
                }
                this.posAtt = webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_pos, this.realPosDataArr);
                this.rotAtt = webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_rot, this.realRotDataArr);
                this.scaleAtt = webGraph.VertexAttribute.PrepareVertexAttribute(webGraph.VertexAttTypeEnum.instance_scale, this.realScaleDataArr);
            }
            for (let key in instanceList) {
                let arr = instanceList[key];
                let instanceCount = arr.length;
                if (instanceCount > this.InstanceMaxCount) {
                    instanceCount = this.InstanceMaxCount;
                    console.warn(" gpu instance Maxcount（" + this.InstanceMaxCount + "） 需要更大！,当前Instance数量：" + arr.length);
                }
                for (let k = 0; k < instanceCount; k++) {
                    let render = arr[k];
                    let worldPos = render.gameObject.transform.worldPosition;
                    let worldrot = render.gameObject.transform.worldRotation;
                    let worldscale = render.gameObject.transform.worldScale;
                    MathD.vec3.copy(worldPos, this.posArr[k]);
                    MathD.quat.copy(worldrot, this.rotArr[k]);
                    MathD.vec3.copy(worldscale, this.scaleArr[k]);
                }
                this.posAtt.refreshVboData(this.realPosDataArr);
                this.rotAtt.refreshVboData(this.realRotDataArr);
                this.scaleAtt.refreshVboData(this.realScaleDataArr);
                this.instanceCount = instanceCount;
                if (cam.cullingMask & arr[0].mask) {
                    arr[0].Render();
                }
            }
            this.activeInstanceDrawType = false;
        }
        bindMat(mat, drawType, programIndex = 0) {
            if (mat == null) {
                return;
            }
            let shader = mat.getShader();
            if (shader == null) {
                this.bindMat(web3d.assetMgr.getDefaultMaterial("defcolor"), drawType, programIndex);
                return;
            }
            let pass = shader.getPass(drawType);
            if (pass == null) {
                this.bindMat(web3d.assetMgr.getDefaultMaterial("defcolor"), drawType, programIndex);
                return;
            }
            this.bindShaderPass(pass, programIndex, mat.UniformDic, shader.mapUniformDef);
        }
        bindShaderPass(pass, programIndex = 0, uniformDic, defUniform) {
            let program = pass.program[programIndex];
            if (program == null) {
                this.bindMat(web3d.assetMgr.getDefaultMaterial("defcolor"), pass.drawtype, programIndex);
                return;
            }
            webGraph.render.bindProgram(program);
            webGraph.render.applyMatUniforms(program, web3d.ShaderVariant.AutoUniformDic, uniformDic, defUniform);
        }
        drawSubMesh(mesh, mat, matrix = null, drawType = null, layer = null, submeshIndex = null, cam = null) {
            if (mesh == null || mat == null)
                return;
            this.renderlist.addRenderItem({ mesh: mesh,
                matrix: matrix || MathD.mat4.Identity,
                mat: mat,
                drawType: drawType || web3d.DrawTypeEnum.BASE,
                layermask: layer || LayerMask.default,
                submeshIndex: submeshIndex || 0,
                cam: cam });
        }
        drawMesh(mesh, mat, matrix, drawType, layer, cam = null) {
            for (let i = 0; i < mesh.submeshs.length; i++) {
                this.drawSubMesh(mesh, mat[i], matrix, drawType, layer, i, cam);
            }
        }
        drawMeshNow(mesh, submeshIndex) {
            let submesh = mesh.submeshs[submeshIndex];
            webGraph.render.bindMeshData(mesh.glMesh);
            if (submesh.beUseEbo) {
                web3d.webgl.drawElements(submesh.renderType, submesh.size, web3d.webgl.UNSIGNED_SHORT, submesh.start);
                if (webGraph.RenderStateMgr.currentOP.clearDepth) {
                    web3d.webgl.clear(web3d.webgl.DEPTH_BUFFER_BIT);
                }
            }
            else {
                web3d.webgl.drawArrays(submesh.renderType, submesh.start, submesh.size);
            }
        }
    }
    web3d.Rendermgr = Rendermgr;
    let RenderLayerEnum;
    (function (RenderLayerEnum) {
        RenderLayerEnum[RenderLayerEnum["Background"] = 1000] = "Background";
        RenderLayerEnum[RenderLayerEnum["Geometry"] = 2000] = "Geometry";
        RenderLayerEnum[RenderLayerEnum["AlphaTest"] = 2450] = "AlphaTest";
        RenderLayerEnum[RenderLayerEnum["Transparent"] = 3000] = "Transparent";
        RenderLayerEnum[RenderLayerEnum["Overlay"] = 4000] = "Overlay";
    })(RenderLayerEnum = web3d.RenderLayerEnum || (web3d.RenderLayerEnum = {}));
    let LayerMask;
    (function (LayerMask) {
        LayerMask[LayerMask["ui"] = 1] = "ui";
        LayerMask[LayerMask["default"] = 2] = "default";
        LayerMask[LayerMask["editor"] = 4] = "editor";
        LayerMask[LayerMask["model"] = 8] = "model";
        LayerMask[LayerMask["everything"] = 4294967295] = "everything";
        LayerMask[LayerMask["nothing"] = 0] = "nothing";
        LayerMask[LayerMask["modelbeforeui"] = 8] = "modelbeforeui";
    })(LayerMask = web3d.LayerMask || (web3d.LayerMask = {}));
    class renderListAll {
        constructor() {
            this.renderLists = {};
            this.instanceList = {};
            this.renderLists[RenderLayerEnum.Background] = new RenderContainer("Background");
            this.renderLists[RenderLayerEnum.Geometry] = new RenderContainer("Geometry");
            this.renderLists[RenderLayerEnum.AlphaTest] = new RenderContainer("AlphaTest");
            this.renderLists[RenderLayerEnum.Transparent] = new RenderContainer("Transparent", (arr) => {
                arr.sort((a, b) => {
                    let matrixView = web3d.renderContext.matrixView;
                    let az = MathD.vec3.create();
                    let bz = MathD.vec3.create();
                    MathD.mat4.transformPoint(a.gameObject.transform.worldPosition, matrixView, az);
                    MathD.mat4.transformPoint(b.gameObject.transform.worldPosition, matrixView, bz);
                    let out = bz[2] - az[2];
                    MathD.vec3.recycle(az);
                    MathD.vec3.recycle(bz);
                    return out;
                });
            });
            this.renderLists[RenderLayerEnum.Overlay] = new RenderContainer("Overlay");
        }
        clear() {
            this.instanceList = {};
            for (let key in this.renderLists) {
                this.renderLists[key].clear();
            }
        }
        addRenderer(renderer) {
            if (renderer.BeRenderable()) {
                if (renderer.BeInstantiable() && webGraph.GLExtension.hasObjInstance) {
                    let key = renderer.materials[0].guid;
                    if (this.instanceList[key] == null) {
                        this.instanceList[key] = [];
                    }
                    else {
                        this.instanceList[key].push(renderer);
                    }
                }
                else {
                    this.renderLists[renderer.layer].addRender(renderer);
                }
            }
        }
        renderAll(cam, instanceDraw) {
            this.renderLists[RenderLayerEnum.Background].foreachRender(cam);
            this.renderLists[RenderLayerEnum.Geometry].foreachRender(cam);
            this.renderLists[RenderLayerEnum.AlphaTest].foreachRender(cam);
            instanceDraw(cam, this.instanceList);
            this.renderLists[RenderLayerEnum.Transparent].foreachRender(cam);
            this.renderLists[RenderLayerEnum.Overlay].foreachRender(cam);
        }
    }
    web3d.renderListAll = renderListAll;
    class RenderContainer {
        constructor(layerType, queueSortFunc = null) {
            this.queDic = {};
            this.queArr = [];
            this.layer = layerType;
            this._queueSortFunc = queueSortFunc;
        }
        addRender(render) {
            let value = this.queDic[render.queue];
            if (value == null) {
                this.queDic[render.queue] = [];
                this.queArr.push(render.queue);
            }
            this.queDic[render.queue].push(render);
        }
        foreachRender(cam) {
            if (this.queArr.length > 1) {
                this.queArr.sort();
            }
            for (let i = 0, len = this.queArr.length; i < len; i++) {
                let arr = this.queDic[this.queArr[i]];
                if (this._queueSortFunc) {
                    this._queueSortFunc(arr);
                }
                for (let k = 0, len2 = arr.length; k < len2; k++) {
                    let render = arr[k];
                    if (cam.cullingMask & render.mask && cam.frustum.intersectRender(render)) {
                        render.Render();
                    }
                }
            }
        }
        clear() {
            this.queDic = {};
            this.queArr.length = 0;
        }
    }
    web3d.RenderContainer = RenderContainer;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class ShaderVariant {
        static registAutoUniform() {
            this.AutoUniformDic["u_mat_model"] = () => { return web3d.renderContext.matrixModel; };
            this.AutoUniformDic["u_mat_view"] = () => { return web3d.renderContext.matrixView; };
            this.AutoUniformDic["u_mat_project"] = () => { return web3d.renderContext.matrixProject; };
            this.AutoUniformDic["u_mat_ModelView"] = () => { return web3d.renderContext.matrixModelView; };
            this.AutoUniformDic["u_mat_viewproject"] = () => { return web3d.renderContext.matrixViewProject; };
            this.AutoUniformDic["u_mat_mvp"] = () => { return web3d.renderContext.matrixModelViewProject; };
            this.AutoUniformDic["u_mat_ui"] = () => { return web3d.renderContext2d.matrix_UI; };
            this.AutoUniformDic["u_mat_normal"] = () => {
                MathD.mat4.invert(web3d.renderContext.matrixModel, web3d.renderContext.matrixNormalToworld);
                MathD.mat4.transpose(web3d.renderContext.matrixNormalToworld, web3d.renderContext.matrixNormalToworld);
                return web3d.renderContext.matrixNormalToworld;
            };
            this.AutoUniformDic["u_timer"] = () => { return web3d.GameTimer.Time; };
            this.AutoUniformDic["u_campos"] = () => { return web3d.renderContext.campos; };
            this.AutoUniformDic["u_LightmapTex"] = () => {
                return web3d.renderContext.lightmap[web3d.renderContext.lightmapIndex];
            };
            this.AutoUniformDic["u_lightmapOffset"] = () => { return web3d.renderContext.lightmapTilingOffset; };
            this.AutoUniformDic["u_lightposs"] = () => { return web3d.renderContext.vec4LightPos; };
            this.AutoUniformDic["u_lightdirs"] = () => { return web3d.renderContext.vec4LightDir; };
            this.AutoUniformDic["u_spotangelcoss"] = () => { return web3d.renderContext.floatLightSpotAngleCos; };
        }
    }
    ShaderVariant.AutoUniformDic = {};
    web3d.ShaderVariant = ShaderVariant;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    let HideFlags;
    (function (HideFlags) {
        HideFlags[HideFlags["None"] = 0] = "None";
        HideFlags[HideFlags["HideInHierarchy"] = 1] = "HideInHierarchy";
        HideFlags[HideFlags["HideInInspector"] = 2] = "HideInInspector";
        HideFlags[HideFlags["DontSaveInEditor"] = 4] = "DontSaveInEditor";
        HideFlags[HideFlags["NotEditable"] = 8] = "NotEditable";
        HideFlags[HideFlags["DontSaveInBuild"] = 16] = "DontSaveInBuild";
        HideFlags[HideFlags["DontUnloadUnusedAsset"] = 32] = "DontUnloadUnusedAsset";
        HideFlags[HideFlags["DontSave"] = 52] = "DontSave";
        HideFlags[HideFlags["HideAndDontSave"] = 61] = "HideAndDontSave";
    })(HideFlags = web3d.HideFlags || (web3d.HideFlags = {}));
    class ObjID {
        static next() {
            let next = ObjID.idAll;
            ObjID.idAll++;
            return next;
        }
    }
    ObjID.idAll = 0;
    let GameObject = class GameObject {
        constructor() {
            this.name = "GameObject";
            this.beVisible = true;
            this.mask = web3d.LayerMask.default;
            this.comps = {};
            this.componentsInit = [];
            this.transform = new web3d.Transform();
            this.transform.gameObject = this;
            this.id = ObjID.next();
        }
        start() {
            if (this.componentsInit.length == 0)
                return;
            for (let i = 0, len = this.componentsInit.length; i < len; i++) {
                if (this.componentsInit[i].Start == null) {
                    console.error(this.componentsInit);
                }
                this.componentsInit[i].Start();
            }
            this.componentsInit.length = 0;
        }
        update(delta) {
            for (let key in this.comps) {
                this.comps[key].Update();
            }
        }
        addComponent(type) {
            let className = type;
            if (this.comps[type] != null) {
                console.error("ERROR: This Gameobject already have same type component.\n INFO:component name: " + type);
                return this.comps[type];
            }
            let comp = web3d.creatComponent(className);
            if (comp) {
                comp.gameObject = this;
                this.comps[type] = comp;
                this.componentsInit.push(comp);
                if (type == web3d.MeshRender.type || type == web3d.SimpleSkinMeshRender.type || type == web3d.SkinMeshRender.type || type == web3d.Text3d.type) {
                    this.render = comp;
                }
            }
            return comp;
        }
        removeComponent(comp) {
            this.comps[comp["type"]].Dispose();
            delete this.comps[comp["type"]];
        }
        removeComponentByType(type) {
            this.comps[type].Dispose();
            delete this.comps[type];
        }
        removeAllComponents() {
            for (let key in this.comps) {
                this.removeComponentByType(key);
            }
            this.comps = {};
        }
        getComponent(type) {
            return this.comps[type];
        }
        getComponentsInChildren(name) {
            let components = [];
            let obj = this;
            let comp = obj.getComponent(name);
            if (comp != null) {
                components.push(comp);
            }
            this.getCompoentInchilds(name, obj, components);
            return components;
        }
        getCompoentInchilds(name, obj, comps) {
            let trans = obj.transform.children;
            for (let i = 0, len = trans.length; i < len; i++) {
                let comp = trans[i].gameObject.getComponent(name);
                if (comp != null) {
                    comps.push(comp);
                }
                this.getCompoentInchilds(name, trans[i].gameObject, comps);
            }
        }
        dispose() {
            this.removeAllComponents();
        }
    };
    __decorate([
        web3d.Attribute,
        __metadata("design:type", String)
    ], GameObject.prototype, "name", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Object)
    ], GameObject.prototype, "beVisible", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Number)
    ], GameObject.prototype, "mask", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", web3d.Transform)
    ], GameObject.prototype, "transform", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Object)
    ], GameObject.prototype, "comps", void 0);
    GameObject = __decorate([
        web3d.Serialize("GameObject"),
        __metadata("design:paramtypes", [])
    ], GameObject);
    web3d.GameObject = GameObject;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Quadtree {
        constructor(level, bounds) {
            this.MAX_OBJECTS = 10;
            this.MAX_LEVELS = 5;
            this.level = level;
            this.bounds = bounds;
            this.objects = [];
            this._stuckChildren = [];
            this.nodes = [];
        }
        clear() {
            this.objects.length = 0;
            this._stuckChildren.length = 0;
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i] != null) {
                    this.nodes[i].clear();
                    this.nodes[i] = null;
                }
            }
        }
        split() {
            let subWidth = this.bounds.width / 2;
            let subHeight = this.bounds.height / 2;
            let x = this.bounds.x;
            let y = this.bounds.y;
            this.nodes[Quadtree.TOP_LEFT] = new Quadtree(this.level + 1, MathD.Rect.create(x, y, subWidth, subHeight));
            this.nodes[Quadtree.TOP_RIGHT] = new Quadtree(this.level + 1, MathD.Rect.create(x + subWidth, y, subWidth, subHeight));
            this.nodes[Quadtree.BOTTOM_LEFT] = new Quadtree(this.level + 1, MathD.Rect.create(x, y + subHeight, subWidth, subHeight));
            this.nodes[Quadtree.BOTTOM_RIGHT] = new Quadtree(this.level + 1, MathD.Rect.create(x + subWidth, y + subHeight, subWidth, subHeight));
        }
        getIndex(pRect) {
            var left = (pRect.x > this.bounds.x + this.bounds.width / 2) ? false : true;
            var top = (pRect.y > this.bounds.y + this.bounds.height / 2) ? false : true;
            if (left) {
                if (top) {
                    return Quadtree.TOP_LEFT;
                }
                else {
                    return Quadtree.BOTTOM_LEFT;
                }
            }
            else {
                if (top) {
                    return Quadtree.TOP_RIGHT;
                }
                else {
                    return Quadtree.BOTTOM_RIGHT;
                }
            }
        }
        insert(item) {
            if (this.nodes.length > 0) {
                let index = this.getIndex(item);
                if (item.x > this.bounds.x && item.x + item.width <= this.bounds.x + this.bounds.width &&
                    item.y > this.bounds.y && item.y + item.height <= this.bounds.y + this.bounds.height) {
                    this.nodes[index].insert(item);
                }
                else {
                    this._stuckChildren.push(item);
                }
                return;
            }
            this.objects.push(item);
            let len = this.objects.length;
            if (len > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
                this.split();
                for (let i = 0; i < len; i++) {
                    this.insert(this.objects[i]);
                }
                this.objects.length = 0;
            }
        }
        retrieveAllObjects(item) {
            let arr = [];
            this.retrieve(arr, item);
            return arr;
        }
        retrieve(returnObjects, item) {
            if (this.nodes.length > 0) {
                let index = this.getIndex(item);
                let node = this.nodes[index];
                if (item.x >= node.bounds.x && item.x + item.width <= node.bounds.x + node.bounds.width &&
                    item.y >= node.bounds.y && item.y + item.height <= node.bounds.y + node.bounds.height) {
                    node.retrieve(returnObjects, item);
                }
                else {
                    if (item.x <= this.nodes[Quadtree.TOP_RIGHT].bounds.x) {
                        if (item.y <= this.nodes[Quadtree.BOTTOM_LEFT].bounds.y) {
                            this.nodes[Quadtree.TOP_LEFT].getAllContent(returnObjects);
                        }
                        if (item.y + item.height > this.nodes[Quadtree.BOTTOM_LEFT].bounds.y) {
                            this.nodes[Quadtree.BOTTOM_LEFT].getAllContent(returnObjects);
                        }
                    }
                    if (item.x + item.width > this.nodes[Quadtree.TOP_RIGHT].bounds.x) {
                        if (item.y <= this.nodes[Quadtree.BOTTOM_RIGHT].bounds.y) {
                            this.nodes[Quadtree.TOP_RIGHT].getAllContent(returnObjects);
                        }
                        if (item.y + item.height > this.nodes[Quadtree.BOTTOM_RIGHT].bounds.y) {
                            this.nodes[Quadtree.BOTTOM_RIGHT].getAllContent(returnObjects);
                        }
                    }
                }
            }
        }
        getAllContent(returnArr) {
            if (this.nodes.length) {
                for (let i = 0; i < this.nodes.length; i++) {
                    this.nodes[i].getAllContent(returnArr);
                }
            }
            this.objects.forEach((item) => {
                returnArr.push(item);
            });
            this._stuckChildren.forEach((item) => {
                returnArr.push(item);
            });
        }
        ;
    }
    Quadtree.TOP_LEFT = 0;
    Quadtree.TOP_RIGHT = 1;
    Quadtree.BOTTOM_LEFT = 2;
    Quadtree.BOTTOM_RIGHT = 3;
    web3d.Quadtree = Quadtree;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Scene {
        constructor() {
            this.rootNode = new web3d.GameObject().transform;
            this.lightmaps = [];
        }
        update(delta) {
            this.updateGameObject(this.rootNode, delta);
            web3d.Canvas.inc.update(delta);
            web3d.renderMgr.renderScene(this);
            web3d.Canvas.inc.render();
            web3d.webgl.flush();
        }
        updateGameObject(node, delta) {
            node.gameObject.start();
            node.gameObject.update(delta);
            for (let i = 0, len = node.children.length; i < len; i++) {
                this.updateGameObject(node.children[i], delta);
            }
        }
        addChild(node) {
            if (node instanceof web3d.Transform) {
                this.rootNode.addChild(node);
            }
            else {
                web3d.Canvas.inc.addChild(node);
            }
        }
        removeChild(node) {
            this.rootNode.removeChild(node);
        }
        getChild(index) {
            return this.rootNode.children[index];
        }
        getChilds() {
            return this.rootNode.children;
        }
        getChildCount() {
            return this.rootNode.children.length;
        }
        getChildByName(name) {
            let res = this.rootNode.find(name);
            return res;
        }
        getRoot() {
            return this.rootNode;
        }
        enableFog() {
            web3d.renderMgr.globalDrawType = web3d.renderMgr.globalDrawType | web3d.DrawTypeEnum.FOG;
        }
        disableFog() {
            web3d.renderMgr.globalDrawType = web3d.renderMgr.globalDrawType & web3d.DrawTypeEnum.NOFOG;
        }
        enableLightMap() {
            web3d.renderMgr.globalDrawType = web3d.renderMgr.globalDrawType | web3d.DrawTypeEnum.LIGHTMAP;
        }
        disableLightMap() {
            web3d.renderMgr.globalDrawType = web3d.renderMgr.globalDrawType & web3d.DrawTypeEnum.NOLIGHTMAP;
        }
        enableSkyBox() {
            web3d.SkyBox.setActive(true);
        }
        disableSkyBox() {
            web3d.SkyBox.setActive(false);
        }
    }
    web3d.Scene = Scene;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class SceneMgr {
        constructor() {
            this.scenes = [];
            let defscene = new web3d.Scene();
            this.scenes.push(defscene);
            web3d.curScene = defscene;
        }
        update(delta) {
            for (let key in this.scenes) {
                this.scenes[key].update(delta);
            }
        }
        openScene(url) {
            this.scenes.length = 0;
            web3d.assetMgr.load(url, (asset, state) => {
                let sceneInfo = asset;
            });
        }
        openExtralScene(url) {
        }
    }
    web3d.SceneMgr = SceneMgr;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class SkyBox {
        static init() {
            this.mat = new web3d.Material();
            this.cubeShader = web3d.assetMgr.load("resource/shader/skyCube.shader.json");
            this.trans = new web3d.GameObject().transform;
            let meshf = this.trans.gameObject.addComponent("MeshFilter");
            let meshr = this.trans.gameObject.addComponent("MeshRender");
            meshf.mesh = web3d.assetMgr.getDefaultMesh("cube");
            meshr.material = this.mat;
            this.trans.gameObject.beVisible = false;
            this.trans.gameObject.name = "SkyBox";
            web3d.curScene.addChild(this.trans);
        }
        static setSkyCubeTexture(cubtex) {
            this.texcube = cubtex;
            this.enableRender2D = false;
            this.mat.setShader(this.cubeShader);
            this.mat.setCubeTexture("_MainTex", cubtex);
        }
        static setSky2DTexture(tex) {
            this.tex2d = tex;
            this.enableRender2D = true;
            this.mat.setShader(this.texShader);
            this.mat.setTexture("_MainTex", tex);
        }
        static setActive(active) {
            this.beActived = active;
            this.trans.gameObject.beVisible = active;
            if (active) {
                web3d.curScene.addChild(this.trans);
            }
        }
    }
    SkyBox.beActived = false;
    SkyBox.enableRender2D = false;
    web3d.SkyBox = SkyBox;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var InsID_1, Transform_1;
    let InsID = InsID_1 = class InsID {
        constructor() {
            this.id = InsID_1.next();
        }
        static next() {
            let next = InsID_1.idAll;
            InsID_1.idAll++;
            return next;
        }
        getInsID() {
            return this.id;
        }
    };
    InsID.idAll = 1;
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Number)
    ], InsID.prototype, "id", void 0);
    InsID = InsID_1 = __decorate([
        web3d.Serialize("InsID"),
        __metadata("design:paramtypes", [])
    ], InsID);
    web3d.InsID = InsID;
    let Transform = Transform_1 = class Transform {
        constructor() {
            this.insId = new InsID();
            this.children = [];
            this.dirtyChild = true;
            this.dirtyWorldDecompose = false;
            this.dirtyWorldDecompse = 0x00000000;
            this.needComputeLocalMat = true;
            this.needComputeWorldMat = true;
            this.localRotation = MathD.quat.create();
            this._localEuler = MathD.vec3.create();
            this.localPosition = MathD.vec3.create();
            this.localScale = MathD.vec3.create(1, 1, 1);
            this._localMatrix = MathD.mat4.create();
            this._worldMatrix = MathD.mat4.create();
            this._worldRotate = MathD.quat.create();
            this._worldPosition = MathD.vec3.create(0, 0, 0);
            this._worldScale = MathD.vec3.create(1, 1, 1);
            this._beDispose = false;
        }
        addChild(node) {
            if (node.parent != null) {
                node.parent.removeChild(node);
            }
            this.children.push(node);
            node.parent = this;
            node.markDirty();
        }
        removeAllChild() {
            if (this.children.length == 0)
                return;
            for (let i = 0, len = this.children.length; i < len; i++) {
                this.children[i].parent = null;
            }
            this.children.length = 0;
        }
        removeChild(node) {
            if (node.parent != this || this.children.length == 0) {
                throw new Error("not my child.");
            }
            let i = this.children.indexOf(node);
            if (i >= 0) {
                this.children.splice(i, 1);
                node.parent = null;
            }
        }
        find(name) {
            if (this.gameObject.name == name)
                return this;
            else {
                if (this.children.length > 0) {
                    for (let i in this.children) {
                        let res = this.children[i].find(name);
                        if (res != null)
                            return res;
                    }
                }
            }
            return null;
        }
        findPath(name) {
            if (name == null || name.length == 0)
                return null;
            let targetTrans = null;
            let trans = this.findchild(name[0]);
            let index = 0;
            while (trans && index < name.length - 1) {
                index++;
                trans = trans.findchild(name[index]);
            }
            return trans;
        }
        findchild(name) {
            if (this.children.length > 0) {
                for (let i = 0, len = this.children.length; i < len; i++) {
                    let child = this.children[i];
                    if (child.gameObject.name == name) {
                        return child;
                    }
                }
            }
            return null;
        }
        markDirty() {
            this.needComputeLocalMat = true;
            this.needComputeWorldMat = true;
            this.notifyParentSelfDirty(this);
            this.notifyChildSelfDirty(this);
        }
        notifyParentSelfDirty(selfnode) {
            let p = selfnode.parent;
            while (p != null && !p.dirtyChild) {
                p.dirtyChild = true;
                p = p.parent;
            }
        }
        notifyChildSelfDirty(selfnode) {
            if (selfnode.children.length > 0) {
                for (let i = 0, len = selfnode.children.length; i < len; i++) {
                    let child = selfnode.children[i];
                    if (!child.needComputeWorldMat) {
                        child.needComputeWorldMat = true;
                        this.notifyChildSelfDirty(selfnode.children[i]);
                    }
                }
            }
        }
        get localEuler() {
            MathD.quat.ToEuler(this.localRotation, this._localEuler);
            return this._localEuler;
        }
        set localEuler(value) {
            this._localEuler = value;
            MathD.quat.FromEuler(this._localEuler[0], this._localEuler[1], this._localEuler[2], this.localRotation);
        }
        translate(x = 0, y = 0, z = 0) {
            this.localPosition[0] += x;
            this.localPosition[1] += y;
            this.localPosition[2] += z;
            this.markDirty();
        }
        scale(x = 1, y = 1, z = 1) {
            this.localScale[0] *= x;
            this.localScale[1] *= y;
            this.localScale[2] *= z;
            this.markDirty();
        }
        rotate(x = 0, y = 0, z = 0) {
            let temprot = MathD.quat.create();
            MathD.quat.FromEuler(x, y, z, temprot);
            MathD.quat.multiply(this.localRotation, temprot, this.localRotation);
            MathD.quat.recycle(temprot);
            this.markDirty();
        }
        get worldPosition() {
            if ((this.dirtyWorldDecompse | Transform_1.NotDirtyPosMask) == Transform_1.AllWorldDirty || this.needComputeWorldMat) {
                MathD.mat4.getTranslationing(this.worldMatrix, this._worldPosition);
                this.dirtyWorldDecompse = this.dirtyWorldDecompse & Transform_1.NotDirtyPosMask;
            }
            return this._worldPosition;
        }
        set worldPosition(pos) {
            if (this.parent == null) {
                console.error("Error: scene root cannot be move！");
                return;
            }
            if (this.parent.parent == null) {
                MathD.vec3.copy(pos, this.localPosition);
            }
            else {
                let invparentworld = MathD.mat4.create();
                MathD.mat4.invert(this.parent.worldMatrix, invparentworld);
                MathD.mat4.transformPoint(pos, invparentworld, this.localPosition);
                MathD.mat4.recycle(invparentworld);
            }
            this.markDirty();
        }
        get worldScale() {
            if ((this.dirtyWorldDecompse | Transform_1.NotDirtyScaleMask) == Transform_1.AllWorldDirty || this.needComputeWorldMat) {
                MathD.mat4.getScaling(this.worldMatrix, this._worldScale);
                this.dirtyWorldDecompse = this.dirtyWorldDecompse & Transform_1.NotDirtyRotMask;
            }
            MathD.mat4.getScaling(this._worldMatrix, this._worldScale);
            return this._worldScale;
        }
        get worldRotation() {
            if ((this.dirtyWorldDecompse | Transform_1.NotDirtyRotMask) == Transform_1.AllWorldDirty || this.needComputeWorldMat) {
                MathD.mat4.getRotationing(this.worldMatrix, this._worldRotate, this.worldScale);
                this.dirtyWorldDecompse = this.dirtyWorldDecompse & Transform_1.NotDirtyRotMask;
            }
            return this._worldRotate;
        }
        set worldRotation(rot) {
            if (this.parent == null) {
                console.error("Error: scene root cannot be move！");
                return;
            }
            if (this.parent.parent == null) {
                MathD.vec3.copy(rot, this.localRotation);
            }
            else {
                let invparentworldrot = MathD.quat.create();
                MathD.quat.inverse(this.parent.worldRotation, invparentworldrot);
                MathD.quat.multiply(invparentworldrot, rot, this.localRotation);
                MathD.quat.recycle(invparentworldrot);
            }
            this.markDirty();
        }
        get localMatrix() {
            if (this.needComputeLocalMat) {
                MathD.mat4.RTS(this.localPosition, this.localScale, this.localRotation, this._localMatrix);
                this.needComputeLocalMat = false;
            }
            return this._localMatrix;
        }
        get worldMatrix() {
            if (this.needComputeWorldMat) {
                if (this.parent == null) {
                    MathD.mat4.copy(this.localMatrix, this._worldMatrix);
                }
                else {
                    MathD.mat4.multiply(this.parent.worldMatrix, this.localMatrix, this._worldMatrix);
                }
                this.needComputeWorldMat = false;
                this.dirtyWorldDecompse = Transform_1.AllWorldDirty;
            }
            return this._worldMatrix;
        }
        getForwardInWorld(out) {
            MathD.mat4.transformVector3(MathD.vec3.FORWARD, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
        getRightInWorld(out) {
            MathD.mat4.transformVector3(MathD.vec3.RIGHT, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
        getUpInWorld(out) {
            MathD.mat4.transformVector3(MathD.vec3.UP, this.worldMatrix, out);
            MathD.vec3.normalize(out, out);
        }
        setLocalMatrix(mat) {
            MathD.mat4.copy(mat, this._localMatrix);
            this.markDirty();
            this.needComputeLocalMat = false;
            MathD.mat4.decompose(this._localMatrix, this.localScale, this.localRotation, this.localPosition);
        }
        lookat(trans) {
            this.lookatPoint(trans.worldPosition);
        }
        lookatPoint(point) {
            let p0 = this.worldPosition;
            let p1 = point;
            let worldRot = MathD.quat.create();
            let InverseParentQuat = MathD.quat.create();
            MathD.quat.lookat(p0, p1, worldRot);
            let parWorldQuat = this.parent.worldRotation;
            MathD.quat.inverse(parWorldQuat, InverseParentQuat);
            MathD.quat.multiply(InverseParentQuat, worldRot, this.localRotation);
            this.markDirty();
            MathD.quat.recycle(worldRot);
            MathD.quat.recycle(InverseParentQuat);
        }
        transformDirection(dir, out) {
            MathD.mat4.transformVector3(dir, this.worldMatrix, out);
        }
        get beDispose() {
            return this._beDispose;
        }
        dispose() {
            if (this._beDispose)
                return;
            if (this.children.length > 0) {
                for (let k in this.children) {
                    this.children[k].dispose();
                }
                this.removeAllChild();
            }
            this.gameObject.dispose();
            this._beDispose = true;
        }
    };
    Transform.NotDirtyRotMask = 0x00000003;
    Transform.NotDirtyPosMask = 0x00000005;
    Transform.NotDirtyScaleMask = 0x00000006;
    Transform.AllWorldDirty = 0x00000007;
    __decorate([
        web3d.Attribute,
        __metadata("design:type", web3d.GameObject)
    ], Transform.prototype, "gameObject", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", Array)
    ], Transform.prototype, "children", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", MathD.quat)
    ], Transform.prototype, "localRotation", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", MathD.vec3)
    ], Transform.prototype, "localPosition", void 0);
    __decorate([
        web3d.Attribute,
        __metadata("design:type", MathD.vec3)
    ], Transform.prototype, "localScale", void 0);
    Transform = Transform_1 = __decorate([
        web3d.Serialize("Transform")
    ], Transform);
    web3d.Transform = Transform;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class StateMgr {
        static showFps() {
            if (this.stats == null) {
                this.stats = new web3d.Stats(web3d.app);
                this.stats.container.style.position = 'absolute';
                this.stats.container.style.left = '0px';
                this.stats.container.style.top = '0px';
                web3d.app.container.appendChild(this.stats.container);
            }
            else {
                web3d.app.container.appendChild(this.stats.container);
            }
        }
        static closeFps() {
            if (this.stats != null) {
                web3d.app.container.removeChild(this.stats.container);
            }
        }
    }
    web3d.StateMgr = StateMgr;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Stats {
        constructor(app) {
            this.mode = 0;
            this.app = app;
            this.container = document.createElement('div');
            this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.7;z-index:1';
            this.container.addEventListener('click', (event) => {
                event.preventDefault();
                this.showPanel(++this.mode % this.container.children.length);
            }, false);
            this.beginTime = (performance || Date).now(), this.prevTime = this.beginTime, this.frames = 0;
            this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
            this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
            this.ratePanel = this.addPanel(new Panel('%', '#0f0', '#020'));
            this.userratePanel = this.addPanel(new Panel('%', '#0f0', '#020'));
            if (self.performance && self.performance["memory"]) {
                this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
            }
            this.showPanel(0);
        }
        update() {
            this.beginTime = this.end();
        }
        showPanel(id) {
            for (let i = 0; i < this.container.children.length; i++) {
                this.container.children[i]["style"].display = i === id ? 'block' : 'none';
            }
            this.mode = id;
        }
        addPanel(panel) {
            this.container.appendChild(panel.canvas);
            return panel;
        }
        begin() {
            this.beginTime = (performance || Date).now();
        }
        end() {
            this.frames++;
            let time = (performance || Date).now();
            this.msPanel.update(time - this.beginTime, 200);
            if (time > this.prevTime + 1000) {
                let fps = (this.frames * 1000) / (time - this.prevTime);
                this.fpsPanel.update(fps, 100);
                this.prevTime = time;
                this.frames = 0;
                if (this.memPanel) {
                    let memory = performance["memory"];
                    this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                }
            }
            return time;
        }
    }
    web3d.Stats = Stats;
    class Panel {
        constructor(name, fg, bg) {
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
        update(value, maxValue) {
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
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class GameTimer {
        static get Time() {
            return this.totalTime * 0.001;
        }
        static get DeltaTime() {
            return this.deltaTime * this.TimeScale * 0.001;
        }
        static get StartTime() {
            return this.beginTime * 0.001;
        }
        static update() {
            let now = Date.now();
            this.deltaTime = now - this.lastTimer;
            this.totalTime = now - this.beginTime;
            this.lastTimer = now;
            let realDetal = this.deltaTime * this.TimeScale * 0.001;
            if (this.OnUpdate) {
                this.OnUpdate(realDetal);
            }
            for (let i = 0, len = this.updateList.length; i < len; i++) {
                let func = this.updateList[i];
                func(realDetal);
            }
        }
        static Init() {
            this.beginTime = Date.now();
            this.frameUpdate();
        }
        static addListenToTimerUpdate(func) {
            this.updateList.push(func);
        }
        static removeListenToTimerUpdate(func) {
            this.updateList.forEach((item) => {
                if (item == func) {
                    let index = this.updateList.indexOf(func);
                    this.updateList.splice(index, 1);
                    return;
                }
            });
        }
        static removeAllListener() {
            this.updateList.length = 0;
        }
        static frameUpdate() {
            if (this.FPS != this._lastFrameRate) {
                this.FPS = Math.min(this.FPS, 60);
                this.FPS = Math.max(this.FPS, 0);
                if (this.IntervalLoop != null) {
                    clearInterval(this.IntervalLoop);
                    this.IntervalLoop = null;
                }
                this._lastFrameRate = this.FPS;
            }
            if (this.FPS == 60) {
                this.update();
                requestAnimationFrame(this.frameUpdate.bind(this));
            }
            else {
                if (this.IntervalLoop == null) {
                    this.IntervalLoop = setInterval(() => {
                        this.update();
                        this.frameUpdate();
                    }, 1000 / this.FPS);
                }
            }
        }
    }
    GameTimer.TimeScale = 1.0;
    GameTimer.updateList = [];
    GameTimer.FPS = 60;
    web3d.GameTimer = GameTimer;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class Serlizer {
        static serializeObj(obj, json = null, objJson = null) {
            if (json == null) {
                json = {};
            }
            if (json.gameobjects == null) {
                json.gameobjects = {};
            }
            if (json.transforms == null) {
                json.transforms = {};
            }
            if (json.web3dassets == null) {
                json.web3dassets = {};
            }
            let objs = json.gameobjects;
            let trans = json.transforms;
            let assets = json.web3dassets;
            let oobjson;
            if (objJson == null) {
                objJson = {};
            }
            if (!web3d.haveRegClass(obj))
                return;
            let classname = obj.constructor.name;
            objJson["type"] = classname;
            if (obj instanceof web3d.GameObject) {
                let gameobj = obj;
                let id = gameobj.transform.insId.getInsID();
                objJson["id"] = id;
                if (objs[id] == null) {
                    oobjson = {};
                    oobjson["type"] = classname;
                    oobjson["value"] = {};
                    objs[id] = oobjson;
                }
                else {
                    return;
                }
            }
            else if (obj instanceof web3d.Transform) {
                let transobj = obj;
                let id = transobj.insId.getInsID();
                objJson["id"] = id;
                if (trans[id] == null) {
                    oobjson = {};
                    oobjson["type"] = classname;
                    oobjson["value"] = {};
                    trans[id] = oobjson;
                }
                else {
                    return;
                }
            }
            else if (obj instanceof web3d.Web3dAsset) {
                let assetobj = obj;
                let id = assetobj.guid;
                objJson["id"] = id;
                if (assets[id] == null) {
                    oobjson = {};
                    oobjson["type"] = classname;
                    let url = obj["URL"];
                    let index = url.lastIndexOf("resources/");
                    oobjson["URL"] = url.substring(index);
                    assets[id] = oobjson;
                    return;
                }
                else {
                    return;
                }
            }
            else {
                oobjson = objJson;
                oobjson["value"] = {};
            }
            let atts = web3d.getAtts(obj);
            for (let i = 0; i < atts.length; i++) {
                let attname = atts[i];
                if (classname == "Transform" && attname == "parent")
                    continue;
                let attobj = obj[attname];
                if (attobj != null) {
                    if ((typeof (attobj) == "number") || (typeof (attobj) == "boolean")) {
                        oobjson["value"][attname] = attobj;
                    }
                    else if (attobj["__proto__"].constructor.name == "String") {
                        oobjson["value"][attname] = attobj;
                    }
                    else if (attobj["__proto__"].constructor.name == "Array") {
                        oobjson["value"][attname] = {};
                        oobjson["value"][attname].type = "Array";
                        oobjson["value"][attname].value = [];
                        if (attobj.length == 0)
                            continue;
                        for (let i = 0; i < attobj.length; i++) {
                            if ((typeof (attobj[i]) == "number") || (typeof (attobj[i]) == "boolean")) {
                                oobjson["value"][attname].value.push(attobj[i]);
                            }
                            else if (attobj[i]["__proto__"].constructor.name == "String") {
                                oobjson["value"][attname].value.push(attobj[i]);
                            }
                            else {
                                let item = {};
                                oobjson["value"][attname].value.push(item);
                                this.serializeObj(attobj[i], json, item);
                            }
                        }
                    }
                    else {
                        if (!web3d.haveRegClass(attobj)) {
                            oobjson["value"][attname] = null;
                            continue;
                        }
                        let className = attobj.constructor.name;
                        switch (className) {
                            case "vec2":
                            case "vec3":
                            case "vec4":
                            case "quat":
                            case "mat4":
                            case "mat3":
                            case "mat2":
                            case "mat2d":
                            case "color":
                            case "rect":
                                oobjson["value"][attname] = {};
                                oobjson["value"][attname].type = className;
                                oobjson["value"][attname].value = attobj.toString();
                                break;
                            case "Transform":
                                oobjson["value"][attname] = {};
                                oobjson["value"][attname].type = className;
                                let id = attobj.insId.getInsID();
                                oobjson["value"][attname].id = id;
                                if (trans[id] == null) {
                                    this.serializeObj(attobj, json);
                                }
                                break;
                            case "GameObject":
                                oobjson["value"][attname] = {};
                                oobjson["value"][attname].type = className;
                                let idg = attobj.transform.insId.getInsID();
                                oobjson["value"][attname].id = idg;
                                if (objs[idg] == null) {
                                    this.serializeObj(attobj, json);
                                }
                                break;
                            default:
                                if (attobj instanceof web3d.Web3dAsset) {
                                    oobjson["value"][attname] = {};
                                    oobjson["value"][attname].type = attobj.constructor.name;
                                    let ida = attobj.guid;
                                    oobjson["value"][attname].id = ida;
                                    if (assets[ida] == null) {
                                        this.serializeObj(attobj, json);
                                    }
                                    break;
                                }
                                else {
                                    oobjson["value"][attname] = {};
                                    this.serializeObj(attobj, json, oobjson["value"][attname]);
                                    break;
                                }
                        }
                    }
                }
            }
            return json;
        }
    }
    web3d.Serlizer = Serlizer;
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        onmessage = function (msg) {
            console.log("webworker receive msg: url: " + msg.data.url);
            web3d.io.loadTool.ins.load(msg);
        };
        function postMsg(msg, transferList = null) {
            if (transferList == null) {
                postMessage(msg);
            }
            else {
                postMessage(msg, transferList);
            }
        }
        class loadTool {
            static get ins() {
                if (this._ins == null) {
                    this._ins = new loadTool();
                }
                return this._ins;
            }
            load(msg) {
                let taskid = msg.data.id;
                switch (msg.data.type) {
                    case "loadMeshData":
                        web3d.io.loadArrayBuffer("../" + msg.data.url, (_buffer, err) => {
                            if (err != null) {
                                postMsg({
                                    id: taskid,
                                    iserror: true,
                                    errorcontent: err.message
                                });
                            }
                            else {
                            }
                        });
                        break;
                    case "LoadAniclip":
                        web3d.io.loadArrayBuffer("../" + msg.data.url, (_buffer, err) => {
                            if (err) {
                                postMsg({
                                    id: taskid,
                                    iserror: true,
                                    errorcontent: err.message
                                });
                            }
                            else {
                            }
                        });
                }
            }
            ;
        }
        io.loadTool = loadTool;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        class loadWorkerMgr {
            constructor(scripteSrc) {
                this.loadworker = new Worker(scripteSrc);
                this.loadworker.onmessage = (msg) => {
                    console.log("mgr receive msg!");
                    let data = msg.data;
                };
            }
            postMessage(data) {
                console.log("mgr post msg!");
                this.loadworker.postMessage(data);
            }
            stopworker() {
                this.loadworker.terminate();
            }
        }
        io.loadWorkerMgr = loadWorkerMgr;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        class binBuffer {
            constructor(bufSize = 65536) {
                if (bufSize < 1024)
                    bufSize = 1024;
                if (bufSize > 1024 * 256)
                    bufSize = 1024 * 256;
                this._bufSize = bufSize;
                this._buf = [];
                this._seekWritePos = 0;
                this._seekWriteIndex = 0;
                this._buf[0] = new Uint8Array(bufSize);
                this._seekReadPos = 0;
            }
            getLength() {
                return (this._seekWriteIndex * this._bufSize + this._seekWritePos) - (this._seekReadPos);
            }
            getBufLength() {
                return this._buf.length * this._bufSize;
            }
            getBytesAvailable() {
                return this.getLength();
            }
            reset() {
                this._buf = [];
                this._seekWritePos = 0;
                this._seekWriteIndex = 0;
                this._buf[0] = new Uint8Array(this._bufSize);
                this._seekReadPos = 0;
            }
            dispose() {
                this._buf.splice(0);
                this._seekWritePos = 0;
                this._seekWriteIndex = 0;
                this._seekReadPos = 0;
            }
            read(target, offset = 0, length = -1) {
                if (length < 0)
                    length = target.length;
                for (let i = offset; i < offset + length; i++) {
                    if (this._seekReadPos >= this._seekWritePos && 0 == this._seekWriteIndex) {
                        this.reset();
                        throw new Error("no data to read.");
                    }
                    target[i] = this._buf[0][this._seekReadPos];
                    this._seekReadPos++;
                    if (this._seekReadPos >= this._bufSize) {
                        this._seekWriteIndex--;
                        this._seekReadPos = 0;
                        let freebuf = this._buf.shift();
                        this._buf.push(freebuf);
                    }
                }
            }
            write(array, offset = 0, length = -1) {
                if (length < 0)
                    length = array.length;
                for (let i = offset; i < offset + length; i++) {
                    this._buf[this._seekWriteIndex][this._seekWritePos] = array[i];
                    this._seekWritePos++;
                    if (this._seekWritePos >= this._bufSize) {
                        this._seekWriteIndex++;
                        this._seekWritePos = 0;
                        if (this._buf.length <= this._seekWriteIndex) {
                            this._buf.push(new Uint8Array(this._bufSize));
                        }
                    }
                }
            }
            getBuffer() {
                let length = 0;
                if (this._seekWriteIndex > 0) {
                    length = this._bufSize * (this._seekWriteIndex - 1) + this._seekWritePos;
                }
                else {
                    length = this._seekWritePos;
                }
                let array = new Uint8Array(length);
                for (let i = 0; i < this._seekWriteIndex - 1; i++) {
                    array.set(this._buf[i], i * this._bufSize);
                }
                for (let i = 0; i < this._seekWritePos; i++) {
                    array[length - this._seekWritePos + i] = this._buf[this._seekWriteIndex][i];
                }
                return array;
            }
            getUint8Array() {
                return new Uint8Array(this.getBuffer());
            }
        }
        io.binBuffer = binBuffer;
        class converter {
            static getApplyFun(value) {
                return Array.prototype.concat.apply([], value);
            }
            static ULongToArray(value, target = null, offset = 0) {
                let uint1 = value % 0x100000000;
                let uint2 = (value / 0x100000000) | 0;
                converter.dataView.setUint32(0, uint1, true);
                converter.dataView.setUint32(4, uint2, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = new Uint8Array(converter.dataView.buffer);
                }
                else {
                    for (let i = 0; i < 8; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static LongToArray(value, target = null, offset = 0) {
                let uint1 = value % 0x100000000;
                let uint2 = (value / 0x100000000) | 0;
                converter.dataView.setInt32(0, uint1, true);
                converter.dataView.setInt32(4, uint2, true);
                let _array = new Int8Array(converter.dataView.buffer);
                if (target == null) {
                    target = new Uint8Array(converter.dataView.buffer);
                }
                else {
                    for (let i = 0; i < 8; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Float64ToArray(value, target = null, offset = 0) {
                converter.dataView.setFloat64(0, value, false);
                if (target == null) {
                    target = new Uint8Array(converter.dataView.buffer);
                }
                else {
                    for (let i = 0; i < 8; i++) {
                        target[offset + i] = converter.dataView.buffer[i];
                    }
                }
                return target;
            }
            static Float32ToArray(value, target = null, offset = 0) {
                converter.dataView.setFloat32(0, value, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 4);
                }
                else {
                    for (let i = 0; i < 4; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Int32ToArray(value, target = null, offset = 0) {
                converter.dataView.setInt32(0, value, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 4);
                }
                else {
                    for (let i = 0; i < 4; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Int16ToArray(value, target = null, offset = 0) {
                converter.dataView.setInt16(0, value, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 2);
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Int8ToArray(value, target = null, offset = 0) {
                converter.dataView.setInt8(0, value);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 1);
                }
                else {
                    for (let i = 0; i < 1; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Uint32toArray(value, target = null, offset = 0) {
                converter.dataView.setInt32(0, value, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 4);
                }
                else {
                    for (let i = 0; i < 4; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Uint16ToArray(value, target = null, offset = 0) {
                converter.dataView.setUint16(0, value, true);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 2);
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static Uint8ToArray(value, target = null, offset = 0) {
                converter.dataView.setUint8(0, value);
                let _array = new Uint8Array(converter.dataView.buffer);
                if (target == null) {
                    target = converter.getApplyFun(_array).slice(0, 1);
                }
                else {
                    for (let i = 0; i < 1; i++) {
                        target[offset + i] = _array[i];
                    }
                }
                return target;
            }
            static StringToUtf8Array(str) {
                let bstr = [];
                for (let i = 0; i < str.length; i++) {
                    let c = str.charAt(i);
                    let cc = c.charCodeAt(0);
                    if (cc > 0xFFFF) {
                        throw new Error("InvalidCharacterError");
                    }
                    if (cc > 0x80) {
                        if (cc < 0x07FF) {
                            let c1 = (cc >>> 6) | 0xC0;
                            let c2 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2);
                        }
                        else {
                            let c1 = (cc >>> 12) | 0xE0;
                            let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                            let c3 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2, c3);
                        }
                    }
                    else {
                        bstr.push(cc);
                    }
                }
                return new Uint8Array(bstr);
            }
            static ArrayToLong(buf, offset = 0) {
                for (let i = 0; i < 4; i++) {
                    converter.dataView.setInt8(i, buf[offset + i]);
                }
                let n1 = converter.dataView.getInt32(0, true);
                for (let i = 4; i < 8; i++) {
                    converter.dataView.setInt8(i, buf[offset + i]);
                }
                let n2 = converter.dataView.getInt32(4, true);
                n1 += n2 * 0x100000000;
                return n1;
            }
            static ArrayToULong(buf, offset = 0) {
                for (let i = 0; i < 4; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                let n1 = converter.dataView.getUint32(0, true);
                for (let i = 4; i < 8; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                let n2 = converter.dataView.getUint32(4, true);
                n1 += n2 * 0x100000000;
                return n1;
            }
            static ArrayToFloat64(buf, offset = 0) {
                for (let i = 0; i < 8; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getFloat64(0, true);
            }
            static ArrayToFloat32(buf, offset = 0) {
                for (let i = 0; i < 4; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getFloat32(0, true);
            }
            static ArrayToInt32(buf, offset = 0) {
                for (let i = 0; i < 4; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getInt32(0, true);
            }
            static ArrayToInt16(buf, offset = 0) {
                for (let i = 0; i < 2; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getInt16(0, true);
            }
            static ArrayToInt8(buf, offset = 0) {
                for (let i = 0; i < 1; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getInt8(0);
            }
            static ArraytoUint32(buf, offset = 0) {
                for (let i = 0; i < 4; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getUint32(0, true);
            }
            static ArrayToUint16(buf, offset = 0) {
                for (let i = 0; i < 2; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getUint16(0, true);
            }
            static ArrayToUint8(buf, offset = 0) {
                for (let i = 0; i < 1; i++) {
                    converter.dataView.setUint8(i, buf[offset + i]);
                }
                return converter.dataView.getUint8(0);
            }
            static ArrayToString(buf, offset = 0) {
                let ret = [];
                for (let i = 0; i < buf.length; i++) {
                    let cc = buf[i];
                    if (cc == 0)
                        break;
                    let ct = 0;
                    if (cc > 0xE0) {
                        ct = (cc & 0x0F) << 12;
                        cc = buf[++i];
                        ct |= (cc & 0x3F) << 6;
                        cc = buf[++i];
                        ct |= cc & 0x3F;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0xC0) {
                        ct = (cc & 0x1F) << 6;
                        cc = buf[++i];
                        ct |= (cc & 0x3F) << 6;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0x80) {
                        throw new Error("InvalidCharacterError");
                    }
                    else {
                        ret.push(String.fromCharCode(buf[i]));
                    }
                }
                return ret.join('');
            }
        }
        converter.dataView = new DataView(new ArrayBuffer(8), 0, 8);
        io.converter = converter;
        class binTool extends binBuffer {
            readSingle() {
                let array = new Uint8Array(4);
                this.read(array);
                return converter.ArrayToFloat32(array);
            }
            readLong() {
                let array = new Uint8Array(8);
                this.read(array);
                return converter.ArrayToLong(array);
            }
            readULong() {
                let array = new Uint8Array(8);
                this.read(array);
                return converter.ArrayToULong(array);
            }
            readDouble() {
                let array = new Uint8Array(8);
                this.read(array);
                return converter.ArrayToFloat64(array);
            }
            readInt8() {
                let array = new Uint8Array(1);
                this.read(array);
                return converter.ArrayToInt8(array);
            }
            readUInt8() {
                let array = new Uint8Array(1);
                this.read(array);
                return converter.ArrayToUint8(array);
            }
            readInt16() {
                let array = new Uint8Array(2);
                this.read(array);
                return converter.ArrayToInt16(array);
            }
            readUInt16() {
                let array = new Uint8Array(2);
                this.read(array);
                return converter.ArrayToUint16(array);
            }
            readInt32() {
                let array = new Uint8Array(4);
                this.read(array);
                return converter.ArrayToInt32(array);
            }
            readUInt32() {
                let array = new Uint8Array(4);
                this.read(array);
                return converter.ArraytoUint32(array);
            }
            readBoolean() {
                return this.readUInt8() > 0;
            }
            readByte() {
                return this.readUInt8();
            }
            readUnsignedShort() {
                return this.readUInt16();
            }
            readUnsignedInt() {
                return this.readUInt32();
            }
            readFloat() {
                return this.readSingle();
            }
            readSymbolByte() {
                return this.readInt8();
            }
            readShort() {
                return this.readInt16();
            }
            readInt() {
                return this.readInt32();
            }
            readBytes(length) {
                let array = new Uint8Array(length);
                this.read(array);
                return array;
            }
            readStringUtf8() {
                let length = this.readInt8();
                let array = new Uint8Array(length);
                this.read(array);
                return converter.ArrayToString(array);
            }
            readStringUtf8FixLength(length) {
                let array = new Uint8Array(length);
                this.read(array);
                return converter.ArrayToString(array);
            }
            readUTFBytes(length) {
                let array = new Uint8Array(length);
                this.read(array);
                return converter.ArrayToString(array);
            }
            readStringAnsi() {
                let slen = this.readUInt8();
                let bs = "";
                for (let i = 0; i < slen; i++) {
                    bs += String.fromCharCode(this.readByte());
                }
                return bs;
            }
            get length() {
                return this.getLength();
            }
            writeInt8(num) {
                this.write(converter.Int8ToArray(num));
            }
            writeUInt8(num) {
                this.write(converter.Uint8ToArray(num));
            }
            writeInt16(num) {
                this.write(converter.Int16ToArray(num));
            }
            writeUInt16(num) {
                this.write(converter.Uint16ToArray(num));
            }
            writeInt32(num) {
                this.write(converter.Int32ToArray(num));
            }
            writeUInt32(num) {
                this.write(converter.Uint32toArray(num));
            }
            writeSingle(num) {
                this.write(converter.Float32ToArray(num));
            }
            writeLong(num) {
                this.write(converter.LongToArray(num));
            }
            writeULong(num) {
                this.write(converter.ULongToArray(num));
            }
            writeDouble(num) {
                this.write(converter.Float64ToArray(num));
            }
            writeStringAnsi(str) {
                let slen = str.length;
                this.writeUInt8(slen);
                for (let i = 0; i < slen; i++) {
                    this.writeUInt8(str.charCodeAt(i));
                }
            }
            writeStringUtf8(str) {
                let bstr = converter.StringToUtf8Array(str);
                this.writeUInt8(bstr.length);
                this.write(bstr);
            }
            writeStringUtf8DataOnly(str) {
                let bstr = converter.StringToUtf8Array(str);
                this.write(bstr);
            }
            writeByte(num) {
                this.write(converter.Uint8ToArray(num));
            }
            writeBytes(array, offset = 0, length = -1) {
                this.write(array, offset, length);
            }
            writeUint8Array(array, offset = 0, length = -1) {
                this.write(array, offset, length);
            }
            writeUnsignedShort(num) {
                this.write(converter.Uint16ToArray(num));
            }
            writeUnsignedInt(num) {
                this.write(converter.Uint32toArray(num));
            }
            writeFloat(num) {
                this.write(converter.Float32ToArray(num));
            }
            writeUTFBytes(str) {
                this.write(converter.StringToUtf8Array(str));
            }
            writeSymbolByte(num) {
                this.write(converter.Int8ToArray(num));
            }
            writeShort(num) {
                this.write(converter.Int16ToArray(num));
            }
            writeInt(num) {
                this.write(converter.Int32ToArray(num));
            }
        }
        io.binTool = binTool;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        function stringToBlob(content) {
            let u8 = new Uint8Array(stringToUtf8Array(content));
            let blob = new Blob([u8]);
            return blob;
        }
        io.stringToBlob = stringToBlob;
        function stringToUtf8Array(str) {
            let bstr = [];
            for (let i = 0; i < str.length; i++) {
                let c = str.charAt(i);
                let cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        let c1 = (cc >>> 6) | 0xC0;
                        let c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        let c1 = (cc >>> 12) | 0xE0;
                        let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        let c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return bstr;
        }
        io.stringToUtf8Array = stringToUtf8Array;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        function loadText(url, fun) {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.responseType = "text";
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 404) {
                        fun(null, new Error("got a 404:" + url));
                        return;
                    }
                    fun(req.responseText, null);
                }
            };
            req.onerror = () => {
                fun(null, new Error("onerr in req:"));
            };
            req.send();
        }
        io.loadText = loadText;
        function loadArrayBuffer(url, fun) {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.responseType = "arraybuffer";
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 404) {
                        fun(null, new Error("got a 404:" + url));
                        return;
                    }
                    fun(req.response, null);
                }
            };
            req.onerror = () => {
                fun(null, new Error("onerr in req:"));
            };
            req.send();
        }
        io.loadArrayBuffer = loadArrayBuffer;
        function loadBlob(url, fun) {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.responseType = "blob";
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 404) {
                        fun(null, new Error("got a 404:" + url));
                        return;
                    }
                    fun(req.response, null);
                }
            };
            req.onerror = () => {
                fun(null, new Error("onerr in req:"));
            };
            req.send();
        }
        io.loadBlob = loadBlob;
        function loadImg(url, fun, progress) {
            let img = new Image();
            img.src = url;
            img.onerror = (error) => {
                if (error != null) {
                    fun(null, new Error(error.message));
                }
            };
            img.onprogress = (e) => {
                if (progress) {
                    let val = e.loaded / e.total * 100;
                    progress(val);
                }
            };
            img.onload = () => {
                fun(img, null);
            };
        }
        io.loadImg = loadImg;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    var io;
    (function (io) {
        class binReader {
            constructor(buf, seek = 0) {
                this._seek = seek;
                this._data = new DataView(buf, seek);
            }
            seek(seek) {
                this._seek = seek;
            }
            peek() {
                return this._seek;
            }
            length() {
                return this._data.byteLength;
            }
            canread() {
                return this._data.byteLength - this._seek;
            }
            readStringAnsi() {
                let slen = this._data.getUint8(this._seek);
                this._seek++;
                let bs = "";
                for (let i = 0; i < slen; i++) {
                    bs += String.fromCharCode(this._data.getUint8(this._seek));
                    this._seek++;
                }
                return bs;
            }
            static utf8ArrayToString(array) {
                let ret = [];
                for (let i = 0; i < array.length; i++) {
                    let cc = array[i];
                    if (cc == 0)
                        break;
                    let ct = 0;
                    if (cc > 0xE0) {
                        ct = (cc & 0x0F) << 12;
                        cc = array[++i];
                        ct |= (cc & 0x3F) << 6;
                        cc = array[++i];
                        ct |= cc & 0x3F;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0xC0) {
                        ct = (cc & 0x1F) << 6;
                        cc = array[++i];
                        ct |= (cc & 0x3F) << 6;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0x80) {
                        throw new Error("InvalidCharacterError");
                    }
                    else {
                        ret.push(String.fromCharCode(array[i]));
                    }
                }
                return ret.join('');
            }
            readStringUtf8() {
                let length = this._data.getInt8(this._seek);
                this._seek++;
                let arr = new Uint8Array(length);
                this.readUint8Array(arr);
                return binReader.utf8ArrayToString(arr);
            }
            readStringUtf8FixLength(length) {
                let arr = new Uint8Array(length);
                this.readUint8Array(arr);
                return binReader.utf8ArrayToString(arr);
            }
            readSingle() {
                let num = this._data.getFloat32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readDouble() {
                let num = this._data.getFloat64(this._seek, true);
                this._seek += 8;
                return num;
            }
            readInt8() {
                let num = this._data.getInt8(this._seek);
                this._seek += 1;
                return num;
            }
            readUInt8() {
                let num = this._data.getUint8(this._seek);
                this._seek += 1;
                return num;
            }
            readInt16() {
                let num = this._data.getInt16(this._seek, true);
                this._seek += 2;
                return num;
            }
            readUInt16() {
                let num = this._data.getUint16(this._seek, true);
                this._seek += 2;
                return num;
            }
            readInt32() {
                let num = this._data.getInt32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readUInt32() {
                let num = this._data.getUint32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readUint8Array(target = null, offset = 0, length = -1) {
                if (length < 0)
                    length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this._data.getUint8(this._seek);
                    this._seek++;
                }
                return target;
            }
            readUint8ArrayByOffset(target, offset, length = 0) {
                if (length < 0)
                    length = target.length;
                for (let i = 0; i < length; i++) {
                    target[i] = this._data.getUint8(offset);
                    offset++;
                }
                return target;
            }
            set position(value) {
                this.seek(value);
            }
            get position() {
                return this.peek();
            }
            readBoolean() {
                return this.readUInt8() > 0;
            }
            readByte() {
                return this.readUInt8();
            }
            readBytes(target = null, offset = 0, length = -1) {
                return this.readUint8Array(target, offset, length);
            }
            readUnsignedShort() {
                return this.readUInt16();
            }
            readUnsignedInt() {
                return this.readUInt32();
            }
            readFloat() {
                return this.readSingle();
            }
            readUTFBytes(length) {
                let arry = new Uint8Array(length);
                return binReader.utf8ArrayToString(this.readUint8Array(arry));
            }
            readSymbolByte() {
                return this.readInt8();
            }
            readShort() {
                return this.readInt16();
            }
            readInt() {
                return this.readInt32();
            }
        }
        io.binReader = binReader;
        class binWriter {
            constructor() {
                let buf = new ArrayBuffer(1024);
                this._length = 0;
                this._buf = new Uint8Array(buf);
                this._data = new DataView(this._buf.buffer);
                this._seek = 0;
            }
            sureData(addlen) {
                let nextlen = this._buf.byteLength;
                while (nextlen < (this._length + addlen)) {
                    nextlen += 1024;
                }
                if (nextlen != this._buf.byteLength) {
                    let newbuf = new Uint8Array(nextlen);
                    for (let i = 0; i < this._length; i++) {
                        newbuf[i] = this._buf[i];
                    }
                    this._buf = newbuf;
                    this._data = new DataView(this._buf.buffer);
                }
                this._length += addlen;
            }
            getLength() {
                return length;
            }
            getBuffer() {
                return this._buf.buffer.slice(0, this._length);
            }
            seek(seek) {
                this._seek = seek;
            }
            peek() {
                return this._seek;
            }
            writeInt8(num) {
                this.sureData(1);
                this._data.setInt8(this._seek, num);
                this._seek++;
            }
            writeUInt8(num) {
                this.sureData(1);
                this._data.setUint8(this._seek, num);
                this._seek++;
            }
            writeInt16(num) {
                this.sureData(2);
                this._data.setInt16(this._seek, num, true);
                this._seek += 2;
            }
            writeUInt16(num) {
                this.sureData(2);
                this._data.setUint16(this._seek, num, true);
                this._seek += 2;
            }
            writeInt32(num) {
                this.sureData(4);
                this._data.setInt32(this._seek, num, true);
                this._seek += 4;
            }
            writeUInt32(num) {
                this.sureData(4);
                this._data.setUint32(this._seek, num, true);
                this._seek += 4;
            }
            writeSingle(num) {
                this.sureData(4);
                this._data.setFloat32(this._seek, num, true);
                this._seek += 4;
            }
            writeDouble(num) {
                this.sureData(8);
                this._data.setFloat64(this._seek, num, true);
                this._seek += 8;
            }
            writeStringAnsi(str) {
                let slen = str.length;
                this.sureData(slen + 1);
                this._data.setUint8(this._seek, slen);
                this._seek++;
                for (let i = 0; i < slen; i++) {
                    this._data.setUint8(this._seek, str.charCodeAt(i));
                    this._seek++;
                }
            }
            writeStringUtf8(str) {
                let bstr = binWriter.stringToUtf8Array(str);
                this.writeUInt8(bstr.length);
                this.writeUint8Array(bstr);
            }
            static stringToUtf8Array(str) {
                let bstr = [];
                for (let i = 0; i < str.length; i++) {
                    let c = str.charAt(i);
                    let cc = c.charCodeAt(0);
                    if (cc > 0xFFFF) {
                        throw new Error("InvalidCharacterError");
                    }
                    if (cc > 0x80) {
                        if (cc < 0x07FF) {
                            let c1 = (cc >>> 6) | 0xC0;
                            let c2 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2);
                        }
                        else {
                            let c1 = (cc >>> 12) | 0xE0;
                            let c2 = ((cc >>> 6) & 0x3F) | 0x80;
                            let c3 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2, c3);
                        }
                    }
                    else {
                        bstr.push(cc);
                    }
                }
                return bstr;
            }
            writeStringUtf8DataOnly(str) {
                let bstr = binWriter.stringToUtf8Array(str);
                this.writeUint8Array(bstr);
            }
            writeUint8Array(array, offset = 0, length = -1) {
                if (length < 0)
                    length = array.length;
                this.sureData(length);
                for (let i = offset; i < offset + length; i++) {
                    this._data.setUint8(this._seek, array[i]);
                    this._seek++;
                }
            }
            get length() {
                return this._seek;
            }
            writeByte(num) {
                this.writeUInt8(num);
            }
            writeBytes(array, offset = 0, length = 0) {
                this.writeUint8Array(array, offset, length);
            }
            writeUnsignedShort(num) {
                this.writeUInt16(num);
            }
            writeUnsignedInt(num) {
                this.writeUInt32(num);
            }
            writeFloat(num) {
                this.writeSingle(num);
            }
            writeUTFBytes(str) {
                let strArray = binWriter.stringToUtf8Array(str);
                this.writeUint8Array(strArray);
            }
            writeSymbolByte(num) {
                this.writeInt8(num);
            }
            writeShort(num) {
                this.writeInt16(num);
            }
            writeInt(num) {
                this.writeInt32(num);
            }
        }
        io.binWriter = binWriter;
    })(io = web3d.io || (web3d.io = {}));
})(web3d || (web3d = {}));
var web3d;
(function (web3d) {
    class internalDocument {
        createElement(tagName) {
            tagName = tagName.toLowerCase();
            if (tagName === 'canvas') {
                return wx.createCanvas();
            }
            else if (tagName === 'image') {
                return wx.createImage();
            }
        }
    }
    function Image() {
        return wx.createImage();
    }
    class wxAdapter {
        static apply() {
            let root = GameGlobal;
            root.Image = Image;
            root.document = internalDocument;
        }
    }
    web3d.wxAdapter = wxAdapter;
})(web3d || (web3d = {}));
//# sourceMappingURL=web3d.js.map