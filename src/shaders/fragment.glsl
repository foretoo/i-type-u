varying float vNoise;
varying vec2 vUv;
uniform sampler2D image;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {

  float rnd = random(vUv) * 0.4;

  vec4 text = texture2D(image, vUv);

  gl_FragColor = text - pow(1.0 - vNoise, 2.0) + rnd;
}
