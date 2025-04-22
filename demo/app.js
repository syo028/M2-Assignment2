"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var baseUrl = 'https://dae-mobile-assignment.hkit.cc/api';
refreshButton.addEventListener('click', loaditems);
loadMoreButton.addEventListener('click', loadMoreItems);
var skeletonItem = courseList.querySelector('.skeleton-item');
skeletonItem.remove();
var page = 1;
function loaditems() {
    return __awaiter(this, void 0, void 0, function () {
        var token, params, res, json, maxPage, ServerItems, useditems, _i, useditems_1, item, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Loading items...");
                    courseList.textContent = '';
                    courseList.appendChild(skeletonItem.cloneNode(true));
                    courseList.appendChild(skeletonItem.cloneNode(true));
                    courseList.appendChild(skeletonItem.cloneNode(true));
                    courseList.appendChild(skeletonItem.cloneNode(true));
                    token = '';
                    params = new URLSearchParams();
                    params.set('page', page.toString());
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/courses?").concat(params), {
                            method: 'GET',
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    if (json.error) {
                        errorToast.message = json.error;
                        errorToast.present();
                        courseList.textContent = '';
                        return [2 /*return*/];
                    }
                    errorToast.dismiss();
                    maxPage = Math.ceil(json.pagination.total / json.pagination.limit);
                    loadMoreButton.hidden = json.pagination.page >= maxPage;
                    ServerItems = json.items;
                    useditems = json.items.map(function (item) {
                        return {
                            title: item.category,
                            domin: item.language,
                            level: item.level,
                            description: item.description,
                            tags: item.tags,
                            imageUrl: item.image_url,
                            videoUrl: item.video_url,
                        };
                    });
                    console.log('items:', useditems);
                    courseList.textContent = '';
                    for (_i = 0, useditems_1 = useditems; _i < useditems_1.length; _i++) {
                        item = useditems_1[_i];
                        card = document.createElement('ion-card');
                        card.innerHTML = "\n            <ion-card style=\"width: 100%;\">\n              <div class=\"video-thumbnail\">\n                <img src=\"".concat(item.imageUrl, "\" alt=\"").concat(item.title, "\" class=\"course-image\">\n                <div class=\"play-button\" onclick=\"openVideoModal('").concat(item.videoUrl, "', '").concat(item.title, "')\">\n                  <ion-icon name=\"play\" color=\"light\" size=\"large\"></ion-icon>\n                </div>\n                <div class=\"favorite-button\" id=\"fav-btn-").concat(item.id, "\">\n                  <ion-icon name=\"heart-outline\"></ion-icon>\n                </div>\n              </div>\n              <ion-card-content>\n                <div class=\"course-details\">\n                  <div class=\"course-title\">").concat(item.title, "</div>\n                  <div class=\"course-meta\">\n                    <span>\u7A0B\u5F0F\u8A9E\u8A00: Python 3.x</span>\n                    <span>\u7A0B\u5EA6: ").concat(item.level, "</span>\n                  </div>\n                  <div class=\"course-description\">\n                    ").concat(item.description, "\n                  </div>\n                  <div class=\"tag-container\">\n                    <ion-chip color=\"medium\" outline=\"true\" onclick=\"filterByTag('").concat(item.tags, "')\">\n                      ").concat(item.tags, "\n                    </ion-chip>\n                  </div>\n                </div>\n              </ion-card-content>\n            </ion-card>\n        ");
                        courseList.appendChild(card);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
loaditems();
function loadMoreItems() {
    page++;
    loaditems();
}
