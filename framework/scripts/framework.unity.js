
//�ַ����Ƿ�Ϊ�գ�empty & null & undefind��
String.prototype.IsEmpty = function () {
    if (this.length===0 ||this === '' )
        return true;
    else
        return false;
};

//�����Ƿ�Ϊ�գ������ַ��� ���������֣�
var IS_NULL = function (obj) {
    if (obj === null || obj === '' || obj === undefined)
        return true;
    else
        return false;
};

//�����Ƿ����ָ��Ԫ��
Array.prototype.S = String.fromCharCode(2);
Array.prototype.Exists = function (e) {
    var r = new RegExp(this.S + e + this.S);
    return (r.test(this.S + this.join(this.S) + this.S));
};

//ɾ�������Զ�������Ԫ��
Array.prototype.removeIndex = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
}









///TEST DATA
var SvrObj = {
    New: function () {
        var obj = {};

        obj.getMenuArray = function () {
            return [
            {
                text: "link_1",
                href: null,
                menus: [
                    { text: "link_1_1", href: '' },
                    {
                        text: "link_1_2",
                        href: '',
                        menus: [
                                   { text: "link_1_2_1", href: 'sub.html' },
                                   { text: "link_1_2_2", href: '' }
                        ]
                    }
                ]
            },
            { text: "link_2", href: 'index.html' }
            ];
        };

        return obj;
    }
};