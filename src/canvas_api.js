/*
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
																			*/

/**
 * Contains the source code of the Canvas API. 
 * @file canvas_api.js
 */

/**
 * Canvas API
 * @project Canvas API
 * @description A JavaScript API for working with the HTML 5 canvas tag.
 * @author Oliver Moran
 * @version 0.2
 * @timestamp
 */

/**
 * The static Canvas class.
 * @class {static} Canvas
 * @author Oliver Moran
 * @since 0.2
 */
var Canvas = new Object();
 
/**
 * Creates an instance of a Drawing and inserts a canvas tag onto the web page.
 * @constructor {protected} Canvas.Drawing
 * @param {String} name An instance name for this drawing. This will used be the ID of the HTML canvas element.
 * @param {Number} width The width in pixels of the canvas.
 * @param {Number} height The height in pixels of the canvas.
 * @param {optional String} color The background colour of the drawing. Either a CSS colour name or a hex value.
 * @return Nothing
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Drawing = function(name, width, height, color){
	
	// INITIATE TAG PROPERTIES
	
	/**
	 * The instance name of this Drawing. This is also the ID of the HTML canvas element
	 * @property {read String} Drawing.name
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.name = name;
	/**
	 * The width in pixels of this Drawing.
	 * @property {read Number} Drawing.width
	 * @see Drawing.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.width = width;
	/**
	 * The height in pixels of this Drawing.
	 * @property {read Number} Drawing.width
	 * @see Drawing.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.height = height;
	/**
	 * The background colour of the drawing. Either a CSS colour name or a hex value.
	 * @property {read String} Drawing.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	if (color != undefined) this.color = color;
	
	// WRITE THE CANVAS TAG
	
	document.writeln("<canvas id=\""+this.name+"\" style=\"background-color:"+this.color+";\" width=\""+this.width+"\" height=\""+this.height+"\"></canvas>");
	this.context = document.getElementById(this.name).getContext('2d');
	
	// MOUSE EVENTS
	
	/**
	 * The x coordinate of the position in pixels relative to the Drawing.
	 * @property {read Number} Drawing.mousex
	 * @see Drawing.mousey
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.mousex = undefined;
	/**
	 * The y coordinate of the position in pixels relative to the Drawing.
	 * @property {read Number} Drawing.mousey
	 * @see Drawing.mousex
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.mousey = undefined;

	this.context.canvas.onmouseup = function(){
		// mouse up events
	}
	this.context.canvas.onmousedown = function(){
		// mouse down events
	}
	this.context.canvas.onmousemove = function(){
		// move over events
		// mouse out events
		// update local mouse coords
	}

	// ANIMATION
	
	/**
	 * Animation related functions and properties.
	 * @object {static} Drawing.animation
	 * @see Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation = new Object();
	/**
	 * The frame rate in fames per second of animations.
	 * @property {read write Number} Drawing.animation.framerate
	 * @see Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation.framerate = 12;
	/**
	 * Starts animation (calls callback at regular intervals).
	 * @function {public static void} Drawing.animation.start
	 * @param {Function} callback A function to call on each frame of the animation
	 * @return Nothing
	 * @see Drawing.animation.framerate
	 * @see Drawing.animation.stop
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation.start = function(callback){
		this.stop();
		this.interval = setInterval(callback, 1000/this.framerate);
	}
	/**
	 * Stops animation.
	 * @function {public void} Drawing.animation.stop
	 * @return Nothing
	 * @see Drawing.animation.start
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation.stop = function(){
		clearInterval(this.interval);
	}
	
	
	// MANAGE THE SCENE
	
	this.scene = new Object(); // an object that holds the "scene"
	
	/**
	 * Adds a Palette object to the Drawing.
	 * @function {public void} Drawing.add
	 * @param {String} name An instance name for the object
	 * @param {Object} obj The object to be added
	 * @return Nothing
	 * @see Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(name, obj){
		this.scene[name] = obj;
		this.scene[name].context = this.context;
		this.scene[name].name = name;
	}
	
	/**
	 * Determines if the drawing is ready to be rendered (i.e. if the necessary images, etc. have been downloaded)
	 * @function {public Boolean} Drawing.ready
	 * @return true if the drawing is ready to be rendered otherwise false.
	 * @see Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.ready = function(){
		var c = 0;
		for (var obj in this.scene){
			for (var prop in this.scene[obj]){
				// Opera throws exceptions around instanceof, we we dance around it
				if (this.scene[obj][prop].complete != undefined && !this.scene[obj][prop].complete)
					c++; // images
				else if (this.scene[obj][prop].image && this.scene[obj][prop].image.complete != undefined && !this.scene[obj][prop].image.complete)
					c++; // fills
			}
		}
		
		return (c == 0);
	}
	
	
	/**
	 * Removes a Palette object from the Drawing. If the drawing is not ready to be rendered, this method will retry at a rate of once every 10 miliseconds.
	 * @function {public void} Drawing.remove
	 * @return Nothing
	 * @see Drawing.add
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.remove = function(name){
		delete this.scene[name];
	}
	/**
	 * Paints the Drawing.
	 * @function {public void} Drawing.draw
	 * @return Nothing
	 * @see Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.draw = function(){
		if (!this.ready()){
			// if images are no loaded them set an timeout that continually checks that they have
			var self = this;
			setTimeout(function(){
					self.draw();
				}, 10);
			return;
		}

		this.context.clearRect(0,0,this.width,this.height);
		for (var object in this.scene){
			// try {
				this.scene[object].draw();
			// } catch (err) {
			// }
		}
	}
}




/**
 * The static Library class where images and other media are stored.
 * @object {private static} Canvas.Library
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library = new Object();
Canvas.Library.images = new Array();
Canvas.Library.newImage = function(src){
	var tmpImage = new Image();
	tmpImage.src = src;

	Canvas.Library.images.push(tmpImage);
	return Canvas.Library.images[Canvas.Library.images.length-1];
}

/**
 * The static Palette class, which contains the range of drawing objects available in the Canvas API.
 * @class {static} Canvas.Palette
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette = new Object();

/**
 * The prototypical Palette Object. All Palette Objects (except Gradients) inherit these values, although some properties are reduntant for certain objects.
 * @object {static} Palette.defaults
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Object = function(){
	// DEFAULT STYLES FOR PALETTE OBJECTS
	
	/**
	 * The stroke style Pallet objects.
	 * @object {static} Palette.Object.stroke
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke = new Object();
	/**
	 * The stroke colour to be used for new Pallet objects. A CSS colour name, a hex value or a gradient.
	 * @property {read write String} Palette.Object.stroke.color
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.color = "black";
	/**
	 * The stroke width in pixels to be used for new Pallet objects.
	 * @property {read write Number} Palette.Object.stroke.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.width = 3;
	/**
	 * The stroke cap to be used for new Pallet objects. Valid values are "butt", "round" or "square".
	 * @property {read write String} Palette.Object.stroke.cap
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.cap = "butt";
	/**
	 * The way to join strokes used for new Pallet objects. Valid values are "bevel", "round" or "miter".
	 * @property {read write String} Palette.Object.stroke.join
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.join = "miter";
	/**
	 * The fill colour to be used for new Pallet objects. Either a CSS colour name, a hex colour value or a gradient.
	 * @property {read write String} Palette.Object.fill
	 * @seePalette.Gradient
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.fill = "white";
	/**
	 * Whether to closed (true) or leave open (false) new Palette objects.
	 * @property {read write Boolean} Palette.Object.close
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.close = false;
	/**
	 * The rotation of the Palette object in degrees around its origin.
	 * @property {read write Number} Palette.Object.rotation
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.rotation = 0;
	/**
	 * The location of the Palette object's orgin relative to the objects natural origin.
	 * @object {static} Palette.Object.origin
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin = new Object();
	/**
	 * The x coordinate of the Palette object's orgin relative to the objects natural origin.
	 * @property {read write Number} Palette.Object.origin.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin.x = 0;
	/**
	 * The y coordinate of the Palette object's orgin relative to the objects natural origin.
	 * @property {read write Number} Palette.Object.origin.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin.y = 0;
	/**
	 * The shadow to be applied to the Palette object.
	 * @object {static} Palette.Object.shadow
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow = new Object();
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.color = "transparent";
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.x = 5;
	/**
	 * The y offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.y = 5;
	/**
	 * The blur radius of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.blur
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.blur = 10;
	/**
	 * The transparancy (alpha) of the Palette object ranging from 0 (fully transparent) to 100 (fully opaque).
	 * @property {read write Number} Palette.Object.alpha
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.alpha = 100;
	/**
	 * The start angle of a Circle object in degrees.
	 * @property {read write Number} Palette.Object.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.start = 0;
	/**
	 * The end angle of a Circle object in degrees.
	 * @property {read write Number} Palette.Object.end
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.start = 360;
	/**
	 * Whether a Circle object is drawn clockwise (true) or anti-clockwise (false).
	 * @property {read write Boolean} Palette.Object.clockwise
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.clockwise = true;
	/**
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.font
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.font = "42px Helvetica,Verdana,Arial,sans-serif";
	/** The alignent of the Text object. Valid values are "top", "hanging", "middle", "alphabetic", "ideographic", "bottom". The default is "alphabetic".
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.align
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.align = "alphabetic";
	/** The baseline alignment of a Text object. Valid values are "start", "end", "left", "right", "center". The default is "start".
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.baseline
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.align = "start";
	
	
	
	
	
	



	/**
	 * The horizontal scaling to be applied to a Pallet object. 100 is original size. 50 is half size. 200 is double size.
	 * @property {read write Number} Palette.Object.xscale
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.xscale = 100;
	/**
	 * The vertical scaling to be applied to a Pallet object. 100 is original size. 50 is half size. 200 is double size.
	 * @property {read write Number} Palette.Object.yscale
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.yscale = 100;




	// COMMON METHODS (PRIVATE)
	
	this.setStyle = function(){
		if (this.alpha < 0 || this.alpha > 100 || isNaN(this.alpha) || Math.round(this.alpha) == Infinity) {
			this.alpha = Canvas.Palette.Object.alpha;
		}
		
		this.context.strokeStyle = this.stroke.color;
		this.context.lineWidth = this.stroke.width;
	
		if (this.fill instanceof Canvas.Palette.Gradient || 
			this.fill instanceof Canvas.Palette.Radial || 
			this.fill instanceof Canvas.Palette.Pattern){
				this.context.fillStyle = this.fill.draw(this);
		} else {
			this.context.fillStyle = this.fill;
		}
		
		this.context.lineCap = this.stroke.cap;
		this.context.lineJoin = this.stroke.join;
		
		this.context.shadowColor = this.shadow.color;
		this.context.shadowOffsetX = this.shadow.x;
		this.context.shadowOffsetY = this.shadow.y;  
		this.context.shadowBlur = this.shadow.blur;
		
		this.context.globalAlpha = this.alpha/100;
		
		if (this instanceof Canvas.Palette.Text){
			this.context.font = this.font;
			this.context.textAlign = this.align;
			this.context.textBaseline = this.baseline;
		}
	}

};

/**
 * Creates a Line.
 * @constructor {public} Palette.Line
 * @param {Number} x1 The x coordinate of the first point in the Line in pixels.
 * @param {Number} y1 The y coordinate of the first point in the Line in pixels.
 * @param {Number} x2 The x coordinate of the second point in the Line in pixels.
 * @param {Number} y2 The y coordinate of the second point in the Line in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Line = function (x1, y1, x2, y2){
	if ((x1 && y1 && x2 && y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		// The private draw function
		this.draw = function(){
			this.setStyle();
		
			this.context.translate(this.x1+this.origin.x, this.y1+this.origin.y)
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.beginPath();
			this.context.moveTo(-this.origin.x, -this.origin.y);
			this.context.lineTo((this.x2-this.x1)-this.origin.x, (this.y2-this.y1)-this.origin.y);
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.x1+this.origin.x), -(this.y1+this.origin.y));
		}
	}
}
Canvas.Palette.Line.prototype = new Canvas.Palette.Object();

/**
 * Creates a Polygon.
 * @constructor {public} Palette.Polygon
 * @param {optional Number} x The x coordinate of the first point in the Line in pixels.
 * @param {optional Number} y The y coordinate of the first point in the Line in pixels.
 * @param {optional Number} ... Any number of pairs or x, y coordinates
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Polygon = function (){
	if (arguments.length%2 == 0){
		this.points = new Array();
		this.addPoint = function(x, y){
			var point = new Object();
			point.x = x;
			point.y = y;
			this.points.push(point);
		}
		for (var i=0; i<arguments.length; i+=2){
			this.addPoint(arguments[i], arguments[i+1]);
		}
		
		this.draw = function(){
			if (this.points.length < 2) return; // get out of here if we don't have enough points
			
			this.setStyle();
		
			this.context.translate(this.points[0].x+this.origin.x, this.points[0].y+this.origin.y)
			this.context.rotate(this.rotation * Math.PI/180)
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.beginPath();
			this.context.moveTo(-this.origin.x, -this.origin.y);
			for (var i=1; i<this.points.length; i++){
				this.context.lineTo((this.points[i].x-this.points[0].x)-this.origin.x, (this.points[i].y-this.points[0].y)-this.origin.y);
			}
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.points[0].x+this.origin.x), -(this.points[0].y+this.origin.y));
		}
	}
}
Canvas.Palette.Polygon.prototype = new Canvas.Palette.Object();


/**
 * Creates a Rectangle.
 * @constructor {public} Palette.Rectangle
 * @param {Number} x The x coordinate of the top left corder of the Rectangle in pixels.
 * @param {Number} y The x coordinate of the top left corder of the Rectangle in pixels.
 * @param {Number} width The width of the Rectangle in pixels.
 * @param {Number} height The height of the Rectangle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Rectangle = function(x, y, width, height){
	if ((x && y && width && height) != undefined){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.draw = function(){
			this.setStyle();
		
			var w2 = this.width/2;
			var h2 = this.height/2;
			var o_x = this.x + w2 + this.origin.x;
			var o_y = this.y + h2 + this.origin.y;
		
			this.context.translate(o_x, o_y)
			this.context.rotate(this.rotation * Math.PI/180)
			this.context.scale(this.xscale/100, this.yscale/100);
		
			this.context.fillRect(-(w2+this.origin.x), -(h2+this.origin.y), this.width, this.height);
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.strokeRect(-(w2+this.origin.x), -(h2+this.origin.y), this.width, this.height);
		
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1)
			this.context.translate(-o_x, -o_y)
		}
	}
}
Canvas.Palette.Rectangle.prototype = new Canvas.Palette.Object();


/**
 * Creates a Circle.
 * @constructor {public} Palette.Circle
 * @param {Number} x The x coordinate of the centre point the Circle in pixels.
 * @param {Number} y The y coordinate of the centre point the Circle in pixels.
 * @param {Number} radius The radius of the circle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Circle = function(x, y, radius){
	if ((x && y && radius) != undefined){
		this.x = x;
		this.y = y;
		this.radius = radius;
		
		this.draw = function(){
			this.setStyle();
		
			this.context.translate(this.x+this.origin.x, this.y+this.origin.y)
			this.context.rotate(this.rotation * Math.PI/180)
			this.context.scale(this.xscale/100, this.yscale/100);
		
			this.context.beginPath();
			this.context.arc(-this.origin.x, -this.origin.y, this.radius, this.start, this.end * Math.PI/180, this.clockwise);
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1)
			this.context.translate(-(this.x+this.origin.x), -(this.y+this.origin.y))
		}
	}
}
Canvas.Palette.Circle.prototype = new Canvas.Palette.Object();


/**
 * Creates an Arc. An Arc is defined by two intersecting lines defined by three co-ordinates. These are one points from each line and the point of intersection of the two lines. A portion of a circle of a defined radious is drawn that is tangental to two lines. The Arc is completed by two lines running  along each lines from the points of tangent to the point given from each line.
 * @constructor {public} Palette.Arc
 * @param {Number} x1 The x coordinate of a point on the first line in pixels.
 * @param {Number} y1 The y coordinate of a point on the first line in pixels.
 * @param {Number} x2 The x coordinate of the point where the first and second line intersect in pixels.
 * @param {Number} y2 The x coordinate of the point where the first and second line intersect in pixels.
 * @param {Number} x3 The x coordinate of a point on the second line in pixels.
 * @param {Number} y3 The y coordinate of a point on the second line in pixels.
 * @param {Number} radius The radius of the circle that forms the arc in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Arc = function(x1, y1, x2, y2, x3, y3, radius){
	if ((x1 && y1 && x2 && y2 && x3 && y3 && radius) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.radius = radius;
		
		this.draw = function(){
			this.setStyle();
			
			var o_x = (this.x1 + this.x3)/2 + this.origin.x;
			var o_y = (this.y1 + this.y3)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
		
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.arcTo(this.x2-o_x, this.y2-o_y, this.x3-o_x, this.y3-o_y, this.radius); // Create an arc.
			this.context.lineTo(this.x3-o_x, this.y3-o_y);
			
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);
		}
	}
}
Canvas.Palette.Arc.prototype = new Canvas.Palette.Object();


/**
 * Creates an cubic Bézier curve.
 * @constructor {public} Palette.Bezier
 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
 * @param {Number} c_x1 The x coordinate of the first control point of the curve in pixels.
 * @param {Number} c_y1 The y coordinate of the first control point of the curve in pixels.
 * @param {Number} c_x2 The x coordinate of the second control point of the curve in pixels.
 * @param {Number} c_y2 The y coordinate of the second control point of the curve in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Bezier = function(x1, y1, x2, y2, c_x1, c_y1, c_x2, c_y2){
	if ((x1 && y1 && x2 && y2 && c_x1 && c_y1 && c_x2 && c_y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x1 = c_x1;
		this.c_y1 = c_y1;
		this.c_x2 = c_x2;
		this.c_y2 = c_y2;
		
		this.draw = function(){
			this.setStyle();
			
			var o_x = (this.x1 + this.x2)/2 + this.origin.x;
			var o_y = (this.y1 + this.y2)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.bezierCurveTo(this.c_x1-o_x, this.c_y1-o_y, this.c_x2-o_x, this.c_y2-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);	
		}
	}
}
Canvas.Palette.Bezier.prototype = new Canvas.Palette.Object();


/**
 * Creates an quadratic Bézier curve.
 * @constructor {public} Palette.Quadratic
 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
 * @param {Number} c_x1 The x coordinate of the first control point of the curve in pixels.
 * @param {Number} c_y1 The y coordinate of the first control point of the curve in pixels.
 * @param {Number} c_x2 The x coordinate of the second control point of the curve in pixels.
 * @param {Number} c_y2 The y coordinate of the second control point of the curve in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Quadratic = function(x1, y1, x2, y2, c_x, c_y){
	if ((x1 && y1 && x2 && y2 && c_x && c_y) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x = c_x;
		this.c_y = c_y;
		
		this.draw = function(){
			this.setStyle();
			
			var o_x = (this.x1 + this.x2)/2 + this.origin.x;
			var o_y = (this.y1 + this.y2)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.quadraticCurveTo(this.c_x-o_x, this.c_y-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);	
		}
	}
}
Canvas.Palette.Quadratic.prototype = new Canvas.Palette.Object();


/**
 * Creates an Image from a source file (.png, .gif, .svg, .jpg, etc.).
 * @constructor {public} Palette.Image
 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Image = function(x, y, src){
	if ((x && y && src) != undefined){
		this.x = x;
		this.y = y;
		this.image = Canvas.Library.newImage(src);
		
		this.draw = function(){
			this.setStyle();
			
			this.context.translate(this.x+this.origin.x, this.y+this.origin.y);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.drawImage(this.image, -this.origin.x, -this.origin.y)
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.x+this.origin.x), -(this.y+this.origin.y));
		}
	}
}
Canvas.Palette.Image.prototype = new Canvas.Palette.Object();



/**
 * Writes a text string on to the canvas
 * @constructor {public} Palette.Text
 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Text = function(x, y, text){
	if ((x && y && text) != undefined){
		this.x = x;
		this.y = y;
		this.text = text;
		
		this.fill = this.stroke.color;
		this.stroke.color = "transparent";
		
		this.draw = function(){
			this.setStyle();
			
			this.context.translate(this.x+this.origin.x, this.y+this.origin.y);
			this.context.rotate(this.rotation * Math.PI/180);
			this.context.scale(this.xscale/100, this.yscale/100);
			
			this.context.fillText(this.text, -this.origin.x, -this.origin.y);
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.strokeText(this.text, -this.origin.x, -this.origin.y);
			
			this.context.scale(100/this.xscale, 100/this.yscale);
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.x+this.origin.x), -(this.y+this.origin.y));
		}
		
		
		/**
		 * Returns the width of the text in CSS pixels.
		 * @function {public Number} Palette.Text.width
		 * @return The width of the text in CSS pixels.
		 * @author Oliver Moran
		 * @since 0.2
		 */
	 	this.width = function(){
			this.setStyle();

			this.context.scale(this.xscale/100, this.yscale/100);
			var textMetrics = this.context.measureText(this.text);
			this.context.scale(100/this.xscale, 100/this.yscale);
			
			return textMetrics.width;
		}
	}
}
Canvas.Palette.Text.prototype = new Canvas.Palette.Object();


