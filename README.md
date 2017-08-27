# datamosher
Datamosh your videos.

## Supported File Types

* mp4
* mkv
* avi

## Quick Start

    npm install datamosher

## Functions

    glitch(offset, value); //default values (10000, 0)
    generate();

## Example
    
    var dmosh = require("datamosher");
    var file = new dmosh("video.mp4");
    file.glitch();
    file.generate();
