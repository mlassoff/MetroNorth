var xmlhttp;
var blank = '<ul id="trainSchedWest" data-role="listview"><li data-role="list-divider">Westbound</li></ul><ul id="trainSchedEast" data-role="listview"><li data-role="list-divider">Eastbound</li></ul>';

window.onload=function()
{
    //document.addEventListener('deviceready', init, false);
    init();
}

function init()
{
    document.getElementById('btnNext').addEventListener('click', getTrains, false);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = processResult;
}

function getTrains()
{
    document.getElementById('content').innerHTML = blank;
    refreshLists();
    xmlhttp.open("GET", "https://mnorth.prod.acquia-sites.com/wse/gtfsrtwebapi/v1/gtfsrt/fbd480a2399276eb71b85c6c9dd6de92/getfeed", true);
    xmlhttp.send();   
}

function processResult()
{
    if(xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        var result = jQuery.parseJSON(xmlhttp.responseText);
        for(var x=0; x < result.entity.length; x++)
        {
            var trainNumber = result.entity[x].id;
            var stops = result.entity[x].trip_update.stop_time_update;
            
            if(stops != null && stops != "")
            {
                //Loop through stops to see if it stops in Westport
                //
                for(var y =0; y < stops.length; y++)
                {
                    //These Trains Stop in Westport
                    if(stops[y].stop_id == 134)
                    {
                        //Calculate Departure Time
                        var epTime = stops[y].departure.time
                        var departTime = new Date(0);
                        departTime.setUTCSeconds(epTime);
                        var hours = departTime.getHours();
                        if(hours > 12)
                        {
                            hours -= 12;   
                        }
                        
                        var mins = departTime.getMinutes()
                        if (mins < 10)
                        {
                            mins = "0" + mins;
                        } 
                        
                        departTime = hours + ":" + mins;
                        
                        //Where is the train going?
                        var dest = stops[stops.length-1].stop_id;
                        var direction;
                        if(dest > 134)
                        {
                            direction = "Eastbound";   
                        } else
                        {
                            direction = "Westbound";   
                        }
                        dest = stations[dest];
                        createOutput(trainNumber, departTime, dest, direction);
                        refreshLists();
                    }
                    }
                }
            }
        }
            
}
        
function refreshLists()
{
    $("#trainSchedWest").listview().listview('refresh'); 
    $("#trainSchedEast").listview().listview('refresh'); 
}

function createOutput(trainNum, departTime, dest, direction)
{
    
    if(direction == "Westbound")
    {
        var out = "<li><strong>"+ departTime + "</strong> Final Stop: " + dest + "<br/>";
        out += "<span class='small'>Train Number: " + trainNum + "</li>";
        document.getElementById('trainSchedWest').innerHTML += out;
    } else
    {
    
        var out = "<li><strong>"+ departTime + "</strong> Final Stop: " + dest + "<br/>";
        out += "<span class='small'>Train Number: " + trainNum + "</li>";
        document.getElementById('trainSchedEast').innerHTML += out;
    }
}
