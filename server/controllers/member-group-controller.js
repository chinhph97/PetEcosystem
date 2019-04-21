'use strict';

import {Group, User} from '../models';
import {Response} from '../helpers';
import {memberGroupRepository, groupRepository} from '../repositories';

export default class GroupController {

    leaveGroup = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userLoginId = req.user.id;
            const group = await groupRepository.getOne({
                attribute: [],
                where: {
                    id,
                    type: 'group'
                }
            });
            if (!group) {
                return Response.returnError(res, new Error('You are trying to leave private group'));
            }
            await memberGroupRepository.delete({
                where: {
                    groupId: id,
                    userId: userLoginId
                }
            });
            return Response.returnSuccess(res, true);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

    inviteToGroup = async (req, res, next) => {
        try {
            const { invitedUserId } = req.body;
            const groupId = req.params.id;
            const memberGroup = await memberGroupRepository.getOne({
                where: {
                    groupId,
                    userId: invitedUserId
                },
                paranoid: false
            });
            if (!memberGroup) {
                await memberGroupRepository.create({
                    groupId,
                    userId: invitedUserId
                });
            } else if (memberGroup.deletedAt) {
                await memberGroupRepository.update(
                    {
                        deletedAt: null
                    },
                    {
                        where: {
                            id: memberGroup.id
                        },
                        paranoid: false
                    }
                );
            }
            return Response.returnSuccess(res, true);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

}