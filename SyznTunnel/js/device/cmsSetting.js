var itemCmsJson = '';
function cmsSetting(cmsSetting){
	itemCmsJson = '';
	var cmsConfig = cmsSetting.substring(0,cmsSetting.length-1).split(";");
	$.each(cmsConfig,function(index,item){
		var itemCms = item.split(':');
		var itemCmsKey = itemCms[0];
		var itemCmsValue = itemCms[1];
		itemCmsJson +='"'+itemCmsKey+'":"'+itemCmsValue+'",';
	})
	itemCmsJson = JSON.parse('{'+itemCmsJson.substring(0,itemCmsJson.length-1)+'}');
}
/*

$('.width').val(itemCmsJson.w);
$('.height').val(itemCmsJson.h);
$('.stayTime').val(itemCmsJson.t);
$('.fontFamily').val(itemCmsJson.f);
$('.fontSize').val(itemCmsJson.e);
$('.fontColor').val(itemCmsJson.c);
$('.enterEffects').val((itemCmsJson.s).split(",")[0]);
$('.outEffects').val((itemCmsJson.s).split(",")[1]);


*/