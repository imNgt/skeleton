Skeleton
=========
 


## 依赖 
```html
<link href="stylesheet" type="text/css" href="main.css">
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="skeleton.js"></script>
```
      


## Skeleton.dount
环形统计图 

```html
<div id="dount"></div>	
``` 
```javascript 
dount=Skeleton.dount({
	id:"dount",
	radius:60,    
	data:[
		{ value: 20, name: "data1" },
		{ value: 20, name: "data2" },
		{ value: 20, name: "data3" },
		{ value: 20, name: "data4" },
	]
})    
```
## Skeleton.ripple
为组件添加水波纹效果 

```html
<button class="btn">Button</button> 
``` 
```javascript 
Skeleton.ripple({
    elem:".btn"//渲染的元素     
})    
```
## Skeleton.timepicker
环形时间选择组件

```html
<div class="sk-timepicker"></div>
``` 
```javascript 
Skeleton.timepicker({
	elem:".sk-timepicker"//渲染的元素     
}) 
``` 
     


## License
MIT
