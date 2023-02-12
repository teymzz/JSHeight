(function($) {
    $.fn.jsHeight = function(options) {

        //defaults settings
        var defaults = {
            minHeight: false,
            maxHeight: false,
            reduceHeightBy: 0,
            increaseHeightBy: 0,
            autoHeight: false,
            autoResize: false,
            fullHeight: false,
            thisElement: this,
            autoHeightFix: 0
        }

        //real settings
        var settings = $.extend(defaults, options);

        //initialize
        runHeight(settings);

        // auto resize condition
        if (settings.autoResize === true) {
            $(window).on("resize", function(event) {
                // event.stopImmediatePropagation();
                runHeight(settings);
            })
        }

    }


    function runHeight(settings) {
        var jcHeight;
        var thisElement = settings.thisElement;
        var thisId = thisElement.data("id") || thisElement.attr("id")

        if (settings.autoHeight === true) {
            if (thisElement.find(".js-cHeight").length < 1) {
                thisElement.children().wrapAll("<div class='js-cHeight'><div>");
                $(thisElement).find(".js-cHeight>div").addClass("js-inHeight").css({ 'height': 'inherit' });
                if (jcHeight = thisElement.data('jcheight')) {
                    thisElement.find(".js-cHeight").css({ 'height': jcHeight });
                }

            }
        }

        //get full window height
        var fullheight = window.innerHeight;
        var thisHeight = thisElement.height();

        //get reduction value
        var thisReduce = settings.reduceHeightBy;
        thisReduce = isNaN(parseFloat(thisReduce)) ? 0 : parseFloat(thisReduce);

        var thisIncrease = settings.increaseHeightBy;
        thisIncrease = isNaN(parseFloat(thisIncrease)) ? 0 : parseFloat(thisIncrease);

        //get minimum height
        var thisMinHeight = settings.minHeight;

        //tweak minHeight
        if (settings.minHeight == 'screen') {
            thisMinHeight = window.innerHeight;
        }
        thisMinHeight = isNaN(parseFloat(thisMinHeight)) ? false : parseFloat(thisMinHeight);
        // alert(thisId+":"+thisMinHeight);

        //get maximum height
        var thisMaxHeight = settings.maxHeight;
        thisMaxHeight = isNaN(parseFloat(thisMaxHeight)) ? false : parseFloat(thisMaxHeight);


        //get maximum height
        var aHFix = settings.autoHeightFix || 0;
        aHFix = isNaN(parseFloat(aHFix)) ? 0 : parseFloat(aHFix);

        //get real height
        var realHeight = fullheight - thisReduce;
        realHeight = realHeight + thisIncrease;

        var irealHeight;

        //few tweaks
        if (thisMinHeight != false) {
            if (fullheight < thisMinHeight) {
                realHeight = thisMinHeight;
            }
            if (thisHeight < thisMinHeight) {
                irealHeight = thisMinHeight + thisIncrease - thisReduce;
            }
        }

        if (thisMaxHeight != false) {
            if (fullheight > thisMaxHeight) {
                realHeight = thisMaxHeight;
            }
            if (thisHeight > thisMaxHeight) {
                irealHeight = thisMaxHeight + thisIncrease - thisReduce;
            }
        }

        var rHeight = realHeight;
        //render element to screen height
        if (settings.fullHeight === true) {
            thisElement.css({ "height": realHeight });
        } else {
            if (typeof irealHeight != "undefined") {
                thisElement.css({ "height": irealHeight });
                rHeight = irealHeight;
            }
        }

        // child condition
        if (thisElement.find(".js-cHeight").length > 0) {
            var jscHeight = thisElement.find(".js-cHeight").height();
            var watchDog = thisElement.find("[data-watch]").height();
            var childHeight = jscHeight + aHFix;

            if (thisElement.find("[data-watch]").length > 0) {
                childHeight = watchDog + aHFix;
                if (childHeight < rHeight) { childHeight = rHeight }
            }

            //alert(thisElement.attr('id')+"::"+childHeight+"::jsc::"+jscHeight+"::watchDog::"+watchDog)
            //console.log(aHFix);

            //console.log(thisElement.attr('id')+childHeight+":"+$(thisElement).find("[data-watch]").height());
            if (settings.autoResize == true || settings.autoResize == "resize") {
                //auto increase parent to match child

                if (childHeight > realHeight) {
                    //console.info({realHeight:realHeight,childHeight:childHeight})
                    thisElement.css({ "height": childHeight });
                    //console.info(thisElement.css("height"))
                }
            }
        } else {
            if (thisElement.find("[data-watch]").length > 0) {
                childHeight = thisElement.find("[data-watch]").height() + aHFix
                if (thisMinHeight) { childHeight = (childHeight < thisMinHeight) ? thisMinHeight : childHeight; }
                if (thisMaxHeight) { childHeight = (childHeight > thisMaxHeight) ? thisMaxHeight : childHeight; }

                thisElement.css({ "height": childHeight });
            }

        }
    }
})(jQuery);


