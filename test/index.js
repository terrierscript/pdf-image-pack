var PDFSlide = require("../index")
var assert = require("assert")
var fs = require("fs")
var rimraf = require("rimraf")
var crypto = require('crypto');

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
  // FIXME: failed on about 1/5
  it("pack", function(done){
    var output = "./tmp/create_doc_test.pdf"
    var slide = new PDFSlide()
    var doc = slide.createDoc(imgs)
    var stream = fs.createWriteStream(output)
    doc.pipe(stream)
    doc.info.CreationDate = new Date(2014, 1, 26, 0, 0, 0)
    doc.end()
    stream.on('finish', function(err){
      assert.equal(err, null)
      assertFile(output, './fixture/pdf/auto_size.pdf')
      done()
    })
  })
  it("output", function(done){
    var slide = new PDFSlide()
    var output = "./tmp/output_test.pdf"
    var doc = slide.output(imgs, output, function(){
      var data = fs.readFileSync(output)
      assert.equal(data.length, 8492)
      done()
    })

  })
})
