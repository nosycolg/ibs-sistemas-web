import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface People {
    id: number;
    name: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    createdAt?: Date;
    updatedAt?: Date;
    addresses: {
        cep: string;
        street: string;
        city: string;
        state: string;
        country: string;
    }[];
}

export interface Login {
    token: string;
    username: string;
}

export interface UserData {
    username: string;
    password: string;
}

export interface PersonData {
    name: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
}

export interface Addresses {
    id: number;
    cep: string;
    street: string;
    streetNumber: string;
    district: string;
    city: string;
    state: string;
    country: string;
    complement: string;
    createdAt?: Date;
    updatedAt?: Date;
    person: People;
}

export interface PagesData {
    page: number;
    pages: number;
    data: People[];
}

export interface AddressesPagesData {
    page: number;
    pages: number;
    data: Addresses[];
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor() {}

    getHeaders(
        token?: string | null,
        contentType?: string
    ): Record<string, string> {
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        return headers;
    }

    async getPeople(page: number): Promise<PagesData> {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                throw new Error('Invalid token');
            }

            const res = await fetch(
                `http://localhost:9999/people?page=${page}`,
                {
                    method: 'GET',
                    headers: this.getHeaders(token, 'application/json')
                }
            );

            if (res.status != 200) {
                throw new Error('Unexpected error on get people.');
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching people data:', error);
            throw new Error('Failed to fetch people data');
        }
    }

    async register(data: UserData): Promise<UserData> {
        const res = await fetch(`http://localhost:9999/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({
                username: data.username,
                password: data.password
            })
        });

        if (res.status != 200) {
            throw new Error('Unexpected error on get a user profile.');
        }

        return await res.json();
    }

    async login(data: UserData): Promise<Login> {
        const res = await fetch(`http://localhost:9999/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({
                username: data.username,
                password: data.password
            })
        });

        if (res.status != 200) {
            throw new Error('Unexpected error on get a user profile.');
        }

        return await res.json();
    }

    async createPerson(data: PersonData) {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                return;
            }

            const res = await fetch(`http://localhost:9999/person`, {
                method: 'POST',
                headers: this.getHeaders(token, 'application/json'),
                body: JSON.stringify(data)
            });

            if (res.status != 200) {
                throw new Error('Failed to fetch people data');
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async editPerson(data: People) {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                return;
            }

            const res = await fetch(`http://localhost:9999/person/${data.id}`, {
                method: 'PUT',
                headers: this.getHeaders(token, 'application/json'),
                body: JSON.stringify(data)
            });

            if (res.status != 200) {
                throw new Error('Failed to fetch people data');
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async getAddresses(id: number, page: number): Promise<AddressesPagesData> {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                throw new Error('Failed to fetch people data');
            }

            const res = await fetch(
                `http://localhost:9999/address/${id}?page=${page}`,
                {
                    method: 'GET',
                    headers: this.getHeaders(token, 'application/json')
                }
            );

            if (res.status != 200) {
                throw new Error('Failed to fetch people data');
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching people data:', error);
            throw new Error('Failed to fetch people data');
        }
    }

    async editAddress(data: Addresses) {
      try {
        const token = localStorage.getItem('BEARER_TOKEN');

        if (!token) {
            return;
        }

        const res = await fetch(`http://localhost:9999/address/${data.id}`, {
            method: 'PUT',
            headers: this.getHeaders(token, 'application/json'),
            body: JSON.stringify(data)
        });

        if (res.status != 200) {
            throw new Error('Failed to fetch people data');
        }

        return await res.json();
    } catch (error) {
        console.error('Error fetching people data:', error);
    }
    }

    async deleteAddress(id: number) {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                throw new Error('Failed to fetch people data');
            }

            const res = await fetch(`http://localhost:9999/address/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(token, 'application/json')
            });

            if (res.status != 200) {
                throw new Error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async deletePerson(id: number) {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                throw new Error('Failed to fetch people data');
            }

            const res = await fetch(`http://localhost:9999/person/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(token, 'application/json')
            });

            if (res.status != 200) {
                throw new Error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async searchCep(cep: string) {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: this.getHeaders('', 'application/json')
        });

        if (res.status != 200) {
            throw new Error('Failed to delete address');
        }

        return await res.json();
    }

    async insertAddress(data: any, id: number) {
        try {
            const token = localStorage.getItem('BEARER_TOKEN');

            if (!token) {
                return;
            }

            const res = await fetch(`http://localhost:9999/address/${id}`, {
                method: 'POST',
                headers: this.getHeaders(token, 'application/json'),
                body: JSON.stringify(data)
            });

            if (res.status != 200) {
                throw new Error('Failed to fetch people data');
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class SelectedPersonService {
    private selectedPersonSubject: BehaviorSubject<People | null> =
        new BehaviorSubject<People | null>(null);

    constructor() {}

    setSelectedPerson(person: People | undefined) {
        if (!person) return;
        this.selectedPersonSubject.next(person);
    }

    getSelectedPerson(): Observable<People | null> {
        return this.selectedPersonSubject.asObservable();
    }
}

@Injectable({
  providedIn: 'root'
})
export class SelectedAdressService {
  private selectedAddressSubject: BehaviorSubject<Addresses | null> =
      new BehaviorSubject<Addresses | null>(null);

  constructor() {}

  setSelectedAddress(address: Addresses | undefined) {
      if (!address) return;
      this.selectedAddressSubject.next(address);
  }

  getSelectedAddress(): Observable<Addresses | null> {
      return this.selectedAddressSubject.asObservable();
  }
}

