var PDFSlide = require("../index")
var assert = require("assert")
var fs = require("fs")
var rimraf = require("rimraf")


var assertFile = function(actualFile, expectFile){
  var actualData = fs.readFileSync(actualFile)
  var expectData = fs.readFileSync(expectFile)
  assert.deepEqual(actualData, expectData)
}


describe("pack",function(){
  before(function(){
    rimraf.sync("./tmp")
    fs.mkdirSync("./tmp")
  })
  it("pack", function(done){
    var imgs = [
      "./fixture/basic/a.png",
      "./fixture/basic/b.png",
    ]
    var output = "./tmp/out.pdf"
    var slide = new PDFSlide()
    var doc = slide.createDoc(imgs)
    var stream = fs.createWriteStream(output)
    doc.pipe(stream)
    doc.info.CreationDate = new Date(2014, 1, 26)
    doc.end()
    stream.on('finish', function(err){
      assert.equal(err, null)
      assertFile(output, './fixture/pdf/auto_size.pdf')
      done()
    })
  })
  it("")
})
