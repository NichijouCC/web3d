uniform sampler2D _MainTex;
uniform lowp float _MosaicSize;
uniform highp vec2 _MainTex_Size;
varying highp vec2 xlv_TEXCOORD0;
void main() //马赛克效果
{
    highp vec2 uv = (xlv_TEXCOORD0*_MainTex_Size.xy);
    uv = floor(uv/_MosaicSize)*_MosaicSize*(1.0/_MainTex_Size);
    gl_FragData[0] = texture2D(_MainTex, uv);
}