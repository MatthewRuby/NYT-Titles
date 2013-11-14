function TreeBranch(g, begin_x, begin_y, end_x, end_y){
	
	var points = [];
	
	var diff_x = end_x - begin_x;	
	var diff_y = end_y - begin_y;
	var diam = 0;
	if(diff_x > diff_y){
		diam = diff_y * 2;
	} else {
		diam = diff_x * 2;
	}
	
	var circum = Math.abs(Math.floor((diam * Math.PI) / 4));
	
	for(var i = 0; i < circum; i++){

		var p = map(i, 0, circum, Math.PI, Math.PI * 0.5);
		var x = Math.cos(p) * (diam/2);
		var y = Math.sin(p) * (diam/2);
		points[i] = new Point(x, y);
	
	}

	var counter = 0;
	
	this.draw = function(){

		g.fillStyle = "rgba(255,0,0,0.05)";
		g.save();
		g.translate(begin_x + (diam/2), begin_y);
		for(var i = 0; i < counter; i++){
			g.fillRect(points[i].x, points[i].y, 10, 10);
		}
		g.restore();
		
		if(counter < points.length){
			counter += 25;
		}
		if(counter > points.length){
			counter = points.length;
		}
		
	};
	
	this.resetCounter = function(){
		counter = 0;
	}

}