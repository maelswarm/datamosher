//doo.js
var fs = require('fs');

String.prototype.replaceAt = function(index, c) {
	return this.substr(0, index) + c + this.substr(index + (c.length == 0 ? 1 : c.length));
}

function getMPEGStart(data) {
	return data.indexOf("mdat") + 4;
}

function getMPEGDataSect(data) {
	var i = 0;
	//console.log("Data Length: " + data.length)
	for(; i<data.length;i++) {
		if(data[i] == 0 && data[i+1] == 0 && data[i+2] == 1) {
			return i;
		}
	}
	return i;
}

function getAVIStart(data) {
	return data.indexOf("movi") + 4;
}

var File = function (name) {
	this.fileName = name.substring(0, name.indexOf("."));
	this.fileType = name.substring(name.indexOf(".")+1);
	this.rawData = fs.readFileSync(name);
	this.data = this.rawData.toString();
};

File.prototype.glitch = function(off, val, freq, repeat, start, end, left, right) {
	if(val == undefined) {
		val = 0;
	}
	if(repeat == undefined) {
		repeat = 100;
	}
	if(off == undefined) {
		off = 10000;
	}
	if(freq == undefined) {
		freq = 1;
	}
	if(start == undefined) {
		start = 0;
	}
	if(end == undefined) {
		end = 100;
	}
	if(left == undefined) {
		left = 10;
	}
	if(right == undefined) {
		right = 90;
	}
	
	if(start >= end) {
		console.log("Start value must be less than end value.");
		return;
	}
	var x = 0;
	if(this.fileType == "mp4") {
		var startP = getMPEGStart(this.data);
		for(var i = startP+Math.round((this.rawData.length - startP)*(start/100.0)); i<Math.round((this.rawData.length - startP)*(end/100.0)); i++) {
			if(this.rawData[i] == 0 && this.rawData[i+1] == 0 && this.rawData[i+2] == 1 && (this.rawData[i+3] & 0x1F) != 5 && x % freq == 0) { //63 non iframe
				console.log(this.rawData[i+3] & 0x1F);
				//console.log(buffer);
				var nextSect = getMPEGDataSect(this.rawData.slice(i+3));
				
//				for(var k = i+4; k<i+nextSect; k++) {
//					//console.log(k + " " + (i+nextSect) + " " + this.rawData.length)
//					var wrote = this.rawData.writeUInt32LE(this.rawData[k], k+nextSect);
//				}
//				console.log(this.rawData.length);
				
				for(var j=parseInt(nextSect*(left/100.0));j<parseInt(nextSect*(right/100.0));j++) {
					if(j % (repeat*100) === 0) {
						this.rawData[i+j] = val;
					}
				}
				
//				for(var j=0;j<repeat;j++) {
//					this.rawData[i+off*(1+j)] = val;
//				}
			}
			x++;
		}
	} else if(this.fileType == "avi") {
		for(var i = getAVIStart(this.data)+Math.round(this.rawData.length*(start/100.0)); i<Math.round(this.rawData.length*(end/100.0)); i++) {
			if(x % freq == 0) {
				for(var j=0;j<repeat;j++) {
					this.rawData[i+off*(1+j)] = val;
				}
			}
			x++;
		}
	} else if(this.fileType == "mkv") {
		for(var i = Math.round(this.rawData.length*(start/100.0)); i<Math.round(this.rawData.length*(end/100.0)); i++) {
			if(this.rawData[i] == 31 && this.rawData[i+1] == 67 && this.rawData[i+2] == 182 && this.rawData[i+3] == 117 && x % freq == 0) {
				for(var j=0;j<repeat;j++) {
					this.rawData[i+off*(1+j)] = val;
				}
			}
			x++;
		}
	}
}

File.prototype.generate = function(fn) {
	if(fn == undefined) {
		fs.writeFileSync(this.fileName+"_glitched."+this.fileType, this.rawData, 'utf8');
	} else {
		fs.writeFileSync(fn, this.rawData, 'utf8');
	}
}

module.exports = File;