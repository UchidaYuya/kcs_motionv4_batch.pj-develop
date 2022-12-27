import MtSetting from "./MtSetting";

export enum SiteType{
    BATCH = 1,
    SITE = 2,
}

enum StageType {
    DEV = "DEV",
    TRY = "TRY",
    HON = "HON"
}

export enum LvlType{
    DEBUG = 1,
    INFO = 2,
    WARN = 4,
    ERROR = 8
}

const LOGDIR = "/log/";
const MAX_LOOP_COUNT = 10;

export default class MtOutput {
    static O_Instance: MtOutput | undefined;
    static LoopCount = 0;
    stage: StageType;
    O_Set: MtSetting;
    BufferWarningCnt: number;
    BufferErrorCnt: number;
    A_MessageBuffer: any[];
	toMail: string;

    constructor(){
        this.O_Set = MtSetting.singleton();
        this.O_Set.loadConfig("mail");
        this.stage = this.O_Set.get("STAGE");
        this.toMail = this.O_Set.get("mail_def_errorto");
        this.A_MessageBuffer = Array();
        this.BufferWarningCnt = 0;
        this.BufferErrorCnt = 0;
    }

    static singleton() {
        if (this.O_Instance != undefined) {
            this.O_Instance.errorOut(0, "MtOutput 既に異なるサイトでインスタンスが生成されています");
        }

        if (this.O_Instance == undefined) {
            this.O_Instance = new MtOutput();
        }

        return this.O_Instance;
    }

    set_ScriptLog(
        logfile: string //ログの作成 //スクリプトログの生成
    ) {
        // ログに関する扱いが決まったら中身を実装する。
    }

    debugOut(errstr: string, disp: number = 1) {
        this.put(errstr, LvlType.DEBUG);
    }

    debugOutEx(errstr: any, disp = 1, tab = "\t") {
        if (true == !errstr) {
            this.put(tab + "null", LvlType.DEBUG);
            return true;
        }

        if (true == Array.isArray(errstr)) {
            for (var key in errstr) {
                var value = errstr[key];

                if (true == Array.isArray(value)) {
                    this.debugOut(tab + key + ":Array[", disp);
                    this.debugOutEx(value, disp, tab + "\t");
                    this.debugOut(tab + "]", disp);
                } else {
                    this.debugOut(tab + key + ":" + value, disp);
                }
            }
        } else {
            this.put(tab + errstr, LvlType.DEBUG);
        }
    }

    infoOut(errstr: string, disp = 1) {
        this.put(errstr, LvlType.INFO);
    }

    warningOut(
        code: number,
        errstr: string = "",
        disp: number = 0 //このcodeはダミー、互換性のためだけにある //バッチの場合、標準出力する/しない
    ) {
        this.put(errstr, LvlType.WARN);
    }

    errorOut(
        code: number,
        errstr: string = "",
        mailflg: number | boolean = 1,
        goto: string = "",
        buttonstr: string = ""
    ) {
        this.put(errstr, LvlType.ERROR);
    }

    put(
        msg: string,
        level: LvlType
    ) {
        switch (level) {
            case LvlType.DEBUG:
                console.debug(msg);
                break;
            case LvlType.ERROR:
                console.warn(msg);
                break;
            case LvlType.INFO:
                console.info(msg);
                break;
            case LvlType.WARN:
                console.error(msg);
                break;
        
            default:
                break;
        }
    }

    putDebug(
        msg: string
    ) {
        if (this.stage == StageType.DEV) {
            this.scriptOut(msg, 5);
        }
    }

    putInfo(
        msg: string,
        H_param: any //表示フラグを得る //WEB側の処理
    ) {
        this.scriptOut(msg, 6);
    }

    putWarn(
        msg: string,
        H_param: any //WEB側の処理
    ) {
        this.scriptOut(msg, 4);
        this.A_MessageBuffer.push(msg);
        this.BufferWarningCnt++; 
    }

    putError(
        msg: string,
        H_param: any //WEB側の処理
    ) {
        this.scriptOut(msg, 3);
        this.scriptCommonOut(msg);
        this.A_MessageBuffer.push(msg);
        this.BufferErrorCnt++; 
    }

    displayError(
        disp_msg: string,
        code: number = 0,
        goto: string = "",
        buttonstr: string = "戻 る" //利用直前に呼ぶ //この場合は正常終了とする
    ) {
        // ログに関する扱いが決まったら中身を実装する。
    }

    scriptCommonOut(
        msg: string,
        level: LvlType = LvlType.DEBUG //ログに出力 //5:notice
    ) {
		this.put(msg, level);
    }

    scriptOut(msg: string, level: number) {
        // ログに関する扱いが決まったら中身を実装する。
    }

    flushMessage(
        mail = true //メッセージが無ければ //メール送信する
    ) {
        if (this.A_MessageBuffer.length == 0) {
            //エラーが無ければ何もしない
            return false;
        }

        var all_msg = "";

        for (var msg of Object.values(this.A_MessageBuffer)) {
            all_msg += msg + "\n";
        }

        if (mail == true) {
            //ex : V2エラーメッセージ
            this.errorMail(all_msg, this.O_Set.get("mail_error_subj"));
        }

        this.A_MessageBuffer = Array();
        this.BufferWarningCnt = 0;
        this.BufferErrorCnt = 0;
        return true;
    }

    errorMail(
        errormessage: string,
        subject = undefined //ex: "info@motion.ne.jp" //ex: "株式会社モーション"
    ) //ex: info@kcs-next-dev.com
    //ex: KCS運営係
    //WEBの場合は、セッションを付加する
    {
        // ログに関する扱いが決まったら中身を実装する。
    }

    setToMail(address: any) {
        this.toMail = address;
    }

    writeMnglog(H_data: any) {
        // ログに関する扱いが決まったら中身を実装する。
    }

    writeShopMnglog(H_data: any) {
        // ログに関する扱いが決まったら中身を実装する。
    }

    writeAdminMnglog(H_data: any) {
        // ログに関する扱いが決まったら中身を実装する。
    }
}
