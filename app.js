#!/usr/bin/env node

var dmosh = require('./index.js')
var file = new dmosh("a.mp4");
file.glitch(10, 1, 1, 50, 5, 95, 10, 90);
file.generate("yonkers.mp4");