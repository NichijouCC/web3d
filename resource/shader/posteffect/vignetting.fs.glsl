#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D       _MainTex;//清晰图
uniform sampler2D       _BlurTex;//模糊高光的图

uniform highp float     _Vignetting;
uniform highp float     _Blurred_Corners;
uniform highp float     _Blur_Distance;
uniform highp float     _Chromatic_Aberration;

varying highp vec2      xlv_TEXCOORD0;   // 每个片元的纹素坐标


vec2 adjustUV(vec2 uv) {
    if(uv.x > 1.0) {
        uv.x = 2.0 - uv.x;
    } else if(uv.x < 0.0) {
        uv.x = abs(uv.x);
    }
    if(uv.y > 1.0) {
        uv.y = 2.0 - uv.y;
    } else if(uv.y < 0.0) {
        uv.y = abs(uv.y);
    }
    return uv;
}

void main () {
    float dist = distance(xlv_TEXCOORD0, vec2(0.5));
    // NOTE Unity Parameters:
    float Vignetting;
    if(_Vignetting > 0.0) {
        Vignetting = min(dist/(1.0-_Vignetting), 1.0);
    } else {
        Vignetting = _Vignetting;
    }
    float Blurred_Corners = min(dist * _Blurred_Corners, 1.0);
    // vec2 Blur_Distance = vec2(Blur_Distance);
    float Chromatic_Aberration = _Chromatic_Aberration;

    vec2 direction = xlv_TEXCOORD0 - 0.5;

// offset
    vec2 r_uv = adjustUV(xlv_TEXCOORD0 - direction * direction * 0.01 * Chromatic_Aberration);
    vec2 b_uv = adjustUV(xlv_TEXCOORD0 + direction * direction * 0.01 * Chromatic_Aberration);

    float base_r = texture2D(_MainTex, r_uv).r;
    float base_b = texture2D(_MainTex, b_uv).b;

    vec4 base_color = texture2D(_MainTex, xlv_TEXCOORD0);

    float blur_r = texture2D(_BlurTex, r_uv).r;
    float blur_b = texture2D(_BlurTex, b_uv).b;

    vec4 blur_color = texture2D(_BlurTex, xlv_TEXCOORD0);

    float ch_r = mix(base_r, blur_r, Blurred_Corners);
    float ch_b = mix(base_b, blur_b, Blurred_Corners);

    vec4 color = mix(base_color, blur_color, Blurred_Corners);

    vec4 aberration = vec4(ch_r, color.g, ch_b, 1.0);
    vec4 dark = vec4(0.0, 0.0, 0.0, 1.0);

    gl_FragColor = mix(aberration, dark, Vignetting);
    // gl_FragColor = vec4(vec3(Blurred_Corners), 1.0);

}
