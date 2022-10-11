const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const tags = $$('.tab-item');
const contents = $$('.tab-pane')

const tagsActive = $('.tab-item.active')
const line = $('.line')

line.style.left = tagsActive.offsetLeft + 'px'
line.style.width = tagsActive.offsetWidth + 'px'

tags.forEach((tag, index) => {
    const content = contents[index]

    tag.onclick = function(){
        $('.tab-item.active').classList.remove('active')
        $('.tab-pane.active').classList.remove('active')
        line.style.left = this.offsetLeft + 'px'
        line.style.width = this.offsetWidth + 'px'
        
        this.classList.add('active')
        content.classList.add('active')
    }
})