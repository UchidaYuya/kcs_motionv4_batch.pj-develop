//===========================================================================
//V2→V3注文雛型コンバータ
//
//作成日：2008/11/25
//作成者：宮澤
//
//更新履歴：2008/11/25		作成
//===========================================================================
//パラメータチェック
//数が正しくない
//Wホワイトオプション
//buysel変換表作成
//buyselidがキー、buyselnameが値の配列を作る
//plan変換表作成
//planidがキー、plannameが値の配列を作る
//割引サービス
//購入方式があるキャリア
//雛形ごとのppidリストを作る（V3の雛型にはこれが必要）
//V3で雛形がある回線種別
//企業ごとのV2雛型取得
//V3雛型用の変数を準備
//各雛型を整形
//インサート
//購入方式のコンバータ
//プランのコンバータ
//パケットのコンバータ

require("MtDBUtil.php");

if (_SERVER.argv.length != 2) //数が正しい
	{
		echo("\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\n");
		throw die();
	} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //契約ＩＤを取得
		{
			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						echo("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\n");
						throw die();
					}

					continue;
				}
		}
	}

const DOCOMOCARID = 1;
const WILLCARID = 2;
const AUCARID = 3;
const SBCARID = 4;
const EMCARID = 15;
const SMCARID = 28;
const WWHITE = 124;
var db = MtDBUtil.singleton();
var sql = "select carid,buyselname,buyselid from buyselect_tb order by sort";
var A_buysel = db.queryHash(sql);
var H_buysel_d = Array();
var H_buysel_w = Array();
var H_buysel_a = Array();
var H_buysel_s = Array();
var H_buysel_e = Array();

