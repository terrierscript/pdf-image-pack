var sizeOf = require('image-size')
var fs = require("fs")
var PDFDocument = require('pdfkit')
var dimension = require("./lib/dimension.js")

// image resource
var Resource = function(image){
  this.path = image
  this.size = sizeOf(image)
}

var calcMaxSize = function(imageSet){
  var maxWidth = 0
  var maxHeight = 0

  imageSet.forEach(function(res){
    var size = res.size
    maxWidth = Math.max(maxWidth, size.width)
    maxHeight = Math.max(maxHeight, size.height)
  })
  return [maxWidth, maxHeight]
}

var createDoc = function(imgs, options){
  var images = imgs.map(function(img){
    var res = new Resource(img)
    return res
  })

  // auto scaling
  if(!options.size){
    options.size = calcMaxSize(images)
  }

  var doc = new PDFDocument(options)
  var pageSize = {
    width:  doc.page.width,
    height: doc.page.height
  }

  // generate document
  images.forEach(function(res, i){
    if(i > 0){
      doc.addPage()
    }
    var size = dimension.calcSize(pageSize, res.size)
    var offset = dimension.calcOffset(pageSize, size)
    doc.image(res.path, offset.x, offset.y, size)
  })
  return doc
}

var PDFImagePack = function(options){
  this.options = options || {}
}

PDFImagePack.prototype.createDoc = function(images){
  return createDoc(images, this.options)
}

PDFImagePack.prototype.output = function(images, output, cb){
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

module.exports = PDFImagePack
