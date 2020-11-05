let unFilteredTickets = ''
let filteredTickets = []




// Handlers

window.addEventListener('load', () => {
    // Add listener for filter button (the cheapest, the fastest)
    let priceButton = document.getElementById('buttonFilterPrice');
    let fastButton = document.getElementById('buttonFilterSpeed');

    priceButton.addEventListener('click', () => {
        if(!priceButton.classList.contains('cost-filter__button--active')) {
            priceButton.classList.add('cost-filter__button--active')
            fastButton.classList.remove('cost-filter__button--active')
            checkClickedTarget(unFilteredTickets)
        } 
    })

    fastButton.addEventListener('click', () => {
        if(!fastButton.classList.contains('cost-filter__button--active')) {
            fastButton.classList.add('cost-filter__button--active')
            priceButton.classList.remove('cost-filter__button--active')
            checkClickedTarget(unFilteredTickets)
        } 
    })



    // Add listener for aside filter buttons
    let filterItems = Array.from( document.getElementById('filter-items').children )

    filterItems.forEach(filterItem => {
        filterItem.lastElementChild.addEventListener('click', (e) => {
            let filterItems = Array.from( document.getElementById('filter-items').children ) 

            if (e.target.parentNode.classList.contains('filter__item--active')) {

                e.target.parentNode.classList.remove('filter__item--active')
                filterItems[0].classList.remove('filter__item--active')
                checkClickedTarget(unFilteredTickets)

            } else if(!e.target.parentNode.classList.contains('filter__item--active') && e.target.parentNode.children[0].id === "filterAll"){ 
                
                filterItems.forEach( element => {
                    element.classList.add('filter__item--active')
                })
                checkClickedTarget(unFilteredTickets)
           
            } else {
                e.target.parentNode.classList.add('filter__item--active')
                checkClickedTarget(unFilteredTickets)
            }

        })
    });
    
    // Get tickets from base
    getTickets()
})


function checkClickedTarget(tickets) {
    // Clean filtered array
    filteredTickets = []

    // Write tickets obtained from base 
    unFilteredTickets = tickets


    let filterItems = Array.from( document.getElementById('filter-items').children ) 
    let activesItems = []

    // Check which item was chlicked
    filterItems.forEach( element => {
        if(element.classList.contains('filter__item--active')) {
            activesItems.push(element.children[0].id)
        }

    })
  
    if(activesItems.length === 0) {
        filterTransfer(activesItems = null)
    } else {
        filterTransfer(activesItems)
    }
}


function filterTransfer(idFilter) {
    // Copy the origin ticket list and work only with copy
    let copyTickets = unFilteredTickets.slice()


    if(idFilter) {

        idFilter.forEach(id => {
            
            if(id === 'filterWOutTransf') {
                copyTickets.forEach(element => {
                    if(element.segments[0].stops.length === 0) {
                        filteredTickets.push(element)
                    }
                })
            }
        
            if(id === 'filterOneTrans') {
                copyTickets.forEach(element => {
                    if(element.segments[0].stops.length === 1) {
                        filteredTickets.push(element)
                    }
                })
            }
        
            if(id === 'filterTwoTrans') {
                copyTickets.forEach(element => {
                    if(element.segments[0].stops.length === 2) {
                        filteredTickets.push(element)
                    }
                })
            }
        
            if(id === 'filterThreeTrans') {
                copyTickets.forEach(element => {
                    if(element.segments[0].stops.length === 3) {
                        filteredTickets.push(element)
                    }
                })
            }

            if(id === 'filterAll') {
                filteredTickets = copyTickets
            }
        })
    }

    let buttonPrice = document.getElementById('buttonFilterPrice');

    if(buttonPrice.classList.contains('cost-filter__button--active') && filteredTickets.length !== 0) {

        sortTicketPrice(filteredTickets)
    } else if(filteredTickets.length !== 0){
        sortTicketSpeed(filteredTickets)
    }

    if(buttonPrice.classList.contains('cost-filter__button--active') && filteredTickets.length == 0) {
        sortTicketPrice(unFilteredTickets) 
    } else if(filteredTickets.length == 0){
        sortTicketSpeed(unFilteredTickets)
    }
}


function sortTicketPrice(tickets) {
    tickets.sort((a, b) => a.price - b.price)
    delPrevTickets()
    renderTicket(tickets)
}

function sortTicketSpeed(tickets) {
    tickets.sort((a, b) => a.segments[0].duration - b.segments[0].duration)
    delPrevTickets()
    renderTicket(tickets)
}

// Delete prev tickets
function delPrevTickets() {
    let ticketsBlock = document.getElementById('tickets-block')
    let tickets = Array.from(document.getElementsByClassName('ticket'));


    tickets.forEach(element => {
        ticketsBlock.removeChild(element)
    })

}



