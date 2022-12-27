//
//clampに関するモデル
//
//@uses ModelBase
//@filesource
//@package Base
//@subpackage Model
//@author maeda
//@since 2009/06/03
//
//
//
//clampに関するモデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author maeda
//@since 2009/06/03
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/06/03
//
//@param object $O_DB
//@access public
//@return void
//
//
//ダウンロードＩＤリスト取得
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $carid
//@param mixed $pactid
//@param array $A_loginStat
//@access public
//@return void
//
//
//特定顧客IDのダウンロードリストを取得
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//getClamp
//
//@author
//@since 2010/11/19
//
//@param mixed $pactid
//@param mixed $clampid
//@param mixed $detailno
//@access public
//@return void
//
//
//ダウンロード済みリストを取得
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $carid
//@access public
//@return void
//
//
//updateStatus
//
//@author
//@since 2011/04/18
//
//@param mixed $pactid
//@param mixed $detailno
//@param mixed $carid
//@param mixed $status
//@access public
//@return void
//
//
//updatePassChgDate
//
//@author
//@since 2011/04/18
//
//@param mixed $pactid
//@param mixed $detailno
//@param mixed $carid
//@param mixed $now
//@access public
//@return void
//
//
//取込失敗リストを取得
//
//@author miyazawa
//@since 2009/12/08
//
//@param mixed $carid
//@access public
//@return void
//
//
//クランプ追加
//
//@author
//@since 2010/10/22
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//クランプ情報の修正
//
//@author
//@since 2010/11/16
//
//@access public
//@return void
//
//
//clampidを削除 1件以上消えたら失敗
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detailno
//@param mixed $data
//@access public
//@return void
//
//
//addParentTel
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $data
//@access public
//@return void
//
//
//親番号編集
//
//@author
//@since 2010/11/16
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//親番号削除
//
//@author
//@since 2010/11/17
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $prtelno
//@access public
//@return void
//
//
//addKeyFile
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@access public
//@return void
//
//
//removeKeyFile
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@access public
//@return int 0:ファイルがない 1:成功 2:失敗
//
//
//_getKeyFilePath
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//getKeyFileList
//
//@author
//@since 2010/11/19
//
//@param mixed $carid
//@access public
//@return void
//
//
//convertPem
//
//@author
//@since 2010/11/24
//
//@param mixed $pactid
//@param mixed $pass_phrase
//@access public
//@return void
//
//
//ダウンロードの二段階認証のためのクッキーを登録する
//
//@author morihara
//@since 2018/05/28
//
//@access public
//@param $pactid 顧客ID
//@param $carid キャリアID
//@param $detailno 明細番号
//@param $cookie クッキー
//
//
//デストラクト　親のを呼ぶだけ
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return void
//
class ClampModel extends ModelBase {
	static KEY_FILE_DIR = "/kcs/conf/au_dlkey";

	constructor(O_db = undefined) {
		super(O_db);
	}

	getClampList(carid, pactid = undefined, A_loginStat = Array()) //契約ＩＤの指定がある場合
	//ID分処理する
	{
		var sql = "select cl.pactid,cl.clampid,cl.clamppasswd,cl.detailno,cl.login_status,cl.code,cl.key_file,cl.key_pass," + "date(cl.pass_changedate) as pass_changedate,cl.pass_interval,pa.type,pa.compname " + "from clamp_tb cl inner join pact_tb pa on cl.pactid = pa.pactid " + "where cl.carid = " + carid + " ";

		if ("" != pactid) {
			sql += "and cl.pactid = " + pactid + " ";
		}

		if (0 != A_loginStat.length) {
			sql += "and cl.login_status in (" + A_loginStat.join(",") + ") ";
		}

		sql += "order by cl.pactid,cl.detailno";
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;
		var H_clampData = Array();

		for (var recCounter = 0; recCounter < recCnt; recCounter++) //array(TYPE => array(PACTID => array(DETAILNO => CLAMPDATA)))
		{
			H_clampData[H_result[recCounter].type][H_result[recCounter].pactid][H_result[recCounter].detailno] = {
				clampid: H_result[recCounter].clampid,
				clamppasswd: H_result[recCounter].clamppasswd,
				login_status: H_result[recCounter].login_status,
				code: H_result[recCounter].code,
				key_file: H_result[recCounter].key_file,
				key_pass: H_result[recCounter].key_pass,
				pass_changedate: H_result[recCounter].pass_changedate,
				pass_interval: H_result[recCounter].pass_interval,
				compname: H_result[recCounter].compname
			};
		}

		return H_clampData;
	}

	getClamps(pactid, carid) {
		var sql = "SELECT " + "* " + "FROM " + "clamp_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getDB().dbQuote(carid, "integer", true) + " " + "ORDER BY " + "detailno";
		return this.getDB().queryHash(sql);
	}

