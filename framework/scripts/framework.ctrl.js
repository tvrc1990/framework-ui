
_panelObj = PanelObj.New();

_menuObj = MenuObj.New();

var panelModel = avalon.define({
    $id: "panelController",

    panelArray: new Array(),

    open: function (menuDom) {
        var temp = _menuObj.domToObj(menuDom);

        var isExists = Enumerable.From(panelModel.panelArray).Where("x=>x.text=='" + temp.text + "'").ToArray().length === 0;

        if (temp != null && isExists) {
            panelModel.panelArray.push(temp);
        }
    },

    close: function (index) {
        panelModel.panelArray.removeIndex(index);
    },

    dragging: function (event, action) {
        var panel = new PanelObj.New();
        switch (action) {
            case 'move':

                panel.move(event);
                break;
            case 'flex':
                panel.flex(event); break;
        }
    },

    tabSize: function (index,dom) {
        var temp = panelModel.panelArray[index];
        _panelObj.tabSize(temp.isMaximize, dom);
        panelModel.panelArray[index].isMaximize = temp.isMaximize ? false : true;
    },

    focus: function (index) {
        alert(index);
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