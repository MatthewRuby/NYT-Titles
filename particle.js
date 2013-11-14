function Particle(px, py, vx, vy, size, num, label, damp, g){

		this.width = size;
		this.num = num;
		this.label = label;

		this.posX = px;
		this.posY = py;

		this.velX = vx;
		this.velY = vy;
		
		this.frcX = 0;	
		this.frcY = 0;
		
		this.damping = damp;
		
		this.ctx = ctx;
		
		this.prevPosX = px;
		this.prevPosY = py;

		this.angle = 0;
		this.prevAngle = 0;
		this.over = false;
		
	
};
	
	Particle.prototype.resetForce = function(){
		this.frcX = 0;
		this.frcY = 0;
	};
	
	Particle.prototype.addForce = function(x, y){				
		this.frcX = this.frcX + x;	
		this.frcY = this.frcY + y;
	};
	
	Particle.prototype.dampingForce = function(){
		this.frcX = this.frcX - this.velX * this.damping;
		this.frcY = this.frcY - this.velY * this.damping;
	};
	
	Particle.prototype.update = function(){
		this.velX = this.velX + this.frcX;
		this.velY = this.velY + this.frcY;
		
		if(this.velX > 2.0){
			this.velX = 2.0;
		} else if(this.velX < -2.0){
			this.velX = -2.0;
		}
		
		if(this.velY > 2.0){
			this.velY = 2.0;
		} else if(this.velY < -2.0){
			this.velY = -2.0;
		}
		
		this.posX = this.posX + this.velX;
		this.posY = this.posY + this.velY;
		
		var dx = this.posX - this.prevPosX;		
		var dy = this.posY - this.prevPosY;
		
		this.angle = 0.01 * Math.atan2(dy,dx) + (1 - 0.01) * this.angle;
		
//		this.angle = Math.atan2(dy,dx);
		
		this.prevPosX = this.posX;
		this.prevPosY = this.posY;

	};
	
	Particle.prototype.draw = function(){

		var x = this.posX;
		var y = this.posY;

		this.ctx.fillStyle = "rgba(255,0,0,0.75)";
		this.ctx.save();
			
	    this.ctx.translate(x, y);
	
		this.ctx.rotate(this.angle);
		
		roundedRect( 0 - (this.width/2), 0 - (this.width/2), this.width, this.width, this.width/2, this.ctx);
		
		this.ctx.restore();
		
		this.ctx.fill();

	};
	
	Particle.prototype.drawText = function(){
		
		var fontSize = 12;
		var baseline = this.posY + fontSize/2;
		
		this.ctx.fillStyle = "rgba( 255, 0, 0, 0.75)";
		this.ctx.save();
	    this.ctx.translate(this.posX, this.posY);

		this.ctx.rotate(this.angle);

		this.ctx.textAlign = "center";
		this.ctx.font = "12px interstate";
		this.ctx.fillText(this.num, 0, fontSize/3);
	    this.ctx.restore();
	};
	
	Particle.prototype.hover = function(){
		
		var fontSize = 18;
		var baseline = this.posY + fontSize/2;
		
		this.ctx.fillStyle = "rgba( 255, 255, 255, 0.8)";
		this.ctx.save();
	    this.ctx.translate(this.posX, this.posY);

		this.ctx.rotate(this.angle * 0.1);

		this.ctx.textAlign = "center";
		this.ctx.font = "14px interstate";
		this.ctx.fillText(this.label, 0, fontSize/3);
	    this.ctx.restore();
	};
	
	Particle.prototype.bounceOffWalls = function(){
		this.bDidICollide = false;

		this.minX = (this.width/2);
		this.minY = (this.width/2);
		this.maxX = canvas.width - (this.width/2);
		this.maxY = canvas.height - (this.width/2);

		if (this.posX > this.maxX){
			this.posX = this.maxX; // move to the edge, (important!)
			this.velX *= -1;
			this.bDidICollide = true;
		} else if (this.posX < this.minX){
			this.posX = this.minX; // move to the edge, (important!)
			this.velX *= -1;
			this.bDidICollide = true;
		}

		if (this.posY > this.maxY){
			this.posY = this.maxY; // move to the edge, (important!)
			this.velY *= -1;
			this.bDidICollide = true;
		} else if (this.posY < this.minY){
			this.posY = this.minY; // move to the edge, (important!)
			this.velY *= -1;
			this.bDidICollide = true;
		}
	};

	Particle.prototype.collide = function(other){

	  	var diffX = this.posX - other.posX;
	  	var diffY = this.posY - other.posY;

	  	var dist = Math.sqrt(diffX*diffX + diffY*diffY);
		var minDist = (other.width/2) + (this.width/2) + 2;

	  	if(dist < minDist){

			var angle = Math.atan2(diffX, diffY);
			
	        var targetX = this.posX + Math.cos(angle) * minDist;
	        var targetY =this.posY + Math.sin(angle) * minDist;
	
	        var ax = (targetX - other.posX);
	        var ay = (targetY - other.posY);

	        this.velX -= ax;
	        this.velY -= ay;
	        other.velX += ax;
	        other.velY += ay;
			
		}
		  
	};

	Particle.prototype.addRepulsionForce = function(px, py, radius, strength){

	  	var posOfForceX = px;
	  	var posOfForceY = py;

	  	var diffX = this.posX - px;
	  	var diffY = this.posY - py;

	  	var length = Math.sqrt(diffX*diffX + diffY*diffY);

	  	if(length < radius){
		
	  		var pct = 1 - (length / radius);
	
	  		diffX = diffX * 0.1;
	  		diffY = diffY * 0.1;
	
	  		this.frcX = this.frcX + diffX * pct * strength;
	  		this.frcY = this.frcX + diffY * pct * strength;
		}
		
	};

	Particle.prototype.addAttractionForce = function(px, py, radius, scale){
		var posOfForceX = px;
		var posOfForceY = py;

	  	var diffX = this.posX - posOfForceX;
	  	var diffY = this.posY - posOfForceY;

	  	var length = Math.sqrt(diffX*diffX + diffY*diffY);

	  	if(length < radius){
		
	  		var pct = 1 - (length / radius);
	
	  		diffX = diffX * 0.1;
	  		diffY = diffY * 0.1;
	
	  		this.frcX = this.frcX - diffX * pct * scale;
	  		this.frcY = this.frcY - diffY * pct * scale;
	  	}
	};



	Particle.prototype.mouseOver = function(mouseX, mouseY, down) {

		var mousePressed = down;

		if (mouseX * mouseX < ( this.posX + (this.width / 2)) * (this.posX + (this.width / 2))
			&& mouseX * mouseX > (this.posX - (this.width / 2)) * (this.posX - (this.width / 2))
			&& mouseY * mouseY < (this.posY + (this.width / 2)) * (this.posY + (this.width / 2))
			&& mouseY * mouseY > (this.posY - (this.width / 2)) * (this.posY - (this.width / 2)) ) {

				this.over = true;
				
			if(mousePressed){
				
				this.posX = mouseX;
				this.posY = mouseY;
				this.vx = 0;
				this.vy = 0;
				this.frcX = 0;
				this.frcY = 0;
				
			}
			
		} else {
			
			this.over = false;
			
		}
		
	};
	
	function roundedRect(x, y, width, height, radius, c){

		c.beginPath();
		c.moveTo(x,y+radius);
		c.lineTo(x,y+height-radius);
		c.quadraticCurveTo(x,y+height,x+radius,y+height);
		c.lineTo(x+width-radius,y+height);
		c.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
		c.lineTo(x+width,y+radius);
		c.quadraticCurveTo(x+width,y,x+width-radius,y);
		c.lineTo(x+radius,y);
		c.quadraticCurveTo(x,y,x,y+radius);
		
//		this.ctx.noStroke();
	
	};
