import Application from './app';

const application = new Application();
const port = Number(process.env.PORT) ?? 8080;

application.init();
application.start(port);