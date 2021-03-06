const express = require ('express')
const routes = express.Router ()

const HomeController = require ('../app/controllers/HomeController')

const users = require('./users')
const products = require('./products')
const cart = require('./cart')
const orders = require('./orders')

routes  
.get ('/', HomeController.index)

.use('/users', users)
.use('/products', products)
.use('/cart', cart)
.use('/orders', orders)



routes // Alias
.get ('/ads/create', (req, res) => {
	return res.redirect('/products/create')
})

.get ('/accounts', (req, res) => {
	return res.redirect('/users/login')
})

module.exports = routes