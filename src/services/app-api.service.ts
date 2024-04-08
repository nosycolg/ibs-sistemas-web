import { Injectable } from "@angular/core";
const backend_endpoint = "http://localhost:3000"
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
    repeatedPassword?: string;
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
    results: People[];
}

export interface AddressesPagesData {
    page: number;
    pages: number;
    results: Addresses[];
}

@Injectable({
    providedIn: "root",
})
export class ApiService {
    removeToken() {
        localStorage.removeItem("USER_NAME");
        localStorage.removeItem("BEARER_TOKEN");
        window.location.reload();
    }

    getHeaders(
        token?: string | null,
        contentType?: string,
    ): Record<string, string> {
        const headers: Record<string, string> = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (contentType) {
            headers["Content-Type"] = contentType;
        }

        return headers;
    }

    async getPeople(
        page: number,
        category?: string,
        search?: string,
    ): Promise<PagesData> {
        const res = await fetch(
            `${backend_endpoint}/people?page=${page}&category=${category ? category : ""}&search=${search ? search : ""}`,
            {
                method: "GET",
                headers: this.getHeaders(undefined, "application/json"),
            },
        );

        if (res.status != 200) {
            throw new Error("GET_PEOPLE_ERROR");
        }

        return await res.json();
    }

    async register(data: UserData): Promise<UserData> {
        const res = await fetch(`${backend_endpoint}/register`, {
            method: "POST",
            headers: this.getHeaders(undefined, "application/json"),
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
        });

        if (res.status == 404) {
            throw new Error("USER_ALREADY_REGISTERED");
        }

        if (res.status == 409) {
            throw new Error("CREATE_A_STRONGER_PASSWORD");
        }

        if (res.status != 200) {
            throw new Error("REGISTER_USER_ERROR");
        }

        return await res.json();
    }

    async login(data: UserData): Promise<Login> {
        const res = await fetch(`${backend_endpoint}/login`, {
            method: "POST",
            headers: this.getHeaders(undefined, "application/json"),
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
        });

        if (res.status == 404) {
            throw new Error("USER_OR_PASSWORD_INVALID");
        }

        if (res.status != 200) {
            throw new Error("LOGIN_USER_ERROR");
        }

        return await res.json();
    }

    async createPerson(data: PersonData) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/person`, {
            method: "POST",
            headers: this.getHeaders(token, "application/json"),
            body: JSON.stringify(data),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("CREATE_PERSON_ERROR");
        }

        return await res.json();
    }

    async editPerson(data: People) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/person/${data.id}`, {
            method: "PUT",
            headers: this.getHeaders(token, "application/json"),
            body: JSON.stringify(data),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("EDIT_PERSON_ERROR");
        }

        return await res.json();
    }

    async getAddresses(
        id: number,
        page: number,
        category?: string,
        search?: string,
    ): Promise<AddressesPagesData> {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(
            `${backend_endpoint}/addresses/${id}?page=${page}&category=${category ? category : ""}&search=${search ? search : ""}`,
            {
                method: "GET",
                headers: this.getHeaders(token, "application/json"),
            },
        );

        if (res.status != 200) {
            throw new Error("GET_ADDRESSES_ERROR");
        }

        return await res.json();
    }

    async editAddress(data: Addresses) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/address/${data.id}`, {
            method: "PUT",
            headers: this.getHeaders(token, "application/json"),
            body: JSON.stringify(data),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("EDIT_ADDRESS_ERROR");
        }

        return await res.json();
    }

    async deleteAddress(id: number) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/address/${id}`, {
            method: "DELETE",
            headers: this.getHeaders(token, "application/json"),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("DELETE_ADDRESS_ERROR");
        }
    }

    async deletePerson(id: number) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/person/${id}`, {
            method: "DELETE",
            headers: this.getHeaders(token, "application/json"),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("DELETE_PERSON_ERROR");
        }
    }

    async searchCep(cep: string) {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: "GET",
            headers: this.getHeaders("", "application/json"),
        });

        if (res.status != 200) {
            throw new Error("SEARCH_CEP_ERROR");
        }

        return await res.json();
    }

    async insertAddress(data: any, id: number) {
        const token = localStorage.getItem("BEARER_TOKEN");

        const res = await fetch(`${backend_endpoint}/address/${id}`, {
            method: "POST",
            headers: this.getHeaders(token, "application/json"),
            body: JSON.stringify(data),
        });

        if (res.status == 401) {
            this.removeToken();
        }

        if (res.status != 200) {
            throw new Error("INSERT_ADDRESS_ERROR");
        }

        return await res.json();
    }
}
