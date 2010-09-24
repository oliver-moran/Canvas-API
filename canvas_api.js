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
 
var Drawing = function(_name, _width, _height, _color){
	this.name = _name;
	this.width = _width;
	this.height = _height;
	this.color = _color;
	
	this.animation = new Object();
	this.animation.framerate = 12;
	this.animation.start = function(_callback){
		this.stop();
		this.interval = setInterval(_callback, 1000/this.framerate);
	}
	this.animation.stop = function(){
		clearInterval(this.interval);
	}
	
	document.write("<canvas id=\""+this.name+"\" style=\"background-color:"+this.color+";\" width=\""+this.width+"\" height=\""+this.height+"\"></canvas>");
	this.canvas = document.getElementById(this.name).getContext('2d');
	
	this.scene = new Object();
	this.add = function(name, obj){
		this.scene[name] = obj;
	}
	this.remove = function(name){
		delete this.scene[name];
	}
	this.draw = function(){
		this.canvas.clearRect(0,0,this.width,this.height);
		for (var object in this.scene){
			if (this.scene[object] instanceof Palette.Line) Painter.Line(this.scene[object], this.canvas);
			if (this.scene[object] instanceof Palette.Rectangle) Painter.Rectangle(this.scene[object], this.canvas);
			if (this.scene[object] instanceof Palette.Circle) Painter.Circle(this.scene[object], this.canvas);
		}
	}
}

var Painter = new Object();
Painter.Gradient = function(_gradient, _retangle, _canvas){
	var __gradient = _canvas.createLinearGradient(_retangle.x, _retangle.y, _retangle.x+_retangle.width, _retangle.y+_retangle.height);
	for (var stop in _gradient.stops)
		__gradient.addColorStop(_gradient.stops[stop].offset, _gradient.stops[stop].color);
	return __gradient;
}
Painter.Line = function(_line, _canvas){
	_canvas.beginPath();
	_canvas.moveTo(_line.x1, _line.y1);
	_canvas.lineTo(_line.x2, _line.y2);
	_canvas.strokeStyle = _line.stroke.style;
	_canvas.lineWidth = _line.stroke.width;
	_canvas.stroke();
}
Painter.Rectangle = function(_rectangle, _canvas){
	var _fill = _rectangle.fill;
	if (_fill instanceof Palette.Gradient)
		_fill = Painter.Gradient(_fill, _rectangle, _canvas);
	_canvas.fillStyle = _fill;
	_canvas.strokeStyle = _rectangle.stroke.style;
	_canvas.lineWidth = _rectangle.stroke.width;
	_canvas.fillRect(_rectangle.x, _rectangle.y, _rectangle.width, _rectangle.height);
	_canvas.strokeRect(_rectangle.x, _rectangle.y, _rectangle.width, _rectangle.height);
}
Painter.Circle = function(_oval, _canvas){
	var _fill = _oval.fill;
	if (_fill instanceof Palette.Gradient)
		_fill = Painter.Gradient(_fill, {x:_oval.x-_oval.radius, y:_oval.y-_oval.radius, width:_oval.x+(_oval.radius*2), height:_oval.y+(_oval.radius*2)}, _canvas);
	_canvas.fillStyle = _fill;
	_canvas.beginPath();
	_canvas.strokeStyle = _oval.stroke.style;
	_canvas.lineWidth = _oval.stroke.width;
	_canvas.arc(_oval.x, _oval.y, _oval.radius, 0, 360 * Math.PI/180, false);
	_canvas.closePath();
	_canvas.fill();
	_canvas.stroke();
}

var Palette = new Object();
Palette.Line = function (){
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = 0;
		
	this.stroke = new Object( );
	this.stroke.style = "black";
	this.stroke.width = 2;
}
Palette.Rectangle = function (){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
		
	this.stroke = new Object();
	this.stroke.style = "black";
	this.stroke.width = 2;
	
	this.fill = "white";
}
Palette.Circle = function (){
	this.x = 0;
	this.y = 0;
	this.radius = 0;
	
	this.stroke = new Object();
	this.stroke.style = "black";
	this.stroke.width = 2;
	
	this.fill = "white";
}

Palette.Gradient = function (){
	this.stops = new Array();
	this.addStop = function(_offset, _color){
		var stop = new Object();
		stop.offset = _offset;
		stop.color = _color;
		this.stops.push(stop);
	}
}