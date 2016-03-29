
var AppGlobal = {
    New: function () {

        var obj = {};



        return obj;
    }
}

var MenuObj = {
    New: function () {
        var obj = {};

        var svrObj = SvrObj.New();

        var inx = 0;

        obj.data = svrObj.getMenuArray();

        obj.menuTplFactry = function (data, tempHtml) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].menus != null && data[i].menus.length > 0) {
                    tempHtml += ' <li class="expand"><span>' + data[i].text + '</span> <ul> '
                    tempHtml = this.menuTplFactry(data[i].menus, tempHtml);
                    tempHtml += ' </ul> </li>'
                }
                else {
                    tempHtml += ' <li><span ms-click="clickMenu(this)" href=' + data[i].href + '>' + data[i].text + '</span></li> '
                }
            }
            return tempHtml;
        };

        obj.getMenuTpl = function () {
            return this.menuTplFactry(this.data, '');
        };

        obj.domToObj = function (menuDom) {

            var temp = {
                href: $(menuDom).attr('href'),
                text: $(menuDom).text(),
                ico: $(menuDom).attr('class'),
                index: inx,
                isMaximize: true
            };

            if (IS_NULL(temp.href)) {
                return null;
            }
            inx = inx++;
            return temp;
        };

        return obj;
    }
};


