function addCharBlock(x, y) {
    $('.char-canvas')
        .append('<div class="char-blank" data-x="' + x + '" data-y="' + y + '">&nbsp;</div>');
}
function addCharCanvasBreak() {
    $('.char-canvas').append('<br />');
}

function focusCharBlockFromClick() {
    $('.char-blank').removeClass('selected');
    $(this).addClass('selected');
}
function focusCharBlock(x, y) {
    $('.char-blank').removeClass('selected');
    $('.char-blank[data-x="' + x + '"][data-y="' + y + '"]').addClass('selected');
}

function setCharacterForCurrentCharBlock(char) {
    $('.selected').html(char);
}

function getCharBlockChar(coordinates) {
    return $('.char-blank[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]').text();
}
function getCharArt() {
    var maxCoordinates = getMaxCoordinates();
    
    var charArt = '';
    
    for (var y = 0; y <= maxCoordinates.y; y++) {
        for (var x = 0; x <= maxCoordinates.x; x++) {
            charArt += getCharBlockChar({x: x, y: y});
        }
        charArt += '\n';
    }
    
    return charArt;
}

function charCanvasHasFocus() {
    return $('.selected').length > 0;
}

function getCurrentFocusCoordinates() {
    if (charCanvasHasFocus()) {
        var x = Number($('.selected').attr('data-x'));
        var y = Number($('.selected').attr('data-y'));
        
        return {
            x: x,
            y: y
        };
    }
    else {
        return null;
    }
}

function getMaxCoordinates() {
    var $charBlankLast = $('.char-blank').last();
    var x = Number($charBlankLast.attr('data-x'));
    var y = Number($charBlankLast.attr('data-y'));
    
    return {
        x: x,
        y: y
    };
}

function createCanvas(xElementCount, yElementCount) {
    var x, y;
    
    for (y = 0; y < yElementCount; y++) {
        for (x = 0; x < xElementCount; x++) {
            addCharBlock(x, y);
        }
        addCharCanvasBreak()
    }
}

function moveFocusUp() {
    if (charCanvasHasFocus()) {
        var currentFocusCoordinates = getCurrentFocusCoordinates();
        if (currentFocusCoordinates.y > 0) {
            currentFocusCoordinates.y--;
            focusCharBlock(currentFocusCoordinates.x, currentFocusCoordinates.y);
        }
    }
}
function moveFocusDown() {
    if (charCanvasHasFocus()) {
        var currentFocusCoordinates = getCurrentFocusCoordinates();
        var maxCoordinates = getMaxCoordinates();
        if (currentFocusCoordinates.y < maxCoordinates.y) {
            currentFocusCoordinates.y++;
            focusCharBlock(currentFocusCoordinates.x, currentFocusCoordinates.y);
        }
    }
}
function moveFocusLeft() {
    if (charCanvasHasFocus()) {
        var currentFocusCoordinates = getCurrentFocusCoordinates();
        if (currentFocusCoordinates.x > 0) {
            currentFocusCoordinates.x--;
            focusCharBlock(currentFocusCoordinates.x, currentFocusCoordinates.y);
        }
    }
}
function moveFocusRight() {
    if (charCanvasHasFocus()) {
        var currentFocusCoordinates = getCurrentFocusCoordinates();
        var maxCoordinates = getMaxCoordinates();
        if (currentFocusCoordinates.x < maxCoordinates.x) {
            currentFocusCoordinates.x++;
            focusCharBlock(currentFocusCoordinates.x, currentFocusCoordinates.y);
        }
    }
}

function keyPressHandler(e) {
    e.preventDefault();
    switch (e.key) {
        case "ArrowDown":
            moveFocusDown();
            break;
        case "ArrowRight":
            moveFocusRight();
            break;
        case "ArrowUp":
            moveFocusUp();
            break;
        case "ArrowLeft":
            moveFocusLeft();
            break;
        case "Backspace":
            setCharacterForCurrentCharBlock('&nbsp;');
            moveFocusLeft();
            break;
        case "Delete":
            setCharacterForCurrentCharBlock('&nbsp;');
            break;
        case "Enter":
            moveFocusDown();
            break;
        case " ":
            setCharacterForCurrentCharBlock('&nbsp;');
            moveFocusRight();
            break;
        default:
            if (e.which !== 0 && charCanvasHasFocus()) {
                setCharacterForCurrentCharBlock(String.fromCharCode(e.which));
                moveFocusRight();
            }
            break;
    }
}

function commonCharClick() {
    if (charCanvasHasFocus()) {
        setCharacterForCurrentCharBlock($(this).text());
        moveFocusRight();
    }
}

function setClipboardAttr() {
    $('.btn-copy').attr('data-clipboard-text', getCharArt());
}

function clearCanvas() {
    setTimeout(function() {
        var maxCoordinates = getMaxCoordinates();
        
        for (var y = 0; y <= maxCoordinates.y; y++) {
            for (var x = 0; x <= maxCoordinates.x; x++) {
                focusCharBlock(x, y);
                setCharacterForCurrentCharBlock('&nbsp;');
            }
        }
        focusCharBlock(0, 0);
    }, 0);
}

function setGridlines(gridDims) {
    setTimeout(function() {
        clearGridlines();
        var maxDims = getMaxCoordinates();
        for (var y = 0; y <= maxDims.y; y++) {
            for (var x = 0; x <= maxDims.x; x++) {
                if ((x + 1) % gridDims.x === 0) {
                    $('.char-blank[data-x="' + x + '"][data-y="' + y + '"]').addClass('border-right');
                }
                if ((y + 1) % gridDims.y === 0) {
                    $('.char-blank[data-x="' + x + '"][data-y="' + y + '"]').addClass('border-bottom');
                }
            }
        }
    }, 0);
}
function clearGridlines() {
    $('.char-blank').removeClass('border-right');
    $('.char-blank').removeClass('border-bottom');
}

function toggleGridlines() {
    if (this.is(':checked')) {
        setGridlines({x: 2, y: 2});
    }
    else {
        clearGridlines();
    }
}

$(function () {
    createCanvas(50, 15);
    
    (new Clipboard('.btn-copy'))
        .on('success', function (e) {
            $('.message-success').show();
            setTimeout(function() {
                $('.message-success').hide();
            }, 2000);
        });
    
    $('.char-canvas').on('click', '.char-blank', focusCharBlockFromClick);
    $('.common-char span').click(commonCharClick);
    $('.btn-copy').click(setClipboardAttr);
    $('.btn-clear').click(clearCanvas);
    $(document).keypress(keyPressHandler);
});