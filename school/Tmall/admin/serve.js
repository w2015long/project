
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req,res)=>{
	res.setHeader('Access-Control-Allow-Origin','*');

	let list = ['learn React','learn Node.js'];
	res.end(JSON.stringify(list)) 
})



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});