let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'




// let items = [1, 2, 3]

async function loaditems() {
    console.log("Loading items...");
    let token = ''
    let res = await fetch(`${baseUrl}/courses` , {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    let json = await res.json()
        console.log('json:', json)
    }
    loaditems()


// console.log('items:', items)