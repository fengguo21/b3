# huaqie-wewap-ienglish 爱英语


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 昀活网络

### 色值
- 按钮色 #FF6666
- 红色字体 #FF4D4D

### 正则匹配
```
- /(《)((\w+)\s\w)+(》)/g  匹配出为《XXX xxx》类型内容
- /\w+/g 匹配出所有在《》中的单词
```

### 手动调整title
```
	beforeCreate() { // 页面加载之前调整 title, 此部分同时控制转场
		console.log(document.title); // before reset title
		document.title = '我的'; // title name
	}
```

### 关于rem的换算尺寸

> 当前换算是根据ip6的设计稿大小进行换算的，也就是说设计稿的 10px === 0.1rem

### 关于样式的单位

> 尽量使用flex或者百分比，来自适应，当然rem也可以。

### 关于项目结构的说明

> 主结构分为3个目录 mine(我的) 、project(精读计划) 、 material(免费资料) <br />
需要注意，其他页面在各自所属主目录下根据功能划分文件夹

### 关于组件

> 类似功能的组件都存放在components目录下，根据功能起名 <br />
封装的组件需要由高度的可插拔行和复用性

### 组件用法
 
- ```mode-header```引入，直接在标签内填写任意内容，或使用```title```向子组件传递数据

- ```bottom-fix```引入，可利用标签slot入组件或直接向组件传递```title```，控制mask显示隐藏的是```isShow```通过父组件传入，监听```show```控制显示隐藏，```list```为空时，不存在mask，后续事件以后填入

- ```star-works```引入，同样可以通过slot和组件传递两种方法设置组名，组件传递一个对象包含了之后所有的信息

- ```course-list-item```引入，文章列表的成员组件，直接以```val```传递文章的解锁状态、id、标题，自带点击事件。

- ```read-swiper```引入，一个仅支持图片轮播的插件<br />

> Attr

| 属性名 | 属性值类型 | 属性默认值 | 是否必填 |属性说明|
|:------:|:------:|:------:|:------:|:------:|
|imgUrl  |  Array |无      |true    |图片数组|
|speed   | Number |500(ms) |false	|切换速度|
|showController|Boolean|false| false|是否显示开始录音的按钮|
|showOption    |Boolean|true | false|是否显示左右切换按钮|
|showIndicators|Boolean|true | false|是否显示页码指示器|
|isRecord	   |Boolean|false| false|是否录音(如显示录音控制器则需要结合record组件使用并且属性值必填)|

> Event

| 方法名 | 需要参数 | 说明   |
|:------:|:------:  |:------:|
| show	 |	无      |控制录音控件的显示|
| hide	 |  无      |控制录音控件的隐藏|

- [ ] ```record```引入，录音组件

> Attr

| 属性名 | 属性值类型 | 属性默认值 | 是否必填 |属性说明|
|:------:|:------:|:------:|:------:|:------:|
|btntext | String/Number|无      |false    |底部按钮文字|
|show    | Boolean|		 无		 |false	   |如结合阅读器使用则为必填属性|

- ```audio-control```引入，简易的音乐播放器插件<br />

> Attr

| 属性名 | 属性值类型 | 属性默认值 | 是否必填 |属性说明|
|:------:|:------:|:------:|:------:|:------:|
|file    | String |无      |true    |播放文件路径|



### 通用样式

#### 表单

> 需要引入form.scss

- 基础dom结构<br />

```
<div class="form-wrap"> // form的最外层容器
	<div class="form-item border-b"> // form中的每一行
		<span class='label'>计划名称</span> // label容器
		<span class='value'>0-6岁一年精读计划</span> // value容器
	</div>
</div>
```

#### 关于滚动
```this.$scrollTo(element)```

> 滚动到指定的元素 

### todos

- [ ] some other pages need to do