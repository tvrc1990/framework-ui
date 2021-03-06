
_panelObj = PanelObj.New();

_menuObj = MenuObj.New();

var panelModel = avalon.define({
    $id: "panelController",

    panelArray: new Array(),

    open: function (menuDom) {
        var temp = _menuObj.domToObj(menuDom);

        if (temp === null || temp.text === null)
        {
            return false;
        }

        var isExists = Enumerable.From(panelModel.panelArray).Where("x=>x.text=='" + temp.text + "'").ToArray().length === 0;

        if (temp != null && isExists) {
            panelModel.panelArray.push(temp);
        }
    },

    close: function (index) {
        panelModel.panelArray.removeIndex(index);
    },

    drag: function () {
        var panel = new PanelObj.New();
        panel.focus();
        panel.drag();

    },

    focus: function () {
        var panel = new PanelObj.New();
        panel.focus();
    },

    changeSize: function (index,dom) {
        var temp = panelModel.panelArray[index];
        _panelObj.changeSize(temp.isMaximize, dom);
        panelModel.panelArray[index].isMaximize = temp.isMaximize ? false : true;
    },

    operation: function () {
        _panelObj.operation()
    }

});

var menuModel = avalon.define({
    $id: "menuController",

    menuTemplate: _menuObj.getMenuTpl(),

    clickMenu: function (menuDom) {
        panelModel.open(menuDom);
    }

});


avalon.scan();