function tranformDate(tickets, index) {
    let departureTime = new Date(tickets.segments[index].date);
    

    let departureHours = '';
    let departureMinutes = '';

    // Get time start fly
    if(departureTime.getUTCHours().length === 1) {
        departureHours = "0" + departureTime.getUTCHours()
    } else {
        departureHours = departureTime.getUTCHours()
    }
 
    if(departureTime.getUTCMinutes().length === 1) {
        departureMinutes = "0" + departureTime.getUTCMinutes()
    } else {
        departureMinutes = departureTime.getUTCMinutes()
    }

    // Get time fly over
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
    console.log(tickets)
    for(i = 0; i < 5; i++) {
        // Convert price 
        let ticketPrice = (tickets[i].price).toString()
        let convertPrice = (ticketPrice.slice(0,2) + " " + ticketPrice.slice(2)).toString()
    

        // Convert ending
        let nameStopsForward = '';
    
        if(tickets[i].segments[0].stops.length === 1) {
            nameStopsForward = "пересадкa"
        } else if(tickets[i].segments[0].stops.length === 0){
            nameStopsForward = "пересадок"
        } else {
            nameStopsForward = "пересадки"
        }

        let nameStopsBack = '';
    
        if(tickets[i].segments[1].stops.length === 1) {
            nameStopsBack = "пересадкa"
        } else if(tickets[i].segments[1].stops.length === 0){
            nameStopsBack = "пересадок"
        } else {
            nameStopsBack = "пересадки"
        }

        // Structure of ticket
        let ticketCode = `
                            <div class="ticket__header">
                                <p class="ticket__header-price">${convertPrice} P</p>
                                <img src="img/S7 Logo.png" alt="Airline logo">
                            </div>
                            <div class="ticket__flight-forward flight-forward">
                                <div class="flight-forward__schedule flight-forward__item">
                                    <h3 class="flight-forward__title">${tickets[i].segments[0].origin} – ${tickets[i].segments[0].destination}</h3>
                                    <div class="flight-forward__subtitle">${tranformDate(tickets[i], 0)}</div></div> 
                                <div class="flight-forward__flight-time flight-forward__item">
                                    <h3 class="flight-forward__title">В пути</h3>
                                    <div class="flight-forward__subtitle">${renderTransferTime(tickets[i], 0)}</div></div>
                                <div class="flight-forward__transfer flight-forward__item ">
                                    <h3 class="flight-forward__title">${(tickets[i].segments[0].stops).length} ${nameStopsForward}</h3>
                                    <div class="flight-forward__subtitle">${(tickets[i].segments[0].stops).join(', ')}</div></div>
                            </div>

                            <div class="ticket__flight-back flight-back">
                                <div class="flight-back__schedule flight-forward__item">
                                    <h3 class="flight-back__title">${tickets[i].segments[1].origin} – ${tickets[i].segments[1].destination}</h3>
                                    <div class="flight-back__subtitle">${tranformDate(tickets[i], 1)}</div>
                                </div>
                                <div class="flight-back__flight-time flight-forward__item">
                                    <h3 class="flight-back__title">В пути</h3>
                                    <div class="flight-back__subtitle">${renderTransferTime(tickets[i], 1)}</div>
                                </div>
                                <div class="flight-back__transfer flight-forward__item">
                                    <h3 class="flight-back__title">${(tickets[i].segments[1].stops).length} ${nameStopsBack}</h3>
                                    <div class="flight-back__subtitle">${(tickets[i].segments[1].stops).join(', ')}</div>
                                </div>
                            </div>
                        `
    
        // Add ticket in ticketBox and we get it in 'currentTicket'
        let ticketBox = document.getElementById('tickets-block');
        ticketBox.appendChild(document.createElement('div')).classList.add('tickets__block-ticket', 'ticket')

        // Add id to current ticket
        let currentTicket = ticketBox.getElementsByClassName('ticket')[i]
        currentTicket.id = `ticket - ${i}`

        // Inner ticket
        currentTicket.innerHTML = ticketCode
    }
}








async function getTickets() {

    fetch('https://front-test.beta.aviasales.ru/search')
        .then(responce => responce.json()) 
        .then(data => {
            fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${data.searchId}`)
                .then(responce => {
                    if(responce.ok) {
                        return responce.json()
                    } else {
                        throw new Error('Server down')
                    }
                })
                .then(data => {
                    checkClickedTarget(data.tickets)
                })
                .catch(e => {
                    console.log('Error:' + e)
                    getTickets()
                })
                
    })
             
}


