//
//管理情報用Model基底クラス
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//2010/02/19 宝子山浩平
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses ModelBase
//@uses MtAuthority
//@uses MtTableUtil
//@uses MtPostUtil
//@uses TreeAJAX
//@uses ListAJAX
//@uses ViewError
//@uses SmartCircuitModel
//
//
//
//管理情報用Model基底クラス
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/14
//@uses ModelBase
//@uses MtAuthority
//@uses MtTableUtil
//@uses MtPostUtil
//@uses TreeAJAX
//@uses ListAJAX
//@uses ViewError
//@uses SmartCircuitModel
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

require("model/SmartCircuitModel.php");

require("model/UserModel.php");

require("model/ManagementPropertyTbModel.php");

//
//ディレクトリ名
//
//
//管理種別ID
//
//VOLTA対応 s.maeda 2010/07/15
//ヘルスケア
//
//管理プルダウン初期値
//
//
//ダミー回線のキャリア回線種別
//
//
//予約モード
//
//
//テーブル名一覧取得
//
//@var mixed
//@access protected
//
//
//部署の絞込部分のSQL
//
//@var mixed
//@access protected
//
//
//管理情報共通の関数集オブジェクト
//
//@var mixed
//@access public
//
//
//権限オブジェクト
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//インサート用現在時刻
//
//@var mixed
//@access protected
//
//
//権限一覧
//
//@var mixed
//@access protected
//
//
//グローバルセッション
//
//@var mixed
//@access protected
//
//
//日付
//
//@var mixed
//@access protected
//
//
//内線番号モデル
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param MtSetting $O_Set0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//@uses AuthModel
//@uses PostModel
//
//
//権限一覧を取得する
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return array
//
//
//権限一覧のゲッター
//
//@author houshiyama
//@since 2008/03/19
//
//@access public
//@return void
//
//
//部署一覧取得（自部署のみか配下全てに対応）
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $postid
//@param mixed $trg
//@param mixed $tableno
//@access public
//@return void
//
//
//SQL中で使用するテーブルの名前を決める
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $cym
//@access public
//@return void
//
//
//電話一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/02/29
//
//@param string $tb
//@access protected
//@return void
//
//
//電話予約一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/02/29
//
//@param string $tb
//@access protected
//@return void
//
//
//Etc一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/02/29
//
//@access protected
//@return string
//
//
//購買一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/03/18
//
//@access protected
//@return string
//
//
//コピー機一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/03/18
//
//@access protected
//@return string
//
//
//資産一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return string
//
//
//運送一覧取得時のSQL文のFrom句生成
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return string
//
//
//EV ID一覧取得時のSQL文のFrom句生成
//
//@author maeda
//@since 2010/07/16
//
//@access protected
//@return string
//
//
//運送一覧取得時のSQL文のFrom句生成
//
//@author date
//@since 2015/06/04
//
//@access protected
//@return string
//
//
//部署の絞込み部分のSQL作成
//
//@author houshiyama
//@since 2008/02/27
//
//@param array $A_post
//@param mixed $tb
//@access protected
//@return string
//
//
//共通でwhere句に必要なSQL文生成
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $A_post
//@param mixed $tb
//@param mixed $trg
//@access protected
//@return strint
//
//
//管理記録テーブルのカラム取得
//
//@author houshiyama
//@since 2008/03/13
//
//@access public
//@return array
//
//
//部署名の取得
//
//@author houshiyama
//@since 2008/03/14
//
//@param mixed $postid
//@access public
//@return string
//
//
//配列に入ったsql文を実行する（更新用）
//
//@author houshiyama
//@since 2008/03/13
//
//@param mixed $A_sql
//@access public
//@return true,false
//
//
//電話移動用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/17
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//ETC移動用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/17
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//購買移動用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//コピー機移動用のsql文を作成する
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//資産移動用のsql文を作成する
//
//@author houshiyama
//@since 2008/08/20
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//運送移動用のsql文を作成する
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//EV ID移動用のsql文を作成する
//
//@author maeda
//@since 2010/07/28
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//ヘルスケア移動用のsql文を作成する
//
//@author date
//@since 2015/06/10
//
//@param mixed $postid
//@param array $H_row
//@param boolean $pre（前月分移動用）
//@access protected
//@return string
//
//
//電話移動時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//ETC移動時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//購買移動時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//コピー機移動時のlog用sql文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//資産移動時のlog用sql文作成
//
//@author houshiyama
//@since 2008/08/20
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//運送移動時のlog用sql文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//EV ID移動時のlog用sql文作成
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//ヘルスケア移動時のlog用sql文作成
//
//@author date
//@since 2015/06/10
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//電話削除時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/24
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//電話移動による予約削除log用sql文作成
//
//@author houshiyama
//@since 2008/08/13
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//ETC削除時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/24
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//購買削除時のlog用sql文作成
//
//@author houshiyama
//@since 2008/03/24
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//コピー機削除時のlog用sql文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//資産削除時のlog用sql文作成
//
//@author houshiyama
//@since 2008/08/20
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//運送削除時のlog用sql文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//電話削除用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_row
//@param mixed $pre
//@access protected
//@return string
//
//
//ETC削除用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_row
//@access protected
//@return string
//
//
//購買削除用のsql文を作成する
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_row
//@access protected
//@return string
//
//
//コピー機削除用のsql文を作成する
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $H_row
//@access protected
//@return string
//
//
//資産削除用のsql文を作成する
//
//@author houshiyama
//@since 2008/08/20
//
//@param array $H_row
//@access protected
//@return string
//
//
//運送削除用のsql文を作成する
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_row
//@access protected
//@return string
//
//
//EV ID削除用のsql文を作成する
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_row
//@access protected
//@return string
//
//
//EV ID削除時のlog用sql文作成
//
//@author maeda
//@since 2010/07/28
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//ヘルスケア削除用のsql文を作成する
//
//@author date
//@since 2015/06/09
//
//@param array $H_row
//@access protected
//@return string
//
//
//運送削除時のlog用sql文作成
//
//@author date
//@since 2015/06/09
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@access protected
//@return string
//
//
//電話、端末の紐付きを削除
//
//@author houshiyama
//@since 2008/08/26
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $assetsid
//@param mixed $pre
//@access protected
//@return void
//
//
//電話、端末の紐付きを削除
//
//@author houshiyama
//@since 2008/08/26
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//management_log_tbへのインサート文を作る
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $A_val
//@access public
//@return string
//
//
//登録時に必要なSQL文を作る <br>
//
//テーブル名決定 <br>
//削除済みに無いかチェック <br>
//SQL文作成 <br>
//前月に登録する時 <br>
//前月に無いかチェック <br>
//前月用SQL文作成 <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $H_sess
//@access public
//@return array
//
//
//変更時に必要なSQL文を作る <br>
//(update)
//
//テーブル名決定 <br>
//SQL文作成 <br>
//前月も変更する時 <br>
//前月用SQL文作成 <br>
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_sess
//@param mixed $cym
//access public
//@return array
//
//
//変更時に必要なSQL文を作る <br>
//(delete-insert) <br>
//
//@author houshiyama
//@since 2008/03/26
//
//@param array $H_sess
//@param mixed $cym
//@access public
//@return void
//
//
//電話一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/02/26
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//電話予約一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/08/06
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//関連電話一覧を取得するSQL文作成（関連電話の主要カラムも同時に取得）
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $telno
//@param mixed $carid
//@access protected
//@return string
//
//
//ETC一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/02/27
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//購買一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//コピー機一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//資産一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//運送一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//EV ID一覧を取得するSQL文作成
//
//@author maeda
//@since 2010/07/27
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//運送一覧を取得するSQL文作成
//
//@author date
//@since 2015/06/04
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return stringy
//
//
//電話一覧の件数を取得SQL文作成
//
//@author houshiyama
//@since 2008/02/29
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//Etc一覧の件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/02/29
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//購買一覧の件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//コピー機一覧の件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//資産一覧の件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/08/18
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//運送一覧の件数を取得するSQL文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//EV ID一覧の件数を取得するSQL文作成
//
//@author maeda
//@since 2010/07/16
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//運送一覧の件数を取得するSQL文作成
//
//@author date
//@since 2015/06/04
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//検索条件を結合する
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $A_where
//@param mixed $condition
//@access protected
//@return string
//
//
//請求閲覧者プルダウン用配列取得
//
//@author houshiyama
//@since 2008/03/28
//
//@access public
//@return void
//
//@param mixed $postid
//@param string $userid
//@access public
//@return void
//
//
//管理情報設定項目名取得
//
//@author houshiyama
//@since 2008/03/19
//
//@param mixed $mid
//@access public
//@return void
//
//
//getManagementProperty
//
//@author igarashi
//@since 2009/06/26
//
//@param mixed $mid
//@access public
//@return void
//
//
//getManagementProperty
//
//@author igarashi
//@since 2009/06/26
//
//@param mixed $mid
//@access public
//@return void
//
//
//ユーザ設定項目の値設定<br>
//postに含まれないものにnullを設定する
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $H_post
//@access protected
//@return array
//
//
//ツリー表示のための一連の処理をする
//
//部署テーブル名の決定
//Javascriptの生成
//部署名の取得
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $H_sess（CGIパラメータ）
//@param mixed $postid
//@access public
//@return array
//@uses PostLinkPost
//@uses TreeAJAX
//@uses ListAJAX
//
//
//新規登録用ツリー作成
//
//@author houshiyama
//@since 2008/03/10
//
//@access public
//@return array
//
//
//移動用ツリー作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_sess
//@param array $A_auth
//@access public
//@return void
//
//
//管理情報登録時のエラーチェック
//
//@author houshiyama
//@since 2008/08/01
//
//@param mixed $H_post
//@access public
//@return void
//
//
//移動時の権限チェック
//
//@author houshiyama
//@since 2008/03/24
//
//@param array $H_sess
//@param array $A_data
//@access public
//@return void
//
//
//update文のset句作成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $A_col
//@param mixed $A_val
//@access protected
//@return void
//
//
//電話のフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//ETCのフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//購買のフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//コピー機のフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return void
//
//
//電話のフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//運送のフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//EVのフリーワード検索に使うカラム配列を取得
//
//@author maeda
//@since 2010/07/29
//
//@access protected
//@return void
//
//
//ヘルスケアのフリーワード検索に使うカラム配列を取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//フリーワード検索に入力された値をスペースで区切り配列にする
//
//@author houshiyama
//@since 2008/04/03
//
//@param mixed $str
//@access protected
//@return void
//
//
//フリーワード入力時のwhere句作成
//
//@author houshiyama
//@since 2008/04/03
//
//@param mixed $A_col
//@param mixed $A_str
//@access protected
//@return void
//
//
//過去管理操作ログ時のメッセージ部分作成
//
//@author houshiyama
//@since 2008/05/02
//
//@param mixed $cym
//@access protected
//@return void
//
//
//過去管理操作ログ時のメッセージ部分作成
//
//@author houshiyama
//@since 2008/05/02
//
//@param mixed $cym
//@access protected
//@return void
//
//
//シリアライズのカラムに対するwhere句作成
//
//@author houshiyama
//@since 2008/07/16
//
//@param mixed $str
//@param mixed $cond
//@param mixed $col
//@access protected
//@return void
//
//
//端末種別一覧データ取得
//
//@author houshiyama
//@since 2008/08/05
//
//@access public
//@return array
//@uses PlanModel
//
//
//指定電話の予約一覧を取得
//
//@author houshiyama
//@since 2008/08/13
//
//@param mixed $telno
//@param mixed $carid
//@access public
//@return void
//
//
//指定電話の予約一覧を取得
//
//@author houshiyama
//@since 2008/08/13
//
//@param mixed $telno
//@param mixed $carid
//@access public
//@return void
//
//
//電話移動による予約移動log用sql文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_data
//@param array $H_post
//@param mixed $cym
//@param mixed $del
//@access protected
//@return string
//
//
//予約テーブルにその資産があるかチェック
//
//@author houshiyama
//@since 2008/08/23
//
//@param mixed $assetsid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//資産予約テーブルから削除（予約なので削除フラグではなく削除）
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $assetsid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//紐付きテーブルにその資産があるかチェック（資産IDで取得）
//
//@author houshiyama
//@since 2008/08/23
//
//@param mixed $assetsid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//紐付き予約テーブルにその資産があるかチェック（資産IDで取得）
//
//@author houshiyama
//@since 2008/08/23
//
//@param mixed $assetsid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//指定電話の電話端末関連予約一覧を取得
//
//@author houshiyama
//@since 2008/08/13
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//指定電話の電話端末関連予約一覧を取得
//
//@author houshiyama
//@since 2008/08/13
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//端末紐付け予約削除SQL文作成
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//電話紐付け予約削除SQL文作成
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//指定した電話に紐付いている端末ID一覧取得
//
//@author houshiyama
//@since 2008/08/12
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access public
//@return void
//
//
//指定した端末の端末予約一覧を取得
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $assetsid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//電話予約削除SQL文作成
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//登録による予約削除log作成
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@param mixed $str
//@param mixed $mode
//@access public
//@return void
//
//
//登録による予約削除log作成
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@param mixed $str
//@param mixed $mode
//@access public
//@return void
//
//
//assets_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $assetsid
//@param mixed $delflg
//@access protected
//@return void
//
//
//関連電話予約一覧取得
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//関連電話一覧取得
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//関連電話の関連テーブルから削除するSQL文作成
//
//@author houshiyama
//@since 2008/08/29
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $rel_telno
//@param mixed $rel_carid
//@access public
//@return void
//
//
//電話と端末のリレーションテーブルへのインサート文を作成する
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $H_post
//@param mixed $assetsid
//@access public
//@return void
//
//
//予約を削除する一連の処理
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $A_reserve
//@param mixed $mess1
//@param mixed $mess1_eng
//@param mixed $mess2
//@param mixed $date
//@access protected
//@return void
//
//
//按分用テーブル（change_post_tb）へのインサート文作成
//
//@author houshiyama
//@since 2008/08/12
//
//@param mixed $H_data
//@param mixed $H_post
//@param mixed $movedate
//@access protected
//@return void
//
//
//按分用カラム（tel_tbのdelteldate）のupdate文作成
//
//@author houshiyama
//@since 2009/08/27
//
//@param mixed $H_data
//@param mixed $deldate
//@access protected
//@return void
//
//
//現在の電話番号以外で使用されている端末か調べる
//
//@author houshiyama
//@since 2008/07/29
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $assetsid
//@param mixed $pre
//@access public
//@return void
//
//
//ダミー電話番号生成
//
//@author houshiyama
//@since 2008/07/29
//
//@access public
//@return void
//
//
//電話のインサート文作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@param mixed $telno
//@param mixed $pre
//@access public
//@return void
//
//
//更新に使うカラム決定(tel)
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $type
//@access protected
//@return $A_col
//
//
//ダミー電話番号を作成
//
//@author houshiyama
//@since 2008/07/29
//
//@param mixed $postid
//@access public
//@return void
//
//
//削除不可能なレコードがあればfalse（削除画面用） <br>
//
//@author houshiyama
//@since 2011/03/10
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//ExtensionTelModel取得
//
//@author houshiyama
//@since 2011/10/07
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementModelBase extends ModelBase {
	static PUB = "/Management";
	static TELMID = 1;
	static ETCMID = 2;
	static PURCHMID = 3;
	static COPYMID = 4;
	static ASSMID = 5;
	static TRANMID = 6;
	static EVMID = 7;
	static HEALTHMID = 8;
	static SELECT_TOP = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	static SELECT_TOP_ENG = "--Please select--";
	static DUMMY_TEL_CARID = 10;
	static DUMMY_TEL_ARID = 32;
	static DUMMY_TEL_CIRID = 23;
	static ADDMODE = 0;
	static MODMODE = 1;
	static MOVEMODE = 2;
	static DELMODE = 3;

	constructor(O_db0, H_g_sess: {} | any[], O_manage) //shop側では使用しない
	{
		super(O_db0);
		this.H_G_Sess = H_g_sess;

		if (undefined !== this.H_G_Sess.pactid == true) {
			this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		}

		this.O_Post = new PostModel();
		this.O_Manage = O_manage;
		this.NowTime = this.get_DB().getNow();
		this.O_Set = MtSetting.singleton();
		this.setAllAuthIni();
		this.Now = this.getDateUtil().getNow();
		this.Today = this.getDateUtil().getToday();
		this.A_Time = split("-| |:", this.Now);
		this.YM = this.A_Time[0] + this.A_Time[1];
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	getPostidList(postid, trg, tableno = "") //指定が無ければセット中のテーブル番号使用
	{
		if ("" == tableno) {
			if (undefined !== this.H_Tb.tableno == true && is_numeric(this.H_Tb.tableno) == true) {
				tableno = this.H_Tb.tableno;
			}
		}

		if (1 == trg) {
			var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, tableno);
		} else {
			A_post = [postid];
		}

		return A_post;
	}

	setTableName(cym) //現在
	//前月テーブル
	//$this->H_Tb["pre_healthcare_details_tb"] = "healthcare_details_" . $this->H_Tb["pretableno"] . "_tb";
	//電話予約系
	{
		var O_table = new MtTableUtil();

		if (this.YM == cym) {
			this.H_Tb.tableno = "";
			this.H_Tb.tel_tb = "tel_tb";
			this.H_Tb.post_tb = "post_tb";
			this.H_Tb.post_relation_tb = "post_relation_tb";
			this.H_Tb.card_tb = "card_tb";
			this.H_Tb.purchase_tb = "purchase_tb";
			this.H_Tb.copy_tb = "copy_tb";
			this.H_Tb.assets_tb = "assets_tb";
			this.H_Tb.transit_tb = "transit_tb";
			this.H_Tb.ev_tb = "ev_tb";
			this.H_Tb.healthcare_tb = "healthcare_tb";
			this.H_Tb.tel_rel_assets_tb = "tel_rel_assets_tb";
			this.H_Tb.tel_rel_tel_tb = "tel_rel_tel_tb";
		} else //対象テーブル番号の取得
			//対象テーブル名
			//$this->H_Tb["healthcare_details_tb"] = "healthcare_details_" . $this->H_Tb["tableno"] . "_tb";
			{
				this.H_Tb.tableno = O_table.getTableNo(cym, true);
				this.H_Tb.tel_tb = "tel_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.post_tb = "post_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.post_relation_tb = "post_relation_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_tb = "card_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_tb = "purchase_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_tb = "copy_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.assets_tb = "assets_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.transit_tb = "transit_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.ev_tb = "ev_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.healthcare_tb = "healthcare_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_rel_assets_tb = "tel_rel_assets_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_rel_tel_tb = "tel_rel_tel_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.tel_details_tb = "tel_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.card_details_tb = "card_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.purchase_details_tb = "purchase_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.copy_details_tb = "copy_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.transit_details_tb = "transit_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.ev_details_tb = "ev_details_" + this.H_Tb.tableno + "_tb";
				this.H_Tb.healthcare_rechistory_tb = "healthcare_rechistory_" + this.H_Tb.tableno + "_tb";
			}

		this.H_Tb.pretableno = O_table.getTableNo(this.YM, false);
		this.H_Tb.pre_tel_tb = "tel_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_post_tb = "post_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_post_relation_tb = "post_relation_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_card_tb = "card_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_purchase_tb = "purchase_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_copy_tb = "copy_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_assets_tb = "assets_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_transit_tb = "transit_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_ev_tb = "ev_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_healthcare_tb = "healthcare_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_ev_tb = "ev_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_tel_rel_assets_tb = "tel_rel_assets_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_tel_rel_tel_tb = "tel_rel_tel_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_tel_details_tb = "tel_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_card_details_tb = "card_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_purchase_details_tb = "purchase_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_copy_details_tb = "copy_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_transit_details_tb = "transit_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_ev_details_tb = "ev_details_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.pre_healthcare_rechistory_tb = "healthcare_rechistory_" + this.H_Tb.pretableno + "_tb";
		this.H_Tb.tel_reserve_tb = "tel_reserve_tb";
		this.H_Tb.assets_reserve_tb = "assets_reserve_tb";
		this.H_Tb.tel_rel_assets_reserve_tb = "tel_rel_assets_reserve_tb";
		this.H_Tb.tel_rel_tel_reserve_tb = "tel_rel_tel_reserve_tb";
	}

	makeTelFromSQL(tb = "now", ass_flg = "all") //fjp用
	//機種名を最新のものを表示して欲しいと言われました #53
	{
		if ("reserve" === tb) {
			var tel_tb = this.H_Tb.tel_reserve_tb;
			var tel_rel_assets_tb = this.H_Tb.tel_rel_assets_reserve_tb;
			var assets_tb = this.H_Tb.assets_reserve_tb;
		} else if ("pre" === tb) {
			tel_tb = this.H_Tb.pre_tel_tb;
			tel_rel_assets_tb = this.H_Tb.pre_tel_rel_assets_tb;
			assets_tb = this.H_Tb.pre_assets_tb;
		} else {
			tel_tb = this.H_Tb.tel_tb;
			tel_rel_assets_tb = this.H_Tb.tel_rel_assets_tb;
			assets_tb = this.H_Tb.assets_tb;
		}

		var sql = tel_tb + " as te " + " left outer join " + this.H_Tb.post_tb + " on te.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join carrier_tb on te.carid=carrier_tb.carid " + " left outer join circuit_tb on te.cirid=circuit_tb.cirid " + " left outer join buyselect_tb on te.buyselid=buyselect_tb.buyselid " + " left outer join plan_tb on te.planid=plan_tb.planid " + " left outer join packet_tb on te.packetid=packet_tb.packetid " + " left outer join point_tb on te.pointstage=point_tb.pointid " + " left outer join area_tb on te.arid=area_tb.arid " + " left outer join user_tb as us on te.userid = us.userid " + " left outer join kousi_pattern_tb as kp on te.kousiptn = kp.patternid " + " left outer join " + tel_rel_assets_tb + " as tra on te.pactid = tra.pactid and te.telno = tra.telno and te.carid = tra.carid ";

		if (ass_flg == "main") {
			sql += " and tra.main_flg=true ";
		}

		sql += " left outer join " + assets_tb + " as ass on tra.assetsid = ass.assetsid and ass.delete_flg=false " + " left outer join carrier_tb as asscar on ass.search_carid=asscar.carid " + " left outer join circuit_tb as asscir on ass.search_cirid=asscir.cirid " + " left outer join smart_circuit_tb on ass.smpcirid = smart_circuit_tb.smpcirid " + " left outer join assets_type_tb as att1 on ass.assetstypeid = att1.assetstypeid and ass.pactid = att1.pactid " + " left outer join assets_type_tb as att2 on ass.assetstypeid = att2.assetstypeid and att2.pactid = 0 ";
		sql += " left outer join " + this.H_Tb.post_tb + " as pbpo on te.pbpostcode_first = pbpo.userpostid and te.pactid = pbpo.pactid ";
		sql += " left outer join " + this.H_Tb.post_tb + " as cfbpo on te.cfbpostcode_first = cfbpo.userpostid and te.pactid = cfbpo.pactid ";
		sql += " left outer join user_tb as recogu on te.recogcode = recogu.employeecode and te.pactid = recogu.pactid ";
		sql += " left outer join product_tb as prd on prd.productid = ass.productid ";
		return sql;
	}

	makeTelReserveFromSQL() //fjp用
	//機種名を最新のものを表示して欲しいと言われました #53
	{
		var sql = this.H_Tb.tel_reserve_tb + " as te " + " left outer join post_tb on te.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join carrier_tb on te.carid=carrier_tb.carid " + " left outer join circuit_tb on te.cirid=circuit_tb.cirid " + " left outer join buyselect_tb on te.buyselid=buyselect_tb.buyselid " + " left outer join plan_tb on te.planid=plan_tb.planid " + " left outer join packet_tb on te.packetid=packet_tb.packetid " + " left outer join point_tb on te.pointstage=point_tb.pointid " + " left outer join area_tb on te.arid=area_tb.arid " + " left outer join user_tb as us on te.userid = us.userid " + " left outer join kousi_pattern_tb as kp on te.kousiptn = kp.patternid " + " left outer join " + this.H_Tb.tel_rel_assets_reserve_tb + " as tra on te.pactid = tra.pactid " + " and te.telno = tra.telno and te.carid = tra.carid " + " and te.add_edit_flg = tra.add_edit_flg and te.reserve_date = tra.reserve_date and tra.main_flg=true " + " left outer join " + this.H_Tb.assets_reserve_tb + " as ass on tra.assetsid = ass.assetsid " + " and te.reserve_date = ass.reserve_date and te.add_edit_flg = ass.add_edit_flg " + " and ass.delete_flg=false " + " left outer join carrier_tb as asscar on ass.search_carid=asscar.carid " + " left outer join circuit_tb as asscir on ass.search_cirid=asscir.cirid " + " left outer join post_tb as exe_po on te.exe_postid = exe_po.postid " + " left outer join user_tb as exe_us on te.exe_userid = exe_us.userid " + " left outer join smart_circuit_tb on ass.smpcirid = smart_circuit_tb.smpcirid " + " left outer join assets_type_tb as att1 on ass.assetstypeid = att1.assetstypeid and ass.pactid = att1.pactid " + " left outer join assets_type_tb as att2 on ass.assetstypeid = att2.assetstypeid and att2.pactid = 0 ";
		sql += " left outer join post_tb as pbpo on te.pbpostcode_first = pbpo.userpostid and te.pactid = pbpo.pactid ";
		sql += " left outer join post_tb as cfbpo on te.cfbpostcode_first = cfbpo.userpostid and te.pactid = cfbpo.pactid ";
		sql += " left outer join user_tb as recogu on te.recogcode = recogu.employeecode and te.pactid = recogu.pactid ";
		sql += " left outer join product_tb as prd on prd.productid = ass.productid ";
		return sql;
	}

	makeEtcFromSQL() {
		var sql = this.H_Tb.card_tb + " as ca " + " left outer join " + this.H_Tb.post_tb + " on ca.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join card_co_tb on ca.cardcoid=card_co_tb.cardcoid " + " left outer join user_tb as us on ca.userid = us.userid ";
		return sql;
	}

	makePurchFromSQL() {
		var sql = this.H_Tb.purchase_tb + " as pu " + " left outer join " + this.H_Tb.post_tb + " on pu.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join purchase_co_tb on pu.purchcoid=purchase_co_tb.purchcoid ";
		return sql;
	}

	makeCopyFromSQL() {
		var sql = this.H_Tb.copy_tb + " as co " + " left outer join " + this.H_Tb.post_tb + " on co.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join copy_co_tb on co.copycoid=copy_co_tb.copycoid ";
		return sql;
	}

	makeAssetsFromSQL() {
		var sql = this.H_Tb.assets_tb + " as ass " + " left outer join " + this.H_Tb.post_tb + " on ass.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join assets_type_tb as att1 on ass.assetstypeid=att1.assetstypeid " + " and ass.pactid=att1.pactid " + " left outer join assets_type_tb as att2 on ass.assetstypeid=att2.assetstypeid " + " and att2.pactid=0 " + " left outer join carrier_tb on ass.search_carid=carrier_tb.carid " + " left outer join circuit_tb on ass.search_cirid=circuit_tb.cirid " + " left outer join product_tb on ass.productid=product_tb.productid " + " left outer join smart_circuit_tb on ass.smpcirid=smart_circuit_tb.smpcirid ";
		return sql;
	}

	makeTranFromSQL() {
		var sql = this.H_Tb.transit_tb + " as tr " + " left outer join " + this.H_Tb.post_tb + " on tr.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join transit_co_tb on tr.trancoid=transit_co_tb.trancoid ";
		return sql;
	}

	makeEvFromSQL() {
		var sql = this.H_Tb.ev_tb + " as ev " + " left outer join " + this.H_Tb.post_tb + " on ev.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join ev_co_tb on ev.evcoid=ev_co_tb.evcoid ";
		return sql;
	}

	makeHealthFromSQL() {
		var sql = this.H_Tb.healthcare_tb + " as hlt " + " left outer join " + this.H_Tb.post_tb + " on hlt.postid=" + this.H_Tb.post_tb + ".postid " + " left outer join healthcare_co_tb on hlt.healthcoid=healthcare_co_tb.healthcoid ";
		return sql;
	}

	makePostWhereSQL(A_post, tb) //部署一覧が空
	{
		if (A_post.length < 1) {
			this.errorOut(19, "\u90E8\u7F72\u4E00\u89A7\u304C\u7121\u3044", false);
		}

		if (A_post.length == 1) {
			var sql = tb + ".postid=" + A_post[0];
		} else {
			sql = tb + ".postid in (" + A_post.join(",") + ") ";
		}

		return sql;
	}

	makeCommonWhereSQL(A_post, tb) {
		var A_sql = Array();
		A_sql.push(tb + ".pactid=" + this.H_G_Sess.pactid);
		A_sql.push(this.makePostWhereSQL(A_post, tb));
		var sql = A_sql.join(" and ");
		return sql;
	}

	getLogTbCols() {
		var A_col = ["mid", "pactid", "postid", "userid", "username", "manageno", "manageno_view", "coid", "comment", "comment_eng", "trg_postid", "trg_postid_aft", "trg_postname", "trg_postname_aft", "joker_flag", "type", "recdate"];
		return A_col;
	}

	getPostName(postid) {
		var postname = this.O_Post.getPostNameOne(postid, this.H_Tb.post_tb);
		return postname;
	}

	execDB(A_sql) //トランザクションの開始
	//更新ＳＱＬ実行
	{
		var cnt = 0;
		this.get_DB().beginTransaction();

		for (var sql of Object.values(A_sql)) //if( $tmpcnt != 1 ){
		//				echo ($sql) . "<br>" . $tmpcnt;
		//			}
		{
			var tmpcnt = this.get_DB().exec(sql);
			cnt += tmpcnt;
		}

		if (A_sql.length == cnt) {
			this.get_DB().commit();
			return true;
		} else {
			this.get_DB().rollback();
			return false;
		}
	}

	makeTelMoveSQL(postid, H_row: {} | any[], pre = false, type = "now") {
		if ("reserve" === type) {
			var tel_tb = this.H_Tb.tel_reserve_tb;
		} else {
			if (pre == true) {
				tel_tb = this.H_Tb.pre_tel_tb;
			} else {
				tel_tb = this.H_Tb.tel_tb;
			}
		}

		var sql = "update " + tel_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(H_row.telno, "text", true) + " and carid=" + this.get_DB().dbQuote(H_row.carid, "integer", true);

		if ("reserve" === type) {
			sql += " and " + " add_edit_flg=" + this.get_DB().dbQuote(H_row.add_edit_flg, "integer", true) + " and " + " reserve_date=" + this.get_DB().dbQuote(H_row.reserve_date, "timestamp", true) + " and exe_state=0";
		}

		return sql;
	}

	makeEtcMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var card_tb = this.H_Tb.pre_card_tb;
		} else {
			card_tb = this.H_Tb.card_tb;
		}

		var sql = "update " + card_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and cardno=" + this.get_DB().dbQuote(H_row.cardno, "text", true);
		return sql;
	}

	makePurchMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var purchase_tb = this.H_Tb.pre_purchase_tb;
		} else {
			purchase_tb = this.H_Tb.purchase_tb;
		}

		var sql = "update " + purchase_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and purchid=" + this.get_DB().dbQuote(H_row.purchid, "text", true) + " and purchcoid=" + this.get_DB().dbQuote(H_row.purchcoid, "integer", true);
		return sql;
	}

	makeCopyMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var copy_tb = this.H_Tb.pre_copy_tb;
		} else {
			copy_tb = this.H_Tb.copy_tb;
		}

		var sql = "update " + copy_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and copyid=" + this.get_DB().dbQuote(H_row.copyid, "text", true) + " and copycoid=" + this.get_DB().dbQuote(H_row.copycoid, "integer", true);
		return sql;
	}

	makeAssetsMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var assets_tb = this.H_Tb.pre_assets_tb;
		} else {
			assets_tb = this.H_Tb.assets_tb;
		}

		var sql = "update " + assets_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(H_row.assetsid, "text", true);
		return sql;
	}

	makeTranMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var transit_tb = this.H_Tb.pre_transit_tb;
		} else {
			transit_tb = this.H_Tb.transit_tb;
		}

		var sql = "update " + transit_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and tranid=" + this.get_DB().dbQuote(H_row.tranid, "text", true) + " and trancoid=" + this.get_DB().dbQuote(H_row.trancoid, "integer", true);
		return sql;
	}

	makeEvMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var ev_tb = this.H_Tb.pre_ev_tb;
		} else {
			ev_tb = this.H_Tb.ev_tb;
		}

		var sql = "update " + ev_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and evid=" + this.get_DB().dbQuote(H_row.evid, "text", true) + " and evcoid=" + this.get_DB().dbQuote(H_row.evcoid, "integer", true);
		return sql;
	}

	makeHealthcareMoveSQL(postid, H_row: {} | any[], pre = false) {
		if (pre == true) {
			var healthcare_tb = this.H_Tb.pre_healthcare_tb;
		} else {
			healthcare_tb = this.H_Tb.healthcare_tb;
		}

		var sql = "update " + healthcare_tb + " set postid=" + this.get_DB().dbQuote(postid, "integer", true) + ",fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and healthid=" + this.get_DB().dbQuote(H_row.healthid, "text", true) + " and healthcoid=" + this.get_DB().dbQuote(H_row.healthcoid, "integer", true);
		return sql;
	}

	makeTelMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //移動日
	//過去管理用メッセージ
	{
		if (undefined !== H_post.movedate == true) {
			if (Array.isArray(H_post.movedate) == true) {
				var movedate_view = H_post.movedate.Y + "\u5E74" + str_pad(H_post.movedate.m, 2, "0", STR_PAD_LEFT) + "\u6708" + str_pad(H_post.movedate.d, 2, "0", STR_PAD_LEFT) + "\u65E5";
				var movedate_view_eng = H_post.movedate.Y + "-" + str_pad(H_post.movedate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_post.movedate.d, 2, "0", STR_PAD_LEFT);
			} else {
				movedate_view = H_post.movedate.substr(0, 4) + "\u5E74" + H_post.movedate.substr(5, 2) + "\u6708" + H_post.movedate.substr(8, 2) + "\u65E5";
				movedate_view_eng = H_post.movedate.substr(0, 4) + "-" + H_post.movedate.substr(5, 2) + "-" + H_post.movedate.substr(8, 2);
			}
		} else {
			movedate_view = cym.substr(0, 4) + "\u5E74" + cym.substr(4, 2) + "\u67081\u65E5";
			movedate_view_eng = cym.substr(0, 4) + "-" + cym.substr(4, 2) + "-1";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, "\u96FB\u8A71\u79FB\u52D5" + str + "\uFF08" + movedate_view + "\uFF09", "Phone shift " + str_eng + "\uFF08" + movedate_view_eng + "\uFF09", H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeEtcMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.ETCMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.cardno, H_data.cardno_view, H_data.cardcoid, "\u30AB\u30FC\u30C9\u79FB\u52D5" + str + pastflg_view, "Card shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makePurchMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.PURCHMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.purchid, H_data.purchid, H_data.purchcoid, "\u8CFC\u8CB7ID\u79FB\u52D5" + str + pastflg_view, "Purchase ID shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeCopyMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.COPYMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.copyid, H_data.copyid, H_data.copycoid, "\u30B3\u30D4\u30FC\u6A5F\u79FB\u52D5" + str + pastflg_view, "Copy machine shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeAssetsMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.ASSMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.assetsno, H_data.assetsno, H_data.assetstypeid, "\u8CC7\u7523\u79FB\u52D5" + str + pastflg_view, "Shift property " + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeTranMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.TRANMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.tranid, H_data.tranid, H_data.trancoid, "\u904B\u9001ID\u79FB\u52D5" + str + pastflg_view, "Transit ID shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeEvMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.EVMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.evid, H_data.evid, H_data.evcoid, "EV ID\u79FB\u52D5" + str + pastflg_view, "EV ID shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeHealthMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.HEALTHMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.healthid, H_data.healthid, H_data.healthcoid, "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u79FB\u52D5" + str + pastflg_view, "Healthcare ID shift" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeTelDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //削除日
	//過去管理用メッセージ
	{
		if (undefined !== H_post.deldate == true) {
			if (Array.isArray(H_post.deldate) == true) {
				var deldate_view = H_post.deldate.Y + "\u5E74" + str_pad(H_post.deldate.m, 2, "0", STR_PAD_LEFT) + "\u6708" + str_pad(H_post.deldate.d, 2, "0", STR_PAD_LEFT) + "\u65E5";
				var deldate_view_eng = H_post.deldate.Y + "-" + str_pad(H_post.deldate.m, 2, "0", STR_PAD_LEFT) + "-" + str_pad(H_post.deldate.d, 2, "0", STR_PAD_LEFT);
			} else {
				deldate_view = H_post.deldate.substr(0, 4) + "\u5E74" + H_post.deldate.substr(5, 2) + "\u6708" + H_post.deldate.substr(8, 2) + "\u65E5";
				deldate_view_eng = H_post.deldate.substr(0, 4) + "-" + H_post.deldate.substr(5, 2) + "-" + H_post.deldate.substr(8, 2);
			}
		} else {
			deldate_view = cym.substr(0, 4) + "\u5E74" + cym.substr(4, 2) + "\u67081\u65E5";
			deldate_view_eng = cym.substr(0, 4) + "-" + cym.substr(4, 2) + "-1";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, "\u96FB\u8A71\u524A\u9664" + str + "\uFF08" + deldate_view + "\uFF09", "Phone deletion " + str_eng + "\uFF08" + deldate_view_eng + "\uFF09", H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeTelReserveDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym, mess = "\u96FB\u8A71\u524A\u9664\u306B\u3088\u308B") {
		var reservedate_view = H_data.reserve_date.substr(0, 4) + "\u5E74" + H_data.reserve_date.substr(5, 2) + "\u6708" + H_data.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_data.reserve_date.substr(0, 4) + "-" + H_data.reserve_date.substr(5, 2) + "-" + H_data.reserve_date.substr(8, 2);
		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, mess + "\u4E88\u7D04\u524A\u9664\uFF08" + reservedate_view + "\uFF09", "Deletion of reservation\uFF08" + reservedate_view_eng + "\uFF09", H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeEtcDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.ETCMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.cardno, H_data.cardno_view, H_data.cardcoid, "\u30AB\u30FC\u30C9\u524A\u9664" + str + pastflg_view, "Card deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makePurchDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.PURCHMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.purchid, H_data.purchid, H_data.purchcoid, "\u8CFC\u8CB7ID\u524A\u9664" + str + pastflg_view, "Purchase ID deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeCopyDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";
		var pastflg_view_eng = "\uFF08Movement last month\uFF09";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.COPYMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.copyid, H_data.copyid, H_data.copycoid, "\u30B3\u30D4\u30FC\u6A5F\u524A\u9664" + str + pastflg_view, "Copy machine deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeAssetsDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.ASSMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.assetsno, H_data.assetsno, H_data.assetstypeid, "\u8CC7\u7523\u524A\u9664" + str + pastflg_view, "Delete property " + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeTranDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.TRANMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.tranid, H_data.tranid, H_data.trancoid, "\u904B\u9001ID\u524A\u9664" + str + pastflg_view, "Transit ID deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeTelDelSQL(H_row: {} | any[], pre = false, type = "now") {
		if ("reserve" === type) {
			var tb = this.H_Tb.tel_reserve_tb;
		} else {
			if (pre == true) {
				tb = this.H_Tb.pre_tel_tb;
			} else {
				tb = this.H_Tb.tel_tb;
			}
		}

		var sql = "delete from " + tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and telno=" + this.get_DB().dbQuote(H_row.telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(H_row.carid, "integer", true, "carid");

		if ("reserve" === type) {
			sql += " and exe_state=0" + " and add_edit_flg=" + this.get_DB().dbQuote(H_row.add_edit_flg, "integer", true, "add_edit_flg") + " and reserve_date=" + this.get_DB().dbQuote(H_row.reserve_date, "timestamp", true, "reserve_date");
		}

		return sql;
	}

	makeEtcDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.card_tb + " set delete_flg=true " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and cardno=" + this.get_DB().dbQuote(H_row.cardno, "text", true, "cardno");
		return sql;
	}

	makePurchDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.purchase_tb + " set delete_flg=true " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and purchid=" + this.get_DB().dbQuote(H_row.purchid, "text", true, "purchid") + " and purchcoid=" + this.get_DB().dbQuote(H_row.purchcoid, "integer", true, "purchcoid");
		return sql;
	}

	makeCopyDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.copy_tb + " set delete_flg=true " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and copyid=" + this.get_DB().dbQuote(H_row.copyid, "text", true, "copyid") + " and copycoid=" + this.get_DB().dbQuote(H_row.copycoid, "integer", true, "copycoid");
		return sql;
	}

	makeAssetsDelSQL(H_row: {} | any[]) {
		var sql = "delete from " + this.H_Tb.assets_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and assetsid=" + this.get_DB().dbQuote(H_row.assetsid, "text", true, "assetsid");
		return sql;
	}

	makeTranDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.transit_tb + " set delete_flg=true " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and tranid=" + this.get_DB().dbQuote(H_row.tranid, "text", true, "tranid") + " and trancoid=" + this.get_DB().dbQuote(H_row.trancoid, "integer", true, "trancoid");
		return sql;
	}

	makeEvDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.ev_tb + " set delete_flg=true," + " fixdate=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + "," + " delete_date=" + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and evid=" + this.get_DB().dbQuote(H_row.evid, "text", true, "evid") + " and evcoid=" + this.get_DB().dbQuote(H_row.evcoid, "integer", true, "evcoid");
		return sql;
	}

	makeEvDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u524A\u9664\uFF09";
			var pastflg_view_eng = "\uFF08Deletion last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.EVMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.evid, H_data.evid, H_data.evcoid, "EV ID\u524A\u9664" + str + pastflg_view, "EV ID deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeHealthDelSQL(H_row: {} | any[]) {
		var sql = "update " + this.H_Tb.healthcare_tb + " set delete_flg=true " + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and postid=" + this.get_DB().dbQuote(H_row.postid, "integer", true, "postid") + " and healthid=" + this.get_DB().dbQuote(H_row.healthid, "text", true, "healthid") + " and healthcoid=" + this.get_DB().dbQuote(H_row.healthcoid, "integer", true, "healthcoid");
		return sql;
	}

	makeHealthDelLogSQL(H_data: {} | any[], H_post: {} | any[], cym) //前月分フラグ
	{
		var pastflg_view = "";

		if (undefined !== H_post.pastflg == true && 1 == H_post.pastflg) {
			pastflg_view = "\uFF08\u524D\u6708\u5206\u3082\u79FB\u52D5\uFF09";
			var pastflg_view_eng = "\uFF08Movement last month\uFF09";
		}

		var str = this.makePastLogStr(cym);
		var str_eng = this.makePastLogStrEng(cym);
		var A_val = [ManagementModelBase.HEALTHMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.healthid, H_data.healthid, H_data.healthcoid, "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u524A\u9664" + str + pastflg_view, "Healthcare ID deletion" + str_eng + pastflg_view_eng, H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u524A\u9664", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeDelTelRelAssetsSQL(telno, carid, assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "delete from " + tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid");
		return sql;
	}

	makeDelTelRelAssetsByAssetsidSQL(assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "delete from " + tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true);
		return sql;
	}

	makeInsertLogSQL(A_val) //jokerフラグが無い時
	{
		if (A_val[14] == undefined) {
			A_val[14] = 0;
		}

		var sql = "insert into management_log_tb (" + this.getLogTbCols().join(",") + ") values (" + this.get_DB().dbQuote(A_val[0], "integer", true, "mid") + "," + this.get_DB().dbQuote(A_val[1], "integer", true, "pactid") + "," + this.get_DB().dbQuote(A_val[2], "integer", true, "postid") + "," + this.get_DB().dbQuote(A_val[3], "integer", true, "userid") + "," + this.get_DB().dbQuote(A_val[4], "text", true, "username") + "," + this.get_DB().dbQuote(A_val[5], "text", true, "manageno") + "," + this.get_DB().dbQuote(A_val[6], "text", true, "manageno_view") + "," + this.get_DB().dbQuote(A_val[7], "integer", false, "coid") + "," + this.get_DB().dbQuote(A_val[8], "text", true, "comment") + "," + this.get_DB().dbQuote(A_val[9], "text", true, "comment_eng") + "," + this.get_DB().dbQuote(A_val[10], "integer", true, "trg_postid") + "," + this.get_DB().dbQuote(A_val[11], "integer", false, "trg_postid_aft") + "," + this.get_DB().dbQuote(A_val[12], "text", true, "trg_postname") + "," + this.get_DB().dbQuote(A_val[13], "text", false, "trg_postname_aft") + "," + this.get_DB().dbQuote(A_val[14], "integer", true, "joker_flg") + "," + this.get_DB().dbQuote(A_val[15], "text", true, "type") + "," + this.get_DB().dbQuote(A_val[16], "timestamp", true, "recdate") + ")";
		return sql;
	}

	makeAddSQL(H_sess: {} | any[]) //現在に既に削除フラグが立った同一キーがあるかチェック
	//過去にも登録する時
	{
		var A_sql = Array();
		this.setTableName(this.YM);

		if (this.checkDeleteExist(H_sess.SELF.post) == true) {
			A_sql.push(this.makeDelManageSQL(H_sess.SELF.post));
		}

		A_sql.push(this.makeAddManageSQL(H_sess.SELF.post));

		if (this.O_Set.manage_clamp_date > this.A_Time[2]) //前月に無ければ前月にも登録（前月に部署がある）
			{
				if (this.checkPastExist(H_sess.SELF.post) == false && this.O_Post.checkPostExist(H_sess.SELF.post.recogpostid, this.H_Tb.pre_post_tb) == true) //前月に既に削除フラグが立った同一キーがあるかチェック
					{
						if (this.checkDeleteExist(H_sess.SELF.post, true) == true) {
							A_sql.push(this.makeDelManageSQL(H_sess.SELF.post, true));
						}

						A_sql.push(this.makeAddManageSQL(H_sess.SELF.post, true));
					}
			}

		A_sql.push(this.makeAddLogSQL(H_sess.SELF.post));
		return A_sql;
	}

	makeModSQL(H_sess: {} | any[]) //前月も変更する時
	{
		var A_sql = Array();
		this.setTableName(H_sess[ManagementModelBase.PUB].cym);
		A_sql.push(this.makeModManageSQL(H_sess));

		if (undefined !== H_sess.SELF.post.pastflg == true && H_sess.SELF.post.pastflg == 1) {
			A_sql.push(this.makeModManageSQL(H_sess, true));
		}

		A_sql.push(this.makeModLogSQL(H_sess.SELF.post, H_sess[ManagementModelBase.PUB].cym));
		return A_sql;
	}

	makeDelInsertSQL(H_sess: {} | any[]) //既に削除フラグが立った同一キーがあるかチェック
	//前月も変更する時
	{
		var A_sql = Array();
		this.setTableName(H_sess[ManagementModelBase.PUB].cym);
		A_sql.push(this.makeDelPreManageSQL(H_sess.SELF.post));

		if (this.checkDeleteExist(H_sess.SELF.post) == true) {
			A_sql.push(this.makeDelManageSQL(H_sess.SELF.post));
		}

		A_sql.push(this.makeAddManageSQL(H_sess.SELF.post));

		if (undefined !== H_sess.SELF.post.pastflg == true && H_sess.SELF.post.pastflg == 1) //前月に既に削除フラグが立った同一キーがあるかチェック
			{
				A_sql.push(this.makeDelPreManageSQL(H_sess.SELF.post, true));

				if (this.checkDeleteExist(H_sess.SELF.post, true) == true) {
					A_sql.push(this.makeDelManageSQL(H_sess.SELF.post, true));
				}

				A_sql.push(this.makeAddManageSQL(H_sess.SELF.post, true));
			}

		A_sql.push(this.makeModLogSQL(H_sess.SELF.post, cym));
		return A_sql;
	}

	makeTelListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeTelSelectSQL() + " from " + this.makeTelFromSQL("now", "main") + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post);
		return sql;
	}

	makeReserveTelListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeTelSelectSQL("reserve") + " from " + this.makeTelReserveFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post, "reserve") + " order by te.postid,te.telno,te.reserve_date,te.add_edit_flg";
		return sql;
	}

	makeRelTelListSQL(telno, carid) {
		var sql = "select " + " te.postid,trt.telno,te.telno_view,trt.carid,carrier_tb.carname,carrier_tb.carname_eng" + ",rte.postid as rel_postid,trt.rel_telno,rte.telno_view as rel_telno_view,trt.rel_carid,rel_carrier_tb.carname as rel_carname,rel_carrier_tb.carname_eng as rel_carname_eng,te.division " + " from " + this.H_Tb.tel_rel_tel_tb + " as trt " + " left outer join " + this.H_Tb.tel_tb + " as te on trt.pactid=te.pactid and trt.telno=te.telno and trt.carid=te.carid " + " left outer join " + this.H_Tb.tel_tb + " as rte on trt.pactid=rte.pactid and trt.rel_telno=rte.telno and trt.rel_carid=rte.carid " + " left outer join carrier_tb on trt.carid=carrier_tb.carid " + " left outer join carrier_tb as rel_carrier_tb on trt.rel_carid=rel_carrier_tb.carid " + " where " + " trt.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "text", true, "pactid") + " and ( (" + " trt.telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " trt.carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + ") or (" + " trt.rel_telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " trt.rel_carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + ") )";
		return sql;
	}

	makeEtcListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeEtcSelectSQL() + " from " + this.makeEtcFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ca") + this.makeEtcWhereSQL(H_post);
		return sql;
	}

	makePurchListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makePurchSelectSQL() + " from " + this.makePurchFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "pu") + this.makePurchWhereSQL(H_post);
		return sql;
	}

	makeCopyListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeCopySelectSQL() + " from " + this.makeCopyFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "co") + this.makeCopyWhereSQL(H_post);
		return sql;
	}

	makeAssetsListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeAssetsSelectSQL() + " from " + this.makeAssetsFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ass") + this.makeAssetsWhereSQL(H_post);
		return sql;
	}

	makeTranListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeTranSelectSQL() + " from " + this.makeTranFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "tr") + this.makeTranWhereSQL(H_post);
		return sql;
	}

	makeEvListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeEvSelectSQL() + " from " + this.makeEvFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ev") + this.makeEvWhereSQL(H_post);
		return sql;
	}

	makeHealthListSQL(A_post, H_post: {} | any[]) {
		var sql = "select " + this.makeHealthSelectSQL() + " from " + this.makeHealthFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "hlt") + this.makeHealthWhereSQL(H_post);
		return sql;
	}

	makeTelListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(te.telno) " + " from " + this.makeTelFromSQL("now", "main") + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post);
		return sql;
	}

	makeEtcListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(ca.cardno) " + " from " + this.makeEtcFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ca") + this.makeEtcWhereSQL(H_post);
		return sql;
	}

	makePurchListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(pu.purchid) " + " from " + this.makePurchFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "pu") + this.makePurchWhereSQL(H_post);
		return sql;
	}

	makeCopyListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(co.copyid) " + " from " + this.makeCopyFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "co") + this.makeCopyWhereSQL(H_post);
		return sql;
	}

	makeAssetsListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(ass.assetsid) " + " from " + this.makeAssetsFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ass") + this.makeAssetsWhereSQL(H_post);
		return sql;
	}

	makeTranListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(tr.tranid) " + " from " + this.makeTranFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "tr") + this.makeTranWhereSQL(H_post);
		return sql;
	}

	makeEvListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(ev.evid) " + " from " + this.makeEvFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "ev") + this.makeEvWhereSQL(H_post);
		return sql;
	}

	makeHealthListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(hlt.healthid) " + " from " + this.makeHealthFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "hlt") + this.makeHealthWhereSQL(H_post);
		return sql;
	}

	implodeWhereArray(A_where, condition) {
		if (A_where.length > 0) {
			if (condition == "or" || condition == "OR") {
				var sql = " and (" + A_where.join(" or ") + ") ";
			} else {
				sql = " and (" + A_where.join(" and ") + ") ";
			}
		}

		return sql;
	}

	getUserSelect(postid, userid = "") {
		if (this.H_G_Sess.language == "ENG") {
			var H_data = {
				"": ManagementModelBase.SELECT_TOP_ENG
			};
		} else {
			H_data = {
				"": ManagementModelBase.SELECT_TOP
			};
		}

		if (userid == "") {
			userid = this.H_G_Sess.userid;
		}

		var O_model = new UserModel();
		H_data += O_model.getUserKeyHash(this.H_G_Sess.pactid, postid, userid);
		return H_data;
	}

	getManagementProperty(mid) //S225 hanashima 20201023(第三引数追加)
	{
		var O_model = new ManagementPropertyTbModel();
		var H_data = O_model.getManagementPropertyData(this.H_G_Sess.pactid, mid, true);
		return H_data;
	}

	getManagementPropertyForEdit(mid) {
		var O_model = new ManagementPropertyTbModel();
		var H_data = O_model.getManagementPropertyDataForEdit(this.H_G_Sess.pactid, mid);
		return H_data;
	}

	getManagementPropertyForRequired(mid) {
		var O_model = new ManagementPropertyTbModel();
		var H_data = O_model.getManagementPropertyDataForRequired(this.H_G_Sess.pactid, mid);
		return H_data;
	}

	makePropValue(H_post) //文字列項目にNULLを設定
	//数値項目にNULLを設定
	//日付項目にNULLを設定
	//メール項目にNULLを設定
	//URL項目にNULLを設定
	//SELECT項目にNULLを設定 2015/01/20 date
	{
		var A_tmp = Array();

		for (var key in H_post) {
			var value = H_post[key];

			if (preg_match("/^text|^int|^date|^mail|^url|^select/", key) == true) {
				A_tmp.push(key);
			}
		}

		for (var cnt = 1; cnt <= 15; cnt++) {
			if (-1 !== A_tmp.indexOf("text" + cnt) == false) {
				H_post["text" + cnt] = undefined;
			}
		}

		for (cnt = 1;; cnt <= 6; cnt++) {
			if (-1 !== A_tmp.indexOf("int" + cnt) == false) {
				H_post["int" + cnt] = undefined;
			}
		}

		for (cnt = 1;; cnt <= 6; cnt++) {
			if (-1 !== A_tmp.indexOf("date" + cnt) == false) {
				H_post["date" + cnt] = undefined;
			}
		}

		for (cnt = 1;; cnt <= 3; cnt++) {
			if (-1 !== A_tmp.indexOf("mail" + cnt) == false) {
				H_post["mail" + cnt] = undefined;
			}
		}

		for (cnt = 1;; cnt <= 3; cnt++) {
			if (-1 !== A_tmp.indexOf("url" + cnt) == false) {
				H_post["url" + cnt] = undefined;
			}
		}

		for (cnt = 1;; cnt <= 10; cnt++) {
			if (-1 !== A_tmp.indexOf("select" + cnt) == false) {
				H_post["select" + cnt] = undefined;
			}
		}

		return H_post;
	}

	getTreeJS(H_sess) //テーブル名の決定
	//現在
	{
		var H_tree = Array();
		this.setTableName(H_sess.cym);

		if (this.YM == H_sess.cym) {
			var post_tb = "post_tb";
			var post_relation_tb = "post_relation_tb";
			var tb_no = "";
		} else //対象テーブル名
			{
				post_tb = this.H_Tb.post_tb;
				post_relation_tb = this.H_Tb.post_relation_tb;
				tb_no = this.H_Tb.tableno;
			}

		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		H_tree.post_name = O_post.getPostTreeBand(this.H_G_Sess.pactid, this.H_G_Sess.postid, H_sess.current_postid, tb_no, " -> ", "", 1, false);
		var O_tree = new TreeAJAX();
		O_tree.post_tb = this.H_Tb.post_tb;
		O_tree.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.tree_str = O_tree.makeTree(this.H_G_Sess.postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = this.H_Tb.post_tb;
		O_xlist.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getAddTreeJS() //部署設定型
	{
		var O_tree = new TreeAJAX();
		var O_xlist = new ListAJAX();
		H_tree.js = O_tree.treeJs() + O_xlist.xlistJs();
		O_tree.setPost = true;
		O_tree.current_postid = this.H_G_Sess.current_postid;
		H_tree.tree_str = O_tree.makeTreePost(this.H_G_Sess.postid);
		O_xlist.type = "setpost";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getMoveTreeJS(H_g_sess: {} | any[], H_sess: {} | any[], A_auth: {} | any[]) //ツリーのルート部署設定
	//ツリー作成
	//部署管理型
	{
		this.setTableName(H_sess[ManagementModelBase.PUB].cym);

		if (-1 !== A_auth.indexOf("fnc_treefree") == true) //部署ツリー権限解除時ルート部署を表示しない場合
			{
				if (-1 !== A_auth.indexOf("fnc_not_view_root") == true) {
					var O_post = new Post();
					var postid_of_tree = O_post.getTargetRootPostid(this.H_G_Sess.pactid, H_g_sess.postid, this.H_Tb.post_relation_tb, 2);
				} else //制限解除権限あり
					{
						var sql = "select postidchild from " + this.H_Tb.post_relation_tb + " where level = 0 and pactid = " + this.H_G_Sess.pactid;
						postid_of_tree = this.get_DB().queryOne(sql);
					}
			} else //制限解除権限なし
			{
				postid_of_tree = this.H_G_Sess.postid;
			}

		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_tree = new TreeAJAX();
		O_tree.post_tb = this.H_Tb.post_tb;
		O_tree.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.tree_str = O_tree.makeTreeMove(postid_of_tree);
		var O_xlist = new ListAJAX();
		O_xlist.type = "move";
		O_xlist.post_tb = this.H_Tb.post_tb;
		O_xlist.post_relation_tb = this.H_Tb.post_relation_tb;
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	checkAddAuth(H_post) {
		var A_post = this.getPostidList(this.H_G_Sess.postid, 1);

		if (-1 !== A_post.indexOf(H_post.recogpostid) == false) {
			this.getOut().displayError("\u767B\u9332\u5148\u306E\u90E8\u7F72\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u4ED6\u306E\u4EBA\u306E\u64CD\u4F5C\u306B\u3088\u308A\u6A29\u9650\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F", 0, "/Menu/menu.php", "\u623B\u308B");
		}
	}

	checkMoveAuth(H_sess, A_data) //移動日（現在電話のみ）
	//移動元部署の権限
	{
		var H_post = H_sess.SELF.post;
		var movedate = "";

		if (undefined !== H_post.movedate == true) {
			movedate = this.O_Manage.convertDatetime(H_post.movedate, "");
		}

		var A_postid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.tableno);

		if (-1 !== A_postid.indexOf(H_sess[ManagementModelBase.PUB].current_postid) == false) {
			if (this.H_G_Sess.language == "ENG") {
				this.getOut().displayError("Not authorized for source department.<br>Authority has been changed by another user.", 0, "/Menu/menu.php", "Back");
			} else {
				this.getOut().displayError("\u79FB\u52D5\u5143\u306E\u90E8\u7F72\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u4ED6\u306E\u4EBA\u306E\u64CD\u4F5C\u306B\u3088\u308A\u6A29\u9650\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F", 0, "/Menu/menu.php", "\u623B\u308B");
			}
		}

		if (-1 !== this.A_Auth.indexOf("fnc_treefree") == false && -1 !== A_postid.indexOf(H_post.recogpostid) == false) {
			if (this.H_G_Sess.language == "ENG") {
				this.getOut().displayError("Not authorized for destination department.<br>Authority has been changed by another user.", 0, _SERVER.PHP_SELF + "?r=1", "Back");
			} else {
				this.getOut().displayError("\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u4ED6\u306E\u4EBA\u306E\u64CD\u4F5C\u306B\u3088\u308A\u6A29\u9650\u304C\u5909\u66F4\u3055\u308C\u307E\u3057\u305F", 0, _SERVER.PHP_SELF + "?r=1", "\u623B\u308B");
			}
		}

		if (undefined !== H_post.pastflg === true && "1" === H_post.pastflg || undefined !== H_post.movetype === true && "shitei" === H_post.movetype && movedate < this.YM + "01") //前月配下部署一覧
			//移動元部署の前月の存在チェック
			{
				var A_prepostid = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_Tb.pretableno);

				if (this.O_Post.checkPostExist(H_sess[ManagementModelBase.PUB].current_postid, this.H_Tb.pre_post_tb) == false) {
					if (undefined !== H_post.pastflg == true) {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Source department does not exist in the previous month.<br>Also uncheck the shift for the previous month.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5143\u306E\u90E8\u7F72\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					} else {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Source department does not exist in the previous month.<br>Change the date of shift to a date in this month or later.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5143\u306E\u90E8\u7F72\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002<BR>\u79FB\u52D5\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					}
				}

				if (this.O_Post.checkPostExist(H_post.recogpostid, this.H_Tb.pre_post_tb) == false) {
					if (undefined !== H_post.pastflg == true) {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Destination department does not exist in the previous month.<br>Also uncheck the shift for the previous month.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					} else {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Destination department does not exist in the previous month.<br>Change the date of shift to a date in this month or later.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u304C\u524D\u6708\u306B\u5B58\u5728\u3057\u307E\u305B\u3093\u3002<BR>\u79FB\u52D5\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					}
				}

				if (-1 !== A_prepostid.indexOf(H_sess[ManagementModelBase.PUB].current_postid) == false) {
					if (undefined !== H_post.pastflg == true) {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Not authorized for the previous month's data of the source department.<br>Also uncheck the shift for the previous month.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5143\u306E\u90E8\u7F72\u306E\u524D\u6708\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					} else {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Not authorized for the previous month's data of the source department.<br>Change the data of shift to a date in this month or later. ", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5143\u306E\u90E8\u7F72\u306E\u524D\u6708\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u79FB\u52D5\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					}
				}

				if (-1 !== this.A_Auth.indexOf("fnc_treefree") == false && -1 !== A_prepostid.indexOf(H_post.recogpostid) == false) {
					if (undefined !== H_post.pastflg == true) {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Not authorized for the previous month's data of the destination department.<br>Also uncheck the shift for the previous month.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u306E\u524D\u6708\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u524D\u6708\u5206\u3082\u79FB\u52D5\u306E\u30C1\u30A7\u30C3\u30AF\u3092\u5916\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					} else {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Not authorized for the previous month's data of the destination department.<br>Change the date of shift to a date in this month or later.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u79FB\u52D5\u5148\u306E\u90E8\u7F72\u306E\u524D\u6708\u306E\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002<BR>\u79FB\u52D5\u65E5\u3092\u4ECA\u6708\u4EE5\u964D\u306B\u3057\u3066\u304F\u3060\u3055\u3044", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					}
				}

				this.checkPreTrgManageAuth(A_data, A_prepostid);
			}

		if (undefined !== H_post.movemethod == true && "all" == H_post.movemethod) //全ての電話の関連電話一覧作成
			//選択対象が関連電話にも入っていたら重複なのでエラー
			{
				var A_reltels = Array();

				for (var cnt = 0; cnt < A_data.length; cnt++) {
					for (var rcnt = 0; rcnt < A_data[cnt].rel_tel.length; rcnt++) {
						A_reltels.push(A_data[cnt].rel_tel[rcnt].telno);
					}
				}

				for (cnt = 0;; cnt < A_data.length; cnt++) {
					if (-1 !== A_reltels.indexOf(A_data[cnt].telno) == true) {
						if (this.H_G_Sess.language == "ENG") {
							this.getOut().displayError("Selected telephones include telephones related to other telephones.<br>Select \"Shift selected target\" or select the telephones from the <br> list again.", 0, _SERVER.PHP_SELF, "Back");
						} else {
							this.getOut().displayError("\u9078\u629E\u3057\u305F\u96FB\u8A71\u306E\u4E2D\u306B\u4ED6\u306E\u96FB\u8A71\u306E\u95A2\u9023\u96FB\u8A71\u304C\u3042\u308A\u307E\u3059\u3002<BR>\u300C\u9078\u629E\u3057\u305F\u5BFE\u8C61\u3092\u79FB\u52D5\u300D\u3092\u9078\u629E\u3059\u308B\u304B<br>\u4E00\u89A7\u304B\u3089\u96FB\u8A71\u3092\u9078\u3073\u306A\u304A\u3057\u3066\u304F\u3060\u3055\u3044\u3002", 0, _SERVER.PHP_SELF, "\u623B\u308B");
						}
					}
				}
			}
	}

	makeUpdateSetSQL(A_col, A_val) {
		var A_sql = Array();

		for (var cnt = 0; cnt < A_col.length; cnt++) {
			A_sql.push(A_col[cnt] + "=" + A_val[cnt]);
		}

		return A_sql.join(",");
	}

	getTelFreeWordCol() //表示言語分岐
	{
		if (this.H_G_Sess.language == "ENG") {
			var A_tmp = [{
				col: "carrier_tb.carname_eng",
				type: "text"
			}, {
				col: "circuit_tb.cirname_eng",
				type: "text"
			}, {
				col: "buyselect_tb.buyselname_eng",
				type: "text"
			}, {
				col: "plan_tb.planname_eng",
				type: "text"
			}, {
				col: "packet_tb.packetname_eng",
				type: "text"
			}, {
				col: "point_tb.pointname_eng",
				type: "text"
			}, {
				col: "area_tb.arname_eng",
				type: "text"
			}];
		} else {
			A_tmp = [{
				col: "carrier_tb.carname",
				type: "text"
			}, {
				col: "circuit_tb.cirname",
				type: "text"
			}, {
				col: "buyselect_tb.buyselname",
				type: "text"
			}, {
				col: "plan_tb.planname",
				type: "text"
			}, {
				col: "packet_tb.packetname",
				type: "text"
			}, {
				col: "point_tb.pointname",
				type: "text"
			}, {
				col: "area_tb.arname",
				type: "text"
			}];
		}

		var A_col = [{
			col: "te.telno_view",
			type: "text"
		}, {
			col: "te.mail",
			type: "text"
		}, {
			col: "kp.patternname",
			type: "text"
		}, {
			col: "te.simcardno",
			type: "text"
		}, {
			col: "us.username",
			type: "text"
		}, {
			col: "te.username",
			type: "text"
		}, {
			col: "te.employeecode",
			type: "text"
		}, {
			col: "te.memo",
			type: "text"
		}, {
			col: "us.username",
			type: "text"
		}, {
			col: "te.text1",
			type: "text"
		}, {
			col: "te.text2",
			type: "text"
		}, {
			col: "te.text3",
			type: "text"
		}, {
			col: "te.text4",
			type: "text"
		}, {
			col: "te.text5",
			type: "text"
		}, {
			col: "te.text6",
			type: "text"
		}, {
			col: "te.text7",
			type: "text"
		}, {
			col: "te.text8",
			type: "text"
		}, {
			col: "te.text9",
			type: "text"
		}, {
			col: "te.text10",
			type: "text"
		}, {
			col: "te.text11",
			type: "text"
		}, {
			col: "te.text12",
			type: "text"
		}, {
			col: "te.text13",
			type: "text"
		}, {
			col: "te.text14",
			type: "text"
		}, {
			col: "te.text15",
			type: "text"
		}, {
			col: "te.mail1",
			type: "text"
		}, {
			col: "te.mail2",
			type: "text"
		}, {
			col: "te.mail3",
			type: "text"
		}, {
			col: "te.url1",
			type: "text"
		}, {
			col: "te.url2",
			type: "text"
		}, {
			col: "te.url3",
			type: "text"
		}, {
			col: "ass.assetsno",
			type: "text"
		}, {
			col: "ass.serialno",
			type: "text"
		}, {
			col: "ass.productname",
			type: "text"
		}, {
			col: "ass.property",
			type: "text"
		}, {
			col: "ass.firmware",
			type: "text"
		}, {
			col: "ass.version",
			type: "text"
		}, {
			col: "ass.accessory",
			type: "text"
		}, {
			col: "smart_circuit_tb.smpcirname",
			type: "text"
		}, {
			col: "te.int1",
			type: "int"
		}, {
			col: "te.int2",
			type: "int"
		}, {
			col: "te.int3",
			type: "int"
		}, {
			col: "te.int4",
			type: "int"
		}, {
			col: "te.int5",
			type: "int"
		}, {
			col: "te.int6",
			type: "int"
		}, {
			col: "ass.bought_price",
			type: "int"
		}, {
			col: "ass.pay_frequency",
			type: "int"
		}, {
			col: "ass.pay_monthly_sum",
			type: "int"
		}, {
			col: "te.orderdate",
			type: "date"
		}, {
			col: "te.contractdate",
			type: "date"
		}, {
			col: "ass.bought_date",
			type: "date"
		}, {
			col: "ass.pay_startdate",
			type: "date"
		}, {
			col: "te.date1",
			type: "date"
		}, {
			col: "te.date2",
			type: "date"
		}, {
			col: "te.date3",
			type: "date"
		}, {
			col: "te.date4",
			type: "date"
		}, {
			col: "te.date5",
			type: "date"
		}, {
			col: "te.date6",
			type: "date"
		}, {
			col: "te.extensionno",
			type: "text"
		}];
		A_col = array_merge(A_tmp, A_col);
		return A_col;
	}

	getEtcFreeWordCol() {
		var A_col = [{
			col: "ca.cardno_view",
			type: "text"
		}, {
			col: "card_co_tb.cardconame",
			type: "text"
		}, {
			col: "ca.card_meigi",
			type: "text"
		}, {
			col: "ca.bill_cardno",
			type: "text"
		}, {
			col: "ca.bill_cardno_view",
			type: "text"
		}, {
			col: "ca.card_corpno",
			type: "text"
		}, {
			col: "ca.card_corpname",
			type: "text"
		}, {
			col: "ca.card_membername",
			type: "text"
		}, {
			col: "ca.car_no",
			type: "text"
		}, {
			col: "us.username",
			type: "text"
		}, {
			col: "ca.memo",
			type: "text"
		}, {
			col: "ca.username",
			type: "text"
		}, {
			col: "ca.employeecode",
			type: "text"
		}, {
			col: "ca.text1",
			type: "text"
		}, {
			col: "ca.text2",
			type: "text"
		}, {
			col: "ca.text3",
			type: "text"
		}, {
			col: "ca.text4",
			type: "text"
		}, {
			col: "ca.text5",
			type: "text"
		}, {
			col: "ca.text6",
			type: "text"
		}, {
			col: "ca.text7",
			type: "text"
		}, {
			col: "ca.text8",
			type: "text"
		}, {
			col: "ca.text9",
			type: "text"
		}, {
			col: "ca.text10",
			type: "text"
		}, {
			col: "ca.text11",
			type: "text"
		}, {
			col: "ca.text12",
			type: "text"
		}, {
			col: "ca.text13",
			type: "text"
		}, {
			col: "ca.text14",
			type: "text"
		}, {
			col: "ca.text15",
			type: "text"
		}, {
			col: "ca.mail1",
			type: "text"
		}, {
			col: "ca.mail2",
			type: "text"
		}, {
			col: "ca.mail3",
			type: "text"
		}, {
			col: "ca.url1",
			type: "text"
		}, {
			col: "ca.url2",
			type: "text"
		}, {
			col: "ca.url3",
			type: "text"
		}, {
			col: "ca.int1",
			type: "int"
		}, {
			col: "ca.int2",
			type: "int"
		}, {
			col: "ca.int3",
			type: "int"
		}, {
			col: "ca.int4",
			type: "int"
		}, {
			col: "ca.int5",
			type: "int"
		}, {
			col: "ca.int6",
			type: "int"
		}, {
			col: "ca.date1",
			type: "date"
		}, {
			col: "ca.date2",
			type: "date"
		}, {
			col: "ca.date3",
			type: "date"
		}, {
			col: "ca.date4",
			type: "date"
		}, {
			col: "ca.date5",
			type: "date"
		}, {
			col: "ca.date6",
			type: "date"
		}];
		return A_col;
	}

	getPurchFreeWordCol() {
		var A_col = [{
			col: "pu.purchid",
			type: "text"
		}, {
			col: "purchase_co_tb.purchconame",
			type: "text"
		}, {
			col: "pu.employeecode",
			type: "text"
		}, {
			col: "pu.registcomp",
			type: "text"
		}, {
			col: "pu.registpost",
			type: "text"
		}, {
			col: "pu.registzip",
			type: "text"
		}, {
			col: "pu.registaddr1",
			type: "text"
		}, {
			col: "pu.registaddr2",
			type: "text"
		}, {
			col: "pu.registbuilding",
			type: "text"
		}, {
			col: "pu.registtelno",
			type: "text"
		}, {
			col: "pu.registfaxno",
			type: "text"
		}, {
			col: "pu.registemail",
			type: "text"
		}, {
			col: "pu.memo",
			type: "text"
		}, {
			col: "pu.loginid",
			type: "text"
		}, {
			col: "pu.username",
			type: "text"
		}, {
			col: "pu.text1",
			type: "text"
		}, {
			col: "pu.text2",
			type: "text"
		}, {
			col: "pu.text3",
			type: "text"
		}, {
			col: "pu.text4",
			type: "text"
		}, {
			col: "pu.text5",
			type: "text"
		}, {
			col: "pu.text6",
			type: "text"
		}, {
			col: "pu.text7",
			type: "text"
		}, {
			col: "pu.text8",
			type: "text"
		}, {
			col: "pu.text9",
			type: "text"
		}, {
			col: "pu.text10",
			type: "text"
		}, {
			col: "pu.text11",
			type: "text"
		}, {
			col: "pu.text12",
			type: "text"
		}, {
			col: "pu.text13",
			type: "text"
		}, {
			col: "pu.text14",
			type: "text"
		}, {
			col: "pu.text15",
			type: "text"
		}, {
			col: "pu.mail1",
			type: "text"
		}, {
			col: "pu.mail2",
			type: "text"
		}, {
			col: "pu.mail3",
			type: "text"
		}, {
			col: "pu.url1",
			type: "text"
		}, {
			col: "pu.url2",
			type: "text"
		}, {
			col: "pu.url3",
			type: "text"
		}, {
			col: "pu.int1",
			type: "int"
		}, {
			col: "pu.int2",
			type: "int"
		}, {
			col: "pu.int3",
			type: "int"
		}, {
			col: "pu.int4",
			type: "int"
		}, {
			col: "pu.int5",
			type: "int"
		}, {
			col: "pu.int6",
			type: "int"
		}, {
			col: "pu.registdate",
			type: "date"
		}, {
			col: "pu.date1",
			type: "date"
		}, {
			col: "pu.date2",
			type: "date"
		}, {
			col: "pu.date3",
			type: "date"
		}, {
			col: "pu.date4",
			type: "date"
		}, {
			col: "pu.date5",
			type: "date"
		}, {
			col: "pu.date6",
			type: "date"
		}];
		return A_col;
	}

	getCopyFreeWordCol() {
		var A_col = [{
			col: "co.copyid",
			type: "text"
		}, {
			col: "co.copyname",
			type: "text"
		}, {
			col: "copy_co_tb.copyconame",
			type: "text"
		}, {
			col: "co.username",
			type: "text"
		}, {
			col: "co.employeecode",
			type: "text"
		}, {
			col: "co.memo",
			type: "text"
		}, {
			col: "co.text1",
			type: "text"
		}, {
			col: "co.text2",
			type: "text"
		}, {
			col: "co.text3",
			type: "text"
		}, {
			col: "co.text4",
			type: "text"
		}, {
			col: "co.text5",
			type: "text"
		}, {
			col: "co.text6",
			type: "text"
		}, {
			col: "co.text7",
			type: "text"
		}, {
			col: "co.text8",
			type: "text"
		}, {
			col: "co.text9",
			type: "text"
		}, {
			col: "co.text10",
			type: "text"
		}, {
			col: "co.text11",
			type: "text"
		}, {
			col: "co.text12",
			type: "text"
		}, {
			col: "co.text13",
			type: "text"
		}, {
			col: "co.text14",
			type: "text"
		}, {
			col: "co.text15",
			type: "text"
		}, {
			col: "co.mail1",
			type: "text"
		}, {
			col: "co.mail2",
			type: "text"
		}, {
			col: "co.mail3",
			type: "text"
		}, {
			col: "co.url1",
			type: "text"
		}, {
			col: "co.url2",
			type: "text"
		}, {
			col: "co.url3",
			type: "text"
		}, {
			col: "co.int1",
			type: "int"
		}, {
			col: "co.int2",
			type: "int"
		}, {
			col: "co.int3",
			type: "int"
		}, {
			col: "co.int4",
			type: "int"
		}, {
			col: "co.int5",
			type: "int"
		}, {
			col: "co.int6",
			type: "int"
		}, {
			col: "co.date1",
			type: "date"
		}, {
			col: "co.date2",
			type: "date"
		}, {
			col: "co.date3",
			type: "date"
		}, {
			col: "co.date4",
			type: "date"
		}, {
			col: "co.date5",
			type: "date"
		}, {
			col: "co.date6",
			type: "date"
		}];
		return A_col;
	}

	getAssetsFreeWordCol() {
		var A_col = [{
			col: "ass.assetsno",
			type: "text"
		}, {
			col: "att1.assetstypename",
			type: "text"
		}, {
			col: "att2.assetstypename",
			type: "text"
		}, {
			col: "ass.productname",
			type: "text"
		}, {
			col: "ass.property",
			type: "text"
		}, {
			col: "ass.serialno",
			type: "text"
		}, {
			col: "smart_circuit_tb.smpcirname",
			type: "text"
		}, {
			col: "ass.firmware",
			type: "text"
		}, {
			col: "ass.version",
			type: "text"
		}, {
			col: "ass.accessory",
			type: "text"
		}, {
			col: "ass.username",
			type: "text"
		}, {
			col: "ass.employeecode",
			type: "text"
		}, {
			col: "ass.memo",
			type: "text"
		}, {
			col: "ass.text1",
			type: "text"
		}, {
			col: "ass.text2",
			type: "text"
		}, {
			col: "ass.text3",
			type: "text"
		}, {
			col: "ass.text4",
			type: "text"
		}, {
			col: "ass.text5",
			type: "text"
		}, {
			col: "ass.text6",
			type: "text"
		}, {
			col: "ass.text7",
			type: "text"
		}, {
			col: "ass.text8",
			type: "text"
		}, {
			col: "ass.text9",
			type: "text"
		}, {
			col: "ass.text10",
			type: "text"
		}, {
			col: "ass.text11",
			type: "text"
		}, {
			col: "ass.text12",
			type: "text"
		}, {
			col: "ass.text13",
			type: "text"
		}, {
			col: "ass.text14",
			type: "text"
		}, {
			col: "ass.text15",
			type: "text"
		}, {
			col: "ass.mail1",
			type: "text"
		}, {
			col: "ass.mail2",
			type: "text"
		}, {
			col: "ass.mail3",
			type: "text"
		}, {
			col: "ass.url1",
			type: "text"
		}, {
			col: "ass.url2",
			type: "text"
		}, {
			col: "ass.url3",
			type: "text"
		}, {
			col: "ass.bought_price",
			type: "int"
		}, {
			col: "ass.pay_frequency",
			type: "int"
		}, {
			col: "ass.pay_monthly_sum",
			type: "int"
		}, {
			col: "ass.int1",
			type: "int"
		}, {
			col: "ass.int2",
			type: "int"
		}, {
			col: "ass.int3",
			type: "int"
		}, {
			col: "ass.int4",
			type: "int"
		}, {
			col: "ass.int5",
			type: "int"
		}, {
			col: "ass.int6",
			type: "int"
		}, {
			col: "ass.bought_date",
			type: "date"
		}, {
			col: "ass.pay_startdate",
			type: "date"
		}, {
			col: "ass.date1",
			type: "date"
		}, {
			col: "ass.date2",
			type: "date"
		}, {
			col: "ass.date3",
			type: "date"
		}, {
			col: "ass.date4",
			type: "date"
		}, {
			col: "ass.date5",
			type: "date"
		}, {
			col: "ass.date6",
			type: "date"
		}];
		return A_col;
	}

	getTranFreeWordCol() {
		var A_col = [{
			col: "tr.tranid",
			type: "text"
		}, {
			col: "transit_co_tb.tranconame",
			type: "text"
		}, {
			col: "tr.employeecode",
			type: "text"
		}, {
			col: "tr.memo",
			type: "text"
		}, {
			col: "tr.username",
			type: "text"
		}, {
			col: "tr.text1",
			type: "text"
		}, {
			col: "tr.text2",
			type: "text"
		}, {
			col: "tr.text3",
			type: "text"
		}, {
			col: "tr.text4",
			type: "text"
		}, {
			col: "tr.text5",
			type: "text"
		}, {
			col: "tr.text6",
			type: "text"
		}, {
			col: "tr.text7",
			type: "text"
		}, {
			col: "tr.text8",
			type: "text"
		}, {
			col: "tr.text9",
			type: "text"
		}, {
			col: "tr.text10",
			type: "text"
		}, {
			col: "tr.text11",
			type: "text"
		}, {
			col: "tr.text12",
			type: "text"
		}, {
			col: "tr.text13",
			type: "text"
		}, {
			col: "tr.text14",
			type: "text"
		}, {
			col: "tr.text15",
			type: "text"
		}, {
			col: "tr.mail1",
			type: "text"
		}, {
			col: "tr.mail2",
			type: "text"
		}, {
			col: "tr.mail3",
			type: "text"
		}, {
			col: "tr.url1",
			type: "text"
		}, {
			col: "tr.url2",
			type: "text"
		}, {
			col: "tr.url3",
			type: "text"
		}, {
			col: "tr.int1",
			type: "int"
		}, {
			col: "tr.int2",
			type: "int"
		}, {
			col: "tr.int3",
			type: "int"
		}, {
			col: "tr.int4",
			type: "int"
		}, {
			col: "tr.int5",
			type: "int"
		}, {
			col: "tr.int6",
			type: "int"
		}, {
			col: "tr.date1",
			type: "date"
		}, {
			col: "tr.date2",
			type: "date"
		}, {
			col: "tr.date3",
			type: "date"
		}, {
			col: "tr.date4",
			type: "date"
		}, {
			col: "tr.date5",
			type: "date"
		}, {
			col: "tr.date6",
			type: "date"
		}];
		return A_col;
	}

	getEvFreeWordCol() {
		var A_col = [{
			col: "ev.evid",
			type: "text"
		}, {
			col: "ev_co_tb.evconame",
			type: "text"
		}, {
			col: "ev.ev_car_number",
			type: "text"
		}, {
			col: "ev.ev_car_type",
			type: "text"
		}, {
			col: "ev.ev_telno",
			type: "text"
		}, {
			col: "ev.ev_mail",
			type: "text"
		}, {
			col: "ev.ev_zip",
			type: "text"
		}, {
			col: "ev.ev_addr1",
			type: "text"
		}, {
			col: "ev.ev_addr2",
			type: "text"
		}, {
			col: "ev.ev_building",
			type: "text"
		}, {
			col: "ev.memo",
			type: "text"
		}, {
			col: "ev.username",
			type: "text"
		}, {
			col: "ev.text1",
			type: "text"
		}, {
			col: "ev.text2",
			type: "text"
		}, {
			col: "ev.text3",
			type: "text"
		}, {
			col: "ev.text4",
			type: "text"
		}, {
			col: "ev.text5",
			type: "text"
		}, {
			col: "ev.text6",
			type: "text"
		}, {
			col: "ev.text7",
			type: "text"
		}, {
			col: "ev.text8",
			type: "text"
		}, {
			col: "ev.text9",
			type: "text"
		}, {
			col: "ev.text10",
			type: "text"
		}, {
			col: "ev.text11",
			type: "text"
		}, {
			col: "ev.text12",
			type: "text"
		}, {
			col: "ev.text13",
			type: "text"
		}, {
			col: "ev.text14",
			type: "text"
		}, {
			col: "ev.text15",
			type: "text"
		}, {
			col: "ev.mail1",
			type: "text"
		}, {
			col: "ev.mail2",
			type: "text"
		}, {
			col: "ev.mail3",
			type: "text"
		}, {
			col: "ev.url1",
			type: "text"
		}, {
			col: "ev.url2",
			type: "text"
		}, {
			col: "ev.url3",
			type: "text"
		}, {
			col: "ev.int1",
			type: "int"
		}, {
			col: "ev.int2",
			type: "int"
		}, {
			col: "ev.int3",
			type: "int"
		}, {
			col: "ev.int4",
			type: "int"
		}, {
			col: "ev.int5",
			type: "int"
		}, {
			col: "ev.int6",
			type: "int"
		}, {
			col: "ev.date1",
			type: "date"
		}, {
			col: "ev.date2",
			type: "date"
		}, {
			col: "ev.date3",
			type: "date"
		}, {
			col: "ev.date4",
			type: "date"
		}, {
			col: "ev.date5",
			type: "date"
		}, {
			col: "ev.date6",
			type: "date"
		}];
		return A_col;
	}

	getHealthFreeWordCol() {
		var A_col = [{
			col: "hlt.healthid",
			type: "text"
		}, {
			col: "healthcare_co_tb.healthconame",
			type: "text"
		}, {
			col: "hlt.employeecode",
			type: "text"
		}, {
			col: "hlt.remarks",
			type: "text"
		}, {
			col: "hlt.username",
			type: "text"
		}];
		return A_col;
	}

	makeFreeWordArray(str) {
		var A_str = Array();
		var A_tmp = preg_split("/\\s|\u3000/", str);

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			A_tmp[cnt] = A_tmp[cnt].trim();

			if ("" != A_tmp[cnt]) {
				A_str.push(A_tmp[cnt]);
			}
		}

		A_str = array_unique(A_str);
		return A_str;
	}

	makeFreeWordWhere(A_col, A_str) {
		var A_addcol = [{
			col: this.H_Tb.post_tb + ".userpostid",
			type: "text"
		}, {
			col: this.H_Tb.post_tb + ".postname",
			type: "text"
		}];
		A_col = array_merge(A_addcol, A_col);
		var A_where = Array();

		for (var scnt = 0; scnt < A_str.length; scnt++) {
			var A_tmp = Array();

			for (var ccnt = 0; ccnt < A_col.length; ccnt++) //文字型
			{
				if ("text" == A_col[ccnt].type) {
					A_tmp.push(A_col[ccnt].col + " like '%" + A_str[scnt] + "%'");
				} else if ("int" == A_col[ccnt].type) {
					A_tmp.push("cast(" + A_col[ccnt].col + " as text) like '%" + A_str[scnt] + "%'");
				} else if ("date" == A_col[ccnt].type) {
					if (this.H_G_Sess.language == "ENG") {
						A_tmp.push("to_char(" + A_col[ccnt].col + ",'YYYY/MM/DD') like '%" + A_str[scnt] + "%'");
					} else {
						A_tmp.push("to_char(" + A_col[ccnt].col + ",'YYYY\u5E74MM\u6708DD\u65E5') like '%" + A_str[scnt] + "%'");
					}
				}
			}

			A_where.push(A_tmp.join(" or "));
		}

		var sql = "(" + A_where.join(") and (") + ")";
		return sql;
	}

	makePastLogStr(cym) {
		var str = "";

		if (this.YM != cym) {
			str = "\uFF08" + cym.substr(0, 4) + "\u5E74" + cym.substr(4, 2) + "\u6708\u767B\u9332\u5206\uFF09";
		}

		return str;
	}

	makePastLogStrEng(cym) {
		var str = "";

		if (this.YM != cym) {
			str = "\uFF08" + cym.substr(0, 4) + "/" + cym.substr(4, 2) + "\uFF09";
		}

		return str;
	}

	makeSerializeColWhere(str, cond, col) {
		if (Array.isArray(str) == true) {
			var tmp = ",";

			for (var key in str) {
				var val = str[key];
				tmp += key + ",";
			}

			str = tmp;
		}

		var A_str = split(",", str);
		var A_where = Array();

		for (var cnt = 0; cnt < A_str.length; cnt++) {
			if ("" != A_str[cnt]) {
				if (preg_match("/\\|/", A_str[cnt]) == true) {
					var A_where_tmp = Array();
					var A_tmp = A_str[cnt].split("|");

					for (var tcnt = 0; tcnt < A_tmp.length; tcnt++) {
						A_where_tmp.push(col + " like '%i:" + A_tmp[tcnt] + ";%'");
					}

					var str_tmp = "(" + A_where_tmp.join(" or ") + ")";
					A_where.push(str_tmp);
				} else {
					A_where.push(col + " like '%i:" + A_str[cnt] + ";%'");
				}
			}
		}

		if (!A_where === false) {
			var res_str = "(" + A_where.join(" " + cond + " ") + ")";
		} else {
			return false;
		}

		return res_str;
	}

	getSmartCircuitData() {
		if (this.H_G_Sess.language == "ENG") {
			var H_data = {
				"": ManagementModelBase.SELECT_TOP_ENG
			};
			var H_res = SmartCircuitModel.getSmartCircuitKeyHashEng();
		} else {
			H_data = {
				"": ManagementModelBase.SELECT_TOP
			};
			H_res = SmartCircuitModel.getSmartCircuitKeyHash();
		}

		H_data += H_res;
		return H_data;
	}

	getTelReserveList(telno, carid, date = undefined, flg = undefined) //予約日指定あり
	{
		var sql = "select te.postid,po.postname,te.telno,te.telno_view,te.extensionno,te.carid,te.cirid,te.reserve_date,te.add_edit_flg " + " from " + this.H_Tb.tel_reserve_tb + " as te " + " left outer join " + this.H_Tb.post_tb + " as po on te.postid=po.postid " + " where " + " te.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and te.telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and te.carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " te.exe_state=0";

		if (date != undefined) {
			sql += " and " + " te.reserve_date >=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date");
		}

		if (flg != undefined) {
			sql += " and " + " te.add_edit_flg =" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg");
		}

		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getTelReserveListAtDate(telno, carid, date, flg) {
		var sql = "select te.postid,po.postname,te.telno,te.telno_view,te.extensionno,te.carid,te.cirid,te.reserve_date,te.add_edit_flg " + " from " + this.H_Tb.tel_reserve_tb + " as te " + " left outer join " + this.H_Tb.post_tb + " as po on te.postid=po.postid " + " where " + " te.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and te.telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and te.carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " te.exe_state=0" + " and " + " te.reserve_date =" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and " + " te.add_edit_flg =" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg");
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	makeTelReserveMoveLogSQL(H_data: {} | any[], H_post: {} | any[], cym, del = false, reserve = false) //文言
	{
		var reservedate_view = H_data.reserve_date.substr(0, 4) + "\u5E74" + H_data.reserve_date.substr(5, 2) + "\u6708" + H_data.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_data.reserve_date.substr(0, 4) + "/" + H_data.reserve_date.substr(5, 2) + "/" + H_data.reserve_date.substr(8, 2);

		if (reserve === true) {
			var str1 = "\u96FB\u8A71\u79FB\u52D5\u4E88\u7D04";
			var str1_eng = "Reservation shift";
		} else {
			str1 = "\u96FB\u8A71\u79FB\u52D5";
			str1_eng = "Telephone shift";
		}

		if (del === true) {
			var str2 = "\u524A\u9664";
			var str2_eng = "reservation of telephone deletion";
		} else {
			str2 = "\u79FB\u52D5";
			str2_eng = "reservation of telephone shift";
		}

		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_data.telno, H_data.telno_view, H_data.carid, str1 + "\u306B\u3088\u308B\u4E88\u7D04" + str2 + "\uFF08" + reservedate_view + "\uFF09", str2_eng + " due to " + str1_eng + "\uFF08" + reservedate_view_eng + "\uFF09", H_data.postid, H_post.recogpostid, H_data.postname, H_post.recogpostname, this.H_G_Sess.joker, "\u79FB\u52D5", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	getAllAssetsReserveList(assetsid, pre = false) {
		var sql = "select ass.postid,ass.assetsid,ass.assetsno,po.postname,ass.reserve_date,ass.add_edit_flg " + " from " + this.H_Tb.assets_reserve_tb + " as ass " + " left outer join " + this.H_Tb.post_tb + " as po on ass.postid=po.postid " + " where " + " ass.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and ass.assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid") + " and " + " exe_state=0";
		var A_res = this.get_db().queryHash(sql);
		return A_res;
	}

	makeDelAssetsReserveSQL(assetsid, date, flg) {
		var sql = "delete from " + this.H_Tb.assets_reserve_tb + " where " + " assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and add_edit_flg=" + flg + " and exe_state=0";
		return sql;
	}

	getAllTelRelAssetsList(assetsid, pre = false) {
		var sql = "select tra.telno,tra.carid,tra.assetsid,te.telno_view,te.dummy_flg,carrier_tb.carname,carrier_tb.carname_eng " + " from " + this.H_Tb.tel_rel_assets_tb + " as tra " + " left join " + this.H_Tb.tel_tb + " as te " + " on tra.pactid=te.pactid and tra.telno=te.telno and tra.carid=te.carid " + " left join carrier_tb on tra.carid=carrier_tb.carid " + " where " + " tra.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and tra.assetsid=" + this.get_DB().dbQuote(assetsid, "text", true, "assetsid");
		var A_res = this.get_db().queryHash(sql);
		return A_res;
	}

	getAllTelRelAssetsReserveList(assetsid, pre = false) {
		var sql = "select tra.telno,tra.carid,tra.assetsid,tra.reserve_date,tra.add_edit_flg " + " from " + this.H_Tb.tel_rel_assets_reserve_tb + " as tra " + " where " + " tra.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and tra.assetsid=" + this.get_DB().dbQuote(assetsid, "text", true, "assetsid") + " and " + " exe_state=0";
		var A_res = this.get_db().queryHash(sql);
		return A_res;
	}

	getTelRelAssetsList(assetsid) {
		var sql = "select telno,carid,assetsid " + " from " + this.H_Tb.tel_rel_assets_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid");
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	getTelRelAssetsReserveList(telno, carid, date, flg) {
		var sql = "select telno,carid,assetsid,reserve_date,add_edit_flg " + " from " + this.H_Tb.tel_rel_assets_reserve_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg");
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	makeDelTelRelAssetsReserveSQL(telno, carid, assetsid, date, flg) {
		var sql = "delete from " + this.H_Tb.tel_rel_assets_reserve_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true, "assetsid") + " and " + " reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and " + " add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg") + " and " + " exe_state=0";
		return sql;
	}

	makeDelTelRelTelReserveSQL(telno, carid, rel_telno, rel_carid, date, flg) {
		var sql = "delete from " + this.H_Tb.tel_rel_tel_reserve_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " rel_telno=" + this.get_DB().dbQuote(rel_telno, "text", true, "rel_telno") + " and " + " rel_carid=" + this.get_DB().dbQuote(rel_carid, "integer", true, "rel_carid") + " and " + " reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and " + " add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg") + " and " + " exe_state=0";
		return sql;
	}

	getRelationAssetsId(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select assetsid from " + tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid");
		var A_res = this.get_DB().queryHash(sql);
		return A_res;
	}

	getAssetsReserveList(assetsid, date, flg) {
		var sql = "select assetsid,reserve_date,add_edit_flg " + " from " + this.H_Tb.assets_reserve_tb + " where " + this.makeCommonAssetsWhere(assetsid) + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg") + " and exe_state=0";
		var H_res = this.get_DB().queryHash(sql);
		return H_res;
	}

	makeDelTelReserveSQL(telno, carid, date, flg) {
		var sql = "delete from " + this.H_Tb.tel_reserve_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and " + " add_edit_flg=" + flg + " and " + " exe_state=0";
		return sql;
	}

	makeDelReserveLogSQL(H_post: {} | any[], str, str_eng, mode) {
		var reservedate_view = H_post.reserve_date.substr(0, 4) + "\u5E74" + H_post.reserve_date.substr(5, 2) + "\u6708" + H_post.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_post.reserve_date.substr(0, 4) + "/" + H_post.reserve_date.substr(5, 2) + "/" + H_post.reserve_date.substr(8, 2);
		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.telno, H_post.telno_view, H_post.carid, str + "\uFF08" + reservedate_view + "\uFF09", str_eng + "\uFF08" + reservedate_view_eng + "\uFF09", H_post.postid, "", H_post.postname, "", this.H_G_Sess.joker, mode, this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeDelAssetsReserveLogSQL(H_post: {} | any[], str, str_eng, mode) {
		var reservedate_view = H_post.reserve_date.substr(0, 4) + "\u5E74" + H_post.reserve_date.substr(5, 2) + "\u6708" + H_post.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_post.reserve_date.substr(0, 4) + "/" + H_post.reserve_date.substr(5, 2) + "/" + H_post.reserve_date.substr(8, 2);

		if (undefined !== H_post.postname == false || H_post.postname == "") {
			H_post.postname = this.getPostName(H_post.postid);
		}

		var A_val = [ManagementModelBase.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, H_post.assetsno, H_post.assetsno, H_post.assetstypeid, str + "\uFF08" + reservedate_view + "\uFF09", str_eng + "\uFF08" + reservedate_view_eng + "\uFF09", H_post.postid, "", H_post.postname, "", this.H_G_Sess.joker, mode, this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeCommonAssetsWhere(assetsid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and assetsid=" + this.get_db().dbQuote(assetsid, "integer", true, "assetsid");

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	getTelRelTelReserveList(telno, carid, date, flg) {
		var sql = "select telno,carid,rel_telno,rel_carid,reserve_date,add_edit_flg " + " from " + this.H_Tb.tel_rel_tel_reserve_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and ((telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + ")" + " or (rel_telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and rel_carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + "))" + " and reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg");
		var A_res = this.get_DB().queryHash(sql);
		return A_res;
	}

	getTelRelTelList(telno, carid) {
		var sql = "select telno,carid,rel_telno,rel_carid " + " from " + this.H_Tb.tel_rel_tel_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and ((telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + ")" + " or (rel_telno=" + this.get_DB().dbQuote(telno, "text", true, "rel_telno") + " and rel_carid=" + this.get_DB().dbQuote(carid, "integer", true, "rel_carid") + "))";
		var A_res = this.get_DB().queryHash(sql);
		return A_res;
	}

	makeDelTelRelTelSQL(telno, carid, rel_telno, rel_carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_tel_tb;
		} else {
			tb = this.H_Tb.tel_rel_tel_tb;
		}

		var sql = "delete from " + tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + " and telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and rel_telno=" + this.get_DB().dbQuote(rel_telno, "text", true, "rel_telno") + " and rel_carid=" + this.get_DB().dbQuote(rel_carid, "integer", true, "rel_carid");
		return sql;
	}

	makeAddRelationAssetsSQL(H_post, assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "insert into " + tb + " (pactid,telno,carid,assetsid,main_flg) " + " values " + " (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid") + "," + this.get_DB().dbQuote(H_post.telno, "text", true, "telno") + "," + this.get_DB().dbQuote(H_post.carid, "integer", true, "carid") + "," + this.get_DB().dbQuote(assetsid + "", "integer", true, "assetsid") + "," + this.get_DB().dbQuote(H_post.main_flg, "boolean", true, "main_flg") + ")";
		return sql;
	}

	deleteReserveProc(A_reserve, mess1, mess1_eng, mess2, date = undefined) //あれば消す
	{
		var A_sql = Array();

		for (var cnt = 0; cnt < A_reserve.length; cnt++) //内線番号が入っているか？
		//管理記録作成
		//その予約に関連電話予約があるか調べる
		//あれば消す
		//その予約に端末予約があるか調べる
		//あれば消す
		{
			if (!!A_reserve[cnt].extensionno) //内線番号の変更をするつもりだった場合
				{
					var O_extension = this.getExtensionTelModel();
					var extensionno = O_extension.getUseExtensionNo(this.H_G_Sess.pactid, A_reserve[cnt].telno, A_reserve[cnt].carid);

					if (!extensionno || extensionno != A_reserve[cnt].extensionno) {
						A_sql.push(O_extension.makeDeleteExtensionNoSQL(this.H_G_Sess.pactid, A_reserve[cnt].extensionno));
					}
				}

			A_sql.push(this.makeDelTelReserveSQL(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg));
			A_sql.push(this.makeDelReserveLogSQL(A_reserve[cnt], mess1, mess1_eng, mess2));
			var A_reltelreserve = this.getTelRelTelReserveList(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg);

			for (var lcnt = 0; lcnt < A_reltelreserve.length; lcnt++) //削除文作成
			{
				A_sql.push(this.makeDelTelRelTelReserveSQL(A_reltelreserve[lcnt].telno, A_reltelreserve[lcnt].carid, A_reltelreserve[lcnt].rel_telno, A_reltelreserve[lcnt].rel_carid, A_reltelreserve[lcnt].reserve_date, A_reltelreserve[lcnt].add_edit_flg));
			}

			var A_relreserve = this.getTelRelAssetsReserveList(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg);

			for (var rcnt = 0; rcnt < A_relreserve.length; rcnt++) //削除文作成
			//そこに紐付く端末予約の取得
			{
				A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
				var A_assreserve = this.getAssetsReserveList(A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg);

				for (var acnt = 0; acnt < A_assreserve.length; acnt++) //削除文作成
				{
					A_sql.push(this.makeDelAssetsReserveSQL(A_assreserve[acnt].assetsid, A_assreserve[acnt].reserve_date, A_assreserve[acnt].add_edit_flg));
				}
			}
		}

		return A_sql;
	}

	makeInsertChangePostSQL(H_data, deldate) {
		if ("" == H_data.postname) {
			H_data.postname = this.getPostName(H_data.postid);
		}

		var sql = "insert into change_post_tb (" + "pactid,postid,postname,telno,carid,status,date,recdate,fixdate " + ") values (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_DB().dbQuote(H_data.postid, "integer", true) + "," + this.get_DB().dbQuote(H_data.postname, "text", true) + "," + this.get_DB().dbQuote(H_data.telno, "text", true) + "," + this.get_DB().dbQuote(H_data.carid, "integer", true) + "," + this.get_DB().dbQuote("DT", "text", true) + "," + this.get_DB().dbQuote(deldate, "timestamp", true) + "," + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + "," + this.get_DB().dbQuote(this.NowTime, "timestamp", true) + ")";
		return sql;
	}

	updateDelteldateSQL(H_data, deldate) {
		var sql = "update " + this.H_Tb.tel_tb + " set delteldate=" + this.get_DB().dbQuote(deldate, "timestamp", true) + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(H_data.telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(H_data.carid, "integer", true);
		return sql;
	}

	checkUsedTerminal(telno, carid, assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno!=" + this.getDB().dbQuote(telno, "text", true) + " and " + " carid!=" + this.getDB().dbQuote(carid, "integer", true) + " and " + " assetsid=" + this.getDB().dbQuote(assetsid, "integer", true);
		var res = this.getDB().queryOne(sql);

		if (res >= 1) {
			return true;
		} else {
			return false;
		}
	}

	makeDummyTelNo() {
		var ans = false;

		while (ans == false) //ランダム文字列生成
		//対象テーブルで使用されていないか調べる
		//前月テーブルで使用されていないか調べる
		//未使用ならばその文字列を返す
		{
			var str = uniqid("dummy");
			var sql = "select count(telno) from " + this.H_Tb.tel_tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.getDB().dbQuote(str, "text", true);
			var res = this.getDB().queryOne(sql);
			sql = "select count(telno) from " + this.H_Tb.pre_tel_tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.getDB().dbQuote(str, "text", true);
			var res_pre = this.getDB().queryOne(sql);

			if (0 === res && 0 === res_pre) {
				ans = true;
			}
		}

		return str;
	}

	makeDummyTelSQL(H_post, telno, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeDummyTelValue(H_post, telno).join(",") + ")";
		return sql;
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["telno_view", "telno", "mail", "userid", "carid", "arid", "cirid", "planid", "planalert", "packetid", "packetalert", "pointstage", "buyselid", "options", "discounts", "username", "employeecode", "simcardno", "memo", "orderdate", "contractdate", "machine", "color", "webreliefservice", "recogcode", "pbpostcode", "pbpostcode_first", "pbpostcode_second", "cfbpostcode", "cfbpostcode_first", "cfbpostcode_second", "ioecode", "coecode", "commflag", "division", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "select1", "select2", "select3", "select4", "select5", "select6", "select7", "select8", "select9", "select10", "fixdate", "kousiflg", "kousiptn", "pre_telno", "pre_carid", "extensionno", "dummy_flg", "employee_class", "executive_no", "executive_name", "executive_mail", "salary_source_name", "salary_source_code", "office_code", "office_name", "building_name"];

		if ("insert" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("recdate");
		} else if ("reserve" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("movepostid");
			A_col.push("moveteldate");
			A_col.push("schedule_person_name");
			A_col.push("schedule_person_userid");
			A_col.push("reserve_date");
			A_col.push("add_edit_flg");
			A_col.push("exe_postid");
			A_col.push("exe_userid");
			A_col.push("exe_name");
			A_col.push("recdate");
			A_col.push("delete_type");
		}

		return A_col;
	}

	makeDummyTelValue(H_post, telno) {
		if (undefined !== H_post.postid == false || "" == H_post.postid) {
			H_post.postid = H_post.recogpostid;
		}

		if (undefined !== H_post.carid == false || "" == H_post.carid) {
			H_post.carid = ManagementModelBase.DUMMY_TEL_CARID;
		}

		if (undefined !== H_post.cirid == false || "" == H_post.cirid) {
			H_post.cirid = ManagementModelBase.DUMMY_TEL_CIRID;
		}

		var A_val = [this.get_DB().dbQuote(telno, "text", true), this.get_DB().dbQuote(telno, "text", true), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(H_post.carid, "integer", true), this.get_DB().dbQuote(ManagementModelBase.DUMMY_TEL_ARID, "integer", true), this.get_DB().dbQuote(H_post.cirid, "integer", true), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "timestamp"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(this.NowTime, "timestamp", true), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), "'t'", this.get_DB().dbQuote(undefined, "integer"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(undefined, "text"), this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true), this.get_DB().dbQuote(H_post.postid, "integer", true), this.get_DB().dbQuote(this.NowTime, "timestamp", true)];
		return A_val;
	}

	checkDeleteAuth(H_sess) {
		return true;
	}

	getExtensionTelModel() {
		if (!this.O_extension instanceof ExtensionTelModel) {
			this.O_extension = new ExtensionTelModel();
		}

		return this.O_extension;
	}

	__destruct() {
		super.__destruct();
	}

};