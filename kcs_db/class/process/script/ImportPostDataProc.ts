//部署データ取込処理 （Process）

import PactModel from "../../model/PactModel";
import ProcessBaseBatch from "../ProcessBaseBatch";
import ImportPostDataView from "../../view/script/ImportPostDataView";
import ImportPostDataModel from "../../model/script/ImportPostDataModel";

const fs = require("fs");
export default class ImportPostDataProc extends ProcessBaseBatch {
	static SCRIPTNAME = "ImportPostData";
	static DATAFILE = "post.csv";
	static PROTECTFILE = "protect.txt";
	_view: ImportPostDataView;
	_model: ImportPostDataModel;
	_pactDone: any[];
	_pactids: any;
	_monthNum!: number;
	_trgDate: any;
	_pactId!: string;
	_statusLog: string | undefined;
	_dataDir: string | undefined;
	_fp: any;
	_pactModel: PactModel | undefined;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	{
		super(H_param);
		this._pactDone = Array();
		this.getSetting().loadConfig("postdata");
		this._view = new ImportPostDataView();
		this._model = new ImportPostDataModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) {
		try //初期処理
		{
			this._preExecute();

			var status = "ok";

			for (var pactid of this._pactids) {
				this.infoOut(pactid + "\t部署データインポート開始\n", 0);

				try //データファイル取得
				{
					var files = this._getDataFile(pactid);

					var datafile = files[0];
					var protectfile = files[1];

					var contents = this._model.getDataFileContents(datafile);

					var data = this._toArrayFileContents(pactid, contents);

					data.push(this._model.getProtectFileContents(protectfile));

					var res = this._checkContents(data[0]);

					if ("string" === typeof res) {
						throw new Error(res);
					}

					this._model.begin();

					for (var i = 0; i <= this._monthNum; i++) //対象テーブルセット
					{
						if (i == 0) {
							var trgDate = this._trgDate;
						} else {
							trgDate = new Date(new Date().getFullYear(), new Date().getMonth() -i, 1,0,0,0).toJSON().slice(0,8).replace(/-/g,'');
						}

						this._model.setTargetTables(trgDate);

						this._import(pactid, trgDate, data);
					}

					this._moveDataFile(pactid);

					this._model.commit();
				} catch (e) {
					if (this._model.inTransaction()) {
						this._model.rollback();
					}

					this._writeStatusLog(e.getMessage());

					this.infoOut(e.getMessage(), 0);
					status = "ng";
				}

				this.infoOut(pactid + "\t部署データインポート終了\n", 0);
			}

			this.getOut().flushMessage();

			this._writeStatusLog(pactid + "\tstatus\t" + status);
		} catch (e) //エラーがあったらメールを飛ばす
		{
			this.errorOut(1000, e.getMessage(), 0, "", "");
		}

		this._postExecute();
	}

	_preExecute() //固有ログディレクトリの作成取得
	{
		this.set_Dirs(this._view.get_ScriptName());
		this.infoOut("部署データインポート開始\n", 1);
		this.lockProcess(this._view.get_ScriptName());
		this._pactId = this._view.get_HArgv("-p");
		this._trgDate = new Date(new Date().getFullYear(), new Date().getMonth()).toJSON().slice(0,8).replace(/-/g,'');
		this._monthNum = this._view.get_HArgv("-n");

		if (this._monthNum > 24) {
			throw new Error("-n は0から24の間の整数で指定してください\n");
		}

		var str = "php " + ImportPostDataProc.SCRIPTNAME + " -p=" + this._pactId + " -n=" + this._monthNum;

		if (this._view.issetHArgv("-l")) {
			this._statusLog = this._view.get_HArgv("-l");

			if (!(this._fp = fs.openSync(this._statusLog, "w"))) {
				throw new Error("ログファイルが開けませんでした\n");
			}

			str += " -l=" + this._statusLog;
		}

		this.infoOut(str + "\n", 0);
		this._dataDir = this._getDataDir(this._trgDate);
		this._pactids = this._getPactList(this._dataDir, this._pactId);

		this._model.setStatusLog(this._fp);
	}