	getClampRow(pactid, carid, detailno) {
		var sql = "SELECT " + "* " + "FROM " + "clamp_tb " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND carid = " + this.getDB().dbQuote(carid, "integer", true) + " AND detailno = " + this.getDB().dbQuote(detailno, "integer", true);
		return this.getDB().queryRowHash(sql);
	}

	getDownloadedList(carid) //レコード分処理する
	{
		var sql = "select pactid,year,month,type,date(dldate) as dldate from clamp_index_tb " + "where carid = " + carid;
		var H_result = this.getDB().queryHash(sql);
		var recCnt = H_result.length;
		var H_downloadedData = Array();

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			if (10 > H_result[recCounter].month) {
				var month = "0" + H_result[recCounter].month;
			} else {
				month = H_result[recCounter].month;
			}

			if (undefined !== H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month] == false) //array(PACTID => array(YYYYMM => TYPE)))
				{
					H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].type = [H_result[recCounter].type];
					H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].dldate = [H_result[recCounter].dldate];
				} else {
				H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].type.push(H_result[recCounter].type);
				H_downloadedData[H_result[recCounter].pactid][H_result[recCounter].year + month].dldate.push(H_result[recCounter].dldate);
			}
		}

		return H_downloadedData;
	}

	updateStatus(pactid, detailno, carid, status) {
		var sql = "update clamp_tb set login_status = " + status + " " + "where pactid = " + pactid + " and " + "carid = " + carid + " and " + "detailno = " + detailno;
		return this.getDB().exec(sql);
	}

	updatePassChgDate(pactid, detailno, carid, now) {
		var sql = "update clamp_tb set pass_changedate = '" + now + "' " + "where pactid = " + pactid + " and " + "carid = " + carid + " and " + "detailno = " + detailno;
		return this.getDB().exec(sql);
	}

	getFailedList(carid, yyyy, mm) {
		var sql = "SELECT pactid,year,month,type FROM clamp_index_tb " + "WHERE carid = " + carid + " AND year='" + yyyy + "' AND month='" + mm + "' AND (is_details=false OR is_comm=false)";
		var H_failedData = this.getDB().queryHash(sql);
		return H_failedData;
	}

	addClamp(pactid, carid, data) {
		var sql = "SELECT max(detailno) FROM clamp_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true);
		var detailno = this.get_DB().queryOne(sql) + 1;

		if (this.getSetting().car_docomo == carid || this.getSetting().car_softbank == carid) //auは情報が多い
			{
				var clamp = {
					pactid: this.get_DB().dbQuote(pactid, "int", true),
					clampid: this.get_DB().dbQuote(data.clampid, "text", true),
					clamppasswd: this.get_DB().dbQuote(data.clamppasswd, "text", true),
					carid: this.get_DB().dbQuote(carid, "int", true),
					detailno: this.get_DB().dbQuote(detailno, "int", true)
				};
			} else if (this.getSetting().car_au == carid) {
			clamp = {
				pactid: this.get_DB().dbQuote(pactid, "int", true),
				clampid: this.get_DB().dbQuote(data.clampid, "text", true),
				clamppasswd: this.get_DB().dbQuote(data.clamppasswd, "text", true),
				carid: this.get_DB().dbQuote(carid, "int", true),
				detailno: this.get_DB().dbQuote(detailno, "int", true),
				code: this.get_DB().dbQuote(data.code, "text", true),
				key_file: this.get_DB().dbQuote(this._getKeyFilePath(pactid) + data.key_file, "text", true),
				key_pass: this.get_DB().dbQuote(data.key_pass, "text", true)
			};
		}

		sql = "INSERT INTO clamp_tb (" + ", ".join(Object.keys(clamp)) + ") " + "VALUES (" + ", ".join(clamp) + ")";
		return this.get_DB().query(sql);
	}

	editClamp(pactid, carid, detailno, data) //パスワードは入力があった時だけ
	{
		var timestamp = this.get_DB().getNow();
		var sql = "UPDATE clamp_tb " + "SET " + "clampid=" + this.get_DB().dbQuote(data.clampid, "text", true) + " ";

		if (!!data.clamppasswd) {
			sql += ", clamppasswd=" + this.get_DB().dbQuote(data.clamppasswd, "text", true) + ", " + "pass_changedate=" + this.get_DB().dbQuote(timestamp, "date", true) + " ";
		}

		if (this.getSetting().car_au == carid) {
			sql += ", code=" + this.get_DB().dbQuote(data.code, "text", true) + ", " + "key_file=" + this.get_DB().dbQuote(this._getKeyFilePath(pactid) + data.key_file, "text", true);

			if (!!data.clamppasswd) {
				sql += ", key_pass=" + this.get_DB().dbQuote(data.key_pass, "text", true);
			}
		}

		sql += "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND detailno=" + this.get_DB().dbQuote(detailno, "int", true);
		this.get_DB().beginTransaction();

		if (1 != this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	removeClamp(pactid, carid, detailno, data) {
		var sql = "DELETE FROM clamp_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND detailno=" + this.get_DB().dbQuote(detailno, "int", true);
		this.get_DB().beginTransaction();

		if (1 != this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	addParentTel(pactid, carid, data) {
		var sql = "INSERT INTO bill_prtel_tb " + "(pactid, carid, prtelno, prtelname) " + "VALUES (" + this.get_DB().dbQuote(pactid, "int", true) + ", " + this.get_DB().dbQuote(carid, "int", true) + ", " + this.get_DB().dbQuote(data.prtelno, "text", true) + ", " + this.get_DB().dbQuote(data.prtelname, "text", true) + ")";
		this.get_DB().query(sql);
	}

	editParentTel(pactid, carid, prtelno, data) {
		var sql = "UPDATE bill_prtel_tb " + "SET " + "prtelno=" + this.get_DB().dbQuote(data.prtelno, "text", true) + ", " + "prtelname=" + this.get_DB().dbQuote(data.prtelname, "text", true) + " " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);
		this.get_DB().beginTransaction();

		if (1 != this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	removeParentTel(pactid, carid, prtelno) {
		var sql = "DELETE FROM bill_prtel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);
		this.get_DB().beginTransaction();

		if (1 !== this.get_DB().query(sql)) {
			this.get_DB().rollback();
			return false;
		}

		this.get_DB().commit();
		return true;
	}

	addKeyFile(pactid) {
		if (!is_dir(ClampModel.KEY_FILE_DIR + "/pactid")) {
			mkdir(ClampModel.KEY_FILE_DIR + "/pactid");
		}

		if (is_uploaded_file(_FILES.key_file.tmp_name)) {
			if (move_uploaded_file(_FILES.key_file.tmp_name, this._getKeyFilePath(pactid) + _FILES.key_file.name)) {
				return true;
			}
		}

		return false;
	}

	removeKeyFile(pactid, file) {
		var file_path = this._getKeyFilePath(pactid);

		if (!file_exists(file_path + file)) {
			return 0;
		}

		if (unlink(file_path + file)) {
			return 1;
		}

		return 2;
	}

	_getKeyFilePath(pactid) {
		return ClampModel.KEY_FILE_DIR + "/" + pactid + "/";
	}

	getKeyFileList(pactid, carid, mode) {
		if (is_dir(ClampModel.KEY_FILE_DIR + "/" + pactid)) {
			var file;
			var result = Array();
			var dir = opendir(ClampModel.KEY_FILE_DIR + "/" + pactid);

			while (false !== (file = readdir(dir))) {
				if (!preg_match("/^\\./", file)) {
					if ("hash" == mode) {
						result.push({
							key_file: file
						});
					} else {
						result[file] = file;
					}
				}
			}
		}

		return result;
	}

	convertPem(pactid, pass_phrase) {
		var extension = pathinfo(_FILES.key_file.name, PATHINFO_EXTENSION);
		var filename = pathinfo(_FILES.key_file.name, PATHINFO_FILENAME);

		var up_dir = this._getKeyFilePath(pactid);

		if ("pfx" == extension) //変換
			//元ファイル削除
			//ファイル変換に失敗してたら消す
			{
				var fp = popen("openssl pkcs12 -in " + up_dir + _FILES.key_file.name + " -out " + up_dir + filename + ".key", "w");
				fputs(fp, pass_phrase + "\n");
				fputs(fp, pass_phrase + "\n");
				fputs(fp, pass_phrase + "\n");
				pclose(fp);
				fp = popen("openssl rsa -in '" + up_dir + filename + ".key' -out '" + up_dir + filename + ".pem'", "w");
				fputs(fp, pass_phrase + "\n");
				pclose(fp);
				exec("openssl x509 -in '" + up_dir + filename + ".key'" + " >> '" + up_dir + filename + ".pem'");
				exec("rm -f '" + up_dir + filename + ".key'");
				exec("rm -f " + up_dir + _FILES.key_file.name);

				if (1 > filesize(up_dir + filename + ".pem")) {
					exec("rm -f '" + up_dir + filename + ".pem'");
					return false;
				}
			}

		return true;
	}

	updateCookie(pactid, carid, detailno, cookie) {
		var timestamp = this.get_DB().getNow();
		var sql = "update clamp_tb set cookie1=" + this.get_DB().dbQuote(cookie, "text", true) + " " + ",terminal_regist_date=" + this.get_DB().dbQuote(timestamp, "date", true) + " " + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " " + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " " + " and detailno=" + this.get_DB().dbQuote(detailno, "integer", true) + " " + ";";
		this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};