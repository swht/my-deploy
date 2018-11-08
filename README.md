# my-deploy  

![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000?style=plastic)
![node](https://img.shields.io/badge/node-4.x-blue.svg)
![downloads](https://img.shields.io/badge/downloads-1K%2Fmonth-brightgreen.svg)
[![Build Status](https://travis-ci.org/kelvv/my-deploy.svg?branch=master)](https://travis-ci.org/kelvv/my-deploy)


It is a **tool** for use during development or production of a node.js based application whitch power by git.

The only work you need to do is to Prepare the my-deploy configuration file for your project.

my-deploy used git to check or update your project file , so your project must under git .

my-deploy support two mode:
* **pullwatch**   :   Repeate fetch and check in a fixed time
* **webhook**   :   watching http request and check if need update the project

operator system support:    **window , mac ox , linux**

version control support:    **github , bitbucket , gitcafe  ... ... ...**

Let play!

how to use ---> [demo movie](http://v.youku.com/v_show/id_XMTYxMjc0ODg3Mg==.html)


# Installation

using [npm](http://npmjs.org/) (the recommended way):

```
$ npm install -g my-deploy
```

And my-deploy will be installed globally to your system path.

# Usage



* First of all , you need to check your envirment

 ```
$ git --version
git version 2.7.4 (Apple Git-66)
```

* Create mydeploy config file

 ```
$ cd /path/of/the/config/file/you/want/to/locate
$ mydeploy init
```

* Setup the config file what you need 
 
 ```
$ vi .mydeploy.json
---pullwatch---
*
{
       "mode": "pullwatch",
       "url": "your url of git use http",
       "localdir": "/path/of/your/local/project",
       "interval": 3000,
       "hook": {
            "postchanged": "cmd for changed"
        }
       "branch": "master",
       "rules": [
           {
               "type": "tag",
               "value": "[vV]\\d+",
               "env":[
                   "NODE_ENV=development"
               ]
          },
          {
              "type": "commit",
              "value": "#[\\s\\S]*?deploy\\s*[\\s\\S]*?77",
              "env":[
                   "NODE_ENV=development"
               ]
          }
      ]
  }
---webhook---
*
{
       "mode": "webhook",
       "url": "your project url of git use http",
       "localdir": "/path/of/your/local/project",
       "branch": "master",
       "hook": {
            "postchanged": "cmd for changed"
        }
       "port":"3100"
       "rules": [
           {
               "type": "tag",
               "value": "[vV]\\d+",
               "env":[
                    "NODE_ENV=development"
                ]
          },
          {
              "type": "commit",
              "value": "#[\\s\\S]*?deploy\\s*[\\s\\S]*?77",
              "reload":
                {
                    "special":["appRoutes","app","xxx"],
                    "cmd":"echo '我要重启了!'"
                },
              "env":[
                   "NODE_ENV=development"
               ]
          }
      ]
  }
```

* Start  

 ```
$ mydeploy start
or
$ mydeploy start -c 'path/to/config/file'
```

now , your project file will update automatically
#enjoy!

## License

  MIT


##更新

```
    Author:南非波波
    Email：qingbo.song@gmail.com
    updatetime：2018.11.08
    更新内容：增加特殊文件、目录处理规则，特殊列表中的文件及目录出现在提交记录中,触发cmd命令
	应用场景:后端文件更新、前端渲染文件更新后需要提交
```