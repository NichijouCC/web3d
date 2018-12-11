uniform lowp sampler2D _MainTex;
uniform lowp vec4 _MainColor;
varying mediump vec2 xlv_TEXCOORD0;

#ifdef LIGHTMAP
uniform lowp sampler2D u_LightmapTex;
varying mediump vec2 lightmap_TEXCOORD;
lowp vec3 decode_hdr(lowp vec4 data)
{
    lowp float power =pow( 2.0 ,data.a * 255.0- 128.0);
    return data.rgb * power * 2.0 ;

    //data.xyz=pow(data.xyz,vec3(1.0/2.2);
    //return (1.0* data.a) * data.rgb;
    //return 2.0 * data.rgb;
}


#endif

#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif

void main() 
{
    lowp vec4 basecolor = texture2D(_MainTex, xlv_TEXCOORD0);
    lowp vec4 emission=basecolor*_MainColor;

    //----------------------------------------------------------
    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(u_LightmapTex, lightmap_TEXCOORD);
    //emission.xyz *= decode_hdr(lightmap);
    //lightmap.xyz=pow(lightmap.xyz,vec3(1.0/2.2);
    emission.xyz*=lightmap.xyz;
    #endif

    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif
    //gl_FragColor = vec4(pow(emission.xyz,vec3(1.0/2.2)), emission.a);
    gl_FragData[0] =emission;
}