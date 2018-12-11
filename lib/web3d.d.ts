declare namespace web3d {
    class DebugTool {
        static createCube(): Transform;
        static drawLine(from: MathD.vec3, to: MathD.vec3): Transform;
    }
}
declare namespace webGraph {
    var renderstateMgr: RenderStateMgr;
    var rendingWebgl: WebGLRenderingContext;
    class Graph {
        static maxTexImageUnits: number;
        private static unitFreeArr;
        private static unitUsingArr;
        private static unitDic;
        static init(_webgl: WebGLRenderingContext): void;
        static getFreeUnit(tex: Texture2D | CubeTex): number;
    }
}
declare namespace webGraph {
    function numberEqual(a: any, b: any): boolean;
    function ArrayEqual(a: number[] | Float32Array, b: number[] | Float32Array): boolean;
    function isPowerOf2(value: any): boolean;
}
declare namespace webGraph {
    class GLExtension {
        static vaoExt: OES_vertex_array_object | null;
        static hasVAOExt: boolean;
        static SRGBExt: any;
        static hasSRGBExt: boolean;
        static hasLODExt: boolean;
        static lodExt: EXT_shader_texture_lod | null;
        static hasOES: boolean;
        static OES: OES_standard_derivatives | null;
        static hasTexfloat: boolean;
        static texFloat: OES_texture_float | null;
        static hasTexLiner: boolean;
        static texLiner: OES_texture_float_linear | null;
        static objInstance: ANGLE_instanced_arrays | null;
        static hasObjInstance: boolean;
        static initExtension(): void;
        static queryAvailableExtension(): string[] | null;
    }
}
declare namespace webGraph {
    enum GLConstants {
        DEPTH_BUFFER_BIT = 256,
        STENCIL_BUFFER_BIT = 1024,
        COLOR_BUFFER_BIT = 16384,
        POINTS = 0,
        LINES = 1,
        LINE_LOOP = 2,
        LINE_STRIP = 3,
        TRIANGLES = 4,
        TRIANGLE_STRIP = 5,
        TRIANGLE_FAN = 6,
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA_SATURATE = 776,
        FUNC_ADD = 32774,
        BLEND_EQUATION = 32777,
        BLEND_EQUATION_RGB = 32777,
        BLEND_EQUATION_ALPHA = 34877,
        FUNC_SUBTRACT = 32778,
        FUNC_REVERSE_SUBTRACT = 32779,
        BLEND_DST_RGB = 32968,
        BLEND_SRC_RGB = 32969,
        BLEND_DST_ALPHA = 32970,
        BLEND_SRC_ALPHA = 32971,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        BLEND_COLOR = 32773,
        ARRAY_BUFFER = 34962,
        ELEMENT_ARRAY_BUFFER = 34963,
        ARRAY_BUFFER_BINDING = 34964,
        ELEMENT_ARRAY_BUFFER_BINDING = 34965,
        STREAM_DRAW = 35040,
        STATIC_DRAW = 35044,
        DYNAMIC_DRAW = 35048,
        BUFFER_SIZE = 34660,
        BUFFER_USAGE = 34661,
        CURRENT_VERTEX_ATTRIB = 34342,
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032,
        CULL_FACE = 2884,
        BLEND = 3042,
        DITHER = 3024,
        STENCIL_TEST = 2960,
        DEPTH_TEST = 2929,
        SCISSOR_TEST = 3089,
        POLYGON_OFFSET_FILL = 32823,
        SAMPLE_ALPHA_TO_COVERAGE = 32926,
        SAMPLE_COVERAGE = 32928,
        NO_ERROR = 0,
        INVALID_ENUM = 1280,
        INVALID_VALUE = 1281,
        INVALID_OPERATION = 1282,
        OUT_OF_MEMORY = 1285,
        CW = 2304,
        CCW = 2305,
        LINE_WIDTH = 2849,
        ALIASED_POINT_SIZE_RANGE = 33901,
        ALIASED_LINE_WIDTH_RANGE = 33902,
        CULL_FACE_MODE = 2885,
        FRONT_FACE = 2886,
        DEPTH_RANGE = 2928,
        DEPTH_WRITEMASK = 2930,
        DEPTH_CLEAR_VALUE = 2931,
        DEPTH_FUNC = 2932,
        STENCIL_CLEAR_VALUE = 2961,
        STENCIL_FUNC = 2962,
        STENCIL_FAIL = 2964,
        STENCIL_PASS_DEPTH_FAIL = 2965,
        STENCIL_PASS_DEPTH_PASS = 2966,
        STENCIL_REF = 2967,
        STENCIL_VALUE_MASK = 2963,
        STENCIL_WRITEMASK = 2968,
        STENCIL_BACK_FUNC = 34816,
        STENCIL_BACK_FAIL = 34817,
        STENCIL_BACK_PASS_DEPTH_FAIL = 34818,
        STENCIL_BACK_PASS_DEPTH_PASS = 34819,
        STENCIL_BACK_REF = 36003,
        STENCIL_BACK_VALUE_MASK = 36004,
        STENCIL_BACK_WRITEMASK = 36005,
        VIEWPORT = 2978,
        SCISSOR_BOX = 3088,
        COLOR_CLEAR_VALUE = 3106,
        COLOR_WRITEMASK = 3107,
        UNPACK_ALIGNMENT = 3317,
        PACK_ALIGNMENT = 3333,
        MAX_TEXTURE_SIZE = 3379,
        MAX_VIEWPORT_DIMS = 3386,
        SUBPIXEL_BITS = 3408,
        RED_BITS = 3410,
        GREEN_BITS = 3411,
        BLUE_BITS = 3412,
        ALPHA_BITS = 3413,
        DEPTH_BITS = 3414,
        STENCIL_BITS = 3415,
        POLYGON_OFFSET_UNITS = 10752,
        POLYGON_OFFSET_FACTOR = 32824,
        TEXTURE_BINDING_2D = 32873,
        SAMPLE_BUFFERS = 32936,
        SAMPLES = 32937,
        SAMPLE_COVERAGE_VALUE = 32938,
        SAMPLE_COVERAGE_INVERT = 32939,
        COMPRESSED_TEXTURE_FORMATS = 34467,
        DONT_CARE = 4352,
        FASTEST = 4353,
        NICEST = 4354,
        GENERATE_MIPMAP_HINT = 33170,
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
        DEPTH_COMPONENT = 6402,
        ALPHA = 6406,
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
        LUMINANCE_ALPHA = 6410,
        UNSIGNED_SHORT_4_4_4_4 = 32819,
        UNSIGNED_SHORT_5_5_5_1 = 32820,
        UNSIGNED_SHORT_5_6_5 = 33635,
        FRAGMENT_SHADER = 35632,
        VERTEX_SHADER = 35633,
        MAX_VERTEX_ATTRIBS = 34921,
        MAX_VERTEX_UNIFORM_VECTORS = 36347,
        MAX_varying_VECTORS = 36348,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660,
        MAX_TEXTURE_IMAGE_UNITS = 34930,
        MAX_FRAGMENT_UNIFORM_VECTORS = 36349,
        SHADER_TYPE = 35663,
        DELETE_STATUS = 35712,
        LINK_STATUS = 35714,
        VALIDATE_STATUS = 35715,
        ATTACHED_SHADERS = 35717,
        ACTIVE_UNIFORMS = 35718,
        ACTIVE_ATTRIBUTES = 35721,
        SHADING_LANGUAGE_VERSION = 35724,
        CURRENT_PROGRAM = 35725,
        NEVER = 512,
        LESS = 513,
        EQUAL = 514,
        LEQUAL = 515,
        GREATER = 516,
        NOTEQUAL = 517,
        GEQUAL = 518,
        ALWAYS = 519,
        KEEP = 7680,
        REPLACE = 7681,
        INCR = 7682,
        DECR = 7683,
        INVERT = 5386,
        INCR_WRAP = 34055,
        DECR_WRAP = 34056,
        VENDOR = 7936,
        RENDERER = 7937,
        VERSION = 7938,
        NEAREST = 9728,
        LINEAR = 9729,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987,
        TEXTURE_MAG_FILTER = 10240,
        TEXTURE_MIN_FILTER = 10241,
        TEXTURE_WRAP_S = 10242,
        TEXTURE_WRAP_T = 10243,
        TEXTURE_2D = 3553,
        TEXTURE = 5890,
        TEXTURE_CUBE_MAP = 34067,
        TEXTURE_BINDING_CUBE_MAP = 34068,
        TEXTURE_CUBE_MAP_POSITIVE_X = 34069,
        TEXTURE_CUBE_MAP_NEGATIVE_X = 34070,
        TEXTURE_CUBE_MAP_POSITIVE_Y = 34071,
        TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072,
        TEXTURE_CUBE_MAP_POSITIVE_Z = 34073,
        TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074,
        MAX_CUBE_MAP_TEXTURE_SIZE = 34076,
        TEXTURE0 = 33984,
        TEXTURE1 = 33985,
        TEXTURE2 = 33986,
        TEXTURE3 = 33987,
        TEXTURE4 = 33988,
        TEXTURE5 = 33989,
        TEXTURE6 = 33990,
        TEXTURE7 = 33991,
        TEXTURE8 = 33992,
        TEXTURE9 = 33993,
        TEXTURE10 = 33994,
        TEXTURE11 = 33995,
        TEXTURE12 = 33996,
        TEXTURE13 = 33997,
        TEXTURE14 = 33998,
        TEXTURE15 = 33999,
        TEXTURE16 = 34000,
        TEXTURE17 = 34001,
        TEXTURE18 = 34002,
        TEXTURE19 = 34003,
        TEXTURE20 = 34004,
        TEXTURE21 = 34005,
        TEXTURE22 = 34006,
        TEXTURE23 = 34007,
        TEXTURE24 = 34008,
        TEXTURE25 = 34009,
        TEXTURE26 = 34010,
        TEXTURE27 = 34011,
        TEXTURE28 = 34012,
        TEXTURE29 = 34013,
        TEXTURE30 = 34014,
        TEXTURE31 = 34015,
        ACTIVE_TEXTURE = 34016,
        REPEAT = 10497,
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678,
        SAMPLER_CUBE = 35680,
        VERTEX_ATTRIB_ARRAY_ENABLED = 34338,
        VERTEX_ATTRIB_ARRAY_SIZE = 34339,
        VERTEX_ATTRIB_ARRAY_STRIDE = 34340,
        VERTEX_ATTRIB_ARRAY_TYPE = 34341,
        VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922,
        VERTEX_ATTRIB_ARRAY_POINTER = 34373,
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975,
        IMPLEMENTATION_COLOR_READ_TYPE = 35738,
        IMPLEMENTATION_COLOR_READ_FORMAT = 35739,
        COMPILE_STATUS = 35713,
        LOW_FLOAT = 36336,
        MEDIUM_FLOAT = 36337,
        HIGH_FLOAT = 36338,
        LOW_INT = 36339,
        MEDIUM_INT = 36340,
        HIGH_INT = 36341,
        FRAMEBUFFER = 36160,
        RENDERBUFFER = 36161,
        RGBA4 = 32854,
        RGB5_A1 = 32855,
        RGB565 = 36194,
        DEPTH_COMPONENT16 = 33189,
        STENCIL_INDEX = 6401,
        STENCIL_INDEX8 = 36168,
        DEPTH_STENCIL = 34041,
        RENDERBUFFER_WIDTH = 36162,
        RENDERBUFFER_HEIGHT = 36163,
        RENDERBUFFER_INTERNAL_FORMAT = 36164,
        RENDERBUFFER_RED_SIZE = 36176,
        RENDERBUFFER_GREEN_SIZE = 36177,
        RENDERBUFFER_BLUE_SIZE = 36178,
        RENDERBUFFER_ALPHA_SIZE = 36179,
        RENDERBUFFER_DEPTH_SIZE = 36180,
        RENDERBUFFER_STENCIL_SIZE = 36181,
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048,
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051,
        COLOR_ATTACHMENT0 = 36064,
        DEPTH_ATTACHMENT = 36096,
        STENCIL_ATTACHMENT = 36128,
        DEPTH_STENCIL_ATTACHMENT = 33306,
        NONE = 0,
        FRAMEBUFFER_COMPLETE = 36053,
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054,
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055,
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057,
        FRAMEBUFFER_UNSUPPORTED = 36061,
        FRAMEBUFFER_BINDING = 36006,
        RENDERBUFFER_BINDING = 36007,
        MAX_RENDERBUFFER_SIZE = 34024,
        INVALID_FRAMEBUFFER_OPERATION = 1286,
        UNPACK_FLIP_Y_WEBGL = 37440,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441,
        CONTEXT_LOST_WEBGL = 37442,
        UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443,
        BROWSER_DEFAULT_WEBGL = 37444,
        COMPRESSED_RGB_S3TC_DXT1_EXT = 33776,
        COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777,
        COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778,
        COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779,
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840,
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841,
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842,
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843,
        COMPRESSED_RGB_ETC1_WEBGL = 36196,
        DOUBLE = 5130,
        READ_BUFFER = 3074,
        UNPACK_ROW_LENGTH = 3314,
        UNPACK_SKIP_ROWS = 3315,
        UNPACK_SKIP_PIXELS = 3316,
        PACK_ROW_LENGTH = 3330,
        PACK_SKIP_ROWS = 3331,
        PACK_SKIP_PIXELS = 3332,
        COLOR = 6144,
        DEPTH = 6145,
        STENCIL = 6146,
        RED = 6403,
        RGB8 = 32849,
        RGBA8 = 32856,
        RGB10_A2 = 32857,
        TEXTURE_BINDING_3D = 32874,
        UNPACK_SKIP_IMAGES = 32877,
        UNPACK_IMAGE_HEIGHT = 32878,
        TEXTURE_3D = 32879,
        TEXTURE_WRAP_R = 32882,
        MAX_3D_TEXTURE_SIZE = 32883,
        UNSIGNED_INT_2_10_10_10_REV = 33640,
        MAX_ELEMENTS_VERTICES = 33000,
        MAX_ELEMENTS_INDICES = 33001,
        TEXTURE_MIN_LOD = 33082,
        TEXTURE_MAX_LOD = 33083,
        TEXTURE_BASE_LEVEL = 33084,
        TEXTURE_MAX_LEVEL = 33085,
        MIN = 32775,
        MAX = 32776,
        DEPTH_COMPONENT24 = 33190,
        MAX_TEXTURE_LOD_BIAS = 34045,
        TEXTURE_COMPARE_MODE = 34892,
        TEXTURE_COMPARE_FUNC = 34893,
        CURRENT_QUERY = 34917,
        QUERY_RESULT = 34918,
        QUERY_RESULT_AVAILABLE = 34919,
        STREAM_READ = 35041,
        STREAM_COPY = 35042,
        STATIC_READ = 35045,
        STATIC_COPY = 35046,
        DYNAMIC_READ = 35049,
        DYNAMIC_COPY = 35050,
        MAX_DRAW_BUFFERS = 34852,
        DRAW_BUFFER0 = 34853,
        DRAW_BUFFER1 = 34854,
        DRAW_BUFFER2 = 34855,
        DRAW_BUFFER3 = 34856,
        DRAW_BUFFER4 = 34857,
        DRAW_BUFFER5 = 34858,
        DRAW_BUFFER6 = 34859,
        DRAW_BUFFER7 = 34860,
        DRAW_BUFFER8 = 34861,
        DRAW_BUFFER9 = 34862,
        DRAW_BUFFER10 = 34863,
        DRAW_BUFFER11 = 34864,
        DRAW_BUFFER12 = 34865,
        DRAW_BUFFER13 = 34866,
        DRAW_BUFFER14 = 34867,
        DRAW_BUFFER15 = 34868,
        MAX_FRAGMENT_UNIFORM_COMPONENTS = 35657,
        MAX_VERTEX_UNIFORM_COMPONENTS = 35658,
        SAMPLER_3D = 35679,
        SAMPLER_2D_SHADOW = 35682,
        FRAGMENT_SHADER_DERIVATIVE_HINT = 35723,
        PIXEL_PACK_BUFFER = 35051,
        PIXEL_UNPACK_BUFFER = 35052,
        PIXEL_PACK_BUFFER_BINDING = 35053,
        PIXEL_UNPACK_BUFFER_BINDING = 35055,
        FLOAT_MAT2x3 = 35685,
        FLOAT_MAT2x4 = 35686,
        FLOAT_MAT3x2 = 35687,
        FLOAT_MAT3x4 = 35688,
        FLOAT_MAT4x2 = 35689,
        FLOAT_MAT4x3 = 35690,
        SRGB = 35904,
        SRGB8 = 35905,
        SRGB8_ALPHA8 = 35907,
        COMPARE_REF_TO_TEXTURE = 34894,
        RGBA32F = 34836,
        RGB32F = 34837,
        RGBA16F = 34842,
        RGB16F = 34843,
        VERTEX_ATTRIB_ARRAY_INTEGER = 35069,
        MAX_ARRAY_TEXTURE_LAYERS = 35071,
        MIN_PROGRAM_TEXEL_OFFSET = 35076,
        MAX_PROGRAM_TEXEL_OFFSET = 35077,
        MAX_varying_COMPONENTS = 35659,
        TEXTURE_2D_ARRAY = 35866,
        TEXTURE_BINDING_2D_ARRAY = 35869,
        R11F_G11F_B10F = 35898,
        UNSIGNED_INT_10F_11F_11F_REV = 35899,
        RGB9_E5 = 35901,
        UNSIGNED_INT_5_9_9_9_REV = 35902,
        TRANSFORM_FEEDBACK_BUFFER_MODE = 35967,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 35968,
        TRANSFORM_FEEDBACK_varyingS = 35971,
        TRANSFORM_FEEDBACK_BUFFER_START = 35972,
        TRANSFORM_FEEDBACK_BUFFER_SIZE = 35973,
        TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 35976,
        RASTERIZER_DISCARD = 35977,
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 35978,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 35979,
        INTERLEAVED_ATTRIBS = 35980,
        SEPARATE_ATTRIBS = 35981,
        TRANSFORM_FEEDBACK_BUFFER = 35982,
        TRANSFORM_FEEDBACK_BUFFER_BINDING = 35983,
        RGBA32UI = 36208,
        RGB32UI = 36209,
        RGBA16UI = 36214,
        RGB16UI = 36215,
        RGBA8UI = 36220,
        RGB8UI = 36221,
        RGBA32I = 36226,
        RGB32I = 36227,
        RGBA16I = 36232,
        RGB16I = 36233,
        RGBA8I = 36238,
        RGB8I = 36239,
        RED_INTEGER = 36244,
        RGB_INTEGER = 36248,
        RGBA_INTEGER = 36249,
        SAMPLER_2D_ARRAY = 36289,
        SAMPLER_2D_ARRAY_SHADOW = 36292,
        SAMPLER_CUBE_SHADOW = 36293,
        UNSIGNED_INT_VEC2 = 36294,
        UNSIGNED_INT_VEC3 = 36295,
        UNSIGNED_INT_VEC4 = 36296,
        INT_SAMPLER_2D = 36298,
        INT_SAMPLER_3D = 36299,
        INT_SAMPLER_CUBE = 36300,
        INT_SAMPLER_2D_ARRAY = 36303,
        UNSIGNED_INT_SAMPLER_2D = 36306,
        UNSIGNED_INT_SAMPLER_3D = 36307,
        UNSIGNED_INT_SAMPLER_CUBE = 36308,
        UNSIGNED_INT_SAMPLER_2D_ARRAY = 36311,
        DEPTH_COMPONENT32F = 36012,
        DEPTH32F_STENCIL8 = 36013,
        FLOAT_32_UNSIGNED_INT_24_8_REV = 36269,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 33296,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 33297,
        FRAMEBUFFER_ATTACHMENT_RED_SIZE = 33298,
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 33299,
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 33300,
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 33301,
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 33302,
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 33303,
        FRAMEBUFFER_DEFAULT = 33304,
        UNSIGNED_INT_24_8 = 34042,
        DEPTH24_STENCIL8 = 35056,
        UNSIGNED_NORMALIZED = 35863,
        DRAW_FRAMEBUFFER_BINDING = 36006,
        READ_FRAMEBUFFER = 36008,
        DRAW_FRAMEBUFFER = 36009,
        READ_FRAMEBUFFER_BINDING = 36010,
        RENDERBUFFER_SAMPLES = 36011,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 36052,
        MAX_COLOR_ATTACHMENTS = 36063,
        COLOR_ATTACHMENT1 = 36065,
        COLOR_ATTACHMENT2 = 36066,
        COLOR_ATTACHMENT3 = 36067,
        COLOR_ATTACHMENT4 = 36068,
        COLOR_ATTACHMENT5 = 36069,
        COLOR_ATTACHMENT6 = 36070,
        COLOR_ATTACHMENT7 = 36071,
        COLOR_ATTACHMENT8 = 36072,
        COLOR_ATTACHMENT9 = 36073,
        COLOR_ATTACHMENT10 = 36074,
        COLOR_ATTACHMENT11 = 36075,
        COLOR_ATTACHMENT12 = 36076,
        COLOR_ATTACHMENT13 = 36077,
        COLOR_ATTACHMENT14 = 36078,
        COLOR_ATTACHMENT15 = 36079,
        FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 36182,
        MAX_SAMPLES = 36183,
        HALF_FLOAT = 5131,
        RG = 33319,
        RG_INTEGER = 33320,
        R8 = 33321,
        RG8 = 33323,
        R16F = 33325,
        R32F = 33326,
        RG16F = 33327,
        RG32F = 33328,
        R8I = 33329,
        R8UI = 33330,
        R16I = 33331,
        R16UI = 33332,
        R32I = 33333,
        R32UI = 33334,
        RG8I = 33335,
        RG8UI = 33336,
        RG16I = 33337,
        RG16UI = 33338,
        RG32I = 33339,
        RG32UI = 33340,
        VERTEX_ARRAY_BINDING = 34229,
        R8_SNORM = 36756,
        RG8_SNORM = 36757,
        RGB8_SNORM = 36758,
        RGBA8_SNORM = 36759,
        SIGNED_NORMALIZED = 36764,
        COPY_READ_BUFFER = 36662,
        COPY_WRITE_BUFFER = 36663,
        COPY_READ_BUFFER_BINDING = 36662,
        COPY_WRITE_BUFFER_BINDING = 36663,
        UNIFORM_BUFFER = 35345,
        UNIFORM_BUFFER_BINDING = 35368,
        UNIFORM_BUFFER_START = 35369,
        UNIFORM_BUFFER_SIZE = 35370,
        MAX_VERTEX_UNIFORM_BLOCKS = 35371,
        MAX_FRAGMENT_UNIFORM_BLOCKS = 35373,
        MAX_COMBINED_UNIFORM_BLOCKS = 35374,
        MAX_UNIFORM_BUFFER_BINDINGS = 35375,
        MAX_UNIFORM_BLOCK_SIZE = 35376,
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 35377,
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 35379,
        UNIFORM_BUFFER_OFFSET_ALIGNMENT = 35380,
        ACTIVE_UNIFORM_BLOCKS = 35382,
        UNIFORM_TYPE = 35383,
        UNIFORM_SIZE = 35384,
        UNIFORM_BLOCK_INDEX = 35386,
        UNIFORM_OFFSET = 35387,
        UNIFORM_ARRAY_STRIDE = 35388,
        UNIFORM_MATRIX_STRIDE = 35389,
        UNIFORM_IS_ROW_MAJOR = 35390,
        UNIFORM_BLOCK_BINDING = 35391,
        UNIFORM_BLOCK_DATA_SIZE = 35392,
        UNIFORM_BLOCK_ACTIVE_UNIFORMS = 35394,
        UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 35395,
        UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 35396,
        UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 35398,
        INVALID_INDEX = 4294967295,
        MAX_VERTEX_OUTPUT_COMPONENTS = 37154,
        MAX_FRAGMENT_INPUT_COMPONENTS = 37157,
        MAX_SERVER_WAIT_TIMEOUT = 37137,
        OBJECT_TYPE = 37138,
        SYNC_CONDITION = 37139,
        SYNC_STATUS = 37140,
        SYNC_FLAGS = 37141,
        SYNC_FENCE = 37142,
        SYNC_GPU_COMMANDS_COMPLETE = 37143,
        UNSIGNALED = 37144,
        SIGNALED = 37145,
        ALREADY_SIGNALED = 37146,
        TIMEOUT_EXPIRED = 37147,
        CONDITION_SATISFIED = 37148,
        WAIT_FAILED = 37149,
        SYNC_FLUSH_COMMANDS_BIT = 1,
        VERTEX_ATTRIB_ARRAY_DIVISOR = 35070,
        ANY_SAMPLES_PASSED = 35887,
        ANY_SAMPLES_PASSED_CONSERVATIVE = 36202,
        SAMPLER_BINDING = 35097,
        RGB10_A2UI = 36975,
        INT_2_10_10_10_REV = 36255,
        TRANSFORM_FEEDBACK = 36386,
        TRANSFORM_FEEDBACK_PAUSED = 36387,
        TRANSFORM_FEEDBACK_ACTIVE = 36388,
        TRANSFORM_FEEDBACK_BINDING = 36389,
        COMPRESSED_R11_EAC = 37488,
        COMPRESSED_SIGNED_R11_EAC = 37489,
        COMPRESSED_RG11_EAC = 37490,
        COMPRESSED_SIGNED_RG11_EAC = 37491,
        COMPRESSED_RGB8_ETC2 = 37492,
        COMPRESSED_SRGB8_ETC2 = 37493,
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494,
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495,
        COMPRESSED_RGBA8_ETC2_EAC = 37496,
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497,
        TEXTURE_IMMUTABLE_FORMAT = 37167,
        MAX_ELEMENT_INDEX = 36203,
        TEXTURE_IMMUTABLE_LEVELS = 33503,
        MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047
    }
}
declare namespace webGraph {
    class caps {
        maxTexturesImageUnits: number;
        maxTextureSize: number;
        maxCubemapTextureSize: number;
        maxRenderTextureSize: number;
        standardDerivatives: boolean;
        s3tc: WEBGL_compressed_texture_s3tc;
        textureFloat: boolean;
        textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        maxAnisotropy: number;
        instancedArrays: ANGLE_instanced_arrays;
        uintIndices: boolean;
        highPrecisionShaderSupported: boolean;
        fragmentDepthSupported: boolean;
        textureFloatLinearFiltering: boolean;
        textureLOD: boolean;
        drawBuffersExtension: any;
        pvrtcExtension: any;
    }
    class webglkit {
        private static _maxVertexAttribArray;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number): void;
        private static _texNumber;
        static GetTextureNumber(webgl: WebGLRenderingContext, index: number): number;
        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static caps: caps;
        static initConst(webgl: WebGLRenderingContext): void;
    }
}
declare namespace webGraph {
    class ProgramID {
        private static idAll;
        static next(): number;
    }
    class ShaderProgram {
        type: string;
        name: string;
        instance: WebGLProgram;
        state: StateOption;
        uniformDic: {
            [name: string]: UniformData;
        };
        attribDic: {
            [type: string]: number;
        };
        cachevalue: {
            [uniformName: string]: any;
        };
        readonly ID: number;
        constructor(name: string, type: string, program: WebGLProgram);
        attach(): void;
        detach(): void;
        dispose(): void;
        getUniformLocation(name: string): WebGLUniformLocation;
        getAttributeLocation(attType: VertexAttTypeEnum): number;
        private cacheUniformDic;
        applyUniformWithCache(name: string, value: any, defValue: any): void;
        applyUniform(name: string, value: any, defValue: any): void;
    }
}
declare namespace webGraph {
    class AttributeSetter {
        static CustomAttDic: {
            [name: string]: {
                location: number;
                type: VertexAttTypeEnum;
            };
        };
        static getAttributeInfo(program: WebGLProgram): {
            [name: string]: number;
        };
        static applyAttribute(value: VertexAttribute): void;
        static initAttDic(): void;
        private static typeDic;
        static getAttLocationByType(type: VertexAttTypeEnum): VertexAttLocationEnum;
    }
}
declare namespace webGraph {
    enum CullingFaceEnum {
        ALL = 0,
        CCW = 1,
        CW = 2
    }
    enum BlendModeEnum {
        Blend = 0,
        Blend_PreMultiply = 1,
        Add = 2,
        Add_PreMultiply = 3,
        custom = 4
    }
    class blendOption {
        blendEquation: number;
        Src: number;
        Dest: number;
        constructor(src?: number, dest?: number, blendEquation?: number);
    }
    class StateOption {
        cullingFace: CullingFaceEnum;
        Ztest: boolean;
        ZtestMethod: number;
        Zwrite: boolean;
        enableBlend: boolean;
        blend: BlendModeEnum;
        blendEquation: number;
        Src: number;
        Dest: number;
        stencilTest: boolean;
        refValue: number;
        stencilFuc: number;
        sZfail: number;
        sPass: number;
        sFail: number;
        enablaColormask: boolean;
        colorMask: {
            r: boolean;
            g: boolean;
            b: boolean;
            a: boolean;
        };
        clearDepth: boolean;
        setCullingFace(cullingFace: CullingFaceEnum): void;
        setZstate(Ztest?: boolean, Zwrite?: boolean, ZtestMethod?: number): void;
        setBlend(blend: BlendModeEnum, detailOp?: blendOption): void;
        setStencilFuc(stencil: boolean, refValue?: number, stencilFuc?: number): void;
        setStencilOP(spass: number, sFail?: number, sZfail?: number): void;
    }
    enum DrawModeEnum {
        VboTri = 0,
        VboLine = 1,
        EboTri = 2,
        EboLine = 3
    }
}
declare namespace webGraph {
    enum ShaderTypeEnum {
        VS = 0,
        FS = 1
    }
    class glShader {
        name: string;
        type: ShaderTypeEnum;
        instance: WebGLShader;
        constructor(name: string, type: ShaderTypeEnum, shader: WebGLShader);
        dispose(): void;
    }
}
declare namespace webGraph {
    class ShaderMgr {
        private mapVS;
        private mapFS;
        private mapProgram;
        CreatShader(type: ShaderTypeEnum, name: string, stringSource: string): glShader | null;
        CreatProgram(vs: string, fs: string, type: string): ShaderProgram | null;
    }
}
declare namespace webGraph {
    class UniformSetter {
        static texIndex: number;
        static unifomeApplyDic: {
            [type: number]: (location: WebGLUniformLocation, value: any, defValue?: any) => void;
        };
        static uniformEqualDic: {
            [type: number]: (value1: any, value2: any) => boolean;
        };
        static applyUniform(type: UniformTypeEnum, location: any, value: any, defValue: any): void;
        static initUniformDic(): void;
        static InitUniformApplyDic(): void;
        static InitUniformEqualDic(): void;
        static getUniformInfo(program: WebGLProgram): {
            [name: string]: UniformData;
        };
        private static getUniformtype;
    }
    enum UniformTypeEnum {
        FLOAT = 0,
        FLOATV = 1,
        FLOAT_VEC2 = 2,
        FLOAT_VEC2V = 3,
        FLOAT_VEC3 = 4,
        FLOAT_VEC3V = 5,
        FLOAT_VEC4 = 6,
        FLOAT_VEC4V = 7,
        INT = 8,
        INTV = 9,
        INT_VEC2 = 10,
        INT_VEC2V = 11,
        INT_VEC3 = 12,
        INT_VEC3V = 13,
        INT_VEC4 = 14,
        INT_VEC4V = 15,
        BOOL = 16,
        BOOL_VEC2 = 17,
        BOOL_VEC3 = 18,
        BOOL_VEC4 = 19,
        FLOAT_MAT2 = 20,
        FLOAT_MAT3 = 21,
        FLOAT_MAT4 = 22,
        TEXTURE = 23,
        TEXTUREV = 24,
        CUBETEXTURE = 25,
        CUBETEXTUREV = 26
    }
    class UniformData {
        name: string;
        location: WebGLUniformLocation;
        type: UniformTypeEnum;
    }
}
declare namespace webGraph {
    enum PrimitiveRenderEnum {
        Points = 0,
        Lines = 1,
        Triangles = 4,
        Wireframe = 3
    }
    enum PrimitiveDataEnum {
        static = 35044,
        dynamic = 35048
    }
    enum RenderModelEnum {
        static,
        dynamic = 35048,
        stream = 35040
    }
    interface BaseMesh {
        vbo: VertexBuffer;
        VertexAttDic: {
            [attType: string]: VertexAttribute;
        };
        ebo: ElementBuffer;
        vaoDic: {
            [key: number]: VAO;
        };
        submeshs: IMeshInfo[];
    }
    interface IMeshInfo {
        start: number;
        size: number;
        beUseEbo: boolean;
        renderType: PrimitiveRenderEnum;
    }
}
declare namespace webGraph {
    enum VertexAttTypeEnum {
        Position = "a_pos",
        UV0 = "a_texcoord0",
        Color0 = "a_color",
        BlendIndex4 = "a_blendindex4",
        BlendWeight4 = "a_blendweight4",
        Normal = "a_normal",
        Tangent = "a_tangent",
        UV1 = "a_texcoord1",
        Color1 = "a_color1",
        instance_pos = "a_InstancePos",
        instance_scale = "a_InstanceScale",
        instance_rot = "a_InstanceRot"
    }
    enum VertexAttLocationEnum {
        Position = 1,
        UV0 = 2,
        Color0 = 3,
        BlendIndex4 = 4,
        BlendWeight4 = 5,
        Normal = 6,
        Tangent = 7,
        UV1 = 8,
        Color1 = 9,
        instance_pos = 10,
        instance_scale = 11,
        instance_rot = 12
    }
    function getCompnentSizeByVertexType(type: VertexAttTypeEnum): number;
    class VertexAttribute {
        beInstanceAtt: boolean;
        type: VertexAttTypeEnum;
        location: number;
        componentSize: number;
        componentDataType: number;
        normalize: boolean;
        vbo: VertexBuffer;
        offsetInBytes: number;
        strideInBytes: number;
        static PrepareVertexAttribute(type: VertexAttTypeEnum, view: Float32Array, componentSize?: number, byteStride?: number): VertexAttribute;
        static createByType(type: VertexAttTypeEnum, attinfo?: IAttinfo): VertexAttribute;
        refreshVboData(vbodata: Float32Array): void;
    }
    interface IAttinfo {
        componentSize?: number;
        componentDataType?: number;
        normalize?: boolean;
        viewByteStride?: number;
    }
    enum ViewDataType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        UNSIGNED_INT = 5125,
        FLOAT = 5126
    }
    function GetDataArr(view: ArrayBufferView, byteStride: number, compoentSize: number, compenttype?: ViewDataType): any[];
    function GetTypedArry(componentType: ViewDataType, buffer: ArrayBuffer, byteOffset: number, Len: number): Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
    function GetByteSize(componentType: ViewDataType, componentSize: number): number;
}
declare namespace webGraph {
    abstract class abstractPlatformEntity<T extends WebGLObject> implements IAttachable {
        instance: T;
        protected constructor(instance: T);
        abstract attach(): void;
        abstract detach(): void;
    }
}
declare namespace webGraph {
    interface IAttachable {
        attach(): void;
        detach(): void;
    }
}
declare namespace webGraph {
    abstract class BaseBuffer extends abstractPlatformEntity<WebGLBuffer> {
        protected target: number;
        protected rendermodel: number;
        constructor(target: number, rendermodel?: number);
        attach(): void;
        detach(): void;
        dispose(): void;
    }
}
declare namespace webGraph {
    class ElementBuffer extends BaseBuffer {
        private static curEbo;
        constructor(data?: Uint32Array | Uint16Array | number | null, rendermodel?: number);
        bufferData(bufferData: Uint32Array | Uint16Array | number): void;
        attachWithCache(): void;
        attach(): void;
        bufferSubData(data: Uint16Array, offset?: number): void;
        setSize(indexcount: number): void;
    }
}
declare namespace webGraph {
    class FboOption {
        width: number;
        height: number;
        colorTextures: Texture2D[] | null;
        colorRenderBuffers: WebGLRenderbuffer[] | null;
        depthTexture: Texture2D | null;
        depthRenderBuffer: WebGLRenderbuffer | null;
        stencilRenderBuffer: WebGLRenderbuffer | null;
        depthStencilTexture: Texture2D | null;
        depthStencilRenderBuffer: WebGLRenderbuffer | null;
        static getDefColorDepthComboOP(width: number, height: number): FboOption;
    }
    class FrameBuffer extends abstractPlatformEntity<WebGLFramebuffer> {
        colorTextures: Texture2D[] | null;
        colorRenderBuffers: WebGLRenderbuffer[] | null;
        activeColorAttachments: number[] | null;
        depthTexture: Texture2D | null;
        depthRenderBuffer: WebGLRenderbuffer | null;
        stencilRenderBuffer: WebGLRenderbuffer | null;
        depthStencilTexture: Texture2D | null;
        depthStencilRenderBuffer: WebGLRenderbuffer | null;
        constructor(option?: FboOption | null);
        attachTexture(textue: Texture2D, attachment?: number): void;
        attachRenderBuffer(renderbuffer: WebGLRenderbuffer, attachment?: number): void;
        attachDepthBuffer(depthBuffer: WebGLRenderbuffer, width: number, height: number, attachment?: number): void;
        attach(): void;
        detach(): void;
        dispose(): void;
    }
}
declare namespace webGraph {
    class RenderBuffer extends abstractPlatformEntity<WebGLRenderbuffer> {
        constructor(option?: RboOption);
        attach(): void;
        detach(): void;
        init(format: number, width: number, height: number): void;
        dispose(): void;
    }
    class RboOption {
        format: number;
        width: number;
        height: number;
    }
}
declare namespace webGraph {
    class Texture2D extends abstractPlatformEntity<WebGLTexture> {
        unit: number;
        constructor(imagedata: HTMLImageElement | HTMLCanvasElement | Uint8Array | null, sampler: TextureOption);
        bufferData(imagedata: HTMLImageElement | HTMLCanvasElement | Uint8Array | null, sampler: TextureOption): void;
        attach(): void;
        detach(): void;
        dispose(): void;
    }
}
declare namespace webGraph {
    class VAO extends abstractPlatformEntity<WebGLTexture> {
        constructor();
        attach(): void;
        detach(): void;
        dispose(): void;
    }
}
declare namespace webGraph {
    class VertexBuffer extends BaseBuffer {
        private static curVbo;
        constructor(rendermodel?: number, data?: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | ArrayBuffer | number);
        bufferData(bufferData: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | ArrayBuffer | number): void;
        bufferSubData(data: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | ArrayBuffer, offset?: number): void;
        attachWithCache(): void;
        attach(): void;
        detach(): void;
    }
}
declare namespace webGraph {
    class CubeTex extends abstractPlatformEntity<WebGLTexture> {
        unit: number;
        constructor(imagedArr: HTMLImageElement[] | ImageData[]);
        uploadImage(imagedArr: HTMLImageElement[] | ImageData[], mipmapLevel?: number): void;
        attach(): void;
        detach(): void;
        dispose(): void;
    }
}
declare namespace webGraph {
    class TextureOption {
        preMultiply_alpha: boolean;
        flip_y: boolean;
        max_filter: number;
        min_filter: number;
        wrap_s: number;
        wrap_t: number;
        pixelFormat: number;
        pixelDatatype: number;
        data: Uint8Array | HTMLImageElement;
        width: number;
        height: number;
        setPixsStore(preMultiply_alpha: boolean, flip_y: boolean): void;
        setWrap(wrap_s: TexWrapEnum, wrap_t: TexWrapEnum): void;
        setFilterModel(maxf: TexFilterEnum, minf: TexFilterEnum): void;
        setArrayData(data: Uint8Array, width: number, height: number, format?: PixelFormat, dataType?: PixelDatatype): void;
        setImageData(data: HTMLImageElement, format?: PixelFormat, dataType?: PixelDatatype): void;
        setNullImageData(width: number, height: number, format?: PixelFormat, dataType?: PixelDatatype): void;
        static getDefFboTextureOp(width: number, height: number): TextureOption;
    }
    enum TexWrapEnum {
        clampToEdge,
        repeat = 10497,
        mirroredRepeat = 33648
    }
    enum TexFilterEnum {
        linear = 9729,
        nearest = 9728,
        nearest_mipmap_nearest = 9984,
        linear_mipmap_nearest = 9985,
        nearest_mipmap_linear = 9986,
        linear_mipmap_linear = 9987
    }
    enum PixelFormat {
        depth_component = 6402,
        depth_stencil = 34041,
        alpha = 6406,
        rgb = 6407,
        rgba = 6408,
        luminance = 6409,
        luminance_alpha = 6410,
        rgb_dxt1 = 33776,
        rgba_dxt1 = 33777,
        rgba_dxt3 = 33778,
        rgba_dxt5 = 33779,
        rgb_pvrtc_2bppv1 = 35841,
        rgb_pvrtc_4bppv1 = 35840,
        rgba_pvrtc_2bppv1 = 35843,
        rgba_pvrtc_4bppv1 = 35842,
        rgb_etc1 = 36196
    }
    enum PixelDatatype {
        UNSIGNED_BYTE = 5121,
        UNSIGNED_SHORT = 5123,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
        UNSIGNED_INT_24_8 = 34042,
        UNSIGNED_SHORT_4_4_4_4 = 32819,
        UNSIGNED_SHORT_5_5_5_1 = 32820,
        UNSIGNED_SHORT_5_6_5 = 33635
    }
}
declare namespace MathD {
    class color extends Float32Array {
        static readonly WHITE: color;
        r: number;
        g: number;
        b: number;
        a: number;
        private static Recycle;
        static create(r?: number, g?: number, b?: number, a?: number): color;
        static clone(from: color): color;
        static recycle(item: color): void;
        static disposeRecycledItems(): void;
        private constructor();
        static setWhite(out: color): color;
        static setBlack(out: color): void;
        static setGray(out: color): void;
        static multiply(srca: color, srcb: color, out: color): void;
        static scaleToRef(src: color, scale: number, out: color): void;
        static lerp(srca: color, srcb: color, t: number, out: color): void;
        static copy(a: color, out: color): color;
        static equals(a: color, b: color): boolean;
    }
}
declare namespace webGraph {
    class render {
        static BeUseVao: boolean;
        static BeUseMeshDataCache: boolean;
        static BeUseUniformCache: boolean;
        static BeUseProgramCache: boolean;
        private static _viewportCached;
        static viewPort(x: number, y: number, w: number, h: number): void;
        private static _colorcached;
        private static _depthcached;
        private static _stencilcached;
        static clears(clearcolor: boolean, color: MathD.color, cleardepth: boolean, depth: number, clearStencil: boolean, stencil: number): void;
        static clearColor(color: MathD.color): void;
        static clearDepth(depth: number): void;
        static clearStencil(stencil: number): void;
        static drawMeshNow(mesh: BaseMesh, matindex?: number, matrix?: MathD.mat4): void;
        static bindMeshAndProgram(mesh: BaseMesh, program: ShaderProgram): void;
        static _programCached: ShaderProgram;
        static bindProgram(program: ShaderProgram): void;
        static applyMatUniforms(program: ShaderProgram, AutoUniformDic: {
            [uniform: string]: any;
        }, SetValueDic: {
            [uniform: string]: any;
        }, defUniformDic: {
            [uniform: string]: any;
        }): void;
        private static applyUniformsDirectly;
        private static applyUniformsWithCache;
        static bindMeshData(mesh: BaseMesh, program?: ShaderProgram, extralData?: {
            [attType: string]: VertexAttribute;
        }): void;
        static bindMeshDataDirectly(mesh: BaseMesh, program: ShaderProgram, extralData?: {
            [attType: string]: VertexAttribute;
        }): void;
        static bindMeshDataWithCache(mesh: BaseMesh, program: ShaderProgram, extralData?: {
            [attType: string]: VertexAttribute;
        }): void;
        private static bindMeshDataWithVao;
        private static creatVertexArrayObject;
        static BindeVertexData(value: VertexAttribute): void;
        static applyAttribute(value: VertexAttribute): void;
    }
}
declare namespace webGraph {
    enum ClearType {
        COLOR = 16384,
        DEPTH = 256,
        ColorAndDepth = 16640
    }
    class RenderStateMgr {
        static currentOP: StateOption;
        private showface;
        private Zwrite;
        private Ztest;
        private ztestFunc;
        private stencilTest;
        private enableBlend;
        private blendEquation;
        private src;
        private dest;
        private enableColorMask;
        applyRenderState(state: StateOption): void;
    }
}
declare namespace MathD {
    const EPSILON: number;
    function clamp(v: number, min?: number, max?: number): number;
    function isPowerOf2(value: any): boolean;
    function lerp(from: number, to: number, lerp: number, out: number): void;
    function random(min?: number, max?: number): number;
    function numberEqual(a: number, b: number): boolean;
    function arrayEqual(a: number[] | Float32Array, b: number[] | Float32Array): boolean;
    function spriteAnimation(row: number, column: number, index: number, out: MathD.vec4): void;
    function numberLerp(fromV: number, toV: number, v: number): number;
    function disposeAllRecyle(): void;
}
declare namespace MathD {
    class mat2d extends Float32Array {
        private static Recycle;
        static create(): Float32Array;
        static clone(from: mat2d): mat2d;
        static recycle(item: mat2d): void;
        static disposeRecycledItems(): void;
        static copy(a: mat2d, out: mat2d): mat2d;
        static identity(out: mat2d): mat2d;
        static invert(out: mat2d, a: mat2d): mat2d | null;
        static determinant(a: mat2d): number;
        static multiply(a: mat2d, b: mat2d, out: mat2d): mat2d;
        static rotate(out: mat2d, a: mat2d, rad: number): mat2d;
        static scale(out: mat2d, a: mat2d, v: vec2): mat2d;
        static translate(out: mat2d, a: mat2d, v: vec2): mat2d;
        static fromRotation(rad: number, out: mat2d): mat2d;
        static getRotationing(mat: mat2d, out: refNumber, scale?: vec2): refNumber;
        static fromScaling(v: vec2, out: mat2d): mat2d;
        static getScaling(mat: mat2d, out: vec2): vec2;
        static fromTranslation(v: vec2, out: mat2d): mat2d;
        static getTranslationing(mat: mat2d, out: vec2): vec2;
        static RTS(pos: vec2, scale: vec2, rot: number, out: mat2d): void;
        static decompose(src: mat2d, pos: vec2, scale: vec2, rot: refNumber): void;
        static str(a: mat2d): string;
        static frob(a: mat2d): number;
        static add(out: mat2d, a: mat2d, b: mat2d): mat2d;
        static subtract(out: mat2d, a: mat2d, b: mat2d): mat2d;
        static multiplyScalar(out: mat2d, a: mat2d, b: number): mat2d;
        static multiplyScalarAndAdd(out: mat2d, a: mat2d, b: mat2d, scale: number): mat2d;
        static exactEquals(a: mat2d, b: mat2d): boolean;
        static equals(a: mat2d, b: mat2d): boolean;
    }
}
declare namespace MathD {
    class mat3 extends Float32Array {
        private static Recycle;
        static create(): mat3;
        static clone(from: mat3): mat3;
        static recycle(item: mat3): void;
        static disposeRecycledItems(): void;
        static fromMat4(out: any, a: any): any;
        static copy(a: any, out: any): any;
        static identity(out: any): any;
        static transpose(out: any, a: any): any;
        static invert(out: any, a: any): any;
        static adjoint(out: any, a: any): any;
        static determinant(a: any): number;
        static multiply(out: any, a: any, b: any): any;
        static translate(out: any, a: any, v: any): any;
        static rotate(out: any, a: any, rad: any): any;
        static scale(out: any, a: any, v: any): any;
        static fromTranslation(out: any, v: any): any;
        static fromRotation(out: any, rad: any): any;
        static fromScaling(out: any, v: any): any;
        static fromMat2d(a: mat2d, out: mat3): mat3;
        static fromQuat(out: any, q: any): any;
        static normalFromMat4(out: any, a: any): any;
        static projection(out: any, width: any, height: any): any;
        static str(a: any): string;
        static frob(a: any): number;
        static add(out: any, a: any, b: any): any;
        static subtract(out: any, a: any, b: any): any;
        static multiplyScalar(out: any, a: any, b: any): any;
        static multiplyScalarAndAdd(out: any, a: any, b: any, scale: any): any;
        static exactEquals(a: any, b: any): boolean;
        static equals(a: any, b: any): boolean;
    }
}
declare namespace MathD {
    class mat4 extends Float32Array {
        private static Recycle;
        static create(): Float32Array;
        static clone(from: mat4): mat4;
        static recycle(item: mat4): void;
        static disposeRecycledItems(): void;
        static copy(src: mat4, out: mat4): mat4;
        static Identity: Float32Array;
        static identity(out: mat4): mat4;
        static transpose(a: mat4, out: mat4): mat4;
        static invert(a: mat4, out: mat4): mat4 | null;
        static adjoint(a: mat4, out: mat4): mat4;
        static determinant(a: mat4): number;
        static multiply(lhs: mat4, rhs: mat4, out: mat4): mat4;
        static translate(a: mat4, v: vec3, out: mat4): mat4;
        static scale(a: mat4, v: vec3, out: mat4): mat4;
        static rotate(a: mat4, rad: number, axis: vec3, out: mat4): mat4;
        static rotateX(a: mat4, rad: number, out: mat4): mat4;
        static rotateY(a: mat4, rad: number, out: mat4): mat4;
        static rotateZ(a: mat4, rad: number, out: mat4): mat4;
        static fromTranslation(v: vec3, out: mat4): mat4;
        static fromScaling(v: vec3, out: mat4): mat4;
        static fromRotation(rad: number, axis: vec3, out: mat4): mat4;
        static fromXRotation(rad: number, out: mat4): mat4;
        static fromYRotation(rad: number, out: mat4): mat4;
        static fromZRotation(rad: number, out: mat4): mat4;
        static getTranslationing(mat: mat4, out: vec3): vec3;
        static getScaling(mat: mat4, out: vec3): vec3;
        static getRotation(mat: mat4, out: quat): quat;
        static fromRotationTranslationScaleOrigin(q: quat, v: vec3, s: vec3, o: vec3, out: mat4): mat4;
        static fromQuat(q: quat, out: mat4): mat4;
        static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, out: mat4): mat4;
        static lookAt(eye: vec3, center: vec3, up: vec3, out: mat4): mat4;
        static targetTo(eye: any, target: any, up: any, out: any): any;
        static str(a: mat4): string;
        static frob(a: mat4): number;
        static add(a: mat4, b: mat4, out: mat4): mat4;
        static subtract(lhs: mat4, rhs: mat4, out: mat4): mat4;
        static multiplyScalar(a: mat4, b: number, out: mat4): mat4;
        static multiplyScalarAndAdd(a: mat4, b: mat4, scale: number, out: mat4): mat4;
        static exactEquals(a: mat4, b: mat4): boolean;
        static equals(a: mat4, b: mat4): boolean;
        static transformPoint(vector: vec3, mat: mat4, out: vec3): vec3;
        static transformVector3(vector: vec3, mat: mat4, out: vec3): vec3;
        static project_PerspectiveLH(fovy: number, aspect: number, near: number, far: number, out: mat4): mat4;
        static project_OrthoLH(width: number, height: number, near: number, far: number, out: mat4): mat4;
        static RTS(pos: vec3, scale: vec3, rot: quat, out: mat4): mat4;
        static RT(q: quat, v: vec3, out: mat4): mat4;
        static decompose(src: mat4, scale: vec3, rotation: quat, translation: vec3): void;
        static getRotationing(matrix: mat4, result: quat, scale?: vec3): void;
    }
}
declare namespace MathD {
    class quat extends Float32Array {
        x: number;
        y: number;
        z: number;
        w: number;
        private static Recycle;
        static readonly norot: quat;
        static create(): quat;
        static clone(from: quat): quat;
        static recycle(item: quat): void;
        static disposeRecycledItems(): void;
        private constructor();
        static copy(a: quat | number[], out: quat): quat;
        static identity(out: quat): quat;
        static getAxisAngle(out_axis: vec3, q: quat): number;
        static add(a: quat, b: quat, out: quat): quat;
        static multiply(a: quat, b: quat, out: quat): quat;
        static scale(a: quat, b: number, out: quat): quat;
        static length_(a: quat): number;
        static squaredLength(a: quat): number;
        static normalize(src: quat, out: quat): quat;
        static dot(a: quat, b: quat): number;
        static lerp(a: quat, b: quat, t: number, out: quat): quat;
        static slerp(a: quat, b: quat, t: number, out: quat): quat;
        static sqlerp(a: quat, b: quat, c: quat, d: quat, t: number, out: quat): quat;
        static inverse(a: quat, out: quat): quat;
        static conjugate(out: quat, a: quat): quat;
        static str(a: quat): string;
        static rotateX(a: quat, rad: number, out: quat): quat;
        static rotateY(a: quat, rad: number, out: quat): quat;
        static rotateZ(a: quat, rad: number, out: quat): quat;
        static fromMat3(m: mat3, out: quat): quat;
        static setAxes(view: vec3, right: vec3, up: vec3, out: quat): quat;
        static calculateW(a: quat, out: quat): quat;
        static exactEquals(a: quat, b: quat): boolean;
        static fromYawPitchRoll(yaw: number, pitch: number, roll: number, result: quat): void;
        static FromEuler(x: number, y: number, z: number, out: quat): quat;
        static ToEuler(src: quat, out: vec3): void;
        static AxisAngle(axis: vec3, rad: number, out: quat): quat;
        static rotationTo(from: vec3, to: vec3, out: quat): quat;
        static myLookRotation(dir: vec3, out: quat, up?: vec3): quat;
        static LookRotation(lookAt: vec3, up?: vec3): void;
        static transformVector(src: quat, vector: vec3, out: vec3): void;
        static unitxyzToRotation(xAxis: vec3, yAxis: vec3, zAxis: vec3, out: quat): void;
        static lookat(pos: vec3, targetpos: vec3, out: quat, up?: vec3): void;
        static equals(a: quat, b: quat): boolean;
        static fromToRotation(from: MathD.vec3, to: MathD.vec3, out: MathD.quat): void;
    }
}
declare namespace MathD {
    class Rect extends Float32Array {
        x: number;
        y: number;
        z: number;
        readonly width: number;
        readonly height: number;
        w: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
        private static Recycle;
        static create(x?: number, y?: number, w?: number, h?: number): Rect;
        static clone(from: Rect): Rect;
        static recycle(item: Rect): void;
        static disposeRecycledItems(): void;
        static copy(a: Rect, out: Rect): Rect;
        static euqal(a: Rect, b: Rect): boolean;
    }
    function rectSet_One(out: Rect): void;
    function rectSet_Zero(out: Rect): void;
    function rectEqul(src1: Rect, src2: Rect): boolean;
    function rectInner(x: number, y: number, src: Rect): boolean;
}
declare namespace MathD {
    class refNumber {
        value: number;
    }
}
declare namespace MathD {
    class vec2 extends Float32Array {
        x: number;
        y: number;
        private static Recycle;
        static create(x?: number, y?: number): vec2;
        static clone(from: vec2): vec2;
        static recycle(item: vec2): void;
        static disposeRecycledItems(): void;
        private constructor();
        static copy(a: vec2 | number[], out: vec2): vec2;
        static add(a: vec2, b: vec2, out: vec2): vec2;
        static subtract(a: vec2, b: vec2, out: vec2): vec2;
        static multiply(a: vec2, b: vec2, out: vec2): vec2;
        static divide(a: vec2, b: vec2, out: vec2): vec2;
        static ceil(a: vec2, out: vec2): vec2;
        static floor(a: vec2, out: vec2): vec2;
        static min(a: vec2, b: vec2, out: vec2): vec2;
        static max(a: vec2, b: vec2, out: vec2): vec2;
        static round(a: vec2, out: vec2): vec2;
        static scale(a: vec2, b: number, out: vec2): vec2;
        static scaleByVec2(a: vec2, b: vec2, out: vec2): vec2;
        static scaleAndAdd(a: vec2, b: vec2, scale: number, out: vec2): vec2;
        static distance(a: vec2, b: vec2): number;
        static squaredDistance(a: vec2, b: vec2): number;
        static length_(a: vec2): number;
        static squaredLength(a: vec2): number;
        static negate(a: vec2, out: vec2): vec2;
        static inverse(a: vec2, out: vec2): vec2;
        static normalize(a: vec2, out: vec2): vec2;
        static dot(a: vec2, b: vec2): number;
        static cross(a: vec2, b: vec2, out: vec3): vec2;
        static lerp(from: vec2, to: vec2, lerp: number, out: vec2): vec2;
        static random(scale: number, out: vec2): vec2;
        static transformMat2d(a: vec2, m: mat2d, out: vec2): vec2;
        static transformMat4(a: vec2, m: mat4, out: vec2): vec2;
        static str(a: vec2): string;
        static exactEquals(a: vec2, b: vec2): boolean;
        static equals(a: vec2, b: vec2): boolean;
    }
}
declare namespace MathD {
    class vec3 extends Float32Array {
        static readonly UP: vec3;
        static readonly DOWN: vec3;
        static readonly RIGHT: vec3;
        static readonly LEFT: vec3;
        static readonly FORWARD: vec3;
        static readonly BACKWARD: vec3;
        static readonly ONE: vec3;
        static readonly ZERO: vec3;
        x: number;
        y: number;
        z: number;
        private static Recycle;
        static create(x?: number, y?: number, z?: number): vec3;
        static clone(from: vec3): vec3;
        static recycle(item: vec3): void;
        static disposeRecycledItems(): void;
        private constructor();
        static copy(from: vec3 | number[], out: vec3): vec3;
        static add(lhs: vec3, rhs: vec3, out: vec3): vec3;
        static toZero(a: vec3): void;
        static subtract(lhs: vec3, rhs: vec3, out: vec3): vec3;
        static multiply(a: vec3, b: vec3, out: vec3): vec3;
        static center(a: vec3, b: vec3, out: vec3): vec3;
        static divide(out: vec3, a: vec3, b: vec3): vec3;
        static ceil(out: vec3, a: vec3): vec3;
        static floor(out: vec3, a: vec3): vec3;
        static min(a: vec3, b: vec3, out: vec3): vec3;
        static max(out: vec3, a: vec3, b: vec3): vec3;
        static round(out: vec3, a: vec3): vec3;
        static scale(a: vec3, b: number, out: vec3): vec3;
        static AddscaledVec(lhs: vec3, rhs: vec3, scale: number, out: vec3): vec3;
        static distance(a: vec3, b: vec3): number;
        static squaredDistance(a: vec3, b: vec3): number;
        static magnitude(a: vec3): number;
        static squaredLength(a: vec3): number;
        static negate(a: vec3, out: vec3): vec3;
        static inverse(a: vec3, out: vec3): vec3;
        static normalize(src: vec3, out: vec3): vec3;
        static dot(a: vec3, b: vec3): number;
        static cross(lhs: vec3, rhs: vec3, out: vec3): vec3;
        static lerp(lhs: vec3, rhs: vec3, lerp: number, out: vec3): vec3;
        static hermite(out: vec3, a: vec3, b: vec3, c: vec3, d: vec3, t: number): vec3;
        static bezier(out: vec3, a: vec3, b: vec3, c: vec3, d: vec3, t: number): vec3;
        static random(out: vec3, scale?: number): vec3;
        static transformQuat(out: vec3, a: vec3, q: quat): vec3;
        static rotateX(out: vec3, a: vec3, b: vec3, c: number): vec3;
        static rotateY(out: vec3, a: vec3, b: vec3, c: number): vec3;
        static rotateZ(out: vec3, a: vec3, b: vec3, c: number): vec3;
        static angle(a: vec3, b: vec3): number;
        static str(a: vec3): string;
        static exactEquals(a: vec3, b: vec3): boolean;
        static equals(a: vec3, b: vec3): boolean;
    }
}
declare namespace MathD {
    class vec4 extends Float32Array {
        x: number;
        y: number;
        z: number;
        w: number;
        private static Recycle;
        static create(x?: number, y?: number, z?: number, w?: number): vec4;
        static clone(from: vec4): vec4;
        static recycle(item: vec4): void;
        static disposeRecycledItems(): void;
        private constructor();
        static copy(a: vec4 | number[], out: vec4): vec4;
        static add(out: vec4, a: vec4, b: vec4): vec4;
        static subtract(a: vec4, b: vec4, out: vec4): vec4;
        static multiply(a: vec4, b: vec4, out: vec4): vec4;
        static divide(a: vec4, b: vec4, out: vec4): vec4;
        static ceil(a: vec4, out: vec4): vec4;
        static floor(a: vec4, out: vec4): vec4;
        static min(a: vec4, b: vec4, out: vec4): vec4;
        static max(a: vec4, b: vec4, out: vec4): vec4;
        static round(a: vec4, out: vec4): vec4;
        static scale(a: vec4, b: number, out: vec4): vec4;
        static scaleAndAdd(a: vec4, b: vec4, scale: number, out: vec4): vec4;
        static distance(a: vec4, b: vec4): number;
        static squaredDistance(a: vec4, b: vec4): number;
        static length_(a: vec4): number;
        static squaredLength(a: vec4): number;
        static negate(a: vec4, out: vec4): vec4;
        static inverse(a: vec4, out: vec4): vec4;
        static normalize(a: vec4, out: vec4): vec4;
        static dot(a: vec4, b: vec4): number;
        static lerp(lhs: vec4, rhs: vec4, lerp: number, out: vec4): vec4;
        static random(scale: number, out: vec4): vec4;
        static transformMat4(a: vec4, m: mat4, out: vec4): vec4;
        static transformQuat(a: vec4, q: quat, out: vec4): vec4;
        static str(a: vec4): string;
        static exactEquals(a: vec4, b: vec4): boolean;
        static equals(a: vec4, b: vec4): boolean;
    }
}
declare namespace web3d {
    class AABB {
        maxPoint: MathD.vec3;
        minPoint: MathD.vec3;
        centerPoint: MathD.vec3;
        setMaxPoint(pos: MathD.vec3): void;
        setMinPoint(pos: MathD.vec3): void;
        setFromPoints(pos: MathD.vec3 | MathD.vec3[]): AABB;
        setFromMesh(mesh: Mesh): AABB;
        addAABB(box: AABB): void;
        beEmpty(): boolean;
        containPoint(point: MathD.vec3): boolean;
        intersectAABB(box: AABB): boolean;
        applyMatrix(mat: MathD.mat4): void;
    }
}
declare namespace web3d {
    class Frustum {
        planes: Plane[];
        constructor(p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane);
        set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): void;
        setFromMatrix(me: MathD.mat4): Frustum;
        intersectRender(render: IRender): boolean;
        intersectSphere(sphere: BoundingSphere): boolean;
    }
}
declare namespace web3d {
    class Line {
        startPoint: MathD.vec3;
        endPoint: MathD.vec3;
        intersectTriangle(v0: MathD.vec3, v1: MathD.vec3, v2: MathD.vec3, intersectPoint?: MathD.vec3): boolean;
        interSectAABB(aabb: AABB, intersectPoint?: MathD.vec3): boolean;
        intersectTriangleMesh(mesh: Mesh): boolean;
    }
}
declare namespace web3d {
    class Particle {
        position: MathD.vec3;
        velocity: MathD.vec3;
        acceleration: MathD.vec3;
        damping: number;
        inverseMass: number;
        forceAccum: MathD.vec3;
        private resultAcc;
        integrate(detal: number): void;
        addForce(force: MathD.vec3): void;
        clearAccumlator(): void;
        getMass(): number;
        getpositon(): MathD.vec3;
        getVelocity(): MathD.vec3;
        hasFiniteMass(): boolean;
    }
}
declare namespace web3d {
    class ParticleContact {
        particles: Particle[];
        restitution: number;
        contactNormal: MathD.vec3;
        penetration: number;
        resolve(detal: number): void;
        private relativeSped;
        calculateSeparatingVelocity(): number;
        temptVec3: MathD.vec3;
        movePerIMass: MathD.vec3;
        impulsePerIMass: MathD.vec3;
        private resolveVelocity;
        resolveInterpenetration(detal: number): void;
    }
}
declare namespace web3d {
    interface ParticleForceGenerator {
        updateFore(par: Particle, delta: number): any;
    }
    class ParticleGravity implements ParticleForceGenerator {
        gravity: MathD.vec3;
        constructor(gravity: MathD.vec3);
        private force;
        updateFore(par: Particle, delta: number): void;
    }
    class ParticleSpring implements ParticleForceGenerator {
        other: Particle;
        springConstant: number;
        restLength: number;
        constructor(other: Particle, sprinconstant: number, restlen: number);
        private force;
        updateFore(par: Particle, delta: number): void;
    }
    class ParticleAnchoredSpring implements ParticleForceGenerator {
        anchor: MathD.vec3;
        springConstant: number;
        restLength: number;
        constructor(anchor: MathD.vec3, sprinconstant: number, restlen: number);
        private force;
        updateFore(par: Particle, delta: number): void;
    }
    class ParticleBungee implements ParticleForceGenerator {
        other: Particle;
        springConstant: number;
        restLenghth: number;
        constructor(other: Particle, springConstance: number, restLen: number);
        private force;
        updateFore(par: Particle, delta: number): void;
    }
    class ParticleBuoyancy implements ParticleForceGenerator {
        maxDepth: number;
        volume: number;
        waterHeight: number;
        liquidDensity: number;
        constructor(maxdepth: number, volume: number, waterheight: number, liquiddensity?: number);
        private force;
        updateFore(par: Particle, delta: number): void;
    }
    class ParticleFakeSpring implements ParticleForceGenerator {
        anchor: MathD.vec3;
        springConstant: number;
        restLength: number;
        damping: number;
        private pos;
        private c;
        private target;
        private ac;
        private tempt;
        updateFore(par: Particle, delta: number): void;
    }
}
declare namespace web3d {
    class ParticleForceRegistry {
        forceMap: Map<ParticleForceGenerator, Particle[]>;
        add(par: Particle, force: ParticleForceGenerator): void;
        remove(par: Particle, force: ParticleForceGenerator): void;
        clear(): void;
        updateForces(detal: number): void;
    }
}
declare namespace web3d {
    class Physics {
        static Raycast(origin: MathD.vec3, direction: MathD.vec3, distance?: number): void;
        static rayIntersect(origin: MathD.vec3, rayDir: MathD.vec3, v0: MathD.vec3, v1: MathD.vec3, v2: MathD.vec3, intersectPoint?: MathD.vec3): boolean;
        static rayIntersectMesh(origin: MathD.vec3, rayDir: MathD.vec3, mesh: Mesh): boolean;
    }
}
declare namespace web3d {
    class Plane {
        normal: MathD.vec3;
        constant: number;
        distanceToPoint(point: MathD.vec3): number;
        copy(to: Plane): void;
        setComponents(nx: number, ny: number, nz: number, ds: number): void;
    }
}
declare namespace web3d {
    class Ray {
        origin: MathD.vec3;
        direction: MathD.vec3;
        constructor(origin: MathD.vec3, dir: MathD.vec3);
        intersectTriangle(v0: MathD.vec3, v1: MathD.vec3, v2: MathD.vec3, intersectPoint?: MathD.vec3): boolean;
        interSectAABB(aabb: AABB, intersectPoint?: MathD.vec3): boolean;
        intersectTriangleMesh(mesh: Mesh): boolean;
    }
}
declare namespace web3d {
    class BoundingSphere {
        center: MathD.vec3;
        radius: number;
        applyMatrix(mat: MathD.mat4): void;
        setFromPoints(points: MathD.vec3[], center?: MathD.vec3): void;
        setFromMesh(mesh: Mesh, center?: MathD.vec3): BoundingSphere;
        copyTo(to: BoundingSphere): void;
        clone(): BoundingSphere;
        private static pool;
        static create(): BoundingSphere;
        static recycle(item: BoundingSphere): void;
    }
    class BoundingBox {
        center: MathD.vec3;
        halfSize: MathD.vec3;
        private static pool;
        static create(): BoundingBox;
        static recycle(item: BoundingBox): void;
    }
}
declare namespace web3d {
    var webgl: WebGLRenderingContext;
    var assetMgr: AssetMgr;
    var renderContext: RenderContext;
    var renderContext2d: RenderContext2d;
    var renderMgr: Rendermgr;
    var app: application;
    var sceneMgr: SceneMgr;
    class GlobalMgr {
        constructor(_app: application);
        initAllSingleton(Onfinish: () => void): void;
    }
}
declare namespace web3d {
    class GameScreen {
        private static canvaswidth;
        private static canvasheight;
        private static apset;
        static readonly Height: number;
        static readonly Width: number;
        private static _windowWidth;
        private static _windowHeight;
        static readonly windowWidth: number;
        static readonly windowHeight: number;
        static readonly aspect: number;
        private static scale;
        static SetCanvasSize(scale: number): void;
        private static canvas;
        static divcontiner: HTMLDivElement;
        static init(canvas: HTMLCanvasElement): void;
        private static OnResizeCanvas;
        private static resizeListenerArr;
        static addListenertoCanvasResize(fuc: () => void): void;
    }
}
declare namespace web3d {
    class application {
        private version;
        private build;
        webgl: WebGLRenderingContext;
        container: HTMLDivElement;
        start(div: HTMLDivElement): void;
        startByWxPlatform(): void;
        private boost;
        private Loop;
        private _userCode;
        private _userCodeNew;
        private updateUserCode;
        private addUserCodeDirect;
        addUserCode(classname: string): void;
    }
    interface IUserCode {
        onStart(app: application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
    interface IEditorCode {
        onStart(app: application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
}
declare namespace web3d {
    enum ScreenMatchEnum {
        Height = 0,
        Width = 1
    }
    class Canvas {
        private static _inc;
        static readonly inc: Canvas;
        private rootNode;
        private readonly rootTrans;
        constructor();
        addChild(node: Transform2D): void;
        removeChild(node: Transform2D): void;
        getChildren(): Transform2D[];
        getChildCount(): number;
        getChild(index: number): Transform2D;
        private match_width;
        private match_height;
        realheight: number;
        realWidth: number;
        matchScale: number;
        screenMatchType: ScreenMatchEnum;
        private onScreenResize;
        update(delta: number): void;
        private updateGameObject;
        render(): void;
        private drawScene;
        getRoot(): Node2d;
        addRenderData(mat: Material, meshdata: number[]): void;
    }
}
declare namespace web3d {
    class Node2d {
        beVisible: boolean;
        name: string;
        transform2d: Transform2D;
        renderer: IRectRenderer;
        components: I2DComponent[];
        private componentsInit;
        constructor();
        start(): void;
        update(delta: number): void;
        addComponent<T extends I2DComponent>(type: string): T;
        removeComponent(comp: I2DComponent): void;
        removeAllComponents(): void;
        getComponent<T extends I2DComponent>(type: Function): T;
    }
}
declare namespace web3d {
    class UIMeshData {
        static vboData: number[];
        static eboData: number[];
    }
}
declare namespace web3d {
    class RenderContext2d {
        matrixReshape: MathD.mat2d;
        matrixToMatchCanvas: MathD.mat2d;
        matrixMatchCanvasToRealCanvas: MathD.mat2d;
        matrixProject: MathD.mat2d;
        private mat_ui;
        matrix_UI: MathD.mat3;
        updateModel(transform2d: Transform2D): void;
        updateCamera(canvas: Canvas): void;
        private canvasProjectMatrix;
        private canvasMatchMatrix;
    }
}
declare namespace web3d {
    enum layoutOption {
        LEFT = 1,
        TOP = 2,
        RIGHT = 4,
        BOTTOM = 8,
        H_CENTER = 16,
        V_CENTER = 32
    }
    interface I2DComponent {
        start(): any;
        update(delta: number): any;
        node2d: Node2d;
        dispose(): any;
    }
    interface IRectRenderer extends I2DComponent {
        render(canvas: Canvas): any;
    }
    class C2DComponent {
        comp: I2DComponent;
        init: boolean;
        constructor(comp: I2DComponent, init?: boolean);
    }
    class Transform2D {
        node2d: Node2d;
        beVisible: boolean;
        name: string;
        parent: Transform2D;
        children: Transform2D[];
        width: number;
        height: number;
        pivot: MathD.vec2;
        localPosition: MathD.vec2;
        localScale: MathD.vec2;
        localRotation: number;
        private _localMatrix;
        private _worldMatrix;
        private canvasWorldMatrix;
        private _worldRotate;
        private _worldPosition;
        private _worldScale;
        private dirtyWorldDecompose;
        private needComputeLocalMat;
        private needComputeWorldMat;
        private maskRect;
        markDirty(): void;
        private notifyChildSelfDirty;
        readonly localMatrix: MathD.mat2d;
        readonly worldMatrix: MathD.mat2d;
        readonly worldScale: MathD.vec2;
        readonly worldPositon: MathD.vec2;
        readonly worldRotation: number;
        private _reshapeMatrix;
        readonly reshapeMatrix: MathD.mat2d;
        addChild(node: Transform2D): void;
        removeChild(node: Transform2D): void;
        removeAllChild(): void;
        dispose(): void;
    }
}
declare namespace web3d {
    function Attribute(target: any, _key: string): void;
    function getClassFunctionByName(name: string): Function;
    function Class(constructor: Function, SeralizeName: string): void;
    function ClassWithTag(constructor: Function, tagInfo: string): void;
    function createInstanceByName(className: string): any;
    function getRegistedClassName(obj: Object): string | null;
    function haveRegClass(obj: Object): boolean;
    function Serialize(name: string): (target: any) => void;
    function NodeComponent(constructorObj: Function): void;
    function NodeComponent2d(constructorObj: Function): void;
    function GameAsset(constructorObj: Function): void;
    function creatComponent(classsName: string): any;
    function creatComponent2d(classsName: string): any;
    function BeCompoentType(type: string): boolean;
    function BeAssetType(type: string): boolean;
    function UserCode(constructorObj: Function): void;
    function creatUserCode(classsname: string): any;
    function getAtts(obj: Object): string[] | null;
}
declare namespace web3d {
    class RawImage2D implements IRectRenderer {
        constructor();
        node2d: Node2d;
        private _image;
        image: Texture;
        color: MathD.color;
        private mat;
        render(canvas: Canvas): void;
        uploadMeshData(): void;
        start(): void;
        update(delta: number): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class ResID {
        private static idAll;
        static next(): number;
    }
    interface IAsset {
        name: string;
        beDefaultAsset: boolean;
        type: string;
        URL: string | null;
        dispose(): void;
        loadState: LoadEnum;
        onLoadEnd: () => void;
    }
    class Web3dAsset implements IAsset {
        name: string;
        readonly guid: number;
        URL: string;
        loadState: LoadEnum;
        readonly beDefaultAsset: boolean;
        type: string;
        constructor(name: string | null, url?: string | null, bedef?: boolean);
        private loadEndListeners;
        onLoadEnd(): void;
        addListenerToLoadEnd(onloadEnd: () => void): void;
        dispose(): void;
    }
}
declare namespace web3d {
    enum LoadEnum {
        Success = "Success",
        Failed = "Failed",
        Loading = "Loading",
        None = "None"
    }
    class AssetLoadInfo {
        url: string;
        beSucces: boolean;
        private _err;
        err: Error;
        constructor(url: string);
        progress: DownloadInfo;
    }
    class DefaultAssetMgr {
        initDefAsset(): void;
        mapDefaultMesh: {
            [id: string]: Mesh;
        };
        getDefaultMesh(name: string): Mesh;
        mapDefaultTexture: {
            [id: string]: Texture;
        };
        getDefaultTexture(name: string): Texture;
        mapDefaultCubeTexture: {
            [id: string]: CubeTexture;
        };
        getDefaultCubeTexture(name: string): CubeTexture;
        mapDefaultMat: {
            [id: string]: Material;
        };
        getDefaultMaterial(name: string): Material;
    }
    class AssetMgr extends DefaultAssetMgr {
        shaderMgr: webGraph.ShaderMgr;
        constructor();
        static RegisterAssetLoader(extral: string, factory: () => IAssetLoader): void;
        private static RESLoadDic;
        static RegisterAssetExtensionLoader(extral: string, factory: () => IAssetLoader): void;
        private static RESExtensionLoadDic;
        mapShader: {
            [id: string]: Shader;
        };
        getShader(name: string): Shader;
        private loadMap;
        private loadingUrl;
        loadMapBundle: {
            [bundleName: string]: BundleInfo;
        };
        getAssetLoadInfo(url: string): AssetLoadInfo | null;
        load(url: string, onFinish?: ((asset: IAsset | null, loadInfo?: AssetLoadInfo) => void) | null, onProgress?: (progress: DownloadInfo) => void): IAsset | null;
        loadAsync(url: string): Promise<IAsset>;
        loadTypedAsset(url: string, type: string, onFinish?: ((asset: IAsset | null, loadInfo?: AssetLoadInfo) => void) | null, onProgress?: (progress: DownloadInfo) => void): IAsset;
        static getFileName(url: string): string;
        static getFileNameWithoutExtralName(url: string): string;
        static getAssetExtralName(url: string): string;
    }
}
declare namespace web3d {
    class DefMatrial {
        static initDefaultMat(): void;
    }
}
declare namespace web3d {
    class DefMesh {
        static initDefaultMesh(): void;
        private static createDefaultMesh;
        private static createDefaultMesh_UIQuad;
    }
}
declare namespace web3d {
    class DefShader {
        static UI_vscode: string;
        static UI_fscode: string;
        static vs_color: string;
        static fs_color: string;
        static vs_color_skin: string;
        static vsColor: string;
        static text3d: string;
        static vscolor_skin: string;
        static fsColor: string;
        static def_error_vs: string;
        static def_error_fs: string;
        static add_vs: string;
        static add_fs: string;
        static initDefaultShader(): void;
    }
}
declare namespace web3d {
    class DefTexture {
        static initDefaultTexture(): void;
    }
    enum defTextureEnum {
        gray = 0,
        white = 1,
        black = 2,
        grid = 3
    }
    function getdefTexture(type: defTextureEnum): webGraph.Texture2D;
}
declare namespace web3d {
    class PrimitiveNode {
        mesh: Mesh;
        mat: Material;
    }
    class ParsePrimitiveNode {
        private static beinit;
        private static _vertexAttDic;
        static extensionName: string;
        static readonly vertexAttMap: {
            [type: string]: {
                type: webGraph.VertexAttTypeEnum;
                location: number;
            };
        };
        static parse(node: IMeshPrimitive, loader: LoadGlTF): Promise<PrimitiveNode>;
        static parseMesh(node: IMeshPrimitive, loader: LoadGlTF): Promise<Mesh>;
        static parseMaterial(node: IMeshPrimitive, loader: LoadGlTF): Promise<Material>;
        static parseVboData(attributes: {
            [name: string]: number;
        }, mesh: Mesh, loader: LoadGlTF): Promise<void>;
        static parseVertexAtt(index: number, type: string, mesh: Mesh, loader: LoadGlTF): Promise<void>;
        static parseEboData(index: number, mesh: Mesh, loader: LoadGlTF): Promise<void>;
    }
}
declare namespace web3d {
    class glTFBundle extends Web3dAsset {
        static BeUsePBRMaterial: boolean;
        gltf: IGLTF;
        rootURL: string;
        constructor(name?: string | null, url?: string | null);
        meshNodeCache: {
            [index: number]: PrimitiveNode[];
        };
        skinNodeCache: {
            [index: number]: SkinNode;
        };
        bufferviewNodeCache: {
            [index: number]: BufferviewNode;
        };
        bufferNodeCache: {
            [index: number]: ArrayBuffer;
        };
        materialNodeCache: {
            [index: number]: Material;
        };
        textrueNodeCache: {
            [index: number]: Texture;
        };
        beContainAnimation: boolean;
        animationNodeCache: {
            [index: number]: AnimationClip;
        };
        bundleAnimator: Animation;
        nodeDic: {
            [index: number]: Transform;
        };
        Instantiate(): Transform;
        dispose(): void;
    }
}
declare namespace web3d {
    enum AccessorComponentType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        UNSIGNED_INT = 5125,
        FLOAT = 5126
    }
    enum AccessorType {
        SCALAR = "SCALAR",
        VEC2 = "VEC2",
        VEC3 = "VEC3",
        VEC4 = "VEC4",
        MAT2 = "MAT2",
        MAT3 = "MAT3",
        MAT4 = "MAT4"
    }
    enum AnimationChannelTargetPath {
        TRANSLATION = "translation",
        ROTATION = "rotation",
        SCALE = "scale",
        WEIGHTS = "weights"
    }
    enum AnimationSamplerInterpolation {
        LINEAR = "LINEAR",
        STEP = "STEP",
        CUBICSPLINE = "CUBICSPLINE"
    }
    enum CameraType {
        PERSPECTIVE = "perspective",
        ORTHOGRAPHIC = "orthographic"
    }
    enum ImageMimeType {
        JPEG = "image/jpeg",
        PNG = "image/png"
    }
    enum MaterialAlphaMode {
        OPAQUE = "OPAQUE",
        MASK = "MASK",
        BLEND = "BLEND"
    }
    enum MeshPrimitiveMode {
        POINTS = 0,
        LINES = 1,
        LINE_LOOP = 2,
        LINE_STRIP = 3,
        TRIANGLES = 4,
        TRIANGLE_STRIP = 5,
        TRIANGLE_FAN = 6
    }
    enum TextureMagFilter {
        NEAREST = 9728,
        LINEAR = 9729
    }
    enum TextureMinFilter {
        NEAREST = 9728,
        LINEAR = 9729,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987
    }
    enum TextureWrapMode {
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
        REPEAT = 10497
    }
    interface IProperty {
        extensions?: {
            [key: string]: any;
        };
        extras?: any;
    }
    interface IChildRootProperty extends IProperty {
        name?: string;
    }
    interface IAccessorSparseIndices extends IProperty {
        bufferView: number;
        byteOffset?: number;
        componentType: AccessorComponentType;
    }
    interface IAccessorSparseValues extends IProperty {
        bufferView: number;
        byteOffset?: number;
    }
    interface IAccessorSparse extends IProperty {
        count: number;
        indices: IAccessorSparseIndices;
        values: IAccessorSparseValues;
    }
    interface IAccessor extends IChildRootProperty {
        bufferView?: number;
        byteOffset?: number;
        componentType: AccessorComponentType;
        normalized?: boolean;
        count: number;
        type: AccessorType;
        max?: number[];
        min?: number[];
        sparse?: IAccessorSparse;
    }
    interface IAnimationChannel extends IProperty {
        sampler: number;
        target: IAnimationChannelTarget;
    }
    interface IAnimationChannelTarget extends IProperty {
        node: number;
        path: AnimationChannelTargetPath;
    }
    interface IAnimationSampler extends IProperty {
        input: number;
        interpolation?: AnimationSamplerInterpolation;
        output: number;
    }
    interface IAnimation extends IChildRootProperty {
        channels: IAnimationChannel[];
        samplers: IAnimationSampler[];
    }
    interface IglTFAsset extends IChildRootProperty {
        copyright?: string;
        generator?: string;
        version: string;
        minVersion?: string;
    }
    interface IBuffer extends IChildRootProperty {
        uri?: string;
        byteLength: number;
    }
    interface IBufferView extends IChildRootProperty {
        buffer: number;
        byteOffset: number;
        byteLength: number;
        byteStride?: number;
    }
    interface ICameraOrthographic extends IProperty {
        xmag: number;
        ymag: number;
        zfar: number;
        znear: number;
    }
    interface ICameraPerspective extends IProperty {
        aspectRatio?: number;
        yfov: number;
        zfar?: number;
        znear: number;
    }
    interface ICamera extends IChildRootProperty {
        orthographic?: ICameraOrthographic;
        perspective?: ICameraPerspective;
        type: CameraType;
    }
    interface IImage extends IChildRootProperty {
        uri?: string;
        mimeType?: ImageMimeType;
        bufferView?: number;
    }
    interface IMaterialNormalTextureInfo extends ITextureInfo {
        scale?: number;
    }
    interface IMaterialOcclusionTextureInfo extends ITextureInfo {
        strength?: number;
    }
    interface IMaterialPbrMetallicRoughness {
        baseColorFactor?: number[];
        baseColorTexture?: ITextureInfo;
        metallicFactor?: number;
        roughnessFactor?: number;
        metallicRoughnessTexture?: ITextureInfo;
    }
    interface IMaterial extends IChildRootProperty {
        pbrMetallicRoughness?: IMaterialPbrMetallicRoughness;
        normalTexture?: IMaterialNormalTextureInfo;
        occlusionTexture?: IMaterialOcclusionTextureInfo;
        emissiveTexture?: ITextureInfo;
        emissiveFactor?: number[];
        alphaMode?: MaterialAlphaMode;
        alphaCutoff?: number;
        doubleSided?: boolean;
        shader?: string;
        queue?: number;
    }
    interface IMeshPrimitive extends IProperty {
        attributes: {
            [name: string]: number;
        };
        indices?: number;
        material?: number;
        mode?: MeshPrimitiveMode;
        targets?: {
            [name: string]: number;
        }[];
    }
    interface IMesh extends IChildRootProperty {
        primitives: IMeshPrimitive[];
        weights?: number[];
    }
    interface INode extends IChildRootProperty {
        camera?: number;
        children?: number[];
        skin?: number;
        matrix?: number[];
        mesh?: number;
        rotation?: number[];
        scale?: number[];
        translation?: number[];
        weights?: number[];
        parent?: number;
        comps?: any[];
    }
    interface ISampler extends IChildRootProperty {
        magFilter?: TextureMagFilter;
        minFilter?: TextureMinFilter;
        wrapS?: TextureWrapMode;
        wrapT?: TextureWrapMode;
    }
    interface IScene extends IChildRootProperty {
        nodes: number[];
    }
    interface ISkin extends IChildRootProperty {
        inverseBindMatrices?: number;
        skeleton?: number;
        joints: number[];
    }
    interface ITexture extends IChildRootProperty {
        sampler?: number;
        source: number;
    }
    interface ITextureInfo extends IProperty {
        index: number;
        texCoord?: number;
    }
    interface IGLTF extends IProperty {
        accessors?: IAccessor[];
        animations?: IAnimation[];
        asset: IglTFAsset;
        buffers?: IBuffer[];
        bufferViews?: IBufferView[];
        cameras?: ICamera[];
        extensionsUsed?: string[];
        extensionsRequired?: string[];
        images?: IImage[];
        materials?: IMaterial[];
        meshes?: IMesh[];
        nodes?: INode[];
        samplers?: ISampler[];
        scene?: number;
        scenes?: IScene[];
        skins?: ISkin[];
        textures?: ITexture[];
    }
}
declare namespace web3d {
    class GLTFUtils {
        static GetByteStrideFromType(accessor: IAccessor): number;
    }
}
declare namespace web3d {
    interface IGlTFExtension {
        load(extensionNode: any, loader: LoadGlTF): Promise<any>;
    }
    class LoadGlTF implements IAssetLoader {
        private url;
        bundle: glTFBundle;
        private loadinfo;
        dependLoadInfos: AssetLoadInfo[];
        onProgress: (info: {
            loaded: number;
            total: number;
        }) => void;
        onFinish: (asset: IAsset, state: AssetLoadInfo) => void;
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress: (loadInfo: DownloadInfo) => void): IAsset;
        static ExtensionDic: {
            [type: string]: IGlTFExtension;
        };
        static regExtension(type: string, extension: IGlTFExtension): void;
        getExtensionData(node: IProperty, extendname: string): Promise<any>;
        private loadAsync;
        private loadglTFJson;
        private loadglTFBin;
        private relyOnTransTree;
        private expandNodeData;
        private addNodeparent;
        getNodePath(nodes: INode[], index: number): string[];
        private loadAnimations;
        private loadMeshNodes;
        private loadSkinNodes;
        loadDependAsset(url: string, onFinish?: (asset: IAsset, info: AssetLoadInfo) => void, type?: string): IAsset;
        executeOnprogress(): void;
    }
}
declare namespace web3d {
    class AccessorNode {
        view: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
        componentSize: number;
        componentType: number;
        byteStride: number;
        byteSize: number;
        count: number;
        data: any[];
    }
    class parseAccessorNode {
        static parse(index: number, loader: LoadGlTF): Promise<AccessorNode>;
        static GetTyedArryByLen(componentType: AccessorComponentType, Len: number): Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
        static GetTypedArry(componentType: AccessorComponentType, bufferview: ArrayBufferView, byteOffset: number, Len: number): Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
        private static getComponentSize;
        private static getByteSize;
        private static isInteger;
    }
}
declare namespace web3d {
    class ParseAnimationNode {
        static parse(index: number, loader: LoadGlTF): Promise<void>;
        private static parseChannelData;
    }
}
declare namespace web3d {
    class ParseBufferNode {
        static parse(index: number, loader: LoadGlTF): Promise<ArrayBuffer>;
    }
}
declare namespace web3d {
    class BufferviewNode {
        view: ArrayBufferView;
        byteStride?: number;
    }
    class ParseBufferViewNode {
        static parse(index: number, loader: LoadGlTF): Promise<BufferviewNode>;
    }
}
declare namespace web3d {
    class ParseCameraNode {
        static parse(index: number, bundle: glTFBundle): Transform;
    }
}
declare namespace web3d {
    class ParseMaterialNode {
        static parse(index: number, loader: LoadGlTF): Promise<Material | null>;
    }
}
declare namespace web3d {
    class ParseMeshNode {
        static parse(index: number, loader: LoadGlTF): Promise<PrimitiveNode[]>;
    }
}
declare namespace web3d {
    class ParseSceneNode {
        static parse(index: number, bundle: glTFBundle): Transform;
    }
}
declare namespace web3d {
    class SkinNode {
        jointIndexs: number[];
        inverseBindMat: MathD.mat4[];
    }
    class ParseSkinNode {
        static parse(index: number, loader: LoadGlTF): Promise<SkinNode>;
    }
}
declare namespace web3d {
    class ParseTextureNode {
        static parse(index: number, loader: LoadGlTF): Promise<Texture | null>;
    }
}
declare namespace web3d {
    interface IDracoCompressionConfiguration {
        decoder?: {
            wasmUrl?: string;
            wasmBinaryUrl?: string;
            fallbackUrl?: string;
        };
    }
    class DracoCompression {
        private static _DecoderModulePromise;
        static Configuration: IDracoCompressionConfiguration;
        static readonly DecoderAvailable: boolean;
        constructor();
        dispose(): void;
        decodeMeshAsync(data: ArrayBuffer | ArrayBufferView, attributes: {
            [kind: string]: number;
        }): Promise<Mesh>;
        private static _GetDecoderModule;
        private static _LoadScriptAsync;
        private static _LoadFileAsync;
    }
    interface IKHR_draco_mesh_compressionNode {
        bufferView: number;
        attributes: {
            [name: string]: number;
        };
    }
    class KHR_draco_mesh_compression implements IGlTFExtension {
        static extendName: string;
        private _dracoCompression;
        private readonly dracoCompression;
        load(extensionNode: IKHR_draco_mesh_compressionNode, loader: LoadGlTF): Promise<Mesh>;
    }
}
declare namespace web3d {
    interface IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress: (progress: {
            loaded: number;
            total: number;
        }) => void): IAsset;
    }
    class BundleInfo {
        name: string;
        url: string;
        mapNamed: {
            [resName: string]: string;
        };
        constructor(name: string, url: string);
    }
    class ABTreeParse {
        constructor(name: string, url: string);
        protected bundleInfo: BundleInfo;
        protected objDIC: {
            [id: number]: {
                json: any;
                obj: GameObject;
            };
        };
        protected tranDIC: {
            [id: number]: {
                json: any;
                obj: Transform;
            };
        };
        protected assetDIC: {
            [id: number]: {
                json: any;
                obj: IAsset | null;
            };
        };
        protected json: any;
        protected prefabNode: any;
        protected sceneNode: any;
        protected resDir: string;
        protected totalAssetTask: number;
        protected loadAllAsset(): void;
        protected deserialize(json: any): void;
        protected parseObjTree(): void;
        protected deserializeObj(json: any, obj: any, deltWithIdType: boolean): void;
    }
}
declare namespace web3d {
    class LoadAniclip implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress: (loadInfo: {
            loaded: number;
            total: number;
        }) => void): IAsset;
        private static Parse;
    }
}
declare namespace web3d {
    class LoadAssetBundle implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (loadInfo: DownloadInfo) => void): IAsset;
    }
}
declare namespace web3d {
    class LoadBin implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (loadInfo: DownloadInfo) => void): IAsset;
        private static Parse;
    }
}
declare namespace web3d {
    class LoadJson implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (info: DownloadInfo) => void): IAsset;
        private static Parse;
    }
}
declare namespace web3d {
    class RegexpUtil {
        static textureRegexp: RegExp;
        static vector4regexp: RegExp;
        static vector3regexp: RegExp;
        static vector2regexp: RegExp;
        static floatRegexp: RegExp;
        static rangeRegexp: RegExp;
        static vector4Regexp: RegExp;
        static vector3Regexp: RegExp;
        static vector2Regexp: RegExp;
        static vector3FloatOrRangeRegexp: RegExp;
    }
    class LoadMaterial implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (loadInfo: DownloadInfo) => void): IAsset;
        private static ParseMatUniform;
        private static Parse;
        private static loadDependAssets;
    }
}
declare namespace web3d {
    class LoadPrefab implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (loadInfo: DownloadInfo) => void): IAsset;
    }
    class PrefabTreeParse extends ABTreeParse {
        constructor(name: string, url: string);
        private parasePrefabData;
        loadABAsset(prefab: Prefab, abjson: any, resDir: string): void;
    }
}
declare namespace web3d {
    class LoadScene implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (loadInfo: DownloadInfo) => void): IAsset;
    }
    class SceneTreeParse extends ABTreeParse {
        private ParaseSceneData;
        loadABAsset(sceneinfo: SceneInfo, abjson: any, resDir: string, onFinish: () => void): void;
    }
}
declare namespace web3d {
    enum DrawTypeEnum {
        BASE = 0,
        SKIN = 1,
        LIGHTMAP = 2,
        FOG = 4,
        INSTANCe = 8,
        NOFOG = 3,
        NOLIGHTMAP = 5
    }
    class LoadShader implements IAssetLoader {
        private static drawtypeDic;
        constructor();
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, loadinfo: AssetLoadInfo) => void, onProgress?: (downLoadinfo: DownloadInfo) => void): IAsset;
        private static parse;
        private static parseProperties;
        private static ParseShaderPass;
        private static compileShaderPass;
        private static parseShaderState;
        private static getStencilFuc;
        private static getStencilOP;
        private static getblendfunc;
    }
}
declare namespace web3d {
    class LoadTextureSample implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void): Web3dAsset;
        private static parse;
    }
    class LoadTexture implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (downLoadinfo: DownloadInfo) => void): IAsset;
        private static parse;
        static getFromDesJson(json: any): webGraph.TextureOption;
    }
}
declare namespace web3d {
    class LoadTxt implements IAssetLoader {
        load(url: string, state: AssetLoadInfo, onFinish: (asset: IAsset, state: AssetLoadInfo) => void, onProgress?: (info: DownloadInfo) => void): IAsset;
        private static Parse;
    }
}
declare namespace web3d {
    class SceneInfo extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        root: Transform | null;
        useLightmap: boolean;
        lightMap: Texture[];
        useFog: boolean;
        fog: FogInfo | null;
        instantiate(): Transform | null;
        dispose(): void;
    }
    class FogInfo {
        color: MathD.color;
        near: number;
        far: number;
    }
}
declare namespace web3d {
    class Aniclip extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        dispose(): void;
        static readonly maxBone: number;
        static readonly perBoneDataLen: number;
        fps: number;
        beLoop: boolean;
        frames: Frame[] | null;
        bones: {
            [name: string]: number;
        };
    }
    class Frame {
        bonesMixMat: Float32Array;
    }
}
declare namespace web3d {
    class AnimationClip extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        dispose(): void;
        static enableScaleAnimation: boolean;
        static readonly maxBone: number;
        static readonly perBoneDataLen: 16 | 8;
        static readonly FPS: number;
        beLoop: boolean;
        channels: AnimationCurve[];
        totalFrame: number;
    }
    interface IAnimationKey {
        frame: number;
        value: any;
    }
    class AnimationCurve {
        path: string[];
        propertyName: string;
        startFrame: number;
        endFrame: number;
        keys: number[];
        value: any[];
        interPolationType: AnimationInterpolationEnum;
        lerpFunc: (from: any, to: any, lerp: any, trans: Transform) => void;
        addKey(keyframe: number, value: any): void;
    }
    enum AnimationInterpolationEnum {
        LINEAR = "LINEAR",
        STEP = "STEP",
        CUBICSPLINE = "CUBICSPLINE"
    }
}
declare namespace web3d {
    class BinAsset extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        content: ArrayBuffer | null;
        dispose(): void;
    }
}
declare namespace web3d {
    class CubeTexture extends Web3dAsset implements ITextrue {
        width: number;
        height: number;
        constructor(assetName?: string | null, url?: string | null, bedef?: boolean);
        glTexture: webGraph.CubeTex;
        private _tex2dItems;
        private beDefRef;
        groupCubeTexture(urlArr: string[]): void;
        private groupTexture;
        private currentLevel;
        groupMipmapCubeTexture(urlArr: string[], mipmaplevel: number, maxLevel: number): void;
        private loadImage;
        dispose(): void;
    }
}
declare namespace web3d {
    class JsonAsset extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        content: JSON | null;
        dispose(): void;
    }
}
declare namespace web3d {
    class Material extends Web3dAsset {
        private static assetDic;
        constructor(name?: string | null, url?: string | null, bedef?: boolean);
        private shader;
        readonly layer: RenderLayerEnum;
        queue: number;
        UniformDic: {
            [id: string]: any;
        };
        uniformDirty: boolean;
        uniformDirtyArr: {
            [id: string]: any;
        };
        private markUniformDirty;
        setShader(shader: Shader): void;
        getShader(): Shader;
        getShaderPass(drawtype: DrawTypeEnum): ShaderPass;
        setInt(id: string, _int: number): void;
        setFloat(id: string, _number: number): void;
        setFloatv(id: string, _numbers: Float32Array): void;
        setVector2(id: string, _vector2: MathD.vec2): void;
        setVector3(id: string, _vector3: MathD.vec3): void;
        setVector4(id: string, _vector4: MathD.vec4): void;
        setColor(id: string, _vector4: MathD.color): void;
        setVector4v(id: string, _vector4v: Float32Array): void;
        setMatrix(id: string, _matrix: MathD.mat4): void;
        setMatrixv(id: string, _matrixv: Float32Array): void;
        setTexture(id: string, _texture: ITextrue): void;
        setCubeTexture(id: string, _texture: CubeTexture): void;
        dispose(): void;
        beActiveInstance: boolean;
        ToggleInstance(state?: boolean): void;
    }
}
declare namespace web3d {
    class Mesh extends Web3dAsset {
        constructor(name?: string | null, url?: string | null, bedef?: boolean);
        glMesh: GlMesh | null;
        dataType: webGraph.RenderModelEnum;
        vertexAttData: {
            [attType: string]: vertexAttInfo;
        };
        trisindex: Uint16Array | Uint32Array;
        submeshs: subMeshInfo[];
        getVertexData(type: webGraph.VertexAttTypeEnum): vertexAttInfo | null;
        setVertexAttData(type: webGraph.VertexAttTypeEnum, arr: Array<number> | Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array, attInfo?: webGraph.IAttinfo): void;
        createVbowithAtts(): void;
        refreshMeshVboWithAtt(type: webGraph.VertexAttTypeEnum, vbodata: Float32Array): void;
        setInterleavedVertexData(vbodata: Float32Array, attInfo?: IVboAttInfo[]): void;
        refreshInterleavedMeshVbo(vbodata: Float32Array): void;
        setIndexData(arr: Array<number> | Uint16Array | Uint32Array): void;
        refreshMeshebo(ebodata: Uint16Array): void;
        getIndexData(): Uint16Array | Uint32Array;
        private _boundingAABB;
        getBoudingBox(): AABB;
        private _boundingSphere;
        getBoundingSphere(): BoundingSphere;
        dispose(): void;
    }
    class subMeshInfo {
        start: number;
        size: number;
        beUseEbo: boolean;
        renderType: webGraph.PrimitiveRenderEnum;
    }
    interface IVboAttInfo {
        attName: webGraph.VertexAttTypeEnum;
        offsetInBytes: number;
        strideInBytes: number;
    }
    class vertexAttInfo implements webGraph.IAttinfo {
        componentSize: number;
        componentDataType: number;
        normalize: boolean;
        type: webGraph.VertexAttTypeEnum;
        view: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array;
        byteSize: number;
        viewByteStride?: number;
        readonly data: any[];
        readonly count: number;
        constructor(type: webGraph.VertexAttTypeEnum, view: Float32Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array, attInfo?: webGraph.IAttinfo);
    }
}
declare namespace web3d {
    class Prefab extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        root: Transform | null;
        instantiate(): Transform | null;
        dispose(): void;
    }
}
declare namespace web3d {
    class Shader extends Web3dAsset {
        constructor(name?: string | null, url?: string | null, bedef?: boolean);
        dispose(): void;
        passes: {
            [id: number]: ShaderPass;
        };
        mapUniformDef: {
            [key: string]: {
                type: webGraph.UniformTypeEnum;
                value: any;
            };
        };
        layer: RenderLayerEnum;
        getPass(drawtype: number): ShaderPass;
    }
}
declare namespace web3d {
    class TextAsset extends Web3dAsset {
        constructor(name?: string | null, url?: string | null);
        content: string | null;
        dispose(): void;
    }
}
declare namespace web3d {
    class Texture extends Web3dAsset implements ITextrue {
        imageData: Uint8Array | HTMLImageElement | HTMLCanvasElement;
        width: number;
        height: number;
        samplerInfo: webGraph.TextureOption;
        constructor(assetName?: string | null, url?: string | null, bedef?: boolean);
        glTexture: webGraph.Texture2D;
        applyToGLTarget(): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class Text3d implements IRender {
        static type: string;
        layer: RenderLayerEnum;
        queue: number;
        mask: CullingMask;
        materials: Material[];
        BeRenderable(): boolean;
        BeInstantiable(): boolean;
        gameObject: GameObject;
        fontSize: number;
        fontOffset: number;
        private _textContent;
        private _textWidth;
        textContent: string;
        private textMesh;
        private refreshMeshData;
        private posArr;
        private uvArr;
        private indexArr;
        private addQuad;
        Start(): void;
        Update(): void;
        private viewPos;
        private ndcPos;
        Render(): void;
        Dispose(): void;
        Clone(): void;
        private _boundingSphere;
        readonly bouningSphere: BoundingSphere;
    }
    class charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
    }
    class DynamicFont {
        private static _inc;
        static readonly Inc: DynamicFont;
        static charFromText: string;
        static newChar: string;
        private contex2d;
        static fontTex: Texture;
        texSize: number;
        fontsize: number;
        private cmap;
        private constructor();
        checkText(str: string): void;
        getCharInfo(key: string): charinfo;
        private xAddvance;
        private yAddvance;
        private adddNewChar;
    }
}
declare namespace web3d {
    class Boxcollider implements INodeComponent {
        static readonly type: string;
        gameObject: GameObject;
        private aabb;
        private colliderObj;
        private colliderMesh;
        private dirty;
        private _center;
        center: MathD.vec3;
        private _size;
        size: MathD.vec3;
        private _visible;
        visible: boolean;
        Start(): void;
        Update(): void;
        updateAABB(): void;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    enum ProjectionEnum {
        perspective = 0,
        orthograph = 1
    }
    class Camera implements INodeComponent {
        static readonly type: string;
        static Current: Camera;
        static Main: Camera;
        constructor();
        gameObject: GameObject;
        private _near;
        near: number;
        private _far;
        far: number;
        private _beMainCamera;
        beMainCamera: boolean;
        order: number;
        clearOption_Color: boolean;
        clearOption_Depth: boolean;
        clearOption_Stencil: boolean;
        backgroundColor: MathD.color;
        dePthValue: number;
        stencilValue: number;
        cullingMask: CullingMask;
        viewport: MathD.Rect;
        projectionType: ProjectionEnum;
        fov: number;
        aspest: number;
        size: number;
        postEffectQueue: IPostEffect[];
        frustum: Frustum;
        addPostEffect(eff: IPostEffect): void;
        clearPostEffect(): void;
        Start(): void;
        Update(): void;
        viewPort(rendertarget?: RenderTexture): void;
        clear(): void;
        private _viewMatrix;
        readonly ViewMatrix: MathD.mat4;
        private _Projectmatrix;
        readonly ProjectMatrix: MathD.mat4;
        private _viewProjectMatrix;
        readonly ViewProjectMatrix: MathD.mat4;
        private restToDirty;
        private needComputeViewMat;
        private needcomputeProjectMat;
        private needcomputeViewProjectMat;
        screenToWorldPoint(screenPos: MathD.vec3, outWorldPos: MathD.vec3): void;
        worldToScreenpos(worldPos: MathD.vec3, outScreenPos: MathD.vec2): void;
        calcWindowPosFromWorldPos(worldPos: MathD.vec3, outDocument: MathD.vec2): void;
        screenPointToRay(screenpos: MathD.vec2): Ray;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class CameraController implements INodeComponent {
        static type: string;
        Start(): void;
        Clone(): void;
        gameObject: GameObject;
        moveSpeed: number;
        movemul: number;
        wheelSpeed: number;
        rotateSpeed: number;
        keyMap: {
            [id: number]: boolean;
        };
        beRightClick: boolean;
        Update(): void;
        rotAngle: MathD.vec3;
        active(): void;
        private inverseDir;
        private moveVector;
        doMove(delta: number): void;
        private camrot;
        doRotate(rotateX: number, rotateY: number): void;
        private doMouseWheel;
        Dispose(): void;
    }
}
declare namespace web3d {
    enum LightTypeEnum {
        Direction = 0,
        Point = 1,
        Spot = 2
    }
    class Light implements INodeComponent {
        static type: string;
        gameObject: GameObject;
        type: LightTypeEnum;
        spotAngelCos: number;
        Start(): void;
        Update(): void;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class MeshFilter implements INodeComponent {
        static type: string;
        gameObject: GameObject;
        Start(): void;
        Update(): void;
        mesh: Mesh;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class MeshRender implements IRender {
        static type: string;
        mask: CullingMask;
        gameObject: GameObject;
        private _layer;
        readonly layer: RenderLayerEnum;
        private _queue;
        readonly queue: number;
        materials: Material[];
        material: Material | Material[];
        lightmapIndex: number;
        lightmapTilingOffset: MathD.vec4;
        private localDrawType;
        Start(): void;
        Update(): void;
        Render(): void;
        BeInstantiable(): boolean;
        BeRenderable(): boolean;
        readonly bouningSphere: BoundingSphere;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class Text3dHtml implements INodeComponent {
        static type: string;
        gameObject: GameObject;
        private textNode;
        private _textContent;
        textContent: string;
        Start(): void;
        private windowPos;
        Update(): void;
        Dispose(): void;
        Clone(): void;
        static creatTextDiv(): Text;
    }
}
declare namespace web3d {
    enum PlayStateEnum {
        Play = 0,
        Stop = 1,
        Pause = 2
    }
    class LastClipData {
        Aniclip: Aniclip;
        lerpStartFrame: number;
        restFrame: number;
        constructor(Aniclip: Aniclip, curFrame: number);
    }
    const compSimpleAnimator: string;
    class SimpleAnimator implements INodeComponent {
        static type: string;
        gameObject: GameObject;
        Aniclips: Aniclip[];
        private lastclipData;
        curAniclip: Aniclip;
        playRate: number;
        FPS: number;
        clipFrame: Frame;
        autoPlay: boolean;
        Start(): void;
        Update(): void;
        Dispose(): void;
        Clone(): void;
        private timer;
        private curFrame;
        private PlayState;
        private enableTimeFlow;
        private beMixed;
        playAniclipByIndex(index: number): void;
        play(clip: Aniclip, mixTime?: number, mix?: boolean, speed?: number): void;
        pause(): void;
        stop(): void;
        private reset;
        private mixrot;
        private mixpos;
        private temrot;
        private tempos;
        private temLastRot;
        private temLastpos;
        RefreshSkinBoneData(bonesname: string[], bonesRotPos: Float32Array): void;
    }
}
declare namespace web3d {
    class SimpleSkinMeshRender implements IRender {
        static type: string;
        gameObject: GameObject;
        mask: CullingMask;
        layer: RenderLayerEnum;
        queue: number;
        materials: Material[];
        material: Material | Material[];
        mesh: Mesh;
        bones: Transform[];
        bonesname: string[];
        bindPlayer: SimpleAnimator;
        private bonesRotPos;
        inverseBindmatrixs: MathD.mat4[];
        Start(): void;
        Update(): void;
        Render(): void;
        BeRenderable(): boolean;
        BeInstantiable(): boolean;
        Dispose(): void;
        Clone(): void;
        readonly bouningSphere: BoundingSphere;
    }
}
declare namespace web3d {
    class Animation implements INodeComponent {
        static type: string;
        gameObject: GameObject;
        beAutoPlay: boolean;
        private animations;
        private animationDic;
        addClip(newAnimation: AnimationClip): void;
        playAnimationByName(name: string, timeScale?: number): void;
        setFrame(name: string, frame: number): void;
        curAni: AnimationClip;
        timer: number;
        private lastFrame;
        private curFrame;
        private playRate;
        private PlayState;
        private enableTimeFlow;
        private beMixed;
        play(animation: AnimationClip, timeScale?: number): void;
        private timerInit;
        Start(): void;
        private pathDic;
        Update(): void;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class SkinMeshRender implements IRender {
        static type: string;
        gameObject: GameObject;
        mask: CullingMask;
        layer: RenderLayerEnum;
        queue: number;
        materials: Material[];
        material: Material | Material[];
        mesh: Mesh;
        joints: Transform[];
        bindPlayer: Animation;
        private realjointMatrixData;
        private jointMatrixs;
        bindPoses: MathD.mat4[];
        Start(): void;
        Update(): void;
        Render(): void;
        BeRenderable(): boolean;
        readonly bouningSphere: BoundingSphere;
        BeInstantiable(): boolean;
        Dispose(): void;
        Clone(): void;
    }
}
declare namespace web3d {
    class EffectLayer {
        active: boolean;
        effect: EffectSystem;
        type: F14TypeEnum;
        frameList: number[];
        frames: {
            [index: number]: F14Frame;
        };
        Attlines: {
            [name: string]: F14AttTimeLine;
        };
        baseData: ElementData;
        element: LayerElement;
        constructor(effect: EffectSystem, data: F14LayerData);
        addFrame(framedata: F14FrameData): F14Frame;
        removeFrame(frameIndex: number): void;
        setFrameData(index: number, attname: string, value: any): void;
        removeFrameData(index: number, attname: string): void;
        getLineValue(index: number, attname: string, out: any): void;
        private setAttLineData;
        private removeAttLineData;
        render(): void;
        dispose(): void;
    }
    class F14Frame {
        attDic: {
            [name: string]: any;
        };
        constructor(data: F14FrameData);
        setdata(name: string, value: any): void;
        removedata(name: string): void;
        getdata(name: string): any;
    }
    class F14AttTimeLine {
        private attName;
        private frameList;
        private line;
        private lerpFunc;
        private cloneFunc;
        constructor(name: string, lerpfunc: (from: any, to: any, lerp: any, out: any) => void, clonefunc: (from: any, to: any) => void);
        addNode(frame: number, _value: any): void;
        remove(frame: number): void;
        getValue(frame: number, basedate: ElementData, out: any): void;
    }
    class NumberDic<T> {
        private keys;
        private map;
        add(key: number, value: T): void;
        remove(key: number): void;
        getKeys(): number[];
        getFirstKey(): number | null;
        getEndKey(): number | null;
        getValue(key: number): T;
        containsKey(key: number): boolean;
        foreach(fuc: (_key: number, _value: any) => void): void;
    }
}
declare namespace web3d {
    interface EffectSystem {
        layers: EffectLayer[];
        delayTime: number;
        setData(data: F14EffectData): any;
    }
    class EffectSystem implements IRender {
        static readonly ClassName: string;
        materials: Material[];
        gameObject: GameObject;
        layer: RenderLayerEnum;
        mask: CullingMask;
        queue: number;
        delayTime: number;
        private fps;
        data: F14EffectData;
        layers: EffectLayer[];
        private elements;
        private allTime;
        private totalTime;
        private loopCount;
        private totalFrame;
        onceFrame: number;
        private renderActive;
        mvpMat: MathD.mat4;
        Start(): void;
        Update(): void;
        private OnEndOnceLoop;
        renderCamera: Camera;
        Render(): void;
        BeRenderable(): boolean;
        BeInstantiable(): boolean;
        Clone(): void;
        Dispose(): void;
        private addF14layer;
        private playRate;
        private playState;
        private enabletimeFlow;
        private enableDraw;
        private onFinish;
        private OnPlayEnd;
        play(PlayRate?: number, onFinish?: () => void): void;
        stop(): void;
        pause(): void;
        private reset;
        readonly bouningSphere: BoundingSphere;
    }
}
declare namespace web3d {
    enum F14TypeEnum {
        SingleMeshType = 0,
        particlesType = 1,
        RefType = 2
    }
    interface LayerElement {
        type: F14TypeEnum;
        update(deltaTime: number, frame: number, fps: number): any;
        Render(): any;
        dispose(): any;
        reset(): any;
        OnEndOnceLoop(): any;
        layer: EffectLayer;
        drawActive: boolean;
    }
}
declare namespace web3d {
    class EffectDataParser {
        static JsonToData(json: any, assetbundle: string): F14EffectData;
        static jsonToLayerData(json: any, assetbundle: string): F14LayerData;
        static jsonToSingleMeshData(json: any, assetbundle: string): SingleMeshBaseData;
        static jsonToParticleData(json: any, assetbundle: string): F14EmissionBaseData;
        static jsonToRefBaseData(json: any, assetbundle: string): F14RefBaseData;
    }
}
declare namespace web3d {
    class F14EffectData {
        beloop: boolean;
        lifeTime: number;
        layers: F14LayerData[];
    }
    class F14LayerData {
        Name: string;
        type: F14TypeEnum;
        elementdata: ElementData;
        frames: {
            [frame: number]: F14FrameData;
        };
    }
    class F14FrameData {
        frameindex: number;
        singlemeshAttDic: {
            [name: string]: any;
        };
        EmissionData: F14EmissionBaseData;
        constructor(index: number, type: F14TypeEnum);
    }
}
declare namespace web3d {
    interface ElementData {
    }
}
declare namespace web3d {
    class F14EmissionBaseData implements ElementData {
        loopenum: LoopEnum;
        mesh: Mesh;
        material: Material;
        rotPosition: MathD.vec3;
        rotScale: MathD.vec3;
        rotEuler: MathD.vec3;
        rendermodel: RenderModelEnum;
        beloop: boolean;
        lifeTime: NumberData;
        simulateInLocalSpace: boolean;
        startScaleRate: NumberData;
        startScale: Vector3Data;
        startEuler: Vector3Data;
        startColor: Vector3Data;
        startAlpha: NumberData;
        colorRate: number;
        simulationSpeed: NumberData;
        start_tex_st: MathD.vec4;
        delayTime: number;
        duration: number;
        rateOverTime: NumberData;
        bursts: busrtInfo[];
        shapeType: ParticleSystemShape;
        width: number;
        height: number;
        depth: number;
        radius: number;
        angle: number;
        emitFrom: emitfromenum;
        enableVelocityOverLifetime: boolean;
        moveSpeed: Vector3Data;
        enableSizeOverLifetime: boolean;
        sizeNodes: NumberKey[];
        enableRotOverLifeTime: boolean;
        angleSpeed: NumberData;
        enableColorOverLifetime: boolean;
        colorNodes: Vector3Key[];
        alphaNodes: NumberKey[];
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        uSpeed: number;
        vSpeed: number;
        row: number;
        column: number;
        count: number;
        static getRandomDirAndPosByZEmission(emission: F14EmissionBaseData, outDir: MathD.vec3, outPos: MathD.vec3): void;
    }
    class busrtInfo {
        time: number;
        count: NumberData;
        static CreatformJson(json: any): busrtInfo;
    }
    enum ParticleSystemShape {
        NORMAL = 0,
        BOX = 1,
        SPHERE = 2,
        HEMISPHERE = 3,
        CONE = 4,
        EDGE = 5,
        CIRCLE = 6
    }
    enum RenderModelEnum {
        None = 0,
        BillBoard = 1,
        StretchedBillBoard = 2,
        HorizontalBillBoard = 3,
        VerticalBillBoard = 4,
        Mesh = 5
    }
    enum emitfromenum {
        base = 0,
        volume = 1
    }
}
declare namespace web3d {
    class NumberData {
        isRandom: boolean;
        _value: number;
        _valueLimitMin: number;
        _valueLimitMax: number;
        beInited: boolean;
        key: number;
        setValue(value: number): void;
        setRandomValue(max: number, min: number): void;
        getValue(reRandom?: boolean): number;
        constructor(value?: number);
        static copyto(from: NumberData, to: NumberData): void;
        static FormJson(json: string, data: NumberData): void;
    }
    class Vector3Data {
        x: NumberData;
        y: NumberData;
        z: NumberData;
        constructor(x?: number, y?: number, z?: number);
        getValue(reRandom?: boolean): MathD.vec3;
        static copyto(from: Vector3Data, to: Vector3Data): void;
        static FormJson(json: string, data: Vector3Data): void;
    }
    class NumberKey {
        key: number;
        value: number;
        constructor(_key: number, _value: number);
    }
    class Vector3Key {
        key: number;
        value: MathD.vec3;
        constructor(_key: number, _value: MathD.vec3);
    }
    class Vector2Key {
        key: number;
        value: MathD.vec2;
        constructor(_key: number, _value: MathD.vec2);
    }
}
declare namespace web3d {
    class F14RefBaseData implements ElementData {
        beLoop: boolean;
        refdataName: string;
        refData: F14EffectData;
        localPos: MathD.vec3;
        localEuler: MathD.vec3;
        localScale: MathD.vec3;
    }
}
declare namespace web3d {
    enum LoopEnum {
        Restart = 0,
        TimeContinue = 1
    }
    enum UVTypeEnum {
        NONE = 0,
        UVRoll = 1,
        UVSprite = 2
    }
    enum BindAxis {
        X = 0,
        Y = 1,
        NONE = 2
    }
    class SingleMeshBaseData implements ElementData {
        loopenum: LoopEnum;
        mesh: Mesh;
        material: Material;
        position: MathD.vec3;
        scale: MathD.vec3;
        euler: MathD.vec3;
        color: MathD.color;
        tex_ST: MathD.vec4;
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        uSpeed: number;
        vSpeed: number;
        row: number;
        column: number;
        count: number;
        beBillboard: boolean;
        bindAxis: BindAxis;
    }
}
declare namespace web3d {
    class F14Emission implements LayerElement {
        type: F14TypeEnum;
        layer: EffectLayer;
        drawActive: boolean;
        effect: EffectSystem;
        baseddata: F14EmissionBaseData;
        particlelist: F14Particle[];
        deadParticles: F14Particle[];
        batch: F14EmissionBatch;
        private TotalTime;
        curTime: number;
        private beover;
        private numcount;
        localMatrix: MathD.mat4;
        private _worldMatrix;
        private localrot;
        private worldRot;
        vertexCount: number;
        dataforvboLen: number;
        dataforeboLen: number;
        meshebo: Uint16Array | Uint32Array;
        colorArr: MathD.color[];
        posArr: MathD.vec3[];
        uvArr: MathD.vec2[];
        constructor(effect: EffectSystem, layer: EffectLayer);
        update(deltaTime: number, frame: number, fps: number): void;
        Render(): void;
        private initByBasedata;
        getWorldMatrix(): MathD.mat4;
        getWorldRotation(): MathD.quat;
        private updateLife;
        private reInit;
        private burstedIndex;
        private updateEmission;
        private addParticle;
        reset(): void;
        getMaxParticleCount(): number;
        OnEndOnceLoop(): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class F14EmissionBatch {
        type: F14TypeEnum;
        effect: EffectSystem;
        emission: F14Emission;
        private mesh;
        private mat;
        curParticleCount: number;
        curRealVboLen: number;
        curVertexcount: number;
        curIndexCount: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        vertexLength: number;
        constructor(effect: EffectSystem, element: F14Emission);
        render(effectqueue: number): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class F14Particle {
        private data;
        private element;
        private totalLife;
        private startScaleRate;
        private startScale;
        Starteuler: MathD.vec3;
        StartPos: MathD.vec3;
        startColor: MathD.vec3;
        startAlpha: number;
        colorRate: number;
        private simulationSpeed;
        private simulateInLocalSpace;
        private starTex_ST;
        private speedDir;
        enableVelocityOverLifetime: boolean;
        private movespeed;
        enableSizeOverLifetime: boolean;
        private sizeNodes;
        enableRotOverLifeTime: boolean;
        eulerSpeed: number;
        enableColorOverLifetime: boolean;
        private colorNodes;
        private alphaNodes;
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        tex_ST: MathD.vec4;
        rotationByEuler: MathD.quat;
        rotationByShape: MathD.quat;
        startRotation: MathD.quat;
        rotAngle: number;
        localMatrix: Float32Array;
        localTranslate: MathD.vec3;
        localRotation: MathD.quat;
        localScale: MathD.vec3;
        color: MathD.vec3;
        alpha: number;
        private Color;
        private curLife;
        private life01;
        actived: boolean;
        private emissionMatToWorld;
        private emissionWorldRotation;
        private getEmissionMatToWorld;
        private getemissionWorldRotation;
        constructor(element: F14Emission, data: F14EmissionBaseData);
        initByEmissionData(data: F14EmissionBaseData): void;
        update(deltaTime: number): void;
        private tempos;
        private temcolor;
        private temUv;
        uploadMeshdata(): void;
        private transformVertex;
        private updateLocalMatrix;
        private updatePos;
        private updateSize;
        private updateEuler;
        private angleRot;
        private worldpos;
        private tarWorldpos;
        private worldspeeddir;
        private lookDir;
        private temptx;
        private worldRotation;
        private invParWorldRot;
        private worldStartPos;
        private updateRot;
        private updateColor;
        private updateUV;
        getCurTex_ST(data: F14EmissionBaseData): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class SingleMesh implements LayerElement {
        drawActive: boolean;
        type: F14TypeEnum;
        layer: EffectLayer;
        private effect;
        position: MathD.vec3;
        scale: MathD.vec3;
        euler: MathD.vec3;
        color: MathD.color;
        tex_ST: MathD.vec4;
        baseddata: SingleMeshBaseData;
        private localRotate;
        startFrame: number;
        endFrame: number;
        constructor(effect: EffectSystem, layer: EffectLayer);
        update(deltaTime: number, frame: number, fps: number): void;
        Render(): void;
        OnEndOnceLoop(): void;
        targetMat: MathD.mat4;
        refreshTargetMatrix(): void;
        refreshCurTex_ST(curframe: number, detalTime: number, fps: number): void;
        private eulerRot;
        private worldpos;
        private worldRot;
        private inverseRot;
        private lookDir;
        private worldDirx;
        private worldDiry;
        updateRotByBillboard(): void;
        reset(): void;
        dispose(): void;
    }
}
declare namespace web3d {
    class SpringBone implements INodeComponent {
        gameObject: GameObject;
        child: Transform;
        boneAxis: MathD.vec3;
        radius: number;
        stiffnessForce: number;
        dragForce: number;
        springForce: MathD.vec3;
        colliders: SpringCollider[];
        debug: boolean;
        private springLength;
        private localRotation;
        private trs;
        private currTipPos;
        private prevTipPos;
        Start(): void;
        Update(): void;
        private force;
        private stiffForcee;
        private dragForcee;
        UpdateSpring(): void;
        Clone(): void;
        Dispose(): void;
    }
}
declare namespace web3d {
    class SpringCollider implements INodeComponent {
        gameObject: GameObject;
        radius: number;
        Start(): void;
        Update(): void;
        Clone(): void;
        Dispose(): void;
    }
}
declare namespace web3d {
    class SpringManager implements INodeComponent {
        gameObject: GameObject;
        springBones: SpringBone[];
        private springcolliders;
        Start(): void;
        Update(): void;
        Clone(): void;
        Dispose(): void;
        private LateUpdate;
        enablewind: boolean;
        windspeed: number;
        private SpringForce;
        private randomWind;
    }
}
declare namespace web3d {
    class Input {
        static mousePosition: MathD.vec2;
        static init(): void;
        static getKeyDown(key: KeyCodeEnum): boolean;
        static getMouseDown(key: MouseKeyEnum): boolean;
        static addMouseEventListener(eventType: MouseEventEnum, func: (ev: ClickEvent) => void, key?: MouseKeyEnum): void;
        static addKeyCodeEventListener(eventType: KeyCodeEventEnum, func: (ev: KeyboardEvent) => void, key?: KeyCodeEnum): void;
    }
}
declare namespace web3d {
    enum KeyCodeEnum {
        A = "A",
        B = "B",
        C = "C",
        D = "D",
        E = "E",
        F = "F",
        G = "G",
        H = "H",
        I = "I",
        J = "J",
        K = "K",
        L = "L",
        M = "M",
        N = "N",
        O = "O",
        P = "P",
        Q = "Q",
        R = "R",
        S = "S",
        T = "T",
        U = "U",
        V = "V",
        W = "W",
        X = "X",
        Y = "Y",
        Z = "Z",
        SPACE = " ",
        ESC = "ESC"
    }
    enum KeyCodeEventEnum {
        Up = "KeyUp",
        Down = "KeyDown"
    }
    class Keyboard {
        private static readonly KeyCodeDic;
        static StateInfo: {
            [key: string]: boolean;
        };
        static KeyEvent: {
            [key: string]: {
                [evetType: string]: Function[];
            };
        };
        static anyKeyEvent: {
            [evetType: string]: Function[];
        };
        private static keyDic;
        static init(): void;
        private static OnKeyDown;
        private static OnKeyUp;
        private static executeKeyboardEvent;
        private static excuteAnyKeyEvent;
        private static initKeyCodeMap;
    }
}
declare namespace web3d {
    enum MouseKeyEnum {
        Left = "MouseLeft",
        Middle = "MouseMiddle",
        Right = "MouseRight",
        None = "MouseNone"
    }
    enum MouseEventEnum {
        Up = "mouseUp",
        Down = "mouseDown",
        Move = "mouseMove",
        Rotate = "mouseRotate"
    }
    class ClickEvent {
        pointx: number;
        pointy: number;
        rotateDelta?: number;
        movementX: number;
        movementY: number;
    }
    class Mouse {
        static StateInfo: {
            [key: number]: boolean;
        };
        static MouseEvent: {
            [key: string]: {
                [type: number]: Function[];
            };
        };
        private static readonly keyDic;
        static init(): void;
        private static executeMouseEvent;
        private static getClickEventByMouseEvent;
    }
}
declare namespace web3d {
    class binBuffer {
        _buf: Uint8Array[];
        private _seekWritePos;
        private _seekWriteIndex;
        private _seekReadPos;
        private _bufSize;
        getLength(): number;
        getBufLength(): number;
        getBytesAvailable(): number;
        constructor(bufSize?: number);
        reset(): void;
        dispose(): void;
        read(target: Uint8Array | number[], offset?: number, length?: number): void;
        write(array: Uint8Array | number[], offset?: number, length?: number): void;
        getBuffer(): Uint8Array;
        getUint8Array(): Uint8Array;
    }
    class converter {
        static getApplyFun(value: any): any;
        private static dataView;
        static ULongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static LongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float64ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint32toArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static StringToUtf8Array(str: string): Uint8Array | number[];
        static ArrayToLong(buf: Uint8Array, offset?: number): number;
        static ArrayToULong(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat64(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt16(buf: Uint8Array, offset?: number): number;
        static ArrayToInt8(buf: Uint8Array, offset?: number): number;
        static ArraytoUint32(buf: Uint8Array, offset?: number): number;
        static ArrayToUint16(buf: Uint8Array, offset?: number): number;
        static ArrayToUint8(buf: Uint8Array, offset?: number): number;
        static ArrayToString(buf: Uint8Array, offset?: number): string;
    }
    class binTool extends binBuffer {
        readSingle(): number;
        readLong(): number;
        readULong(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
        readBytes(length: number): Uint8Array;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readUTFBytes(length: number): string;
        readStringAnsi(): string;
        readonly length: number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeLong(num: number): void;
        writeULong(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        writeStringUtf8DataOnly(str: string): void;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace web3d {
    function stringToBlob(content: string): Blob;
    function stringToUtf8Array(str: string): number[];
}
declare namespace web3d {
    class DownloadInfo {
        loaded: number;
        total: number;
    }
    enum LoadStateEnum {
        Loading = 0,
        Finish = 1,
        Failed = 2
    }
    enum ResponseTypeEnum {
        text = "text",
        json = "json",
        blob = "blob",
        arraybuffer = "arraybuffer"
    }
    function LoadScript(scriptUrl: string, onFinish: (_err: Error | null) => void): void;
    function loadJson(url: string, onFinish: (_json: JSON | null, _err: Error | null) => void, onProgress?: (info: DownloadInfo) => void): DownloadInfo;
    function loadText(url: string, onFinish: (_txt: string | null, _err: Error | null) => void, onProgress?: (info: DownloadInfo) => void): DownloadInfo;
    function loadArrayBuffer(url: string, onFinish: (_bin: ArrayBuffer | null, _err: Error | null) => void, onProgress?: (info: DownloadInfo) => void): DownloadInfo;
    function loadBlob(url: string, onFinish: (_blob: Blob | null, _err: Error | null) => void, onProgress?: (info: DownloadInfo) => void): DownloadInfo;
    function loadImg(input: string | ArrayBuffer | Blob, fun: (_tex: HTMLImageElement | null, _err: Error | null) => void, onProgress?: (info: DownloadInfo) => void): DownloadInfo;
}
declare namespace web3d {
    class binReader {
        private _data;
        private _arrayBuffer;
        constructor(buf: ArrayBuffer, seek?: number);
        private _byteOffset;
        seek(seek: number): void;
        peek(): number;
        getPosition(): number;
        getLength(): number;
        canread(): number;
        skipBytes(len: number): void;
        readString(): string;
        readStrLenAndContent(): string;
        private static _decodeBufferToText;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readUint8ArrToString(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUint32(): number;
        readUint8Array(length: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class binWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData;
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        readonly length: number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace web3d {
    class webworker {
        private worker;
        private static _inc;
        static readonly inc: webworker;
        private constructor();
        private workerLoad;
        Load(msg: any, onFinish?: (data: any) => void): void;
        private onMsg;
    }
    class WebWorkerTaskID {
        constructor();
        private static idAll;
        private static next;
        private id;
        getID(): number;
    }
}
declare namespace web3d {
    class PostEffectMgr {
        private static baseTex;
        private static _depthTex;
        static readonly depthTex: RenderTexture;
        private static tempt1;
        private static endmat;
        private static lastRenderTex;
        private static beInit;
        static render(effects: IPostEffect[]): void;
        static renderSceneTobaseTex(): void;
        static renderSceneToDepthTex(): void;
        static OnPostEffectEndRender(): void;
    }
    interface IPostEffect {
        renderTarget: RenderTexture;
        mat: Material;
        OnBeforeRender(srcTex: RenderTexture): any;
        OnRender(dstTex: RenderTexture): any;
    }
    class BassPostEffect implements IPostEffect {
        renderTarget: RenderTexture;
        mat: Material;
        OnBeforeRender(srcTex: RenderTexture): void;
        OnRender(dstTex: RenderTexture): void;
    }
}
declare namespace web3d {
    class Blur extends BassPostEffect implements IPostEffect {
        renderTarget: RenderTexture;
        constructor();
    }
}
declare namespace web3d {
    class Mosaic extends BassPostEffect implements IPostEffect {
        renderTarget: RenderTexture;
        constructor();
    }
}
declare namespace web3d {
    class ShaderPass {
        program: webGraph.ShaderProgram[];
    }
}
declare namespace web3d {
    class DynamicBatch {
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        curVertexCount: number;
        curVboLen: number;
        curEboLen: number;
        mat: Material;
        mesh: Mesh;
        constructor(mesh: Mesh, mat: Material);
    }
}
declare namespace web3d {
    class GlMesh implements webGraph.BaseMesh {
        submeshs: webGraph.IMeshInfo[];
        vertexCount: number;
        vertexByteSize: number;
        renderModel: number;
        perVertexSize: number;
        vbo: webGraph.VertexBuffer;
        ebo: webGraph.ElementBuffer;
        vaoDic: {
            [key: number]: webGraph.VAO;
        };
        VertexAttDic: {
            [attType: string]: webGraph.VertexAttribute;
        };
        declareVboWithAtts(vertexInfos: {
            [attType: string]: vertexAttInfo;
        }, model?: webGraph.RenderModelEnum): void;
        refreshVboWithAtt(att: vertexAttInfo): void;
        declareVboWithInterleavedData(vbodata: Float32Array, attInfo: IVboAttInfo[], model?: webGraph.RenderModelEnum): void;
        refreshVboWithInterleavedData(vbodata: Float32Array): void;
        declareEboWithData(ebodata: Uint16Array | Uint32Array): void;
        refreshEboWithData(ebodata: Uint16Array | Uint32Array): void;
        dispose(): void;
    }
}
declare namespace web3d {
    interface ITextrue {
        glTexture: WebGLTexture;
        width: number;
        height: number;
    }
    class RenderTexture implements ITextrue {
        width: number;
        height: number;
        glTexture: webGraph.Texture2D;
        fbo: webGraph.FrameBuffer;
        constructor(width: number, height: number);
    }
}
declare namespace web3d {
    class RenderContext {
        activeTexCount: number;
        viewPortPixel: MathD.Rect;
        campos: MathD.vec3;
        matrixModel: MathD.mat4;
        matrixNormalToworld: MathD.mat4;
        matrixModelView: MathD.mat4;
        matrixModelViewProject: MathD.mat4;
        matrixView: MathD.mat4;
        matrixProject: MathD.mat4;
        matrixViewProject: MathD.mat4;
        intLightCount: number;
        vec4LightPos: Float32Array;
        vec4LightDir: Float32Array;
        floatLightSpotAngleCos: Float32Array;
        lightmap: Texture[];
        curMat: Material;
        curPorgram: webGraph.ShaderProgram;
        curMesh: GlMesh;
        curRender: IRender;
        curCamera: Camera;
        lightmapIndex: number;
        lightmapTilingOffset: MathD.vec4;
        jointMatrixs: Float32Array;
        updateCamera(camera: Camera): void;
        updateOverlay(): void;
        updateModel(model: Transform): void;
        updateModeTrail(): void;
    }
}
declare namespace web3d {
    class Rendermgr {
        renderlistall: renderListAll;
        renderCameras: Camera[];
        renderLights: Light[];
        constructor();
        beforeRender(): void;
        renderScene(scen: Scene): void;
        private _fillRenderer;
        renderOnce(): void;
        globalDrawType: DrawTypeEnum;
        activeInstanceDrawType: boolean;
        private instanceCount;
        draw(mesh: Mesh, mat: Material, submesh: subMeshInfo, localDrawType: DrawTypeEnum): void;
        private InstanceMaxCount;
        private instanceDataInit;
        private realPosDataArr;
        private realRotDataArr;
        private realScaleDataArr;
        private posArr;
        private rotArr;
        private scaleArr;
        private posAtt;
        private rotAtt;
        private scaleAtt;
        private instanceRenderAll;
        bindMat(mat: Material, drawType: DrawTypeEnum, programIndex?: number): void;
        drawMeshNow(mesh: Mesh, submeshIndex: number): void;
    }
    enum RenderLayerEnum {
        Background = 1000,
        Geometry = 2000,
        AlphaTest = 2450,
        Transparent = 3000,
        Overlay = 4000
    }
    enum CullingMask {
        ui = 1,
        default = 2,
        editor = 4,
        model = 8,
        everything = 4294967295,
        nothing = 0,
        modelbeforeui = 8
    }
    interface IRender extends INodeComponent {
        layer: RenderLayerEnum;
        queue: number;
        mask: CullingMask;
        Render(): any;
        materials: Material[];
        BeRenderable(): boolean;
        BeInstantiable(): boolean;
        bouningSphere: BoundingSphere;
    }
    class renderListAll {
        private renderLists;
        private instanceList;
        constructor();
        clear(): void;
        addRenderer(renderer: IRender): void;
        renderAll(cam: Camera, instanceDraw: (cam: Camera, instanceList: {
            [matId: number]: IRender[];
        }) => void): void;
    }
    class RenderContainer {
        private layer;
        private queDic;
        private queArr;
        addRender(render: IRender): void;
        constructor(layerType: string, queueSortFunc?: (arr: IRender[]) => void);
        private _queueSortFunc;
        foreachRender(cam: Camera): void;
        clear(): void;
    }
}
declare namespace web3d {
    class ShaderVariant {
        static AutoUniformDic: {
            [name: string]: any;
        };
        static registAutoUniform(): void;
    }
}
declare namespace web3d {
    enum HideFlags {
        None = 0,
        HideInHierarchy = 1,
        HideInInspector = 2,
        DontSaveInEditor = 4,
        NotEditable = 8,
        DontSaveInBuild = 16,
        DontUnloadUnusedAsset = 32,
        DontSave = 52,
        HideAndDontSave = 61
    }
    interface INodeComponent {
        gameObject: GameObject;
        Start(): any;
        Update(): any;
        Clone(): any;
        Dispose(): any;
    }
    class GameObject {
        name: string;
        beVisible: boolean;
        mask: CullingMask;
        transform: Transform;
        comps: {
            [type: string]: INodeComponent;
        };
        private componentsInit;
        render: IRender;
        constructor();
        start(): void;
        update(delta: number): void;
        addComponent<T extends INodeComponent>(type: string): T;
        removeComponent(comp: INodeComponent): void;
        removeComponentByType(type: string): void;
        removeAllComponents(): void;
        getComponent<T extends INodeComponent>(type: string): T;
        getComponentsInChildren(name: string): INodeComponent[];
        private getCompoentInchilds;
        dispose(): void;
    }
}
declare namespace web3d {
    class Quadtree {
        private static TOP_LEFT;
        private static TOP_RIGHT;
        private static BOTTOM_LEFT;
        private static BOTTOM_RIGHT;
        private MAX_OBJECTS;
        private MAX_LEVELS;
        private level;
        private objects;
        private _stuckChildren;
        private bounds;
        private nodes;
        constructor(level: number, bounds: MathD.Rect);
        clear(): void;
        private split;
        private getIndex;
        insert(item: MathD.Rect): void;
        retrieveAllObjects(item: MathD.Rect): MathD.Rect[];
        private retrieve;
        private getAllContent;
    }
}
declare namespace web3d {
    class Scene {
        name: string;
        private rootNode;
        lightmaps: Texture[];
        update(delta: number): void;
        private updateGameObject;
        addChild(node: Transform | Transform2D): void;
        removeChild(node: Transform): void;
        getChild(index: number): Transform;
        getChilds(): Transform[];
        getChildCount(): number;
        getChildByName(name: string): Transform;
        getRoot(): Transform;
        enableFog(): void;
        disableFog(): void;
        enableLightMap(): void;
        disableLightMap(): void;
        enableSkyBox(): void;
        disableSkyBox(): void;
    }
}
declare namespace web3d {
    let curScene: Scene;
    class SceneMgr {
        scenes: Scene[];
        constructor();
        update(delta: number): void;
        openScene(url: string): void;
        openExtralScene(url: string): void;
    }
}
declare namespace web3d {
    class SkyBox {
        private static beActived;
        private static texcube;
        private static tex2d;
        private static enableRender2D;
        private static trans;
        private static mat;
        private static cubeShader;
        private static texShader;
        static init(): void;
        static setSkyCubeTexture(cubtex: CubeTexture): void;
        static setSky2DTexture(tex: Texture): void;
        static setActive(active: boolean): void;
    }
}
declare namespace web3d {
    class InsID {
        constructor();
        private static idAll;
        private static next;
        private id;
        getInsID(): number;
    }
    class Transform {
        insId: InsID;
        gameObject: GameObject;
        parent: Transform;
        children: Transform[];
        addChild(node: Transform): void;
        removeAllChild(): void;
        removeChild(node: Transform): void;
        find(name: string): Transform;
        findPath(name: string[]): Transform;
        private findchild;
        markDirty(): void;
        private notifyParentSelfDirty;
        private notifyChildSelfDirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        private dirtyWorldDecompse;
        private static NotDirtyRotMask;
        private static NotDirtyPosMask;
        private static NotDirtyScaleMask;
        private static AllWorldDirty;
        needComputeLocalMat: boolean;
        needComputeWorldMat: boolean;
        localRotation: MathD.quat;
        private _localEuler;
        localEuler: MathD.vec3;
        localPosition: MathD.vec3;
        localScale: MathD.vec3;
        translate(x?: number, y?: number, z?: number): void;
        scale(x?: number, y?: number, z?: number): void;
        rotate(x?: number, y?: number, z?: number): void;
        private _localMatrix;
        private _worldMatrix;
        private _worldRotate;
        private _worldPosition;
        private _worldScale;
        worldPosition: MathD.vec3;
        readonly worldScale: MathD.vec3;
        worldRotation: MathD.quat;
        readonly localMatrix: MathD.mat4;
        readonly worldMatrix: MathD.mat4;
        getForwardInWorld(out: MathD.vec3): void;
        getRightInWorld(out: MathD.vec3): void;
        getUpInWorld(out: MathD.vec3): void;
        setLocalMatrix(mat: MathD.mat4): void;
        lookat(trans: Transform): void;
        lookatPoint(point: MathD.vec3): void;
        transformDirection(dir: MathD.vec3, out: MathD.vec3): void;
        readonly beDispose: boolean;
        private _beDispose;
        dispose(): void;
    }
}
declare namespace web3d {
    class StateMgr {
        static stats: Stats;
        static showFps(): void;
        static closeFps(): void;
    }
}
declare namespace web3d {
    class Stats {
        constructor(app: application);
        update(): void;
        app: application;
        container: HTMLDivElement;
        private mode;
        private REVISION;
        private beginTime;
        private prevTime;
        private frames;
        private fpsPanel;
        private msPanel;
        private memPanel;
        private ratePanel;
        private userratePanel;
        private showPanel;
        private addPanel;
        private begin;
        private end;
    }
}
declare namespace web3d {
    class GameTimer {
        private static beginTime;
        private static lastTimer;
        private static totalTime;
        private static deltaTime;
        static readonly Time: number;
        static readonly DeltaTime: number;
        static readonly StartTime: number;
        static TimeScale: number;
        private static IntervalLoop;
        private static update;
        static Init(): void;
        static OnUpdate: (delta: number) => void;
        private static updateList;
        static addListenToTimerUpdate(func: (delta: number) => void): void;
        static removeListenToTimerUpdate(func: () => void): void;
        static removeAllListener(): void;
        static FPS: number;
        private static _lastFrameRate;
        private static frameUpdate;
    }
}
declare namespace web3d {
    class Serlizer {
        private static root;
        static serializeObj(obj: Object, json?: any, objJson?: any): any;
    }
}
declare namespace web3d {
    type Nullable<T> = T | null;
    type float = number;
    type double = number;
    type int = number;
    type FloatArray = number[] | Float32Array;
    type IndicesArray = number[] | Int32Array | Uint32Array | Uint16Array;
    type DataArray = number[] | ArrayBuffer | ArrayBufferView;
}
declare namespace web3d.io {
    class loadTool {
        private static _ins;
        static readonly ins: loadTool;
        load(msg: MessageEvent): void;
    }
}
declare namespace web3d.io {
    class loadWorkerMgr {
        loadworker: Worker;
        constructor(scripteSrc: string);
        postMessage(data: any): void;
        stopworker(): void;
    }
}
declare namespace web3d.io {
    class binBuffer {
        _buf: Uint8Array[];
        private _seekWritePos;
        private _seekWriteIndex;
        private _seekReadPos;
        private _bufSize;
        getLength(): number;
        getBufLength(): number;
        getBytesAvailable(): number;
        constructor(bufSize?: number);
        reset(): void;
        dispose(): void;
        read(target: Uint8Array | number[], offset?: number, length?: number): void;
        write(array: Uint8Array | number[], offset?: number, length?: number): void;
        getBuffer(): Uint8Array;
        getUint8Array(): Uint8Array;
    }
    class converter {
        static getApplyFun(value: any): any;
        private static dataView;
        static ULongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static LongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float64ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint32toArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static StringToUtf8Array(str: string): Uint8Array | number[];
        static ArrayToLong(buf: Uint8Array, offset?: number): number;
        static ArrayToULong(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat64(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt16(buf: Uint8Array, offset?: number): number;
        static ArrayToInt8(buf: Uint8Array, offset?: number): number;
        static ArraytoUint32(buf: Uint8Array, offset?: number): number;
        static ArrayToUint16(buf: Uint8Array, offset?: number): number;
        static ArrayToUint8(buf: Uint8Array, offset?: number): number;
        static ArrayToString(buf: Uint8Array, offset?: number): string;
    }
    class binTool extends binBuffer {
        readSingle(): number;
        readLong(): number;
        readULong(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
        readBytes(length: number): Uint8Array;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readUTFBytes(length: number): string;
        readStringAnsi(): string;
        readonly length: number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeLong(num: number): void;
        writeULong(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        writeStringUtf8DataOnly(str: string): void;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace web3d.io {
    function stringToBlob(content: string): Blob;
    function stringToUtf8Array(str: string): number[];
}
declare namespace web3d.io {
    function loadText(url: string, fun: (_txt: string, _err: Error) => void): void;
    function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void;
    function loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void): void;
    function loadImg(url: string, fun: (_tex: HTMLImageElement, _err: Error) => void, progress: (progre: number) => void): void;
}
declare namespace web3d.io {
    class binReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        private _seek;
        seek(seek: number): void;
        peek(): number;
        length(): number;
        canread(): number;
        readStringAnsi(): string;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readUint8Array(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readUTFBytes(length: number): string;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class binWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData;
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        readonly length: number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace web3d {
    class wxAdapter {
        static apply(): void;
    }
}
