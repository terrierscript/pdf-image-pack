var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')
var dimension = require("./lib/dimension.js")

var Resource = function(image){
  this.path = image
  this.size = sizeOf(image)
}
var ImageSet = function(images){
  this.resources = images.map(function(img){
    var res = new Resource(img)
    var size = res.size
    return res
  })
}

var calcMaxSize = function(imageSet){
  var maxWidth = 0
  var maxHeight = 0

  imageSet.resources.forEach(function(res){
    var size = res.size
    maxWidth = Math.max(maxWidth, size.width)
    maxHeight = Math.max(maxHeight, size.height)
  })
  return [maxWidth, maxHeight]
}

var createDoc = function(imgs, options){
  var images = new ImageSet(imgs)

  // auto scaling
  if(!options.size){
    options.size = calcMaxSize(images)
  }

  var doc = new PDFDocument(options)

  var pageSize = {
    width:  doc.page.width,
    height: doc.page.height
  }

  images.resources.forEach(function(res, i ){
    if(i > 0){
      doc.addPage()
    }
    var imgSize = res.size
    var newSize = dimension.calcSize(pageSize, imgSize)
    var offset = dimension.calcOffset(pageSize, newSize)
    doc.image(res.path, offset.x, offset.y, newSize)
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