for (var cnt = 0; cnt < A_buysel.length; cnt++) //ドコモ
{
	if (A_buysel[cnt].carid == DOCOMOCARID) {
		H_buysel_d[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == WILLCARID) {
		H_buysel_w[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == AUCARID) {
		H_buysel_a[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == SBCARID) {
		H_buysel_s[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}

	if (A_buysel[cnt].carid == EMCARID) {
		H_buysel_e[A_buysel[cnt].buyselname] = A_buysel[cnt].buyselid;
	}
}

sql = "select planname,planid from plan_tb where planid < 3000 order by planid";
var A_plan_old = db.queryHash(sql);
var H_plan_old = Array();

for (cnt = 0;; cnt < A_plan_old.length; cnt++) {
	H_plan_old[A_plan_old[cnt].planid] = A_plan_old[cnt].planname;
}

sql = "select opid from option_tb where discountflg=1";
var A_discount = db.queryCol(sql);
var A_buycar = [DOCOMOCARID, WILLCARID, AUCARID, SBCARID, EMCARID, SMCARID];
H_def.H_plan_old = H_plan_old;
H_def.A_discount = A_discount;
H_def.H_buysel_d = H_buysel_d;
H_def.H_buysel_w = H_buysel_w;
H_def.H_buysel_a = H_buysel_a;
H_def.H_buysel_s = H_buysel_s;
H_def.H_buysel_e = H_buysel_e;
H_def.A_buycar = A_buycar;
sql = "SELECT carid || '-' || type, ppid FROM mt_template_tb WHERE pactid=0 GROUP BY carid, type,ppid ORDER BY carid, type";
var H_ppid = db.queryAssoc(sql);
sql = "SELECT distinct cirid from mt_template_tb where pactid=0";
var A_cirid = db.queryCol(sql);
var H_template = db.queryHash("SELECT * FROM template_tb WHERE pactid=" + pactid);
var H_new_template = Array();

for (var key in H_template) //V3にない回線種別だったら飛ばす
//postidが空だったらルート部署IDで埋める
//valueの中身を分解して整形
{
	var val = H_template[key];

	if (false == (-1 !== A_cirid.indexOf(val.cirid))) {
		continue;
	}

	var H_row = Array();
	H_row.v2tempid = val.tempid;
	H_row.pactid = val.pactid;
	H_row.carid = val.carid;
	H_row.cirid = val.cirid;
	H_row.mask = val.mask;
	H_row.defflg = val.defflg;
	H_row.recdate = val.recdate;
	H_row.arid = val.arid;
	H_row.ordtype = val.ordtype;
	H_row.postid = val.postid;

	if ("" == H_row.postid) {
		sql = "SELECT postidparent FROM post_relation_tb WHERE level=0 AND pactid=" + H_row.pactid;
		H_row.postid = db.queryOne(sql);
	}

	if ("O" == val.type) //雛型名の頭に印をつけ、「（オプション変更）」の文言を追加
		{
			H_row.type = "P";
			H_row.tempname = "\u2605\uFF08\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4\uFF09" + val.tempname;
		} else //雛型名の頭に印をつける
		{
			H_row.type = val.type;
			H_row.tempname = "\u2605" + val.tempname;
		}

	var H_value = unserialize(val.value);

	if (true == Array.isArray(H_value) && true == 0 < H_value.length) //コンバータ関数に渡すための変数セット
		//購入方式
		//プラン
		//パケット
		//コンバート後の値を元の変数に戻す
		//郵便番号
		//割引サービス
		//機種
		{
			var H_conv = Array();
			H_conv.tempid = val.tempid;
			H_conv.carid = val.carid;
			H_conv.cirid = val.cirid;
			H_conv.planid = H_value.plan;
			H_conv.packetid = H_value.packet;
			H_conv.options = H_value.option;
			H_conv.machine = H_value.model;
			H_conv.noteadd = "";
			H_conv = convertBuysel(H_conv, H_def);
			H_conv = convertPlan(H_conv, H_def, db);
			H_conv = convertPacket(H_conv, H_def, db);

			if (true == (undefined !== H_conv.planid) && true == is_numeric(H_conv.planid)) {
				H_value.plan = H_conv.planid;
			}

			if (true == (undefined !== H_conv.packetid) && true == is_numeric(H_conv.packetid)) {
				H_value.packet = H_conv.packetid;
			}

			if (true == (undefined !== H_conv.buyselid) && true == is_numeric(H_conv.buyselid)) {
				H_value.purchase = H_conv.buyselid;
			}

			var address = H_value.sendaddress;
			address = address.trim();

			if (true == preg_match("/^\\d{3}\\-\\d{4}/", address)) {
				H_value.zip1 = address.substr(0, 3);
				H_value.zip2 = address.substr(4, 4);
				address = preg_replace("/^" + H_value.zip1 + "\\-" + H_value.zip2 + "/", "", address);
				address = address.trim();
			} else if (true == preg_match("/^\u3012\\d{3}\\-\\d{4}/", address)) {
				address = address.replace(/^〒/g, "");
				address = address.trim();
				H_value.zip1 = address.substr(0, 3);
				H_value.zip2 = address.substr(4, 4);
				address = preg_replace("/^" + H_value.zip1 + "\\-" + H_value.zip2 + "/", "", address);
				address = address.trim();
			}

			if ("" != address && undefined != address) {
				var contents = file_get_contents("/kcs/conf/area.master");
				var H_lines = preg_split("/[\r\n]+/", contents);

				for (var tdfk of Object.values(H_lines)) {
					if (true == preg_match("/^" + tdfk + "/", address)) {
						address = preg_replace("/" + tdfk + "/", "", address);
						address = address.trim();
						H_value.addr1 = tdfk;
						break;
					}
				}
			}

			H_value.addr2 = address;
			delete H_value.sendaddress;
			var H_option = H_value.option;
			var H_waribiki = Array();

			if (true == 0 < H_option.length) {
				for (var opky in H_option) //ホワイトプランはプランに入るのでスキップ
				{
					var opvl = H_option[opky];

					if (opky == WWHITE) {
						continue;
					}

					if (true == (-1 !== A_discount.indexOf(opky))) {
						H_waribiki[opky] = opvl;
						delete H_option[opky];
					}
				}
			}

			if (true == 0 < H_waribiki.length) {
				H_value.waribiki = H_waribiki;
			}

			var A_noteadd = Array();
			A_noteadd.push(H_conv.noteadd);

			if ("" != H_value.model) {
				A_noteadd.push("\u6A5F\u7A2E\uFF1A" + H_value.model);
				delete H_value.model;
			}

			if ("" != H_value.color) {
				A_noteadd.push("\u8272\uFF1A" + H_value.color);
				delete H_value.color;
			}

			if ("" != H_value.accessory) {
				var A_accessory = db.queryCol("SELECT accename FROM accessory_tb WHERE acceid IN (" + join(",", H_value.accessory) + ") ORDER BY acceid");
				A_noteadd.push("\u4ED8\u5C5E\u54C1\uFF1A" + join(",", A_accessory));
				delete H_value.accessory;
			}

			if ("" != H_value.number) {
				A_noteadd.push("\u6570\u91CF\uFF1A" + H_value.number);
				delete H_value.number;
			}

			if (true == 0 < A_noteadd.length) {
				var note = H_value.note;

				if (undefined == note) {
					note = "";
				} else {
					note = note + "\r\n";
				}

				H_value.note = note + join("\r\n", A_noteadd);
			}

			H_row.value = serialize(H_value);
		} else {
		H_value = Array();
		H_value.note = "\u203BV2\u96DB\u578B\u3092\u30B3\u30F3\u30D0\u30FC\u30C8\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F";
		H_row.value = serialize(H_value);
	}

	H_new_template[key] = H_row;
}

for (var A_temp of Object.values(H_new_template)) //インサート実行
{
	sql = "INSERT INTO mt_template_tb (" + "pactid, " + "carid, " + "type, " + "cirid, " + "tempname, " + "mask, " + "value, " + "defflg, " + "recdate, " + "arid, " + "ordtype, " + "postid, " + "ppid " + ") VALUES (" + A_temp.pactid + "," + A_temp.carid + "," + "'" + A_temp.type + "'," + A_temp.cirid + "," + "'" + A_temp.tempname + "'," + "'" + A_temp.mask + "'," + "'" + A_temp.value + "'," + A_temp.defflg + "," + "'" + A_temp.recdate + "'," + A_temp.arid + "," + "'" + A_temp.ordtype + "'," + A_temp.postid + "," + H_ppid[A_temp.carid + "-" + A_temp.type] + ")";
	db.exec(sql);
	echo("V2\u6CE8\u6587\u96DB\u578B" + A_temp.v2tempid + "\u3092V3\u306B\u30B3\u30F3\u30D0\u30FC\u30C8\u3057\u307E\u3057\u305F\n");
}

echo("pactid=" + pactid + "\u306E\u6CE8\u6587\u96DB\u578B\u30B3\u30F3\u30D0\u30FC\u30C8\u51E6\u7406\u304C\u7D42\u4E86\u3057\u307E\u3057\u305F\n");

function convertBuysel(H_conv, H_def) //購入方式コンバート
{
	if (H_conv.planid != "" && H_conv.planid != undefined && H_conv.planid < 3000) //ドコモ
		{
			if (H_conv.carid == DOCOMOCARID) //バリュー
				{
					if (preg_match("/(\\s|\u3000)\u30D0\u30EA\u30E5\u30FC/", H_def.H_plan_old[H_conv.planid]) == true) {
						var buyselid = H_def.H_buysel_d["\u30D0\u30EA\u30E5\u30FC"];
					} else {
						if (preg_match("/905|906|705|905|\uFF19\uFF10\uFF15|\uFF19\uFF10\uFF16|\uFF17\uFF10\uFF15|\uFF17\uFF10\uFF16/", H_conv.machine) == true) {
							buyselid = H_def.H_buysel_d["\u30D9\u30FC\u30B7\u30C3\u30AF"];
						} else {
							buyselid = H_def.H_buysel_d["\u9078\u629E\u306A\u3057"];
						}
					}
				} else if (H_conv.carid == AUCARID) //フルサポート
				{
					if (preg_match("/\uFF08\u30D5\u30EB\u30B5\u30DD\u30FC\u30C8\uFF09/", H_def.H_plan_old[H_conv.planid]) == true) {
						buyselid = H_def.H_buysel_a["\u30D5\u30EB\u30B5\u30DD\u30FC\u30C8"];
					} else if (preg_match("/\uFF08\u30B7\u30F3\u30D7\u30EB\uFF09|\u30B7\u30F3\u30D7\u30EB\uFF33|\u30B7\u30F3\u30D7\u30EB\uFF2C/", H_def.H_plan_old[H_conv.planid]) == true) {
						buyselid = H_def.H_buysel_a["\u30B7\u30F3\u30D7\u30EB"];
					} else {
						buyselid = H_def.H_buysel_a["\u9078\u629E\u306A\u3057"];
					}
				} else if (H_conv.carid == SBCARID) //新スーパーボーナス
				{
					if (preg_match("/\\s\u30D0\u30EA\u30E5\u30FC|\u30B7\u30F3\u30D7\u30EB\u30AA\u30EC\u30F3\u30B8/", H_def.H_plan_old[H_conv.planid]) == true) {
						buyselid = H_def.H_buysel_s["\u65B0\u30B9\u30FC\u30D1\u30FC\u30DC\u30FC\u30CA\u30B9"];
					} else {
						buyselid = H_def.H_buysel_s["\u9078\u629E\u306A\u3057"];
					}
				} else if (H_conv.carid == WILLCARID) {
				buyselid = H_def.H_buysel_w["\u9078\u629E\u306A\u3057"];
			} else if (H_conv.carid == EMCARID) {
				buyselid = H_def.H_buysel_e["\u9078\u629E\u306A\u3057"];
			} else if (H_conv.carid == SMCARID) {
				buyselid = H_def.H_buysel_e["\u9078\u629E\u306A\u3057"];
			} else {
				buyselid = "NULL";
			}

			if (buyselid != "") {
				H_conv.buyselid = buyselid;
			}
		}

	return H_conv;
};

function convertPlan(H_conv, H_def, db) {
	if (H_conv.planid != "" && H_conv.planid != undefined && H_conv.planid < 3000) //購入方式があるキャリア
		{
			if (-1 !== H_def.A_buycar.indexOf(H_conv.carid) == true) //buyselid未取得
				{
					if (H_conv.buyselid == "") {
						var get_sql = "select buyselid from buyselect_tb where carid=" + H_conv.carid + " and buyselname='\u9078\u629E\u306A\u3057'";
						H_conv.buyselid = db.queryOne(get_sql);

						if (is_numeric(H_conv.buyselid) == false) {
							H_conv.noteadd += "WARNING: \u8CFC\u5165\u65B9\u5F0F\u304C\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30D7\u30E9\u30F3\u306E\u30B3\u30F3\u30D0\u30FC\u30C8\u306F\u3057\u307E\u305B\u3093\t" + H_conv.tempid + "\r\n";
						}
					}

					var planname = H_def.H_plan_old[H_conv.planid];

					if (H_conv.carid == SBCARID) {
						var H_option = H_conv.options;

						if (Array.isArray(H_option) == true && H_option.length > 0) {
							for (var key in H_option) //Wホワイトオプションは消すのでスキップ
							{
								var val = H_option[key];

								if (key == WWHITE) {
									planname = "\u30DB\u30EF\u30A4\u30C8\u30D7\u30E9\u30F3\uFF08\uFF37\u30DB\u30EF\u30A4\u30C8\u4ED8\uFF09";
								}
							}
						}
					}

					if (H_conv.buyselid != "" && is_numeric(H_conv.buyselid) == true) {
						var sql = "select planid from plan_tb where planid > 3000 and carid=" + H_conv.carid + " and cirid=" + H_conv.cirid + " and buyselid=" + H_conv.buyselid + " and planname='" + planname + "'";
						var planid = db.queryOne(sql);

						if (is_numeric(planid) == false) {
							H_conv.noteadd += "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + H_conv.planid + ")\t" + H_conv.tempid + "\r\n";
						} else {
							H_conv.planid = planid;
						}
					}
				} else {
				sql = "select planid from plan_tb where planid > 3000 and carid=" + H_conv.carid + " and cirid=" + H_conv.cirid + " and planname='" + H_def.H_plan_old[H_conv.planid] + "'";
				planid = db.queryOne(sql);

				if (is_numeric(planid) == false) {
					H_conv.noteadd += "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059\u3002(" + H_conv.planid + ")\t" + H_conv.tempid + "\r\n";
				} else {
					H_conv.planid = planid;
				}
			}
		}

	return H_conv;
};

function convertPacket(H_conv, H_def, db) {
	if (H_conv.packetid != "" && H_conv.packetid != undefined && H_conv.packetid < 3000 && true == is_numeric(H_conv.packetid)) //旧パケット取得
		//特殊処理
		{
			var sql = "SELECT packetname FROM packet_tb where packetid < 3000 and carid=" + H_conv.carid + " and cirid=" + H_conv.cirid + " and packetid=" + H_conv.packetid;
			var packetname = db.queryOne(sql);

			if (SBCARID == H_conv.carid && packetname == "\u30D1\u30B1\u30C3\u30C8\u5272\u5F15\u306A\u3057") {
				packetname = "\u30D1\u30B1\u30C3\u30C8\u5272\u5F15\u306A\u3057(\u30DB\u30EF\u30A4\u30C8)";
			}

			if ("" != packetname) //新パケット取得
				{
					sql = "SELECT packetid FROM packet_tb WHERE packetid > 3000 AND carid=" + H_conv.carid + " AND cirid=" + H_conv.cirid + " AND packetname='" + packetname + "'";
					var packetid = db.queryOne(sql);

					if (is_numeric(packetid) == false) {
						H_conv.noteadd += "WARNING: \u30B3\u30F3\u30D0\u30FC\u30C8\u3067\u304D\u306A\u3044\u30D1\u30B1\u30C3\u30C8\u3067\u3059\u3002(" + H_conv.packetid + ")\t" + H_conv.tempid + "\r\n";
					} else {
						H_conv.packetid = packetid;
					}
				}
		}

	return H_conv;
};