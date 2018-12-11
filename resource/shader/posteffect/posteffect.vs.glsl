attribute highp vec4 a_pos;
attribute mediump vec4 a_texcoord0;

varying mediump vec2 xlv_TEXCOORD0;
void main()
{
    xlv_TEXCOORD0 = a_texcoord0.xy;
    highp vec4 position=vec4(a_pos.xyz*2.0,1.0);
    gl_Position =position;
}