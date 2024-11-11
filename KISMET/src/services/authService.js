import axios from 'axios';

export async function login(username, password) {
  try {
    const response = await axios.get('http://localhost:3000/users', {
      params: {
        username,
        password
      }
    });

    // Verifica se o usuário existe
    if (response.data.length > 0) {
      return response.data[0]; 
    } else {
      throw new Error('Usuário ou senha inválidos');
    }
  } catch (error) {
    throw error;
  }
}
