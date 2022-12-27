//
//ファイル読み込みユーティリティ
//
//更新履歴：<br>
const fs = require('fs')
export default class MtFileUtil {
	static HO_Instance: { [x: string]: any; filename: MtFileUtil; };

	constructor() {}

	static singleton(filename: string) 
	{
		if(!this.HO_Instance[filename]){
		this.HO_Instance[filename] = new MtFileUtil();
		}
		return this.HO_Instance[filename];
	}

	static csvReadLine(filename: string, delmiter = ",", enclosure = "\"", escape = "\\")
	{
		if(!this.HO_Instance.filename){                                  
			this.HO_Instance[filename] = new MtFileUtil();
			this.HO_Instance[filename].FilePointer = fs.openSync(filename, "r");
		}


		if(this.HO_Instance[filename].FilePointer){
			// var A_data = fgetcsv(this.HO_Instance[filename].FilePointer, 0, delmiter, enclosure); 一旦コメンアウト
			var A_data;

			if(A_data === false){
				// fclose(this.HO_Instance[filename].FilePointer);　一旦コメンアウト
				return false;
			}
		}

		return A_data;
	}

};
