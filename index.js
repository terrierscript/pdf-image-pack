var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')
var defaults = require("defaults")
module.exports = function(images, opts){
  var opt = defaults(opts, {
    //layout : "portlait",
    fit    : false,
  })
  var maxWidth = 0
  var maxHeight = 0

  var imgSizes = images.map(function(img){
    var size = sizeOf(img)
    maxWidth = Math.max(maxWidth, size.width)
    maxHeight = Math.max(maxHeight, size.height)
    return size
  })

  // auto scaling
  if(!opt.size){
    opt.size = [maxWidth, maxHeight]
  }

  var output = "./tmp/out.pdf"
  var doc = new PDFDocument(opt)

  var pageSize = {
    width:  doc.page.width,
    height: doc.page.height
  }


  //console.log(pageSize)

  images.forEach(function(img, i ){
    if(i > 0){
      doc.addPage()
    }
    var imgSize = imgSizes[i]
    var newSize = calcSize(pageSize, imgSize, opt.fit)
    var offset = calcOffset(pageSize, newSize)
    doc.image(img, offset.x, offset.y, newSize)
  })

  doc.pipe(fs.createWriteStream(output))
  doc.end()
}

var addImage = function(doc, image){}

// calcurate size
var calcSize = function(pageSize, imageSize, fit){
  if(!fit && isLargeSize(pageSize, imageSize)){
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