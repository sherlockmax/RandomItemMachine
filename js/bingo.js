$(document).ready(function() {
    try {
        var settings = {}
        var timesPerRound = 0
        var boxLocation = { x: 1, y: 1 }
        var vector = { x: 1, y: 0 }

        function removeActive(itemBox) {
            itemBox.css("background-color", settings.itemBoxBgColor)
            itemBox.css("border", settings.itemBoxBorderWidth + "px solid " + settings.itemBoxBorderColor)
        }

        function addActive(itemBox) {
            itemBox.css("background-color", settings.itemBoxHighlightBgColor)
            itemBox.css("border", settings.itemBoxHighlightBorderWidth + "px solid " + settings.itemBoxHighlightBorderColor)
        }

        function DrawTable() {
            $('.container-fluid').html("")
            var itemBoxWidth = $(".container-fluid").width() / (settings.xBoxCount)
            var itemBoxHeight = ($(".container-fluid").height() / (settings.yBoxCount)) - 2
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
                        timesPerRound++
                    }
                    else {
                        itemBox.css("border", settings.itemBoxBorderWidth + "px dotted rgba(0,0,0,0)")
                        itemBox.css("color", "rgba(0,0,0,0)")
                    }

                    itemBox.css("line-height", (itemBoxHeight - (settings.itemBoxBorderWidth * 2) - 20) + "px")
                    $('.container-fluid').append(itemBox)
                }
            }
            boxLocation = { x: 1, y: 1 }
            vector = { x: 1, y: 0 }

            var spinBox = $("#itemBox_" + (settings.xBoxCount - 1) + "_" + (settings.yBoxCount - 1))
            spinBox.addClass("btn btn-danger text-white").attr("id", "spin").text("Spinning！")

            var settingBox = $("#itemBox_" + (settings.xBoxCount - 2) + "_" + (settings.yBoxCount - 1))
            settingBox.addClass("btn btn-success text-white").attr("id", "open-settings").text("Settings")

            PutItem()
        }

        function PutItem() {
            var l = { x: 1, y: 1 }
            var v = { x: 1, y: 0 }
            for (r = 0; r < timesPerRound; r++) {
                var itemBoxID = "itemBox_" + l.x + "_" + l.y
                if (settings.itemList.length > r) {
                    $("#" + itemBoxID).text(settings.itemList[r])
                }
                else {
                    $("#" + itemBoxID).text("{Item.name}")
                }

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
                    setTimeout(function() {
                        MakeAWish(times, breakTimes)
                    }, 50)
                }
                else if (times > breakTimes.second) {
                    setTimeout(function() {
                        MakeAWish(times, breakTimes)
                    }, 150)
                }
                else if (times > breakTimes.third) {
                    setTimeout(function() {
                        MakeAWish(times, breakTimes)
                    }, 400)
                }
                else {
                    setTimeout(function() {
                        MakeAWish(times, breakTimes)
                    }, 1000)
                }
            }
            else {
                var itemBoxID = "itemBox_" + boxLocation.x + "_" + boxLocation.y
                var itemBox = $("#" + itemBoxID).clone()
                $('#bingo_modal').find(".modal-body").html("")
                $('#bingo_modal').find(".modal-body").append(itemBox)
                $('#bingo_modal').modal("show")
                $('#myVideo')[0].pause()
                isSpinning = false
            }
        }

        function transFormToObj(form) {
            var obj = {}
            $.each(form.serializeArray(), function(i, item) {
                obj[item.name] = item.value
            })
            var itemListText = obj["itemList"]
            obj["itemList"] = itemListText.split("\n")

            return obj
        }

        function setCookie(key, obj) {
            var objStr = JSON.stringify(obj)
            Cookies.set(key, objStr)
        }

        function getCookie(key) {
            var objStr = Cookies.get(key)

            if (objStr) {
                return JSON.parse(objStr)
            }
            else {
                return false
            }
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
        $("body").on("click", "#spin", function() {
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

                //$('#bg_audio').trigger("play")
                $('#myVideo')[0].play()
                MakeAWish(result, breakTimes)
            }
        })

        $("body").on("click", "#open-settings", function() {
            $.each(settings, function(name, value) {
                if (name == "itemList") {
                    $("#settings_modal").find("textarea[name=" + name + "]").val(value.join("\n"))
                }
                else {
                    $("#settings_modal").find("input[name=" + name + "]").val(value)
                }
            })

            updateItemListCount(settings.itemList.length)
            $("#settings_modal").modal("show")
        })

        $("body").on("click", "#settings_save", function() {
            settings = transFormToObj($("#bingoSettings"))
            setCookie("settings", settings)
            DrawTable()
            $("#settings_modal").modal("hide")
        })

        $("body").on("click", "#settings_default", function() {
            Cookies.remove("settings")
            location.reload()
        })

        $("body").on("click", ".btnEditBoxText", function() {
            var itemBoxID = $(this).attr("data-box-id")
            var content = $('#' + itemBoxID + '_text').val()
            var fontSize = $('#' + itemBoxID + '_size').val()
            $("#" + itemBoxID).css("font-size", fontSize + "px")
            $("#" + itemBoxID).text(content)
            $("#" + itemBoxID).tooltip('hide')
        })

        $("body").on("change", "#item_list", function() {
            var itemListCount = $('#item_list').val().split("\n").length
            updateItemListCount(itemListCount)
        })
        
        $("body").on("click", "#clearCache", function() {
            Cookies.remove("settings")
            location.reload()
        })

        $(".navbar-brand").click(function() {
            if ($(".container-fluid").hasClass("bg-dark")) {
                $(".container-fluid").removeClass("bg-dark")
            }
            else {
                $(".container-fluid").addClass("bg-dark")
            }
        })

        $(window).resize(function() {
            DrawTable()
        })

        settings = getCookie("settings")
        console.log("Load settings (cookie): ", settings)
        if (!settings) {
            settings = transFormToObj($("#bingoSettings"))
            console.log("Load settings (form): ", settings)
        }

        DrawTable()
        addActive($("#itemBox_1_1"))

        $(".modal").modal({
            show: false,
            backdrop: "static"
        })

        $('#myVideo')[0].play()
        setTimeout(function() {
            $('#myVideo')[0].pause()
        }, 2000)

    }
    catch (err) {
        console.log(err)
        var text = "Find a problem！ You can click button name of 「Clear cache and reload」to fix it, It will 『reset settings to default』, or you can call Max！"
        $('#alert_modal').find(".modal-body p").text(text)
        $("#alert_modal").modal("show")
    }
})
