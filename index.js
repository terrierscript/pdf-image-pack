var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')

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
    var newSize = calcSize(pageSize, imgSize)
    var offset = calcOffset(pageSize, newSize)
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

// calcurate size
var calcSize = function(pageSize, imageSize){
  if(isLargeSize(pageSize, imageSize)){
    return imageSize
  }
  if(imageSize.width > imageSize.height){
    return {
      width : pageSize.width,
      height : (pageSize.width / imageSize.width) * imageSize.height
    }
  }else{
    return {
      width : (pageSize.height / imageSize.height) * imageSize.width,
      height : pageSize.height
    }
  }
}

// return true if a > b
var isLargeSize = function(a, b){
  return (a.width > b.width && a.height > b.height)
}


var calcOffset = function(pageSize, imageSize){
  return {
    x : (pageSize.width - imageSize.width) / 2,
    y : (pageSize.height - imageSize.height) / 2
  }
}
