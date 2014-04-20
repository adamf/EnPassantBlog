var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var unplayableSquares = {}
var context;
var synths = [];
var volume;

function setupMusic() 
{
    context = new webkitAudioContext();
    volume = context.createGainNode();
    volume.gain.value = 0.5;
    volume.connect(context.destination);
    
    for(var i = 0; i < files.length; i++) {
        unplayableSquares[files[i] + '1'] = 1;
        unplayableSquares[files[i] + '2'] = 1;
        unplayableSquares[files[i] + '7'] = 1;
        unplayableSquares[files[i] + '8'] = 1;
    }
}


function playPosition(cur_move) {
    for (var i = 0; i < files.length; i++) {
        var sub_volume = context.createGainNode();
        sub_volume.gain.value = 0.5;
        sub_volume.connect(volume);
        synths[i] = context.createOscillator();
        synths[i].connect(sub_volume);
        synths[i].sub_volume = sub_volume;
    }
    playRankInFile(cur_move);
}

function playRankInFile(cur_move) {
    var cur_position = board.position();
    $('#status').text('file: ' + cur_file);
    for (var i = 1; i < 9; i++) {
        var cur_square = files[cur_file] + '' + i;
        if(cur_position[cur_square]) {
            if (unplayableSquares[cur_square] != 1) { 
                synths[i - 1].type = 0;
                synths[i - 1].sub_volume.gain.value = 1;
                synths[i - 1].frequency.value = 440;
                synths[i - 1].noteOn(0);
            }
        }
    }
    cur_file = cur_file + 1;
    if (cur_file < files.length) {
        setTimeout(function(){playRankInFile(cur_move);}, 200);
    } else {
        cur_file = 0;
        setTimeout(function(){ stopNotes(cur_move); }, 200);
    }
}

function stopNotes(cur_move) {
    for(var j = 0; j < files.length; j++) {
        if (typeof(synths[j]) != 'undefined') {
            synths[j].disconnect();
        }
    }
    playPosition(cur_move);

}
