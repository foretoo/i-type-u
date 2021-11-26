varying float vNoise;
varying vec2 vUv;
uniform sampler2D bernoulli;
uniform float time;

void main() {

  vec4 text = texture2D(bernoulli, vUv);

  gl_FragColor = text * vNoise;
}
