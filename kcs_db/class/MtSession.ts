//セッションの一括管理ユーティリティ


export default class MtSession {
	static O_Instance : MtSession | undefined;
	groupid: number | undefined;
	joker: any;
	memid!: string;
	postcode: any;
	personname: any;
	shopid!: string;
    pactid: any;
    postid: any;
    postname: any;
    userid: any;
    loginname: any;
    loginid: string | undefined;
    limit_time!: number;
    narikawari: undefined;
    level!: number;
	shop_limit_time!: number;
	admin_shopid: any;
	admin_memid: any;
	compname: any;
	current_postid: any;
	logo: any;
	manual: any;
	inq_mail: any;
	pacttype: any;
	helpfile: any;
	toppostname: any;
	copyright: any;
	su: any;
	language: any;
	name: any;
	docomo_only: boolean | undefined;
	admin_personname: any;
	admin_name_eng: any;
	admin_usertype: any;
	admin_logintype: any;
	admin_name: any;
	admin_groupid: any;
	constructor() {}
	
	static singleton() //インスタンスが既に生成されていない場合のみインスタンス生成
	{
		if (this.O_Instance == undefined) {
			this.O_Instance = new MtSession();
		}

		return this.O_Instance;
	}

	get(key:string) {

	}

	getSelf(key:any) {
	}

	getSelfAll() {
		
	}

	getPub(key:string) {
		
	}

	getPubAll() {
		
	}

	setGlobal(key:string, value: any) {
		
	}

	setSelf(key:string, value = undefined) {
		
	}

	setSelfAll(value = undefined) {
	}

	setPub(key:string, value = undefined) {
	}

	clearSessionAll() {
	}

	clearSessionMenu() //これは戻すべき？
	{
	}

	clearSessionSelf() {
	}

	clearSessionKeySelf(key:any) {
	}

	clearSessionExcludeKeySelf(key:string) {
	}

	clearSessionPub(key:string) {
	}

	clearSessionListPub(A_key:string[]) {
	}

	clearSessionExcludePub(key:string) {
	}

	clearSessionExcludeListPub(A_key:string[]) {
	}

	getSerialize() {
	}

};