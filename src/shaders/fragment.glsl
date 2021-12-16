varying float vNoise;
varying vec2 vUv;
uniform sampler2D image;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float smootherstep(float edge0, float edge1, float x) {
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {

  float rnd = random(vUv) * abs(sin(vUv.x * 512.0)) * abs(sin(vUv.y * 640.0));

  vec4 text = texture2D(image, vUv);

  gl_FragColor = text + rnd - smootherstep(0.0, 1.0, 0.8 - vNoise);
}
