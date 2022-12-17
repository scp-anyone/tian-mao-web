//首页模块交互
$(function () {
    //提示框
    $("#footer a[href$=#nowhere]").click(function () {
        alert("模仿天猫的连接，并没有跳转到实际的页面");
    });

    //天猫耳朵特效
    /*
     * 监听鼠标移入事件mouseeter，移入时获取该元素的左、上宽度的信息根据这些信息，计算出猫耳朵应该出现的位置，
     * 然后通过css设置猫耳朵的left和top数据， 最后使用fadeIn(500)，在半秒内淡入猫耳朵图片。
     */
    $(".rightMenu span").mouseenter(function () {
        var left = $(this).position().left;
        var top = $(this).position().top;
        var width = $(this).css("width");
        var destLeft = parseInt(left) + parseInt(width) / 2;
        $("#catear").css("left", destLeft);
        $("#catear").css("top", top - 20);
        $("#catear").fadeIn(500);
    });

    //产品模块
    /*
     * 	每个菜单项eachCategory都有一个cid属性，取的是该分类的id值
        然后这个菜单项对应的产品列表，也有一个一样的cid属性。
        整体思路是：
        1. 把所有的产品列表都隐藏
        2. 当鼠标移动到菜单项上的时候，取出对应的cid
        3. 根据cid，找到对应的产品列表
        4. 显示该产品列表
        5. 当鼠标移开的时候，隐藏对应的产品列表
     *
    */

    //产品列表
    $(".eachCategory").mouseenter(function () {
        var cid = $(this).attr("cid");
        showProductsAsideCategorys(cid);
        $(".ci-right s").css("top", "0");
    });
    $(".eachCategory").mouseleave(function () {
        var cid = $(this).attr("cid");
        hideProductsAsideCategorys(cid);
        $(".ci-right s").css("top", "-9px");
    });
    $(".productsAsideCategorys").mouseenter(function () {
        var cid = $(this).attr("cid");
        showProductsAsideCategorys(cid);
        $(".ci-right s").css("top", "0");
    });
    $(".productsAsideCategorys").mouseleave(function () {
        var cid = $(this).attr("cid");
        hideProductsAsideCategorys(cid);
        $(".ci-right s").css("top", "-9px");
    });

    //获取对应的产品列表
    function showProductsAsideCategorys(cid) {
        $(".eachCategory[cid=" + cid + "]").css("background", "#FFFFFF");
        $(".eachCategory[cid=" + cid + "] a").css("color", "#87CEFA");
        $(".productsAsideCategorys[cid=" + cid + "]").show();
    }

    function hideProductsAsideCategorys(cid) {
        $(".eachCategory[cid=" + cid + "]").css("background", "#e2e2e3");
        $(".eachCategory[cid=" + cid + "] a").css("color", "#000");
        $(".productsAsideCategorys[cid=" + cid + "]").hide();
    }
});

//分类模块
$(function () {
    //分类页面价格排序
    /*
     * 思路：
     * 		1、首先开始价格和结束价格的输入框，都使用了sortBarPrice, 这样通过键盘按下keyup监听事件获取值；
     * 		2、要获取一个值，先定一个变量，如果该input的输入长度或值是空，那么就让他显示出来；
     * 		3、接着判断该值是否非数字，非零，或自身值;
     * 		4、紧跟着获取开始和结束价格2个input；
     * 		5、产品上都有相对应的价格，判断开始和结束的数值是否非数字，是；隐藏每个产品列表；
     * 		6、遍历每一个价格用来判断里面的数值区间，如果满足该区间就显示出来；
     */
    $(".sortBarPrice").keyup(function () {
        var num = $(this).val();
        if (num.length == 0) {
            $(".productUnit").show();
            return;
        }
        ;
        num = parseInt(num);
        if (isNaN(num)) num = 1;
        if (num <= 0) num = 1;
        $(this).val(num);

        var begin = $(".beginPrice").val();
        var end = $(".endPrice").val();
        if (!isNaN(begin) && !isNaN(end)) {
            $(".productUnit").hide();
            $(".productUnit").each(function () {
                var price = $(this).attr("price");
                price = new Number(price);
                if (price <= end && price >= begin) {
                    $(this).show();
                }
            });
        }
    });
});

