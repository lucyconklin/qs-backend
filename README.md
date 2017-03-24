# Quantified Self API
___
This API handles Create Read Update and Delete for a foods table where each food has a name and calorie amount. You can fetch all foods stored in the database, see one food, add a new food, edit an existing food, or delete a food.

Designed to work with my [Quantified Self](https://github.com/Laszlo-JFLMTCO/QS_Starter_Kit) front end, this API is fully independent and sits on a postgres database.

## URL

* [Base URL](https://peaceful-plains-83998.herokuapp.com/) with additional documentation:
```
https://peaceful-plains-83998.herokuapp.com/
```

## Endpoints
* `GET` to `/api/all-foods/` returns a list of all foods as JSON
* `GET` to `/api/all-foods/:id` returns a single food record with that id as JSON
* `POST` to `/api/all-foods` will add a food to the database. See examples below for details on which attributes to include in the body of the request
* `PUT` to `/api/all-foods/:id` will edit a food. See examples below for details on which attributes to include in the body of the request
* `DELETE` to `/api/all-foods/:id` will delete the food record with that id.

## URL Params
Pass the id (if required) in through the url. Pass all other information in the body of your request.

## Success response
For `GET` and `PUT` requests to an :id and all `POST` requests, the success response will be the requested or new record.

For 'DELETE' requests you should see a message indicating that you have successfully deleted a record.

## Error response
Most endpoints will have helpful error messages. Usually this will occur when require params have not been included in the request.

## Sample Calls

Visit from your browser:
* [https://peaceful-plains-83998.herokuapp.com/api/all-foods](https://peaceful-plains-83998.herokuapp.com/api/all-foods)
* [https://peaceful-plains-83998.herokuapp.com/api/all-foods/1](https://peaceful-plains-83998.herokuapp.com/api/all-foods/1)

From your app:
```
$.ajax({
    url: API + '/api/all-foods',
    method: 'GET'
  })
```

## Current Progress
This is the first pass at CRUDing the entire API. Going further I would like to pull out the functions into an MVC pattern.

Next I would like to call this site from my Quantified Self front end.
