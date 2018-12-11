attribute highp vec4 a_pos;




#ifdef SKIN
attribute lowp vec4 a_blendindex4;
attribute lowp vec4 a_blendweight4;
//uniform highp vec4 u_bones[110];
uniform highp mat4 u_jointMatirx[55];
uniform highp mat4 u_mat_viewproject;

highp mat4 calcSkinMat(lowp vec4 blendIndex,lowp vec4 blendWeight)
{
    mat4 mat = u_jointMatirx[int(blendIndex.x)]*blendWeight.x
			 + u_jointMatirx[int(blendIndex.y)]*blendWeight.y 
			 + u_jointMatirx[int(blendIndex.z)]*blendWeight.z 
			 + u_jointMatirx[int(blendIndex.w)]*blendWeight.w;
	return mat;
}
#else
uniform highp mat4 u_mat_mvp;
#endif

void main()
{
    highp vec4 position=vec4(a_pos.xyz,1.0);

    //----------------------------------------------------------

    #ifdef SKIN
    position =u_mat_viewproject * calcSkinMat(a_blendindex4,a_blendweight4)* position;
	#else
    position =u_mat_mvp * position;
    #endif


    gl_Position =position;
}