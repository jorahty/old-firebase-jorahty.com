var w = window.innerWidth > 512 + 40 ? 512 : window.innerWidth - 40;

function setup() {
  	canvas=createCanvas(w, w);
  	canvas.parent("display");
	stroke(128, 128, 128);
	background(255, 255, 255);
	polygram();
}

window.onresize = function() {
	w = window.innerWidth > 512 ? 512 : window.innerWidth - 40;  
	setup();
}

document.getElementById("draw").onclick = function() {polygram()};

function polygram() {
	clear();
	background(255, 255, 255);
	var p = document.getElementById("p").value;
	var q = document.getElementById("q").value;
	var r = w * 3 / 8;
	var angle = 2 * Math.PI / p;
	for (let i = 0; i < p; i++) {
		var a = i * angle;
		var b = a + q * angle;
		line(
			w / 2 + r * Math.cos(a), w / 2 + r * Math.sin(a),
			w / 2 + r * Math.cos(b), w / 2 + r * Math.sin(b)
		);
	}
}