/**
 * Creates an linear gradient for use in fills.
 * @constructor {public} Palette.Gradient
 * @param {Number} x1 The x coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} y1 The y coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} x2 The x coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} y2 The y coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Gradient = function (x1, y1, x2, y2){
	if ((x1 && y1 && x2 && y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		this.draw = function(theObject){
			var x1 = this.x1 - theObject.origin.x;
			var y1 = this.y1 - theObject.origin.y;
			var x2 = this.x2 - theObject.origin.x;
			var y2 = this.y2 - theObject.origin.y;
			
			var gradient = theObject.context.createLinearGradient(x1, y1, x2, y2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		}
	}
	
	this.stops = new Array();
	this.addStop = function(offset, color){
		var stop = new Object();
		stop.offset = offset;
		stop.color = color;
		this.stops.push(stop);
	}
}

/**
 * Creates an radial gradient for use in fills.
 * @constructor {public} Palette.Radial
 * @param {optional Number} x1 The x coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} y1 The y coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} radius1 The radius of the starting circle in pixels.
 * @param {optional Number} x2 The x coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} y2 The y coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
 * @param {Number} radius2 The radius of the ending circle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Radial = function (x1, y1, radius1, x2, y2, radius2){
	if (x1 != undefined && (y1 && radius1 && x2 && y2 && radius2) == undefined){
		radius2 = x1;
		x1 = 0;
		y1 = 0;
		x2 = 0;
		y2 = 0;
		radius1 = 0;
	}
	
	if ((x1 && y1 && radius1 && x2 && y2 && radius2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.radius1 = radius1;
		this.x2 = x2;
		this.y2 = y2;
		this.radius2 = radius2;
		
		this.draw = function(theObject){
			var x1 = this.x1 - theObject.origin.x;
			var y1 = this.y1 - theObject.origin.y;
			var x2 = this.x2 - theObject.origin.x;
			var y2 = this.y2 - theObject.origin.y;
			
			var gradient = theObject.context.createRadialGradient(x1, y1, this.radius1, x2, y2, this.radius2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		}
	}
	
	this.stops = new Array();
	this.addStop = function(offset, color){
		var stop = new Object();
		stop.offset = offset;
		stop.color = color;
		this.stops.push(stop);
	}
}

/**
 * Creates an radial gradient for use in fills.
 * @constructor {public} Palette.Pattern
 * @param {String} src The URL of an image file.
 * @param {optional String} repeat How the patter should repeat. Valid values are repeat, repeat-x, repeat-y and no-repeat. Defaults to repeat.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Pattern = function (src, repeat){
	if (repeat == undefined) repeat = "repeat";

	if ((src && repeat) != undefined){
		this.image = Canvas.Library.newImage(src);
		this.repeat = repeat;
		
		this.draw = function(theObject){
			var gradient = theObject.context.createPattern(this.image, this.repeat);
			return gradient;
		}
	}
}