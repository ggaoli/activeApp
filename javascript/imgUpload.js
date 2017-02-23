/*图片上传*/
/*多图*/
;(function($) {
    // 当domReady的时候开始初始化

		var
			$listMore = $('#fileList-more'),
			$warning = $('.v_info_fail'),
			$warningShowClass = 'show',
			$warningText = $warning.find('.v_show_info'),
			arr_images = [];

		var uploader =new WebUploader.Uploader({
			// 选完文件后，是否自动上传。
			auto: true,
			// 文件接收服务端。
            server: './server/fileupload.php',
            //server: 'http://127.0.0.1/fileCenter/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000014',
			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: '#filePicker-more',
			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			},
			//允许重复上传同一张图片
			duplicate: true,
            formData: {
                uid: 123
            },
            //paste: '.uploader',
            swf: 'javascript/Uploader.swf',
            chunked: true,
            chunkSize: 512 * 1024,
            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            fileNumLimit: 9,
            fileSizeLimit: 200 * 1024 * 1024, // 200 M
            fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
		});

		uploader.on('uploadSuccess', function(file, response) {
			var $li = '<div class="uploader uploaded">' +
				'<span class="bg-preview"><img src=' + response.url + '></span>' +
				'<span class="icon-del"></span></div>';

			var $li = '<div class="uploader uploaded">' +
				'<span class="bg-preview"><img src="images/a2.jpg"/></span>' +
				'<span class="icon-del" img-id="'+file.id+'"><i class="fa fa-minus-circle remove"></i></span></div>';
			arr_images.push(response.url);
			$listMore.find('.no-bullet').append($li);

            $('.no-bullet').on('click','.uploader .icon-del',function(){
                var id=$(this).attr('img-id');
                uploader.removeFile(uploader.getFile(id),true);
                $(this).parent('.uploader').remove();
                var ll=$listMore.find('.no-bullet .uploader').length;
                if(ll==9){
                    $('.uploaders>.uploader').hide();
                }else{
                    $('.uploaders>.uploader').show();
                }
            });

			var l=$listMore.find('.no-bullet .uploader').length;
			if(l==9){
				$('.uploaders>.uploader').hide();
			}else{
                $('.uploaders>.uploader').show();
            }
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

					$.toast("最多上传9张图片", "text");
                    break;
			}
		});
		uploader.on('uploadError', function(file, reason){
            alert('');
		});
})(jQuery);