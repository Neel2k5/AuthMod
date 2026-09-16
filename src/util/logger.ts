const stamp = () => new Date().toISOString();

const infoLog = (msg: string) => console.log(`[${stamp()}] [INFO] ${msg}`);
const okLog = (msg: string) => console.log(`[${stamp()}] [ OK ] ${msg}`);
const errorLog = (msg: string) => console.error(`[${stamp()}] [ERR ] ${msg}`);
export { okLog, infoLog, errorLog };
