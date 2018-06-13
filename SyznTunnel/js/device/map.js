function initialize(){
	 function g_map() { }  
	 g_map.prototype.tileSize = new google.maps.Size(256, 256);//瓦片大小  
	 g_map.prototype.maxZoom = 14;//允许最大缩放层级  
	 g_map.prototype.minZoom = 10;//允许最小缩放层级  
	 //g_map.prototype.name = "本地地图";  
	 g_map.prototype.getTile = function (coord, zoom, ownerDocument) {  
		   var img = ownerDocument.createElement("img");  
		   img.style.width = this.tileSize.width + "px";  
		   img.style.height = this.tileSize.height + "px";  
		   //定义瓦片的相对路径  
		   var strURL = '/img/maptile/googlemaps/roadmap/';  
		   //其中zoom为层级，x可以理解为该瓦片在整个地图中的列数，y为行数，图片格式下载的时候选择png或者jpg，我这里是png格式  
		   strURL += zoom + "/" + coord.x + "/" + coord.y + '.png';  
		   img.src = strURL;  
		   return img;  
	 };  
	 var localMap = new g_map();  
	 var myOptions = {  
		   center: new google.maps.LatLng(39.41895551215511, 116.20033264160156), //地图中心坐标  （廊涿）
//		   center: new google.maps.LatLng(39.907544,118.142467), //地图中心坐标  （唐山）
		   zoom: 12,    //地图层级  
		   mapTypeControl: true,  //默认右上角显示地图名称  
		   mapTypeControlOptions: {  
		   mapTypeIds: ['satel', 'localMap']  
	  	}  
	 };  
	 //创建一个map对象，以下代码使用参数(myOptions)在<div> 元素 (id为map_canvas) 创建了一个新的地图，并默认在地图右上角显示 卫星影像和电子地图切换  
	 var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);  
	 map.mapTypes.set('localMap', localMap);  
	 map.setMapTypeId('localMap'); //设置默认显示的地图为本地地图
	 window.map = map;//将map变量存储在全局  
 }

  //鼠标移上去显示坐标
  function ShowPoint(){
     google.maps.event.addListener(map, 'click', function(event){    
    	 $('#longitude').val(event.latLng.d);
    	 $('#latitude').val(event.latLng.e);
      });
  }       
function ShowPoint1(){
     google.maps.event.addListener(map, 'click', function(event){    
    	 $('.beginLongitude').val(event.latLng.d);
    	 $('.beginLatitude').val(event.latLng.e);
    	 $('#lonAndLat').modal('hide');
      });
  } 	
  // 画线
function drowLine(color,weight,opacity){
    var points=[];
	$.each(data,function(index,item){
		var point = new google.maps.LatLng(item[0],item[1]);
		points.push(point);
	})
	var polylineOptions = {          
	   path: points,         
	   strokeColor: color, 
	   strokeOpacity: opacity,        
	   strokeWeight: weight        
	};     
	var polyline = new google.maps.Polyline(polylineOptions);
	polyline.setMap(map)
}
