//
// This fragment shader defines a reference implementation for Physically Based Shading of
// a microfacet surface material defined by a glTF model.
//
// References:
// [1] Real Shading in Unreal Engine 4
//     http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
// [2] Physically Based Shading at Disney
//     http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf
// [3] README.md - Environment Maps
//     https://github.com/KhronosGroup/glTF-WebGL-PBR/#environment-maps
// [4] "An Inexpensive BRDF Model for Physically based Rendering" by Christophe Schlick
//     https://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/schlick94b.pdf
#extension GL_EXT_shader_texture_lod: enable
#extension GL_OES_standard_derivatives: enable

precision highp float;

uniform vec3 u_campos;
uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;

uniform samplerCube u_DiffuseEnvSampler;
uniform samplerCube u_SpecularEnvSampler;
uniform sampler2D u_brdfLUT;
#ifdef USE_IBL
#endif

uniform sampler2D u_BaseColorSampler;
uniform sampler2D u_metalSampler;
uniform sampler2D u_roughnessSampler;

uniform vec4 u_BaseColorFactor;
uniform float u_metalFactor;
uniform float u_roughnessFactor;


uniform sampler2D u_NormalSampler;
uniform float u_NormalScale;

#ifdef em
uniform sampler2D u_EmissiveSampler;
uniform vec3 u_EmissiveFactor;
#endif

//uniform sampler2D u_MetallicRoughnessSampler;

uniform sampler2D u_OcclusionSampler;
#ifdef AO
uniform float u_OcclusionStrength;
#endif

uniform vec4 u_ScaleBaseTex;
uniform vec4 u_Scalebrdf;
uniform vec4 u_ScaleIBL;


varying vec3 v_Position;
varying vec2 v_UV;
varying mat3 v_TBN;
varying vec3 v_nor;

const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;

