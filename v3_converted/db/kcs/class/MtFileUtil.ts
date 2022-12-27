//
//ファイル読み込みユーティリティ
//
//更新履歴：<br>
//2008/04/09 上杉勝史 作成
//
//@package Base
//@subpackage File
//@author katsushi
//@filesource
//@since 2008/04/09
//
//
//
//ファイル読み込みユーティリティクラス
//
//@package Base
//@subpackage File
//@author katsushi
//@filesource
//@since 2008/04/09
//

require("MtOutput.php");

//
//インスタンス生成確認用
//
//@var array
//@access private
//@static
//
//
//FilePointer
//
//@var mixed
//@access private
//
//
//コンストラクタ<br>
//privateなのでnewは出来ない（必ずsingletonを呼ぶ）
//
//@author katsushi
//@since 2008/04/09
//
//@access private
//@return void
//
//
//singletonパターン<br>
//ファイル毎に必ず一つだけしかインスタンスを生成しない為の実装
//
//@author katsushi
//@since 2008/04/09
//
//@static
//@access public
//@return self::$HO_Instance
//
//
//&csvReadLine
//
//@author katsushi
//@since 2008/04/09
//
//@param mixed $filename
//@param mixed $delmiter
//@param mixed $enclosure
//@param mixed $escape
//@static
//@access public
//@return void
//
//
//デストラクタ
//
//@author katsushi
//@since 2008/03/14
//
//@access public
//@return void
//
class MtFileUtil {
	static HO_Instance = undefined;

	constructor() {}

	static singleton(filename) //インスタンスが既に生成されていない場合のみインスタンス生成
	//if(isset(self::$HO_Instance[$filename]) == false){
	//self::$HO_Instance[$filename] = new MtFileUtil($filename);
	//}
	//return self::$HO_Instance[$filename];　-->self::の原因、変換できない
	{}

	static csvReadLine(filename, delmiter = ",", enclosure = "\"", escape = "\\") //if(isset(self::$HO_Instance[$filename]) == false){
	//self::$HO_Instance[$filename] = new MtFileUtil($filename);
	//self::$HO_Instance[$filename]->FilePointer = fopen($filename, "r");
	//}　-->self::の原因、変換できない
	//if(isset(self::$HO_Instance[$filename]->FilePointer) == true){
	//// PHP5.3以降用
	////$A_data = fgetcsv(self::$HO_Instance[$filename]->FilePointer, 0, $delmiter, $enclosure, $escape);
	//$A_data = fgetcsv(self::$HO_Instance[$filename]->FilePointer, 0, $delmiter, $enclosure);
	//if($A_data === false){
	//@fclose(self::$HO_Instance[$filename]->FilePointer);
	//return false;
	//}
	//}　-->self::の原因、変換できない
	{
		return A_data;
	}

	__destruct() {}

};