//显示缩略图		
/*
 *  思路
 * 首先在小图片上有一个自定义属性bigImageURL，用于存放对应的图片的位置；
 * 监听小图片的mouseenter事件，获取小图片的bigImageURL属性,把大图片的src修改为该图片预加载，因为图片比较大，所以需要进行预加载；
 * 在大图片加载好之后，根据每个小图片的bigImageURL ，创建一个Image对象，然后把这个image对象的src属性，设置为bigImageURL。 
 * 当这个img对象加载完毕之后，再放到被隐藏的div.img4load中，从而达到预加载的效果。
 */
$(function () {
    $(".smallImage").mouseenter(function () {
        var bigImageURL = $(this).attr("bigImageURL");
        $(".bigImg").attr("src", bigImageURL);
    });
//		预加载程序
    $(".bigImg").load(
        function () {
            $(".smallImage").each(function () {
                var bigImageURL = $(this).attr("bigImageURL");
                img = new Image();
                img.src = bigImageURL;
                img.onload = function () {
                    $(".img4load").append($(img));
                };
            });
        });
});


/*									产品页面
 * 修改价格
 * 要求：
	 	可以向上调整数量，但是不能超过最大库存
		可以向下调整数量，但是不能小于1
		输入任何非数字，都会恢复为原来数字
		输入的数字超过库存，恢复为最大库存
		
		1.监听输入该，获取输入框的值
		如果是非数字，那么就设置为1。注： parseInt会把文本中的非数字前的数字解析出来，所以如果文本框的内容是22B,那么解析出来是22.
		如果是负数，那么设置为1。
		如果大于库存，设置为最大库存。
 * 
 */
$(function () {
    var stock = 66;
    $(".productNumberSettingSpan").keyup(function () {
        var num = $(".productNumberSetting").val();
        num = parseInt(num);
        if (isNaN(num)) num = 1;
        if (num <= 1) num = 1;
        if (num > stock) num = stock;
        $(".productNumberSetting").val(num);
    });
    $(".increaseNumber").click(function () {
        var num = $(".productNumberSetting").val();
        num++;
        if (num > stock) num = stock;
        $(".productNumberSetting").val(num);
    });
    $(".decreaseNumber").click(function () {
        var num = $(".productNumberSetting").val();
        num--;
        if (num <= 0) num = 1;
        $(".productNumberSetting").val(num);
    });

//	评价与详情选项卡切换
    $(".productReviewDiv").hide();
    $(".productDetailTopReviewLink").click(function () {
        $(".productReviewDiv").show();
        $(".productDetailDiv").hide();
    });
    $(".productReviewTopPartSelectedLink ").click(function () {
        $(".productDetailDiv").show();
        $(".productReviewDiv").hide();
    })

});


//购物车页面


