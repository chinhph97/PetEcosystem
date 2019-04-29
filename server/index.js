'use strict';

import Express from 'express';
import BodyParser from 'body-parser';
import Cors from 'cors';
import FS from 'fs-extra';
import Http from 'http';
import Path from 'path';

const mongoose  = require('mongoose');
mongoose.set('useCreateIndex', true)
mongoose.connect("mongodb://localhost:27017/Test", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
    app.use(morgan('dev'));
}
global.__rootDir = __dirname.replace('/server', '');
const app = Express();
app
    .use(Cors())
    .use(BodyParser.json())
    .use(BodyParser.urlencoded({extended: true}))
    .use(Express.static(Path.resolve(__dirname, '..', 'public'), {maxAge: 31557600000}))
	.set('views', Path.join(__dirname, '..', 'public', 'views'))
	.set('view engine', 'ejs');

const routePath = `${__dirname}/routes/`;
FS.readdirSync(routePath).forEach((file) => {
    require(`${routePath}${file}`)(app);
});

Http.createServer(app).listen(3030, () => {
    console.log(`App listening on 3030!`);
});