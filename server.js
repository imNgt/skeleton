const Koa = require('koa');
const path = require('path');
const fs = require('fs');

const staticServer = require('koa-static');

const publicPath = staticServer(path.resolve(__dirname,"www"));
const app = new Koa();

console.log("publicPath:",path.resolve(__dirname,"www"))

app.use(publicPath);

app.use(async ctx => {
	ctx.response.type = 'html';
	ctx.response.body = fs.createReadStream('./www/index.html');
});

app.listen(9000);