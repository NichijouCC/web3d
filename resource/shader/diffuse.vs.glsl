attribute highp vec4 a_pos;
attribute mediump vec4 a_texcoord0;

uniform mediump vec4 _MainTex_ST;  
varying mediump vec2 xlv_TEXCOORD0;

#ifdef INSTANCE
uniform highp mat4 u_mat_viewproject;

attribute highp vec3 a_InstancePos;
attribute highp vec4 a_InstanceRot;
attribute highp vec3 a_InstanceScale;
highp vec3 applyTRS(highp vec3 position,highp vec3 translation,highp vec4 quaternion,highp vec3 scale )
{
    position *= scale;
    position =position+2.0 * cross(quaternion.xyz,cross(quaternion.xyz, position) + quaternion.w * position);
    return position + translation;
}
#endif

#ifdef LIGHTMAP
attribute mediump vec4 a_texcoord1;
uniform mediump vec4 u_lightmapOffset;
// uniform mediump float glstate_lightmapUV;
varying mediump vec2 lightmap_TEXCOORD;
#endif

#ifdef FOG
uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;
#endif

#ifdef SKIN
attribute lowp vec4 a_blendindex4;
attribute lowp vec4 a_blendweight4;
//uniform highp vec4 u_bones[110];
uniform highp mat4 u_jointMatirx[55];
uniform highp mat4 u_mat_viewproject;

highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)
{
    mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x
			 + u_jointMatirx[int(blendIndex.y)]*blendWeight.y 
			 + u_jointMatirx[int(blendIndex.z)]*blendWeight.z 
			 + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;
	return mat;
}
#else
uniform highp mat4 u_mat_mvp;
#endif

void main()
{
    xlv_TEXCOORD0 = a_texcoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    highp vec4 position=vec4(a_pos.xyz,1.0);

    //----------------------------------------------------------
    #ifdef LIGHTMAP
    mediump float u = a_texcoord1.x * u_lightmapOffset.x + u_lightmapOffset.z;
    mediump float v = a_texcoord1.y * u_lightmapOffset.y + u_lightmapOffset.w;
    lightmap_TEXCOORD = vec2(u,v);
    #endif

    #ifdef SKIN
    position =u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;
	#else
    #ifdef INSTANCE
    position.xyz=applyTRS(position.xyz,a_InstancePos,a_InstanceRot,a_InstanceScale);
    // position.xyz=a_pos.xyz+a_InstancePos.xyz;
    position =u_mat_viewproject *position;
    #else 
    position =u_mat_mvp * position;
    #endif
    #endif

    #ifdef FOG
    factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    #endif

    gl_Position =position;
}