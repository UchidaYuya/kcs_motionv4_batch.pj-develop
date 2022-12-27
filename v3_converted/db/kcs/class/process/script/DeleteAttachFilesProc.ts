//
//注文添付ファイル削除処理 （Process）
//
//更新履歴：<br>
//
//@package script
//@subpackage Process
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2011/03/02
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaユーザ取込処理 （Process）
//
//@uses ProcessBaseBatch
//@package script
//@author houshiyama
//@since 2011/03/02
//

require("process/ProcessBaseBatch.php");

require("view/script/DeleteAttachFilesView.php");

require("model/Order/OrderLightModel.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2011/03/02
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2011/03/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//_deleteFile
//
//@author houshiyama
//@since 2011/03/02
//
//@param mixed $dir
//@access protected
//@return void
//
//
//_scriptEnd
//
//@author
//@since 2011/03/02
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2011/03/02
//
//@access public
//@return void
//
class DeleteAttachFilesProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//View,Modelの生成
	{
		super(H_param);
		this.O_View = new DeleteAttachFilesView();
		this.O_Model = new OrderLightModel();
		this.filetypes = ["order", "recog", "shop", "hidden"];
		this.filetypecount = this.filetypes.length;
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.infoOut("\u6CE8\u6587\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u30B9\u30AF\u30EA\u30D7\u30C8\u958B\u59CB\n", 1);
		this.lockProcess(this.O_View.get_ScriptName());

		try //orderidの一覧
		{
			var orderids = this.O_Model.getDeletableAttachFilesOrderid();
			var idcount = orderids.length;
			var fileDir = WEB_FILES + "/OrderFiles";

			if (!file_exists(fileDir) || !is_dir(fileDir)) {
				mkdir(fileDir);
			}

			for (var i = 0; i < idcount; i++) {
				var temp = fileDir + "/" + orderids[i];

				if (file_exists(temp) && is_dir(temp)) {
					this._deleteFile(temp);

					this.infoOut("\u6CE8\u6587\u756A\u53F7\uFF1A" + orderids[i] + "\u306E\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3057\u307E\u3057\u305F" + "\n", 1);
				}

				this.O_Model.signedAttachDelete(orderids[i], true);
			}
		} catch (e) {
			this.infoOut(e.getMessage() + "\n", 1);
		}

		this._scriptEnd();
	}

	_deleteFile(dir) {
		for (var i = 0; i < this.filetypecount; i++) {
			var temp = dir + "/" + this.filetypes[i];

			if (file_exists(temp) && is_dir(temp)) {
				var file;
				var fh = opendir(temp);

				while (false !== (file = readdir(fh))) {
					if (file != "." && file != "..") {
						unlink(temp + "/" + file);
					}
				}
			}
		}
	}

	_scriptEnd() //スクリプトの二重起動防止ロック解除
	//スクリプト終了処理
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u6CE8\u6587\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u306E\u524A\u9664\u30B9\u30AF\u30EA\u30D7\u30C8\u7D42\u4E86\n", 1);
		throw die();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};