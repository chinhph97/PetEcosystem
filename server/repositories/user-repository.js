'use strict';

import BaseRepository from '../repositories/base-repository';
import Users from '../models/users-model'

export default class UserRepository extends BaseRepository {

	constructor() {
		super(Users);
	}

}
