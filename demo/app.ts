// Using declare instead of imports to avoid TypeScript errors
// These components are loaded from the HTML file


let baseUrl = 'https://dae-mobile-assignment.hkit.cc/api'

// let items = [1, 2, 3]

declare var refreshButton: IonButton
refreshButton.addEventListener('click', loaditems)

declare var errorToast: IonToast

declare var courseList: IonList

// *** 將 page 的宣告移到這裡 ***
let page = 1

// 新增分頁按鈕宣告
declare var prevPageButton: IonButton
declare var nextPageButton: IonButton

// 新增事件監聽
prevPageButton.addEventListener('click', previousPage)
nextPageButton.addEventListener('click', nextPage)

let skeletonItem = courseList.querySelector('.skeleton-item')!
skeletonItem.remove()

// *** 移除不再使用的 itemCardTemplate 相關程式碼 ***
// let itemCardTemplate = courseList.querySelector('.item-card-template')!
// itemCardTemplate.remove()


async function loaditems() {
    console.log("Loading items...")
    courseList.textContent=''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    let token = ''
    let params = new URLSearchParams()
    // *** 現在 page 應該已經被定義 ***
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
    prevPageButton.disabled = page <= 1
    nextPageButton.disabled = page >= maxPage

    type Result = {
        error:string
        items: Item[]
        pagination:{
            page:number
            limit:number
            total:number
        }
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
    let Items = json.items as Item[]
    console.log('items:', Items)

    courseList.textContent=''
    for(let item of Items) {
        let card = document.createElement('ion-card')
        card.innerHTML = `
        <ion-card style="width: 100%;">
          <div class="video-thumbnail">
            <img src="${item.image_url}" alt="${item.title}" class="course-image" style="width: 100%; height: 200px; object-fit: cover;">
            <div class="play-button" onclick="openVideoModal('${item.video_url}', '${item.title}')">
              <ion-icon name="play" color="light" size="large"></ion-icon>
            </div>
            <div class="favorite-button" id="fav-btn-${item.id}">
              <ion-icon name="heart-outline"></ion-icon>
            </div>
          </div>
          <ion-card-content>
            <div class="course-details">
              <div class="course-title">${item.title}</div>
              <div class="course-meta">
                <span>程式語言: ${item.language}</span>
                <span>程度: ${item.level}</span>
              </div>
              <div class="course-description">
                ${item.description}
              </div>
              <div class="tag-container">
                ${Array.isArray(item.tags) ? item.tags.map(tag => 
                  `<ion-chip outline data-type="${tag}">${tag}</ion-chip>`
                ).join('') : ''}
              </div>
            </div>
          </ion-card-content>
        </ion-card>
        `
        
        courseList.appendChild(card)

        // 為收藏按鈕添加點擊事件
        const favBtn = card.querySelector(`#fav-btn-${item.id}`)
        if (favBtn) {
            favBtn.addEventListener('click', (event) => {
                event.stopPropagation()
                const icon = favBtn.querySelector('ion-icon')
                if (icon) {
                    const isFavorite = icon.name === 'heart'
                    icon.name = isFavorite ? 'heart-outline' : 'heart'
                    favBtn.classList.toggle('active')
                    // 可以在這裡添加收藏相關的 API 調用
                }
            })
        }
    }
}

// 移除原本的 loadMoreItems 函數
// function loadMoreItems() {
//     page++
//     loaditems()
// }

// 新增分頁函數
function previousPage() {
    if (page > 1) {
        page--
        loaditems()
    }
}

function nextPage() {
    page++
    loaditems()
}


