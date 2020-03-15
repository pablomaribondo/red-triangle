/*
* "#version 300 es" DEVE SER A PRIMEIRA LINHA DO SHADER.
* Nenhum comentário ou linhas em branco são permitidas antes dele!
* "#version 300 es" diz para a WebGL2 que você deseja usar a linguagem de shader da WebGL2,
* chamada GLSL ES 3.00. Se não for colocado como a primeira linha,
* a linguagem padrão do shader será definida para a da WebGL 1.0,
* a GLSL ES 1.00 que possui muitas diferenças e bem menos recursos.
*/

// Fornece as coordenadas.
const vertexShaderSource = `#version 300 es

in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

// Fornece a cor.
const fragmentShaderSource = `#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0, 1);
}
`;

// Função para criar o shader, fazer o upload da fonte GLSL e compilar o shader.
const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
};

// Função para linkar os shaders.
const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
};

// Função para redimensionar o canvas
const resize = (canvas) => {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {
 
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
};

 (() => {
  // Aplica o context WebGL.
  const canvas = document.getElementById("glcanvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) {
    return;
  }

  // Cria os dois shaders.
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Linka os dois shaders.
  const program = createProgram(gl, vertexShader, fragmentShader);

  // Procura a localização do atributo 'a_position'.
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Procurar posições de atributos é algo que deve ser feito durante a inicialização, e não no seu loop de renderização.
  // Atributos obtêm seus dados através de buffers.

  // Cria um buffer.
  const positionBuffer = gl.createBuffer();

  // Vincula o buffer de posição.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    0, 0,
    0.5, 1,
    1, 0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Cria uma coleção do estado do atributo denominada Vertex Array Object.
  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  // Ativa o atributo. Se não for ativado, então, o atributo terá um valor constante.
  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;          // 2 componentes por iteração.
  const type = gl.FLOAT;   // Os dados são floats de 32bits.
  const normalize = false; // Não normalize os dados.
  const stride = 0;        // 0 = mover para frente size * sizeof(type) cada iteração para obter a próxima posição.
  let offset = 0;          // Comece no início do buffer.

  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  resize(gl.canvas);
  
  // Diz para o WebGL como converter de ClipSpace para pixels
  // Mapeia de -1/+1 do ClipSpace para 0/gl.canvas.width para o 'x', e 0/canvas.height para 'y'.
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Limpa o canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(vao);

  const primitiveType = gl.TRIANGLES;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
})();