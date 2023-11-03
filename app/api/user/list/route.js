import dbConnect from '../../../lib/db';
import { User } from '../../../lib/models'
import { hasPermission } from '../../../lib/utils'

export async function GET(req) {

    await dbConnect();

    if (!(await hasPermission(req, 'users', 'read'))) {
        return Response.json('Você não tem permissão para requisitar este endpoint.', { status: 403 });
    }

    const users = await User.aggregate([
        {
            $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'roleData',
            },
        },
        {
            $addFields: {
                role: {
                    $arrayElemAt: ['$roleData.name', 0],
                },
            },
        },
        {
            $project: {
                roleData: 0,
                password: 0,
            },
        },
    ]);

    return Response.json({ results: users });
}