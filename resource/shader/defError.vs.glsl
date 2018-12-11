attribute vec3 a_pos;
uniform highp mat4 u_mat_mvp;

#ifdef FOG
uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;
#endif

#ifdef SKIN
attribute lowp vec4 a_blendindex4;
attribute lowp vec4 a_blendweight4;
uniform highp vec4 u_bones[110];
mat4 buildMat4(int index)
{
	vec4 quat = u_bones[index * 2 + 0];
	vec4 translation = u_bones[index * 2 + 1];
	float xy = 2.0 * quat.x * quat.y;
	float xz = 2.0 * quat.x * quat.z;
	float xw = 2.0 * quat.x * quat.w;
	float yz = 2.0 * quat.y * quat.z;
	float yw = 2.0 * quat.y * quat.w;
	float zw = 2.0 * quat.z * quat.w;
	float xx = 2.0*quat.x * quat.x;
	float yy = 2.0*quat.y * quat.y;
	float zz = 2.0*quat.z * quat.z;
	float ww = 2.0*quat.w * quat.w;
	mat4 matrix = mat4(
	1.0-yy-zz, xy+zw, xz-yw, 0,
	xy-zw, 1.0-xx-zz, yz + xw, 0,
	xz + yw, yz - xw, 1.0-xx-yy, 0,
	translation.x, translation.y, translation.z, 1);
	return matrix;
}

highp vec4 calcVertex(highp vec4 srcVertex,lowp vec4 blendIndex,lowp vec4 blendWeight)
{
	int i = int(blendIndex.x);  
    int i2 =int(blendIndex.y);
	int i3 =int(blendIndex.z);
	int i4 =int(blendIndex.w);
	
    mat4 mat = buildMat4(i)*blendWeight.x 
			 + buildMat4(i2)*blendWeight.y 
			 + buildMat4(i3)*blendWeight.z 
			 + buildMat4(i4)*blendWeight.w;
	return mat* srcVertex;
}
#endif
void main()
{
    highp vec4 position=vec4(a_pos.xyz,1.0);
    
    #ifdef SKIN
    position = calcVertex(position,a_blendindex4,a_blendweight4);
    #endif
    position = (u_mat_mvp * position);

    #ifdef FOG
    factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    #endif

    gl_Position = position;
}