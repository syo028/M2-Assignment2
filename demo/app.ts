import {IonButton} from '@ionic/core/components/ion-button'
import {IonToast} from '@ionic/core/components/ion-toast'
import {IonList} from '@ionic/core/components/ion-list'


let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

// let items = [1, 2, 3]

declare var refreshButton: IonButton
refreshButton.addEventListener('click', loaditems)

declare var errorToast: IonToast

declare var courseList: IonList

async function loaditems() {
    console.log("Loading items...");
    let token = ''
    let res = await fetch(`${baseUrl}/courses` , {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    let json = await res.json()
            if(json.error){
            errorToast.message = json.error
            errorToast.present()

courseList.querySelectorAll('ion-skeleton-text').forEach(skeleton => {
    //skeleton.remove()
})

            return
        }
        type Item = {
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
        let items = json.items.map((item: Item) => {
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
        console.log('items:', items)    
    }
    loaditems()


