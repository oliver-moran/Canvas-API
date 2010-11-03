/*
 * Canvas API: A JavaScript library for the HTML5 canvas tag.
 * 
 * Copyright © 2010 Oliver Moran <oliver.moran@N0!spam@gmail.com>
 * Contributors: Todd Eichel, Masanao Izumo, John Resig, Jacob Seidelin, Bill Surgent, Yuichi Tateno
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

// Fix for Firefox's isPointInPath method (or other browsers' implementation depending on one's perspective).
// See Mozilla bug 405300 <https://bugzilla.mozilla.org/show_bug.cgi?id=405300>
(function(){	
	// Test how the isPointInPath method is implemented...
	var context = document.createElement("canvas").getContext( "2d" );
	context.translate(50, 0);
	context.strokeRect(0, 0, 50, 50);
	if (!context.isPointInPath(75, 25)){
		// ...if it is implemented the Firefox way then apply a "fix" (or "non-fix") to the CanvasRenderingContext2D prototype
		CanvasRenderingContext2D.prototype.isPointInPath2 = CanvasRenderingContext2D.prototype.isPointInPath;
		CanvasRenderingContext2D.prototype.isPointInPath = function(x, y) {
				this.save();
				this.setTransform(1, 0, 0, 1, 0, 0);
				var result = this.isPointInPath2(x, y);
				this.restore();
				return result;
			};
	}
}());

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
 * @class {public static} Canvas
 * @author Oliver Moran
 * @since 0.2
 */
var Canvas = {
	Utils : {
		/**
		 * Bequeaths the attributes of ancestor onto descendent.
		 * @function {private static void} Canvas.Utils.inherit
		 * @param {Object} descendant The object to bequeath attributes to.
		 * @param {Object} ancestor The object to inherit attributes from.
		 * @return Nothing
		 * @author Oliver Moran
		 * @since 0.2
		 */
		inherit : function(descendant, ancestor){
			for (var prop in ancestor) {
				if (typeof ancestor[prop] == "object") {
					descendant[prop] = new Object();
					Canvas.Utils.inherit(descendant[prop], ancestor[prop]);
				}
				descendant[prop] = ancestor[prop];
			}
		},
		/**
		 * Creates a new array from an existing one, pushes a new element onto it and returns the new array.
		 * @function {private static void} Canvas.Utils.inherit
		 * @param {Array} array The array to copy.
		 * @param {Object} item The item to be pushed onto the copy.
		 * @return A new array.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		pushArray : function(array, item){
			var copy = new Array();
			for (var i=0; i<array.length; i++){
				copy.push(array[i]);
			}
			copy.push(item);
			return copy;
		},
		/**
		 * A flag that, if set to true, displays debug information such as rendering times, average rendering time over the past 100 renders, masking objects (magenta) and hit areas (cyan).
		 * @property {read Boolean} Canvas.debug
		 * @author Oliver Moran
		 * @since 0.2
		 */
		debug : false,
		
		/**
		 * If an effects library is included on the web page, Canvas API can add effects to images using that library. The Pixastic library is supported by default if it is included.
		 * @function {abstract public Image} Canvas.Drawing.defaultImageEffectsLibrary
		 * @param {String} name The name of the effect to add.
		 * @param {Object} args An objet containing the arguments to be passed to the effects library.
		 * @return A new processed image.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		defaultImageEffectsLibrary : (typeof Pixastic == "object" && typeof Pixastic.process == "function") ?
			Pixastic.process // Default FX library, if present. Can be over-ridden.
			: null,
		
		// GEOMETERY FUNCTIONS

		Geometry : {
			// "point in a polygon" is at bottom of file
			
			/**
			 * Converts an angle in radians to degrees.
			 * @function {private static Number} Canvas.Utils.radians2degrees
			 * @param {Number} radians The angle in radians.
			 * @param {Object} item The item to be pushed onto the copy.
			 * @return The angle in degrees
			 * @author Oliver Moran
			 * @since 0.2
			 */
			radians2degrees : function(radians){
				return radians * 180/Math.PI;
			},
			/**
			 * Converts an angle in degrees to radians.
			 * @function {private static Number} Canvas.Utils.degrees2radians
			 * @param {Number} degrees The angle in degrees.
			 * @param {Object} item The item to be pushed onto the copy.
			 * @return The angle in radians
			 * @author Oliver Moran
			 * @since 0.2
			 */
			degrees2radians : function(degrees){
				return degrees * Math.PI/180;
			},
			/**
			 * Rotates a point around an origin by an angle. If no origin is given (0,0) will be assumed.
			 * @function {public static Object} Canvas.Utils.rotatePoint
			 * @param {Object} point The point to rotate.
			 * @... {Number} x The x coordinate of the point.
			 * @... {Number} y The y coordinate of the point.
			 * @param {optional Object} origin The point to rotate.
			 * @... {Number} x The x coordinate of the origin.
			 * @... {Number} y The y coordinate of the origin.
			 * @param {Number} degrees The angle to rotate the point in degrees.
			 * @return An object composed of a x and y coordiante of the new point.
			 * @author Oliver Moran
			 * @since 0.2
			 */
			rotatePoint : function(point, origin, degrees){
				if (degrees == undefined) {
					degrees = origin;
					origin = {x:0, y:0};
				}
				if (typeof point != "object" || isNaN(point.x) || isNaN(point.y)
					|| typeof origin != "object" || isNaN(origin.x) || isNaN(origin.y)
					|| isNaN(degrees)) return false;
					
				var radians = Canvas.Utils.Geometry.degrees2radians(degrees);
				var x = Math.cos(radians) * (point.x-origin.x) - Math.sin(radians) * (point.y-origin.y) + origin.x;
				var y = Math.sin(radians) * (point.x-origin.x) + Math.cos(radians) * (point.y-origin.y) + origin.y;
				
				return {x:x, y:y};
			},
			
			/**
			 * Rotates a point around an origin by an angle.
			 * @function {public static Number} Canvas.Utils.angleBetweenThreePoints
			 * @param {Object} a The first point.
			 * @... {Number} x The x coordinate of the point.
			 * @... {Number} y The y coordinate of the point.
			 * @param {Object} b The second point.
			 * @... {Number} x The x coordinate of the point.
			 * @... {Number} y The y coordinate of the point.
			 * @param {optinoal Object} c The third point.
			 * @... {Number} x The x coordinate of the point.
			 * @... {Number} y The y coordinate of the point.
			 * @return The angle in degrees formed by abc. If c is missing then the angle is calculated as between aob, where o is (0,0).
			 * @author Oliver Moran
			 * @since 0.2
			 */
			angleBetweenThreePoints : function(a, b, c){
				// XXX: Does not tell if it is clockwise or anti-clockwise
				if (c == undefined) {
					c = {x:b.x, y:b.y};
					b = {x:0, y:0};
				}
				
				var l_ab = Math.sqrt(Math.pow((b.x-a.x),2) + Math.pow((b.y-a.y),2));
				var l_bc = Math.sqrt(Math.pow((b.x-c.x),2) + Math.pow((b.y-c.y),2));
				var l_ac = Math.sqrt(Math.pow((a.x-c.x),2) + Math.pow((a.y-c.y),2));

				var radians = Math.acos((Math.pow(l_ac,2) - Math.pow(l_ab,2) - Math.pow(l_bc,2))/(-2*l_ab*l_bc));
				
				return Canvas.Utils.Geometry.radians2degrees(radians);
			},
			
			/*
			 * The follow is dual licenced under either the LGPL or BSD licence:
			 */

			/*
			 * Copyright © 2010 Bill Surgent
			 *
			 * This program is free software: you can redistribute it and/or modify
			 * it under the terms of the GNU Lesser General Public License as published by
			 * the Free Software Foundation, either version 3 of the License, or
			 * (at your option) any later version.
			 * 
			 * This program is distributed in the hope that it will be useful,
			 * but WITHOUT ANY WARRANTY; without even the implied warranty of
			 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
			 * GNU Lesser General Public License for more details.
			 * 
			 * You should have received a copy of the GNU Lesser General Public License
			 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
			 * 
			 */

			/*
			 * Copyright (c) 2010, Bill Surgent
			 * All rights reserved.
			 * 
			 * Redistribution and use in source and binary forms, with or without 
			 * modification, are permitted provided that the following conditions are met:
			 * 1. Redistributions of source code must retain the above copyright notice, 
			 *    this list of conditions and the following disclaimer.
			 * 2. Redistributions in binary form must reproduce the above copyright notice,
			 *    this list of conditions and the following disclaimer in the documentation
			 *    and/or other materials provided with the distribution.
			 * 3. Neither the name of Bill Surgent nor the names of its contributors
			 *    may be used to endorse or promote products derived from this software
			 *    without specific prior written permission.
			 * 
			 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
			 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
			 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
			 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE 
			 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
			 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF 
			 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
			 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
			 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
			 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
			 * POSSIBILITY OF SUCH DAMAGE.
			 * 
			 */

			/* 
			 * Adapted for use with Canvas API by Oliver Moran (2010)
			 *
			 */

			// Determines whether a point is inside a polygon.
			// Returns true when the point is inside the polygon otherwise false.
			// Points are objects with x and y properties and the polygon is an array of these points
			isPointInPolygon : function(point, polygon) {
				var ep1, ep2; // Edge points that represent one edge of the polygon
				var crossings=0; // Number of times a ray crosses the polygons edges from the left to the test point
			    
				// Test each edge for a crossing
				for (var i=0, l=polygon.length; i<l; ++i)
				{
					//Points representing the current polygon edge to test
					ep1 = polygon[i];
					ep2 = polygon[(i+1) % l];
					
					//One endpoint must be above the test point and the other must be below for a crossing to occur
					if ( (ep1.y >= point.y && ep2.y < point.y) || (ep1.y < point.y && ep2.y >= point.y) ) {
						if(ep1.x < point.x && ep2.x < point.x) // Both points left is a crossing
							++crossings;
						else if (ep1.x < point.x || ep2.x < point.x) { // One point left requires more work
							var x1 = ep1.x;
							var y1 = ep1.y;
							var x2 = ep2.x;
							var y2 = ep2.y;
							var y = point.y;
							
							// Point on the edge with the same y value as the test point
							var x = (y-y1) * ((x2-x1)/(y2-y1)) + x1;
							
							// If the edge is to the left of the test point
							if(x < point.x) ++crossings;
			            }
			        }
			    }
			    
			    // Odd number of edge crossings means the point is in the polygon
			    return crossings & 1;
			}
			
			// End of (c) Bill Surgent
		}
	}
};


