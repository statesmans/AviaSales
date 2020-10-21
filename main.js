let allTickets = ''




// Handlers

window.addEventListener('load', () => {
    let priceButton = document.getElementById('buttonFilterPrice');
    let fastButton = document.getElementById('buttonFilterSpeed');

    window.addEventListener('click', (e) => {
        // Sort to low-price
        if((e.target === priceButton) && !priceButton.classList.contains('cost-filter__button--active')) {
            e.target.classList.add('cost-filter__button--active')
            fastButton.classList.remove('cost-filter__button--active')
            sortTicketPrice(allTickets)
        } 

        // Sort to some fast ticket
        if((e.target === fastButton) && !fastButton.classList.contains('cost-filter__button--active')) {
            e.target.classList.add('cost-filter__button--active')
            priceButton.classList.remove('cost-filter__button--active')
            sortTicketFast(allTickets)
        } 
    })
})




function sortTicketPrice(tickets) {
    
    tickets.sort((a, b) => a.price - b.price)
    console.log(tickets)
    allTickets = tickets;
    renderTicket(tickets)
}

function sortTicketFast(tickets) {
    tickets.sort((a, b) => a.segments[0].duration - b.segments[0].duration)
    console.log(tickets)
    allTickets = tickets;
    renderTicket(tickets)
}

function tranformDate(tickets, index) {
    let departureTime = new Date(tickets.segments[index].date);
    

    let departureHours = '';
    let departureMinutes = '';



    // Получаем время отправки
    if(departureTime.getUTCHours().toString().length === 1) {
        departureHours = "0" + departureTime.getUTCHours()
    } else {
        departureHours = departureTime.getUTCHours()
    }
 
    if(departureTime.getUTCMinutes().toString().length === 1) {
        departureMinutes = "0" + departureTime.getUTCMinutes()
    } else {
        departureMinutes = departureTime.getUTCMinutes()
    }

    let endHours = Math.floor(tickets.segments[index].duration / 60) + departureTime.getUTCHours();
    let endMinutes = tickets.segments[index].duration % 60 + departureTime.getUTCMinutes();



    if(endMinutes >= 60) {
        endMinutes -= 60
        
        if(endMinutes <= 9) {
            endMinutes = '0' + endMinutes
        } 

        if(endHours <= 8) {
            endHours = '0' + (parseInt(endHours) + 1)
        } else {
            endHours =  parseInt(endHours) + 1
            
        }
    }

    if(endHours >= 24 ) {

        endHours = (endHours - (Math.floor(endHours / 24) * 24))

        if(endHours <= 9) {
            endHours = '0' + endHours
        } 
    }

     
    return (`${departureHours}:${departureMinutes} – ${endHours}:${endMinutes}`)
}



function renderTransferTime(tickets, index) {
    let endHours = Math.floor(tickets.segments[index].duration / 60);
    let endMinutes = `${tickets.segments[index].duration % 60}`;

    return (`${endHours}Ч ${endMinutes}М`)
}





function renderTicket(tickets) {
    let ticketBox = document.getElementById('tickets-block');


    for(i = 0; i < 5; i++) {
        // Превращаем цену нужный вид
        let ticketPrice = (tickets[i].price).toString()
        let convertPrice = (ticketPrice.slice(0,2) + " " + ticketPrice.slice(2)).toString()
    
        // Превращаем время в нужный формат
        
        let newDate = ';'

        // Lenght of stops 
        if(tickets[i].segments[0]) {

        }
        
    
        let nameStops = '';
    
        if(tickets[i].segments[0].stops.length === 1) {
            nameStops = "пересадкa"
        } else if(tickets[i].segments[0].stops.length === 0){
            nameStops = "пересадок"
        } else {
            nameStops = "пересадки"
        }

    
        let ticketCode = `<div class="tickets__block-ticket ticket">
                            <div class="ticket__header">
                                <p class="ticket__header-price">${convertPrice} P</p>
                                <img src="img/S7 Logo.png" alt="Airline logo">
                            </div>
                            <div class="ticket__flight-forward flight-forward">
                                <div class="flight-forward__schedule ">
                                    <h3 class="flight-forward__title">${tickets[i].segments[0].origin} – ${tickets[i].segments[0].destination}</h3>
                                    <div class="flight-forward__subtitle">${tranformDate(tickets[i], 0)}</div></div> 
                                <div class="flight-forward__flight-time">
                                    <h3 class="flight-forward__title">В пути</h3>
                                    <div class="flight-forward__subtitle">${renderTransferTime(tickets[i], 0)}</div></div>
                                <div class="flight-forward__transfer ">
                                    <h3 class="flight-forward__title">${(tickets[i].segments[0].stops).length} ${nameStops}</h3>
                                    <div class="flight-forward__subtitle">${(tickets[i].segments[0].stops).join(', ')}</div></div>
                            </div>

                            <div class="ticket__flight-back flight-back">
                                <div class="flight-back__schedule ">
                                    <h3 class="flight-back__title">${tickets[i].segments[1].origin} – ${tickets[i].segments[1].destination}</h3>
                                    <div class="flight-back__subtitle">${tranformDate(tickets[i], 1)}</div>
                                </div>
                                <div class="flight-back__flight-time">
                                    <h3 class="flight-back__title">В пути</h3>
                                    <div class="flight-back__subtitle">${renderTransferTime(tickets[i], 1)}</div>
                                </div>
                                <div class="flight-back__transfer">
                                    <h3 class="flight-back__title">${(tickets[i].segments[1].stops).length} ${nameStops}</h3>
                                    <div class="flight-back__subtitle">${(tickets[i].segments[1].stops).join(', ')}</div>
                                </div>
                            </div>
                        </div>`
    
          
        ticketBox.appendChild(document.createElement('div'))
        .innerHTML = ticketCode
}
}








async function getTickets() {
    let urlTicket = `https://front-test.beta.aviasales.ru/tickets?searchId=`

    fetch('https://front-test.beta.aviasales.ru/search')
        .then(responce => responce.json()) 
        .then(data => {
            fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${data.searchId}`)
                .then(responce => responce.json())
                .then(data => {
                    new sortTicketPrice(data.tickets)
                })
        })     
}


window.addEventListener('load', () => {
    getTickets()
})