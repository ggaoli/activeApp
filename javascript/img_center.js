/*图片居中*/
$(function(){
    $('.center-img').find('img').load(function(){
        centerPicLoad();
    });
    centerPicLoad();

});
function centerContainerPic(container){
    $(container).find('.center-img-container img').each(function(index,val){
        var container_w=$(this).parent('.center-img-container').width();
        var container_h=$(this).parent('.center-img-container').height();
        var w=container_w;
        var h=container_h;
        var thisW,thisH, pRadio;
        var _this=$(this);
        thisW=_this.width();
        thisH=_this.height();
        pRadio=thisW/thisH;
        if(pRadio>1 || pRadio==1){
            if(thisH>h && thisW>w || thisH==h ){


                _this.css({
                    'width':h*thisW/thisH+'px',
                    'height':h+'px',
                    'left':-(h*thisW/thisH-w)/2+'px'
                });
            }
            else if(thisH>h && thisW<w){
                _this.css({
                    'width':w+'px',
                    'height':w*thisH/thisW+'px'
                });
            }
            else if(thisH<h && thisW>w || thisW==w){
                _this.css({
                    'width':h*thisW/thisH+'px',
                    'height':h+'px',
                    'left':-(h*thisW/thisH-w)/2+'px'
                });
            }
            else if(thisH<h && thisW<w){
                _this.css({
                    'width':thisW*h/thisH+'px',
                    'height':h+'px',
                    'left':-(thisW*h/thisH-w)/2+'px'
                });
            }
        }
        else if(pRadio<1){
            if(thisW>w && thisH>h || thisW==w ){
                _this.css({
                    'width':w+'px',
                    'height':w*thisH/thisW+'px',
                    'top':-(w*thisH/thisW-h)/2+'px'
                });
            }
            else if(thisW>w && thisH<h){
                _this.css({
                    'width':w+'px',
                    'height':w*thisH/thisW+'px'
                });
            }
            else if(thisW<w || thisW==w && thisH>h || thisH==h){
                _this.css({
                    'width':h*thisW/thisH+'px',
                    'height':h+'px'
                });
            }
            else if(thisW<w && thisH<h ){
                _this.css({
                    'width':w+'px',
                    'height':w*thisH/thisW+'px'
                });
            }
        }
    })
}
function centerPicLoad(){
    $('.center-img').each(function(){
        centerContainerPic(this);
    });
}