/**
 * Creates an instance of a Drawing and inserts a canvas tag onto the web page.
 * @constructor {public} Canvas.Drawing
 * @param {HTMLDOMElement} canvas A reference to the HTML DOM element for the canvas.
 * @return Nothing
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Drawing = function(canvas){
	/**
	 * A self reference for use in private functions.
	 * @property {private Object} Drawing.__this
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var __this = this; // for methods that are outside of scope


	// CANVAS TAG PROPERTIES
	
	/**
	 * A reference to the HTML canvas element for the drawing.
	 * @property {read HTMLDOMElement} Drawing.canvas
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.canvas = canvas;
	/**
	 * The 2D rendering context of the drawing.
	 * @property {read CanvasRenderingContext2D} Drawing.context
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.context = canvas.getContext("2d");
	
	
	// ANIMATION
	
	/**
	 * The frame rate in fames per second of animations.
	 * @property {read write Number} Drawing.framerate
	 * @see Drawing.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.framerate = 12;
	/**
	 * A function called immediately before the drawing is drawn.
	 * @function {public void} Drawing.onBeforeDraw
	 * @param {Object} drawing A reference to the Canvas.drawing object because this is lost though the onTimeOut function
	 * @see Drawing.onDraw
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onBeforeDraw = function(drawing){};
	/**
	 * A function called immediately after the drawing is drawn.
	 * @function {public void} Drawing.onDraw
	 * @param {Object} drawing A reference to the Canvas.drawing object because this is lost though the onTimeOut function
	 * @return Nothing
	 * @see Drawing.onBeforeDraw
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onDraw = function(drawing){};
	/**
	 * Starts animation (calls draw at regular intervals). Called by default when intialising a drawing object.
	 * @function {public static void} Drawing.start
	 * @return Nothing
	 * @see Drawing.framerate
	 * @see Drawing.stop
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var interval;
	var skipFrame = false; // basic frame skipping
	this.start = function(){
		this.stop();
		interval = setInterval(function(){
				if (!skipFrame) __this.draw();
			}, 1000/this.framerate);
	};
	/**
	 * Stops animation.
	 * @function {public void} Drawing.stop
	 * @return Nothing
	 * @see Drawing.start
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stop = function(){
		clearInterval(interval);
	};
	

	// MANAGE THE SCENE
	
	this.scene = {}; // an object that holds the "scene"
	
	/**
	 * Adds a Palette object to the Drawing.
	 * @function {public Boolean} Drawing.add
	 * @param {Object} obj The object to be added
	 * @param {optional String} name An instance name for the object
	 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to false, which adds a shallow copy of the object is added to the drawing.
	 * @return true if the object was added, otherwise false.
	 * @see Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(obj, name, copy){
		// sort out the overloading: 
		if (name === undefined || typeof name == "boolean") {
			if (typeof name === "boolean") copy = name;
			var i = 0;
			while (this.scene["sprite "+i]) i++;
			name = "sprite "+i;
		}
		
		if (!obj || !obj.draw) return false;
		
		if (copy) this.scene[name] = obj.copy();
		else this.scene[name] = obj;
		
		return true;
	};
	
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
	};
	
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
				try {
					// Opera throws exceptions around instanceof, we we dance around it
					if (this.scene[obj].isComplete && !this.scene[obj].isComplete())
						c++; // images/audio/video
					else if (this.scene[obj][prop] && this.scene[obj][prop].isComplete && !this.scene[obj][prop].isComplete())
						c++; // fills
				} catch(err){
					// An exception may be throw owing to properties appearing and disappearing asynchronously.
					// If an exception is thrown, it can normally be safely be ignored but causes the method to reurn false.
					c++;
				}
			}
		}
		
		return (c == 0);
	};
	
	
	/**
	 * A method to bubble sort the objects in the scene by layer.
	 * @function {private static void} Canvas.sceneByLayer
	 * @param {Array} array The object to bequeath attributes to.
	 * @return An array containing the objects in the scene.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var sceneByLayer = function() {
		var array = new Array();
		for (var obj in __this.scene)
			array.push(__this.scene[obj]);
		
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < (array.length-1); j++) {
				if (array[j].layer > array[j+1].layer) {
					var tmp = array[j+1];
					array[j+1] = array[j];
					array[j] = tmp;
				}
			}
		}
		return array;
	};
	
	/**
	 * Paints the Drawing. If the drawing is not ready to be painted, the method will retry at a rate of once every 1 miliseconds.
	 * @function {public void} Drawing.draw
	 * @return Nothing
	 * @see Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.draw = function(){
		if (!this.ready()){
			skipFrame = true;
			// if images are not loaded then set a timeout that continually checks that they have
			setTimeout(function(){
					__this.draw();
				}, 1);
			return;
		}
		skipFrame = false;
		
		this.onBeforeDraw();

		var draw_start_time = new Date();
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var layers = sceneByLayer();
		for (var i in layers) if (layers[i]) layers[i].draw([this], this.context);
		
		var draw_end_time = new Date();
		
		if (Canvas.debug === true){
			debug.addRenderTime(draw_end_time.getTime()-draw_start_time.getTime());
			debug.show();
		}
		
		this.onDraw();
	};
	
	// DEBUG
	
	var debug = {
		renderTimes : new Array(),
		addRenderTime : function(time){
			this.renderTimes.push(time);
			if (this.renderTimes.length > 100) this.renderTimes.shift();
		},
		calculateAverageRenderTime : function(){
			var total = 0;
			for (var time in this.renderTimes) total += this.renderTimes[time];
			return (total/this.renderTimes.length).toFixed(2);
		},
		show : function(){
			__this.context.fillStyle = "lightGrey";
			__this.context.globalAlpha = 0.75;
			__this.context.shadowColor = "transparent";
			__this.context.fillRect(0, __this.canvas.height-15, __this.canvas.width, 15);
			
			__this.context.font = "10px 'Courier', monospace";
			__this.context.textAlign = "start";
			__this.context.textBaseline = "top";
			if (this.renderTimes[this.renderTimes.length-1] > 1000/__this.framerate) __this.context.fillStyle = "red";
			else __this.context.fillStyle = "black";
			__this.context.fillText("Render time: " + this.renderTimes[this.renderTimes.length-1] + "ms (avg.: "+this.calculateAverageRenderTime()+"ms)", 3, __this.canvas.height-15);
		}
	};	
	
	// KEY EVENTS
	
	/**
	 * A user-definable function that is called when a keyboard button is pressed down. This is attached to the document object of the webpage.
	 * @function {public abstract void} Drawing.onKeyDown
	 * @param {String} key A string value for the key.
	 * @param {Number} code A code value for the key.
	 * @return Nothing.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onKeyDown = function(key, code){};
	var current_keydown = document.onkeydown;
	document.onkeydown = function(e){
		if (current_keydown) current_keydown();
		if(typeof __this.onKeyDown == "function"){
			__this.onKeyDown(String.fromCharCode(e.which), e.which);
		}
	};
	/**
	 * A user-definable function that is called when a keyboard button is pressed down. This is attached to the document object of the webpage.
	 * @function {public abstract void} Drawing.onKeyUp
	 * @param {String} key A string value for the key.
	 * @param {Number} code A code value for the key.
	 * @return Nothing.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onKeyUp = function(key, code){};
	var current_keyup = document.onkeyup;
	document.onkeyup = function(e){
		if (current_keyup) current_keyup();
		if(typeof __this.onKeyUp == "function"){
			__this.onKeyUp(String.fromCharCode(e.which), e.which);
		}
	};
	
	
	// MOUSE EVENTS
	
	// takes layers because it is recursive (recurses through groups)
	var checkForHit = function(x, y, layers, angle, scale){
		// if no layers were given then use the scene
		if (!layers) layers = sceneByLayer();
		if (isNaN(angle)) angle = 0;
		if (typeof scale != "object" || isNaN(scale.x) || isNaN(scale.y)) scale = {x:100, y:100};

		// loop through the objects
		for (var i=layers.length; i>0; i--) { // go in reverse so we hit the top layer first
			
			// all objects
			layers[i-1].draw([this], __this.context, true); // trance each of the objects

			if (acceptsMouseEvents(layers[i-1]) && __this.context.isPointInPath(x, y)) {
				if (layers[i-1].mask instanceof Canvas.Palette.Mask) {
					// XXX: We need to take account for masks. This is a hacky way of doing it:
					// Normally the mask is drawn first but in debug mode the mask is draw 
					// second so that it can be seen above the object. What we do here is 
					// flip that sequence around by toggling debug mode. If we get a hit in
					// both modes then we got a hit on the intersection between the object
					// and the mask. We should probably replace this with a less hacky method
					// that does the same thing but this will work for now.
					var tmp_debug = Canvas.debug;
					Canvas.debug = (Canvas.debug === true) ? false : true;
					layers[i-1].draw([this], __this.context, true); // trance each of the objects
					if (__this.context.isPointInPath(x, y)) {
						Canvas.debug = tmp_debug;
						return {object:layers[i-1], angle:angle, scale:scale};
					}
					Canvas.debug = tmp_debug;
				} else {
					// alert(2);
					return {object:layers[i-1], angle:angle, scale:scale};
				}
			}

			// groups
			if (layers[i-1] instanceof Canvas.Palette.Group){ 
				// set the matrix (this is normally done as part of the group draw method)
				__this.context.translate(layers[i-1].x+layers[i-1].pivotx, layers[i-1].y+layers[i-1].pivoty);
				__this.context.rotate(layers[i-1].rotation * Math.PI/180);
				__this.context.transform(layers[i-1].xscale/100, (layers[i-1].xskew * Math.PI/180), (layers[i-1].yskew * -Math.PI/180), layers[i-1].yscale/100, 0, 0);
				__this.context.translate(-layers[i-1].pivotx, -layers[i-1].pivoty);

				// FIXME: This does not work properly when groups are skewed (either explicitly or because the matrix is scaled/rotated)
				var hit = checkForHit(x, y, layers[i-1].membersByLayer(), angle+layers[i-1].rotation+layers[i-1].rotation, 
										{x:layers[i-1].xscale*(scale.x/100), y:layers[i-1].yscale*(scale.y/100)});

				// reset the matrix
				__this.context.translate(layers[i-1].pivotx, layers[i-1].pivoty);
				__this.context.transform(100/layers[i-1].xscale, (layers[i-1].xskew * -Math.PI/180), (layers[i-1].yskew * Math.PI/180), 100/layers[i-1].yscale, 0, 0);
				__this.context.rotate(layers[i-1].rotation * -Math.PI/180);
				__this.context.translate((layers[i-1].x+layers[i-1].pivotx)*-1, (layers[i-1].y+layers[i-1].pivoty)*-1);

				if (hit) {
					if (layers[i-1].mask instanceof Canvas.Palette.Mask) {
						// This is a kind of hackish way of finding the intersection of a mask and objects, see the description below
						var tmp_debug = Canvas.debug;
						Canvas.debug = (Canvas.debug === true) ? false : true;
						
						layers[i-1].draw([this], __this.context, true); // trance each of the objects
						if (__this.context.isPointInPath(x, y)) {
							Canvas.debug = tmp_debug;
							return {object:hit.object, angle:hit.angle, scale:hit.scale};
						}
						Canvas.debug = tmp_debug;
					} else {
						return {object:hit.object, angle:hit.angle, scale:hit.scale};
					}
				}
			}
		}
		
		// no hit
		return false;
	};
	
	
	var acceptsMouseEvents = function(obj){
		return ((typeof obj.onRelease == "function" 
			 || typeof obj.onPress == "function" 
			 || typeof obj.onMouseOver == "function" 
			 || typeof obj.onMouseOut == "function"
			 || typeof obj.onDrop == "function"
			 || obj.dragable == true) && obj != drag_object);
	};
	
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

	this.context.canvas.onmouseup = function(e){
		var x = (e.offsetX) ? e.offsetX : e.layerX - __this.canvas.offsetLeft;
		var y = (e.offsetY) ? e.offsetY : e.layerY - __this.canvas.offsetTop;
		
		var hit = checkForHit(x, y);
		
		if (drag_object) {
			if (drag_object && drag_object.onDragStop) drag_object.onDragStop({x:x, y:y}, hit.object);
			if (hit && hit.object && hit.object.onDrop) hit.object.onDrop({x:x, y:y}, drag_object);
		} else if (hit && hit.object && hit.object.onRelease) hit.object.onRelease({x:x, y:y, object:hit.object});
		
		drag_object = undefined;
		last_drag_x = undefined;
		last_drag_y = undefined;
		drag_scale = undefined;
		drag_angle = undefined;
		drag_position = undefined;
		drag_on_drag_called = undefined;
	};
	var drag_object = undefined;
	var last_drag_x = undefined;
	var last_drag_y = undefined;
	var drag_scale = undefined;
	var drag_angle = undefined;
	var drag_position = undefined;
	var drag_on_drag_called = undefined;
	this.context.canvas.onmousedown = function(e){
		var x = (e.offsetX) ? e.offsetX : e.layerX - __this.canvas.offsetLeft;
		var y = (e.offsetY) ? e.offsetY : e.layerY - __this.canvas.offsetTop;
		
		var hit = checkForHit(x, y);
		if (hit && hit.onPress) hit.object.onPress({x:x, y:y, object:hit.object});
		if (hit && hit.object.dragable) {
			drag_object = hit.object;
			last_drag_x = x;
			last_drag_y = y;
			drag_scale = hit.scale;
			drag_angle = hit.angle;
			drag_position = drag_object.center();
			drag_on_drag_called = false;
		}
	};
	this.context.canvas.onclick = function(e){
		// click events
	};
	var lastOverObject;
		 
	this.context.canvas.onmousemove = function(e){
		// move over events
		// mouse out events
		// update local mouse coords
		var x = (e.offsetX) ? e.offsetX : e.layerX - __this.canvas.offsetLeft;
		var y = (e.offsetY) ? e.offsetY : e.layerY - __this.canvas.offsetTop;
		
		__this.mousex = x;
		__this.mousey = y;
		
		if (drag_object && !isNaN(last_drag_x) && !isNaN(last_drag_y)) {
			if (drag_on_drag_called === false && drag_object.onDragStart) {
				drag_on_drag_called = true;
				drag_object.onDragStart({x:x, y:y});
			}
			
			var vector = Canvas.Utils.Geometry.rotatePoint({x:(x-last_drag_x)/(drag_scale.x/100), y:(y-last_drag_y)/(drag_scale.y/100)}, drag_angle*-1);
			drag_position.x += vector.x;
			drag_position.y += vector.y;
			var obj_position = {x:drag_position.x, y:drag_position.y};
				
			if (drag_object.dragLimitTop && obj_position.y < drag_object.dragLimitTop) obj_position.y = drag_object.dragLimitTop;
			else if (drag_object.dragLimitBottom && obj_position.y > drag_object.dragLimitBottom) obj_position.y = drag_object.dragLimitBottom;
			if (drag_object.dragLimitLeft && obj_position.x < drag_object.dragLimitLeft) obj_position.x = drag_object.dragLimitLeft;
			else if (drag_object.dragLimitRight && obj_position.x > drag_object.dragLimitRight) obj_position.x = drag_object.dragLimitRight;

			drag_object.moveTo(obj_position.x, obj_position.y);
			
			last_drag_x = x;
			last_drag_y = y;

			return;
		}

		var hit = checkForHit(x, y);

		if (lastOverObject && lastOverObject.onMouseOut && hit.object != lastOverObject) lastOverObject.onMouseOut({x:x, y:y, object:lastOverObject}); 
		if (hit) {
			__this.canvas.style.cursor = hit.object.cursor;
			if (hit.object.onMouseOver && hit.object != lastOverObject) hit.object.onMouseOver({x:x, y:y, object:hit.object}); 
			lastOverObject = hit.object;
		} else {
			__this.canvas.style.cursor = "default";			
			lastOverObject = undefined;
		}
	};
	this.context.canvas.onmouseout = function(e){
		var x = (e.offsetX) ? e.offsetX : e.layerX - __this.canvas.offsetLeft;
		var y = (e.offsetY) ? e.offsetY : e.layerY - __this.canvas.offsetTop;

		if (lastOverObject && lastOverObject.onMouseOut)
			lastOverObject.onMouseOut({x:x, y:y, object:lastOverObject}); 
		lastOverObject = undefined;

		drag_object = undefined;
		drag_x = undefined;
		drag_y = undefined;
		drag_scale = undefined;
		drag_angle = undefined;
		drag_position = undefined;
		drag_on_drag_called = undefined;
	};
	
	
	// COPY AND SAVE FUNCTIONS
		
	/* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
	 * Version: 1.0
	 * LastModified: Dec 25 1999
	 * This library is free.  You can redistribute it and/or modify it.
	 */
	
	/* 
	 * Adapted for use with Canvas API by Oliver Moran (2010)
	 *
	 */
	
	/*
	 * Interfaces:
	 * b64 = base64encode(data);
	 * data = base64decode(b64);
	 */
	
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64DecodeChars = new Array(
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
		52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
		-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
		15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
		-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
		41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	
	var base64encode = function(str) {
		var out, i, len;
		var c1, c2, c3;
		
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if(i == len)
		{
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if(i == len)
		{
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
		out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	};
	
	base64decode = function(str) {
		var c1, c2, c3, c4;
		var i, len, out;
		
		len = str.length;
		i = 0;
		out = "";
		while(i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c1 == -1);
		if(c1 == -1)
			break;
	
		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		} while(i < len && c2 == -1);
		if(c2 == -1)
			break;
	
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
	
		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if(c3 == 61)
			return out;
			c3 = base64DecodeChars[c3];
		} while(i < len && c3 == -1);
		if(c3 == -1)
			break;
	
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
	
		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if(c4 == 61)
			return out;
			c4 = base64DecodeChars[c4];
		} while(i < len && c4 == -1);
		if(c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	};
	
	if (!window.btoa) window.btoa = base64encode;
	if (!window.atob) window.atob = base64decode;
	
	// End of (C) 1999 Masanao Izumo

	/*
	 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining
	 * a copy of this software and associated documentation files (the
	 * "Software"), to deal in the Software without restriction, including
	 * without limitation the rights to use, copy, modify, merge, publish,
	 * distribute, sublicense, and/or sell copies of the Software, and to
	 * permit persons to whom the Software is furnished to do so, subject to
	 * the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be
	 * included in all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 */
	
	/* 
	 * Adapted for use with Canvas API by Oliver Moran (2010)
	 *
	 */


	var bHasImageData = !!(this.context.getImageData);
	var bHasDataURL = !!(this.canvas.toDataURL);
	var bHasBase64 = !!(window.btoa);
	
	var strDownloadMime = "image/octet-stream";
	
	var readCanvasData = function(oCanvas) {
		var iWidth = parseInt(oCanvas.width);
		var iHeight = parseInt(oCanvas.height);
		return oCanvas.getContext("2d").getImageData(0,0,iWidth,iHeight);
	};

	// base64 encodes either a string or an array of charcodes
	var encodeData = function(data) {
		var strData = "";
		if (typeof data == "string") {
			strData = data;
		} else {
			var aData = data;
			for (var i=0;i<aData.length;i++) {
				strData += String.fromCharCode(aData[i]);
			}
		}
		return btoa(strData);
	};

	// creates a base64 encoded string containing BMP data
	// takes an imagedata object as argument
	var createBMP = function(oData) {
		var aHeader = [];
	
		var iWidth = oData.width;
		var iHeight = oData.height;

		aHeader.push(0x42); // magic 1
		aHeader.push(0x4D); 
	
		var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
		aHeader.push(iFileSize % 256);

		aHeader.push(0); // reserved
		aHeader.push(0);
		aHeader.push(0); // reserved
		aHeader.push(0);

		aHeader.push(54); // dataoffset
		aHeader.push(0);
		aHeader.push(0);
		aHeader.push(0);

		var aInfoHeader = [];
		aInfoHeader.push(40); // info header size
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);

		var iImageWidth = iWidth;
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
		aInfoHeader.push(iImageWidth % 256);
	
		var iImageHeight = iHeight;
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
		aInfoHeader.push(iImageHeight % 256);
	
		aInfoHeader.push(1); // num of planes
		aInfoHeader.push(0);
	
		aInfoHeader.push(24); // num of bits per pixel
		aInfoHeader.push(0);
	
		aInfoHeader.push(0); // compression = none
		aInfoHeader.push(0);
		aInfoHeader.push(0);
		aInfoHeader.push(0);
	
		var iDataSize = iWidth*iHeight*3; 
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
		aInfoHeader.push(iDataSize % 256); 
	
		for (var i=0;i<16;i++) {
			aInfoHeader.push(0);	// these bytes not used
		}
	
		var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

		var aImgData = oData.data;

		var strPixelData = "";
		var y = iHeight;
		do {
			var iOffsetY = iWidth*(y-1)*4;
			var strPixelRow = "";
			for (var x=0;x<iWidth;x++) {
				var iOffsetX = 4*x;

				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
				strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
			}
			for (var c=0;c<iPadding;c++) {
				strPixelRow += String.fromCharCode(0);
			}
			strPixelData += strPixelRow;
		} while (--y);

		var strEncoded = encodeData(aHeader.concat(aInfoHeader)) + encodeData(strPixelData);

		return strEncoded;
	};


	// sends the generated file to the client
	var saveFile = function(strData) {
		document.location.href = strData;
	};

	var makeDataURI = function(strData, strMime) {
		return "data:" + strMime + ";base64," + strData;
	};

	// generates a <img> object containing the imagedata
	var makeImageObject = function(strSource) {
		var oImgElement = document.createElement("img");
		oImgElement.src = strSource;
		return oImgElement;
	};

	var clipCanvas = function(oCanvas, iClipX, iClipY, iWidth, iHeight) {
		if (!isNaN(iClipX) && !isNaN(iClipY) && !isNaN(iWidth) && !isNaN(iHeight)) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, iClipX, iClipY, oSaveCanvas.width, oSaveCanvas.height, 0, 0, oSaveCanvas.width, oSaveCanvas.height);
			return oSaveCanvas;
		}
		return oCanvas;
	};

	var saveAsPNG = function(oCanvas, bReturnImg, iClipX, iClipY, iWidth, iHeight) {
		if (!bHasDataURL) {
			return false;
		}
		var oScaledCanvas = clipCanvas(oCanvas, iClipX, iClipY, iWidth, iHeight);
		var strData = oScaledCanvas.toDataURL("image/png");
		if (bReturnImg) {
			return makeImageObject(strData);
		} else {
			saveFile(strData.replace("image/png", strDownloadMime));
		}
		return true;
	};

	var saveAsJPEG = function(oCanvas, bReturnImg, iClipX, iClipY, iWidth, iHeight) {
		if (!bHasDataURL) {
			return false;
		}

		var oScaledCanvas = clipCanvas(oCanvas, iClipX, iClipY, iWidth, iHeight);
		var strMime = "image/jpeg";
		var strData = oScaledCanvas.toDataURL(strMime);

		// check if browser actually supports jpeg by looking for the mime type in the data uri.
		// if not, return false
		if (strData.indexOf(strMime) != 5) {
			return false;
		}

		if (bReturnImg) {
			return makeImageObject(strData);
		} else {
			saveFile(strData.replace(strMime, strDownloadMime));
		}
		return true;
	};

	var saveAsBMP = function(oCanvas, bReturnImg, iClipX, iClipY, iWidth, iHeight) {
		if (!(bHasImageData && bHasBase64)) {
			return false;
		}

		var oScaledCanvas = clipCanvas(oCanvas, iClipX, iClipY, iWidth, iHeight);

		var oData = readCanvasData(oScaledCanvas);
		var strImgData = createBMP(oData);
		if (bReturnImg) {
			return makeImageObject(makeDataURI(strImgData, "image/bmp"));
		} else {
			saveFile(makeDataURI(strImgData, strDownloadMime));
		}
		return true;
	};

	
	// End of (c) 2008 Jacob Seidelin
	
	/**
	 * Downloads the current canvas or a region of it as an image file.  Access to this function can hinder the loading of content so it can only be accessed if the contents of the Library has fully loaded.
	 * @function {public Boolean} Drawing.save
	 * @param {optional String} format A string indicating the format to save the canvas as. Valid values are JPEG, BMP and PNG. The default is PNG.
	 * @param {optional Number} x The x coordinate of the top-left corner to clip. Defaults to 0.
	 * @param {optional Number} y The y coordinate of the top-left corner to clip. Defaults to 0.
	 * @param {optional Number} width The width of the region to copy. Defaults to the width of the canvas minus x.
	 * @param {optional Number} height The height of the region to copy. Defaults to the height of the canvas minus y.
	 * @return true if the operation was successful otherwise false, including if the Library was not fully loaded.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.save = function(format, x, y, width, height){
		if (Canvas.Library.status().incomplete > 0) return false;
		if (!isNaN(format)){ // possible overriding
			height = width;
			width = y;
			y = x;
			x = format;
			format = "PNG";
		}
		if (format === undefined) format = "PNG";
		if (typeof format != "string") return false;
		if (x == undefined) x = 0;
		if (y == undefined) y = 0;
		if (width == undefined) width = this.canvas.width - x;
		if (height == undefined) height = this.canvas.height - y;
		
		switch (format.toUpperCase()){
			case "JPEG":
			case "JPG":
				saveAsJPEG(this.canvas, false, x, y, width, height);
				break;
			case "BMP":
				saveAsBMP(this.canvas, false, x, y, width, height);
				break;
			case "PNG":
			default:
				saveAsPNG(this.canvas, false, x, y, width, height);
				break;
		}
		
		return true;
	};
	
	
	/**
	 * Returns a bitmap copy of the canvas or a region of it. Access to this function can hinder the loading of content so it can only be accessed if the contents of the Library has fully loaded.
	 * @function {public Image} Drawing.copy
	 * @param {optional Number} x The x coordinate of the top-left corner to clip. Defaults to 0.
	 * @param {optional Number} y The y coordinate of the top-left corner to clip. Defaults to 0.
	 * @param {optional Number} width The width of the region to copy. Defaults to the width of the canvas minus x.
	 * @param {optional Number} height The height of the region to copy. Defaults to the height of the canvas minus y.
	 * @return Bitmap image data of the canvas or a Boolean false if the Library was not fully loaded.
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.copy = function(x, y, width, height){
		if (Canvas.Library.status().incomplete > 0) return false;
		if (x == undefined) x = 0;
		if (y == undefined) y = 0;
		if (width == undefined) width = this.canvas.width - x;
		if (height == undefined) height = this.canvas.height - y;
		
		return saveAsBMP(this.canvas, true, x, y, width, height);
	};
};


(function(){
	/**
	 * The static Library class where images and other media are stored.
	 * @object {static} Canvas.Library
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Library = {};
	/**
	 * The array of images in the Canvas API library.
	 * @property {private Array} Library.images
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var images = new Array();
	/**
	 * Adds an image to the Canvas API library.
	 * @function {public static void} Library.addImage
	 * @param {String} src The URL of an image file.
	 * @return A reference to the image in the library.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Library.addImage = function(src){
		var image = new Image();
		image.onload = function(){
			// loaded
		};
		// image.onerror
		// image.onabort
		image.src = src;
	
		images.push(image);
		return images[images.length-1];
	};
	/**
	 * The array of audio files in the Canvas API library.
	 * @property {Array} Library.audio
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var audio = new Array();
	/**
	 * Adds an audio file to the Canvas API library.
	 * @function {public static void} Library.addAudio
	 * @param {String} src The URL of an audio file.
	 * @return A reference to the audio file in the library.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Library.addAudio = function(src){
		var audio = document.createElement("audio");
		
		// basic settings
		audio.setAttribute("preload", "preload");
		audio.setAttribute("hidden", "hidden");
		audio.setAttribute("style", "display:none;");
		
		
		// set the source
		if (typeof src == "string") audio.setAttribute("src", src);
		else if (typeof src == "object"){
			for (var n in src){
				var source = document.createElement("source");
				source.setAttribute("src", src[n]);
				audio.appendChild(source);
			}
		}
	
		document.body.appendChild(audio);
		// audio.onerror
		// audio.onabort
		
		var checkIfLoaded = function(){
			if (isNaN(audio.duration))
				setTimeout(function(){
						checkIfLoaded();
					}, 10);
			else {
				// loaded
				audio.complete = true;
			}
		};
		checkIfLoaded();
	
		audio.push(audio);
		return audio[audio.length-1];
	};
	/**
	 * The array of video files in the Canvas API library.
	 * @property {Array} Library.video
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var videos = new Array();
	/**
	 * Adds a video file to the Canvas API library.
	 * @function {public static void} Library.addVideo
	 * @param {String} src The URL of a video file.
	 * @return A reference to the video file in the library.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Library.addVideo = function(src){
		var video = document.createElement("video");
		
		// basic settings
		video.setAttribute("preload", "preload");
		video.setAttribute("hidden", "hidden");
		video.setAttribute("style", "display:none;");
		// XXX: The poster option is taken out because it is not shown when the video is fully loaded.
		//       Canvas API loads the video before it shows it, which means the poster is never shown.
		//       If we take out the 'ready' check the video throws an error because the width/height are 
		//       unknown.
		// if (poster) video.setAttribute("poster", poster);
		
		// set the source
		if (typeof src == "string") video.setAttribute("src", src);
		else if (typeof src == "object"){
			for (var n in src){
				var source = document.createElement("source");
				source.setAttribute("src", src[n]);
				video.appendChild(source);
			}
		}
	
		document.body.appendChild(video);
		
		// video.onerror
		// video.onabort
		var checkIfLoaded = function(){
			if (isNaN(video.duration) || video.duration==0)
				setTimeout(function(){
						checkIfLoaded();
					}, 10);
			else {
				// loaded
				video.complete = true;
			}
		};
		checkIfLoaded();
	
		videos.push(video);
		return videos[videos.length-1];
	};
	
	/**
	 * Returns an object describing the count of complete vs. incompletely loaded items in the library.
	 * @function {public Object} Library.status
	 * @return An object containing the following properties: total, incomplete, images, audio, videos, imagesIncomplete, audioIncomplete, videosIncomplete, videosIncomplete
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	Canvas.Library.status = function(){
		var imagesIncomplete = 0;
		for (var image in images)
			if (images[image] && !images[image].complete) imagesIncomplete++;
		
		var audioIncomplete = 0;
		for (var audio in audio)
			if (audio[audio] && !audio[audio].complete) audioIncomplete++;

		var videosIncomplete = 0;
		for (var video in videos)
			if (videos[video] && !videos[video].complete) videosIncomplete++;
		
		return {
			total: images.length + audio.length + videos.length,
			incomplete: imagesIncomplete + audioIncomplete + videosIncomplete,
			
			images: images.length,
			audio: audio.length,
			videos: videos.length,
			
			imagesIncomplete: imagesIncomplete,
			audioIncomplete: audioIncomplete,
			videosIncomplete: videosIncomplete
		};
	};
})();


// START OF PALETTE SCOPE
(function(){
	/**
	 * The static Palette class, which contains the range of drawing objects available in the Canvas API.
	 * @class {static} Canvas.Palette
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette = {};
	
	/**
	 * The prototypical Palette Object. All Palette Objects (except Gradients) inherit these values, although some properties are reduntant for certain objects.
	 * @constructor {private static} Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	var baseObject = function(){
		// DEFAULT STYLES FOR PALETTE OBJECTS
		
		/**
		 * The stroke colour to be used for new Pallet objects. A CSS colour name, a hex value or a gradient.
		 * @property {read write String} Palette.Object.stroke
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.stroke = "black";
		/**
		 * The stroke width in pixels to be used for new Pallet objects.
		 * @property {read write Number} Palette.Object.strokeWidth
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.strokeWidth = 3;
		/**
		 * The stroke cap to be used for new Pallet objects. Valid values are "butt", "round" or "square".
		 * @property {read write String} Palette.Object.strokeCap
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.strokeCap = "butt";
		/**
		 * The way to join strokes used for new Pallet objects. Valid values are "bevel", "round" or "miter".
		 * @property {read write String} Palette.Object.strokeJoin
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.strokeJoin = "miter";
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
		this.close = true;
		/**
		 * The rotation of the Palette object in degrees around its origin.
		 * @property {read write Number} Palette.Object.rotation
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.rotation = 0;
		/**
		 * The x coordinate of the Palette object's pivot relative to the object's origin.
		 * @property {read write Number} Palette.Object.pivotx
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.pivotx = 0;
		/**
		 * The y coordinate of the Palette object's pivot point relative to the objects natural origin.
		 * @property {read write Number} Palette.Object.pivoty
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.pivoty = 0;
		/**
		 * The x offset of the Palette object's shadow.
		 * @property {read write Number} Palette.Object.shadow
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.shadow = "transparent";
		/**
		 * The x offset of the Palette object's shadow.
		 * @property {read write Number} Palette.Object.shadowx
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.shadowx = 5;
		/**
		 * The y offset of the Palette object's shadow.
		 * @property {read write Number} Palette.Object.shadowy
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.shadowy = 5;
		/**
		 * The blur radius of the Palette object's shadow.
		 * @property {read write Number} Palette.Object.shadowBlur
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.shadowBlur = 10;
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
		this.end = 360;
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
		this.font = "24px Helvetica,Verdana,Arial,sans-serif";
		/** The alignent of the Text object. Valid values are "start", "end", "left", "right", "center". The default is "start".
		 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
		 * @property {read write String} Palette.Object.align
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.align = "start";
		/** The baseline alignment of a Text object. Valid values are "top", "hanging", "middle", "alphabetic", "ideographic", "bottom". The default is "alphabetic".
		 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
		 * @property {read write String} Palette.Object.baseline
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.baseline = "top";
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
		/**
		 * The x coordinate of the top-left corner of the clipping area of an image or video relative to the image or video.
		 * @property {read write Number} Palette.Object.clipx
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.clipx = 0;
		/**
		 * The y coordinate of the top-left corner of the clipping area of an image or video relative to the image or video.
		 * @property {read write Number} Palette.Object.clipy
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.clipy = 0;
		/**
		 * The width of the clipping area of an image or video.
		 * @property {read write Number} Palette.Object.clipWidth
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.clipWidth = undefined;
		/**
		 * The height of the clipping area of an image or video.
		 * @property {read write Number} Palette.Object.clipHeight
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.clipHeight = undefined;
		/**
		 * A number representing the z-order of layers in which objects are ordered. Objects with higher layer numbers are layerd above objects with lower layer numbers.
		 * @property {read write Number} Palette.Object.layer
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.layer = 0;
		/**
		 * The skew in degrees along the x-axis to be applied to the object.
		 * @property {read write Number} Palette.Object.xskew
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.xskew = 0;
		/**
		 * The skew in degrees along the y-axis to be applied to the object.
		 * @property {read write Number} Palette.Object.yskew
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.yskew = 0;
		/**
		 * The mask object for this object.
		 * @property {read write Canvas.Palette.Mask} Palette.Object.mask
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.mask = {};
		/**
		 * The hitArea object for this object. If properly defined the object will fire click events.
		 * @property {private read Canvas.Palette.Mask} Palette.Object.mask
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.hitArea = {};
		/**
		 * The mouse cursor to show when the mouse passes over an object (or it's hit area) if that object has a onRelease, onPress or onMouseOver function. This corresponds to the CSS cursor property so can contain a list of URLs (sperated by commaa) to custom pointers. It is recommended that if URLs are given that the final item in the list be the name of a generic custom type should none of the URLs be used. Valid generic values are auto, crosshair, default, e-resize, help, move, n-resize, ne-resize, nw-resize, pointer, progress, s-resize, se-resize, sw-resize, text, w-resize, wait and inherit. The default is pointer.
		 * @property {write read String} Palette.Object.cursor
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.cursor = "pointer";
		/**
		 * If set to true then the item will be dragable by clicking and dragging on it.
		 * @property {write read Boolean} Palette.Object.dragable
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.dragable = false;
		/**
		 * An event fired when a dragged object is dropped on this object.
		 * @function {public abstract void} Palette.Object.onDrop
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @param {Object} object The dropeed object.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onDrop = undefined;
		/**
		 * An event fired when a dragable object starts being dragged.
		 * @function {public abstract void} Palette.Object.onDragStart
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onDragStart = undefined;
		/**
		 * An event fired when a dragable object stops being dragged.
		 * @function {public abstract void} Palette.Object.onDragStop
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onDragStop = undefined;
		/**
		 * The top-most limit that an object may be dragged to.
		 * @property {write read Number} Palette.Object.dragLimitRight
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.dragLimitTop = undefined;
		/**
		 * The bottom-most limit that an object may be dragged to.
		 * @property {write read Number} Palette.Object.dragLimitBottom
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.dragLimitBottom = undefined;
		/**
		 * The left-most limit that an object may be dragged to.
		 * @property {write read Number} Palette.Object.dragLimitLeft
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.dragLimitLeft = undefined;
		/**
		 * The right-most limit that an object may be dragged to.
		 * @property {write read Number} Palette.Object.dragLimitRight
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.dragLimitRight = undefined;

		
		
		
		// COMMON METHODS
		
		/**
		 * Sets the hit area for a Palette object.
		 * @function {public Boolean} Palette.Object.setHitArea
		 * @param {Object} obj The hit area to be added
		 * @param {optional Boolean} copy Whether to (deep) copy the hit area when settings it. Defaults to true, otherwise a shallow copy of the hit area is set for the object. 
		 * @return true if the hit area was set, otherwise false.
		 * @author Oliver Moran
		 * @since 0.2
		 */	
		this.setHitArea = function(obj, copy){
			if (!(obj instanceof Canvas.Palette.HitArea) || !obj.draw) return false;
			
			if (copy) this.hitArea = obj.copy();
			else this.hitArea = obj;
			
			return true;
		};
		/**
		 * Sets the mask for a Palette object.
		 * @function {public Boolean} Palette.Object.setMask
		 * @param {Object} obj The mask to be added
		 * @param {optional Boolean} copy Whether to (deep) copy the mask when settings it. Defaults to true, otherwise a shallow copy of the mask is set for the object. 
		 * @return true if the mask was set, otherwise false.
		 * @author Oliver Moran
		 * @since 0.2
		 */	
		this.setMask = function(obj, copy){
			if (!(obj instanceof Canvas.Palette.Mask) || !obj.draw) return false;
			
			if (copy) this.mask = obj.copy();
			else this.mask = obj;
			
			return false;
		};
		
		/**
		 * A user-definable function that is called when the mouse button is released over the object or its hit area (or when a touch is released).
		 * @function {public abstract void} Palette.Object.onClick
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onRelease = undefined;
		/**
		 * A user-definable function that is called when the mouse button is pressed over the object or its hit area (or when a touch is started).
		 * @function {public abstract void} Palette.Object.onPress
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onPress = undefined;
		/**
		 * A user-definable function that is called when the mouse pointer is moved over the object or its hit area.
		 * @function {public abstract void} Palette.Object.onMouseOver
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onMouseOver = undefined;
		/**
		 * A user-definable function that is called when the mouse pointer is moved out of the object or its hit area.
		 * @function {public abstract void} Palette.Object.onMouseOut
		 * @param {Object} mouse An object describing the mouse position.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @... {Number} x The mouse x position of mouse relative to the canvas.
		 * @return Nothing.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// this.onMouseOut = undefined;
	
		
		/**
		 * Returns a deep copy of the object.
		 * @function {public void} Palette.Object.copy
		 * @return A deep copy of the object.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.copy = function(obj){
			var obj2;
			if (obj == null) {
				obj = this;
				// create new object
				if (this instanceof Canvas.Palette.Line) obj2 = new Canvas.Palette.Line();
				else if (this instanceof Canvas.Palette.Polygon) obj2 = new Canvas.Palette.Polygon();
				else if (this instanceof Canvas.Palette.Rectangle) obj2 = new Canvas.Palette.Rectangle();
				else if (this instanceof Canvas.Palette.Circle) { obj2 = new Canvas.Palette.Circle(); }
				else if (this instanceof Canvas.Palette.Arc) obj2 = new Canvas.Palette.Arc();
				else if (this instanceof Canvas.Palette.Bezier) obj2 = new Canvas.Palette.Bezier();
				else if (this instanceof Canvas.Palette.Quadratic) obj2 = new Canvas.Palette.Quadratic();
				else if (this instanceof Canvas.Palette.Image) obj2 = new Canvas.Palette.Image();
				else if (this instanceof Canvas.Palette.Audio) obj2 = new Canvas.Palette.Audio();
				else if (this instanceof Canvas.Palette.Video) obj2 = new Canvas.Palette.Video();
				else if (this instanceof Canvas.Palette.Text) obj2 = new Canvas.Palette.Text();
				else if (this instanceof Canvas.Palette.Group) obj2 = new Canvas.Palette.Group();
				else if (this instanceof Canvas.Palette.Group) obj2 = new Canvas.Palette.Procedure();
				else return undefined; // uh-oh!
			} else {
				if (obj instanceof Array) obj2 = new Array();
				else if (obj instanceof Canvas.Palette.Gradient) obj2 = new Canvas.Palette.Gradient();
				else if (obj instanceof Canvas.Palette.Radial) obj2 = new Canvas.Palette.Radial();
				else if (obj instanceof Canvas.Palette.Pattern) obj2 = new Canvas.Palette.Pattern();
				else if (obj instanceof Canvas.Palette.Mask) obj2 = new Canvas.Palette.Mask();
				else if (obj instanceof Canvas.Palette.HitArea) obj2 = new Canvas.Palette.HitArea();
				else if (obj && obj.constructor == Object) obj2 = new Object();
				else return obj; // all other types we return as references
			}
	
			for (var prop in obj) {
				obj2[prop] = this.copy(obj[prop]);
			}
			
			return obj2;
		};
		
		this.isMaskingObject = function(senders){
			for (var i=0; i<senders.length; i++)
				if (senders[i] instanceof Canvas.Palette.Mask) return true;
			return false;
		};
		
		this.beforeDrawObject = function(x, y, senders, context, trace){
			if (!this.isMaskingObject(senders)) {
				if (this.mask instanceof Canvas.Palette.Mask && Canvas.debug !== true) {
					// must be rendered after object in debug mode so we can see it 
					context.save();
					context.translate(x, y);
					this.mask.draw(Canvas.Utils.pushArray(senders, this), context, trace);
					context.translate(-x, -y);
				}
	
				// TODO: add error catching for incorrectly set properties
				/*
				if (this.alpha < 0 || this.alpha > 100 || isNaN(this.alpha) || Math.round(this.alpha) == Infinity) {
					this.alpha = baseObject.alpha;
				}
				*/
				context.globalCompositeOperation = "source-over";
				
				context.lineWidth = this.strokeWidth;
				context.lineCap = this.strokeCap;
				context.lineJoin = this.strokeJoin;
				context.shadowOffsetX = this.shadowx;
				context.shadowOffsetY = this.shadowy;  
				context.shadowBlur = this.shadowBlur;
				
				context.strokeStyle = this.stroke;
				context.shadowColor = this.shadow;
				if (this.fill instanceof Canvas.Palette.Gradient || 
					this.fill instanceof Canvas.Palette.Radial || 
					this.fill instanceof Canvas.Palette.Pattern){
						context.fillStyle = this.fill.draw([this], context);
				} else {
					context.fillStyle = this.fill;
				}
				
				context.globalAlpha = this.alpha * (1/100);
				for (var sender in senders)
					if (senders[sender].alpha) 
						context.globalAlpha *= senders[sender].alpha * (1/100);
				
				if (this instanceof Canvas.Palette.Text){
					context.font = this.font;
					context.textAlign = this.align;
					context.textBaseline = this.baseline;
				}
			}
		
			// translate
			context.translate(x, y);
			// rotate
			context.rotate(this.rotation * Math.PI/180);
			// scale and skew
			context.transform(this.xscale/100, (this.xskew * Math.PI/180), (this.yskew * -Math.PI/180), this.yscale/100, 0, 0);
		};
		
		this.afterDrawObject = function(x, y, senders, context, trace){
			if (this.hitArea instanceof Canvas.Palette.HitArea && (trace || Canvas.debug === true)){
				this.hitArea.draw(Canvas.Utils.pushArray(senders, this), context, trace);
			}
	
			// reverse the transformations in series
			context.transform(100/this.xscale, (this.xskew * -Math.PI/180), (this.yskew * Math.PI/180), 100/this.yscale, 0, 0);
			context.rotate(this.rotation * -Math.PI/180);
			context.translate(x, y);
	
			// must be rendered after object in debug mode so we can see it 
			if (!this.isMaskingObject(senders)) {
				if (this.mask instanceof Canvas.Palette.Mask && Canvas.debug === true) {
					context.save();
					context.translate(-x, -y);
					this.mask.draw(Canvas.Utils.pushArray(senders, this), context, trace);
					context.translate(x, y);
				}
	
				if (this.mask instanceof Canvas.Palette.Mask) context.restore();
			}
		};
		
		
		// ANIMATION
		
		/*
		 * Yuichi Tateno. <hotchpotch@N0!spam@gmail.com>
		 * http://rails2u.com/
		 * 
		 * The MIT License
		 * --------
		 * Copyright (c) 2007 Yuichi Tateno
		 * 
		 * Permission is hereby granted, free of charge, to any person obtaining a copy
		 * of this software and associated documentation files (the "Software"), to deal
		 * in the Software without restriction, including without limitation the rights
		 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		 * copies of the Software, and to permit persons to whom the Software is
		 * furnished to do so, subject to the following conditions:
		 * 
		 * The above copyright notice and this permission notice shall be included in
		 * all copies or substantial portions of the Software.
		 * 
		 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		 * THE SOFTWARE.
		 *
		 */
		 
		/* 
		 * The following is based on JSTweener by Yuichi Tateno:
		 * http://coderepos.org/share/wiki/JSTweener
		 *
		 * Adapted for use with Canvas API by Oliver Moran (2010)
		 *
		 */
	
		/**
		 * The static Tweener class, which contains a range of methods for animating Pallet Objects.
		 * @class {private static} Palette.Object.Tweener
		 * @author Yuichi Tateno
		 * @since 0.2
		 */
		var Tweener = {
		    looping: false,
		    objects: [],
		    defaultOptions: {
			    framerate: 12,
		        time: 1,
		        transition: 'linear',
		        delay: 0,
		        onStart: undefined,
		        onStartParams: undefined,
		        onUpdate: undefined,
		        onUpdateParams: undefined,
		        onComplete: undefined,
		        onCompleteParams: undefined
		    },
		    inited: false,
		    easingFunctionsLowerCase: {},
		    init: function() {
		        this.inited = true;
		        for (var key in easingFunctions) {
		            this.easingFunctionsLowerCase[key.toLowerCase()] = easingFunctions[key];
		        }
		    },
			/**
			 * Applies a tween to a Palette Object.
			 * @function {private static void} Palette.Object.Tweener.doTween
			 * @param {Object} obj The object to apply the tween to. This object may be the palette object itself or a sub-object (such as stroke).
			 * @param {Object} options An object containing parameters that define the behavior of the tween.
			 * @... {optional Number} time The duration in seconds of the tween. Defaults to 1.
			 * @... {optional String} transition The name of the tween to use. Valid values are "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeOutInCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeOutInQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeOutInQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeOutInSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeOutInExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeOutInCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeOutInElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeOutInBack", "easeInBounce", "easeOutBounce", "easeInOutBounce", "easeOutInBounce". Default it "linear". 
			 * @... {optional Number} delay A delay in seconds before the tween begins.
			 * @... {optional Function} onComplete A function called on completion of the tween.
			 * @... {optional Object} onCompleteParams A custom object to be passed as a second argument to the onComplete function. The first argument is an object that describes the tween.
			 * @... {optional Function} onCancel A function called on the cancellatino of the tween by another contradictary call.
			 * @... {optional Object} onCancelParams A custom object to be passed as a second argument to the onCancel function. The first argument is an object that describes the tween.
			 * @... {optional Function} onUpdate A function called on a each frame of the animation.
			 * @... {optional Object} onUpdateParams A custom object to be passed as a second argument to the onUpdate function. The first argument is an object that describes the tween.
			 * @... {optional Function} onStart A function called on start of the tween.
			 * @... {optional Object} onStartParams A custom object to be passed as a second argument to the onStart function. The first argument is an object that describes the tween.
			 * @... {Number} prop1 A property of obj to be tweened.
			 * @... {optional Number} propN (Any number of properties of obj may be passed.)
			 * @return Nothing
			 * @author Oliver Moran
			 * @since 0.2
			 */	
		    doTween: function(obj, options) {
		        var self = this;
		        if (!this.inited) this.init();
		        var o = {};
		        o.target = obj;
		        o.targetPropeties = {};
		        
		        for (var key in this.defaultOptions) {
		            if (typeof options[key] != 'undefined') {
		                o[key] = options[key];
		                delete options[key];
		            } else {
		                o[key] = this.defaultOptions[key];
		            }
		        }
	
		        if (typeof o.transition == 'function') {
		            o.easing = o.transition;
		        } else {
		            o.easing = this.easingFunctionsLowerCase[o.transition.toLowerCase()];
		        }
	
		        for (var key in options) {
		            var sB = obj[key];
		            o.targetPropeties[key] = {
		                b: sB,
		                c: options[key] - sB
		            };
		        }
	
		        setTimeout(function() {
		            o.startTime = (new Date() - 0);
		            o.endTime = o.time * 1000 + o.startTime;
	
		            if (typeof o.onStart == 'function') {
		                if (o.onStartParams) {
		                    o.onStart.apply(o, o.onStartParams);
		                } else {
		                    o.onStart();
		                }
		            }
	
		            // START OF CODE ADDED BY OLIVER MORAN
		            // Added by Oliver Moran, 2010
		            // Removes duplicate properties 
		            for (var i = 0; i < self.objects.length; i++) {
			        	if (self.objects[i].target == o.target) {
			        		var c = 0;
			                for (var property in self.objects[i].targetPropeties) {
			                	c++;
			                	for (var new_property in o.targetPropeties){
			                		if (property == new_property) {
			                			delete self.objects[i].targetPropeties[property]; // delete this property from the object
					                	c--;
			                		}
			                	}
			                	if (c == 0) { // the object is empty so delete it completely
			                		if (typeof self.objects[i].onCancel == 'function'){
					                    if (self.objects[i].onCancelParams) { // alert a onCancel method
					                    	self.objects[i].onComplete.apply(o, o.onCompleteParams);
					                    } else {
					                    	self.objects[i].onCancel();
					                    }
			                		}
			                		self.objects.splice(i,1);
			                	}
			                }
			        	}
		            }
		            // END OF CODE ADDED BY OLIVER MORAN
		            	
		            self.objects.push(o);
		            if (!self.looping) { 
		                self.looping = true;
		                self.eventLoop.call(self);
		            }
		        }, o.delay * 1000);
		    },
		    eventLoop: function() {
		        var now = (new Date() - 0);
		        for (var i = 0; i < this.objects.length; i++) {
		            var o = this.objects[i];
		            var t = now - o.startTime;
		            var d = o.endTime - o.startTime;
	
		            if (t >= d) {
		                for (var property in o.targetPropeties) {
		                    var tP = o.targetPropeties[property];
							o.target[property] = (tP.b + tP.c);
		                }
		                this.objects.splice(i, 1);
	
		                if (typeof o.onUpdate == 'function') {
		                    if (o.onUpdateParams) {
		                        o.onUpdate.apply(o, o.onUpdateParams);
		                    } else {
		                        o.onUpdate();
		                    }
		                }
	
		                if (typeof o.onComplete == 'function') {
		                    if (o.onCompleteParams) {
		                        o.onComplete.apply(o, o.onCompleteParams);
		                    } else {
		                        o.onComplete();
		                    }
		                }
		            } else {
		                for (var property in o.targetPropeties) {
		                    var tP = o.targetPropeties[property];
		                    o.target[property] = o.easing(t, tP.b, tP.c, d);
		                }
	
		                if (typeof o.onUpdate == 'function') {
		                    if (o.onUpdateParams) {
		                        o.onUpdate.apply(o, o.onUpdateParams);
		                    } else {
		                        o.onUpdate();
		                    }
		                }
		            }
		        }
	
		        if (this.objects.length > 0) {
		            var self = this;
		            setTimeout(function() { self.eventLoop(); }, 1000/o.framerate);
		        } else {
		            this.looping = false;
		        }
		    }
		};
	
	
		/*
		 * Tweener's easing functions (Penner's Easing Equations) porting to JavaScript.
		 * http://code.google.com/p/tweener/
		 * 
		 */
	
		var easingFunctions = {
		    easeNone: function(t, b, c, d) {
		        return c*t/d + b;
		    },    
		    easeInQuad: function(t, b, c, d) {
		        return c*(t/=d)*t + b;
		    },    
		    easeOutQuad: function(t, b, c, d) {
		        return -c *(t/=d)*(t-2) + b;
		    },    
		    easeInOutQuad: function(t, b, c, d) {
		        if((t/=d/2) < 1) return c/2*t*t + b;
		        return -c/2 *((--t)*(t-2) - 1) + b;
		    },    
		    easeInCubic: function(t, b, c, d) {
		        return c*(t/=d)*t*t + b;
		    },    
		    easeOutCubic: function(t, b, c, d) {
		        return c*((t=t/d-1)*t*t + 1) + b;
		    },    
		    easeInOutCubic: function(t, b, c, d) {
		        if((t/=d/2) < 1) return c/2*t*t*t + b;
		        return c/2*((t-=2)*t*t + 2) + b;
		    },    
		    easeOutInCubic: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutCubic(t*2, b, c/2, d);
		        return easingFunctions.easeInCubic((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInQuart: function(t, b, c, d) {
		        return c*(t/=d)*t*t*t + b;
		    },    
		    easeOutQuart: function(t, b, c, d) {
		        return -c *((t=t/d-1)*t*t*t - 1) + b;
		    },    
		    easeInOutQuart: function(t, b, c, d) {
		        if((t/=d/2) < 1) return c/2*t*t*t*t + b;
		        return -c/2 *((t-=2)*t*t*t - 2) + b;
		    },    
		    easeOutInQuart: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutQuart(t*2, b, c/2, d);
		        return easingFunctions.easeInQuart((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInQuint: function(t, b, c, d) {
		        return c*(t/=d)*t*t*t*t + b;
		    },    
		    easeOutQuint: function(t, b, c, d) {
		        return c*((t=t/d-1)*t*t*t*t + 1) + b;
		    },    
		    easeInOutQuint: function(t, b, c, d) {
		        if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		        return c/2*((t-=2)*t*t*t*t + 2) + b;
		    },    
		    easeOutInQuint: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutQuint(t*2, b, c/2, d);
		        return easingFunctions.easeInQuint((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInSine: function(t, b, c, d) {
		        return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
		    },    
		    easeOutSine: function(t, b, c, d) {
		        return c * Math.sin(t/d *(Math.PI/2)) + b;
		    },    
		    easeInOutSine: function(t, b, c, d) {
		        return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
		    },    
		    easeOutInSine: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutSine(t*2, b, c/2, d);
		        return easingFunctions.easeInSine((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInExpo: function(t, b, c, d) {
		        return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
		    },    
		    easeOutExpo: function(t, b, c, d) {
		        return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
		    },    
		    easeInOutExpo: function(t, b, c, d) {
		        if(t==0) return b;
		        if(t==d) return b+c;
		        if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
		        return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
		    },    
		    easeOutInExpo: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutExpo(t*2, b, c/2, d);
		        return easingFunctions.easeInExpo((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInCirc: function(t, b, c, d) {
		        return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
		    },    
		    easeOutCirc: function(t, b, c, d) {
		        return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
		    },    
		    easeInOutCirc: function(t, b, c, d) {
		        if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
		        return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
		    },    
		    easeOutInCirc: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutCirc(t*2, b, c/2, d);
		        return easingFunctions.easeInCirc((t*2)-d, b+c/2, c/2, d);
		    },    
		    easeInElastic: function(t, b, c, d, a, p) {
		        var s;
		        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
		        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
		        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
		    },    
		    easeOutElastic: function(t, b, c, d, a, p) {
		        var s;
		        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
		        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
		        return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
		    },    
		    easeInOutElastic: function(t, b, c, d, a, p) {
		        var s;
		        if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
		        if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
		        if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
		        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		    },    
		    easeOutInElastic: function(t, b, c, d, a, p) {
		        if(t < d/2) return easingFunctions.easeOutElastic(t*2, b, c/2, d, a, p);
		        return easingFunctions.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
		    },    
		    easeInBack: function(t, b, c, d, s) {
		        if(s == undefined) s = 1.70158;
		        return c*(t/=d)*t*((s+1)*t - s) + b;
		    },    
		    easeOutBack: function(t, b, c, d, s) {
		        if(s == undefined) s = 1.70158;
		        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		    },    
		    easeInOutBack: function(t, b, c, d, s) {
		        if(s == undefined) s = 1.70158;
		        if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		    },    
		    easeOutInBack: function(t, b, c, d, s) {
		        if(t < d/2) return easingFunctions.easeOutBack(t*2, b, c/2, d, s);
		        return easingFunctions.easeInBack((t*2)-d, b+c/2, c/2, d, s);
		    },    
		    easeInBounce: function(t, b, c, d) {
		        return c - easingFunctions.easeOutBounce(d-t, 0, c, d) + b;
		    },    
		    easeOutBounce: function(t, b, c, d) {
		        if((t/=d) <(1/2.75)) {
		            return c*(7.5625*t*t) + b;
		        } else if(t <(2/2.75)) {
		            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		        } else if(t <(2.5/2.75)) {
		            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		        } else {
		            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		        }
		    },    
		    easeInOutBounce: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeInBounce(t*2, 0, c, d) * .5 + b;
		        else return easingFunctions.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
		    },    
		    easeOutInBounce: function(t, b, c, d) {
		        if(t < d/2) return easingFunctions.easeOutBounce(t*2, b, c/2, d);
		        return easingFunctions.easeInBounce((t*2)-d, b+c/2, c/2, d);
		    }
		};
		easingFunctions.linear = easingFunctions.easeNone;
	
		// End of (c) Yuichi Tateno
		
		
		/**
		 * Animate an object's properties by a tweening
		 * @function {static void} Palette.Object.tween
		 * @param {Object} options An object containing parameters that define the behavior of the tween.
		 * @... {optional Number} time The duration in seconds of the tween. Defaults to 1.
		 * @... {optional String} transition The name of the tween to use. Valid values are "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeOutInCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeOutInQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeOutInQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeOutInSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeOutInExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeOutInCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeOutInElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeOutInBack", "easeInBounce", "easeOutBounce", "easeInOutBounce", "easeOutInBounce". Default it "linear". 
		 * @... {optional Number} delay A delay in seconds before the tween begins.
		 * @... {optional Function} onComplete A function called on completion of the tween.
		 * @... {optional Object} onCompleteParams A custom object to be passed as a second argument to the onComplete function. The first argument is an object that describes the tween.
		 * @... {optional Function} onUpdate A function called on a each frame of the animation.
		 * @... {optional Object} onUpdateParams A custom object to be passed as a second argument to the onUpdate function. The first argument is an object that describes the tween.
		 * @... {optional Function} onStart A function called on start of the tween.
		 * @... {optional Object} onStartParams A custom object to be passed as a second argument to the onStart function. The first argument is an object that describes the tween.
		 * @... {Number} prop1 A property to be tweened and it's destination value e.g. to tween the property x to 10 pass the argument x:0
		 * @... {optional Number} propN (Any number of properties may be passed.)
		 * @return Nothing
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.tween = function(args){
			Tweener.doTween(this, args);
		};
		
		this.fadeOut = function(seconds){
			if (seconds != undefined && isNaN(seconds)) return;
			Tweener.doTween(this, {alpha:0});
		};
		this.fadeIn = function(seconds){
			if (seconds != undefined && isNaN(seconds)) return;
			Tweener.doTween(this, {alpha:100});
		};
	};
	
	
	/**
	 * Creates a Line.
	 * @constructor {public} Palette.Line
	 * @param {Number} x1 The x coordinate of the first point in the Line in pixels.
	 * @param {Number} y1 The y coordinate of the first point in the Line in pixels.
	 * @param {Number} x2 The x coordinate of the second point in the Line in pixels.
	 * @param {Number} y2 The y coordinate of the second point in the Line in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Line = function (x1, y1, x2, y2){
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return false; // catch errors

		Canvas.Utils.inherit(this, new baseObject());
		
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x1 += x;
			this.y1 += y;
			this.x2 += x;
			this.y2 += y;
			
			return true;
		};

		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};

		this.center = function(){
			return {x:(this.x1+this.x2)/2, y:(this.y1+this.y2)/2};
		};

		// The private draw function
		this.draw = function(senders, context, trace){
			this.beforeDrawObject(this.x1+this.pivotx, this.y1+this.pivoty, senders, context, trace);
			
			if (trace) {
				var radians = Math.abs(Math.atan2(this.x2-this.x1, this.y2-this.y1));
				var x1 = (this.strokeWidth) * Math.cos(radians* 180/Math.PI); // width is not divided two here to fit the stroke better
				var y1 = (this.strokeWidth/2) * Math.sin(radians* 180/Math.PI);
	
				context.strokeStyle = "transparent";
				context.beginPath();
				context.moveTo((0-this.pivotx)-x1, (0-this.pivoty)-y1);
				context.lineTo(((this.x2-this.x1)-this.pivotx)-x1, ((this.y2-this.y1)-this.pivoty)+y1);
				context.lineTo(((this.x2-this.x1)-this.pivotx)+x1, ((this.y2-this.y1)-this.pivoty)+y1);
				context.lineTo((0-this.pivotx)+x1, (0-this.pivoty)-y1);
				context.closePath();
			} else {
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
				context.moveTo(-this.pivotx, -this.pivoty);
				context.lineTo((this.x2-this.x1)-this.pivotx, (this.y2-this.y1)-this.pivoty);
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
			
			this.afterDrawObject(-(this.x1+this.pivotx), -(this.y1+this.pivoty), senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates a Polygon.
	 * @constructor {public} Palette.Polygon
	 * @param {optional Number} x The x coordinate of the first point in the Line in pixels.
	 * @param {optional Number} y The y coordinate of the first point in the Line in pixels.
	 * @param {optional Number} n1 ... Any number of pairs of x, y coordinates
	 * @param {optional Number} n2 ... Any number of pairs of x, y coordinates
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Polygon = function (){
		if (arguments.length%2 != 0) return false;
		for (var n in arguments)
			if (isNaN(arguments[n])) return false; // error catching
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.points = new Array();
		this.addPoint = function(x, y){
			var point = new Object();
			point.x = x;
			point.y = y;
			this.points.push(point);
		};
		for (var i=0; i<arguments.length; i+=2){
			this.addPoint(arguments[i], arguments[i+1]);
		}
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			for (var point in this.points)
				if (points[point]) {
					points[point].x += x;
					points[point].y += y;
				}
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};

		this.center = function(){
			if (this.points.length == 0) return false;
			var xs = "";
			var ys = "";
			for (var point in this.points)
				if (points[point]) {
					xs = "," + points[point].x;
					ys = "," + points[point].y;
				}
			
			xs = xs.substring(1);
			ys = ys.substring(1);
			
			var min_x = eval("Math.min("+x2+")");
			var max_x = eval("Math.max("+x2+")");
			var min_y = eval("Math.min("+y2+")");
			var max_y = eval("Math.max("+y2+")");
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};
		
		this.draw = function(senders, context, trace){
			if (this.points.length < 2) return; // get out of here if we don't have enough points
			
			this.beforeDrawObject(this.points[0].x+this.pivotx, this.points[0].y+this.pivoty, senders, context, trace);
	
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.moveTo(-this.pivotx, -this.pivoty);
			for (var i=1; i<this.points.length; i++)
				context.lineTo((this.points[i].x-this.points[0].x)-this.pivotx, (this.points[i].y-this.points[0].y)-this.pivoty);
			if (trace){
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
	
			this.afterDrawObject(-(this.points[0].x+this.pivotx), -(this.points[0].y+this.pivoty), senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates a Rectangle.
	 * @constructor {public} Palette.Rectangle
	 * @param {Number} x The x coordinate of the top left corder of the Rectangle in pixels.
	 * @param {Number} y The x coordinate of the top left corder of the Rectangle in pixels.
	 * @param {Number} width The width of the Rectangle in pixels.
	 * @param {Number} height The height of the Rectangle in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Rectangle = function(x, y, width, height){
		if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			var min_x = this.x;
			var max_x = this.x + this.width;
			var min_y = this.y;
			var max_y = this.y + this.height;
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};
		
		this.draw = function(senders, context, trace){
			var w2 = this.width/2;
			var h2 = this.height/2;
			var o_x = this.x + w2 + this.pivotx;
			var o_y = this.y + h2 + this.pivoty;
	
			this.beforeDrawObject(o_x, o_y, senders, context, trace);
	
			if (trace){
				context.strokeStyle = "transparent";
				context.beginPath();
				context.moveTo(-(w2+this.pivotx), -(h2+this.pivoty));
				context.lineTo((w2+this.pivotx), -(h2+this.pivoty));
				context.lineTo((w2+this.pivotx), (h2+this.pivoty));
				context.lineTo(-(w2+this.pivotx), (h2+this.pivoty));
				context.closePath();
			} else {
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
				context.fillRect(-(w2+this.pivotx), -(h2+this.pivoty), this.width, this.height);
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				context.strokeRect(-(w2+this.pivotx), -(h2+this.pivoty), this.width, this.height);
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
	
			this.afterDrawObject(-o_x, -o_y, senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates a Circle.
	 * @constructor {public} Palette.Circle
	 * @param {Number} x The x coordinate of the centre point the Circle in pixels.
	 * @param {Number} y The y coordinate of the centre point the Circle in pixels.
	 * @param {Number} radius The radius of the circle in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Circle = function(x, y, radius){
		if (isNaN(x) || isNaN(y) || isNaN(radius)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
		
		this.x = x;
		this.y = y;
		this.radius = radius;
	
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};

		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};

		this.center = function(){
			return {x:this.x, y:this.y};
		};

		this.draw = function(senders, context, trace){
			this.beforeDrawObject(this.x+this.pivotx, this.y+this.pivoty, senders, context, trace);
			
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.arc(-this.pivotx, -this.pivoty, this.radius, this.start, this.end * Math.PI/180, this.clockwise);
			if (trace) {
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
			
			this.afterDrawObject(-(this.x+this.pivotx), -(this.y+this.pivoty), senders, context, trace);
		};
		
		return true;
	};
	
	
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
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Arc = function(x1, y1, x2, y2, x3, y3, radius){
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x3) || isNaN(y3) || isNaN(radius)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.radius = radius;
		
		this.copy = function(){
			var arc = new Canvas.Palette.Arc(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.radius);
				
			for (var prop in this) 
				if (typeof this[prop] != "object")
					arc[prop] = this[prop];
			
			if (this.mask) arc.mask = this.mask.copy();
			if (this.hitArea) arc.mask = this.mask.copy();
			
			return arc;
		};
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;

			this.x1 += x;
			this.y1 += y;
			this.x2 += x;
			this.y2 += y;
			this.x3 += x;
			this.y3 += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};

		this.center = function(){
			var min_x = Math.min(x1,x2,x3);
			var max_x = Math.max(x1,x2,x3);
			var min_y = Math.min(y1,y2,y3);
			var max_y = Math.max(y1,y2,y3);
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};

		this.draw = function(senders, context, trace){
			var o_x = (this.x1 + this.x3)/2 + this.pivotx;
			var o_y = (this.y1 + this.y3)/2 + this.pivoty;
			
			this.beforeDrawObject(o_x, o_y, senders, context, trace);
			
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.arcTo(this.x2-o_x, this.y2-o_y, this.x3-o_x, this.y3-o_y, this.radius); // Create an arc.
			context.lineTo(this.x3-o_x, this.y3-o_y);
			if (trace) {
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
	
			this.afterDrawObject(-o_x, -o_y, senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an cubic BŽzier curve.
	 * @constructor {public} Palette.Bezier
	 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
	 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
	 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
	 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
	 * @param {Number} c_x1 The x coordinate of the first control point of the curve in pixels.
	 * @param {Number} c_y1 The y coordinate of the first control point of the curve in pixels.
	 * @param {Number} c_x2 The x coordinate of the second control point of the curve in pixels.
	 * @param {Number} c_y2 The y coordinate of the second control point of the curve in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Bezier = function(x1, y1, x2, y2, c_x1, c_y1, c_x2, c_y2){
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(c_x1) || isNaN(c_y1) || isNaN(c_x2) || isNaN(c_y2)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x1 = c_x1;
		this.c_y1 = c_y1;
		this.c_x2 = c_x2;
		this.c_y2 = c_y2;
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;

			this.x1 += x;
			this.y1 += y;
			this.x2 += x;
			this.y2 += y;
			
			this.c_x1 += x;
			this.c_y1 += y;
			this.c_x2 += x;
			this.c_y2 += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};

		this.center = function(){
			var min_x = Math.min(x1,x2,x3,c_x1,c_x2);
			var max_x = Math.max(x1,x2,x3,c_x1,c_x2);
			var min_y = Math.min(y1,y2,y3,c_y1,c_y2);
			var max_y = Math.max(y1,y2,y3,c_y1,c_y2);
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};

		this.draw = function(senders, context, trace){
			var o_x = (this.x1 + this.x2)/2 + this.pivotx;
			var o_y = (this.y1 + this.y2)/2 + this.pivoty;
			
			this.beforeDrawObject(o_x, o_y, senders, context, trace);
			
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.bezierCurveTo(this.c_x1-o_x, this.c_y1-o_y, this.c_x2-o_x, this.c_y2-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (trace) {
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
	
			this.afterDrawObject(-o_x, -o_y, senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an quadratic BŽzier curve.
	 * @constructor {public} Palette.Quadratic
	 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
	 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
	 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
	 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
	 * @param {Number} c_x The x coordinate of the first control point of the curve in pixels.
	 * @param {Number} c_y The y coordinate of the first control point of the curve in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Quadratic = function(x1, y1, x2, y2, c_x, c_y){
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(c_x) || isNaN(c_y)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x = c_x;
		this.c_y = c_y;
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;

			this.x1 += x;
			this.y1 += y;
			this.x2 += x;
			this.y2 += y;
			
			this.c_x += x;
			this.c_y += y;
		
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			var min_x = Math.min(x1,x2,x3,c_x);
			var max_x = Math.max(x1,x2,x3,c_x);
			var min_y = Math.min(y1,y2,y3,c_y);
			var max_y = Math.max(y1,y2,y3,c_y);
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};

		this.draw = function(senders, context, trace){
			var o_x = (this.x1 + this.x2)/2 + this.pivotx;
			var o_y = (this.y1 + this.y2)/2 + this.pivoty;
			
			this.beforeDrawObject(o_x, o_y, senders, context, trace);
			
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.quadraticCurveTo(this.c_x-o_x, this.c_y-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (trace){
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
			
			this.afterDrawObject(-o_x, -o_y, senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an Image from a source file (.png, .gif, .svg, .jpg, etc.).
	 * @constructor {public} Palette.Image
	 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
	 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
	 * @param {String} src A URL to the source file for the image.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Image = function(x, y, src){
		if (isNaN(x) || isNaN(y) || (typeof src != "string" && (typeof src == "object" && src.constructor != document.createElement("img").constructor))) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x = x;
		this.y = y;
		var image = src;
		if (typeof src == "string") image = Canvas.Library.addImage(src);
		var _image = image;
		
		this.imageEffectsLibrary = Canvas.defaultImageEffectsLibrary; // the default FX library can be over ridden
	
		this.isComplete = function(){
			return (image.complete);
		};
		
		/**
		 * If an effects library is included on the web page, Canvas API can add effects to images using that library. Currently only the Pixastic library is supported.
		 * @function {public void} Palette.Video.addEffect
		 * @param {String} name The name of the effect to add.
		 * @param {Object} args An objet containing the arguments to be passed to the effects library.
		 * @return Nothing
		 * @author Oliver Moran
		 * @since 0.2
		 */
		var effect = null;
		var effect_args = null;
		this.addEffect = function(name, args){
			effect = name;
			effect_args = args;
		};
		/**
		 * Clears all of the effects added to an image.
		 * @function {public void} Palette.Video.clearEffects
		 * @return Nothing
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.clearEffects = function(){
			proc_image = image;
		};
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			if (this.clipWidth == undefined || this.clipHeight == undefined)
				return {x:this.x, y:this.y};
			
			var min_x = this.x;
			var max_x = this.x + this.clipWidth;
			var min_y = this.y;
			var max_y = this.y + this.clipHeight;
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};

		this.draw = function(senders, context, trace){
			if (effect) { // we don't need to test for the library because of the try...catch
				try{
					_image = Canvas.imageEffectsLibrary(_image, effect, effect_args);
					effect = null;
				} catch(err){
					effect = null; // set to null so we don't create a loop
					// something may have gone wrong in the library, so ignore it
				}
			}
			
			if (this.clipWidth == undefined) 
				if (_image.naturalWidth) this.clipWidth = _image.naturalWidth - this.clipx;
				else if (_image.width) this.clipWidth = _image.width - this.clipx; // Opera
				else return false; // would cause an error
			if (this.clipHeight == undefined) 
				if (_image.naturalHeight) this.clipHeight = _image.naturalHeight - this.clipy;
				else if (_image.height) this.clipHeight = _image.height - this.clipy; // Opera
				else return false; // would cause an error
			
			this.beforeDrawObject(this.x+this.pivotx, this.y+this.pivoty, senders, context, trace);
	
			if (trace) {
				context.strokeStyle = "transparent";
				context.beginPath();
				context.moveTo(-this.pivotx, -this.pivoty);
				context.lineTo(this.clipWidth-this.pivotx, 0-this.pivoty);
				context.lineTo(this.clipWidth-this.pivotx, this.clipHeight-this.pivoty);
				context.lineTo(0-this.pivotx, this.clipHeight-this.pivoty);
				context.closePath();
			} else {
				context.drawImage(_image, this.clipx, this.clipy, this.clipWidth, this.clipHeight, -this.pivotx, -this.pivoty, this.clipWidth, this.clipHeight);
			}
			
			this.afterDrawObject(-(this.x+this.pivotx), -(this.y+this.pivoty), senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an Audio object from a source file (.ogg, .mp3, .wav, etc.).
	 * @constructor {public} Palette.Audio
	 * @param {String or Array} src A URL to the source file for the audio or an array of strings of URLs to the audio. It is recommended to provide an array of URLs to the same audio in different formats since different browsers support different audio formats.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Audio = function(src){
		if (typeof src != "string" || (typeof src == "object" && src.constructor != Array)) return false; // catch errors
		if (typeof src != "string") for (var n in src) if (typeof src[n] != "string") return false; // error catching
		
		if (!document.createElement("audio").play) return false; // unsupported by Camino
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.audio = Canvas.Library.addAudio(src);
		
		this.isComplete = function(){
			return (audio.complete == true);
		};

		this.play = function(){
			this.audio.play();
		};
		this.stop = function(){
			this.audio.pause();
			this.audio.currentTime = 0;
		};
		this.pause = function(){
			this.audio.pause();
		};
		this.setTime = function(time){
			this.audio.currentTime = 0;
		};
		this.setVolume = function(volume){
			this.audio.volume = volume/100;
		};
		this.getDuration = function(){
			return this.audio.duration;
		};
		
		this.draw = function(senders, context){
			// an empty function solely to allow object this to be added to scenes
		};
		
		return true;
	};
	
	
	/**
	 * Creates a Video object from a source file (.ogg, .mov, .mpg, etc.).
	 * @constructor {public} Palette.Video
	 * @param {Number} x The x coordinate of the top-left corder of the video in pixels.
	 * @param {Number} y The y coordinate of the top-left corder of the video in pixels.
	 * @param {String or Array} src A URL to the source file for the video or an array of strings of URLs to the video. It is recommended to provide an array of URLs to the same video in different formats since different browsers support different video formats.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Video = function(x, y, src){
		if (isNaN(x) || isNaN(y) || (typeof src != "string" && (typeof src == "object" && src.constructor != Array))) return false; // catch errors
		if (typeof src != "string") for (var n in src) if (typeof src[n] != "string") return false; // error catching
	
		if (!document.createElement("video").play) return false; // unsupported by Camino
		
		Canvas.Utils.inherit(this, new baseObject());
	
		if ((x && y && src) != undefined){
			this.x = x;
			this.y = y;
			this.video = Canvas.Library.addVideo(src);
	
			this.isComplete = function(){
				return (video.complete == true);
			};

			this.play = function(){
				this.video.play();
			};
			this.stop = function(){
				this.video.pause();
				this.video.currentTime = 0;
			};
			this.pause = function(){
				this.video.pause();
			};
			this.setTime = function(time){
				this.video.currentTime = 0;
			};
			this.setVolume = function(volume){
				this.video.volume = volume/100;
			};
			this.getDuration = function(){
				return this.video.duration;
			};
			
			this.moveBy = function(x, y){
				if (isNaN(x) || isNaN(y)) return false;
				
				this.x += x;
				this.y += y;
				
				return true;
			};
			
			this.moveTo = function(x, y){
				if (isNaN(x) || isNaN(y)) return false;
				var c = this.center();
				return this.moveBy(x - c.x, y - c.y);
			};
			
			this.center = function(){
				if (this.clipWidth == undefined || this.clipHeight == undefined)
					return {x:this.x, y:this.y};
				
				var min_x = this.x;
				var max_x = this.x + this.clipWidth;
				var min_y = this.y;
				var max_y = this.y + this.clipHeight;
				
				return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
			};
			
			this.draw = function(senders, context, trace){
				this.beforeDrawObject(this.x+this.pivotx, this.y+this.pivoty, senders, context, trace);
				
				if (this.clipWidth == undefined) 
					this.clipWidth = this.video.videoWidth - this.clipx;
				if (this.clipHeight == undefined) 
					this.clipHeight = this.video.videoHeight - this.clipy;
				
				if (trace) {
					context.strokeStyle = "transparent";
					context.beginPath();
					context.moveTo(-this.pivotx, -this.pivoty);
					context.lineTo(this.clipWidth-this.pivotx, 0-this.pivoty);
					context.lineTo(this.clipWidth-this.pivotx, this.clipHeight-this.pivoty);
					context.lineTo(0-this.pivotx, this.clipHeight-this.pivoty);
					context.closePath();
				} else {
					context.drawImage(this.video, this.clipx, this.clipy, this.clipWidth, this.clipHeight, -this.pivotx, -this.pivoty, this.clipWidth, this.clipHeight);
				}
				
				this.afterDrawObject(-(this.x+this.pivotx), -(this.y+this.pivoty), senders, context, trace);
			};
		}
		
		return true;
	};
	
	
	/**
	 * Writes a text string on to the canvas
	 * @constructor {public} Palette.Text
	 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
	 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
	 * @param {String} src A URL to the source file for the image.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Text = function(x, y, text){
		if (isNaN(x) || isNaN(y) || typeof text != "string") return false; // catch errors
		if (!document.createElement("canvas").getContext("2d").fillText || !document.createElement("canvas").getContext("2d").strokeText) return false; // not supported on Camino

		Canvas.Utils.inherit(this, new baseObject());
	
		this.x = x;
		this.y = y;
		this.text = text;
	
		// over ride the default values
		this.fill = this.stroke;
		this.stroke = "transparent";
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			if (this.clipWidth == undefined || this.clipHeight == undefined)
				return {x:this.x, y:this.y};
			
			var min_x = this.x;
			var max_x = this.x + this.width();
			var min_y = this.y;
			var max_y = this.y + this.height();
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};
		
		/**
		 * Determines the text direction of the canvas tags in a document.
		 * @function {private static Boolean} Canvas.Palette.Text.determineDocumentIsLeftToRight
		 * @return true if text runs left-to-right otherwise false.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		var determineDocumentIsLeftToRight = function() {
			var canvas = document.createElement("canvas");
			canvas.setAttribute("style", "margin: 0 0 0 0; padding: 0 0 0 0; text-align:default;");
			var span = document.createElement("span");
			var text = document.createTextNode("X");
			span.appendChild(text);
			canvas.appendChild(span);
			document.body.appendChild(canvas);
			
			var result = (span.offsetLeft < (canvas.offsetWidth - (span.offsetLeft + span.offsetWidth)));
			
			document.body.removeChild(canvas); // remove it
			
			return result;
		};
		var documentIsLeftToRight = determineDocumentIsLeftToRight();
		
		this.draw = function(senders, context, trace){
			this.beforeDrawObject(this.x+this.pivotx, this.y+this.pivoty, senders, context, trace);
	
			if (trace) {
				var height = this.height();
	
				context.strokeStyle = "transparent";
				context.beginPath();
	
				// "start", "end", "left", "right", "center"
				var offsetx = 0;
				var xdir = +1;
				if (this.align == "center") offsetx = -this.width()/2;
				else if (this.align == "right" || (this.align == "start" && !documentIsLeftToRight) || (this.align == "end" && dir == "ltr"))
					xdir = -1;
				// "top", "hanging", "middle", "alphabetic", "ideographic", "bottom".
				var offsety = 0;
				switch (this.baseline){
					// approximations
					case "alphabetic":
						offsety = -height*(3/4);
						break;
					case "top":
						offsety = +height*(1/8);
						break;
					case "hanging":
						offsety = +height*(1/8);
						break;
					case "middle":
						offsety = -height*(1/2);
						break;
					case "ideographic":
						offsety = -height;
						break;
					case "bottom":
						offsety = -height;
						break;
				}
				
				context.moveTo(-this.pivotx+offsetx, -this.pivoty+offsety);
				context.lineTo((this.width()-this.pivotx)*xdir+offsetx, 0-this.pivoty+offsety);
				context.lineTo((this.width()-this.pivotx)*xdir+offsetx, height-this.pivoty+offsety);
				context.lineTo((0-this.pivotx)*xdir+offsetx, height-this.pivoty+offsety);
				context.closePath();
			} else {
				context.fillText(this.text, -this.pivotx, -this.pivoty);
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				context.strokeText(this.text, -this.pivotx, -this.pivoty);
			}
			
			this.afterDrawObject(-(this.x+this.pivotx), -(this.y+this.pivoty), senders, context, trace);
		};
		
		/**
		 * Returns the width of the text object in CSS pixels.
		 * @function {public Number} Palette.Text.width
		 * @return The width of the text object in pixels.
		 * @author Oliver Moran
		 * @since 0.2
		 */
	 	this.width = function(){
	 		// We will use a temporary context since we don't know what context the text is applied to, it makes no difference anyway
	 		var context = document.createElement("canvas").getContext("2d");
	
			context.font = this.font;
			context.textAlign = this.align;
			context.textBaseline = this.baseline;

			context.scale(this.xscale/100, this.yscale/100);
			var textMetrics = context.measureText(this.text);
			context.scale(100/this.xscale, 100/this.yscale);
			
			return textMetrics.width;
		};
		
		this.height = function(){
			var attributes = this.font.split(" ");
			var height;
			for (var attribute in attributes) {
				if (attributes[attribute].match(/^\d+px$/i)){
					height = attributes[attribute].slice(0, -2);
					break;
				}
			}
			return height;
		};
	
		return true;
	};
	
	
	/**
	 * Creates an group container that contains other palette objects (including other groups).
	 * @constructor {public} Palette.Group
	 * @param {Number} x The x coordinate of the top-left corder of the group in pixels.
	 * @param {Number} y The y coordinate of the top-left corder of the group in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Group = function(x, y){
		if (isNaN(x) || isNaN(y)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x = x;
		this.y = y;
		
		this.copy = function(){
			var group = new Canvas.Palette.Group(this.x, this.y);
			for (var member in _members){
				// copy all of the memebers
				group.add(_members[member].object, member, _members[member].isCopy);
			}
			if (this.mask) group.setMask(this.mask.copy());
			return group;
		};
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			return {x:this.x, y:this.y};
		};

		var _members = {}; // an object that holds the group's memebrs
		
		/**
		 * Adds a Palette object to the Group.
		 * @function {public Boolean} Palette.Group
		 * @param {Object} obj The object to be added
		 * @param {optional String} name An instance name for the object
		 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to true, otherwise a shallow copy of the object is added to the drawing. 
		 * @return true if the object was added, otherwise false.
		 * @see Palette.Group.remove
		 * @author Oliver Moran
		 * @since 0.2
		 */	
		this.add = function(obj, name, copy){
			// sort out the overloading: 
			if (name === undefined || typeof name == "boolean") {
				if (typeof name === "boolean") copy = name;
				var i = 0;
				while (_members["sprite "+i]) i++;
				name = "sprite "+i;
			}
	
			if (!obj || !obj.draw) return false;
			
			if (copy) _members[name] = {object:obj.copy(), isCopy:true};
			else _members[name] = {object:obj, isCopy:false};
			
			return false;
		};
		
		/**
		 * Removes a Palette object from the Group.
		 * @function {public void} Palette.Group.remove
		 * @return Nothing
		 * @see Palette.Group.add
		 * @author Oliver Moran
		 * @since 0.2
		 */	
		this.remove = function(name){
			delete _members[name];
		};
			
		/**
		 * A method to bubble sort the objects in the scene by layer.
		 * @function {private static void} Palette.Group.membersByLayer
		 * @param {Array} array The object to bequeath attributes to.
		 * @return An array containing the objects in the scene.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.membersByLayer = function() {
			var array = new Array();
			for (var obj in _members) 
				array.push(_members[obj].object);
			
			for(var i = 0; i < array.length; i++) {
				for(var j = 0; j < (array.length-1); j++) {
					if(array[j].layer > array[j+1].layer) {
						var tmp = array[j+1];
						array[j+1] = array[j];
						array[j] = tmp;
					}
				}
			}
			return array;
		};
		
		this.draw = function(senders, context, trace){
			this.beforeDrawObject(this.x+this.pivotx, this.y+this.pivoty, senders, context, trace);
			
			context.translate(-this.pivotx, -this.pivoty);
			// loop through the Group members
			var layers = this.membersByLayer();
			for (var i in layers)
				// we skip this if we are tracing because we don't want to trace the inner objects only ths one
				if (layers[i] && !trace) layers[i].draw(Canvas.Utils.pushArray(senders, this), context, trace);
			context.translate(this.pivotx, this.pivoty);
			
			this.afterDrawObject(-(this.x+this.pivotx), -(this.y+this.pivoty), senders, context, trace);
		};
		
		return true;
	};
	
	
	/**
	 * Creates a mask made up of other palette objects (including other groups).
	 * @param {Number} x The x coordinate of the top-left corder of the mask in pixels.
	 * @param {Number} y The y coordinate of the top-left corder of the mask in pixels.
	 * @constructor {public} Palette.Mask
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Mask = function(x, y){
		if (isNaN(x) || isNaN(y)) return false; // catch errors
	
		Canvas.Utils.inherit(this, new baseObject());
	
		this.x = x;
		this.y = y;
		
		this.copy = function(){
			var mask = new Canvas.Palette.Mask(this.x, this.y);
			for (var element in _elements){
				// copy all of the memebers
				mask.add(_elements[element].object, element, _elements[element].isCopy);
			}
			return mask;
		};
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x += x;
			this.y += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			return {x:this.x, y:this.y};
		};
		
		var _elements = {}; // an object that holds the masks elements
		
		/**
		 * Adds a Palette object to the Group.
		 * @function {public Boolean} Palette.Group
		 * @param {Object} obj The object to be added
		 * @param {optional String} name An instance name for the object
		 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to true, otherwise a shallow copy of the object is added to the drawing. 
		 * @return true if the object was added, otherwise false.
		 * @see Palette.Group.remove
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.add = function(obj, name, copy){
			// sort out the overloading: 
			if (name === undefined || typeof name == "boolean") {
				if (typeof name === "boolean") copy = name;
				var i = 0;
				while (_elements["sprite "+i]) i++;
				name = "sprite "+i;
			}
			
			if (!obj || !obj.draw) return false;
	
			if (copy) _elements[name] = {object:obj.copy(), isCopy:true};
			else _elements[name] = {object:obj, isCopy:false};
			
			return true;
		};
		
		/**
		 * Removes a Palette object from the Group.
		 * @function {public void} Palette.Group.remove
		 * @return Nothing
		 * @see Palette.Group.add
		 * @author Oliver Moran
		 * @since 0.2
		 */	
		this.remove = function(name){
			delete _elements[name];
		};
			
		/**
		 * A method to bubble sort the objects in the scene by layer.
		 * @function {private static void} Palette.Group.elementsByLayer
		 * @param {Array} array The object to bequeath attributes to.
		 * @return An array containing the objects in the scene.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		this.elementsByLayer = function() {
			var array = new Array();
			for (var obj in _elements) 
				array.push(_elements[obj].object);
			
			for(var i = 0; i < array.length; i++) {
				for(var j = 0; j < (array.length-1); j++) {
					if(array[j].layer > array[j+1].layer) {
						var tmp = array[j+1];
						array[j+1] = array[j];
						array[j] = tmp;
					}
				}
			}
			return array;
		};
		
	
		this.draw = function(senders, context, trace){
			context.translate(-(this.x+this.pivotx), -(this.y+this.pivoty));
			context.rotate(this.rotation * Math.PI/180);
			context.transform(this.xscale/100, (this.xskew * Math.PI/180), (this.yskew * -Math.PI/180), this.yscale/100, 0, 0);
	
			context.strokeStyle = "transparent";
			context.shadowColor = "transparent";
			var alpha = context.globalAlpha;
			if (Canvas.debug === true) {
				context.globalAlpha = 1/3;
				context.fillStyle = "magenta";
			} else context.fillStyle = "transparent";
			
			if (Canvas.debug !== true) context.beginPath();
			// loop through the Mask's elements
			var layers = this.elementsByLayer();
			for (var i in layers) if (layers[i]) {
				if (layers[i].draw) {
					layers[i].draw(Canvas.Utils.pushArray(senders, this), context, trace);
				}
			}
			if (Canvas.debug !== true) context.clip();
			
			context.globalAlpha = alpha;
	
			// reverse the transformations in series
			context.transform(100/this.xscale, (this.xskew * -Math.PI/180), (this.yskew * Math.PI/180), 100/this.yscale, 0, 0);
			context.rotate(this.rotation * -Math.PI/180);
			context.translate(this.x+this.pivotx, this.y+this.pivoty);
		};
		
		return true;
	};
	
	
	/**
	 * Creates a hit area.
	 * @constructor {public} Palette.hitArea
	 * @param {optional Number} x The x coordinate of the first point in the outline of the hit area in pixels relative to the origin of the object it will act as hit area for.
	 * @param {optional Number} y The y coordinate of the first point in the outline of the hit area in pixels relative to the origin of the object it will act as hit area for.
	 * @param {optional Number} n1 ... Any number of pairs of x, y coordinates
	 * @param {optional Number} n2 ... Any number of pairs of x, y coordinates
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	 Canvas.Palette.HitArea = function (){
		if (arguments.length%2 != 0) return false;
		for (var n in arguments)
			if (isNaN(arguments[n])) return false; // error catching
	
		Canvas.Utils.inherit(this, new baseObject());
		
		this.points = new Array();
		this.addPoint = function(x, y){
			var point = new Object();
			point.x = x;
			point.y = y;
			this.points.push(point);
		};
		for (var i=0; i<arguments.length; i+=2){
			this.addPoint(arguments[i], arguments[i+1]);
		}
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			for (var point in this.points)
				if (points[point]) {
					points[point].x += x;
					points[point].y += y;
				}
			
			return true;
		};

		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			var c = this.center();
			return this.moveBy(x - c.x, y - c.y);
		};
		
		this.center = function(){
			if (this.points.length == 0) return false;
			var xs = "";
			var ys = "";
			for (var point in this.points)
				if (points[point]) {
					xs = "," + points[point].x;
					ys = "," + points[point].y;
				}
			
			xs = xs.substring(1);
			ys = ys.substring(1);
			
			var min_x = eval("Math.min("+x2+")");
			var max_x = eval("Math.max("+x2+")");
			var min_y = eval("Math.min("+y2+")");
			var max_y = eval("Math.max("+y2+")");
			
			return {x:(min_x+max_x)/2, y:(min_y+max_y)/2};
		};

		this.draw = function(senders, context, trace){
			if (this.points.length < 2) return; // get out of here if we don't have enough points
	
			context.translate(-senders[senders.length-1].pivotx, -senders[senders.length-1].pivoty);
	
			context.strokeStyle = "transparent";
			context.shadowColor = "transparent";
			var alpha = context.globalAlpha;
			context.globalAlpha = 1/3;
			context.fillStyle = "cyan";
			
			if (trace || !this.isMaskingObject(senders) || Canvas.debug === true) context.beginPath();
			context.moveTo(-this.pivotx, -this.pivoty);
			for (var i=1; i<this.points.length; i++)
				context.lineTo((this.points[i].x-this.points[0].x)-this.pivotx, (this.points[i].y-this.points[0].y)-this.pivoty);
			if (trace){
				context.closePath();
			} else {
				if (this.close == true) context.closePath();
				context.fill();
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				if (!this.isMaskingObject(senders) || Canvas.debug === true) context.stroke();
			}
	
			context.globalAlpha = alpha;
	
			context.translate(senders[senders.length-1].pivotx, senders[senders.length-1].pivoty);
		};
			
		return true;
	};
	
	
	/**
	 * Creates an linear gradient for use in fills.
	 * @constructor {public} Palette.Gradient
	 * @param {Number} x1 The x coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
	 * @param {Number} y1 The y coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
	 * @param {Number} x2 The x coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
	 * @param {Number} y2 The y coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Gradient = function (x1, y1, x2, y2){
		if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return false; // error catching
	
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		this.moveBy = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			
			this.x1 += x;
			this.y1 += y;
			this.x2 += x;
			this.y2 += y;
			
			return true;
		};
		
		this.moveTo = function(x, y){
			if (isNaN(x) || isNaN(y)) return false;
			this.moveBy(x - this.x1, y - this.y1);
		};

		this.draw = function(senders, context){
			var x1 = this.x1 - senders[senders.length-1].pivotx;
			var y1 = this.y1 - senders[senders.length-1].pivoty;
			var x2 = this.x2 - senders[senders.length-1].pivotx;
			var y2 = this.y2 - senders[senders.length-1].pivoty;
			
			var gradient = context.createLinearGradient(x1, y1, x2, y2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		};
		
		this.stops = new Array();
		this.addStop = function(offset, color){
			var stop = new Object();
			stop.offset = offset;
			stop.color = color;
			this.stops.push(stop);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an radial gradient for use in fills.
	 * @constructor {public} Palette.Radial
	 * @param {optional Number} x1 The x coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
	 * @param {optional Number} y1 The y coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
	 * @param {optional Number} radius1 The radius of the starting circle in pixels.
	 * @param {optional Number} x2 The x coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
	 * @param {optional Number} y2 The y coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
	 * @param {Number} radius2 The radius of the ending circle in pixels.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Radial = function (x1, y1, radius1, x2, y2, radius2){
		if (!isNaN(x1) && y1 == undefined && radius1 == undefined && x2 == undefined && y2 == undefined && radius2 == undefined){
			radius2 = x1;
			x1 = 0;
			y1 = 0;
			x2 = 0;
			y2 = 0;
			radius1 = 0;
		} // possible overload
	
		if (isNaN(x1) || isNaN(y1) || isNaN(radius1) || isNaN(x2) || isNaN(y2) || isNaN(radius2)) return false; // error catching
		
		this.x1 = x1;
		this.y1 = y1;
		this.radius1 = radius1;
		this.x2 = x2;
		this.y2 = y2;
		this.radius2 = radius2;
		
		this.draw = function(senders, context){
			var x1 = this.x1 - senders[senders.length-1].pivotx;
			var y1 = this.y1 - senders[senders.length-1].pivoty;
			var x2 = this.x2 - senders[senders.length-1].pivotx;
			var y2 = this.y2 - senders[senders.length-1].pivoty;
			
			var gradient = context.createRadialGradient(x1, y1, this.radius1, x2, y2, this.radius2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		};
		
		this.stops = new Array();
		this.addStop = function(offset, color){
			var stop = new Object();
			stop.offset = offset;
			stop.color = color;
			this.stops.push(stop);
		};
		
		return true;
	};
	
	
	/**
	 * Creates an radial gradient for use in fills.
	 * @constructor {public} Palette.Pattern
	 * @param {String} src The URL of an image file.
	 * @param {optional String} repeat How the patter should repeat. Valid values are repeat, repeat-x, repeat-y and no-repeat. Defaults to repeat.
	 * @extends Palette.Object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Canvas.Palette.Pattern = function (src, repeat){
		if (repeat == undefined) repeat = "repeat"; // possible overload
		
		if (typeof src != "string" && typeof repeat != "string") return false; // error catching
	
		if ((src && repeat) != undefined){
			this.image = Canvas.Library.addImage(src);
			this.repeat = repeat;
			
			this.draw = function(senders, context){
				var gradient = context.createPattern(this.image, this.repeat);
				return gradient;
			};
		}
		
		return true;
	};
	
	
	
// END OF PALETTE SCOPE
})();


// SHORTCUT VARIABLES
var $Arc = Canvas.Palette.Arc;
var $Audio = Canvas.Palette.Audio;
var $Bezier = Canvas.Palette.Bezier;
var $Circle = Canvas.Palette.Circle;
var $Gradient = Canvas.Palette.Gradient;
var $Group = Canvas.Palette.Group;
var $HitArea = Canvas.Palette.HitArea;
var $Image = Canvas.Palette.Image;
var $Line = Canvas.Palette.Line;
var $Mask = Canvas.Palette.Mask;
var $Pattern = Canvas.Palette.Pattern;
var $Polygon = Canvas.Palette.Polygon;
var $Quadratic = Canvas.Palette.Quadratic;
var $Radial = Canvas.Palette.Radial;
var $Rectangle = Canvas.Palette.Rectangle;
var $Text = Canvas.Palette.Text;
var $Video = Canvas.Palette.Video;


/*
 * Copyright (c) 2010 John Resig, http://jquery.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
/* 
 * The following is code is based on domready:
 * http://code.google.com/p/domready/
 * 
 * Adapted for use with Canvas API by Oliver Moran (2010)
 *
 */

(function(){

    var DOMReady = window.DomReady = {};

	// Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery. 

    var userAgent = navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    var browser = {
    	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
    	safari: /webkit/.test(userAgent),
    	opera: /opera/.test(userAgent),
    	msie: (/msie/.test(userAgent)) && (!/opera/.test( userAgent )),
    	mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };    

	var readyBound = false;	
	var isReady = false;
	var readyList = [];

	// Handle when the DOM is ready
	function domReady() {
		// Make sure that the DOM is not already loaded
		if(!isReady) {
			// Remember that the DOM is ready
			isReady = true;
        
	        if(readyList) {
	            for(var fn = 0; fn < readyList.length; fn++) {
	                readyList[fn].call(window, []);
	            }
            
	            readyList = [];
	        }
		}
	};

	// From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
	function addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	      }
	      func();
	    };
	  }
	};

	// does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
	function bindReady() {
		if(readyBound) {
		    return;
	    }
	
		readyBound = true;

		// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
		if (document.addEventListener && !browser.opera) {
			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", domReady, false);
		}

		// If IE is used and is not in a frame
		// Continually check to see if the document is ready
		if (browser.msie && window == top) (function(){
			if (isReady) return;
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(error) {
				setTimeout(arguments.callee, 0);
				return;
			}
			// and execute any waiting functions
		    domReady();
		})();

		if(browser.opera) {
			document.addEventListener( "DOMContentLoaded", function () {
				if (isReady) return;
				for (var i = 0; i < document.styleSheets.length; i++)
					if (document.styleSheets[i].disabled) {
						setTimeout( arguments.callee, 0 );
						return;
					}
				// and execute any waiting functions
	            domReady();
			}, false);
		}

		if(browser.safari) {
		    var numStyles;
			(function(){
				if (isReady) return;
				if (document.readyState != "loaded" && document.readyState != "complete") {
					setTimeout( arguments.callee, 0 );
					return;
				}
				if (numStyles === undefined) {
	                var links = document.getElementsByTagName("link");
	                for (var i=0; i < links.length; i++) {
	                	if(links[i].getAttribute('rel') == 'stylesheet') {
	                	    numStyles++;
	                	}
	                }
	                var styles = document.getElementsByTagName("style");
	                numStyles += styles.length;
				}
				if (document.styleSheets.length != numStyles) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			
				// and execute any waiting functions
				domReady();
			})();
		}

		// A fallback to window.onload, that will always work
	    addLoadEvent(domReady);
	};

	// This is the public function that people can use to hook up ready.
	var ready = function(fn, args) {
		// Attach the listeners
		bindReady();
    
		// If the DOM is already ready
		if (isReady) {
			// Execute the function immediately
			fn.call(window, []);
	    } else {
			// Add the function to the wait list
	        readyList.push( function() { return fn.call(window, []); } );
	    }
	};
	
	bindReady();

	ready(function() {
		// this funtion kicks it all off
		if (!document.getElementsByTagName) return false; // not HTML 5
		
		// get the array of canvas tags
		var canvasElements = document.getElementsByTagName('canvas');
		
		// loop through the canvas tags
		for (var i=0; i<canvasElements.length; i++)
			// if it has an ID and an object with the same name as that ID exists...
			if (canvasElements[i] != undefined && typeof eval(canvasElements[i].id).init == "function"){
				if (!canvasElements[i].getContext) return false; // does not support the canvas tag
				// create a reference to that drawing in the object of the same name
				eval(canvasElements[i].id).drawing = new Canvas.Drawing(canvasElements[i]);
				// call the init function in that drawing
				eval(canvasElements[i].id).init();
				// draw it (there may be a delay between now and the start of animation)
				eval(canvasElements[i].id).drawing.draw();
				// auto start the animation
				eval(canvasElements[i].id).drawing.start();
			}
	});
})();