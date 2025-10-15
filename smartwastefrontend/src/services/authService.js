import API from './api';

export const signUp = async (data) => {
    return await API.post('/auth/signup', data);
};

export const signIn = async (data) => {
    return await API.post('/auth/signin', data);
};
