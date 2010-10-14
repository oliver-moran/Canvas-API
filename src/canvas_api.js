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
Canvas.Drawing = function(_name, _width, _height, _color){
	
	// INITIATE TAG PROPERTIES
	
	/**
	 * The instance name of this Drawing. This is also the ID of the HTML canvas element
	 * @property {read String} Drawing.name
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.name = _name;
	/**
	 * The width in pixels of this Drawing.
	 * @property {read Number} Drawing.width
	 * @see Drawing.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.width = _width;
	/**
	 * The height in pixels of this Drawing.
	 * @property {read Number} Drawing.width
	 * @see Drawing.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.height = _height;
	/**
	 * The background colour of the drawing. Either a CSS colour name or a hex value.
	 * @property {read String} Drawing.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	if (_color != undefined) this.color = _color;
	
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
	this.animation.start = function(_callback){
		this.stop();
		this.interval = setInterval(_callback, 1000/this.framerate);
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
	 * Removes a Palette object from the Drawing.
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
		if (!Canvas.Library.ready()){
			// if images are no loaded them set an timeout that continually checks that they have
			var _self = this;
			setTimeout(function(){
					_self.draw();
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
Canvas.Library.imagesLoaded = 0;
Canvas.Library.newImage = function(src){
	var tmpImage = new Image();
	// doesn't work on Opera or FF
	tmpImage.onload = function(){
		Canvas.Library.imagesLoaded++;
	}
	// tmpImage.onabort
	// tmpImage.onerror
	tmpImage.src = src;

	Canvas.Library.images.push(tmpImage);
	return Canvas.Library.images[Canvas.Library.images.length-1];
}
Canvas.Library.ready = function(){
	return (Canvas.Library.images.length == Canvas.Library.imagesLoaded);
}


/**
 * The static Palette class, which contains the range of drawing objects available in the Canvas API.
 * @class {static} Canvas.Palette
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette = new Object();

/**
 * The default styles for new Palette objects.
 * @object {static} Palette.defaults
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Object = function(){
	/**
	 * The default stroke style Pallet objects.
	 * @object {static} Palette.defaults.stroke
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke = new Object();
	/**
	 * The default stroke colour to be used for new Pallet objects. A CSS colour name, a hex value or a gradient.
	 * @property {read write String} Palette.defaults.stroke.color
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.color = "MidnightBlue";
	/**
	 * The default stroke width in pixels to be used for new Pallet objects.
	 * @property {read write Number} Palette.defaults.stroke.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.width = 3;
	/**
	 * The default stroke cap to be used for new Pallet objects. Valid values are "butt", "round" or "square".
	 * @property {read write String} Palette.defaults.stroke.cap
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.cap = "butt";
	/**
	 * The default fill colour to be used for new Pallet objects. Either a CSS colour name, a hex colour value or a gradient.
	 * @property {read write String} Palette.defaults.fill
	 * @seePalette.Gradient
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.fill = "LightGrey";
	/**
	 * Whether to closed (true) or leave open (false) new Palette objects.
	 * @property {read write Boolean} Palette.defaults.close
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.close = false;
	/**
	 * The rotation of the Palette object in degrees around its origin.
	 * @property {read write Number} Palette.defaults.rotation
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.rotation = 0;
	/**
	 * The location of the Palette object's orgin relative to the objects natural origin.
	 * @object {static} Palette.defaults.origin
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin = new Object();
	/**
	 * The x coordinate of the Palette object's orgin relative to the objects natural origin.
	 * @property {read write Number} Palette.defaults.origin.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin.x = 0;
	/**
	 * The y coordinate of the Palette object's orgin relative to the objects natural origin.
	 * @property {read write Number} Palette.defaults.origin.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.origin.y = 0;
	/**
	 * The shadow to be applied to the Palette object.
	 * @object {static} Palette.defaults.shadow
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow = new Object();
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.defaults.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.defaults.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.color = "transparent";
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.defaults.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.x = 5;
	/**
	 * The y offset of the Palette object's shadow.
	 * @property {read write Number} Palette.defaults.shadow.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.y = 5;
	/**
	 * The blur radius of the Palette object's shadow.
	 * @property {read write Number} Palette.defaults.shadow.blur
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.blur = 10;
	/**
	 * The transparancy (alpha) of the Palette object ranging from 0 (fully transparent) to 100 (fully opaque).
	 * @property {read write Number} Palette.defaults.alpha
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.alpha = 100;
};

Canvas.Palette.common = new Object();
Canvas.Palette.common.setDefaults = function(_that){
	var defs = new Canvas.Palette.Object();
	for (var _default in defs) _that[_default] = defs[_default];
	// _that.stroke = new Object();

	if (_that instanceof Canvas.Palette.Circle){
		_that.start = 0;
		_that.end = 360;
		_that.clockwise = true;
	}
}
Canvas.Palette.common.setStyle = function(_that){
	Canvas.Palette.common.limitStyles(_that);
	
	_that.context.strokeStyle = _that.stroke.color;
	_that.context.lineWidth = _that.stroke.width;

	var _fill = _that.fill;
	if (_fill instanceof Canvas.Palette.Gradient || _fill instanceof Canvas.Palette.Radial || _fill instanceof Canvas.Palette.Pattern){
		_fill._parent = _that;
		_fill = _fill.draw();
		delete _fill._parent;
	}
	_that.context.fillStyle = _fill;

	_that.context.lineCap = _that.stroke.cap;
	
	_that.context.shadowColor = _that.shadow.color;
	_that.context.shadowOffsetX = _that.shadow.x;
	_that.context.shadowOffsetY = _that.shadow.y;  
	_that.context.shadowBlur = _that.shadow.blur;
	
	_that.context.globalAlpha = _that.alpha/100;
}
Canvas.Palette.common.limitStyles = function(_that){
	if (_that.alpha < 0 || _that.alpha > 100 || isNaN(_that.alpha) || Math.round(_that.alpha) == Infinity) {
		_that.alpha = Canvas.Palette.Object.alpha;
	}
}

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
 
Canvas.Palette.Line = function (_x1, _y1, _x2, _y2){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x1 && _y1 && _x2 && _y2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
		
			this.context.translate(this.x1+this.origin.x, this.y1+this.origin.y)
			this.context.rotate(this.rotation * Math.PI/180)
			
			this.context.beginPath();
			this.context.moveTo(-this.origin.x, -this.origin.y);
			this.context.lineTo((this.x2-this.x1)-this.origin.x, (this.y2-this.y1)-this.origin.y);
			this.context.stroke();
			
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.x1+this.origin.x), -(this.y1+this.origin.y));
		}
	}
}

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
Canvas.Palette.Rectangle = function(_x, _y, _width, _height){
	Canvas.Palette.common.setDefaults(this);

	if ((_x && _y && _width && _height) != undefined){
		this.x = _x;
		this.y = _y;
		this.width = _width;
		this.height = _height;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
		
			var _w2 = this.width/2;
			var _h2 = this.height/2;
			var _o_x = this.x + _w2 + this.origin.x;
			var _o_y = this.y + _h2 + this.origin.y;
		
			this.context.translate(_o_x, _o_y)
			this.context.rotate(this.rotation * Math.PI/180)
		
			this.context.fillRect(-(_w2+this.origin.x), -(_h2+this.origin.y), this.width, this.height);
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.strokeRect(-(_w2+this.origin.x), -(_h2+this.origin.y), this.width, this.height);
		
			this.context.rotate(this.rotation * Math.PI/180 * -1)
			this.context.translate(-_o_x, -_o_y)
		}
	}
}

/**
 * Creates a Circle.
 * @constructor {public} Palette.Circle
 * @param {Number} x The x coordinate of the centre point the Circle in pixels.
 * @param {Number} y The y coordinate of the centre point the Circle in pixels.
 * @param {Number} radius The radius of the circle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Circle = function(_x, _y, _radius){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x && _y && _radius) != undefined){
		this.x = _x;
		this.y = _y;
		this.radius = _radius;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
		
			this.context.translate(this.x+this.origin.x, this.y+this.origin.y)
			this.context.rotate(this.rotation * Math.PI/180)
		
			this.context.beginPath();
			this.context.arc(-this.origin.x, -this.origin.y, this.radius, this.start, this.end * Math.PI/180, this.clockwise);
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.rotate(this.rotation * Math.PI/180 * -1)
			this.context.translate(-(this.x+this.origin.x), -(this.y+this.origin.y))
		}
	}
}

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
Canvas.Palette.Arc = function(_x1, _y1, _x2, _y2, _x3, _y3, _radius){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x1 && _y1 && _x2 && _y2 && _x3 && _y3 && _radius) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		this.x3 = _x3;
		this.y3 = _y3;
		this.radius = _radius;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
			
			var o_x = (this.x1 + this.x3)/2 + this.origin.x;
			var o_y = (this.y1 + this.y3)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
		
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.arcTo(this.x2-o_x, this.y2-o_y, this.x3-o_x, this.y3-o_y, this.radius); // Create an arc.
			this.context.lineTo(this.x3-o_x, this.y3-o_y);
			
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);
		}
	}
}

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
Canvas.Palette.Bezier = function(_x1, _y1, _x2, _y2, _c_x1, _c_y1, _c_x2, _c_y2){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x1 && _y1 && _x2 && _y2 && _c_x1 && _c_y1 && _c_x2 && _c_y2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		this.c_x1 = _c_x1;
		this.c_y1 = _c_y1;
		this.c_x2 = _c_x2;
		this.c_y2 = _c_y2;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
			
			var o_x = (this.x1 + this.x2)/2 + this.origin.x;
			var o_y = (this.y1 + this.y2)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
			
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.bezierCurveTo(this.c_x1-o_x, this.c_y1-o_y, this.c_x2-o_x, this.c_y2-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);	
		}
	}
}

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
Canvas.Palette.Quadratic = function(_x1, _y1, _x2, _y2, _c_x, _c_y){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x1 && _y1 && _x2 && _y2 && _c_x && _c_y) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		this.c_x = _c_x;
		this.c_y = _c_y;
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
			
			var o_x = (this.x1 + this.x2)/2 + this.origin.x;
			var o_y = (this.y1 + this.y2)/2 + this.origin.y;
			
			this.context.translate(o_x, o_y);
			this.context.rotate(this.rotation * Math.PI/180);
			
			this.context.beginPath();
			this.context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			this.context.quadraticCurveTo(this.c_x-o_x, this.c_y-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) this.context.closePath();
			this.context.fill();
			if (this.fill != "transparent") this.context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			this.context.stroke();
			
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-o_x, -o_y);	
		}
	}
}

/**
 * Creates an Image from a source file (.png, .gif, .svg, .jpg, etc.).
 * @constructor {public} Palette.Image
 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Image = function(_x, _y, _src){
	Canvas.Palette.common.setDefaults(this);
	
	if ((_x && _y && _src) != undefined){
		this.x = _x;
		this.y = _y;
		this.image = Canvas.Library.newImage(_src);
		
		this.draw = function(){
			Canvas.Palette.common.setStyle(this);
			
			this.context.translate(this.x+this.origin.x, this.y+this.origin.y);
			this.context.rotate(this.rotation * Math.PI/180);
			
			this.context.drawImage(this.image, -this.origin.x, -this.origin.y)
			
			this.context.rotate(this.rotation * Math.PI/180 * -1);
			this.context.translate(-(this.x+this.origin.x), -(this.y+this.origin.y));
		}
	}
}

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
Canvas.Palette.Gradient = function (_x1, _y1, _x2, _y2){
	if ((_x1 && _y1 && _x2 && _y2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		
		this.draw = function(){
			var _x1 = this.x1 - this._parent.origin.x;
			var _y1 = this.y1 - this._parent.origin.y;
			var _x2 = this.x2 - this._parent.origin.x;
			var _y2 = this.y2 - this._parent.origin.y;
			
			var _gradient = this._parent.context.createLinearGradient(_x1, _y1, _x2, _y2);
			for (var stop in this.stops)
				_gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return _gradient;
		}
	}
	
	this.stops = new Array();
	this.addStop = function(_offset, _color){
		var stop = new Object();
		stop.offset = _offset;
		stop.color = _color;
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
Canvas.Palette.Radial = function (_x1, _y1, _radius1, _x2, _y2, _radius2){
	if (_x1 != undefined && (_y1 && _radius1 && _x2 && _y2 && _radius2) == undefined){
		_radius2 = _x1;
		_x1 = 0;
		_y1 = 0;
		_x2 = 0;
		_y2 = 0;
		_radius1 = 0;
	}
	
	if ((_x1 && _y1 && _radius1 && _x2 && _y2 && _radius2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.radius1 = _radius1;
		this.x2 = _x2;
		this.y2 = _y2;
		this.radius2 = _radius2;
		
		this.draw = function(){
			var _x1 = this.x1 - this._parent.origin.x;
			var _y1 = this.y1 - this._parent.origin.y;
			var _x2 = this.x2 - this._parent.origin.x;
			var _y2 = this.y2 - this._parent.origin.y;
			
			var _gradient = this._parent.context.createRadialGradient(_x1, _y1, this.radius1, _x2, _y2, this.radius2);
			for (var stop in this.stops)
				_gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return _gradient;
		}
	}
	
	this.stops = new Array();
	this.addStop = function(_offset, _color){
		var stop = new Object();
		stop.offset = _offset;
		stop.color = _color;
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
Canvas.Palette.Pattern = function (_src, _repeat){
	if (_repeat == undefined) _repeat = "repeat";

	if ((_src && _repeat) != undefined){
		this.image = Canvas.Library.newImage(_src);
		this.repeat = _repeat;
		
		this.draw = function(){
			var _gradient = this._parent.context.createPattern(this.image, this.repeat);
			return _gradient;
		}
	}
}