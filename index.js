var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')
var dimension = require("./lib/dimension.js")

var ImageSet = function(images){
  var maxWidth = 0
  var maxHeight = 0
  this.paths = images
  this.sizes = images.map(function(img){
    var size = sizeOf(img)
    maxWidth = Math.max(maxWidth, size.width)
    maxHeight = Math.max(maxHeight, size.height)
    return size
  })

  this.maxSize = [maxWidth, maxHeight]
}

var createDoc = function(imgs, options){
  var images = new ImageSet(imgs)

  // auto scaling
  if(!options.size){
    options.size = images.maxSize
  }

  var doc = new PDFDocument(options)

  var pageSize = {
    width:  doc.page.width,
    height: doc.page.height
  }

  images.paths.forEach(function(img, i ){
    if(i > 0){
      doc.addPage()
    }
    var imgSize = images.sizes[i]
    var newSize = dimension.calcSize(pageSize, imgSize)
    var offset = dimension.calcOffset(pageSize, newSize)
    doc.image(img, offset.x, offset.y, newSize)
  })
  return doc
}

var PDFSlide = function(options){
  this.options = options || {}
}

PDFSlide.prototype.createDoc = function(images){
  return createDoc(images, this.options)
}

PDFSlide.prototype.output = function(images, output, cb){
  var doc = this.createDoc(images)

  var stream = undefined
  if(typeof output == "string"){
    stream = fs.createWriteStream(output)
  }else{
    stream = output
  }
  doc.pipe(stream)

  // bind event
  stream.on('error', function(err){
    cb(err)
  })
  stream.on('finish', function(){
    cb(null, doc)
  })
  doc.end()
}

module.exports = PDFSlide
