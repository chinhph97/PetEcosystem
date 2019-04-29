'use strict';

import {userController} from '../controllers';

module.exports = (app) => {
    app.route('/user/getAllUsers')
        .get(userController.getAllUser);
    app.route('/user/:id')
        .get(userController.getUserById);
    app.route('/user/create')
        .post(userController.createNewUser);
    app.route('/user/:id')
        .delete(userController.deleteUser);
    app.route('/user/:id')
        .put(userController.updateUser);
}