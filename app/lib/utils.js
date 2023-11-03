import { getToken } from 'next-auth/jwt';
import { User } from './models';

const GetUserFromSession = async (req) => {
    const session = await getToken({ req })
    if (!session) {
        return null;
    }

    return await User.findOne({ email: session.email }).populate('role').select('-password');
}

const hasPermission = async (req, resource, action) => {
    const user = await GetUserFromSession(req);
    if (!user) {
        return false;
    }

    const resourcePermissions = user.role.resources.find(
        (res) => res.resource.toLowerCase() === resource.toLowerCase()
    );

    if (!resourcePermissions) {
        return false;
    }

    const { permission } = resourcePermissions;
    switch (action) {
        case 'read':
            return permission.read;
        case 'create':
            return permission.create;
        case 'update':
            return permission.update;
        case 'delete':
            return permission.delete;
        default:
            return false;
    }
}

export { GetUserFromSession, hasPermission };
