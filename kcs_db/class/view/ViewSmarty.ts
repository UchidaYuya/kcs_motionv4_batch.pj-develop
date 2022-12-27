//error_reporting(E_ALL|E_STRICT);
//
//Smartyを用いる基本ＶＩＥＷクラス
//
//更新履歴：<br>
//2008/02/08 中西達夫 作成
import ViewBaseHtml from './ViewBaseHtml';
const path = require('path');

export default class ViewSmarty extends ViewBaseHtml {
	O_Smarty: any;
	language: any;
	getSetting: any;
	constructor(H_param:any = Array()) //$common 共通/ユーザー個別フラグを得る
	{
		super(H_param);

		if (true == (undefined !== H_param.common)) {
			var common = H_param.common;
		} else {
			common = false;
		}

		if (true == (undefined !== H_param.language)) {
			this.language = H_param.language;
		} else {
			this.language = "JPN";
		}

		this.O_Smarty = this.newSmarty(common, this.language);
	}

	newSmarty(common = false, language = "JPN") //共通/ユーザー個別 によってディレクトリが異なる
	//設定を得る
	//Smarty用ディレクトリ
	//$this->infoOut( $smarty_dir );
	//Smarty の生成
	{
	}

	get_Smarty() {
		return this.O_Smarty;
	}

	getDefaultTemplate() //設定を得る
	//ファイル名の拡張子を置換する
	//表示言語分岐
	{
	}
};