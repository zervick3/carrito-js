
const cards=document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templaCarrito = document.getElementById('template-carrito').content
const fragmet = document.createDocumentFragment()
let carrito = {}






document.addEventListener('DOMContentLoaded',()=>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
 
cards.addEventListener('click',(e)=>{
   addCarrito(e)
})

items.addEventListener('click',(e)=>{
    btnAccion(e)
})


const fetchData = async ()=>{
    try {
        const res =await fetch('/api.json')
        const data =await res.json()
          //console.log(data)
          pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data=>{
    
    data.forEach(producto =>{
        console.log(producto)
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragmet.appendChild(clone)
    })
    cards.appendChild(fragmet)
}

const addCarrito = (e) =>{
   // console.log(e.target)
   // console.log(e.target.classList.contains('btn-dark'))
   if(e.target.classList.contains('btn-dark')){
    //console.log(e.target.parentElement)
    setCarrito(e.target.parentElement)
   }

   e.stopPropagation()
}

const setCarrito = objeto =>{
    const producto ={
        id: objeto.querySelector('.btn-dark').dataset.id,
        title:objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
  // console.log(carrito)

   pintarCarrito()
}

const pintarCarrito = () =>{
    //console.log(carrito)
    items.innerHTML=''
    Object.values(carrito).forEach(producto => {
        templaCarrito.querySelector('th').textContent = producto.id
        templaCarrito.querySelectorAll('td')[0].textContent = producto.title
        templaCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templaCarrito.querySelector('.btn-info').dataset.id = producto.id
        templaCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templaCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templaCarrito.cloneNode(true)
        fragmet.appendChild(clone)
    })

    items.appendChild(fragmet)

    pintarfooter()

    localStorage.setItem('carrito',JSON.stringify(carrito))
}

const pintarfooter = () =>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML =`
        <th scope="row" colspan="5">Carrito Vacio - comience a comprar!</th>
        
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) =>  acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) =>  acc + cantidad * precio, 0)
   // console.log(nCantidad)
  //  console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragmet.appendChild(clone)
    footer.appendChild(fragmet)

    const btnVaciarCarrito =document.getElementById('vaciar-carrito')
    btnVaciarCarrito.addEventListener('click',() =>{
        carrito = {}
        pintarCarrito()
    })
}
//botones para descontar producto
const btnAccion = (e) =>{
    if(e.target.classList.contains('btn-info')){
       // console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
       // producto.cantidad = carrito[e.target.dataset.id].cantidad+1
       producto.cantidad++
       carrito[e.target.dataset.id]={...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}