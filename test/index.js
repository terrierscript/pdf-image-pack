var PDFImagePack = require("../index")
var assert = require("assert")
var fs = require("fs")
var rimraf = require("rimraf")
var crypto = require('crypto')
var traverse = require('traverse')
var deep = require('deep-diff')

var scrumb = function(obj){
  obj = traverse(obj).map(function (x) {
    if (this.circular) this.remove()
  })
  return JSON.parse( JSON.stringify(obj) )
}

var removeBuffer = function(obj){
  return traverse(obj).map(function (x) {
    switch(this.key){
      case "buffer":
      case "_buffer":
        this.remove()
    }
  })
}
var clean = function(obj){
  return removeBuffer(scrumb(obj))
}

var digest = function(data){
  var shasum = crypto.createHash('sha1');
  shasum.update(data)
  return shasum.digest('hex')
}

var assertFile = function(actualFile, expectFile){
  var actualData = fs.readFileSync(actualFile)
  var expectData = fs.readFileSync(expectFile)
  assert.deepEqual(digest(actualData), digest(expectData))
  assert.deepEqual(actualData, expectData)
}


describe("pack",function(){
  var imgs = [
    "./fixture/basic/a.png",
    "./fixture/basic/b.png",
  ]

  before(function(){
    rimraf.sync("./tmp")
    fs.mkdirSync("./tmp")
  })
  it("pack", function(){
    var output = "./tmp/create_doc_test.pdf"
    var slide = new PDFImagePack()
    var doc = slide.createDoc(imgs)
    doc.info.CreationDate = new Date(2014, 1, 26, 0, 0, 0)
    //console.log(JSON.stringify(obj, null, " ") )

    var fixture = require('../fixture/json/doc.json');
    var cleaned = clean(doc)
    console.log(deep(cleaned, fixture))
    assert.deepEqual(cleaned, fixture)
  })
  it("output", function(done){
    var slide = new PDFImagePack()
    var output = "./tmp/output_test.pdf"
    var doc = slide.output(imgs, output, function(){
      var data = fs.readFileSync(output)
      assert.equal(data.length, 8492)
      done()
    })

  })
})