var PanelObj = {
    New: function () {

        var obj = {};
        var panelObj = $('#main_panel');

        var dragging = {
            pointX: 0,
            pointY: 0,
            lockObj: null //只能拖动被锁定的对象，按下鼠标所在的对象将被锁定
        };

        //伸缩
        {
            var theobject = null; //This gets a value as soon as a resize start
            var resizeObject = function () {
                this.el = null; //pointer to the object
                this.dir = "";      //type of current resize (n, s, e, w, ne, nw, se, sw)
                this.grabx = null;     //Some useful values
                this.graby = null;
                this.width = null;
                this.height = null;
                this.left = null;
                this.top = null;
            }
            //Find out what kind of resize! Return a string inlcluding the directions
            var getDirection = function (el) {
                var xPos, yPos, offset, dir;
                dir = "";

                xPos = window.event.offsetX;
                yPos = window.event.offsetY;

                offset = 8; //The distance from the edge in pixels

                if (yPos < offset) dir += "n";
                else if (yPos > el.offsetHeight - offset) dir += "s";
                if (xPos < offset) dir += "w";
                else if (xPos > el.offsetWidth - offset) dir += "e";

                return dir;
            }

            var getReal = function (el, type, value) {
                temp = el;
                while ((temp != null) && (temp.tagName != "BODY")) {
                    if (eval("temp." + type) == value) {
                        el = temp;
                        return el;
                    }
                    temp = temp.parentElement;
                }
                return el;
            }

            obj.flex = function (event) {

                document.onmousemove = function () {
                    var el, xPos, yPos, str, xMin, yMin;
                    xMin = 8; //The smallest width possible
                    yMin = 8; //             height

                    el = getReal(event.srcElement, "className", "resizeMe");

                    if (el.className == "resizeMe") {
                        str = getDirection(el);
                        //Fix the cursor 
                        if (str == "") str = "default";
                        else str += "-resize";
                        el.style.cursor = str;
                    }

                    //Dragging starts here
                    if (theobject != null) {
                        if (dir.indexOf("e") != -1)
                            theobject.el.style.width = Math.max(xMin, theobject.width + window.event.clientX - theobject.grabx) + "px";

                        if (dir.indexOf("s") != -1)
                            theobject.el.style.height = Math.max(yMin, theobject.height + window.event.clientY - theobject.graby) + "px";

                        if (dir.indexOf("w") != -1) {
                            theobject.el.style.left = Math.min(theobject.left + window.event.clientX - theobject.grabx, theobject.left + theobject.width - xMin) + "px";
                            theobject.el.style.width = Math.max(xMin, theobject.width - window.event.clientX + theobject.grabx) + "px";
                        }
                        if (dir.indexOf("n") != -1) {
                            theobject.el.style.top = Math.min(theobject.top + window.event.clientY - theobject.graby, theobject.top + theobject.height - yMin) + "px";
                            theobject.el.style.height = Math.max(yMin, theobject.height - window.event.clientY + theobject.graby) + "px";
                        }

                        window.event.returnValue = false;
                        window.event.cancelBubble = true;
                    }
                };
                $(document).unbind('mouseup').mouseup(function () {
                    if (theobject != null) {
                        theobject = null;
                    }
                });

                var el = getReal(event.srcElement, "className", "resizeMe1");

                if (el == null) {
                    theobject = null;
                    return;
                }

                dir = getDirection(el);
                if (dir == "") return;

                theobject = new resizeObject();

                theobject.el = el;
                theobject.dir = dir;

                theobject.grabx = window.event.clientX;
                theobject.graby = window.event.clientY;
                theobject.width = el.offsetWidth;
                theobject.height = el.offsetHeight;
                theobject.left = el.offsetLeft;
                theobject.top = el.offsetTop;

                window.event.returnValue = false;
                window.event.cancelBubble = true;

                event.stopPropagation();
            }
        }

        //移动
        obj.move = function (event) {

                //鼠标移动
                document.onmousemove = function (event) {
                    //正文内容窗口拖拽

                    if (!IS_NULL(dragging.lockObj)) {

                        var event = event || window.event;
                        var X = event.clientX - dragging.pointX;
                        var Y = event.clientY - dragging.pointY;


                        if (panelObj.offset().left > X) {//操作最大边界
                            dragging.lockObj.css({ "left": panelObj.offset().left + "px" });
                        }
                        else {
                            dragging.lockObj.css({ "left": X + "px" });
                        }

                        if (panelObj.offset().top > Y) {//操作最大边界
                            dragging.lockObj.css({ "top": panelObj.offset().top + "px" });
                        }
                        else {
                            dragging.lockObj.css({ "top": Y + "px" });
                        }

                        return false;
                    }

                };

                //鼠标弹起取消拖动
                $(document).unbind('mouseup').mouseup(function (event) {

                    //正文内容窗口
                    if (dragging.lockObj !== null) {
                        dragging.lockObj = null;
                        event.cancelBubble = true;
                    }

                });

                //pointX, pointY, dragging这个三个参数是全局参数在 main.js 中定义
                var contentBox = $(event.target).parents('.panel-box');
                dragging.lockObj = contentBox;
                dragging.pointX = event.clientX - contentBox.offset().left;
                dragging.pointY = event.clientY - contentBox.offset().top;
                contentBox.setCapture && contentBox.setCapture();

                event.stopPropagation();
            }
        
        obj.changeSize = function (isMaximize, dom) {
            if (isMaximize)
                $(dom).parents('.panel-box').css({ 'width': '50%', 'height': '70%', 'left': panelObj.offset().width / 2, 'top': panelObj.offset().height / 2 });
            else
                $(dom).parents('.panel-box').css({ 'width': '100%', 'height': '96%', 'left': panelObj.offset().left, 'top': panelObj.offset().top });

        };

        obj.activate = function (event, action) {

            var targetIndex = 0;
            var targetObj = null;

            targetObj = $(event.target.parentElement);
            targetIndex = parseInt(targetObj.css("z-index"));

            var otherPanels = panelObj.find('.panel-box').not(targetObj);

            for (var i = targetIndex; i < otherPanels.length; i++) {
                for (var j = targetIndex + 1; j < otherPanels.length; j++) {
                    var temp = otherPanels[i];
                    if (parseInt($(otherPanels[i]).css("z-index")) > parseInt($(otherPanels[j]).css("z-index"))) {
                        otherPanels[i] = otherPanels[j];
                        otherPanels[j] = temp;
                    }
                }
            }


            if (otherPanels.length > 0) {
                for (var i = 0; i < otherPanels.length; i++) {
                    otherPanels.eq(i).css("z-index", i);
                }
                targetObj.css("z-index", otherPanels.length)
            }

            if (action === 'move')
                obj.move(event);
            else
                obj.flex(event);
        }

        obj.operation = function (event) {

            var optionIcoDom = $(event.target);

            var optionBoxDom = $(event.target).next('.panel-tool-box');

            optionBoxDom.show();

    

        }

        return obj;
    }
}

var MainObj = {
    New: function () {

        var obj = {};

        obj.taskInit = function () {

            //任务栏 隐藏显示
            var taskDom = $('#main_task_tools');
            taskDom.css("bottom", -taskDom.height());

            var taskTimer;
            taskDom.hover(function () {

                clearTimeout(taskTimer);
                taskTimer = setTimeout(function () {
                    taskDom.animate({ bottom: 0 });
                }, 500);

            }, function () {

                $(this).animate({ bottom: -$(this).height() });
                clearTimeout(taskTimer);

            });
        }

        obj.topInit = function () {
            var topDom = $('#main_tools');
            var current_user_Dom = topDom.find('.current-user');
            var current_user_content_Dom = topDom.find('.current-user-content');

            current_user_Dom.click(function () {
                current_user_content_Dom.toggle(500);
            });

            current_user_content_Dom.mouseout(function () {
                current_user_content_Dom.toggle(500);
            });

        }

        return obj;
    }
};


$(function () {

    var mainObj = MainObj.New();
    mainObj.topInit();

 

});

var appGlobal = AppGlobal.New();
