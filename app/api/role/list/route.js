import dbConnect from '../../../lib/db';
import { Role, User } from '../../../lib/models';
import { hasPermission } from '../../../lib/utils';

export async function GET(req) {
    try {
        await dbConnect();

        if (!(await hasPermission(req, 'roles', 'read'))) {
            return Response.json('Você não tem permissão para requisitar este endpoint.', { status: 403 });
        }

        const roles = await Role.find({});

        // Use aggregation to count the number of users for each role
        const roleCounts = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Create a map to store the role counts
        const roleCountsMap = new Map();

        roleCounts.forEach((entry) => {
            const role = roles.find((r) => r._id.toString() === entry._id.toString());
            if (role) {
                const roleWithCount = { ...role.toObject(), users: entry.count };
                roleCountsMap.set(role.name, roleWithCount);
            }
        });

        // Convert the map to an array
        const roleCountsArray = Array.from(roleCountsMap.values());

        return Response.json({ roles: roleCountsArray });
    } catch (error) {
        return Response.json('Erro interno do servidor', { status: 500 });
    }
}