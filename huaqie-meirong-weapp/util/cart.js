class Cart {
    constructor() {
        this.products = []
    }
    addProduct(product) {
        let exist = false
        product.selected = true
        this.products.forEach(p => {
            if(p.productId == product.productId){
                p.count += product.count
                exist = true
            }
        })
        if(!exist){
            this.products.push(product)
        }
    }
    decProduct(productId, count) {
        this.products.forEach( (p, k) => {
            if(p.productId == productId){
                p.count -= count
                if(p.count <= 0)
                    this.products.splice(k, 1)
            }     
        })
    }
    removeProduct(productId) {
        this.products.forEach( (p, k) => {
            if(p.productId == productId)
                this.products.splice(k, 1)
        })
    }
    clear() {
        this.products = []
    }
    save( products ) {
        this.products = products
    }
    products() {
        return this.products
    }
    count() {
        let total = 0
        this.products.forEach(e => {
            total += e.count
        })
        console.log('====== cart total =====', total)
        return total
    }
}

const cart = new Cart()

export default cart