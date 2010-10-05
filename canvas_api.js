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
	 * The instance name of this drawing. This is also the ID of the HTML canvas element
	 * @property {read String} Canvas.Drawing.name
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.name = _name;
	/**
	 * The width in pixels of this drawing.
	 * @property {read Number} Canvas.Drawing.width
	 * @see height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.width = _width;
	/**
	 * The height in pixels of this drawing.
	 * @property {read Number} Canvas.Drawing.width
	 * @see width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.height = _height;
	/**
	 * The background colour of the drawing. Either a CSS colour name or a hex value.
	 * @property {read String} Canvas.Drawing.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	if (_color != undefined) this.color = _color;
	
	// WRITE THE CANVAS TAG
	
	document.writeln("<canvas id=\""+this.name+"\" style=\"background-color:"+this.color+";\" width=\""+this.width+"\" height=\""+this.height+"\"></canvas>");
	this.context = document.getElementById(this.name).getContext('2d');


	// ANIMATION
	
	this.animation = new Object();
	/**
	 * The frame rate in fames per second of animations.
	 * @property {read write Number} Canvas.Drawing.animation.framerate
	 * @see Canvas.Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation.framerate = 12;
	/**
	 * Starts animation (calls callback at regular intervals).
	 * @function {public static void} Canvas.Drawing.animation.start
	 * @param {Function} callback A function to call on each frame of the animation
	 * @return Nothing
	 * @see Canvas.Drawing.animation.framerate
	 * @see Canvas.Drawing.animation.stop
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.animation.start = function(_callback){
		this.stop();
		this.interval = setInterval(_callback, 1000/this.framerate);
	}
	/**
	 * Stops animation.
	 * @function {public void} Canvas.Drawing.animation.stop
	 * @return Nothing
	 * @see Canvas.Drawing.animation.start
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
	 * @function {public void} Canvas.Drawing.add
	 * @param {String} name An instance name for the object
	 * @param {Object} obj The object to be added
	 * @return Nothing
	 * @see Canvas.Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(name, obj){
		this.scene[name] = obj;
		this.scene[name].context = this.context;
	}
	/**
	 * Removes a Palette object from the Drawing.
	 * @function {public void} Canvas.Drawing.add
	 * @return Nothing
	 * @see Canvas.Drawing.add
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.remove = function(name){
		delete this.scene[name];
	}
	/**
	 * Paints the Drawing.
	 * @function {public void} Canvas.Drawing.draw
	 * @return Nothing
	 * @see Canvas.Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.draw = function(){
		this.context.clearRect(0,0,this.width,this.height);
		for (var object in this.scene){
			this.scene[object].draw();
		}
	}
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
 * @object {static} Canvas.Palette.defaults
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.defaults = new Object();
/**
 * The default stroke style for new Palette objects.
 * @object {public} Canvas.Palette.defaults.stroke
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.defaults.stroke = new Object();
/**
 * The default stroke colour to be used for new Pallet objects. A CSS colour name, a hex value or a gradient.
 * @property {read write String} Canvas.Palette.defaults.stroke.color
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.defaults.stroke.color = "MidnightBlue";
/**
 * The default stroke width in pixels to be used for new Pallet objects.
 * @property {read write Number} Canvas.Palette.defaults.stroke.width
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.defaults.stroke.width = 3;
/**
 * The default stroke cap to be used for new Pallet objects. Valid values are "butt", "round" or "squate".
 * @property {read write String} Canvas.Palette.defaults.stroke.cap
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.defaults.stroke.cap = "butt";
/**
 * The default fill colour to be used for new Pallet objects. Either a CSS colour name, a hex colour value or a gradient.
 * @property {read write String} Canvas.Palette.defaults.fill
 * @see Canvas.Palette.Gradient
 * @author Oliver Moran
 * @since 0.2
 */
 Canvas.Palette.defaults.fill = "LightGrey";
/**
 * Whether to closed (true) or leave open (false) new Palette objects.
 * @property {read write Boolean} Canvas.Palette.defaults.close
 * @author Oliver Moran
 * @since 0.2
 */
 Canvas.Palette.defaults.close = false;

Canvas.Palette.common = new Object();
Canvas.Palette.common.setDefaults = function(_that){
	for (var _default in Canvas.Palette.defaults) _that[_default] = Canvas.Palette.defaults[_default];

	if (_that instanceof Canvas.Palette.Circle){
		_that.start = 0;
		_that.end = 360;
		_that.clockwise = true;
	}
}
Canvas.Palette.common.setStyle = function(_that){
	_that.context.strokeStyle = _that.stroke.style;
	_that.context.lineWidth = _that.stroke.width;

	var _fill = _that.fill;
	if (_fill instanceof Canvas.Palette.Gradient){
		_fill._parent = _that;
		_fill = _fill.draw();
		delete _fill._parent;
	}
	_that.context.fillStyle = _fill;

	_that.context.lineCap = _that.stroke.cap;
}


