import Koa from 'koa';
import KoaRouter from 'koa-router';
import { proxy } from './proxy.js';

const app = new Koa();
const router = new KoaRouter();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});

app.use(router.routes());
proxy.init(router);

app.listen('3000', () => {
  console.log('🚀服务启动成功~，端口号3000');
});
