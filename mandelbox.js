function Mandelbox(){}
Mandelbox.config = {
	escapeRadius: 20,
	fold: 1.0,
	radius: 0.5,
	scale: 2.0,
	maxIterations: 12,
	zLayer: 0.5,
};
Mandelbox.init = function(){
	
}

Mandelbox.update = function(){	
	
}

Mandelbox.render = function(){
	var config = Mandelbox.config;
	var w_vec2 = work.vec2[0];
	var w_mat3 = work.mat3[0];
	// attribute vertices
	gl.bindBuffer(gl.ARRAY_BUFFER, plane.vbo);
	gl.vertexAttribPointer(shader.attributes.pos, 3, gl.FLOAT, false, 0, 0); 
	gl.enableVertexAttribArray(shader.attributes.pos);
	// uniform configs
	gl.uniform1f(shader.uniforms.zLayer, config.zLayer);	
	gl.uniform1f(shader.uniforms.fold, config.fold);	
	gl.uniform1f(shader.uniforms.radius, config.radius);	
	gl.uniform1f(shader.uniforms.scale, config.scale);	
	gl.uniform1f(shader.uniforms.escape, config.escapeRadius);	
	gl.uniform1i(shader.uniforms.iterations, config.maxIterations);	
	gl.uniform1f(shader.uniforms.box, config.box);	
	// transform
	glMatrix.mat3.identity(w_mat3);
	// mirror-y (again)
	glMatrix.vec2.set(w_vec2, 1, -1);
	glMatrix.mat3.scale(w_mat3, w_mat3, w_vec2);
	// camera translate
	glMatrix.vec2.set(w_vec2, Gfw.camera.position.x, Gfw.camera.position.y);
	glMatrix.mat3.translate(w_mat3, w_mat3, w_vec2);
	// camera zoom 
	glMatrix.vec2.set(w_vec2, 1.0/Gfw.camera.zoom, 1.0/Gfw.camera.zoom);
	glMatrix.mat3.scale(w_mat3, w_mat3, w_vec2);
	// camera rotation 
	glMatrix.mat3.rotate(w_mat3, w_mat3, Gfw.camera.rotation);
	// gfw scale and mirror-y
	glMatrix.vec2.set(w_vec2, 1/Gfw.scale, -1/Gfw.scale);
	glMatrix.mat3.scale(w_mat3, w_mat3, w_vec2);
	// translate to center
	glMatrix.vec2.set(w_vec2, -window.innerWidth/2.0, -window.innerHeight/2.0);
	glMatrix.mat3.translate(w_mat3, w_mat3, w_vec2);
	// apply matrix
	gl.uniformMatrix3fv(shader.uniforms.transform, false, w_mat3);
	// draw
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);	
}

