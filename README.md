# easy-cron-input

> 一个简单的 cron 表达示编辑器

![](http://ww1.sinaimg.cn/large/79414a05gy1fnf4k4u1ivj20cm03ydfp.jpg)

## 示例

```html
<!DOCTYPE HTML>
<html>
    <head>
        <title>easy-cron-input</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" name="viewport">
    </head>
    <body>     
        <easy-cron-input></easy-cron-input>
        <p>表达示: <span id="express"></span></p>
        <p>文本: <span id="text"></span></p>
        <script>
            var el = document.getElementsByTagName('easy-cron-input')[0];
            el.addEventListener('input', function(e) {
                if(e.detail) {
                    document.querySelector('#express').textContent = e.detail[0];
                    document.querySelector('#text').textContent = e.detail[1];
                }
            })
        </script>
        <script type="text/javascript" src="js/easy-cron-input-element.min.js"></script>
    </body>
</html>
```

## 编译步骤

``` bash
# 安装依赖库
npm install

# 以开发模式启动
npm run start

# 编译发布包
npm run build
```
