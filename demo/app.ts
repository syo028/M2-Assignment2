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


let itemCardTemplate = courseList.querySelector('.item-card-template')!
itemCardTemplate.remove()

let token = localStorage.getItem('token')

declare var loginModal: HTMLIonModalElement
declare var successToast: IonToast

// 新增收藏相關函數
async function toggleFavorite(itemId: number) {
    const token = localStorage.getItem('token')
    if (!token) {
        loginModal.present()
        return false
    }

    try {
        const isFavorite = await checkIsFavorite(itemId)
        const url = `${baseUrl}/bookmarks/${itemId}`
        const method = isFavorite ? 'DELETE' : 'POST'
        
        const res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('收藏操作失敗')
        
        successToast.message = isFavorite ? '已取消收藏' : '已加入收藏'
        successToast.present()
        return !isFavorite
    } catch (error) {
        errorToast.message = error.message
        errorToast.present()
        return false
    }
}

async function checkIsFavorite(itemId: number): Promise<boolean> {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
        const res = await fetch(`${baseUrl}/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return false
        
        const data = await res.json()
        return data.item_ids.includes(itemId)
    } catch {
        return false
    }
}

async function loaditems() {
    console.log("Loading items...")
    courseList.textContent=''
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    courseList.appendChild(skeletonItem.cloneNode(true))
    
    let token = localStorage.getItem('token')
    
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
              }}
              loaditems()


        // 為收藏按鈕添加點擊事件
        let favBtn = card.querySelector(`#fav-btn-${item.id}`)

        if (favBtn) {
            // 檢查初始收藏狀態
            const initialFavorite = await checkIsFavorite(item.id)
            const icon = favBtn.querySelector('ion-icon')
            if (icon) {
                icon.name = initialFavorite ? 'heart' : 'heart-outline'
                favBtn.classList.toggle('active', initialFavorite)
            }

            favBtn.addEventListener('click', async (event) => {
                event.stopPropagation()
                const icon = favBtn.querySelector('ion-icon')
                if (icon) {
                    const newFavoriteState = await toggleFavorite(item.id)
                    icon.name = newFavoriteState ? 'heart' : 'heart-outline'
                    favBtn.classList.toggle('active', newFavoriteState)
                }
            })
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


declare var usernameInput: HTMLIonInputElement
declare var passwordInput: HTMLIonInputElement
declare var loginButton: HTMLIonButtonElement
declare var registerButton: HTMLIonButtonElement

loginButton.addEventListener('click', async () =>{
  await handleAuth('login')
})

registerButton.addEventListener('click', async () =>{
  await handleAuth('signup')
})

async function handleAuth(mode: 'signup' | 'login'){
let username = usernameInput.value
let password = passwordInput.value

let res = await fetch(`${baseUrl}/auth/${mode}`, {
  method: 'POST',
  body: JSON.stringify({ username, password }),
  headers: {
    'Content-Type': 'application/json',
  },
})
let json = await res.json()
if(json.error){
  errorToast.message = json.error
  errorToast.present()
  return
}
token = json.token
localStorage.setItem('token', json.token)
loginModal.dismiss()
}

