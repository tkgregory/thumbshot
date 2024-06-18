import { fetchAuthSession } from 'aws-amplify/auth';

export async function isPro() {
    return getGroups().then((groups) => {
        return groups.includes('pro')
    })
}

async function getGroups() {
    return fetchAuthSession().then((session) => {
        return session.tokens?.idToken?.payload['cognito:groups'] as string[]
    })
}