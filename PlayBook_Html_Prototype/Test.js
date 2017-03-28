//Z-Index for images. Field is at -1, so anything above starts at 0;
var z = 0;
//Tool Selector is global for the whole script (window.tool)
var tool = 0;

// This function shows which UI button is selected with the .active class. It shuts all of them off.
function toggleActive(element){
    var btns = document.getElementsByClassName("btn");
    for (var i=0; i<btns.length; i++){
        var btn = btns[i];

        btn.classList.remove("active");
    }
    element.classList.add('active');
}

//Changes the drag image based on whether cross or circle is selected. Color is unaffected.
function dragHandler(event){

    event.dataTransfer.setData("text", event.target.id);
}
function menuTool(event){
	
	return false;
}

/* These are the tool functions, which handles the logic behind what each tool is doing.*/
function dropTool(event){
// dropTool uses the HTML5 draggable property to automatically change the position of the element clicked. Sorts by z-index value
// CURRENT VERSION DOES NOT WORK ON LINES OR CURVES, WHICH ARE HTML5 CANVAS DRAWABLES INSTEAD OF HTML ELEMENTS
// Requires droppable element as payload, and ondropover needs event.preventDefault()
    event.preventDefault();
    var id = event.dataTransfer.getData("text");
    var x = event.clientX - 25;
    var y = event.clientY - 106;
	
   //console.log(x+": "+y+"-"+id);

    document.getElementById(id).style.marginLeft = x+"px";
    document.getElementById(id).style.marginTop = y+"px";


}
function crossTool(event, x, y){
// crossTool creates a cross image element and places it into the playContent <div>, then increments the z-index value.

    //console.log(x + ": " + y);

    var content = document.getElementById('playContent').innerHTML;

    var toAdd = "<img id='img"+z+"' draggable='false' src='images\\x.png' ondragstart='dragHandler(event)' style='color: black;position: absolute;margin-top: " + y +"px; margin-left: " + x + "px; z-index: "+ window.z + "' />";

    window.z++;
    document.getElementById('playContent').innerHTML = content + toAdd;

}
function circleTool(event, x, y){
// circleTool creates a circle image element and places it into the playContent div, then increments the z-index value.

        //console.log(x + ": " + y);

        var content = document.getElementById('playContent').innerHTML;

        var toAdd = "<img id='img"+z+"' draggable='false' src='images\\circle.png' ondragstart='dragHandler(event)' style='color: black;position: absolute;margin-top: " + y +"px; margin-left: " + x + "px; z-index: "+ window.z + "' />";

        window.z++;
        document.getElementById('playContent').innerHTML = content + toAdd;
}
function deleteTool(event, x, y){
// deleteTool finds the element with the largest z value under the cursor, and removes it.
    var matches = [];
    var content = document.getElementById("playContent").children;
        for (i=0; i < content.length; i++){
                var testX = Number(content[i].style.marginLeft.replace("px",""));
                var testY = Number(content[i].style.marginTop.replace("px",""));
                if (Math.abs(x-testX)<=25 && Math.abs(y-testY)<=25){
                    matches.push(content[i]);
                }
        }

    matches.sort(function(a, b){return b.style.zIndex-a.style.zIndex});
	
	if (matches.length > 0){
		document.getElementById("playContent").removeChild(matches[0]);
	}

}
/* Handler for all clicks on the field. Calls the individual tool functions based on the window.tool value.
 * THE MOUSE EVENT X AND Y VALUES ARE INACCURATE. I'VE COMPENSATED FOR THEM HERE, BUT I DON'T KNOW WHAT CAUSES IT.
 * (I suspect the error arises from a combination of the height of the page above the field, and the image being placed
 * in the top left of the click instead of the center) */
function fieldClick(event){

    var x = event.clientX - 25;
    var y = event.clientY - 106;

    switch (window.tool){
        case 1: crossTool(event, x, y);
                break;
        case 2: circleTool(event, x, y);
                break;
        case 3: deleteTool(event, x, y);
                break;
        default: ;
    }
}

//Handles whether or not dropping is possible. (Only while selectBtn is active)
function fieldDrag(event){
    if (window.tool == 0){
        event.preventDefault();
    }
}

//Individual button handling functions. Window.tool holds the currently selected tool as an integer.
function selectBtn(event){
    window.tool=0;
    toggleActive(event.currentTarget);
    setDrag();

}
function crossBtn(event){
    window.tool=1;
    toggleActive(event.currentTarget);
    unsetDrag();
}
function circleBtn(event){
    window.tool=2;
    toggleActive(event.currentTarget);
    unsetDrag();
}
function deleteBtn(event){
    window.tool=3;
    toggleActive(event.currentTarget);
    unsetDrag();
}

//Functions to set or unset draggable on all elements in playContent div. If redundant, does nothing.
function setDrag(){
    var playImages = document.getElementById("playContent").children;
        for (i=0; i < playImages.length; i++){
            playImages[i].setAttribute("draggable", "true");
        }
}
function unsetDrag(){
    var playImages = document.getElementById("playContent").children;
            for (i=0; i < playImages.length; i++){
                playImages[i].setAttribute("draggable", "false");
            }
}