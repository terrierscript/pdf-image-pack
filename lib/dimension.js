
// calcurate size
module.exports.calcSize = function(pageSize, imageSize){
  if(isLargeSize(pageSize, imageSize)){
    return imageSize
  }
  if(imageSize.width > imageSize.height){
    return {
      width : pageSize.width,
      height : (pageSize.width / imageSize.width) * imageSize.height
    }
  }else{
    return {
      width : (pageSize.height / imageSize.height) * imageSize.width,
      height : pageSize.height
    }
  }
}

module.exports.calcOffset = function(pageSize, imageSize){
  return {
    x : (pageSize.width - imageSize.width) / 2,
    y : (pageSize.height - imageSize.height) / 2
  }
}


// return true if a > b
var isLargeSize = function(a, b){
  return (a.width > b.width && a.height > b.height)
}