	_postExecute() //終了していないトランザクションがあればロールバック
	{
		if (this._model.inTransaction()) {
			this._model.rollback();
		}

		this.unLockProcess(this._view.get_ScriptName());

		if (this._view.issetHArgv("-l")) {
			fs.close(this._fp);
		}

		this.set_ScriptEnd();
		this.infoOut("部署データインポート終了\n", 1);
	}

	_import(pactid: any, date: string, data: any[]) //データファイルの中身取得
	{
		var unknownPostid: any;
		var contents = data[0];
		var fileUserPostids = data[1];
		var protectPostids = data[2];

		var dbUserPostids = this._model.getUserPostids(pactid);

		var deletePostids = this._model.getDifferencePosts(fileUserPostids, dbUserPostids);

		deletePostids = this._getDeletePostids(deletePostids, protectPostids);

		var insertPostids = this._model.getDifferencePosts(dbUserPostids, fileUserPostids);

		var modifyPostids = this._model.getDifferencePosts(dbUserPostids, fileUserPostids, false);

		if (!(unknownPostid = this._model.checkUnknownPostExists(pactid))) {
			unknownPostid = this._model.makeUnknownPost(pactid);
		}

		var return_0:string | boolean = "";

		if (!!deletePostids) {
			this.infoOut("部署削除処理開始\n", 0);
			data = this._model.getTargetPostData(pactid, deletePostids);

			this._model.prepareDeletePosts(data, unknownPostid);

			var deleteReturn = this._model.deletePosts(data);

			if ("string" === typeof deleteReturn) {
				this.infoOut("部署削除処理エラー\n", 0);
				return_0 += deleteReturn;
				throw new Error(return_0);
			}
		}

		if (!!insertPostids) {
			this.infoOut("部署追加処理開始\n", 0);
			data = this._getTargetPostData(contents, insertPostids);

			var insertReturn = this._model.insertPosts(data);

			if ("string" === typeof insertReturn) {
				this.infoOut("部署追加処理エラー\n", 0);
				return_0 += insertReturn;
				throw new Error(return_0);
			}
		}

		if (!!modifyPostids) {
			this.infoOut("部署更新処理開始\n", 0);
			data = this._getTargetPostData(contents, modifyPostids);

			var modifyReturn = this._model.modifyPosts(data);

			if ("string" === typeof modifyReturn) {
				this.infoOut("部署更新処理エラー\n", 0);
				return_0 += modifyReturn;
				throw new Error(return_0);
			}
		}

		this.infoOut("部署ツリー更新処理開始\n", 0);
		return_0 = this._model.rebuildPostRelation(contents, protectPostids);

		if ("string" === typeof return_0) {
			this.infoOut("部署ツリー更新処理エラー\n", 0);
			throw new Error(return_0);
		}

		if (date == new Date(new Date().getFullYear(), new Date().getMonth()).toJSON().slice(0,8).replace(/-/g,'')) //承認先部署更新
			{
				return_0 = "";
				this.infoOut("承認ツリー更新処理開始\n", 0);

				var returnRecog = this._model.rebuildRecognize(contents, unknownPostid);

				if ("string" === typeof returnRecog) {
					this.infoOut("承認ツリー更新処理エラー\n", 0);
					return_0 += returnRecog;
					throw new Error(return_0);
				}

				this.infoOut("ショップ情報更新処理開始\n", 0);

				var returnShop = this._model.rebuildShopRelation(contents);

				if ("string" === typeof returnShop) {
					this.infoOut("ショップ情報更新処理エラー\n", 0);
					return_0 += returnShop;
					throw new Error(return_0);
				}
			}

		return true;
	}

