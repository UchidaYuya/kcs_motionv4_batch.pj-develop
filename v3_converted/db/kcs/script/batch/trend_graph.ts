//===========================================================================
//機能：電話利用グラフのために統計情報を電話ごとに集計する(ドコモ、au、Softbank対応)
//
//作成：中西
//日付：2009/01/13	新規作成
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：通話明細統計情報抽出プロセス(ドコモ、au、Softbank対応)
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_trend_graph.php");

const G_PROCNAME_TREND_ALL = "trend_graph";
const G_OPENTIME_TREND_ALL = "0000,2400";

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
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessTrendGraph extends ProcessCarid {
	constructor() {
		super(...arguments);
		this.IS_CARID = false;
	}

	ProcessTrendGraph(procname, logpath, opentime) {
		this.ProcessCarid(procname, logpath, opentime);
	}

	getProcname() {
		return "\u96FB\u8A71\u5229\u7528\u30B0\u30E9\u30D5\u306E\u305F\u3081\u306E\u7D71\u8A08\u60C5\u5831\u96C6\u8A08";
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

	executePactid(pactid, logpath) //既存レコードの削除
	{
		var update_trend = new updateTrendGraph(this.m_listener, this.m_db, this.m_table_no);

		if (!update_trend.delete(pactid, this.m_carid, this.m_year, this.m_month)) {
			return false;
		}

		if (!update_trend.execute(pactid, this.m_carid, this.m_year, this.m_month)) {
			return false;
		}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var proc = new ProcessTrendGraph(G_PROCNAME_TREND_ALL, G_LOG, G_OPENTIME_TREND_ALL);
if (!proc.checkArgCnt(_SERVER.argv)) throw die(1);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.checkIsCarid()) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);