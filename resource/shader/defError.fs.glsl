#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif

void main()
{
    lowp vec4 emission=vec4(1,0,0,1);
    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif
    gl_FragData[0] = emission;
}