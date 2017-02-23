/*
 * indexedlist - jQuery plugin v1.0.0
 * Copyright © 2015 by RJCMS-chp  
 * Date: 2015-08-14
 */
(function($){
	$.fn.extend({
		"indexedlist": function(options){
		   	
			if(!isValid(options))
			    return this;
			
			var opts = $.extend({},defaults,options);
			
			return this.each(function(){

				var $this = $(this),
				    $search = $this.find('.cms-indexed-list-search'),
				    $searchInput = $search.find('input'),
				    $inner = $this.find('.cms-indexed-list-inner'),
				    $bar = $this.find('.cms-indexed-list-bar'),
				    $alert = $this.find('.cms-indexed-list-alert'),
                    $li = $inner.find('li'),
                    styleEle = null;

                var contentHeight = cHeight() - opts.headHeight - opts.searchHeight;
                $inner.css('height',contentHeight);
                $bar.css('height',contentHeight);
                $bar.find('a').css({'lineHeight':contentHeight/26+'px','height':contentHeight/26});

                var bindBarEvents = function(){
					var pointElement = null;
					var findStart = function(e){
						if(pointElement){
							$this.removeClass('active');
							pointElement = null;
						}
						var point = e.changedTouches ? e.changedTouches[0] : e;
						pointElement = document.elementFromPoint(point.pageX, point.pageY);
						
						if(pointElement){
							var group = pointElement.innerText;
							if(group && group.length == 1){
								$alert.text(group);
								scrollTo(group);
							}
						}
						$this.addClass('active');
						if(opts.alertShow){
							$alert.addClass('active');
						}
						e.preventDefault();
					}
					var findEnd = function(e){
						$this.removeClass('active');
						$alert.removeClass('active');
					}
			        $bar[0].addEventListener('touchmove',function(e){ 
			            findStart(e);
			        },false);
			        $bar[0].addEventListener('touchcancel',function(e){ 
			            findEnd(e);
			        });
			        $bar[0].addEventListener('touchstart',function(e){ 
			            findStart(e);
			        },false);
			        $bar[0].addEventListener('touchend',function(e){ 
			            findEnd(e);
			        });
				}
				var bindSearchEvents = function(){
					styleEle = document.createElement('style');
                    document.head.appendChild(styleEle);

                    $searchInput[0].addEventListener('input', function(){
                        search(this.value);
                    }, false);
				}
				bindBarEvents();
                bindSearchEvents();
				var scrollTo = function(group){
			        var groupElement = $inner.find('[data-group="' + group + '"]')[0];
			        if(!groupElement){
			        	return;
			        }
			        //$inner.scrollTop(groupElement.offsetTop - (opts.searchHeight - 2));
                    $inner.animate({scrollTop:groupElement.offsetTop - (opts.searchHeight - 2)},300);
				}
				var search = function(keyword){
					var selectBuffer = [],
					itemCount = 0,
					groupIndex = -1;
                    keyword=keyword.toLowerCase();
					$.each($li,function(index, ele){
						var groups = ele.getAttribute('data-group'),
						tags = ele.getAttribute('data-tags');
						if(groups){
                            checkGroup(index,false);
						}else if(tags){
							tags = (tags || '').toLowerCase(),
							text = (ele.innerText || '').toLowerCase();
							if(tags.indexOf(keyword) < 0 && keyword && text.indexOf(keyword) < 0){
								selectBuffer.push('.cms-indexed-list-inner li' + ':nth-child(' + (index + 1) + ')');
								itemCount++;
							}
							if (index >= $li.length - 1) {
								checkGroup(index, true);
							}
						}else if(keyword){
							selectBuffer.push('.cms-indexed-list-inner li' + ':nth-child(' + (index + 1) + ')');
						}
					});
                    if(selectBuffer.length > 0){
                        styleEle.innerText = selectBuffer.join(', ') + "{display:none;}";
                    }else{
                        styleEle.innerText = "";
                    }
					function checkGroup(index, last){
                        if(itemCount >= index - groupIndex - (last ? 0 : 1)){
                            selectBuffer.push('.cms-indexed-list-inner li' + ':nth-child(' + (groupIndex + 1) + ')');
                        }
                        groupIndex = index;
                        itemCount = 0;
	                } 
				}
			});	
		}
	});
	
	var isValid = function(options){
	    return (!options || (options && typeof options === "object")) ? true : false;
	}
	var cHeight = function(){
        if(document.all){
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
        }else{
            return self.innerHeight;
        }
    }
	var defaults={
		alertShow: true,
		headHeight: 50,
		searchHeight: 45
	}
})(jQuery);
