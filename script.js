let btn = document.querySelector(".add-button")

let modalCont = document.querySelector('.modal-container')
let mainCont = document.querySelector('.main-container')
let colors = ["red","green","yellow","blue"]
let modalPriorityColor = colors[colors.length-1];
//by default setting note ka color to least priority wal ie blue for us

let allPriorityColors = document.querySelectorAll(".priority-color")

let taskAreaCont = document.querySelector('.textarea-container')

let removeBtn = document.querySelector('.remove-button')

let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'

let toolBoxColors = document.querySelectorAll('.color')

let ticketsArr = [];


//filter ticket wrt color
for(let i=0; i<toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener('click',function(e) {
        let currentToolBoxColor = toolBoxColors[i].classList[0];
        //0 because pehle red/tyellow hai phir color hai in class because likha aise hai class index.html
        
        let filteredTickets = ticketsArr.filter(function(ticketObj){
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        //REMOVE PREVIOUS TICKETS
        let allTickets = document.querySelectorAll(".ticket-container")

        for(let i=0; i<allTickets.length; i++){
            allTickets[i].remove();
        }


        //display filtered tickets
        filteredTickets.forEach(function(filteredObj){
            createTicket(filteredObj.ticketColor,filteredObj.ticketTask,filteredObj.ticketID, false);
        }) 

    })

    toolBoxColors[i].addEventListener('dblclick',function(e){
        let allTickets = document.querySelectorAll(".ticket-container")
        for(let i=0; i<allTickets.length; i++){
            allTickets[i].remove();
        }

        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.tickedID, false);
        })
    })

}

btn.addEventListener("click",function(e){
    //addFlag = true - display modal and addFlag = false - hide modal
    modalCont.style.display = 'flex'

})

//changing priority colors
allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click',function(e){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0];
    });
});



//generating ticket
modalCont.addEventListener('keydown',function(e){
    let key = e.key;

    if(key == "Enter"){
        createTicket(modalPriorityColor,taskAreaCont.value,undefined,true)
        modalCont.style.display = 'none'
        taskAreaCont.value = ""
    }
});

function createTicket(ticketColor, ticketTask, ticketID, createNew){
    // let id = ticketID || shortid(); //Dont geneate new if id akready exists
    let id = 0
    if (createNew) {
        id = shortid()
    } else {
        id = ticketID
    }

    //we are making ticket container basically
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class","ticket-container")
   
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area"> ${ticketTask}  </div>
    <div class="ticket-lock"> <i class = "fa-solid fa-lock"></i> </div>`

    
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleColor(ticketCont,id);
    handleLock(ticketCont,id);

    if(createNew){
        ticketsArr.push({ticketColor, ticketTask, ticketID:id})
        localStorage.setItem('tickets',JSON.stringify(ticketsArr))
        //expects name of content and actual content - in json format
    }
}

//removing ticket
removeFlag = false
removeBtn.addEventListener('click',function(){
    removeFlag = !removeFlag
    if (removeFlag){
        removeBtn.style.color = 'red'
    }
    else{
        removeBtn.style.color = '#382522'
    }
    
})

function handleRemoval(ticket,id){
    ticket.addEventListener('click',function(){
        if (!removeFlag) return;
        
        let idx = getTicketIdx(id);
        ticketsArr.splice(idx,1); //count just itself

        let strTicketArray = JSON.stringify(ticketsArr)
        localStorage.setItem('tickets',strTicketArray);
        ticket.remove();
        //delete it from local storage too

        
    })
}


//lock unlock tickets
function handleLock(ticket, id ){
    let ticketIdx = getTicketIdx(id)

    let ticketLockElem = ticket.querySelector(".ticket-lock");

    let ticketLock = ticketLockElem.children[0];

    let ticketTaskArea = ticket.querySelector('.task-area')

    ticketLock.addEventListener("click", function (e) {
        if (ticketLock.classList.contains(lockClass)) {
        ticketLock.classList.remove(lockClass);
        ticketLock.classList.add(unlockClass);
        ticketTaskArea.setAttribute('contenteditable' , 'true')
        

        } else {
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute('contenteditable' , 'false')
        }

        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem('tickets',JSON.stringify(ticketsArr))


    });


}

//handle color changing on unlock
function handleColor(ticket, id){
    let ticketColorBand = ticket.querySelector('.ticket-color')

    let ticketIdx = getTicketIdx(id)

    ticketColorBand.addEventListener('click',function(e){
        let currentTicketColor = ticketColorBand.classList[1];

        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor == color;
        })

        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx]

        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(newTicketColor);

        //modify new color in local strage
        ticketsArr[ticketIdx].ticketColor = newTicketColor
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    })

    
}


//IMPLEMENTING LOCAL STORAGE - done in create ticket - now getting all tickets from local storage
if(localStorage.getItem("tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("tickets"))
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID)
    })
}

//get idx of ticket - use it in removing icket form local storage once it is crossed
function getTicketIdx(id){
    let ticketIdx = ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}