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
        var boxIndex = 1

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
            boxIndex = 1
            boxLocation = { x: 1, y: 1 }
            vector = { x: 1, y: 0 }

            var spinBox = $("#itemBox_" + (settings.xBoxCount - 1) + "_" + (settings.yBoxCount - 1))
            var speedRate = $('<div class="text-sub-info"><span id="speedRate" >0.00</span> items/s</div>')
            spinBox.addClass("item-box-hide")
            spinBox.css("color", "white")
            spinBox.append(speedRate)

            $(".btn-info").css("background-color", settings.itemBoxBgColor)
            $(".btn-info").css("border-color", settings.itemBoxBgColor)
            $(".btn-info").css("color", settings.textColor)

            var playerTop = ( 57 + itemBoxHeight ) - 50
            var playerLeft = itemBoxWidth - 25
            var playerWidth = ( itemBoxWidth * (settings.xBoxCount - 2) ) + 50
            var playerHeight = ( itemBoxHeight * (settings.yBoxCount - 2) ) + 100
            $("#player").css("top", playerTop + "px")
            $("#player").css("left", playerLeft + "px")
            $("#player").css("width", playerWidth + "px")
            $("#player").css("height", playerHeight + "px")

            PutItem()
        }

        function PutItem() {
            var l = { x: 1, y: 1 }
            var v = { x: 1, y: 0 }
            for (r = 1; r <= timesPerRound; r++) {
                var itemBoxID = "itemBox_" + l.x + "_" + l.y
                var textContent = "-"
                if (settings.itemList.length > r-1) {
                    textContent = settings.itemList[r-1]
                }

                var textDiv = $('<div class="text"></div>')
                textDiv.css("color", settings.textColor)
                textDiv.css("font-size", settings.textSize + "px")
                textDiv.text(textContent)
                $("#" + itemBoxID).html('').append(textDiv)
                $("#" + itemBoxID).attr("data-box-index", r)

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

        var maxTimes = 0
        function MakeAWish(times) {
            if (times > maxTimes) {
                maxTimes = times
            }
            if (times > 0) {
                var newBoxIndex = boxIndex + 1
                if (newBoxIndex > timesPerRound) {
                    newBoxIndex = 1
                }

                var oldBox = $("div[data-box-index="+boxIndex+"]")
                var newBox = $("div[data-box-index="+newBoxIndex+"]")

                removeActive(oldBox)
                addActive(newBox)

                boxIndex = newBoxIndex

                times -= 1
                var minSpeed = Math.floor(1000 / settings.fastestSpeed)
                var maxSpeed = Math.floor(1000 / settings.slowestSpeed)
                var slowdownProgress = settings.slowDown
                var progress = Math.floor( (times / maxTimes) * 100)
                var speed = minSpeed
                if(progress < slowdownProgress) {
                    var slowdownProgressMaxTimes = Math.floor((maxTimes * slowdownProgress) / 100)
                    var slowdownProgressProgress = Math.floor( (times / slowdownProgressMaxTimes) * 100)
                    speed = maxSpeed - Math.floor((maxSpeed * slowdownProgressProgress) / 100)
                    console.log(times + "/"+ slowdownProgressMaxTimes, slowdownProgressProgress + " %", speed + " ms", parseFloat(1000 / speed).toFixed(2) + " / s")
                }else{
                    console.log(times + "/"+ maxTimes, progress + " %", speed + " ms", parseFloat(1000 / speed).toFixed(2) + " / s")
                }
                if (speed > maxSpeed) {
                    speed = maxSpeed
                }
                if (speed < minSpeed) {
                    speed = minSpeed
                }

                var speedRate = parseFloat(1000 / speed).toFixed(2)
                $("#speedRate").text(speedRate)
                
                setTimeout(function () {
                    MakeAWish(times)
                }, speed)
            }
            else {
                $("#speedRate").text("0.00")
                var itemBox = $("div[data-box-index="+boxIndex+"]").clone()
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
                var randSeed = getRand(1, timesPerRound)
                var result = (timesPerRound * randRound) + (timesPerRound - boxIndex) + randSeed
                console.log("randRound("+settings.turnsMin+"~"+settings.turnsMax+"):", randRound, " randSeed(1~"+timesPerRound+"):", randSeed, " result:", result)
                maxTimes = 0
                player.playVideo()
                MakeAWish(result)
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
            $(".loading").show()
            var oldItemList = settings.itemList
            var itemList = []
            for(;;){
                var randIndex = getRand(0, oldItemList.length-1)
                if($.inArray(oldItemList[randIndex], itemList) < 0){
                    console.log(randIndex, oldItemList[randIndex])
                    itemList.push(oldItemList[randIndex])
                }
                if(itemList.length == oldItemList.length){
                    break
                }
            }
            settings.itemList = itemList

            PutItem()
            $(".loading").fadeOut(1500)
        })

        $(window).resize(function () {
            DrawTable()
        })

        settings = GetURLParameter("data", "")
        if (!settings) {
            itemList = ["Avocado","Banana","Carambola","Durian","Elderberry","Figs","Guava","Honeydew Melon","Indian Prune","Jackfruit","Kiwifruit","Lychee","Mango","Nectarine","Orange","Pitaya","Quince","Rambutan","Sugar-Apple","Tangerine","Ugli fruit","Voavanga","Watermelon","Xigua","Yangmei","Zuchinni"]
            $("#item_list").val(itemList.join("\r\n"))
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

            $(".loading").fadeOut(1500)

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
