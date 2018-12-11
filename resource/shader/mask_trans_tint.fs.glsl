uniform sampler2D _MainTex; 
uniform mediump vec4 _Main_Color;


varying lowp vec4 v_color;
varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

void main()
{
    highp vec4 v_color =_Main_Color*2.0;
    highp vec4 basecolor=texture2D(_MainTex,_maintex_uv);
    lowp vec3 tempcolor=v_color.rgb*basecolor.rgb*2.0;
    lowp float tempAlpha=v_color.a*basecolor.a;

    gl_FragColor=vec4(tempcolor,tempAlpha);
}
