var calendar
let lang = 'en';
let configurationCount =1;
document.addEventListener('DOMContentLoaded', function () {
 generateView()
});

$.i18n().load({
   en: 'locale/en.json',
   pl: 'locale/pl.json'
}).done( function() {
    $.i18n({
        // locale: 'pl'
        locale: lang
    });

        jQuery(document).ready(function() {
            var update_texts = function() {
                $('body').i18n()
            };
            $.i18n().load({
                en: 'locale/en.json',
                pl: 'locale/pl.json'
            });
            update_texts();


            $('.lang-switch').click(function(e) {
                e.preventDefault();
                $.i18n().locale = $(this).data('locale');
                lang  = $(this).data('locale');
                update_texts();
                generateView()


            });

        });

        // jQuery(document).ready(function() {

        // });
}
);

function generateView(){
    createCalendar()
    calendar.setOption('locale',  $(this).data('locale'));

    calendar.render();
    $("#no_buffer").change(function (){
        let buffer_inpt = $("#buffer_time");
        if(this.checked) {
            buffer_inpt.prop('readonly', true);
        } else {
            buffer_inpt.prop('readonly', false);

        }
    });

    $("#addConfiguration").click(function (){
        addConfigurationRow()
    })
    $("#removeConfiguration").click(function (){
        removeConfigurationRow()
    })
    $("#closeModal2, #closeModal1").click(function (){
        document.getElementById("configurationRows").innerHTML = "";
        calendar.unselect()
    });

    setTimePickerForBuffer("buffer_time",null)
    createEditDeleteListeners();

}
function createEditDeleteListeners(){
    $(".event-edit").click(function () {
        let id = $(this).attr("eventId");
        var chosenEvents = calendar.getEventById( id )
        console.log(chosenEvents);

        onEdit(chosenEvents)
    })
    $(".event-delete").click(function () {
        let id = $(this).attr("eventId");
        var chosenEvents = calendar.getEventById( id )
        console.log(chosenEvents);

        deleteEvent(id)
    })
}
function createCalendar(){
    var data = loadData();
    var themeSystem = 'bootstrap';

    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        themeSystem: themeSystem,
        // nowIndicator: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        slotMinTime: '07:00',
        slotMaxTime: '17:00',
        height: 'auto',
        locale: lang,
        // locale: 'pl',
        firstDay: '1',
        eventContent: {
            html: '<div class="fc-event-main">\n' +
                '  <div class="fc-event-main-frame">\n' +
                '    <div class="fc-event-buttons">' +
                '<div class="event-edit float-left"><i class="fas fa-edit"></i></div>' +
                '<div class="event-delete float-right"><i class="far fa-trash-alt"></i></div> ' +
                '</div>\n' +
                '    <div class="fc-event-title-container">\n' +
                '      <div class="fc-event-title fc-sticky"></div>\n' +
                '    </div>\n' +
                '    <div class="fc-event-time"></div>\n' +
                '  </div>\n' +
                '</div>'

        },
        dateClick: function (arg) {
            // onSelect(arg);

        },
        select: function (arg) {
            onSelect(arg);

        },
        eventConstraint:{
            start: '00:00',
            end: '24:00',
        },
        events: data,
        eventDidMount: function (info) {
            console.log(info.event._def.publicId);
            console.log(info.event.extendedProps);

            info.el.querySelector('.event-edit').setAttribute("eventId", info.event._def.publicId)
            info.el.querySelector('.event-delete').setAttribute("eventId", info.event._def.publicId)
            if (info.event.extendedProps.type == 'buffer'){
                let div = document.createElement('div');
                div.classList.add("fc-event-title")
                div.classList.add("fc-sticky")
                var name = document.createElement("span");

                name.innerText = info.event._def.title
                div.append(name);

                info.el.querySelector('.fc-event-main').innerHTML="";
                info.el.querySelector('.fc-event-main').append(div);

            } else {
                var name = document.createElement("span");
                name.innerText = info.event._def.title

                info.el.querySelector('.fc-event-time').innerText = info.timeText;
                info.el.querySelector('.fc-event-title').append(name);

                var pill = document.createElement("span");

                pill.classList.add("badge", "badge-pill");
                pill.innerText = info.event.extendedProps.type

                var fcevent = info.el.querySelector('.slot span.name'); // for gridView
                if (fcevent) {
                    fcevent.append(pill);
                }
            }
            createEditDeleteListeners();
        },
        eventClassNames: function (arg) {
            if (arg.event.extendedProps.type !== null) {
                return arg.event.extendedProps.type;
            }
        }
    });

}

