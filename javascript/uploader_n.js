/*海报上传裁切*/
(function( factory ) {
    if ( !window.jQuery ) {
        alert('jQuery is required.')
    }

    jQuery(function() {
        factory.call( null, jQuery );
    });
})(function( $ ) {
// -----------------------------------------------------
// ------------ START ----------------------------------
// -----------------------------------------------------

// ---------------------------------
// ---------  Uploader -------------
// ---------------------------------
var Uploader = (function() {

    // -------setting-------
    // 如果使用原始大小，超大的图片可能会出现 Croper UI 卡顿，所以这里建议先缩小后再crop.
    var FRAME_WIDTH = 640;
    var _ = WebUploader;
    var Uploader = _.Uploader;
    var uploaderContainer = $('.uploader-container');
    var uploader, file;
    var oldPreviewImg;
    if ( !Uploader.support() ) {
        alert( 'Web Uploader 不支持您的浏览器！');
        throw new Error( 'WebUploader does not support the browser you are using.' );
    }

    // hook,
    // 在文件开始上传前进行裁剪。
    Uploader.register({
        'before-send-file': 'cropImage'
    }, {

        cropImage: function( file ) {
            console.log( '上传前裁切');
            var data = file._cropData,
                image, deferred;

            file = this.request( 'get-file', file );
            deferred = _.Deferred();

            image = new _.Lib.Image();
            console.log(image);
            deferred.always(function() {
                image.destroy();
                image = null;
            });
            image.once( 'error', deferred.reject );
            image.once( 'load', function() {
                image.crop( data.x, data.y, data.width, data.height, data.scale );
            });
            alert( data.x+'\n'+data.y+'\n'+data.width+'\n'+data.height+'\n'+data.scale+'\n');
            image.once( 'complete', function() {
                var blob, size;

                // 移动端 UC / qq 浏览器的无图模式下
                // ctx.getImageData 处理大图的时候会报 Exception
                // INDEX_SIZE_ERR: DOM Exception 1
                try {
                    alert(image._info.height);
                    blob = image.getAsBlob();
                    size = file.size;
                    file.source = blob;
                    file.size = blob.size;

                    file.trigger( 'resize', blob.size, size );
                    console.log( 'complete' );

                    deferred.resolve();
                } catch ( e ) {
                    console.log( e );
                    console.log( 'error----' );
                    // 出错了直接继续，让其上传原始图片
                    deferred.resolve();
                }
            });

            file._info && image.info( file._info );
            file._meta && image.meta( file._meta );

            image.loadFromBlob( file.source );
            return deferred.promise();
        }
    });

    return {
        init: function( selectCb ) {
            uploader = new Uploader({
                pick: {
                    id: '#filePicker',
                    multiple: false
                },

                // 设置用什么方式去生成缩略图。
                thumb: {
                    quality: 70,

                    // 不允许放大
                    allowMagnify: false,

                    // 是否采用裁剪模式。如果采用这样可以避免空白内容。
                    crop: false
                },
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
                // 禁掉分块传输，默认是开起的。
                chunked: false,

                // 禁掉上传前压缩功能，因为会手动裁剪。
                compress: /*{
                    width: 640,
                    height: 360,

                    // 图片质量，只有type为`image/jpeg`的时候才有效。
                    quality: 90,

                    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                    allowMagnify: false,

                    // 是否允许裁剪。
                    crop: false,

                    // 是否保留头部meta信息。
                    preserveHeaders: true,

                    // 如果发现压缩后文件大小比原来还大，则使用原来图片
                    // 此属性可能会影响图片自动纠正功能
                    noCompressIfLarger: false,

                    // 单位字节，如果图片大小小于此值，不会采用压缩。
                    compressSize: 0
                }*/false,

                // fileSingleSizeLimit: 2 * 1024 * 1024,

                server: 'server/fileupload.php',
                swf: 'javascript/Uploader.swf',
                fileNumLimit: 1,
                onError: function() {
                    /*var args = [].slice.call(arguments, 0);
                    alert(args.join('\n'));*/
                }
            });

            uploader.on('fileQueued', function( _file ) {
                $.showLoading('图片加载中');
                file = _file;
                uploader.makeThumb( file, function( error, src ) {
                    oldPreviewImg=$('#img-preview img');
                    //window.location.href=src;
                    if ( error ) {
                        alert('不能预览');
                        return;
                    }
                    selectCb( src );
                    $.hideLoading();
                }, FRAME_WIDTH, 1 );   // 注意这里的 height 值是 1，被当成了 100% 使用。

                $('#cropImg').popup();

            });
            uploader.on( 'uploadSuccess', function( _file, response ) {
                file=_file;
                uploader.reset();
                var a= response;
                //$.closePopup();
                if(response.url){
                    alert('aa');
                    $('#img-view img').attr('src',response.url).removeAttr('style');
                }
               /* $('#img-preview').show();
                $('#post-preview').hide();*/
            });
            uploader.on( 'uploadStart', function( _file, response ) {
               /* uploader.option( 'compress', {
                    width: 640,
                    height: 360
                });*/
            });

            uploader.on('error', function(reason) {
                switch (reason) {
                    case 'Q_TYPE_DENIED':
                        $.toast("图片加载失败", "text");
                        break;
                    case 'F_DUPLICATE':
                        $.toast("你已经选择过该图片", "text");
                        break;
                    case 'Q_EXCEED_NUM_LIMIT':
                        uploader.reset();
                        //$.toast("最多上传1张图片", "text");
                        break;
                }
            });
        },

        crop: function( data ) {
            var w=Croper.getImageSize().width;
            var scale = Croper.getImageSize().width / file._info.width;
            data.scale = scale;

            file._cropData = {
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height,
                scale: data.scale
            };
        },

        upload: function() {
            uploader.upload();
        },

        reset: function(){
            uploader.reset();
        },

        getOldPreviewImg:function(){
            return oldPreviewImg;
        },

        getFiles:function(){
           return uploader.getFiles();
        }
    }
})();
// ---------------------------------
// ---------  Crpper ---------------
// ---------------------------------
    var Croper = (function() {
        var container = $('.cropper-wraper');
        var $image = container.find('.img-container img');
        //var btn = $('.upload-btn');
        var btn = $('.sure_upload');
        var isBase64Supported, callback;
        var give_up_btn = $('.give-up-upload-btn');
        var h=$(window).height()-50;
        $image.cropper({
            aspectRatio: 16 / 9,
            preview: ".img-preview",
            background: false,//是否在容器上显示网格背景
            movable: false,//是否允许移动剪裁框
            resizable: false,//是否允许改变剪裁框的大小
            zoomable: true,//是否允许放大缩小图片
            touchDragZoom: true,//是否允许通过触摸移动来缩放图片
            minContainerHeight:h,
            autoCropArea:1,
            guides:false,
            dragCrop:false,
            crop: function (data) {
                 /*$dataX.val(Math.round(data.x));
                 $dataY.val(Math.round(data.y));
                 $dataHeight.val(Math.round(data.height));
                 $dataWidth.val(Math.round(data.width));
                 $dataRotate.val(Math.round(data.rotate));*/
               // var a=data;
                var a=Croper.getImageSize().width;
            }
        });

        function srcWrap( src, cb ) {
            // we need to check this at the first time.
            if (typeof isBase64Supported === 'undefined') {
                (function() {
                    var data = new Image();
                    var support = true;
                    data.onload = data.onerror = function() {
                        if( this.width != 1 || this.height != 1 ) {
                            support = false;
                        }
                    }
                    data.src = src;
                    isBase64Supported = support;
                })();
            }

            if ( isBase64Supported ) {
                cb( src );
            } else {
                // otherwise we need server support.
                // convert base64 to a file.
                $.ajax('server/preview.php', {
                    method: 'POST',
                    data: src,
                    dataType:'json'
                }).done(function( response ) {
                    if (response.result) {
                        cb( response.result );
                    } else {
                        alert("预览出错");
                    }
                });
            }
        }

        btn.on('click', function() {
            var f=Uploader.getFiles();
            if(f.length==0){
            }else{
                $.showLoading('正在设置');
                setTimeout(function(){
                    $.hideLoading();
                    $.toast("操作成功",function(){
                        $.closePopup();
                    });
                },1500);
                callback && callback($image.cropper("getData"));
            }

            return false;
        });
        give_up_btn.on('click', function() {
            Uploader.reset();
           var img= Uploader.getOldPreviewImg();
            $('#img-preview').html(img);
            $.closePopup();
            return false;
        });

        return {
            setSource: function( src ) {
                //$image.cropper("replace", src);
                // 处理 base64 不支持的情况。
                // 一般出现在 ie6-ie8
                srcWrap( src, function( src ) {
                    $image.cropper("replace", src);
                });
                //$image.cropper("replace", src);
                container.removeClass('webuploader-element-invisible');
                return this;
            },

            getImageSize: function() {
                var img = $image.get(0);
                //alert(img.naturalWidth+'\n'+img.naturalHeight);
                return {
                    width: img.naturalWidth,
                    height: img.naturalHeight
                }
            },

            setCallback: function( cb ) {
                callback = cb;
                return this;
            },

            disable: function() {
                $image.cropper("disable");
                return this;
            },

            enable: function() {
                $image.cropper("enable");
                return this;
            }
        }
    })();


// ------------------------------
// -----------logic--------------
// ------------------------------
    var container1 = $('.cropper-wraper');

    Uploader.init(function( src ) {
        Croper.setSource( src );
        var cropperhidden=$(container1).find('img')[0];
        $(cropperhidden).attr('src',src);
        // 隐藏选择按钮。
        //container.addClass('webuploader-element-invisible');

        // 当用户选择上传的时候，开始上传。
        Croper.setCallback(function( data ) {
         Uploader.crop(data);
         Uploader.upload();
         });
    });


// -----------------------------------------------------
// ------------ END ------------------------------------
// -----------------------------------------------------
});