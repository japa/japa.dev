/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Content from 'App/Services/Content'
import Route from '@ioc:Adonis/Core/Route'

Route.on('404').render('errors/404')

/**
 * Handled by content module
 */
Route.get('*', async ({ request, response }) => {
  const { html, error } = await Content.render(request.url())

  if (error && error.includes('Unable to lookup')) {
    return response.redirect('/404')
  } else if (error) {
    return error
  } else {
    response.send(html)
  }
})
