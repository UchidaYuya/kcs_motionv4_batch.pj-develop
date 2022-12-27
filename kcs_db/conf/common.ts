// export interface global {}
// ユーザセッションの有効時間(単位：分)
global.G_sesslimit = 300;

// ショップセッションの有効時間(単位：分)
global.G_shop_sesslimit = 360;

// トレース 0:しない 、1:トレース、2:バックトレース
global.G_traceflg = 1;

// メール送信するか 0:しない、1:する
global.G_mailsend = 0;

// エラーメール送信するか 0:しない、1:する
global.G_err_mailsend = 1;

// エラーメール送信するか 0:しない、1:する
global.G_err_mailsend = 1;

// メール送信内容の保存 0:しない、1:する
global.G_mailsave = 1;

// ログフォーマットオプション
global.GH_logopt = { mode: 0600,timeFormat:"%Y/%m/%d %X"};

// 暗号化キー
global.kcsmotion_key = "kcsmotion";

