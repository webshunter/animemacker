const API_BASE_URL = '/api'; // Vite proxy will handle routing to backend

export const fetchCharacter = async () => {
  const response = await fetch(`${API_BASE_URL}/character`);
  if (!response.ok) {
    if (response.status === 404) return null; // No character found
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const saveCharacter = async (character: any) => {
  const response = await fetch(`${API_BASE_URL}/character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(character),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};


export const deleteCharacter = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/character/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchCreations = async () => {
  const response = await fetch(`${API_BASE_URL}/scenes`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const saveCreation = async (creation: any) => {
  const response = await fetch(`${API_BASE_URL}/scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creation),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deleteCreation = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/scenes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};