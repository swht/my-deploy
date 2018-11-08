'use strict';
const log = load('/lib/utils/log').get('app');
const rulesCheck = load('/lib/monitor/rulescheck');
const co = load('co');
const gitcommand = load('/lib/utils/gitcommand');
const command = load('/lib/utils/command');

let repConfig;
let isUpdating = false;

module.exports = {
	start: (config) => {
		return new Promise((resove) => {
			co(function* () {
				log.debug(config);
				repConfig = config;
				let msg = yield gitcommand.GitCall(`git checkout ${repConfig.branch}`, repConfig.localdir);
				resove(msg);
			});
		});
	},
	beat: () => {
		return new Promise((resove) => {
			co(function* () {
				if (isUpdating) {
					log.info('is updating,please wait');
					return;
				}

				log.debug('check rules');
				//1. checkout
				let isNeed = yield rulesCheck.check(repConfig).catch(function (err) {
					log.error(err);
				});
				if (!isNeed) {
					log.info("don't need update");
					resove("don't need update");
					return;
				}

				log.debug('end check');

				log.debug('begin update code');
				isUpdating = true;
				let msg = yield gitcommand.GitCall(`git pull origin ${repConfig.branch}`, repConfig.localdir);
				if (repConfig.hook && repConfig.hook.postchanged) {
					let result = yield command.exec(repConfig.hook.postchanged);
					log.debug(result);
				}
				isUpdating = false;
				log.debug('end update');
				resove(msg);
				log.info(msg);
				for (let rule of repConfig.rules) {
					if (rule.reload && rule.reload.special && rule.reload.cmd) {
						/**
						 * 增加特殊文件、目录处理规则，特殊列表中的文件及目录出现在提交记录中,触发cmd命令
						 * 应用场景:后端文件更新、前端渲染文件更新后需要提交
						 * Author：南非波波 
						 * Email：qingbo.song@gmail.com
						 */
						let special = rule.reload.special; //特殊列表
						let specialCmd = rule.reload.cmd; //执行的命令
						let msgarr = msg.split('\n');
						let msgarrlegth = msg.split('\n').length;
						for (let subspecial of special) {
							if (msgarr[i].indexOf(subspecial) >= 0) {
								let specialCmdresult = yield command.exec(specialCmd);
								log.info("specialCmdresult is ",specialCmdresult);
							}
						}
					}
				}
			});
		});
	}
};