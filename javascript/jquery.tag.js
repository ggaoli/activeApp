var Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments)
        }
    }
};
var Tag = Class.create();
Tag.prototype = {
    initialize: function(id, param) {
        this.id = id;
        this.param = param
    },
    setDataParser1: function(func) {
        this.dataParser1 = func
    },
    setDataParser2: function(func) {
        this.dataParser2 = func
    },
    setOnchange: function(js) {
        return this.change = js
    },
    loadTag: function() {
        var self = this;
        if (this.param.remark != "null" && this.param.remark != undefined && this.param.remark != "") {
            jQuery("#" + this.id + "").html('<input type="hidden" id="input-' + this.id + '" name="' + this.id + '" class="tags"/>' +
            '<label id="r-' + this.id + '" style="float:left;">' + this.param.remark + "</label>" +
            '<div id="mycard-' + this.id + '" style="display:none;">' + '<div class="default-tag tagbtn"><div class="tagstitle">'+this.param.tagstitle+'</div>' + '<div id="reco-' + this.id + '"></div></div></div>')
        } else {
            jQuery("#" + this.id + "").html('<input type="hidden" id="input-' + this.id + '" name="' + this.id + '" class="tags"/>' +
            '<div id="mycard-' + this.id + '" style="display:none;">' +
            '<div class="default-tag tagbtn"><div class="tagstitle">'+this.param.tagstitle+'</div>' +
            '<div id="reco-' + this.id + '" class="clearfix"></div></div></div>')
        }
        jQuery("#" + this.id + "").after('<div id="tip_' + this.id + '" class="select2-tip" style="display:none"></div>');
        if (this.param.listUrl != "" && this.param.listUrl != undefined && this.param.listUrl != null) {
            jQuery("#input-" + this.id + "").select2({
                width: this.param.width,
                tags: true,
                tokenSeparators: [",", " "],
                placeholder: (this.param.grayTip == "null" ? "标签输入用回车、空格、或逗号隔开": this.param.grayTip),
                multiple: true,
                maximumSelectionSize: this.param.maxInput,
                quietMillis: 250,
                formatMatches: function(matches) {
                    if (matches === 1) {
                        return "一个结果是可用的，按回车键选择."
                    }
                    return matches + " 结果是可用的，使用上下箭头键来导航."
                },
                formatNoMatches: function() {
                    return "没有找到结果"
                },
                formatAjaxError: function(jqXHR, textStatus, errorThrown) {
                    return "加载失败"
                },
                formatInputTooShort: function(input, min) {
                    var n = min - input.length;
                    return "请输入 " + n + " 个字符或者更多"
                },
                formatInputTooLong: function(input, max) {
                    var n = input.length - max;
                    return "请删除 " + n + " 字符"
                },
                formatSelectionTooBig: function(limit) {
                    return "你只能输入 " + limit + " 个"
                },
                formatLoadMore: function(pageNumber) {
                    return "加载更多的结果…"
                },
                ajax: {
                    url: this.param.listUrl,
                    dataType: "json",
                    data: function(term) {
                        return {
                            q: term
                        }
                    },
                    results: function(data) {
                        if (self.param.isdataPs1) {
                            var arr = new Array();
                            jQuery.each(data,
                                function(i, val) {
                                    arr[i] = self.dataParser1(val)
                                });
                            data = arr;
                            return {
                                results: data
                            }
                        } else {
                            return {
                                results: data
                            }
                        }
                    }
                },
                createSearchChoice: function(term, data) {
                    var text = term + (data.some(function(r) {
                            return r.text == term
                        }) ? "": " (新标签)");
                    if (self.param.isCreateTagGrant != "" && self.param.isCreateTagGrant != undefined && self.param.isCreateTagGrant != null) {
                        if (self.param.isCreateTagGrant == "1") {
                            if (text == term) {
                                return
                            } else {
                                return {
                                    id: text,
                                    text: text
                                }
                            }
                        } else {
                            if (self.param.isCreateTagGrant == "0") {
                                if (text == term) {
                                    return
                                } else {
                                    jQuery("#tip_" + self.id + "").html("您没有新建标签的权限");
                                    jQuery("#tip_" + self.id + "").css("display", "block");
                                    setTimeout(function() {
                                            jQuery("#tip_" + self.id + "").css("display", "none");
                                            jQuery("#tip_" + self.id + "").html("")
                                        },
                                        1000)
                                }
                            }
                        }
                    } else {
                        if (text == term) {
                            return
                        } else {
                            return {
                                id: text,
                                text: text
                            }
                        }
                    }
                },
                formatResult: function(term) {
                    return "<div class='select2-user-result'>" + term.text + "</div>"
                },
                formatSelection: function(term) {
                    if (term.text.indexOf("(新标签)") > 0) {
                        return term.text.replace(" (新标签)", "")
                    } else {
                        return term.text
                    }
                }
            });
            if (this.param.isReco == true) {
                this.loadReco()
            }
        } else {
            jQuery("#input-" + this.id + "").select2({
                tags: this.param.tagVal,
                tokenSeparators: [",", " "],
                placeholder: "最多只输入" + this.param.maxInput + "个标签且标签用',''空格'隔开",
                multiple: true,
                maximumSelectionSize: this.param.maxInput
            });
            if (this.param.isReco == true) {
                this.loadReco()
            }
        }
        if (this.param.setValue != null && this.param.setValue != undefined && this.param.setValue != "") {
            var setVl = this.param.setValue;
            var set = jQuery.parseJSON(setVl);
            var arr = new Array();
            jQuery.each(set,
                function(i, val) {
                    var s = self.dataParser1(val);
                    arr.push(s)
                });
            jQuery("#input-" + this.id + "").select2("data", arr).trigger("change")
        }
    },
    loadReco: function() {
        var self = this;
        var childId = this.id;
        var maxInput = this.param.maxInput;
        if (this.param.recoUrl != "" && this.param.recoUrl != undefined && this.param.recoUrl != null) {
            jQuery.ajax({
                type: "POST",
                dataType: "json",
                url: this.param.recoUrl,
                success: function(data) {
                    jQuery.each(data,
                        function(i, val) {
                            val = self.dataParser2(val);
                            if (self.param.isdataPs2) {
                                jQuery("#reco-" + self.id + "").append('<a id="tag_' + self.id + "_" + i + '" title="' + val.text + '"' + ' href="javascript:void(0);">' + "" + "<span>" + val.text + "</span><em></em></a>");
                                if (val.isSystem == "1") {
                                    jQuery("#tag_" + self.id + "_" + i + "").addClass("isSystem-tag")
                                }
                            } else {
                                jQuery("#reco-" + self.id + "").append('<a id="tag_' + self.id + "_" + i + '" title="' + val.text + '"' + ' href="javascript:void(0);">' + +"" + "<span>" + val.text + "</span><em></em></a>");
                                if (val.isSystem == "1") {
                                    jQuery("#tag_" + self.id + "_" + i + "").addClass("isSystem-tag")
                                }
                            }
                            jQuery("#tag_" + self.id + "_" + i + "").click(function() {
                                var it = jQuery("#input-" + childId + ""),
                                    vl = it.select2("data"),
                                    nvl = val;
                                jQuery(this).addClass("tag-selected");
                                if (vl && vl.length > 0) {
                                    if (vl.length >= maxInput) {
                                        jQuery(this).removeClass("tag-selected");
                                        jQuery("#tip_" + childId + "").html("你只能输入 " + self.param.maxInput + " 个");
                                        jQuery("#tip_" + childId + "").css("display", "block");
                                        setTimeout(function() {
                                                jQuery("#tip_" + childId + "").css("display", "none");
                                                jQuery("#tip_" + childId + "").html("")
                                            },
                                            2000);
                                        return
                                    }
                                    vl.push(val);
                                    nvl = vl
                                }
                                it.select2("data", nvl).trigger("change")
                            })
                        });
                    jQuery("#input-" + childId + "").on("select2-removed",
                        function(e) {
                            var k;
                            jQuery.each(data,
                                function(n, value) {
                                    value = self.dataParser2(value);
                                    if (e.val == value.text) {
                                        k = n
                                    }
                                });
                            jQuery("#tag_" + self.id + "_" + k + "").removeClass("tag-selected")
                        })
                },
            });
            jQuery("#mycard-" + this.id + "").show()
        }
    }
};