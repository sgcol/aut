const sortObj=require('sort-object'), querystring=require('querystring'), md5=require('md5');

module.exports={
    sortObj:sortObj,
    querystring:querystring.stringify,
    qs:querystring,
    md5:md5,
    objectPath:require('object-path')
}