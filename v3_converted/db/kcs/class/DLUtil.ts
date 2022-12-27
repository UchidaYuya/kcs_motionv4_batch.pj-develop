//
//DLUtil
//
//@package Base
//@subpackage DLUtil
//@filesource
//
//
//
//DLUtil
//
//@package Base
//@subpackage DLUtil
//

//
//DL用プロパティ取得
//
//@return Hash DL用プロパティが入った連想配列
//
//
//文字列全角変換関数
//
//@param str $str 文字列
//@return str $str 全角に変換された文字列
//
class DLUtil {
	getDLProperty() //SQL作成
	//全体のセパレータ（tab/comma、デフォルトはタブ（tab））
	//項目内のセパレータ（|/sep1（全体のセパレータと同じ）、デフォルトはバーチカルバー（|））
	//文字列項目のクォーテーション有無（off/on、デフォルトは無（off））
	{
		var sql = "SELECT separator1, separator2, separator3, textize, title, extension FROM dl_property_tb WHERE pactid=" + _SESSION.pactid;
		var H_format = GLOBALS.GO_db.getRowHash(sql);

		if (H_format.separator1 == "" || H_format.separator1 == "tab") {
			H_format.separator1 = "\t";
		} else if (H_format.separator1 == "comma") {
			H_format.separator1 = ",";
		} else {
			H_format.separator1 = "\t";
		}

		if (H_format.separator2 == "") {
			H_format.separator2 = "|";
		} else if (H_format.separator2 == "sep1") {
			H_format.separator2 = H_format.separator1;
		} else {
			H_format.separator2 = "|";
		}

		if (H_format.textize == "") {
			H_format.textize = "off";
		}

		if (H_format.title == "") {
			H_format.title = "write";
		}

		if (H_format.extension == "") {
			H_format.extension = "csv";
		}

		return H_format;
	}

	strConvert(str) {
		str = mb_convert_kana(str, "ARNSKHV");
		str = str.replace(/"/g, "\u201D");
		str = str.replace(/'/g, "\u2019");
		return str;
	}

};