	_toArrayFileContents(pactid: any, contents: string) {
		var lines = contents.split("\n");
		var data1 = Array();
		var data2 = Array();

		for (var i = 1; i < lines.length; i++) {
			var tmp = lines[i].split(",");

			if (tmp[0] != "") {
				var line: any = Array();
				line.pactid = pactid;
				line.userpostid = tmp[0].split("\"").join("");
				line.userpostid_parent = tmp[1].split("\"").join("");
				line.postname = tmp[2].split("\"").join("");
				line.level = tmp[3].split("\"").join("");
				line.recogpostid = tmp[4].split("\"").join("");
				line.shopinfo = tmp[5].split("\"").join("");

				if (!(-1 !== data2.indexOf(tmp[0].split("\"").join("")))){
					data2.push(tmp[0].split("\"").join(""));
				}

				data1.push(line);
			}
		}

		return [data1, data2];
	}

	_checkContents(contents: any) {
		var mess = "";

		for (var i = 0; i < contents.length; i++) {
			if (contents[i].userpostid == "") {
				mess += contents[i].pactid + "\t" + i + "行目\tuserpostidが空です\n";
				continue;
			}

			if (contents[i].userpostid_parent == "" && contents[i].level != "1") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tuserpostid_parentが空です\n";
				continue;
			}

			if (contents[i].postname == "") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tpostnameが空です\n";
				continue;
			}

			if (contents[i].level == "") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tlevelが空です\n";
				continue;
			}

			if (Math.round(contents[i].level) > 1) {
				for (var row of contents) {
					if (row.userpostid == contents[i].userpostid_parent && row.level == Math.round(contents[i].level) - 1) {
						continue;
					}
				}

				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\t親部署が見つかりません\n";
				continue;
			} else {}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	_getPactModel() {
		if (!(this._pactModel instanceof PactModel)) {
			this._pactModel = new PactModel();
		}

		return this._pactModel;
	}

	_getDataDir(date: any) //データディレクトリを取得
	{
		var dataDir = this._model.getDataDir(date);

		if (this.isDirCheck(dataDir) == false) {
			throw new Error(this.getSetting().get("POSTDATA") + "データファイルディレクトリ（" + dataDir + "）がみつかりません\n");
		}

		return dataDir;
	}

	_getDataFile(pactid: any) {
		var trgFile = this._dataDir + pactid + "/" + ImportPostDataProc.DATAFILE;

		if (!fs.statSync(trgFile).isDirectory()) {
			throw new Error(this.getSetting().get("POSTDATA") + "データファイル（" + trgFile + "）がみつかりません\n");
		}

		var protectFile = this._dataDir + pactid + "/" + ImportPostDataProc.PROTECTFILE;

		if (!fs.statSync(protectFile).isDirectory()()) {
			this.infoOut(this.getSetting().get("POSTDATA") + "データファイル（" + protectFile + "）がみつかりません\n", 0);
		}

		return [trgFile, protectFile];
	}

	_getPactList(dir: string, pactid: string) //処理する契約ＩＤを取得する
	{
		var pactids = super.getPactList(dir, pactid);
		pactids.sort();

		if (0 == pactids.length) {
			throw new Error("データファイルがみつかりません\n");
		}

		return pactids;
	}

	_writeStatusLog(mess: string) {
		if (this._view.issetHArgv("-l")) {
			fs.writeFileSync(this._fp, mess);
		}
	}

	_getTargetPostData(contents: any, list: string | any[]) {
		var data = Array();

		for (var row of contents) {
			if (-1 !== list.indexOf(row.userpostid)) {
				data.push(row);
			}
		}

		return data;
	}

	_getDeletePostids(data: any[], protect: string | any[]) {
		var difference = data.filter((x: any) => !protect.includes(x));
		return difference;
	}

	_moveDataFile(pactid: any) {
		var finDir = this._dataDir + pactid + "/fin/";

		if (!fs.existsSync(finDir)) {// 2022cvt_003
			if (!fs.mkdirSync(finDir)) {
				throw new Error(finDir + " ディレクトリを作成出来ませんでした\n");
			}
		}

		var oldFiles = this._getDataFile(pactid);

		for (var oldFile of oldFiles) {
			if (fs.statSync(oldFile).isDirectory()) {
				var res: any;
				var newFile = finDir + fs.basenameSync(oldFile) + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("");;

				if (!(res = fs.renameSync(oldFile, newFile))) {
					throw new Error("データファイルの移動が出来ませんでした\n");
				}
			}
		}
	}
};
