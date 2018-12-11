uniform lowp sampler2D _MainTex;
varying mediump vec2 xlv_TEXCOORD0;
void main() 
{
    lowp vec4 basecolor = texture2D(_MainTex, xlv_TEXCOORD0);
    gl_FragData[0] =basecolor;
}