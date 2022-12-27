//===========================================================================
//機能：電気自動車の計算プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//---------------------------------------------------------------------------
//機能：電気自動車の計算プロセス
error_reporting(E_ALL);

require("lib/update_bill_item.php");

const G_PROCNAME_CALC_EV = "ev_calc";
const G_OPENTIME_CALC_EV = "0000,2400";

//現在テーブルを集計するならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：定数名を設定する
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：ARGVの読み込み終了後に実行される
//返値：深刻なエラーが発生したらfalseを返す
//機能：年と月からテーブル番号を返す
//返値：テーブル番号
//機能：顧客毎の処理を実行する
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
//機能：ev_details_tbとev_usehistory_tbを元にev_tbにレコードを入れる
//引数：顧客ID
//作業ファイル保存先
//返値：深刻なエラーが発生したらfalseを返す
class ProcessCalcEv extends ProcessCalcBase {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime, "\u96FB\u6C17\u81EA\u52D5\u8ECA\u8A08\u7B97\u30D7\u30ED\u30BB\u30B9");
		this.m_args.addSetting({
			C: {
				type: "int"
			}
		});
		this.m_is_current = false;
	}

	initName() {
		this.m_O_name.initEv();
	}

	commitArg(args) {
		if (!ProcessDefault.commitArg(args)) return false;

		switch (args.key) {
			case "C":
				this.m_is_current = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessDefault.getUsage();
		rval.push(["-C={0|1}", "\u73FE\u5728\u30C6\u30FC\u30D6\u30EB\u3092\u96C6\u8A08\u3059\u308B\u306A\u3089true(0)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessDefault.getManual();
		rval += "\u73FE\u5728\u30C6\u30FC\u30D6\u30EB\u3092\u96C6\u8A08";
		if (!this.m_is_current) rval += "\u305B\u305A";
		rval += "\n";
		return rval;
	}

	commitArgsAfter() {
		if (this.m_is_current) {
			this.m_year = 0;
			this.m_month = 0;
		}

		return super.commitArgsAfter();
	}

	getTableNo() {
		if (0 == this.m_year || 0 == this.m_month) return "";
		return super.getTableNo();
	}

	executePactid(pactid, logpath) {
		if (this.m_is_current) //ev_details_tbとev_usehistory_tbを元にev_tbにレコードを入れる
			{
				if (!this.executePactidCreateEV(pactid, logpath)) return false;
			}

		return super.executePactid(pactid, logpath);
	}

	executePactidCreateEV(pactid, logpath) //現在のトップの部署IDを取り出す
	//ev_details_tbとev_usehistory_tbに存在し、
	//ev_tbに存在しないレコードをev_tbに追加する
	//ev_details_tbからev_tbにないevidとevcoidを取り出すSELECT文
	//ev_tbに存在しない
	//unionで接続する
	//ev_usehistory_tbからev_tbにないevidとevcoidを取り出すSELECT文
	//ev_tbに存在しない
	{
		var sql = "select postidparent from post_relation_tb" + " where pactid=" + pactid + " and level=0" + " limit 1" + ";";
		var result = this.m_db.getAll(sql);

		if (!result.length) {
			this.putError(G_SCRIPT_WARNING, "\u30C8\u30C3\u30D7\u306E\u90E8\u7F72ID\u304Cpost_relation_tb\u306B\u5B58\u5728\u3057\u306A\u3044" + "/pactid:=" + pactid);
			return false;
		}

		var toppostid = result[0][0];
		var now = date("Y-m-d H:i:s");
		sql = PGPOOL_NO_INSERT_LOCK + "insert into ev_tb" + "(pactid,evid,evcoid,postid,delete_flg,recdate,fixdate,sync_flg)";
		sql += " select" + " pactid" + ",evid" + ",evcoid" + "," + toppostid + ",false" + ",'" + now + "'" + ",'" + now + "'" + ",false" + " from";
		sql += "(";
		sql += " select" + " d_tb.pactid as pactid" + ",d_tb.evid as evid" + ",d_tb.evcoid as evcoid";
		sql += " from ev_details_tb as d_tb left join ev_tb as e_tb" + " on d_tb.pactid=e_tb.pactid" + " and d_tb.evid=e_tb.evid" + " and d_tb.evcoid=e_tb.evcoid";
		sql += " where d_tb.pactid=" + pactid + " and e_tb.evid is null";
		sql += " group by d_tb.pactid,d_tb.evid,d_tb.evcoid";
		sql += " union";
		sql += " select" + " u_tb.pactid as pactid" + ",u_tb.evid as evid" + ",u_tb.evcoid as evcoid";
		sql += " from ev_usehistory_tb as u_tb left join ev_tb as e_tb" + " on u_tb.pactid=e_tb.pactid" + " and u_tb.evid=e_tb.evid" + " and u_tb.evcoid=e_tb.evcoid";
		sql += " where u_tb.pactid=" + pactid + " and e_tb.evid is null";
		sql += " group by u_tb.pactid,u_tb.evid,u_tb.evcoid";
		sql += ") as sub_tb";
		sql += ";";
		this.m_db.query(sql);
		this.putError(G_SCRIPT_SQL, sql);
		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;

if ("undefined" !== typeof G_LOG_HAND) {
	log = G_LOG_HAND;
}

var proc = new ProcessCalcEv(G_PROCNAME_CALC_EV, log, G_OPENTIME_CALC_EV);
proc.initHist();

if (false == proc.readArgs(undefined)) {
	throw die(1);
}

if (false == proc.execute()) {
	throw die(1);
}

throw die(0);