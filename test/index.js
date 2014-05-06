var PDFImagePack = require("../index")
var assert = require("assert")
var fs = require("fs")
var rimraf = require("rimraf")
var crypto = require('crypto')
var deep = require('deep-diff')

var PFParser = require('pdf2json')
var parsePDF = function(file, cb){
  var pdfParser = new PFParser()
  pdfParser.on("pdfParser_dataReady", function(x){
    cb(null, x.data)
  })
  pdfParser.on("pdfParser_dataError", function(err){
    cb(err)
  })
  pdfParser.loadPDF(file);
}

var parsed = function(actual, expect, cb){
  parsePDF(actual, function(err, actualJson){
    parsePDF(expect, function(err, expectJson){
      cb(err, actualJson, expectJson)
    })
  })
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
    "./fixture/basic/a.png", // 200 * 100
    "./fixture/basic/b.png", // 100 * 200
  ]

  before(function(){
    rimraf.sync("./tmp")
    fs.mkdirSync("./tmp")
  })
  it("output", function(done){
    var slide = new PDFImagePack()
    var output = "./tmp/output_test.pdf"
    var doc = slide.output(imgs, output, function(){
      var data = fs.readFileSync(output)
      assert.equal(data.length, 8492)
      parsed(output, "./fixture/pdf/auto_size.pdf", function(err, actualJson, expectJson){
        assert.deepEqual(actualJson, expectJson)
        done()
      })
    })
  })
  it("with b5 option", function(done){
    var slide = new PDFImagePack({
      size : "b5"
    })
    var output = "./tmp/output_test_b5.pdf"
    var doc = slide.output(imgs, output, function(){
      var data = fs.readFileSync(output)
      assert.equal(data.length, 8533)
      parsed(output, "./fixture/pdf/b5.pdf", function(err, actualJson, expectJson){
        assert.deepEqual(actualJson, expectJson)
        done()
      })
    })
  })
})