//显示被选中的商品总数，以及总价格。
//通过遍历每种商品是否被选中，累加被选中商品的总数和总价格，然后修改在上方的总价格，以及下方的总价格，总数
//oiid用来区别订单项
$(function () {

//以千进制格式化金额，比如金额是123456,就会显示成123,456
    function formatMoney(num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    };

    //判断是否有商品被选中，只要有任意商品被选中了，就把结算按钮的颜色变为天猫红，并且是可点击状态，否则就是灰色，并且无法点击。
    function syncCreateOrderButton() {
        var selectAny = false;
        $(".cartProductItemIfSelected").each(function () {
            if ("selectit" == $(this).attr("selectit")) {
                selectAny = true;
            }
            ;
        });
        if (selectAny) {
            $(".createOrderButton").css("background", "#C40000");
            $(".createOrderButton").removeAttr("disabled");
        } else {
            $(".createOrderButton").css("background", "#AAAAAA");
            $(".createOrderButton").attr("disabled", "disabled");
        }
    };

    //同步"全选"状态。 选中和未选中是采用了两个不同的图片实现的，
    //遍历所有的商品，看是否全部都选中了，只要有任意一个没有选中，那么就不是全选状态。 然后通过切换图片显示是否全选状态的效果。
    function syncSelect() {
        var selectAll = true;
        $(".cartProductItemIfSelected").each(function () {
            if ("false" == $(this).attr("selectit")) {
                selectAll = false;
            }
            ;
        });
        if (selectAll) {
            $(".selectAllItem").attr("src", "images/site/cartSelected.png")
        } else {
            $(".selectAllItem").attr("src", "images/site/cartNotSelected.png")
        }
    }

//	1.显示被选中的总价、单价、和数量；
//	2.遍历每个被选中的商品，累加商品的总价、单价、数量；
//	3.并修改上方的结算总价格，以及下方的总价格和总数量；
    function calcCartSumPriceAndNumber() {
        var sum = 0;				/*初始化商品总价*/
        var totalNumber = 0;		/*初始化商品总数量*/
        $(".cartProductItemIfSelected[selectit='selectit']").each(function () {
            var oiid = $(this).attr("oiid");
            var price = $(".cartProductItemSmallSumPrice[oiid=" + oiid + "]").text();		/*oiid用来区别订单项*/
            price = price.replace(/,/g, "");
            price = price.replace(/￥/g, "");
            sum += new Number(price);	/*商品总价*/
            var num = $(".orderItemNumberSetting[oiid=" + oiid + "]").val();				/*oiid用来找相对应的input的值*/
            totalNumber += new Number(num);		/*商品总数量*/
        });
        $(".cartTitlePrice").html("￥" + formatMoney(sum));
        $(".cartSumPrice").html("￥" + formatMoney(sum));
        $(".cartSumNumber").html(totalNumber);
    };

//	根据商品数量，商品价格，同步小计价格，调用函数，接着把syncPrice（）参数传给给函数calcCartSumPriceAndNumber()，同步商品总数和总价格
    function syncPrice(pid, num, price) {
        $(".orderItemNumberSetting[pid=" + pid + "]").val(num);												/*pid用来找相对应的input的值*/
        var cartProductItemSmallSumPrice = formatMoney(num * price);
        $(".cartProductItemSmallSumPrice[pid = " + pid + "]").html("￥" + cartProductItemSmallSumPrice);
        calcCartSumPriceAndNumber()
    }

    //当选中某一种商品的时候，根据这个图片上的自定义属性selectit，判断当前的选中状态。
    $(".cartProductItemIfSelected").click(function () {
        var selectit = $(this).attr("selectit");
        if ("selectit" == selectit) {
            $(this).attr("src", "images/site/cartNotSelected.png");
            $(this).attr("selectit", "false");
            $(this).parents(".cartProductItemTR").css("background", "fff");
        } else {
            $(this).attr("src", "images/site/cartSelected.png");
            $(this).attr("selectit", "selectit");
            $(this).parents(".cartProductItemTR").css("background", "#fff8e1");
        }

        //对结算按钮，是否全选按钮，总数量、总价格信息显示进行同步
        syncSelect();
        syncCreateOrderButton();
        calcCartSumPriceAndNumber();
    });

    /*全选点击事件
     * 当点击全选图片的时候，做出的响应
        首选全选图片上有一个自定义的selectit属性，用于表示该图片是否被选中
     */
    $(".selectAllItem").click(function () {
        var selectit = $(this).attr("selectit");
        if ("selectit" == selectit) {
            $(".selectAllItem").attr("src", "images/site/cartNotSelected.png");
            $(".selectAllItem").attr("selectit", "false");
            $(".cartProductItemIfSelected").each(function () {
                $(this).attr("src", "images/site/cartNotSelected.png");
                $(this).attr("selectit", "false");
                $(this).parents(".cartProductItemTR").css("background-color", "#fff");
            });
        } else {
            $(".selectAllItem").attr("src", "images/site/cartSelected.png");
            $(".selectAllItem").attr("selectit", "selectit")
            $(".cartProductItemIfSelected").each(function () {
                $(this).attr("src", "images/site/cartSelected.png");
                $(this).attr("selectit", "selectit");
                $(this).parents("tr.cartProductItemTR").css("background-color", "#FFF8E1");
            });
        }
        ;
        syncCreateOrderButton();
        calcCartSumPriceAndNumber();
    });

    /*
     * 点击事件，根据超链上的pid，获取这种商品对应的库存，价格和数量。 如果数量超过了库存，那么就取库存值。
        最后调用syncPrice，同步价格和总数信息。
     */
    $(".numberPlus").click(function () {
        var pid = $(this).attr("pid");
        var stock = $(".orderItemStock[pid = " + pid + "]").text();
        var price = $(".orderItemPromotePrice[pid = " + pid + "]").text();
        var num = $(".orderItemNumberSetting[pid = " + pid + "]").val();
        num++;
        if (num > stock) {
            num = stock;
        }
        syncPrice(pid, num, price);
    });

    $(".numberMinus").click(function () {
        var pid = $(this).attr("pid");
        var stock = $(".orderItemStock[pid = " + pid + "]").text();
        var price = $(".orderItemPromotePrice[pid = " + pid + "]").text();
        var num = $(".orderItemNumberSetting[pid = " + pid + "]").val();
        --num;
        if (num <= 0) {
            num = 1;
        }
        ;
        syncPrice(pid, num, price);
    })

    /*
     * 监听keyup事件，根据超链上的pid，获取这种商品对应的库存，价格和数量。 如果数量小于1，那么就取1,如果大于库存，就取库存值。
        最后调用syncPrice，同步价格和总数信息。
     */
    $(".orderItemNumberSetting").keyup(function () {
        var pid = $(this).attr("pid");
        var stock = $(".orderItemStock[pid=" + pid + "]").text();
        var price = $(".orderItemPromotePrice[pid=" + pid + "]").text();
        var num = $(".orderItemNumberSetting[pid=" + pid + "]").val();
        num = parseInt(num);
        if (isNaN(num))
            num = 1;
        if (num <= 0)
            num = 1;
        if (num > stock)
            num = stock;
        syncPrice(pid, num, price);
    });

    $("a[orderStatus]").click(function () {
        var orderStatus = $(this).attr("orderStatus");
        if ('all' == orderStatus) {
            $("table[orderStatus]").show();
        } else {
            $("table[orderStatus]").hide();
            $("table[orderStatus=" + orderStatus + "]").show();
        }
        $("div.orderType div").removeClass("selectedOrderType");
        $(this).parent("div").addClass("selectedOrderType");
    });

});


//	回到顶部
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    console.log(121);
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("gotop").style.display = "block";
    } else {
        document.getElementById("gotop").style.display = "none";
    }
}

// 点击按钮，返回顶部
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// 关闭广告

function closebutton() {
    document.getElementById("guangaopage").style.display = "none";
}

//注册成功
$(document).ready(function () {
    $("#registerButtonTD1").click(function () {
        alert("注册成功！！！")
    });
});

//密码验证
$(document).ready(function () {
    $("#loginsuccessful").click(function () {
        var tname="123456";
        var tpassword="123"
        //获取文本框内容
        var name = $("#name").val();
        //获取文本框内容
        var password = $("#password").val();
        //判断
        if (name == tname && password==tpassword) {
            alert("登录成功！！！")
            window.location="index.html";
        } else {
            alert("密码错误！！！");
        }
    });
});

