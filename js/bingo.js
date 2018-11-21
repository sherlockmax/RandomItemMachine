$(document).ready(function () {
    try {
        // Create Base64 Object
        var Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (e) {
                var t = "";
                var n, r, i, s, o, u, a;
                var f = 0;
                e = Base64._utf8_encode(e);
                while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) { u = a = 64 }
                    else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                }
                return t
            },
            decode: function (e) {
                var t = "";
                var n, r, i;
                var s, o, u, a;
                var f = 0;
                e = e.replace(/[^A-Za-z0-9+/=]/g, "");
                while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) { t = t + String.fromCharCode(r) }
                    if (a != 64) { t = t + String.fromCharCode(i) }
                }
                t = Base64._utf8_decode(t);
                return t
            },
            _utf8_encode: function (e) {
                e = e.replace(/rn/g, "n");
                var t = "";
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) { t += String.fromCharCode(r) }
                    else if (r > 127 && r < 2048) {
                        t += String.fromCharCode(r >> 6 | 192);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                    else {
                        t += String.fromCharCode(r >> 12 | 224);
                        t += String.fromCharCode(r >> 6 & 63 | 128);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                }
                return t
            },
            _utf8_decode: function (e) {
                var t = "";
                var n = 0;
                var r = c1 = c2 = 0;
                while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r);
                        n++
                    }
                    else if (r > 191 && r < 224) {
                        c2 = e.charCodeAt(n + 1);
                        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                        n += 2
                    }
                    else {
                        c2 = e.charCodeAt(n + 1);
                        c3 = e.charCodeAt(n + 2);
                        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        n += 3
                    }
                }
                return t
            }
        }

        var player
        var settings = {}
        var timesPerRound = 0
        var boxLocation = { x: 1, y: 1 }
        var vector = { x: 1, y: 0 }

        function GetURLParameter(sParam, url) {
            var sPageURL = url.split("?")[1]
            if (!url || url == "") {
                sPageURL = window.location.search.substring(1)
            }
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        }

        function removeActive(itemBox) {
            itemBox.css("background-color", settings.itemBoxBgColor)
            itemBox.css("border", settings.itemBoxBorderWidth + "px solid " + settings.itemBoxBorderColor)
        }

        function addActive(itemBox) {
            itemBox.css("background-color", settings.itemBoxHighlightBgColor)
            itemBox.css("border", settings.itemBoxHighlightBorderWidth + "px solid " + settings.itemBoxHighlightBorderColor)
        }

        function DrawTable() {
            $('.bingoTable').html("")
            var itemBoxWidth = $(".container-fluid").width() / (settings.xBoxCount)
            var itemBoxHeight = ($(".container-fluid").height() / (settings.yBoxCount))
            timesPerRound = 0
            for (y = 1; y <= settings.yBoxCount; y++) {
                for (x = 1; x <= settings.xBoxCount; x++) {
                    var id = "itemBox_" + x + "_" + y
                    var itemBox = $('<div id="' + id + '" class="item-box"></div>')
                    itemBox.width(itemBoxWidth - (settings.itemBoxBorderWidth * 2))
                    itemBox.height(itemBoxHeight - (settings.itemBoxBorderWidth * 2))
                    if (x == 1 || x == settings.xBoxCount || y == 1 || y == settings.yBoxCount) {
                        itemBox.css("background-color", settings.itemBoxBgColor)
                        itemBox.css("border", settings.itemBoxBorderWidth + "px solid " + settings.itemBoxBorderColor)
                        itemBox.css("cursor", "pointer")
                        timesPerRound++
                    }
                    else {
                        itemBox.css("border", settings.itemBoxBorderWidth + "px dotted rgba(0,0,0,0)")
                        itemBox.css("color", "rgba(0,0,0,0)")
                    }
                    $('.bingoTable').append(itemBox)
                }
            }
            boxLocation = { x: 1, y: 1 }
            vector = { x: 1, y: 0 }

            // var spinBox = $("#itemBox_" + (settings.xBoxCount - 1) + "_" + (settings.yBoxCount - 1))
            // spinBox.addClass("btn btn-danger text-white").attr("id", "spin").text("Spinning！")

            // var settingBox = $("#itemBox_2_" + (settings.yBoxCount - 1))
            // settingBox.addClass("btn btn-success text-white").attr("id", "open-settings").text("Settings")

            // var soundBox = $("#itemBox_" + (settings.xBoxCount - 1) + "_2")
            // soundBox.addClass("btn btn-primary text-white").attr("id", "toggle-sound").text("Sound")

            var playerTop = 57 + itemBoxHeight
            var playerLeft = itemBoxWidth
            var playerWidth = itemBoxWidth * (settings.xBoxCount - 2)
            var playerHeight = itemBoxHeight * (settings.yBoxCount - 2)
            $("#player").css("top", playerTop + "px")
            $("#player").css("left", playerLeft + "px")
            $("#player").css("width", playerWidth + "px")
            $("#player").css("height", playerHeight + "px")

            PutItem()
        }

        function PutItem() {
            var l = { x: 1, y: 1 }
            var v = { x: 1, y: 0 }
            for (r = 0; r < timesPerRound; r++) {
                var itemBoxID = "itemBox_" + l.x + "_" + l.y
                var textContent = "-"
                if (settings.itemList.length > r) {
                    textContent = settings.itemList[r]
                }

                var textDiv = $('<div class="text"></div>')
                textDiv.css("color", settings.textColor)
                textDiv.css("font-size", settings.textSize + "px")
                textDiv.text(textContent)
                $("#" + itemBoxID).html('').append(textDiv)

                if (l.x >= settings.xBoxCount && l.y <= 1) {
                    v.x = 0
                    v.y = 1
                }

                if (l.y >= settings.yBoxCount && l.x >= settings.xBoxCount) {
                    v.x = -1
                    v.y = 0
                }

                if (l.x <= 1 && l.y >= settings.yBoxCount) {
                    v.x = 0
                    v.y = -1
                }

                if (l.x <= 1 && l.y <= 1) {
                    v.x = 1
                    v.y = 0
                }
                l = {
                    x: l.x + v.x,
                    y: l.y + v.y
                }
            }
        }

        function MakeAWish(times, breakTimes) {
            if (times > 0) {
                var newboxLocation = {
                    x: boxLocation.x + vector.x,
                    y: boxLocation.y + vector.y
                }
                var itemBoxID = "itemBox_" + boxLocation.x + "_" + boxLocation.y
                var newItemBoxID = "itemBox_" + newboxLocation.x + "_" + newboxLocation.y

                removeActive($("#" + itemBoxID))
                addActive($("#" + newItemBoxID))

                boxLocation = newboxLocation
                if (boxLocation.x >= settings.xBoxCount && boxLocation.y <= 1) {
                    vector.x = 0
                    vector.y = 1
                }

                if (boxLocation.y >= settings.yBoxCount && boxLocation.x >= settings.xBoxCount) {
                    vector.x = -1
                    vector.y = 0
                }

                if (boxLocation.x <= 1 && boxLocation.y >= settings.yBoxCount) {
                    vector.x = 0
                    vector.y = -1
                }

                if (boxLocation.x <= 1 && boxLocation.y <= 1) {
                    vector.x = 1
                    vector.y = 0
                }

                times -= 1
                if (times > breakTimes.first) {
                    setTimeout(function () {
                        MakeAWish(times, breakTimes)
                    }, 50)
                }
                else if (times > breakTimes.second) {
                    setTimeout(function () {
                        MakeAWish(times, breakTimes)
                    }, 150)
                }
                else if (times > breakTimes.third) {
                    setTimeout(function () {
                        MakeAWish(times, breakTimes)
                    }, 400)
                }
                else {
                    setTimeout(function () {
                        MakeAWish(times, breakTimes)
                    }, 1000)
                }
            }
            else {
                var itemBoxID = "itemBox_" + boxLocation.x + "_" + boxLocation.y
                var itemBox = $("#" + itemBoxID).clone()
                itemBox.css("width", "auto")
                $('#bingo_modal').find(".modal-body").html("")
                $('#bingo_modal').find(".modal-body").append(itemBox)
                $('#bingo_modal').modal("show")
                player.pauseVideo()
                isSpinning = false
            }
        }

        function transFormToObj(form) {
            var obj = {}
            $.each(form.serializeArray(), function (i, item) {
                obj[item.name] = item.value
            })
            var itemListText = obj["itemList"]
            obj["itemList"] = itemListText.split("\r\n")

            return obj
        }

        function getRand(min, max) {
            var max = parseInt(max)
            var min = parseInt(min)

            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        function updateItemListCount(itemListCount) {
            $("#item_list_count").text("Got: " + itemListCount + " / Need: " + timesPerRound)
        }

        var isSpinning = false
        $("body").on("click", "#spin", function () {
            if (!isSpinning) {
                isSpinning = true
                var randRound = getRand(settings.turnsMin, settings.turnsMax)
                var randSeed = getRand(0, timesPerRound)
                var result = (timesPerRound * randRound) + randSeed
                var breakTimes = {
                    first: getRand(10, 15),
                    second: getRand(6, 9),
                    third: getRand(3, 5),
                }

                console.log(settings, "randRound", randRound, "randSeed", randSeed, "timesPerRound", timesPerRound, "breakTimes", breakTimes)
                player.playVideo()
                MakeAWish(result, breakTimes)
            }
        })

        $("body").on("click", "#open-settings", function () {
            $.each(settings, function (name, value) {
                if (name == "itemList") {
                    $("#settings_modal").find("textarea[name=" + name + "]").val(value.join("\n"))
                } else if (name == "bgVideoIsBlock") {
                    $("#settings_modal").find("select[name=" + name + "]").val(value)
                }
                else {
                    $("#settings_modal").find("input[name=" + name + "]").val(value)
                }
            })

            updateItemListCount(settings.itemList.length)
            $("#settings_modal").modal("show")
        })

        $("body").on("click", "#settings_save", function () {
            settings = transFormToObj($("#bingoSettings"))
            var data = encodeURIComponent(Base64.encode(JSON.stringify(settings)))
            location.href = "/?data=" + data
        })

        $("body").on("click", "#settings_default", function () {
            location.href = "/"
        })

        $("body").on("click", ".btnEditBoxText", function () {
            var itemBoxID = $(this).attr("data-box-id")
            var content = $('#' + itemBoxID + '_text').val()
            var fontSize = $('#' + itemBoxID + '_size').val()
            $("#" + itemBoxID).css("font-size", fontSize + "px")
            $("#" + itemBoxID).text(content)
            $("#" + itemBoxID).tooltip('hide')
        })

        $("body").on("change", "#item_list", function () {
            var itemListCount = $('#item_list').val().split("\n").length
            updateItemListCount(itemListCount)
        })

        $("body").on("click", "#clearCache", function () {
            location.href = "/"
        })

        $(".navbar-brand").click(function () {
            if ($(".container-fluid").hasClass("bg-dark")) {
                $(".container-fluid").removeClass("bg-dark")
            }
            else {
                $(".container-fluid").addClass("bg-dark")
            }
        })

        $("#sound_status").click(function () {
            if (settings.sound == "off") {
                player.unMute()
                settings.sound = "on"
                $("#sound_status").text("Sound OFF")
            } else {
                player.mute()
                settings.sound = "off"
                $("#sound_status").text("Sound ON")
            }
        })

        $("#shuffle_item").click(function(){
            var itemList = []
            for(i=0;i<settings.itemList.length;i++){
                var item = settings.itemList[Math.floor(Math.random()*settings.itemList.length)]
                itemList.push(item)
            }
            settings.itemList = itemList

            PutItem()
        })

        $(window).resize(function () {
            DrawTable()
        })

        settings = GetURLParameter("data", "")
        if (!settings) {
            settings = transFormToObj($("#bingoSettings"))
            console.log("Load settings from [form]: ", settings)
        }
        else {
            settings = JSON.parse(Base64.decode(decodeURIComponent(settings)))
            settings.turnsMax = settings.tunsMax
            settings.turnsMin = settings.tunsMin
            delete settings.tunsMax
            delete settings.tunsMin
            console.log("Load settings from [?data=]: ", settings)
        }

        DrawTable()
        addActive($("#itemBox_1_1"))

        $(".modal").modal({
            show: false,
            backdrop: "static"
        })

        function onYouTubeIframeAPIReady(vID) {
            player = new YT.Player('player', {
                height: '390',
                width: '640',
                videoId: vID,
                playerVars: {
                    'controls': 0,
                    'loop': 1,
                    'modestbranding': 1,
                    'showinfo': 0,
                    'start': 3,
                },
                events: {
                    'onReady': onPlayerReady,
                }
            });
        }

        function onPlayerReady() {
            if (settings.bgVideoIsBlock.toUpperCase() == "NO") {
                $(".container-fluid ").removeClass("bg-dark")
            }
            else {
                $(".container-fluid ").addClass("bg-dark")
            }

            if (settings.sound && settings.sound == "off") {
                player.mute()
                $("#sound_status").text("Sound ON")
            } else {
                player.unMute()
                $("#sound_status").text("Sound OFF")
            }

            $(".loading").fadeOut(2000)

            // $(".loading").animate({
            //     height: 0,
            //     top: "50%", // 100 + 50 / 2
            //     left: "50%",
            //     width: 0,
            // }, 1500)
        }

        setTimeout(function () {
            var vID = GetURLParameter("v", settings.bgVideo)
            if (!vID) {
                vID = "BahtnT13vH8"
            }
            onYouTubeIframeAPIReady(vID)
        }, 2000)
    }
    catch (err) {
        console.log(err)
        var text = 'You can click button name of 「Clear cache and reload」to try to fix it, or you can feeback the issue to author\'s Github repo <a href="https://github.com/sherlockmax/RandomItemMachine/issues">LINK</a>！'
        $('#alert_modal').find(".modal-body p").html(text)
        $("#alert_modal").modal("show")
    }
})
