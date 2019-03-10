var plane = {
	vertices: [	
		-1, -1, 0,
		1, -1, 0,
		-1, 1, 0,
		1, 1, 0,
	],
	vbo: null,
}
var shader = {
	program: null,
	uniforms: {},	
	attributes: {},	
}

var work = {
	mat3: [],
	mat4: [],
	vec2: [],
	vec3: [],
	vec4: [],
	quat: [],
}

var logc = 0;

$(document).ready(function(){
	Monitor.setup({showTitle: false});
	// setup Gfw 
	Gfw.setup({height:14});
	Gfw.createCanvas("main", {"renderMode": RenderMode.Canvas3d});
	Gfw.getCanvas("main").setActive();
	Gfw.onUpdate = update;
	Gfw.onRender = render;
	Gfw.onResize = resize;
	// init
	init();
	// start
	Gfw.setBackgroundColor("#002");
	Gfw.start();
	Toast.info("Welcome to the Mandelbox", 3.0);
});

function resize(){
	console.log("resize");
}

function init(){
	
	// buffers
	plane.vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane.vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// vertex shader
	var source = document.querySelector("#vertex-shader").innerHTML;
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, source);
	gl.compileShader(vertexShader);
	// fragment shader
	source = document.querySelector("#fragment-shader").innerHTML
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, source);
	gl.compileShader(fragmentShader);
	
	// create shader program
	shader.program = gl.createProgram();
	gl.attachShader(shader.program, vertexShader);
	gl.attachShader(shader.program, fragmentShader);
	gl.linkProgram(shader.program);
	gl.useProgram(shader.program);
	
	// shader errors
	if(!gl.getProgramParameter(shader.program, gl.LINK_STATUS)) {
		var linkErrLog = gl.getProgramInfoLog(shader.program);
		console.log("Shader shader.program did not link successfully. " + "Error log: " + linkErrLog);
		var compilationLog = gl.getShaderInfoLog(vertexShader);
		if(compilationLog != "") console.log(compilationLog);
		compilationLog = gl.getShaderInfoLog(fragmentShader);
		if(compilationLog != "") console.log(compilationLog);
		return;
	}
	
	// shader locations
	shader.attributes.pos = gl.getAttribLocation(shader.program, "a_pos");
	shader.uniforms.transform = gl.getUniformLocation(shader.program, "u_transform");
	shader.uniforms.zLayer = gl.getUniformLocation(shader.program, "u_zLayer");
	shader.uniforms.fold = gl.getUniformLocation(shader.program, "u_fold");
	shader.uniforms.radius = gl.getUniformLocation(shader.program, "u_radius");
	shader.uniforms.scale = gl.getUniformLocation(shader.program, "u_scale");
	shader.uniforms.escape = gl.getUniformLocation(shader.program, "u_escape");
	shader.uniforms.iterations = gl.getUniformLocation(shader.program, "u_iterations");
	shader.uniforms.box = gl.getUniformLocation(shader.program, "u_box");
	console.log(shader.attributes);
	console.log(shader.uniforms);
	
	// work objects
	for(var i = 0; i < 4; i++){		
		work.mat3.push(glMatrix.mat3.create());
		work.mat4.push(glMatrix.mat4.create());
		work.vec2.push(glMatrix.vec2.create());
		work.vec3.push(glMatrix.vec3.create());
		work.vec4.push(glMatrix.vec4.create());
		work.quat.push(glMatrix.quat.create());
	}
	
	// mandelbox
	Mandelbox.init();
			
}

function update(){
	if(Input.keyDown(88)){
		logc = 0;
	}
	if(Input.isKeyDown(38)){
		Mandelbox.config.zLayer += Time.deltaTime*0.05;
	} else if(Input.isKeyDown(40)){
		Mandelbox.config.zLayer -= Time.deltaTime*0.05;
	}	
	if(Input.isKeyDown(37)){
		Mandelbox.config.maxIterations = Numbers.clamp(Mandelbox.config.maxIterations-Mandelbox.config.maxIterations*Time.deltaTime, 0, 250);
	} else if(Input.isKeyDown(39)){
		Mandelbox.config.maxIterations = Numbers.clamp(Mandelbox.config.maxIterations+Mandelbox.config.maxIterations*Time.deltaTime, 0, 250);
	}	
	if(Input.isKeyDown(81)){
		Gfw.camera.rotation -= Time.deltaTime*1.25;
	} else if(Input.isKeyDown(69)){
		Gfw.camera.rotation += Time.deltaTime*1.25;
	}	
	Gfw.cameraMovement(50);
	// the mandelbox
	Mandelbox.update();
	// monitor stuffs
	var config = Mandelbox.config;
	Monitor.set("FPS", Time.fps);
	Monitor.set("Time", roundToFixed(Time.sinceStart, 1));	
	Monitor.set("zLayer", roundToFixed(Mandelbox.config.zLayer, 3));
	Monitor.set("Iterations", Math.floor(Mandelbox.config.maxIterations));
}

function render(){
	// clear
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	
	// begin draw 
	gl.useProgram(shader.program);
	Mandelbox.render();
}




































