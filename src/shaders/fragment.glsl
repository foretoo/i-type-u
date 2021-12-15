varying float vNoise;
varying vec2 vUv;
uniform sampler2D image;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {

  float rnd = random(vUv) * abs(sin(vUv.x * 512.0)) * abs(sin(vUv.y * 640.0));

  vec4 text = texture2D(image, vUv);

  gl_FragColor = text + rnd - pow(1.0 - vNoise, 2.0);
}
