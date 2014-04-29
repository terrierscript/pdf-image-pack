# PDF Slide
Create conclude some images PDF slide.
PDF generated by [PDFKit](http://pdfkit.org/)

# Usage

```js
var PDFSlide = require("pdf-slide")

var imgs = [
  "./fixture/basic/a.png",
  "./fixture/basic/b.png",
]
var output = "./tmp/out.pdf"
var slide = new PDFSlide()
slide.output(imgs, output)

```


# API

## new PDFSlide([optoon])
- construction
- options
  - option for PDFKit

## PDFSlide.createDoc(images)
- return pdf slide object with pdfkit
- images
  - images path array

## PDFSlide.output(images, output)
- output pdf slide file
- images {Array}
  - images path array
- output {String | Stream}
  - output destination.
  - if string, use as output path