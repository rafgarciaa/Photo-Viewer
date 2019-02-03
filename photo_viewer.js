const root = document.getElementById('root');
const pages = document.getElementById('pages');
const modal = document.getElementById('modal');
const overlay = document.createElement("div");
const photos = [];
const url = "https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=105ad9e0431961826a0f766cc7104954&gallery_id=66911286-72157692049980335&format=json&nojsoncallback=1";

fetch(url)
  .then(response => response.json())
  .then(data => photos.push(...data.photos.photo))
  .then(() => loadImages(0));

// img url format - https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
// sample image object - { "id": "8432423659", "owner": "37107167@N07", "secret": "dd1b834ec5", "server": "8187", "farm": 9, "title": "Color", "ispublic": 1, "isfriend": 0, "isfamily": 0, "is_primary": 1, "has_comment": 0 }
const loadImages = (idx) => {
    root.innerHTML = '';
    idx *= 10;
    for (let i = idx; i <= idx + 9; i++) {
        const photo = photos[i];
        const { farm, server, id, secret, title } = photo;
        const img = document.createElement("img");
        const imgSrc = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
        img.title = `${title}`;
        img.src = imgSrc;
        img.draggable = false;
        img.classList.add('thumb');
        img.addEventListener('click', () => showImgInModal(imgSrc));
        root.append(img);
    }
    pages.innerHTML = '';
    loadPageNums();
};

const loadPageNums = () => {
    const numPages = photos.length / 10;
    for (let i = 1; i <= numPages; i++) {
        const pageNum = document.createElement("div");
        pageNum.innerHTML = `${i}`;
        pageNum.addEventListener('click', () => handleClick(i));
        pageNum.dataset.pagenum = i;
        if (i === 1) { pageNum.classList.toggle('active'); } // toggles page 1 to be active on first page load OR refresh
        pages.append(pageNum);
    }
};

const handleClick = (i) => {
    loadImages(i - 1);
    const pageNodes = document.querySelector('#pages').childNodes;
    pageNodes.forEach((child) => child.classList.remove('active'));
    pageNodes[i - 1].classList.add('active');
};

const showImgInModal = (src) => {
    const imgInModal = document.querySelector('#img-modal');
    imgInModal.src = src;
    imgInModal.classList.add('img-modal');
    overlay.className = 'overlay';
    modal.classList.add('is-active');
    document.body.appendChild(overlay);
};