/*
var app_version = 'v20190610175753'

console.log(app_version);

var url = window.location.href, version = window.localStorage.getItem('app_version')
if (app_version !== version) {
    window.location.href = addQueryStringArg(url, 'v', app_version)
    window.localStorage.setItem('app_version', app_version)
}
function addQueryStringArg (url, name, value) {
    url += url.indexOf('?') === -1 ? '?' : '&'
    url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
    return url
}*/
