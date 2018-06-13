//	  设备状态	Status 1-正常 2-故障 3-通讯断 4-停用
function switchStatus(status){   
	var isStatus = ""
    switch (status) {
            case 0:
            	isStatus = "未知";
                break;
            case 1:
            	isStatus = "正常";
                break;
            case 2:
            	isStatus = "故障";
                break;
            case 3:
            	isStatus = "通讯断";
                break;
        }
    return isStatus;
  }
//所在位置 Position 1-上行， 2-下行，3-收费站
function switchPosition(Position){
   	var isPosition = ""
    switch (Position) {
            case 1:
            	isPosition = "上行";
                break;
            case 2:
            	isPosition = "下行";
                break;
            case 3:
            	isPosition = "收费站";
                break;
            
        }
    return isPosition;
}
