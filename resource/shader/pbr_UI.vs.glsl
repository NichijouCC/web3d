attribute vec4 a_pos;
attribute vec4 a_normal;
attribute vec4 a_tangent;
attribute vec2 a_texcoord0;

uniform mat4 u_mat_mvp;
uniform mat4 u_mat_model;
uniform mat4 u_mat_normal;

varying vec3 v_Position;
varying vec2 v_UV;

varying mat3 v_TBN;
varying vec3 v_nor;


void main()
{
    vec4 pos = u_mat_model * a_pos;
    v_Position = vec3(pos.xyz) / pos.w;

    vec3 normalW = normalize(vec3(u_mat_normal * vec4(a_normal.xyz, 0.0)));
    v_nor=normalW;
    vec3 tangentW = normalize(vec3(u_mat_model * vec4(a_tangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * a_tangent.w;
    v_TBN = mat3(tangentW, bitangentW, normalW);
    //v_Normal = normalize(vec3(u_mat_model * vec4(a_normal.xyz, 0.0)));
    v_UV = a_texcoord0;
    gl_Position = u_mat_mvp * a_pos; // needs w for proper perspective correction
}