/**
 * Creates a Line.
 * @constructor {public} Canvas.Palette.Line
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
	}
}
Canvas.Palette.Line.prototype.draw = function(){
	Canvas.Palette.common.setStyle(this);

	this.context.beginPath();
	this.context.moveTo(this.x1, this.y1);
	this.context.lineTo(this.x2, this.y2);
	this.context.stroke();
}

/**
 * Creates a Rectangle.
 * @constructor {public} Canvas.Palette.Rectangle
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
	}
}
Canvas.Palette.Rectangle.prototype.draw = function(){
	Canvas.Palette.common.setStyle(this);

	this.context.fillRect(this.x, this.y, this.width, this.height);
	this.context.strokeRect(this.x, this.y, this.width, this.height);
}

/**
 * Creates a Circle.
 * @constructor {public} Canvas.Palette.Circle
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
	}
}
Canvas.Palette.Circle.prototype.draw = function(){
	Canvas.Palette.common.setStyle(this);
	
	this.context.beginPath();
	this.context.arc(this.x, this.y, this.radius, this.start, this.end * Math.PI/180, this.clockwise);
	if (this.close == true) this.context.closePath();
	this.context.fill();
	this.context.stroke();
}

/**
 * Creates an Arc. An Arc is defined by two intersecting lines defined by three co-ordinates. These are one points from each line and the point of intersection of the two lines. A portion of a circle of a defined radious is drawn that is tangental to two lines. The Arc is completed by two lines running  along each lines from the points of tangent to the point given from each line.
 * @constructor {public} Canvas.Palette.Arc
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
	}
}
Canvas.Palette.Arc.prototype.draw = function(){
	Canvas.Palette.common.setStyle(this);
	
	this.context.beginPath();
   	this.context.moveTo(this.x1, this.y1);   // Same starting point as above.
    this.context.arcTo(this.x2, this.y2, this.x3, this.y3, this.radius); // Create an arc.
	this.context.lineTo(this.x3, this.y3);
	
	if (this.close == true) this.context.closePath();
	this.context.fill();
	this.context.stroke();
}

/**
 * Creates an Bézier curve.
 * @constructor {public} Canvas.Palette.Bezier
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
	
	if ((_x1 && _y1 && _x2 && _y2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
		this.c_x1 = _c_x1;
		this.c_y1 = _c_y1;
		this.c_x2 = _c_x2;
		this.c_y2 = _c_y2;
	}
}
Canvas.Palette.Bezier.prototype.draw = function(){
	Canvas.Palette.common.setStyle(this);
	
	this.context.beginPath();
   	this.context.moveTo(this.x1, this.y1);   // Same starting point as above.
    this.context.bezierCurveTo(this.c_x1, this.c_y1, this.c_x2, this.c_y2, this.x2, this.y2); // Create an arc.
	if (this.close == true) this.context.closePath();
	this.context.fill();
	this.context.stroke();
}

/**
 * Creates an Gradient for use in fills.
 * @constructor {public} Canvas.Palette.Gradient
 * @param {Number} x1 The x coordinate of the start point of the gradient in pixels relative to the Palette object being filled.
 * @param {Number} y1 The y coordinate of the start point of the gradient in pixels relative to the Palette object being filled.
 * @param {Number} x2 The x coordinate of the end point of the gradient in pixels relative to the Palette object being filled.
 * @param {Number} y2 The y coordinate of the end point of the gradient in pixels relative to the Palette object being filled.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Gradient = function (_x1, _y1, _x2, _y2){
	if ((_x1 && _y1 && _x2 && _y2) != undefined){
		this.x1 = _x1;
		this.y1 = _y1;
		this.x2 = _x2;
		this.y2 = _y2;
	}
	
	this.stops = new Array();
	this.addStop = function(_offset, _color){
		var stop = new Object();
		stop.offset = _offset;
		stop.color = _color;
		this.stops.push(stop);
	}
}
Canvas.Palette.Gradient.prototype.draw = function(){
	var _x1 = this._parent.x + this.x1;
	var _y1 = this._parent.y + this.y1;
	var _x2 = this._parent.x + this.x2;
	var _y2 = this._parent.y + this.y2;
	
	var _gradient = this._parent.context.createLinearGradient(_x1, _y1, _x2, _y2);
	for (var stop in this.stops)
		_gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
	
	return _gradient;
}
