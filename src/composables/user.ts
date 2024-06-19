import { fetchAuthSession } from 'aws-amplify/auth';

export async function isPro() {
    return getGroups().then((groups) => {
        return groups.includes('pro')
    })
}

async function getGroups() {
    return fetchAuthSession().then((session) => {
        const groups = session.tokens?.idToken?.payload['cognito:groups'] as string[]
        if (groups == undefined) {
            return []
        }
        return groups
    })
}