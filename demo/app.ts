import {IonButton} from '@ionic/core/components/ion-button'
import {IonToast} from '@ionic/core/components/ion-toast'
import {IonList} from '@ionic/core/components/ion-list'


let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

// let items = [1, 2, 3]

declare var refreshButton: IonButton
refreshButton.addEventListener('click', loaditems)

declare var errorToast: IonToast

declare var courseList: IonList

declare var loadMoreButton: IonButton
loadMoreButton.addEventListener('click', loadMoreItems)



let skeletonItem = courseList.querySelector('.skeleton-item')!
skeletonItem.remove()

let page = 1


async function loaditems() {
    console.log("Loading items...")
    courseList.textContent=''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    let token = ''
    let params = new URLSearchParams()
    params.set('page', page.toString())
    let res = await fetch(`${baseUrl}/courses?${params})}` , {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    let json = await res.json()
            if(json.error){
            errorToast.message = json.error
            errorToast.present()
            courseList.textContent = ''
            return
        }
        errorToast.dismiss()

        type ServerItem = {
            category: string
            description: string
            id: number
            image_url: string
            item_id: number
            language: string
            level: string
            tags: string
            title: string
            video_url: string
    }
        let ServerItems =json.items as ServerItem[]
        let useditems = json.items.map((item: ServerItem) => {
            return {
                title: item.category,
                domin: item.language,
                level: item.level,
                description: item.description,
                tags: item.tags,
                imageUrl: item.image_url,
                videoUrl: item.video_url,    
            }
        })
        console.log('items:', useditems)

        courseList.textContent=''
        for(let item of useditems){
            let card = document.createElement('ion-card')
            card.innerHTML = `
           <ion-card-header>
            <ion-card-title>${item.title}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
        `
        
        courseList.appendChild(card)
        }
    }
    loaditems()

    function loadMoreItems(){
        page++
        loaditems()
    }


