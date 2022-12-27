//===========================================================================
//�@�\�F�V�~�����[�V�����蓮���͏������Z�b�g�v���Z�X
//
//�쐬�F�X��
//===========================================================================
//�v���Z�X���������
//���s�\����
//===========================================================================
//�@�\�F�V�~�����[�V�����蓮���͏������Z�b�g�v���Z�X
error_reporting(E_ALL);

require("lib/process_base.php");

require("lib/update_recom_base3.php");

require("lib/update_recom_docomo3.php");

require("lib/update_recom_au3.php");

require("lib/update_recom_softbank3.php");

require("lib/update_recom_index3.php");

const G_PROCNAME_RECOM3_RESET = "recom_reset3v";
const G_OPENTIME_RECOM3_RESET = "0000,2400";

//�@�\�F�R���X�g���N�^
//�����F�v���Z�X��(���O�ۑ��t�H���_�Ɏg�p����)
//���O�o�̓p�X(�E�[�̓p�X��؂蕶��/���݂���t�H���_)
//�f�t�H���g�̉c�Ǝ���
//�@�\�F���̃v���Z�X�̓��{�ꏈ������Ԃ�
//-----------------------------------------------------------------------
//�@�\�F�ڋq���̏��������s����
//�����F�ڋqID
//��ƃt�@�C���ۑ���
//�Ԓl�F�[���ȃG���[������������false��Ԃ�
class ProcessRecomReset extends ProcessDefault {
	constructor(procname, logpath, opentime) {
		super(procname, logpath, opentime);
	}

	getProcname() {
		return "\uFFFDV\uFFFD~\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD[\uFFFDV\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u84EE\uFFFD\uFFFD\uFFFD\u034F\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFDZ\uFFFDb\uFFFDg\uFFFDv\uFFFD\uFFFD\uFFFDZ\uFFFDX";
	}

	executePactid(pactid, logpath) //�X�V�^���쐬����
	//is_save��false�ŁAis_manual��true�ŁA���s�����̃��R�[�h���A
	//details_tb����폜���āA
	//index_tb�͔N���𓖌��ɂ��ăX�e�[�^�X�����s�ҋ@�ɂ���
	//is_manual��true
	{
		var O_index = new UpdateRecomIndex(this.m_listener, this.m_db, this.m_table_no);
		var A_simid = O_index.getSimID(pactid, [UpdateRecomIndex.g_status_end], undefined, undefined, [false], [true]);

		if (A_simid.length) //sim_details_tb����폜����
			{
				if (!O_index.deleteSimID(A_simid, logpath + "sim_details_tb.delete", false)) {
					this.putError(G_SCRIPT_WARNING, "sim_details_tb(\uFFFD\u84EE\uFFFD\uFFFD)\uFFFD\uD3DC\uFFFD\uFFFD\uFFFDs");
					return false;
				}

				O_index.updateStatus(A_simid, UpdateRecomIndex.g_status_wait, {
					year: this.m_year,
					month: this.m_month
				});
			}

		return true;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_HAND) log = G_LOG_HAND;
var proc = new ProcessRecomReset(G_PROCNAME_RECOM3_RESET, log, G_OPENTIME_RECOM3_RESET);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);