function jqHeight(options, target) {

    function run(timeout) {

        var timeout = timeout || 0;

        setTimeout(function() {
            $(target).jsHeight(options);
        }, timeout)
    }

    run();

    if (options.autoResize == "resize") {
        $(window).on("resize", function() {
            run(200);
        })
    }
}

/* function: jqHeight() Documentation
 autoHeight: increases height to match content height
 autoResize: automatically resize element upon window resize
 reduceHeightBy: reduces the height
 increaseHeightBy: increase the height 
 minHeight: minimum height allowed
 maxHeight: maximum height allowed
 fullHeight: render element to screen height
*/


function loadHeight(element, timeout) {
    var elem;
    var delay;

    if (timeout == null) {

        if (element != null) {
            if (!isNaN(parseInt(element))) {
                elem = $('[data-height]');
                delay = element;
            } else {
                elem = $(element);
                delay = 0;
            }
        } else {
            //element is dataheight
            elem = $('[data-height]');
            delay = 0;
        }

    } else {
        elem = $(element);
        delay = timeout;
    }

    setTimeout(function() {

        $(elem).each(function() {
            var dataHeight = $(this);
            var dataId = dataHeight.data('id')
            var tagId = dataHeight.attr('id');
            var $hId = dataId || tagId;

            if ($hId == null) { return false; }

            var targetId = (dataId) ? '[data-id="' + $hId + '"]' : '#' + $hId;

            var $min = dataHeight.data('minh') ? dataHeight.data('minh') : false;
            var $max = dataHeight.data('maxh') ? dataHeight.data('maxh') : false;
            var $dec = dataHeight.data('dec') ? dataHeight.data('dec') : false;
            var $inc = dataHeight.data('inc') ? dataHeight.data('inc') : false;
            var $fix = dataHeight.data('fix') ? dataHeight.data('fix') : 0;
            var $rez = dataHeight.data('resize') ? dataHeight.data('resize') : false;
            if ($rez == 'true') { $rez = true; } else { if ($rez != 'resize') { $rez = false; } }
            var $full = dataHeight.data('height') == "full" ? true : false;
            var $auto = dataHeight.data('auto') != null ? true : false;

            function prep(value) {
                if (!isNaN(parseFloat(value)) && value !== false) {
                    return parseFloat(value)
                } else {
                    return 0;
                }
            }

            if ($min == "screen") { $min = parseFloat(window.innerHeight); }
            if ($max == "screen") { $max = parseFloat(window.innerHeight); }

            if ($min !== false) { $min = prep($min) - prep($dec) + prep($inc); }
            if ($max !== false) { $max = prep($max) - prep($dec) + prep($inc); }

            $fix = prep($fix);

            jqHeight({ fullHeight: $full, autoResize: $rez, autoHeight: $auto, increaseHeightBy: $inc, reduceHeightBy: $dec, minHeight: $min, maxHeight: $max, autoHeightFix: $fix }, targetId);

        })

    }, delay)
}

/**
 * function: loadHeight() documentation
 * To use this function please read the following
 *
 * NOTE THIS
 * 1: Target element will be termed as T.E
 * 2: T.E must have a unique id
 * 3: T.E must be inline-block
 * 4: T.E must have data-height attribute
 * 5: All numeric values supplied to attributes have no units and are automatically calculated based on pixels
 * 
 *
 * @attributes (all attributes below are optional)
 *
 * data-height => when declared as full, sets the T.E height to full (or media) screen.
 * data-resize => updates T.E's height when browser resizes [e.g data-resize="resize"]
 * data-minh => Minimum height of  T.E in pixels. This overwrites data-resize attribute when minimum height is reached [e.g data-minh="100"]
 * data-maxh => Maximum height of T.E in pixels. This overwrites data-resize attribute when maximum height is reached [e.g data-maxh="100"]
 * data-inc  => increases T.E's current height by value supplied [e.g data-inc="100"].  
 * data-dec  => reduces T.E's current height by value supplied [e.g data-dec="100"].
 * data-auto => This monitors the T.E's content height, allowing T.E to expand if the content height is greater than T.E itself  
 *
 * EXAMPLE OF USAGE
 *
 * <div id="id1" data-height data-full data-auto="true" data-resize="resize" data-minh="screen" data-maxh="screen" data-inc="65"> </div> //#1
 * <div id="id2" data-height='full' data-auto="true" data-resize="resize" data-minh="screen" data-maxh="screen" data-inc="65"> </div>  //#2
 * <div id="id3" data-height data-resize="resize" data-minh="screen" data-maxh="screen" data-dec="65"> </div>  //#2
 * <div id="id4" data-height data-resize="resize"> <div data-watch=""></div> </div>  //#3 - expand to the height of data-watch (this must not be used with data-auto)
 *
 * once your attributes are set, call the loadHeight() function to execute
 */

// function : heightfull()
// This function uses the class .height-full to increase the height of a div to 100% (it is deprecated and will be removed later) 
// Use data-height attribute and then autoload it with loadHeight() function.
function heightFull() {
    if ($(".height-full").length > 0) {
        jqHeight({ fullHeight: true, autoResize: "resize", autoHeight: true, increaseHeightBy: 10 }, ".height-full");
    }
}