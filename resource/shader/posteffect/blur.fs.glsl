uniform lowp sampler2D _MainTex;

varying mediump vec4 v_uv00;
varying mediump vec4 v_uv01;
varying mediump vec4 v_uv02;
varying mediump vec4 v_uv03;
void main()
{

    lowp vec4 emission=vec4(0,0,0,0);
    emission += 0.4 * texture2D(_MainTex, v_uv00.xy);  
    emission += 0.15 * texture2D(_MainTex, v_uv01.xy);  
    emission += 0.15 * texture2D(_MainTex, v_uv01.zw);    
    emission += 0.10 * texture2D(_MainTex, v_uv02.xy);  
    emission += 0.10 * texture2D(_MainTex, v_uv02.zw);  
    emission += 0.05 * texture2D(_MainTex, v_uv03.xy);  
    emission += 0.05 * texture2D(_MainTex, v_uv03.zw);  
    gl_FragData[0] = emission;
}