var pdfPack = require("../index")
var assert = require("assert")
describe("pack",function(){
  it("pack", function(done){
    var imgs = [
      "./fixture/basic/a.png",
      "./fixture/basic/b.png",
    ]
    var output = "./tmp/out.pdf"
    pdfPack(imgs, output, {}, function(err, doc){
      assert.equal(err, null)
      done()
    })
  })
  it("")
})
