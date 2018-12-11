attribute highp vec3 a_pos;
attribute mediump vec2 a_texcoord0;
uniform highp mat4 u_mat_mvp;

uniform mediump vec4 _MainTex_ST;
uniform mediump vec4 _Mask_ST;

varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

void main()
{

    _maintex_uv = a_texcoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    _mask_uv = a_texcoord0.xy * _Mask_ST.xy + _Mask_ST.zw;

	gl_Position = (u_mat_mvp * vec4(a_pos.xyz, 1.0));
}