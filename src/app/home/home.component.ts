import { Component } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
    ApiService,
    PagesData,
    People,
    UserData,
    SelectedPersonService
} from '../../services/app-api.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    showLoginModal: boolean = false;
    showCreateAndEditPeopleModal: boolean = false;
    showinsertAddressModal: boolean = false;
    showRegisterModal: boolean = false;
    showConfirmateModal: boolean = false;
    showEditPeopleModal: boolean = false;
    USER_NAME: string | null = '';
    selectedPersonName: string = '';
    selectedPerson: People | null = null;
    pagination: PagesData = {
        page: 0,
        pages: 0,
        data: []
    };

    constructor(
        private selectedPersonService: SelectedPersonService,
        private toastr: ToastrService,
        private apiService: ApiService
    ) {}

    async ngOnInit() {
        this.getPeople(this.pagination.page);
        this.USER_NAME = localStorage.getItem('USER_NAME');
    }

    async login(data: UserData) {
        const loginData = await this.apiService.login(data);
        const { token, username } = loginData;

        if (token) {
            localStorage.setItem('BEARER_TOKEN', token);
            localStorage.setItem('USER_NAME', username);
        }

        this.ngOnInit();
        this.closeModal();
        this.toastr.success('Successfully logged in');
    }

    async register(data: UserData) {
        await this.apiService.register(data);
        this.toastr.success('Successfully created in');
        this.closeModal();
        return this.openLoginModal();
    }

    async logout() {
        this.removeItemsLocalStorage();
    }

    async getPeople(page: number) {
        try {
            const people = await this.apiService.getPeople(page);
            this.pagination = {
                page: page,
                pages: people.pages,
                data: people.data
            };

            console.log(this.pagination);
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async createPerson(data: People) {
        try {
            const { name, gender, dateOfBirth, maritalStatus } = data;

            if (!name) {
                return this.errorToast('Fill in the Name field');
            }

            if (!gender) {
                return this.errorToast('Select a gender');
            }

            if (dateOfBirth.length == 0) {
                return this.errorToast('Select a birthday');
            }

            if (!maritalStatus) {
                return this.errorToast('Select a marital status');
            }

            await this.apiService.createPerson(data);

            this.closeModal();
            this.getPeople(this.pagination.page);
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async editPerson(data: People) {
        try {
            await this.apiService.editPerson(data);
            this.closeModal();
            this.getPeople(this.pagination.page);
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async deletePerson(people: People) {
        await this.apiService.deletePerson(people.id);
        this.closeModal();
        return await this.getPeople(this.pagination.page);
    }

    async insertAddress(data: any) {
        await this.apiService.insertAddress(data, this.selectedPerson!.id);
        this.closeModal();
        return await this.getPeople(this.pagination.page);
    }

    removeItemsLocalStorage() {
        localStorage.removeItem('USER_NAME');
        localStorage.removeItem('BEARER_TOKEN');
        window.location.reload();

        this.toastr.error('Logout', 'Toastr fun!');
    }

    openLoginModal() {
        this.showLoginModal = true;
    }

    openRegisterModal() {
        this.showRegisterModal = true;
    }

    openInsertAddressModal(personName: string, person: People) {
        this.selectedPersonName = personName;
        this.selectedPerson = person;
        this.showinsertAddressModal = true;
    }

    confirmModal() {
      if (!this.selectedPerson) return;
        this.deletePerson(this.selectedPerson);
    }

    closeModal() {
        this.selectedPersonService.setSelectedPerson({
            id: 0,
            name: '',
            gender: '',
            dateOfBirth: '',
            maritalStatus: '',
            createdAt: undefined,
            updatedAt: undefined,
            addresses: []
        });
        this.showLoginModal = false;
        this.showCreateAndEditPeopleModal = false;
        this.showRegisterModal = false;
        this.showinsertAddressModal = false;
        this.showConfirmateModal = false;
    }

    openPersonModal(person: People | undefined) {
        this.selectedPersonService.setSelectedPerson(person);
        this.showCreateAndEditPeopleModal = true;
    }

    errorToast(value: string) {
        this.toastr.error(value);
    }

    formatTime(date?: Date) {
        return moment(date).format('HH:mm:ss A');
    }

    formatDate(date?: Date) {
        return moment(date).format('YYYY-MM-DD');
    }

    sumNumbers(input: number, output: number) {
        console.log(Number(input) + Number(output));
        return Number(input) + Number(output);
    }
}
