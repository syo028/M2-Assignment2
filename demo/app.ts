// Using declare instead of imports to avoid TypeScript errors
// These components are loaded from the HTML file


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
    let res = await fetch(`${baseUrl}/courses?${params}` , {
        method: 'GET',
        headers: {Authorization: `Bearer ${token}`}
    })
    let json = await res.json() as Result
            if(json.error){
            errorToast.message = json.error
            errorToast.present()
            courseList.textContent = ''
            return
        }
        errorToast.dismiss()

        let maxPage = Math.ceil(json.pagination.total / json.pagination.limit)

        loadMoreButton.hidden = json.pagination.page >= maxPage

        type Result = {
            error:string
            items: ServerItem[]
            pagination:{
                page:number
                limit:number
                total:number
            }
        }

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
        let serverItems = json.items as ServerItem[]
        let uiItems = json.items.map((item: ServerItem) => {
            return {
                id: item.id,
                title: item.category,
                domin: item.language,
                level: item.level,
                description: item.description,
                tags: item.tags,
                imageUrl: item.image_url,
                videoUrl: item.video_url,    
            }
        })
        console.log('items:', uiItems)

        courseList.textContent=''
        for(let item of uiItems){
            let card = document.createElement('ion-card')
            card.innerHTML = `
            <ion-card style="width: 100%;">
              <div class="video-thumbnail">
                <img src="${item.imageUrl}" alt="${item.title}" class="course-image">
                <div class="play-button" onclick="openVideoModal('${item.videoUrl}', '${item.title}')">
                  <ion-icon name="play" color="light" size="large"></ion-icon>
                </div>
                <div class="favorite-button" id="fav-btn-${item.id}">
                  <ion-icon name="heart-outline"></ion-icon>
                </div>
              </div>
              <ion-card-content>
                <div class="course-details">
                  <div class="course-title">${item.category}</div>
                  <div class="course-meta">
                    <span>程式語言: Python 3.x</span>
                    <span>程度: ${item.level}</span>
                  </div>
                  <div class="course-description">
                    ${item.description}
                  </div>
                  <div class="tag-container">
                    ${item.tags.map(tag => 
                      `<ion-chip  data-type="${tag} onclick="filterByTag('${tag}')">${tag}</ion-chip>`
                    ).join('')}
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
        `
        
        courseList.appendChild(card)
        }
    }
    loaditems()

    function loadMoreItems() {
        page++
        loaditems()
    }


