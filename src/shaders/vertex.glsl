// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

uniform float time;
varying float vNoise;
varying vec2 vUv;

void main() {
  float PI = 3.14159265;
  vec3 newposition = position;
  float t = time*.5;

  // float noise = cnoise(vec3(newposition.x*3., newposition.y*3., time));
  float noise1 = snoise(.667*vec2(newposition.x/4., newposition.y + t));
  float noise2 = snoise(.333*vec2(newposition.x, newposition.y*4. + t*1.618));
  // float noise = cnoise(4.*newposition + time);
  // float dist = distance(uv,vec2(0.5));

  newposition.z = .1*(newposition.y-.625)*noise1;
  newposition.z += .5*newposition.z*noise2;
  // newposition.z += .1*sin(dist*4.*PI + time*4.);
  // newposition.z = .5*noise;


  vNoise = newposition.z + .85;
  vUv = uv;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);
}
