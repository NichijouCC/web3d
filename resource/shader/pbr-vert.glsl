attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec4 a_Tangent;
attribute vec2 a_UV;


uniform mat4 u_mat_mvp;
uniform mat4 u_mat_model;
uniform mat4 u_mat_normal;

varying vec3 v_Position;
varying vec2 v_UV;
varying mat3 v_TBN;
varying vec3 v_Normal;



void main()
{
  vec4 pos = u_mat_model * a_Position;
  v_Position = vec3(pos.xyz) / pos.w;

  vec3 normalW = normalize(vec3(u_mat_normal * vec4(a_Normal.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(u_mat_model * vec4(a_Tangent.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * a_Tangent.w;
  v_TBN = mat3(tangentW, bitangentW, normalW);
  // HAS_TANGENTS != 1
  v_Normal = normalize(vec3(u_mat_model * vec4(a_Normal.xyz, 0.0)));
  v_UV = a_UV;

  gl_Position = u_mat_mvp * a_Position; // needs w for proper perspective correction
}