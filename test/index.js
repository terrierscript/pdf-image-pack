var pdfPack = require("../index")
describe("pack",function(){
  it("pack", function(){
    var imgs = [
      "./fixture/basic/a.jpg",
      "./fixture/basic/b.jpg",
    ]
    var output = "./tmp/out.pdf"
    pdfPack(imgs, output)

  })
  it("")
})