vec4 SRGBtoLINEAR(vec4 srgbIn)
{
    // #ifdef MANUAL_SRGB
    // #ifdef SRGB_FAST_APPROXIMATION
    // vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
    // #else //SRGB_FAST_APPROXIMATION
    // vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
    // vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
    // #endif //SRGB_FAST_APPROXIMATION
    // return vec4(linOut,srgbIn.w);;
    // #else //MANUAL_SRGB
    // return srgbIn;
    // #endif //MANUAL_SRGB
    vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
    return vec4(linOut,srgbIn.w);;
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
vec3 getNormal()
{
    mat3 tbn = v_TBN;
    vec3 n = texture2D(u_NormalSampler, v_UV).rgb;
    n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_NormalScale, u_NormalScale, 1.0)));
    return n;
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
vec3 getIBLContribution(vec3 diffuseColor,vec3 fresnel,float Roughness,float NdotV, vec3 n, vec3 reflection)
{
    vec3 irradiance = SRGBtoLINEAR(textureCube(u_DiffuseEnvSampler, n)).rgb;
    vec3 diffuse = irradiance  * diffuseColor;

    vec3 brdf = texture2D(u_brdfLUT, vec2(NdotV,Roughness)).rgb;
    float mipCount = 9.0; // resolution of 512x512
    vec3 prefilteredColor = SRGBtoLINEAR(textureCubeLodEXT(u_SpecularEnvSampler, reflection, mipCount*Roughness)).rgb;
    vec3 specular = prefilteredColor * (fresnel * brdf.x + brdf.y);

    return specular+diffuse;
    //return vec3(0.0);
}

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
vec3 diffuse(vec3 diffusecolor)
{
    return diffusecolor / M_PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 specularReflection(vec3 reflectance0,vec3 reflectance90,float VdotH)//好像效果好一些
{
    return reflectance0 + (reflectance90 - reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}
//const vec3 F0 = vec3(0.04);
vec3 fresnelSchlick(vec3 diffusecolor ,float NdotH)
{
    return diffusecolor + (1.0 - diffusecolor) * pow(1.0 - NdotH, 5.0);
}
vec3 fresnelSchlickRoughness( vec3 F0, float NdotH,float roughness)
{
    //return F0 + (vec3(1) - F0) * pow(1.0 - NdotH, 5.0);
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - NdotH, 5.0);
} 

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
float GeometrySchlickGGX(float NdotV, float k)
{
    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
    return nom / denom;
}
float geometricOcclusion(float NdotV,float NdotL,float r)
{
    // float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
    // float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
    float attenuationL =GeometrySchlickGGX(NdotL, r);
    float attenuationV =GeometrySchlickGGX(NdotV, r);
    return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.
float DistributionGGX(float NdotH, float roughness)
{
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH2 = NdotH*NdotH;
    float nom  = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = M_PI * denom * denom;
    return nom / denom; // prevent divide by zero for roughness=0.0 and NdotH=1.0
}


void main()
{
    vec4 baseColor = SRGBtoLINEAR(texture2D(u_BaseColorSampler, v_UV))*u_BaseColorFactor;
    float Roughness =texture2D(u_roughnessSampler, v_UV).r*u_roughnessFactor;
    Roughness = clamp(Roughness, c_MinRoughness, 1.0);
    float metallic = texture2D(u_metalSampler, v_UV).r*u_metalFactor;
    metallic = clamp(metallic, 0.0, 1.0);
    vec3 f0 = vec3(0.04);
    // f0 = mix(f0, baseColor.rgb, metallic);

    vec3 n = getNormal();                             // normal at surface point
    vec3 v = normalize(u_campos - v_Position);        // Vector from surface point to camera
    vec3 l = normalize(u_LightDirection);             // Vector from surface point to light
    vec3 h = normalize(l+v);                          // Half vector between both l and v
    vec3 reflection =reflect(-v, n);

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = abs(dot(n, v)) + 0.001;
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    // Calculate the shading terms for the microfacet specular shading model
    //vec3 F = specularReflection(specularEnvironmentR0,specularEnvironmentR90,VdotH);
    vec3 F = fresnelSchlickRoughness(f0,NdotV,Roughness);
    float G = geometricOcclusion(NdotV,NdotL,Roughness);
    float D = DistributionGGX(NdotH,Roughness);

    // Calculation of analytical lighting contribution
    vec3 diffuseContrib =(1.0-f0)*(1.0-metallic)*(1.0 - F)*diffuse(baseColor.xyz);
    vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);
    
    // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
    vec3 color = NdotL * u_LightColor * (diffuseContrib + specContrib);

    // Calculate lighting contribution from image based lighting source (IBL)
    //color+= getIBLContribution(diffuseColor,F,Roughness,NdotV, n, reflection);
    vec3 irradiance = SRGBtoLINEAR(textureCube(u_DiffuseEnvSampler, n)).rgb;
    vec3 diffuseColor=baseColor.xyz*(1.0-f0)*(1.0-metallic);
    vec3 diffuse = irradiance  * diffuseColor;

    vec3 brdf = texture2D(u_brdfLUT, vec2(NdotV,Roughness)).rgb;
    float mipCount = 9.0; // resolution of 512x512
    vec3 prefilteredColor = SRGBtoLINEAR(textureCubeLodEXT(u_SpecularEnvSampler, reflection, mipCount*Roughness)).rgb;
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);
    vec3 specular = prefilteredColor * (specularColor * brdf.x + brdf.y);

    color+=diffuse;
    color+=specular;

    // color=n;
    //color=specContrib+vec3(0.03)*baseColor.xyz;
#ifdef USE_IBL
#endif
  
    // float ao = texture2D(u_OcclusionSampler, v_UV).r;
    // color=color * ao;
#ifdef AO
    // Apply optional PBR terms for additional (optional) shading
    color = mix(color, color * ao, u_OcclusionStrength);
#endif

#ifdef em
    vec3 emissive = SRGBtoLINEAR(texture2D(u_EmissiveSampler, v_UV)).rgb * u_EmissiveFactor;
    color += emissive;
#endif

    // This section uses mix to override final color for reference app visualization
    // of letious parameters in the lighting equation.
    // color = mix(color, baseColor.rgb, u_ScaleBaseTex.x);
    // color = mix(color, vec3(metallic), u_ScaleBaseTex.y);
    // color = mix(color, vec3(Roughness), u_ScaleBaseTex.z);

    // color = mix(color, F, u_Scalebrdf.x);
    // color = mix(color, vec3(G), u_Scalebrdf.y);
    // color = mix(color, vec3(D), u_Scalebrdf.z);
    // color = mix(color, specContrib, u_Scalebrdf.w);

    // color = mix(color, irradiance, u_ScaleIBL.x);
    // color = mix(color, prefilteredColor, u_ScaleIBL.y);
    // color = mix(color, diffuse, u_ScaleIBL.z);
    // color = mix(color, specular, u_ScaleIBL.w);

    //color = color / (color + vec3(1.0));
    gl_FragColor = vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
}
