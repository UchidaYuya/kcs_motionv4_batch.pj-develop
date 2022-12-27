import * as Log4js from "log4js";

export default class Logger {
	static singleton(arg0: string, arg1: string, PHP_SELF: any, GH_logopt: any): any {
		throw new Error("Method not implemented.");
	}

    public static initialize() {
        //let configure = Config.util.loadFileConfigs(Path.join(__dirname,"config")).log4js;
        Log4js.configure('log-config.json');
    }

    public static log(message: string , level:number): void {
        //TODO レベルに応じて出力を変える
        let logger = Log4js.getLogger("access");
        logger.info(message);
    }

    public static LogAccessInfo(message: string): void {

        let logger = Log4js.getLogger("access");
        logger.info(message);
    }

    public static LogAccessWarning(message: string): void {

        let logger = Log4js.getLogger("access");
        logger.warn(message);
    }

    public static LogAccessError(message: string): void {

        let logger = Log4js.getLogger("access");
        logger.error(message);
    }

    public static LogSystemInfo(message: string): void {

        let logger = Log4js.getLogger("system");
        logger.info(message);
    }

    public static LogSystemWarning(message: string): void {

        let logger = Log4js.getLogger("system");
        logger.warn(message);
    }

    public static LogSystemError(message: string): void {

        let logger = Log4js.getLogger("system");
        logger.error(message);
    }

    public static LogError(message: string): void {

        let logger = Log4js.getLogger("error");
        logger.error(message);
    }

}