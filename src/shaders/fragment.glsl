varying float vNoise;
varying vec2 vUv;
uniform sampler2D image;

void main() {

  vec4 text = texture2D(image, vUv);

  gl_FragColor = text * vNoise;
}
