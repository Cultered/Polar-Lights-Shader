#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5),-sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    vec3 color = vec3(0.0);
    
    
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    vec2 h = vec2(0.);
    h.y+=fbm(vec2(st.x*9.504,0)+u_time)*0.152;
    
    float f = fbm(vec2(st.x*h.y,st.y)+r);
    f=clamp(f,0.5,1.)*2.528-1.132;
    
    
    
    color = mix(vec3(0.027,0.032,0.995),
                vec3(0.667,0.658,0.629),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0.488,0.067,0.965),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.056,0.914,1.000),
                clamp(length(r.x),0.0,1.0));
    

    color+=pow(noise(st*140.208),101.104)*1000.856*clamp(0.072-                                                                        smoothstep(0.060,1.0,length((f*f*f+.6*f*f+.5*f)*color)),0.0,1.0);
    
    color=(1.-step(st.y,1.276))*color;
    
    
    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}
