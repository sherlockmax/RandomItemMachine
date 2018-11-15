$(document).ready(function() {
    var settings = {
        trunsMin: 5,
        trunsMax: 8,
        itemList: [
            "一",
            "二",
            "三",
            "四",
        ],
    }
    var angleMap = {}
    var height = parseInt($(".container-fluid").height())
    var width = parseInt($(".container-fluid").width())
    var radius = height
    if (width < height) {
        radius = width
    }
    radius -= 20

    $(".box").height(radius + "px")
    $(".box").width(radius + "px")
    $(".box").css("line-height", radius + "px")
    $(".box").css("margin-top", (-1 * (radius / 2) + 30) + "px")
    $(".box").css("margin-left", (-1 * (radius / 2)) + "px")
    $(".box").css("background-size", radius / 4 + "px " + radius / 6 + "px")

    $("svg").height(radius + "px")
    $("svg").width(radius + "px")
    $("svg").css("margin-top", (-1 * (radius / 2) + 30) + "px")
    $("svg").css("margin-left", (-1 * (radius / 2)) + "px")

    function getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var isRotate = true
    var startAngle = -90

    function Spin() {
        if (isRotate) {
            isRotate = false
            var randAngle = getRand(0, 360)
            var randRound = getRand(settings.trunsMin, settings.trunsMax)
            console.log(settings.trunsMin, settings.trunsMax)
            var endAngle = startAngle + randAngle + (360 * randRound)
            $(".box").rotate({
                angle: startAngle,
                animateTo: endAngle,
                duration: 6000,
                easing: $.easing.easeInOutQuart,
                callback: function() {
                    startAngle = (endAngle + 90) % 360
                    isRotate = true
                    $('#myModal').find("#status").text(angleMap[startAngle])
                    $('#myModal').modal("show")
                }
            })
        }
    }

    $('#open-setting').click(function() {
        $('#modal-settings').modal("show")
    })
    
    $('body').on('click', '#settings_save', function(){
        console.log(settings)
        var modalSettings = $("#modal-settings")
        settings.trunsMin = parseInt(modalSettings.find("#turns_min").val())
        settings.trunsMax = parseInt(modalSettings.find("#turns_max").val())
        
        console.log(settings)
        modalSettings.modal("hide")
    })

    $("#spin").click(function() {
        Spin()
    })

    $("#reset").click(function() {
        if (isRotate) {
            isRotate = false
            var endAngle = -90
            $(".box").rotate({
                animateTo: endAngle,
                duration: 2000,
                easing: $.easing.easeInOutQuart,
                callback: function() {
                    startAngle = endAngle
                    isRotate = true
                }
            })
        }
    })

    $(".box").rotate({
        angle: startAngle
    })

    function drawPeice(radius) {
        var startAngle = 0;
        var perAngle = 360 / settings.itemList.length
        var textList = []
        $.each(settings.itemList, function(i, statusName) {
            var text = $('<text fill="black" style="writing-mode: tb;"></text>')
            var path = $('<path style="fill:#17a2b8; stroke:#fff; stroke-width:2;" />')
            var startAngle = i * perAngle
            var endAngle = (i + 1) * perAngle
            var cx = radius;
            var cy = radius;
            var r = radius;

            var x0 = cx + r * Math.cos(startAngle * Math.PI / 180);
            var y0 = cy - r * Math.sin(startAngle * Math.PI / 180);
            var x1 = cx + r * Math.cos(endAngle * Math.PI / 180);
            var y1 = cy - r * Math.sin(endAngle * Math.PI / 180);

            var x0Text = cx + r * Math.sin(startAngle * Math.PI / 180);
            var y0Text = cy - r * Math.cos(startAngle * Math.PI / 180);
            var x1Text = cx + r * Math.sin(endAngle * Math.PI / 180);
            var y1Text = cy - r * Math.cos(endAngle * Math.PI / 180);

            for (i = startAngle; i <= endAngle; i++) {
                angleMap[i] = statusName
            }

            $(path).attr("d", "M " + cx + "," + cy + " L " + x0 + "," + y0 + " A " + r + "," + r + " 0 0,0 " + x1 + "," + y1 + " Z")
            $('svg').append(path)

            $(text).attr("x", x0Text + ((x1Text - x0Text) / 2))
            $(text).attr("y", y0Text + ((y1Text - y0Text) / 2))
            //$(text).attr("transform", "rotate("+ (startAngle+((startAngle-deg))/2) +")")
            $(text).text(statusName)
            textList.push(text)
        })

        $.each(textList, function(i, item) {
            $('svg').append(item)
        })

        $(".container-fluid").html($(".container-fluid").html())
    }

    drawPeice(radius / 2)
})
