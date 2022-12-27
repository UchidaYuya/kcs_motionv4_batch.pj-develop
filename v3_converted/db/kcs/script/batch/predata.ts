//===========================================================================
//機能：標準割引率など算出プロセス(ドコモ、au、Softbank対応)
//
//作成：中西	2006/11/15
//更新：中西	2008/10/02	Softbankを追加
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：標準割引率など算出プロセス(ドコモ、au、Softbank対応)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_predata.php");

const G_PROCNAME_PREDATA = "predata";
const G_OPENTIME_PREDATA = "0000,2400";

//処理する電話番号
//スキップする電話番号
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：引数の数をチェックする
//引数：引数
//返値：深刻なエラーが発生したらfalseを返す
//備考：キャリアID指定を必須としたいが為に用意した
//キャリアIDが指定されればTrue
//機能：キャリアIDが指定されたかどうかチェックする
//引数：なし
//返値：深刻なエラーが発生したらfalseを返す
//備考：キャリアID指定を必須としたいが為に用意した
//機能：一個のARGVの内容を確認する
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessPredata extends ProcessCarid {
	constructor() {
		super(...arguments);
		this.IS_CARID = false;
	}

	ProcessPredata(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
		this.m_args.addSetting({
			t: {
				type: "string"
			},
			T: {
				type: "string"
			}
		});
		this.m_A_telno = Array();
		this.m_A_skip = Array();
	}

	getProcname() {
		return "\u6A19\u6E96\u5272\u5F15\u7387\u306A\u3069\u7B97\u51FA\u30D7\u30ED\u30BB\u30B9(\u30C9\u30B3\u30E2\u3001au\u3001Softbank\u5BFE\u5FDC)";
	}

	checkArgCnt(args) {
		if (args.length <= 1) {
			this.putError(G_SCRIPT_ERROR, "\u30AD\u30E3\u30EA\u30A2ID\u6307\u5B9A\u306F\u5FC5\u9808\u3067\u3059\u3001-c=(" + G_CARRIER_DOCOMO + ":\u30C9\u30B3\u30E2, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkIsCarid() {
		if (this.IS_CARID == false) {
			this.putError(G_SCRIPT_ERROR, "\u30AD\u30E3\u30EA\u30A2ID\u6307\u5B9A\u306F\u5FC5\u9808\u3067\u3059\u3001-c=(" + G_CARRIER_DOCOMO + ":\u30C9\u30B3\u30E2, " + G_CARRIER_AU + ":au, " + G_CARRIER_VODA + ":Softbank)");
			return false;
		}

		return true;
	}

	checkArg(args) {
		if (!ProcessBase.checkArg(args)) return false;

		switch (args.key) {
			case "c":
				if (0 == args.value.length) {
					this.putError(G_SCRIPT_ERROR, "\u30AD\u30E3\u30EA\u30A2ID\u304C\u306A\u3044");
				}

				var A_carid = args.value.split(",");

				for (var carid of Object.values(A_carid)) {
					switch (carid) {
						case G_CARRIER_DOCOMO:
						case G_CARRIER_AU:
						case G_CARRIER_VODA:
							this.IS_CARID = true;
							break;

						default:
							this.putError(G_SCRIPT_ERROR, `対象外のキャリアID,${carid}`);
							return false;
					}
				}

				break;
		}

		return true;
	}

	commitArg(args) {
		if (!ProcessCarid.commitArg(args)) return false;

		switch (args.key) {
			case "t":
				var telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_telno.push(no);

				break;

			case "T":
				telno = args.value.split(",");

				for (var no of Object.values(telno)) this.m_A_skip.push(no);

				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessCarid.getUsage();
		rval.push(["-t=telno[,telno...]", "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7(\u5168\u90E8)"]);
		rval.push(["-T=telno[,telno...]", "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7(\u306A\u3057)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessCarid.getManual();

		if (this.m_A_telno.length) {
			rval += "\u51E6\u7406\u3059\u308B\u96FB\u8A71\u756A\u53F7";

			for (var telno of Object.values(this.m_A_telno)) rval += "," + telno;

			rval += "\n";
		}

		if (this.m_A_skip.length) {
			rval += "\u51E6\u7406\u3057\u306A\u3044\u96FB\u8A71\u756A\u53F7";

			for (var telno of Object.values(this.m_A_skip)) rval += "," + telno;

			rval += "\n";
		}

		return rval;
	}

	executePactid(pactid, logpath) //更新型の作成
	//既存レコードの削除
	{
		var no = this.getTableNo();
		var ins_predata = new TableInserter(this.m_listener, this.m_db, logpath + "sim_trend_" + no + "_tb.insert", true);
		var update_predata = new UpdatePredata(this.m_listener, this.m_db, this.m_table_no, ins_predata);
		if (!update_predata.delete(pactid, this.m_carid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip, logpath + "sim_trend_" + no + "_tb.delete")) return false;
		if (!update_predata.execute(pactid, this.m_carid, this.m_year, this.m_month, this.m_A_telno, this.m_A_skip)) return false;
		return true;
	}

};

checkClient(G_CLIENT_DB);
var proc = new ProcessPredata(G_PROCNAME_PREDATA, G_LOG, G_OPENTIME_PREDATA);
if (!proc.checkArgCnt(_SERVER.argv)) throw die(1);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.checkIsCarid()) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);