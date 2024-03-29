import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface People {
    id: number;
    name: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    addresses: {
        cep: string,
        street: string,
        city: string,
        state: string,
        country: string,  
    }[];
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    people: People[] = [];
    showLoginModal: boolean = false;
    showCreatePeopleModal: boolean = false;
    showRegisterModal: boolean = false;

    constructor() {}

    ngOnInit() {
        this.getPeople();
        console.log(this.people);
    }

    async getPeople(): Promise<void> {
        try {
            const res = await fetch(`http://localhost:9999/people`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch people data');
            }

            const data = await res.json();
            return (this.people = data);
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    openLoginModal() {
        this.showLoginModal = true;
    }

    openRegisterModal() {
        this.showRegisterModal = true;
    }

    openCreatePeopleModal() {
        this.showCreatePeopleModal = true;
    }

    closeModal() {
        this.showLoginModal = false;
        this.showCreatePeopleModal = false;
        this.showRegisterModal = false;
    }
}
