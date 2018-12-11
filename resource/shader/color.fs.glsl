uniform lowp vec4 _MainColor;
void main() 
{
    lowp vec4 emission=_MainColor;
    //gl_FragColor = vec4(pow(emission.xyz,vec3(1.0/2.2)), emission.a);
    gl_FragData[0] =emission;
}