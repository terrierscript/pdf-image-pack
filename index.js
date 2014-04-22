var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')
var defaults = require("defaults")
module.exports = function(images, opts){
  var opt = defaults(opts, {
    layout : "portlait",
    //size   : 'letter'
    size   : [200, 200]
  })
  var output = "./tmp/out.pdf"
  var doc = new PDFDocument(opt)

  var pageSize = {
    width:  doc.page.width,
    height: doc.page.height
  }

  var imgSizes = images.map(function(img){
    return sizeOf(img)
  })

  //console.log(pageSize)

  images.forEach(function(img, i ){
    if(i > 0){
      doc.addPage()
    }
    var imgSize = imgSizes[i]
    doc.image(img, 0, 0)
  })

  doc.pipe(fs.createWriteStream(output))
  doc.end()
}

var calcSize = function(pageSize, imageSize, fit){
  if(!fit && isLargeSize(parSize, imageSize)){
    return imageSize
  }

}

// return true if a > b
var isLargeSize = function(a, b){
  return (a.width > b.width && a.height > b.height)
}

// calc image rate with longe
var calcSizeRate = function(size){
  if(isLandscape(size)){
    return size.width / size.height
  }else{
    return size.height / size.width
  }
}

var isLandscape = function(size){
  return size.height > size.width
}
