//==============================================================================
//機能：NTTcom番号明細・OCN・通話明細請求情報インポート
//
//procとかmodelとかややこしい名前がついてますが、作り方をclassにしただけで
//機能はV2時代の物を使っています(import_nttcom_wld*をベースに作ったため)
//
//作成：五十嵐
//==============================================================================
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("import_basemodel.php");

require("import_nttcom_ocnmodel.php");

require("import_nttcom_billmodel.php");

require("import_nttcom_tuwamodel.php");

//オブジェクト
//引数
//
//__construct
//
//@author igarashi
//@since 2009/04/09
//
//@param mixed $A_array
//@access public
//@return void
//
//
//メインルーチン
//
//@author igarashi
//@since 2009/04/09
//
//@access public
//@return void
//
//
//__destruct
//
//@author igarashi
//@since 2009/04/10
//
//@access public
//@return void
//
class importNTTComProc {
	static NTTCOM_CARID = 14;
	static NTTCOM_FIX_CARID = 9;

	constructor() //オブジェクト生成
	{
		this.O_base = new importBaseModel();
	}

	execute(A_array) //共通処理（ログ吐きやディレクトリチェックはどのオブジェクトでもいい
	//処理するのは親クラスだから。
	//処理開始出力
	//===================================================
	//bill取込み開始
	//===================================================
	//ディレクトリ存在チェック
	//番号明細開始
	//ここから固定国際
	//固定国際ここまで
	//番号明細終了
	//OCN開始
	//$this->O_ocn->setEraceFlag($this->O_bill->getEraceFlag());	// キャリア違うから削除処理済みか見なくていい
	//OCN終了
	//通話明細開始
	//$this->O_tuwa->setEraceFlag($this->O_bill->getEraceFlag());		// 消す対象のテーブル違うから無条件で消していい
	//$H_tuwauti = $this->O_tuwa->getUtiwake(" AND code like '9-%'");
	//ここから固定国際
	//$H_tuwauti = $this->O_tuwa->getUtiwake(" AND code like '1-%'");
	//ここまで固定国際
	//通話明細終了
	//処理終了
	{
		this.O_base.setArgv(A_array);
		this.O_base.checkArgv(6);
		this.O_base.checkArgvDetail();
		this.H_argv = this.O_base.getArgv();
		this.O_bill = new importNTTComBillModel(this.O_base);
		this.O_ocn = new importNTTComOCNModel(this.O_base);
		this.O_tuwa = new importNTTComTuwaModel(this.O_base);
		this.O_bill.outLog("\u51E6\u7406\u958B\u59CB.");
		this.O_base.setTableName();
		this.O_bill.outLog("\u756A\u53F7\u660E\u7D30\u51E6\u7406\u958B\u59CB");

		if (false == this.O_bill.checkDataDir(this.H_argv)) {
			throw die(1);
		}

		this.O_bill.outLog("\u756A\u53F7\u660E\u7D30\u51E6\u7406\u7D42\u4E86");
		this.O_bill.getTargetPact(this.H_argv.targetpact);
		this.O_bill.checkLockScript();
		var H_pact = this.O_bill.getPact();
		this.O_bill.setCarrierID(importNTTComProc.NTTCOM_CARID);
		this.O_bill.setBillDir();
		var H_wlduti = this.O_bill.getUtiwake(" AND code like '4-%'");
		this.O_bill.execMainProc(H_pact, H_wlduti, this.O_bill.getEraceFlag());
		this.O_bill.Initialize();
		this.O_bill.setCarrierID(importNTTComProc.NTTCOM_FIX_CARID);
		this.O_bill.setBillDir();
		H_wlduti = this.O_bill.getUtiwake(" AND code like '4-%'");
		this.O_bill.execMainProc(H_pact, H_wlduti, this.O_bill.getEraceFlag());
		this.O_ocn.setDataDir(this.O_bill.getDataDir());
		this.O_ocn.getTargetPact(this.H_argv.targetpact);
		H_pact = this.O_ocn.getPact();
		this.O_ocn.setCarrierID(importNTTComProc.NTTCOM_FIX_CARID);
		var H_ocnuti = this.O_ocn.getUtiwake(" AND code like '5-%'");
		this.O_ocn.execMainProc(H_pact, H_ocnuti, this.O_bill.getEraceFlag());
		this.O_tuwa.setDataDir(this.O_bill.getDataDir());
		this.O_tuwa.getTargetPact(this.H_argv.targetpact);
		H_pact = this.O_tuwa.getPact();
		this.O_tuwa.setCarrierID(importNTTComProc.NTTCOM_CARID);
		this.O_tuwa.setBillDir();
		this.O_tuwa.execMainProc(H_pact, this.O_ocn.getEraceFlag());
		this.O_tuwa.Initialize();
		this.O_tuwa.setCarrierID(importNTTComProc.NTTCOM_FIX_CARID);
		this.O_tuwa.setBillDir();
		this.O_tuwa.execMainProc(H_pact, this.O_tuwa.getEraceFlag());
		this.O_bill.outLog("\u51E6\u7406\u7D42\u4E86.");
	}

	__destruct() {}

};

var O_proc = new importNTTComProc();
O_proc.execute(_SERVER.argv);
echo("\n");