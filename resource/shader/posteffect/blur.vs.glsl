attribute vec3 a_pos;
attribute mediump vec4 a_texcoord0;
uniform mediump vec2 _MainTex_Size;

varying mediump vec4 v_uv00;
varying mediump vec4 v_uv01;
varying mediump vec4 v_uv02;
varying mediump vec4 v_uv03;

void main()
{
    mediump vec2 offsets=vec2(1.0/_MainTex_Size.x,1.0/_MainTex_Size.y);
    v_uv00=a_texcoord0.xyxy;
    v_uv01=a_texcoord0.xyxy+offsets.xyxy*vec4(1,1,-1,-1);
    v_uv02=a_texcoord0.xyxy+offsets.xyxy*vec4(1,1,-1,-1)*2.0;
    v_uv03=a_texcoord0.xyxy+offsets.xyxy*vec4(1,1,-1,-1)*3.0;
    
    highp vec4 position=vec4(a_pos.xyz*2.0,1.0);
    gl_Position = position;
}