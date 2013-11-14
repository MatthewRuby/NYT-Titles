function Block(g, x, y, word, before, after, views){

	this.pos = new Point(x,y);
	this.size = new Point(10, 24);
	this.word = word;
	this.before = before;
	this.after = after;
	this.bOver = false;
	this.bActive = false;
	this.last_active = 0;
	
	var alpha = 1.0, 
		color = "rgba(0,0,0,1.0)",
		font_size = 16,
		temp_height = 22,
		temp_pos = new Point(x,y);
	
	this.setHeight = function(h){
		temp_height = h * 24;
	};
	
	this.setPos = function(x, y){
		temp_pos.x = x;
		temp_pos.y = y;
	};
	
	this.update = function(){
		this.size.y = ease(this.size.y, temp_height, 0.2);
		this.pos.x = ease(this.pos.x, temp_pos.x, 0.2);
		this.pos.y = ease(this.pos.y, temp_pos.y, 0.2);
	};
	
	this.draw = function(){
		
		g.font = font_size + "px georgia-bold";
		var w = g.measureText(this.word);
		this.size.x = w.width + 6;
	
		g.fillStyle = "rgba(0, 0, 0, 1.0)";
		g.fillRect(this.pos.x - this.size.x/2, this.pos.y - this.size.y/2, this.size.x, this.size.y);
		
		g.fillStyle = "rgba(255, 255, 255, 1.0)";
		g.fillText(this.word, this.pos.x - this.size.x/2 + 3, this.pos.y + font_size/2);

	};

	this.mouseOver = function(mouseX, mouseY, down) {

		if (mouseX > this.pos.x - this.size.x / 2 &&
			mouseX < this.pos.x + this.size.x / 2 &&
			mouseY > this.pos.y - this.size.y / 2 &&
			mouseY < this.pos.y + this.size.y / 2){

			this.bOver = true;
			
			if(down == true){
				temp_pos.x = mouseX;
				temp_pos.y = mouseY;
			}		
			
		} else {
			this.bOver = false;
		}
    };

};
