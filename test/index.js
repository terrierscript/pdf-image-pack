var pdfPack = require("../index")
describe("pack",function(){
  it("pack", function(done){
    var imgs = [
      "./fixture/basic/a.png",
      "./fixture/basic/b.png",
    ]
    var output = "./tmp/out.pdf"
    pdfPack(imgs, output, {}, function(){
      done()
    })
  })
  it("")
})
