// ==UserScript==
// @name         Tensorboard Utilities
// @namespace    http://jemonjam.com
// @version      1.2
// @description  Add customization options to the default Tensorboard UI
// @author       jemonjam
// @include      http*://localhost:6006*
// @include      http*://ec2-52-37-146-29.us-west-2.compute.amazonaws.com:6006*
// @updateURL    https://raw.githubusercontent.com/jacob-meacham/tensorboard-utilities/master/tensorboard-utilities.js
// @downloadURL  https://raw.githubusercontent.com/jacob-meacham/tensorboard-utilities/master/tensorboard-utilities.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var widths = [300, 500, 800, 1000]
var selectedWidth = GM_getValue('tensorboard_utils.width', 1)

function addSettingsPane() {
    var select_values = widths.map(function(val) {
        return val + 'px';
    });

    console.log($('#topRow').html())

    var pane = $('<div class="util-pane" />').appendTo('#topRow')
    $('<div class="util-header" />').text('Tensorboard Utilities').appendTo(pane)
    var inner = $('<div class="util-inner" />').appendTo(pane)

    $('<label for="util-selection" />').text('Width: ').appendTo(inner)
    var selector = $('<select name="util-selection" />')
    selector.appendTo(inner).change(function() { updateSelectedWidth(selector.val()) })
    for (var i = 0; i < select_values.length; i++) {
        var option = $('<option />', {value: i, text: select_values[i]}).appendTo(selector)
    }

    console.log(pane)

    selector.val(selectedWidth)
};

function updateSelectedWidth(selected_value) {
    selectedWidth = selected_value;
    GM_setValue('tensorboard_utils.width', selectedWidth)

    imageSizer(widths[selectedWidth], 0, 0, false)
}

function imageSizer(width, prevImagesFound, numNoopSteps, anyImagesFound) {
    window.setTimeout(function() {
        images = $('.image-cell')
        run_names = $('.run-name-cell')
        newImagesFound = images.length
        if (!anyImagesFound && newImagesFound > 0) {
            anyImagesFound = true
        }

        if (newImagesFound > prevImagesFound) {
            images.css({"width": width+"px", "height": "auto"})
            run_names.css({"width": width+"px"})
        } else if (anyImagesFound) {
            // Only consider this a noop step if images have been found.
            numNoopSteps++
        }

        if (numNoopSteps <= 5) {
            imageSizer(width, newImagesFound, numNoopSteps, anyImagesFound)
        }
    }, 1000)
}

$(document).ready(function() {
    GM_addStyle('.util-pane { float: right; padding: 3px; border: #ddd 1px solid; font-size: 0.8em; }' +
                '.util-header { padding-bottom: 5px; text-align: right }' +
                '.util-inner { padding: 10px; }'
               )

    addSettingsPane()
    imageSizer(widths[selectedWidth], 0, 0, false)
})
