attribute highp vec4 a_pos;
attribute mediump vec4 a_texcoord0;

uniform highp mat4 u_mat_project;
uniform highp mat4 u_mat_view;

uniform mediump vec4 _MainTex_ST;  
varying mediump vec2 xlv_TEXCOORD0;
varying highp vec4 v_pos;

#ifdef FOG
uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;
#endif

void main()
{
    xlv_TEXCOORD0 = a_texcoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    v_pos =vec4(a_pos.xyz,1.0);
    highp vec4 position=vec4(v_pos.xyz,1.0);
    //----------------------------------------------------------
    mat4 view=mat4(u_mat_view[0],u_mat_view[1],u_mat_view[2],vec4(0,0,0,1));
    position=u_mat_project*view*position;
    #ifdef FOG
    factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    #endif
    gl_Position =position;
}