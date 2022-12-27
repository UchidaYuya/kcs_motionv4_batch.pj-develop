import MtDBUtil from './MtDBUtil';

export default class MtDateUtil {
	static O_Instance : MtDateUtil | undefined;

	static raise(msg: string) {
		throw new Error(msg);
	}

	constructor() //いまのところ何もしていない
	{}

	static singleton() {
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtDateUtil();
		}

		return this.O_Instance;
	}

	static getNow() //現状 MtDBUtil の中にある
	{
		var O_db = MtDBUtil.singleton();
		return O_db.getNow();
	}

	static getToday() //現状 MtDBUtil の中にある
	//内容は以下のものと同様
	//return date("Y-m-d");
	{
		var O_db = MtDBUtil.singleton();
		return O_db.getToday();
	}
};
