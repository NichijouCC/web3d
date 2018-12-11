uniform highp samplerCube _MainTex;
uniform highp vec4 _MainColor;
varying mediump vec2 xlv_TEXCOORD0;
varying highp vec4 v_pos;

#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif
void main() 
{
    highp vec4 basecolor = textureCube(_MainTex, v_pos.xyz);
    highp vec4 emission=basecolor*_MainColor;
    //----------------------------------------------------------
    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif
    gl_FragData[0] = emission;
}