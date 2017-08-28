# datamosher
Datamosh your videos.

![Image](http://i.imgur.com/gQ100W5.jpg)

![Image](https://media.giphy.com/media/13bMkBsTQ7mh32/giphy.gif)

## Supported File Types

* mp4
* mkv
* avi

## Quick Start

    npm install datamosher

## Methods

    glitch(offset, value, freq, repeat, start, end); //default values (10000, 0, 0, 1, 0, 100)
    
    generate(newFilename); //default value <filename>_glitched.<filetype>

## Properties

    fileName
    
	fileType
    
	rawData //hex buffer
    
	data //string buffer

## Example
    
    //simple datamoshing program
    
    var dmosh = require("datamosher");
    var file = new dmosh("video.mp4");
    file.glitch();
    file.generate();
    
    console.log(file.rawData);
