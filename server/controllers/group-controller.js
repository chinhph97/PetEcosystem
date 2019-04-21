'use strict';

import {Group, User, Op, MemberGroup} from '../models';
import {Response} from '../helpers';
import {groupRepository, memberGroupRepository} from '../repositories';

export default class GroupController {

    getListActiveGroup = async (req, res, next) => {
        try {
            const memberGroups = await memberGroupRepository.getAll({
                where: {
                    userId: req.user.id
                },
                attributes: ['groupId']
            });
            const groupIds = memberGroups.map(item => item.groupId);
            const groups = await groupRepository
                .getAll(
                    {
                        where: {
                            id: groupIds
                        },
                        attributes: {
                            exclude: ['authorId']
                        },
                        order: [
                            ['createdAt', 'DESC']
                        ]
                    }
                );
            return Response.returnSuccess(res, groups);
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

    createGroup = async (req, res, next) => {
        let newGroup = null;
        try {
            const userLoginId = req.user.id;
            let {name, avatar, type, partnerId, memberIds} = req.body;
            if (!type) {
                return Response.returnError(res, new Error('type is required field'));
            }
            switch (type) {
                case 'private':
                    if (partnerId === undefined) {
                        return Response.returnError(res, new Error('Partner is required for private group'));
                    }
                    const existGroup = await groupRepository.getOne({
                        where: {
                            [Op.or]: [
                                {
                                    authorId: userLoginId,
                                    partnerId
                                },
                                {
                                    authorId: partnerId,
                                    partnerId: userLoginId
                                }
                            ]
                        }
                    });

                    if (existGroup) {
                        return Response.returnSuccess(res, existGroup);
                    }
                    memberIds = [userLoginId, partnerId];
                    break;
                case 'group':
                    if (memberIds === undefined || !Array.isArray(memberIds) || memberIds.length < 0) {
                        return Response.returnError(res, new Error('Member is invalid'));
                    }
                    if (!memberIds.includes(userLoginId)) {
                        memberIds[memberIds.length] = userLoginId;
                    }
                    break;
                default:
                    return Response.returnError(res, new Error('Type is invalid'));
            }
            newGroup = await groupRepository.create({
                name,
                avatar,
                type,
                authorId: userLoginId,
                partnerId
            });
            const memberGroup = memberIds.map(item => {
                return {
                    groupId: newGroup.id,
                    userId: item
                }
            });
            await memberGroupRepository.bulkCreate(memberGroup);
            const group = await groupRepository.getOne({
                where: {
                    id: newGroup.id
                }
            });
            return Response.returnSuccess(res, group);
        } catch (e) {
            if (newGroup) {
                groupRepository.delete({
                    force: true,
                    where: {
                        id: newGroup.id
                    }
                });
            }
            return Response.returnError(res, e);
        }
    };

}