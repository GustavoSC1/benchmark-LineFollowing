/* global webots, sendBenchmarkRecord, showBenchmarkRecord, showBenchmarkError */
$('#infotabs').tabs();

var benchmarkName = 'Line Following';
var timeString;
var roomCrossingTime;

// As funções wb_robot_window_send e wb_robot_wwi_send_text permitem que um controlador de robô envie uma mensagem para uma 
// função JavaScript em execução na janela do robô HTML. A mensagem é recebida usando o método 
// webots.window("<robot window name>").receive da API JavaScript do Webots.
webots.window('line_following').receive = function(message, robot) {
  if (message.startsWith('time:')) {
    roomCrossingTime = parseFloat(message.substr(5));
    timeString = parseSecondsIntoReadableTime(roomCrossingTime);
    $('#time-display').html(timeString);
  } else if (message === 'stop') {
    if (typeof sendBenchmarkRecord === 'undefined' || !sendBenchmarkRecord(robot, this, benchmarkName, -roomCrossingTime, metricToString))
      $('#time-display').css('color', 'red');
  } else if (message.startsWith('record:OK:')) {
    $('#time-display').css('font-weight', 'bold');
    showBenchmarkRecord(message, benchmarkName, metricToString);
  } else if (message.startsWith('record:Error:')) {
    $('#time-display').css('color', 'red');
    showBenchmarkError(message, benchmarkName);
  } else
    console.log("Received unknown message for robot '" + robot + "': '" + message + "'");

  function metricToString(s) {
    return parseSecondsIntoReadableTime(-parseFloat(s));
  }

  function parseSecondsIntoReadableTime(timeInSeconds) {
    var minutes = timeInSeconds / 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    var cs = Math.floor((seconds - absoluteSeconds) * 100);
    if (cs < 10)
      cs = '0' + cs;
    return m + ':' + s + ':' + cs;
  }
};
