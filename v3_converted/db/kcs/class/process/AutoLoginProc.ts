//
//自動ログイン
//
//更新履歴：<br>
//2013/04/23 池島麻美 作成
//
//@uses    ProcessBaseHtml
//@uses    autoLoginView
//@uses    AutoLoginModel
//@package AutoLogin
//@author  ikeshima
//@since   2013/04/23
//
//error_reporting(E_ALL|E_STRICT);
//
//
//自動ログイン
//
//@uses 　　ProcessBaseHtml
//@package  AutoLogin
//@author   ikeshima
//@since    2013/04/23
//

require("process/ProcessBaseHtml.php");

require("view/autoLoginView.php");

require("model/AutoLoginModel.php");

//
//__construct
//
//@author ikeshima
//@since 2013/94/25
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author ikeshima
//@since 2013/04/25
//
//@param  array $H_param
//@access protected
//@return void
//
//
//setParam
//
//@author ikeshima
//@since  2013/04/24
//
//@param  array  $data
//@access private
//@return void
//
//
//getParam
//
//@author ikeshima
//@since  2013/04/24
//
//@param
//@access private
//@return void
//
//
//__destruct
//
//@author ikeshima
//@since 2013/04/24
//
//@access public
//@return void
//
class AutoLoginProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) //// view の生成
	//// modelの生成
	{
		super(H_param);
		this.O_View = new autoLoginView();
		this.O_Model = new AutoLoginModel();
		this.mode = "";
		this.telno = "";
		this.pactid = "";
		this.yy = "";
		this.mm = "";
	}

	doExecute(H_param: {} | any[] = Array()) //パラメータ確認・セット
	//必要な値をViewクラスから取得
	//電話番号指定無
	//請求書情報へ
	{
		this.O_View.autoLoginInitialize();
		this.getParam();
		var dataary = Array();
		this.O_Model.getTableNo(this.yy, this.mm);

		if (this.telno == "") //電話番号取得出来ず...個人情報明細Topへ
			{
				this.telno = this.O_Model.getTelNo(this.pactid, this.O_View.getUserId());

				if (this.telno == "") {
					this.O_View.viewBillMenu();
				}

				this.O_View.setParam("telno", this.telno);
			}

		if (this.mode == "" || this.mode == 1) //通話明細、取得
			{
				this.mode = "";
				dataary = this.O_Model.getHistoryData("commhistory", this.pactid, this.telno);
				if (dataary.length > 0) this.mode = 1;
			}

		if (this.mode == "" || this.mode == 4) //請求書、取得
			{
				this.mode = "";
				dataary = this.O_Model.getHistoryData("billhistory", this.pactid, this.telno);
				if (dataary.length > 0) this.mode = 4;
			}

		if (this.mode == "" || this.mode == 0) //請求書、取得
			{
				this.mode = "";
				dataary = this.O_Model.getHistoryData("tel_details", this.pactid, this.telno);
				if (dataary.length > 0) this.mode = 0;
			}

		if (this.mode == "" || dataary.length == 0) //tel_x_tbにデータがあるか確認
			//無
			{
				dataary = this.O_Model.getTelData(this.pactid, this.telno);

				if (dataary.length == 0) //個人情報明細Topへ
					{
						this.O_View.viewBillMenu();
					}

				if (this.mode == "") this.mode = 0;
			}

		this.setParam(dataary);
		this.O_View.viewBillDetails();
	}

	setParam(data) {
		this.O_View.setParam("mode", this.mode);
		this.O_View.setParam("postid", data.postid);
		this.O_View.setParam("carid", data.carid);
	}

	getParam() {
		this.pactid = this.O_View.getPactId();
		this.mode = this.O_View.getParam("mode");
		this.telno = this.O_View.getParam("telno");
		this.yy = this.O_View.getParam("y");
		this.mm = this.O_View.getParam("m");
	}

	__destruct() {
		super.__destruct();
	}

};