function loadData() {
    return (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "data/events.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();
}

function onSelect(arg) {
    console.log(arg)

    let date =  arg.start.getDate() + "." + arg.start.getMonth() + "." + arg.start.getFullYear();
    let startHour = arg.start.getHours() + ":" + arg.start.getMinutes();
    let finishHour = arg.end.getHours() + ":" + arg.end.getMinutes();

    $('#timeSlotModal').on('show.bs.modal', function (event) {
        var modal = $(this)
        modal.find('#date').val(date)
    })


    setTimePicker("start_time", startHour);
    setTimePicker("finish_time", finishHour);
    $('#timeSlotModal').modal('show');


}

function onEdit(arg) {
    console.log(arg)


    let date =  arg.start.getDate() + "." + arg.start.getMonth() + "." + arg.start.getFullYear();
    let startHour = arg.start.getHours() + ":" + arg.start.getMinutes();
    let finishHour = arg.end.getHours() + ":" + arg.end.getMinutes();

    $('#timeSlotModal').on('show.bs.modal', function (event) {
        var modal = $(this)
        modal.find('#date').val(date)
        modal.find('#title').val(arg._def.title)
        modal.find('#choose_box').val(arg._def.extendedProps.choose_box)
        modal.find('#temperature').val(arg._def.extendedProps.temperature)
        modal.find('#temperature').val(arg._def.extendedProps.temperature)
        modal.find('#humidity').val(arg._def.extendedProps.humidity)
    })
    $.each(arg._def.extendedProps.configurationRows, function( index, value ) {
    //     alert( index + ": " + value.time + value.oxygen + value.altitude );
        addConfigurationRow(value);
    });

    setTimePickerForBuffer("buffer_time", arg._def.extendedProps.buffer_time);
    setTimePicker("start_time", startHour);
    setTimePicker("finish_time", finishHour);
    $('#timeSlotModal').modal('show');


}


// datapicker
// $('#start_time').datepicker({
//     format: 'mm/dd/yyyy',
//     startDate: '-3d'
// });


function setTimePicker(id, defaultTime){
    // recreate current element to apply new timepicker
    var element = document.getElementById(id);
    var clonedElement = element.cloneNode(true);
    var parentElement = element.parentNode;
    parentElement.replaceChild(clonedElement, element);

    $('#'+id).timepicker({
        timeFormat: 'H:mm',
        interval: 30,
        minTime: '8',
        maxTime: '16',
        defaultTime: defaultTime,
        startTime: defaultTime,
        dynamic: true,
        dropdown: true,
        scrollbar: true,
        zindex: 100000
    });
}

function setTimePickerForBuffer(id, defaultTime){
    var element = document.getElementById(id);
    var clonedElement = element.cloneNode(true);
    var parentElement = element.parentNode;
    parentElement.replaceChild(clonedElement, element);

    $('#'+id).timepicker({
        timeFormat: 'H:mm',
        interval: 5,
        minTime: '0',
        maxTime: '5',
        defaultTime: defaultTime,
        startTime: defaultTime,
        dynamic: true,
        dropdown: true,
        scrollbar: true,
        zindex: 100000
    });

}

function addConfigurationRow(data){
    let time = "";
    let altitude = "";
    let oxygen = "";
    if ((data !== null)  && (typeof data !== 'undefined') ){
         time = data.time;
         altitude = data.altitude;
         oxygen = data.oxygen;
    }
    let mainRow = document.getElementById("configurationRows");
    let row = document.createElement('div');
    row.classList.add('row');
    row.id = "configurationRow-"+configurationCount;
    mainRow.append(row);
    let div1 =  document.createElement("div");
    div1.classList.add("col-md-4");
    row.append(div1)
    let row1 =  document.createElement("div");
    row1.classList.add("row","form-group");
    div1.append(row1);
    let divLabel1 = document.createElement("div");
    divLabel1.classList.add("col-md-4");
    row1.append(divLabel1);
    let label1 = document.createElement('label');
    label1.setAttribute("for", "time"+configurationCount);
    label1.innerText =    $.i18n( 'time' );
    label1.setAttribute("data-i18n","time")
    divLabel1.append(label1);
    let divInput = document.createElement('div');
    divInput.classList.add("col-md-8");
    row1.append(divInput);
    let input1 = document.createElement('input');
    input1.type = 'text';
    input1.classList.add("form-control","timeChooser");
    input1.id ="time"+configurationCount;
    input1.name ="time"+configurationCount;
    input1.readOnly = true;
    divInput.append(input1);
    setTimePicker("time"+configurationCount, time)

    // altitude
    let div2 =  document.createElement("div");
    div2.classList.add("col-md-4");
    row.append(div2)
    let row2 =  document.createElement("div");
    row2.classList.add("row","form-group");
    div2.append(row2);
    let divLabel2 = document.createElement("div");
    divLabel2.classList.add("col-md-4");
    row2.append(divLabel2);
    let label2 = document.createElement('label');
    label2.setAttribute("for", "altitude"+configurationCount);
    label2.innerText =    $.i18n( 'altitude' );
    label2.setAttribute("data-i18n","altitude")
    divLabel2.append(label2);
    let divInput2 = document.createElement('div');
    divInput2.classList.add("col-md-8");
    row2.append(divInput2);
    let input2 = document.createElement('input');
    input2.type = 'number';
    input2.classList.add("form-control");
    input2.id ="altitude"+configurationCount;
    input2.name ="altitude"+configurationCount;
    input2.value =altitude;
    divInput2.append(input2);


    //o2
    let div3 =  document.createElement("div");
    div3.classList.add("col-md-4");
    row.append(div3)
    let row3 =  document.createElement("div");
    row3.classList.add("row","form-group");
    div3.append(row3);
    let divLabel3 = document.createElement("div");
    divLabel3.classList.add("col-md-2");
    row3.append(divLabel3);
    let label3 = document.createElement('label');
    label3.setAttribute("for", "oxygen"+configurationCount);
    label3.innerText =    $.i18n( 'oxygen' );
    label3.setAttribute("data-i18n","oxygen")
    divLabel3.append(label3);
    let divInput3 = document.createElement('div');
    divInput3.classList.add("col-md-4");
    row3.append(divInput3);
    let input3 = document.createElement('input');
    input3.type = 'number';
    input3.classList.add("form-control", "oxygen-input");
    input3.id ="oxygen"+configurationCount;
    input3.name ="oxygen"+configurationCount;
    input3.value = oxygen;

    divInput3.append(input3);
    let span = document.createElement('span');
    span.innerText = "%";
    span.classList.add("oxyger-percent")
    divInput3.append(span);

    configurationCount+=1;
}

function removeConfigurationRow(){
    configurationCount-=1;
    $("#configurationRow-"+configurationCount).remove()
}
function deleteEvent(id){

    console.log(id)

    $('#deleteModal').on('show.bs.modal', function (event) {
        var modal = $(this)
        modal.find('#delete-event').attr("data-event-id", id)
    })

    $('#deleteModal').modal('show');

    $("#delete-event").click(function (){
        let id = $(this).data("event-id");
        console.log("delete event id: ",id);
        location.reload();
    })
}

$(document).ready(function(){


});
