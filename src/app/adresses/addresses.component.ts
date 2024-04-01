import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import {
    AddressesPagesData,
    Addresses,
    ApiService,
    People,
    SelectedAdressService
} from '../../services/app-api.service';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrl: '../home/home.component.css'
})
export class AddressesComponent {
    USER_NAME: string | null = '';
    addresess: Addresses[] = [];
    showConfirmateModal: boolean = false;
    showEditModal: boolean = false;
    selectedAddress: Addresses = {
        id: 0,
        cep: '',
        street: '',
        streetNumber: '',
        district: '',
        city: '',
        state: '',
        country: '',
        complement: '',
        createdAt: undefined,
        updatedAt: undefined,
        person: {} as People
    };
    pagination: AddressesPagesData = {
        page: 0,
        pages: 0,
        data: []
    };

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private selectedAddressService: SelectedAdressService
    ) {}

    async ngOnInit() {
        await this.getAddresses(this.pagination.page);
        this.USER_NAME = localStorage.getItem('USER_NAME');
    }

    async getAddresses(page: number) {
        try {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            const data = await this.apiService.getAddresses(id, page);
            this.pagination = {
                page: page,
                pages: data.pages,
                data: data.data
            };
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    async editAddress(address: Addresses) {
        await this.apiService.editAddress(address);
        this.closeModal();
        return await this.getAddresses(this.pagination.page);
    }

    async deleteAddress(id: number) {
        try {
            await this.apiService.deleteAddress(id);
            this.closeModal();
            return await this.getAddresses(this.pagination.page);
        } catch (error) {
            console.error('Error fetching people data:', error);
        }
    }

    openEditModal(address: Addresses) {
        this.showEditModal = true;
        this.selectedAddressService.setSelectedAddress(address);
    }

    closeModal() {
        this.showConfirmateModal = false;
        this.showEditModal = false;
    }

    confirmModal() {
        this.deleteAddress(this.selectedAddress.id);
    }

    formatTime(date?: Date) {
        return moment(date).format('HH:mm:ss A');
    }

    formatDate(date?: Date) {
        return moment(date).format('YYYY-MM-DD');
    }
}
